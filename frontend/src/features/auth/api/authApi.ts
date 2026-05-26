import type { LoginCredentials, LoginResponseDto, RegiterCredentials, RegistrationResponseDto } from "../../../shared/types/apiTypes";

const BASE_URL = "http://localhost:3000/api/auth";

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponseDto> {
    const request = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })

    //if (!request.ok) {
    //    const errorData = await request.json()
    //    throw new Error(errorData.error || "An error occured")
    //}
    if (!request.ok) {
        try {
            const errorData = await request.json()
            throw new Error(errorData.error || "An error occured")
        } catch (e) {
            // If response body is empty or not JSON, use a generic error
            throw new Error(`Invalid credentials: Error: ${request.status} ${request.statusText}`)
        }
    }

    const result = await request.json()
    return result
}

export async function registerUser(credentials: RegiterCredentials): Promise<RegistrationResponseDto> {
    const request = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })

    //if (!request.ok) {
    //    const errorData = await request.json()
    //    console.log("errorData inside authApi: ", errorData)
    //    throw new Error(errorData.error || "An error occured")
    //}
    if (!request.ok) {
        try {
            const errorData = await request.json()
            throw new Error(errorData.error || "An error occured")
        } catch (e) {
            // If response body is empty or not JSON, use a generic error
            throw new Error(`Invalid credentials: Error: ${request.status} ${request.statusText}`)
        }
    }

    const result = await request.json()
    return result
}

//export async function logout(credentials: ) {
//    const response = await fetch(`${BASE_URL}/logout`, {
//        method: "POST",
//        headers: {
//            "Content-Type": "application/json",
//        },
//        body: JSON.stringify(credentials),
//    })
//
//    if (!response.ok) {
//        throw new Error("Invalid email or password")
//    }
//
//    const result = await response.json()
//
//    return result
//}