import type { Request, Response, NextFunction } from 'express';
import  {  ZodObject, ZodError } from 'zod';

export const validate = (schema: ZodObject) => 
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // We validate the body of the request against our schema
      schema.parse(req.body);
      next(); // If valid, move to the controller
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: 'fail',
          errors: error.issues.map(e => ({ path: e.path, message: e.message }))
        });
      }
      next(error);
    }
  };