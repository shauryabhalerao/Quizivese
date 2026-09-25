/**
 * Centralized API Client Service
 * Handles outbound requests, automatic JWT header injection, and response parsing.
 */

const resolveBaseUrl = () => {
  const envUrl = (import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_API_URL || '').trim();
  if (envUrl) {
    return envUrl.endsWith('/api') ? envUrl : `${envUrl.replace(/\/$/, '')}/api`;
  }
  // When running in production browser environment (e.g. Vercel deployment)
  if (typeof window !== 'undefined' && window.location && window.location.hostname &&
      !window.location.hostname.includes('localhost') && 
      !window.location.hostname.includes('127.0.0.1')) {
    return '/api';
  }
  return 'http://localhost:5001/api';
};

const API_BASE_URL = resolveBaseUrl();

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getToken() {
    return localStorage.getItem('quiziverse_token');
  }

  setToken(token) {
    if (token) {
      localStorage.setItem('quiziverse_token', token);
    } else {
      localStorage.removeItem('quiziverse_token');
    }
  }

  getHeaders(customHeaders = {}, isFormData = false) {
    const headers = { ...customHeaders };
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const headers = this.getHeaders(options.headers, options.isFormData);

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
        }

        const error = new Error(data?.error?.message || response.statusText || 'API Request Failed');
        error.status = response.status;
        error.code = data?.error?.code;
        error.details = data?.error?.details;
        throw error;
      }

      return data;
    } catch (err) {
      if (!err.status) {
        console.error(`[API NETWORK FAILURE] Unable to reach backend at "${url}". Verify backend server deployment, VITE_API_BASE_URL, and CORS settings.`);
      } else {
        console.error(`[API ERROR ${err.status}] Endpoint "${url}" failed:`, err.message);
      }
      throw err;
    }
  }

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  post(endpoint, body, options = {}) {
    const isFormData = typeof FormData !== 'undefined' && body instanceof FormData;
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: isFormData ? body : JSON.stringify(body),
      isFormData
    });
  }

  postForm(endpoint, formData, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: formData,
      isFormData: true
    });
  }

  put(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(body)
    });
  }

  patch(endpoint, body, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(body)
    });
  }

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const api = new ApiClient(API_BASE_URL);
