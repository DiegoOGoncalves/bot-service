import dotenv from 'dotenv';
import { app } from './app';

// Carrega as variáveis de ambiente do .env local se existir
dotenv.config();

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
