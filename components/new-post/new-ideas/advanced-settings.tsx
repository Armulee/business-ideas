import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { NewPostSchema } from "./types"
import { Control } from "react-hook-form"
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form"

const AdvancedSettings = ({ control }: { control: Control<NewPostSchema> }) => {
    return (
        <div className='p-4 w-full glassmorphism bg-transparent'>
            <h3 className='text-lg font-semibold mb-3'>Advanced Settings</h3>
            <div className='space-y-4 pb-2'>
                <FormField
                    control={control}
                    name='advancedSettings.privacy'
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex items-center'>
                                <FormLabel className='mr-3'>Privacy:</FormLabel>
                                <Select
                                    value={field.value}
                                    onValueChange={field.onChange}
                                >
                                    <FormControl>
                                        <SelectTrigger className='w-fit select'>
                                            <SelectValue placeholder='Privacy Settings' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='public'>
                                            Public
                                        </SelectItem>

                                        <SelectItem value='followers'>
                                            Followers Only
                                        </SelectItem>

                                        <SelectItem value='onlyYou'>
                                            Only You
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name='advancedSettings.allowComments'
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex items-center'>
                                <FormLabel className='mr-3'>
                                    Allow Comments:
                                </FormLabel>
                                <FormControl>
                                    <Checkbox
                                        className='glassmorphism bg-transparent !rounded'
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name='advancedSettings.hideViewCount'
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex items-center'>
                                <FormLabel className='mr-3'>
                                    Hide View Count:
                                </FormLabel>
                                <FormControl>
                                    <Checkbox
                                        className='glassmorphism bg-transparent !rounded'
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </div>
                        </FormItem>
                    )}
                />

                <FormField
                    control={control}
                    name='advancedSettings.hideVoteCount'
                    render={({ field }) => (
                        <FormItem>
                            <div className='flex items-center'>
                                <FormLabel className='mr-3'>
                                    Hide Vote Count:
                                </FormLabel>
                                <FormControl>
                                    <Checkbox
                                        className='glassmorphism bg-transparent !rounded'
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                </FormControl>
                            </div>
                        </FormItem>
                    )}
                />
            </div>
        </div>
    )
}

export default AdvancedSettings
