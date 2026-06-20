import type { ChatHistoryResponse, ChatMessage, ChatSummary } from "../types/chatTypes"

const BASE_URL = "http://localhost:3000/api"

async function handleResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || errorData.error || fallbackMessage)
    }

    return response.json() as Promise<T>
}

async function handleOkResponse(response: Response, fallbackMessage: string): Promise<void> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || errorData.error || fallbackMessage)
    }
}

export async function getChatSummaries(): Promise<ChatSummary[]> {
    const response = await fetch(`${BASE_URL}/chat`, {
        method: "GET",
        credentials: "include",
    })

    return handleResponse<ChatSummary[]>(response, "Failed to load chats.")
}

export async function getChatHistory(
    contactId: number,
    page = 0,
    size = 30,
): Promise<ChatHistoryResponse> {
    const params = new URLSearchParams({
        page: String(page),
        size: String(size),
    })

    const response = await fetch(`${BASE_URL}/chat/${contactId}?${params.toString()}`, {
        method: "GET",
        credentials: "include",
    })

    return handleResponse<ChatHistoryResponse>(response, "Failed to load chat history.")
}

export async function sendChatMessage(contactId: number, content: string): Promise<ChatMessage> {
    const response = await fetch(`${BASE_URL}/chat/${contactId}`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
    })

    return handleResponse<ChatMessage>(response, "Failed to send message.")
}

export async function markChatRead(contactId: number): Promise<void> {
    const response = await fetch(`${BASE_URL}/chat/${contactId}/read`, {
        method: "PATCH",
        credentials: "include",
    })

    await handleOkResponse(response, "Failed to mark chat as read.")
}
