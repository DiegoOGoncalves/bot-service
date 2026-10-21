# Bot Service

> Plataforma para configuração e simulação de chatbots conversacionais.

Projeto de portfólio desenvolvido para demonstrar competências práticas em desenvolvimento **Full Stack**, aplicando **React**, **Node.js**, **TypeScript**, **APIs REST**, boas práticas de arquitetura e integração contínua.

---

## 🏗️ Arquitetura do Projeto

O projeto é estruturado como um **Monorepo** com **npm workspaces**, garantindo separação clara de responsabilidades:

- **`apps/web`**: Frontend SPA desenvolvido com React, TypeScript e Vite.
- **`apps/api`**: Backend REST desenvolvido com Node.js, Express e TypeScript.
- **`docs`**: Documentação técnica e decisões arquiteturais.
- **`.github/workflows`**: Pipeline de CI no GitHub Actions executando instalação via lockfile (`npm ci`), testes automatizados (`npm test`) e builds (`npm run build`).

Para detalhes aprofundados sobre a arquitetura, consulte [docs/architecture.md](docs/architecture.md).

---

## 📋 Pré-requisitos

- **Node.js**: Versão 20.x ou superior (desenvolvido e testado na v24)
- **npm**: Versão 10.x ou superior
- **Git**

---

## 🚀 Instalação e Execução Local

### 1. Clonar o repositório
```bash
git clone https://github.com/DiegoOGoncalves/bot-service.git
cd bot-service
```

### 2. Configurar Variáveis de Ambiente
As variáveis são isoladas por aplicação. Copie os modelos em cada pasta:

```bash
# Backend API
cp apps/api/.env.example apps/api/.env

# Frontend Web
cp apps/web/.env.example apps/web/.env
```

Configurações padrão:
- `apps/api/.env`: `PORT=3001`, `NODE_ENV=development`, `CORS_ORIGIN=http://localhost:5173`
- `apps/web/.env`: `VITE_API_URL=http://localhost:3001`

> **Nota sobre CORS em Produção:** No backend (`apps/api/.env`), a variável `CORS_ORIGIN` deve ser definida com a origem pública real do frontend (por exemplo, `https://app.meudominio.com`), restringindo o acesso apenas ao domínio autorizado.

*(Nota: O arquivo `.env.example` na raiz serve como referência consolidada de arquitetura).*

### 3. Instalar Dependências
Na raiz do monorepo, execute:
```bash
npm install
```

### 4. Executar em Modo de Desenvolvimento

Para rodar **frontend e backend simultaneamente**:
```bash
npm run dev
```

Ou execute cada serviço de forma isolada:
```bash
# Apenas a API (porta 3001)
npm run dev:api

# Apenas o Frontend (porta 5173)
npm run dev:web
```

Acesse os serviços:
- **Frontend Web**: [http://localhost:5173](http://localhost:5173)
- **Backend Health Check**: [http://localhost:3001/api/health](http://localhost:3001/api/health)

---

## 🛠️ Scripts Disponíveis

A partir da raiz do monorepo:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia Frontend e Backend simultaneamente em modo de desenvolvimento |
| `npm run dev:api` | Inicia o servidor backend com recarregamento a quente (`tsx watch`) |
| `npm run dev:web` | Inicia o servidor de desenvolvimento do frontend (`vite`) |
| `npm test` | Executa os testes automatizados da API via runner nativo do Node.js |
| `npm run typecheck` | Executa checagem de tipos TypeScript do backend e frontend (app e vite.config) |
| `npm run build` | Executa verificação e build de produção de todas as aplicações |
| `npm run build:api` | Transpila o backend TypeScript para `apps/api/dist` |
| `npm run build:web` | Verifica tipos e compila o frontend React para `apps/web/dist` |
| `npm run start:api` | Executa a API compilada em modo de produção |

---

## 🧪 Verificação do Health Check da API

O endpoint de diagnóstico da API pode ser verificado diretamente:

```bash
curl http://localhost:3001/api/health
```

Exemplo de resposta:
```json
{
  "status": "ok",
  "message": "Bot Service API está operacional",
  "service": "bot-service-api",
  "environment": "development",
  "timestamp": "2026-10-21T19:30:00.000Z",
  "uptime": "12.45s"
}
```

---

## 📄 Licença
Distribuído sob a licença MIT.
