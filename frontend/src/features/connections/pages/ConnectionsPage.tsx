import { useCallback, useEffect, useState } from "react"
import { useNavigate, useOutletContext } from "react-router-dom"
import NavBar from "../../../shared/components/ui/navbar/navbar"
import { useAuth } from "../../../shared/context/AuthContext"
import type { RootOutletContext } from "../../../app/RootLayout"
import ConnectionCard from "../components/ConnectionCard"
import {
    acceptConnectionRequest,
    disconnectUser,
    getConnectedUser,
    getConnections,
    rejectConnectionRequest,
} from "../api/connectionsApi"
import "../styles/ConnectionsPage.css"
import type { ConnectedUser, ConnectionAction } from "../types/connectionTypes"

export default function ConnectionsPage() {
    const { currentUserId } = useAuth()
    const navigate = useNavigate()
    const { connectionNotificationVersion } = useOutletContext<RootOutletContext>()
    const [pendingUsers, setPendingUsers] = useState<ConnectedUser[]>([])
    const [activeUsers, setActiveUsers] = useState<ConnectedUser[]>([])
    const [openAboutIds, setOpenAboutIds] = useState<number[]>([])
    const [busyUserActions, setBusyUserActions] = useState<Record<number, ConnectionAction>>({})
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const loadConnections = useCallback(async () => {
        try {
            setIsLoading(true)
            setError(null)

            const connections = await getConnections()
            const [pending, active] = await Promise.all([
                Promise.all(connections.pendingConnections.map((id) => getConnectedUser(id))),
                Promise.all(connections.activeConnections.map((id) => getConnectedUser(id))),
            ])

            setPendingUsers(pending)
            setActiveUsers(active)
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load connections.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        // REST stays the source of truth; this also runs after connection WebSocket notifications.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadConnections()
    }, [loadConnections, connectionNotificationVersion])

    function toggleAbout(userId: number) {
        setOpenAboutIds((ids) => {
            if (ids.includes(userId)) {
                return ids.filter((id) => id !== userId)
            }

            return [...ids, userId]
        })
    }

    async function handleConnectionRequest(
        targetUser: ConnectedUser,
        action: ConnectionAction,
    ) {
        if (!currentUserId) {
            setError("You need to be logged in to manage connections.")
            return
        }

        setBusyUserActions((actions) => ({ ...actions, [targetUser.id]: action }))
        setError(null)

        try {
            const request = {
                requesterId: currentUserId,
                targetUserId: targetUser.id,
            }

            if (action === "accept") {
                await acceptConnectionRequest(request)
                setPendingUsers((users) => users.filter((user) => user.id !== targetUser.id))
                setActiveUsers((users) => {
                    if (users.some((user) => user.id === targetUser.id)) {
                        return users
                    }

                    return [...users, targetUser]
                })
            } else {
                await rejectConnectionRequest(request)
                setPendingUsers((users) => users.filter((user) => user.id !== targetUser.id))
            }

            setOpenAboutIds((ids) => ids.filter((id) => id !== targetUser.id))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to update connection request.")
        } finally {
            setBusyUserActions((actions) => {
                const nextActions = { ...actions }
                delete nextActions[targetUser.id]
                return nextActions
            })
        }
    }

    async function handleDisconnect(targetUser: ConnectedUser) {
        setBusyUserActions((actions) => ({ ...actions, [targetUser.id]: "disconnect" }))
        setError(null)

        try {
            await disconnectUser(targetUser.id)
            setActiveUsers((users) => users.filter((user) => user.id !== targetUser.id))
            setOpenAboutIds((ids) => ids.filter((id) => id !== targetUser.id))
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to disconnect user.")
        } finally {
            setBusyUserActions((actions) => {
                const nextActions = { ...actions }
                delete nextActions[targetUser.id]
                return nextActions
            })
        }
    }

    return (
        <>
            <NavBar />
            <main className="connections-page">
                <div className="connections-content">
                    <h1>Connections</h1>

                    {error && (
                        <p className="connections-error" role="alert">
                            {error}
                        </p>
                    )}

                    {isLoading ? (
                        <p className="connections-status">Loading connections...</p>
                    ) : (
                        <>
                            <section className="connections-section" aria-labelledby="connection-requests-title">
                                <h2 id="connection-requests-title">Connection Requests</h2>

                                {pendingUsers.length === 0 ? (
                                    <p className="connections-empty">No connection requests.</p>
                                ) : (
                                    <div className="connections-list">
                                        {pendingUsers.map((user) => (
                                            <ConnectionCard
                                                key={user.id}
                                                user={user}
                                                mode="request"
                                                busyAction={busyUserActions[user.id] ?? null}
                                                isAboutOpen={openAboutIds.includes(user.id)}
                                                onToggleAbout={() => toggleAbout(user.id)}
                                                onAccept={() => handleConnectionRequest(user, "accept")}
                                                onReject={() => handleConnectionRequest(user, "reject")}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>

                            <section className="connections-section" aria-labelledby="my-connections-title">
                                <h2 id="my-connections-title">My Connections</h2>

                                {activeUsers.length === 0 ? (
                                    <p className="connections-empty">No connections yet.</p>
                                ) : (
                                    <div className="connections-list">
                                        {activeUsers.map((user) => (
                                            <ConnectionCard
                                                key={user.id}
                                                user={user}
                                                mode="connection"
                                                busyAction={busyUserActions[user.id] ?? null}
                                                isAboutOpen={openAboutIds.includes(user.id)}
                                                onToggleAbout={() => toggleAbout(user.id)}
                                                onChat={() => navigate(`/chat?contactId=${user.id}`)}
                                                onDisconnect={() => handleDisconnect(user)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </main>
        </>
    )
}
