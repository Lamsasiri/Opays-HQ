# 👥 Organigramme Opays Tech — Source de Vérité

> **Dernière mise à jour :** 12 mai 2026
> **Statut :** Document officiel — toute modification doit être validée par le DG.

---

## Structure de l'Équipe (5 membres)

| # | Nom | Poste | Rôle HQ | Type | Périmètre |
|---|---|---|---|---|---|
| 1 | **Fenelon LAMSASIRI** | Directeur Général & Lead R&D | `CEO` | `ASSOCIATE` | Vision, R&D, Gouvernance, Validation |
| 2 | **Membre Associé** | Directeur Technique (CTO) | `CTO` | `ASSOCIATE` | Développement, Infrastructure, Qualité |
| 3 | **Membre Associé** | Chef Commercial (CSO) | `SALES` | `ASSOCIATE` | Coordination terrain, Négociation, Pipeline |
| 4 | **Membre Associé** | Sales & Gestion Comptable | `SALES` | `ASSOCIATE` | Prospection, Comptabilité, Trésorerie |
| 5 | **Membre Associé** | Sales & Communication | `SALES` | `ASSOCIATE` | Prospection, Branding, Communication |

---

## Responsabilités Détailées

### 1. DG & Lead R&D (CEO) — Fenelon LAMSASIRI
- **Gouvernance :** Arbitrage des décisions majeures, partenariats stratégiques.
- **R&D Stratégique :** Veille IA, automatisation avancée, souveraineté de données.
- **Supervision Technique :** Appui au CTO sur l'architecture complexe.
- **Validation d'Audit :** Décision finale sur faisabilité technique et commerciale.
- **KPIs :** Avancement roadmap R&D, rentabilité globale, satisfaction client.

### 2. CTO
- **Développement :** Pilotage et exécution du code pour les projets clients.
- **Infrastructure :** Maintenance serveurs, sécurité, disponibilité services.
- **Qualité & Tests :** Validation technique avant livraison (Definition of Done).
- **Support R&D :** Interface technique avec le DG pour les besoins de recherche.
- **KPIs :** Respect des délais, bugs/résolution (SLA), disponibilité infra.

### 3. CSO
- **Coordination Terrain :** Planification des descentes commerciales.
- **Relation Client (CRM) :** Interface entre besoins identifiés et équipe technique.
- **Négociation & Closing :** Finalisation des ventes et signature contrats.
- **Reporting :** Analyse du pipeline, remontée des goulots d'étranglement.
- **KPIs :** Taux de conversion Leads → Projets, descentes/mois, pipeline value.

### 4. Sales & Comptabilité
- **Prospection Terrain :** Visite d'entreprises, écoute et identification des blocages.
- **Audit de Besoin :** Collecte des données primaires chez le client.
- **Comptabilité :** Saisie journalière trésorerie, suivi factures, relance paiements.
- **Gestion Administrative :** Archivage documents comptables et justificatifs.
- **KPIs :** Nouveaux leads qualifiés/semaine, exactitude trésorerie, recouvrement.

### 5. Sales & Communication
- **Prospection Terrain :** Identification des goulots et promotion des solutions Opays.
- **Branding & Design :** Supports de présentation, plaquettes, visuels de marque.
- **Communication Externe :** LinkedIn, Réseaux, Événements pour attirer les dirigeants.
- **Storytelling :** Traduction des succès techniques en études de cas compréhensibles.
- **KPIs :** Nouveaux leads qualifiés/semaine, engagement marque, qualité supports.

---

## Mapping Rôles ↔ Modules HQ

| Module HQ | CEO | CTO | CSO | Sales |
|---|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Projets | ✅ Écriture | ✅ Écriture | ✅ Lecture | ✅ Lecture |
| Workspace | ✅ | ✅ | ❌ | ❌ |
| Tâches | ✅ | ✅ | ✅ | ✅ |
| Leads / CRM | ✅ | ❌ | ✅ | ✅ |
| Studio (Vente) | ✅ | ❌ | ✅ | ✅ |
| Coordination | ✅ | ❌ | ✅ | ❌ |
| Brand Assets | ✅ | ❌ | ✅ | ✅ |
| Contrats | ✅ | ❌ | ❌ | ❌ |
| Equity / Actions | ✅ | ✅ (lecture) | ✅ (lecture) | ✅ (lecture) |
| Trésorerie | ✅ | ❌ | ❌ | ✅ (Responsable Compta) |
| Knowledge | ✅ | ✅ | ✅ | ✅ |
| Boîte à Idées | ✅ | ✅ | ✅ | ✅ |
| Labs (R&D) | ✅ | ✅ | ❌ | ❌ |
| Settings | ✅ | ✅ | ❌ | ❌ |

---

## Cycle Opérationnel Hebdomadaire

| Jour | Rituel | Participants | Module HQ |
|---|---|---|---|
| **Lundi** | Briefing — Nouvelles tâches, état trésorerie | Tous | Dashboard + Tasks |
| **Mercredi** | Sales Check — Simulations ROI, état contrats | Équipe Commerciale + DG | Studio + Contracts |
| **Vendredi** | Build Review — Validation technique, close tasks | CTO + DG | Workspace + Tasks |

---

## Hébergement & Infrastructure

| Service | Fournisseur | Détail |
|---|---|---|
| **Frontend HQ** | Vercel | Next.js App Router |
| **Base de données** | Supabase | PostgreSQL + Auth + RLS |
| **Site vitrine** | Cloudflare Pages | Vite + TanStack Router |
