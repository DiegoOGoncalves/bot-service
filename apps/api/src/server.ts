import path from 'path';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente uma única vez no início do processo
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { app } from './app';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const server = app.listen(PORT, () => {
  console.log(`[API] Servidor rodando na porta ${PORT}`);
  console.log(`[API] Health check disponível em http://localhost:${PORT}/api/health`);
});

// Tratamento para encerramento gracioso (Graceful Shutdown)
function shutdown(signal: string) {
  console.log(`\n[API] Recebido sinal ${signal}. Encerrando servidor graciosamente...`);
  server.close(() => {
    console.log('[API] Servidor HTTP encerrado.');
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
