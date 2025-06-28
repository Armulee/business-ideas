# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

Essential commands for development:

```bash
# Development with Turbopack
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

## Architecture Overview

**BlueBizHub** is a full-stack Next.js 15 application for sharing and discussing business ideas.

### Tech Stack
- **Frontend**: Next.js 15 with React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes with MongoDB and Mongoose ODM
- **Authentication**: NextAuth.js with Google, Twitter, and credentials providers
- **Database**: MongoDB with Mongoose models
- **UI Components**: Radix UI primitives with shadcn/ui styling
- **Rich Text**: TipTap editor for content creation
- **State Management**: SWR for data fetching and optimistic updates

### Key Architecture Patterns

1. **Database Layer** (`/database/`):
   - Mongoose models for User, Profile, Post, Comment, Reply, etc.
   - Each model exports both the schema and the model
   - Connection logic centralized in `database/index.ts`

2. **API Routes** (`/app/api/`):
   - RESTful endpoints organized by resource
   - Rate limiting implemented for authentication endpoints
   - Middleware for authentication and slug redirection

3. **Authentication Flow**:
   - NextAuth.js configuration in `lib/auth.ts`
   - Custom credentials provider with bcrypt password hashing
   - Rate limiting on login attempts (6 attempts per 15 minutes)
   - Profile auto-creation for new users

4. **Component Architecture**:
   - Feature-based organization (auth, feeds, post, profile, etc.)
   - Shared UI components in `/components/ui/`
   - Provider pattern for global state management

5. **Routing & SEO**:
   - Dynamic routes with slug-based URLs: `/post/[id]/[slug]`
   - Middleware handles slug redirection for missing slugs
   - Profile URLs: `/profile/[id]/[slug]`

### Database Models Structure

- **User**: Authentication data (email, password, provider)
- **Profile**: User profile data (name, bio, avatar, social links)
- **Post**: Business ideas with categories, tags, widgets
- **Comment/Reply**: Threaded discussions on posts
- **Activity**: Notification system
- **Follow**: User relationships
- **Counter**: View counts and engagement metrics

### Environment Variables Required

```env
MONGODB_URI=<mongodb-connection-string>
NEXTAUTH_SECRET=<random-secret>
NEXTAUTH_URL=http://localhost:3000
GOOGLE_ID=<google-oauth-id>
GOOGLE_SECRET=<google-oauth-secret>
TWITTER_ID=<twitter-oauth-id>
TWITTER_SECRET=<twitter-oauth-secret>
NEXT_PUBLIC_API_URL=<api-base-url>
```

### Key Features Implementation

- **Real-time Engagement**: Optimistic UI updates with SWR
- **Rich Content**: TipTap editor with mentions and formatting
- **Infinite Scroll**: Paginated data fetching (50 items per batch)
- **SEO-Friendly URLs**: Automatic slug generation and redirection
- **Rate Limiting**: Protection against brute force attacks
- **File Uploads**: Cloudinary integration for images
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Testing & Quality

- ESLint with Next.js and TypeScript rules
- TypeScript strict mode enabled
- Path aliases configured: `@/*` maps to project root