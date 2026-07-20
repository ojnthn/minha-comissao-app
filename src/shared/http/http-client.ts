export interface ApiErrorBody {
  statusCode: number;
  message: string | string[];
}

export class ApiError extends Error {
  readonly statusCode: number;
  readonly body: ApiErrorBody;

  constructor(statusCode: number, body: ApiErrorBody) {
    super(Array.isArray(body.message) ? body.message.join(', ') : body.message);
    this.statusCode = statusCode;
    this.body = body;
  }
}

export interface HttpClientConfig {
  getToken: () => string | null;
  onUnauthorized: () => void;
}

let config: HttpClientConfig = {
  getToken: () => null,
  onUnauthorized: () => {},
};

/** Chamado pelo container da feature `auth` — shared/ não acopla a sessionStorage direto. */
export function configureHttpClient(nextConfig: HttpClientConfig): void {
  config = nextConfig;
}

const baseUrl = import.meta.env.VITE_API_URL;

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = config.getToken();
  const headers = new Headers(init?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${baseUrl}${path}`, { ...init, headers });

  // Só força logout/redirect se a chamada já ia autenticada — um 401 sem
  // token é resposta normal de endpoint público (ex.: /auth/login com
  // credencial errada), não sessão expirada.
  if (response.status === 401 && token) {
    config.onUnauthorized();
  }

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(response.status, body ?? { statusCode: response.status, message: response.statusText });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

export const httpClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body?: unknown) => request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body?: unknown) => request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
};
