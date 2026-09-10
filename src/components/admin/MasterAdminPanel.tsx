import React, { useState } from 'react';
import { 
  Crown, 
  ShieldCheck, 
  UserCheck, 
  UserX, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Search, 
  Mail, 
  Building2, 
  Trash2, 
  LogIn, 
  Filter, 
  Sparkles,
  Save,
  AlertCircle,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RegisteredUser, UserAccessStatus } from '../../types';

export const MasterAdminPanel: React.FC = () => {
  const { 
    user, 
    masterEmail, 
    setMasterEmail, 
    registeredUsers, 
    approveUser, 
    rejectUser,
    blockUser, 
    deleteUser, 
    loginAsUser,
    showToast 
  } = useApp();

  const isMaster = user.isMaster || user.email.toLowerCase() === masterEmail.toLowerCase();

  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'blocked'>('pending');
  const [search, setSearch] = useState('');
  const [editingMasterEmail, setEditingMasterEmail] = useState(masterEmail);
  const [isEditingEmail, setIsEditingEmail] = useState(false);

  if (!isMaster) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 text-center rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-white">Acesso Restrito ao Administrador Master</h3>
        <p className="text-xs text-slate-400 leading-relaxed">
          Este painel é de uso exclusivo do Administrador Master (<span className="font-mono text-amber-300 font-bold">{masterEmail}</span>). Por favor, conecte-se com as credenciais Master para gerenciar aprovações.
        </p>
      </div>
    );
  }

  const handleSaveMasterEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMasterEmail.trim() || !editingMasterEmail.includes('@')) {
      showToast('Por favor, informe um e-mail válido.', 'error');
      return;
    }
    setMasterEmail(editingMasterEmail.trim());
    setIsEditingEmail(false);
  };

  const pendingUsersCount = registeredUsers.filter(u => u.status === 'pending').length;
  const approvedUsersCount = registeredUsers.filter(u => u.status === 'approved').length;
  const blockedUsersCount = registeredUsers.filter(u => u.status === 'blocked').length;

  const filteredUsers = registeredUsers.filter(u => {
    // Status filter
    if (filter !== 'all' && u.status !== filter) return false;
    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.organization.toLowerCase().includes(q) ||
        u.workspaceName.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="animate-fade-in space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-slate-900 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-400" />
              Painel de Controle Exclusivo Master Admin
            </span>
            <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> Acesso Restrito
            </span>
          </div>
          <h2 className="text-xl font-bold text-white mt-2">
            Aprovação de Usuários & Controle de Acesso
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Valide solicitações de novos cadastros, aprove ou bloqueie contas de acesso ao FlowContent e configure o e-mail Master do SaaS.
          </p>
        </div>

        {/* Master Email Quick Config */}
        <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs">
          <div className="text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
            <Crown className="w-3 h-3 text-amber-400" />
            E-mail Master Configurado:
          </div>
          {isEditingEmail ? (
            <form onSubmit={handleSaveMasterEmail} className="flex items-center gap-1.5 mt-1">
              <input
                type="email"
                required
                value={editingMasterEmail}
                onChange={(e) => setEditingMasterEmail(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="p-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold"
                title="Salvar"
              >
                <Save className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between gap-2 mt-0.5">
              <span className="font-mono font-bold text-amber-300">{masterEmail}</span>
              <button
                type="button"
                onClick={() => setIsEditingEmail(true)}
                className="text-[10px] text-slate-400 hover:text-white underline ml-2"
              >
                Alterar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        {/* Total */}
        <div 
          onClick={() => setFilter('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filter === 'all'
              ? 'bg-slate-900 border-slate-700 shadow-md ring-1 ring-slate-700'
              : 'bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-slate-400">Total de Cadastros</span>
            <Users className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl font-black text-white">{registeredUsers.length}</div>
          <span className="text-[10px] text-slate-400">Contas na base</span>
        </div>

        {/* Pending (Highlighted) */}
        <div 
          onClick={() => setFilter('pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filter === 'pending'
              ? 'bg-amber-950/40 border-amber-500/60 shadow-lg ring-1 ring-amber-500/40'
              : 'bg-slate-900/60 border-slate-800/80 hover:border-amber-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              Aguardando Aprovação
            </span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{pendingUsersCount}</div>
          <span className="text-[10px] text-amber-200/80">Requerem validação do Master</span>
        </div>

        {/* Approved */}
        <div 
          onClick={() => setFilter('approved')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filter === 'approved'
              ? 'bg-emerald-950/30 border-emerald-500/50 shadow-md ring-1 ring-emerald-500/30'
              : 'bg-slate-900/60 border-slate-800/80 hover:border-emerald-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-emerald-400">Aprovados</span>
            <UserCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{approvedUsersCount}</div>
          <span className="text-[10px] text-slate-400">Com acesso ao agendador</span>
        </div>

        {/* Blocked */}
        <div 
          onClick={() => setFilter('blocked')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            filter === 'blocked'
              ? 'bg-rose-950/30 border-rose-500/50 shadow-md ring-1 ring-rose-500/30'
              : 'bg-slate-900/60 border-slate-800/80 hover:border-rose-500/40'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-rose-400">Bloqueados</span>
            <UserX className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-white">{blockedUsersCount}</div>
          <span className="text-[10px] text-slate-400">Acesso negado</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-slate-800 pb-3">
        {/* Filter buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              filter === 'pending'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <span>Pendentes ({pendingUsersCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'approved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aprovados ({approvedUsersCount})
          </button>

          <button
            type="button"
            onClick={() => setFilter('blocked')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'blocked'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Bloqueados ({blockedUsersCount})
          </button>

          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filter === 'all'
                ? 'bg-slate-800 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Todos ({registeredUsers.length})
          </button>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, e-mail ou empresa..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      {/* Users List */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-slate-900/40 border border-slate-800 text-slate-400 space-y-2">
            <UserCheck className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-sm font-semibold">Nenhum usuário encontrado nesta categoria.</p>
            <p className="text-xs text-slate-500">Tente ajustar o filtro ou o termo de busca.</p>
          </div>
        ) : (
          filteredUsers.map((regUser) => {
            const isUserMaster = regUser.isMaster || regUser.email.toLowerCase() === masterEmail.toLowerCase();
            const isPending = regUser.status === 'pending';
            const isApproved = regUser.status === 'approved';
            const isBlocked = regUser.status === 'blocked';

            return (
              <div
                key={regUser.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isPending
                    ? 'bg-amber-950/20 border-amber-500/40 shadow-sm'
                    : isBlocked
                    ? 'bg-rose-950/15 border-rose-500/25 opacity-75'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* User Info */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div className="relative shrink-0">
                    <img
                      src={regUser.avatar}
                      alt={regUser.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-800 shadow"
                    />
                    {isUserMaster && (
                      <div className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold absolute -top-1 -right-1 flex items-center justify-center text-[9px] shadow">
                        <Crown className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-sm text-white">
                        {regUser.name}
                      </span>
                      {isUserMaster && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-bold">
                          Master Admin
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] font-mono">
                        Plano {regUser.plan}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1 flex-wrap font-mono">
                      <span className="text-slate-200">{regUser.email}</span>
                      <span>•</span>
                      <span>{regUser.organization}</span>
                      <span>({regUser.workspaceName})</span>
                    </div>

                    <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-2">
                      <span>Cadastro: {regUser.createdAt}</span>
                      {regUser.approvedAt && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400">Aprovado: {regUser.approvedAt}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Status and Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 flex-wrap justify-end">
                  {/* Status Badge */}
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 ${
                      isPending
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : isApproved
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isPending ? 'bg-amber-400 animate-pulse' : isApproved ? 'bg-emerald-400' : 'bg-rose-400'
                    }`} />
                    {isPending ? 'Pendente de Aprovação' : isApproved ? 'Acesso Aprovado' : 'Acesso Bloqueado'}
                  </span>

                  {/* Actions */}
                  {!isUserMaster && (
                    <div className="flex items-center gap-2">
                      {isPending && (
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => approveUser(regUser.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition-all"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Aprovar</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => rejectUser(regUser.id)}
                            className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs flex items-center gap-1.5 transition-all"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Rejeitar</span>
                          </button>
                        </div>
                      )}

                      {isApproved && (
                        <button
                          type="button"
                          onClick={() => blockUser(regUser.id)}
                          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-rose-600/20 hover:text-rose-400 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Bloquear</span>
                        </button>
                      )}

                      {isBlocked && (
                        <button
                          type="button"
                          onClick={() => approveUser(regUser.id)}
                          className="px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Reativar / Aprovar</span>
                        </button>
                      )}

                      {/* Switch to this user */}
                      <button
                        type="button"
                        onClick={() => loginAsUser(regUser)}
                        title="Simular visualização como este usuário"
                        className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-indigo-600/20 hover:text-indigo-300 text-slate-400 border border-slate-700 text-xs flex items-center gap-1 transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Testar Login</span>
                      </button>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => {
                          if (window.confirm(`Deseja remover permanentemente o cadastro de ${regUser.name}?`)) {
                            deleteUser(regUser.id);
                          }
                        }}
                        title="Remover cadastro"
                        className="p-1.5 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
