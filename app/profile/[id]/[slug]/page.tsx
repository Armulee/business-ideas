import Profile from "@/components/profile"

export default async function UserProfilePage({
    params,
}: {
    params: Promise<{ id: string; slug: string }>
}) {
    try {
        const { id, slug } = await params

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/profile/${id}/${slug}`,
            {
                cache: "no-store", // Ensure fresh data on each request
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to fetch post data: ${response.statusText}`)
        }

        const data = await response.json()

        // If the slug is outdated, Next.js should handle redirection
        const encodedName = encodeURIComponent(data.profile.name?.toLowerCase())
        if (data && slug !== encodedName) {
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
