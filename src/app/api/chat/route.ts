import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Config OpenRouter
const openrouter = openai({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages, userProfile } = await req.json();
  const supabase = await createServerSupabaseClient();

  const result = await streamText({
    model: openrouter('deepseek/deepseek-chat'),
    system: `Tu es Antigravity OS, l'IA de pilotage de OPAYS HQ.
    Utilisateur actuel: ${userProfile?.full_name} (${userProfile?.role}).
    
    Tes instructions:
    1. Sois pro-actif. Si l'utilisateur a une idée, propose de créer la tâche.
    2. Pour les posts LinkedIn ou contrats, génère d'abord un brouillon dans le chat.
    3. Tu as accès à des outils réels. Utilise-les pour agir sur la plateforme.
    4. Toujours confirmer quand une action (comme créer une tâche) a été réussie.`,
    messages,
    tools: {
      // SKILL: Créer une tâche
      create_task: tool({
        description: 'Crée une nouvelle tâche dans le système Opays HQ',
        parameters: z.object({
          title: z.string().describe('Le titre de la tâche'),
          description: z.string().optional().describe('Détails de la tâche'),
          priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
          assigned_to_name: z.string().optional().describe('Le nom de la personne à qui assigner la tâche'),
          due_date: z.string().optional().describe('Date d\'échéance au format YYYY-MM-DD'),
        }),
        execute: async ({ title, description, priority, assigned_to_name, due_date }) => {
          let assigned_to_id = null;
          
          if (assigned_to_name) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('id')
              .ilike('full_name', `%${assigned_to_name}%`)
              .single();
            assigned_to_id = profile?.id;
          }

          const { data, error } = await supabase
            .from('tasks')
            .insert({
              title,
              description,
              priority,
              assigned_to: assigned_to_id,
              due_date: due_date || null,
              status: 'TODO'
            })
            .select()
            .single();

          if (error) return { error: error.message };
          return { success: true, task: data };
        },
      }),

      // SKILL: Analyser l'équipe
      get_team_info: tool({
        description: 'Récupère la liste des membres de l\'équipe et leurs rôles',
        parameters: z.object({}),
        execute: async () => {
          const { data } = await supabase.from('profiles').select('full_name, role, type');
          return { team: data };
        },
      }),

      // SKILL: Rédiger du contenu (LinkedIn, Contrat, etc.)
      draft_content: tool({
        description: 'Aide à la rédaction de contenu stratégique',
        parameters: z.object({
          type: z.enum(['LINKEDIN_POST', 'CONTRACT_CLAUSE', 'EMAIL_OUTREACH']),
          topic: z.string().describe('Le sujet du contenu'),
          tone: z.string().default('Professionnel et percutant'),
        }),
        execute: async ({ type, topic, tone }) => {
          // Ici on laisse l'IA générer le texte dans sa réponse principale
          return { status: 'ready_to_draft', instructions: `Génère maintenant le ${type} sur le sujet "${topic}" avec un ton ${tone}.` };
        },
      }),
    },
    // Autoriser l'IA à appeler plusieurs outils et à répondre immédiatement
    maxSteps: 5, 
  });

  return result.toDataStreamResponse();
}
