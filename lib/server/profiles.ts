// Server-side data fetching utilities for profiles

import connectDB from '@/database'
import Profile from '@/database/Profile'

// Get basic profile data for metadata generation
export async function getProfileForMetadata(profileId: string) {
  await connectDB()

  try {
    const profile = await Profile.findOne({ profileId: parseInt(profileId) })
      .select('profileId name email bio avatar website twitter linkedin github createdAt')
      .lean()

    return profile
  } catch (error) {
    console.error('Error fetching profile for metadata:', error)
    return null
  }
}