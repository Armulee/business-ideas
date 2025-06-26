"use client"

import type React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import EditForm from "./form"
import axios from "axios"
import Loading from "@/components/loading"
import { useSession } from "next-auth/react"
import useSWR from "swr"

export interface ProfileData {
    name: string | undefined
    avatar: string | undefined
    bio: string | undefined
    profileId: number
    location: string | undefined
    website: string | undefined
    socialMedias: {
        facebook: string | undefined
        instagram: string | undefined
        x: string | undefined
        linkedin: string | undefined
    }
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data)

export default function EditProfile({ id }: { id: string }) {
    const { data: profileData } = useSWR(`/api/profile/full/${id}`, fetcher, {
        revalidateIfStale: false,
        revalidateOnFocus: false,
    })
    const { data: session, status } = useSession()

    if (status !== "loading" && session?.user.profile !== Number(id)) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                Unauthorized, you have no permission to enter this link
            </div>
        )
    }

    if (profileData) {
        return (
            <div className='container mx-auto max-w-xl px-4 pt-24 pb-32'>
                {/* <h1 className='text-3xl font-bold mb-4 text-white'>
                    Edit Profile
                </h1> */}
                <div className='mx-auto'>
                    <Card className='glassmorphism bg-transparent'>
                        <CardHeader>
                            <CardTitle className='text-white text-xl'>
                                Edit Your Profile
                            </CardTitle>
                            <CardDescription className='text-gray-300'>
                                Make changes to your profile information here.
                                Click save when you&apos;re done.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <EditForm profileData={profileData} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        )
    } else if (profileData === undefined) {
        return (
            <div className='w-full h-screen flex items-center justify-center'>
                Sorry, Something went wrong
            </div>
        )
    } else if (profileData === null) {
        return <Loading />
    }
}
