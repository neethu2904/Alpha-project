import { useEffect, useState } from 'react';
import {
  applyToCompanyWithCampusApi,
  createAnnouncementWithCampusApi,
  createCompanyWithCampusApi,
  createDepartmentWithCampusApi,
  createStudentWithCampusApi,
  fetchCampusBootstrap,
  isCampusApiConfigured,
  loginWithCampusApi,
  logoutFromCampusApi,
  resetCampusDemo,
} from './api/campusApi';
import { createCampusDemoData, departmentAccentByCode, getDepartmentAccent } from './campusDemoData';
import CampusLogin from './components/CampusLogin';
import CampusWorkspace from './components/CampusWorkspace';
import { campusRolePermissions, type CampusData, type CampusSession } from './campusTypes';

const AUTH_KEY = 'chromolog-campus-auth';
const DATA_KEY = 'chromolog-campus-data';

type StoredAuth = {
  token?: string;
  user: CampusSession;
};

function applyBrandAccents(dataset: CampusData): CampusData {
  return {
    ...dataset,
    departments: dataset.departments.map((department) => ({
      ...department,
      accent:
        department.code in departmentAccentByCode
          ? getDepartmentAccent(department.code)
          : department.accent || getDepartmentAccent(),
    })),
  };
}

function loadDemoData() {
  const stored = localStorage.getItem(DATA_KEY);
  if (!stored) {
    return createCampusDemoData();
  }

  try {
    return applyBrandAccents(JSON.parse(stored) as CampusData);
  } catch {
    return createCampusDemoData();
  }
}

function loadStoredAuth() {
  const stored = localStorage.getItem(AUTH_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as StoredAuth;
  } catch {
    return null;
  }
}

function toSessionUser(account: CampusData['users'][number]): CampusSession {
  const { password: _password, permissions, ...session } = account;

  return {
    ...session,
    permissions: permissions ?? campusRolePermissions[account.role],
  };
}

export default function App() {
  const apiConfigured = isCampusApiConfigured();
  const [data, setData] = useState<CampusData>(loadDemoData);
  const [auth, setAuth] = useState<StoredAuth | null>(loadStoredAuth);
  const [error, setError] = useState('');

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    if (auth) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
      return;
    }

    localStorage.removeItem(AUTH_KEY);
  }, [auth]);

  useEffect(() => {
    if (!apiConfigured || !auth?.token) {
      return;
    }

    fetchCampusBootstrap(auth.token)
      .then((response) => {
        setData(applyBrandAccents(response.data));
        setAuth((current) => (current ? { ...current, user: response.user } : current));
        setError('');
      })
      .catch((apiError) => {
        setAuth(null);
        setError(apiError instanceof Error ? apiError.message : 'Unable to restore your session.');
      });
  }, [apiConfigured, auth?.token]);

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    if (apiConfigured) {
      try {
        const response = await loginWithCampusApi(email, password);
        setData(applyBrandAccents(response.data));
        setAuth({ token: response.token, user: response.user });
        setError('');
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : 'Laravel API login failed.');
      }
      return;
    }

    const account = data.users.find(
      (candidate) => candidate.email.toLowerCase() === email.toLowerCase() && candidate.password === password,
    );

    if (!account) {
      setError('Use one of the demo accounts and the password demo123.');
      return;
    }

    setAuth({ user: toSessionUser(account) });
    setError('');
  };

  const requireToken = () => {
    if (!auth?.token) {
      throw new Error('Your session has expired. Please sign in again.');
    }

    return auth.token;
  };

  const replaceDataFromApi = async (work: (token: string) => Promise<{ data: CampusData }>) => {
    const token = requireToken();
    const response = await work(token);
    setData(applyBrandAccents(response.data));
    setError('');
  };

  const handleResetDemo = async () => {
    if (apiConfigured) {
      try {
        const response = await resetCampusDemo(requireToken());
        setData(applyBrandAccents(response.data));
        setAuth((current) => (current ? { ...current, user: response.user } : current));
        setError('');
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : 'Unable to reset Laravel demo data.');
      }
      return;
    }

    const freshData = createCampusDemoData();
    setData(freshData);

    if (auth?.user) {
      const refreshedUser = freshData.users.find((candidate) => candidate.email === auth.user.email);
      setAuth(refreshedUser ? { user: toSessionUser(refreshedUser) } : null);
    }
  };

  const handleCreateStudent = async (payload: {
    name: string;
    email: string;
    departmentCode?: string;
    year: string;
    cgpa: number;
    attendance: number;
    phone?: string;
    feeStatus: 'Paid' | 'Pending';
    skills: string[];
  }) => {
    if (apiConfigured) {
      try {
        await replaceDataFromApi((token) => createStudentWithCampusApi(token, payload));
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : 'Unable to create the student.');
        throw apiError;
      }
      return;
    }

    const user = auth?.user;
    if (!user) {
      return;
    }

    const nextId = Math.max(0, ...data.students.map((student) => student.id)) + 1;
    const departmentCode = user.role === 'staff' ? user.departmentCode ?? payload.departmentCode ?? 'CSE' : payload.departmentCode ?? 'CSE';
    const mentor =
      user.role === 'staff'
        ? user.name
        : data.departments.find((department) => department.code === departmentCode)?.hod ?? user.name;

    setData((current) => ({
      ...current,
      students: [
        {
          id: nextId,
          name: payload.name,
          email: payload.email,
          registrationNumber: `BIT26${departmentCode}${String(nextId).padStart(3, '0')}`,
          departmentCode,
          year: payload.year,
          status: 'Active',
          cgpa: payload.cgpa,
          attendance: payload.attendance,
          phone: payload.phone || '+1 555-0199',
          mentor,
          feeStatus: payload.feeStatus,
          appliedCompanyIds: [],
          skills: payload.skills,
        },
        ...current.students,
      ],
    }));
    setError('');
  };

  const handleCreateDepartment = async (payload: {
    name: string;
    code: string;
    hod: string;
    staffCount: number;
    intake: number;
  }) => {
    if (apiConfigured) {
      try {
        await replaceDataFromApi((token) => createDepartmentWithCampusApi(token, payload));
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : 'Unable to create the department.');
        throw apiError;
      }
      return;
    }

    const nextId = Math.max(0, ...data.departments.map((department) => department.id)) + 1;

    setData((current) => ({
      ...current,
      departments: [
        ...current.departments,
        {
          id: nextId,
          name: payload.name,
          code: payload.code.trim().toUpperCase(),
          hod: payload.hod,
          staffCount: payload.staffCount,
          intake: payload.intake,
          accent: getDepartmentAccent(payload.code.trim().toUpperCase()),
        },
      ],
    }));
    setError('');
  };

  const handleCreateCompany = async (payload: {
    name: string;
    role: string;
    packageOffered: string;
    driveDate: string;
    status: 'Open' | 'Closing Soon' | 'Upcoming' | 'Closed';
    location: string;
    type: 'Placement' | 'Internship';
    eligibleDepartments: string[];
  }) => {
    if (apiConfigured) {
      try {
        await replaceDataFromApi((token) => createCompanyWithCampusApi(token, payload));
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : 'Unable to create the company drive.');
        throw apiError;
      }
      return;
    }

    const nextId = Math.max(0, ...data.companies.map((company) => company.id)) + 1;

    setData((current) => ({
      ...current,
      companies: [
        {
          id: nextId,
          name: payload.name,
          role: payload.role,
          packageOffered: payload.packageOffered,
          driveDate: payload.driveDate,
          status: payload.status,
          location: payload.location,
          type: payload.type,
          applicants: 0,
          shortlisted: 0,
          eligibleDepartments: payload.eligibleDepartments,
        },
        ...current.companies,
      ],
    }));
    setError('');
  };

  const handleCreateAnnouncement = async (payload: {
    title: string;
    summary: string;
    audience: 'All' | 'Students' | 'Staff' | 'Admin';
    priority: 'High' | 'Medium' | 'Low';
    category: string;
  }) => {
    if (apiConfigured) {
      try {
        await replaceDataFromApi((token) => createAnnouncementWithCampusApi(token, payload));
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : 'Unable to create the announcement.');
        throw apiError;
      }
      return;
    }

    const nextId = Math.max(0, ...data.announcements.map((announcement) => announcement.id)) + 1;

    setData((current) => ({
      ...current,
      announcements: [
        {
          id: nextId,
          title: payload.title,
          summary: payload.summary,
          audience: payload.audience,
          priority: payload.priority,
          postedBy: auth?.user.name ?? 'Campus Team',
          date: '2026-04-05',
          category: payload.category,
        },
        ...current.announcements,
      ],
    }));
    setError('');
  };

  const handleApplyToCompany = async (companyId: number) => {
    if (apiConfigured) {
      try {
        await replaceDataFromApi((token) => applyToCompanyWithCampusApi(token, companyId));
      } catch (apiError) {
        setError(apiError instanceof Error ? apiError.message : 'Unable to submit the application.');
        throw apiError;
      }
      return;
    }

    const currentUser = auth?.user;
    const currentStudent = currentUser?.studentId
      ? data.students.find((student) => student.id === currentUser.studentId) ?? null
      : null;

    if (!currentStudent || currentStudent.appliedCompanyIds.includes(companyId)) {
      return;
    }

    setData((current) => ({
      ...current,
      students: current.students.map((student) =>
        student.id === currentStudent.id
          ? { ...student, appliedCompanyIds: [...student.appliedCompanyIds, companyId] }
          : student,
      ),
      companies: current.companies.map((company) =>
        company.id === companyId ? { ...company, applicants: company.applicants + 1 } : company,
      ),
    }));
    setError('');
  };

  const handleLogout = async () => {
    if (apiConfigured && auth?.token) {
      try {
        await logoutFromCampusApi(auth.token);
      } catch {
        // Clear the local session even if the token is already invalid server-side.
      }
    }

    setAuth(null);
  };

  if (!auth?.user) {
    return <CampusLogin error={error} onLogin={handleLogin} />;
  }

  return (
    <CampusWorkspace
      error={error}
      user={auth.user}
      data={data}
      onLogout={handleLogout}
      onResetDemo={handleResetDemo}
      onCreateStudent={handleCreateStudent}
      onCreateDepartment={handleCreateDepartment}
      onCreateCompany={handleCreateCompany}
      onCreateAnnouncement={handleCreateAnnouncement}
      onApplyToCompany={handleApplyToCompany}
    />
  );
}
