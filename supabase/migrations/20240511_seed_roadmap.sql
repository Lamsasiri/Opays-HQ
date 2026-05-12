-- Seed data for Knowledge & Team Structure
INSERT INTO knowledge_articles (title, content, category, target_role) VALUES 
(
  'Gouvernance & Rôles Opays', 
  'Structuration de l''équipe de 5 :\n\n1. Lead Tech (Vous) : Architecture & Stratégie.\n2. Evans : Développement Fullstack & DevOps.\n3. Pôle Commercial (Les 2 Filles) : Prospection, ROI simulations et closing.\n4. Juriste : Pacte d''associés, conformité et support ventes complexes.', 
  'VISION', 
  NULL
),
(
  'Le Cycle de Vente Studio', 
  'Méthode en 3 étapes pour les commerciales :\n1. Sourcing Lead : Ajouter dans l''onglet Leads.\n2. Audit ROI : Utiliser le calculateur du Studio pour prouver les gains.\n3. Closing : Générer le contrat dans l''onglet Contrats.', 
  'METHOD', 
  'SALES'
),
(
  'Standard Technique Workspace', 
  'Evans : Chaque déploiement doit être suivi d''un log dans le Workspace. Utiliser le bouton "Run Build" pour simuler et valider l''intégrité avant livraison client.', 
  'TECH', 
  'CTO'
);

-- Note: Ensure profiles exist before assigning tasks.
-- This script adds general templates.
