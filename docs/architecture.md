# Arquitetura do Sistema — Bot Service

## 1. Visão Geral
O **Bot Service** é uma aplicação web para configuração e simulação de chatbots conversacionais, construída em uma arquitetura monorepo com TypeScript em toda a stack.

## 2. Estrutura Monorepo
A organização do código utiliza o recurso nativo **npm workspaces** com separação clara de responsabilidades:

```text
bot-service/
├── .github/
│   └── workflows/
│       └── ci.yml               # Workflow de Integração Contínua (CI)
├── apps/
│   ├── api/                     # Backend HTTP em Node.js, Express e TypeScript
│   └── web/                     # Frontend SPA em React, TypeScript e Vite
├── docs/                        # Documentações técnicas e decisões de arquitetura
├── .env.example                 # Guia geral de variáveis de ambiente
├── .gitignore                   # Regras de exclusão do Git
├── package.json                 # Manifesto raiz com scripts unificados
└── README.md                    # Documentação principal e instruções de execução
```

## 3. Aplicações

### 3.1. Backend API (`apps/api`)
- **Tecnologias**: Node.js, Express, TypeScript.
- **Padrão de Camadas Inicial**:
  - `server.ts`: Responsável pela inicialização da porta de rede e ciclo de vida do processo (graceful shutdown).
  - `app.ts`: Responsável pela montagem de middlewares (CORS, JSON parser), injeção de rotas e tratamento global de erros.
  - `routes/`: Mapeamento de endpoints REST (ex.: `/api/health`).
  - `middlewares/`: Manipuladores de requisições, tratamento de erros 404 e 500.
- **Porta e CORS**: Configurável pelas variáveis de ambiente `PORT` (padrão: `3001`) e `CORS_ORIGIN` (padrão de desenvolvimento: `http://localhost:5173`). Em ambiente de produção, `CORS_ORIGIN` deve conter a origem pública real do frontend (ex.: `https://app.meudominio.com`).

### 3.2. Frontend Web (`apps/web`)
- **Tecnologias**: React, TypeScript, Vite.
- **Padrão**: Single Page Application (SPA) responsiva com design moderno e sem dependências pesadas de estilização.
- **Variáveis de Ambiente**: `VITE_API_URL` aponta para a URL base da API (padrão: `http://localhost:3001`).
- **Porta de Dev**: `5173`.

## 4. Integração Contínua (CI)
Configurada via GitHub Actions em `.github/workflows/ci.yml`. Executa em pushes e pull requests para a branch `main`:
1. Instalação determinística de dependências a partir do lockfile (`npm ci`).
2. Execução da suíte de testes automatizados da API (`npm test`).
3. Validação de tipagem e compilação de produção (`npm run build`).
