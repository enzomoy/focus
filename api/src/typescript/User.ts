// User type

type User = {
    id?: number;
    username: string;
    email: string;
    password: string;
    salt: string;
    first_name: string;
    last_name: string;
    profile_picture?: string;
    last_login?: string;
    createdAt?: string;
    updatedAt?: string;
}