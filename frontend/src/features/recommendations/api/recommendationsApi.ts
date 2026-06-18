import type { BioResponse, MeResponse } from "../../profile/types/cardTypes"
import type { RecommendedUser } from "../types/recommendationTypes"

const BASE_URL = "http://localhost:3000/api"

async function handleResponse<T>(response: Response, fallbackMessage: string): Promise<T> {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || errorData.error || fallbackMessage);
    }

    return response.json() as Promise<T>
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

async function getUserBio(id: number): Promise<BioResponse> {
    const response = await fetch(`${BASE_URL}/users/${id}/bio`, {
        method: "GET",
        credentials: "include",
    });

    return handleResponse<BioResponse>(response, "Failed to fetch recommended user bio.");
}

export async function getRecommendedUser(id:number): Promise<RecommendedUser> {
    const [user, bio] = await Promise.all([
        getUser(id),
        getUserBio(id),
    ])

    return {
        id: user.id,
        userName: user.userName,
        pictureUrl: user.pictureUrl,
        longitude: bio.longitude,
        latitude: bio.latitude,
        interests: bio.interests,
        genres: bio.genres,
        targetGenres: bio.targetGenres,
        searchRadius: bio.searchRadius,
    }
}