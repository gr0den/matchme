import type { MeResponse, ProfileResponse } from "../../profile/types/cardTypes"
import type { ConnectionRequest, RecommendedUser } from "../types/recommendationTypes"

const BASE_URL = "http://localhost:3000/api"

async function handleResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.error || fallbackMessage);
    }

    return response.json() as Promise<T>
}

async function handleOkResponse(response: Response, fallbackMessage: string): Promise<void> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.error || fallbackMessage);
    }
}

export async function getRecommendations(): Promise<number[]> {
    const response = await fetch(`${BASE_URL}/recommendations`, {
        method: "GET",
        credentials: "include",
    })

    return handleResponse<number[]>(response, "Failed to fetch recommendations.")
}

export async function getUser(id: number): Promise<MeResponse> {
    const response = await fetch(`${BASE_URL}/users/${id}`, {
        method: "GET",
        credentials: "include"
    })

    return handleResponse<MeResponse>(response, "Failed to fetch recommended user.")
}

async function getUserProfile(id: number): Promise<ProfileResponse> {
    const response = await fetch(`${BASE_URL}/users/${id}/profile`, {
        method: "GET",
        credentials: "include",
    });

    return handleResponse<ProfileResponse>(response, "Failed to fetch recommended user profile.");
}

export async function getRecommendedUser(id:number): Promise<RecommendedUser> {
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

export async function connectToRecommendedUser(request: ConnectionRequest): Promise<void> {
    const response = await fetch(`${BASE_URL}/connections/connect`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    })

    await handleOkResponse(response, "Failed to send connection request.")
}

export async function dismissRecommendedUser(request: ConnectionRequest): Promise<void> {
    const response = await fetch(`${BASE_URL}/recommendations/dismiss`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
    })

    await handleOkResponse(response, "Failed to dismiss recommendation.")
}
