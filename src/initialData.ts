import { Announcement, CalendarEvent, Homework, Message, StudentStats, UserAccount, SchoolSettings, AuditLog } from './types';

export const initialUsers: UserAccount[] = [
  {
    id: 'usr-admin-1',
    name: 'Dra. Mariana Vasconcelos',
    email: 'admin@escola.edu.br',
    password: 'admin',
    role: 'admin',
    departmentOrClass: 'Diretoria Geral & Gestão Escolar',
    status: 'active',
    lastAccess: 'Hoje às 08:30'
  },
  {
    id: 'usr-prof-1',
    name: 'Prof.ª Helena Silva',
    email: 'helena@escola.edu.br',
    password: '123',
    role: 'teacher',
    departmentOrClass: 'Língua Portuguesa & História (8º e 9º Anos)',
    status: 'active',
    lastAccess: 'Hoje às 07:45'
  },
  {
    id: 'usr-prof-2',
    name: 'Prof. Marcos Souza',
    email: 'marcos@escola.edu.br',
    password: '123',
    role: 'teacher',
    departmentOrClass: 'Ciências Naturais & Robótica',
    status: 'active',
    lastAccess: 'Ontem às 16:20'
  },
  {
    id: 'usr-parent-1',
    name: 'Carlos Eduardo Silva',
    email: 'carlos@email.com',
    password: '123',
    role: 'parent',
    departmentOrClass: 'Responsável por Lucas Silva (8º Ano B)',
    status: 'active',
    lastAccess: 'Hoje às 09:12'
  },
  {
    id: 'usr-student-1',
    name: 'Lucas Silva',
    email: 'lucas@escola.edu.br',
    password: '123',
    role: 'student',
    departmentOrClass: 'Aluno - 8º Ano B (Matrícula: 2026-042)',
    status: 'active',
    lastAccess: 'Hoje às 10:05'
  },
  {
    id: 'usr-student-2',
    name: 'Beatriz Almeida',
    email: 'beatriz@escola.edu.br',
    password: '123',
    role: 'student',
    departmentOrClass: 'Aluna - 8º Ano B (Matrícula: 2026-088)',
    status: 'active',
    lastAccess: 'Ontem às 18:30'
  }
];

export const initialSchoolSettings: SchoolSettings = {
  schoolName: 'Colégio Estadual Integrado EduConnect',
  academicYear: '2026',
  currentTerm: '2º Bimestre Letivo',
  contactEmail: 'secretaria@escola.edu.br',
  contactPhone: '(11) 3456-7890',
  address: 'Av. Paulista, 1500 - Bela Vista, São Paulo - SP',
  requireParentConfirmation: true
};

export const initialAuditLogs: AuditLog[] = [
  {
    id: 'log-1',
    user: 'Dra. Mariana Vasconcelos',
    role: 'admin',
    action: 'Login administrativo efetuado com sucesso',
    timestamp: '2026-09-17T08:30:00Z',
    category: 'security'
  },
  {
    id: 'log-2',
    user: 'Prof.ª Helena Silva',
    role: 'teacher',
    action: 'Publicação de comunicado oficial: Reunião de Pais e Mestres',
    timestamp: '2026-05-29T10:00:00Z',
    category: 'communication'
  },
  {
    id: 'log-3',
    user: 'Carlos Eduardo Silva',
    role: 'parent',
    action: 'Confirmação digital de leitura de comunicado registrada',
    timestamp: '2026-05-29T11:45:00Z',
    category: 'academic'
  },
  {
    id: 'log-4',
    user: 'Prof. Marcos Souza',
    role: 'teacher',
    action: 'Novo evento adicionado ao calendário: Oficina de Robótica',
    timestamp: '2026-05-28T16:00:00Z',
    category: 'academic'
  },
  {
    id: 'log-5',
    user: 'Lucas Silva',
    role: 'student',
    action: 'Atividade de Redação Narrativa marcada como concluída',
    timestamp: '2026-05-28T17:20:00Z',
    category: 'academic'
  }
];

export const initialAnnouncements: Announcement[] = [
  {
    id: 'ann-1',
    title: '⚠️ Reunião de Pais e Mestres do 2º Trimestre',
    content: 'Prezados pais, realizaremos nossa reunião periódica para entrega de boletins e discussão do desempenho pedagógico nesta sexta-feira às 18:30 no auditório principal. A presença de todos é indispensável.',
    date: '2026-05-29T10:00:00Z',
    category: 'urgent',
    sender: 'Prof.ª Helena Silva (Coordenação)',
    audience: 'parents',
    confirmedBy: ['parent']
  },
  {
    id: 'ann-2',
    title: '📚 Início da Semana de Provas Bimestrais',
    content: 'Alunos e responsáveis, fiquem atentos ao calendário de avaliações que se inicia na próxima segunda-feira. Todas as datas detalhadas e conteúdos programáticos já estão disponíveis na aba do calendário. Preparem-se com antecedência!',
    date: '2026-05-28T14:30:00Z',
    category: 'alert',
    sender: 'Coordenação Pedagógica',
    audience: 'all',
    confirmedBy: []
  },
  {
    id: 'ann-3',
    title: '🎨 Feira de Ciências e Cultura Escolar',
    content: 'Temos o prazer de anunciar o tema do nosso projeto anual: "Sustentabilidade e Tecnologia". Os alunos deverão formar grupos de até 4 integrantes e submeter suas propostas de projeto até o final desta semana.',
    date: '2026-05-27T08:00:00Z',
    category: 'info',
    sender: 'Prof. Marcos Souza (Ciências)',
    audience: 'students',
    confirmedBy: ['student']
  },
  {
    id: 'ann-4',
    title: '🚌 Autorização para Passeio Tecnológico',
    content: 'No próximo mês realizaremos uma visita guiada ao Planetário e Museu de Ciências. O termo de autorização foi enviado fisicamente e também pode ser baixado aqui. Por favor, confirmem a autorização digital na aba de comunicados.',
    date: '2026-05-26T11:15:00Z',
    category: 'info',
    sender: 'Secretaria Escolar',
    audience: 'parents',
    confirmedBy: []
  }
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Avaliação de Matemática',
    description: 'Equações de 2º grau, trigonometria básica e matrizes. Levar régua e calculadora científica simples.',
    date: '2026-06-02',
    time: '07:30',
    type: 'exam',
    targetClass: '8º Ano B'
  },
  {
    id: 'ev-2',
    title: 'Reunião Geral de Pais',
    description: 'Discussão sobre metodologias ativas e feedback individual por componente curricular.',
    date: '2026-05-30',
    time: '18:30',
    type: 'meeting',
    targetClass: 'Todos os anos'
  },
  {
    id: 'ev-3',
    title: 'Feriado de Corpus Christi',
    description: 'Recesso escolar institucional. Não haverá aulas presenciais nem atividades síncronas.',
    date: '2026-06-11',
    time: '08:00',
    type: 'holiday',
    targetClass: 'Toda a escola'
  },
  {
    id: 'ev-4',
    title: 'Apresentação Final do Trabalho de Física',
    description: 'Entrega do relatório e apresentação dos protótipos de energia solar residencial.',
    date: '2026-06-05',
    time: '10:15',
    type: 'exam',
    targetClass: '8º Ano B'
  },
  {
    id: 'ev-5',
    title: 'Oficina Prática de Robótica',
    description: 'Introdução à montagem de kits Arduino para os alunos interessados no contraturno.',
    date: '2026-06-08',
    time: '14:00',
    type: 'event',
    targetClass: 'Clube de Ciências'
  }
];

export const initialHomework: Homework[] = [
  {
    id: 'hw-1',
    title: 'Resolução de Exercícios de Álgebra',
    subject: 'Matemática',
    description: 'Responder aos exercícios de 1 a 15 do capítulo 4 do livro didático. Enviar foto dos cálculos organizados.',
    dueDate: '2026-06-01',
    completedBy: []
  },
  {
    id: 'hw-2',
    title: 'Redação Narrativa: Memórias Literárias',
    subject: 'Português',
    description: 'Escrever uma crônica de 25 a 30 linhas inspirada nas narrativas contadas por parentes mais velhos sobre a infância deles.',
    dueDate: '2026-06-04',
    completedBy: ['student']
  },
  {
    id: 'hw-3',
    title: 'Relatório Prático sobre Germinação',
    subject: 'Biologia',
    description: 'Escrever as conclusões finais do experimento do feijão no algodão, anexando gráficos de crescimento medidos diariamente.',
    dueDate: '2026-06-03',
    completedBy: []
  }
];

export const initialMessages: Message[] = [
  {
    id: 'msg-1',
    sender: 'Prof.ª Helena Silva',
    senderRole: 'teacher',
    receiverRole: 'parent',
    text: 'Olá, Sr. Carlos! Gostaria de ressaltar que o Lucas tem demonstrado um excelente rendimento em história recentemente. Ele se destacou bastante nos debates.',
    timestamp: '2026-05-28T14:15:00Z'
  },
  {
    id: 'msg-2',
    sender: 'Sr. Carlos (Pai do Lucas)',
    senderRole: 'parent',
    receiverRole: 'teacher',
    text: 'Fico imensamente feliz pelo feedback, professora! Nós temos acompanhado os estudos dele em casa e ele estava bastante empolgado com esse tema.',
    timestamp: '2026-05-28T14:40:00Z'
  },
  {
    id: 'msg-3',
    sender: 'Prof.ª Helena Silva',
    senderRole: 'teacher',
    receiverRole: 'parent',
    text: 'Estaremos à disposição na reunião de sexta-feira para conversarmos em mais detalhes se houver necessidade. Um grande abraço!',
    timestamp: '2026-05-28T15:00:00Z'
  },
  {
    id: 'msg-4',
    sender: 'Lucas (Aluno)',
    senderRole: 'student',
    receiverRole: 'teacher',
    text: 'Professora, estou com dúvida na questão 3 do dever de casa de matemática. Pode me dar uma dica sobre o primeiro passo?',
    timestamp: '2026-05-29T11:00:00Z'
  },
  {
    id: 'msg-5',
    sender: 'Dra. Mariana Vasconcelos',
    senderRole: 'admin',
    receiverRole: 'teacher',
    text: 'Professora Helena, os formulários do conselho de classe já foram disponibilizados na coordenação.',
    timestamp: '2026-05-29T11:30:00Z'
  }
];

export const initialStudentStats: StudentStats = {
  attendanceRate: 94.5,
  averageGrade: 8.4,
  behaviorScore: 'Excelente',
  recentGrades: [
    { subject: 'Matemática', value: 8.5, type: 'Prova 1' },
    { subject: 'Português', value: 9.0, type: 'Redação' },
    { subject: 'História', value: 7.8, type: 'Trabalho em Grupo' },
    { subject: 'Biologia', value: 8.2, type: 'Fichamento' }
  ]
};
