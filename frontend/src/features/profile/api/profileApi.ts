import type { ButtonData } from "../types/cardTypes";

const BASE_URL = "http://localhost:3000/api/tags";

async function handleTagResponse<T>(url: string, fallbackMessage: string): Promise<T[]> {
    const response = await fetch(url, {
        method: "GET",
        credentials: "include",
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || fallbackMessage);
    }

    return response.json() as Promise<T[]>;
}

export async function fetchGenres(): Promise<ButtonData[]> {
    const genres = await handleTagResponse<{ id: number; genre: string }>(
        `${BASE_URL}/genres`,
        "Failed to load genres."
    );

    return genres.map((genre) => ({ id: genre.id, name: genre.genre }));
}

export async function fetchInterests(): Promise<ButtonData[]> {
    const interests = await handleTagResponse<{ id: number; interest: string }>(
        `${BASE_URL}/interests`,
        "Failed to load interests."
    );

    return interests.map((interest) => ({ id: interest.id, name: interest.interest }));
}
