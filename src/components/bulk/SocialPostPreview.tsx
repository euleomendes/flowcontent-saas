import React from 'react';
import { 
  Heart, 
  MessageCircle, 
  Send, 
  Bookmark, 
  MoreHorizontal, 
  ThumbsUp, 
  Repeat2, 
  Share, 
  Music2, 
  CheckCircle2, 
  Volume2,
  Sparkles
} from 'lucide-react';
import { SocialPlatform, MediaType } from '../../types';
import { useApp } from '../../context/AppContext';

interface SocialPostPreviewProps {
  platform: SocialPlatform;
  caption: string;
  mediaUrl?: string;
  mediaType?: MediaType;
}

export const SocialPostPreview: React.FC<SocialPostPreviewProps> = ({
  platform,
  caption,
  mediaUrl = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
  mediaType = 'image'
}) => {
  const { user } = useApp();

  const formattedCaption = caption || 'Escreva sua legenda no editor para pré-visualizar aqui em tempo real...';

  // INSTAGRAM MOCKUP
  if (platform === 'instagram') {
    return (
      <div className="w-full max-w-[320px] bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl text-white font-sans text-xs">
        {/* IG Header */}
        <div className="p-3 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full p-[1.5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover border border-slate-900"
              />
            </div>
            <div>
              <p className="font-semibold text-[11px] leading-tight">flowagencia</p>
              <p className="text-[9px] text-slate-400 leading-tight">Original audio</p>
            </div>
          </div>
          <MoreHorizontal className="w-4 h-4 text-slate-400" />
        </div>

        {/* IG Media */}
        <div className="relative aspect-square bg-slate-950 overflow-hidden">
          <img
            src={mediaUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
          {mediaType === 'video' && (
            <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/60 text-[9px] font-mono backdrop-blur-sm">
              REEL
            </div>
          )}
        </div>

        {/* IG Actions */}
        <div className="p-3 pb-1 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-4 h-4 hover:text-rose-500 cursor-pointer" />
            <MessageCircle className="w-4 h-4 hover:text-indigo-400 cursor-pointer" />
            <Send className="w-4 h-4 hover:text-cyan-400 cursor-pointer" />
          </div>
          <Bookmark className="w-4 h-4 hover:text-amber-400 cursor-pointer" />
        </div>

        {/* IG Likes & Caption */}
        <div className="px-3 pb-3">
          <p className="font-semibold text-[10px] mb-1">Curtido por criadores_br e outros</p>
          <div className="text-[11px] leading-snug line-clamp-4">
            <span className="font-semibold mr-1.5">flowagencia</span>
            <span className="text-slate-200 whitespace-pre-wrap">{formattedCaption}</span>
          </div>
          <p className="text-[9px] text-slate-400 uppercase tracking-wider mt-2">HÁ 2 MINUTOS</p>
        </div>
      </div>
    );
  }

  // LINKEDIN MOCKUP
  if (platform === 'linkedin') {
    return (
      <div className="w-full max-w-[320px] bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl text-white font-sans text-xs">
        {/* LI Header */}
        <div className="p-3 border-b border-slate-800">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <img
                src={user.avatar}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-700"
              />
              <div>
                <p className="font-bold text-[11px] leading-tight flex items-center gap-1">
                  {user.name}
                  <span className="text-[9px] text-slate-400">• 1º</span>
                </p>
                <p className="text-[9px] text-slate-400 line-clamp-1">{user.role}</p>
                <p className="text-[9px] text-slate-400">Agora • 🌐</p>
              </div>
            </div>
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* LI Caption */}
        <div className="p-3 text-[11px] leading-relaxed text-slate-200 line-clamp-4 whitespace-pre-wrap">
          {formattedCaption}
        </div>

        {/* LI Media */}
        <div className="relative aspect-[4/3] bg-slate-950 overflow-hidden border-y border-slate-800">
          <img
            src={mediaUrl}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>

        {/* LI Social Counters */}
        <div className="px-3 py-1.5 flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800/60">
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center text-[9px] text-white">👍</span>
            <span className="w-4 h-4 rounded-full bg-emerald-600 flex items-center justify-center text-[9px] text-white">👏</span>
            <span className="ml-1">42</span>
          </div>
          <span>6 comentários</span>
        </div>

        {/* LI Action Buttons */}
        <div className="p-2 grid grid-cols-3 text-[10px] text-slate-300 text-center font-medium">
          <span className="py-1 hover:bg-slate-800 rounded flex items-center justify-center gap-1 cursor-pointer">
            <ThumbsUp className="w-3.5 h-3.5" /> Gostei
          </span>
          <span className="py-1 hover:bg-slate-800 rounded flex items-center justify-center gap-1 cursor-pointer">
            <MessageCircle className="w-3.5 h-3.5" /> Comentar
          </span>
          <span className="py-1 hover:bg-slate-800 rounded flex items-center justify-center gap-1 cursor-pointer">
            <Repeat2 className="w-3.5 h-3.5" /> Compartilhar
          </span>
        </div>
      </div>
    );
  }

  // TIKTOK MOCKUP
  if (platform === 'tiktok') {
    return (
      <div className="w-full max-w-[280px] bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white font-sans text-xs relative aspect-[9/16]">
        {/* Background Image / Video */}
        <img
          src={mediaUrl}
          alt="Preview"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80" />

        {/* Top TikTok Bar */}
        <div className="absolute top-3 inset-x-0 px-4 flex items-center justify-center gap-4 text-xs font-semibold text-slate-300">
          <span>Seguindo</span>
          <span className="text-white border-b-2 border-white pb-0.5">Para Você</span>
        </div>

        {/* Right Floating Actions */}
        <div className="absolute right-3 bottom-14 flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border border-white overflow-hidden p-0.5">
            <img src={user.avatar} className="w-full h-full object-cover rounded-full" alt="avatar" />
          </div>
          <div className="flex flex-col items-center">
            <Heart className="w-6 h-6 text-white drop-shadow" />
            <span className="text-[9px] font-bold mt-0.5">14.2K</span>
          </div>
          <div className="flex flex-col items-center">
            <MessageCircle className="w-6 h-6 text-white drop-shadow" />
            <span className="text-[9px] font-bold mt-0.5">384</span>
          </div>
          <div className="flex flex-col items-center">
            <Bookmark className="w-6 h-6 text-white drop-shadow" />
            <span className="text-[9px] font-bold mt-0.5">1.1K</span>
          </div>
          <div className="flex flex-col items-center">
            <Share className="w-6 h-6 text-white drop-shadow" />
            <span className="text-[9px] font-bold mt-0.5">420</span>
          </div>
        </div>

        {/* Bottom Details */}
        <div className="absolute bottom-3 left-3 right-14 text-white">
          <p className="font-bold text-[11px] mb-1">@flowtrends</p>
          <p className="text-[10px] text-slate-200 line-clamp-2 mb-1.5 leading-snug">
            {formattedCaption}
          </p>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-300 font-medium">
            <Music2 className="w-3 h-3 animate-spin" />
            <span className="truncate">Som original - Flow Trends Hub</span>
          </div>
        </div>
      </div>
    );
  }

  // X / TWITTER MOCKUP (Default fallback)
  return (
    <div className="w-full max-w-[320px] bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl text-white font-sans text-xs p-3.5">
      <div className="flex gap-2.5">
        <img
          src={user.avatar}
          alt="Profile"
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1 truncate">
              <span className="font-bold text-[11px] text-white truncate">{user.name}</span>
              <CheckCircle2 className="w-3 h-3 text-sky-400 shrink-0" />
              <span className="text-[10px] text-slate-400 truncate">@flowcontent</span>
            </div>
            <span className="text-[10px] text-slate-400">1m</span>
          </div>

          <p className="text-[11px] text-slate-200 leading-relaxed mb-2 whitespace-pre-wrap line-clamp-4">
            {formattedCaption}
          </p>

          {/* Media box */}
          <div className="rounded-xl overflow-hidden border border-slate-800 aspect-[16/9] mb-2 bg-slate-950">
            <img
              src={mediaUrl}
              alt="Media preview"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Tweet counters */}
          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
              <MessageCircle className="w-3 h-3" /> 18
            </span>
            <span className="flex items-center gap-1 hover:text-emerald-400 cursor-pointer">
              <Repeat2 className="w-3 h-3" /> 6
            </span>
            <span className="flex items-center gap-1 hover:text-rose-400 cursor-pointer">
              <Heart className="w-3 h-3" /> 94
            </span>
            <span className="flex items-center gap-1 hover:text-sky-400 cursor-pointer">
              <Bookmark className="w-3 h-3" /> 12
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
