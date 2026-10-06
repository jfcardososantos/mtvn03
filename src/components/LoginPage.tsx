import React, { useState } from 'react';
import { UserAccount } from '../types';
import {
  School,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LoginPageProps {
  onLogin: (user: UserAccount) => void;
  users: UserAccount[];
}

export default function LoginPage({ onLogin, users }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSentSuccess, setForgotSentSuccess] = useState(false);

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, preencha o e-mail e a senha cadastrados.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      // Find matching user in database or match standard demo credentials
      const normalizedEmail = email.trim().toLowerCase();
      const matchedUser = users.find(u => u.email.toLowerCase() === normalizedEmail);

      if (!matchedUser) {
        setErrorMessage('E-mail não encontrado no sistema escolar. Utilize um dos acessos rápidos abaixo ou contate a secretaria.');
        setIsLoading(false);
        return;
      }

      if (matchedUser.status === 'suspended') {
        setErrorMessage('Esta conta foi temporariamente desativada pela administração escolar.');
        setIsLoading(false);
        return;
      }

      // Check password (standard demo accepts matched user password or 'admin' / '123')
      if (matchedUser.password && matchedUser.password !== password && password !== 'admin' && password !== '123') {
        setErrorMessage('Senha incorreta. Para demonstração rápida, use "admin" para administrador ou "123" para os demais perfis.');
        setIsLoading(false);
        return;
      }

      setIsLoading(false);
      onLogin(matchedUser);
    }, 450);
  };

  const handleQuickSelect = (user: UserAccount) => {
    setEmail(user.email);
    setPassword(user.password || (user.role === 'admin' ? 'admin' : '123'));
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(user);
    }, 300);
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setForgotSentSuccess(true);
    setTimeout(() => {
      setShowForgotPasswordModal(false);
      setForgotSentSuccess(false);
      setForgotEmail('');
    }, 2800);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-sans relative overflow-hidden">
      {/* Background ambient lighting accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Navbar */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 relative z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/30">
              <School className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-lg tracking-tight text-white flex items-center gap-2">
                EduConnect <span className="text-[10px] bg-indigo-500/20 text-indigo-300 font-bold px-2 py-0.5 rounded border border-indigo-500/30">PORTAL OFICIAL</span>
              </span>
              <p className="text-[11px] text-slate-400">Sistema Integrado de Comunicação e Gestão Escolar</p>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 px-3 py-1.5 rounded-full border border-slate-700/60">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Ambiente Seguro e Criptografado</span>
          </div>
        </div>
      </header>

      {/* Center Login Box */}
      <div className="max-w-6xl mx-auto w-full px-4 py-8 relative z-10 my-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Traditional Form */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
              <div className="mb-6">
                <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">
                  Autenticação Institucional
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                  Acessar sua Conta
                </h2>
                <p className="text-sm text-slate-400 mt-1">
                  Insira suas credenciais escolares ou utilize o acesso rápido demonstrativo abaixo.
                </p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-start gap-3 text-rose-300 text-xs leading-relaxed">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleManualLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5">
                    E-mail Institucional
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="login-input-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="seu.email@escola.edu.br"
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold text-slate-300">
                      Senha de Acesso
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(true)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 hover:underline cursor-pointer font-medium"
                    >
                      Esqueci a senha
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="login-input-senha"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-950/80 border border-slate-800 text-white rounded-xl pl-10 pr-11 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition placeholder:text-slate-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-slate-300">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-slate-900 cursor-pointer"
                    />
                    <span>Manter conectado neste dispositivo</span>
                  </label>
                </div>

                <button
                  id="btn-entrar-login"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-3.5 px-6 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white rounded-xl font-bold text-sm tracking-wide transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isLoading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Entrar no Portal</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Conforme LGPD Escolar
                </span>
                <span>Dúvidas? Ligue (11) 3456-7890</span>
              </div>
            </div>
          </div>

          {/* Right Column: Quick Demo Access Cards (Crucial for evaluation / TCC presentation) */}
          <div className="lg:col-span-6 flex flex-col justify-center space-y-4">
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-3xl p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1 px-2 rounded-md bg-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider border border-indigo-500/30">
                      Banca de Avaliação & TCC
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-amber-300 font-bold">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" /> 1-Clique
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-1">Acesso Rápido por Perfil</h3>
                  <p className="text-xs text-slate-400">
                    Clique em qualquer uma das credenciais abaixo para entrar imediatamente com as permissões correspondentes:
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Admin Card */}
                <button
                  onClick={() => {
                    const adminUser = users.find(u => u.role === 'admin') || users[0];
                    handleQuickSelect(adminUser);
                  }}
                  className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-indigo-500/40 hover:border-indigo-500 rounded-2xl text-left transition group cursor-pointer relative overflow-hidden shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      ADMINISTRADOR
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">admin123</span>
                  </div>
                  <p className="font-bold text-sm text-white group-hover:text-indigo-300 transition">
                    Dra. Mariana Vasconcelos
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Diretoria Geral • Gestão Completa
                  </p>
                  <div className="mt-3 text-[10px] font-semibold text-indigo-400 flex items-center gap-1">
                    <span>Entrar como Gestor</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>

                {/* Teacher Card */}
                <button
                  onClick={() => {
                    const teacherUser = users.find(u => u.role === 'teacher') || users[1];
                    handleQuickSelect(teacherUser);
                  }}
                  className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-indigo-400/50 rounded-2xl text-left transition group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      PROFESSOR
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">prof123</span>
                  </div>
                  <p className="font-bold text-sm text-white group-hover:text-violet-300 transition">
                    Prof.ª Helena Silva
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Português & História • IA de Avisos
                  </p>
                  <div className="mt-3 text-[10px] font-semibold text-violet-400 flex items-center gap-1">
                    <span>Entrar como Professora</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>

                {/* Parent Card */}
                <button
                  onClick={() => {
                    const parentUser = users.find(u => u.role === 'parent') || users[3];
                    handleQuickSelect(parentUser);
                  }}
                  className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-emerald-400/50 rounded-2xl text-left transition group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      RESPONSÁVEL
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">pais123</span>
                  </div>
                  <p className="font-bold text-sm text-white group-hover:text-emerald-300 transition">
                    Carlos Eduardo Silva
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Pai do Lucas • Confirmação de Leitura
                  </p>
                  <div className="mt-3 text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <span>Entrar como Pai</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>

                {/* Student Card */}
                <button
                  onClick={() => {
                    const studentUser = users.find(u => u.role === 'student') || users[4];
                    handleQuickSelect(studentUser);
                  }}
                  className="p-4 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-amber-400/50 rounded-2xl text-left transition group cursor-pointer relative overflow-hidden"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      ALUNO
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">aluno123</span>
                  </div>
                  <p className="font-bold text-sm text-white group-hover:text-amber-300 transition">
                    Lucas Silva
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    8º Ano B • Deveres & Boletim
                  </p>
                  <div className="mt-3 text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                    <span>Entrar como Aluno</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition" />
                  </div>
                </button>
              </div>

              <div className="mt-5 p-3.5 bg-slate-950/60 rounded-xl border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>
                  Cada perfil possui permissões específicas. O <strong>Administrador</strong> tem acesso total ao Painel de Gestão Escolar, auditoria e controle de contas.
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4 relative z-10 text-center text-xs text-slate-400">
        <p>© 2026 EduConnect • Todos os direitos reservados • Ambiente de Prototipagem Acadêmica</p>
      </footer>

      {/* Modal Esqueci Minha Senha */}
      <AnimatePresence>
        {showForgotPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg text-white">Recuperar Senha Escolar</h3>
                <button
                  onClick={() => setShowForgotPasswordModal(false)}
                  className="text-slate-400 hover:text-white text-sm"
                >
                  ✕
                </button>
              </div>

              {forgotSentSuccess ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Link de Recuperação Enviado!</span>
                  </div>
                  <p>
                    Enviamos as instruções para o e-mail informado. Por motivos de segurança, você também pode usar a senha padrão <strong>admin</strong> ou <strong>123</strong> neste protótipo.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Informe seu e-mail institucional para receber um link de redefinição imediato:
                  </p>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">E-mail</label>
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="ex: admin@escola.edu.br"
                      required
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowForgotPasswordModal(false)}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Enviar Instruções
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
