import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { createServerSupabaseClient } from '@/lib/supabase-server';

// Config OpenRouter
const openrouter = createOpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
});

export async function POST(req: Request) {
  const { messages, userProfile, modelId } = await req.json();
  const supabase = await createServerSupabaseClient();

  const selectedModel = modelId || 'deepseek/deepseek-chat';

  const result = await streamText({
    model: openrouter(selectedModel),
    system: `Tu es Antigravity OS, l'IA de pilotage de OPAYS HQ.
    Utilisateur actuel: ${userProfile?.full_name} (${userProfile?.role}).
    
    Tu es un expert en gestion d'entreprise. Tu as accès à la base de données réelle.
    Lorsque tu analyses des données (activité, finances, connaissance), sois précis et donne des chiffres si possible.`,
    messages,
    tools: {
      // SKILL 1: Gestion des Tâches (existant)
      create_task: tool({
        description: 'Crée une nouvelle tâche',
        parameters: z.object({
          title: z.string(),
          description: z.string().optional(),
          priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
          assigned_to_name: z.string().optional(),
        }),
        execute: async (params: any) => {
          let assigned_to_id = null;
          if (params.assigned_to_name) {
            const { data } = await supabase.from('profiles').select('id').ilike('full_name', `%${params.assigned_to_name}%`).single();
            assigned_to_id = data?.id;
          }
          const { data, error } = await supabase.from('tasks').insert({
            title: params.title,
            description: params.description,
            priority: params.priority,
            assigned_to: assigned_to_id,
            status: 'TODO'
          }).select().single();
          return error ? { error: error.message } : { success: true, task: data };
        },
      }),

      // SKILL 2: Analyse de l'Activité
      get_activity_report: tool({
        description: 'Récupère les dernières activités de l\'entreprise',
        parameters: z.object({
          limit: z.number().default(10),
        }),
        execute: async ({ limit }) => {
          const { data, error } = await supabase
            .from('activity_log')
            .select('created_at, action, entity_type, entity_title, actor_id')
            .order('created_at', { ascending: false })
            .limit(limit);
          
          if (error) return { error: error.message };
          return { activities: data };
        },
      }),

      // SKILL 3: Recherche dans la base de connaissance
      search_knowledge: tool({
        description: 'Cherche des informations dans les articles de méthode et guides',
        parameters: z.object({
          query: z.string(),
        }),
        execute: async ({ query }) => {
          const { data, error } = await supabase
            .from('knowledge_articles')
            .select('title, content, category')
            .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
            .limit(3);
          
          if (error) return { error: error.message };
          return { articles: data };
        },
      }),

      // SKILL 4: Rapport Financier
      get_financial_snapshot: tool({
        description: 'Récupère un résumé de la trésorerie et des factures en attente',
        parameters: z.object({}),
        execute: async () => {
          // 1. Récupérer les 30 derniers jours de treasury_logs
          const { data: logs } = await supabase.from('treasury_logs').select('type, amount');
          // 2. Récupérer les factures PENDING
          const { data: billing } = await supabase.from('project_billing').select('amount_total, amount_paid').eq('status', 'PENDING');
          
          const income = logs?.filter(l => l.type === 'INCOME').reduce((acc, curr) => acc + curr.amount, 0) || 0;
          const expenses = logs?.filter(l => l.type === 'EXPENSE').reduce((acc, curr) => acc + curr.amount, 0) || 0;
          const pending = billing?.reduce((acc, curr) => acc + (curr.amount_total - curr.amount_paid), 0) || 0;

          return { 
            balance: income - expenses,
            total_income: income,
            total_expenses: expenses,
            pending_invoices_amount: pending
          };
        },
      }),
    },
  });

  return result.toDataStreamResponse();
}
