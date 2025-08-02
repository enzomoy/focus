export interface AuthError {
  code: string
  message: string
}

export interface RegisterData {
  email: string
  password: string
  displayName: string
}

export interface LoginData {
  email: string
  password: string
}

export interface ResetPasswordData {
  email: string
}
