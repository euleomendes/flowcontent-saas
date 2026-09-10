import React from 'react';
import { 
  Trash2, 
  Eye, 
  Calendar, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Share2,
  Table as TableIcon,
  HelpCircle,
  Film
} from 'lucide-react';
import { PostItem, SocialPlatform } from '../../types';
import { PLATFORM_INFO } from '../../utils/helpers';
import { formatDisplayDate } from '../../utils/dateUtils';

interface BulkTableProps {
  items: Partial<PostItem>[];
  onUpdateItem: (index: number, updated: Partial<PostItem>) => void;
  onDeleteItem: (index: number) => void;
  onPreviewItem: (item: Partial<PostItem>) => void;
  onEditVideo?: (index: number) => void;
}

export const BulkTable: React.FC<BulkTableProps> = ({
  items,
  onUpdateItem,
  onDeleteItem,
  onPreviewItem,
  onEditVideo
}) => {
  if (items.length === 0) {
    return (
      <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-dashed border-slate-800 text-slate-400">
        <TableIcon className="w-10 h-10 mx-auto text-slate-600 mb-3" />
        <p className="text-sm font-semibold text-slate-300 mb-1">Nenhum item adicionado ao lote ainda</p>
        <p className="text-xs text-slate-400">
          Faça upload de arquivos acima ou clique em "Carregar Lote Demo" para começar.
        </p>
      </div>
    );
  }

  const toggleItemPlatform = (index: number, currentPlatforms: SocialPlatform[], targetPlatform: SocialPlatform) => {
    let nextPlatforms: SocialPlatform[];
    if (currentPlatforms.includes(targetPlatform)) {
      if (currentPlatforms.length === 1) return; // don't remove last one
      nextPlatforms = currentPlatforms.filter(p => p !== targetPlatform);
    } else {
      nextPlatforms = [...currentPlatforms, targetPlatform];
    }
    onUpdateItem(index, { platforms: nextPlatforms });
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <TableIcon className="w-4 h-4 text-brand-400" />
            <span>3. Revisão e Customização Individual do Lote ({items.length} posts)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Você pode personalizar legendas, canais e horários individualmente antes de disparar para o calendário
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
            <tr>
              <th className="py-3 px-4 w-12 text-center">#</th>
              <th className="py-3 px-4 w-20">Mídia</th>
              <th className="py-3 px-4 min-w-[280px]">Legenda / Copy</th>
              <th className="py-3 px-4 min-w-[180px]">Canais Sociais</th>
              <th className="py-3 px-4 min-w-[200px]">Data & Horário</th>
              <th className="py-3 px-4 text-right w-28">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {items.map((item, index) => {
              const platforms = item.platforms || ['instagram'];
              return (
                <tr key={item.id || index} className="hover:bg-slate-800/20 transition-colors">
                  {/* Row Number */}
                  <td className="py-3 px-4 text-center font-mono text-slate-400 font-bold">
                    {index + 1}
                  </td>

                  {/* Media Thumbnail */}
                  <td className="py-3 px-4">
                    <div 
                      onClick={() => onPreviewItem(item)}
                      className="w-14 h-14 rounded-xl bg-slate-950 overflow-hidden border border-slate-700/60 relative cursor-pointer group shrink-0"
                    >
                      {item.mediaUrls && item.mediaUrls[0] ? (
                        <img
                          src={item.mediaUrls[0]}
                          alt="preview"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">
                          Mídia
                        </div>
                      )}
                      {item.videoConfig && item.videoConfig.zoom > 100 && (
                        <div className="absolute top-1 left-1 bg-rose-600/90 text-white text-[8px] font-bold px-1 rounded">
                          {item.videoConfig.zoom}%
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  </td>

                  {/* Caption Editor */}
                  <td className="py-3 px-4">
                    <div className="relative">
                      <textarea
                        value={item.caption || ''}
                        onChange={(e) => onUpdateItem(index, { caption: e.target.value })}
                        rows={2}
                        placeholder="Insira a legenda para este post..."
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 transition-colors resize-none leading-relaxed"
                      />
                      <span className="text-[10px] text-slate-400 font-mono block text-right mt-0.5">
                        {(item.caption || '').length} caracteres
                      </span>
                    </div>
                  </td>

                  {/* Platform Selector */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {(['instagram', 'linkedin', 'tiktok', 'twitter'] as SocialPlatform[]).map((p) => {
                        const isSelected = platforms.includes(p);
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => toggleItemPlatform(index, platforms, p)}
                            className={`px-2 py-1 rounded text-[10px] font-semibold border transition-all ${
                              isSelected
                                ? `${PLATFORM_INFO[p].badgeBg} ${PLATFORM_INFO[p].badgeText} ${PLATFORM_INFO[p].borderColor}`
                                : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-300'
                            }`}
                          >
                            {PLATFORM_INFO[p].name.substring(0, 2)}
                          </button>
                        );
                      })}
                    </div>
                  </td>

                  {/* Date & Time Picker */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                        <input
                          type="date"
                          value={item.scheduledDate || ''}
                          onChange={(e) => onUpdateItem(index, { scheduledDate: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                        <input
                          type="time"
                          step="60"
                          value={item.scheduledTime || '18:14'}
                          onChange={(e) => onUpdateItem(index, { scheduledTime: e.target.value })}
                          className="bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-brand-300 font-mono font-bold focus:outline-none focus:border-brand-500"
                        />
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1.5">
                      {onEditVideo && (
                        <button
                          type="button"
                          onClick={() => onEditVideo(index)}
                          title="Ajustar Capa, Zoom e Antiduplicidade deste vídeo"
                          className="px-2 py-1 rounded-lg text-[11px] font-semibold bg-rose-500/10 text-rose-300 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-1 transition-colors"
                        >
                          <Film className="w-3 h-3" />
                          <span>Editar Vídeo</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onPreviewItem(item)}
                        title="Ver Mockup da Rede"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-brand-400 hover:bg-slate-800 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteItem(index)}
                        title="Remover deste lote"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
