import {useEffect, useState} from 'react';
import {Client} from '@stomp/stompjs';

export const useNotificationsWebSocket = (currentUserId: number | null) =>
{
    const [stompClient, setStompClient] = useState<Client | null>(null);

    useEffect(() =>
    {
        // 1. The Gatekeeper: Do not execute if the user is anonymous
        if (!currentUserId) return;

        const client = new Client({
            // 2. Target the Vite proxy on port 3000
            brokerURL: 'ws://localhost:3000/ws', reconnectDelay: 5000,

            onConnect: () =>
            {
                console.log('WebSocket connection is established for user ID:', currentUserId);

                // 3. Define the exact path to the Spring RAM registry
                const subscriptionPath = `/topic/notifications/${currentUserId}`;

                // 4. Send the SUBSCRIBE command to Spring Boot
                client.subscribe(subscriptionPath, (message) =>
                {
                    const notificationData = JSON.parse(message.body);
                    console.log('Incoming MatchMe Notification:', notificationData);
                    // UI state update logic will go here
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

        // 5. Fire the actual network request
        client.activate();
        setStompClient(client);

        // 6. Memory Cleanup: Sever the socket when the user logs out
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