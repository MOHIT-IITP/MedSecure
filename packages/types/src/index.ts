/**
 * Standard API Success Response
 */
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
  requestId?: string;
  timestamp: string;
}

/**
 * Standard API Error Detail
 */
export interface ApiErrorDetail {
  code: string;
  message: string;
  details?: unknown;
}

/**
 * Standard API Error Response
 */
export interface ApiErrorResponse {
  success: false;
  error: ApiErrorDetail;
  requestId?: string;
  timestamp: string;
}

/**
 * Combined API Response type
 */
export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Health and Readiness response types
 */
export interface HealthStatus {
  status: 'ok' | 'error';
  uptime: number;
  timestamp: string;
  environment: string;
  version: string;
}

export interface ReadinessStatus {
  status: 'ready' | 'unready';
  database: 'connected' | 'disconnected';
  timestamp: string;
  error?: string;
}

/**
 * User roles in MedSecure
 */
export type UserRole = 'patient' | 'doctor' | 'admin';

/**
 * Safe User model (no password hashes)
 */
export interface SafeUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Patient Profile structure
 */
export interface PatientProfileData {
  id: string;
  userId: string;
  dateOfBirth: string | null;
  gender: string | null;
  address: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelationship: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Medical Details structure
 */
export interface MedicalDetailsData {
  id: string;
  userId: string;
  bloodGroup: string | null;
  allergies: string | null;
  medications: string | null;
  chronicConditions: string | null;
  organDonor: string | null;
  emergencyNotes: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Health Log structure
 */
export type HealthLogEntryType = 'patient_note' | 'doctor_consultation';

export interface HealthLogData {
  id: string;
  patientId: string;
  authorId: string;
  authorName?: string;
  authorRole?: string;
  entryType: HealthLogEntryType;
  title: string;
  content: string;
  vitals: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Paginated container
 */
export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/**
 * Public Emergency QR view (strictly emergency fields, redacting full history)
 */
export interface QrPublicEmergencyView {
  patientName: string;
  bloodGroup: string | null;
  allergies: string | null;
  chronicConditions: string | null;
  emergencyNotes: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactRelationship: string | null;
  organDonor: string | null;
}

/**
 * QR Code access payload representation
 */
export interface QrTokenPayload {
  patientId: string;
  tokenVersion: number;
  expiresAt: number;
}
