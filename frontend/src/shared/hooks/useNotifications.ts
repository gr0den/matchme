import { useEffect } from "react";
import { Client, type IMessage } from "@stomp/stompjs";

export type MatchMeNotification = {
    type: string;
    message: string;
    requesterId: number;
}

export const useNotificationsWebSocket = (
    currentUserId: number | null,
    stompClient: Client | null,
    isStompConnected: boolean,
    onNotification?: (notification: MatchMeNotification) => void,
) =>
{
    useEffect(() =>
    {
        if (!currentUserId || !stompClient || !isStompConnected) return;

        const subscriptionPath = `/topic/notifications/${currentUserId}`;
        const subscription = stompClient.subscribe(subscriptionPath, (message: IMessage) =>
        {
            const notificationData = JSON.parse(message.body) as MatchMeNotification;
            onNotification?.(notificationData);
        });

        return () =>
        {
            subscription.unsubscribe();
        };

    }, [currentUserId, stompClient, isStompConnected, onNotification]);

    return;
};
