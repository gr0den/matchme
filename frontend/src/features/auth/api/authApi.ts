import type { LoginCredentials, LoginResponseDto, RegiterCredentials, RegistrationResponseDto } from "../../../shared/types/apiTypes";

const BASE_URL = "http://localhost:3000/api/auth";

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponseDto> {
    const request = await fetch(`${BASE_URL}/login`, { // (await fetch): if no internet or backend offline -> automatically throws error
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })

    if (!request.ok) {
       
        const errorData = await request.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to fetch login.")
    }

    const result = await request.json()
    return result
}

export async function registerUser(credentials: RegiterCredentials): Promise<RegistrationResponseDto> {
    const request = await fetch(`${BASE_URL}/register`, { 
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })

    if (!request.ok) {
            const errorData = await request.json().catch(() => ({}))
            throw new Error(errorData.error || "Failed to fetch register.")
    }

    const result = await request.json()
    return result
}

export async function logout(): Promise<{message: string}> {
    const request = await fetch(`${BASE_URL}/logout`, {
        method: "POST",
        credentials: "include",
    })

    if (!request.ok) {
            const errorData = await request.json().catch(() => ({}))
            throw new Error(errorData.error || "Failed to fetch logout.")
    }

    const result = await request.json()

    return result
}