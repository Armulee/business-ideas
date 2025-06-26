"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import Posts from "./posts"
import Loading from "../loading"
import type { IPostPopulated } from "@/database/Post"
import AnimatedBackground from "./animated-background"
import Hero from "./hero"
import About from "./about"
import WhyJoinUs from "./why-join-us"
import HowItWorks from "./how-it-works"
import CTA from "./cta"

const Home = () => {
    const [loading, setLoading] = useState<boolean>(true)
    const [latestPosts, setLatestPosts] = useState<IPostPopulated[]>([])
    const [topVotedPosts, setTopVotedPosts] = useState<IPostPopulated[]>([])

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios.get("/api/posts/new-ideas")
                setLatestPosts(data.latestPosts)
                setTopVotedPosts(data.topVotedPosts)
                setLoading(false)
            } catch (err) {
                throw new Error(
                    `Failed to load top posts: ${(err as Error).message}`
                )
            }
        }

        fetchPosts()
    }, [])

    if (loading) return <Loading />

    return (
        <div className='pb-28'>
            {/* Hero Section with Animated Background */}
            <section className='relative pt-28 pb-16 overflow-hidden'>
                {/* Animated background elements */}
                <AnimatedBackground />
                <Hero />
            </section>

            {/* Posts Section */}
            <section className='relative z-10 py-12 '>
                <Posts
                    latestPosts={latestPosts}
                    topVotedPosts={topVotedPosts}
                />
            </section>

            {/* Features Section */}
            <section className='relative py-16'>
                <About />
            </section>

            {/* Why Join Us Section */}
            <section className='py-16 relative'>
                <div className='max-w-6xl mx-auto px-4 grid md:grid-cols-2 gap-12'>
                    <WhyJoinUs />
                    <HowItWorks />
                </div>
            </section>

            {/* CTA Section */}
            <section className='py-16 relative'>
                <CTA />
            </section>
        </div>
    )
}

export default Home
