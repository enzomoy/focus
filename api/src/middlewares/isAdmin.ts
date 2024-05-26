import {Request, Response, NextFunction} from "express";
import {UnauthorizedError} from "../utils/CustomError";


const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user.role !== 'admin') {
        throw new UnauthorizedError("Vous n'avez pas la permission de faire cela")
    }
    next();
}

module.exports = isAdmin