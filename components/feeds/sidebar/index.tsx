"use client"

import NewIdea from "./new-idea"
// import Filter from "./filter"
// import Activity from "./activity"
import Tags from "./tags"
import Contributors from "./contributors"
import Announcements from "./annoucements"
import React from "react"
import { PopularTags, TopContributors } from ".."

const FeedsSidebar = ({
    // sortBy,
    // setSortBy,
    // category,
    // setCategory,
    popularTags,
    topContributors,
    hiddenAnnoucement,
}: {
    // sortBy: string
    // setSortBy: React.Dispatch<React.SetStateAction<string>>
    // category: string
    // setCategory: React.Dispatch<React.SetStateAction<string>>
    popularTags: PopularTags
    topContributors: TopContributors
    hiddenAnnoucement: boolean
}) => {
    return (
        <>
            {/* Submit New Idea Button */}
            <NewIdea />

            {/* Your Activity - Only show if logged in */}
            {/* <Activity /> */}
            {/* Top Contributors */}
            <Contributors topContributors={topContributors} />
            {/* Popular Tags */}
            <Tags popularTags={popularTags} />
            {/* Announcements */}
            <Announcements hidden={hiddenAnnoucement} />
        </>
    )
}

export default FeedsSidebar
