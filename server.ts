import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;

function getGemini(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY is not defined.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Full API endpoint for generating school announcements using Gemini
app.post("/api/generate-announcement", async (req, res) => {
  const { topic, category, audience, additionalNotes } = req.body;

  if (!topic) {
    res.status(400).json({ error: "O campo 'topic' é obrigatório." });
    return;
  }

  try {
    const ai = getGemini();
    const prompt = `Crie um comunicado escolar formal e bem escrito em português do Brasil baseado nos seguintes dados:
- Assunto/Ação: ${topic}
- Tipo de comunicado: ${category} (Exemplos: Urgente, Alerta, Informativo)
- Destinatários: ${audience} (Exemplos: Pais, Alunado Geral, Professores)
- Observações adicionais: ${additionalNotes || "Nenhuma"}

Instruções importantes:
1. Retorne apenas o texto final estruturado, pronto para publicar.
2. Seja acolhedor e profissional, próprio de uma instituição de ensino comprometida com um ambiente saudável.
3. Se houver ações requeridas (ex: assinatura de autorização, datas de reuniões), organize com marcadores (bullets) legíveis.
4. Conclua com uma assinatura institucional simpática.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Fallback generativo local elegante se a chave da API do Gemini estiver ausente
    const localFallbacks: Record<string, string> = {
      default: `[Rascunho do Assistente de IA]
Prezada Comunidade Escolar,

Gostaríamos de chamar a atenção de todos para o assunto: "${topic}". 

Este comunicado destina-se a todos os ${audience} e é considerado um comunicado do tipo: ${category}.

Pontos Importantes:
• Por favor, revisem os detalhes relativos a este tema no cronograma anexado.
• Solicitamos que acompanhem diariamente as atualizações no Portal de Comunicação Escolar.
• Se houver qualquer dúvida, por favor, envie uma mensagem direta ao setor pedagógico através da nossa aba de Mensagens.

Agradecemos imensamente a costumeira colaboração de todos na gestão de nossas atividades escolares diárias.

Atenciosamente,
Coordenação Pedagógica e Direção Escolar`
    };

    res.json({
      text: localFallbacks.default,
      warning: "Chave GEMINI_API_KEY não configurada nos segredos. Rascunho padrão carregado automaticamente."
    });
  }
});

// Health check API
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`EduConnect server running on http://localhost:${PORT}`);
  });
}

startServer();
