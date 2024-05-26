import { Request, Response} from "express";

class userController {
    static async profile(req: Request, res: Response): Promise<void> {

    }

    static async delete(req: Request, res: Response): Promise<void> {
        // Pour supprimer son compte il faut être admin / que ce soit son propre compte
        // Vérifié par le middleware isMe
    }
}

module.exports = userController;