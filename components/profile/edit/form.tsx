import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { usePathname, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { IProfilePopulated } from "@/database/Profile"
import { TabsContent } from "@/components/ui/tabs"
import EditAvatar from "./basic/avatar"
import EditName from "./basic/name"
import EditBio from "./basic/bio"
import { profileFormSchema, ProfileFormValues } from "./types"
import EditLocation from "./basic/location"
import EditWebsite from "./socials/website"
import EditFacebook from "./socials/facebook"
import EditInstagram from "./socials/instagram"
import EditX from "./socials/x"
import EditLinkedin from "./socials/linkedin"
import axios from "axios"
import React from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"

const EditForm = ({
    profileData,
    setProfileData,
}: {
    profileData: IProfilePopulated
    setProfileData: React.Dispatch<
        React.SetStateAction<IProfilePopulated | null | undefined>
    >
}) => {
    const router = useRouter()
    const pathname = usePathname()
    const { data: session } = useSession()

    // Initialize form with default values
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: profileData.name,
            bio: profileData.bio,
            location: profileData.location,
            website: profileData.website,
            facebook: profileData.socialMedias.facebook,
            instagram: profileData.socialMedias.instagram,
            x: profileData.socialMedias.x,
            linkedin: profileData.socialMedias.linkedin,
            avatar: profileData.avatar,
        },
    })

    // Form submission handler
    const onSubmit = async (data: ProfileFormValues) => {
        setProfileData(null)
        // In a real app, you would upload the avatar file and save the form data
        const { status } = await axios.patch("/api/profile", {
            id: session?.user.id,
            ...data,
        })

        if (status === 200) {
            router.push(pathname.replace("/edit", ""))
            // Show success toast
            toast("Profile updated", {
                description: "Your profile has been updated successfully.",
            })
        }
        // console.log("Avatar file:", avatarFile)

        // Redirect back to profile page
        // router.push("/profile")
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <TabsContent value='basic' className='space-y-6'>
                    {/* Avatar */}
                    <EditAvatar
                        defaultAvatar={profileData.avatar}
                        defaultName={profileData.name}
                        control={form.control}
                    />
                    {/* Name */}
                    <EditName control={form.control} />
                    {/* Bio */}
                    <EditBio
                        defaultBio={profileData.bio}
                        control={form.control}
                    />
                    {/* Email */}
                    {/* <EditEmail control={form.control} /> */}
                    {/* Location */}
                    <EditLocation
                        defaultLocation={profileData.location}
                        control={form.control}
                    />
                </TabsContent>

                <TabsContent value='social' className='space-y-6'>
                    {/* Website */}
                    <EditWebsite control={form.control} />
                    {/* Facebook */}
                    <EditFacebook control={form.control} />
                    {/* Instagram */}
                    <EditInstagram control={form.control} />
                    {/* X */}
                    <EditX control={form.control} />
                    {/* LinkedIn */}
                    <EditLinkedin control={form.control} />
                </TabsContent>

                <div className='flex justify-end space-x-4 pt-4'>
                    <Link href={pathname.replace("/edit", "")}>
                        <Button
                            type='button'
                            variant='outline'
                            className='text-white bg-white/20 border-0 hover:bg-white hover:text-blue-600 transitions-color duration-500 ease'
                        >
                            Cancel
                        </Button>
                    </Link>
                    <Button
                        type='submit'
                        className='bg-blue-600 hover:bg-white hover:text-blue-600'
                    >
                        Save Changes
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export default EditForm
