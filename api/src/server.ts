import express from 'express';
const app = express();
const sequelize = require('./config/db');
import { Request, Response } from 'express';

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port: string | 3000 = process.env.PORT || 3000;

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({"Message": "Welcome to the API"})
});

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Connect to the database
sequelize.sync().then(() => {
  console.log('La connexion à la base de données a été établie avec succès.');
  app.listen(port, () => {
    console.log(`Le serveur est en cours d'exécution sur le port ${port}`);
  });
}).catch((error: any) => {
  console.error('Erreur lors de la connexion à la base de données:', error);
});

