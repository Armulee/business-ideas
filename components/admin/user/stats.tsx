import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Stats as StatsType } from "./types"
import { ADMIN_STATS_CONFIG } from "./constants"

interface StatsProps {
    stats: StatsType | null
}

export default function Stats({ stats }: StatsProps) {
    if (!stats) return null

    return (
        <Link
            href='/admin/user/history'
            className='grid grid-cols-3 lg:grid-cols-6 gap-4 mb-6'
        >
            {ADMIN_STATS_CONFIG.map((stat) => (
                <Card
                    key={stat.key}
                    className='bg-white/10 backdrop-blur-md border-white/20'
                >
                    <CardContent className='p-4 text-center'>
                        <div className={`text-2xl font-bold ${stat.color}`}>
                            {stats[stat.key as keyof StatsType]}
                        </div>
                        <div className='text-[10px] text-gray-400'>
                            {stat.label}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </Link>
    )
}
