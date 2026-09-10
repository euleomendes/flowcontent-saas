import React, { useState } from 'react';
import { 
  Settings, 
  Clock, 
  Globe, 
  Link, 
  RotateCcw, 
  Shield, 
  Save, 
  CheckCircle2, 
  User,
  Sliders
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SettingsView: React.FC = () => {
  const { user, resetDemoData, updateUserProfile, showToast } = useApp();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [organization, setOrganization] = useState(user.organization || 'Agência Fluxo Digital');
  const [workspaceName, setWorkspaceName] = useState(user.workspaceName || 'Workspace Principal');
  const [industry, setIndustry] = useState(user.industry || 'Agência & Marketing Digital');
  const [timezone, setTimezone] = useState(user.timezone || 'America/Sao_Paulo (GMT-3)');
  const [utmSource, setUtmSource] = useState('flowcontent');
  const [utmMedium, setUtmMedium] = useState('social_organic');

  const handleSavePreferences = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      email,
      organization,
      workspaceName,
      industry,
      timezone
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-12">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight">
          Configurações da Plataforma & Workspace
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Personalize seu perfil profissional, workspace, fuso horário e regras globais
        </p>
      </div>

      <form onSubmit={handleSavePreferences} className="space-y-6">
        {/* Profile Info */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <User className="w-4 h-4 text-brand-400" />
            <span>Perfil do Usuário e Workspace</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome do Responsável
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-mail Corporativo
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome da Organização
              </label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Nome do Workspace
              </label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Time & Scheduling Defaults */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Fuso Horário e Horários Padrões</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Fuso Horário Padrão
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              >
                <option value="America/Sao_Paulo">América/São Paulo (GMT-3)</option>
                <option value="Europe/Lisbon">Europa/Lisboa (GMT+1)</option>
                <option value="America/New_York">América/New York (GMT-4)</option>
                <option value="Europe/London">Europa/Londres (GMT+0)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Janela Padrão de Disparo
              </label>
              <input
                type="text"
                defaultValue="12:00, 18:00, 20:30"
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">Horários sugeridos automaticamente no motor de lote</p>
            </div>
          </div>
        </div>

        {/* UTM Tracking Automation */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Link className="w-4 h-4 text-purple-400" />
            <span>Parâmetros de UTM Automáticos</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                utm_source
              </label>
              <input
                type="text"
                value={utmSource}
                onChange={(e) => setUtmSource(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                utm_medium
              </label>
              <input
                type="text"
                value={utmMedium}
                onChange={(e) => setUtmMedium(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs shadow-md shadow-brand-600/30 flex items-center gap-2 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Salvar Configurações</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Reset Data */}
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-rose-400">
          Área de Manutenção e Testes
        </h3>
        <p className="text-xs text-slate-300">
          Deseja recarregar o banco com os posts de exemplo originais e restaurar as configurações padrão?
        </p>
        <button
          type="button"
          onClick={() => {
            if (window.confirm('Isso resetará todas as postagens agendadas para o padrão demo. Continuar?')) {
              resetDemoData();
            }
          }}
          className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Base de Dados Demo</span>
        </button>
      </div>
    </div>
  );
};
