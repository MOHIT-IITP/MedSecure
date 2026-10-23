import { Request, Response, NextFunction } from 'express';
import { MedicalDetailsService } from './medical-details.service';
import { ApiSuccessResponse, MedicalDetailsData } from '@medsecure/types';

export class MedicalDetailsController {
  static async getMyDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const details = await MedicalDetailsService.getDetails(req.user!.id);

      const response: ApiSuccessResponse<MedicalDetailsData> = {
        success: true,
        data: details,
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async updateMyDetails(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const details = await MedicalDetailsService.updateDetails(req.user!.id, req.body);

      const response: ApiSuccessResponse<MedicalDetailsData> = {
        success: true,
        data: details,
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
