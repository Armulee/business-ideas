import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Control, ControllerRenderProps } from "react-hook-form"
import { ProfileFormValues } from "../types"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import React, { useEffect, useState } from "react"
import locationData from "countrycitystatejson"

type Countries = {
    shortName: string
    name: string
    native: string
    phone: string
    continent: string
    capital: string
    currency: string
    languages: string[]
    emoji: string
    emojiU: string
}

const EditLocation = ({
    control,
    defaultLocation,
}: {
    control: Control<ProfileFormValues>
    defaultLocation: string | undefined
}) => {
    const countries = locationData.getCountries()
    const [country, setCountry] = useState<string>("")
    const [countryCode, setCountryCode] = useState<string>("")
    const [states, setStates] = useState<string[]>([])
    const [state, setState] = useState<string>("")

    useEffect(() => {
        // Split the default location into state and country
        const parts = defaultLocation?.split(", ").reverse()
        if (parts?.length) {
            const [countryPart, statePart] = parts
            setCountry(countryPart)
            setState(statePart)

            // Find the country code
            const foundCountryCode =
                countries.find(
                    (c: { name: string; shortName: string }) =>
                        c.name === countryPart
                )?.shortName || ""

            setCountryCode(foundCountryCode) // This will trigger the second useEffect
        }
    }, [defaultLocation, countries])

    useEffect(() => {
        // If the countryCode is set, update the states
        if (countryCode) {
            const stateDatas = locationData.getStatesByShort(countryCode)
            setStates(stateDatas)
        }
    }, [countryCode]) // Only run this effect when countryCode changes

    const onCountry = (
        value: string,
        field: ControllerRenderProps<ProfileFormValues>
    ) => {
        setCountryCode(value)
        const selectedCountry =
            countries.find((c: Countries) => c.shortName === value)?.name || ""
        setCountry(selectedCountry)

        // Update the form value with "state, country"
        field.onChange(state ? `${state}, ${selectedCountry}` : selectedCountry)
    }

    const onState = (
        value: string,
        field: ControllerRenderProps<ProfileFormValues>
    ) => {
        setState(value)

        // Update the form value with "state, country"
        field.onChange(`${value}, ${country}`)
    }
    return (
        <FormField
            control={control}
            name='location'
            render={({ field }) => (
                <FormItem>
                    <FormLabel className='text-white'>Location</FormLabel>
                    <div className='flex items-end gap-2'>
                        <div className='min-w-60'>
                            <FormControl>
                                <Select
                                    value={countryCode} // Default selected value for country
                                    onValueChange={(value) =>
                                        onCountry(value, field)
                                    }
                                >
                                    <SelectTrigger className='select'>
                                        <SelectValue placeholder='Select a country' />
                                    </SelectTrigger>
                                    <SelectContent className='bg-white text-black max-h-60 overflow-y-auto'>
                                        <SelectItem value='none'>
                                            None
                                        </SelectItem>
                                        {countries.map(
                                            ({
                                                name,
                                                shortName,
                                            }: {
                                                name: string
                                                shortName: string
                                            }) => (
                                                <SelectItem
                                                    key={name}
                                                    value={shortName}
                                                >
                                                    {name}
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        </div>

                        {states && states.length ? (
                            <div className='min-w-60'>
                                <FormControl>
                                    <Select
                                        value={state} // Default selected value for state
                                        onValueChange={(value) =>
                                            onState(value, field)
                                        }
                                    >
                                        <SelectTrigger className='select'>
                                            <SelectValue placeholder='Select a city' />
                                        </SelectTrigger>
                                        <SelectContent className='bg-white text-black max-h-60 overflow-y-auto'>
                                            {states.map((state) => (
                                                <SelectItem
                                                    key={state}
                                                    value={state}
                                                >
                                                    {state}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            </div>
                        ) : null}
                    </div>
                    <FormDescription className='text-gray-300'>
                        Where you&apos;re based (optional).
                    </FormDescription>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}

export default EditLocation
