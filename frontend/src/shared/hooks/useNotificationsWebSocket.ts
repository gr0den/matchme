import {useEffect, useRef} from 'react';
import {Client, type IFrame, type IMessage} from '@stomp/stompjs';

export type MatchMeNotification = {
    type: string;
    message: string;
    requesterId: number;
}

export const useNotificationsWebSocket = (
    currentUserId: number | null,
    onNotification?: (notification: MatchMeNotification) => void,
) =>
{
    const stompClientRef = useRef<Client | null>(null);

    useEffect(() =>
    {
        if (!currentUserId) return;

        const client = new Client({
            brokerURL: 'ws://localhost:3000/ws', reconnectDelay: 5000,

            onConnect: () =>
            {
                console.log('WebSocket connection is established for user ID:', currentUserId);

                const subscriptionPath = `/topic/notifications/${currentUserId}`;

                client.subscribe(subscriptionPath, (message: IMessage) =>
                {
                    const notificationData = JSON.parse(message.body) as MatchMeNotification;
                    console.log('Incoming MatchMe Notification:', notificationData);
                    onNotification?.(notificationData);
                });
            },

            onWebSocketError: (error: Event) =>
            {
                console.error('Network Error: WebSocket failed.', error);
            },

            onStompError: (frame: IFrame) =>
            {
                console.error('Broker Error: ', frame.headers['message']);
            }
        });

        client.activate();
        stompClientRef.current = client;

        return () =>
        {
            if (client.active)
            {
                client.deactivate();
            }
            stompClientRef.current = null;
        };

    }, [currentUserId, onNotification]);

    return;
};
