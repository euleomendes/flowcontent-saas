import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Zap, 
  Share2, 
  Hash, 
  CheckCircle2, 
  SlidersHorizontal,
  Plus,
  Trash2,
  Sparkles,
  CalendarRange,
  Timer
} from 'lucide-react';
import { StaggerScheduleConfig, StaggerRule, SocialPlatform, StaggerMode } from '../../types';
import { getTodayISODate, generateDistributedTimeSlots } from '../../utils/dateUtils';
import { PLATFORM_INFO } from '../../utils/helpers';

interface AutoScheduleBarProps {
  itemCount: number;
  onApplySchedule: (config: StaggerScheduleConfig) => void;
}

export const AutoScheduleBar: React.FC<AutoScheduleBarProps> = ({
  itemCount,
  onApplySchedule
}) => {
  // Start date
  const [startDate, setStartDate] = useState(getTodayISODate());
  
  // Stagger Mode: 'posts_per_day' | 'interval_minutes' | 'daily_same_time'
  const [staggerMode, setStaggerMode] = useState<'posts_per_day' | 'interval_minutes' | 'daily_same_time'>('posts_per_day');

  // Posts Per Day Settings (Free quantity)
  const [postsPerDay, setPostsPerDay] = useState<number>(3);
  const [customTimeSlots, setCustomTimeSlots] = useState<string[]>(['08:14', '14:32', '19:45']);
  const [skipWeekends, setSkipWeekends] = useState<boolean>(false);

  // Interval Minutes Settings (e.g. every 90 minutes from 08:14)
  const [startTime, setStartTime] = useState<string>('08:14');
  const [intervalMinutes, setIntervalMinutes] = useState<number>(120); // 2h

  // Channels & Hashtags
  const [selectedPlatforms, setSelectedPlatforms] = useState<SocialPlatform[]>(['instagram', 'linkedin']);
  const [appendHashtags, setAppendHashtags] = useState('#Marketing #Growth');

  // When postsPerDay changes, adjust customTimeSlots
  const handlePostsPerDayChange = (newCount: number) => {
    const val = Math.max(1, Math.min(50, newCount));
    setPostsPerDay(val);
    
    if (val !== customTimeSlots.length) {
      // Regenerate distributed slots with organic broken minutes
      const newSlots = generateDistributedTimeSlots(val, 8, 22, true);
      setCustomTimeSlots(newSlots);
    }
  };

  // Generate organic broken minutes (e.g. 08:14, 11:32, etc.)
  const handleGenerateOrganicTimes = () => {
    const generated = generateDistributedTimeSlots(postsPerDay, 8, 22, true);
    setCustomTimeSlots(generated);
  };

  // Add individual custom time slot
  const handleAddSlot = () => {
    const nextHour = Math.min(23, 8 + customTimeSlots.length * 2);
    const minute = (customTimeSlots.length * 13) % 60;
    const newSlot = `${String(nextHour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    const nextSlots = [...customTimeSlots, newSlot];
    setCustomTimeSlots(nextSlots);
    setPostsPerDay(nextSlots.length);
  };

  // Remove individual slot
  const handleRemoveSlot = (index: number) => {
    if (customTimeSlots.length <= 1) return;
    const nextSlots = customTimeSlots.filter((_, i) => i !== index);
    setCustomTimeSlots(nextSlots);
    setPostsPerDay(nextSlots.length);
  };

  // Update specific slot time (any hour and minute)
  const handleSlotTimeChange = (index: number, newTime: string) => {
    const copy = [...customTimeSlots];
    copy[index] = newTime;
    setCustomTimeSlots(copy);
  };

  const togglePlatform = (p: SocialPlatform) => {
    if (selectedPlatforms.includes(p)) {
      if (selectedPlatforms.length === 1) return;
      setSelectedPlatforms(selectedPlatforms.filter(item => item !== p));
    } else {
      setSelectedPlatforms([...selectedPlatforms, p]);
    }
  };

  const handleApply = () => {
    let rule: StaggerRule = 'posts_per_day';
    if (staggerMode === 'daily_same_time') {
      rule = 'daily_same_time';
    } else if (staggerMode === 'interval_minutes') {
      rule = 'every_few_hours';
    }

    onApplySchedule({
      startDate,
      startTime: staggerMode === 'posts_per_day' ? customTimeSlots[0] || '08:14' : startTime,
      rule,
      postsPerDay: staggerMode === 'posts_per_day' ? postsPerDay : 1,
      customTimeSlots: staggerMode === 'posts_per_day' ? customTimeSlots : [startTime],
      gapMinutes: staggerMode === 'interval_minutes' ? intervalMinutes : undefined,
      skipWeekends,
      selectedPlatforms,
      appendHashtags
    });
  };

  // Estimated days calculation for feedback
  const estimatedDays = Math.ceil((itemCount || 1) / (staggerMode === 'posts_per_day' ? postsPerDay : 1));

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 mb-6 shadow-sm">
      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-brand-400" />
            <span>2. Motor de Distribuição de Horários Flexíveis (Auto-Stagger)</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Defina livremente quantos posts por dia deseja disparar e personalize qualquer minuto ou horário quebrado.
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shrink-0">
          <button
            type="button"
            onClick={() => setStaggerMode('posts_per_day')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              staggerMode === 'posts_per_day'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CalendarRange className="w-3.5 h-3.5" />
            <span>Posts por Dia (Livre)</span>
          </button>

          <button
            type="button"
            onClick={() => setStaggerMode('daily_same_time')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              staggerMode === 'daily_same_time'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>1 Post/Dia Fixo</span>
          </button>

          <button
            type="button"
            onClick={() => setStaggerMode('interval_minutes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              staggerMode === 'interval_minutes'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>Intervalo em Minutos</span>
          </button>
        </div>
      </div>

      {/* Main Configuration Grid */}
      <div className="space-y-4">
        {/* Row 1: Start Date & Core Frequency Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Start Date */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-brand-400" />
              <span>Data Inicial do Lote</span>
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          {/* MODE 1: Free Posts Per Day */}
          {staggerMode === 'posts_per_day' && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Quantidade de Posts por Dia (Sem travas)</span>
                </span>
                <span className="text-[11px] text-brand-400 font-mono">
                  {postsPerDay} {postsPerDay === 1 ? 'post/dia' : 'posts/dia'}
                </span>
              </label>

              <div className="flex items-center gap-2">
                {/* Stepper buttons */}
                <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl overflow-hidden">
                  <button
                    type="button"
                    onClick={() => handlePostsPerDayChange(postsPerDay - 1)}
                    className="px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 font-bold"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={postsPerDay}
                    onChange={(e) => handlePostsPerDayChange(parseInt(e.target.value, 10) || 1)}
                    className="w-14 bg-transparent text-center text-xs font-bold text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => handlePostsPerDayChange(postsPerDay + 1)}
                    className="px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Quick Presets */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 5, 10].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePostsPerDayChange(preset)}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        postsPerDay === preset
                          ? 'bg-brand-600 text-white border-brand-500 shadow-sm'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {preset}x
                    </button>
                  ))}
                </div>

                {/* Skip Weekends toggle */}
                <label className="flex items-center gap-1.5 ml-auto text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={skipWeekends}
                    onChange={(e) => setSkipWeekends(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-brand-500 focus:ring-0"
                  />
                  <span>Pular finais de semana</span>
                </label>
              </div>
            </div>
          )}

          {/* MODE 2: Daily Same Time */}
          {staggerMode === 'daily_same_time' && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-brand-400" />
                <span>Horário Fixo de Disparo (Qualquer minuto, ex: 08:14)</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="time"
                  step="60"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                />
                <label className="flex items-center gap-1.5 text-xs text-slate-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={skipWeekends}
                    onChange={(e) => setSkipWeekends(e.target.checked)}
                    className="rounded bg-slate-950 border-slate-700 text-brand-500 focus:ring-0"
                  />
                  <span>Apenas dias úteis (Seg-Sex)</span>
                </label>
              </div>
            </div>
          )}

          {/* MODE 3: Continuous Interval */}
          {staggerMode === 'interval_minutes' && (
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-brand-400" />
                <span>Início e Intervalo Contínuo</span>
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">Às:</span>
                  <input
                    type="time"
                    step="60"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-slate-400">A cada:</span>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={intervalMinutes}
                    onChange={(e) => setIntervalMinutes(Math.max(5, parseInt(e.target.value, 10) || 60))}
                    className="w-20 bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 text-center font-bold"
                  />
                  <span className="text-xs text-slate-400">minutos</span>
                </div>

                <div className="flex gap-1 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setIntervalMinutes(45)}
                    className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                  >
                    45m
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntervalMinutes(90)}
                    className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                  >
                    1h30
                  </button>
                  <button
                    type="button"
                    onClick={() => setIntervalMinutes(180)}
                    className="px-2 py-1 rounded bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
                  >
                    3h
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Row 2: DETAILED CUSTOM TIME SLOTS (Only visible in posts_per_day mode) */}
        {staggerMode === 'posts_per_day' && (
          <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <div>
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-400" />
                  <span>Horários Personalizados do Dia ({customTimeSlots.length} slots definidos)</span>
                </span>
                <p className="text-[11px] text-slate-400">
                  Edite qualquer minuto ou hora específica (ex: 08:14, 14:32). O lote repetirá essa grade diariamente.
                </p>
              </div>

              {/* Action: Generate Organic / Broken Minutes */}
              <button
                type="button"
                onClick={handleGenerateOrganicTimes}
                className="px-3 py-1.5 rounded-lg bg-indigo-500/15 hover:bg-indigo-500/25 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                title="Distribui horários com minutos quebrados humanos para evitar bloqueios de robô"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Gerar Minutos Orgânicos Quebrados</span>
              </button>
            </div>

            {/* Slots Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-2.5">
              {customTimeSlots.map((slot, idx) => (
                <div 
                  key={idx}
                  className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-1.5 hover:border-slate-700 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-slate-400 block">
                      Post #{idx + 1}
                    </span>
                    <input
                      type="time"
                      step="60"
                      value={slot}
                      onChange={(e) => handleSlotTimeChange(idx, e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-brand-300 font-mono font-bold focus:outline-none focus:border-brand-500 mt-0.5"
                    />
                  </div>

                  {customTimeSlots.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveSlot(idx)}
                      className="text-slate-400 hover:text-rose-400 p-1 rounded hover:bg-rose-500/10 transition-colors"
                      title="Remover este horário"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}

              {/* Add Slot Button */}
              <button
                type="button"
                onClick={handleAddSlot}
                className="p-2 rounded-xl border border-dashed border-slate-700/80 hover:border-brand-500 text-slate-400 hover:text-brand-400 flex flex-col items-center justify-center gap-1 text-xs font-semibold transition-colors group min-h-[58px]"
              >
                <Plus className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span className="text-[10px]">+ Adicionar Horário</span>
              </button>
            </div>
          </div>
        )}

        {/* Row 3: Platforms, Hashtags & Trigger Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3 border-t border-slate-800">
          {/* Platforms Multi-select */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400 mr-1">Canais do lote:</span>
            {(['instagram', 'linkedin', 'tiktok', 'twitter', 'facebook'] as SocialPlatform[]).map((p) => {
              const isSelected = selectedPlatforms.includes(p);
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => togglePlatform(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1 transition-all ${
                    isSelected
                      ? `${PLATFORM_INFO[p].badgeBg} ${PLATFORM_INFO[p].badgeText} ${PLATFORM_INFO[p].borderColor}`
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{PLATFORM_INFO[p].name}</span>
                  {isSelected && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                </button>
              );
            })}
          </div>

          {/* Optional Hashtags */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Hash className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={appendHashtags}
                onChange={(e) => setAppendHashtags(e.target.value)}
                placeholder="Hashtags em massa..."
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-brand-500 w-44"
              />
            </div>

            {/* Apply Button */}
            <button
              type="button"
              disabled={itemCount === 0}
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 disabled:text-slate-400 disabled:cursor-not-allowed text-white text-xs font-bold shadow-md shadow-brand-600/30 flex items-center justify-center gap-2 transition-all active:scale-[0.98] shrink-0"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Aplicar aos {itemCount} Posts</span>
            </button>
          </div>
        </div>

        {/* Live Calculation Feedback Note */}
        {itemCount > 0 && (
          <div className="text-[11px] text-slate-400 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/60 flex items-center justify-between">
            <span>
              ℹ️ Com <strong>{staggerMode === 'posts_per_day' ? `${postsPerDay} posts por dia` : (staggerMode === 'daily_same_time' ? '1 post/dia' : `${intervalMinutes}min de intervalo`)}</strong>, seus <strong>{itemCount} posts</strong> serão distribuídos ao longo de aproximadamente <strong>{estimatedDays} dia{estimatedDays > 1 ? 's' : ''}</strong> a partir de {startDate}.
            </span>
            <span className="text-brand-400 font-medium">Horários personalizáveis linha a linha</span>
          </div>
        )}
      </div>
    </div>
  );
};
