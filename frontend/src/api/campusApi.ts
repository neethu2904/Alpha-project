import type {
  AnnouncementAudience,
  AnnouncementPriority,
<<<<<<< HEAD
  CampusData,
=======
  CampusAccount,
  CampusData,
  CampusMasterCategory,
  CampusPermission,
>>>>>>> d7dc03e (demo)
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

<<<<<<< HEAD
=======
type ProfileResponse = {
  user: CampusSession;
  data: CampusData;
};

>>>>>>> d7dc03e (demo)
type DataResponse = {
  data: CampusData;
};

type StudentPayload = {
  name: string;
  email: string;
  departmentCode?: string;
  year: string;
<<<<<<< HEAD
=======
  gender: string;
  status?: string;
>>>>>>> d7dc03e (demo)
  cgpa: number;
  attendance: number;
  phone?: string;
  feeStatus: FeeStatus;
<<<<<<< HEAD
  skills: string[];
};

=======
  password?: string;
  skills: string[];
};

type StaffPayload = {
  name: string;
  email: string;
  designationId: number;
  departmentCode: string;
  password?: string;
  permissions: CampusPermission[];
};

type DesignationPayload = {
  name: string;
  description?: string;
  permissions: CampusPermission[];
};

type MasterPayload = {
  category: CampusMasterCategory;
  label: string;
  description?: string;
  sortOrder: number;
};

>>>>>>> d7dc03e (demo)
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

<<<<<<< HEAD
=======
export function registerWithCampusApi(name: string, email: string, password: string) {
  return request<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

export function updateCampusProfile(
  token: string,
  payload: { name: string; email: string; title: string; password?: string },
) {
  return request<ProfileResponse>(
    '/auth/profile',
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
}

>>>>>>> d7dc03e (demo)
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

<<<<<<< HEAD
=======
export function updateStudentWithCampusApi(token: string, studentId: number, payload: StudentPayload) {
  return request<DataResponse>(
    `/students/${studentId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function deleteStudentWithCampusApi(token: string, studentId: number) {
  return request<DataResponse>(
    `/students/${studentId}`,
    {
      method: 'DELETE',
    },
    token,
  );
}

export function fetchStaffWithCampusApi(token: string) {
  return request<CampusAccount[]>('/staff', undefined, token);
}

export function createDesignationWithCampusApi(token: string, payload: DesignationPayload) {
  return request<DataResponse>(
    '/designations',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function updateDesignationWithCampusApi(token: string, designationId: number, payload: DesignationPayload) {
  return request<DataResponse>(
    `/designations/${designationId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function deleteDesignationWithCampusApi(token: string, designationId: number) {
  return request<DataResponse>(
    `/designations/${designationId}`,
    {
      method: 'DELETE',
    },
    token,
  );
}

export function createMasterWithCampusApi(token: string, payload: MasterPayload) {
  return request<DataResponse>(
    '/masters',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function updateMasterWithCampusApi(token: string, masterId: number, payload: MasterPayload) {
  return request<DataResponse>(
    `/masters/${masterId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function deleteMasterWithCampusApi(token: string, masterId: number) {
  return request<DataResponse>(
    `/masters/${masterId}`,
    {
      method: 'DELETE',
    },
    token,
  );
}

export function createStaffWithCampusApi(token: string, payload: StaffPayload) {
  return request<DataResponse>(
    '/staff',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function updateStaffWithCampusApi(token: string, staffId: number, payload: StaffPayload) {
  return request<DataResponse>(
    `/staff/${staffId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function deleteStaffWithCampusApi(token: string, staffId: number) {
  return request<DataResponse>(
    `/staff/${staffId}`,
    {
      method: 'DELETE',
    },
    token,
  );
}

>>>>>>> d7dc03e (demo)
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

<<<<<<< HEAD
=======
export function updateDepartmentWithCampusApi(token: string, departmentId: number, payload: DepartmentPayload) {
  return request<DataResponse>(
    `/departments/${departmentId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function deleteDepartmentWithCampusApi(token: string, departmentId: number) {
  return request<DataResponse>(
    `/departments/${departmentId}`,
    {
      method: 'DELETE',
    },
    token,
  );
}

>>>>>>> d7dc03e (demo)
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

<<<<<<< HEAD
=======
export function updateCompanyWithCampusApi(token: string, companyId: number, payload: CompanyPayload) {
  return request<DataResponse>(
    `/companies/${companyId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function deleteCompanyWithCampusApi(token: string, companyId: number) {
  return request<DataResponse>(
    `/companies/${companyId}`,
    {
      method: 'DELETE',
    },
    token,
  );
}

>>>>>>> d7dc03e (demo)
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

<<<<<<< HEAD
=======
export function updateAnnouncementWithCampusApi(token: string, announcementId: number, payload: AnnouncementPayload) {
  return request<DataResponse>(
    `/announcements/${announcementId}`,
    {
      method: 'PUT',
      body: JSON.stringify(payload),
    },
    token,
  );
}

export function deleteAnnouncementWithCampusApi(token: string, announcementId: number) {
  return request<DataResponse>(
    `/announcements/${announcementId}`,
    {
      method: 'DELETE',
    },
    token,
  );
}

>>>>>>> d7dc03e (demo)
export function applyToCompanyWithCampusApi(token: string, companyId: number) {
  return request<DataResponse>(
    `/companies/${companyId}/apply`,
    {
      method: 'POST',
    },
    token,
  );
}
