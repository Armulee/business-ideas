import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import { NextResponse, NextRequest } from "next/server"

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData()
        const fileEntry = formData.get("file")
        const postIdEntry = formData.get("postId")

        if (!fileEntry) {
            return NextResponse.json(
                { error: "No file provided" },
                { status: 400 }
            )
        }

        if (!postIdEntry) {
            return NextResponse.json(
                { error: "No postId provided" },
                { status: 400 }
            )
        }

        // Check if the fileEntry is a string (which means it's not a file)
        if (typeof fileEntry === 'string') {
            return NextResponse.json(
                { error: "Invalid file format. Received string instead of file." },
                { status: 400 }
            )
        }

        // At this point, TypeScript knows it's a File object
        const file = fileEntry as File
        const postId = postIdEntry.toString()

        // Convert file to buffer
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Determine resource type based on file type
        const fileType = file.type
        let resourceType: "image" | "video" | "raw" = "raw"

        if (fileType.startsWith("image/")) {
            resourceType = "image"
        } else if (fileType.startsWith("video/")) {
            resourceType = "video"
        }

        // Generate a unique filename
        const timestamp = Date.now()
        const extension = file.name.split('.').pop() || 'file'
        const fileName = `${file.name.replace(/\.[^/.]+$/, "")}_${timestamp}.${extension}`

        // Upload to Cloudinary with postId-based folder structure
        const result: UploadApiResponse | undefined = await new Promise(
            (resolve, reject) => {
                cloudinary.uploader
                    .upload_stream(
                        {
                            folder: `bluebizhub/posts/${postId}`,
                            public_id: fileName.replace(/\.[^/.]+$/, ""), // Remove extension for public_id
                            resource_type: resourceType,
                            transformation:
                                resourceType === "image"
                                    ? [
                                          { quality: "auto:good" },
                                          { fetch_format: "auto" },
                                      ]
                                    : undefined,
                        },
                        (error, result) => {
                            if (error) return reject(error)
                            resolve(result)
                        }
                    )
                    .end(buffer)
            }
        )

        if (!result) {
            return NextResponse.json(
                { error: "Upload failed" },
                { status: 500 }
            )
        }

        return NextResponse.json({
            url: result.secure_url,
            publicId: result.public_id,
            resourceType: result.resource_type,
            format: result.format,
            width: result.width,
            height: result.height,
            duration: result.duration, // for videos
        })
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const publicId = searchParams.get("publicId")
        const postId = searchParams.get("postId")
        const resourceType = searchParams.get("resourceType") as
            | "image"
            | "video"
            | "raw"

        if (postId) {
            // Delete entire folder for a post
            try {
                const folderPath = `bluebizhub/posts/${postId}`
                
                // Delete all resources in the folder
                const deleteResult = await cloudinary.api.delete_resources_by_prefix(
                    folderPath,
                    { resource_type: "image" }
                )
                
                // Also delete video resources
                await cloudinary.api.delete_resources_by_prefix(
                    folderPath,
                    { resource_type: "video" }
                )
                
                // Delete the folder itself
                await cloudinary.api.delete_folder(folderPath)
                
                return NextResponse.json({
                    success: true,
                    deleted: deleteResult.deleted,
                    message: `Deleted folder for post ${postId}`,
                })
            } catch {
                console.error("Error deleting folder")
                return NextResponse.json({
                    success: false,
                    error: "Failed to delete folder",
                }, { status: 500 })
            }
        } else if (publicId) {
            // Delete single file
            if (!publicId) {
                return NextResponse.json(
                    { error: "No public ID provided" },
                    { status: 400 }
                )
            }

            // Delete from Cloudinary
            const result = await cloudinary.uploader.destroy(publicId, {
                resource_type: resourceType || "image",
            })

            return NextResponse.json({
                success: result.result === "ok",
                result: result.result,
            })
        } else {
            return NextResponse.json(
                { error: "Either publicId or postId must be provided" },
                { status: 400 }
            )
        }
    } catch {
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}
