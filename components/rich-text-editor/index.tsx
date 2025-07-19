// components/ui/RichTextEditor.tsx
"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import Image from "@tiptap/extension-image"
import {
    Bold,
    Italic,
    Underline as UnderlineIcon,
    Quote,
    List,
    Code,
    ListOrdered,
    LucideProps,
    Strikethrough,
    Paperclip,
} from "lucide-react"
import { cn } from "@/lib/utils" // your classnames util, optional
import { useEffect, useState, useRef, useCallback } from "react"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from "@/components/ui/context-menu"
import { Button } from "@/components/ui/button"

interface RichTextEditorProps {
    defaultValue?: string | undefined
    className?: string
    placeholder?: string
    onChange: (html: string) => void
    autoFocus?: boolean
}

export function RichTextEditor({
    defaultValue,
    placeholder,
    className = "",
    onChange,
    autoFocus = false,
}: RichTextEditorProps) {
    const [isFocus, setIsFocus] = useState<boolean>(false)
    const [isUploading, setIsUploading] = useState<boolean>(false)
    const [selectionMenu, setSelectionMenu] = useState<{
        show: boolean
        x: number
        y: number
        selectedText: string
        from?: number
        to?: number
    }>({ show: false, x: 0, y: 0, selectedText: "" })
    const editorRef = useRef<HTMLDivElement>(null)
    const selectionMenuRef = useRef<HTMLDivElement>(null)
    const selectionTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: placeholder || "" }),
            Underline,
            Link,
            Image,
        ],

        // seed initial content
        content: defaultValue || "",

        // push changes back to RHF / parent
        onUpdate: ({ editor }) => onChange(editor.getHTML()),

        // defer SSR render to avoid hydration mismatches
        immediatelyRender: false,
    })

    // whenever `editor` is initialized and `autoFocus` is true, focus it
    useEffect(() => {
        if (autoFocus && editor) {
            // move focus + selection
            const endPos = editor.state.doc.content.size
            editor.chain().focus().setTextSelection(endPos).run()
        }
    }, [autoFocus, editor])

    // Handle text selection events
    const handleSelectionChange = useCallback(() => {
        if (!editor) return

        // Clear any existing timeout
        if (selectionTimeoutRef.current) {
            clearTimeout(selectionTimeoutRef.current)
            selectionTimeoutRef.current = null
        }

        const selection = editor.state.selection
        if (!selection.empty) {
            const selectedText = editor.state.doc.textBetween(
                selection.from,
                selection.to
            )
            const dom = editor.view.dom
            const rect = dom.getBoundingClientRect()
            const coords = editor.view.coordsAtPos(selection.from)

            // Calculate position relative to editor
            let x = coords.left - rect.left
            let y = coords.top - rect.top - 60

            // Viewport boundary detection
            const viewportWidth = window.innerWidth
            const menuWidth = 280 // Approximate width of horizontal menu
            const menuHeight = 50 // Approximate height

            // Adjust horizontal position
            if (coords.left + menuWidth > viewportWidth) {
                x = viewportWidth - menuWidth - 20 - rect.left
            }
            if (coords.left < menuWidth / 2) {
                x = 20 - rect.left
            }

            // Adjust vertical position - show below selection if not enough space above
            if (coords.top - menuHeight < 0) {
                y = coords.top - rect.top + 30
            }

            // Hide menu immediately, then show after delay
            setSelectionMenu((prev) => ({ ...prev, show: false }))

            // Show menu after a brief delay to ensure selection is complete
            selectionTimeoutRef.current = setTimeout(() => {
                setSelectionMenu({
                    show: true,
                    x: Math.max(0, x),
                    y: Math.max(0, y),
                    selectedText,
                    from: selection.from,
                    to: selection.to,
                })
            }, 300) // 300ms delay to allow selection to complete
        } else {
            setSelectionMenu((prev) => ({ ...prev, show: false }))
        }
    }, [editor])

    // Handle right-click events - just hide selection menu, let ContextMenu handle the rest
    const handleRightClick = useCallback(() => {
        // Clear any pending timeout
        if (selectionTimeoutRef.current) {
            clearTimeout(selectionTimeoutRef.current)
            selectionTimeoutRef.current = null
        }
        setSelectionMenu((prev) => ({ ...prev, show: false }))
    }, [])

    // Handle clicks outside to close menus
    const handleClickOutside = useCallback((e: Event) => {
        if (
            editorRef.current &&
            !editorRef.current.contains(e.target as Node) &&
            selectionMenuRef.current &&
            !selectionMenuRef.current.contains(e.target as Node)
        ) {
            // Clear any pending timeout
            if (selectionTimeoutRef.current) {
                clearTimeout(selectionTimeoutRef.current)
                selectionTimeoutRef.current = null
            }
            setSelectionMenu((prev) => ({ ...prev, show: false }))
        }
    }, [])

    // Handle touch events for mobile
    const handleTouchEnd = useCallback(() => {
        // Delay to allow selection to register on mobile
        setTimeout(() => {
            handleSelectionChange()
        }, 100)
    }, [handleSelectionChange])

    // Set up event listeners
    useEffect(() => {
        if (editor) {
            // Listen for selection changes
            editor.on("selectionUpdate", handleSelectionChange)

            // Listen for clicks outside
            document.addEventListener("mousedown", handleClickOutside)
            document.addEventListener("touchstart", handleClickOutside)

            // Mobile touch handling
            const editorElement = editor.view.dom
            editorElement.addEventListener("touchend", handleTouchEnd)
            editorElement.addEventListener("touchcancel", handleTouchEnd)

            return () => {
                editor.off("selectionUpdate", handleSelectionChange)
                document.removeEventListener("mousedown", handleClickOutside)
                document.removeEventListener("touchstart", handleClickOutside)
                editorElement.removeEventListener("touchend", handleTouchEnd)
                editorElement.removeEventListener("touchcancel", handleTouchEnd)

                // Clear any pending timeout
                if (selectionTimeoutRef.current) {
                    clearTimeout(selectionTimeoutRef.current)
                    selectionTimeoutRef.current = null
                }
            }
        }
    }, [editor, handleSelectionChange, handleClickOutside, handleTouchEnd])

    // Handle file upload - create blob for immediate preview
    const handleFileUpload = useCallback(
        async (files: FileList) => {
            setIsUploading(true)
            if (!files.length || !editor) return

            const file = files[0]

            // Check file type
            const isImage = file.type.startsWith("image/")
            const isVideo = file.type.startsWith("video/")

            if (!isImage && !isVideo) {
                alert("Please select an image or video file")
                return
            }

            // Create blob URL for immediate preview
            const blobUrl = URL.createObjectURL(file)

            if (isImage) {
                // Insert image with blob URL for immediate preview
                editor.chain().focus().setImage({ src: blobUrl }).run()
            } else if (isVideo) {
                // Insert video with blob URL for immediate preview
                editor
                    .chain()
                    .focus()
                    .insertContent(
                        `<video controls width="100%" style="max-width: 500px;"><source src="${blobUrl}" type="${file.type}">Your browser does not support the video tag.</video>`
                    )
                    .run()
            }

            // Store the file for later upload (you can add this to a state or callback)
            // The actual upload will happen when the form is submitted
            setIsUploading(false)
        },
        [editor]
    )

    // Handle file input change
    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            if (e.target.files) {
                handleFileUpload(e.target.files)
            }
            // Reset input so same file can be selected again
            if (e.target) {
                e.target.value = ""
            }
        },
        [handleFileUpload]
    )

    if (!editor) return null

    const btn = (
        action: () => void,
        Icon: React.ForwardRefExoticComponent<
            Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
        >,
        isActive: boolean
    ) => (
        <Button
            onMouseDown={(e) => e.preventDefault()}
            onClick={action}
            variant='ghost'
            size='sm'
            className={cn(
                "p-2 rounded-md hover:bg-white/20 transition",
                isActive && "bg-blue-400/50"
            )}
            type='button'
        >
            <Icon className='w-4 h-4' />
        </Button>
    )

    return (
        <div className='relative'>
            <div className='w-full sm:w-fit flex flex-wrap gap-1 p-2 glassmorphism bg-transparent mb-3'>
                {btn(() => fileInputRef.current?.click(), Paperclip, false)}
                {btn(
                    () => editor.chain().focus().toggleBold().run(),
                    Bold,
                    editor.isActive("bold")
                )}
                {btn(
                    () => editor.chain().focus().toggleItalic().run(),
                    Italic,
                    editor.isActive("italic")
                )}
                {btn(
                    () => editor.chain().focus().toggleUnderline().run(),
                    UnderlineIcon,
                    editor.isActive("underline")
                )}
                {btn(
                    () => editor.chain().focus().toggleStrike().run(),
                    Strikethrough,
                    editor.isActive("strike")
                )}
                {btn(
                    () => editor.chain().focus().toggleBulletList().run(),
                    List,
                    editor.isActive("bulletList")
                )}
                {btn(
                    () => editor.chain().focus().toggleOrderedList().run(),
                    ListOrdered,
                    editor.isActive("orderedList")
                )}
                {btn(
                    () => {
                        const selection = editor.state.selection
                        if (!selection.empty) {
                            const selectedText = editor.state.doc.textBetween(
                                selection.from,
                                selection.to
                            )
                            editor
                                .chain()
                                .focus()
                                .deleteSelection()
                                .insertContent(`"${selectedText}"`)
                                .run()
                        }
                    },
                    Quote,
                    false
                )}
                {btn(
                    () => editor.chain().focus().toggleCodeBlock().run(),
                    Code,
                    editor.isActive("codeBlock")
                )}
            </div>

            {/* Hidden file input */}
            <input
                ref={fileInputRef}
                type='file'
                accept='image/*,video/*'
                onChange={handleFileSelect}
                style={{ display: "none" }}
            />

            {/* Uploading Image */}
            {isUploading && (
                <div className='glassmorphism z-50 w-full h-full absolute'>
                    Uploading...
                </div>
            )}

            {/* Horizontal Text Selection Menu */}
            {selectionMenu.show && (
                <div
                    ref={selectionMenuRef}
                    className='absolute z-50 flex items-center gap-1 p-2 bg-black/90 border border-white/20 rounded-lg shadow-lg backdrop-blur-sm text-white animate-in fade-in-0 duration-200'
                    style={{
                        left: `${selectionMenu.x}px`,
                        top: `${selectionMenu.y}px`,
                        transform:
                            selectionMenu.x < 50
                                ? "translateX(0)"
                                : "translateX(-50%)",
                    }}
                >
                    <Button
                        type='button'
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            if (
                                selectionMenu.from !== undefined &&
                                selectionMenu.to !== undefined
                            ) {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextSelection({
                                        from: selectionMenu.from,
                                        to: selectionMenu.to,
                                    })
                                    .toggleBold()
                                    .run()
                            }
                            setTimeout(
                                () =>
                                    setSelectionMenu((prev) => ({
                                        ...prev,
                                        show: false,
                                    })),
                                100
                            )
                        }}
                        variant='ghost'
                        size='sm'
                        className={cn(
                            "p-2 rounded hover:bg-white/20 transition-colors touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center",
                            editor.isActive("bold") &&
                                "bg-blue-400/50 text-blue-300"
                        )}
                        title='Bold'
                    >
                        <Bold className='w-4 h-4' />
                    </Button>
                    <Button
                        type='button'
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            if (
                                selectionMenu.from !== undefined &&
                                selectionMenu.to !== undefined
                            ) {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextSelection({
                                        from: selectionMenu.from,
                                        to: selectionMenu.to,
                                    })
                                    .toggleItalic()
                                    .run()
                            }
                            setTimeout(
                                () =>
                                    setSelectionMenu((prev) => ({
                                        ...prev,
                                        show: false,
                                    })),
                                100
                            )
                        }}
                        variant='ghost'
                        size='sm'
                        className={cn(
                            "p-2 rounded hover:bg-white/20 transition-colors touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center",
                            editor.isActive("italic") &&
                                "bg-blue-400/50 text-blue-300"
                        )}
                        title='Italic'
                    >
                        <Italic className='w-4 h-4' />
                    </Button>
                    <Button
                        type='button'
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            if (
                                selectionMenu.from !== undefined &&
                                selectionMenu.to !== undefined
                            ) {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextSelection({
                                        from: selectionMenu.from,
                                        to: selectionMenu.to,
                                    })
                                    .toggleUnderline()
                                    .run()
                            }
                            setTimeout(
                                () =>
                                    setSelectionMenu((prev) => ({
                                        ...prev,
                                        show: false,
                                    })),
                                100
                            )
                        }}
                        variant='ghost'
                        size='sm'
                        className={cn(
                            "p-2 rounded hover:bg-white/20 transition-colors touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center",
                            editor.isActive("underline") &&
                                "bg-blue-400/50 text-blue-300"
                        )}
                        title='Underline'
                    >
                        <UnderlineIcon className='w-4 h-4' />
                    </Button>
                    <Button
                        type='button'
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            if (
                                selectionMenu.from !== undefined &&
                                selectionMenu.to !== undefined
                            ) {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextSelection({
                                        from: selectionMenu.from,
                                        to: selectionMenu.to,
                                    })
                                    .toggleStrike()
                                    .run()
                            }
                            setTimeout(
                                () =>
                                    setSelectionMenu((prev) => ({
                                        ...prev,
                                        show: false,
                                    })),
                                100
                            )
                        }}
                        variant='ghost'
                        size='sm'
                        className={cn(
                            "p-2 rounded hover:bg-white/20 transition-colors touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center",
                            editor.isActive("strike") &&
                                "bg-blue-400/50 text-blue-300"
                        )}
                        title='Strikethrough'
                    >
                        <Strikethrough className='w-4 h-4' />
                    </Button>
                    <div className='w-px h-6 bg-white/20 mx-1' />
                    <Button
                        type='button'
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            if (
                                selectionMenu.from !== undefined &&
                                selectionMenu.to !== undefined
                            ) {
                                const selectedText =
                                    editor.state.doc.textBetween(
                                        selectionMenu.from,
                                        selectionMenu.to
                                    )
                                editor
                                    .chain()
                                    .focus()
                                    .setTextSelection({
                                        from: selectionMenu.from,
                                        to: selectionMenu.to,
                                    })
                                    .deleteSelection()
                                    .insertContent(`"${selectedText}"`)
                                    .run()
                            }
                            setTimeout(
                                () =>
                                    setSelectionMenu((prev) => ({
                                        ...prev,
                                        show: false,
                                    })),
                                100
                            )
                        }}
                        variant='ghost'
                        size='sm'
                        className='p-2 rounded hover:bg-white/20 transition-colors touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center'
                        title='Quote'
                    >
                        <Quote className='w-4 h-4' />
                    </Button>
                    <Button
                        type='button'
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => {
                            if (
                                selectionMenu.from !== undefined &&
                                selectionMenu.to !== undefined
                            ) {
                                editor
                                    .chain()
                                    .focus()
                                    .setTextSelection({
                                        from: selectionMenu.from,
                                        to: selectionMenu.to,
                                    })
                                    .toggleCodeBlock()
                                    .run()
                            }
                            setTimeout(
                                () =>
                                    setSelectionMenu((prev) => ({
                                        ...prev,
                                        show: false,
                                    })),
                                100
                            )
                        }}
                        variant='ghost'
                        size='sm'
                        className={cn(
                            "p-2 rounded hover:bg-white/20 transition-colors touch-manipulation min-w-[40px] min-h-[40px] flex items-center justify-center",
                            editor.isActive("codeBlock") &&
                                "bg-blue-400/50 text-blue-300"
                        )}
                        title='Code Block'
                    >
                        <Code className='w-4 h-4' />
                    </Button>
                </div>
            )}

            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <div ref={editorRef} onContextMenu={handleRightClick}>
                        <EditorContent
                            onFocus={() => setIsFocus(true)}
                            onBlur={() => setIsFocus(false)}
                            className={`glassmorphism ${
                                isFocus ? "bg-blue-600/50" : "bg-transparent"
                            } px-4 py-2 transition duration-500 ${className}`}
                            editor={editor}
                        />
                    </div>
                </ContextMenuTrigger>
                <ContextMenuContent className='w-64 glassmorphism bg-black/80 text-white border-white/20'>
                    <ContextMenuItem
                        onClick={() =>
                            editor.chain().focus().toggleBold().run()
                        }
                        className='hover:bg-white/20'
                    >
                        <Bold className='mr-2 h-4 w-4' />
                        Bold {editor.isActive("bold") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() =>
                            editor.chain().focus().toggleItalic().run()
                        }
                        className='hover:bg-white/20'
                    >
                        <Italic className='mr-2 h-4 w-4' />
                        Italic {editor.isActive("italic") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() =>
                            editor.chain().focus().toggleUnderline().run()
                        }
                        className='hover:bg-white/20'
                    >
                        <UnderlineIcon className='mr-2 h-4 w-4' />
                        Underline {editor.isActive("underline") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() =>
                            editor.chain().focus().toggleStrike().run()
                        }
                        className='hover:bg-white/20'
                    >
                        <Strikethrough className='mr-2 h-4 w-4' />
                        Strikethrough {editor.isActive("strike") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuSeparator className='bg-white/20' />
                    <ContextMenuItem
                        onClick={() =>
                            editor.chain().focus().toggleBulletList().run()
                        }
                        className='hover:bg-white/20'
                    >
                        <List className='mr-2 h-4 w-4' />
                        Bullet List {editor.isActive("bulletList") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() =>
                            editor.chain().focus().toggleOrderedList().run()
                        }
                        className='hover:bg-white/20'
                    >
                        <ListOrdered className='mr-2 h-4 w-4' />
                        Numbered List {editor.isActive("orderedList") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => {
                            const selection = editor.state.selection
                            if (!selection.empty) {
                                const selectedText =
                                    editor.state.doc.textBetween(
                                        selection.from,
                                        selection.to
                                    )
                                editor
                                    .chain()
                                    .focus()
                                    .deleteSelection()
                                    .insertContent(`"${selectedText}"`)
                                    .run()
                            }
                        }}
                        className='hover:bg-white/20'
                    >
                        <Quote className='mr-2 h-4 w-4' />
                        Quote
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() =>
                            editor.chain().focus().toggleCodeBlock().run()
                        }
                        className='hover:bg-white/20'
                    >
                        <Code className='mr-2 h-4 w-4' />
                        Code Block {editor.isActive("codeBlock") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuSeparator className='bg-white/20' />
                    <ContextMenuItem
                        onClick={() =>
                            navigator.clipboard.writeText(
                                editor.state.selection.empty
                                    ? editor.getText()
                                    : editor.state.doc.textBetween(
                                          editor.state.selection.from,
                                          editor.state.selection.to
                                      )
                            )
                        }
                        className='hover:bg-white/20'
                    >
                        Copy
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() =>
                            navigator.clipboard
                                .readText()
                                .then((text) =>
                                    editor
                                        .chain()
                                        .focus()
                                        .insertContent(text)
                                        .run()
                                )
                        }
                        className='hover:bg-white/20'
                    >
                        Paste
                    </ContextMenuItem>
                    <ContextMenuItem
                        onClick={() => editor.chain().focus().selectAll().run()}
                        className='hover:bg-white/20'
                    >
                        Select All
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    )
}
