import { Node, mergeAttributes } from "@tiptap/core"

const Video = Node.create({
    name: "video",
    group: "block",
    selectable: true,
    draggable: true,

    addAttributes() {
        return {
            src: { default: null },
        }
    },

    parseHTML() {
        return [{ tag: "video" }]
    },

    renderHTML({ HTMLAttributes }) {
        return ["video", mergeAttributes(HTMLAttributes, { controls: true })]
    },
})

export default Video
