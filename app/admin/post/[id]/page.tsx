import AdminPostDetails from "@/components/admin/post/post-details"

export default async function AdminPostDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params

    return <AdminPostDetails postId={id} />
}
