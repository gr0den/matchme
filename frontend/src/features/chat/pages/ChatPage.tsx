/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useMemo, useState } from "react"
import { useOutletContext, useSearchParams } from "react-router-dom"
import type { RootOutletContext } from "../../../app/RootLayout"
import NavBar from "../../../shared/components/ui/navbar/navbar"
import { useAuth } from "../../../shared/context/AuthContext"
import { useChat } from "../../../shared/hooks/useChat"
import type { ChatMessage } from "../../../shared/hooks/useChat"
import { getChatSummaries, markChatRead } from "../api/chatApi"
import ChatList from "../components/ChatList"
import ChatWindow from "../components/ChatWindow"
import "../styles/ChatPage.css"
import type { ChatSummary } from "../types/chatTypes"

function getMessageContactId(message: ChatMessage, currentUserId: number | null) {
    if (!currentUserId) return null
    return message.senderId === currentUserId ? message.receiverId : message.senderId
}

function sortSummaries(summaries: ChatSummary[]) {
    return [...summaries].sort((first, second) => {
        const firstTime = first.lastMessageAt ? new Date(first.lastMessageAt).getTime() : 0
        const secondTime = second.lastMessageAt ? new Date(second.lastMessageAt).getTime() : 0

        if (firstTime !== secondTime) {
            return secondTime - firstTime
        }

        return first.contactName.localeCompare(second.contactName)
    })
}

function updateSummaryWithMessage(
    summaries: ChatSummary[],
    message: ChatMessage,
    currentUserId: number | null,
    selectedContactId: number | null,
) {
    const contactId = getMessageContactId(message, currentUserId)
    if (!contactId) return summaries

    let foundSummary = false
    const nextSummaries = summaries.map((summary) => {
        if (summary.contactId !== contactId) {
            return summary
        }

        foundSummary = true

        return {
            ...summary,
            lastMessageContent: message.content,
            lastMessageSenderId: message.senderId,
            lastMessageAt: message.timestamp,
            unreadCount:
                message.senderId !== currentUserId && selectedContactId !== contactId
                    ? summary.unreadCount + 1
                    : summary.unreadCount,
        }
    })

    return foundSummary ? sortSummaries(nextSummaries) : summaries
}

export default function ChatPage() {
    const { currentUserId } = useAuth()
    const {
        stompClient,
        isStompConnected,
        chatNotificationVersion,
        refreshChatNotifications,
    } = useOutletContext<RootOutletContext>()
    const [searchParams, setSearchParams] = useSearchParams()
    const [summaries, setSummaries] = useState<ChatSummary[]>([])
    const [selectedContactId, setSelectedContactId] = useState<number | null>(null)
    const [isLoadingSummaries, setIsLoadingSummaries] = useState(true)
    const [summaryError, setSummaryError] = useState<string | null>(null)

    const requestedContactId = useMemo(() => {
        const value = searchParams.get("contactId")
        if (!value) return null

        const parsedValue = Number(value)
        return Number.isNaN(parsedValue) ? null : parsedValue
    }, [searchParams])

    const loadSummaries = useCallback(async () => {
        try {
            setIsLoadingSummaries(true)
            setSummaryError(null)

            const nextSummaries = await getChatSummaries()
            setSummaries(nextSummaries)
        } catch (err) {
            setSummaryError(err instanceof Error ? err.message : "Failed to load chats.")
            setSummaries([])
        } finally {
            setIsLoadingSummaries(false)
        }
    }, [])

    useEffect(() => {
        if (!currentUserId) {
            setSummaries([])
            setSelectedContactId(null)
            setIsLoadingSummaries(false)
            return
        }

        loadSummaries()
    }, [currentUserId, loadSummaries, chatNotificationVersion])

    useEffect(() => {
        if (isLoadingSummaries) return

        if (summaries.length === 0) {
            setSelectedContactId(null)
            return
        }

        if (requestedContactId && summaries.some((summary) => summary.contactId === requestedContactId)) {
            setSelectedContactId(requestedContactId)
            return
        }

        if (selectedContactId && summaries.some((summary) => summary.contactId === selectedContactId)) {
            return
        }

        const firstContactId = summaries[0].contactId
        setSelectedContactId(firstContactId)
        setSearchParams({ contactId: String(firstContactId) }, { replace: true })
    }, [
        isLoadingSummaries,
        requestedContactId,
        selectedContactId,
        setSearchParams,
        summaries,
    ])

    const selectedChat = summaries.find((summary) => summary.contactId === selectedContactId) ?? null

    const clearSelectedUnread = useCallback(async (contactId: number) => {
        try {
            await markChatRead(contactId)
            setSummaries((currentSummaries) => currentSummaries.map((summary) => (
                summary.contactId === contactId
                    ? { ...summary, unreadCount: 0 }
                    : summary
            )))
            await refreshChatNotifications()
        } catch (err) {
            console.error("Failed to clear unread messages.", err)
        }
    }, [refreshChatNotifications])

    useEffect(() => {
        if (!selectedContactId || selectedChat?.unreadCount === 0) return

        clearSelectedUnread(selectedContactId)
    }, [clearSelectedUnread, selectedChat?.unreadCount, selectedContactId])

    const handleIncomingMessage = useCallback((message: ChatMessage) => {
        const contactId = getMessageContactId(message, currentUserId)
        setSummaries((currentSummaries) => updateSummaryWithMessage(
            currentSummaries,
            message,
            currentUserId,
            selectedContactId,
        ))

        if (contactId !== null && contactId === selectedContactId) {
            clearSelectedUnread(contactId)
        }
    }, [clearSelectedUnread, currentUserId, selectedContactId])

    const handleMessageSent = useCallback((message: ChatMessage) => {
        setSummaries((currentSummaries) => updateSummaryWithMessage(
            currentSummaries,
            message,
            currentUserId,
            selectedContactId,
        ))
        refreshChatNotifications()
    }, [currentUserId, refreshChatNotifications, selectedContactId])

    const {
        messages,
        isLoading,
        isLoadingMore,
        isSending,
        hasMore,
        error,
        sendMessage,
        loadEarlierMessages,
    } = useChat(
        currentUserId,
        selectedContactId,
        stompClient,
        isStompConnected,
        handleIncomingMessage,
        handleMessageSent,
    )

    function handleSelectChat(contactId: number) {
        setSelectedContactId(contactId)
        setSearchParams({ contactId: String(contactId) })
    }

    return (
        <>
            <NavBar />
            <main className="chat-page">
                <section className="chat-panel" aria-labelledby="chat-title">
                    <h1 id="chat-title">Chat</h1>

                    {summaryError && (
                        <p className="chat-error" role="alert">
                            {summaryError}
                        </p>
                    )}

                    <div className="chat-layout">
                        <aside className="chat-sidebar" aria-label="Chat list">
                            {isLoadingSummaries ? (
                                <p className="chat-status">Loading chats...</p>
                            ) : (
                                <ChatList
                                    summaries={summaries}
                                    selectedContactId={selectedContactId}
                                    onSelectChat={handleSelectChat}
                                />
                            )}
                        </aside>

                        <ChatWindow
                            currentUserId={currentUserId}
                            selectedChat={selectedChat}
                            messages={messages}
                            isLoading={isLoading}
                            isLoadingMore={isLoadingMore}
                            isSending={isSending}
                            hasMore={hasMore}
                            error={error}
                            onLoadEarlier={loadEarlierMessages}
                            onSendMessage={sendMessage}
                        />
                    </div>
                </section>
            </main>
        </>
    )
}
