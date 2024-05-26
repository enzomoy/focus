// SafeUser type

export type SafeUser = {
    id?: number;
    username: string;
    email: string;
    role: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
    last_login?: string;
    createdAt: string;
    updatedAt: string;
}