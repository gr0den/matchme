/* eslint-disable react-hooks/set-state-in-effect */
import { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import type { Client } from "@stomp/stompjs";
import { getChatSummaries } from "../features/chat/api/chatApi";
import { useAuth } from "../shared/context/AuthContext";
import { useNotificationsWebSocket } from "../shared/hooks/useNotifications";
import { useStompClient } from "../shared/hooks/useStompClient";
import type { MatchMeNotification } from "../shared/hooks/useNotifications";

export type RootOutletContext = {
    connectionNotificationVersion: number;
    chatNotificationVersion: number;
    unreadChatCount: number;
    stompClient: Client | null;
    isStompConnected: boolean;
    refreshChatNotifications: () => Promise<void>;
}

export default function RootLayout() {
    const { currentUserId } = useAuth();
    const { stompClient, isStompConnected } = useStompClient(currentUserId);
    const [connectionNotificationVersion, setConnectionNotificationVersion] = useState(0);
    const [chatNotificationVersion, setChatNotificationVersion] = useState(0);
    const [unreadChatCount, setUnreadChatCount] = useState(0);

    const handleNotification = useCallback((notification: MatchMeNotification) => {
        if (notification.type === "CONNECTION_REQUEST" || notification.type === "CONNECTION_ACCEPTED") {
            setConnectionNotificationVersion((version) => version + 1);
        }
    }, []);

    const refreshChatNotifications = useCallback(async () => {
        if (!currentUserId) {
            setUnreadChatCount(0);
            return;
        }

        try {
            const summaries = await getChatSummaries();
            const unreadCount = summaries.reduce((total, summary) => total + summary.unreadCount, 0);

            setUnreadChatCount(unreadCount);
            setChatNotificationVersion((version) => version + 1);
        } catch (error) {
            console.error("Failed to refresh chat notifications.", error);
            setUnreadChatCount(0);
        }
    }, [currentUserId]);

    useNotificationsWebSocket(currentUserId, stompClient, isStompConnected, handleNotification);

    useEffect(() => {
        refreshChatNotifications();
    }, [refreshChatNotifications]);

    useEffect(() => {
        if (!currentUserId || !stompClient || !isStompConnected) return;

        const subscription = stompClient.subscribe(`/topic/chat/${currentUserId}`, () => {
            refreshChatNotifications();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [currentUserId, stompClient, isStompConnected, refreshChatNotifications]);

    return (
        <Outlet
            context={{
                connectionNotificationVersion,
                chatNotificationVersion,
                unreadChatCount,
                stompClient,
                isStompConnected,
                refreshChatNotifications,
            }}
        />
    );
}
