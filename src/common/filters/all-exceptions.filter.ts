import {
  Catch, HttpException, HttpStatus, Logger, type ArgumentsHost, type ExceptionFilter,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

// @Catch() with no arguments = catches EVERY error, so all of them leave with the same JSON shape
// @Catch() sin argumentos = atrapa TODOS los errores, así todos salen con el mismo formato JSON
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    let status: number = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Error interno del servidor';

    if (exception instanceof HttpException) {
      // Our own exceptions (NotFound, Conflict...) and ValidationPipe errors already carry their status
      // Nuestras excepciones (NotFound, Conflict...) y los errores del ValidationPipe ya traen su código
      status = exception.getStatus();
      const body = exception.getResponse();
      message = typeof body === 'string'
        ? body
        : ((body as { message?: string | string[] }).message ?? exception.message);
    } else if (exception instanceof EntityNotFoundError) {
      status = HttpStatus.NOT_FOUND;
      message = 'El recurso solicitado no existe';
    } else if (exception instanceof QueryFailedError) {
      // Translate PostgreSQL error codes into HTTP codes so DB errors never become a 500
      // Se traducen los códigos de error de PostgreSQL a HTTP para que nunca terminen en 500
      const code = (exception.driverError as { code?: string }).code;
      if (code === '23505') {
        status = HttpStatus.CONFLICT;
        message = 'El registro ya existe (valor duplicado)';
      } else if (code === '23503') {
        status = HttpStatus.CONFLICT;
        message = 'Se referencia un registro que no existe o que tiene datos relacionados';
      } else if (code === '23502' || code === '22P02' || code === '22007' || code === '22008') {
        status = HttpStatus.BAD_REQUEST;
        message = 'Datos con formato inválido';
      }
    }

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) this.logger.error(exception);

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }
}
