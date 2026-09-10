/**
 * Social Auth Service
 * Gerencia credenciais, endpoints e abertura de janelas de autorização OAuth 2.0 independentes
 * para cada uma das redes sociais suportadas.
 */

import { SocialPlatform, SocialSubPage } from '../types';
import { META_APP_ID, META_API_VERSION } from './metaAuth';

export interface PlatformOAuthConfig {
  platform: SocialPlatform;
  displayName: string;
  apiName: string;
  clientId: string;
  clientSecretLabel: string;
  authorizationUrl: string;
  scopes: string[];
  scopeDescription: string;
  tokenValidityDays: number;
  documentationUrl: string;
  color: string;
}

export const PLATFORM_OAUTH_CONFIGS: Record<SocialPlatform, PlatformOAuthConfig> = {
  instagram: {
    platform: 'instagram',
    displayName: 'Instagram Business',
    apiName: `Meta Graph API v${META_API_VERSION}`,
    clientId: META_APP_ID,
    clientSecretLabel: 'App Secret (Meta for Developers)',
    authorizationUrl: `https://www.facebook.com/${META_API_VERSION}/dialog/oauth`,
    scopes: [
      'instagram_basic',
      'instagram_content_publish',
      'instagram_manage_comments',
      'instagram_manage_insights',
      'pages_show_list'
    ],
    scopeDescription: 'Permissão para publicar reels, carrosséis, fotos e sincronizar métricas de engajamento.',
    tokenValidityDays: 60,
    documentationUrl: 'https://developers.facebook.com/docs/instagram-platform',
    color: '#E1306C'
  },
  facebook: {
    platform: 'facebook',
    displayName: 'Página do Facebook',
    apiName: `Meta Pages API v${META_API_VERSION}`,
    clientId: META_APP_ID,
    clientSecretLabel: 'App Secret (Meta for Developers)',
    authorizationUrl: `https://www.facebook.com/${META_API_VERSION}/dialog/oauth`,
    scopes: [
      'pages_manage_posts',
      'pages_read_engagement',
      'pages_show_list',
      'public_profile',
      'publish_video'
    ],
    scopeDescription: 'Permissão para gerenciamento e publicação em páginas comerciais do Facebook.',
    tokenValidityDays: 60,
    documentationUrl: 'https://developers.facebook.com/docs/pages-api',
    color: '#1877F2'
  },
  tiktok: {
    platform: 'tiktok',
    displayName: 'TikTok for Creators & Business',
    apiName: 'TikTok Content Posting API v2',
    clientId: 'awf782390tkflow',
    clientSecretLabel: 'Client Key (TikTok for Developers)',
    authorizationUrl: 'https://www.tiktok.com/v2/auth/authorize/',
    scopes: [
      'video.upload',
      'video.publish',
      'user.info.basic',
      'user.info.stats'
    ],
    scopeDescription: 'Permissão para upload direto de vídeos verticais e leitura de estatísticas do canal.',
    tokenValidityDays: 60,
    documentationUrl: 'https://developers.tiktok.com/',
    color: '#00F2FE'
  },
  youtube: {
    platform: 'youtube',
    displayName: 'YouTube Studio & Shorts',
    apiName: 'Google Identity & YouTube Data API v3',
    clientId: '482910482910-youtubeapi.apps.googleusercontent.com',
    clientSecretLabel: 'Google Client Secret',
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    scopes: [
      'https://www.googleapis.com/auth/youtube.upload',
      'https://www.googleapis.com/auth/youtube.readonly'
    ],
    scopeDescription: 'Permissão para upload de vídeos longos, Shorts com miniatura e leitura de inscritos.',
    tokenValidityDays: 60,
    documentationUrl: 'https://developers.google.com/youtube/v3',
    color: '#FF0000'
  },
  linkedin: {
    platform: 'linkedin',
    displayName: 'LinkedIn Company & Personal',
    apiName: 'LinkedIn Community Management API v2',
    clientId: '78linkedin93284saas',
    clientSecretLabel: 'Client Secret (LinkedIn Developer Portal)',
    authorizationUrl: 'https://www.linkedin.com/oauth/v2/authorization',
    scopes: [
      'r_liteprofile',
      'w_member_social',
      'w_organization_social',
      'rw_organization_admin'
    ],
    scopeDescription: 'Permissão para publicar artigos, carrosséis em PDF e imagens institucionais em páginas corporativas.',
    tokenValidityDays: 60,
    documentationUrl: 'https://developer.linkedin.com/',
    color: '#0A66C2'
  },
  twitter: {
    platform: 'twitter',
    displayName: 'X (Twitter) Developer API',
    apiName: 'X API v2 OAuth 2.0 PKCE',
    clientId: 'TWITTER_V2_CLIENT_FLOWCONTENT',
    clientSecretLabel: 'Client Secret (X Developer Portal)',
    authorizationUrl: 'https://twitter.com/i/oauth2/authorize',
    scopes: [
      'tweet.read',
      'tweet.write',
      'users.read',
      'offline.access'
    ],
    scopeDescription: 'Permissão para postagens com mídia, fios (threads) e estatísticas no feed do X.',
    tokenValidityDays: 60,
    documentationUrl: 'https://developer.twitter.com/en/docs',
    color: '#1DA1F2'
  }
};

/**
 * Retorna a URL oficial de diálogo OAuth correspondente à plataforma específica
 */
export function getPlatformOAuthUrl(platform: SocialPlatform, redirectUri?: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://flowcontent.app';
  const targetRedirect = redirectUri || `${origin}/auth/${platform}/callback`;
  const config = PLATFORM_OAUTH_CONFIGS[platform];

  if (!config) return '';

  if (platform === 'instagram' || platform === 'facebook') {
    return `${config.authorizationUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(
      targetRedirect
    )}&scope=${encodeURIComponent(config.scopes.join(','))}&response_type=token&auth_type=rerequest&display=popup`;
  }

  if (platform === 'tiktok') {
    return `${config.authorizationUrl}?client_key=${config.clientId}&redirect_uri=${encodeURIComponent(
      targetRedirect
    )}&scope=${encodeURIComponent(config.scopes.join(','))}&response_type=code`;
  }

  if (platform === 'youtube') {
    return `${config.authorizationUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(
      targetRedirect
    )}&scope=${encodeURIComponent(config.scopes.join(' '))}&response_type=token&access_type=offline&prompt=consent`;
  }

  if (platform === 'linkedin') {
    return `${config.authorizationUrl}?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(
      targetRedirect
    )}&scope=${encodeURIComponent(config.scopes.join(' '))}`;
  }

  if (platform === 'twitter') {
    return `${config.authorizationUrl}?response_type=code&client_id=${config.clientId}&redirect_uri=${encodeURIComponent(
      targetRedirect
    )}&scope=${encodeURIComponent(config.scopes.join(' '))}&code_challenge=challenge&code_challenge_method=plain`;
  }

  return `${config.authorizationUrl}?client_id=${config.clientId}&redirect_uri=${encodeURIComponent(targetRedirect)}`;
}

/**
 * Abre a janela popup oficial centralizada para autorização de uma plataforma específica
 */
export function openPlatformOAuthWindow(platform: SocialPlatform, redirectUri?: string): Window | null {
  if (typeof window === 'undefined') return null;

  const url = getPlatformOAuthUrl(platform, redirectUri);
  const width = 640;
  const height = 740;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  return window.open(
    url,
    `OAuthFlowContent_${platform}`,
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1,resizable=yes`
  );
}
