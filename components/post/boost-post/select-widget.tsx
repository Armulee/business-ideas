import { Card, CardContent } from "@/components/ui/card"
import { WidgetSelectionType } from "."
import { Flame } from "lucide-react"

export default function SelectWidget({
    postTitle,
    selectedWidget,
    setSelectedWidget,
    widgetTypes,
}: {
    postTitle: string
    selectedWidget: string
    setSelectedWidget: React.Dispatch<React.SetStateAction<string>>
    widgetTypes: WidgetSelectionType[]
}) {
    const handleWidgetSelect = (widgetId: string) => {
        setSelectedWidget(widgetId)
    }

    const renderWidgetPreview = (widget: WidgetSelectionType) => (
        <div className='relative glassmorphism bg-blue-600 border border-white/20 rounded-lg p-4'>
            <div className='mb-3'>
                <h4 className='w-full text-sm font-medium text-white truncate'>
                    {postTitle}
                </h4>

                <div className='mt-2 space-y-1'>
                    <div className='h-2 bg-white rounded animate-pulse'></div>
                    <div className='h-2 bg-white rounded animate-pulse w-3/4'></div>
                </div>
            </div>
            <div className='mt-4 mb-4 text-white'>{widget.preview}</div>
            <div className='absolute bottom-2 right-4 text-white flex justify-end text-[10px]'>
                <Flame size={12} className='text-blue-300' />
                <h4 className='m-0'>
                    <span className='text-blue-300'>Blue</span>BizHub
                </h4>
            </div>
        </div>
    )

    return (
        <>
            <div className='px-6'>
                <h3 className='text-lg font-semibold text-white mb-2'>
                    Choose Widget Type
                </h3>
                <p className='text-sm text-white/60 mb-3'>
                    Select how users will interact with your boosted post
                </p>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4'>
                {widgetTypes.map((widget) => (
                    <Card
                        key={widget.id}
                        className={`cursor-pointer transition-all duration-300 hover:scale-105 ${
                            selectedWidget === widget.id
                                ? "ring-2 ring-blue-500 bg-blue-600 border-blue-500"
                                : "glassmorphism bg-transparent border-0 hover:border-gray-600"
                        }`}
                        onClick={() => handleWidgetSelect(widget.id)}
                    >
                        <CardContent className='p-4'>
                            <div className='flex items-center gap-3 mb-3'>
                                <div className='text-white'>{widget.icon}</div>
                                <div>
                                    <h4 className='font-medium text-white'>
                                        {widget.name}
                                    </h4>
                                    <p className='text-xs text-white/60'>
                                        {widget.description}
                                    </p>
                                </div>
                            </div>
                            {renderWidgetPreview(widget)}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </>
    )
}
