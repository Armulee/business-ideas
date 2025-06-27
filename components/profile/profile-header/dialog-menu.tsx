import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState } from "react"
import UsersListContent from "./user-list"
import { useProfile } from ".."

const DialogShowFollowMenu = () => {
    const { followers, followings } = useProfile()
    const [value, setValue] = useState<string>("")

    return (
        <Dialog>
            <DialogTrigger onClick={() => setValue("followers")}>
                <span className='font-bold'>{followers.length}</span> Followers
            </DialogTrigger>
            <DialogTrigger onClick={() => setValue("followings")}>
                <span className='font-bold'>{followings.length}</span> Following
            </DialogTrigger>
            <DialogContent className='rounded-lg text-black'>
                <Tabs defaultValue={value} onValueChange={setValue}>
                    <DialogHeader>
                        <DialogTitle className='sr-only'>
                            Following and Followers
                        </DialogTitle>
                        <TabsList className='bg-transparent justify-start'>
                            <TabsTrigger
                                value='followers'
                                className='data-[state=active]:shadow-none data-[state=active]:underline data-[state=active]:underline-offset-4'
                            >
                                Followers
                            </TabsTrigger>
                            <TabsTrigger
                                value='followings'
                                className='data-[state=active]:shadow-none data-[state=active]:underline data-[state=active]:underline-offset-4'
                            >
                                Following
                            </TabsTrigger>
                        </TabsList>
                    </DialogHeader>
                    <UsersListContent
                        tabValue={value as "followers" | "followings"}
                    />
                </Tabs>
            </DialogContent>
        </Dialog>
    )
}

export default DialogShowFollowMenu
