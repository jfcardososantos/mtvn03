import React, { useState } from 'react';
import { StudentStats, RoleType } from '../types';
import { Award, Percent, ThumbsUp, GraduationCap, ClipboardList, Check, ArrowUpRight, ShieldAlert, FileText, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface StudentReportTabProps {
  stats: StudentStats;
  role: RoleType;
}

export default function StudentReportTab({ stats, role }: StudentReportTabProps) {
  const [scheduledMeeting, setScheduledMeeting] = useState(false);
  const [requestedDoc, setRequestedDoc] = useState('');
  const [modalContent, setModalContent] = useState<string | null>(null);

  const handleDocRequest = (docType: string) => {
    setRequestedDoc(docType);
    setTimeout(() => {
      setRequestedDoc('');
      setModalContent(docType);
    }, 850); // Soft delay for premium loading experience
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h2 id="boletim-titulo" className="text-xl font-bold text-slate-900 tracking-tight">Rendimento e Notas (Lucas Silva)</h2>
            <p className="text-sm text-slate-500">Acompanhamento acadêmico individualizado e frequência bimestral</p>
          </div>
        </div>
        <div className="text-xs bg-emerald-50 text-emerald-700 font-bold border border-emerald-100 rounded-full px-3 py-1 flex items-center gap-1">
          <Check className="w-3 h-3" /> Matrícula: Ativa 2026
        </div>
      </div>

      {/* Main Core metrics banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-150 text-emerald-600 grow-0 shrink-0">
            <Percent className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Frequência Geral</span>
            <span className="text-2xl font-black text-slate-900">{stats.attendanceRate}%</span>
            <p className="text-[11px] text-slate-500 mt-1">Limite mínimo requerido: 75%</p>
          </div>
          {/* Decorative design graphic bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
            <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${stats.attendanceRate}%` }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-150 text-indigo-600 grow-0 shrink-0">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Média Escolar</span>
            <span className="text-2xl font-black text-slate-900">{stats.averageGrade} / 10</span>
            <p className="text-[11px] text-slate-500 mt-1">Status: <strong className="text-emerald-600 font-semibold">Parabéns! Acima da média</strong></p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
            <div className="h-full bg-indigo-500 transition-all duration-300" style={{ width: `${stats.averageGrade * 10}%` }} />
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4 relative overflow-hidden group">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-150 text-amber-600 grow-0 shrink-0">
            <ThumbsUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Comportamento</span>
            <span className="text-2xl font-black text-slate-900">{stats.behaviorScore}</span>
            <p className="text-[11px] text-slate-500 mt-1">Parecer consolidado do conselho escolar</p>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-100">
            <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: '90%' }} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Detail Subject Grades layout */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
          <div className="pb-2 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-1.5 uppercase tracking-wide">
              <ClipboardList className="w-4.5 h-4.5 text-indigo-600" />
              Notas Trimestrais por Disciplina
            </h3>
            <span className="text-xs text-slate-400 font-semibold font-mono">2º Trimestre Consolidado</span>
          </div>

          <div className="space-y-3 pt-2">
            {stats.recentGrades.map((grade, idx) => {
              const scoreColor = grade.value >= 7.0 ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 'text-red-500 bg-red-50 border-red-100';
              const percentage = grade.value * 10;
              
              return (
                <div key={idx} className="p-4 rounded-xl border border-slate-50 bg-slate-50/20 hover:bg-slate-50/50 transition duration-150 space-y-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm leading-tight">{grade.subject}</h4>
                      <p className="text-[10px] text-slate-400 font-medium">Avaliação principal: {grade.type}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-medium">Nota</span>
                      <span className={`px-2.5 py-1 text-xs font-extrabold rounded-lg border ${scoreColor}`}>
                        {grade.value.toFixed(1)}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${grade.value >= 7.0 ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${percentage}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Administration requests & document templates */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wide">Secretaria Virtual</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-sans">
              Solicite documentos ou agende atendimentos diretamente pelo portal sem precisar ir à secretaria do colégio.
            </p>

            <div className="space-y-2 pt-1">
              <button
                onClick={() => handleDocRequest('Declaração de Matrícula')}
                disabled={requestedDoc !== ''}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 disabled:opacity-75 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className={`w-4 h-4 ${requestedDoc === 'Declaração de Matrícula' ? 'text-indigo-600 animate-bounce' : 'text-slate-500'}`} />
                  <span>{requestedDoc === 'Declaração de Matrícula' ? 'Gerando Declaração...' : 'Declaração de Matrícula'}</span>
                </div>
                {requestedDoc === 'Declaração de Matrícula' ? (
                  <span className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin inline-block" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                )}
              </button>

              <button
                onClick={() => handleDocRequest('Histórico Escolar Parcial')}
                disabled={requestedDoc !== ''}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-slate-100 disabled:opacity-75 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-between transition cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <FileText className={`w-4 h-4 ${requestedDoc === 'Histórico Escolar Parcial' ? 'text-indigo-600 animate-bounce' : 'text-slate-500'}`} />
                  <span>{requestedDoc === 'Histórico Escolar Parcial' ? 'Gerando Histórico...' : 'Histórico Escolar Parcial'}</span>
                </div>
                {requestedDoc === 'Histórico Escolar Parcial' ? (
                  <span className="w-4 h-4 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin inline-block" />
                ) : (
                  <ArrowUpRight className="w-4 h-4 text-slate-400" />
                )}
              </button>
            </div>

            <div className="pt-2">
              {scheduledMeeting ? (
                <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 text-xs font-medium text-center space-y-1">
                  <p className="font-bold">✨ Solicitação de Reunião Enviada!</p>
                  <p>A coordenação pedagógica entrará em contato em breve para escolher o melhor horário de atendimento.</p>
                </div>
              ) : (
                <button
                  onClick={() => setScheduledMeeting(true)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
                >
                  <Calendar className="w-4 h-4" />
                  Solicitar Reunião com Coordenação
                </button>
              )}
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl border border-amber-100/50 space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-600" />
              <h4 className="font-extrabold text-amber-950 text-sm">Controle de Segurança</h4>
            </div>
            <p className="text-xs text-amber-900/80 leading-relaxed font-medium">
              Por razões de privacidade e de acordo com a LGPD, o boletim detalhado com as notas individuais é visível apenas nos perfis de <strong>Responsáveis</strong> e de <strong>Alunos</strong>.
            </p>
          </div>
        </div>
      </div>

      {/* Modern Overlay Modal for Document Confirmation (fixing iframe alert constraints) */}
      <AnimatePresence>
        {modalContent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 text-center relative space-y-4"
            >
              <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full flex items-center justify-center">
                <Check className="w-6 h-6 stroke-[3]" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-lg font-extrabold text-slate-900">Solicitação Efetuada!</h3>
                <p className="text-xs text-indigo-600 font-bold uppercase tracking-wider">{modalContent}</p>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed font-sans">
                O documento <strong className="text-slate-900">"{modalContent}"</strong> está sendo processado com sucesso na secretaria escolar.
              </p>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-150 text-xs text-slate-500 space-y-1 text-left">
                <p>📍 Disponível para retirada física em até <strong>2 dias úteis</strong>.</p>
                <p>📧 Cópia digital enviada para o e-mail: <strong className="text-slate-800">lucas.silva@escola.edu</strong></p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setModalContent(null)}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition cursor-pointer shadow-sm"
                >
                  Entendido, obrigado!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
