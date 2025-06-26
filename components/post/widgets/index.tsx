import { PollData, SummaryData } from "@/database/Widget"
import { usePostData } from ".."
import ProfileWidget from "./profile"
import SummaryWidget from "./summary"
import CallToCommentWidget from "./call-to-comment"
import QuickPollWidget from "./poll"

const Widgets = () => {
    const { widgets } = usePostData()

    if (!widgets) {
        return null
    }

    return (
        <div className='space-y-4'>
            {widgets.map((widget) => {
                switch (widget.type) {
                    case "profile":
                        return <ProfileWidget key={widget.id} />
                    case "summary":
                        return (
                            <SummaryWidget
                                key={widget.id}
                                data={widget.data as SummaryData[]}
                            />
                        )
                    case "callToComment":
                        return (
                            <CallToCommentWidget
                                key={widget.id}
                                data={widget.data as string}
                            />
                        )
                    case "quickPoll":
                        return (
                            <QuickPollWidget
                                key={widget.id}
                                data={widget.data as PollData}
                            />
                        )
                    default:
                        return null
                }
            })}
        </div>
    )
}

export default Widgets
