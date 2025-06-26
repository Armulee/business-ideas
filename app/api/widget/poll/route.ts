import connectDB from "@/database"
import Widget, { IWidgets, PollData } from "@/database/Widget"
import { NextResponse } from "next/server"

export async function PATCH(req: Request) {
    try {
        const { post, user, optionId } = await req.json()
        if (!post || !user || !optionId) {
            return NextResponse.json(
                { message: "Missing the required parameters" },
                { status: 400 }
            )
        }

        await connectDB()

        const widget: IWidgets | null = await Widget.findOne({ post })

        if (!widget) {
            return NextResponse.json(
                { message: "Widget Not Found" },
                { status: 404 }
            )
        }

        const quickPoll = widget.widgets.find((w) => w.type === "quickPoll")!
            .data as PollData

        // Check if the user has already voted (before modifying anything)
        const hasVoted = quickPoll.options.some((opt) => {
            if (opt.id === optionId) {
                return opt.vote.includes(user)
            }
        })

        // Remove the user from all options first
        quickPoll.options.forEach((opt) => {
            opt.vote = opt.vote.filter((v) => v !== user)
        })

        // If they hadn't voted before, add their vote to the selected option
        if (!hasVoted) {
            const option = quickPoll.options.find((o) => o.id === optionId)
            if (!option) {
                return NextResponse.json(
                    { message: "optionId is wrong" },
                    { status: 404 }
                )
            }

            option.vote.push(user)
        }

        widget.markModified("widgets")
        await widget.save()

        return NextResponse.json(
            { message: "Vote poll completed" },
            { status: 200 }
        )
    } catch (err) {
        console.error(err)
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        )
    }
}
