import { Request, Response, NextFunction } from "express";
const jwt = require("jsonwebtoken");
import {UnauthorizedError, ForbiddenError, InternalServerError} from "../utils/CustomError";

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authToken: string = req.cookies.jwt;
    const authentificationToken: string | undefined = process.env.JWT_SECRET;

    if (authToken) {
        try {
            if (!authentificationToken) {
                throw new InternalServerError("JWT secret is not defined");
            }

            req.user = jwt.verify(authToken, authentificationToken);
            next();
        } catch (error) {
            next(new ForbiddenError("Expired or invalid token"));
        }
    } else {
        next(new UnauthorizedError("Missing authentication key"));
    }
};

module.exports = authMiddleware;