import FlowCarousel from "@/components/ui/flow-carousel"
import { SwiperSlide } from "swiper/react"
import IdeaCard from "./idea-card"

export interface Idea {
    id: number
    title: string
    category: string
    upvotes: number
    description: string
}

const IdeaList = ({ ideas, title }: { ideas: Idea[]; title: string }) => {
    const breakpoint = {
        600: { slidesPerView: 2, spaceBetween: 10 },
        950: { slidesPerView: 3, spaceBetween: 10 },
        1280: { slidesPerView: 4, spaceBetween: 10 },
    }
    return (
        <>
            <div className='container mx-auto mt-6 px-4 sm:px-6 lg:px-8'>
                <h2 className='text-3xl font-bold mb-6 text-white'>{title}</h2>
            </div>

            <FlowCarousel
                scrollbar
                className='h-[275px]'
                breakpoint={breakpoint}
            >
                {ideas.map((idea, index) => (
                    <SwiperSlide key={`swiper-trending-idea-${index}`}>
                        <IdeaCard
                            className='h-[90%]'
                            key={idea.id}
                            idea={idea}
                        />
                    </SwiperSlide>
                ))}
            </FlowCarousel>
        </>
    )
}

export default IdeaList

export const ideas = [
    {
        id: 1,
        title: "AI-Powered Personal Stylist",
        category: "Fashion Tech",
        upvotes: 256,
        description:
            "An app that uses AI to analyze your body type, style preferences, and existing wardrobe to provide personalized fashion recommendations and shopping suggestions.",
    },
    {
        id: 2,
        title: "Sustainable Food Delivery",
        category: "Food & Sustainability",
        upvotes: 189,
        description:
            "A food delivery service that focuses on zero-waste packaging and partners with local restaurants to reduce food waste and promote sustainable eating habits.",
    },
    {
        id: 3,
        title: "Virtual Reality Fitness Classes",
        category: "Health & Fitness",
        upvotes: 145,
        description:
            "A VR platform that offers immersive fitness classes led by top trainers, allowing users to work out in stunning virtual environments from the comfort of their homes.",
    },
    {
        id: 4,
        title: "Blockchain-Based Voting System",
        category: "Civic Tech",
        upvotes: 312,
        description:
            "A secure and transparent voting system using blockchain technology to ensure the integrity of elections and increase voter participation.",
    },
    {
        id: 5,
        title: "Augmented Reality Education Platform",
        category: "EdTech",
        upvotes: 278,
        description:
            "An AR-powered platform that brings textbooks to life, allowing students to interact with 3D models and visualizations for enhanced learning experiences.",
    },
    {
        id: 6,
        title: "Smart Fridge Food Tracker",
        category: "Smart Home",
        upvotes: 234,
        description:
            "A smart fridge system that scans barcodes and tracks expiration dates, suggesting recipes based on available ingredients to reduce food waste.",
    },
    {
        id: 7,
        title: "AI-Powered Resume Builder",
        category: "Career & Productivity",
        upvotes: 198,
        description:
            "An AI tool that generates personalized resumes and cover letters based on job descriptions, optimizing them for applicant tracking systems.",
    },
    {
        id: 8,
        title: "Crowdsourced Travel Planning App",
        category: "Travel & Tourism",
        upvotes: 165,
        description:
            "An app that lets users build custom travel itineraries based on real experiences and recommendations from other travelers.",
    },
    {
        id: 9,
        title: "On-Demand Drone Delivery Service",
        category: "Logistics & Delivery",
        upvotes: 322,
        description:
            "A drone-based delivery service that provides ultra-fast shipping for small packages, groceries, and urgent medical supplies.",
    },
    {
        id: 10,
        title: "AI-Based Mental Health Companion",
        category: "Health & Wellness",
        upvotes: 287,
        description:
            "A chatbot that provides emotional support, mood tracking, and guided meditation based on real-time sentiment analysis.",
    },
    {
        id: 11,
        title: "Hyperlocal Community Marketplace",
        category: "E-Commerce",
        upvotes: 173,
        description:
            "A platform where neighbors can buy, sell, or trade products and services within their local communities to support small businesses and reduce carbon footprints.",
    },
    {
        id: 12,
        title: "Personalized Home Workout AI Coach",
        category: "Health & Fitness",
        upvotes: 211,
        description:
            "An AI-powered virtual trainer that adapts workouts in real time based on user progress, injuries, and fitness goals.",
    },
    {
        id: 13,
        title: "Biodegradable Smart Packaging",
        category: "Eco-Tech",
        upvotes: 255,
        description:
            "Sustainable packaging with embedded QR codes that educate consumers on proper disposal methods and eco-friendly alternatives.",
    },
    {
        id: 14,
        title: "Voice-Controlled Smart Mirror",
        category: "Smart Home",
        upvotes: 289,
        description:
            "A smart mirror that integrates with voice assistants to provide news updates, weather forecasts, and personal grooming recommendations.",
    },
    {
        id: 15,
        title: "AI-Powered Legal Assistant",
        category: "Legal Tech",
        upvotes: 190,
        description:
            "A virtual AI lawyer that helps users draft contracts, understand legal jargon, and receive instant guidance on common legal issues.",
    },
    {
        id: 16,
        title: "Gamified Learning App for Kids",
        category: "EdTech",
        upvotes: 231,
        description:
            "An interactive learning platform that turns education into an engaging game, rewarding kids for completing lessons and challenges.",
    },
    {
        id: 17,
        title: "Solar-Powered Smart Bench",
        category: "Green Tech",
        upvotes: 276,
        description:
            "A public smart bench that provides wireless charging, Wi-Fi, and environmental monitoring powered by solar energy.",
    },
    {
        id: 18,
        title: "AI-Powered Music Composition App",
        category: "Entertainment Tech",
        upvotes: 187,
        description:
            "An app that uses AI to generate original music compositions based on user preferences and musical influences.",
    },
    {
        id: 19,
        title: "NFT-Based Digital Art Marketplace",
        category: "Blockchain & Crypto",
        upvotes: 258,
        description:
            "A marketplace for artists to mint and sell NFTs while providing buyers with proof of ownership and authenticity.",
    },
    {
        id: 20,
        title: "Smart Waste Sorting Bin",
        category: "Sustainability",
        upvotes: 308,
        description:
            "An AI-powered waste bin that automatically sorts recyclables, compost, and trash to improve waste management and recycling efficiency.",
    },
]
