import { useState, useEffect } from 'react';
import { Client, type IMessage } from '@stomp/stompjs';

export interface ChatMessage {
    id: number;
    senderId: number;
    receiverId: number;
    content: string;
    timestamp: string;
}

interface UseChatReturn {
    messages: ChatMessage[];
    sendMessage: (content: string) => Promise<void>;
}

export const useChat = (
    currentUserId: number | null, 
    contactId: number | null, 
    stompClient: Client | null
): UseChatReturn => {
    
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (!contactId) return;

        const fetchHistory = async () => {
            try {
                const response = await fetch(`/api/chat/${contactId}`);
                if (response.ok) {
                    const history: ChatMessage[] = await response.json();
                    setMessages(history);
                }
            } catch (error) {
                console.error("Failed to load chat history:", error);
            }
        };

        fetchHistory();
    }, [contactId]);

  
    useEffect(() => {
        if (!stompClient || !stompClient.connected || !currentUserId || !contactId) return;

        const subscription = stompClient.subscribe(`/topic/chat/${currentUserId}`, (frame: IMessage) => {
            const incomingMessage: ChatMessage = JSON.parse(frame.body);

         
            if (incomingMessage.senderId === contactId) {
                setMessages((prev) => [...prev, incomingMessage]);
            } else {
                console.log(`Unread message from User ${incomingMessage.senderId}`);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [stompClient, currentUserId, contactId]);

    const sendMessage = async (content: string) => {
        if (!content.trim() || !contactId) return;

        try {
            const response = await fetch(`/api/chat/${contactId}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
  
                body: JSON.stringify({ content }) 
            });

            if (response.ok) {
                const savedMessage: ChatMessage = await response.json();
                setMessages((prev) => [...prev, savedMessage]);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    return { messages, sendMessage };
};