export type JobSection = {
  title: string;
  bullets: string[];
};

export type JobDescription = {
  slug: string;
  reference: string;
  title: string;
  holder: string;
  role: string;
  type: 'ASSOCIATE';
  summary: string;
  presentation: string;
  sections: JobSection[];
  kpis: string[];
  evolution: string[];
  conclusion: string;
};

export const jobDescriptions: JobDescription[] = [
  {
    slug: 'directeur-general',
    reference: 'OP-CEO-001',
    title: 'Directeur Général (CEO)',
    holder: 'Fenelon Lamsasiri',
    role: 'Vision & Stratégie',
    type: 'ASSOCIATE',
    summary:
      "Garant de la vision souveraine d'Opays Tech et de la cohérence stratégique entre l'innovation IA et l'exécution terrain pour le marché congolais et panafricain.",
    presentation:
      "En tant que Directeur Général, Fenelon Lamsasiri est l'architecte de la trajectoire d'Opays Tech. Son rôle transcende la simple gestion : il est le gardien de l'alignement entre les ambitions technologiques du Studio et les réalités économiques du terrain. Il s'assure que chaque innovation portée par l'équipe se traduit par une valeur ajoutée mesurable pour nos partenaires et une croissance durable pour la structure. Fenelon incarne la stabilité décisionnelle, garantissant que la promesse de souveraineté numérique reste au cœur de chaque déploiement.",
    sections: [
      {
        title: 'Leadership Stratégique & Diplomatie d\'Affaires',
        bullets: [
          'Définir et porter la vision "Sovereign IA" d\'Opays Tech auprès des décideurs et partenaires stratégiques.',
          'Arbitrer les priorités de développement pour maintenir l\'équilibre entre R&D et rentabilité immédiate.',
          'Identifier et sécuriser les relais de croissance à haut potentiel (secteurs critiques, grands comptes).',
          'Protéger la culture "Elite Commando" de l\'entreprise : rigueur, excellence et résultat.',
        ],
      },
      {
        title: 'Gouvernance & Structuration de l\'IP',
        bullets: [
          'Veiller à la protection de la propriété intellectuelle et des actifs technologiques du groupe.',
          'Superviser la structuration juridique et le pacte d\'associés pour garantir la pérennité d\'Opays.',
          'Mettre en place et animer les rituels de décision (Revue Stratégique Mensuelle).',
          'Garantir la transparence et l\'équité au sein du collège des associés.',
        ],
      },
      {
        title: 'Coordination Opérationnelle des Associés',
        bullets: [
          'Fédérer les 5 pôles (Tech, Coordination, Sales, Com, Legal) autour d\'objectifs trimestriels clairs.',
          'Animer le Command Center pour lever les blocages critiques en moins de 48h.',
          'Maintenir un haut niveau d\'exigence sur la documentation et la traçabilité des actions.',
          'Donner le cap lors des phases de pivot ou d\'accélération.',
        ],
      },
      {
        title: 'Pilotage de la R&D IA',
        bullets: [
          'Valider l\'intégration des nouvelles briques technologiques dans l\'OS Opays HQ.',
          'Orienter la recherche vers des cas d\'usage à fort ROI (Retour sur Investissement) client.',
          'Maintenir la veille sur les technologies souveraines et l\'automatisation avancée.',
        ],
      },
    ],
    kpis: [
      'Indice de croissance trimestriel (Objectif : +25% de CA ou d\'Assets)',
      'Santé de la Trésorerie & Runway (Maintien d\'un solde opérationnel sécurisé)',
      'Taux d\'alignement de l\'équipe (% d\'objectifs communs atteints)',
      'Qualité des Alliances Stratégiques (Signatures de partenariats pivots)',
    ],
    evolution: [
      'Transition vers un rôle de Président de Groupe avec l\'ouverture de filiales sectorielles.',
      'Expansion de l\'influence diplomatique tech au niveau panafricain.',
      'Pilotage de levées de fonds stratégiques pour l\'accélération infra.',
    ],
    conclusion:
      "Fenelon Lamsasiri assure que l'ambition d'Opays Tech reste lisible pour le monde et solide à l'intérieur. Il est le pivot qui transforme une vision technologique en une réalité souveraine et rentable.",
  },
  {
    slug: 'directeur-technique',
    reference: 'JD-OPAYS-002',
    title: 'Directeur Technique',
    holder: 'Evans SELEMANI',
    role: 'CTO',
    type: 'ASSOCIATE',
    summary:
      "Responsable de la qualité technique, de la stabilité des systèmes et de la livraison propre des solutions clients.",
    presentation:
      "Le Directeur Technique est celui qui transforme les besoins du client en systèmes qui marchent — et qui continuent de marcher. Il ne code pas pour le plaisir, il construit pour résoudre un problème réel. Son travail quotidien : su{2019}assurer que chaque solution livrée est fiable, sûre, maintenable et que le client peut la comprendre. La technologie nu{2019}est pas une fin en soi, cu{2019}est un moyen au service de la mission de lu{2019}entreprise.",
    sections: [
      {
        title: 'Développement et architecture',
        bullets: [
          'Concevoir des solutions robustes et adaptées au besoin réel du client, pas au besoin imaginé.',
          'Maintenir une architecture lisible : si un nouveau développeur ne comprend pas le code en 30 minutes, cu{2019}est trop compliqué.',
          'Réduire la dette technique de façon continue — ne pas accumuler de raccourcis dangereux.',
          'Choisir les technologies sur la base de critères simples : stabilité, communauté active, coût réel.',
          'Documenter chaque décision technique importante et son contexte.',
        ],
      },
      {
        title: 'Infrastructure et sécurité',
        bullets: [
          'Surveiller la disponibilité des services : si un client ne peut pas accéder à son outil, cu{2019}est une urgence.',
          'Protéger les accès, les données et les flux sensibles avec des pratiques standards (RLS, chiffrement, rotation des clés).',
          'Contribuer à la souveraineté technique : favoriser les solutions que lu{2019}entreprise maîtrise et peut contrôler.',
          'Mettre en place des sauvegardes automatiques et des procédures de récupération testées.',
          'Maintenir un inventaire à jour des accès, des services et des dépendances critiques.',
        ],
      },
      {
        title: 'Qualité et livraison',
        bullets: [
          'Valider le niveau de qualité avant chaque livraison : pas de déploiement sans test.',
          'Respecter la Definition of Done de chaque projet — si ce nu{2019}est pas terminé, ce nu{2019}est pas livré.',
          'Tester, corriger et documenter chaque changement important dans un journal clair.',
          'Livrer à lu{2019}heure ou prévenir à lu{2019}avance — ne jamais laisser le client dans le flou.',
          'Faire une revue post-livraison : quu{2019}est-ce qui a bien fonctionné, quu{2019}est-ce qui doit être amélioré.',
        ],
      },
      {
        title: 'Support R&D et innovation',
        bullets: [
          'Travailler avec le DG sur les besoins de recherche : quels outils, quelles méthodes, quelles intégrations.',
          'Transformer les idées en prototypes testables dans un délai raisonnable.',
          'Évaluer les nouvelles technologies sans se laisser distraire par les effets de mode.',
          'Partager les résultats de la R&D avec lu{2019}équipe pour que chacun comprenne ce qui change.',
        ],
      },
    ],
    kpis: [
      'Respect des délais techniques : % des livraisons à lu{2019}heure',
      'Temps moyen de correction des bugs critiques (objectif : moins de 24h)',
      'Disponibilité et stabilité des services (objectif : 99.5% uptime)',
      'Qualité de la documentation : chaque projet livré a un README à jour',
      'Satisfaction client sur les livrables techniques (retour direct ou indirect)',
    ],
    evolution: [
      'Pilotage de projets plus complexes et de plus grande envergure.',
      'Encadrement du{2019}un futur pôle technique (développeurs, DevOps, QA).',
      'Renforcement du rôle du{2019}architecte principal et de référent technique de lu{2019}entreprise.',
      'Contribution aux publications techniques et à la visibilité de lu{2019}expertise Opays.',
    ],
    conclusion:
      "Ce poste protège la promesse du{2019}Opays : livrer des solutions utiles, propres et durables. La vitesse nu{2019}a de valeur que si elle reste fiable. Le CTO nu{2019}est pas le développeur le plus rapide — cu{2019}est celui qui garantit que tout ce qui sort est solide.",
  },
  {
    slug: 'chef-commercial',
    reference: 'JD-OPAYS-003',
    title: 'Chef Commercial',
    holder: 'Prince BAGHENI',
    role: 'SALES',
    type: 'ASSOCIATE',
    summary:
      "Responsable du rythme commercial terrain, de la coordination des actions de vente et de la conversion des opportunités en projets signés.",
    presentation:
      "Le Chef Commercial est le métronome du terrain. Il ne vend pas — il crée les conditions pour que la vente arrive naturellement. Son travail : comprendre le client, formuler une proposition claire, suivre lu{2019}avancement et transformer lu{2019}intérêt en engagement signé. Il coordonne les sales, structure le pipeline et su{2019}assure que ce qui est vendu reste réaliste à livrer. Le bon commercial ne parle pas plus fort, il parle plus juste.",
    sections: [
      {
        title: 'Coordination commerciale',
        bullets: [
          'Planifier les descentes terrain chaque semaine : qui va où, avec quel objectif précis.',
          'Orchestrer les échanges entre les sales et lu{2019}équipe technique avant chaque proposition.',
          'Maintenir une vision claire et à jour du pipeline : combien de leads, à quel stade, quel potentiel.',
          'Former les commerciaux aux bons réflexes : écouter avant de proposer, qualifier avant de promettre.',
          'Organiser un point commercial hebdomadaire pour aligner lu{2019}équipe sur les priorités.',
        ],
      },
      {
        title: 'Relation client et closing',
        bullets: [
          'Conduire les échanges de découverte : poser les bonnes questions, écouter les vrais besoins.',
          'Clarifier le besoin du client dans un langage simple, sans jargon technique.',
          'Formuler une proposition de valeur convaincante basée sur des résultats concrets.',
          'Faire avancer la décision du client étape par étape, sans forcer ni précipiter.',
          'Gérer les objections avec honnêteté : si on ne peut pas, on le dit et on propose une alternative.',
        ],
      },
      {
        title: 'Suivi du pipeline et reporting',
        bullets: [
          'Suivre chaque opportunité par étape : premier contact → qualification → proposition → décision → signature.',
          'Repérer les blocages avant quu{2019}ils ne deviennent des impasses.',
          'Partager une lecture simple de la performance commerciale : ce qui avance, ce qui stagne, ce qui est perdu.',
          'Documenter chaque interaction client importante dans le CRM.',
          'Identifier les raisons des échecs pour améliorer le processus.',
        ],
      },
      {
        title: 'Lien avec lu{2019}exécution',
        bullets: [
          'Su{2019}assurer que chaque promesse commerciale est validée par lu{2019}équipe technique avant du{2019}être faite.',
          'Garder un lien direct entre ce qui est vendu et ce que lu{2019}entreprise peut réellement livrer.',
          'Participer au briefing de lancement de chaque nouveau projet pour transmettre le contexte client.',
          'Suivre la satisfaction client après la livraison et détecter les opportunités de renouvellement.',
        ],
      },
    ],
    kpis: [
      'Taux de conversion lead → projet signé (objectif : 25%+)',
      'Valeur du pipeline actif en dollars',
      'Nombre de descentes terrain qualifiées par semaine (objectif : 5+)',
      'Délai moyen entre premier contact et signature (objectif : < 45 jours)',
      'Taux de satisfaction client après livraison',
    ],
    evolution: [
      'Prise en charge du{2019}un portefeuille client plus large et diversifié.',
      'Construction du{2019}un système de vente prévisible avec des processus documentés.',
      'Formation et encadrement de nouveaux commerciaux.',
      'Contribution à la stratégie de pricing et de positionnement.',
    ],
    conclusion:
      "Le Chef Commercial doit aider Opays à vendre avec clarté, sans forcer, en montrant de la valeur réelle. Un bon deal nu{2019}est pas celui qui rapporte vite — cu{2019}est celui qui crée une relation durable avec un client satisfait.",
  },
  {
    slug: 'sales-gestion-comptable',
    reference: 'JD-OPAYS-004',
    title: 'Sales & Gestion Comptable',
    holder: 'Patricia ZAMWANA',
    role: 'SALES',
    type: 'ASSOCIATE',
    summary:
      "Responsable de la prospection terrain, de la collecte des besoins et de la rigueur comptable qui garde lu{2019}entreprise lisible et financièrement saine.",
    presentation:
      "Ce poste est le lien entre le terrain et la discipline financière. Patricia est celle qui écoute les entreprises, comprend leurs blocages, nourrit le pipeline commercial, et en même temps, garde une trésorerie claire et traçable. Cu{2019}est un double rôle exigeant : être à la fois sur le terrain pour identifier les opportunités et derrière le bureau pour su{2019}assurer que chaque dollar est compté, chaque facture suivie, chaque mouvement justifié.",
    sections: [
      {
        title: 'Prospection terrain',
        bullets: [
          'Identifier les entreprises à contacter : secteur, taille, signaux de besoin.',
          'Préparer chaque visite avec un objectif précis et une liste de questions clés.',
          'Observer les blocages réels chez le client avant de proposer quoi que ce soit.',
          'Transformer les rencontres en leads qualifiés avec des informations exploitables.',
          'Tenir un journal de prospection à jour : qui a été vu, quel résultat, quelle suite.',
        ],
      },
      {
        title: 'Audit de besoin et qualification',
        bullets: [
          'Collecter les informations de terrain de façon simple, structurée et réutilisable.',
          'Distinguer les besoins urgents des besoins importants — prioriser avec le Chef Commercial.',
          'Partager les éléments utiles à lu{2019}équipe technique pour préparer des propositions réalistes.',
          'Faire remonter les besoins concrets (pas les impressions) avec des données exploitables.',
        ],
      },
      {
        title: 'Gestion comptable et administrative',
        bullets: [
          'Saisir chaque mouvement de trésorerie avec régularité : entrées, sorties, justificatifs.',
          'Suivre les factures émises, les paiements reçus et les relances nécessaires.',
          'Classer les documents financiers de façon ordonnée et accessible.',
          'Préparer les éléments nécessaires pour les rapports financiers mensuels.',
          'Signaler immédiatement toute anomalie ou incohérence dans les chiffres.',
        ],
      },
      {
        title: 'Fiabilité des données',
        bullets: [
          'Garder des informations propres, cohérentes et à jour dans tous les outils (CRM, trésorerie, HQ).',
          'Aider lu{2019}équipe à garder une lecture simple de la réalité financière de lu{2019}entreprise.',
          'Participer à lu{2019}amélioration continue des processus administratifs.',
        ],
      },
    ],
    kpis: [
      'Nombre de leads qualifiés par semaine (objectif : 3+)',
      'Exactitude des journaux de trésorerie : 0 erreur sur les 30 derniers jours',
      'Délai de recouvrement des factures (objectif : < 30 jours)',
      'Qualité de la collecte terrain : informations exploitables et complètes',
      'Régularité de la mise à jour comptable (saisie quotidienne ou bihebdomadaire)',
    ],
    evolution: [
      'Prise en charge complète du recouvrement et de la gestion des créances.',
      'Élargissement du rôle administratif : contrats, assurances, conformité.',
      'Renforcement de la fonction de contrôle et de lisibilité financière.',
      'Formation à des outils comptables plus avancés pour accompagner la croissance.',
    ],
    conclusion:
      "Ce poste protège la rigueur de lu{2019}entreprise. Patricia aide Opays à rester propre dans ses chiffres, précis dans son suivi et sérieux dans sa relation client. Sans cette discipline, aucune croissance ne tient.",
  },
  {
    slug: 'sales-communication',
    reference: 'JD-OPAYS-005',
    title: 'Sales & Communication',
    holder: 'ZAINA BWALE GODLOVE',
    role: 'SALES',
    type: 'ASSOCIATE',
    summary:
      "Responsable de la prospection orientée image, de la qualité des supports de vente et de la traduction du travail du{2019}Opays en message clair, crédible et attractif.",
    presentation:
      "Zaina donne une forme visible à la valeur du{2019}Opays. Elle transforme la technique en récit compréhensible, les résultats en contenu utile et la présence de lu{2019}entreprise en signal de confiance. Son rôle est double : aller sur le terrain pour identifier les prospects et créer les supports qui donnent envie du{2019}en savoir plus. Un bon message ne vend pas — il ouvre la porte. Cu{2019}est ensuite la qualité du service qui fait le reste.",
    sections: [
      {
        title: 'Prospection et rayonnement',
        bullets: [
          'Identifier les entreprises et les personnes à cibler en lien avec le Chef Commercial.',
          'Faire émerger les besoins réels et les points de friction lors des premiers échanges.',
          'Créer des points de contact utiles avec les prospects : messages, relances, contenus personnalisés.',
          'Représenter Opays dans les événements, salons et rencontres professionnelles.',
          'Maintenir un réseau de contacts actifs et qualifiés.',
        ],
      },
      {
        title: 'Branding et supports de vente',
        bullets: [
          'Créer ou relire les plaquettes, visuels, présentations et supports de vente.',
          'Garder une cohérence forte entre le fond (message), le ton (professionnel mais accessible) et la forme (design propre).',
          'Su{2019}assurer que chaque support donne envie de lire, de comprendre et du{2019}agir.',
          'Adapter les supports selon le public cible : dirigeant, responsable IT, équipe opérationnelle.',
          'Maintenir une bibliothèque de supports à jour et facilement accessible à lu{2019}équipe.',
        ],
      },
      {
        title: 'Communication externe',
        bullets: [
          'Valoriser la présence du{2019}Opays sur LinkedIn, les réseaux sociaux et les espaces professionnels.',
          'Publier régulièrement du contenu qui montre lu{2019}expertise sans être prétentieux.',
          'Rendre lu{2019}entreprise lisible pour les dirigeants et les partenaires en 30 secondes.',
          'Transformer les résultats concrets en posts, articles ou témoignages.',
          'Surveiller lu{2019}image de marque et signaler tout message qui ne correspond pas à nos valeurs.',
        ],
      },
      {
        title: 'Storytelling et preuve sociale',
        bullets: [
          'Traduire les succès techniques en études de cas simples et convaincantes.',
          'Rendre la valeur du{2019}Opays visible sans jargon inutile — un dirigeant non technique doit comprendre.',
          'Collecter les témoignages clients et les transformer en contenu réutilisable.',
          'Construire progressivement une bibliothèque de preuves : résultats, avant/après, gains mesurés.',
        ],
      },
    ],
    kpis: [
      'Nombre de leads qualifiés générés par les actions de communication (objectif : 2/semaine)',
      'Qualité et cohérence des supports produits : relecture validée avant publication',
      'Engagement sur les contenus publiés : likes, commentaires, partages, messages entrants',
      'Nombre de supports de vente à jour et disponibles pour lu{2019}équipe',
      'Clarté du message de marque : un nouveau contact comprend ce quu{2019}on fait en une phrase',
    ],
    evolution: [
      'Construction du{2019}une ligne éditoriale structurée avec calendrier de publication.',
      'Déploiement de supports de vente multicanaux (vidéo, podcast, newsletter).',
      'Renforcement du rôle du{2019}ambassadrice de la marque auprès des partenaires.',
      'Contribution à la stratégie de marque employeur pour attirer les futurs talents.',
    ],
    conclusion:
      "Ce poste doit donner envie de faire confiance à Opays avant même la première réunion. Le bon message est simple, net et mémorable. Zaina est celle qui transforme le travail invisible de lu{2019}équipe en signal visible de crédibilité.",
  },
];

export function getJobDescription(slug: string) {
  return jobDescriptions.find((item) => item.slug === slug);
}

export function jobDescriptionToMarkdown(job: JobDescription) {
  const sections = job.sections
    .map(
      (section) => `## ${section.title}
${section.bullets.map((bullet) => `- ${bullet}`).join('\n')}`
    )
    .join('\n\n');

  const kpis = job.kpis.map((item) => `- ${item}`).join('\n');
  const evolution = job.evolution.map((item) => `- ${item}`).join('\n');

  return `# FICHE DE POSTE — OPAYS TECH

**Intitulé du poste :** ${job.title}
**Titulaire :** ${job.holder}
**Rôle HQ :** ${job.role}
**Type :** ${job.type}
**Référence :** ${job.reference}

## 1. PRÉSENTATION DU POSTE
${job.presentation}

## 2. RESPONSABILITÉS PRINCIPALES
${sections}

## 3. INDICATEURS DE PERFORMANCE (KPI)
${kpis}

## 4. ÉVOLUTION DU POSTE
${evolution}

## 5. CONCLUSION
${job.conclusion}
`;
}
