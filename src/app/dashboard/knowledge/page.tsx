"use client";

import React, { useEffect, useMemo, useState } from 'react';
import { createClient } from '@/lib/supabase';
import {
  BookOpen,
  GraduationCap,
  Lightbulb,
  Target,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  FileText,
  Shield,
  CalendarDays,
  Search,
} from 'lucide-react';
import NewKnowledgeModal from '@/components/modals/NewKnowledgeModal';
import DocumentReaderModal from '@/components/DocumentReaderModal';

const IconMap: Record<string, React.ReactNode> = {
  METHOD: <Target className="text-cyan-300" size={22} />,
  GUIDE: <GraduationCap className="text-emerald-300" size={22} />,
  VISION: <Lightbulb className="text-amber-300" size={22} />,
  TECH: <BookOpen className="text-violet-300" size={22} />,
};

const CategoryLabel: Record<string, string> = {
  METHOD: 'Méthode',
  GUIDE: 'Guide',
  VISION: 'Vision',
  TECH: 'Tech',
};

const featuredGuides = [
  {
    id: 'featured-ai-native',
    title: 'Pourquoi Opays est une entreprise AI-Native',
    category: 'VISION',
    target_role: 'ALL',
    created_at: new Date().toISOString(),
    content: `# Q: Qu\u2019est-ce qu\u2019une entreprise AI-Native ?
### R:
- Une entreprise AI-Native utilise l\u2019IA comme un r\u00e9flexe de travail quotidien, pas comme un gadget ou un argument marketing.
- Concr\u00e8tement, cela veut dire que chaque membre de l\u2019\u00e9quipe sait quand et comment utiliser l\u2019IA pour gagner du temps.
- L\u2019IA n\u2019est pas un d\u00e9partement \u00e0 part \u2014 elle est int\u00e9gr\u00e9e dans la fa\u00e7on de travailler de chacun.

## Q: En quoi cela change notre mani\u00e8re de travailler ?
### R:
- Les d\u00e9cisions deviennent plus rapides parce qu\u2019on a acc\u00e8s \u00e0 des analyses en temps r\u00e9el.
- Les t\u00e2ches r\u00e9p\u00e9titives (r\u00e9daction, tri, recherche) prennent 3x moins de temps.
- L\u2019\u00e9quipe se concentre sur ce qui cr\u00e9e de la valeur : la relation client, la qualit\u00e9, la cr\u00e9ativit\u00e9.
- Chaque document, chaque rapport, chaque email peut \u00eatre pr\u00e9par\u00e9 avec un assistant IA puis valid\u00e9 par un humain.

## Q: Quels sont les exemples concrets au quotidien ?
### R:
- **Commercial** : l\u2019IA aide \u00e0 pr\u00e9parer un email de prospection adapt\u00e9 au secteur du client.
- **Technique** : l\u2019IA g\u00e9n\u00e8re une premi\u00e8re version de documentation ou d\u00e9tecte des erreurs dans le code.
- **Communication** : l\u2019IA propose un brouillon de post LinkedIn que le r\u00e9dacteur affine.
- **Direction** : l\u2019IA synth\u00e9tise les donn\u00e9es d\u2019activit\u00e9 pour un point hebdomadaire en 2 minutes.

## Q: Qu\u2019est-ce qu\u2019on refuse de copier des autres ?
### R:
- Les promesses floues du type "l\u2019IA fait tout toute seule".
- Les m\u00e9thodes trop compliqu\u00e9es qui d\u00e9motivent l\u2019\u00e9quipe.
- Les outils qui envoient nos donn\u00e9es sensibles \u00e0 des tiers sans contr\u00f4le.
- L\u2019id\u00e9e que l\u2019IA remplace les gens \u2014 chez nous, elle les renforce.

## Q: Quelle est la r\u00e8gle d\u2019or ?
### R:
- L\u2019IA propose, l\u2019humain d\u00e9cide. Toujours.
- Si le r\u00e9sultat n\u2019est pas bon, on corrige et on am\u00e9liore la demande.
- On ne publie jamais un contenu g\u00e9n\u00e9r\u00e9 par l\u2019IA sans l\u2019avoir relu et valid\u00e9.`,
  },
  {
    id: 'featured-ai-helpers',
    title: 'Comment utiliser l’IA sans être technique',
    category: 'METHOD',
    target_role: 'ALL',
    created_at: new Date().toISOString(),
    content: `# Q: Faut-il savoir coder pour utiliser l\u2019IA chez Opays ?
### R:
- Non. Il faut surtout savoir expliquer un besoin clairement.
- L\u2019IA est un assistant : elle fait ce qu\u2019on lui demande, mais elle a besoin d\u2019instructions pr\u00e9cises.
- Plus ta demande est claire, meilleur sera le r\u00e9sultat.

## Q: \u00c0 quoi peut m\u2019aider l\u2019IA au quotidien ?
### R:
- **R\u00e9sumer un texte long** en 5 points cl\u00e9s.
- **R\u00e9diger un premier brouillon** d\u2019email, de rapport ou de post.
- **Pr\u00e9parer une r\u00e9ponse client** adapt\u00e9e au contexte.
- **Organiser des id\u00e9es** en plan structur\u00e9.
- **Corriger et am\u00e9liorer** un texte existant (ton, clart\u00e9, fautes).
- **Traduire** un document ou adapter un contenu pour un autre public.

## Q: Comment bien formuler ma demande ?
### R:
- Dire **ce qu\u2019on veut obtenir** : \"Je veux un email de relance pour un prospect qui n\u2019a pas r\u00e9pondu depuis 5 jours.\"
- Pr\u00e9ciser **pour qui** : \"Le ton doit \u00eatre professionnel mais chaleureux.\"
- Donner **un exemple** si possible.
- Indiquer **le format** : \"En 3 paragraphes maximum\" ou \"Sous forme de liste.\"

## Q: Qu\u2019est-ce qu\u2019il faut \u00e9viter ?
### R:
- Les demandes vagues : \"\u00c9cris-moi quelque chose de bien\" \u2192 trop flou.
- Les instructions contradictoires : \"Sois bref mais tr\u00e8s d\u00e9taill\u00e9.\"
- Laisser l\u2019IA d\u00e9cider seule sur des sujets sensibles.
- Copier-coller sans relire \u2014 l\u2019IA peut se tromper.

## Q: Comment savoir si le r\u00e9sultat est bon ?
### R:
- Le message est clair et compr\u00e9hensible par le destinataire.
- Le ton correspond \u00e0 l\u2019image d\u2019Opays : professionnel, simple, honn\u00eate.
- Les informations factuelles sont v\u00e9rifi\u00e9es.
- Tu serais \u00e0 l\u2019aise de signer ce texte avec ton nom.`,
  },
  {
    id: 'featured-operations',
    title: 'Notre rythme de travail hebdomadaire',
    category: 'GUIDE',
    target_role: 'ALL',
    created_at: new Date().toISOString(),
    content: `# Q: Pourquoi un rythme commun est essentiel ?
### R:
- Parce qu\u2019une petite \u00e9quipe de 5 personnes ne peut pas se permettre la confusion.
- Le rythme commun \u00e9vite les doublons, les oublis et la dispersion.
- Quand chacun sait ce qui se passe, la confiance et la vitesse augmentent.

## Q: Comment organiser une semaine chez Opays ?
### R:
1. **Lundi matin** \u2014 Point de cadrage (15 min) : chacun dit sa priorit\u00e9 de la semaine et ses blocages.
2. **Mardi \u00e0 jeudi** \u2014 Ex\u00e9cution : chacun avance sur ses t\u00e2ches, communique si un blocage appara\u00eet.
3. **Mercredi** \u2014 Check rapide asynchrone : un message dans le canal \u00e9quipe pour dire o\u00f9 on en est.
4. **Vendredi apr\u00e8s-midi** \u2014 Bilan de semaine (15 min) : ce qui est termin\u00e9, ce qui passe \u00e0 la semaine suivante.

## Q: Quelles r\u00e8gles simples suivre ?
### R:
- Une seule priorit\u00e9 par personne par semaine \u2014 pas 5.
- Si tu es bloqu\u00e9, dis-le dans les 24h, pas vendredi.
- Chaque t\u00e2che termin\u00e9e est mise \u00e0 jour dans HQ.
- On ne commence pas une nouvelle t\u00e2che avant d\u2019avoir fini la pr\u00e9c\u00e9dente.

## Q: Pourquoi ce rythme fonctionne ?
### R:
- Chacun conna\u00eet le cap et ses responsabilit\u00e9s.
- Les retards se d\u00e9tectent t\u00f4t, avant qu\u2019ils deviennent des probl\u00e8mes.
- On garde de la place pour r\u00e9agir aux urgences.
- L\u2019\u00e9quipe avance ensemble, pas chacun dans son coin.`,
  },
  {
    id: 'featured-client-trust',
    title: 'Comment servir le client avec confiance',
    category: 'GUIDE',
    target_role: 'ALL',
    created_at: new Date().toISOString(),
    content: `# Q: Qu\u2019est-ce qui compte le plus dans notre relation client ?
### R:
- **La clart\u00e9** : le client doit comprendre ce qu\u2019on fait, pourquoi, et quand ce sera pr\u00eat.
- **La fiabilit\u00e9** : quand on dit \"vendredi\", c\u2019est vendredi. Pas lundi.
- **La rapidit\u00e9 de r\u00e9ponse** : r\u00e9pondre dans les 24h, m\u00eame si c\u2019est pour dire \"je reviens vers vous demain\".
- **Le respect de la parole donn\u00e9e** : ne jamais promettre ce qu\u2019on ne peut pas livrer.

## Q: Que doit faire chaque membre de l\u2019\u00e9quipe ?
### R:
- R\u00e9pondre proprement et dans les d\u00e9lais.
- Pr\u00e9venir imm\u00e9diatement quand il y a un blocage ou un retard.
- Dire la v\u00e9rit\u00e9 plut\u00f4t que promettre trop vite pour faire plaisir.
- Garder le client inform\u00e9 m\u00eame quand il n\u2019y a pas de nouveau : \"Nous avan\u00e7ons, voici o\u00f9 nous en sommes.\"
- Ne jamais ignorer un message client, m\u00eame si la r\u00e9ponse n\u00e9cessite du temps.

## Q: Que faire quand un client est m\u00e9content ?
### R:
- \u00c9couter sans interrompre ni se justifier imm\u00e9diatement.
- Reformuler le probl\u00e8me pour montrer qu\u2019on a compris.
- Proposer une solution concr\u00e8te avec un d\u00e9lai.
- Faire un suivi apr\u00e8s la r\u00e9solution pour confirmer que tout est ok.

## Q: Pourquoi c\u2019est important ?
### R:
- La confiance se construit sur les petits gestes r\u00e9p\u00e9t\u00e9s, pas sur les grands discours.
- Un client satisfait en ram\u00e8ne d\u2019autres. Un client d\u00e9\u00e7u en \u00e9loigne 10.
- La qualit\u00e9 du service est notre meilleur argument commercial.`,
  },
  {
    id: 'featured-data-safety',
    title: 'Protéger les informations de l’entreprise',
    category: 'TECH',
    target_role: 'ALL',
    created_at: new Date().toISOString(),
    content: `# Q: Pourquoi la confidentialit\u00e9 est essentielle ?
### R:
- Nos informations internes (clients, finances, strat\u00e9gie) ont une vraie valeur.
- Un manque de discr\u00e9tion peut co\u00fbter un client, une opportunit\u00e9 ou la r\u00e9putation de l\u2019entreprise.
- Prot\u00e9ger les donn\u00e9es, c\u2019est prot\u00e9ger l\u2019\u00e9quipe et les clients.

## Q: Qu\u2019est-ce qu\u2019on ne partage jamais sans autorisation ?
### R:
- **Donn\u00e9es clients** : noms, contacts, projets en cours, chiffres.
- **Informations financi\u00e8res** : tr\u00e9sorerie, budgets, marges, salaires.
- **Acc\u00e8s techniques** : mots de passe, cl\u00e9s API, acc\u00e8s serveurs.
- **Documents strat\u00e9giques** : plans commerciaux, pipeline, roadmap.

## Q: Quels sont les bons r\u00e9flexes ?
### R:
- Si tu n\u2019es pas s\u00fbr de pouvoir partager une info, demande au responsable avant.
- Ne jamais envoyer de donn\u00e9es sensibles par messagerie non s\u00e9curis\u00e9e.
- Si un acc\u00e8s ne te sert plus, signale-le pour qu\u2019il soit r\u00e9voqu\u00e9.
- Ne pas stocker de mots de passe dans des fichiers texte ou des notes.
- Verrouiller ton poste quand tu t\u2019absentes, m\u00eame 5 minutes.

## Q: Que faire en cas de doute ou d\u2019incident ?
### R:
- Pr\u00e9venir imm\u00e9diatement le CTO ou le DG.
- Ne pas essayer de r\u00e9parer seul un probl\u00e8me de s\u00e9curit\u00e9.
- Documenter ce qui s\u2019est pass\u00e9 : quand, quoi, comment.
- Mieux vaut une fausse alerte qu\u2019un vrai probl\u00e8me non signal\u00e9.`,
  },
  {
    id: 'featured-roles',
    title: 'Bien travailler ensemble dans une petite équipe',
    category: 'METHOD',
    target_role: 'ALL',
    created_at: new Date().toISOString(),
    content: `# Q: Pourquoi les r\u00f4les doivent \u00eatre clairs ?
### R:
- Parce que dans une \u00e9quipe de 5 personnes, chaque flou cr\u00e9e un blocage.
- Quand tout le monde sait ce qu\u2019il doit faire, l\u2019\u00e9quipe avance 2x plus vite.
- La clart\u00e9 des r\u00f4les \u00e9vite les conflits et la duplication d\u2019effort.

## Q: Qu\u2019est-ce que chacun doit comprendre ?
### R:
- **Son r\u00f4le pr\u00e9cis** : ce qu\u2019on attend de lui chaque semaine.
- **Son niveau de responsabilit\u00e9** : ce qu\u2019il peut d\u00e9cider seul et ce qui n\u00e9cessite une validation.
- **\u00c0 qui demander de l\u2019aide** : pour chaque type de probl\u00e8me, il y a un interlocuteur principal.
- **Quand pr\u00e9venir l\u2019\u00e9quipe** : tout retard, tout blocage, toute d\u00e9cision importante.

## Q: Quelles r\u00e8gles de communication suivre ?
### R:
- R\u00e9pondre aux messages de l\u2019\u00e9quipe dans les 4 heures en journ\u00e9e de travail.
- Utiliser les canaux d\u00e9di\u00e9s : pas de discussion projet dans les messages priv\u00e9s.
- \u00catre direct et factuel : \"J\u2019ai termin\u00e9\" ou \"Je suis bloqu\u00e9 sur X, j\u2019ai besoin de Y.\" 
- \u00c9viter les longs messages quand un appel de 2 minutes r\u00e8gle le probl\u00e8me.

## Q: Quelle attitude aide vraiment ?
### R:
- **\u00catre fiable** : faire ce qu\u2019on dit, quand on le dit.
- **\u00catre simple** : pas de politique, pas de jeux. On parle franchement.
- **\u00catre r\u00e9actif** : ne pas laisser tra\u00eener les sujets importants.
- **Respecter le travail des autres** : critiquer les id\u00e9es, jamais les personnes.
- **Demander de l\u2019aide** quand on en a besoin \u2014 ce n\u2019est pas une faiblesse.`,
  },
  {
    id: 'featured-adaptation',
    title: 'Ce qu\u2019on apprend des autres sans se perdre',
    category: 'VISION',
    target_role: 'ALL',
    created_at: new Date().toISOString(),
    content: `# Q: Peut-on s\u2019inspirer d\u2019autres entreprises ?
### R:
- Oui, c\u2019est m\u00eame essentiel pour ne pas r\u00e9inventer la roue.
- Mais attention : on s\u2019inspire d\u2019une m\u00e9thode ou d\u2019une rigueur, jamais d\u2019une identit\u00e9 superficielle.
- Une bonne id\u00e9e ailleurs ne devient utile que si elle est adapt\u00e9e \u00e0 notre r\u00e9alit\u00e9 locale et \u00e0 nos valeurs.

## Q: Qu\u2019est-ce qu\u2019on retient d\u2019une inspiration ext\u00e9rieure ?
### R:
- **La discipline d\u2019ex\u00e9cution** : comment ils tiennent leurs d\u00e9lais et leurs promesses.
- **La clart\u00e9 du message** : comment ils expliquent des choses complexes simplement.
- **L\u2019obsession du client** : comment chaque d\u00e9tail est pens\u00e9 pour l\u2019utilisateur final.
- **La vitesse de test** : comment ils \u00e9chouent vite pour apprendre plus vite.

## Q: Qu\u2019est-ce qu\u2019on adapte sp\u00e9cifiquement \u00e0 Opays ?
### R:
- **Notre souverainet\u00e9** : nous privil\u00e9gions les solutions que nous ma\u00eetrisons.
- **Notre culture commando** : nous sommes une petite \u00e9quipe agile, pas une bureaucratie.
- **Notre pragmatisme** : si une m\u00e9thode \"moderne\" nous ralentit sans r\u00e9sultat concret, on la rejette.
- **Notre respect du contexte client** : nous n\u2019imposons pas d\u2019outils compliqu\u00e9s l\u00e0 o\u00f9 la simplicit\u00e9 suffit.

## Q: Quelle est la r\u00e8gle finale ?
### R:
- On garde ce qui nous rend plus forts, plus rapides et plus fiables.
- On laisse de c\u00f4t\u00e9 ce qui ne nous ressemble pas ou ce qui complexifie inutilement notre travail.
- L\u2019objectif n\u2019est pas d\u2019\u00eatre une copie, mais d\u2019\u00eatre la meilleure version d\u2019Opays Tech.`,
  },
  {
    id: 'featured-pitch',
    title: "Le pitch simple pour expliquer notre valeur",
    category: 'VISION',
    target_role: 'SALES',
    created_at: new Date().toISOString(),
    content: `# Q: Comment pr\u00e9senter Opays en une phrase ?
### R:
- \"Nous aidons les entreprises \u00e0 supprimer les lourdeurs administratives et op\u00e9rationnelles qui leur font perdre du temps, de l\u2019\u00e9nergie et de l\u2019argent.\"

## Q: Comment expliquer le b\u00e9n\u00e9fice sans jargon technique ?
### R:
- **Gain de temps** : ce qui prenait une journ\u00e9e prend d\u00e9sormais une heure.
- **Fiabilit\u00e9** : nous r\u00e9duisons les erreurs humaines li\u00e9es \u00e0 la saisie manuelle.
- **R\u00e9activit\u00e9** : vos clients re\u00e7oivent leurs r\u00e9ponses et leurs devis en quelques minutes.
- **Focus** : votre \u00e9quipe peut enfin se concentrer sur son vrai m\u00e9tier, pas sur la paperasse.

## Q: Quelle image utiliser pour marquer les esprits ?
### R:
- \"Imaginez votre entreprise comme un coureur qui porte un sac \u00e0 dos rempli de pierres inutiles. Notre r\u00f4le est d\u2019enlever ces pierres une par une pour vous permettre de courir plus vite et plus loin.\"

## Q: Que faut-il \u00e9viter \u00e0 tout prix ?
### R:
- Ne pas dire : \"Nous installons de l\u2019IA.\" \u2192 \u00c7a fait peur ou c\u2019est trop flou.
- Ne pas promettre de miracles : \"Tout sera automatique demain.\" \u2192 C\u2019est faux et dangereux.
- Ne pas oublier l\u2019aspect humain : nos outils sont l\u00e0 pour aider les gens, pas pour les remplacer.`,
  },
  {
    id: 'featured-audit-benefits',
    title: "Les b\u00e9n\u00e9fices d\u2019un audit IA",
    category: 'METHOD',
    target_role: 'SALES',
    created_at: new Date().toISOString(),
    content: `# Q: \u00c0 quoi sert r\u00e9ellement un audit Opays ?
### R:
- \u00c0 mettre en lumi\u00e8re les \"co\u00fbts invisibles\" : le temps perdu que personne ne comptabilise.
- \u00c0 identifier les erreurs r\u00e9p\u00e9titives qui nuisent \u00e0 l\u2019image de marque.
- \u00c0 comprendre o\u00f9 se situent les blocages dans la circulation de l\u2019information.

## Q: Quels sont les 5 b\u00e9n\u00e9fices cl\u00e9s \u00e0 mettre en avant ?
### R:
1. **Diagnostic de sant\u00e9 op\u00e9rationnelle** : savoir exactement o\u00f9 l\u2019argent s\u2019\u00e9chappe.
2. **Priorisation intelligente** : d\u00e9finir ce qu\u2019il faut automatiser en premier pour un ROI rapide.
3. **Optimisation des ressources** : mieux utiliser le talent de vos collaborateurs.
4. **S\u00e9curisation des processus** : rendre le travail moins d\u00e9pendant de la m\u00e9moire individuelle.
5. **Vision strat\u00e9gique** : pr\u00e9parer l\u2019entreprise aux d\u00e9fis de demain avec des bases solides.

## Q: Comment le dire simplement en conclusion ?
### R:
- \"L\u2019audit ne sert pas \u00e0 critiquer votre fa\u00e7on de faire, mais \u00e0 trouver ensemble comment vous lib\u00e9rer du temps pour ce qui compte vraiment pour votre croissance.\"`,
  },
  {
    id: 'featured-objections',
    title: 'R\u00e9pondre aux objections sur la s\u00e9curit\u00e9',
    category: 'GUIDE',
    target_role: 'SALES',
    created_at: new Date().toISOString(),
    content: `# Q: Que r\u00e9pondre si un client a peur pour ses donn\u00e9es ?
### R:
- \"C\u2019est une crainte l\u00e9gitime et nous la partageons. La s\u00e9curit\u00e9 est au c\u0153ur de notre m\u00e9thodologie.\"
- Expliquer que nous privil\u00e9gions le contr\u00f4le local et la limitation des acc\u00e8s.

## Q: Quels sont nos arguments de r\u00e9assurance ?
### R:
- **Cloisonnement** : vos donn\u00e9es ne sont jamais m\u00e9lang\u00e9es avec celles d\u2019autres clients.
- **Principe du moindre privil\u00e8ge** : seul le strict n\u00e9cessaire est accessible aux outils.
- **Trabilit\u00e9** : chaque action est journalis\u00e9e et auditable.
- **Souverainet\u00e9** : nous favorisons les solutions o\u00f9 vous gardez la propri\u00e9t\u00e9 totale de vos informations.

## Q: Quelle phrase simple pour r\u00e9sumer ?
### R:
- \"Notre r\u00f4le est de mettre l\u2019IA au service de votre s\u00e9curit\u00e9, pas de l\u2019affaiblir. Vos donn\u00e9es restent votre actif le plus pr\u00e9cieux, et nous sommes l\u00e0 pour les prot\u00e9ger.\"`,
  },
  {
    id: 'featured-value-proposal',
    title: 'Structure d\u2019une proposition de valeur gagnante',
    category: 'METHOD',
    target_role: 'SALES',
    created_at: new Date().toISOString(),
    content: `# Q: Comment structurer une proposition irr\u00e9sistible ?
### R:
- En suivant le parcours psychologique du client : Douleur \u2192 Vision \u2192 Solution \u2192 Preuve.

## Q: Quelles sont les 5 \u00e9tapes \u00e0 respecter ?
### R:
1. **La Situation Actuelle** : d\u00e9crire la r\u00e9alit\u00e9 brute du client aujourd\u2019hui (sans jugement).
2. **Le Co\u00fbt de l\u2019Inaction** : montrer ce que \u00e7a co\u00fbte en temps et en argent de ne rien changer.
3. **Le Futur Souhait\u00e9** : peindre le portrait d\u2019une entreprise lib\u00e9r\u00e9e de ses poids morts.
4. **Le Pont Opays** : expliquer comment nos solutions font le lien entre aujourd\u2019hui et demain.
5. **L\u2019Engagement R\u00e9ciproque** : d\u00e9finir la premi\u00e8re petite \u00e9tape facile \u00e0 franchir.

## Q: Pourquoi cette m\u00e9thode fonctionne ?
### R:
- Parce qu\u2019elle ne vend pas un produit, elle propose une transformation concr\u00e8te et mesurable.`,
  },
  {
    id: 'featured-discovery',
    title: 'L\u2019art de poser les bonnes questions (Audit)',
    category: 'GUIDE',
    target_role: 'SALES',
    created_at: new Date().toISOString(),
    content: `# Q: Pourquoi poser des questions est plus important que de parler ?
### R:
- Parce qu\u2019on ne peut pas soigner un patient sans faire de diagnostic pr\u00e9cis.
- Poser les bonnes questions positionne l\u2019expert Opays comme un partenaire strat\u00e9gique, pas comme un simple vendeur.

## Q: Quelles sont les questions magiques \u00e0 poser ?
### R:
- \"Si vous aviez une baguette magique, quelle est la t\u00e2che que vous feriez dispara\u00eetre imm\u00e9diatement ?\"
- \"Combien de fois par semaine vous dites-vous : \u2018il doit y avoir un moyen plus simple de faire \u00e7a\u2019 ?\"
- \"Quel est l\u2019impact sur votre moral (et celui de l\u2019\u00e9quipe) de passer des heures sur ces fichiers ?\"
- \"Qu\u2019est-ce que vous pourriez accomplir si vous aviez 10 heures de plus par semaine ?\"

## Q: Quel est l\u2019objectif final d\u2019un bon diagnostic ?
### R:
- Faire r\u00e9aliser au client l\u2019ampleur de son besoin par lui-m\u00eame. Un besoin d\u00e9couvert est 10x plus puissant qu\u2019un besoin expliqu\u00e9.`,
  },
];

function renderContent(content: string) {
  const lines = content.split('\n');
  const nodes: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (!listItems.length) return;
    nodes.push(
      <ul key={`${keyPrefix}-list-${nodes.length}`} className="space-y-2">
        {listItems.map((item, index) => (
          <li key={`${keyPrefix}-item-${index}`} className="flex gap-3 text-slate-200">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    );
    listItems = [];
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    if (!trimmed) {
      flushList(`blank-${index}`);
      nodes.push(<div key={`space-${index}`} className="h-2" />);
      return;
    }

    if (trimmed.startsWith('# ')) {
      flushList(`h1-${index}`);
      nodes.push(
        <h2 key={`h1-${index}`} className="text-xl font-semibold tracking-tight text-white">
          {trimmed.replace(/^#\s+/, '')}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith('## ')) {
      flushList(`h2-${index}`);
      nodes.push(
        <h3 key={`h2-${index}`} className="text-base font-semibold uppercase tracking-[0.22em] text-cyan-300">
          {trimmed.replace(/^##\s+/, '')}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith('### ')) {
      flushList(`h3-${index}`);
      nodes.push(
        <h4 key={`h3-${index}`} className="text-sm font-semibold text-slate-100">
          {trimmed.replace(/^###\s+/, '')}
        </h4>
      );
      return;
    }

    if (/^[-*]\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^[-*]\s+/, ''));
      return;
    }

    if (/^\d+\.\s+/.test(trimmed)) {
      listItems.push(trimmed.replace(/^\d+\.\s+/, ''));
      return;
    }

    flushList(`p-${index}`);
    nodes.push(
      <p key={`p-${index}`} className="leading-relaxed text-slate-200">
        {trimmed}
      </p>
    );
  });

  flushList('end');
  return nodes;
}

export default function KnowledgePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [readerOpen, setReaderOpen] = useState(false);
  const [articles, setArticles] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeArticleId, setActiveArticleId] = useState<string | null>(null);
  const [readerArticle, setReaderArticle] = useState<any>(null);
  const supabase = createClient();

  const fetchData = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profileData } = await supabase.from('profiles').select('role').eq('id', user.id).single();
      setProfile(profileData);
    }

    const { data } = await supabase
      .from('knowledge_articles')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setArticles(data);
      setActiveArticleId((current) => current ?? data[0]?.id ?? null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteArticle = async (id: string) => {
    if (confirm("Supprimer ce guide ?")) {
      const { error } = await supabase.from('knowledge_articles').delete().eq('id', id);
      if (!error) fetchData();
    }
  };

  const isAdmin = ['CEO', 'COO', 'ADMIN'].includes(profile?.role || '');

  const filteredArticles = useMemo(() => {
    const term = search.trim().toLowerCase();
    const pool = [...featuredGuides, ...articles];
    const uniquePool = pool.filter((article, index, self) => self.findIndex((item) => item.title === article.title) === index);
    if (!term) return uniquePool;
    return uniquePool.filter((article) =>
      [article.title, article.content, article.category, article.target_role]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term))
    );
  }, [articles, search]);

  const activeArticle = filteredArticles.find((article) => article.id === activeArticleId) || filteredArticles[0] || articles[0];

  const openReader = (article: any) => {
    setActiveArticleId(article.id);
    setReaderArticle(article);
    setReaderOpen(true);
  };

  return (
    <div className="relative min-h-full overflow-hidden bg-[#050816] text-slate-100">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.12),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(168,85,247,0.12),_transparent_28%),linear-gradient(180deg,#050816_0%,#090d1d_58%,#0b1020_100%)]" />
      <div className="relative z-10 mx-auto max-w-[1600px] space-y-8 p-6 md:p-8">
        <header className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-200 backdrop-blur">
              <Sparkles size={12} /> Guides d'alignement
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-white">Guides & savoir-faire</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-400">
                Des repères simples pour que toute l'équipe travaille dans la même direction, avec clarté et confiance.
              </p>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-5 py-3 text-sm font-semibold text-white shadow-xl shadow-black/20 backdrop-blur-xl transition hover:bg-white/15"
            >
              <Plus size={18} /> Nouveau Guide
            </button>
          )}
        </header>

        <div className="grid grid-cols-1 gap-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-slate-500">Repères d'équipe</p>
                <h2 className="mt-1 text-lg font-semibold text-white">{filteredArticles.length} articles</h2>
              </div>
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Rechercher un guide, une méthode..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-500/40"
                />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {filteredArticles.map((article) => {
                const active = article.id === activeArticle?.id;
                return (
                  <button
                    key={article.id}
                    onClick={() => openReader(article)}
                    className={`group rounded-[1.75rem] border p-5 text-left transition-all ${
                      active
                        ? 'border-cyan-500/30 bg-cyan-500/10 shadow-xl shadow-cyan-500/10'
                        : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-3">
                          {IconMap[article.category] || <BookOpen size={22} className="text-slate-300" />}
                        </div>
                        <div>
                          <h3 className="text-base font-semibold text-white">{article.title}</h3>
                          <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
                            {CategoryLabel[article.category] || article.category} • {article.target_role || 'ALL'}
                          </p>
                        </div>
                      </div>
                      <ArrowRight size={16} className={`mt-1 transition ${active ? 'text-cyan-300' : 'text-slate-500 group-hover:text-cyan-300'}`} />
                    </div>

                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-300">
                      {article.content}
                    </p>
                  </button>
                );
              })}

              {!loading && !filteredArticles.length && (
                <div className="col-span-full rounded-[2rem] border border-dashed border-white/10 py-20 text-center">
                  <p className="italic text-slate-500">Aucun guide disponible pour le moment.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      <NewKnowledgeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchData}
      />

      <DocumentReaderModal
        open={readerOpen}
        onClose={() => setReaderOpen(false)}
        title={readerArticle?.title || activeArticle?.title || 'Lecture'}
        subtitle="Lecture centrée pour mieux consulter le guide sans distraction."
        content={readerArticle?.content || activeArticle?.content}
        badge={CategoryLabel[readerArticle?.category || activeArticle?.category || ''] || 'Guide'}
        sourceLabel={readerArticle?.target_role || activeArticle?.target_role || 'ALL'}
      />
      </div>
    </div>
  );
}
