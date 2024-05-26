import {NoContentError, NotFoundError} from "../utils/CustomError";
import {User} from "../typescript/User";
const userRepository = require('../repositories/user');

class userService {

    static async getUsers() {
        const users: User[] = await userRepository.getUsers();
        if (!users.length) {
            throw new NoContentError("Aucun utilisateur trouvé");
        }
        return users;
    }

    static async getUser(id: number) {
        const user: User = await userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("Utilisateur non trouvé");
        }
        return user;
    }
}

module.exports = userService;