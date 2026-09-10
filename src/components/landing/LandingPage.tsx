import React, { useState } from 'react';
import { 
  Zap, 
  Layers, 
  CalendarDays, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Share2, 
  Clock, 
  ChevronDown
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const LandingPage: React.FC = () => {
  const { setActiveTab, setIsAuthModalOpen, startOnboarding } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'Como funciona o agendamento em lote (Bulk Scheduling)?',
      a: 'Você seleciona ou arrasta dezenas de imagens e vídeos simultaneamente. Em seguida, escolhe um intervalo automático (como "1 post por dia às 18:00") e a plataforma distribui todas as datas instantaneamente. Você pode personalizar legendas individualmente ou aplicar hashtags em massa antes de enviar para o calendário.'
    },
    {
      q: 'Quais redes sociais são suportadas no FlowContent?',
      a: 'O FlowContent integra nativamente com Instagram (Feed e Reels), LinkedIn (Posts e Artigos), TikTok, X/Twitter, Facebook e YouTube Shorts.'
    },
    {
      q: 'Preciso cadastrar cartão de crédito para testar o MVP?',
      a: 'Não! O MVP conta com um modo de demonstração interativo completo, com dados realistas pré-carregados e suporte a uploads reais sem custos.'
    },
    {
      q: 'É possível pré-visualizar o feed antes de publicar?',
      a: 'Sim! Nosso simulador fidedigno renderiza como sua publicação ficará no Instagram, LinkedIn e TikTok em tempo real.'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <Zap className="w-5 h-5 text-white fill-white" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">FlowContent</span>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-slate-300">
            <a href="#features" className="hover:text-white transition-colors">Recursos</a>
            <a href="#how-it-works" className="hover:text-white transition-colors">Como Funciona</a>
            <a href="#pricing" className="hover:text-white transition-colors">Preços</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-800 transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={startOnboarding}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white shadow-md shadow-brand-600/30 transition-all flex items-center gap-1.5"
            >
              <span>Criar Conta</span>
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="hidden sm:flex px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors items-center gap-1.5"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-600/20 blur-[130px] pointer-events-none rounded-full" />
        <div className="absolute top-1/3 right-10 w-[300px] h-[250px] bg-purple-600/15 blur-[120px] pointer-events-none rounded-full" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
            Agende seu conteúdo em lote <br className="hidden sm:block" />
            <span className="bg-gradient-to-r from-brand-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              em segundos, não em dias.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
            Elimine o trabalho repetitivo de postar um por um. Faça upload de 10, 30 ou 50 mídias de uma vez, 
            defina intervalos automáticos inteligentes e distribua sua grade no Instagram, LinkedIn, TikTok e X com 1 clique.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-12">
            <button
              onClick={() => setActiveTab('bulk')}
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 hover:from-brand-500 hover:to-purple-500 text-white font-bold text-sm shadow-xl shadow-brand-600/30 hover:shadow-brand-600/50 transition-all flex items-center justify-center gap-2 group"
            >
              <Layers className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>Experimentar Agendador em Lote</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={() => setActiveTab('dashboard')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700/80 font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <CalendarDays className="w-4 h-4 text-brand-400" />
              <span>Explorar Calendário Editorial</span>
            </button>
          </div>

          {/* Social Proof badges */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sem necessidade de cartão</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Cálculo de Stagger automático</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Multi-redes simultâneas</span>
            </div>
          </div>
        </div>

        {/* Hero Interactive Showcase Banner */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 relative z-10">
          <div className="rounded-2xl bg-slate-900/90 border border-slate-700/70 p-3 sm:p-5 shadow-2xl shadow-brand-950/80 backdrop-blur-xl">
            {/* Window title bar */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-slate-400 font-mono text-[11px]">flowcontent.app / bulk-scheduler</span>
              </div>
              <div className="flex items-center gap-2 text-brand-400 font-semibold text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Simulação Ativa</span>
              </div>
            </div>

            {/* Quick Demo Preview inside Hero */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              {/* Box 1 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300">1. Upload em Lote</span>
                    <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded font-mono">5 mídias</span>
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 mb-2">
                    <div className="h-14 rounded-lg bg-slate-800 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Thumb 1" />
                    </div>
                    <div className="h-14 rounded-lg bg-slate-800 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=200&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Thumb 2" />
                    </div>
                    <div className="h-14 rounded-lg bg-slate-800 overflow-hidden">
                      <img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Thumb 3" />
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">Arraste dezenas de fotos e vídeos direto do seu computador.</p>
              </div>

              {/* Box 2 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300">2. Intervalo Automático</span>
                    <Clock className="w-3.5 h-3.5 text-brand-400" />
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 mb-2">
                    <p className="text-[11px] font-semibold text-brand-400">Regra: 1 post por dia às 18:00</p>
                    <p className="text-[10px] text-slate-400 mt-1">Datas calculadas para 5 dias corridos</p>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">O motor distribui os horários sem conflitos de disparo.</p>
              </div>

              {/* Box 3 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-300">3. Fila no Calendário</span>
                    <Share2 className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="space-y-1.5 mb-2">
                    <div className="flex items-center justify-between text-[10px] p-1.5 rounded bg-slate-900">
                      <span className="text-slate-300">Hoje às 18:00</span>
                      <span className="text-pink-400 font-bold">Instagram • LinkedIn</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] p-1.5 rounded bg-slate-900">
                      <span className="text-slate-300">Amanhã às 18:00</span>
                      <span className="text-cyan-400 font-bold">TikTok • X</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setActiveTab('bulk')}
                  className="w-full py-1.5 rounded-lg bg-brand-600 hover:bg-brand-500 text-white font-semibold text-[11px] transition-colors"
                >
                  Abrir no Editor &rarr;
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-16 border-t border-slate-800/80 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-brand-400 font-bold">Fluxo Simplificado</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              Do arquivo bruto ao calendário em 3 passos
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-brand-500/20 text-brand-400 flex items-center justify-center font-bold text-sm mb-4">
                01
              </div>
              <h3 className="text-base font-bold text-white mb-2">Carregue em Lote</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Faça upload de dezenas de fotos ou vídeos ao mesmo tempo via arrastar-e-soltar ou selecione templates pré-formatados.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-sm mb-4">
                02
              </div>
              <h3 className="text-base font-bold text-white mb-2">Configure o Stagger</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Escolha a data inicial e a regra de espaçamento: diário, horários nobres, dias úteis ou intervalos customizados de horas.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-sm mb-4">
                03
              </div>
              <h3 className="text-base font-bold text-white mb-2">Dispare a Grade</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Ajuste legendas individualmente, confira o mockup do feed do Instagram ou LinkedIn e confirme o envio para a fila do calendário.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-brand-400 font-bold">Vantagens Competitivas</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
            Tudo o que sua agência precisa para escalar produção
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <Layers className="w-8 h-8 text-brand-400 mb-4" />
            <h4 className="text-base font-bold text-white mb-2">Bulk Media Ingestion</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload paralelo de arquivos de alta resolução sem travar a interface do navegador.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <Clock className="w-8 h-8 text-indigo-400 mb-4" />
            <h4 className="text-base font-bold text-white mb-2">Intervalos Inteligentes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Cálculo algorítmico de espaçamento para evitar spam nas APIs e respeitar os horários nobres de engajamento.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
            <CalendarDays className="w-8 h-8 text-purple-400 mb-4" />
            <h4 className="text-base font-bold text-white mb-2">Calendário Mensal & Semanal</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visão limpa da grade com filtros rápidos por status (Agendado, Publicado, Rascunho) e canal social.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 border-t border-slate-800/80 bg-slate-900/20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs uppercase tracking-widest text-brand-400 font-bold">Planos Transparentes</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mt-2">
              Escolha a velocidade ideal para a sua produção
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Starter */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white mb-1">Starter</h4>
                <p className="text-xs text-slate-400 mb-4">Para criadores individuais</p>
                <div className="text-2xl font-extrabold text-white mb-6">
                  R$ 49<span className="text-xs font-normal text-slate-400">/mês</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                    Até 3 redes sociais
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                    Lotes de até 15 posts por vez
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                    Calendário mensal básico
                  </li>
                </ul>
              </div>
              <button
                onClick={startOnboarding}
                className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
              >
                Começar no Starter
              </button>
            </div>

            {/* Pro (Highlighted) */}
            <div className="p-6 rounded-2xl bg-gradient-to-b from-brand-900/40 to-slate-900 border-2 border-brand-500/80 shadow-xl shadow-brand-500/10 flex flex-col justify-between relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-brand-500 text-white text-[10px] font-bold uppercase tracking-wider">
                Mais Popular
              </span>
              <div>
                <h4 className="text-base font-bold text-white mb-1">Pro Creator</h4>
                <p className="text-xs text-brand-200 mb-4">Para profissionais e agências em crescimento</p>
                <div className="text-2xl font-extrabold text-white mb-6">
                  R$ 97<span className="text-xs font-normal text-slate-400">/mês</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Todas as 6 redes conectadas
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Lotes ilimitados de postagens
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Motor de Staggering avançado
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    Simulador visual de feed em tempo real
                  </li>
                </ul>
              </div>
              <button
                onClick={startOnboarding}
                className="mt-8 w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-xs font-bold text-white shadow-lg shadow-brand-600/30 transition-all"
              >
                Testar Pro Agora (Onboarding)
              </button>
            </div>

            {/* Agency */}
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
              <div>
                <h4 className="text-base font-bold text-white mb-1">Agência</h4>
                <p className="text-xs text-slate-400 mb-4">Para múltiplos clientes e times</p>
                <div className="text-2xl font-extrabold text-white mb-6">
                  R$ 249<span className="text-xs font-normal text-slate-400">/mês</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                    Perfis ilimitados de clientes
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                    Fluxos de aprovação de conteúdo
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-brand-400" />
                    Suporte prioritário via WhatsApp
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="mt-8 w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white border border-slate-700 transition-colors"
              >
                Falar com Consultor
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-white">Dúvidas Frequentes</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border border-slate-800 rounded-xl bg-slate-900/50 overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-5 py-4 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-slate-200 hover:text-white"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaq === idx ? 'rotate-180 text-brand-400' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-4 text-xs text-slate-400 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-brand-500 fill-brand-500" />
            <span className="font-bold text-slate-200">FlowContent</span>
            <span>— Agendamento Inteligente de Conteúdo em Lote</span>
          </div>
          <div className="flex items-center gap-6">
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-slate-200">Dashboard</button>
            <button onClick={() => setActiveTab('bulk')} className="hover:text-slate-200">Agendamento em Lote</button>
            <button onClick={() => setActiveTab('accounts')} className="hover:text-slate-200">Redes Sociais</button>
          </div>
          <p>© {new Date().getFullYear()} FlowContent. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};
