"use client"

import type React from "react"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EditForm from "./form"
import { useEffect, useState } from "react"
import { IProfilePopulated } from "@/database/Profile"
import axios from "axios"
import Loading from "@/components/loading"
import { useSession } from "next-auth/react"

export default function EditProfile({ id }: { id: string }) {
    const [profileData, setProfileData] = useState<
        IProfilePopulated | null | undefined
    >(null)
    useEffect(() => {
        async function setupProfileData() {
            const { data, status } = await axios.get(`/api/profile/full/${id}`)
            if (status === 200) {
                setProfileData(data)
            } else {
                setProfileData(undefined)
            }
        }

        setupProfileData()
    }, [id])

    const { data: session, status } = useSession()
    if (status !== "loading" && session?.user.profile !== parseInt(id)) {
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
                    <Card className='bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg shadow-xl'>
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
                            <Tabs defaultValue='basic' className='w-full'>
                                <TabsList className='grid w-full grid-cols-2 mb-8 text-white bg-white/30'>
                                    <TabsTrigger value='basic'>
                                        Basic Information
                                    </TabsTrigger>
                                    <TabsTrigger value='social'>
                                        Social Links
                                    </TabsTrigger>
                                </TabsList>

                                <EditForm
                                    profileData={profileData}
                                    setProfileData={setProfileData}
                                />
                            </Tabs>
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
