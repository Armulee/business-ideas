"use client"
// import axios from "axios"
// import { useEffect, useState } from "react"
import Link from "next/link"
import { categories } from "../store"

const Categories = () => {
    // const [categories, setCategories] = useState<
    //     { name: string; id: number }[] | undefined
    // >(undefined)
    // useEffect(() => {
    //     const fetchCategories = async () => {
    //         const rawData = await axios.get("/api/get/categories")
    //         setCategories(rawData.data)
    //     }

    //     fetchCategories()
    // }, [])

    return (
        <div className='text-center'>
            <h3 className='text-2xl font-bold mb-2'>
                Search from the categories
            </h3>
            <p className='text-sm mb-8'>
                Not sure where to start? Browse by category and get inspired!
            </p>
            {categories !== undefined && categories.length && (
                <ul className='grid grid-cols-2 gap-2 pb-6 w-[85%] mx-auto'>
                    {categories.map(({ name, id }) => (
                        <Link
                            href={`/category?id=${id}`}
                            key={`category-${id}`}
                        >
                            <li className='glassmorphism text-sm p-2 transition duration-300 hover:bg-white hover:text-blue-700'>
                                {name}
                            </li>
                        </Link>
                    ))}
                </ul>
            )}
        </div>
    )
}

export default Categories
