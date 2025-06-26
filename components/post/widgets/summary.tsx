import { SummaryData } from "@/database/Widget"
import WidgetBase from "./base"
import { PropagateLoader } from "react-spinners"
import { Text } from "lucide-react"

export default function SummaryWidget({
    data,
}: {
    data: SummaryData[] | undefined
}) {
    return (
        <WidgetBase>
            <div className='flex items-center gap-2 mb-3 bg-white/20 absolute top-0 left-0 w-full px-4 py-2'>
                <Text className='w-4 h-4' />
                <span className='text-sm font-bold'>Quick Summarized</span>
            </div>
            {data ? (
                data.map((summary, index) => (
                    <div className='flex flex-col items-start' key={summary.id}>
                        <h6 className='font-bold mb-2'>{summary.topic}</h6>
                        <ul
                            className={`list-disc ${
                                index + 1 !== data.length ? "mb-3" : ""
                            }`}
                        >
                            {summary.values.map(({ id, value }) => (
                                <li
                                    key={id}
                                    className='flex items-center mb-2 text-sm'
                                >
                                    <div className='flex-shrink-0 text-blue-400 mr-2'>
                                        •
                                    </div>
                                    {value}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <div className='flex justify-center items-center pr-4 pb-5'>
                    <PropagateLoader
                        className='p-4'
                        color='#ffffff'
                        size={20}
                    />
                </div>
            )}
        </WidgetBase>
    )
}
