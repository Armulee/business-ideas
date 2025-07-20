import axios from "axios"

export const getPost = async (id: string, slug: string) => {
    const response = await axios.get(`/api/post/${id}`)

    // Handle slug mismatch - replace URL without reload
    if (slug !== response.data.slug) {
        const currentPath = window.location.pathname
        const newPath =
            currentPath.substring(0, currentPath.lastIndexOf("/")) +
            "/" +
            response.data.slug
        window.history.replaceState(null, "", newPath)
    }

    return response.data
}

export const getRawComments = async (postId: string) => {
    const response = await axios.get(`/api/post/${postId}/comments`)

    return response.data
}
