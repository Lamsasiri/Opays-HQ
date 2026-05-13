# Guide d'Utilisation - OPAYS HQ

## 1. Introduction
OPAYS HQ est l'outil central de gestion pour l'équipe d'OPAYS TECH. Il permet de coordonner les ventes, le développement technique, la gouvernance et le suivi financier.

> **Document de référence pour l'équipe :** `docs/TEAM.md`
> **Hébergement :** Vercel (Frontend) + Supabase (Base de données + Auth)

## 2. Guide par Rôle

### 👤 DG / CEO (Fenelon LAMSASIRI)
- **Vue complète :** Accès à tous les modules (Dashboard, Projets, Leads, Trésorerie, Equity, Settings).
- **Pilotage :** Gestion des accès de l'équipe via Paramètres > Contrôle des Accès.
- **R&D :** Accès au module Labs pour la veille technologique et la recherche.

### 💻 CTO
- **Projets :** Créer et gérer les projets techniques liés aux Leads gagnés.
- **Workspace :** Console technique pour le suivi des builds et déploiements.
- **Tâches :** Définir les Definition of Done et assigner les tâches.
- **Labs :** Recherche et prototypage de nouvelles solutions.

### 📊 CSO / Sales / Communication
- **Leads :** Ajouter chaque nouveau contact dans le module Prospects.
- **Studio :** Utiliser le calculateur ROI pour les simulations client.
- **Coordination :** Planifier les interventions terrain.
- **Brand Assets :** Créer et gérer les supports de communication.
- **Trésorerie :** Saisie journalière des recettes et dépenses.

## 3. Système d'Invitations
Pour ajouter un membre :
1. Allez dans **Paramètres > Inviter un Membre**.
2. Renseignez l'email, le rôle, le type (Associé/Employé), les parts et le salaire.
3. Cliquez sur **Envoyer l'invitation**.
4. Le nouveau membre recevra un lien de connexion. Son rôle sera automatiquement assigné depuis l'invitation.

## 4. Kanban des Tâches
Le module Tâches fonctionne en mode **Kanban** (3 colonnes) :
- **À faire** → **En cours** → **Terminé**
- Glissez-déposez les tâches pour changer leur statut.
- Filtrez par assigné, projet ou priorité via le panneau de filtres.

## 5. Cycle Opérationnel Hebdomadaire
| Jour | Rituel | Module |
|---|---|---|
| Lundi | Briefing équipe | Dashboard + Tasks |
| Mercredi | Sales Check | Studio + Contracts |
| Vendredi | Build Review | Workspace + Tasks |

## 6. Maintenance de l'Outil
L'application est hébergée sur **Vercel** et utilise **Supabase** pour la base de données et l'authentification. En cas de bug, contactez le DG ou le CTO.
