# Focus

Focus est une application de gestion de temps basée sur la technique Pomodoro. Elle vous aide à rester concentré sur vos tâches en vous permettant de planifier des sessions de travail intensif suivies de courtes pauses.

## Fonctionnalités

- Chronomètre Pomodoro avec sessions configurables (travail et pause).
- Authentification utilisateur.
- Enregistrement des sessions Pomodoro dans une base de données MariaDB.
- Visualisation de l'historique des sessions Pomodoro pour chaque utilisateur.

## Installation

1. Clonez ce dépôt sur votre machine :
   ```
   git clone https://github.com/votre-utilisateur/focus.git
   ```
2. Installez les dépendances nécessaires :
   ```
   npm install
   ```
3. Créez un fichier `.env` à la racine du projet et configurez vos variables d'environnement. Consultez `.env.example` pour savoir quelles variables sont nécessaires.

## Configuration

1. Installer les dépendances nécessaires
2. Configurez MariaDB pour pour gérer l'authentification correctement.

## Utilisation

1. Démarrez le serveur back-end :
   ```
   npm start
   ```
2. Démarrez le serveur front-end :
   ```
   cd client
   npm start
   ```

## Contribuer

Les contributions sont les bienvenues ! Pour des suggestions, des rapports de bogues ou des demandes de fonctionnalités, veuillez ouvrir une issue.

## Auteurs

- [Enzo MOY](https://github.com/enzomoy/) - Développeur principal

## Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.
