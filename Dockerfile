# syntax=docker/dockerfile:1

########## Stage 1: build (frontend Vite + bundle do servidor) ##########
FROM node:22-slim AS build

WORKDIR /app

# Copia só os manifests primeiro para aproveitar o cache das camadas
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund

# Copia o código-fonte e gera dist/ (index.html, assets e dist/server.cjs)
COPY . .
RUN npm run build

########## Stage 2: produção (Node + Express via dist/server.cjs) ##########
FROM node:22-slim AS production

WORKDIR /app
ENV NODE_ENV=production

# Chave da API do Gemini injetada em tempo de execução (não vai para o bundle)
ARG GEMINI_API_KEY
ENV GEMINI_API_KEY=$GEMINI_API_KEY

# Apenas dependências de produção (express, dotenv, @google/genai, vite)
COPY package.json package-lock.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Artefatos do build: frontend estático + servidor já compilado
COPY --from=build /app/dist ./dist

EXPOSE 3000

# Liveness check contra /api/health (usa o fetch nativo do Node; sem curl)
HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/api/health').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "dist/server.cjs"]
