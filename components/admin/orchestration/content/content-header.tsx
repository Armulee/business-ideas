"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function ContentHeader() {
    return (
        <Card className='glassmorphism mx-auto bg-transparent'>
            <CardHeader>
                <CardTitle className='text-white text-2xl'>
                    Content Orchestration
                </CardTitle>
                <CardDescription>
                    This Orchestration is making by Make (Integromat) which
                    using 2 prompts to generate a content by Antrophic Claude
                    Sonnet 4 and refine the content to OpenAI Chatgpt 4 to post
                    in the various social medias automatically.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p className='text-white/70 text-xs'>
                    After setting the prompts, make a deployment to vercel and
                    then you can wait for the results at 8PM everyday.{" "}
                    <span className='text-red-400'>
                        Do not press the &quot;Instantly generate content&quot;
                        button frequently,
                    </span>{" "}
                    this is for quickly generating test content.
                </p>
            </CardContent>
        </Card>
    )
}
