import Profile from "@/database/Profile"
import { v2 as cloudinary, UploadApiResponse } from "cloudinary"
import { NextResponse, NextRequest } from "next/server"

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function PATCH(req: NextRequest) {
    try {
        const formData = await req.formData()
        const {
            name,
            bio,
            profileId,
            avatar,
            facebook,
            instagram,
            linkedin,
            x,
            website,
            location,
        } = Object.fromEntries(formData) as Record<string, string | Blob>

        // upload avtar image to cloudinary
        let avatarUrl: string | undefined
        if (avatar && avatar instanceof Blob) {
            const arrayBuffer = await avatar.arrayBuffer()
            const buffer = Buffer.from(arrayBuffer)

            const result: UploadApiResponse | undefined = await new Promise(
                (resolve, reject) => {
                    cloudinary.uploader
                        .upload_stream(
                            {
                                folder: `bluebizhub/profileAvatar`,
                                public_id: profileId as string, // you choose a naming scheme
                                overwrite: true,
                                resource_type: "image",
                            },
                            (error, result) => {
                                if (error) return reject(error)
                                resolve(result)
                            }
                        )
                        .end(buffer)
                }
            )

            avatarUrl = result?.secure_url
        }

        // patch update from user edited profile
        const setOps: Record<string, unknown> = { name }
        if (avatarUrl) setOps.avatar = avatarUrl
        if (bio) setOps.bio = bio
        if (location) setOps.location = location
        if (website) setOps.website = website
        if (facebook) setOps["socialMedias.facebook"] = facebook
        if (instagram) setOps["socialMedias.instagram"] = instagram
        if (linkedin) setOps["socialMedias.linkedin"] = linkedin
        if (x) setOps["socialMedias.x"] = x

        const unsetOps: Record<string, ""> = {}
        if (!bio) unsetOps.bio = ""
        if (!location) unsetOps.location = ""
        if (!website) unsetOps.website = ""
        if (!facebook) unsetOps["socialMedias.facebook"] = ""
        if (!instagram) unsetOps["socialMedias.instagram"] = ""
        if (!linkedin) unsetOps["socialMedias.linkedin"] = ""
        if (!x) unsetOps["socialMedias.x"] = ""

        // 3️⃣ combine into a single update
        const update: Record<string, unknown> = {}
        if (Object.keys(setOps).length) update.$set = setOps
        if (Object.keys(unsetOps).length) update.$unset = unsetOps

        await Profile.findOneAndUpdate({ profileId }, update)

        return NextResponse.json("Updated Succesfully", { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
