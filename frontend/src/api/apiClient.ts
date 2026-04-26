/**
 * Generic API Client for ALphaGrew
 * This client handles API requests with authentication tokenautomatically retrieved from localStorage
 */

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') ?? '';

interface RequestOptions extends Omit<RequestInit, 'headers'> {
  headers?: Record<string, string>;
}

/**
 * Get the stored authentication token from localStorage
 */
function getStoredToken(): string | null {
  try {
    const stored = localStorage.getItem('chromolog-campus-auth');
    if (!stored) return null;
    const auth = JSON.parse(stored);
    return auth.token || null;
  } catch {
    return null;
  }
}

/**
 * Make an authenticated API request
 * @param path - The API endpoint path (e.g., '/api/v1/courses')
 * @param method - HTTP method (GET, POST, PUT, DELETE)
 * @param data - Request body data (for POST/PUT requests)
 * @returns Promise with the response data
 */
export async function apiCall(
  path: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: any
): Promise<any> {
  if (!apiBaseUrl) {
    throw new Error('API is not configured. Please set VITE_API_BASE_URL.');
  }

  const token = getStoredToken();
  if (!token) {
    throw new Error('Your session has expired. Please log in again.');
  }

  const url = `${apiBaseUrl}${path}`;
  const options: RequestOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(url, options);
  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string'
        ? payload.message
        : null) ?? `API request failed with status ${response.status}`;
    throw new Error(message);
  }

  return payload;
}

/**
 * Course API calls
 */
export const courseApi = {
  list: (filters?: { department_id?: number; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.department_id) params.append('department_id', filters.department_id.toString());
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(`/api/v1/courses${query}`, 'GET');
  },
  get: (id: number) => apiCall(`/api/v1/courses/${id}`, 'GET'),
  create: (data: any) => apiCall('/api/v1/courses', 'POST', data),
  update: (id: number, data: any) => apiCall(`/api/v1/courses/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/v1/courses/${id}`, 'DELETE'),
  getDepartments: () => apiCall('/api/v1/courses/list/departments', 'GET'),
  getSelectList: () => apiCall('/api/v1/courses/list/select', 'GET'),
};

/**
 * Subject API calls
 */
export const subjectApi = {
  list: (filters?: { course_id?: number; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.course_id) params.append('course_id', filters.course_id.toString());
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(`/api/v1/subjects${query}`, 'GET');
  },
  get: (id: number) => apiCall(`/api/v1/subjects/${id}`, 'GET'),
  create: (data: any) => apiCall('/api/v1/subjects', 'POST', data),
  update: (id: number, data: any) => apiCall(`/api/v1/subjects/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/v1/subjects/${id}`, 'DELETE'),
  getCourses: () => apiCall('/api/v1/subjects/list/courses', 'GET'),
};

/**
 * Semester API calls
 */
export const semesterApi = {
  list: (filters?: { academic_year_id?: number; search?: string }) => {
    const params = new URLSearchParams();
    if (filters?.academic_year_id) params.append('academic_year_id', filters.academic_year_id.toString());
    if (filters?.search) params.append('search', filters.search);
    const query = params.toString() ? `?${params.toString()}` : '';
    return apiCall(`/api/v1/semesters${query}`, 'GET');
  },
  get: (id: number) => apiCall(`/api/v1/semesters/${id}`, 'GET'),
  create: (data: any) => apiCall('/api/v1/semesters', 'POST', data),
  update: (id: number, data: any) => apiCall(`/api/v1/semesters/${id}`, 'PUT', data),
  delete: (id: number) => apiCall(`/api/v1/semesters/${id}`, 'DELETE'),
  getAcademicYears: () => apiCall('/api/v1/semesters/list/academic-years', 'GET'),
  getSemesterOptions: () => apiCall('/api/v1/semesters/list/options', 'GET'),
};
