import React, { useEffect, useState } from 'react';
import './App.css';

interface HealthData {
  status: string;
  message: string;
  service: string;
  environment: string;
  timestamp: string;
  uptime: string;
}

export function App(): React.ReactElement {
  const [apiData, setApiData] = useState<HealthData | null>(null);
  const [apiLoading, setApiLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';

  const checkApiHealth = async () => {
    setApiLoading(true);
    setApiError(null);
    try {
      const response = await fetch(`${apiUrl}/api/health`);
      if (!response.ok) {
        throw new Error(`Resposta HTTP inválida: ${response.status}`);
      }
      const data: HealthData = await response.json();
      setApiData(data);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Falha ao conectar com o backend');
      setApiData(null);
    } finally {
      setApiLoading(false);
    }
  };

  useEffect(() => {
    checkApiHealth();
  }, [apiUrl]);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="logo-area">
          <div className="logo-icon" aria-hidden="true">🤖</div>
          <h1 className="logo-title">Bot Service</h1>
        </div>
        <span className="stage-badge">Etapa 1 • Base Técnica</span>
      </header>

      {/* Hero Section */}
      <main>
        <section className="hero-section">
          <h2 className="hero-title">Bot Service</h2>
          <p className="hero-description">
            Plataforma de configuração e simulação de chatbots.
          </p>

          {/* Indicador visual de que o frontend está funcionando */}
          <div className="status-pill" id="frontend-status" data-testid="frontend-status">
            <span className="pulse-dot" aria-hidden="true"></span>
            <span>Frontend Operacional • React + TypeScript + Vite</span>
          </div>
        </section>

        {/* Informações da Estrutura */}
        <section className="cards-grid">
          <article className="card">
            <h3 className="card-title">📦 Arquitetura Monorepo</h3>
            <p className="card-content">
              Estrutura modular com separação clara de responsabilidades entre cliente e servidor,
              gerenciada via npm workspaces.
            </p>
            <div className="tech-tags">
              <span className="tech-tag">apps/web</span>
              <span className="tech-tag">apps/api</span>
              <span className="tech-tag">npm workspaces</span>
            </div>
          </article>

          <article className="card">
            <h3 className="card-title">⚡ Integração com Backend API</h3>
            <p className="card-content">
              Status da conexão com o endpoint <code>/api/health</code>:
            </p>
            {apiLoading && (
              <div className="api-status-box checking">
                Verificando conexão com a API ({apiUrl})...
              </div>
            )}
            {!apiLoading && apiData && (
              <div className="api-status-box online" id="api-status">
                <strong>✓ Conectado:</strong> {apiData.message} <br />
                <small>Serviço: {apiData.service} | Uptime: {apiData.uptime}</small>
              </div>
            )}
            {!apiLoading && apiError && (
              <div className="api-status-box offline">
                <strong>✕ API offline:</strong> {apiError} <br />
                <button className="retry-button" onClick={checkApiHealth}>
                  Tentar novamente
                </button>
              </div>
            )}
          </article>

          <article className="card">
            <h3 className="card-title">🛠️ Tecnologias Definidas</h3>
            <p className="card-content">
              Stack moderna com tipagem estática e tooling veloz para produtividade e confiabilidade:
            </p>
            <div className="tech-tags">
              <span className="tech-tag">React 18</span>
              <span className="tech-tag">TypeScript</span>
              <span className="tech-tag">Vite</span>
              <span className="tech-tag">Node.js</span>
              <span className="tech-tag">Express</span>
            </div>
          </article>
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>Bot Service &copy; {new Date().getFullYear()} — Projeto de Portfólio Full Stack</p>
      </footer>
    </div>
  );
}

export default App;
