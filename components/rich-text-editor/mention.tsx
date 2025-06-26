"use client"

import React from "react"
import type { NodeViewProps } from "@tiptap/react"

interface MentionAttrs {
    id: string
    label: string
}

interface MentionProps extends NodeViewProps {
    node: NodeViewProps["node"] & { attrs: MentionAttrs }
}

export const Mention: React.FC<MentionProps> = ({ node }) => {
    return (
        <a
            href={`/user/${node.attrs.id}`}
            className='text-blue-500 hover:underline cursor-pointer'
        >
            @{node.attrs.label}
        </a>
    )
}
