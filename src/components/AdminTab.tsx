import React, { useState } from 'react';
import { UserAccount, Announcement, CalendarEvent, Homework, SchoolSettings, AuditLog, RoleType } from '../types';
import {
  ShieldCheck,
  Users,
  UserPlus,
  Search,
  CheckCircle,
  XCircle,
  KeyRound,
  Trash2,
  Download,
  RotateCcw,
  Sliders,
  BellRing,
  FileSpreadsheet,
  Activity,
  Award,
  BookOpen,
  Calendar,
  Building2,
  Check,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminTabProps {
  users: UserAccount[];
  announcements: Announcement[];
  events: CalendarEvent[];
  homeworkList: Homework[];
  schoolSettings: SchoolSettings;
  auditLogs: AuditLog[];
  onAddUser: (user: Omit<UserAccount, 'id'>) => void;
  onUpdateUserStatus: (id: string, status: 'active' | 'suspended') => void;
  onResetUserPassword: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onUpdateSettings: (settings: SchoolSettings) => void;
  onResetAllData: () => void;
  onExportData: () => void;
  onDeleteAnnouncement: (id: string) => void;
  onBroadcastUrgentAlert: (title: string, content: string) => void;
}

export default function AdminTab({
  users,
  announcements,
  events,
  homeworkList,
  schoolSettings,
  auditLogs,
  onAddUser,
  onUpdateUserStatus,
  onResetUserPassword,
  onDeleteUser,
  onUpdateSettings,
  onResetAllData,
  onExportData,
  onDeleteAnnouncement,
  onBroadcastUrgentAlert,
}: AdminTabProps) {
  // Navigation inside Admin Cockpit
  const [activeAdminSubTab, setActiveAdminSubTab] = useState<'users' | 'announcements' | 'settings' | 'audit'>('users');
  
  // User search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | RoleType>('all');
  
  // Create user modal state
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('123');
  const [newUserRole, setNewUserRole] = useState<RoleType>('teacher');
  const [newUserDept, setNewUserDept] = useState('');

  // Urgent Broadcast Modal
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastContent, setBroadcastContent] = useState('');

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // KPIs calculations
  const totalUsers = users.length;
  const teachersCount = users.filter(u => u.role === 'teacher').length;
  const studentsCount = users.filter(u => u.role === 'student').length;
  const parentsCount = users.filter(u => u.role === 'parent').length;
  
  // Percentage of announcements confirmed by parents
  const announcementsRequiringConfirmation = announcements.filter(a => a.audience !== 'students');
  const totalConfirmations = announcementsRequiringConfirmation.reduce((acc, a) => acc + (a.confirmedBy.includes('parent') ? 1 : 0), 0);
  const readingConfirmationRate = announcementsRequiringConfirmation.length > 0
    ? Math.round((totalConfirmations / announcementsRequiringConfirmation.length) * 100)
    : 100;

  // Filtered Users
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (u.departmentOrClass && u.departmentOrClass.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    onAddUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      password: newUserPassword || '123',
      role: newUserRole,
      departmentOrClass: newUserDept.trim() || (newUserRole === 'teacher' ? 'Docente' : newUserRole === 'student' ? 'Aluno' : 'Responsável'),
      status: 'active',
      lastAccess: 'Nunca acessou'
    });

    setNewUserName('');
    setNewUserEmail('');
    setNewUserDept('');
    setNewUserPassword('123');
    setIsAddUserModalOpen(false);
    showToast(`Usuário "${newUserName}" cadastrado com sucesso no sistema!`);
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastContent) return;

    onBroadcastUrgentAlert(broadcastTitle, broadcastContent);
    setBroadcastTitle('');
    setBroadcastContent('');
    setIsBroadcastModalOpen(false);
    showToast('Comunicado geral urgente emitido para toda a comunidade escolar!');
  };

  const getRoleBadge = (role: RoleType) => {
    switch (role) {
      case 'admin':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-100 text-indigo-800 border border-indigo-200">ADMINISTRADOR</span>;
      case 'teacher':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-violet-100 text-violet-800 border border-violet-200">PROFESSOR</span>;
      case 'parent':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-200">RESPONSÁVEL</span>;
      case 'student':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-200">ALUNO</span>;
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Toast feedback */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs max-w-md"
          >
            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="font-semibold">{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Institutional Admin Header */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-md border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30 text-white shrink-0">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2.5 py-0.5 rounded-full border border-indigo-500/30">
                PAINEL DA DIRETORIA
              </span>
              <span className="text-xs text-slate-400">
                {schoolSettings.academicYear} • {schoolSettings.currentTerm}
              </span>
            </div>
            <h2 id="admin-titulo" className="text-2xl font-black tracking-tight text-white mt-1">
              Controle Geral do Administrador
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Gestão de usuários, moderação de comunicados e auditoria institucional do {schoolSettings.schoolName}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-2 shadow transition cursor-pointer"
          >
            <BellRing className="w-4 h-4" />
            <span>Alerta Urgente Geral</span>
          </button>

          <button
            onClick={() => setIsAddUserModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow transition cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Usuário</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total de Usuários</span>
            <span className="text-2xl font-black text-slate-900">{totalUsers}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {teachersCount} prof. • {studentsCount} alunos • {parentsCount} pais
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Taxa de Confirmação</span>
            <span className="text-2xl font-black text-slate-900">{readingConfirmationRate}%</span>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              Leituras digitais validadas
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-violet-50 text-violet-600 rounded-xl">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Atividades Ativas</span>
            <span className="text-2xl font-black text-slate-900">{homeworkList.length}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Em andamento neste trimestre
            </p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Eventos Agendados</span>
            <span className="text-2xl font-black text-slate-900">{events.length}</span>
            <p className="text-[11px] text-slate-500 mt-0.5">
              No calendário escolar oficial
            </p>
          </div>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-slate-100 shadow-sm flex flex-wrap gap-2">
        <button
          onClick={() => setActiveAdminSubTab('users')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeAdminSubTab === 'users'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Gestão de Contas ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('announcements')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeAdminSubTab === 'announcements'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <BellRing className="w-4 h-4" />
          <span>Moderação de Comunicados ({announcements.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('audit')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeAdminSubTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Auditoria & Logs ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminSubTab('settings')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs transition flex items-center gap-2 cursor-pointer ${
            activeAdminSubTab === 'settings'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Configurações & Dados</span>
        </button>
      </div>

      {/* Sub-tab 1: User Management */}
      {activeAdminSubTab === 'users' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Usuários e Permissões do Sistema</h3>
              <p className="text-xs text-slate-500">Controle de acesso para administradores, professores, pais e alunos</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar por nome, e-mail ou turma..."
                  className="pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full sm:w-64"
                />
              </div>

              {/* Filter */}
              <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl p-1 text-xs">
                <Filter className="w-3.5 h-3.5 text-slate-400 ml-1" />
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value as any)}
                  className="bg-transparent border-none text-xs font-semibold text-slate-700 focus:outline-none pr-2 cursor-pointer"
                >
                  <option value="all">Todos os Papéis</option>
                  <option value="admin">Administradores</option>
                  <option value="teacher">Professores</option>
                  <option value="parent">Responsáveis</option>
                  <option value="student">Alunos</option>
                </select>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-400 uppercase tracking-wider font-bold text-[10px]">
                  <th className="py-3 px-3">Usuário</th>
                  <th className="py-3 px-3">Papel</th>
                  <th className="py-3 px-3">Turma / Departamento</th>
                  <th className="py-3 px-3">Último Acesso</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 font-medium">
                      Nenhum usuário encontrado para os filtros selecionados.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isSuspended = u.status === 'suspended';
                    return (
                      <tr key={u.id} className="hover:bg-slate-50/70 transition">
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                              {u.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate">{u.name}</p>
                              <p className="text-[11px] text-slate-400 truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {getRoleBadge(u.role)}
                        </td>

                        <td className="py-3 px-3 text-slate-600 font-medium">
                          {u.departmentOrClass || 'Geral'}
                        </td>

                        <td className="py-3 px-3 text-slate-500 whitespace-nowrap">
                          {u.lastAccess || 'Hoje'}
                        </td>

                        <td className="py-3 px-3 whitespace-nowrap">
                          {isSuspended ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200">
                              Suspenso
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              Ativo
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => {
                                onResetUserPassword(u.id);
                                showToast(`Senha de ${u.name} redefinida para o padrão temporário.`);
                              }}
                              className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                              title="Redefinir Senha"
                            >
                              <KeyRound className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => {
                                const newStatus = isSuspended ? 'active' : 'suspended';
                                onUpdateUserStatus(u.id, newStatus);
                                showToast(`Status de ${u.name} alterado para ${newStatus === 'active' ? 'Ativo' : 'Suspenso'}.`);
                              }}
                              className={`p-1.5 rounded-lg transition cursor-pointer ${
                                isSuspended
                                  ? 'text-emerald-600 hover:bg-emerald-50'
                                  : 'text-amber-600 hover:bg-amber-50'
                              }`}
                              title={isSuspended ? 'Reativar Usuário' : 'Suspender Acesso'}
                            >
                              {isSuspended ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                            </button>

                            {u.role !== 'admin' && (
                              <button
                                onClick={() => {
                                  if (confirm(`Deseja realmente remover o usuário "${u.name}" da base de dados escolar?`)) {
                                    onDeleteUser(u.id);
                                    showToast(`Usuário "${u.name}" excluído.`);
                                  }
                                }}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                                title="Excluir Usuário"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Sub-tab 2: Announcements Moderation */}
      {activeAdminSubTab === 'announcements' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Moderação de Comunicados Emitidos</h3>
              <p className="text-xs text-slate-500">Supervisão de mensagens institucionais e acompanhamento de confirmações de leitura</p>
            </div>

            <button
              onClick={() => setIsBroadcastModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center gap-2 transition cursor-pointer"
            >
              <BellRing className="w-4 h-4" />
              <span>Novo Comunicado Oficial</span>
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => {
              const hasParentConfirmed = ann.confirmedBy.includes('parent');
              return (
                <div key={ann.id} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1 max-w-2xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 uppercase">
                        {ann.category}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        Destino: {ann.audience === 'all' ? 'Toda a Escola' : ann.audience === 'parents' ? 'Pais e Responsáveis' : 'Alunos'}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Emissor: <strong className="text-slate-600">{ann.sender}</strong>
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-900">{ann.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-2">{ann.content}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right text-xs">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Leituras Confirmadas</span>
                      <span className={`font-bold ${hasParentConfirmed ? 'text-emerald-600' : 'text-amber-600'}`}>
                        {ann.confirmedBy.length} confirmações
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Deseja remover o comunicado "${ann.title}" da plataforma?`)) {
                          onDeleteAnnouncement(ann.id);
                          showToast(`Comunicado removido.`);
                        }
                      }}
                      className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition cursor-pointer"
                      title="Excluir Comunicado"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Sub-tab 3: Audit Logs */}
      {activeAdminSubTab === 'audit' && (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Trilha de Auditoria e Segurança</h3>
              <p className="text-xs text-slate-500">Registro cronológico de ações sensíveis e interações no portal</p>
            </div>
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
              {auditLogs.length} eventos registrados
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3.5 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-xl bg-slate-100 text-slate-600 shrink-0 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{log.action}</p>
                    <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                      <span>Usuário: <strong>{log.user}</strong></span>
                      <span>•</span>
                      <span>Categoria: <span className="capitalize">{log.category}</span></span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-slate-400 shrink-0 whitespace-nowrap">
                  {new Date(log.timestamp).toLocaleDateString('pt-BR')} às {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sub-tab 4: School Settings & Data */}
      {activeAdminSubTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
            <h3 className="text-base font-bold text-slate-900">Parâmetros da Instituição de Ensino</h3>
            
            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast('Configurações institucionais salvas com sucesso!');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nome da Escola / Instituição</label>
                <input
                  type="text"
                  value={schoolSettings.schoolName}
                  onChange={(e) => onUpdateSettings({ ...schoolSettings, schoolName: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Ano Letivo</label>
                  <input
                    type="text"
                    value={schoolSettings.academicYear}
                    onChange={(e) => onUpdateSettings({ ...schoolSettings, academicYear: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Período / Bimestre Ativo</label>
                  <input
                    type="text"
                    value={schoolSettings.currentTerm}
                    onChange={(e) => onUpdateSettings({ ...schoolSettings, currentTerm: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail da Secretaria</label>
                  <input
                    type="email"
                    value={schoolSettings.contactEmail}
                    onChange={(e) => onUpdateSettings({ ...schoolSettings, contactEmail: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Telefone da Secretaria</label>
                  <input
                    type="text"
                    value={schoolSettings.contactPhone}
                    onChange={(e) => onUpdateSettings({ ...schoolSettings, contactPhone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Endereço Completo</label>
                <input
                  type="text"
                  value={schoolSettings.address}
                  onChange={(e) => onUpdateSettings({ ...schoolSettings, address: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition cursor-pointer"
                >
                  Salvar Alterações
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-900">Exportação e Backup de Dados</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Faça o download do snapshot integral de dados escolares (comunicados, eventos, notas e tarefas) em formato JSON para arquivo de segurança.
              </p>

              <button
                onClick={onExportData}
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Exportar Dados Escolares (JSON)</span>
              </button>
            </div>

            <div className="bg-white rounded-2xl border border-rose-150 shadow-sm p-6 space-y-4">
              <h3 className="text-base font-bold text-rose-900">Restauração de Demonstração</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-sans">
                Restaura todos os registros do protótipo (comunicados, usuários, calendário e mensagens) ao estado inicial previsto para a banca do TCC.
              </p>

              <button
                onClick={() => {
                  if (confirm('Tem certeza de que deseja restaurar todos os dados escolares ao padrão inicial de demonstração?')) {
                    onResetAllData();
                    showToast('Dados restaurados com sucesso para a configuração original de demonstração.');
                  }
                }}
                className="w-full py-2.5 px-4 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restaurar Banco de Demonstração</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cadastrar Novo Usuário */}
      <AnimatePresence>
        {isAddUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">
                    <UserPlus className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Cadastrar Novo Usuário</h3>
                    <p className="text-[11px] text-slate-400">Adicione um novo membro à comunidade escolar</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateUserSubmit} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    placeholder="Ex: Prof. Roberto Andrade"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">E-mail Institucional</label>
                  <input
                    type="email"
                    required
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    placeholder="Ex: roberto@escola.edu.br"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Papel / Nível de Acesso</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value as RoleType)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-slate-900 font-semibold focus:outline-none cursor-pointer"
                    >
                      <option value="teacher">Professor(a)</option>
                      <option value="parent">Responsável (Pai/Mãe)</option>
                      <option value="student">Aluno(a)</option>
                      <option value="admin">Administrador(a)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Senha Inicial</label>
                    <input
                      type="text"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      placeholder="123"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-mono focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Turma, Disciplina ou Setor</label>
                  <input
                    type="text"
                    value={newUserDept}
                    onChange={(e) => setNewUserDept(e.target.value)}
                    placeholder="Ex: Geografia - 8º Ano ou Responsável por Ana"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsAddUserModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold transition cursor-pointer shadow-sm"
                  >
                    Salvar e Criar Conta
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal: Alerta Urgente Geral */}
      <AnimatePresence>
        {isBroadcastModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 text-left"
            >
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                    <BellRing className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Emitir Alerta Urgente Geral</h3>
                    <p className="text-[11px] text-slate-400">Disparo prioritário para professores, alunos e pais</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsBroadcastModalOpen(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleBroadcastSubmit} className="space-y-4 pt-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Título do Alerta</label>
                  <input
                    type="text"
                    required
                    value={broadcastTitle}
                    onChange={(e) => setBroadcastTitle(e.target.value)}
                    placeholder="Ex: 🚨 Suspensão Excepcional das Aulas por Chuva Intensa"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mensagem Oficial</label>
                  <textarea
                    rows={4}
                    required
                    value={broadcastContent}
                    onChange={(e) => setBroadcastContent(e.target.value)}
                    placeholder="Orientações e detalhes para toda a comunidade escolar..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div className="flex gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsBroadcastModalOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold transition cursor-pointer shadow-sm"
                  >
                    Disparar Alerta Imediato
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
