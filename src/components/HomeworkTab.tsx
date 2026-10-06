import React, { useState } from 'react';
import { Homework, RoleType } from '../types';
import { BookOpen, ClipboardCheck, Calendar, CheckSquare, Square, Award, AlertCircle, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HomeworkTabProps {
  homeworkList: Homework[];
  role: RoleType;
  onAddHomework: (hw: Omit<Homework, 'id' | 'completedBy'>) => void;
  onToggleCompleteHomework: (id: string, role: RoleType) => void;
  onDeleteHomework: (id: string) => void;
}

export default function HomeworkTab({
  homeworkList,
  role,
  onAddHomework,
  onToggleCompleteHomework,
  onDeleteHomework,
}: HomeworkTabProps) {
  const [isAddingHomework, setIsAddingHomework] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-06-03');

  // Track which homework is actively open/expanded (starts with first item open)
  const [expandedHomeworkId, setExpandedHomeworkId] = useState<string | null>('hw-1');

  // Success message feedback for submitting homework
  const [submitSuccessMsg, setSubmitSuccessMsg] = useState<string | null>(null);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newSubject || !newDescription) return;

    onAddHomework({
      title: newTitle,
      subject: newSubject,
      description: newDescription,
      dueDate: newDueDate,
    });

    setNewTitle('');
    setNewSubject('');
    setNewDescription('');
    setIsAddingHomework(false);
    
    // Auto-open newly created homework
    setExpandedHomeworkId(`hw-${Date.now()}`);
  };

  const handleTriggerSubmissionAnimation = (hwTitle: string) => {
    setSubmitSuccessMsg(`Atividade "${hwTitle}" enviada com sucesso no portal escolar!`);
    
    // Play optional interactive synth sound for feedback in high fidelity TCC
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.frequency.setValueAtTime(523.25, audioCtx.currentTime); 
      osc.frequency.setValueAtTime(659.25, audioCtx.currentTime + 0.12); 
      gain.gain.setValueAtTime(0.06, audioCtx.currentTime);
      osc.start();
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.35);
      osc.stop(audioCtx.currentTime + 0.4);
    } catch(err) {}

    setTimeout(() => {
      setSubmitSuccessMsg(null);
    }, 4500);
  };

  return (
    <div className="space-y-6 relative font-sans">
      {/* Visual Success feedback floating toast */}
      <AnimatePresence>
        {submitSuccessMsg && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 bg-slate-900 border border-slate-700 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3.5 max-w-sm w-full font-sans"
          >
            <div className="p-2.5 bg-emerald-600 rounded-xl text-white shrink-0">
              <ClipboardCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-emerald-400">Entrega do Trabalho</p>
              <p className="text-xs text-slate-150 mt-0.5 font-medium leading-normal">{submitSuccessMsg}</p>
            </div>
            <button
              onClick={() => setSubmitSuccessMsg(null)}
              className="text-slate-400 hover:text-white font-bold text-sm"
            >
              ×
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <h2 id="tarefas-titulo" className="text-xl font-bold text-slate-900 tracking-tight">Atividades e Tarefas</h2>
            <p className="text-sm text-slate-500">Acompanhamento de tarefas de casa e prazos de entrega</p>
          </div>
        </div>

        {(role === 'teacher' || role === 'admin') && (
          <button
            id="btn-criar-tarefa"
            onClick={() => setIsAddingHomework(true)}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm hover:scale-[1.02] cursor-pointer transition"
          >
            <Plus className="w-5 h-5" />
            Nova Tarefa
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Homework list pane */}
        <div className="lg:col-span-8 space-y-4">
          {homeworkList.length === 0 ? (
            <div className="bg-white p-12 text-center rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-400 font-medium">Nenhuma tarefa ativa cadastrada no momento.</p>
            </div>
          ) : (
            homeworkList.map((hw) => {
              // Complete check status
              const isCompleted = hw.completedBy.includes('student');
              const isExpanded = expandedHomeworkId === hw.id;
              
              return (
                <div
                  key={hw.id}
                  id={`tarefa-${hw.id}`}
                  className={`bg-white rounded-2xl shadow-sm border transition duration-200 overflow-hidden ${
                    isExpanded 
                      ? 'border-indigo-500 ring-1 ring-indigo-500/20 shadow-md' 
                      : 'border-slate-100 hover:border-slate-350'
                  }`}
                >
                  {/* Interactive Header allowing user to toggle and 'open' the task */}
                  <div 
                    onClick={() => setExpandedHomeworkId(isExpanded ? null : hw.id)}
                    className="p-5 flex items-start gap-4 justify-between cursor-pointer select-none group"
                  >
                    <div className="flex gap-4 items-start min-w-0 flex-1">
                      {role === 'student' ? (
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Stop expansion trigger when checking complete
                            onToggleCompleteHomework(hw.id, role);
                            if (!isCompleted) {
                              handleTriggerSubmissionAnimation(hw.title);
                            }
                          }}
                          className="p-1 mt-0.5 rounded text-indigo-600 hover:bg-indigo-50 border border-slate-100 hover:border-indigo-100 transition cursor-pointer shrink-0"
                          title={isCompleted ? 'Marcar como pendente' : 'Marcar como concluída'}
                        >
                          {isCompleted ? (
                            <CheckSquare className="w-6 h-6 text-emerald-600 animate-pulse" />
                          ) : (
                            <Square className="w-6 h-6 text-slate-300 hover:text-indigo-600" />
                          )}
                        </button>
                      ) : (
                        <div className="p-2 bg-slate-50 border border-slate-100 rounded-lg text-slate-400 shrink-0">
                          <ClipboardCheck className={`w-5 h-5 ${isCompleted ? 'text-emerald-500' : 'text-indigo-500'}`} />
                        </div>
                      )}

                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-bold text-indigo-700 px-2.5 py-0.5 bg-indigo-50 border border-indigo-100/60 rounded-full uppercase tracking-wider">
                            {hw.subject}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Prazo: {new Date(hw.dueDate + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-950 mt-2 tracking-tight group-hover:text-indigo-600 transition truncate">
                          {hw.title}
                        </h3>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {/* Interactive Badge tag telling user to click and expand */}
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-md transition ${
                        isExpanded ? 'bg-indigo-600 text-white animate-pulse' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'
                      }`}>
                        {isExpanded ? 'Aberta ▼' : 'Abrir Atividade ⇗'}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Body area utilizing smooth Height interpolation via Framer Motion */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="border-t border-slate-100 bg-slate-50/50"
                      >
                        <div className="p-5 space-y-4 text-xs sm:text-sm text-left">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1.5">Instruções de Estudo:</span>
                            <p className="text-slate-700 leading-relaxed font-sans bg-white p-4 rounded-xl border border-slate-250">
                              {hw.description}
                            </p>
                          </div>

                          {/* Pedagogical Attachments Section to enrich the academic feeling of the portal */}
                          <div className="space-y-2">
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Anexos de Apoio e Recursos do Professor:</span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <a 
                                href="#download-simulado" 
                                onClick={(e) => { e.preventDefault(); alert('Download simulado: Guia de Metodologia e Roteiro de Leitura escolar.'); }}
                                className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center justify-between group/link shadow-sm"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="p-1 px-1.5 bg-red-50 text-red-650 rounded text-[9px] font-bold uppercase border border-red-100 shrink-0">PDF</span>
                                  <span className="text-[11px] font-bold text-slate-700 truncate">Guia_Rápido_{hw.subject}.pdf</span>
                                </div>
                                <span className="text-[10px] text-slate-400 group-hover/link:text-indigo-600 font-bold shrink-0 ml-1">Baixar ⇗</span>
                              </a>

                              <a 
                                href="#download-simulado" 
                                onClick={(e) => { e.preventDefault(); alert('Download simulado: Planilha de Critérios de Avaliação acadêmica.'); }}
                                className="p-3 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition flex items-center justify-between group/link shadow-sm"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span className="p-1 px-1.5 bg-indigo-50 text-indigo-650 rounded text-[9px] font-bold uppercase border border-indigo-100 shrink-0">XLS</span>
                                  <span className="text-[11px] font-bold text-slate-700 truncate">Diretrizes_Gerais.xlsx</span>
                                </div>
                                <span className="text-[10px] text-slate-400 group-hover/link:text-indigo-600 font-bold shrink-0 ml-1">Baixar ⇗</span>
                              </a>
                            </div>
                          </div>

                          {/* Sincronized Role Info Footer Actions inside active homework details */}
                          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs font-semibold">
                            <div className="flex items-center gap-2">
                              {role === 'parent' ? (
                                <div className="p-2 py-1 bg-amber-50 border border-amber-250 text-amber-800 rounded-lg text-[11px] flex items-center gap-1">
                                  <span className={`h-1.5 w-1.5 rounded-full ${isCompleted ? 'bg-emerald-500' : 'bg-red-500 animate-ping'}`} />
                                  <span>{isCompleted ? 'Lucas concluiu esta tarefa ✓' : 'Pendente: Cobrar entrega do aluno'}</span>
                                </div>
                              ) : role === 'student' ? (
                                <button
                                  onClick={() => {
                                    onToggleCompleteHomework(hw.id, role);
                                    if (!isCompleted) handleTriggerSubmissionAnimation(hw.title);
                                  }}
                                  className={`px-4 py-2 rounded-xl border transition-all text-xs font-bold shrink-0 cursor-pointer ${
                                    isCompleted 
                                      ? 'bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100' 
                                      : 'bg-indigo-600 hover:bg-indigo-700 text-white min-w-[175px] shadow'
                                  }`}
                                >
                                  {isCompleted ? '✓ Atividade Entregue' : '⚡ Entregar Atividade Agora'}
                                </button>
                              ) : (
                                <div className="px-3 py-1.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-lg text-xs">
                                  Entregas pela turma: <strong className="text-indigo-600">{hw.completedBy.length}</strong> de 24 alunos
                                </div>
                              )}
                            </div>

                            {(role === 'teacher' || role === 'admin') && (
                              <button
                                onClick={() => onDeleteHomework(hw.id)}
                                className="px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-100 border border-red-100 hover:border-red-200 rounded-xl transition flex items-center gap-1.5 font-bold cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remover Tarefa</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          )}
        </div>

        {/* Create/Action side info panel */}
        <div className="lg:col-span-4 space-y-6">
          {/* Create form */}
          <AnimatePresence>
            {isAddingHomework ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4 text-left"
              >
                <h3 className="font-bold text-slate-900 border-none p-0 text-base">Nova Atividade de Casa</h3>
                
                <form onSubmit={handleCreateSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Disciplina</label>
                    <input
                      type="text"
                      required
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Ex: Geografia, Química, Matemática..."
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Título da Tarefa</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Trabalho sobre Climatologia"
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Data Limite (Respostas)</label>
                    <input
                      type="date"
                      required
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 mb-1">Descrição detalhada</label>
                    <textarea
                      required
                      rows={4}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Instruções completas da tarefa de casa, capítulos requeridos, método de envio..."
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingHomework(false)}
                      className="flex-1 py-2 text-center text-xs font-semibold border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-center text-xs font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow cursor-pointer text-indigo-100"
                    >
                      Cadastrar Atividade
                    </button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <div className="bg-gradient-to-br from-indigo-50 to-emerald-50 p-6 rounded-2xl border border-indigo-100/40 space-y-4 text-left">
                <div className="p-3 bg-white border border-indigo-100 w-fit rounded-xl">
                  <Award className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-extrabold text-indigo-950 border-none p-0 tracking-tight text-sm">Metodologias Ativas e TCC</h3>
                <p className="text-xs text-indigo-900/80 leading-relaxed font-medium">
                  Este portal permite que os alunos marquem as tarefas como entregues diretamente. Ao fazer isso, o sistema de TCC notifica os pais instantaneamente no painel e atualiza as estatísticas de entrega do professor em tempo real.
                </p>
                <div className="flex items-center gap-2 p-2 px-3 bg-white/70 border border-indigo-100 rounded-xl text-[10px] text-indigo-700 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Experimente trocar o papel ativo para "Aluno" no painel superior para marcar tarefas!</span>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
