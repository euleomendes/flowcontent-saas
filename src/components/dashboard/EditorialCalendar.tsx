import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  ListFilter, 
  Clock, 
  Plus, 
  CheckCircle2, 
  ExternalLink,
  Layers,
  Filter,
  Grid,
  CalendarDays,
  LayoutList
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PostItem, SocialPlatform, PostStatus } from '../../types';
import { 
  MONTH_NAMES_PT, 
  WEEKDAYS_PT, 
  getCalendarGrid, 
  formatDateToISO, 
  getTodayISODate,
  formatDisplayDate
} from '../../utils/dateUtils';
import { PLATFORM_INFO, STATUS_INFO } from '../../utils/helpers';

type CalendarViewMode = 'month' | 'week' | 'list';

interface EditorialCalendarProps {
  searchQuery?: string;
}

export const EditorialCalendar: React.FC<EditorialCalendarProps> = ({ searchQuery = '' }) => {
  const { posts, setSelectedPostForDetail, setActiveTab, deletePost } = useApp();

  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-11
  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Month navigation
  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(prev => prev - 1);
    } else {
      setCurrentMonth(prev => prev - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(prev => prev + 1);
    } else {
      setCurrentMonth(prev => prev + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth());
  };

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      // Platform filter
      if (platformFilter !== 'all' && !post.platforms.includes(platformFilter as SocialPlatform)) {
        return false;
      }
      // Status filter
      if (statusFilter !== 'all' && post.status !== statusFilter) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesCaption = post.caption.toLowerCase().includes(q);
        const matchesTag = post.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesCaption && !matchesTag) return false;
      }
      return true;
    });
  }, [posts, platformFilter, statusFilter, searchQuery]);

  // Group posts by date ISO: { "2026-10-14": [PostItem, ...] }
  const postsByDate = useMemo(() => {
    const map: Record<string, PostItem[]> = {};
    filteredPosts.forEach(post => {
      if (!map[post.scheduledDate]) {
        map[post.scheduledDate] = [];
      }
      map[post.scheduledDate].push(post);
    });
    // Sort posts in each date by time
    Object.keys(map).forEach(date => {
      map[date].sort((a, b) => a.scheduledTime.localeCompare(b.scheduledTime));
    });
    return map;
  }, [filteredPosts]);

  // Calendar cells for month view
  const calendarCells = useMemo(() => {
    return getCalendarGrid(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Week view dates (current week surrounding today or selected month)
  const currentWeekDays = useMemo(() => {
    const curr = new Date(currentYear, currentMonth, today.getDate());
    const dayOfWeek = curr.getDay(); // 0 is Sunday
    const weekStart = new Date(curr);
    weekStart.setDate(curr.getDate() - dayOfWeek);

    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      const iso = formatDateToISO(d);
      days.push({
        date: d,
        isoDate: iso,
        isToday: iso === getTodayISODate()
      });
    }
    return days;
  }, [currentYear, currentMonth]);

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-md">
      {/* Calendar Header Control Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Navigation & Date Title */}
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700/60">
            <button
              onClick={prevMonth}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Mês Anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={goToToday}
              className="px-2.5 py-1 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
            >
              Hoje
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Próximo Mês"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <h2 className="text-base font-bold text-white tracking-tight">
            {MONTH_NAMES_PT[currentMonth]} <span className="text-brand-400 font-normal">{currentYear}</span>
          </h2>
        </div>

        {/* Right: View Mode & Filters */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Platform Filter */}
          <select
            value={platformFilter}
            onChange={(e) => setPlatformFilter(e.target.value)}
            className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">Todas as Redes</option>
            <option value="instagram">Instagram</option>
            <option value="linkedin">LinkedIn</option>
            <option value="tiktok">TikTok</option>
            <option value="twitter">X (Twitter)</option>
            <option value="facebook">Facebook</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-800/80 border border-slate-700/60 rounded-xl px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
          >
            <option value="all">Todos os Status</option>
            <option value="scheduled">Agendados</option>
            <option value="published">Publicados</option>
            <option value="draft">Rascunhos</option>
          </select>

          {/* View Switcher: Month / Week / List */}
          <div className="flex items-center bg-slate-800/80 rounded-xl p-1 border border-slate-700/60">
            <button
              onClick={() => setViewMode('month')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'month'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Visão Mensal"
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Mês</span>
            </button>

            <button
              onClick={() => setViewMode('week')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'week'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Visão Semanal"
            >
              <Grid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Semana</span>
            </button>

            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Visão Lista / Fila"
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Fila</span>
            </button>
          </div>
        </div>
      </div>

      {/* MONTH VIEW */}
      {viewMode === 'month' && (
        <div>
          {/* Weekday headers */}
          <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-900/90 text-center py-2.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {WEEKDAYS_PT.map((day, idx) => (
              <div key={idx} className={idx === 0 || idx === 6 ? 'text-slate-500' : ''}>
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-800/70 border-b border-slate-800">
            {calendarCells.map((cell, idx) => {
              const dayPosts = postsByDate[cell.isoDate] || [];
              const dayNum = cell.date.getDate();

              return (
                <div
                  key={idx}
                  className={`min-h-[115px] p-2 flex flex-col justify-between transition-colors ${
                    cell.isCurrentMonth ? 'bg-slate-950/40 hover:bg-slate-800/30' : 'bg-slate-950/90 opacity-40'
                  }`}
                >
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className={`text-xs font-semibold w-6 h-6 rounded-full flex items-center justify-center ${
                        cell.isToday
                          ? 'bg-brand-500 text-white font-bold shadow-md shadow-brand-500/40'
                          : 'text-slate-400'
                      }`}
                    >
                      {dayNum}
                    </span>

                    {dayPosts.length > 0 && (
                      <span className="text-[10px] text-slate-400 font-mono">
                        {dayPosts.length} {dayPosts.length === 1 ? 'post' : 'posts'}
                      </span>
                    )}
                  </div>

                  {/* Posts inside day */}
                  <div className="space-y-1 overflow-y-auto max-h-[85px]">
                    {dayPosts.slice(0, 2).map((post) => {
                      const primaryPlatform = post.platforms[0] || 'instagram';
                      return (
                        <div
                          key={post.id}
                          onClick={() => setSelectedPostForDetail(post)}
                          className={`p-1.5 rounded-lg border text-[10px] cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all truncate flex items-center gap-1.5 shadow-sm ${
                            PLATFORM_INFO[primaryPlatform]?.badgeBg || 'bg-slate-800'
                          } ${PLATFORM_INFO[primaryPlatform]?.borderColor || 'border-slate-700'}`}
                        >
                          <span className="font-bold text-slate-300 font-mono">
                            {post.scheduledTime}
                          </span>
                          <span className={`font-semibold ${PLATFORM_INFO[primaryPlatform]?.badgeText || 'text-white'}`}>
                            {PLATFORM_INFO[primaryPlatform]?.name.substring(0, 2)}
                          </span>
                          <span className="text-slate-300 truncate">
                            {post.caption}
                          </span>
                        </div>
                      );
                    })}

                    {dayPosts.length > 2 && (
                      <div 
                        onClick={() => setSelectedPostForDetail(dayPosts[2])}
                        className="text-[10px] text-brand-400 font-semibold text-center cursor-pointer hover:underline py-0.5"
                      >
                        +{dayPosts.length - 2} mais no dia
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WEEK VIEW */}
      {viewMode === 'week' && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
            {currentWeekDays.map((day, idx) => {
              const dayPosts = postsByDate[day.isoDate] || [];
              return (
                <div
                  key={idx}
                  className={`rounded-xl border p-3 min-h-[300px] flex flex-col ${
                    day.isToday
                      ? 'bg-slate-900 border-brand-500/50 shadow-lg shadow-brand-500/10'
                      : 'bg-slate-950/60 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400">{WEEKDAYS_PT[day.date.getDay()]}</p>
                      <p className="text-xs font-bold text-white">{day.date.getDate()} de {MONTH_NAMES_PT[day.date.getMonth()]}</p>
                    </div>
                    {day.isToday && (
                      <span className="text-[9px] font-bold bg-brand-500 text-white px-1.5 py-0.5 rounded">Hoje</span>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 overflow-y-auto">
                    {dayPosts.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-[11px] text-slate-400 text-center py-8">
                        Vazio
                      </div>
                    ) : (
                      dayPosts.map((post) => (
                        <div
                          key={post.id}
                          onClick={() => setSelectedPostForDetail(post)}
                          className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition-all space-y-1.5"
                        >
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-mono text-brand-400 font-bold">{post.scheduledTime}</span>
                            <div className="flex items-center gap-1">
                              {post.platforms.map(p => (
                                <span key={p} className={`text-[9px] font-bold px-1 rounded ${PLATFORM_INFO[p].badgeBg} ${PLATFORM_INFO[p].badgeText}`}>
                                  {PLATFORM_INFO[p].name.substring(0, 2)}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-[11px] text-slate-200 line-clamp-3 leading-snug">
                            {post.caption}
                          </p>
                          {post.mediaUrls.length > 0 && (
                            <img
                              src={post.mediaUrls[0]}
                              className="w-full h-16 object-cover rounded-lg mt-1"
                              alt="thumb"
                            />
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* LIST / QUEUE VIEW */}
      {viewMode === 'list' && (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Mídia</th>
                <th className="py-3 px-4">Legenda / Conteúdo</th>
                <th className="py-3 px-4">Canais</th>
                <th className="py-3 px-4">Data & Horário</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPosts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-slate-400">
                    Nenhuma postagem encontrada com os filtros atuais.
                  </td>
                </tr>
              ) : (
                filteredPosts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-4 w-16">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 overflow-hidden border border-slate-700/60">
                        {post.mediaUrls[0] ? (
                          <img
                            src={post.mediaUrls[0]}
                            alt="Media thumbnail"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[9px] text-slate-400">
                            Sem mídia
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <p className="text-xs text-slate-200 line-clamp-2 leading-relaxed">
                        {post.caption}
                      </p>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1 mt-1">
                          {post.tags.slice(0, 3).map((tag, i) => (
                            <span key={i} className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.2 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1">
                        {post.platforms.map((p) => (
                          <span
                            key={p}
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${PLATFORM_INFO[p].badgeBg} ${PLATFORM_INFO[p].badgeText} ${PLATFORM_INFO[p].borderColor}`}
                          >
                            {PLATFORM_INFO[p].name}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">
                        {formatDisplayDate(post.scheduledDate)}
                      </div>
                      <div className="text-[11px] font-mono text-brand-400">
                        às {post.scheduledTime}
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold ${STATUS_INFO[post.status].bg} ${STATUS_INFO[post.status].text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_INFO[post.status].dot}`} />
                        {STATUS_INFO[post.status].label}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedPostForDetail(post)}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors mr-2"
                      >
                        Editar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
