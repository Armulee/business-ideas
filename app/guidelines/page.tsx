import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck } from "lucide-react"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: "Community Guidelines | BlueBizHub",
    description:
        "Our community guidelines to keep BlueBizHub a supportive, constructive place for entrepreneurs.",
}

const guidelines = [
    {
        topic: "Relevance of Content",
        description:
            "Discussions must focus solely on topics related to business, entrepreneurship, innovation, and market validation.",
        action: "Relocation or deletion of off-topic content and reduced visibility for persistent violations.",
    },
    {
        topic: "Respect and Professionalism",
        description:
            "Members must interact respectfully and professionally. Personal attacks, offensive language, or inappropriate conduct are strictly prohibited.",
        action: "Removal of content, reduction in visibility, temporary suspension, or permanent account termination.",
    },
    {
        topic: "Constructive Feedback Requirement",
        description:
            "All feedback must be actionable, constructive, and solution-focused. Negative or destructive criticism without constructive intent is not permitted.",
        action: "Editing or removal of feedback; repeated violations may result in restricted account privileges.",
    },
    {
        topic: "Prohibition of Spam and Promotional Content",
        description:
            "Members shall not post unsolicited promotions, advertisements, affiliate links, or irrelevant material.",
        action: "Immediate removal of offending content, account warnings, temporary suspensions, or permanent bans.",
    },
    {
        topic: "Intellectual Property Protection",
        description:
            " Members must only share original ideas or content for which they have explicit ownership or rights.",
        action: "Immediate removal of infringing content, reduced visibility, and potential permanent bans for repeated violations.",
    },
    {
        topic: "Zero Tolerance for Hate Speech and Discrimination",
        description:
            "Hateful, discriminatory, abusive, or threatening content and behavior are strictly prohibited.",
        action: " Immediate content removal, permanent account termination, and potential legal proceedings if warranted.",
    },
    {
        topic: "Privacy Protection",
        description:
            "Members must not share private or personally identifiable information without explicit consent.",
        action: "Immediate content removal, temporary suspension, or permanent ban based on severity.",
    },
    {
        topic: "Prohibition of Manipulative Engagement",
        description:
            "Artificially inflating engagement or visibility through bots, fake accounts, or deceptive techniques is forbidden.",
        action: "Immediate content removal, reduced account visibility, account warning or permanent bans for violations.",
    },
    {
        topic: "Mandatory Transparent Disclosures",
        description:
            "Members must clearly disclose any relationships, affiliations, or sponsorships that influence their contributions.",
        action: "Flagging content for required edits, reduced visibility, and suspension or termination of accounts for repeated violations.",
    },
    {
        topic: "Compliance with Moderation",
        description:
            "Members are required to comply fully with moderator decisions and instructions. Defiance or disruption of moderation processes is prohibited.",
        action: "Temporary suspension, reduction in privileges, or possible permanent account termination for repeated non-compliance.",
    },
]

export default function GuidelinesPage() {
    return (
        <Card className='max-w-3xl mx-auto mt-20 mb-28 border-0 bg-transparent shadow-none'>
            <CardHeader className='text-center'>
                <CardTitle className='text-blue-200 flex items-center justify-center space-x-2 text-2xl font-semibold'>
                    <ShieldCheck className='w-6 h-6' />
                    <h2>Community Guidelines</h2>
                </CardTitle>
            </CardHeader>
            <CardContent className='space-y-4 text-white'>
                <p className='indent-4'>
                    Welcome to{" "}
                    <strong>
                        <span className='text-blue-400'>Blue</span>
                        BizHub
                    </strong>
                    , the vibrant community dedicated to fostering innovation,
                    entrepreneurship, and collaboration.
                </p>
                <p className='indent-4'>
                    Our goal is to provide a safe, respectful, and productive
                    environment where users can openly share, discuss, refine,
                    and validate their business concepts. To ensure our
                    community remains valuable, inclusive, and supportive for
                    all members, we have established a clear set of community
                    guidelines.
                </p>

                <p className='indent-4'>
                    These guidelines are designed to support productive
                    interactions, protect member privacy and intellectual
                    property, and maintain a positive atmosphere that enables
                    all members to share, learn, and grow together. Adhering to
                    these guidelines helps us collectively build a thriving
                    ecosystem where ideas flourish, relationships strengthen,
                    and innovation drives meaningful progress.
                </p>

                <p>
                    Please take a moment to carefully review and understand the
                    following community guidelines:
                </p>

                <ul className='list-inside'>
                    {guidelines.map((guideline, key) => (
                        <li className='mb-6' key={key}>
                            <strong className='text-blue-200'>
                                {key + 1}. {guideline.topic}:
                            </strong>{" "}
                            {guideline.description}
                            <div className='mt-2 text-xs text-red-300 glassmorphism px-2 py-1 w-fit'>
                                <strong>Enforcement: </strong>
                                {guideline.action}
                            </div>
                        </li>
                    ))}
                </ul>

                <p className='indent-4'>
                    By respecting and following these guidelines, you help
                    ensure{" "}
                    <strong>
                        <span className='text-blue-400'>Blue</span>
                        BizHub
                    </strong>{" "}
                    remains a supportive, dynamic, and effective community
                    dedicated to nurturing innovative business ideas and
                    meaningful collaboration.
                </p>

                <p>
                    Thank you for contributing positively to our shared
                    community space.
                </p>
            </CardContent>
        </Card>
    )
}
