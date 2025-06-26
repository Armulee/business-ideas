import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Megaphone } from "lucide-react"

export default function Announcements({ hidden }: { hidden: boolean }) {
    return (
        <>
            {hidden ? null : (
                <Card className='glassmorphism bg-transparent'>
                    <CardHeader className='pb-3'>
                        <CardTitle className='text-sm font-medium flex items-center text-white'>
                            <Megaphone className='w-4 h-4 mr-2' />
                            Announcements
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='pt-0'>
                        <div className='text-xs'>
                            <p className='font-medium text-white'>
                                New Feature Alert!
                            </p>
                            <p className='mt-1 text-white/70'>
                                You can now collaborate on ideas with other
                                members. Check out the new
                                &quot;Collaborate&quot; button on idea cards!
                            </p>
                        </div>
                    </CardContent>
                </Card>
            )}
        </>
    )
}
