import { Request, Response, NextFunction} from "express";
const authService = require('../services/auth');

class authController {
    static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
        const data = req.body;
        try {
            const user = await authService.signup(data);
            res.status(201).json({message: 'User created', user: user});
        } catch (error) {
            next(error);
        }
    }

    static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        const data = req.body;
        try {
            const token = await authService.login(data);
            res.cookie('jwt', token, {maxAge: 604800000});
            res.status(200).json({message: 'User logged in', token: token});
        } catch (error) {
            next(error);
        }
    }

    static async logout(req: Request, res: Response): Promise<void> {
        res.clearCookie('jwt');
        res.status(200).json({message: 'User logged out'});
    }
}

module.exports = authController;