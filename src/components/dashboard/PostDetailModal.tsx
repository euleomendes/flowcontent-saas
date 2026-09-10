import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Save, 
  Calendar, 
  Clock, 
  CheckCircle2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import type { PostItem, SocialPlatform, PostStatus } from '../../types';
import { PLATFORM_INFO, STATUS_INFO } from '../../utils/helpers';
import { SocialPostPreview } from '../bulk/SocialPostPreview';

export const PostDetailModal: React.FC = () => {
  const { selectedPostForDetail, setSelectedPostForDetail, updatePost, deletePost } = useApp();

  if (!selectedPostForDetail) return null;

  const [caption, setCaption] = useState(selectedPostForDetail.caption);
  const [scheduledDate, setScheduledDate] = useState(selectedPostForDetail.scheduledDate);
  const [scheduledTime, setScheduledTime] = useState(selectedPostForDetail.scheduledTime);
  const [platforms, setPlatforms] = useState<SocialPlatform[]>(selectedPostForDetail.platforms);
  const [status, setStatus] = useState<PostStatus>(selectedPostForDetail.status);
  const [previewPlatform, setPreviewPlatform] = useState<SocialPlatform>(
    selectedPostForDetail.platforms[0] || 'instagram'
  );

  const togglePlatform = (p: SocialPlatform) => {
    if (platforms.includes(p)) {
      if (platforms.length === 1) return; // Keep at least one
      setPlatforms(platforms.filter(item => item !== p));
    } else {
      setPlatforms([...platforms, p]);
    }
  };

  const handleSave = () => {
    const updated: PostItem = {
      ...selectedPostForDetail,
      caption,
      scheduledDate,
      scheduledTime,
      platforms,
      status,
    };
    updatePost(updated);
    setSelectedPostForDetail(null);
  };

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja remover esta postagem da fila?')) {
      deletePost(selectedPostForDetail.id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${STATUS_INFO[status].dot}`} />
            <h2 className="text-sm font-bold text-white">
              Detalhes da Publicação Agendada
            </h2>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
              {selectedPostForDetail.id}
            </span>
          </div>

          <button
            onClick={() => setSelectedPostForDetail(null)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
          {/* Left Column: Form & Edit (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Caption Textarea */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex justify-between">
                <span>Legenda / Texto do Post</span>
                <span className="text-[11px] text-slate-400 font-mono">
                  {caption.length} caracteres
                </span>
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                rows={5}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-brand-500 transition-colors leading-relaxed resize-none"
              />
            </div>

            {/* Date & Time Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-brand-400" />
                  <span>Data de Disparo</span>
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  <span>Horário</span>
                </label>
                <input
                  type="time"
                  step="60"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-brand-300 font-mono font-bold focus:outline-none focus:border-brand-500"
                />
              </div>
            </div>

            {/* Platforms Multi-select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Canais de Destino
              </label>
              <div className="flex flex-wrap gap-2">
                {(['instagram', 'linkedin', 'tiktok', 'twitter', 'facebook'] as SocialPlatform[]).map((p) => {
                  const isSelected = platforms.includes(p);
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => togglePlatform(p)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-all ${
                        isSelected
                          ? `${PLATFORM_INFO[p].badgeBg} ${PLATFORM_INFO[p].badgeText} ${PLATFORM_INFO[p].borderColor}`
                          : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:text-slate-300'
                      }`}
                    >
                      <span>{PLATFORM_INFO[p].name}</span>
                      {isSelected && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Status Select */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Status na Fila
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as PostStatus)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="scheduled">Agendado (Na Fila)</option>
                <option value="draft">Rascunho</option>
                <option value="published">Publicado</option>
                <option value="failed">Falha de Envio</option>
              </select>
            </div>

            {/* Media details badge */}
            {selectedPostForDetail.mediaUrls.length > 0 && (
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>Arquivo anexado: {selectedPostForDetail.mediaFileName || 'media_asset.jpg'}</span>
                <span>{selectedPostForDetail.mediaFileSize || '2.0 MB'}</span>
              </div>
            )}
          </div>

          {/* Right Column: Live Social Preview (5 cols) */}
          <div className="lg:col-span-5 bg-slate-950/70 p-4 rounded-2xl border border-slate-800 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-300">Simulador de Feed</span>
              <div className="flex gap-1">
                {platforms.map(p => (
                  <button
                    key={p}
                    onClick={() => setPreviewPlatform(p)}
                    className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                      previewPlatform === p
                        ? 'bg-brand-500 text-white'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {PLATFORM_INFO[p].name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Live mockup container */}
            <div className="w-full max-w-sm flex items-center justify-center">
              <SocialPostPreview
                platform={previewPlatform}
                caption={caption}
                mediaUrl={selectedPostForDetail.mediaUrls[0] || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'}
                mediaType={selectedPostForDetail.mediaType}
              />
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between">
          <button
            onClick={handleDelete}
            className="px-3.5 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Excluir da Fila</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedPostForDetail(null)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold shadow-md shadow-brand-600/30 flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Salvar Alterações</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
