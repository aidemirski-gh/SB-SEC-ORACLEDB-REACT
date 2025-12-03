const API_BASE_URL = '/api';

export interface HealthResponse {
  status: string;
  message: string;
  timestamp: string;
}

export interface InfoResponse {
  application: string;
  version: string;
  description: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  languagePreference: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  languagePreference?: string;
}

class ApiService {
  private getAuthToken(): string | null {
    return localStorage.getItem('token');
  }

  private async fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
    const token = this.getAuthToken();
    const language = localStorage.getItem('i18nextLng') || 'en';

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept-Language': language,
      ...options?.headers,
    };

    if (token) {
      // @ts-ignore
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      const error = await response.text();
      throw new Error(error || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // Auth endpoints
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await this.fetchJson<AuthResponse>(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    return response;
  }

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    const response = await this.fetchJson<AuthResponse>(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response));
    return response;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  getCurrentUser(): AuthResponse | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getAuthToken();
  }

  // Public endpoints
  async getHealth(): Promise<HealthResponse> {
    return this.fetchJson<HealthResponse>(`${API_BASE_URL}/health`);
  }

  async getInfo(): Promise<InfoResponse> {
    return this.fetchJson<InfoResponse>(`${API_BASE_URL}/info`);
  }

  // User preference endpoints
  async updateUserLanguagePreference(userId: number, languagePreference: string): Promise<void> {
    await this.fetchJson<void>(`${API_BASE_URL}/users/${userId}/preferences`, {
      method: 'PATCH',
      body: JSON.stringify({ languagePreference }),
    });
  }
}

export const apiService = new ApiService();
