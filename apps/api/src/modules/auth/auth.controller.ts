import { Request, Response, NextFunction } from 'express';
import { AuthService, AuthError } from './auth.service';
import { setAuthCookie, clearAuthCookie } from '../../utils/cookies';
import { ApiSuccessResponse, ApiErrorResponse, SafeUser } from '@medsecure/types';

export class AuthController {
  static async signup(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = {
        userAgent: req.get('user-agent'),
        ipAddress: req.ip,
      };

      const { user, token } = await AuthService.signup(req.body, meta);
      setAuthCookie(res, token);

      const response: ApiSuccessResponse<{ user: SafeUser }> = {
        success: true,
        data: { user },
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (err) {
      if (err instanceof AuthError) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: err.code,
            message: err.message,
          },
          requestId: req.id,
          timestamp: new Date().toISOString(),
        };
        res.status(err.statusCode).json(errorResponse);
        return;
      }
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const meta = {
        userAgent: req.get('user-agent'),
        ipAddress: req.ip,
      };

      const { user, token } = await AuthService.login(req.body, meta);
      setAuthCookie(res, token);

      const response: ApiSuccessResponse<{ user: SafeUser }> = {
        success: true,
        data: { user },
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (err) {
      if (err instanceof AuthError) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: err.code,
            message: err.message,
          },
          requestId: req.id,
          timestamp: new Date().toISOString(),
        };
        res.status(err.statusCode).json(errorResponse);
        return;
      }
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.sessionId) {
        await AuthService.logout(req.sessionId);
      }

      clearAuthCookie(res);

      const response: ApiSuccessResponse<{ message: string }> = {
        success: true,
        data: { message: 'Logged out successfully' },
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: Request, res: Response): Promise<void> {
    const response: ApiSuccessResponse<{ user: SafeUser }> = {
      success: true,
      data: { user: req.user! },
      requestId: req.id,
      timestamp: new Date().toISOString(),
    };

    res.status(200).json(response);
  }
}
