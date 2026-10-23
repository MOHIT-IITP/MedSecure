import { Request, Response, NextFunction } from 'express';
import { PatientsService } from './patients.service';
import { ApiSuccessResponse, PatientProfileData } from '@medsecure/types';

export class PatientsController {
  static async getMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await PatientsService.getProfile(req.user!.id);

      const response: ApiSuccessResponse<PatientProfileData> = {
        success: true,
        data: profile,
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }

  static async updateMyProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const profile = await PatientsService.updateProfile(req.user!.id, req.body);

      const response: ApiSuccessResponse<PatientProfileData> = {
        success: true,
        data: profile,
        requestId: req.id,
        timestamp: new Date().toISOString(),
      };

      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  }
}
