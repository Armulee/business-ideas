// extensions/ResizableImage.ts
import { NodeViewWrapper, NodeViewProps } from "@tiptap/react"
import { Node, mergeAttributes } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
// import Image from "next/image" // Using regular img for auto sizing
import { useEffect, useRef, useState } from "react"

export const ResizableImage = Node.create({
    name: "resizableImage",

    group: "block",
    inline: false,
    draggable: true,
    selectable: true,
    atom: true,

    addAttributes() {
        return {
            src: { default: null },
            width: { default: "auto" },
            height: { default: "auto" },
        }
    },

    parseHTML() {
        return [{ tag: "img" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["img", mergeAttributes(HTMLAttributes)]
    },

    addNodeView() {
        return ReactNodeViewRenderer(ImageComponent)
    },
})

const ImageComponent: React.FC<NodeViewProps> = ({
    node,
    updateAttributes,
    deleteNode,
    editor,
}) => {
    const { src, width } = node.attrs
    const [isSelected, setIsSelected] = useState(false)
    const imgRef = useRef<HTMLImageElement>(null)

    const startResize = (
        e: React.MouseEvent<HTMLDivElement>,
        position: string
    ) => {
        e.preventDefault()
        e.stopPropagation()

        const startX = e.clientX
        const startY = e.clientY
        const currentWidth = imgRef.current?.offsetWidth || 0

        const onMouseMove = (moveEvent: MouseEvent) => {
            const deltaX = moveEvent.clientX - startX
            const deltaY = moveEvent.clientY - startY

            // Get editor container dimensions
            const editorContainer =
                imgRef.current?.closest(".ProseMirror") ||
                imgRef.current?.closest("[data-editor]")

            const containerWidth = editorContainer
                ? editorContainer.clientWidth
                : window.innerWidth * 0.9

            // Calculate percentage-based resize
            const currentWidthPercent = (currentWidth / containerWidth) * 100
            let newWidthPercent = currentWidthPercent

            switch (position) {
                case "right":
                case "bottom-right":
                case "top-right":
                    newWidthPercent = Math.min(
                        100,
                        Math.max(
                            10,
                            currentWidthPercent +
                                (deltaX / containerWidth) * 100
                        )
                    )
                    break

                case "left":
                case "bottom-left":
                case "top-left":
                    newWidthPercent = Math.min(
                        100,
                        Math.max(
                            10,
                            currentWidthPercent -
                                (deltaX / containerWidth) * 100
                        )
                    )
                    break

                case "bottom":
                case "top":
                    // For vertical resizing, calculate based on height change but maintain aspect ratio
                    const heightChange = (deltaY / containerWidth) * 100 // Use containerWidth for consistent scaling
                    newWidthPercent = Math.min(
                        100,
                        Math.max(
                            10,
                            currentWidthPercent +
                                (position === "bottom"
                                    ? heightChange
                                    : -heightChange)
                        )
                    )
                    break
            }

            // Apply the new percentage-based width
            updateAttributes({
                width: `${Math.round(newWidthPercent)}%`,
                height: "auto", // Let height scale automatically to maintain aspect ratio
            })
        }

        const onMouseUp = () => {
            window.removeEventListener("mousemove", onMouseMove)
            window.removeEventListener("mouseup", onMouseUp)
        }

        window.addEventListener("mousemove", onMouseMove)
        window.addEventListener("mouseup", onMouseUp)
    }

    useEffect(() => {
        const click = (e: MouseEvent) => {
            e.stopImmediatePropagation()

            if (
                e.target &&
                imgRef.current &&
                !imgRef.current.contains(e.target as HTMLElement)
            ) {
                setIsSelected(false)
            }
        }

        window.addEventListener("click", click)

        return () => {
            window.removeEventListener("click", click)
        }
    }, [])

    return (
        <NodeViewWrapper className={`relative inline-block`}>
            <div
                className='relative'
                onClick={() => setIsSelected(true)}
                style={{
                    width: width || "auto",
                    height: "auto", // Always auto to maintain aspect ratio
                    display: "block",
                    boxShadow: isSelected ? "0 0 0 2px #18d0ddff" : "",
                }}
            >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    onClick={(prev) => setIsSelected(!prev)}
                    ref={imgRef}
                    src={src}
                    draggable
                    alt='Inserted image'
                />
                {isSelected && (
                    <>
                        {/* Top */}
                        <div
                            onMouseDown={(e) => startResize(e, "top")}
                            className='absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-300 cursor-n-resize z-10'
                        />
                        {/* Left */}
                        <div
                            onMouseDown={(e) => startResize(e, "left")}
                            className='absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-blue-300 cursor-w-resize z-10'
                        />
                        {/* Bottom */}
                        <div
                            onMouseDown={(e) => startResize(e, "bottom")}
                            className='absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-300 cursor-s-resize z-10'
                        />
                        {/* Right */}
                        <div
                            onMouseDown={(e) => startResize(e, "right")}
                            className='absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-blue-300 cursor-e-resize z-10'
                        />
                        {/* Top right */}
                        <div
                            onMouseDown={(e) => startResize(e, "top-right")}
                            className='absolute -top-1 -right-1 w-2 h-2 bg-blue-300 cursor-ne-resize z-10'
                        />
                        {/* Bottom right */}
                        <div
                            onMouseDown={(e) => startResize(e, "bottom-right")}
                            className='absolute -bottom-1 -right-1 w-2 h-2 bg-blue-300 cursor-se-resize z-10'
                        />
                        {/* Bottom left */}
                        <div
                            onMouseDown={(e) => startResize(e, "bottom-left")}
                            className='absolute -bottom-1 -left-1 w-2 h-2 bg-blue-300 cursor-sw-resize z-10'
                        />
                        {/* Top left */}
                        <div
                            onMouseDown={(e) => startResize(e, "top-left")}
                            className='absolute -top-1 -left-1 w-2 h-2 bg-blue-300 cursor-nw-resize z-10'
                        />

                        {/* Image Menu */}
                        <div className='absolute -top-12 left-0 flex items-center gap-1 p-2 bg-black/90 border border-white/20 rounded-lg shadow-lg backdrop-blur-sm text-white z-20'>
                            <button
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign("left")
                                        .run()
                                }
                                className={`p-1 rounded hover:bg-white/20 ${editor.isActive({ textAlign: "left" }) ? "bg-blue-400/50" : ""}`}
                                title='Align Left'
                            >
                                <svg
                                    className='w-4 h-4'
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                >
                                    <path d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 8a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h8a1 1 0 110 2H4a1 1 0 01-1-1z' />
                                </svg>
                            </button>
                            <button
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign("center")
                                        .run()
                                }
                                className={`p-1 rounded hover:bg-white/20 ${editor.isActive({ textAlign: "center" }) ? "bg-blue-400/50" : ""}`}
                                title='Align Center'
                            >
                                <svg
                                    className='w-4 h-4'
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                >
                                    <path d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM5 8a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM5 16a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z' />
                                </svg>
                            </button>
                            <button
                                onClick={() =>
                                    editor
                                        .chain()
                                        .focus()
                                        .setTextAlign("right")
                                        .run()
                                }
                                className={`p-1 rounded hover:bg-white/20 ${editor.isActive({ textAlign: "right" }) ? "bg-blue-400/50" : ""}`}
                                title='Align Right'
                            >
                                <svg
                                    className='w-4 h-4'
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                >
                                    <path d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM7 8a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1zM3 12a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM7 16a1 1 0 011-1h8a1 1 0 110 2H8a1 1 0 01-1-1z' />
                                </svg>
                            </button>
                            <div className='w-px h-4 bg-white/20 mx-1' />
                            <button
                                onClick={() => deleteNode?.()}
                                className='p-1 rounded hover:bg-red-500/20 text-red-400'
                                title='Delete Image'
                            >
                                <svg
                                    className='w-4 h-4'
                                    fill='currentColor'
                                    viewBox='0 0 20 20'
                                >
                                    <path
                                        fillRule='evenodd'
                                        d='M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </NodeViewWrapper>
    )
}

export default ImageComponent
