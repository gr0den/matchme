import { useEffect, useRef, useState, type FormEvent } from "react"
import type { ChatWindowProps } from "../types/chatTypes"

function formatMessageTime(value: string) {
    return new Date(value).toLocaleString([], {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    })
}

export default function ChatWindow({
    currentUserId,
    selectedChat,
    messages,
    isLoading,
    isLoadingMore,
    isSending,
    hasMore,
    error,
    onLoadEarlier,
    onSendMessage,
}: ChatWindowProps) {
    const [draft, setDraft] = useState("")
    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ block: "end" })
    }, [messages.length, selectedChat?.contactId])

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const nextMessage = draft.trim()
        if (!nextMessage) return

        await onSendMessage(nextMessage)
        setDraft("")
    }

    if (!selectedChat) {
        return (
            <section className="chat-window chat-window-empty" aria-label="Selected chat">
                <p>Select a chat to start messaging.</p>
            </section>
        )
    }

    return (
        <section className="chat-window" aria-labelledby="chat-window-title">
            <header className="chat-window-header">
                <h2 id="chat-window-title">{selectedChat.contactName}</h2>
            </header>

            <div className="chat-messages" aria-live="polite">
                {hasMore && (
                    <button
                        className="chat-load-earlier-button"
                        type="button"
                        onClick={onLoadEarlier}
                        disabled={isLoadingMore}
                    >
                        {isLoadingMore ? "Loading..." : "Load earlier messages"}
                    </button>
                )}

                {isLoading ? (
                    <p className="chat-status">Loading chat history...</p>
                ) : messages.length === 0 ? (
                    <p className="chat-status">No messages yet. Say hello.</p>
                ) : (
                    messages.map((message) => {
                        const isMine = message.senderId === currentUserId

                        return (
                            <article
                                key={message.id}
                                className={isMine ? "chat-message mine" : "chat-message theirs"}
                            >
                                <time className="chat-message-time" dateTime={message.timestamp}>
                                    {formatMessageTime(message.timestamp)}
                                </time>

                                <p className="chat-message-bubble">{message.content}</p>
                            </article>
                        )
                    })
                )}

                <div ref={messagesEndRef} />
            </div>

            {error && (
                <p className="chat-error" role="alert">
                    {error}
                </p>
            )}

            <form className="chat-composer" onSubmit={handleSubmit}>
                <label className="chat-composer-label" htmlFor="chat-message-input">
                    Message
                </label>

                <input
                    id="chat-message-input"
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Type a message..."
                    disabled={isSending}
                />

                <button type="submit" disabled={isSending || !draft.trim()}>
                    {isSending ? "Sending..." : "Send"}
                </button>
            </form>
        </section>
    )
}
