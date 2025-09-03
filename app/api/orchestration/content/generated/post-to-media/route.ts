import { NextResponse } from "next/server"

// POST - Post content to social media platforms
export async function POST(request: Request) {
    try {
        const { platform, content, image } = await request.json()

        // Validate required fields
        if (!platform || !content) {
            return NextResponse.json(
                { error: "Platform and content are required" },
                { status: 400 }
            )
        }

        // Validate platform
        const validPlatforms = ['linkedin', 'x', 'meta']
        if (!validPlatforms.includes(platform)) {
            return NextResponse.json(
                { error: "Invalid platform. Must be one of: linkedin, x, meta" },
                { status: 400 }
            )
        }

        // Platform-specific posting logic
        let result: { success: boolean; message?: string; error?: string }

        switch (platform) {
            case 'linkedin':
                result = await postToLinkedIn(content, image)
                break
            case 'x':
                result = await postToX(content, image)
                break
            case 'meta':
                result = await postToMeta(content, image)
                break
            default:
                return NextResponse.json(
                    { error: "Unsupported platform" },
                    { status: 400 }
                )
        }

        if (result.success) {
            return NextResponse.json({
                success: true,
                message: `Successfully posted to ${platform.charAt(0).toUpperCase() + platform.slice(1)}`,
                platform
            })
        } else {
            return NextResponse.json(
                { 
                    error: result.error || `Failed to post to ${platform}`,
                    platform 
                },
                { status: 500 }
            )
        }
    } catch (error) {
        console.error("Error posting to social media:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
}

// LinkedIn posting function
async function postToLinkedIn(content: string, image?: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        // Check if LinkedIn credentials are configured
        if (!process.env.LINKEDIN_ACCESS_TOKEN) {
            return { 
                success: false, 
                error: "LinkedIn access token not configured" 
            }
        }

        // LinkedIn API v2 post creation
        const postData = {
            author: `urn:li:person:${process.env.LINKEDIN_PERSON_ID}`,
            lifecycleState: 'PUBLISHED',
            specificContent: {
                'com.linkedin.ugc.ShareContent': {
                    shareCommentary: {
                        text: content
                    },
                    shareMediaCategory: image ? 'IMAGE' : 'NONE',
                    ...(image && {
                        media: [{
                            status: 'READY',
                            description: {
                                text: 'Generated content image'
                            },
                            media: image,
                            title: {
                                text: 'Business Idea Content'
                            }
                        }]
                    })
                }
            },
            visibility: {
                'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
            }
        }

        const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.LINKEDIN_ACCESS_TOKEN}`,
                'Content-Type': 'application/json',
                'X-Restli-Protocol-Version': '2.0.0'
            },
            body: JSON.stringify(postData)
        })

        if (!response.ok) {
            const errorData = await response.text()
            console.error('LinkedIn API error:', errorData)
            return { 
                success: false, 
                error: `LinkedIn API error: ${response.status}` 
            }
        }

        return { success: true, message: "Successfully posted to LinkedIn" }
    } catch (error) {
        console.error('LinkedIn posting error:', error)
        return { 
            success: false, 
            error: "Failed to post to LinkedIn" 
        }
    }
}

// X (Twitter) posting function
async function postToX(content: string, image?: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        // Check if X credentials are configured
        if (!process.env.X_BEARER_TOKEN) {
            return { 
                success: false, 
                error: "X (Twitter) bearer token not configured" 
            }
        }

        // X API v2 tweet creation
        const tweetData: { text: string; media?: { media_ids: string[] } } = {
            text: content
        }

        // If image is provided, upload it first
        if (image) {
            const mediaId = await uploadImageToX(image)
            if (mediaId) {
                tweetData.media = { media_ids: [mediaId] }
            }
        }

        const response = await fetch('https://api.twitter.com/2/tweets', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.X_BEARER_TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(tweetData)
        })

        if (!response.ok) {
            const errorData = await response.text()
            console.error('X API error:', errorData)
            return { 
                success: false, 
                error: `X API error: ${response.status}` 
            }
        }

        return { success: true, message: "Successfully posted to X (Twitter)" }
    } catch (error) {
        console.error('X posting error:', error)
        return { 
            success: false, 
            error: "Failed to post to X (Twitter)" 
        }
    }
}

// Meta (Facebook) posting function
async function postToMeta(content: string, image?: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
        // Check if Meta credentials are configured
        if (!process.env.META_ACCESS_TOKEN || !process.env.META_PAGE_ID) {
            return { 
                success: false, 
                error: "Meta access token or page ID not configured" 
            }
        }

        // Facebook Graph API post creation
        const postData: { message: string; published: boolean; link?: string } = {
            message: content,
            published: true
        }

        // If image is provided, use it
        if (image) {
            postData.link = image
        }

        const response = await fetch(
            `https://graph.facebook.com/v18.0/${process.env.META_PAGE_ID}/feed`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...postData,
                    access_token: process.env.META_ACCESS_TOKEN
                })
            }
        )

        if (!response.ok) {
            const errorData = await response.text()
            console.error('Meta API error:', errorData)
            return { 
                success: false, 
                error: `Meta API error: ${response.status}` 
            }
        }

        return { success: true, message: "Successfully posted to Meta (Facebook)" }
    } catch (error) {
        console.error('Meta posting error:', error)
        return { 
            success: false, 
            error: "Failed to post to Meta (Facebook)" 
        }
    }
}

// Helper function to upload image to X
async function uploadImageToX(imageUrl: string): Promise<string | null> {
    try {
        // First, fetch the image
        const imageResponse = await fetch(imageUrl)
        if (!imageResponse.ok) return null

        const imageBuffer = await imageResponse.arrayBuffer()
        const base64Image = Buffer.from(imageBuffer).toString('base64')

        // Upload to X media endpoint
        const uploadResponse = await fetch('https://upload.twitter.com/1.1/media/upload.json', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.X_BEARER_TOKEN}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `media_data=${encodeURIComponent(base64Image)}`
        })

        if (!uploadResponse.ok) return null

        const uploadData = await uploadResponse.json()
        return uploadData.media_id_string
    } catch (error) {
        console.error('Image upload to X failed:', error)
        return null
    }
}