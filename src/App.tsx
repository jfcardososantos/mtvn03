import React, { useState, useEffect } from 'react';
import { RoleType, Announcement, CalendarEvent, Homework, Message, StudentStats, UserAccount, SchoolSettings, AuditLog } from './types';
import {
  initialAnnouncements,
  initialCalendarEvents,
  initialHomework,
  initialMessages,
  initialStudentStats,
  initialUsers,
  initialSchoolSettings,
  initialAuditLogs
} from './initialData';
import AnnouncementsTab from './components/AnnouncementsTab';
import CalendarTab from './components/CalendarTab';
import HomeworkTab from './components/HomeworkTab';
import ChatTab from './components/ChatTab';
import StudentReportTab from './components/StudentReportTab';
import LoginPage from './components/LoginPage';
import AdminTab from './components/AdminTab';
import {
  School,
  Megaphone,
  Calendar,
  BookOpen,
  MessageSquare,
  GraduationCap,
  Bell,
  ChevronRight,
  UserCheck,
  Cpu,
  ShieldCheck,
  LogOut,
  Sparkles,
  Sliders
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  // Roles definitions
  const roles: { type: RoleType; name: string; desc: string; color: string; badge: string }[] = [
    {
      type: 'admin',
      name: 'Administrador (Dra. Mariana)',
      desc: 'Gestão institucional, controle de contas, moderação e auditoria.',
      color: 'border-indigo-500 bg-indigo-500/20 text-indigo-300',
      badge: 'bg-indigo-600 text-white'
    },
    {
      type: 'teacher',
      name: 'Professor (Helena)',
      desc: 'Cria comunicados com auxílio de IA, agenda avaliações e avalia entregas.',
      color: 'border-violet-500 bg-violet-500/20 text-violet-300',
      badge: 'bg-violet-600 text-white'
    },
    {
      type: 'parent',
      name: 'Responsável (Carlos)',
      desc: 'Acompanha comunicados públicos, confirma leitura, monitora notas e tarefas.',
      color: 'border-emerald-500 bg-emerald-500/20 text-emerald-300',
      badge: 'bg-emerald-600 text-white'
    },
    {
      type: 'student',
      name: 'Aluno (Lucas)',
      desc: 'Consulta deveres escolares, assinala tarefas entregues e confere boletim.',
      color: 'border-amber-500 bg-amber-500/20 text-amber-300',
      badge: 'bg-amber-500 text-amber-950'
    }
  ];

  // User Authentication State
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(null);
  const [isLoggedOutExplicitly, setIsLoggedOutExplicitly] = useState(false);

  // Primary navigation tabs
  const [activeTab, setActiveTab] = useState<'admin' | 'announcements' | 'calendar' | 'homework' | 'chat' | 'grades'>('announcements');

  // School Database States
  const [users, setUsers] = useState<UserAccount[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [homeworkList, setHomeworkList] = useState<Homework[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [studentStats, setStudentStats] = useState<StudentStats>(initialStudentStats);
  const [schoolSettings, setSchoolSettings] = useState<SchoolSettings>(initialSchoolSettings);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Active role derived from logged in user or simulation selector
  const [activeRole, setActiveRole] = useState<RoleType>('admin');

  // Simulated live notification banner state
  const [notification, setNotification] = useState<{ title: string; sender: string } | null>(null);

  // Load and bind LocalStorage on mount
  useEffect(() => {
    // 1. Users
    const savedUsers = localStorage.getItem('school_users');
    let loadedUsers = initialUsers;
    if (savedUsers) {
      try { loadedUsers = JSON.parse(savedUsers); } catch (e) { loadedUsers = initialUsers; }
    } else {
      localStorage.setItem('school_users', JSON.stringify(initialUsers));
    }
    setUsers(loadedUsers);

    // 2. Current Session
    const savedSession = localStorage.getItem('school_current_session');
    if (savedSession) {
      try {
        const parsedSession: UserAccount = JSON.parse(savedSession);
        // ensure user exists in loaded users
        const match = loadedUsers.find(u => u.id === parsedSession.id) || parsedSession;
        setCurrentUser(match);
        setActiveRole(match.role);
        if (match.role === 'admin') setActiveTab('admin');
      } catch (e) {
        setCurrentUser(loadedUsers[0]);
        setActiveRole(loadedUsers[0].role);
      }
    } else {
      // By default for quick testing, start with admin session or show login
      // Let's start with admin session so the user directly experiences the portal, but can logout any time!
      const defaultAdmin = loadedUsers[0];
      setCurrentUser(defaultAdmin);
      setActiveRole('admin');
      setActiveTab('admin');
      localStorage.setItem('school_current_session', JSON.stringify(defaultAdmin));
    }

    // 3. Announcements
    const savedAnn = localStorage.getItem('school_announcements');
    if (savedAnn) setAnnouncements(JSON.parse(savedAnn));
    else {
      setAnnouncements(initialAnnouncements);
      localStorage.setItem('school_announcements', JSON.stringify(initialAnnouncements));
    }

    // 4. Events
    const savedEvents = localStorage.getItem('school_events');
    if (savedEvents) setEvents(JSON.parse(savedEvents));
    else {
      setEvents(initialCalendarEvents);
      localStorage.setItem('school_events', JSON.stringify(initialCalendarEvents));
    }

    // 5. Homework
    const savedHw = localStorage.getItem('school_homework');
    if (savedHw) setHomeworkList(JSON.parse(savedHw));
    else {
      setHomeworkList(initialHomework);
      localStorage.setItem('school_homework', JSON.stringify(initialHomework));
    }

    // 6. Messages
    const savedMsg = localStorage.getItem('school_messages');
    if (savedMsg) setMessages(JSON.parse(savedMsg));
    else {
      setMessages(initialMessages);
      localStorage.setItem('school_messages', JSON.stringify(initialMessages));
    }

    // 7. School Settings
    const savedSettings = localStorage.getItem('school_settings');
    if (savedSettings) setSchoolSettings(JSON.parse(savedSettings));
    else {
      setSchoolSettings(initialSchoolSettings);
      localStorage.setItem('school_settings', JSON.stringify(initialSchoolSettings));
    }

    // 8. Audit Logs
    const savedLogs = localStorage.getItem('school_audit_logs');
    if (savedLogs) setAuditLogs(JSON.parse(savedLogs));
    else {
      setAuditLogs(initialAuditLogs);
      localStorage.setItem('school_audit_logs', JSON.stringify(initialAuditLogs));
    }
  }, []);

  // Sync methods
  const saveUsers = (newUsers: UserAccount[]) => {
    setUsers(newUsers);
    localStorage.setItem('school_users', JSON.stringify(newUsers));
  };

  const saveAnnouncements = (newAnn: Announcement[]) => {
    setAnnouncements(newAnn);
    localStorage.setItem('school_announcements', JSON.stringify(newAnn));
  };

  const saveEvents = (newEv: CalendarEvent[]) => {
    setEvents(newEv);
    localStorage.setItem('school_events', JSON.stringify(newEv));
  };

  const saveHomework = (newHw: Homework[]) => {
    setHomeworkList(newHw);
    localStorage.setItem('school_homework', JSON.stringify(newHw));
  };

  const saveMessages = (newMsg: Message[]) => {
    setMessages(newMsg);
    localStorage.setItem('school_messages', JSON.stringify(newMsg));
  };

  const saveSettings = (newSettings: SchoolSettings) => {
    setSchoolSettings(newSettings);
    localStorage.setItem('school_settings', JSON.stringify(newSettings));
  };

  const saveAuditLogs = (newLogs: AuditLog[]) => {
    setAuditLogs(newLogs);
    localStorage.setItem('school_audit_logs', JSON.stringify(newLogs));
  };

  const logAction = (action: string, category: 'academic' | 'communication' | 'security' | 'system') => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      user: currentUser ? currentUser.name : 'Sistema',
      role: activeRole,
      action: action,
      timestamp: new Date().toISOString(),
      category: category
    };
    saveAuditLogs([newLog, ...auditLogs]);
  };

  // Login handler
  const handleLogin = (user: UserAccount) => {
    setCurrentUser(user);
    setActiveRole(user.role);
    setIsLoggedOutExplicitly(false);
    localStorage.setItem('school_current_session', JSON.stringify(user));
    
    // Automatically navigate to appropriate tab
    if (user.role === 'admin') {
      setActiveTab('admin');
    } else {
      setActiveTab('announcements');
    }

    logAction(`Login efetuado pelo usuário ${user.name} (${user.email})`, 'security');
  };

  // Logout handler
  const handleLogout = () => {
    if (currentUser) {
      logAction(`Logout efetuado por ${currentUser.name}`, 'security');
    }
    setCurrentUser(null);
    setIsLoggedOutExplicitly(true);
    localStorage.removeItem('school_current_session');
  };

  // Switch role simulator helper
  const handleSwitchSimulatorRole = (role: RoleType) => {
    setActiveRole(role);
    // Find matching user for role to keep profile consistent
    const matchingUser = users.find(u => u.role === role) || {
      id: `usr-${role}`,
      name: role === 'admin' ? 'Dra. Mariana Vasconcelos' : role === 'teacher' ? 'Prof.ª Helena Silva' : role === 'parent' ? 'Carlos Eduardo Silva' : 'Lucas Silva',
      email: `${role}@escola.edu.br`,
      role: role,
      status: 'active' as const
    };
    setCurrentUser(matchingUser);
    localStorage.setItem('school_current_session', JSON.stringify(matchingUser));
    
    if (role === 'admin') {
      setActiveTab('admin');
    } else if (activeTab === 'admin') {
      setActiveTab('announcements');
    }
  };

  // Announcements Handlers
  const handleAddAnnouncement = (newAnn: Omit<Announcement, 'id' | 'date' | 'confirmedBy'>) => {
    const item: Announcement = {
      ...newAnn,
      id: `ann-${Date.now()}`,
      date: new Date().toISOString(),
      confirmedBy: []
    };
    saveAnnouncements([item, ...announcements]);

    // Live push alert
    setNotification({
      title: item.title,
      sender: item.sender
    });

    setTimeout(() => {
      setNotification(null);
    }, 5000);

    logAction(`Publicado novo comunicado oficial: "${item.title}"`, 'communication');
  };

  const handleConfirmRead = (id: string, role: RoleType) => {
    const targetAnn = announcements.find(a => a.id === id);
    const updated = announcements.map(ann => {
      if (ann.id === id) {
        const confirmedSet = new Set([...ann.confirmedBy, role]);
        return { ...ann, confirmedBy: Array.from(confirmedSet) };
      }
      return ann;
    });
    saveAnnouncements(updated);

    if (targetAnn) {
      logAction(`Confirmação digital de leitura registrada para: "${targetAnn.title}"`, 'communication');
    }
  };

  const handleDeleteAnnouncement = (id: string) => {
    const ann = announcements.find(a => a.id === id);
    const updated = announcements.filter(a => a.id !== id);
    saveAnnouncements(updated);
    if (ann) {
      logAction(`Comunicado excluído: "${ann.title}"`, 'communication');
    }
  };

  const handleBroadcastUrgentAlert = (title: string, content: string) => {
    const urgentAnn: Announcement = {
      id: `ann-${Date.now()}`,
      title: title,
      content: content,
      date: new Date().toISOString(),
      category: 'urgent',
      sender: 'Dra. Mariana Vasconcelos (Diretoria)',
      audience: 'all',
      confirmedBy: []
    };
    saveAnnouncements([urgentAnn, ...announcements]);

    setNotification({
      title: `🚨 ${title}`,
      sender: 'Diretoria Geral (Urgente)'
    });

    logAction(`Alerta urgente geral disparado para toda a comunidade escolar: "${title}"`, 'communication');
  };

  // Events Handlers
  const handleAddEvent = (newEvent: Omit<CalendarEvent, 'id'>) => {
    const item: CalendarEvent = {
      ...newEvent,
      id: `ev-${Date.now()}`
    };
    saveEvents([...events, item]);
    logAction(`Novo evento agendado no calendário: "${item.title}" em ${item.date}`, 'academic');
  };

  const handleDeleteEvent = (id: string) => {
    const ev = events.find(e => e.id === id);
    const updated = events.filter(e => e.id !== id);
    saveEvents(updated);
    if (ev) {
      logAction(`Evento removido do calendário: "${ev.title}"`, 'academic');
    }
  };

  // Homework Handlers
  const handleAddHomework = (newHw: Omit<Homework, 'id' | 'completedBy'>) => {
    const item: Homework = {
      ...newHw,
      id: `hw-${Date.now()}`,
      completedBy: []
    };
    saveHomework([item, ...homeworkList]);
    logAction(`Nova atividade atribuída: "${item.title}" (${item.subject})`, 'academic');
  };

  const handleToggleCompleteHomework = (id: string, role: RoleType) => {
    const updated = homeworkList.map(hw => {
      if (hw.id === id) {
        const completed = hw.completedBy.includes(role)
          ? hw.completedBy.filter(r => r !== role)
          : [...hw.completedBy, role];
        return { ...hw, completedBy: completed };
      }
      return hw;
    });
    saveHomework(updated);

    const hw = homeworkList.find(h => h.id === id);
    if (hw) {
      logAction(`Status de entrega de tarefa alterado para "${hw.title}"`, 'academic');
    }
  };

  const handleDeleteHomework = (id: string) => {
    const hw = homeworkList.find(h => h.id === id);
    const updated = homeworkList.filter(h => h.id !== id);
    saveHomework(updated);
    if (hw) {
      logAction(`Atividade removida: "${hw.title}"`, 'academic');
    }
  };

  // Chat Handler
  const handleSendMessage = (text: string, receiverRole: RoleType) => {
    const senderName = currentUser ? currentUser.name : (
      activeRole === 'admin' ? 'Dra. Mariana (Diretoria)' :
      activeRole === 'teacher' ? 'Prof.ª Helena Silva' :
      activeRole === 'parent' ? 'Sr. Carlos' : 'Lucas'
    );

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      sender: senderName,
      senderRole: activeRole,
      receiverRole: receiverRole,
      text: text,
      timestamp: new Date().toISOString()
    };
    saveMessages([...messages, newMsg]);
    logAction(`Mensagem enviada por ${senderName} para ${receiverRole}`, 'communication');
  };

  // User Management Handlers (Admin)
  const handleAddUser = (newUserData: Omit<UserAccount, 'id'>) => {
    const newUser: UserAccount = {
      ...newUserData,
      id: `usr-${Date.now()}`
    };
    saveUsers([...users, newUser]);
    logAction(`Novo usuário cadastrado na base escolar: ${newUser.name} (${newUser.role})`, 'security');
  };

  const handleUpdateUserStatus = (id: string, status: 'active' | 'suspended') => {
    const updated = users.map(u => u.id === id ? { ...u, status } : u);
    saveUsers(updated);
    const u = users.find(x => x.id === id);
    if (u) {
      logAction(`Status do usuário ${u.name} alterado para "${status}"`, 'security');
    }
  };

  const handleResetUserPassword = (id: string) => {
    const updated = users.map(u => u.id === id ? { ...u, password: '123' } : u);
    saveUsers(updated);
    const u = users.find(x => x.id === id);
    if (u) {
      logAction(`Senha do usuário ${u.name} redefinida para o valor temporário`, 'security');
    }
  };

  const handleDeleteUser = (id: string) => {
    const targetUser = users.find(u => u.id === id);
    const updated = users.filter(u => u.id !== id);
    saveUsers(updated);
    if (targetUser) {
      logAction(`Conta do usuário ${targetUser.name} excluída permanentemente`, 'security');
    }
  };

  // Reset & Export Database
  const handleResetAllData = () => {
    setUsers(initialUsers);
    setAnnouncements(initialAnnouncements);
    setEvents(initialCalendarEvents);
    setHomeworkList(initialHomework);
    setMessages(initialMessages);
    setSchoolSettings(initialSchoolSettings);
    setAuditLogs(initialAuditLogs);
    setStudentStats(initialStudentStats);

    localStorage.setItem('school_users', JSON.stringify(initialUsers));
    localStorage.setItem('school_announcements', JSON.stringify(initialAnnouncements));
    localStorage.setItem('school_events', JSON.stringify(initialCalendarEvents));
    localStorage.setItem('school_homework', JSON.stringify(initialHomework));
    localStorage.setItem('school_messages', JSON.stringify(initialMessages));
    localStorage.setItem('school_settings', JSON.stringify(initialSchoolSettings));
    localStorage.setItem('school_audit_logs', JSON.stringify(initialAuditLogs));

    setCurrentUser(initialUsers[0]);
    setActiveRole('admin');
    setActiveTab('admin');
    localStorage.setItem('school_current_session', JSON.stringify(initialUsers[0]));

    logAction('Restauração de todos os dados escolares ao padrão de demonstração', 'system');
  };

  const handleExportData = () => {
    const fullBackup = {
      schoolSettings,
      users,
      announcements,
      events,
      homeworkList,
      messages,
      studentStats,
      auditLogs,
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullBackup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `EduConnect_Backup_${schoolSettings.academicYear}_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    logAction('Backup dos dados escolares exportado em JSON', 'system');
  };

  // Badge counters
  const unreadAnnouncementsCount = announcements.filter(ann => {
    if (activeRole === 'student' && ann.audience === 'parents') return false;
    if (activeRole === 'parent' && ann.audience === 'students') return false;
    return !ann.confirmedBy.includes(activeRole);
  }).length;

  const pendingHomeworkCount = homeworkList.filter(hw => !hw.completedBy.includes('student')).length;

  // Render Login Page if user is explicitly logged out
  if (!currentUser || isLoggedOutExplicitly) {
    return (
      <LoginPage
        onLogin={handleLogin}
        users={users.length > 0 ? users : initialUsers}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 transition-all flex flex-col justify-between">
      
      {/* Live Push Notification Banner */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 right-4 z-50 bg-indigo-900 text-white p-4 rounded-2xl shadow-2xl flex items-start gap-3 border border-indigo-700 max-w-sm backdrop-blur-md"
          >
            <div className="p-2.5 bg-indigo-800 rounded-xl text-indigo-300 shrink-0">
              <Bell className="w-5 h-5 animate-bounce" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest block">Notificação Push Imediata</span>
              <h4 className="font-bold text-sm leading-tight mt-0.5">{notification.title}</h4>
              <p className="text-xs text-indigo-200 mt-1 lines-clamp-2">Emitido por: {notification.sender}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        {/* Main Header */}
        <header className="bg-slate-900 text-slate-100 shadow-md border-b border-slate-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* School Logo & Project Info */}
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-600 rounded-2xl shadow border border-indigo-500/20 text-white">
                <School className="w-6 h-6" />
              </div>
              <div>
                <h1 id="app-logo-titulo" className="text-lg font-black tracking-tight flex items-center gap-2">
                  EduConnect <span className="text-[10px] bg-indigo-500/30 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-500/20">PROJETO TCC</span>
                </h1>
                <p className="text-[11px] text-slate-400">{schoolSettings.schoolName}</p>
              </div>
            </div>

            {/* User Profile & Actions in Header */}
            <div className="flex items-center gap-3 shrink-0">
              {unreadAnnouncementsCount > 0 && (
                <div className="hidden sm:flex px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-[11px] font-bold text-red-400 items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>{unreadAnnouncementsCount} avisos</span>
                </div>
              )}

              {/* Logged-in User Chip */}
              <div className="flex items-center gap-2.5 bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 rounded-2xl text-xs">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="text-left hidden sm:block">
                  <p className="font-bold text-slate-200 text-xs truncate max-w-[130px]">{currentUser.name}</p>
                  <span className="text-[10px] text-indigo-300 capitalize font-medium">
                    {currentUser.role === 'admin' ? 'Administrador(a)' : currentUser.role === 'teacher' ? 'Professora' : currentUser.role === 'parent' ? 'Responsável' : 'Aluno'}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                id="btn-logout"
                onClick={handleLogout}
                className="px-3 py-2 bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-900 border border-slate-700 text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Sair do portal ou alternar usuário"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Sair</span>
              </button>
            </div>
          </div>

          {/* Quick Simulator Role Selector Banner (Essential for TCC Jury Evaluation) */}
          <div className="bg-slate-950 px-4 py-2 text-slate-300 border-t border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-2 text-slate-400">
              <UserCheck className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="font-semibold">Simulador Instantâneo de Papéis (Banca do TCC):</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {roles.map((r) => {
                const isActive = activeRole === r.type;
                return (
                  <button
                    key={r.type}
                    id={`role-btn-${r.type}`}
                    onClick={() => handleSwitchSimulatorRole(r.type)}
                    className={`px-3 py-1.5 rounded-xl border font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isActive 
                        ? r.color + ' shadow ring-1 ring-white/10' 
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                    }`}
                    title={r.desc}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-indigo-400 animate-ping' : 'bg-slate-500'}`} />
                    <span>{r.name.split(' (')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Main Content Layout */}
        <main className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Sidebar Navigation */}
            <section id="sidebar-navegacao" className="lg:col-span-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-100 space-y-2">
              <div className="p-2 border-b border-slate-50 mb-2 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">Acesso Operacional</span>
                  <p className="text-xs text-indigo-600 font-extrabold mt-0.5 capitalize">
                    {activeRole === 'admin' ? 'Administrador(a)' : activeRole === 'teacher' ? 'Professora' : activeRole === 'parent' ? 'Responsável' : 'Aluno'}
                  </p>
                </div>
                {activeRole === 'admin' && (
                  <span className="p-1 px-1.5 bg-indigo-50 text-indigo-700 rounded text-[9px] font-black border border-indigo-200">
                    MASTER
                  </span>
                )}
              </div>

              {/* Admin Tab (Special Highlight for Administrator) */}
              <button
                id="tab-admin"
                onClick={() => setActiveTab('admin')}
                className={`w-full p-3.5 rounded-xl flex items-center justify-between text-left transition text-sm font-bold cursor-pointer group ${
                  activeTab === 'admin'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <ShieldCheck className={`w-5 h-5 ${activeTab === 'admin' ? 'text-indigo-400' : 'text-indigo-600 group-hover:text-indigo-700'}`} />
                  <span>Painel do Administrador</span>
                </div>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded ${activeTab === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  ADM
                </span>
              </button>

              <button
                id="tab-comunicados"
                onClick={() => setActiveTab('announcements')}
                className={`w-full p-3.5 rounded-xl flex items-center justify-between text-left transition text-sm font-bold cursor-pointer group ${
                  activeTab === 'announcements'
                    ? 'bg-indigo-50 text-indigo-700 border-none'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Megaphone className={`w-5 h-5 ${activeTab === 'announcements' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>Comunicados</span>
                </div>
                {unreadAnnouncementsCount > 0 && (
                  <span className="px-2 py-0.5 text-[10px] font-black bg-red-500 text-white rounded-full">
                    {unreadAnnouncementsCount}
                  </span>
                )}
              </button>

              <button
                id="tab-calendario"
                onClick={() => setActiveTab('calendar')}
                className={`w-full p-3.5 rounded-xl flex items-center justify-between text-left transition text-sm font-bold cursor-pointer group ${
                  activeTab === 'calendar'
                    ? 'bg-indigo-50 text-indigo-700 border-none'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Calendar className={`w-5 h-5 ${activeTab === 'calendar' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>Calendário Escolar</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                id="tab-deveres"
                onClick={() => setActiveTab('homework')}
                className={`w-full p-3.5 rounded-xl flex items-center justify-between text-left transition text-sm font-bold cursor-pointer group ${
                  activeTab === 'homework'
                    ? 'bg-indigo-50 text-indigo-700 border-none'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <BookOpen className={`w-5 h-5 ${activeTab === 'homework' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>Deveres e Atividades</span>
                </div>
                {pendingHomeworkCount > 0 && activeRole !== 'teacher' && activeRole !== 'admin' && (
                  <span className="px-2 py-0.5 text-[10px] font-black bg-amber-500 text-amber-950 rounded-full">
                    {pendingHomeworkCount}
                  </span>
                )}
              </button>

              <button
                id="tab-chat"
                onClick={() => setActiveTab('chat')}
                className={`w-full p-3.5 rounded-xl flex items-center justify-between text-left transition text-sm font-bold cursor-pointer group ${
                  activeTab === 'chat'
                    ? 'bg-indigo-50 text-indigo-700 border-none'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MessageSquare className={`w-5 h-5 ${activeTab === 'chat' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>Chat Seguro</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                id="tab-boletim"
                onClick={() => setActiveTab('grades')}
                className={`w-full p-3.5 rounded-xl flex items-center justify-between text-left transition text-sm font-bold cursor-pointer group ${
                  activeTab === 'grades'
                    ? 'bg-indigo-50 text-indigo-700 border-none'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <GraduationCap className={`w-5 h-5 ${activeTab === 'grades' ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span>Boletim & Notas</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>

              {/* TCC Sandbox Context */}
              <div className="pt-4 mt-4 border-t border-slate-100 text-[11px] text-slate-400 space-y-2">
                <div className="flex items-center gap-1.5 font-semibold text-slate-600">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Ambiente Interativo TCC</span>
                </div>
                <p className="leading-relaxed font-sans">
                  Alternar entre os papéis no topo atualiza dinamicamente as permissões em tempo real. Os dados são salvos localmente.
                </p>
              </div>
            </section>

            {/* Primary Dynamic Content Area */}
            <section id="conteudo-principal" className="lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                >
                  {/* Admin Tab View */}
                  {activeTab === 'admin' && (
                    <AdminTab
                      users={users}
                      announcements={announcements}
                      events={events}
                      homeworkList={homeworkList}
                      schoolSettings={schoolSettings}
                      auditLogs={auditLogs}
                      onAddUser={handleAddUser}
                      onUpdateUserStatus={handleUpdateUserStatus}
                      onResetUserPassword={handleResetUserPassword}
                      onDeleteUser={handleDeleteUser}
                      onUpdateSettings={saveSettings}
                      onResetAllData={handleResetAllData}
                      onExportData={handleExportData}
                      onDeleteAnnouncement={handleDeleteAnnouncement}
                      onBroadcastUrgentAlert={handleBroadcastUrgentAlert}
                    />
                  )}

                  {/* Announcements Tab View */}
                  {activeTab === 'announcements' && (
                    <AnnouncementsTab
                      announcements={announcements}
                      role={activeRole}
                      onAddAnnouncement={handleAddAnnouncement}
                      onConfirmRead={handleConfirmRead}
                      onDeleteAnnouncement={handleDeleteAnnouncement}
                    />
                  )}

                  {/* Calendar Tab View */}
                  {activeTab === 'calendar' && (
                    <CalendarTab
                      events={events}
                      role={activeRole}
                      onAddEvent={handleAddEvent}
                      onDeleteEvent={handleDeleteEvent}
                    />
                  )}

                  {/* Homework Tab View */}
                  {activeTab === 'homework' && (
                    <HomeworkTab
                      homeworkList={homeworkList}
                      role={activeRole}
                      onAddHomework={handleAddHomework}
                      onToggleCompleteHomework={handleToggleCompleteHomework}
                      onDeleteHomework={handleDeleteHomework}
                    />
                  )}

                  {/* Chat Tab View */}
                  {activeTab === 'chat' && (
                    <ChatTab
                      messages={messages}
                      role={activeRole}
                      onSendMessage={handleSendMessage}
                    />
                  )}

                  {/* Grades & Reports Tab View */}
                  {activeTab === 'grades' && (
                    <StudentReportTab
                      stats={studentStats}
                      role={activeRole}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </section>
          </div>
        </main>
      </div>

      {/* Institutional Footer */}
      <footer className="bg-slate-900 text-slate-400 mt-16 border-t border-slate-800 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
          <div className="space-y-1">
            <p className="font-extrabold text-slate-200">{schoolSettings.schoolName} — EduConnect</p>
            <p className="font-sans leading-normal">
              Sistema de Comunicação Escolar Integrado com Gestão Administrativa, Calendário com Notificações e Boletim Acadêmico.
            </p>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-indigo-400 font-bold">
            <Cpu className="w-4 h-4 animate-pulse shrink-0" />
            <span>Projeto de Conclusão de Curso (TCC)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
