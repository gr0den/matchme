import type { ChatMessage } from "../../../shared/hooks/useChat"

export type { ChatMessage }

export type ChatHistoryResponse = {
    messages: ChatMessage[];
    page: number;
    size: number;
    hasMore: boolean;
}

export type ChatSummary = {
    contactId: number;
    contactName: string;
    contactPictureUrl: string | null;
    lastMessageContent: string | null;
    lastMessageSenderId: number | null;
    lastMessageAt: string | null;
    unreadCount: number;
}

export type ChatListProps = {
    summaries: ChatSummary[];
    selectedContactId: number | null;
    onSelectChat: (contactId: number) => void;
}

export type ChatWindowProps = {
    currentUserId: number | null;
    selectedChat: ChatSummary | null;
    messages: ChatMessage[];
    isLoading: boolean;
    isLoadingMore: boolean;
    isSending: boolean;
    hasMore: boolean;
    error: string | null;
    onLoadEarlier: () => void;
    onSendMessage: (content: string) => Promise<void>;
}
