import { PostItem, SocialAccount, UserProfile } from '../types';
import { getTodayISODate } from '../utils/dateUtils';

const today = new Date();
const formatDateOffset = (offsetDays: number): string => {
  const d = new Date(today);
  d.setDate(d.getDate() + offsetDays);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const INITIAL_USER: UserProfile = {
  name: 'Camila Santos',
  email: 'camila@agenciafluxo.com.br',
  role: 'Head of Content & Social Media',
  avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  plan: 'Pro'
};

export const INITIAL_ACCOUNTS: SocialAccount[] = [
  {
    id: 'acc-ig',
    platform: 'instagram',
    name: 'Flow Agência Digital',
    username: '@flowagencia',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followers: 48500,
    lastSync: 'Há 12 minutos'
  },
  {
    id: 'acc-li',
    platform: 'linkedin',
    name: 'Flow Content Tech',
    username: 'flowcontent-saas',
    avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followers: 19200,
    lastSync: 'Há 1 hora'
  },
  {
    id: 'acc-tt',
    platform: 'tiktok',
    name: 'Flow Trends & Dicas',
    username: '@flowtrends',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followers: 82400,
    lastSync: 'Há 3 horas'
  },
  {
    id: 'acc-x',
    platform: 'twitter',
    name: 'Flow Content App',
    username: '@flowcontent_app',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    connected: false,
    followers: 6100,
    lastSync: 'Desconectado'
  },
  {
    id: 'acc-fb',
    platform: 'facebook',
    name: 'Flow Content Oficial',
    username: 'flowcontent.br',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followers: 31200,
    lastSync: 'Há 5 horas'
  },
  {
    id: 'acc-yt',
    platform: 'youtube',
    name: 'Flow Growth Academy',
    username: '@flowacademy',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    connected: false,
    followers: 12500,
    lastSync: 'Desconectado'
  }
];

export const INITIAL_POSTS: PostItem[] = [
  {
    id: 'post-1',
    caption: '🚀 5 Estratégias testadas para triplicar seu engajamento orgânico sem gastar 1 centavo em anúncios neste trimestre. Salve este post para consultar depois! #SocialMedia #GrowthMarketing #DicasDeConteudo',
    mediaUrls: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    platforms: ['instagram', 'linkedin'],
    scheduledDate: formatDateOffset(0),
    scheduledTime: '18:30',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    tags: ['Estratégia', 'Orgânico', 'Carrossel'],
    mediaFileName: 'growth_analytics_chart.jpg',
    mediaFileSize: '1.8 MB'
  },
  {
    id: 'post-2',
    caption: '💡 Por que criadores de alta performance abandonaram a produção diária picada e migraram 100% para o agendamento em lote? Um thread sincero sobre foco profundo e consistência.',
    mediaUrls: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    platforms: ['linkedin', 'twitter'],
    scheduledDate: formatDateOffset(1),
    scheduledTime: '09:15',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    tags: ['Produtividade', 'CreatorEconomy'],
    mediaFileName: 'focus_workflow.jpg',
    mediaFileSize: '2.1 MB'
  },
  {
    id: 'post-3',
    caption: 'POV: Quando você agenda 30 dias de conteúdo em apenas 40 minutos no FlowContent e tem o resto do mês livre para focar nas vendas. 🔥 #MarketingDigital #RotinaDeCriador',
    mediaUrls: ['https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'video',
    platforms: ['tiktok', 'instagram'],
    scheduledDate: formatDateOffset(2),
    scheduledTime: '12:00',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    tags: ['Trends', 'Humor', 'Reels'],
    mediaFileName: 'bulk_scheduling_reaction.mp4',
    mediaFileSize: '14.2 MB'
  },
  {
    id: 'post-4',
    caption: '📊 Infográfico exclusivo: Melhores horários para postar no B2B em 2026. Analisamos mais de 1.2 milhão de publicações e o padrão mudou!',
    mediaUrls: ['https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    platforms: ['linkedin'],
    scheduledDate: formatDateOffset(3),
    scheduledTime: '11:45',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    tags: ['Dados', 'B2B', 'Pesquisa'],
    mediaFileName: 'b2b_best_times_infographic.png',
    mediaFileSize: '3.4 MB'
  },
  {
    id: 'post-5',
    caption: '✨ Nova funcionalidade no ar: Pré-visualização exata de feeds no Instagram e threads do X antes do disparo. O que acharam dessa novidade?',
    mediaUrls: ['https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    platforms: ['instagram', 'twitter', 'facebook'],
    scheduledDate: formatDateOffset(4),
    scheduledTime: '20:00',
    status: 'scheduled',
    createdAt: new Date().toISOString(),
    tags: ['ProductUpdate', 'SaaS'],
    mediaFileName: 'feature_release_preview.jpg',
    mediaFileSize: '1.2 MB'
  },
  {
    id: 'post-6',
    caption: 'Cases de Sucesso: Como a Startup X aumentou sua geração de MQLs em 140% utilizando consistência editorial multicanal.',
    mediaUrls: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'],
    mediaType: 'image',
    platforms: ['linkedin'],
    scheduledDate: formatDateOffset(-2),
    scheduledTime: '10:00',
    status: 'published',
    createdAt: new Date().toISOString(),
    tags: ['CaseStudy', 'Inbound'],
    analytics: {
      likes: 384,
      views: 8920,
      comments: 42,
      shares: 19
    }
  }
];

// Presets for rapid 1-click bulk testing
export const BULK_DEMO_TEMPLATES = [
  {
    caption: 'Design System & UI Kits modernos para acelerar o desenvolvimento de produtos digitais em 2026. 🎨✨ #Design #Frontend #UX',
    imageUrl: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
    name: 'design_system_trends.jpg',
    size: '2.4 MB',
    platforms: ['instagram', 'linkedin'] as const
  },
  {
    caption: 'Backstage da nossa equipe de engenharia escalando microserviços com latência inferior a 15ms. ⚡ #Tech #DevOps #Engineering',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    name: 'engineering_sprint.jpg',
    size: '3.1 MB',
    platforms: ['linkedin', 'twitter'] as const
  },
  {
    caption: 'Checklist definitivo antes de lançar sua campanha de Black Friday / Promoção Sazonal. Já marcou tudo? 📋 #Marketing #Checklist',
    imageUrl: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&auto=format&fit=crop&q=80',
    name: 'campaign_checklist.png',
    size: '1.9 MB',
    platforms: ['instagram', 'facebook'] as const
  },
  {
    caption: 'Dica rápida de produtividade: automatize o que é repetitivo e dedique seu tempo à estratégia criativa. 💡 #ProductivityHacks #Creator',
    imageUrl: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80',
    name: 'productivity_setup.jpg',
    size: '2.8 MB',
    platforms: ['tiktok', 'instagram'] as const
  },
  {
    caption: 'Resultados do trimestre: transparência e métricas abertas com nossa comunidade e investidores. 📈 #BuildInPublic #SaaS #Growth',
    imageUrl: 'https://images.unsplash.com/photo-1542744094-3a31f272c490?w=800&auto=format&fit=crop&q=80',
    name: 'q3_metrics_review.jpg',
    size: '2.2 MB',
    platforms: ['linkedin', 'twitter'] as const
  }
];
