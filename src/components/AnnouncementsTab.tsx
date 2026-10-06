import React, { useState } from 'react';
import { Announcement, CategoryType, AudienceType, RoleType } from '../types';
import { Megaphone, Bell, Shield, Users, CheckCircle, Brain, RefreshCw, Send, Trash2, Search, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AnnouncementsTabProps {
  announcements: Announcement[];
  role: RoleType;
  onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date' | 'confirmedBy'>) => void;
  onConfirmRead: (id: string, role: RoleType) => void;
  onDeleteAnnouncement: (id: string) => void;
}

export default function AnnouncementsTab({
  announcements,
  role,
  onAddAnnouncement,
  onConfirmRead,
  onDeleteAnnouncement,
}: AnnouncementsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [audienceFilter, setAudienceFilter] = useState<string>('all');
  
  // Create announcement state
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryType>('info');
  const [newAudience, setNewAudience] = useState<AudienceType>('all');
  
  // AI draft assistant state
  const [aiPrompt, setAiPrompt] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuccessMsg, setAiSuccessMsg] = useState('');

  // Toast notifications for user confirmations
  const [feedbackToast, setFeedbackToast] = useState<{ title: string; type: 'success' | 'info' } | null>(null);

  const handleConfirmReadClick = (id: string, annTitle: string) => {
    onConfirmRead(id, role);
    setFeedbackToast({
      title: `Leitura do comunicado "${annTitle}" confirmada com sucesso na secretaria escolar!`,
      type: 'success'
    });
    setTimeout(() => {
      setFeedbackToast(null);
    }, 4500);
  };

  // Handle AI generation
  const handleGenerateAiDraft = async () => {
    if (!aiPrompt) {
      setAiError('Por favor, informe o assunto principal do comunicado para o assistente.');
      return;
    }
    
    setIsAiGenerating(true);
    setAiError('');
    setAiSuccessMsg('');
    
    try {
      const resp = await fetch('/api/generate-announcement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiPrompt,
          category: newCategory === 'urgent' ? 'Urgente' : newCategory === 'alert' ? 'Alerta' : 'Informativo',
          audience: newAudience === 'parents' ? 'Pais e Responsáveis' : newAudience === 'students' ? 'Alunos' : 'Toda a comunidade escolar',
          additionalNotes: 'Redigir em tom acolhedor e profissional.'
        })
      });
      
      const data = await resp.json();
      if (data.text) {
        setNewContent(data.text);
        setAiSuccessMsg(data.warning ? `⚠️ ${data.warning}` : '✨ Rascunho profissional criado pela IA com sucesso!');
        if (!newTitle) {
          setNewTitle(aiPrompt.slice(0, 45) + (aiPrompt.length > 45 ? '...' : ''));
        }
      } else {
        throw new Error('Retorno vazio da API');
      }
    } catch (e) {
      setAiError('Falha ao conectar ao assistente de IA. Rascunho gerado localmente como alternativa.');
      setNewContent(`Prezada Comunidade Escolar,\n\nRelativo ao assunto "${aiPrompt}", informamos que todos os detalhes pertinentes estão sendo organizados e serão resolvidos no nosso calendário escolar.\n\nContamos com o apoio de todos.\n\nAtenciosamente, Coordenação Pedagógica.`);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;
    
    onAddAnnouncement({
      title: newTitle,
      content: newContent,
      category: newCategory,
      sender: role === 'teacher' ? 'Prof.ª Helena Silva' : 'Escola',
      audience: newAudience,
    });
    
    // Clear form
    setNewTitle('');
    setNewContent('');
    setNewCategory('info');
    setNewAudience('all');
    setAiPrompt('');
    setAiSuccessMsg('');
    setIsCreating(false);
  };

  // Filtering logic
  const filteredAnnouncements = announcements.filter(ann => {
    const matchesSearch = ann.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ann.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || ann.category === categoryFilter;
    
    // Audience filter based on user role or custom filter
    let matchesAudience = true;
    if (audienceFilter !== 'all') {
      matchesAudience = ann.audience === audienceFilter;
    } else {
      // Natural restriction: students don't see parent-only announcements, etc. (unless administrator)
      if (role === 'student' && ann.audience === 'parents') matchesAudience = false;
      if (role === 'parent' && ann.audience === 'students') matchesAudience = false;
    }
    
    return matchesSearch && matchesCategory && matchesAudience;
  });

  const getCategoryTheme = (cat: CategoryType) => {
    switch (cat) {
      case 'urgent':
        return {
          bg: 'bg-red-50 border-red-200 text-red-700',
          badge: 'bg-red-600 text-white',
          pulse: 'bg-red-500'
        };
      case 'alert':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-700',
          badge: 'bg-amber-500 text-amber-950',
          pulse: 'bg-amber-400'
        };
      case 'info':
      default:
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          badge: 'bg-emerald-600 text-white',
          pulse: 'bg-emerald-400'
        };
    }
  };

  const getAudienceLabel = (aud: AudienceType) => {
    switch (aud) {
      case 'parents': return 'Pais / Responsáveis';
      case 'students': return 'Apenas Alunos';
      case 'all': default: return 'Todos';
    }
  };

  return (
    <div className="space-y-6 relative">
      {/* Visual Dynamic Toast of confirmation for TCC validation */}
      <AnimatePresence>
        {feedbackToast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 bg-emerald-900 text-white px-5 py-4 rounded-2xl shadow-2xl border border-emerald-700 flex items-center gap-3.5 max-w-md w-full"
          >
            <div className="p-2.5 bg-emerald-800 rounded-xl text-white">
              <CheckCircle className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-extrabold text-emerald-300 uppercase tracking-widest">Confirmação Digital</p>
              <p className="text-xs font-medium text-slate-100 mt-0.5 leading-normal">{feedbackToast.title}</p>
            </div>
            <button
              onClick={() => setFeedbackToast(null)}
              className="text-emerald-300 hover:text-white font-bold text-sm"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <Megaphone className="w-6 h-6" />
          </div>
          <div>
            <h2 id="comunicados-titulo" className="text-xl font-bold text-slate-900 tracking-tight">Comunicados Oficiais</h2>
            <p className="text-sm text-slate-500">Avisos importantes em tempo real para a comunidade escolar</p>
          </div>
        </div>

        {(role === 'teacher' || role === 'admin') && (
          <button
            id="btn-criar-comunicado"
            onClick={() => setIsCreating(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl transition-all shadow-sm font-medium hover:scale-[1.02]"
          >
            <Bell className="w-5 h-5" />
            Novo Comunicado
          </button>
        )}
      </div>

      {/* Creation Modal */}
      <AnimatePresence>
        {isCreating && (
          <div id="modal-comunicado" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-900">Publicar Novo Comunicado</h3>
                <button
                  onClick={() => setIsCreating(false)}
                  className="p-1 px-3 text-sm font-medium text-slate-400 hover:text-slate-600 border border-slate-100 rounded-lg hover:bg-slate-50"
                >
                  Fechar
                </button>
              </div>

              <form onSubmit={handlePublish} className="p-6 space-y-5">
                {/* AI Assistant Sub-section */}
                <div className="bg-gradient-to-br from-indigo-50 to-violet-50 p-4 rounded-xl border border-indigo-100 space-y-3">
                  <div className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-indigo-600 animate-pulse" />
                    <h4 className="font-semibold text-indigo-950 text-sm">Assistente de Redação Inteligente (IA)</h4>
                  </div>
                  <p className="text-xs text-indigo-700">Digite uma ideia simples e a IA redige um comunicado profissional formal de coordenador para você.</p>
                  
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Ex: Reunião sobre passeios no dia 15..."
                      className="flex-1 bg-white text-slate-900 placeholder:text-slate-400 border border-indigo-200 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleGenerateAiDraft}
                      disabled={isAiGenerating}
                      className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg text-sm font-medium transition disabled:opacity-60 cursor-pointer"
                    >
                      {isAiGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Brain className="w-4 h-4" />}
                      Gerar
                    </button>
                  </div>
                  {aiError && <p className="text-xs text-red-600 font-medium">{aiError}</p>}
                  {aiSuccessMsg && <p className="text-xs text-indigo-600 font-semibold">{aiSuccessMsg}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Prioridade / Categoria</label>
                    <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200 gap-1">
                      {(['info', 'alert', 'urgent'] as CategoryType[]).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setNewCategory(cat)}
                          className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all ${
                            newCategory === cat
                              ? cat === 'urgent' ? 'bg-red-600 text-white shadow-sm'
                                : cat === 'alert' ? 'bg-amber-500 text-amber-950 shadow-sm'
                                : 'bg-emerald-600 text-white shadow-sm'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {cat === 'urgent' ? 'Urgente' : cat === 'alert' ? 'Alerta' : 'Info'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Destinado a</label>
                    <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200 gap-1">
                      {(['all', 'parents', 'students'] as AudienceType[]).map((aud) => (
                        <button
                          key={aud}
                          type="button"
                          onClick={() => setNewAudience(aud)}
                          className={`flex-1 text-center py-1.5 text-xs font-semibold rounded-lg transition-all ${
                            newAudience === aud
                              ? 'bg-slate-800 text-white shadow'
                              : 'text-slate-600 hover:bg-slate-200'
                          }`}
                        >
                          {aud === 'all' ? 'Todos' : aud === 'parents' ? 'Pais' : 'Alunos'}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Título do Comunicado</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Ex: Comunicado Mensal ou Alteração de Horário"
                    className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wider">Conteúdo</label>
                  <textarea
                    required
                    rows={6}
                    value={newContent}
                    onChange={(e) => setNewContent(e.target.value)}
                    placeholder="Descreva detalhadamente o comunicado institucional..."
                    className="w-full bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-white focus:outline-none transition font-sans"
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsCreating(false)}
                    className="flex-1 py-3 text-center text-sm font-semibold border border-slate-200 rounded-xl hover:bg-slate-50 transition text-slate-700"
                  >
                    Descartar Rascunho
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 text-center text-sm font-semibold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition flex items-center justify-center gap-2 shadow"
                  >
                    <Send className="w-4 h-4" />
                    Publicar Agora
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Filtering Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Buscar comunicados..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 text-slate-900 placeholder:text-slate-400 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
        </div>

        {/* Priority Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full py-2 px-3 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">Prioridade: Todos</option>
            <option value="urgent">Vermelho: Urgentes</option>
            <option value="alert">Amarelo: Alertas</option>
            <option value="info">Verde: Informativos</option>
          </select>
        </div>

        {/* Audience Filter */}
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={audienceFilter}
            onChange={(e) => setAudienceFilter(e.target.value)}
            className="w-full py-2 px-3 text-sm bg-slate-50 text-slate-900 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
          >
            <option value="all">Público: Todos</option>
            <option value="parents">Apenas Pais / Responsáveis</option>
            <option value="students">Apenas Alunos</option>
          </select>
        </div>
      </div>

      {/* Floating alert for newly uploaded in current demo (simulated real-time) */}
      {announcements.length > 0 && announcements[0].sender === 'Prof.ª Helena Silva' && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 p-3 px-4 bg-indigo-50 border border-indigo-100 rounded-xl text-xs text-indigo-700 font-medium shadow-sm transition-all"
        >
          <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping" />
          <span>Sincronizado em tempo real. Novos comunicados aparecem automaticamente no painel de pais e alunos.</span>
        </motion.div>
      )}

      {/* Announcements List Container */}
      <div className="space-y-4">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-medium">Nenhum comunicado encontrado para os filtros selecionados.</p>
          </div>
        ) : (
          filteredAnnouncements.map((ann) => {
            const configObj = getCategoryTheme(ann.category);
            const alreadyConfirmed = ann.confirmedBy.includes(role);
            
            return (
              <motion.div
                key={ann.id}
                layout
                id={`comunicado-${ann.id}`}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transform transition hover:shadow-md"
              >
                {/* Accent Priority Header Indicator */}
                <div className={`h-1.5 w-full ${ann.category === 'urgent' ? 'bg-red-500' : ann.category === 'alert' ? 'bg-amber-400' : 'bg-emerald-500'}`} />
                
                <div className="p-6 space-y-4">
                  {/* Status Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${configObj.badge}`}>
                        {ann.category === 'urgent' ? 'Urgente' : ann.category === 'alert' ? 'Alerta' : 'Importante'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded">
                        Público: {getAudienceLabel(ann.audience)}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" />
                      {new Date(ann.date).toLocaleDateString('pt-BR', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      })}
                    </div>
                  </div>

                  {/* Title and Sender */}
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-snug">{ann.title}</h3>
                    <p className="text-xs text-indigo-600 font-medium mt-1">Enviado por: {ann.sender}</p>
                  </div>

                  {/* Content */}
                  <div className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed bg-slate-50/40 p-4 rounded-xl border border-slate-50 font-sans">
                    {ann.content}
                  </div>

                  {/* Operational Footer Actions */}
                  <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Confirmation Stats (For Teachers and Admins) */}
                    {(role === 'teacher' || role === 'admin') ? (
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 px-3 py-1 bg-slate-50 rounded-lg text-slate-500 border border-slate-100 text-xs font-medium">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Confirmações: <strong className="text-indigo-600">{ann.confirmedBy.length}</strong></span>
                        </div>
                        
                        <div className="flex gap-1 text-[11px] text-slate-400">
                          {ann.confirmedBy.map((c, i) => (
                            <span key={i} className="px-1.5 py-0.5 bg-slate-100 border rounded capitalize font-mono">
                              {c === 'parent' ? 'Responsável' : c === 'student' ? 'Aluno' : c === 'admin' ? 'Admin' : 'Outro'}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* Read receipt confirmations (For Parents and Students) */
                      <div>
                        {alreadyConfirmed ? (
                          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold bg-emerald-50 border border-emerald-100 py-1.5 px-3 rounded-lg w-fit">
                            <CheckCircle className="w-4 h-4" />
                            <span>Você confirmou o recebimento deste comunicado</span>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleConfirmReadClick(ann.id, ann.title)}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition hover:scale-[1.01]"
                          >
                            <CheckCircle className="w-4 h-4" />
                            Confirmar Leitura e Recebimento
                          </button>
                        )}
                      </div>
                    )}

                    {/* Delete capability if teacher or admin */}
                    {(role === 'teacher' || role === 'admin') && (
                      <button
                        onClick={() => onDeleteAnnouncement(ann.id)}
                        className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition self-end sm:self-auto cursor-pointer border border-transparent hover:border-red-100 flex items-center justify-center -mr-2"
                        title="Deletar Comunicado"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
