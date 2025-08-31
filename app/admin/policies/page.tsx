"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Save, Loader2, GripVertical, X } from "lucide-react"
import { toast } from "sonner"
import AutoHeightTextarea from "@/components/ui/auto-height-textarea"
import axios from "axios"
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
} from "@dnd-kit/core"
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

interface PolicySection {
    title: string
    content: string
    list?: string[]
}

interface Policy {
    _id?: string
    type?: string
    sections: PolicySection[]
}

export default function AdminPoliciesPage() {
    const [privacyPolicy, setPrivacyPolicy] = useState<Policy>()
    const [termsConditions, setTermsConditions] = useState<Policy>()
    const [activeTab, setActiveTab] = useState<"privacy" | "terms">("privacy")
    const [isLoading, setIsLoading] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const sectionRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

    // Load existing policies on mount
    useEffect(() => {
        fetchPolicies()
    }, [])

    const fetchPolicies = async () => {
        try {
            const response = await fetch("/api/admin/policies")
            const data = await response.json()

            if (data.success && data.policies) {
                const privacyData = data.policies.find(
                    (p: Policy) => p.type === "privacy-policy"
                )
                const termsData = data.policies.find(
                    (p: Policy) => p.type === "terms-conditions"
                )

                if (privacyData) {
                    setPrivacyPolicy(privacyData)
                }
                if (termsData) {
                    setTermsConditions(termsData)
                }
            }
        } catch (error) {
            console.error("Error fetching policies:", error)
            toast.error("Failed to load existing policies")
        } finally {
            setIsLoading(false)
        }
    }

    const getCurrentPolicy = () => {
        return activeTab === "privacy" ? privacyPolicy : termsConditions
    }

    const setCurrentPolicy = (policy: Policy) => {
        if (activeTab === "privacy") {
            setPrivacyPolicy(policy)
        } else {
            setTermsConditions(policy)
        }
    }

    const updateSection = (
        index: number,
        field: keyof PolicySection,
        value: string
    ) => {
        const currentPolicy = getCurrentPolicy()
        if (!currentPolicy) return

        const updatedSections = [...currentPolicy.sections]
        updatedSections[index] = {
            ...updatedSections[index],
            [field]: value,
        }
        setCurrentPolicy({
            ...currentPolicy,
            sections: updatedSections,
        })
    }

    const addListItem = (sectionIndex: number) => {
        const currentPolicy = getCurrentPolicy()
        if (!currentPolicy) return

        const updatedSections = [...currentPolicy.sections]
        if (!updatedSections[sectionIndex].list) {
            updatedSections[sectionIndex].list = []
        }
        updatedSections[sectionIndex].list!.push("")
        setCurrentPolicy({
            ...currentPolicy,
            sections: updatedSections,
        })
    }

    const updateListItem = (
        sectionIndex: number,
        listIndex: number,
        value: string
    ) => {
        const currentPolicy = getCurrentPolicy()
        if (!currentPolicy) return

        const updatedSections = [...currentPolicy.sections]
        updatedSections[sectionIndex].list![listIndex] = value
        setCurrentPolicy({
            ...currentPolicy,
            sections: updatedSections,
        })
    }

    const removeListItem = (sectionIndex: number, listIndex: number) => {
        const currentPolicy = getCurrentPolicy()
        if (!currentPolicy) return

        const updatedSections = [...currentPolicy.sections]
        updatedSections[sectionIndex].list!.splice(listIndex, 1)
        if (updatedSections[sectionIndex].list!.length === 0) {
            delete updatedSections[sectionIndex].list
        }
        setCurrentPolicy({
            ...currentPolicy,
            sections: updatedSections,
        })
    }

    const addSection = () => {
        const currentPolicy = getCurrentPolicy()
        if (!currentPolicy) return

        const newSection: PolicySection = {
            title: "",
            content: "",
        }
        setCurrentPolicy({
            ...currentPolicy,
            sections: [...currentPolicy.sections, newSection],
        })
    }

    const removeSection = (index: number) => {
        const currentPolicy = getCurrentPolicy()
        if (!currentPolicy) return

        const updatedSections = currentPolicy.sections.filter(
            (_, i) => i !== index
        )
        setCurrentPolicy({
            ...currentPolicy,
            sections: updatedSections,
        })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const currentPolicy = getCurrentPolicy()
            if (!currentPolicy) return

            const oldIndex = currentPolicy.sections.findIndex(
                (_, index) =>
                    index.toString() ===
                    active.id.toString().replace("sidebar-", "")
            )
            const newIndex = currentPolicy.sections.findIndex(
                (_, index) =>
                    index.toString() ===
                    over?.id.toString().replace("sidebar-", "")
            )

            const reorderedSections = arrayMove(
                currentPolicy.sections,
                oldIndex,
                newIndex
            )

            setCurrentPolicy({
                ...currentPolicy,
                sections: reorderedSections,
            })
        }
    }

    const scrollToSection = (sectionIndex: number) => {
        const sectionElement = sectionRefs.current[`section-${sectionIndex}`]
        if (sectionElement) {
            sectionElement.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest",
            })
        }
    }

    const handleListDragEnd = (event: DragEndEvent, sectionIndex: number) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const currentPolicy = getCurrentPolicy()
            if (!currentPolicy) return

            const section = currentPolicy.sections[sectionIndex]

            if (section.list) {
                const oldIndex = parseInt(
                    active.id.toString().split("-").pop() || "0"
                )
                const newIndex = parseInt(
                    over?.id.toString().split("-").pop() || "0"
                )

                const reorderedList = arrayMove(
                    section.list,
                    oldIndex,
                    newIndex
                )

                const updatedSections = [...currentPolicy.sections]
                updatedSections[sectionIndex] = {
                    ...section,
                    list: reorderedList,
                }

                setCurrentPolicy({
                    ...currentPolicy,
                    sections: updatedSections,
                })
            }
        }
    }

    const savePolicy = async () => {
        setIsSaving(true)
        try {
            const currentPolicy = getCurrentPolicy()
            if (!currentPolicy) return

            console.log(currentPolicy)
            // Validate sections
            for (const section of currentPolicy.sections) {
                if (!section.content) {
                    toast.error("Each section must have content")
                    return
                }
            }

            const { data } = await axios.patch(
                "/api/admin/policies",
                currentPolicy
            )

            if (data.success) {
                toast.success("Policy updated successfully")
                // Update the policy with the returned data
                setCurrentPolicy(data.policy)
            } else {
                toast.error(data.message || "Failed to update policy")
            }
        } catch (error) {
            console.error("Error saving policy:", error)
            toast.error("Failed to save policy")
        } finally {
            setIsSaving(false)
        }
    }

    if (isLoading) {
        return (
            <div className='flex items-center justify-center min-h-96'>
                <Loader2 className='w-8 h-8 animate-spin' />
            </div>
        )
    }

    return (
        <div className='relative'>
            {/* Section Navigation - Horizontal on top for mobile, Sidebar for larger screens */}
            {getCurrentPolicy() && (
                <SectionNavigationSidebar
                    policy={getCurrentPolicy()!}
                    onScrollToSection={scrollToSection}
                    onDragEnd={handleDragEnd}
                />
            )}

            <div className='container mx-auto p-6 max-w-6xl pt-6 pr-6 md:pr-72'>
                <Card className='glassmorphism bg-transparent text-white'>
                    <CardHeader>
                        <CardTitle className='text-xl font-bold'>
                            Manage{" "}
                            {activeTab === "privacy"
                                ? "Privacy Policy"
                                : "Terms & Conditions"}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs
                            value={activeTab}
                            onValueChange={(value) =>
                                setActiveTab(value as "privacy" | "terms")
                            }
                        >
                            <TabsList className='grid w-full grid-cols-2'>
                                <TabsTrigger value='privacy'>
                                    Privacy Policy
                                </TabsTrigger>
                                <TabsTrigger value='terms'>
                                    Terms & Conditions
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value='privacy' className='space-y-6'>
                                {privacyPolicy && (
                                    <PolicyEditor
                                        policy={privacyPolicy}
                                        onUpdateSection={updateSection}
                                        onAddListItem={addListItem}
                                        onUpdateListItem={updateListItem}
                                        onRemoveListItem={removeListItem}
                                        onAddSection={addSection}
                                        onRemoveSection={removeSection}
                                        onSave={savePolicy}
                                        onDragEnd={handleDragEnd}
                                        onListDragEnd={handleListDragEnd}
                                        sectionRefs={sectionRefs}
                                        isSaving={isSaving}
                                    />
                                )}
                            </TabsContent>

                            <TabsContent value='terms' className='space-y-6'>
                                {termsConditions && (
                                    <PolicyEditor
                                        policy={termsConditions}
                                        onUpdateSection={updateSection}
                                        onAddListItem={addListItem}
                                        onUpdateListItem={updateListItem}
                                        onRemoveListItem={removeListItem}
                                        onAddSection={addSection}
                                        onRemoveSection={removeSection}
                                        onSave={savePolicy}
                                        onDragEnd={handleDragEnd}
                                        onListDragEnd={handleListDragEnd}
                                        sectionRefs={sectionRefs}
                                        isSaving={isSaving}
                                    />
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

interface PolicyEditorProps {
    policy: Policy
    onUpdateSection: (
        index: number,
        field: keyof PolicySection,
        value: string
    ) => void
    onAddListItem: (sectionIndex: number) => void
    onUpdateListItem: (
        sectionIndex: number,
        listIndex: number,
        value: string
    ) => void
    onRemoveListItem: (sectionIndex: number, listIndex: number) => void
    onAddSection: () => void
    onRemoveSection: (index: number) => void
    onSave: () => void
    onDragEnd: (event: DragEndEvent) => void
    onListDragEnd: (event: DragEndEvent, sectionIndex: number) => void
    sectionRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>
    isSaving: boolean
}

function PolicyEditor({
    policy,
    onUpdateSection,
    onAddListItem,
    onUpdateListItem,
    onRemoveListItem,
    onAddSection,
    onRemoveSection,
    onSave,
    onDragEnd,
    onListDragEnd,
    sectionRefs,
    isSaving,
}: PolicyEditorProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )
    return (
        <div className='space-y-6'>
            {/* Sections */}
            <div className='space-y-4 pt-3'>
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={onDragEnd}
                >
                    <SortableContext
                        items={policy.sections.map((_, index) =>
                            index.toString()
                        )}
                        strategy={verticalListSortingStrategy}
                    >
                        {policy.sections.map((section, sectionIndex) => (
                            <SortableSection
                                key={sectionIndex}
                                id={sectionIndex.toString()}
                                section={section}
                                sectionIndex={sectionIndex}
                                onUpdateSection={onUpdateSection}
                                onAddListItem={onAddListItem}
                                onUpdateListItem={onUpdateListItem}
                                onRemoveListItem={onRemoveListItem}
                                onRemoveSection={onRemoveSection}
                                onListDragEnd={onListDragEnd}
                                sectionRefs={sectionRefs}
                            />
                        ))}
                    </SortableContext>
                </DndContext>
            </div>

            {/* Action Buttons */}
            <div className='flex justify-between items-center'>
                <Button
                    onClick={onAddSection}
                    variant='outline'
                    size='lg'
                    className='button'
                >
                    <Plus className='w-4 h-4 mr-2' />
                    Add Section
                </Button>

                <Button
                    onClick={onSave}
                    disabled={isSaving}
                    size='lg'
                    className='button'
                >
                    {isSaving ? (
                        <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                    ) : (
                        <Save className='w-4 h-4 mr-2' />
                    )}
                    Save Policy
                </Button>
            </div>
        </div>
    )
}

interface SortableSectionProps {
    id: string
    section: PolicySection
    sectionIndex: number
    onUpdateSection: (
        index: number,
        field: keyof PolicySection,
        value: string
    ) => void
    onAddListItem: (sectionIndex: number) => void
    onUpdateListItem: (
        sectionIndex: number,
        listIndex: number,
        value: string
    ) => void
    onRemoveListItem: (sectionIndex: number, listIndex: number) => void
    onRemoveSection: (index: number) => void
    onListDragEnd: (event: DragEndEvent, sectionIndex: number) => void
    sectionRefs: React.RefObject<{ [key: string]: HTMLDivElement | null }>
}

function SortableSection({
    id,
    section,
    sectionIndex,
    onUpdateSection,
    onAddListItem,
    onUpdateListItem,
    onRemoveListItem,
    onRemoveSection,
    onListDragEnd,
    sectionRefs,
}: SortableSectionProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={(el) => {
                setNodeRef(el)
                sectionRefs.current[`section-${sectionIndex}`] = el
            }}
            style={style}
            className={`relative mb-6 bg-white/5 border border-white/20 rounded-lg group ${
                isDragging ? "z-50 shadow-lg" : ""
            }`}
        >
            {/* Red X delete button on top-right */}
            <button
                onClick={() => onRemoveSection(sectionIndex)}
                className='absolute -top-3 -right-3 z-20 text-red-500 hover:text-red-600 text-xl font-bold transition-colors duration-200 w-6 h-6 flex items-center justify-center'
                title='Delete section'
            >
                <X />
            </button>

            {/* Beautiful drag handle bar at the top */}
            <div
                {...attributes}
                {...listeners}
                className='flex items-center justify-center w-full h-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 transition-all duration-200 cursor-grab active:cursor-grabbing border-b border-white/10'
            >
                <div className='flex gap-1.5'>
                    <div className='w-1.5 h-1.5 bg-white/40 rounded-full'></div>
                    <div className='w-1.5 h-1.5 bg-white/40 rounded-full'></div>
                    <div className='w-1.5 h-1.5 bg-white/40 rounded-full'></div>
                    <div className='w-1.5 h-1.5 bg-white/40 rounded-full'></div>
                    <div className='w-1.5 h-1.5 bg-white/40 rounded-full'></div>
                    <div className='w-1.5 h-1.5 bg-white/40 rounded-full'></div>
                </div>
            </div>

            <div className='p-4 space-y-4'>
                {/* Section Title */}
                <div>
                    <Label htmlFor={`section-title-${sectionIndex}`}>
                        Section Title
                    </Label>
                    <Input
                        id={`section-title-${sectionIndex}`}
                        className='input border-white/20 bg-white/5 focus:border-purple-500/50'
                        value={section.title}
                        onChange={(e) =>
                            onUpdateSection(
                                sectionIndex,
                                "title",
                                e.target.value
                            )
                        }
                        placeholder='Section title (optional)'
                    />
                </div>

                {/* Section Content */}
                <div>
                    <Label htmlFor={`section-content-${sectionIndex}`}>
                        Content <span className='text-red-500'>*</span>
                    </Label>
                    <Textarea
                        id={`section-content-${sectionIndex}`}
                        value={section.content}
                        onChange={(e) =>
                            onUpdateSection(
                                sectionIndex,
                                "content",
                                e.target.value
                            )
                        }
                        required
                        placeholder='Section content'
                        className='min-h-24 input border-white/20 bg-white/5 focus:border-purple-500/50'
                    />
                </div>

                {/* List Items */}
                <div>
                    {section.list && section.list.length > 0 && (
                        <Label className='mb-2 block'>List Items</Label>
                    )}
                    {section.list && section.list.length > 0 && (
                        <DndContext
                            collisionDetection={closestCenter}
                            onDragEnd={(event) =>
                                onListDragEnd(event, sectionIndex)
                            }
                        >
                            <SortableContext
                                items={section.list.map(
                                    (_, index) =>
                                        `list-${sectionIndex}-${index}`
                                )}
                                strategy={verticalListSortingStrategy}
                            >
                                {section.list?.map((item, listIndex) => (
                                    <SortableListItem
                                        key={`list-${sectionIndex}-${listIndex}`}
                                        id={`list-${sectionIndex}-${listIndex}`}
                                        value={item}
                                        sectionIndex={sectionIndex}
                                        listIndex={listIndex}
                                        onUpdateListItem={onUpdateListItem}
                                        onRemoveListItem={onRemoveListItem}
                                        onAddListItem={onAddListItem}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    )}

                    {/* Add Item Button moved to bottom */}
                    <div className='mt-3'>
                        <Button
                            onClick={() => onAddListItem(sectionIndex)}
                            className='text-black button w-full'
                            variant='outline'
                            size='sm'
                        >
                            <Plus className='w-4 h-4 mr-1' />
                            Add List Item
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

interface SectionNavigationSidebarProps {
    policy: Policy
    onScrollToSection: (index: number) => void
    onDragEnd: (event: DragEndEvent) => void
}

function SectionNavigationSidebar({
    policy,
    onScrollToSection,
    onDragEnd,
}: SectionNavigationSidebarProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    if (!policy?.sections?.length) return null

    return (
        <>
            {/* Mobile - Horizontal at top */}
            <div className='fixed bottom-2 left-2 right-2 z-50 md:hidden'>
                <Card className='glassmorphism bg-black/40 border-white/20 text-white p-2 overflow-hidden'>
                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={onDragEnd}
                    >
                        <SortableContext
                            items={policy.sections.map(
                                (_, index) => `sidebar-${index}`
                            )}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className='flex gap-2 overflow-x-auto scrollbar-hide pb-1'>
                                {policy.sections.map((section, index) => (
                                    <SidebarSectionItem
                                        key={index}
                                        id={`sidebar-${index}`}
                                        index={index}
                                        title={section.title || ""}
                                        onScrollToSection={onScrollToSection}
                                        isMobile={true}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </Card>
            </div>

            {/* Desktop - Vertical sidebar */}
            <div className='hidden md:block fixed top-1/2 right-6 -translate-y-1/2 z-50 w-60'>
                <Card className='glassmorphism bg-black/40 border-white/20 text-white p-4 overflow-x-hidden'>
                    <div className='mb-3'>
                        <h4 className='text-sm font-semibold text-white/80 mb-3'>
                            Section Navigation
                        </h4>
                    </div>

                    <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={onDragEnd}
                    >
                        <SortableContext
                            items={policy.sections.map(
                                (_, index) => `sidebar-${index}`
                            )}
                            strategy={verticalListSortingStrategy}
                        >
                            <div className='space-y-2 max-h-96 overflow-y-auto'>
                                {policy.sections.map((section, index) => (
                                    <SidebarSectionItem
                                        key={index}
                                        id={`sidebar-${index}`}
                                        index={index}
                                        title={section.title || ""}
                                        onScrollToSection={onScrollToSection}
                                        isMobile={false}
                                    />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                </Card>
            </div>
        </>
    )
}

interface SidebarSectionItemProps {
    id: string
    index: number
    title: string
    onScrollToSection: (index: number) => void
    isMobile: boolean
}

function SidebarSectionItem({
    id,
    index,
    title,
    onScrollToSection,
    isMobile,
}: SidebarSectionItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    if (isMobile) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full border border-white/10 hover:border-white/30 transition-colors bg-white/5 hover:bg-white/10 cursor-pointer ${
                    isDragging ? "shadow-lg" : ""
                }`}
                onClick={() => onScrollToSection(index)}
                title={
                    title
                        ? `Section ${index + 1}: ${title}`
                        : `Section ${index + 1}`
                }
                {...attributes}
                {...listeners}
            >
                <div className='text-sm font-bold text-white'>{index + 1}</div>
            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 p-2 rounded-md border border-white/10 hover:border-white/30 transition-colors bg-white/5 hover:bg-white/10 cursor-pointer ${
                isDragging ? "shadow-lg" : ""
            }`}
            onClick={() => onScrollToSection(index)}
            title={
                title
                    ? `Section ${index + 1}: ${title}`
                    : `Section ${index + 1}`
            }
        >
            <div
                {...attributes}
                {...listeners}
                className='cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-white transition-colors'
                onClick={(e) => e.stopPropagation()}
            >
                <GripVertical className='w-3 h-3' />
            </div>

            <div className='flex-1 min-w-0'>
                <div className='flex-1'>
                    <div className='text-xs text-white/60 mb-1'>
                        Section {index + 1}
                    </div>
                    {title && (
                        <div className='text-sm font-medium text-white truncate'>
                            {title}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

interface SortableListItemProps {
    id: string
    value: string
    sectionIndex: number
    listIndex: number
    onUpdateListItem: (
        sectionIndex: number,
        listIndex: number,
        value: string
    ) => void
    onRemoveListItem: (sectionIndex: number, listIndex: number) => void
    onAddListItem: (sectionIndex: number) => void
}

function SortableListItem({
    id,
    value,
    sectionIndex,
    listIndex,
    onUpdateListItem,
    onRemoveListItem,
    onAddListItem,
}: SortableListItemProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`relative mb-4 bg-white/5 border border-white/10 rounded-lg group ${
                isDragging ? "z-50 shadow-lg" : ""
            }`}
        >
            {/* Red X delete button on top-right */}
            <button
                onClick={() => onRemoveListItem(sectionIndex, listIndex)}
                className='absolute -top-3 -right-3 z-20 text-red-500 hover:text-red-600 text-lg font-bold transition-colors duration-200 w-6 h-6 flex items-center justify-center'
                title='Delete list item'
            >
                <X />
            </button>

            {/* Beautiful drag handle bar at the top */}
            <div
                {...attributes}
                {...listeners}
                className='flex items-center justify-center w-full h-6 bg-gradient-to-r from-blue-500/20 to-purple-500/20 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-200 cursor-grab active:cursor-grabbing border-b border-white/10'
            >
                <div className='flex gap-1'>
                    <div className='w-1 h-1 bg-white/40 rounded-full'></div>
                    <div className='w-1 h-1 bg-white/40 rounded-full'></div>
                    <div className='w-1 h-1 bg-white/40 rounded-full'></div>
                    <div className='w-1 h-1 bg-white/40 rounded-full'></div>
                    <div className='w-1 h-1 bg-white/40 rounded-full'></div>
                </div>
            </div>

            {/* Content area */}
            <div className='p-3'>
                <AutoHeightTextarea
                    value={value}
                    onChange={(e) =>
                        onUpdateListItem(
                            sectionIndex,
                            listIndex,
                            e.target.value
                        )
                    }
                    placeholder='List item'
                    className='w-full input border-white/20 bg-white/5 focus:border-blue-500/50'
                    onKeyDown={(e) => {
                        if (e.key === "Tab" && !e.shiftKey) {
                            e.preventDefault()
                            onAddListItem(sectionIndex)
                            setTimeout(() => {
                                const newInput = document.getElementById(
                                    `list-item-${sectionIndex}-${listIndex + 1}`
                                )
                                newInput?.focus()
                            }, 0)
                        }
                    }}
                    id={`list-item-${sectionIndex}-${listIndex}`}
                />
            </div>
        </div>
    )
}
