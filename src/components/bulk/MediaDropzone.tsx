import React, { useRef } from 'react';
import { 
  UploadCloud, 
  Sparkles, 
  Image as ImageIcon, 
  Film, 
  Trash2, 
  FileSpreadsheet,
  CheckCircle2,
  FolderUp
} from 'lucide-react';
import { BULK_DEMO_TEMPLATES } from '../../data/mockData';
import { PostItem, SocialPlatform } from '../../types';
import { generateId } from '../../utils/helpers';
import { getTodayISODate } from '../../utils/dateUtils';

interface MediaDropzoneProps {
  items: Partial<PostItem>[];
  onAddItems: (newItems: Partial<PostItem>[]) => void;
  onClearAll: () => void;
}

export const MediaDropzone: React.FC<MediaDropzoneProps> = ({
  items,
  onAddItems,
  onClearAll
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newPosts: Partial<PostItem>[] = [];
    const today = getTodayISODate();

    Array.from(files).forEach((file, index) => {
      const isVideo = file.type.startsWith('video');
      const blobUrl = URL.createObjectURL(file);
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1) + ' MB';
      
      // Clean filename for auto-caption draft
      const baseName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      const autoCaption = `${baseName.charAt(0).toUpperCase() + baseName.slice(1)}. Confira o novo conteúdo da semana! 🔥 #SocialMedia #Novidades`;

      newPosts.push({
        id: generateId('draft'),
        caption: autoCaption,
        mediaUrls: [blobUrl],
        mediaType: isVideo ? 'video' : 'image',
        platforms: ['instagram', 'linkedin'] as SocialPlatform[],
        scheduledDate: today,
        scheduledTime: '18:00',
        status: 'scheduled',
        createdAt: new Date().toISOString(),
        mediaFileName: file.name,
        mediaFileSize: sizeMB,
        tags: ['Lote', 'Upload']
      });
    });

    onAddItems(newPosts);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const loadDemoTemplates = () => {
    const today = getTodayISODate();
    const demoItems: Partial<PostItem>[] = BULK_DEMO_TEMPLATES.map((tmpl, idx) => ({
      id: generateId(`demo-${idx}`),
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
      tags: ['Demo', 'Curadoria']
    }));

    onAddItems(demoItems);
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 mb-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FolderUp className="w-4 h-4 text-brand-400" />
            <span>1. Ingestão de Mídias em Lote</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Selecione múltiplos arquivos (imagens e vídeos) do seu dispositivo ou carregue o lote de teste
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={loadDemoTemplates}
            className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-300" />
            <span>Carregar Lote Demo (5 posts)</span>
          </button>

          {items.length > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="px-3 py-1.5 rounded-xl text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpar Lote</span>
            </button>
          )}
        </div>
      </div>

      {/* Drop Area */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-700/80 hover:border-brand-500/80 bg-slate-950/50 hover:bg-slate-950/80 rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 group"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />

        <div className="w-12 h-12 rounded-2xl bg-brand-500/10 text-brand-400 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 group-hover:bg-brand-500/20 transition-all">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-xs sm:text-sm font-semibold text-slate-200 mb-1">
          Arraste e solte fotos e vídeos aqui, ou <span className="text-brand-400 underline">clique para selecionar múltiplos</span>
        </p>
        <p className="text-[11px] text-slate-400">
          Suporta JPG, PNG, WEBP, MP4, MOV (até 100 MB por arquivo). Agendamento simultâneo ilimitado.
        </p>
      </div>

      {/* Status banner when items loaded */}
      {items.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-brand-500/10 border border-brand-500/30 flex items-center justify-between text-xs text-brand-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold">{items.length} itens preparados no lote atual.</span>
          </div>
          <span className="text-[11px] text-slate-400">Pronto para configurar intervalos abaixo</span>
        </div>
      )}
    </div>
  );
};
