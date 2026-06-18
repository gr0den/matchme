import { useEffect, useState } from "react"
import NavBar from "../../../shared/components/ui/navbar/navbar"
import RecommendationCard from "../components/RecommendationCard"
import { getRecommendations, getRecommendedUser } from "../api/recommendationsApi"
import type { RecommendedUser } from "../types/recommendationTypes"

export default function RecommendationsPage() {
    const [recommendationIds, setRecommendationIds] = useState<number[]>([])
    const [currentIndex, setCurrentIndex] = useState(0)
    const [currentUser, setCurrentUser] = useState<RecommendedUser | null>(null)
    const [isLoadingIds, setIsLoadingIds] = useState(true)
    const [isLoadingUser, setIsLoadingUser] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // load a list of IDs
    useEffect(() => {
        async function loadRecommendations() {
            try {
                setIsLoadingIds(true)
                setError(null)

                const ids = await getRecommendations()

                setRecommendationIds(ids)
                setCurrentIndex(0)
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load recommendations.")
            } finally {
                setIsLoadingIds(false)
            }
        }

        loadRecommendations()
    }, [])

    // loads the current user
    useEffect(() => {
        const currentId = recommendationIds[currentIndex]

        if (!currentId) {
            setCurrentUser(null)
            return
        }

        let isMounted = true

        async function loadCurrentUser() {
            try {
                setIsLoadingUser(true)
                setError(null)

                const user = await getRecommendedUser(currentId)

                if (isMounted) {
                    setCurrentUser(user)
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Failed to load recommended user.")
                }
            } finally {
                if (isMounted) {
                    setIsLoadingUser(false)
                }
            }
        }

        loadCurrentUser()
        return () => {isMounted = false}
    }, [recommendationIds, currentIndex])

    function goToNextRecommendation() {
        setCurrentIndex((index) => index + 1);
    }

    if (isLoadingIds) {
        return (
        <>
            <NavBar />
            <p>Loading recommendations...</p>
        </>
        )
    }

    if (error) {
        return (
        <>
            <NavBar />
            <p>{error}</p>
        </>)
    }

    if (recommendationIds.length === 0) {
        return (
        <>
            <NavBar />
            <p>No recommendations found.</p>
        </>)
    }

    if (currentIndex >= recommendationIds.length) {
        return (
        <>
            <NavBar />
            <p>No more recommendations.</p>
        </>)
    }

    return (
        <>
            <NavBar />

            {isLoadingUser && <p>Loading user...</p>}

            {currentUser && !isLoadingUser && (
                <RecommendationCard
                    user={currentUser}
                    onAccept={goToNextRecommendation}
                    onReject={goToNextRecommendation}
                />
            )}
        </>
    )

}