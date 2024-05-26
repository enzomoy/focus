import {NoContentError, NotFoundError} from "../utils/CustomError";
const userRepository = require('../repositories/user');

class userService {
    static async getUsers() {
        const users = await userRepository.getUsers();
        if (!users) {
            throw new NoContentError("Aucun utilisateur trouvé");
        }
    }

    static async getUserById(id: number) {
        const user = await userRepository.getUserById(id);
        if (!user) {
            throw new NotFoundError("Utilisateur non trouvé");
        }
    }
}

module.exports = userService;