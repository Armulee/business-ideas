"use client"

import { useState, useEffect } from "react"
import { Control, useWatch } from "react-hook-form"
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { getCountries } from "countrycitystatejson"
import { NewPostSchema } from "../types"

interface CountryData {
    name: string
    shortName: string
    continent?: string
}

interface RegionSelectionProps {
    control: Control<NewPostSchema>
}

export default function RegionSelection({ control }: RegionSelectionProps) {
    const [availableCountries, setAvailableCountries] = useState<
        Array<{ code: string; name: string }>
    >([])
    const watchedRegion = useWatch({
        control,
        name: "advancedSettings.targetRegion",
    })

    useEffect(() => {
        if (watchedRegion && watchedRegion !== "worldwide") {
            // Get countries for the selected region
            const allCountries = getCountries()

            const regionCountries = allCountries.filter(
                (country: CountryData) => {
                    // Map regions to continent codes from countrycitystatejson
                    const regionMapping: { [key: string]: string[] } = {
                        "north-america": ["NA"], // North America
                        "south-america": ["SA"], // South America
                        europe: ["EU"], // Europe
                        asia: ["AS"], // Asia
                        africa: ["AF"], // Africa
                        oceania: ["OC"], // Oceania
                    }

                    return regionMapping[watchedRegion]?.includes(
                        country.continent || ""
                    )
                }
            )

            setAvailableCountries(
                regionCountries.map((country: CountryData) => ({
                    code: country.shortName,
                    name: country.name,
                }))
            )
        } else {
            setAvailableCountries([])
        }
    }, [watchedRegion])

    return (
        <div className='mt-4'>
            <div className='flex flex-wrap items-center gap-3'>
                <FormField
                    control={control}
                    name='advancedSettings.targetRegion'
                    render={({ field }) => {
                        return (
                            <FormItem>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className='select w-fit'>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem
                                            value='worldwide'
                                            defaultChecked
                                        >
                                            Worldwide
                                        </SelectItem>
                                        <SelectItem value='north-america'>
                                            North America
                                        </SelectItem>
                                        <SelectItem value='south-america'>
                                            South America
                                        </SelectItem>
                                        <SelectItem value='europe'>
                                            Europe
                                        </SelectItem>
                                        <SelectItem value='asia'>
                                            Asia
                                        </SelectItem>
                                        <SelectItem value='africa'>
                                            Africa
                                        </SelectItem>
                                        <SelectItem value='oceania'>
                                            Oceania
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )
                    }}
                />

                {availableCountries.length > 0 && (
                    <FormField
                        control={control}
                        name='advancedSettings.targetCountry'
                        render={({ field }) => (
                            <FormItem>
                                <Select
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className='select w-fit'>
                                            <SelectValue placeholder='Select country' />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value='any'>
                                            Any country in region
                                        </SelectItem>
                                        {availableCountries.map((country) => (
                                            <SelectItem
                                                key={country.code}
                                                value={country.code}
                                            >
                                                {country.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
            </div>

            {/* Dynamic description based on whether country dropdown is visible */}
            <FormDescription className='text-white/60 mt-2'>
                {availableCountries.length > 0
                    ? "Choose your target country for this business audience. (optional)"
                    : "Choose your target region for this business audience."}
            </FormDescription>
        </div>
    )
}
