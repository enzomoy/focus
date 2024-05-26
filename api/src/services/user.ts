import {NoContentError, NotFoundError} from "../utils/CustomError";
import {User} from "../typescript/User";
import {SafeUser} from "../typescript/SafeUser";
const userRepository = require('../repositories/user');

class userService {

    static async getUsers() {
        const users: User[] = await userRepository.getUsers();
        if (!users.length) {
            throw new NoContentError("Aucun utilisateur trouvé");
        }

        // On retire les données sensibles de chaque utilisateur
        let safeUsers: SafeUser[] = [];
        users.forEach((user: User) => {
            safeUsers.push(this.removeSensitiveData(user));
        });

        return safeUsers;
    }

    static async getUser(id: number) {
        const user: User = await userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("Utilisateur non trouvé");
        }

        // On renvoit l'utilisateur sans les données sensibles
        return this.removeSensitiveData(user);
    }

    static async removeUser(id: number) {
        const user: User = await userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("Utilisateur non trouvé");
        }

        await userRepository.removeUser(id);
    }

    static removeSensitiveData(user: User): SafeUser {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            first_name: user.first_name,
            last_name: user.last_name,
            profile_picture: user.profile_picture,
            last_login: user.last_login,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }
    }

}

module.exports = userService;