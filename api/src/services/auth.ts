import {BadRequestError, InternalServerError} from "../utils/CustomError";
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/user');
import {User} from "../typescript/User";
import {LoginData} from "../typescript/LoginData";
import crypto from 'crypto';

class authService {
    static async signup(data: User): Promise<User> {

        // Check if the user already exists
        const potentialUserEmail = await userRepository.findByEmail(data.email);
        if (potentialUserEmail) {
            throw new BadRequestError("L'adresse email existe déjà")
        }
        const potentialUserUsername = await userRepository.findByUsername(data.username);
        if (potentialUserUsername) {
            throw new BadRequestError("Le nom d'utilisateur existe déjà")
        }

        // Hash the password
        const { salt, hashedPassword } = this.hashPassword(data.password);
        if (!salt || !hashedPassword) {
            throw new BadRequestError("Erreur lors du hashage du mot de passe");
        }
        data.salt = salt;
        data.password = hashedPassword;

        // Set the dates
        data.updatedAt = new Date().toISOString();
        data.createdAt = new Date().toISOString();

        // Save the user in the database
        const user = await userRepository.signup(data);
        if (!user) {
            throw new InternalServerError("Erreur lors de la création de l'utilisateur dans la base de données");
        }
        return user;
    }

    static async login(data: LoginData): Promise<string> {
        // Check if the user exists
        const user: User = await userRepository.findByEmail(data.email);
        if (!user) {
            throw new BadRequestError("Email ou mot de passe incorrect");
        }

        // Hash & test the password
        const hashedPassword = this.decryptPassword(data.password, user.salt);
        if (hashedPassword !== user.password) {
            throw new BadRequestError("Email ou mot de passe incorrect");
        }

        // Generate a token
        const token = this.generateJWT(user);
        if (!token) {
            throw new InternalServerError("Erreur lors de la génération du token");
        }
        return token;
    }

    private static hashPassword(password: string): { salt: string, hashedPassword: string } {
        const salt: string = crypto.randomBytes(16).toString('hex');
        const hashedPassword: string = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return { salt, hashedPassword }
    }

    private static decryptPassword(password: string, salt: string): string {
        return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    }

    private static generateJWT(user: User): string {
        const data = {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
        }
        return jwt.sign(data, process.env.JWT_SECRET, { expiresIn: '604800s' });
    }
}

module.exports = authService;