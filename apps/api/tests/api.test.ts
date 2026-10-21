import path from 'path';
import dotenv from 'dotenv';

// Carrega as variáveis de ambiente antes da execução dos testes
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import { app } from '../src/app';
import { errorHandler } from '../src/middlewares/errorHandler';

describe('Bot Service API — Testes da Etapa 1', () => {
  it('GET /api/health deve retornar 200 e a estrutura JSON esperada', async () => {
    const res = await request(app).get('/api/health');

    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.service, 'bot-service-api');
    assert.equal(typeof res.body.message, 'string');
    assert.equal(typeof res.body.uptime, 'string');
    assert.equal(typeof res.body.timestamp, 'string');
  });

  it('Rota inexistente deve retornar 404 e payload consistente', async () => {
    const res = await request(app).get('/api/rota-inexistente-para-teste');

    assert.equal(res.status, 404);
    assert.equal(res.body.status, 'error');
    assert.equal(res.body.statusCode, 404);
    assert.match(res.body.message, /Rota não encontrada/);
  });

  it('JSON malformado no corpo da requisição deve retornar 400', async () => {
    const res = await request(app)
      .post('/api/health')
      .set('Content-Type', 'application/json')
      .send('{ "json_invalido: true ');

    assert.equal(res.status, 400);
    assert.equal(res.body.status, 'error');
    assert.equal(res.body.statusCode, 400);
    assert.equal(res.body.message, 'JSON malformado no corpo da requisição');
  });

  it('Middleware de erro em produção não deve expor stack trace nem mensagens internas em erros 500', async () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    try {
      const testApp = express();
      testApp.get('/test-error', (_req: Request, _res: Response, next: NextFunction) => {
        next(new Error('Erro interno com dados confidenciais do banco'));
      });
      testApp.use(errorHandler);

      const res = await request(testApp).get('/test-error');

      assert.equal(res.status, 500);
      assert.equal(res.body.status, 'error');
      assert.equal(res.body.statusCode, 500);
      assert.equal(res.body.message, 'Erro interno do servidor');
      assert.equal(res.body.stack, undefined);
    } finally {
      if (originalEnv === undefined) {
        delete process.env.NODE_ENV;
      } else {
        process.env.NODE_ENV = originalEnv;
      }
    }
  });
});
