// SEO Structured Data Schemas for BlueBizHub

import type { WithContext, Organization, Article, Person, WebSite, BreadcrumbList } from 'schema-dts'

// Organization schema for homepage and site-wide SEO
export function createOrganizationSchema(): WithContext<Organization> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'BlueBizHub',
    alternateName: 'Blue Biz Hub',
    url: 'https://bluebizhub.com',
    logo: 'https://bluebizhub.com/logo.png',
    description: 'BlueBizHub connects visionary entrepreneurs with a vibrant community to share, discuss, and refine innovative business ideas into successful ventures.',
    foundingDate: '2024',
    sameAs: [
      'https://twitter.com/BlueBizHub',
      'https://linkedin.com/company/bluebizhub'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'admin@bluebizhub.com',
      contactType: 'customer support'
    }
  }
}

// Website schema for enhanced site visibility
export function createWebSiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'BlueBizHub',
    url: 'https://bluebizhub.com',
    description: 'Community-powered platform for sharing and refining business ideas',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://bluebizhub.com/post?search={search_term_string}',
      'query-input': 'required name=search_term_string'
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any
  }
}

// Article schema for individual posts
export function createArticleSchema(post: {
  _id: string
  postId: string
  title: string
  content: string
  slug: string
  createdAt: string
  updatedAt: string
  categories: string[]
  tags: string[]
  views?: number
  author: {
    name: string
    email: string
    avatar?: string
  }
  image?: string
}): WithContext<Article> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.content.replace(/<[^>]+>/g, '').slice(0, 160),
    url: `https://bluebizhub.com/post/${post.postId}/${post.slug}`,
    datePublished: post.createdAt,
    dateModified: post.updatedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
      email: post.author.email,
      ...(post.author.avatar && { image: post.author.avatar })
    },
    publisher: {
      '@type': 'Organization',
      name: 'BlueBizHub',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bluebizhub.com/logo.png'
      }
    },
    mainEntityOfPage: `https://bluebizhub.com/post/${post.postId}/${post.slug}`,
    ...(post.image && {
      image: {
        '@type': 'ImageObject',
        url: post.image
      }
    }),
    keywords: post.tags.join(', '),
    articleSection: post.categories.join(', '),
    ...(post.views && { 
      interactionStatistic: {
        '@type': 'InteractionCounter' as const,
        interactionType: { '@type': 'ViewAction' } as const,
        userInteractionCount: post.views
      }
    })
  }
}

// Person schema for profile pages
export function createPersonSchema(profile: {
  profileId: number
  name: string
  email: string
  bio?: string
  avatar?: string
  website?: string
  twitter?: string
  linkedin?: string
  github?: string
  createdAt: string
}): WithContext<Person> {
  const sameAs = []
  if (profile.website) sameAs.push(profile.website)
  if (profile.twitter) sameAs.push(`https://twitter.com/${profile.twitter.replace('@', '')}`)
  if (profile.linkedin) sameAs.push(profile.linkedin)
  if (profile.github) sameAs.push(`https://github.com/${profile.github}`)

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    email: profile.email,
    ...(profile.bio && { description: profile.bio }),
    ...(profile.avatar && { image: profile.avatar }),
    url: `https://bluebizhub.com/profile/${profile.profileId}/${encodeURIComponent(profile.name.toLowerCase())}`,
    ...(sameAs.length > 0 && { sameAs }),
    worksFor: {
      '@type': 'Organization',
      name: 'BlueBizHub Community'
    }
  }
}

// Breadcrumb schema for navigation
export function createBreadcrumbSchema(breadcrumbs: Array<{
  name: string
  url: string
}>): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.url
    }))
  }
}

// FAQ schema for pages like guidelines, terms, etc.
export function createFAQSchema(faqs: Array<{
  question: string
  answer: string
}>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  }
}