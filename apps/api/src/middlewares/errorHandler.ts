import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
}

interface HttpError extends Error {
  status?: number;
  statusCode?: number;
  type?: string;
  body?: unknown;
}

export function errorHandler(
  err: HttpError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Identifica erro de parsing de JSON do Express/body-parser
  const isMalformedJson =
    (err instanceof SyntaxError && 'body' in err) || err.type === 'entity.parse.failed';

  // Preserva código HTTP válido de erros conhecidos ou usa 500 como fallback
  let statusCode = 500;
  if (isMalformedJson) {
    statusCode = 400;
  } else if (typeof err.statusCode === 'number' && err.statusCode >= 400 && err.statusCode <= 599) {
    statusCode = err.statusCode;
  } else if (typeof err.status === 'number' && err.status >= 400 && err.status <= 599) {
    statusCode = err.status;
  } else if (res.statusCode >= 400 && res.statusCode <= 599) {
    statusCode = res.statusCode;
  }

  const isProduction = process.env.NODE_ENV === 'production';

  // Mensagem segura: em produção, não expõe detalhes de erros 500
  let message: string;
  if (isMalformedJson) {
    message = 'JSON malformado no corpo da requisição';
  } else if (isProduction && statusCode >= 500) {
    message = 'Erro interno do servidor';
  } else {
    message = err.message || 'Erro interno do servidor';
  }

  if (process.env.NODE_ENV !== 'test') {
    console.error(`[API Error] ${statusCode} - ${err.message}`);
  }

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    ...(!isProduction && err.stack ? { stack: err.stack } : {}),
  });
}
