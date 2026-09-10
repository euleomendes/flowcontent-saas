import React, { useState } from 'react';
import { 
  Zap, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Lock, 
  Mail, 
  User, 
  Building2, 
  Briefcase, 
  Clock, 
  Users, 
  Share2, 
  Sparkles, 
  Check, 
  ShieldCheck,
  ChevronRight,
  Globe,
  Crown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SocialAccount, SocialPlatform, UserProfile } from '../../types';
import { PLATFORM_INFO } from '../../utils/helpers';
import { OAuthModal } from '../channels/OAuthModal';

export const OnboardingFlow: React.FC = () => {
  const { user, accounts, masterEmail, finishOnboarding, setActiveTab, showToast } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Step 1: User Credentials
  const [name, setName] = useState(user.name || 'Camila Santos');
  const [email, setEmail] = useState(user.email || 'camila@agenciafluxo.com.br');
  const [password, setPassword] = useState('••••••••••••');
  const [role, setRole] = useState(user.role || 'Head de Conteúdo & Social Media');

  // Step 2: Workspace & Organization
  const [organization, setOrganization] = useState(user.organization || 'Agência Fluxo Digital');
  const [workspaceName, setWorkspaceName] = useState(user.workspaceName || 'Workspace Principal');
  const [industry, setIndustry] = useState(user.industry || 'Agência & Marketing Digital');
  const [teamSize, setTeamSize] = useState(user.teamSize || '5-15 pessoas');
  const [timezone, setTimezone] = useState(user.timezone || 'America/Sao_Paulo (GMT-3)');

  // Step 3: OAuth Modal state
  const [activeOAuthPlatform, setActiveOAuthPlatform] = useState<SocialPlatform | null>(null);

  // Quick Google Sign-In Simulation
  const handleGoogleQuickFill = () => {
    setName('Camila Santos');
    setEmail('camila.santos@gmail.com');
    setRole('Criadora & Gestora de Mídias');
    setOrganization('Camila Santos Studio');
    setWorkspaceName('Studio Criativo');
    showToast('✨ Dados preenchidos via Acesso Rápido com Google!', 'success');
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      showToast('Por favor, preencha seu nome e e-mail.', 'error');
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!organization.trim() || !workspaceName.trim()) {
      showToast('Defina o nome da sua organização e workspace.', 'error');
      return;
    }
    setStep(3);
  };

  const handleFinish = () => {
    const updatedUser: Partial<UserProfile> = {
      name,
      email,
      role,
      organization,
      workspaceName,
      industry,
      teamSize,
      timezone,
      onboardingCompleted: true
    };

    finishOnboarding(updatedUser);
  };

  const connectedAccountsCount = accounts.filter(a => a.connected).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/15 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/15 blur-[130px] pointer-events-none rounded-full" />

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur-md px-6 py-4 flex items-center justify-between relative z-10">
        <div 
          onClick={() => setActiveTab('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Zap className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">FlowContent</span>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-brand-500/10 text-brand-400 border border-brand-500/20 ml-1">
            Setup Inicial
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span>Precisa de ajuda?</span>
          <button 
            type="button" 
            onClick={() => setActiveTab('landing')}
            className="text-slate-300 hover:text-white underline transition-colors"
          >
            Voltar ao Início
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-2xl w-full mx-auto px-4 py-8 relative z-10">
        
        {/* Stepper Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2.5">
            <span className={step >= 1 ? 'text-brand-400 font-bold' : ''}>1. Criar Conta</span>
            <span className={step >= 2 ? 'text-brand-400 font-bold' : ''}>2. Organização</span>
            <span className={step >= 3 ? 'text-brand-400 font-bold' : ''}>3. Conectar Redes</span>
            <span className={step >= 4 ? 'text-emerald-400 font-bold' : ''}>4. Ativação</span>
          </div>
          <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-brand-500 via-indigo-500 to-purple-500 transition-all duration-300 rounded-full"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl">
          
          {/* ================= STEP 1: CONTA & CREDENCIAIS ================= */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Passo 1 de 4
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-2">
                  Crie sua conta no FlowContent
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Configure suas credenciais profissionais de acesso ou use o login rápido.
                </p>
              </div>

              {/* Quick Google Button */}
              <button
                type="button"
                onClick={handleGoogleQuickFill}
                className="w-full py-3 px-4 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-700/80 text-white font-semibold text-xs flex items-center justify-center gap-3 transition-all group shadow-sm"
              >
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Acesso Rápido com Google / Gmail</span>
              </button>

              <div className="relative flex py-1 items-center">
                <div className="flex-grow border-t border-slate-800"></div>
                <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase tracking-wider font-semibold">
                  ou dados cadastrais
                </span>
                <div className="flex-grow border-t border-slate-800"></div>
              </div>

              {/* Form */}
              <form onSubmit={handleStep1Submit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Nome Completo
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Camila Santos"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    E-mail Corporativo ou Pessoal
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seuemail@empresa.com.br"
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Cargo / Função
                    </label>
                    <div className="relative">
                      <Briefcase className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        placeholder="Ex: Social Media Manager"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all mt-4"
                >
                  <span>Continuar para Workspace</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* ================= STEP 2: WORKSPACE & ORGANIZAÇÃO ================= */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Passo 2 de 4
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-2">
                  Configure seu Workspace
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Defina o ambiente para organizar os canais de agendamento em lote da sua equipe.
                </p>
              </div>

              <form onSubmit={handleStep2Submit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nome da Organização / Empresa
                    </label>
                    <div className="relative">
                      <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        placeholder="Ex: Agência Fluxo Digital"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nome do Workspace Inicial
                    </label>
                    <div className="relative">
                      <Zap className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        required
                        value={workspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                        placeholder="Ex: Workspace Principal"
                        className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-500 transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Nicho / Setor de Atuação
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                    >
                      <option value="Agência & Marketing Digital">Agência & Marketing Digital</option>
                      <option value="E-commerce & Varejo">E-commerce & Varejo</option>
                      <option value="Criador de Conteúdo / Influencer">Criador de Conteúdo / Influencer</option>
                      <option value="SaaS & Tecnologia">SaaS & Tecnologia</option>
                      <option value="Imobiliário & Construção">Imobiliário & Construção</option>
                      <option value="Educação & Infoprodutos">Educação & Infoprodutos</option>
                      <option value="Saúde & Bem-Estar">Saúde & Bem-Estar</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Tamanho da Equipe
                    </label>
                    <select
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                    >
                      <option value="1 pessoa (Solo)">1 pessoa (Solo)</option>
                      <option value="2-5 pessoas">2 a 5 pessoas</option>
                      <option value="5-15 pessoas">5 a 15 pessoas</option>
                      <option value="15+ colaboradores">15+ colaboradores</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Fuso Horário Padrão para Disparos
                  </label>
                  <div className="relative">
                    <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-brand-500 transition-colors"
                    >
                      <option value="America/Sao_Paulo (GMT-3)">Brasília / São Paulo (GMT-03:00)</option>
                      <option value="America/Manaus (GMT-4)">Manaus / Amazonas (GMT-04:00)</option>
                      <option value="America/Noronha (GMT-2)">Fernando de Noronha (GMT-02:00)</option>
                      <option value="Europe/Lisbon (GMT+0)">Lisboa / Portugal (GMT+00:00)</option>
                      <option value="America/New_York (EST)">Nova York / EUA (EST)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Voltar</span>
                  </button>

                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Salvar e Conectar Redes Sociais</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ================= STEP 3: CONECTAR REDES SOCIAIS ================= */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  Passo 3 de 4
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-2">
                  Conecte seus Perfis Sociais
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Autorize suas contas comerciais e canais para habilitar o agendamento em lote oficial.
                </p>
              </div>

              {/* Accounts list with quick OAuth trigger */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {accounts.map((acc) => {
                  const info = PLATFORM_INFO[acc.platform];
                  return (
                    <div
                      key={acc.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        acc.connected
                          ? 'bg-slate-950/80 border-emerald-500/40 shadow-sm'
                          : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-md text-sm shrink-0"
                          style={{ backgroundColor: info.color }}
                        >
                          {info.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            {info.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {acc.connected ? (
                              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3 inline" />
                                {acc.subPages?.filter(p => p.selected).length || 1} página(s) vinculada(s)
                              </span>
                            ) : (
                              'Não conectado'
                            )}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setActiveOAuthPlatform(acc.platform)}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 ${
                          acc.connected
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20'
                            : 'bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/20'
                        }`}
                      >
                        {acc.connected ? 'Gerenciar' : 'Conectar'}
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="p-3.5 rounded-2xl bg-brand-950/20 border border-brand-500/20 flex items-center justify-between text-xs text-brand-300">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-brand-400" />
                  <span>
                    <strong>{connectedAccountsCount} canais</strong> conectados e prontos para postagem em lote.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-600/30 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Revisar e Finalizar Setup</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ================= STEP 4: REVISÃO & ATIVAÇÃO ================= */}
          {step === 4 && (
            <div className="space-y-6 animate-fade-in text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 mx-auto flex items-center justify-center shadow-xl shadow-brand-500/25">
                <Sparkles className="w-8 h-8 text-white" />
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Pronto para Começar
                </span>
                <h2 className="text-2xl font-extrabold text-white mt-2">
                  Tudo pronto, {name}!
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Seu workspace foi configurado com sucesso e está pronto para agendamento inteligente em massa.
                </p>
              </div>

              {/* Summary Card */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-brand-600 flex items-center justify-center text-white font-bold">
                      {name.charAt(0)}
                    </div>
                    <div>
                      <div className="font-bold text-white">{name}</div>
                      <div className="text-[11px] text-slate-400">{email}</div>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                    {role}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-[11px]">
                  <div>
                    <span className="text-slate-500 block">Organização:</span>
                    <span className="font-semibold text-slate-200">{organization}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Workspace:</span>
                    <span className="font-semibold text-slate-200">{workspaceName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Setor:</span>
                    <span className="font-semibold text-slate-200">{industry}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">Fuso Horário:</span>
                    <span className="font-semibold text-slate-200">{timezone.split(' ')[0]}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-slate-400">Canais de Postagem Ativos:</span>
                  <div className="flex items-center gap-1.5">
                    {accounts.filter(a => a.connected).map(acc => (
                      <span 
                        key={acc.id} 
                        className="w-5 h-5 rounded-md flex items-center justify-center text-[10px] text-white font-bold shadow-sm"
                        style={{ backgroundColor: PLATFORM_INFO[acc.platform].color }}
                        title={PLATFORM_INFO[acc.platform].name}
                      >
                        {PLATFORM_INFO[acc.platform].name.charAt(0)}
                      </span>
                    ))}
                    {connectedAccountsCount === 0 && (
                      <span className="text-slate-500 text-[11px]">Nenhum (conecte no painel)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Final Buttons */}
              <div className="space-y-2.5">
                {email.toLowerCase() === masterEmail.toLowerCase() ? (
                  <button
                    type="button"
                    onClick={handleFinish}
                    className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-600 via-brand-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                  >
                    <Crown className="w-4 h-4 text-amber-300" />
                    <span>Ativar Workspace & Acessar como Master Admin</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={handleFinish}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-extrabold text-sm shadow-xl shadow-brand-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Concluir Cadastro & Solicitar Liberação</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-[11px] text-amber-400/80 mt-2 flex items-center justify-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Sua conta passará pela aprovação do Administrador Master ({masterEmail})</span>
                    </p>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Voltar e ajustar redes
                </button>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Footer */}
      <footer className="py-6 border-t border-slate-800/60 bg-slate-950/80 text-center text-xs text-slate-500 relative z-10">
        <p>© {new Date().getFullYear()} FlowContent. Todos os direitos reservados. Criptografia ponta a ponta.</p>
      </footer>

      {/* Embedded OAuth Modal for Step 3 */}
      {activeOAuthPlatform && (
        <OAuthModal
          isOpen={!!activeOAuthPlatform}
          initialPlatform={activeOAuthPlatform}
          initialAccount={accounts.find(a => a.platform === activeOAuthPlatform)}
          onClose={() => setActiveOAuthPlatform(null)}
          onSuccess={() => setActiveOAuthPlatform(null)}
        />
      )}
    </div>
  );
};
