import React, { useState } from 'react';
import { 
  Sparkles, 
  Layers, 
  Send, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  ArrowRight,
  Eye,
  SlidersHorizontal,
  Film
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PostItem, StaggerScheduleConfig, SocialPlatform, VideoEditConfig } from '../../types';
import { MediaDropzone } from './MediaDropzone';
import { AutoScheduleBar } from './AutoScheduleBar';
import { BulkTable } from './BulkTable';
import { SocialPostPreview } from './SocialPostPreview';
import { BulkVideoEditor } from './BulkVideoEditor';
import { calculateStaggeredSchedule, formatDisplayDate } from '../../utils/dateUtils';
import { BULK_DEMO_TEMPLATES } from '../../data/mockData';
import { generateId, PLATFORM_INFO } from '../../utils/helpers';
import { getTodayISODate } from '../../utils/dateUtils';

export const BulkScheduler: React.FC = () => {
  const { addBulkPosts, showToast } = useApp();

  // Draft batch state
  const [draftItems, setDraftItems] = useState<Partial<PostItem>[]>(() => {
    // Start with demo batch for instant delight
    const today = getTodayISODate();
    return BULK_DEMO_TEMPLATES.map((tmpl, idx) => ({
      id: generateId(`draft-${idx}`),
      caption: tmpl.caption,
      mediaUrls: [tmpl.imageUrl],
      mediaType: 'image',
      platforms: [...tmpl.platforms],
      scheduledDate: today,
      scheduledTime: '18:00',
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      mediaFileName: tmpl.name,
      mediaFileSize: tmpl.size,
      tags: ['Lote', 'Growth']
    }));
  });

  // Modal / drawer preview state
  const [previewingItem, setPreviewingItem] = useState<Partial<PostItem> | null>(null);
  const [activePreviewPlatform, setActivePreviewPlatform] = useState<SocialPlatform>('instagram');

  // Video Editor open state
  const [isVideoEditorOpen, setIsVideoEditorOpen] = useState(false);

  // Add items from dropzone
  const handleAddItems = (newItems: Partial<PostItem>[]) => {
    setDraftItems(prev => [...prev, ...newItems]);
    showToast(`${newItems.length} mídias adicionadas ao lote de agendamento!`, 'info');
  };

  // Apply global video config to all batch items
  const handleApplyGlobalVideoConfig = (videoConfig: VideoEditConfig) => {
    setDraftItems(prev => prev.map(item => ({
      ...item,
      videoConfig: { ...videoConfig }
    })));
  };

  // Clear all
  const handleClearAll = () => {
    setDraftItems([]);
  };

  // Update item in table
  const handleUpdateItem = (index: number, updated: Partial<PostItem>) => {
    setDraftItems(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], ...updated };
      return copy;
    });
  };

  // Delete item from table
  const handleDeleteItem = (index: number) => {
    setDraftItems(prev => prev.filter((_, i) => i !== index));
  };

  // Apply auto-stagger rule across all items
  const handleApplySchedule = (config: StaggerScheduleConfig) => {
    if (draftItems.length === 0) return;

    const scheduledTimes = calculateStaggeredSchedule(draftItems.length, config);

    setDraftItems(prev => {
      return prev.map((item, idx) => {
        const schedule = scheduledTimes[idx];
        let newCaption = item.caption || '';
        if (config.appendHashtags && !newCaption.includes(config.appendHashtags)) {
          newCaption = `${newCaption.trim()} ${config.appendHashtags}`.trim();
        }

        return {
          ...item,
          scheduledDate: schedule.scheduledDate,
          scheduledTime: schedule.scheduledTime,
          platforms: config.selectedPlatforms.length > 0 ? [...config.selectedPlatforms] : (item.platforms || ['instagram']),
          caption: newCaption
        };
      });
    });

    showToast(`Intervalos calculados com sucesso para todos os ${draftItems.length} itens!`, 'success');
  };

  // Confirm and push to calendar
  const handleConfirmBulkSchedule = () => {
    if (draftItems.length === 0) {
      showToast('Adicione ao menos 1 item para agendar.', 'error');
      return;
    }

    // Validate
    const finalizedPosts: PostItem[] = draftItems.map((item, idx) => ({
      id: item.id || generateId(`post-${idx}`),
      caption: item.caption || 'Sem legenda',
      mediaUrls: item.mediaUrls && item.mediaUrls.length > 0 
        ? item.mediaUrls 
        : ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'],
      mediaType: item.mediaType || 'image',
      platforms: item.platforms && item.platforms.length > 0 ? item.platforms : ['instagram'],
      scheduledDate: item.scheduledDate || getTodayISODate(),
      scheduledTime: item.scheduledTime || '18:00',
      status: 'scheduled',
      createdAt: item.createdAt || new Date().toISOString(),
      mediaFileName: item.mediaFileName || `asset_${idx + 1}.jpg`,
      mediaFileSize: item.mediaFileSize || '2.0 MB',
      tags: item.tags || ['AgendamentoEmLote'],
      videoConfig: item.videoConfig
    }));

    addBulkPosts(finalizedPosts);
  };

  // Compute date range
  const sortedDates = [...draftItems]
    .map(i => i.scheduledDate || '')
    .filter(Boolean)
    .sort();
  const firstDate = sortedDates[0];
  const lastDate = sortedDates[sortedDates.length - 1];

  return (
    <div className="pb-24 animate-fade-in">
      {/* Intro Header */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-brand-500/10 text-brand-400 border border-brand-500/20">
              <Layers className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-black text-white tracking-tight">
              Agendamento em Lote (Bulk Scheduler)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Faça upload múltiplo, distribua as datas de disparo com nossa IA de Staggering e envie tudo para o calendário de uma vez.
          </p>
        </div>

        {/* Top View Mode Tabs */}
        {draftItems.length > 0 && (
          <div className="flex items-center bg-slate-900 p-1 rounded-2xl border border-slate-800 shadow-sm">
            <button
              type="button"
              onClick={() => setIsVideoEditorOpen(false)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                !isVideoEditorOpen
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. Fila de Agendamento</span>
            </button>

            <button
              type="button"
              onClick={() => setIsVideoEditorOpen(true)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isVideoEditorOpen
                  ? 'bg-gradient-to-r from-rose-600 to-brand-600 text-white shadow-sm'
                  : 'text-rose-300 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5 text-rose-300" />
              <span>2. Edição de Vídeos (Reels/TikTok)</span>
              <span className="text-[10px] bg-rose-500/30 px-1.5 py-0.2 rounded-full font-mono">
                {draftItems.length}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Bulk Video Editor (When open) */}
      {isVideoEditorOpen && draftItems.length > 0 && (
        <BulkVideoEditor
          items={draftItems}
          onUpdateItem={handleUpdateItem}
          onApplyGlobalConfig={handleApplyGlobalVideoConfig}
          onClose={() => setIsVideoEditorOpen(false)}
        />
      )}

      {/* Step 1: Media Dropzone */}
      <MediaDropzone
        items={draftItems}
        onAddItems={handleAddItems}
        onClearAll={handleClearAll}
      />

      {/* Step 2: Auto Schedule Bar */}
      {draftItems.length > 0 && (
        <AutoScheduleBar
          itemCount={draftItems.length}
          onApplySchedule={handleApplySchedule}
        />
      )}

      {/* Step 3: Interactive Table */}
      <BulkTable
        items={draftItems}
        onUpdateItem={handleUpdateItem}
        onDeleteItem={handleDeleteItem}
        onEditVideo={() => setIsVideoEditorOpen(true)}
        onPreviewItem={(item) => {
          setPreviewingItem(item);
          if (item.platforms && item.platforms.length > 0) {
            setActivePreviewPlatform(item.platforms[0]);
          }
        }}
      />

      {/* Sticky Bottom Confirmation Bar */}
      {draftItems.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 md:left-64 z-30 bg-slate-900/95 border-t border-slate-800/90 backdrop-blur-lg p-4 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Summary info */}
            <div className="flex items-center gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-bold text-white text-sm">{draftItems.length} postagens</span>
                <span className="text-slate-400">prontas no lote</span>
              </div>

              {firstDate && lastDate && (
                <div className="hidden sm:flex items-center gap-1.5 text-slate-400 text-xs border-l border-slate-800 pl-4">
                  <Calendar className="w-3.5 h-3.5 text-brand-400" />
                  <span>Distribuição: {formatDisplayDate(firstDate)} até {formatDisplayDate(lastDate)}</span>
                </div>
              )}
            </div>

            {/* CTA button */}
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleConfirmBulkSchedule}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-brand-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Confirmar Agendamento em Lote ({draftItems.length} posts)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal */}
      {previewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden p-6 flex flex-col items-center">
            <button
              onClick={() => setPreviewingItem(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Eye className="w-4 h-4 text-brand-400" />
              <span>Mockup da Postagem</span>
            </h3>

            {/* Platform Selector Tabs in Preview */}
            <div className="flex gap-1.5 mb-4">
              {(previewingItem.platforms || ['instagram', 'linkedin', 'tiktok', 'twitter']).map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePreviewPlatform(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                    activePreviewPlatform === p
                      ? 'bg-brand-600 text-white shadow'
                      : 'bg-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {PLATFORM_INFO[p].name}
                </button>
              ))}
            </div>

            {/* Mockup Card */}
            <SocialPostPreview
              platform={activePreviewPlatform}
              caption={previewingItem.caption || ''}
              mediaUrl={previewingItem.mediaUrls ? previewingItem.mediaUrls[0] : undefined}
              mediaType={previewingItem.mediaType}
            />

            <button
              onClick={() => setPreviewingItem(null)}
              className="mt-5 w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
            >
              Fechar Pré-visualização
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
