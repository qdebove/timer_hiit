# Timer HIIT (Next.js PWA)

Application Next.js + TailwindCSS pour piloter des chronomètres, des comptes à rebours et des sessions HIIT. L'interface est conçue pour fonctionner hors ligne comme PWA et prépare une abstraction de stockage local pour une future base de données.

## Scripts

- `npm install` pour installer les dépendances.
- `npm run dev` pour lancer le serveur Next.js en mode développement.
- `npm run build` pour produire le bundle optimisé et le service worker PWA.
- `npm run start` pour démarrer en production après build.
- `npm run lint` pour vérifier les règles ESLint/Next.

## Structure

- `app/` : routes App Router (page principale, layout, styles globaux).
- `components/` : UI réutilisable (timers, sessions, thème).
- `hooks/` : logique métier (timers, sessions, thème, persistance).
- `types/` : contrats TypeScript partagés.
- `lib/` : utilitaires (formats, génération d'identifiants).
- `public/` : assets statiques (manifest PWA, icônes).

## Fonctionnalités clés

- Création/duplication/suppression de timers et sessions.
- Gestion de l'état de lecture (start/pause/reset) avec persistance dans `localStorage`.
- Interface responsive avec mode sombre, barres de progression et cartes de contrôle.
- Manifest + service worker (via `next-pwa`) pour installation et fonctionnement offline.
