import Profile from "@/database/Profile"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
    try {
        const data = await req.json()

        if (!data) {
            return NextResponse.json({ message: "Error" }, { status: 400 })
        }

        const {
            id,
            avatar,
            bio,
            facebook,
            instagram,
            linkedin,
            location,
            name,
            website,
            x,
        } = data
        const updatedProfile = await Profile.findByIdAndUpdate(id, {
            avatar,
            name,
            bio,
            location,
            website,
            socialMedias: {
                facebook,
                instagram,
                linkedin,
                x,
            },
        })

        await updatedProfile.save()

        return NextResponse.json("Updated Succesfully", { status: 200 })
    } catch (err) {
        console.error(err)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
