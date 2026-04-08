import type {
  AnnouncementAudience,
  AnnouncementPriority,
  CampusData,
  CampusSession,
  CompanyStatus,
  CompanyType,
  FeeStatus,
} from '../campusTypes';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, '') ?? '';

type AuthResponse = {
  token: string;
  user: CampusSession;
  data: CampusData;
};

type BootstrapResponse = {
  user: CampusSession;
  data: CampusData;
};

type DataResponse = {
  data: CampusData;
};

type StudentPayload = {
  name: string;
  email: string;
  departmentCode?: string;
  year: string;
  cgpa: number;
  attendance: number;
  phone?: string;
  feeStatus: FeeStatus;
  skills: string[];
};

type DepartmentPayload = {
  name: string;
  code: string;
  hod: string;
  staffCount: number;
  intake: number;
};

type CompanyPayload = {
  name: string;
  role: string;
  packageOffered: string;
  driveDate: string;
  status: CompanyStatus;
  location: string;
  type: CompanyType;
  eligibleDepartments: string[];
};

type AnnouncementPayload = {
  title: string;
  summary: string;
  audience: AnnouncementAudience;
  priority: AnnouncementPriority;
  category: string;
};

async function request<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  if (!apiBaseUrl) {
    throw new Error('Campus API is not configured.');
  }

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init?.headers ?? {}),
    },
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : null;

  if (!response.ok) {
    const message =
      (payload && typeof payload === 'object' && 'message' in payload && typeof payload.message === 'string'
        ? payload.message
        : null) ?? 'API request failed.';
    throw new Error(message);
  }

  return payload as T;
}

export function isCampusApiConfigured() {
  return Boolean(apiBaseUrl);
}

export function loginWithCampusApi(email: string, password: string) {
  return request<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function fetchCampusBootstrap(token: string) {
  return request<BootstrapResponse>('/campus/bootstrap', undefined, token);
}

export function logoutFromCampusApi(token: string) {
  return request<{ message: string }>('/auth/logout', { method: 'POST' }, token);
}

export function resetCampusDemo(token: string) {
  return request<BootstrapResponse>('/campus/reset', { method: 'POST' }, token);
}

export function createStudentWithCampusApi(token: string, payload: StudentPayload) {
  return request<DataResponse>(
    '/students',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function createDepartmentWithCampusApi(token: string, payload: DepartmentPayload) {
  return request<DataResponse>(
    '/departments',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function createCompanyWithCampusApi(token: string, payload: CompanyPayload) {
  return request<DataResponse>(
    '/companies',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function createAnnouncementWithCampusApi(token: string, payload: AnnouncementPayload) {
  return request<DataResponse>(
    '/announcements',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function applyToCompanyWithCampusApi(token: string, companyId: number) {
  return request<DataResponse>(
    `/companies/${companyId}/apply`,
    {
      method: 'POST',
    },
    token,
  );
}
