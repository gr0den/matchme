import { useEffect, useState } from "react"
import NavBar from "../../../shared/components/ui/navbar/navbar"
import { useAuth } from "../../../shared/context/AuthContext"
import RecommendationCard from "../components/RecommendationCard"
import {
    connectToRecommendedUser,
    dismissRecommendedUser,
    getRecommendations,
    getRecommendedUser,
} from "../api/recommendationsApi"
import "../styles/RecommendationsPage.css"
import type { RecommendedUser, RecommendationAction } from "../types/recommendationTypes"

export default function RecommendationsPage() {
    const { currentUserId } = useAuth()
    const [recommendedUsers, setRecommendedUsers] = useState<RecommendedUser[]>([])
    const [openAboutIds, setOpenAboutIds] = useState<number[]>([])
    const [busyUserActions, setBusyUserActions] = useState<Record<number, RecommendationAction>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadRecommendations() {
            try {
                setIsLoading(true)
                setError(null)

                const ids = await getRecommendations()
                const users = await Promise.all(ids.map((id) => getRecommendedUser(id)))

                setRecommendedUsers(users)
                setOpenAboutIds([])
            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to load recommendations.")
            } finally {
                setIsLoading(false)
            }
        }

        loadRecommendations()
    }, [])

    function toggleAbout(userId: number) {
        setOpenAboutIds((ids) => {
            if (ids.includes(userId)) {
                return ids.filter((id) => id !== userId)
            }

            return [...ids, userId]
        })
    }

    async function handleRecommendationAction(
        targetUserId: number,
        action: RecommendationAction,
    ) {
        if (!currentUserId) {
            setError("You need to be logged in to use recommendations.")
            return
        }

        setBusyUserActions((actions) => ({ ...actions, [targetUserId]: action }))
        setError(null)

        try {
            const request = {
                requesterId: currentUserId,
                targetUserId,
            }

            if (action === "connect") {
                await connectToRecommendedUser(request)
            } else {
                await dismissRecommendedUser(request)
            }

            setRecommendedUsers((users) => users.filter((user) => user.id !== targetUserId))
            setOpenAboutIds((ids) => ids.filter((id) => id !== targetUserId))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update recommendation.")
        } finally {
            setBusyUserActions((actions) => {
                const nextActions = { ...actions }
                delete nextActions[targetUserId]
                return nextActions
            })
        }
    }

    if (isLoading) {
        return (
            <>
                <NavBar />
                <main className="recommendations-page">
                    <p className="recommendations-status">Loading recommendations...</p>
                </main>
            </>
        )
    }

    return (
        <>
            <NavBar />
            <main className="recommendations-page">
                <section className="recommendations-panel" aria-labelledby="recommendations-title">
                    <h1 id="recommendations-title">Top Recommendations</h1>

                    {error && (
                        <p className="recommendations-error" role="alert">
                            {error}
                        </p>
                    )}

                    {recommendedUsers.length === 0 ? (
                        <p className="recommendations-status">No recommendations found.</p>
                    ) : (
                        <div className="recommendations-list">
                            {recommendedUsers.map((user) => (
                                <RecommendationCard
                                    key={user.id}
                                    user={user}
                                    busyAction={busyUserActions[user.id] ?? null}
                                    isAboutOpen={openAboutIds.includes(user.id)}
                                    onToggleAbout={() => toggleAbout(user.id)}
                                    onConnect={() => handleRecommendationAction(user.id, "connect")}
                                    onDismiss={() => handleRecommendationAction(user.id, "dismiss")}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </>
    )
}
