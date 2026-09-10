export interface PresetArt {
  id: string;
  name: string;
  desc: string;
  url: string;
  defaultSlot: {
    width: number;
    height: number;
    posX: number;
    posY: number;
    radius: number;
  };
}

export const PRESET_BACKGROUND_ARTS: PresetArt[] = [
  {
    id: 'studio_dark',
    name: 'Studio Escuro & Grid',
    desc: 'Moldura moderna com demarcação central de encaixe para o vídeo',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="g1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23090D16"/><stop offset="50%" stop-color="%23111827"/><stop offset="100%" stop-color="%23030712"/></linearGradient><radialGradient id="g2" cx="50%" cy="16%" r="45%"><stop offset="0%" stop-color="%236366f1" stop-opacity="0.35"/><stop offset="100%" stop-color="%23000000" stop-opacity="0"/></radialGradient></defs><rect width="1080" height="1920" fill="url(%23g1)"/><rect width="1080" height="1920" fill="url(%23g2)"/><path d="M0,0 L1080,0 L1080,320 L0,320 Z" fill="rgba(255,255,255,0.02)"/><circle cx="540" cy="140" r="70" fill="%236366F1" opacity="0.15"/><text x="540" y="235" font-family="system-ui,sans-serif" font-size="38" font-weight="900" fill="%23818cf8" text-anchor="middle" letter-spacing="4">FLOW CONTENT STUDIO</text><text x="540" y="280" font-family="system-ui,sans-serif" font-size="24" font-weight="600" fill="%2394a3b8" text-anchor="middle">ÁREA DE ENCAIXE DO VÍDEO (1º PLANO)</text><rect x="60" y="360" width="960" height="1220" rx="36" fill="none" stroke="%23374151" stroke-width="4" stroke-dasharray="16,12" opacity="0.6"/><text x="540" y="1660" font-family="system-ui,sans-serif" font-size="30" font-weight="bold" fill="%239ca3af" text-anchor="middle">@flowtrends • Conteúdo em Lote</text><text x="540" y="1710" font-family="system-ui,sans-serif" font-size="22" fill="%236b7280" text-anchor="middle">Assista até o fim para aprender 💡</text></svg>',
    defaultSlot: {
      width: 89,
      height: 63,
      posX: 0,
      posY: 1,
      radius: 20
    }
  },
  {
    id: 'breaking_news',
    name: 'Plantão Notícia / Urgente',
    desc: 'Tarja vermelha jornalística no topo e rodapé informativo',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="bg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%2318181B"/><stop offset="100%" stop-color="%23020617"/></linearGradient></defs><rect width="1080" height="1920" fill="url(%23bg)"/><rect x="0" y="80" width="1080" height="160" fill="%23DC2626"/><text x="540" y="185" font-family="system-ui,sans-serif" font-size="52" font-weight="900" fill="%23ffffff" text-anchor="middle" letter-spacing="6">🚨 PLANTÃO URGENTE</text><rect x="0" y="240" width="1080" height="70" fill="%23991B1B"/><text x="540" y="285" font-family="system-ui,sans-serif" font-size="26" font-weight="bold" fill="%23FEF2F2" text-anchor="middle">ATENÇÃO: VEJA ESTE COMUNICADO ANTES DE CRIAR SEUS POSTS</text><rect x="50" y="380" width="980" height="1180" rx="30" fill="none" stroke="%23DC2626" stroke-width="4" opacity="0.4"/><rect x="0" y="1660" width="1080" height="140" fill="%23111827"/><text x="540" y="1740" font-family="system-ui,sans-serif" font-size="32" font-weight="bold" fill="%23FBBF24" text-anchor="middle">CONFIRA O VÍDEO COMPLETO NO PERFIL ↗</text></svg>',
    defaultSlot: {
      width: 90,
      height: 61,
      posX: 0,
      posY: 3,
      radius: 18
    }
  },
  {
    id: 'cyber_neon',
    name: 'Cyber Neon Minimal',
    desc: 'Bordas em gradiente ciano e azul de alta tecnologia',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="neon" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%230F172A"/><stop offset="100%" stop-color="%23020617"/></linearGradient><linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stop-color="%2300F2FE"/><stop offset="100%" stop-color="%234FACFE"/></linearGradient></defs><rect width="1080" height="1920" fill="url(%23neon)"/><rect x="60" y="120" width="960" height="180" rx="30" fill="rgba(15,23,42,0.85)" stroke="url(%23glow)" stroke-width="4"/><text x="140" y="210" font-family="system-ui,sans-serif" font-size="34" font-weight="bold" fill="%2300F2FE">⚡ ESTRATÉGIA SECRETA</text><text x="140" y="255" font-family="system-ui,sans-serif" font-size="26" fill="%2394A3B8">Assista com atenção até o final</text><rect x="60" y="400" width="960" height="1180" rx="32" fill="none" stroke="url(%23glow)" stroke-width="6" opacity="0.75"/><rect x="60" y="1660" width="960" height="140" rx="24" fill="rgba(0,242,254,0.1)" stroke="%2300F2FE" stroke-width="2"/><text x="540" y="1745" font-family="system-ui,sans-serif" font-size="30" font-weight="bold" fill="%2338BDF8" text-anchor="middle">SALVE PARA NÃO ESQUECER 📌</text></svg>',
    defaultSlot: {
      width: 88,
      height: 61,
      posX: 0,
      posY: 4,
      radius: 20
    }
  },
  {
    id: 'editorial_clean',
    name: 'Editorial Elegante',
    desc: 'Tipografia serifada clássica com estética minimalista',
    url: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920"><defs><linearGradient id="warm" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="%2318181B"/><stop offset="100%" stop-color="%2309090B"/></linearGradient></defs><rect width="1080" height="1920" fill="url(%23warm)"/><text x="540" y="180" font-family="Georgia,serif" font-size="46" font-weight="bold" fill="%23F4F4F5" text-anchor="middle">O Que Ninguém Te Conta</text><text x="540" y="240" font-family="system-ui,sans-serif" font-size="26" fill="%23A1A1AA" text-anchor="middle">GUIA PRÁTICO PARA ESCALAR SEU CONTEÚDO</text><line x1="200" y1="280" x2="880" y2="280" stroke="%233F3F46" stroke-width="2"/><rect x="70" y="370" width="940" height="1220" rx="24" fill="none" stroke="%2327272A" stroke-width="3"/><text x="540" y="1720" font-family="system-ui,sans-serif" font-size="28" font-weight="600" fill="%2371717A" text-anchor="middle">COMPARTILHE COM QUEM PRECISA DISSO ↗</text></svg>',
    defaultSlot: {
      width: 87,
      height: 63,
      posX: 0,
      posY: 2,
      radius: 16
    }
  }
];
