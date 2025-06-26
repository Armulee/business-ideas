import NewPost from "@/components/new-post/new-ideas"
import Provider from "@/components/new-post/new-ideas/provider"

export default function NewPostPage() {
    return (
        <Provider>
            <section className='px-4 pt-28 pb-28'>
                <NewPost />
            </section>
        </Provider>
    )
}
