// User type

export type User = {
    id?: number;
    username: string;
    email: string;
    password: string;
    role: string;
    salt: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
    last_login?: string;
    createdAt?: string;
    updatedAt?: string;
}