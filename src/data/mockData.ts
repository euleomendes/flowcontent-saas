import { PostItem, SocialAccount, UserProfile, RegisteredUser } from '../types';
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

export const DEFAULT_MASTER_EMAIL = 'leandromendesjor@gmail.com';

export const INITIAL_REGISTERED_USERS: RegisteredUser[] = [
  {
    id: 'user-master-leandro',
    name: 'Leandro Mendes',
    email: 'leandromendesjor@gmail.com',
    role: 'Administrador Master & Proprietário',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    organization: 'FlowContent HQ',
    workspaceName: 'Workspace Master',
    industry: 'SaaS & Tecnologia',
    status: 'approved',
    isMaster: true,
    createdAt: '2026-01-10',
    approvedAt: '2026-01-10',
    plan: 'Agência'
  },
  {
    id: 'user-camila-2',
    name: 'Camila Santos',
    email: 'camila@agenciafluxo.com.br',
    role: 'Head of Content & Social Media',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    organization: 'Agência Fluxo Digital',
    workspaceName: 'Workspace Principal',
    industry: 'Agência & Marketing Digital',
    status: 'approved',
    isMaster: false,
    createdAt: '2026-08-15',
    approvedAt: '2026-08-15',
    plan: 'Pro'
  },
  {
    id: 'user-lucas-3',
    name: 'Lucas Mendes',
    email: 'lucas@techgrowth.io',
    role: 'Growth Marketer',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    organization: 'TechGrowth SaaS',
    workspaceName: 'Workspace Global',
    industry: 'SaaS & Tecnologia',
    status: 'pending',
    isMaster: false,
    createdAt: 'Hoje às 10:24',
    plan: 'Starter'
  },
  {
    id: 'user-beatriz-4',
    name: 'Beatriz Ramos',
    email: 'beatriz@agenciadigital.com',
    role: 'Diretora de Mídias',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    organization: 'Agência Criativa Alpha',
    workspaceName: 'Workspace Alpha',
    industry: 'Agência & Marketing Digital',
    status: 'pending',
    isMaster: false,
    createdAt: 'Hoje às 11:50',
    plan: 'Pro'
  },
  {
    id: 'user-marcos-5',
    name: 'Marcos Vinicius',
    email: 'marcos@dropshippingbrasil.com',
    role: 'E-commerce Manager',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    organization: 'DropStore Brasil',
    workspaceName: 'DropStore Principal',
    industry: 'E-commerce & Varejo',
    status: 'blocked',
    isMaster: false,
    createdAt: 'Ontem às 16:30',
    plan: 'Starter'
  }
];

export const INITIAL_USER: UserProfile = {
  id: 'user-master-leandro',
  name: 'Leandro Mendes',
  email: 'leandromendesjor@gmail.com',
  role: 'Administrador Master & Proprietário',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  plan: 'Agência',
  status: 'approved',
  isMaster: true,
  organization: 'FlowContent HQ',
  workspaceName: 'Workspace Master',
  timezone: 'America/Sao_Paulo (GMT-3)',
  teamSize: '15+ colaboradores',
  industry: 'SaaS & Tecnologia',
  onboardingCompleted: true
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
    lastSync: 'Há 12 minutos',
    tokenStatus: 'active',
    tokenExpiresInDays: 58,
    accountType: 'business',
    workspaceName: 'Workspace Principal',
    authorizedPermissions: ['Publicação Automática de Reels/Feed', 'Leitura de Métricas de Engajamento', 'Sincronização em Lote'],
    subPages: [
      { id: 'ig-sub-1', name: 'Flow Agência Digital', username: '@flowagencia', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', followers: 48500, type: 'Instagram Business', selected: true },
      { id: 'ig-sub-2', name: 'Flow Trends & Bastidores', username: '@flow.bastidores', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', followers: 14200, type: 'Instagram Creator', selected: true }
    ]
  },
  {
    id: 'acc-li',
    platform: 'linkedin',
    name: 'Flow Content Tech',
    username: 'flowcontent-saas',
    avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followers: 19200,
    lastSync: 'Há 1 hora',
    tokenStatus: 'active',
    tokenExpiresInDays: 52,
    accountType: 'page',
    workspaceName: 'Workspace Principal',
    authorizedPermissions: ['Postagens em Company Pages', 'Publicação em Perfil Pessoal', 'Métricas de Alcance'],
    subPages: [
      { id: 'li-sub-1', name: 'Flow Content Tech', username: 'flowcontent-saas', avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80', followers: 19200, type: 'Company Page', selected: true },
      { id: 'li-sub-2', name: 'Camila Santos (Perfil)', username: 'camilasantos-mkt', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', followers: 8900, type: 'Perfil Pessoal', selected: false }
    ]
  },
  {
    id: 'acc-tt',
    platform: 'tiktok',
    name: 'Flow Trends & Dicas',
    username: '@flowtrends',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followers: 82400,
    lastSync: 'Há 3 horas',
    tokenStatus: 'active',
    tokenExpiresInDays: 45,
    accountType: 'creator',
    workspaceName: 'Workspace Principal',
    authorizedPermissions: ['Upload de Vídeos Diretos', 'Comentários e Engajamento'],
    subPages: [
      { id: 'tt-sub-1', name: 'Flow Trends & Dicas', username: '@flowtrends', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', followers: 82400, type: 'Conta Comercial TikTok', selected: true }
    ]
  },
  {
    id: 'acc-x',
    platform: 'twitter',
    name: 'Flow Content App',
    username: '@flowcontent_app',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    connected: false,
    followers: 6100,
    lastSync: 'Desconectado',
    tokenStatus: 'revoked',
    tokenExpiresInDays: 0,
    accountType: 'business',
    workspaceName: 'Workspace Principal',
    authorizedPermissions: [],
    subPages: []
  },
  {
    id: 'acc-fb',
    platform: 'facebook',
    name: 'Flow Content Oficial',
    username: 'flowcontent.br',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    connected: true,
    followers: 31200,
    lastSync: 'Há 5 horas',
    tokenStatus: 'active',
    tokenExpiresInDays: 59,
    accountType: 'page',
    workspaceName: 'Workspace Principal',
    authorizedPermissions: ['Gerenciamento de Páginas', 'Publicação de Mídias em Lote'],
    subPages: [
      { id: 'fb-sub-1', name: 'Flow Content Oficial', username: 'flowcontent.br', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', followers: 31200, type: 'Página do Facebook', selected: true }
    ]
  },
  {
    id: 'acc-yt',
    platform: 'youtube',
    name: 'Flow Growth Academy',
    username: '@flowacademy',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    connected: false,
    followers: 12500,
    lastSync: 'Desconectado',
    tokenStatus: 'expired',
    tokenExpiresInDays: 0,
    accountType: 'creator',
    workspaceName: 'Workspace Principal',
    authorizedPermissions: [],
    subPages: []
  }
];

export const DISCOVERED_OAUTH_PAGES: Record<string, {
  authHeader: string;
  authDescription: string;
  scopes: string[];
  pages: { id: string; name: string; username: string; avatar: string; followers: number; type: string; selected: boolean }[];
}> = {
  instagram: {
    authHeader: 'Meta Business Suite • Instagram Professional',
    authDescription: 'Conectando ao ecossistema Meta Graph API v19.0 para gerenciar contas comerciais do Instagram e páginas vinculadas.',
    scopes: ['instagram_basic', 'instagram_content_publish', 'pages_show_list', 'pages_read_engagement'],
    pages: [
      { id: 'ig-page-1', name: 'Flow Agência Digital', username: '@flowagencia', avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80', followers: 48500, type: 'Conta Comercial (Business)', selected: true },
      { id: 'ig-page-2', name: 'Flow Trends & Bastidores', username: '@flow.bastidores', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', followers: 14200, type: 'Conta de Criador (Creator)', selected: true },
      { id: 'ig-page-3', name: 'E-commerce Moda Flow', username: '@modaflow.shop', avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&auto=format&fit=crop&q=80', followers: 63100, type: 'Loja / Negócio Local', selected: false }
    ]
  },
  linkedin: {
    authHeader: 'LinkedIn OAuth 2.0 • Company Pages & Personal',
    authDescription: 'Autorização com API oficial do LinkedIn para publicar artigos, imagens, carrosséis em PDF e vídeos institucionais.',
    scopes: ['r_liteprofile', 'w_member_social', 'w_organization_social', 'rw_organization_admin'],
    pages: [
      { id: 'li-page-1', name: 'Flow Content Tech Inc.', username: 'flowcontent-saas', avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80', followers: 19200, type: 'LinkedIn Company Page', selected: true },
      { id: 'li-page-2', name: 'Camila Santos', username: 'camilasantos-mkt', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', followers: 8900, type: 'Perfil Pessoal de Liderança', selected: true }
    ]
  },
  tiktok: {
    authHeader: 'TikTok for Developers • Content Posting API',
    authDescription: 'Autorizando permissão de envio direto de vídeos curtos e verticais para o feed da conta comercial/criador.',
    scopes: ['video.upload', 'video.publish', 'user.info.basic', 'user.info.stats'],
    pages: [
      { id: 'tt-page-1', name: 'Flow Trends & Dicas', username: '@flowtrends', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', followers: 82400, type: 'TikTok Pro Account', selected: true },
      { id: 'tt-page-2', name: 'Flow Clips Cortados', username: '@flowclips.br', avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80', followers: 31500, type: 'Canal Secundário de Cortes', selected: false }
    ]
  },
  youtube: {
    authHeader: 'Google OAuth 2.0 • YouTube Shorts & Studio',
    authDescription: 'Acesso oficial aos canais de vídeo para agendamento de Shorts e vídeos longos com capa personalizada.',
    scopes: ['https://www.googleapis.com/auth/youtube.upload', 'https://www.googleapis.com/auth/youtube.readonly'],
    pages: [
      { id: 'yt-page-1', name: 'Flow Growth Academy', username: '@flowacademy', avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80', followers: 12500, type: 'Canal Oficial YouTube', selected: true },
      { id: 'yt-page-2', name: 'Flow Shorts Rápidos', username: '@flowshorts', avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80', followers: 43200, type: 'Canal de Shorts', selected: false }
    ]
  },
  twitter: {
    authHeader: 'X API v2 • OAuth 2.0 Authorization Code',
    authDescription: 'Permissão para publicar posts com texto, imagens e vídeos curtos no feed oficial do X (Twitter).',
    scopes: ['tweet.read', 'tweet.write', 'users.read', 'offline.access'],
    pages: [
      { id: 'x-page-1', name: 'Flow Content App', username: '@flowcontent_app', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', followers: 6100, type: 'Conta Corporativa Verificada', selected: true }
    ]
  },
  facebook: {
    authHeader: 'Meta Pages API • Facebook for Business',
    authDescription: 'Gerenciamento de páginas comerciais no Facebook e agendamento em lote sincronizado com a grade.',
    scopes: ['pages_manage_posts', 'pages_read_engagement', 'publish_video'],
    pages: [
      { id: 'fb-page-1', name: 'Flow Content Oficial', username: 'flowcontent.br', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80', followers: 31200, type: 'Página Principal', selected: true },
      { id: 'fb-page-2', name: 'Comunidade Flow Creators', username: 'comunidade.flow', avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80', followers: 15400, type: 'Grupo / Página de Suporte', selected: false }
    ]
  }
};

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
