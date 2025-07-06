import Profile from "@/components/profile"
import { getProfileHeader } from "@/lib/get-profile"

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ id: string; slug: string }>
}) {
    try {
        const { id, slug } = await params

        // Get only profile header data for immediate rendering
        const data = await getProfileHeader(id)

        // If the slug is outdated, Next.js should handle redirection
        const encodedName = encodeURIComponent(
            data.profile.name?.toLowerCase() ?? ""
        )

        console.log(data)

        // If the slug is outdated, Next.js should handle redirection
        if (data.profile && slug !== encodedName) {
            return <Profile correctSlug={`/profile/${id}/${encodedName}`} />
        }

        return <Profile initialData={data} profileId={id} />
    } catch (err) {
        return (
            <Profile
                error={`Sorry! We cannot find this profile, it may be not existed or deleted. ${
                    (err as Error).message
                }`}
            />
        )
    }
}
