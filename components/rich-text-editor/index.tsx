// components/ui/RichTextEditor.tsx
"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import Placeholder from "@tiptap/extension-placeholder"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
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
} from "lucide-react"
import { cn } from "@/lib/utils" // your classnames util, optional
import { useEffect, useState } from "react"
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuTrigger,
    ContextMenuSeparator,
} from "@/components/ui/context-menu"


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
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: placeholder || "" }),
            Underline,
            Link,
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

    if (!editor) return null

    const btn = (
        action: () => void,
        Icon: React.ForwardRefExoticComponent<
            Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
        >,
        isActive: boolean
    ) => (
        <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={action}
            className={cn(
                "p-2 rounded-md hover:bg-white/20 transition",
                isActive && "bg-blue-400/50"
            )}
            type='button'
        >
            <Icon className='w-4 h-4' />
        </button>
    )

    return (
        <div>
            <div className='w-full sm:w-fit flex flex-wrap gap-1 p-2 glassmorphism bg-transparent mb-3'>
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
                {/* {btn(
                    () =>
                        editor
                            .chain()
                            .focus()
                            .toggleHeading({ level: 1 })
                            .run(),
                    Type,
                    editor.isActive("heading", { level: 1 })
                )} */}
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
                            const selectedText = editor.state.doc.textBetween(selection.from, selection.to)
                            editor.chain().focus().deleteSelection().insertContent(`"${selectedText}"`).run()
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
                {/* {btn(
                    () => {
                        const url = window.prompt("Enter URL")
                        if (url)
                            editor
                                .chain()
                                .focus()
                                .extendMarkRange("link")
                                .setLink({ href: url })
                                .run()
                    },
                    LinkIcon,
                    editor.isActive("link")
                )} */}
            </div>

            <ContextMenu>
                <ContextMenuTrigger asChild>
                    <EditorContent
                        onFocus={() => setIsFocus(true)}
                        onBlur={() => setIsFocus(false)}
                        className={`glassmorphism ${
                            isFocus ? "bg-blue-600/50" : "bg-transparent"
                        } px-4 py-2 transition duration-500 ${className}`}
                        editor={editor}
                    />
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64 glassmorphism bg-black/80 text-white border-white/20">
                    <ContextMenuItem 
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className="hover:bg-white/20"
                    >
                        <Bold className="mr-2 h-4 w-4" />
                        Bold {editor.isActive("bold") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuItem 
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className="hover:bg-white/20"
                    >
                        <Italic className="mr-2 h-4 w-4" />
                        Italic {editor.isActive("italic") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuItem 
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className="hover:bg-white/20"
                    >
                        <UnderlineIcon className="mr-2 h-4 w-4" />
                        Underline {editor.isActive("underline") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuItem 
                        onClick={() => editor.chain().focus().toggleStrike().run()}
                        className="hover:bg-white/20"
                    >
                        <Strikethrough className="mr-2 h-4 w-4" />
                        Strikethrough {editor.isActive("strike") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuSeparator className="bg-white/20" />
                    <ContextMenuItem 
                        onClick={() => editor.chain().focus().toggleBulletList().run()}
                        className="hover:bg-white/20"
                    >
                        <List className="mr-2 h-4 w-4" />
                        Bullet List {editor.isActive("bulletList") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuItem 
                        onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        className="hover:bg-white/20"
                    >
                        <ListOrdered className="mr-2 h-4 w-4" />
                        Numbered List {editor.isActive("orderedList") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuItem 
                        onClick={() => {
                            const selection = editor.state.selection
                            if (!selection.empty) {
                                const selectedText = editor.state.doc.textBetween(selection.from, selection.to)
                                editor.chain().focus().deleteSelection().insertContent(`"${selectedText}"`).run()
                            }
                        }}
                        className="hover:bg-white/20"
                    >
                        <Quote className="mr-2 h-4 w-4" />
                        Quote
                    </ContextMenuItem>
                    <ContextMenuItem 
                        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                        className="hover:bg-white/20"
                    >
                        <Code className="mr-2 h-4 w-4" />
                        Code Block {editor.isActive("codeBlock") && "✓"}
                    </ContextMenuItem>
                    <ContextMenuSeparator className="bg-white/20" />
                    <ContextMenuItem 
                        onClick={() => navigator.clipboard.writeText(editor.state.selection.empty ? editor.getText() : editor.state.doc.textBetween(editor.state.selection.from, editor.state.selection.to))}
                        className="hover:bg-white/20"
                    >
                        Copy
                    </ContextMenuItem>
                    <ContextMenuItem 
                        onClick={() => navigator.clipboard.readText().then(text => editor.chain().focus().insertContent(text).run())}
                        className="hover:bg-white/20"
                    >
                        Paste
                    </ContextMenuItem>
                    <ContextMenuItem 
                        onClick={() => editor.chain().focus().selectAll().run()}
                        className="hover:bg-white/20"
                    >
                        Select All
                    </ContextMenuItem>
                </ContextMenuContent>
            </ContextMenu>
        </div>
    )
}
