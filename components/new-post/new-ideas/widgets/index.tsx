"use client"

import type React from "react"

import { useState } from "react"
import { Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import ProfileWidget from "./profile"
import SummaryWidget from "./summary"
import CallToCommentWidget from "./call-to-comment"
import QuickPollWidget from "./poll"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useWidgetForm } from "../provider"
import { WidgetData, WidgetType } from "@/database/Widget"

export default function Widgets() {
    const { widgets, setWidgets } = useWidgetForm()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [activeId, setActiveId] = useState<string | null>(null)
    const [activeWidget, setActiveWidget] = useState<WidgetData | null>(null)

    // Set up sensors for drag and drop
    const sensors = useSensors(
        useSensor(PointerSensor, {
            // Activate on a small movement to avoid accidental drags
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
            // Add keyboardCodes configuration to exclude Enter and Space
            keyboardCodes: {
                start: [""],
                cancel: ["Escape"],
                end: ["KeyD"],
            },
        })
    )

    // Check if we can add more widgets
    const canAddWidget = widgets.length < 2

    // Check if a specific widget type is already added
    const isWidgetAdded = (type: WidgetType) =>
        widgets.some((widget) => widget.type === type)

    // Add a new widget
    const addWidget = (type: WidgetType) => {
        if (widgets.length < 2 && !isWidgetAdded(type)) {
            const newWidget = {
                id: `widget-${Date.now()}`,
                type,
            }
            setWidgets([...widgets, newWidget])
        }
        setIsDialogOpen(false)
    }

    // Remove a widget
    const removeWidget = (id: string) => {
        setWidgets(widgets.filter((widget) => widget.id !== id))
    }

    // Handle drag start event
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event
        setActiveId(active.id as string)
        const draggedWidget = widgets.find((widget) => widget.id === active.id)
        if (draggedWidget) {
            setActiveWidget(draggedWidget)
        }
    }

    // Handle drag end event
    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        setActiveId(null)
        setActiveWidget(null)

        if (over && active.id !== over.id) {
            setWidgets((items) => {
                const oldIndex = items.findIndex(
                    (item) => item.id === active.id
                )
                const newIndex = items.findIndex((item) => item.id === over.id)

                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }

    // Render the appropriate widget component based on type
    const renderWidget = (widget: WidgetData, isDragOverlay = false) => {
        const commonProps = {
            id: widget.id,
            onRemove: () => removeWidget(widget.id),
            isDragOverlay,
            setWidgets,
        }

        switch (widget.type) {
            case "profile":
                return <ProfileWidget {...commonProps} />
            case "summary":
                return <SummaryWidget {...commonProps} />
            // case "highlightComment":
            //     return <HighlightCommentWidget {...commonProps} />
            case "callToComment":
                return <CallToCommentWidget {...commonProps} />
            case "quickPoll":
                return <QuickPollWidget {...commonProps} />
            default:
                return null
        }
    }

    return (
        <div className='w-full'>
            {/* Drag and drop context */}
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                {/* Single responsive container for widgets */}
                <div className='flex flex-col gap-4 w-full'>
                    <SortableContext
                        items={widgets.map((w) => w.id)}
                        strategy={verticalListSortingStrategy}
                    >
                        <AnimatePresence>
                            {widgets.map((widget) => (
                                <SortableWidget
                                    key={widget.id}
                                    widget={widget}
                                    onRemove={() => removeWidget(widget.id)}
                                    isActive={activeId === widget.id}
                                />
                            ))}

                            {/* Add widget button - only show if we can add more widgets */}
                            {canAddWidget && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.2 }}
                                    className='h-full'
                                >
                                    <div
                                        className={`bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg  border border-white/20 rounded-xl h-full min-h-[160px] flex items-center justify-center cursor-pointer transition-all duration-300 group hover:border-white/30 hover:from-white/15 hover:to-white/10`}
                                        onClick={() => setIsDialogOpen(true)}
                                    >
                                        <div className='flex flex-col items-center'>
                                            <div className='w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2 group-hover:bg-blue-500/30 transition-colors'>
                                                <Plus className='h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors' />
                                            </div>
                                            <p className='text-white/70 group-hover:text-white transition-colors'>
                                                Add Widget
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </SortableContext>
                </div>

                {/* Drag Overlay - this is the widget that follows the cursor */}
                <DragOverlay>
                    {activeWidget ? (
                        <div className='opacity-90 w-full'>
                            {renderWidget(activeWidget, true)}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {/* Widget Selection Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className='bg-gradient-to-br from-gray-900/95 to-blue-900/95 backdrop-blur-lg border border-blue-500/30 text-white'>
                    <DialogHeader>
                        <DialogTitle className='text-xl font-medium text-white'>
                            Select Widget
                        </DialogTitle>
                        <DialogDescription className='text-white/70'>
                            Choose a widget to add to your dashboard. You can
                            add up to 2 different widgets.
                        </DialogDescription>
                    </DialogHeader>

                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 py-4'>
                        <WidgetOption
                            title='Profile'
                            description='Display user profile information'
                            onClick={() => addWidget("profile")}
                            disabled={isWidgetAdded("profile")}
                        />
                        <WidgetOption
                            title='Summary'
                            description='Show a summary of content'
                            onClick={() => addWidget("summary")}
                            disabled={isWidgetAdded("summary")}
                        />
                        <WidgetOption
                            title='Call to Comment'
                            description='Encourage users to comment'
                            onClick={() => addWidget("callToComment")}
                            disabled={isWidgetAdded("callToComment")}
                        />
                        <WidgetOption
                            title='Quick Poll'
                            description='Create a simple poll'
                            onClick={() => addWidget("quickPoll")}
                            disabled={isWidgetAdded("quickPoll")}
                        />
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

interface SortableWidgetProps {
    widget: WidgetData
    onRemove: () => void
    isActive: boolean
}

function SortableWidget({ widget, onRemove, isActive }: SortableWidgetProps) {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: widget.id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isActive ? 0.4 : 1, // Make the original widget semi-transparent when dragging
    }

    // Render the appropriate widget component based on type
    const renderWidget = () => {
        const commonProps = {
            id: widget.id,
            onRemove: onRemove,
            dragAttributes: listeners,
            dragHandleAttributes: attributes,
        }

        switch (widget.type) {
            case "profile":
                return <ProfileWidget {...commonProps} />
            case "summary":
                return <SummaryWidget {...commonProps} />
            case "callToComment":
                return <CallToCommentWidget {...commonProps} />
            case "quickPoll":
                return <QuickPollWidget {...commonProps} />
            default:
                return null
        }
    }

    return (
        <motion.div
            ref={setNodeRef}
            style={style}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isActive ? 0.4 : 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`h-full ${
                isActive ? "ring-2 ring-blue-500 ring-opacity-50" : ""
            }`}
        >
            {renderWidget()}
        </motion.div>
    )
}

interface WidgetOptionProps {
    title: string
    description: string
    onClick: () => void
    disabled?: boolean
}

function WidgetOption({
    title,
    description,
    onClick,
    disabled = false,
}: WidgetOptionProps) {
    return (
        <button
            className={`
        text-left p-3 rounded-lg border border-white/10
        transition-all duration-200
        ${
            disabled
                ? "bg-white/5 cursor-not-allowed opacity-50"
                : "bg-white/10 hover:bg-white/20 hover:border-white/20 cursor-pointer"
        }
      `}
            onClick={onClick}
            disabled={disabled}
        >
            <h4 className='font-medium text-white'>{title}</h4>
            <p className='text-sm text-white/70'>{description}</p>
            {disabled && (
                <span className='text-xs text-blue-400 mt-1 block'>
                    Already added
                </span>
            )}
        </button>
    )
}
