// import { NextRequest, NextResponse } from "next/server"

// export async function middleware(req: NextRequest) {
//     const url = req.nextUrl
//     const pathname = url.pathname // e.g., /post/123 or /post/123/some-title

//     // Match URLs like /post/[id] but NOT /post/[id]/[slug]
//     const match = pathname.match(/^\/post\/([^\/]+)\/?$/)
//     if (match) {
//         const id = match[1] // Extract ID
//         const post = await (await fetch(`${url.origin}/api/post/${id}`)).json()

//         if (post) {
//             const correctSlug = post.slug
//             const newUrl = `${url.origin}/post/${id}/${correctSlug}`
//             return NextResponse.redirect(newUrl)
//         }
//     }

//     return NextResponse.next() // Continue if no match
// }

// export const config = {
//     matcher: "/post/:id*", // Apply middleware only for /post/[id] routes
// }

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const pathSegments = pathname.split("/").filter(Boolean) // Split into segments

    // Detecting missing slugs for posts and profiles
    if (pathSegments.length === 2) {
        const [section, id] = pathSegments

        // Handle `/post/[id]` → `/post/[id]/[slug]`
        if (section === "post") {
            return redirectWithSlug(request, id, getPostSlug)
        }

        // Handle `/profile/[id]` → `/profile/[id]/[slug]`
        if (section === "profile") {
            return redirectWithSlug(request, id, getProfileSlug)
        }
    }

    return NextResponse.next()
}

// ✅ Utility function for redirection
async function redirectWithSlug(
    request: NextRequest,
    id: string,
    fetchSlug: (id: string) => Promise<string | null>
) {
    const url = new URL(request.url)
    const slug = await fetchSlug(id)

    if (slug) {
        url.pathname = `${url.pathname}/${slug}`
        return NextResponse.redirect(url)
    }

    // ❌ If no slug is found, return a 404 response
    return NextResponse.rewrite(new URL("/404", request.url)) // Make sure you have a 404.tsx page
}

// ✅ Utility function to fetch profile slug from DB
async function getProfileSlug(id: string): Promise<string | null> {
    try {
        // Fetch profile by ID and return slug (modify based on your DB setup)
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/profile/${id}`
        )

        // If response is not OK (404 or server error), return null
        if (!res.ok) {
            return null
        }

        const name = await res.json()
        return name || null
    } catch (error) {
        console.error("Error fetching profile name:", error)
        return null
    }
}

// ✅ Utility function to fetch post slug (example)
async function getPostSlug(id: string): Promise<string | null> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`)

        // If response is not OK (404 or server error), return null
        if (!res.ok) {
            return null
        }

        const slug = await res.json()
        return slug || null
    } catch (error) {
        console.error("Error fetching post slug:", error)
        return null
    }
}
