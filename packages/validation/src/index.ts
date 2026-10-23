import { z } from 'zod';

/**
 * User role schema
 */
export const userRoleSchema = z.enum(['patient', 'doctor', 'admin']);
export type UserRole = z.infer<typeof userRoleSchema>;

/**
 * Common ID parameter schema
 */
export const idParamSchema = z.object({
  id: z.string().uuid({ message: 'Invalid ID format, expected UUID' }),
});

/**
 * Common pagination query schema
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

/**
 * Password Policy:
 * - At least 8 characters
 * - At least 1 uppercase letter
 * - At least 1 lowercase letter
 * - At least 1 number
 * - At least 1 special character
 */
export const passwordPolicySchema = z
  .string()
  .min(8, 'Password must be at least 8 characters long')
  .max(128, 'Password must not exceed 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

/**
 * Signup Schema
 */
export const signupSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Invalid email address' }),
  password: passwordPolicySchema,
  name: z.string().trim().min(2, { message: 'Name must be at least 2 characters long' }),
  role: z.enum(['patient', 'doctor']).default('patient'),
  phone: z.string().trim().max(50).optional().nullable(),
});
export type SignupInput = z.infer<typeof signupSchema>;

/**
 * Login Schema
 */
export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email({ message: 'Invalid email address' }),
  password: z.string().min(1, { message: 'Password is required' }),
});
export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Update Patient Profile Schema
 */
export const updatePatientProfileSchema = z.object({
  dateOfBirth: z.string().max(20).optional().nullable(),
  gender: z.string().max(50).optional().nullable(),
  address: z.string().max(500).optional().nullable(),
  emergencyContactName: z.string().max(255).optional().nullable(),
  emergencyContactPhone: z.string().max(50).optional().nullable(),
  emergencyContactRelationship: z.string().max(100).optional().nullable(),
});
export type UpdatePatientProfileInput = z.infer<typeof updatePatientProfileSchema>;

/**
 * Update Medical Details Schema
 */
export const updateMedicalDetailsSchema = z.object({
  bloodGroup: z.string().max(10).optional().nullable(),
  allergies: z.string().max(1000).optional().nullable(),
  medications: z.string().max(1000).optional().nullable(),
  chronicConditions: z.string().max(1000).optional().nullable(),
  organDonor: z.enum(['yes', 'no', 'undecided']).optional().nullable(),
  emergencyNotes: z.string().max(1000).optional().nullable(),
});
export type UpdateMedicalDetailsInput = z.infer<typeof updateMedicalDetailsSchema>;

/**
 * Health Log Creation Schema
 */
export const createHealthLogSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(255),
  content: z.string().trim().min(1, 'Content is required').max(5000),
  vitals: z.string().max(1000).optional().nullable(),
});
export type CreateHealthLogInput = z.infer<typeof createHealthLogSchema>;

/**
 * Health Log Query Schema
 */
export const healthLogQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
export type HealthLogQueryInput = z.infer<typeof healthLogQuerySchema>;

/**
 * Create QR Token Schema
 */
export const createQrTokenSchema = z.object({
  expiresInHours: z.coerce.number().int().min(1).max(720).default(24),
  label: z.string().trim().max(100).optional().nullable(),
});
export type CreateQrTokenInput = z.infer<typeof createQrTokenSchema>;

/**
 * Public Token Param Schema
 */
export const publicTokenParamSchema = z.object({
  token: z.string().min(16, 'Invalid token format').max(128),
});

/**
 * Environment configuration validation schema for apps/api
 */
export const apiEnvSchema = z
  .object({
    PORT: z.coerce.number().int().positive().default(4000),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    DATABASE_URL: z.string().optional(),
    JWT_SECRET: z.string().min(16, { message: 'JWT_SECRET must be at least 16 characters long' }),
    DOCS_ORIGIN: z.string().url({ message: 'DOCS_ORIGIN must be a valid URL' }),
    WEB_ORIGIN: z.string().url({ message: 'WEB_ORIGIN must be a valid URL' }),
    COOKIE_SECURE: z
      .string()
      .optional()
      .default('false')
      .transform((val) => val === 'true'),
    ALLOW_OFFLINE_DEV: z
      .string()
      .optional()
      .default('false')
      .transform((val) => val === 'true'),
  })
  .superRefine((data, ctx) => {
    if (!data.ALLOW_OFFLINE_DEV && data.NODE_ENV !== 'test') {
      if (!data.DATABASE_URL || data.DATABASE_URL.trim() === '') {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['DATABASE_URL'],
          message:
            'DATABASE_URL is required. Set a valid Supabase PostgreSQL connection string or set ALLOW_OFFLINE_DEV=true for offline development.',
        });
      } else if (
        !data.DATABASE_URL.startsWith('postgresql://') &&
        !data.DATABASE_URL.startsWith('postgres://')
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['DATABASE_URL'],
          message: 'DATABASE_URL must be a valid PostgreSQL connection string starting with postgresql:// or postgres://',
        });
      }
    }
  });

export type ApiEnv = z.infer<typeof apiEnvSchema>;
