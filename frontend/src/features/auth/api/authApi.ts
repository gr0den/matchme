import type { LoginCredentials, LoginResponseDto, RegiterCredentials, RegistrationResponseDto } from "../../../shared/types/apiTypes";

const BASE_URL = "http://localhost:3000/api/auth";

export async function loginUser(credentials: LoginCredentials): Promise<LoginResponseDto> {
    const response = await fetch(`${BASE_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })

    if (!response.ok) {
        throw new Error("Invalid email or password")
    }

    const result = await response.json()

    // receive token
    //localStorage.setItem("token", data.token);

    return result
}

export async function registerUser(credentials: RegiterCredentials): Promise<RegistrationResponseDto> {
    const response = await fetch(`${BASE_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
    })

    if (!response.ok) {
        throw new Error("Invalid email or password")
    }

    const result = await response.json()

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