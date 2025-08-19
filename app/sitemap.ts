import { MetadataRoute } from 'next'
import connectDB from '@/database'
import Post from '@/database/Post'
import Profile from '@/database/Profile'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bluebizhub.com'

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/post`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/auth/signin`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/auth/signup`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  try {
    await connectDB()

    // Get all published posts
    const posts = await Post.find({ status: 'published' })
      .select('postId slug title updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .lean()

    // Get all profiles
    const profiles = await Profile.find()
      .select('profileId name updatedAt createdAt')
      .sort({ updatedAt: -1 })
      .lean()

    // Dynamic post routes
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/post/${post.postId}/${post.slug}`,
      lastModified: new Date(post.updatedAt || post.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }))

    // Dynamic profile routes
    const profileRoutes: MetadataRoute.Sitemap = profiles.map((profile) => ({
      url: `${baseUrl}/profile/${profile.profileId}/${encodeURIComponent(profile.name.toLowerCase())}`,
      lastModified: new Date(profile.updatedAt || profile.createdAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    return [...staticRoutes, ...postRoutes, ...profileRoutes]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticRoutes
  }
}