import defaultAvatar from "../../../shared/assets/default-avatar.png"
import type { ChatListProps, ChatSummary } from "../types/chatTypes"

function formatSummaryTime(value: string | null) {
    if (!value) return ""

    return new Date(value).toLocaleDateString([], {
        month: "short",
        day: "numeric",
    })
}

function getPreview(summary: ChatSummary) {
    if (!summary.lastMessageContent) {
        return "No messages yet."
    }

    return summary.lastMessageContent
}

export default function ChatList({
    summaries,
    selectedContactId,
    onSelectChat,
}: ChatListProps) {
    if (summaries.length === 0) {
        return (
            <p className="chat-empty">
                No chats yet. Start one from your Connections page.
            </p>
        )
    }

    return (
        <div className="chat-list" aria-label="Chats">
            {summaries.map((summary) => (
                <button
                    key={summary.contactId}
                    className={
                        selectedContactId === summary.contactId
                            ? "chat-list-item active"
                            : "chat-list-item"
                    }
                    type="button"
                    onClick={() => onSelectChat(summary.contactId)}
                >
                    <img
                        className="chat-list-avatar"
                        src={summary.contactPictureUrl || defaultAvatar}
                        alt={`${summary.contactName}'s profile`}
                    />

                    <span className="chat-list-copy">
                        <span className="chat-list-name-row">
                            <span className="chat-list-name">{summary.contactName}</span>
                            <span className="chat-list-time">
                                {formatSummaryTime(summary.lastMessageAt)}
                            </span>
                        </span>

                        <span className="chat-list-preview">{getPreview(summary)}</span>
                    </span>

                    {summary.unreadCount > 0 && (
                        <span className="chat-unread-badge" aria-label={`${summary.unreadCount} unread messages`}>
                            {summary.unreadCount > 99 ? "99+" : summary.unreadCount}
                        </span>
                    )}
                </button>
            ))}
        </div>
    )
}
