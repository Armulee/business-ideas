import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Award } from "lucide-react"
import { TopContributors } from ".."
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function Contributors({
    topContributors,
}: {
    topContributors: TopContributors
}) {
    return (
        <>
            {topContributors && topContributors.length ? (
                <Card className='glassmorphism bg-transparent'>
                    <CardHeader className='pb-3'>
                        <CardTitle className='text-white text-sm font-medium flex items-center'>
                            <Award className='w-4 h-4 mr-2' />
                            Top Contributors
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='pt-0'>
                        <div className='space-y-3'>
                            {topContributors.map(
                                ({ profile, count }, index) => (
                                    <Link
                                        href={`/profile/${
                                            profile.profileId
                                        }/${profile.name.toLowerCase()}`}
                                        key={profile.name}
                                        className='flex items-center space-x-3 group'
                                    >
                                        <Avatar className='flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-xs font-medium'>
                                            <AvatarImage
                                                src={profile.avatar}
                                                alt={profile.name}
                                            />
                                            <AvatarFallback className='bg-blue-900 text-white'>
                                                {profile.name
                                                    ?.charAt(0)
                                                    .toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className='flex-1'>
                                            <p className='text-sm font-medium text-white/70 group-hover:underline'>
                                                {profile.name}
                                            </p>
                                            <p className='text-xs text-white/50'>
                                                {count} ideas shared
                                            </p>
                                        </div>
                                        <Badge
                                            variant='outline'
                                            className='glassmorphism bg-transparent text-white'
                                        >
                                            #{index + 1}
                                        </Badge>
                                    </Link>
                                )
                            )}
                        </div>
                    </CardContent>
                </Card>
            ) : null}
        </>
    )
}
