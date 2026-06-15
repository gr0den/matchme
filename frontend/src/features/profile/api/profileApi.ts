import type { ButtonData, MeResponse, ProfileResponse, BioResponse } from "../types/cardTypes";

const BASE_URL = "http://localhost:3000/api";
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

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
        `${BASE_URL}/tags/genres`,
        "Failed to load genres."
    );

    return genres.map((genre) => ({ id: genre.id, name: genre.genre }));
}

export async function fetchInterests(): Promise<ButtonData[]> {
    const interests = await handleTagResponse<{ id: number; interest: string }>(
        `${BASE_URL}/tags/interests`,
        "Failed to load interests."
    );

    return interests.map((interest) => ({ id: interest.id, name: interest.interest }));
}

export async function uploadProfileImage(file: File): Promise<string> {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        throw new Error("Cloudinary environment variables are not configured.");
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("folder", "profile-pictures");

    const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
            method: "POST",
            body: formData,
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || "Image upload failed.");
    }

    const result = await response.json();
    return result.secure_url as string;
}

export async function getMe(): Promise<MeResponse> {
    const response = await fetch(
        `${BASE_URL}/me`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!response.ok) {
        const errorData= await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || "Failed to fetch me type data.")
    }

    const meResult = await response.json();
    return meResult as MeResponse;
}

export async function getProfile(): Promise<ProfileResponse> {
    const response = await fetch(
        `${BASE_URL}/me/profile`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!response.ok) {
        const errorData= await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || "Failed to fetch profile type data.")
    }

    const profileResult = await response.json();
    return profileResult as ProfileResponse;
}

export async function getBio(): Promise<BioResponse> {
    const response = await fetch(
        `${BASE_URL}/me/bio`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!response.ok) {
        const errorData= await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || "Failed to fetch bio type data.")
    }

    const bioResult = await response.json();
    return bioResult as BioResponse;
}

export async function getOnboarded(): Promise<boolean> {
    const response = await fetch(
        `${BASE_URL}/user/profile/onboarded`,
        {
            method: "GET",
            credentials: "include",
        }
    );

    if (!response.ok) {
        const errorData= await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || "Failed to fetch onBoarded data.")
    }

    const onboardedResult:{onboarded: boolean} = await response.json();
    return onboardedResult.onboarded;
}

export async function createUser(): Promise<{userId: number, message: string}> {
    const response = await fetch(
        `${BASE_URL}/user/profile/create`,
        {
            method: "POST",
            credentials: "include",
        }
    );

    if (!response.ok) {
        const errorData= await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || "Failed to create user.")
    }

    const createResult = await response.json();
    return createResult as {userId: number, message: string};
}