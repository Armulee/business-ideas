import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Community Rules | BlueBizHub",
    description:
        "Our community guidelines to keep BlueBizHub a supportive, constructive place for entrepreneurs.",
}

const rules = [
    {
        topic: "Respect & Professionalism",
        description:
            "Engage with others respectfully and professionally. Avoid personal attacks, disrespectful language, or inappropriate behavior.",
        action: "Comments removed, visibility reduced, temporary or permanent ban.",
    },
    {
        topic: "Constructive Feedback Only",
        description:
            "Provide actionable suggestions. Negative criticism must be constructive and solution-oriented.",
        action: "Feedback edited or removed; repeat offenders may face reduced visibility or temporary restrictions.",
    },
    {
        topic: "No Spam or Promotion",
        description:
            "Avoid unsolicited promotions, ads, affiliate links, or irrelevant content.",
        action: "Immediate removal of posts/comments, account warnings, temporary suspensions, or permanent bans.",
    },
    {
        topic: "Protect Intellectual Property",
        description:
            "Only post original ideas or content you own or have permission to use.",
        action: "Removal of infringing content, reduced visibility, repeat violations leading to bans.",
    },
    {
        topic: "No Hate Speech or Discrimination",
        description:
            "Zero tolerance for hateful, discriminatory, abusive, or threatening behavior.",
        action: "Immediate removal, permanent account ban, and potential legal action if necessary.",
    },
    {
        topic: "Maintain Relevance",
        description:
            "Keep discussions related to business, entrepreneurship, innovation, and market validation.",
        action: "Off-topic posts moved or deleted, reduced visibility for persistent off-topic posting.",
    },
    {
        topic: "Respect Privacy",
        description:
            "Never share private information about yourself or others without explicit consent.",
        action: "Immediate content removal, temporary suspension, or permanent ban depending on severity.",
    },
    {
        topic: "No Manipulative Engagement",
        description:
            "Avoid artificially inflating engagement or visibility through bots, fake accounts, or deceptive methods.",
        action: "Content removal, immediate visibility reduction, permanent ban.",
    },
    {
        topic: "Transparent Disclosures",
        description:
            "Clearly disclose relationships or sponsorships when relevant.",
        action: "Content flagged for edit, reduced visibility, repeated non-disclosure can result in account suspension.",
    },
    {
        topic: "Comply with Moderation",
        description:
            "Follow moderator instructions. Arguing or defying moderation decisions disrupts the community.",
        action: "Temporary suspension, reduced privileges, and possible permanent ban for repeated offenses.",
    },
]

export default function RulesPage() {
    return (
        <Card className='max-w-3xl mx-auto mt-20 mb-28 border-0 bg-transparent shadow-none'>
            <CardHeader className='text-center'>
                <CardTitle className='text-blue-200 flex items-center justify-center space-x-2 text-2xl font-semibold'>
                    <ShieldCheck className='w-6 h-6' />
                    <h2>Community Rules</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-white'>
                <ul className='list-inside'>
                    {rules.map((rule, key) => (
                        <li className='mb-6' key={key}>
                            <strong className='text-blue-200'>
                                {key + 1}. {rule.topic}:
                            </strong>{" "}
                            {rule.description}
                            <div className='mt-2 text-sm text-red-300 glassmorphism px-2 py-1 w-fit'>
                                Action: {rule.action}
                            </div>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
