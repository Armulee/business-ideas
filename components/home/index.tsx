"use client"

import About from "./about"
import Categories from "./categories"
// import { useMediaQuery } from "usehooks-ts"
// import { Idea, ideas } from "./Ideas"
import Hero from "./hero"
// import { useEffect, useMemo, useState } from "react"

const Homepage = () => {
    // const shuffleArray = (array: Idea[]) => {
    //     return (
    //         [...array]
    //             .map((item) => ({ ...item, sort: Math.random() }))
    //             .sort((a, b) => a.sort - b.sort)
    //             //eslint-disable-next-line
    //             .map(({ sort, ...item }) => item)
    //     )
    // }

    // Trending Ideas
    // const sortedIdeas = useMemo(
    //     () => [...ideas].sort((a, b) => b.upvotes - a.upvotes),
    //     []
    // )
    // const trendingIdeas = sortedIdeas.slice(0, 6)

    // Featured Ideas
    // const [featuredIdeas, setFeaturedIdeas] = useState<Ideas>([])
    // const [randomCategories, setRandomCategories] = useState<string[]>([])
    // const matches = useMediaQuery("(min-width: 768px)")
    // useEffect(() => {
    //     const remainingIdeas = sortedIdeas.slice(6)
    //     const shuffleIdeas = shuffleArray(remainingIdeas)
    //     // setFeaturedIdeas(shuffleIdeas.slice(0, 6))
    //     setRandomCategories([
    //         ...new Set(shuffleIdeas.map((idea) => idea.category)),
    //     ])
    // }, [sortedIdeas])

    // AI Ideas
    // const aiIdeas = ideas.slice(0, 6)
    return (
        <>
            <section className='bg-gradient-to-b from-blue-500 to-blue-700 pb-8 text-white'>
                <Hero />
                <div className='w-full h-[2px] bg-white/20 my-6' />
                <About />
                {/* <IdeaList title='Trending Ideas' ideas={trendingIdeas} /> */}
                {/* <IdeaList title='AI Ideas' ideas={aiIdeas} /> */}
            </section>
            <section className='bg-gradient-to-b from-blue-700 to-blue-500 pb-8 text-white'>
                <Categories />
            </section>
        </>
    )
}

export default Homepage
