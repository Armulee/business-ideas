// SEO utility functions for BlueBizHub

import type { Metadata } from 'next'

// Base URL for the application
export const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://bluebizhub.com' 
  : 'http://localhost:3000'

// Strip HTML tags from content and truncate
export function stripHtmlAndTruncate(html: string, maxLength: number = 160): string {
  return html
    .replace(/<\/li>/g, ' ') // Replace closing list items with space
    .replace(/<[^>]+>/g, '') // Remove all HTML tags
    .trim()
    .replace(/\s+/g, ' ') // Remove extra whitespace
    .slice(0, maxLength)
    .trim()
}

// Generate SEO-friendly slug
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
}

// Create canonical URL
export function createCanonicalUrl(path: string): string {
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`
}

// Generate Open Graph metadata
export function createOpenGraphMetadata({
  title,
  description,
  url,
  image,
  type = 'website'
}: {
  title: string
  description: string
  url: string
  image?: string
  type?: 'website' | 'article'
}) {
  return {
    title,
    description,
    url,
    siteName: 'BlueBizHub',
    type,
    ...(image && {
      images: [{
        url: image,
        width: 1200,
        height: 630,
        alt: title
      }]
    })
  }
}

// Generate Twitter Card metadata
export function createTwitterCardMetadata({
  title,
  description,
  image
}: {
  title: string
  description: string
  image?: string
}) {
  return {
    card: 'summary_large_image' as const,
    site: '@BlueBizHub',
    title,
    description,
    ...(image && { images: [image] })
  }
}

// Create base metadata template
export function createBaseMetadata({
  title,
  description,
  path,
  image,
  keywords,
  robots,
  type = 'website'
}: {
  title: string
  description: string
  path: string
  image?: string
  keywords?: string[]
  robots?: {
    index?: boolean
    follow?: boolean
  }
  type?: 'website' | 'article'
}): Metadata {
  const canonicalUrl = createCanonicalUrl(path)

  return {
    title,
    description,
    ...(keywords && { keywords }),
    authors: [{ name: 'BlueBizHub', url: BASE_URL }],
    alternates: {
      canonical: canonicalUrl
    },
    openGraph: createOpenGraphMetadata({
      title,
      description,
      url: canonicalUrl,
      image,
      type
    }),
    twitter: createTwitterCardMetadata({
      title,
      description,
      image
    }),
    ...(robots && { robots })
  }
}

// Generate keywords from tags and categories
export function generateKeywords(tags: string[], categories: string[] = [], additionalKeywords: string[] = []): string[] {
  const baseKeywords = [
    'business ideas',
    'entrepreneurship',
    'startup',
    'innovation',
    'business community',
    'BlueBizHub'
  ]

  return [
    ...baseKeywords,
    ...tags.map(tag => tag.toLowerCase()),
    ...categories.map(cat => cat.toLowerCase()),
    ...additionalKeywords
  ].filter((keyword, index, array) => array.indexOf(keyword) === index) // Remove duplicates
}

// Create structured data script
export function createStructuredDataScript(schema: object): string {
  return JSON.stringify(schema, null, 0)
}

// Validate and format description length
export function formatMetaDescription(description: string, maxLength: number = 160): string {
  if (description.length <= maxLength) return description
  
  // Truncate at word boundary
  const truncated = description.slice(0, maxLength)
  const lastSpace = truncated.lastIndexOf(' ')
  
  return lastSpace > maxLength * 0.8 
    ? truncated.slice(0, lastSpace) + '...'
    : truncated + '...'
}

// Generate title with brand consistency
export function createPageTitle(pageTitle: string, includeBrand: boolean = true): string {
  if (!includeBrand) return pageTitle
  
  const brandName = 'BlueBizHub'
  const separator = ' - '
  
  // Prevent duplicate brand names
  if (pageTitle.includes(brandName)) return pageTitle
  
  return `${pageTitle}${separator}${brandName}`
}

// Get default OG image
export function getDefaultOGImage(): string {
  return `${BASE_URL}/og-image.jpg`
}

// Create robots meta content
export function createRobotsContent(options: {
  index?: boolean
  follow?: boolean
  noarchive?: boolean
  nosnippet?: boolean
} = {}): string {
  const {
    index = true,
    follow = true,
    noarchive = false,
    nosnippet = false
  } = options

  const directives = []
  
  directives.push(index ? 'index' : 'noindex')
  directives.push(follow ? 'follow' : 'nofollow')
  
  if (noarchive) directives.push('noarchive')
  if (nosnippet) directives.push('nosnippet')
  
  return directives.join(', ')
}