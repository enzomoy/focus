const UserModel = require('../models/user');

class authRepository {

    static async findByEmail(email: string): Promise<any>{
        try {
            return await UserModel.findOne({ where: { email: email } });
        } catch (error) {
            return error;
        }
    }

    static  async findByUsername(username: string): Promise<any>{
        try {
            return await UserModel.findOne({ where: { username: username } });
        } catch (error) {
            return error;
        }
    }

    static async signup(user: User): Promise<any>{
        try {
            return await UserModel.create(user);
        } catch (error) {
            return error;
        }
    }
}

module.exports = authRepository;