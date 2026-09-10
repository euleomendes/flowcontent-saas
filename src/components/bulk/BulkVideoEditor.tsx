import React, { useState, useRef, useEffect } from 'react';
import { 
  Film, 
  Sparkles, 
  Crop, 
  ZoomIn, 
  Sliders, 
  Image as ImageIcon, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Layers, 
  ShieldCheck, 
  Flame, 
  Copy, 
  FastForward, 
  Scissors, 
  VolumeX, 
  Volume2, 
  Type, 
  ChevronLeft, 
  ChevronRight, 
  Eye,
  EyeOff,
  Check,
  Zap,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Music2,
  X,
  Palette,
  Layout,
  Maximize2,
  Move,
  Square,
  ShieldAlert,
  Smartphone,
  CheckCheck,
  Upload,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  HelpCircle
} from 'lucide-react';
import { PostItem, VideoEditConfig, FrameArtTemplate, SocialPlatform } from '../../types';
import { DEFAULT_VIDEO_CONFIG, DEFAULT_FRAME_TEMPLATE, getVideoFilterCSS } from '../../utils/helpers';
import { PRESET_BACKGROUND_ARTS, PresetArt } from '../../utils/presets';
import { useApp } from '../../context/AppContext';

interface BulkVideoEditorProps {
  items: Partial<PostItem>[];
  onUpdateItem: (index: number, updated: Partial<PostItem>) => void;
  onApplyGlobalConfig: (config: VideoEditConfig) => void;
  onClose: () => void;
}

type EditorTab = 'frame_layout' | 'frame_art' | 'header_custom' | 'thumbnail' | 'anti_duplicity';

export const BulkVideoEditor: React.FC<BulkVideoEditorProps> = ({
  items,
  onUpdateItem,
  onApplyGlobalConfig,
  onClose
}) => {
  const { showToast, user } = useApp();

  // Active editor tab in the sidebar
  const [activeTab, setActiveTab] = useState<EditorTab>('frame_layout');

  // Filter video items (or media items)
  const videoIndices = items
    .map((item, idx) => ({ item, originalIndex: idx }))
    .filter(entry => entry.item.mediaType === 'video' || (entry.item.mediaUrls && entry.item.mediaUrls.length > 0));

  const [currentVideoPointer, setCurrentVideoPointer] = useState(0);
  const activeEntry = videoIndices[currentVideoPointer] || videoIndices[0];
  const activeOriginalIndex = activeEntry ? activeEntry.originalIndex : 0;
  const activeItem = activeEntry ? activeEntry.item : null;

  // Local state for the selected video's config
  const [config, setConfig] = useState<VideoEditConfig>(() => {
    const existing = activeItem?.videoConfig;
    return {
      ...DEFAULT_VIDEO_CONFIG,
      ...(existing || {}),
      frameTemplate: {
        ...DEFAULT_FRAME_TEMPLATE,
        ...(existing?.frameTemplate || {})
      }
    };
  });

  // Apply mode: 'individual' vs 'global'
  const [isGlobalMode, setIsGlobalMode] = useState(false);

  // Player preview mode: 'player' | 'cover'
  const [previewMode, setPreviewMode] = useState<'player' | 'cover'>('player');

  // Preview platform
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>('instagram');

  // Video playback
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync config when active video switches
  useEffect(() => {
    if (activeItem) {
      const existing = activeItem.videoConfig;
      setConfig({
        ...DEFAULT_VIDEO_CONFIG,
        ...(existing || {}),
        frameTemplate: {
          ...DEFAULT_FRAME_TEMPLATE,
          ...(existing?.frameTemplate || {})
        }
      });
    }
  }, [currentVideoPointer, activeItem]);

  // Handle live changes to current video config
  const updateConfig = (patch: Partial<VideoEditConfig>) => {
    const updated = { ...config, ...patch };
    setConfig(updated);

    if (!isGlobalMode && activeOriginalIndex !== undefined) {
      onUpdateItem(activeOriginalIndex, { videoConfig: updated });
    }
  };

  // Helper to update frameTemplate nested fields
  const updateFrameTemplate = (patch: Partial<FrameArtTemplate>) => {
    const currentFrame = config.frameTemplate || { ...DEFAULT_FRAME_TEMPLATE };
    const updatedFrame = { ...currentFrame, ...patch };
    updateConfig({ frameTemplate: updatedFrame });
  };

  // Apply to all items with clear visual feedback
  const handleApplyToAll = () => {
    onApplyGlobalConfig(config);
    showToast(`⚡ Regra de camadas, arte e encaixe aplicadas a TODOS os ${videoIndices.length} vídeos!`, 'success');
  };

  // Reset to default
  const handleReset = () => {
    const reset: VideoEditConfig = {
      ...DEFAULT_VIDEO_CONFIG,
      frameTemplate: { ...DEFAULT_FRAME_TEMPLATE }
    };
    setConfig(reset);
    if (activeOriginalIndex !== undefined) {
      onUpdateItem(activeOriginalIndex, { videoConfig: reset });
    }
    showToast('Ajustes do vídeo restaurados para o padrão.', 'info');
  };

  // Upload custom art file (PNG/JPG)
  const handleCustomArtUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateFrameTemplate({
        customArtUrl: result,
        customArtFileName: file.name,
        // Regra estrita: Arte de fundo em Segundo Plano (z-index menor = 10)
        customArtLayerOrder: 'art_behind_video'
      });
      showToast(`Arte "${file.name}" carregada no Segundo Plano (Z-Index 10)!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  // Upload custom avatar
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      updateFrameTemplate({ headerAvatarUrl: result });
      showToast('Foto do perfil atualizada!', 'success');
    };
    reader.readAsDataURL(file);
  };

  const frame = config.frameTemplate || DEFAULT_FRAME_TEMPLATE;

  // Video element styles
  const videoTransform = `scale(${config.zoom / 100}) translate(${config.positionX}%, ${config.positionY}%) ${config.flipHorizontal ? 'scaleX(-1)' : ''}`;
  const videoFilter = getVideoFilterCSS(config.filterPreset, config.antiDuplicity);

  const currentMediaUrl = activeItem?.mediaUrls && activeItem.mediaUrls[0] 
    ? activeItem.mediaUrls[0]
    : 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';

  const isRealVideo = activeItem?.mediaFileName?.endsWith('.mp4') || 
                      activeItem?.mediaFileName?.endsWith('.mov') || 
                      currentMediaUrl.startsWith('blob:') ||
                      currentMediaUrl.endsWith('.mp4');

  // Quick Aspect Ratio Presets for the Video Slot
  const applyAspectRatioPreset = (preset: '16:9' | '1:1' | '4:5' | '9:16' | 'free') => {
    switch (preset) {
      case '16:9': // Horizontal inside vertical (classic viral frame)
        updateFrameTemplate({
          slotAspectRatio: '16:9',
          slotWidth: 92,
          slotHeight: 52,
          slotPositionY: 4,
          slotPositionX: 0
        });
        break;
      case '1:1': // Square central
        updateFrameTemplate({
          slotAspectRatio: '1:1',
          slotWidth: 88,
          slotHeight: 56,
          slotPositionY: 3,
          slotPositionX: 0
        });
        break;
      case '4:5': // Portrait feed
        updateFrameTemplate({
          slotAspectRatio: '4:5',
          slotWidth: 90,
          slotHeight: 68,
          slotPositionY: 2,
          slotPositionX: 0
        });
        break;
      case '9:16': // Full bleed
        updateFrameTemplate({
          slotAspectRatio: '9:16',
          slotWidth: 100,
          slotHeight: 100,
          slotPositionY: 0,
          slotPositionX: 0,
          slotBorderRadius: 0
        });
        break;
      case 'free':
        updateFrameTemplate({
          slotAspectRatio: 'free'
        });
        break;
    }
  };

  // Selection of preset art
  const handleSelectPresetArt = (preset: PresetArt) => {
    updateFrameTemplate({
      customArtUrl: preset.url,
      customArtFileName: preset.name,
      customArtLayerOrder: 'art_behind_video',
      slotWidth: preset.defaultSlot.width,
      slotHeight: preset.defaultSlot.height,
      slotPositionX: preset.defaultSlot.posX,
      slotPositionY: preset.defaultSlot.posY,
      slotBorderRadius: preset.defaultSlot.radius,
      showTopHeader: false // Preset já possui cabeçalho/branding desenhado
    });
    showToast(`Modelo "${preset.name}" aplicado com encaixe otimizado!`, 'info');
  };

  // Strict Layer Order calculation
  // Regra 1: A arte/moldura personalizada deve funcionar como BACKGROUND / SEGUNDO PLANO (z-index menor = 10)
  // Regra 2: O vídeo deve ficar em PRIMEIRO PLANO (z-index maior = 20), encaixado sobre a arte
  const isArtBehind = frame.customArtLayerOrder === 'art_behind_video';
  const backgroundArtZIndex = isArtBehind ? 10 : 25;
  const videoSlotZIndex = isArtBehind ? 20 : 15;

  return (
    <div className="bg-slate-900/95 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl animate-fade-in mb-8">
      {/* Top Header Bar */}
      <div className="p-5 border-b border-slate-800 bg-slate-950/90 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/20">
            <Layout className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-tight">
                Editor de Vídeos em Massa & Construtor de Camadas
              </h2>
              <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
                <Layers className="w-3 h-3" /> ARTE NO FUNDO (Z-10) + VÍDEO 1º PLANO (Z-20)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Posicione o vídeo exatamente sobre a área de encaixe da arte de fundo e aplique em lote a toda a fila
            </p>
          </div>
        </div>

        {/* Global vs Individual Mode & Global Apply Header Button */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleApplyToAll}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-1.5 transition-all active:scale-[0.98]"
            title="Aplica esta mesma arte e área de encaixe a todos os vídeos"
          >
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>Aplicar a Todos ({videoIndices.length} Vídeos)</span>
          </button>

          <div className="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setIsGlobalMode(false)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                !isGlobalMode
                  ? 'bg-brand-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Vídeo #{currentVideoPointer + 1}
            </button>
            <button
              type="button"
              onClick={() => setIsGlobalMode(true)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                isGlobalMode
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>Modo Global</span>
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Fechar Editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Video Carousel / Filmstrip Selector */}
      <div className="px-5 py-2.5 border-b border-slate-800/80 bg-slate-950/40 flex items-center gap-3 overflow-x-auto">
        <span className="text-xs font-bold text-slate-400 shrink-0 uppercase tracking-wider text-[10px]">
          Fila ({videoIndices.length}):
        </span>

        <div className="flex items-center gap-2">
          {videoIndices.map((entry, idx) => {
            const isSelected = idx === currentVideoPointer;
            return (
              <button
                key={entry.item.id || idx}
                type="button"
                onClick={() => setCurrentVideoPointer(idx)}
                className={`px-3 py-1.5 rounded-xl border flex items-center gap-2.5 transition-all shrink-0 ${
                  isSelected
                    ? 'bg-brand-600/20 border-brand-500 text-white shadow-md'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-950 shrink-0 border border-slate-800">
                  <img
                    src={entry.item.mediaUrls?.[0] || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=100&auto=format&fit=crop&q=80'}
                    alt="thumb"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-left">
                  <span className="text-xs font-bold block leading-none">
                    Vídeo #{idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate max-w-[90px] block">
                    {entry.item.mediaFileName || `video_${idx + 1}.mp4`}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
        {/* Left Column: Live Mockup Player with Layered Art Frame (5 cols) */}
        <div className="lg:col-span-5 p-6 flex flex-col items-center justify-center bg-slate-950/70 relative">
          {/* Mockup Control Bar */}
          <div className="w-full max-w-[300px] flex items-center justify-between mb-3 text-xs">
            <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewMode('player')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  previewMode === 'player'
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Player em Camadas
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('cover')}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                  previewMode === 'cover'
                    ? 'bg-brand-600 text-white shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Capa (Thumb)
              </button>
            </div>

            <select
              value={previewPlatform}
              onChange={(e) => setPreviewPlatform(e.target.value as SocialPlatform)}
              className="bg-slate-900 border border-slate-800 rounded-xl px-2 py-1 text-[11px] text-slate-300 focus:outline-none focus:border-brand-500 font-semibold"
            >
              <option value="instagram">Instagram Reel</option>
              <option value="tiktok">TikTok</option>
              <option value="youtube">YouTube Shorts</option>
            </select>
          </div>

          {/* Smartphone 9:16 Mockup Frame */}
          <div 
            className="w-[290px] h-[535px] rounded-[38px] border-[5px] border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between select-none"
            style={{ backgroundColor: frame.canvasBgColor }}
          >
            {/* Dynamic Island / Top Speaker */}
            <div className="absolute top-2.5 inset-x-0 flex justify-center z-40 pointer-events-none">
              <div className="w-20 h-4 bg-black/80 backdrop-blur-md rounded-full flex items-center justify-end px-2">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
            </div>

            {/* LAYER 0 (z-5): Canvas Background Blur (quando ativo) */}
            {frame.canvasBgType === 'blur_video' && (
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 z-[5]">
                <img
                  src={currentMediaUrl}
                  alt="bg-blur"
                  className="w-full h-full object-cover blur-2xl scale-125"
                />
              </div>
            )}

            {/* ========================================================================= */}
            {/* LAYER 1 (z-10 se art_behind_video): ARTE DE FUNDO / SEGUNDO PLANO         */}
            {/* Regra 1: Arte personalizada funciona como BACKGROUND (z-index menor)      */}
            {/* ========================================================================= */}
            {frame.customArtUrl && (
              <div 
                className="absolute inset-0 overflow-hidden pointer-events-none transition-all"
                style={{ zIndex: backgroundArtZIndex }}
              >
                <img
                  src={frame.customArtUrl}
                  alt="Arte de Fundo Personalizada"
                  className="w-full h-full"
                  style={{
                    objectFit: frame.customArtFit,
                    opacity: frame.customArtOpacity / 100
                  }}
                />
              </div>
            )}

            {/* ========================================================================= */}
            {/* LAYER 2 (z-20 se art_behind_video): VÍDEO EM PRIMEIRO PLANO (ENCAIXE)     */}
            {/* Regra 2: Vídeo fica em PRIMEIRO PLANO (z-index maior) sobre a arte        */}
            {/* ========================================================================= */}
            <div
              className={`absolute overflow-hidden transition-all duration-150 group ${
                frame.showDottedBorders ? 'ring-2 ring-dashed ring-brand-400/90 shadow-2xl' : ''
              }`}
              style={{
                zIndex: videoSlotZIndex,
                width: `${frame.slotWidth}%`,
                height: `${frame.slotHeight}%`,
                top: `calc(50% + ${frame.slotPositionY}%)`,
                left: `calc(50% + ${frame.slotPositionX}%)`,
                transform: 'translate(-50%, -50%)',
                borderRadius: `${frame.slotBorderRadius}px`,
                border: frame.slotBorderWidth > 0 ? `${frame.slotBorderWidth}px ${frame.slotBorderStyle} ${frame.slotBorderColor}` : undefined,
                backgroundColor: '#000000',
                boxShadow: frame.slotShadow === 'heavy' 
                  ? '0 20px 45px -8px rgba(0, 0, 0, 0.85)' 
                  : frame.slotShadow === 'glow'
                  ? '0 0 25px rgba(99, 102, 241, 0.45)'
                  : frame.slotShadow === 'soft'
                  ? '0 10px 25px -5px rgba(0, 0, 0, 0.5)'
                  : 'none'
              }}
            >
              {/* Media inside the slot */}
              {previewMode === 'cover' && config.thumbnailUrl ? (
                <img
                  src={config.thumbnailUrl}
                  alt="Custom Cover"
                  style={{
                    transform: videoTransform,
                    filter: videoFilter,
                    transition: 'all 0.15s ease-out'
                  }}
                  className="w-full h-full object-cover"
                />
              ) : isRealVideo ? (
                <video
                  ref={videoRef}
                  src={currentMediaUrl}
                  autoPlay={isPlaying}
                  loop
                  muted={config.muteOriginalAudio}
                  playsInline
                  style={{
                    transform: videoTransform,
                    filter: videoFilter,
                    transition: 'all 0.15s ease-out'
                  }}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={currentMediaUrl}
                  alt="Video Frame Preview"
                  style={{
                    transform: videoTransform,
                    filter: videoFilter,
                    transition: 'all 0.15s ease-out'
                  }}
                  className="w-full h-full object-cover"
                />
              )}

              {/* Dotted Alignment Overlay Tag inside slot */}
              {frame.showDottedBorders && (
                <div className="absolute top-2 left-2 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-md text-[9px] text-brand-300 font-mono font-bold pointer-events-none border border-brand-500/30 flex items-center gap-1">
                  <span>1º PLANO: {frame.slotWidth}% × {frame.slotHeight}%</span>
                </div>
              )}

              {/* Cover Hook Overlay inside Slot */}
              {previewMode === 'cover' && config.coverText && (
                <div className="absolute inset-0 bg-black/40 flex flex-col justify-center items-center p-3 z-10 animate-fade-in">
                  <div 
                    className="max-w-[90%] text-center px-3.5 py-2 rounded-xl font-black text-xs uppercase tracking-wide shadow-2xl"
                    style={{
                      backgroundColor: config.coverTextBg,
                      color: config.coverTextColor,
                    }}
                  >
                    {config.coverText}
                  </div>
                </div>
              )}
            </div>

            {/* LAYER 3 (z-22): TOP BAR / CARD SUPERIOR CUSTOMIZÁVEL (quando ativada) */}
            {frame.showTopHeader && (
              <div className="absolute top-8 inset-x-3 pointer-events-none animate-slide-up" style={{ zIndex: 22 }}>
                <div 
                  className="p-3 rounded-2xl border shadow-xl backdrop-blur-md space-y-1.5 transition-all"
                  style={{
                    backgroundColor: frame.headerBgColor,
                    borderColor: 'rgba(255, 255, 255, 0.14)',
                    color: frame.headerTextColor
                  }}
                >
                  {/* Profile Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 min-w-0">
                      <div 
                        className={`overflow-hidden ring-1.5 ring-brand-500 shrink-0 bg-slate-800 ${
                          frame.headerAvatarShape === 'circle' ? 'rounded-full' :
                          frame.headerAvatarShape === 'rounded' ? 'rounded-xl' : 'rounded-md'
                        } ${
                          frame.headerAvatarSize === 'sm' ? 'w-6 h-6' :
                          frame.headerAvatarSize === 'lg' ? 'w-8 h-8' : 'w-7 h-7'
                        }`}
                      >
                        <img 
                          src={frame.headerAvatarUrl || user.avatar} 
                          className="w-full h-full object-cover" 
                          alt="avatar" 
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span 
                            className={`leading-tight truncate ${
                              frame.headerNameWeight === 'normal' ? 'font-normal' :
                              frame.headerNameWeight === 'semibold' ? 'font-semibold' :
                              frame.headerNameWeight === 'extrabold' ? 'font-black' : 'font-bold'
                            } ${
                              frame.headerNameSize === 'xs' ? 'text-[10px]' :
                              frame.headerNameSize === 'base' ? 'text-xs' : 'text-[11px]'
                            }`}
                            style={{ color: frame.headerNameColor }}
                          >
                            {frame.headerDisplayName || user.name}
                          </span>
                          {frame.showVerifiedBadge && (
                            <span 
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] text-white font-bold shrink-0 ${
                                frame.verifiedBadgeType === 'gold' ? 'bg-amber-500' :
                                frame.verifiedBadgeType === 'neon' ? 'bg-cyan-400 text-slate-950' : 'bg-sky-500'
                              }`}
                            >
                              ✓
                            </span>
                          )}
                        </div>
                        <p 
                          className="text-[9px] leading-tight truncate font-mono"
                          style={{ color: frame.headerUsernameColor }}
                        >
                          {frame.headerUsername || '@flowtrends'}
                        </p>
                      </div>
                    </div>

                    <span className="text-[9px] font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded-full border border-brand-500/20 shrink-0">
                      Seguir
                    </span>
                  </div>

                  {/* Top Headline / Callout Text */}
                  {frame.headerTitle && (
                    <p 
                      className={`leading-snug drop-shadow-sm ${
                        frame.headerTitleAlign === 'center' ? 'text-center' :
                        frame.headerTitleAlign === 'right' ? 'text-right' : 'text-left'
                      } ${
                        frame.headerTitleFont === 'serif' ? 'font-serif' :
                        frame.headerTitleFont === 'mono' ? 'font-mono' :
                        frame.headerTitleFont === 'headline' ? 'font-black uppercase tracking-tight' : 'font-sans font-bold'
                      } ${
                        frame.headerTitleSize === 'base' ? 'text-[12px]' :
                        frame.headerTitleSize === 'lg' ? 'text-[13px]' :
                        frame.headerTitleSize === 'xl' ? 'text-[14px]' : 'text-[11px]'
                      }`}
                      style={{ color: frame.headerTitleColor }}
                    >
                      {frame.headerTitle}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* LAYER 4 (z-30): SAFE ZONE GUIDE OVERLAYS (Guias de Limite) */}
            {frame.showSafeZoneGuides && (
              <div className="absolute inset-0 pointer-events-none z-30 flex flex-col justify-between border-2 border-dashed border-rose-500/50 m-2 rounded-[32px]">
                <div className="bg-rose-500/15 text-rose-300 text-[8px] font-mono px-2 py-0.5 text-center">
                  ⚠️ Top Safe Zone (Evite textos nesta área)
                </div>
                <div className="bg-rose-500/15 text-rose-300 text-[8px] font-mono px-2 py-0.5 text-center">
                  ⚠️ Bottom Safe Zone (Legendas e botões sociais)
                </div>
              </div>
            )}

            {/* LAYER 5 (z-35): AÇÕES SOCIAIS NATIVAS (Right Rail) */}
            <div className="absolute right-3 bottom-9 flex flex-col items-center gap-3 z-35 pointer-events-none">
              <div className="flex flex-col items-center">
                <Heart className="w-5 h-5 text-white drop-shadow" />
                <span className="text-[9px] font-bold text-white mt-0.5">42.8K</span>
              </div>
              <div className="flex flex-col items-center">
                <MessageCircle className="w-5 h-5 text-white drop-shadow" />
                <span className="text-[9px] font-bold text-white mt-0.5">1.2K</span>
              </div>
              <div className="flex flex-col items-center">
                <Bookmark className="w-5 h-5 text-white drop-shadow" />
                <span className="text-[9px] font-bold text-white mt-0.5">5.6K</span>
              </div>
              <div className="flex flex-col items-center">
                <Share2 className="w-5 h-5 text-white drop-shadow" />
                <span className="text-[9px] font-bold text-white mt-0.5">980</span>
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center animate-spin">
                <Music2 className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            {/* Bottom Music Tag */}
            <div className="absolute bottom-3 left-3 right-14 z-35 pointer-events-none">
              <div className="flex items-center gap-1.5 text-[9px] text-slate-300 font-medium bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-full w-fit">
                <Music2 className="w-3 h-3 text-brand-400" />
                <span className="truncate">Áudio Original • {config.speed}x</span>
              </div>
            </div>
          </div>

          {/* Layer Status HUD Badge */}
          <div className="mt-3 flex flex-col items-center gap-1 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] font-medium shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300">
                {isArtBehind ? 'Arte: 2º Plano (Z-10)' : 'Arte: Moldura Frontal'}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-brand-300 font-semibold">
                {isArtBehind ? 'Vídeo: 1º Plano (Z-20)' : 'Vídeo: Sob Moldura'}
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">
              Encaixe: {frame.slotWidth}% larg. × {frame.slotHeight}% alt. (X: {frame.slotPositionX}%, Y: {frame.slotPositionY}%)
            </span>
          </div>
        </div>

        {/* Right Column: Painel Lateral de Ajustes com Abas (7 cols) */}
        <div className="lg:col-span-7 p-6 space-y-5 bg-slate-900/60 max-h-[640px] overflow-y-auto">
          {/* Navigation Sub-Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('frame_layout')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'frame_layout'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>1. Encaixe Vídeo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('frame_art')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'frame_art'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>2. Arte de Fundo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('header_custom')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'header_custom'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>3. Barra Topo</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('thumbnail')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'thumbnail'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Crop className="w-3.5 h-3.5" />
              <span>4. Capa</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('anti_duplicity')}
              className={`py-2 px-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'anti_duplicity'
                  ? 'bg-brand-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>5. Algoritmo</span>
            </button>
          </div>

          {/* TAB 1: ENCAIXE & POSICIONAMENTO DO VÍDEO (Primeiro Plano) */}
          {activeTab === 'frame_layout' && (
            <div className="space-y-4 animate-fade-in">
              {/* Informação e Seletor de Ordem de Camadas (Z-Index) */}
              <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">
                        Hierarquia de Camadas (Z-Index)
                      </span>
                      <span className="text-[11px] text-indigo-300">
                        {isArtBehind ? 'Arte no 2º Plano (Z-10) • Vídeo no 1º Plano (Z-20)' : 'Moldura Frontal sobreposta (Z-25) • Vídeo sob moldura (Z-15)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
                    <button
                      type="button"
                      onClick={() => updateFrameTemplate({ customArtLayerOrder: 'art_behind_video' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        isArtBehind
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Vídeo 1º Plano
                    </button>
                    <button
                      type="button"
                      onClick={() => updateFrameTemplate({ customArtLayerOrder: 'art_above_video' })}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        !isArtBehind
                          ? 'bg-indigo-600 text-white shadow'
                          : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Vídeo 2º Plano
                    </button>
                  </div>
                </div>
              </div>

              {/* Controles Deslizantes de Largura e Altura (Width & Height) */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
                    Dimensões do Vídeo (Largura & Altura)
                  </span>
                  <button
                    type="button"
                    onClick={() => updateFrameTemplate({ slotWidth: 89, slotHeight: 63, slotPositionX: 0, slotPositionY: 1 })}
                    className="text-[10px] text-brand-400 hover:text-brand-300 bg-brand-500/10 border border-brand-500/20 px-2 py-0.5 rounded-lg flex items-center gap-1 font-semibold"
                  >
                    <RotateCcw className="w-3 h-3" /> Encaixe Perfeito (89% × 63%)
                  </button>
                </div>

                {/* Largura (Width) */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Largura do Vídeo (Width)</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[50, 75, 89, 100].map((w) => (
                          <button
                            key={w}
                            type="button"
                            onClick={() => updateFrameTemplate({ slotWidth: w })}
                            className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                              frame.slotWidth === w ? 'bg-brand-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            {w}%
                          </button>
                        ))}
                      </div>
                      <span className="font-mono text-brand-400 font-bold w-12 text-right">{frame.slotWidth}%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={frame.slotWidth}
                    onChange={(e) => updateFrameTemplate({ slotWidth: parseInt(e.target.value, 10) })}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                </div>

                {/* Altura (Height) */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Altura do Vídeo (Height)</span>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {[40, 52, 63, 85, 100].map((h) => (
                          <button
                            key={h}
                            type="button"
                            onClick={() => updateFrameTemplate({ slotHeight: h })}
                            className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                              frame.slotHeight === h ? 'bg-brand-600 text-white font-bold' : 'bg-slate-900 text-slate-400 hover:text-white'
                            }`}
                          >
                            {h}%
                          </button>
                        ))}
                      </div>
                      <span className="font-mono text-brand-400 font-bold w-12 text-right">{frame.slotHeight}%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={frame.slotHeight}
                    onChange={(e) => updateFrameTemplate({ slotHeight: parseInt(e.target.value, 10) })}
                    className="w-full accent-brand-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Controles Deslizantes de Deslocamento (Eixos X e Y) + D-Pad */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
                    Posição & Deslocamento nos Eixos (X e Y)
                  </span>
                  <button
                    type="button"
                    onClick={() => updateFrameTemplate({ slotPositionX: 0, slotPositionY: 0 })}
                    className="text-[10px] text-slate-400 hover:text-white bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-lg flex items-center gap-1 font-semibold"
                  >
                    🎯 Centralizar (0, 0)
                  </button>
                </div>

                {/* Eixo Horizontal (X) */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Deslocamento Horizontal (Eixo X)</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateFrameTemplate({ slotPositionX: Math.max(-40, frame.slotPositionX - 1) })}
                        className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        title="-1% à esquerda"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFrameTemplate({ slotPositionX: 0 })}
                        className="px-1.5 py-0.5 text-[10px] rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        title="Zerar X"
                      >
                        0%
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFrameTemplate({ slotPositionX: Math.min(40, frame.slotPositionX + 1) })}
                        className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        title="+1% à direita"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-indigo-400 font-bold w-12 text-right">{frame.slotPositionX}%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={frame.slotPositionX}
                    onChange={(e) => updateFrameTemplate({ slotPositionX: parseInt(e.target.value, 10) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Eixo Vertical (Y) */}
                <div>
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <span className="text-slate-300 font-medium">Deslocamento Vertical (Eixo Y)</span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateFrameTemplate({ slotPositionY: Math.max(-40, frame.slotPositionY - 1) })}
                        className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        title="-1% para cima"
                      >
                        <ArrowUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFrameTemplate({ slotPositionY: 0 })}
                        className="px-1.5 py-0.5 text-[10px] rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        title="Zerar Y"
                      >
                        0%
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFrameTemplate({ slotPositionY: Math.min(40, frame.slotPositionY + 1) })}
                        className="p-1 rounded bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                        title="+1% para baixo"
                      >
                        <ArrowDown className="w-3 h-3" />
                      </button>
                      <span className="font-mono text-indigo-400 font-bold w-12 text-right">{frame.slotPositionY}%</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min="-40"
                    max="40"
                    value={frame.slotPositionY}
                    onChange={(e) => updateFrameTemplate({ slotPositionY: parseInt(e.target.value, 10) })}
                    className="w-full accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* D-Pad Direcional Interativo para Ajuste Fino */}
                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-medium">Ajuste Fino por Clique (D-Pad):</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => updateFrameTemplate({ slotPositionX: Math.max(-40, frame.slotPositionX - 1) })}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                      title="Mover Esquerda"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" />
                    </button>
                    <div className="flex flex-col gap-1">
                      <button
                        type="button"
                        onClick={() => updateFrameTemplate({ slotPositionY: Math.max(-40, frame.slotPositionY - 1) })}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                        title="Mover Cima"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => updateFrameTemplate({ slotPositionY: Math.min(40, frame.slotPositionY + 1) })}
                        className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                        title="Mover Baixo"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => updateFrameTemplate({ slotPositionX: Math.min(40, frame.slotPositionX + 1) })}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800"
                      title="Mover Direita"
                    >
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Atalhos Rápidos de Proporção */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Proporções Rápidas de Corte
                </span>

                <div className="grid grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => applyAspectRatioPreset('16:9')}
                    className={`p-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-0.5 transition-all ${
                      frame.slotAspectRatio === '16:9'
                        ? 'bg-brand-600/20 border-brand-500 text-brand-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[11px] font-bold">16:9</span>
                    <span className="text-[9px] text-slate-500">Viral</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyAspectRatioPreset('1:1')}
                    className={`p-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-0.5 transition-all ${
                      frame.slotAspectRatio === '1:1'
                        ? 'bg-brand-600/20 border-brand-500 text-brand-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[11px] font-bold">1:1</span>
                    <span className="text-[9px] text-slate-500">Quadrado</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyAspectRatioPreset('4:5')}
                    className={`p-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-0.5 transition-all ${
                      frame.slotAspectRatio === '4:5'
                        ? 'bg-brand-600/20 border-brand-500 text-brand-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[11px] font-bold">4:5</span>
                    <span className="text-[9px] text-slate-500">Retrato</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyAspectRatioPreset('9:16')}
                    className={`p-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-0.5 transition-all ${
                      frame.slotAspectRatio === '9:16'
                        ? 'bg-brand-600/20 border-brand-500 text-brand-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[11px] font-bold">9:16</span>
                    <span className="text-[9px] text-slate-500">Cheia</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => applyAspectRatioPreset('free')}
                    className={`p-2 rounded-xl text-xs font-semibold border flex flex-col items-center gap-0.5 transition-all ${
                      frame.slotAspectRatio === 'free'
                        ? 'bg-brand-600/20 border-brand-500 text-brand-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-[11px] font-bold">Livre</span>
                    <span className="text-[9px] text-slate-500">Custom</span>
                  </button>
                </div>
              </div>

              {/* Estilo do Encaixe (Bordas, Arredondamento e Guias) */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Bordas & Guias Visuais
                </span>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Arredondamento (Radius)</span>
                      <span className="font-mono text-brand-400 font-bold">{frame.slotBorderRadius}px</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="40"
                      value={frame.slotBorderRadius}
                      onChange={(e) => updateFrameTemplate({ slotBorderRadius: parseInt(e.target.value, 10) })}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Zoom Interno</span>
                      <span className="font-mono text-brand-400 font-bold">{config.zoom}%</span>
                    </div>
                    <input
                      type="range"
                      min="100"
                      max="150"
                      value={config.zoom}
                      onChange={(e) => updateConfig({ zoom: parseInt(e.target.value, 10) })}
                      className="w-full accent-brand-500 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-4">
                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={frame.showDottedBorders}
                      onChange={(e) => updateFrameTemplate({ showDottedBorders: e.target.checked })}
                      className="rounded bg-slate-900 border-slate-700 text-brand-500 focus:ring-0"
                    />
                    <span>Bordas Pontilhadas de Alinhamento</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={frame.showSafeZoneGuides}
                      onChange={(e) => updateFrameTemplate({ showSafeZoneGuides: e.target.checked })}
                      className="rounded bg-slate-900 border-slate-700 text-rose-500 focus:ring-0"
                    />
                    <span>Linhas Safe Zone (Reels/TikTok)</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARTE DE FUNDO & MOLDURA (Segundo Plano) */}
          {activeTab === 'frame_art' && (
            <div className="space-y-4 animate-fade-in">
              {/* Upload de Arte Própria pelo Usuário */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-white block">
                      Upload de Imagem Própria (PNG / JPG)
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Envie sua arte de fundo personalizada ou template da sua marca
                    </p>
                  </div>

                  {frame.customArtUrl && (
                    <button
                      type="button"
                      onClick={() => updateFrameTemplate({ customArtUrl: undefined, customArtFileName: undefined })}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Remover
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  id="custom-art-file-input"
                  accept="image/png,image/jpeg,image/webp"
                  className="hidden"
                  onChange={handleCustomArtUpload}
                />

                <label
                  htmlFor="custom-art-file-input"
                  className={`w-full p-4 rounded-2xl border-2 border-dashed cursor-pointer flex flex-col items-center justify-center gap-2 transition-all ${
                    frame.customArtUrl
                      ? 'border-brand-500/60 bg-brand-500/5 text-brand-300'
                      : 'border-slate-700/80 hover:border-slate-500 bg-slate-900/80 text-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-2xl bg-slate-800 flex items-center justify-center text-brand-400 shadow">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-bold block">
                      {frame.customArtFileName ? `Arquivo: ${frame.customArtFileName}` : 'Clique para selecionar seu arquivo PNG / JPG'}
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Recomendado formato 9:16 vertical (1080x1920)
                    </span>
                  </div>
                </label>

                {/* Controles de Opacidade e Fit da Arte */}
                {frame.customArtUrl && (
                  <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800">
                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Opacidade da Arte</span>
                        <span className="font-mono text-brand-400 font-bold">{frame.customArtOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="10"
                        max="100"
                        value={frame.customArtOpacity}
                        onChange={(e) => updateFrameTemplate({ customArtOpacity: parseInt(e.target.value, 10) })}
                        className="w-full accent-brand-500 cursor-pointer"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[11px] mb-1">
                        <span className="text-slate-400">Modo de Encaixe</span>
                        <span className="text-brand-400 font-semibold uppercase text-[10px]">{frame.customArtFit}</span>
                      </div>
                      <div className="flex gap-1">
                        {(['cover', 'contain', 'fill'] as const).map((fit) => (
                          <button
                            key={fit}
                            type="button"
                            onClick={() => updateFrameTemplate({ customArtFit: fit })}
                            className={`flex-1 py-1 rounded-lg text-[10px] font-semibold border transition-all ${
                              frame.customArtFit === fit
                                ? 'bg-brand-600 text-white border-brand-500'
                                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                            }`}
                          >
                            {fit === 'cover' ? 'Preencher' : fit === 'contain' ? 'Conter' : 'Esticar'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Galeria de Artes / Modelos Rápidos de Segundo Plano */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Modelos Prontos de Arte de Fundo (Segundo Plano)
                </span>

                <div className="grid grid-cols-2 gap-2.5">
                  {PRESET_BACKGROUND_ARTS.map((preset) => {
                    const isSelected = frame.customArtUrl === preset.url;
                    return (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => handleSelectPresetArt(preset)}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          isSelected
                            ? 'bg-brand-600/20 border-brand-500 text-white shadow-md'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="w-10 h-14 rounded-lg bg-black border border-slate-700 overflow-hidden shrink-0">
                          <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold block text-white truncate">
                            {preset.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block truncate">
                            {preset.desc}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cor de Fundo do Canvas */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                    Cor Base do Fundo (Canvas)
                  </span>
                  <span className="font-mono text-[11px] text-brand-400">{frame.canvasBgColor}</span>
                </div>

                <div className="flex items-center gap-2">
                  {[
                    { color: '#090D16', label: 'Dark Slate' },
                    { color: '#000000', label: 'Black' },
                    { color: '#18181B', label: 'Zinc' },
                    { color: '#1E1B4B', label: 'Indigo' },
                    { color: '#31103F', label: 'Purple' }
                  ].map((c) => (
                    <button
                      key={c.color}
                      type="button"
                      onClick={() => updateFrameTemplate({ canvasBgColor: c.color })}
                      className={`w-8 h-8 rounded-xl border-2 transition-transform ${
                        frame.canvasBgColor === c.color ? 'border-brand-400 scale-110 shadow-md' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c.color }}
                      title={c.label}
                    />
                  ))}

                  <label className="ml-auto flex items-center gap-1.5 cursor-pointer text-xs text-slate-400">
                    <input
                      type="color"
                      value={frame.canvasBgColor}
                      onChange={(e) => updateFrameTemplate({ canvasBgColor: e.target.value })}
                      className="w-7 h-7 rounded-lg cursor-pointer bg-transparent border-0"
                    />
                    <span>Personalizada</span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BARRA SUPERIOR & TEXTOS (Customização Campo a Campo) */}
          {activeTab === 'header_custom' && (
            <div className="space-y-4 animate-fade-in">
              {/* Toggle para ativar/desativar barra superior */}
              <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-white block">
                    Exibir Barra Superior / Card de Perfil
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {frame.showTopHeader 
                      ? 'Ativa sobre o vídeo ou arte' 
                      : 'Desativada (ideal quando sua arte de fundo já possui cabeçalho próprio)'}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => updateFrameTemplate({ showTopHeader: !frame.showTopHeader })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    frame.showTopHeader
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-400'
                  }`}
                >
                  {frame.showTopHeader ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  <span>{frame.showTopHeader ? 'Exibindo' : 'Oculto'}</span>
                </button>
              </div>

              {frame.showTopHeader && (
                <>
                  {/* Texto de Chamada / Hook Superior */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Texto de Chamada Superior (Hook / Manchete)
                      </label>
                      <div className="flex items-center gap-2">
                        {/* Alinhamento */}
                        <div className="flex bg-slate-900 rounded-lg p-0.5 border border-slate-800">
                          <button
                            type="button"
                            onClick={() => updateFrameTemplate({ headerTitleAlign: 'left' })}
                            className={`p-1 rounded ${frame.headerTitleAlign === 'left' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
                          >
                            <AlignLeft className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateFrameTemplate({ headerTitleAlign: 'center' })}
                            className={`p-1 rounded ${frame.headerTitleAlign === 'center' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
                          >
                            <AlignCenter className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => updateFrameTemplate({ headerTitleAlign: 'right' })}
                            className={`p-1 rounded ${frame.headerTitleAlign === 'right' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
                          >
                            <AlignRight className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Cor do Texto */}
                        <input
                          type="color"
                          value={frame.headerTitleColor}
                          onChange={(e) => updateFrameTemplate({ headerTitleColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                          title="Cor da Manchete"
                        />
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      value={frame.headerTitle}
                      onChange={(e) => updateFrameTemplate({ headerTitle: e.target.value })}
                      placeholder="Ex: Dica que 99% dos criadores ignoram 👇"
                      className="w-full bg-slate-900 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500 resize-none font-medium leading-relaxed"
                    />

                    <div className="flex items-center justify-between text-xs pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[11px]">Estilo da Fonte:</span>
                        <div className="flex gap-1">
                          {(['sans', 'serif', 'mono', 'headline'] as const).map((font) => (
                            <button
                              key={font}
                              type="button"
                              onClick={() => updateFrameTemplate({ headerTitleFont: font })}
                              className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                                frame.headerTitleFont === font 
                                  ? 'bg-brand-600 text-white border-brand-500' 
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}
                            >
                              {font === 'sans' ? 'Moderna' : font === 'serif' ? 'Editorial' : font === 'mono' ? 'Tech' : 'Impact'}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span className="text-slate-400 text-[11px]">Tamanho:</span>
                        {(['sm', 'base', 'lg', 'xl'] as const).map((sz) => (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => updateFrameTemplate({ headerTitleSize: sz })}
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${
                              frame.headerTitleSize === sz ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-slate-400'
                            }`}
                          >
                            {sz.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Informações de Perfil no Card Superior */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                      Perfil & Identidade no Topo
                    </span>

                    {/* Avatar Upload e Formato */}
                    <div className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-slate-800 border border-slate-700 shrink-0">
                        <img 
                          src={frame.headerAvatarUrl || user.avatar} 
                          alt="avatar preview" 
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <input
                            type="file"
                            id="avatar-custom-upload"
                            accept="image/*"
                            className="hidden"
                            onChange={handleAvatarUpload}
                          />
                          <label
                            htmlFor="avatar-custom-upload"
                            className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-semibold text-slate-200 cursor-pointer border border-slate-700"
                          >
                            Trocar Avatar
                          </label>

                          {frame.headerAvatarUrl && (
                            <button
                              type="button"
                              onClick={() => updateFrameTemplate({ headerAvatarUrl: undefined })}
                              className="text-[10px] text-rose-400 hover:underline"
                            >
                              Restaurar
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Formato do Avatar */}
                      <div className="flex gap-1">
                        {(['circle', 'rounded', 'square'] as const).map((shape) => (
                          <button
                            key={shape}
                            type="button"
                            onClick={() => updateFrameTemplate({ headerAvatarShape: shape })}
                            className={`px-2 py-1 text-[10px] rounded font-semibold border ${
                              frame.headerAvatarShape === shape 
                                ? 'bg-brand-600 text-white border-brand-500' 
                                : 'bg-slate-950 text-slate-400 border-slate-800'
                            }`}
                          >
                            {shape === 'circle' ? 'Redondo' : shape === 'rounded' ? 'Suave' : 'Quadrado'}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11px] text-slate-400">Nome de Exibição</label>
                          <input
                            type="color"
                            value={frame.headerNameColor}
                            onChange={(e) => updateFrameTemplate({ headerNameColor: e.target.value })}
                            className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                            title="Cor do Nome"
                          />
                        </div>
                        <input
                          type="text"
                          value={frame.headerDisplayName}
                          onChange={(e) => updateFrameTemplate({ headerDisplayName: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="text-[11px] text-slate-400">@Username</label>
                          <input
                            type="color"
                            value={frame.headerUsernameColor}
                            onChange={(e) => updateFrameTemplate({ headerUsernameColor: e.target.value })}
                            className="w-5 h-5 rounded cursor-pointer bg-transparent border-0"
                            title="Cor do @Username"
                          />
                        </div>
                        <input
                          type="text"
                          value={frame.headerUsername}
                          onChange={(e) => updateFrameTemplate({ headerUsername: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>

                    {/* Selo de Verificado */}
                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="verified-badge-checkbox"
                          checked={frame.showVerifiedBadge}
                          onChange={(e) => updateFrameTemplate({ showVerifiedBadge: e.target.checked })}
                          className="rounded bg-slate-900 border-slate-700 text-sky-500 focus:ring-0"
                        />
                        <label htmlFor="verified-badge-checkbox" className="text-xs text-slate-300 cursor-pointer">
                          Selo de Verificado
                        </label>
                      </div>

                      {frame.showVerifiedBadge && (
                        <div className="flex gap-1">
                          {(['blue', 'gold', 'neon'] as const).map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => updateFrameTemplate({ verifiedBadgeType: type })}
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                frame.verifiedBadgeType === type 
                                  ? 'bg-sky-500/20 text-sky-300 border-sky-500' 
                                  : 'bg-slate-900 text-slate-400 border-slate-800'
                              }`}
                            >
                              {type === 'blue' ? 'Azul' : type === 'gold' ? 'Dourado' : 'Neon'}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Estilo do Card Superior (Cor de Fundo) */}
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                        Cor e Estilo do Card Superior
                      </span>
                      <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-400">
                        <input
                          type="color"
                          value={frame.headerBgColor.startsWith('#') ? frame.headerBgColor : '#0F172A'}
                          onChange={(e) => updateFrameTemplate({ headerBgColor: e.target.value })}
                          className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                        />
                        <span>Cor</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2">
                      {[
                        { color: 'rgba(15, 23, 42, 0.9)', label: 'Dark Glass' },
                        { color: 'rgba(0, 0, 0, 0.92)', label: 'Black Glass' },
                        { color: 'rgba(30, 27, 75, 0.9)', label: 'Indigo Glass' },
                        { color: 'rgba(255, 255, 255, 0.95)', label: 'Light Clean' }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => updateFrameTemplate({ 
                            headerBgColor: preset.color,
                            headerTextColor: preset.color.includes('255, 255, 255') ? '#000000' : '#FFFFFF',
                            headerNameColor: preset.color.includes('255, 255, 255') ? '#000000' : '#FFFFFF',
                            headerTitleColor: preset.color.includes('255, 255, 255') ? '#1E293B' : '#FFFFFF'
                          })}
                          className={`px-2.5 py-1 rounded-xl text-[11px] font-semibold border transition-all ${
                            frame.headerBgColor === preset.color
                              ? 'border-brand-400 bg-brand-500/10 text-white'
                              : 'border-slate-800 bg-slate-900 text-slate-400 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* TAB 4: CAPA & THUMBNAIL */}
          {activeTab === 'thumbnail' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Ponto do Vídeo para a Capa
                </span>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Posição no vídeo</span>
                  <span className="text-brand-400 font-mono font-bold">{config.thumbnailFramePercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={config.thumbnailFramePercent}
                  onChange={(e) => {
                    updateConfig({ thumbnailFramePercent: parseInt(e.target.value, 10), thumbnailUrl: undefined });
                    setPreviewMode('cover');
                  }}
                  className="w-full accent-brand-500 cursor-pointer"
                />
              </div>

              {/* External Cover Upload */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold uppercase tracking-wider">Capa Externa Personalizada</span>
                  {config.thumbnailUrl && (
                    <button
                      type="button"
                      onClick={() => updateConfig({ thumbnailUrl: undefined })}
                      className="text-[10px] text-rose-400 hover:underline"
                    >
                      Remover
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  id="cover-upload-input-frame"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      updateConfig({ thumbnailUrl: url });
                      setPreviewMode('cover');
                    }
                  }}
                />
                <label
                  htmlFor="cover-upload-input-frame"
                  className={`w-full py-2.5 px-3 rounded-xl border text-xs cursor-pointer flex items-center justify-center gap-2 transition-all ${
                    config.thumbnailUrl
                      ? 'bg-brand-600/20 border-brand-500 text-brand-300 font-semibold'
                      : 'bg-slate-900 hover:bg-slate-850 border-slate-700/80 text-slate-300'
                  }`}
                >
                  <ImageIcon className="w-4 h-4 text-brand-400" />
                  <span>{config.thumbnailUrl ? 'Trocar Imagem de Capa' : 'Fazer Upload de Capa (JPG/PNG)'}</span>
                </label>
              </div>

              {/* Cover Hook Text */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Texto de Impacto na Capa (Hook)
                </span>
                <input
                  type="text"
                  value={config.coverText}
                  onChange={(e) => updateConfig({ coverText: e.target.value })}
                  placeholder="Ex: NÃO FAÇA ISSO EM 2026! 🔥"
                  className="w-full bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>
          )}

          {/* TAB 5: ANTIDUPLICIDADE & ALGORITMO */}
          {activeTab === 'anti_duplicity' && (
            <div className="space-y-4 animate-fade-in">
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-200 block">
                      Proteção Anti-Repost / Algoritmo
                    </span>
                    <p className="text-[11px] text-slate-400">
                      Gera micro-cortes e variação de pixels para burlar filtros de spam
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.antiDuplicity}
                    onChange={(e) => updateConfig({ antiDuplicity: e.target.checked })}
                    className="rounded bg-slate-900 border-slate-700 text-emerald-500 focus:ring-0"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-300 block">
                  Filtro de Luz & Cor
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'none', label: 'Original' },
                    { id: 'vibrant', label: 'Vibrante ✨' },
                    { id: 'warm', label: 'Quente ☀️' },
                    { id: 'cinematic', label: 'Cinema 🎬' },
                    { id: 'contrast', label: 'Contraste ⚡' },
                    { id: 'anti_shadow', label: 'Anti-Sombra 💡' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => updateConfig({ filterPreset: f.id as any })}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-semibold border transition-all ${
                        config.filterPreset === f.id
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-sm'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-300 font-medium">Aceleração de Velocidade</span>
                  <span className="text-amber-400 font-mono font-bold">{config.speed}x</span>
                </div>
                <div className="flex gap-2">
                  {[1.0, 1.02, 1.05, 1.08, 1.10].map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => updateConfig({ speed: s })}
                      className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        config.speed === s
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Bottom Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-slate-400 hover:text-white border border-slate-800 hover:bg-slate-800 text-xs font-semibold transition-colors"
            >
              Resetar Padrão
            </button>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleApplyToAll}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-600 hover:from-purple-500 hover:to-brand-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-1.5 transition-all active:scale-[0.98]"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>⚡ Aplicar Arte & Encaixe a TODOS ({videoIndices.length} Vídeos)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 flex items-center justify-center gap-1.5 transition-all"
              >
                <Check className="w-4 h-4" />
                <span>Salvar e Fechar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
