import confetti from 'canvas-confetti';
import { SocialPlatform, PostStatus } from '../types';
import { PRESET_BACKGROUND_ARTS } from './presets';

export function generateId(prefix = 'post'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 7)}`;
}

export function triggerCelebrationConfetti() {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#6366f1', '#a855f7', '#00f2fe', '#38bdf8']
  });
}

export const PLATFORM_INFO: Record<SocialPlatform, {
  name: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  charLimit: number;
}> = {
  instagram: {
    name: 'Instagram',
    color: '#E1306C',
    badgeBg: 'bg-pink-500/10',
    badgeText: 'text-pink-400',
    borderColor: 'border-pink-500/30',
    charLimit: 2200,
  },
  linkedin: {
    name: 'LinkedIn',
    color: '#0A66C2',
    badgeBg: 'bg-sky-500/10',
    badgeText: 'text-sky-400',
    borderColor: 'border-sky-500/30',
    charLimit: 3000,
  },
  tiktok: {
    name: 'TikTok',
    color: '#00F2FE',
    badgeBg: 'bg-cyan-500/10',
    badgeText: 'text-cyan-300',
    borderColor: 'border-cyan-500/30',
    charLimit: 2200,
  },
  twitter: {
    name: 'X (Twitter)',
    color: '#1D9BF0',
    badgeBg: 'bg-slate-500/20',
    badgeText: 'text-slate-200',
    borderColor: 'border-slate-500/40',
    charLimit: 280,
  },
  facebook: {
    name: 'Facebook',
    color: '#1877F2',
    badgeBg: 'bg-blue-600/15',
    badgeText: 'text-blue-400',
    borderColor: 'border-blue-500/30',
    charLimit: 63206,
  },
  youtube: {
    name: 'YouTube Shorts',
    color: '#FF0000',
    badgeBg: 'bg-red-500/10',
    badgeText: 'text-red-400',
    borderColor: 'border-red-500/30',
    charLimit: 5000,
  }
};

export const STATUS_INFO: Record<PostStatus, {
  label: string;
  bg: string;
  text: string;
  dot: string;
}> = {
  scheduled: {
    label: 'Agendado',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    dot: 'bg-indigo-500',
  },
  published: {
    label: 'Publicado',
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    dot: 'bg-emerald-500',
  },
  draft: {
    label: 'Rascunho',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    dot: 'bg-amber-500',
  },
  failed: {
    label: 'Falha',
    bg: 'bg-rose-500/10',
    text: 'text-rose-400',
    dot: 'bg-rose-500',
  }
};

export const DEFAULT_FRAME_TEMPLATE = {
  enabled: true,
  preset: 'tweet_card' as const,
  // Custom Art / Background (Segundo Plano - Z-Index 10)
  customArtUrl: PRESET_BACKGROUND_ARTS[0].url,
  customArtFileName: PRESET_BACKGROUND_ARTS[0].name,
  customArtLayerOrder: 'art_behind_video' as const, // Regra estrita: Arte em Segundo Plano / Vídeo em Primeiro Plano
  customArtOpacity: 100,
  customArtFit: 'cover' as const,

  // Top Banner / Callout
  showTopHeader: false, // Desativado por padrão pois a arte de fundo Studio Escuro já contém branding e grid
  headerTitle: 'Dica secreta que 99% dos criadores ignoram 👇',
  headerTitleColor: '#FFFFFF',
  headerTitleSize: 'sm' as const,
  headerTitleAlign: 'left' as const,
  headerTitleFont: 'sans' as const,
  headerUsername: '@flowtrends',
  headerUsernameColor: '#94A3B8',
  headerDisplayName: 'Camila Santos',
  headerNameColor: '#FFFFFF',
  headerNameSize: 'sm' as const,
  headerNameWeight: 'bold' as const,
  headerAvatarUrl: '',
  headerAvatarSize: 'md' as const,
  headerAvatarShape: 'circle' as const,
  showVerifiedBadge: true,
  verifiedBadgeType: 'blue' as const,
  headerStyle: 'tweet' as const,
  headerBgColor: 'rgba(15, 23, 42, 0.9)',
  headerBgOpacity: 90,
  headerTextColor: '#FFFFFF',

  // Canvas & Background
  canvasBgColor: '#090D16',
  canvasBgType: 'solid' as const,

  // Video Enclosure Slot (Primeiro Plano - Z-Index 20)
  slotWidth: 89,
  slotHeight: 63,
  slotPositionX: 0,
  slotPositionY: 1,
  slotAspectRatio: 'free' as const,
  slotBorderRadius: 20,
  slotBorderColor: 'rgba(255, 255, 255, 0.15)',
  slotBorderWidth: 1,
  slotBorderStyle: 'solid' as const,
  slotShadow: 'heavy' as const,

  // Watermark / Logo
  showLogo: false,
  logoPosition: 'top_right' as const,
  logoOpacity: 85,
  showSafeZoneGuides: false,
  showDottedBorders: true, // Mostra a linha-guia para o usuário ver o encaixe exato!
};

export const DEFAULT_VIDEO_CONFIG = {
  thumbnailFramePercent: 20,
  coverText: '',
  coverTextColor: '#FFFFFF',
  coverTextBg: '#6366F1',
  coverTextPosition: 'center' as const,
  zoom: 105,
  positionX: 0,
  positionY: 0,
  flipHorizontal: false,
  speed: 1.02,
  antiDuplicity: true,
  filterPreset: 'vibrant' as const,
  trimStart: 0.3,
  trimEnd: 0.4,
  muteOriginalAudio: false,
  frameTemplate: { ...DEFAULT_FRAME_TEMPLATE }
};

export function getVideoFilterCSS(preset: string, antiDuplicity = false): string {
  let base = '';
  switch (preset) {
    case 'vibrant':
      base = 'brightness(1.05) contrast(1.08) saturate(1.22)';
      break;
    case 'warm':
      base = 'brightness(1.02) contrast(1.06) sepia(0.2) saturate(1.15)';
      break;
    case 'cinematic':
      base = 'brightness(0.96) contrast(1.18) saturate(1.1) hue-rotate(-6deg)';
      break;
    case 'contrast':
      base = 'brightness(1.02) contrast(1.24) saturate(1.08)';
      break;
    case 'anti_shadow':
      base = 'brightness(1.09) contrast(1.04) saturate(1.05)';
      break;
    default:
      base = 'brightness(1) contrast(1) saturate(1)';
  }

  if (antiDuplicity) {
    base += ' hue-rotate(1.2deg)';
  }
  return base;
}

