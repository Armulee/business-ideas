import EditProfile from "@/components/profile/edit"

export default async function EditProfilePage({
    params,
}: {
    params: Promise<{ id: string; slug: string }>
}) {
    try {
        const { id } = await params

        return <EditProfile id={id} />
    } catch (err) {
        return (
            <div>
                Sorry, something went wrong. <br />
                Reason: {(err as Error).message}
            </div>
        )
    }
}
