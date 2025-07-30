"use client"

import { Plus, Trash2 } from "lucide-react"
import WidgetBase from "./base"
import { Button } from "@/components/ui/button"
import React, { useRef } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useWidgetForm } from "../provider"
import WidgetTab from "./tab"

interface SummaryWidgetProps {
    id: string
    onRemove: () => void
    dragAttributes?: React.HTMLAttributes<HTMLDivElement>
    isDragOverlay?: boolean
}

export default function SummaryWidget({
    id,
    onRemove,
    dragAttributes,
    isDragOverlay,
}: SummaryWidgetProps) {
    const { summaries, setSummaries } = useWidgetForm()
    // Removed generateId as we're using indices now

    const inputRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({})

    const handleAdd = () => {
        setSummaries((prev) =>
            prev.length < 1
                ? [
                      ...prev,
                      {
                          topic: "",
                          values: [],
                      },
                  ]
                : prev
        )
    }

    const handleAddItem = (summaryIndex: number) => {
        setSummaries((prev) => {
            const newSummaries = prev.map((summary, index) =>
                index === summaryIndex
                    ? {
                          ...summary,
                          values:
                              summary.values.length < 5
                                  ? [
                                        ...summary.values,
                                        "", // New empty string value
                                    ]
                                  : summary.values,
                      }
                    : summary
            )

            return newSummaries
        })
    }

    // Delete a summary topic
    const handleDeleteTopic = (summaryIndex: number) => {
        setSummaries((prevSummaries) =>
            prevSummaries.filter((_, index) => index !== summaryIndex)
        )
    }

    // Delete a individual value
    const handleDeleteValue = (summaryIndex: number, valueIndex: number) => {
        setSummaries((prevSummaries) =>
            prevSummaries.map((summary, index) =>
                index === summaryIndex
                    ? {
                          ...summary,
                          values: summary.values.filter(
                              (_, i) => i !== valueIndex
                          ),
                      }
                    : summary
            )
        )
    }

    return (
        <WidgetBase
            id={id}
            title='Business Summary'
            onRemove={onRemove}
            dragAttributes={dragAttributes}
            isDragging={isDragOverlay}
        >
            <WidgetTab>Quick Summarized</WidgetTab>
            {summaries.map((summary, summaryIndex) => (
                <div key={`summary-${summaryIndex}`}>
                    <div className='w-full flex justify-center items-center gap-1 mb-2'>
                        <Input
                            name='summary.topic'
                            className='glassmorphism placeholder:text-white/50'
                            placeholder='Enter the summary topic'
                            // prevent the form submitting when press 'enter'
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault()
                                }
                            }}
                            onChange={(e) =>
                                setSummaries((prev) =>
                                    prev.map((s, index) =>
                                        index === summaryIndex
                                            ? { ...s, topic: e.target.value }
                                            : s
                                    )
                                )
                            }
                        />

                        <Button
                            type='button'
                            variant={"ghost"}
                            className='px-2 ml-1 bg-transparent hover:bg-transparent'
                            onClick={() => handleDeleteTopic(summaryIndex)}
                        >
                            <Trash2 className='text-red-400' />
                        </Button>
                    </div>
                    <div className='mb-5'>
                        {summary.values.map((value, valueIndex) => (
                            <div
                                key={`summary-${summaryIndex}-value-${valueIndex}`}
                                className='flex items-start mb-2'
                            >
                                <div className='flex-shrink-0 text-blue-400 mt-2 mr-2'>
                                    •
                                </div>
                                <Textarea
                                    ref={(el) => {
                                        inputRefs.current[
                                            `${summaryIndex}-${valueIndex}`
                                        ] = el
                                    }}
                                    value={value}
                                    placeholder='Enter your detail'
                                    name='summary.detail'
                                    className='max-w-full min-h-[36px] h-[36px] glassmorphism placeholder:text-white/50 text-white overflow-hidden resize-none'
                                    onInput={(e) => {
                                        const target =
                                            e.target as HTMLTextAreaElement
                                        target.style.height = "36px"
                                        target.style.height = `${target.scrollHeight}px`
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault()
                                            handleAddItem(summaryIndex) // Add new detail when Enter is pressed
                                        } else if (
                                            e.key === "Backspace" &&
                                            value === ""
                                        ) {
                                            e.preventDefault()
                                            handleDeleteValue(
                                                summaryIndex,
                                                valueIndex
                                            ) // Delete the detail when empty and Backspace is pressed
                                        }
                                    }}
                                    onChange={(e) =>
                                        setSummaries((prev) =>
                                            prev.map((s, index) =>
                                                index === summaryIndex
                                                    ? {
                                                          ...s,
                                                          values: s.values.map(
                                                              (v, i) =>
                                                                  i ===
                                                                  valueIndex
                                                                      ? e.target
                                                                            .value
                                                                      : v
                                                          ),
                                                      }
                                                    : s
                                            )
                                        )
                                    }
                                />

                                <Button
                                    type='button'
                                    variant={"ghost"}
                                    className='px-2 ml-1 bg-transparent hover:bg-transparent'
                                    onClick={() =>
                                        handleDeleteValue(
                                            summaryIndex,
                                            valueIndex
                                        )
                                    }
                                >
                                    <Trash2 className='text-red-400' />
                                </Button>
                            </div>
                        ))}
                        {summary.values.length < 5 && (
                            <div className='w-full flex justify-center'>
                                <Button
                                    type='button'
                                    className='px-4 text-center glassmorphism text-white bg-transparent hover:bg-white/10 transition duration-300'
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        handleAddItem(summaryIndex)
                                    }}
                                >
                                    <Plus />
                                    Add Detail
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* Add button */}
            {summaries.length < 1 && (
                <div className='flex items-center gap-2'>
                    <Button
                        type='button'
                        onClick={(e) => {
                            e.stopPropagation()
                            handleAdd()
                        }}
                        className='w-full pt-2 text-center glassmorphism text-white bg-transparent hover:bg-white/10 transition duration-300'
                    >
                        <Plus />
                        Add New Topic
                    </Button>
                </div>
            )}
        </WidgetBase>
    )
}
