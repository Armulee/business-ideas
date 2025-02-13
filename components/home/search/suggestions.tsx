import Link from "next/link"
import { Idea } from "../Ideas"

const Suggestions = ({
    suggestions,
    showSuggestions,
}: {
    suggestions: Idea[]
    showSuggestions: boolean
}) => {
    return (
        <>
            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
                <ul className='absolute w-full h-fit max-h-[300px] bg-blue-500 text-black shadow-md rounded-md mt-1 max-h-48 overflow-auto z-50'>
                    {suggestions.map((suggestion, index) => (
                        <Link
                            key={`suggestion-${index}`}
                            href={`/post?id=${suggestion.id}`}
                        >
                            <li className='border h-fit p-2 glassmorphism text-white my-1 cursor-pointer hover:bg-gray-200 hover:text-blue-800'>
                                {suggestion.title}
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
        </>
    )
}

export default Suggestions
