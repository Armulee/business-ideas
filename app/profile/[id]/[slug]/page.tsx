import Profile from "@/components/profile"
import getProfile from "@/lib/get-profile"

export default async function ProfilePage({
    params,
}: {
    params: Promise<{ id: string; slug: string }>
}) {
    try {
        const { id, slug } = await params

        const data = await getProfile(id)

        // If the slug is outdated, Next.js should handle redirection
        const encodedName = encodeURIComponent(
            data.profile.name?.toLowerCase() ?? ""
        )

        // If the slug is outdated, Next.js should handle redirection
        if (data.profile && slug !== encodedName) {
            return <Profile correctSlug={`/profile/${id}/${encodedName}`} />
        }

        return <Profile data={data} />
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
