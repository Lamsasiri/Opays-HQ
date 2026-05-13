import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Erreur : NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Configuration - À adapter selon votre structure Obsidian
const OBSIDIAN_PATH = process.env.OBSIDIAN_VAULT_PATH || '../obsidian-vault'; // Chemin relatif ou absolu
const CATEGORY_DEFAULT = 'METHOD';

async function syncObsidian() {
  console.log("🧠 Démarrage de la synchronisation Obsidian -> Opays HQ...");

  if (!fs.existsSync(OBSIDIAN_PATH)) {
    console.error(`❌ Le dossier Obsidian n'existe pas : ${OBSIDIAN_PATH}`);
    return;
  }

  const files = fs.readdirSync(OBSIDIAN_PATH).filter(file => file.endsWith('.md'));
  
  console.log(`📂 ${files.length} fichiers trouvés dans le vault.`);

  for (const file of files) {
    const filePath = path.join(OBSIDIAN_PATH, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const title = file.replace('.md', '');

    // Extraction basique des métadonnées (frontmatter simplifié)
    // Exemple : --- category: TECH ---
    const categoryMatch = content.match(/category:\s*(METHOD|GUIDE|VISION|TECH)/i);
    const roleMatch = content.match(/target_role:\s*(\w+)/i);
    
    const category = categoryMatch ? categoryMatch[1].toUpperCase() : CATEGORY_DEFAULT;
    const target_role = roleMatch ? roleMatch[1].toUpperCase() : null;

    // Nettoyage du contenu (on enlève le frontmatter pour le stockage)
    const cleanContent = content.replace(/^---[\s\S]*?---/, '').trim();

    console.log(`🔄 Synchronisation : "${title}" [${category}]`);

    // Vérifier si l'article existe déjà par son titre
    const { data: existingArticle } = await supabase
      .from('knowledge_articles')
      .select('id')
      .eq('title', title)
      .maybeSingle();

    if (existingArticle) {
      // Mise à jour
      const { error } = await supabase
        .from('knowledge_articles')
        .update({
          content: cleanContent,
          category,
          target_role,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingArticle.id);
      
      if (error) console.error(`❌ Erreur Update "${title}" :`, error.message);
      else console.log(`✅ Mis à jour : "${title}"`);
    } else {
      // Insertion
      const { error } = await supabase
        .from('knowledge_articles')
        .insert({
          title,
          content: cleanContent,
          category,
          target_role,
        });
      
      if (error) console.error(`❌ Erreur Insert "${title}" :`, error.message);
      else console.log(`✨ Créé : "${title}"`);
    }
  }

  console.log("✅ Synchronisation terminée ! L'IA d'Opays HQ est maintenant à jour avec vos cerveaux Obsidian.");
}

syncObsidian().catch(err => {
  console.error("💥 Erreur critique lors de la synchronisation :", err);
});
