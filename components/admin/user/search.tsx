import { Search, CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

interface SearchFiltersProps {
    search: string
    setSearch: (search: string) => void
    startDate?: Date
    setStartDate: (date: Date | undefined) => void
    endDate?: Date
    setEndDate: (date: Date | undefined) => void
    debouncedSearch: string
}

export function SearchFilters({
    search,
    setSearch,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    debouncedSearch,
}: SearchFiltersProps) {
    return (
        <div className='flex flex-col md:flex-row gap-4'>
            <div className='relative flex-1'>
                <Search className='absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/50 z-10' />
                <Input
                    placeholder='Search by name or email...'
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className='input text-white pl-8 text-sm placeholder:text-sm'
                />
                {search !== debouncedSearch && (
                    <div className='absolute right-3 top-3'>
                        <div className='h-4 w-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin' />
                    </div>
                )}
            </div>

            {/* Date Range Filter */}
            <div className='flex gap-2'>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant='outline'
                            className={cn(
                                "button",
                                !startDate && "!text-gray-400"
                            )}
                        >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {startDate ? format(startDate, "PPP") : "Start date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0 border-0 rounded-lg'>
                        <Calendar
                            mode='single'
                            className='bg-gray-800 rounded text-white'
                            selected={startDate}
                            onSelect={setStartDate}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                        />
                    </PopoverContent>
                </Popover>

                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant='outline'
                            className={cn(
                                "button",
                                !endDate && "!text-gray-400"
                            )}
                        >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {endDate ? format(endDate, "PPP") : "End date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0 border-0 rounded-lg'>
                        <Calendar
                            mode='single'
                            className='bg-gray-800 rounded text-white'
                            selected={endDate}
                            onSelect={setEndDate}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                        />
                    </PopoverContent>
                </Popover>

                {(startDate || endDate) && (
                    <Button
                        variant='ghost'
                        onClick={() => {
                            setStartDate(undefined)
                            setEndDate(undefined)
                        }}
                        className='text-white hover:bg-white/20'
                    >
                        Clear
                    </Button>
                )}
            </div>
        </div>
    )
}