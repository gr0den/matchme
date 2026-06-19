/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { Client, type IMessage } from "@stomp/stompjs";
import { getChatHistory, sendChatMessage } from "../../features/chat/api/chatApi";

export interface ChatMessage {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
    readAt: string | null;
}

interface UseChatReturn {
    messages: ChatMessage[];
    isLoading: boolean;
    isLoadingMore: boolean;
    isSending: boolean;
    hasMore: boolean;
    error: string | null;
    sendMessage: (content: string) => Promise<void>;
    loadEarlierMessages: () => Promise<void>;
}

export const useChat = (
    currentUserId: number | null,
    contactId: number | null,
    stompClient: Client | null,
    isStompConnected: boolean,
    onIncomingMessage?: (message: ChatMessage) => void,
    onMessageSent?: (message: ChatMessage) => void,
): UseChatReturn => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function mergeMessages(previous: ChatMessage[], nextMessages: ChatMessage[], append: boolean) {
        const knownIds = new Set(previous.map((message) => message.id));
        const uniqueMessages = nextMessages.filter((message) => !knownIds.has(message.id));

        return append ? [...previous, ...uniqueMessages] : [...uniqueMessages, ...previous];
    }

    useEffect(() => {
        if (!contactId) {
            setMessages([]);
            setPage(0);
            setHasMore(false);
            setError(null);
            return;
        }

        const activeContactId = contactId;
        let shouldIgnore = false;

        async function fetchHistory() {
            try {
                setIsLoading(true);
                setError(null);

                const history = await getChatHistory(activeContactId);

                if (!shouldIgnore) {
                    setMessages(history.messages);
                    setPage(history.page);
                    setHasMore(history.hasMore);
                }
            } catch (err) {
                if (!shouldIgnore) {
                    setError(err instanceof Error ? err.message : "Failed to load chat history.");
                    setMessages([]);
                    setHasMore(false);
                }
            } finally {
                if (!shouldIgnore) {
                    setIsLoading(false);
                }
            }
        }

        fetchHistory();

        return () => {
            shouldIgnore = true;
        };
    }, [contactId]);

    useEffect(() => {
        if (!stompClient || !isStompConnected || !currentUserId) return;

        const subscription = stompClient.subscribe(`/topic/chat/${currentUserId}`, (frame: IMessage) => {
            const incomingMessage = JSON.parse(frame.body) as ChatMessage;

            if (incomingMessage.senderId === contactId) {
                setMessages((previous) => mergeMessages(previous, [incomingMessage], true));
            }

            onIncomingMessage?.(incomingMessage);
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [stompClient, isStompConnected, currentUserId, contactId, onIncomingMessage]);

    const loadEarlierMessages = useCallback(async () => {
        if (!contactId || !hasMore || isLoadingMore) return;

        try {
            setIsLoadingMore(true);
            setError(null);

            const nextPage = page + 1;
            const history = await getChatHistory(contactId, nextPage);

            setMessages((previous) => mergeMessages(previous, history.messages, false));
            setPage(history.page);
            setHasMore(history.hasMore);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load earlier messages.");
        } finally {
            setIsLoadingMore(false);
        }
    }, [contactId, hasMore, isLoadingMore, page]);

    const sendMessage = useCallback(async (content: string) => {
        if (!content.trim() || !contactId) return;

        try {
            setIsSending(true);
            setError(null);

            const savedMessage = await sendChatMessage(contactId, content);
            setMessages((previous) => mergeMessages(previous, [savedMessage], true));
            onMessageSent?.(savedMessage);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send message.");
        } finally {
            setIsSending(false);
        }
    }, [contactId, onMessageSent]);

    return {
        messages,
        isLoading,
        isLoadingMore,
        isSending,
        hasMore,
        error,
        sendMessage,
        loadEarlierMessages,
    };
};
