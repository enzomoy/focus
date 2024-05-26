const UserModel = require('../models/user');
import {User} from "../typescript/User";

class userRepository {
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

    static async getUsers(): Promise<any>{
        try {
            return await UserModel.findAll();
        } catch (error) {
            return error;
        }
    }

    static async getUserById(id: number): Promise<any>{
        try {
            return await UserModel.findByPk(id);
        } catch (error) {
            return error;
        }
    }

    static async removeUser(id: number): Promise<any>{
        try {
            return await UserModel.destroy({ where: { id: id } });
        } catch (error) {
            return error;
        }
    }
}

module.exports = userRepository;