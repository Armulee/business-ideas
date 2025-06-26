import { Button } from "@/components/ui/button"
import { Form } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { usePathname } from "next/navigation"
import { useForm } from "react-hook-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import React, { useMemo } from "react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { ProfileData } from "."

const EditForm = ({ profileData }: { profileData: ProfileData }) => {
    const pathname = usePathname()
    const { data: session } = useSession()

    // Initialize form with default values
    const defaultValues = useMemo(
        () => ({
            name: profileData.name,
            bio: profileData.bio,
            location: profileData.location,
            website: profileData.website,
            facebook: profileData.socialMedias.facebook,
            instagram: profileData.socialMedias.instagram,
            x: profileData.socialMedias.x,
            linkedin: profileData.socialMedias.linkedin,
            // we’ll handle avatar separately, so don’t include it here
        }),
        [profileData]
    )
    const form = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues,
    })

    // Form submission handler
    // const { mutate } = useSWRConfig()
    const onSubmit = async (values: ProfileFormValues) => {
        if (!session?.user.profile) return

        console.log(values)
        try {
            const data = new FormData()
            data.append("name", values.name)
            data.append("profileId", session.user.profile.toString())
            if (values.bio) data.append("bio", values.bio)
            if (values.location) data.append("location", values.location)
            if (values.website) data.append("website", values.website)
            if (values.facebook) data.append("facebook", values.facebook)
            if (values.instagram) data.append("instagram", values.instagram)
            if (values.linkedin) data.append("linkedin", values.linkedin)
            if (values.x) data.append("x", values.x)
            if (values.avatar) data.append("avatar", values.avatar)

            // In a real app, you would upload the avatar file and save the form data
            const { status } = await axios.patch("/api/profile", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })

            if (status === 200) {
                window.location.reload()
            }
        } catch (err) {
            const error = (err as Error).message
            // Show error toast
            toast("Error updating profile", {
                description: `Error: ${
                    error || "There was an error updating your profile."
                }`,
            })
        }
    }

    return (
        <Tabs defaultValue='basic' className='w-full'>
            <TabsList className='grid w-full grid-cols-2 mb-8 text-white bg-white/30'>
                <TabsTrigger value='basic'>Basic Information</TabsTrigger>
                <TabsTrigger value='social'>Social Links</TabsTrigger>
            </TabsList>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='space-y-8'
                >
                    <TabsContent value='basic' className='space-y-6'>
                        {/* Avatar */}
                        <EditAvatar
                            formError={form.setError}
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
                            disabled={
                                !form.formState.isDirty ||
                                form.formState.isSubmitting
                            }
                            className={`bg-blue-600 hover:bg-white hover:text-blue-600 ${
                                (!form.formState.isDirty ||
                                    form.formState.isSubmitting) &&
                                "opacity-50 cursor-not-allowed"
                            }`}
                        >
                            {form.formState.isSubmitting
                                ? "Submitting..."
                                : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Form>
        </Tabs>
    )
}

export default EditForm
