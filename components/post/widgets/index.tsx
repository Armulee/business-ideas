import { PollData, SummaryData, WidgetType } from "@/database/Widget"

// Temporary interface for widgets (will be replaced when widgets are properly implemented)
interface TempWidget {
    type: WidgetType
    data: SummaryData[] | PollData | string
}
import { usePostData } from ".."
import ProfileWidget from "./profile"
import SummaryWidget from "./summary"
import CallToCommentWidget from "./call-to-comment"
import QuickPollWidget from "./poll"

const Widgets = () => {
    const { post } = usePostData()
    
    // TODO: Implement widget fetching by post ID
    // For now, return null since widgets are not included in post context
    if (!post) {
        return null
    }
    
    // Temporary: no widgets to display
    const widgets: TempWidget[] = []

    if (widgets.length === 0) {
        return null
    }

    return (
        <div className='space-y-4'>
            {widgets.map((widget, index) => {
                switch (widget.type) {
                    case "profile":
                        return <ProfileWidget key={index} />
                    case "summary":
                        return (
                            <SummaryWidget
                                key={index}
                                data={widget.data as SummaryData[]}
                            />
                        )
                    case "callToComment":
                        return (
                            <CallToCommentWidget
                                key={index}
                                data={widget.data as string}
                            />
                        )
                    case "quickPoll":
                        return (
                            <QuickPollWidget
                                key={index}
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
