/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react"
import { Client, type IFrame } from "@stomp/stompjs"

function getBrokerUrl() {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:"
    return `${protocol}//${window.location.host}/ws`
}

export function useStompClient(currentUserId: number | null) {
    const [stompClient, setStompClient] = useState<Client | null>(null)
    const [isStompConnected, setIsStompConnected] = useState(false)

    useEffect(() => {
        if (!currentUserId) {
            return
        }

        const client = new Client({
            brokerURL: getBrokerUrl(),
            reconnectDelay: 5000,
            onConnect: () => {
                setIsStompConnected(true)
            },
            onDisconnect: () => {
                setIsStompConnected(false)
            },
            onWebSocketClose: () => {
                setIsStompConnected(false)
            },
            onWebSocketError: (error: Event) => {
                console.error("Network Error: WebSocket failed.", error)
            },
            onStompError: (frame: IFrame) => {
                console.error("Broker Error: ", frame.headers.message)
            },
        })

        setStompClient(client)
        client.activate()

        return () => {
            setIsStompConnected(false)
            setStompClient(null)

            if (client.active) {
                client.deactivate()
            }
        }
    }, [currentUserId])

    return { stompClient, isStompConnected }
}
