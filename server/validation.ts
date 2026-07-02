/**
 * Schémas de validation Zod pour toutes les routes API.
 * Centralisé pour maintenabilité et cohérence.
 */

import { z } from 'zod';

// ─── Auth ──────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(1, 'Mot de passe requis'),
});

export const registerSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Mot de passe trop court (min 6 car.)'),
  full_name: z.string().optional(),
  role_name: z
    .enum(['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer', 'employee'])
    .optional(),
});

// ─── Projects ──────────────────────────────────────────────

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Nom du projet requis').max(200),
  description: z.string().max(2000).optional(),
  start_date: z.string().optional(),
  deadline: z.string().optional(),
  budget: z.number().nonnegative().optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['planning', 'active', 'paused', 'completed', 'cancelled']).optional(),
  branch: z.string().optional(),
  tech_stack: z.array(z.string()).optional(),
  due_date: z.string().optional(),
  gross_margin_projected: z.number().optional(),
  gross_margin_real: z.number().optional(),
  client_feedback: z.string().optional(),
});

// ─── Tasks ──────────────────────────────────────────────────

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(300),
  description: z.string().max(5000).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  project_id: z.string().uuid().optional(),
  assignee_id: z.string().uuid().optional(),
  due_date: z.string().optional(),
});

export const updateTaskStatusSchema = z.object({
  status: z.enum(['todo', 'in_progress', 'review', 'done', 'cancelled']),
});

// ─── Treasury ───────────────────────────────────────────────

export const createTreasuryLogSchema = z.object({
  amount: z.number({ required_error: 'Montant requis' }),
  type: z.enum(['income', 'expense', 'transfer']),
  description: z.string().max(500).optional(),
  category: z.string().max(100).optional(),
});

// ─── Users ──────────────────────────────────────────────────

export const updateProfileSchema = z.object({
  full_name: z.string().min(1).max(200).optional(),
  avatar_url: z.string().url().optional().nullable(),
});

export const inviteUserSchema = z.object({
  email: z.string().email('Email invalide'),
  full_name: z.string().max(200).optional(),
  role_name: z
    .enum(['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer', 'employee'])
    .optional(),
});

export const updateUserRoleSchema = z.object({
  role_name: z.enum(['admin', 'ceo', 'coo', 'cto', 'sales', 'engineer', 'employee']),
});

// ─── Knowledge ──────────────────────────────────────────────

export const createArticleSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(300),
  content: z.string().min(1, 'Contenu requis'),
  target_role_id: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// ─── Leads / CRM ────────────────────────────────────────────

export const createLeadSchema = z.object({
  company_name: z.string().min(1, "Nom de l'entreprise requis").max(300),
  contact_name: z.string().max(200).optional(),
  email: z.string().email().optional().or(z.literal('')),
  phone: z.string().max(50).optional(),
  estimated_value: z.number().nonnegative().optional(),
  status: z.enum(['new', 'contacted', 'audit', 'proposal', 'won', 'lost']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  assignee_id: z.string().uuid().optional(),
  notes: z.string().max(5000).optional(),
});

export const updateLeadSchema = createLeadSchema.partial();

// ─── HR ──────────────────────────────────────────────────────

export const upsertHrSchema = z.object({
  salary: z.number().nonnegative().optional().nullable(),
  performance_score: z.number().min(0).max(100).optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
});

// ─── Invoices ────────────────────────────────────────────────

export const createInvoiceSchema = z.object({
  type: z.enum(['sale', 'proforma', 'credit_note', 'debit_note', 'quote']),
  client_name: z.string().min(1, 'Nom client requis').max(300),
  client_email: z.string().email().optional().or(z.literal('')),
  client_address: z.string().max(500).optional(),
  client_tax_id: z.string().max(50).optional(),
  items: z.array(z.record(z.unknown())).min(1, 'Au moins un article requis'),
  subtotal: z.number().nonnegative('Sous-total requis'),
  tax_rate: z.number().min(0).max(100).optional(),
  tax_amount: z.number().nonnegative().optional(),
  discount_percent: z.number().min(0).max(100).optional(),
  discount_amount: z.number().nonnegative().optional(),
  total: z.number().nonnegative('Total requis'),
  currency: z.string().length(3).optional(),
  notes: z.string().max(2000).optional(),
  terms: z.string().max(2000).optional(),
  due_date: z.string().optional(),
  issued_date: z.string().optional(),
  project_id: z.string().uuid().optional(),
});

export const updateInvoiceStatusSchema = z.object({
  status: z.enum(['draft', 'sent', 'paid', 'overdue', 'cancelled']),
});

// ─── Calendar ────────────────────────────────────────────────

export const createEventSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(300),
  description: z.string().max(2000).optional(),
  start_time: z.string().min(1, 'Date de début requise'),
  end_time: z.string().optional(),
  location: z.string().max(300).optional(),
});

// ─── Ideas ───────────────────────────────────────────────────

export const createIdeaSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(300),
  description: z.string().max(5000).optional(),
  category: z.enum(['TECH', 'SALES', 'OPS', 'OTHER']).optional(),
});

// ─── Marketing ───────────────────────────────────────────────

export const createMarketingTemplateSchema = z.object({
  name: z.string().min(1, 'Nom requis').max(200),
  description: z.string().max(500).optional(),
  category: z.enum(['email', 'social', 'landing', 'print', 'other']).optional(),
  content: z.any(),
  variables: z.array(z.string()).optional(),
});

export const updateMarketingTemplateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  category: z.enum(['email', 'social', 'landing', 'print', 'other']).optional(),
  content: z.any().optional(),
  variables: z.array(z.string()).optional(),
  is_active: z.number().min(0).max(1).optional(),
});

// ─── Job Descriptions ────────────────────────────────────────

export const createJobDescriptionSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(300),
  role_name: z.string().max(200).optional(),
  responsibilities: z.string().max(10000).optional(),
  salary_range: z.string().max(100).optional(),
  access_level: z.string().max(100).optional(),
});

// ─── Site Content ────────────────────────────────────────────

export const updateSiteContentSchema = z.object({
  content: z.string().min(1, 'Contenu requis'),
});

// ─── Equity ──────────────────────────────────────────────────

export const createEquityLogSchema = z.object({
  user_id: z.string().uuid('ID utilisateur requis'),
  shares_vested: z.number().nonnegative('Nombre de parts requis'),
  total_shares: z.number().nonnegative('Total des parts requis'),
  vesting_date: z.string().min(1, 'Date de vesting requise'),
  notes: z.string().max(1000).optional(),
});

// ─── Contracts ───────────────────────────────────────────────

export const createContractSchema = z.object({
  project_id: z.string().uuid().optional(),
  url: z.string().url('URL du contrat requise'),
  signed_at: z.string().optional(),
  version: z.string().max(50).optional(),
});

// ─── Sovereign Research ──────────────────────────────────────

export const createSovereignResearchSchema = z.object({
  title: z.string().min(1, 'Titre requis').max(300),
  abstract: z.string().max(5000).optional(),
  content_url: z.string().url().optional().or(z.literal('')),
});

// ─── Contacts ────────────────────────────────────────────────

export const updateContactStatusSchema = z.object({
  status: z.enum(['new', 'read', 'replied', 'archived']),
  notes: z.string().max(2000).optional(),
});

// ─── Pagination ──────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(200).default(50),
});

export type Pagination = { page: number; limit: number; offset: number };
export function parsePagination(query: Record<string, unknown>): Pagination {
  const result = paginationSchema.safeParse(query);
  if (!result.success) return { page: 1, limit: 50, offset: 0 };
  return {
    page: result.data.page,
    limit: result.data.limit,
    offset: (result.data.page - 1) * result.data.limit,
  };
}