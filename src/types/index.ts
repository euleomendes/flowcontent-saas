export type SocialPlatform = 'instagram' | 'linkedin' | 'tiktok' | 'twitter' | 'facebook' | 'youtube';

export type PostStatus = 'scheduled' | 'published' | 'draft' | 'failed';

export type MediaType = 'image' | 'video' | 'carousel';

export interface FrameArtTemplate {
  enabled: boolean;
  preset: 'tweet_card' | 'headline_banner' | 'clean_frame' | 'minimal_pill';
  
  // Custom Art / Background Layer (Segundo Plano)
  customArtUrl?: string; // Imagem/Moldura de fundo do usuário (PNG/JPG)
  customArtFileName?: string;
  customArtLayerOrder: 'art_behind_video' | 'art_above_video'; // Regra: 'art_behind_video' (Arte em Segundo Plano / Vídeo em Primeiro Plano)
  customArtOpacity: number; // 0 a 100%
  customArtFit: 'cover' | 'contain' | 'fill';

  // Top Banner / Callout / Custom Header
  showTopHeader: boolean;
  headerTitle: string; // Texto de chamada superior (ex: "Dica que 99% dos criadores ignoram 👇")
  headerTitleColor: string;
  headerTitleSize: 'sm' | 'base' | 'lg' | 'xl';
  headerTitleAlign: 'left' | 'center' | 'right';
  headerTitleFont: 'sans' | 'serif' | 'mono' | 'headline';
  headerUsername: string; // Ex: "@flowtrends"
  headerUsernameColor: string;
  headerDisplayName: string; // Ex: "Camila Santos"
  headerNameColor: string;
  headerNameSize: 'xs' | 'sm' | 'base';
  headerNameWeight: 'normal' | 'semibold' | 'bold' | 'extrabold';
  headerAvatarUrl?: string;
  headerAvatarSize: 'sm' | 'md' | 'lg';
  headerAvatarShape: 'circle' | 'rounded' | 'square';
  showVerifiedBadge: boolean;
  verifiedBadgeType: 'blue' | 'gold' | 'neon';
  headerStyle: 'tweet' | 'glass' | 'solid' | 'minimal';
  headerBgColor: string;
  headerBgOpacity: number; // 0 a 100%
  headerTextColor: string;
  
  // Canvas & Background
  canvasBgColor: string; // Ex: "#0B0F19", "#000000", "#18181B"
  canvasBgType: 'solid' | 'gradient' | 'blur_video';
  
  // Video slot bounds inside canvas (Área de Encaixe em Primeiro Plano)
  slotWidth: number; // 20% a 100% (default: 92%)
  slotHeight: number; // 20% a 100% (default: 65%)
  slotPositionY: number; // -50% a +50% (deslocamento vertical Y)
  slotPositionX: number; // -50% a +50% (deslocamento horizontal X)
  slotAspectRatio: '16:9' | '1:1' | '4:5' | '9:16' | 'free';
  slotBorderRadius: number; // 0px a 40px (default: 20px)
  slotBorderColor: string;
  slotBorderWidth: number;
  slotBorderStyle: 'solid' | 'dashed' | 'none';
  slotShadow: 'none' | 'soft' | 'heavy' | 'glow';
  
  // Watermark / Logo
  showLogo: boolean;
  logoUrl?: string;
  logoPosition: 'top_right' | 'bottom_right' | 'bottom_left' | 'top_left';
  logoOpacity: number;
  
  // Guides
  showSafeZoneGuides: boolean;
  showDottedBorders: boolean;
}

export interface VideoEditConfig {
  thumbnailUrl?: string;
  thumbnailFramePercent: number; // 0 a 100%
  coverText: string;
  coverTextColor: string;
  coverTextBg: string;
  coverTextPosition: 'top' | 'center' | 'bottom';
  zoom: number; // 100% a 140%
  positionX: number; // -50% a 50%
  positionY: number; // -50% a 50%
  flipHorizontal: boolean;
  speed: number; // 0.95, 1.0, 1.02, 1.05, 1.10
  antiDuplicity: boolean;
  filterPreset: 'none' | 'vibrant' | 'warm' | 'cinematic' | 'contrast' | 'anti_shadow';
  trimStart: number; // segundos (ex: 0.3s)
  trimEnd: number; // segundos (ex: 0.5s)
  muteOriginalAudio: boolean;
  frameTemplate?: FrameArtTemplate;
}

export interface PostItem {
  id: string;
  caption: string;
  mediaUrls: string[];
  mediaType: MediaType;
  platforms: SocialPlatform[];
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: PostStatus;
  createdAt: string;
  tags?: string[];
  mediaFileName?: string;
  mediaFileSize?: string;
  videoConfig?: VideoEditConfig;
  analytics?: {
    likes?: number;
    views?: number;
    comments?: number;
    shares?: number;
  };
}

export interface SocialSubPage {
  id: string;
  name: string;
  username: string;
  avatar: string;
  followers: number;
  type: string; // Ex: "Página Comercial", "Perfil Criador", "Canal Oficial"
  selected: boolean;
  portfolioPlatform?: 'instagram' | 'facebook';
}

export interface SocialAccount {
  id: string;
  platform: SocialPlatform;
  name: string;
  username: string;
  avatar: string;
  connected: boolean;
  followers: number;
  lastSync?: string;
  tokenStatus?: 'active' | 'expiring_soon' | 'expired' | 'revoked';
  tokenExpiresInDays?: number;
  accountType?: 'business' | 'creator' | 'personal' | 'page';
  workspaceName?: string;
  authorizedPermissions?: string[];
  subPages?: SocialSubPage[];
  metaAppId?: string;
}

export type StaggerRule = 
  | 'posts_per_day'        // Quantidade flexível de posts por dia com horários customizados
  | 'daily_same_time'      // 1 post por dia no mesmo horário
  | 'every_few_hours'      // A cada X horas/minutos
  | 'weekdays_only'        // Apenas dias úteis (Seg-Sex)
  | 'twice_daily'          // 2 posts por dia
  | 'custom_gap';          // Espaçamento personalizado em dias

export type StaggerMode = 'posts_per_day' | 'interval_minutes' | 'preset_rule';

export interface StaggerScheduleConfig {
  startDate: string;
  startTime?: string;
  mode?: StaggerMode;
  rule: StaggerRule;
  postsPerDay?: number;
  customTimeSlots?: string[]; // Ex: ["08:14", "11:32", "14:47", "18:05", "21:28"]
  gapHours?: number;
  gapMinutes?: number;
  gapDays?: number;
  skipWeekends?: boolean;
  selectedPlatforms: SocialPlatform[];
  appendHashtags?: string;
}

export interface DashboardStats {
  totalScheduled: number;
  publishedThisMonth: number;
  successRate: number;
  connectedAccounts: number;
  queuedNext7Days: number;
}

export type NavigationTab = 'landing' | 'dashboard' | 'bulk' | 'accounts' | 'settings' | 'onboarding' | 'admin' | 'pending_approval';

export type UserAccessStatus = 'approved' | 'pending' | 'blocked';

export interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  organization: string;
  workspaceName: string;
  industry?: string;
  status: UserAccessStatus;
  isMaster?: boolean;
  createdAt: string;
  approvedAt?: string;
  plan: 'Starter' | 'Pro' | 'Agência';
}

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  plan: 'Starter' | 'Pro' | 'Agência';
  status?: UserAccessStatus;
  isMaster?: boolean;
  organization?: string;
  workspaceName?: string;
  timezone?: string;
  teamSize?: string;
  industry?: string;
  onboardingCompleted?: boolean;
}
