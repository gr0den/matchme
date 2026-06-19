import {useEffect, useState} from 'react';
import {Client} from '@stomp/stompjs';

export const useNotificationsWebSocket = (currentUserId: number | null) =>
{
    const [stompClient, setStompClient] = useState<Client | null>(null);

    useEffect(() =>
    {
        if (!currentUserId) return;

        const client = new Client({
            brokerURL: 'ws://localhost:3000/ws', reconnectDelay: 5000,

            onConnect: () =>
            {
                console.log('WebSocket connection is established for user ID:', currentUserId);

                const subscriptionPath = `/topic/notifications/${currentUserId}`;

                client.subscribe(subscriptionPath, (message) =>
                {
                    const notificationData = JSON.parse(message.body);
                    console.log('Incoming MatchMe Notification:', notificationData);
                });
            },

            onWebSocketError: (error) =>
            {
                console.error('Network Error: WebSocket failed.', error);
            },

            onStompError: (frame) =>
            {
                console.error('Broker Error: ', frame.headers['message']);
            }
        });

        client.activate();
        setStompClient(client);

        return () =>
        {
            if (client.active)
            {
                client.deactivate();
            }
        };

    }, [currentUserId]);

    return stompClient;
};