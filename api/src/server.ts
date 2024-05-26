import express from 'express';
const app = express();
const sequelize = require('./config/db');
const cookieParser = require('cookie-parser');
import { Request, Response } from 'express';
import {errorHandler} from "./middlewares/errorHandler";

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const port: string | 3000 = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({"Message": "Welcome to the API"})
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);


// Error handling middleware
app.use(errorHandler);

// Connect to the database
sequelize.sync().then(() => {
  console.log('La connexion à la base de données a été établie avec succès.');
  app.listen(port, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
  });
}).catch((error: any) => {
  console.error('Erreur lors de la connexion à la base de données:', error);
});

