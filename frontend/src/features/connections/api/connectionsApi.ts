import type { MeResponse, ProfileResponse } from "../../profile/types/cardTypes"
import type { ConnectedUser, ConnectionRequest, ConnectionsResponse } from "../types/connectionTypes"

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

export async function getConnections(): Promise<ConnectionsResponse> {
    const response = await fetch(`${BASE_URL}/connections`, {
        method: "GET",
        credentials: "include",
    })

    return handleResponse<ConnectionsResponse>(response, "Failed to fetch connections.")
}

async function getUser(id: number): Promise<MeResponse> {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "GET",
        credentials: "include",
    })

    return handleResponse<MeResponse>(response, "Failed to fetch user.")
}

async function getUserProfile(id: number): Promise<ProfileResponse> {
    const response = await fetch(`${BASE_URL}/users/${id}/profile`, {
        method: "GET",
        credentials: "include",
    })

    return handleResponse<ProfileResponse>(response, "Failed to fetch user profile.")
}

export async function getConnectedUser(id: number): Promise<ConnectedUser> {
    const [user, profile] = await Promise.all([
        getUser(id),
        getUserProfile(id),
    ])

    return {
        id: user.id,
        userName: user.userName,
        pictureUrl: user.pictureUrl,
        bio: profile.bio,
    }
}

export async function acceptConnectionRequest(request: ConnectionRequest): Promise<void> {
    const response = await fetch(`${BASE_URL}/connections/accept`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    })

    await handleOkResponse(response, "Failed to accept connection request.")
}

export async function rejectConnectionRequest(request: ConnectionRequest): Promise<void> {
    const response = await fetch(`${BASE_URL}/connections/reject`, {
        method: "PATCH",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    })

    await handleOkResponse(response, "Failed to reject connection request.")
}
