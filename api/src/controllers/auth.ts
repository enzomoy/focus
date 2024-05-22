import express from "express";
const authService = require('../services/auth');

class authController {
    static async signup(req: express.Request, res: express.Response): Promise<void> {
        const data: User = req.body;
        try {
            const user = await authService.signup(data);
            res.status(201).json(user);
        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error("Erreur : " + error.message);
                res.status(400).json({error: "Erreur lors de la création de l'utilisateur", details: error.message});
            } else {
                console.error("Une erreur inattendue s'est produite");
                res.status(500).json({error: "Une erreur inattendue s'est produite"});
            }
        }
    }
}

module.exports = authController;