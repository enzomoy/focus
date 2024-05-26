import {NextFunction, Request, Response} from "express";
import {User} from "../typescript/User";
const userServices = require('../services/user')

class userController {

    static async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const users: User[] = await userServices.getUsers();
            res.status(200).json(users)
        } catch (error) {
            next(error)
        }
    }

    static async getUser(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id: string = req.params.id;
        try {
            const user: User = await userServices.getUser(id);
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async profile(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const user: User = await userServices.getUser(req.user.id);
            res.status(200).json(user)
        } catch (error) {
            next(error)
        }
    }

    static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
        const id = req.params.id
        try {
            await userServices.removeUser(id)
            res.status(200).json({message: "Utilisateur supprimé"})
        } catch (error) {
            next(error)
        }
    }
}

module.exports = userController;