import { Request, Response, NextFunction } from 'express';
import { HealthLogsService } from './health-logs.service';
import { HealthLogQueryInput } from '@medsecure/validation';
import { ApiSuccessResponse, HealthLogData, PaginatedResult } from '@medsecure/types';

export class HealthLogsController {
  static async getMyLogs(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await HealthLogsService.getPatientLogs(
        req.user!.id,
        req.query as unknown as HealthLogQueryInput
      );

      const response: ApiSuccessResponse<PaginatedResult<HealthLogData>> = {
        success: true,
        data: result,
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async createMyLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const created = await HealthLogsService.createLog(
        req.user!.id,
        req.user!.id,
        req.user!.role,
        req.body
      );

      const response: ApiSuccessResponse<HealthLogData> = {
        success: true,
        data: created,
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };

      res.status(201).json(response);
    } catch (err) {
      next(err);
    }
  }
}
