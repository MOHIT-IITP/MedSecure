export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'MedSecure Backend API',
    version: '0.1.0',
    description:
      'Digital health-record and emergency QR platform API providing patient profiles, medical details, health logs, and revocable emergency access tokens.',
  },
  servers: [
    {
      url: '/api',
      description: 'Default API Endpoint',
    },
  ],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'medsecure_session',
        description: 'HTTP-only session cookie set upon successful login or registration.',
      },
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      ApiSuccessResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: true },
          data: { type: 'object' },
          requestId: { type: 'string', example: 'd3b07384-d113-4f96-857c-2b2df642279b' },
          timestamp: { type: 'string', format: 'date-time' },
        },
        required: ['success', 'data', 'timestamp'],
      },
      ApiErrorResponse: {
        type: 'object',
        properties: {
          success: { type: 'boolean', example: false },
          error: {
            type: 'object',
            properties: {
              code: { type: 'string', example: 'UNAUTHORIZED' },
              message: { type: 'string', example: 'Authentication required' },
              details: { type: 'object' },
            },
            required: ['code', 'message'],
          },
          requestId: { type: 'string' },
          timestamp: { type: 'string', format: 'date-time' },
        },
        required: ['success', 'error', 'timestamp'],
      },
      SafeUser: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          role: { type: 'string', enum: ['patient', 'doctor', 'admin'] },
          phone: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      PatientProfile: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          dateOfBirth: { type: 'string', nullable: true },
          gender: { type: 'string', nullable: true },
          address: { type: 'string', nullable: true },
          emergencyContactName: { type: 'string', nullable: true },
          emergencyContactPhone: { type: 'string', nullable: true },
          emergencyContactRelationship: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      MedicalDetails: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          userId: { type: 'string', format: 'uuid' },
          bloodGroup: { type: 'string', nullable: true, example: 'O+' },
          allergies: { type: 'string', nullable: true, example: 'Penicillin, Peanuts' },
          medications: { type: 'string', nullable: true },
          chronicConditions: { type: 'string', nullable: true, example: 'Type 1 Diabetes' },
          organDonor: { type: 'string', enum: ['yes', 'no', 'undecided'], nullable: true },
          emergencyNotes: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      HealthLog: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          patientId: { type: 'string', format: 'uuid' },
          authorId: { type: 'string', format: 'uuid' },
          authorName: { type: 'string', nullable: true },
          authorRole: { type: 'string', nullable: true },
          entryType: { type: 'string', enum: ['patient_note', 'doctor_consultation'] },
          title: { type: 'string' },
          content: { type: 'string' },
          vitals: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      QrPublicEmergencyView: {
        type: 'object',
        properties: {
          patientName: { type: 'string' },
          bloodGroup: { type: 'string', nullable: true },
          allergies: { type: 'string', nullable: true },
          chronicConditions: { type: 'string', nullable: true },
          emergencyNotes: { type: 'string', nullable: true },
          emergencyContactName: { type: 'string', nullable: true },
          emergencyContactPhone: { type: 'string', nullable: true },
          emergencyContactRelationship: { type: 'string', nullable: true },
          organDonor: { type: 'string', nullable: true },
        },
      },
    },
  },
  paths: {
    '/health': {
      get: {
        summary: 'Liveness Probe',
        description: 'Verifies the HTTP application server is healthy and accepting traffic.',
        responses: {
          200: { description: 'Server is healthy' },
        },
      },
    },
    '/ready': {
      get: {
        summary: 'Readiness Probe',
        description: 'Verifies downstream connectivity to Supabase PostgreSQL.',
        responses: {
          200: { description: 'Database connected and operational' },
          503: { description: 'Database unreachable' },
        },
      },
    },
    '/auth/signup': {
      post: {
        summary: 'Register User',
        description: 'Creates a new user account, initializes empty patient records, and issues a session.',
        responses: {
          201: { description: 'User created and signed in' },
          400: { description: 'Validation error' },
          409: { description: 'Email already registered' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'User Login',
        description: 'Authenticates credentials and sets an HTTP-only session cookie.',
        responses: {
          200: { description: 'Authentication successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/logout': {
      post: {
        summary: 'User Logout',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        description: 'Revokes the active session on the server and clears the session cookie.',
        responses: {
          200: { description: 'Session revoked and cookie cleared' },
          401: { description: 'Unauthenticated' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get Current Authenticated User',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: { description: 'Current user profile' },
          401: { description: 'Session invalid, expired, or revoked' },
        },
      },
    },
    '/patients/me': {
      get: {
        summary: 'Get Patient Profile',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: { description: 'Patient demographic profile' },
          401: { description: 'Unauthorized' },
        },
      },
      put: {
        summary: 'Update Patient Profile',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: { description: 'Profile updated' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/medical-details/me': {
      get: {
        summary: 'Get Medical Details',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: { description: 'Medical details' },
          401: { description: 'Unauthorized' },
        },
      },
      put: {
        summary: 'Update Medical Details',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: { description: 'Medical details updated' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/patients/me/health-logs': {
      get: {
        summary: 'Get Paginated Health Logs',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        parameters: [
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 10 } },
        ],
        responses: {
          200: { description: 'Paginated health log entries' },
        },
      },
      post: {
        summary: 'Create Health Log Note',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          201: { description: 'Health log entry created' },
          400: { description: 'Validation error' },
        },
      },
    },
    '/qr': {
      post: {
        summary: 'Generate Revocable QR Token',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          201: { description: 'QR access token generated' },
        },
      },
    },
    '/qr/revoke': {
      post: {
        summary: 'Revoke Active QR Tokens',
        security: [{ cookieAuth: [] }, { bearerAuth: [] }],
        responses: {
          200: { description: 'All QR tokens for patient revoked' },
        },
      },
    },
    '/public/patients/{token}': {
      get: {
        summary: 'Public Emergency Record View',
        description:
          'Rate-limited public emergency scan. Validates token hash and returns strictly emergency-approved data.',
        parameters: [
          { name: 'token', in: 'path', required: true, schema: { type: 'string' } },
        ],
        responses: {
          200: { description: 'Emergency medical summary' },
          404: { description: 'Invalid, expired, or revoked token' },
          429: { description: 'Rate limit exceeded' },
        },
      },
    },
  },
};
