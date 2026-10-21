import { Request, Response, NextFunction } from 'express';

export function notFoundHandler(req: Request, res: Response, _next: NextFunction): void {
  res.status(404).json({
    status: 'error',
    statusCode: 404,
    message: `Rota não encontrada: ${req.method} ${req.originalUrl}`,
  });
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[API Error]:', err);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}
