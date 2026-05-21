export type LoginCredentials = {
    email: string;
    password: string;
}

export type LoginResponseDto = {
  id: number
  token: string
  tokenType: string
  email: string
}

export type RegiterCredentials = {
    email: string;
    password: string;
}

export type RegistrationResponseDto = {
    id: number;
    emai: string;
}

//export type LogOutCredentials = {
//  id: 
//}