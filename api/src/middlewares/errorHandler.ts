import { Request, Response, NextFunction } from "express";
import { CustomError} from "../utils/CustomError";
const moment = require('moment');

export const errorHandler = (error: CustomError, req: Request, res: Response, next: NextFunction): void => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Something went wrong";

    // Log the error with the date and time with a good format (france)
    console.log(`[${moment().format('DD/MM/YYYY à HH:mm:ss')}] - Erreur ${statusCode} - ${message}`);

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message
    });
};