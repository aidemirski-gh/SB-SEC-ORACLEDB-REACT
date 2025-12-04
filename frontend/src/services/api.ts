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
  roles: string[];
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

export interface Role {
  id: number;
  name: string;
  description?: string;
  systemRole: boolean;
  userCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: Role[];
  enabled: boolean;
  languagePreference: string;
  createdAt: string;
  updatedAt: string;
}

export interface Privilege {
  id: number;
  name: string;
  description?: string;
  category: string;
  roleCount: number;
  createdAt: string;
  updatedAt: string;
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

  // Role management endpoints
  async getAllRoles(): Promise<Role[]> {
    return this.fetchJson<Role[]>(`${API_BASE_URL}/roles`);
  }

  async getRoleById(id: number): Promise<Role> {
    return this.fetchJson<Role>(`${API_BASE_URL}/roles/${id}`);
  }

  async createRole(data: { name: string; description?: string }): Promise<Role> {
    return this.fetchJson<Role>(`${API_BASE_URL}/roles`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateRole(id: number, data: { description?: string }): Promise<Role> {
    return this.fetchJson<Role>(`${API_BASE_URL}/roles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteRole(id: number): Promise<void> {
    await this.fetchJson<void>(`${API_BASE_URL}/roles/${id}`, {
      method: 'DELETE',
    });
  }

  // User management endpoints
  async getAllUsers(): Promise<UserInfo[]> {
    return this.fetchJson<UserInfo[]>(`${API_BASE_URL}/users`);
  }

  async getUserById(id: number): Promise<UserInfo> {
    return this.fetchJson<UserInfo>(`${API_BASE_URL}/users/${id}`);
  }

  async updateUserRole(userId: number, roleId: number): Promise<UserInfo> {
    return this.fetchJson<UserInfo>(`${API_BASE_URL}/users/${userId}/role`, {
      method: 'PUT',
      body: JSON.stringify({ roleId }),
    });
  }

  // Privilege management endpoints
  async getAllPrivileges(): Promise<Privilege[]> {
    return this.fetchJson<Privilege[]>(`${API_BASE_URL}/privileges`);
  }

  async getPrivilegeById(id: number): Promise<Privilege> {
    return this.fetchJson<Privilege>(`${API_BASE_URL}/privileges/${id}`);
  }

  async getPrivilegesByCategory(category: string): Promise<Privilege[]> {
    return this.fetchJson<Privilege[]>(`${API_BASE_URL}/privileges/category/${category}`);
  }

  async getPrivilegeCategories(): Promise<string[]> {
    return this.fetchJson<string[]>(`${API_BASE_URL}/privileges/categories`);
  }

  async createPrivilege(data: { name: string; description?: string; category?: string }): Promise<Privilege> {
    return this.fetchJson<Privilege>(`${API_BASE_URL}/privileges`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updatePrivilege(id: number, data: { description?: string; category?: string }): Promise<Privilege> {
    return this.fetchJson<Privilege>(`${API_BASE_URL}/privileges/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deletePrivilege(id: number): Promise<void> {
    await this.fetchJson<void>(`${API_BASE_URL}/privileges/${id}`, {
      method: 'DELETE',
    });
  }

  // Role privileges management endpoints
  async getRolePrivileges(roleId: number): Promise<Privilege[]> {
    return this.fetchJson<Privilege[]>(`${API_BASE_URL}/roles/${roleId}/privileges`);
  }

  async updateRolePrivileges(roleId: number, privilegeIds: number[]): Promise<Role> {
    return this.fetchJson<Role>(`${API_BASE_URL}/roles/${roleId}/privileges`, {
      method: 'PUT',
      body: JSON.stringify({ privilegeIds }),
    });
  }

  async addPrivilegeToRole(roleId: number, privilegeId: number): Promise<Role> {
    return this.fetchJson<Role>(`${API_BASE_URL}/roles/${roleId}/privileges/${privilegeId}`, {
      method: 'POST',
    });
  }

  async removePrivilegeFromRole(roleId: number, privilegeId: number): Promise<Role> {
    return this.fetchJson<Role>(`${API_BASE_URL}/roles/${roleId}/privileges/${privilegeId}`, {
      method: 'DELETE',
    });
  }
}

export const apiService = new ApiService();
