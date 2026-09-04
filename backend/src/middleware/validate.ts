import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

export const validate = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const parsed: any = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      if (parsed?.body !== undefined) req.body = parsed.body;
      if (parsed?.query !== undefined) (req as any).query = parsed.query;
      if (parsed?.params !== undefined) (req as any).params = parsed.params;
      next();
    } catch (error: any) {
      if (error instanceof ZodError || error.name === 'ZodError' || Array.isArray(error.issues)) {
        const fields: Record<string, string> = {};
        const issues = error.issues || error.errors || [];
        issues.forEach((err: any) => {
          if (err.path && err.path.length > 0) {
            const key = err.path.join('.');
            // Simplify nested paths like "body.email" to "email" if it starts with body/query/params
            const displayKey = ['body', 'query', 'params'].includes(String(err.path[0])) 
              ? err.path.slice(1).join('.') 
              : key;
            fields[displayKey] = err.message;
          }
        });

        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request data',
            fields,
          },
        });
        return;
      }
      next(error);
    }
  };
};
