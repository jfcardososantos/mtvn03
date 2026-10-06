import React, { useState } from 'react';
import { Message, RoleType } from '../types';
import { Send, User, Shield, MessageSquare, Check, CheckCheck, Bookmark } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ChatTabProps {
  messages: Message[];
  role: RoleType;
  onSendMessage: (text: string, receiverRole: RoleType) => void;
}

interface ChatContact {
  id: string;
  name: string;
  role: RoleType;
  avatarLabel: string;
  description: string;
}

export default function ChatTab({ messages, role, onSendMessage }: ChatTabProps) {
  // Available simulated contacts depending on current active role
  const contacts: ChatContact[] = [
    {
      id: "cont-1",
      name: "Prof.ª Helena Silva (Diretora/Portugês)",
      role: "teacher",
      avatarLabel: "PH",
      description: "Coordenadora Pedagógica e professora titular"
    },
    {
      id: "cont-2",
      name: "Sr. Carlos (Pai do Lucas)",
      role: "parent",
      avatarLabel: "SC",
      description: "Responsável pelo aluno Lucas, 9º Ano A"
    },
    {
      id: "cont-3",
      name: "Lucas (Aluno)",
      role: "student",
      avatarLabel: "LU",
      description: "Aluno matriculado no 9º Ano A"
    }
  ];

  // Filter out the active user from contacts to avoid chatting with yourself
  const activeContacts = contacts.filter(c => c.role !== role);
  
  // Set default active contact
  const [activeContactId, setActiveContactId] = useState<string>(activeContacts[0]?.id || '');
  const [inputText, setInputText] = useState('');

  const currentContact = contacts.find(c => c.id === activeContactId);

  const sendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentContact) return;

    onSendMessage(inputText.trim(), currentContact.role);
    setInputText('');
  };

  // Filter messages exchanged between active user's role and selected contact's role
  const filteredMessages = messages.filter((msg) => {
    const isExchanged = 
      (msg.senderRole === role && msg.receiverRole === currentContact?.role) ||
      (msg.senderRole === currentContact?.role && msg.receiverRole === role);
    return isExchanged;
  });

  const getRoleLabelPt = (r: RoleType) => {
    switch (r) {
      case 'teacher': return 'Professora';
      case 'parent': return 'Responsável';
      case 'student': return 'Aluno';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[600px]">
      {/* Left Contacts list sidebar */}
      <div className="md:col-span-4 border-r border-slate-100 flex flex-col bg-slate-50/50">
        <div className="p-4 border-b border-slate-100 bg-white">
          <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            Canais de Conversa
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Clique em um contato para conferir as mensagens</p>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {activeContacts.map((c) => {
            const isSelected = c.id === activeContactId;
            
            // Check last message
            const lastMsgExchanged = messages
              .filter(m => (m.senderRole === role && m.receiverRole === c.role) || (m.senderRole === c.role && m.receiverRole === role))
              .pop();

            return (
              <button
                key={c.id}
                onClick={() => setActiveContactId(c.id)}
                className={`w-full p-4 rounded-xl flex items-start gap-3 transition text-left cursor-pointer ${
                  isSelected 
                    ? 'bg-white shadow border border-slate-100/60' 
                    : 'hover:bg-slate-100 border border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shadow-inner ${
                  c.role === 'teacher' ? 'bg-indigo-100 text-indigo-700'
                    : c.role === 'parent' ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {c.avatarLabel}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-bold text-xs text-slate-800 truncate">{c.name}</h4>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {getRoleLabelPt(c.role)}
                  </span>
                  
                  {lastMsgExchanged ? (
                    <p className="text-xs text-slate-500 truncate mt-1.5 font-sans leading-tight">
                      {lastMsgExchanged.senderRole === role ? 'Você: ' : ''}{lastMsgExchanged.text}
                    </p>
                  ) : (
                    <p className="text-xs text-slate-400 italic truncate mt-1.5">Nenhuma mensagem recente</p>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Informational footer on contact limits */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <div className="p-3 bg-slate-50 border border-slate-150 rounded-xl space-y-1">
            <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Modulação de Perfis</h5>
            <p className="text-[11px] text-slate-500 leading-normal font-sans">
              No topo da página, ao trocar o seu papel ativo para <strong>{getRoleLabelPt(role)}</strong>, os perfis disponíveis de chat são reorganizados automaticamente para demonstrar a reciprocidade de mensagens.
            </p>
          </div>
        </div>
      </div>

      {/* Right chat logs feed area */}
      <div className="md:col-span-8 flex flex-col bg-white">
        {currentContact ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  currentContact.role === 'teacher' ? 'bg-indigo-100 text-indigo-700'
                    : currentContact.role === 'parent' ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-amber-100 text-amber-700'
                }`}>
                  {currentContact.avatarLabel}
                </div>
                <div>
                  <h3 id="chat-nome-contato" className="font-bold text-slate-900 text-sm leading-tight">{currentContact.name}</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Ativo Agora</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] bg-slate-100 border rounded px-2 py-0.5 font-mono text-slate-500 uppercase">
                TCC Sincronizado
              </div>
            </div>

            {/* Messages Feed */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50">
              {filteredMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-2 py-10">
                  <MessageSquare className="w-10 h-10 text-slate-300 animate-bounce" />
                  <p className="font-medium text-sm">Nenhuma mensagem trocada ainda.</p>
                  <p className="text-xs text-slate-400">Escreva uma mensagem de teste abaixo e inicie a conversa!</p>
                </div>
              ) : (
                filteredMessages.map((msg) => {
                  const isOwnMessage = msg.senderRole === role;
                  
                  return (
                    <motion.div
                      layout
                      key={msg.id}
                      className={`flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}
                    >
                      <div className={`max-w-[75%] p-3.5 rounded-2xl text-sm leading-relaxed shadow-sm font-sans relative ${
                        isOwnMessage 
                          ? 'bg-indigo-600 text-white rounded-tr-none' 
                          : 'bg-white text-slate-800 border border-slate-150 rounded-tl-none'
                      }`}>
                        <p>{msg.text}</p>
                        
                        {/* Status detail time and checkmarks */}
                        <div className={`flex items-center justify-end gap-1 text-[10px] mt-1.5 ${
                          isOwnMessage ? 'text-indigo-200' : 'text-slate-400'
                        }`}>
                          <span>
                            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                          {isOwnMessage && <CheckCheck className="w-3.5 h-3.5" />}
                        </div>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Input send bar footer */}
            <form onSubmit={sendMessageSubmit} className="p-4 border-t border-slate-100 bg-white">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl p-1 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:bg-white transition-all duration-150">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder={`Enviar mensagem segura para ${currentContact.name}...`}
                  className="flex-1 bg-transparent border-none px-4 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="p-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-lg cursor-pointer shadow transition"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center p-6 text-slate-400">
            <Bookmark className="w-12 h-12 text-slate-300 mb-2" />
            <p className="font-bold">Nenhum canal ativo</p>
            <p className="text-xs">Selecione uma conversa ativa na barra lateral para começar.</p>
          </div>
        )}
      </div>
    </div>
  );
}
