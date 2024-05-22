const authRepository = require('../repositories/auth');
import crypto from 'crypto';

class authService {
    static async signup(data: User): Promise<User> {

        // Check if the user already exists
        const potentialUserEmail = await authRepository.findByEmail(data.email);
        if (potentialUserEmail) {
            throw new Error("L'utilisateur existe déjà");
        }
        const potentialUserUsername = await authRepository.findByUsername(data.username);
        if (potentialUserUsername) {
            throw new Error("Le nom d'utilisateur existe déjà");
        }

        // Hash the password
        const { salt, hashedPassword } = this.hashPassword(data.password);
        if (!salt || !hashedPassword) {
            throw new Error("Erreur lors du hashage du mot de passe");
        }
        data.salt = salt;
        data.password = hashedPassword;

        // Set the dates
        data.updatedAt = new Date().toISOString();
        data.createdAt = new Date().toISOString();

        // Save the user in the database
        const user = await authRepository.signup(data);
        if (!user) {
            throw new Error("Erreur lors de la création de l'utilisateur dans la base de données");
        }
        return user;
    }

    private static hashPassword(password: string): { salt: string, hashedPassword: string } {
        const salt: string = crypto.randomBytes(16).toString('hex');
        const hashedPassword: string = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return { salt, hashedPassword }
    }
}

module.exports = authService;