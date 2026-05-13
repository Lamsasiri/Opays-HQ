-- Mise à jour des membres de l'équipe avec les noms réels
-- On part du principe que les IDs seront liés via l'auth, mais on pré-remplit les profils si possible
-- Ou on met à jour les profils existants.

-- Fenelon Lamsasiri (CEO)
UPDATE profiles SET full_name = 'Fenelon Lamsasiri', role = 'CEO', type = 'ASSOCIATE' WHERE role = 'CEO' OR full_name LIKE '%Fenelon%';

-- Evans (CTO)
UPDATE profiles SET full_name = 'Evans', role = 'CTO', type = 'ASSOCIATE' WHERE role = 'CTO' OR full_name LIKE '%Evans%';

-- Prince (COO/Coordination)
UPDATE profiles SET full_name = 'Prince', role = 'COO', type = 'ASSOCIATE' WHERE role = 'COO' OR full_name LIKE '%Prince%';

-- Patricia (Sales)
UPDATE profiles SET full_name = 'Patricia', role = 'SALES', type = 'ASSOCIATE' WHERE full_name LIKE '%Patricia%';

-- Zaina (Sales)
UPDATE profiles SET full_name = 'Zaina', role = 'SALES', type = 'ASSOCIATE' WHERE full_name LIKE '%Zaina%';

-- Insertion si absents (pour démo/structure)
INSERT INTO profiles (id, full_name, role, type, is_admin)
SELECT uuid_generate_v4(), 'Fenelon Lamsasiri', 'CEO', 'ASSOCIATE', true
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE full_name = 'Fenelon Lamsasiri');

INSERT INTO profiles (id, full_name, role, type, is_admin)
SELECT uuid_generate_v4(), 'Evans', 'CTO', 'ASSOCIATE', true
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE full_name = 'Evans');

INSERT INTO profiles (id, full_name, role, type, is_admin)
SELECT uuid_generate_v4(), 'Prince', 'COO', 'ASSOCIATE', true
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE full_name = 'Prince');

INSERT INTO profiles (id, full_name, role, type)
SELECT uuid_generate_v4(), 'Patricia', 'SALES', 'ASSOCIATE'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE full_name = 'Patricia');

INSERT INTO profiles (id, full_name, role, type)
SELECT uuid_generate_v4(), 'Zaina', 'SALES', 'ASSOCIATE'
WHERE NOT EXISTS (SELECT 1 FROM profiles WHERE full_name = 'Zaina');
