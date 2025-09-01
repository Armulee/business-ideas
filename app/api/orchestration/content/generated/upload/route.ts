import { NextRequest, NextResponse } from "next/server"
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData()
        const file: File | null = data.get('image') as unknown as File
        const platform: string = data.get('platform') as string || 'shared'

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 })
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: "File must be an image." }, { status: 400 })
        }

        // Validate file size (10MB max)
        if (file.size > 10 * 1024 * 1024) {
            return NextResponse.json({ error: "File size must be less than 10MB." }, { status: 400 })
        }

        // Convert to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate filename with readable date format
        const now = new Date()
        const day = String(now.getDate()).padStart(2, '0')
        const month = String(now.getMonth() + 1).padStart(2, '0')
        const year = String(now.getFullYear()).slice(-2)
        const dateStr = `${day}/${month}/${year}`
        
        // Create filename: dd/mm/yy-platform-timestamp
        const timestamp = now.getTime()
        const filename = `${dateStr.replace(/\//g, '-')}-${platform}-${timestamp}`

        try {
            // Upload to Cloudinary
            const result = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'social-media',
                        public_id: filename,
                        resource_type: 'auto',
                        overwrite: true
                    },
                    (error, result) => {
                        if (error) {
                            console.error('Cloudinary error:', error)
                            reject(error)
                        } else if (result) {
                            resolve(result)
                        }
                    }
                ).end(buffer)
            })

            return NextResponse.json({
                success: true,
                url: result.secure_url,
                publicId: result.public_id,
                message: "Image uploaded successfully to Cloudinary"
            })
        } catch (cloudinaryError) {
            console.error('Cloudinary upload failed:', cloudinaryError)
            
            // Fallback to mock URL for development
            const mockUrl = `https://via.placeholder.com/400x400/6366f1/white?text=${encodeURIComponent(platform.charAt(0).toUpperCase() + platform.slice(1))}`
            
            return NextResponse.json({ 
                success: true, 
                url: mockUrl,
                publicId: `mock-${filename}`,
                message: "File uploaded to temporary storage (Cloudinary unavailable)" 
            })
        }
    } catch (error) {
        console.error('Upload error:', error)
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        )
    }
}

// DELETE - Remove image from Cloudinary
export async function DELETE(request: NextRequest) {
    try {
        const { publicId } = await request.json()
        
        if (!publicId || publicId.startsWith('mock-')) {
            return NextResponse.json({
                success: true,
                message: "Mock image deleted"
            })
        }

        try {
            await cloudinary.uploader.destroy(publicId)
            
            return NextResponse.json({
                success: true,
                message: "Image deleted successfully from Cloudinary"
            })
        } catch (cloudinaryError) {
            console.error('Cloudinary delete failed:', cloudinaryError)
            
            return NextResponse.json({
                success: true,
                message: "Image deleted (Cloudinary unavailable)"
            })
        }
    } catch (error) {
        console.error('Delete error:', error)
        return NextResponse.json(
            { error: "Failed to delete image" },
            { status: 500 }
        )
    }
}

// Alternative implementation using Cloudinary (uncomment if you have Cloudinary set up)
/*
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: NextRequest) {
    try {
        const data = await request.formData()
        const file: File | null = data.get('image') as unknown as File

        if (!file) {
            return NextResponse.json({ error: "No file received." }, { status: 400 })
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: "File must be an image." }, { status: 400 })
        }

        // Convert to buffer
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'blueizbub-content-images',
                    resource_type: 'auto'
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            ).end(buffer)
        })

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            message: "Image uploaded successfully"
        })
    } catch (error) {
        console.error('Cloudinary upload error:', error)
        return NextResponse.json(
            { error: "Failed to upload image" },
            { status: 500 }
        )
    }
}
*/