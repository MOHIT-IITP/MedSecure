import { ApiResponse } from '@medsecure/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include', // Guarantees HTTP-only cookies are included
  });

  const text = await response.text();
  let json: ApiResponse<T>;
  try {
    json = JSON.parse(text);
  } catch {
    throw new ApiError(
      'INVALID_RESPONSE',
      `Server returned unexpected response (${response.status})`,
      response.status
    );
  }

  if (!response.ok || !json.success) {
    const errorDetail = (json as any).error || {
      code: 'REQUEST_FAILED',
      message: 'Request to API failed',
    };

    throw new ApiError(
      errorDetail.code || 'UNKNOWN_ERROR',
      errorDetail.message || 'An error occurred',
      response.status,
      errorDetail.details
    );
  }

  return (json as any).data as T;
}
