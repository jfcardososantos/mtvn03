import React, { useState } from 'react';
import { CalendarEvent, EventType, RoleType } from '../types';
import { Calendar, Clock, Tag, Plus, Trash2, Bell, BellOff, ArrowUpRight, Check, Send, Sparkles, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CalendarTabProps {
  events: CalendarEvent[];
  role: RoleType;
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
}

interface SimulatedToast {
  id: string;
  title: string;
  message: string;
  type: '24h' | '1h';
  eventTitle: string;
  timeStamp: string;
}

export default function CalendarTab({
  events,
  role,
  onAddEvent,
  onDeleteEvent,
}: CalendarTabProps) {
  const [selectedDateStr, setSelectedDateStr] = useState<string>('2026-06-02'); // Date initialized with event 1
  
  // Event generator form state
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('2026-06-02');
  const [newTime, setNewTime] = useState('07:30');
  const [newType, setNewType] = useState<EventType>('exam');
  const [newTargetClass, setNewTargetClass] = useState('9º Ano A');

  // Push notifications simulations
  const [pushEnabled, setPushEnabled] = useState(true);
  const [activeToasts, setActiveToasts] = useState<SimulatedToast[]>([]);

  // Month stats for June 2026
  const daysInMonth = 30;
  const currentMonthName = 'Junho 2026';

  const handleCreateEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newDescription) return;

    onAddEvent({
      title: newTitle,
      description: newDescription,
      date: newDate,
      time: newTime,
      type: newType,
      targetClass: newTargetClass,
    });

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setIsAddingEvent(false);
  };

  const getEventBadgeColor = (type: EventType) => {
    switch (type) {
      case 'exam': return 'bg-rose-50 border-rose-200 text-rose-700';
      case 'meeting': return 'bg-indigo-50 border-indigo-200 text-indigo-700';
      case 'holiday': return 'bg-amber-50 border-amber-200 text-amber-700';
      case 'event': default: return 'bg-emerald-50 border-emerald-200 text-emerald-700';
    }
  };

  const getEventDotColor = (type: EventType) => {
    switch (type) {
      case 'exam': return 'bg-rose-500';
      case 'meeting': return 'bg-indigo-500';
      case 'holiday': return 'bg-amber-500';
      case 'event': default: return 'bg-emerald-500';
    }
  };

  const getEventNamePt = (type: EventType) => {
    switch (type) {
      case 'exam': return 'Prova / Teste';
      case 'meeting': return 'Reunião';
      case 'holiday': return 'Feriado';
      case 'event': default: return 'Evento / Atividade';
    }
  };

  // June Days list
  const calendarDays = Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1;
    const dateStr = `2026-06-${day.toString().padStart(2, '0')}`;
    const dayEvents = events.filter((ev) => ev.date === dateStr);
    return { day, dateStr, dayEvents, isCurrentMonth: true };
  });

  // Adding May 2026 tail
  const mayDays = Array.from({ length: 4 }, (_, index) => {
    const day = 28 + index;
    const dateStr = `2026-05-${day.toString().padStart(2, '0')}`;
    const dayEvents = events.filter((ev) => ev.date === dateStr);
    return { day, dateStr, dayEvents, isCurrentMonth: false };
  });

  const fullGridDays = [...mayDays, ...calendarDays];

  // Selected date events
  const selectedDateEvents = events.filter(ev => ev.date === selectedDateStr);

  // Triggering simulated push notification with floating alert
  const triggerSimulatedPush = (eventTitle: string, eventTime: string, tType: '24h' | '1h') => {
    if (!pushEnabled) {
      return;
    }
    
    // Play custom sutil sound using modern AudioContext synthesizer (anti-slop native audio trigger)
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5 note
      gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
      oscillator.start();
      gainNode.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.3);
      oscillator.stop(audioCtx.currentTime + 0.35);
    } catch (e) {
      // AudioContext sandbox fallback
    }

    const messageText = tType === '24h'
      ? `Atenção! Faltam 24 horas para o compromisso escolar: "${eventTitle}" agendado para amanhã às ${eventTime}.`
      : `Alerta imediato: O evento "${eventTitle}" começará em 1 hora (às ${eventTime}). Favor organizar materiais!`;

    const newToast: SimulatedToast = {
      id: `toast-${Date.now()}-${Math.random()}`,
      title: tType === '24h' ? '🔔 EduConnect Push — Falta 24h' : '⚡ EduConnect Push — Falta 1h',
      message: messageText,
      type: tType,
      eventTitle: eventTitle,
      timeStamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setActiveToasts(prev => [newToast, ...prev]);

    // Auto dismiss after 6 seconds
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 6000);
  };

  return (
    <div className="space-y-6 relative">
      {/* Real-time Simulated Smartphone Push Toasts Floating Area */}
      <div className="fixed top-20 right-6 z-50 pointer-events-none flex flex-col gap-3 max-w-sm w-full">
        <AnimatePresence>
          {activeToasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ x: 100, opacity: 0, scale: 0.9 }}
              animate={{ x: 0, opacity: 1, scale: 1 }}
              exit={{ x: 100, opacity: 0, scale: 0.9 }}
              className="pointer-events-auto bg-slate-900 text-white rounded-2xl p-4 shadow-2xl border border-slate-700/80 flex gap-3.5"
            >
              <div className={`p-2.5 rounded-xl text-white shrink-0 h-fit ${
                t.type === '24h' ? 'bg-indigo-600 animate-pulse' : 'bg-red-600 animate-bounce'
              }`}>
                <Bell className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black tracking-wide text-indigo-300">
                    {t.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {t.timeStamp}
                  </span>
                </div>
                <p className="text-xs text-slate-100 font-semibold mt-1 leading-normal font-sans">
                  {t.message}
                </p>
                <div className="flex items-center gap-1.5 mt-2.5 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span>Notificação push emulado no mobile dos pais e alunos</span>
                </div>
              </div>
              <button
                onClick={() => setActiveToasts(prev => prev.filter(toastItem => toastItem.id !== t.id))}
                className="text-slate-400 hover:text-white font-bold text-xs self-start px-1"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-rose-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h2 id="calendario-titulo" className="text-xl font-bold text-slate-900 tracking-tight">Calendário e Notificações de Eventos</h2>
            <p className="text-sm text-slate-500">Planejamento escolar e disparadores automatizados para dispositivos móveis</p>
          </div>
        </div>

        {(role === 'teacher' || role === 'admin') && (
          <button
            id="btn-adicionar-data"
            onClick={() => {
              setNewDate(selectedDateStr);
              setIsAddingEvent(true);
            }}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-sm hover:scale-[1.02] cursor-pointer transition"
          >
            <Plus className="w-5 h-5" />
            Adicionar Evento
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Visual interactive calendar grid */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 text-base">
              <Calendar className="w-5 h-5 text-indigo-500" />
              {currentMonthName}
            </h3>
            <div className="flex gap-1">
              <span className="text-xs px-2.5 py-1 bg-slate-100 border border-slate-200/60 rounded-lg text-slate-500 font-semibold">2026</span>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-slate-400 capitalize mb-2">
            <div>Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {fullGridDays.map((elem, idx) => {
              const isSelected = selectedDateStr === elem.dateStr;
              const hasEvents = elem.dayEvents.length > 0;
              
              return (
                <button
                  key={idx}
                  id={`dia-${elem.dateStr}`}
                  onClick={() => setSelectedDateStr(elem.dateStr)}
                  className={`min-h-[70px] p-2 flex flex-col justify-between rounded-xl relative hover:bg-slate-50 border text-left transition ${
                    isSelected 
                      ? 'border-indigo-600 ring-2 ring-indigo-505 bg-indigo-50/20' 
                      : elem.isCurrentMonth ? 'border-slate-100/80 bg-slate-50/30' : 'border-slate-50 bg-slate-100/20 opacity-45'
                  }`}
                >
                  <span className={`text-xs font-bold leading-none ${isSelected ? 'text-indigo-700 font-black' : 'text-slate-700'}`}>
                    {elem.day}
                  </span>

                  {/* Tiny Event Dot Indicator */}
                  {hasEvents && (
                    <div className="flex gap-1 flex-wrap mt-2 overflow-hidden max-h-[16px]">
                      {elem.dayEvents.slice(0, 3).map((ev, eIdx) => (
                        <span
                          key={eIdx}
                          className={`w-1.5 h-1.5 rounded-full ${getEventDotColor(ev.type)} inline-block animate-pulse`}
                          title={`${ev.title} às ${ev.time}`}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Quick Color Guide */}
          <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-4 text-xs font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span>Prova</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              <span>Reunião</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span>Feriado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span>Evento Geral</span>
            </div>
          </div>
        </div>

        {/* Selected date overview and dynamic side panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
          <div className="pb-1 border-b border-slate-100">
            <h3 className="font-extrabold text-slate-800 text-sm uppercase tracking-wider">Atividades do Dia</h3>
            <p className="text-xs text-indigo-600 font-bold mt-0.5">
              {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString('pt-BR', {
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
              })}
            </p>
          </div>

          <div className="space-y-4">
            {selectedDateEvents.length === 0 ? (
              <div className="text-center py-6 text-slate-400 text-sm">
                <p>Nenhuma atividade ou compromisso agendado para este dia.</p>
              </div>
            ) : (
              selectedDateEvents.map((ev) => (
                <div
                  key={ev.id}
                  className={`p-4 rounded-xl border ${getEventBadgeColor(ev.type)} space-y-3 relative group`}
                >
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest">{getEventNamePt(ev.type)}</p>
                    <h4 className="font-bold text-slate-900 border-none p-0 tracking-tight leading-snug">{ev.title}</h4>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">{ev.description}</p>
                  
                  <div className="space-y-1 bg-white/45 p-2 rounded-lg border border-slate-200/40 text-[11px] text-slate-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Horário: <strong className="text-slate-900 font-bold">{ev.time}</strong></span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Tag className="w-3.5 h-3.5 text-slate-400" />
                      <span>Classe: {ev.targetClass}</span>
                    </div>
                  </div>

                  {/* Immediate Test Trigger buttons for push notifications */}
                  <div className="pt-2.5 border-t border-slate-150/40 flex flex-col gap-1.5">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Demonstrar Alerta Push:</span>
                    <div className="grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => triggerSimulatedPush(ev.title, ev.time, '24h')}
                        className="py-1.5 text-[10px] bg-slate-800 hover:bg-slate-950 text-white rounded font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Simula recebimento do push faltando 24h para o evento"
                      >
                        ⏱️ Push 24h
                      </button>
                      <button
                        onClick={() => triggerSimulatedPush(ev.title, ev.time, '1h')}
                        className="py-1.5 text-[10px] bg-indigo-600 hover:bg-indigo-700 text-white rounded font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                        title="Simula recebimento do push faltando 1h para o evento"
                      >
                        ⚡ Push 1h
                      </button>
                    </div>
                  </div>

                  {(role === 'teacher' || role === 'admin') && (
                    <button
                      onClick={() => onDeleteEvent(ev.id)}
                      className="absolute right-2 top-2 text-slate-400 hover:text-red-600 bg-white/50 border border-transparent hover:border-red-100 rounded-lg p-1 opacity-0 group-hover:opacity-100 transition duration-150 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Creation modal / block embedded instantly when clicking new event */}
          <AnimatePresence>
            {isAddingEvent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-4 border-t border-slate-100 overflow-hidden"
              >
                <form onSubmit={handleCreateEventSubmit} className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Agendar novo compromisso</h4>
                  
                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Título do Evento</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Ex: Entrega do Trabalho de Inglês"
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Tipo de Compromisso</label>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-50 border border-slate-200 rounded-lg">
                      {(['event', 'exam', 'meeting', 'holiday'] as EventType[]).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setNewType(t)}
                          className={`py-1 text-[11px] font-bold rounded-md transition ${
                            newType === t ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {t === 'exam' ? 'Prova' : t === 'meeting' ? 'Reunião' : t === 'holiday' ? 'Feriado' : 'Geral'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium">Turma</label>
                      <input
                        type="text"
                        required
                        value={newTargetClass}
                        onChange={(e) => setNewTargetClass(e.target.value)}
                        placeholder="9º Ano A"
                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium">Data</label>
                      <input
                        type="date"
                        required
                        value={newDate}
                        onChange={(e) => setNewDate(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-slate-500 mb-1 font-medium">Horário</label>
                      <input
                        type="time"
                        required
                        value={newTime}
                        onChange={(e) => setNewTime(e.target.value)}
                        className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-2 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 mb-1">Descrição Curta</label>
                    <textarea
                      required
                      rows={3}
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Ex: Conteúdo capitulo 6 e 7..."
                      className="w-full bg-slate-50 text-slate-900 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingEvent(false)}
                      className="flex-1 py-2 text-center text-xs border border-slate-200 rounded-lg text-slate-600 cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 text-center text-xs bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 shadow cursor-pointer"
                    >
                      Confirmar Agenda
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* TCC Showcase: Push Notification Center Panel */}
      <section className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-150">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
              <Plus className="w-5 h-5 text-indigo-600 animate-spin" style={{ animationDuration: '5s' }} />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-base">Demonstrador de Push Notifications (TCC)</h3>
              <p className="text-xs text-slate-500">Mapeamento de disparo automático no celular: 24 horas e 1 hora antes de cada tarefa.</p>
            </div>
          </div>

          {/* Toggle Simulated Push Switch */}
          <button
            onClick={() => setPushEnabled(!pushEnabled)}
            className={`px-4 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-2 cursor-pointer ${
              pushEnabled
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-slate-100 border-slate-300 text-slate-500'
            }`}
          >
            {pushEnabled ? <Bell className="w-4 h-4 text-emerald-600" /> : <BellOff className="w-4 h-4 text-slate-400" />}
            {pushEnabled ? 'Push Ativado (Simulador)' : 'Push Desativado'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Detailed explanation for presentation */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-250 espacio-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Como funciona no TCC?</h4>
              <p className="text-slate-600 leading-relaxed text-xs font-sans">
                Para fins de validação pedagógica do TCC de Gestão Escolar, o aplicativo registra as intenções de push automaticamente e simula a infraestrutura de segundo plano do dispositivo móvel. 
              </p>
              <p className="text-slate-600 leading-relaxed text-xs font-sans">
                Ao cadastrar um evento (ex: Prova ou Reunião) com data e hora exatas, o processador agenda duas notificações push. Pais e alunos recebem o pré-alerta de <strong>24 horas antes</strong> do vencimento, e o alerta imediato de <strong>1 hora antes</strong> de o compromisso se iniciar.
              </p>
            </div>

            <div className="p-3 bg-indigo-50/50 border border-indigo-100 rounded-xl text-[11px] text-indigo-700 font-medium flex items-center gap-2 mt-4">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 animate-bounce" />
              <span>Experimente pulsar em <strong>⏱️ Push 24h</strong> ou <strong>⚡ Push 1h</strong> no painel de eventos do dia ao lado!</span>
            </div>
          </div>

          {/* Live Agenda Dispatcher status */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">Fila de Disparos Agendados para o Alunado</h4>
            
            <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1">
              {events.slice(0, 4).map((ev) => (
                <div key={ev.id} className="p-3 border rounded-xl bg-white border-slate-150 flex items-center justify-between gap-3 shadow-none text-xs">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 truncate">{ev.title}</p>
                    <p className="text-[10px] text-indigo-600 font-semibold">{ev.date} às {ev.time} ({ev.targetClass})</p>
                  </div>

                  <div className="flex gap-1.5 shrink-0">
                    <span 
                      onClick={() => triggerSimulatedPush(ev.title, ev.time, '24h')}
                      className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-[10px] font-black rounded border border-slate-200 cursor-pointer transition select-none"
                      title="Disparar push 24h"
                    >
                      ⏱️ 24h
                    </span>
                    <span 
                      onClick={() => triggerSimulatedPush(ev.title, ev.time, '1h')}
                      className="px-2 py-1 bg-indigo-50 hover:bg-indigo-150 text-indigo-600 text-[10px] font-black rounded border border-indigo-100 cursor-pointer transition select-none"
                      title="Disparar push 1h"
                    >
                      ⚡ 1h
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-slate-400 text-right">
              Mostrando os 4 compromissos mais próximos agendados.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
