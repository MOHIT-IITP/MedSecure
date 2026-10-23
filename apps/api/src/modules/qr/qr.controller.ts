import { Request, Response, NextFunction } from 'express';
import { QrService } from './qr.service';
import { ApiSuccessResponse, ApiErrorResponse, QrPublicEmergencyView } from '@medsecure/types';

export class QrController {
  static async generate(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await QrService.generateToken(req.user!.id, req.body);

      const response: ApiSuccessResponse<{
        token: string;
        expiresAt: string;
        label?: string;
      }> = {
        success: true,
        data: result,
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async revoke(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await QrService.revokeTokens(req.user!.id);

      const response: ApiSuccessResponse<{ message: string }> = {
        success: true,
        data: { message: 'All active QR tokens successfully revoked' },
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async getPublicRecord(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const token = req.params.token;
      const meta = {
        ipAddress: req.ip,
        userAgent: req.get('user-agent'),
      };

      const record = await QrService.getPublicEmergencyData(token, meta);

      if (!record) {
        const errorResponse: ApiErrorResponse = {
          success: false,
          error: {
            code: 'TOKEN_INVALID_OR_EXPIRED',
            message: 'This emergency QR code is invalid, expired, or has been revoked.',
          },
          requestId: req.id,
          timestamp: new Date().toISOString(),
        };
        res.status(404).json(errorResponse);
        return;
      }

      const response: ApiSuccessResponse<QrPublicEmergencyView> = {
        success: true,
        data: record,
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
