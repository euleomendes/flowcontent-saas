/**
 * Meta Graph API & OAuth 2.0 Official Integration Service
 * App ID: 2745781192554036
 */

import { SocialSubPage } from '../types';

export const META_APP_ID = '2745781192554036';
export const META_API_VERSION = 'v19.0';

export const META_OAUTH_SCOPES = [
  'instagram_basic',
  'instagram_content_publish',
  'instagram_manage_comments',
  'instagram_manage_insights',
  'pages_show_list',
  'pages_read_engagement',
  'pages_manage_posts',
  'public_profile'
];

/**
 * Retorna a URL oficial do diálogo OAuth da Meta para permissões do Facebook & Instagram.
 */
export function getMetaOAuthUrl(redirectUri?: string): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://flowcontent.app';
  // Redireciona diretamente para a raiz da aplicação na Vercel para evitar erros 404
  const targetRedirect = redirectUri || `${origin}/`;
  const scopesParam = META_OAUTH_SCOPES.join(',');

  return `https://www.facebook.com/${META_API_VERSION}/dialog/oauth?client_id=${META_APP_ID}&redirect_uri=${encodeURIComponent(
    targetRedirect
  )}&scope=${encodeURIComponent(scopesParam)}&response_type=code&state=instagram&auth_type=rerequest&display=popup`;
}

/**
 * Abre a janela popup centralizada oficial da Meta para concessão de permissões.
 */
export function openMetaOAuthWindow(redirectUri?: string): Window | null {
  if (typeof window === 'undefined') return null;

  const url = getMetaOAuthUrl(redirectUri);
  const width = 650;
  const height = 750;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;

  return window.open(
    url,
    'MetaAuthFlowContent',
    `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=1,resizable=yes`
  );
}

/**
 * Contas e Páginas do Portfólio Empresarial Meta associadas ao App ID 2745781192554036
 */
export const META_PORTFOLIO_ACCOUNTS: (SocialSubPage & {
  portfolioPlatform: 'instagram' | 'facebook';
  businessManagerName: string;
})[] = [
  // Contas Comerciais do Instagram
  {
    id: 'meta-ig-1',
    name: 'Flow Agência Digital',
    username: '@flowagencia',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    followers: 48500,
    type: 'Instagram Business',
    selected: true,
    portfolioPlatform: 'instagram',
    businessManagerName: 'Flow Meta Business Suite'
  },
  {
    id: 'meta-ig-2',
    name: 'Flow Trends & Bastidores',
    username: '@flow.bastidores',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    followers: 14200,
    type: 'Instagram Creator',
    selected: true,
    portfolioPlatform: 'instagram',
    businessManagerName: 'Flow Meta Business Suite'
  },
  {
    id: 'meta-ig-3',
    name: 'E-commerce Moda Flow',
    username: '@modaflow.shop',
    avatar: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=150&auto=format&fit=crop&q=80',
    followers: 63100,
    type: 'Loja / Negócio Local',
    selected: false,
    portfolioPlatform: 'instagram',
    businessManagerName: 'Flow Meta Business Suite'
  },
  // Páginas do Facebook
  {
    id: 'meta-fb-1',
    name: 'Flow Content Oficial',
    username: 'flowcontent.br',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
    followers: 31200,
    type: 'Página do Facebook',
    selected: true,
    portfolioPlatform: 'facebook',
    businessManagerName: 'Flow Meta Business Suite'
  },
  {
    id: 'meta-fb-2',
    name: 'Comunidade Flow Creators',
    username: 'comunidade.flow',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&auto=format&fit=crop&q=80',
    followers: 15400,
    type: 'Página de Comunidade',
    selected: true,
    portfolioPlatform: 'facebook',
    businessManagerName: 'Flow Meta Business Suite'
  },
  {
    id: 'meta-fb-3',
    name: 'Flow Agency Studio',
    username: 'flowstudio.fb',
    avatar: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=150&auto=format&fit=crop&q=80',
    followers: 18900,
    type: 'Página Comercial',
    selected: false,
    portfolioPlatform: 'facebook',
    businessManagerName: 'Flow Meta Business Suite'
  }
];
