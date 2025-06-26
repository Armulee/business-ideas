"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { PollData, SummaryData, WidgetData } from "@/database/Widget"
import { IProfilePopulated } from "@/database/Profile"
import { useSession } from "next-auth/react"
import axios from "axios"

export type NewPost = {
    widgets: WidgetData[]
    setWidgets: React.Dispatch<React.SetStateAction<WidgetData[]>>
    summaries: SummaryData[]
    setSummaries: React.Dispatch<React.SetStateAction<SummaryData[]>>
    profile: IProfilePopulated | null
    pollData: PollData
    setPollData: React.Dispatch<React.SetStateAction<PollData>>
    callToComment: string
    setCallToComment: React.Dispatch<React.SetStateAction<string>>
}

const WidgetForm = createContext<NewPost | null>(null)
export const useWidgetForm = () => useContext(WidgetForm) as NewPost

const Provider = ({ children }: { children: React.ReactNode }) => {
    // get required profile data for profile widget, in order to prevent the state change and unnecessary fetch api, the fetch logic will be place outside the ProfileWidget component due to the sorting widget action.
    const { data: session } = useSession()
    const [profile, setProfile] = useState<IProfilePopulated | null>(null)
    const [widgets, setWidgets] = useState<WidgetData[]>([])
    const [summaries, setSummaries] = useState<SummaryData[]>([])
    const [callToComment, setCallToComment] = useState<string>("")
    const [pollData, setPollData] = useState<PollData>({
        question: "",
        options: [],
    })

    useEffect(() => {
        if (session) {
            const setupProfile = async () => {
                const { data, status } = await axios.get(
                    `/api/profile/${
                        session.user.profile
                    }/${session.user.name?.toLowerCase()}`
                )
                if (status === 200) {
                    setProfile(data)
                }
            }

            if (!profile) {
                setupProfile()
            }
        }
    }, [profile, session])
    return (
        <WidgetForm.Provider
            value={{
                widgets,
                setWidgets,
                summaries,
                setSummaries,
                profile,
                pollData,
                setPollData,
                callToComment,
                setCallToComment,
            }}
        >
            {children}
        </WidgetForm.Provider>
    )
}

export default Provider
