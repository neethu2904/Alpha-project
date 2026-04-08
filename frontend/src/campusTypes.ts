export type CampusRole = 'admin' | 'staff' | 'student';
export type CampusPermission =
  | 'dashboard.view'
  | 'students.view'
  | 'students.create'
  | 'departments.view'
  | 'departments.create'
  | 'placement.view'
  | 'placement.create'
  | 'placement.apply'
  | 'announcements.view'
  | 'announcements.create'
  | 'reports.view'
  | 'profile.view'
  | 'demo.reset';

export const campusRolePermissions: Record<CampusRole, CampusPermission[]> = {
  admin: [
    'dashboard.view',
    'students.view',
    'students.create',
    'departments.view',
    'departments.create',
    'placement.view',
    'placement.create',
    'placement.apply',
    'announcements.view',
    'announcements.create',
    'reports.view',
    'profile.view',
    'demo.reset',
  ],
  staff: [
    'dashboard.view',
    'students.view',
    'students.create',
    'placement.view',
    'placement.create',
    'announcements.view',
    'announcements.create',
    'reports.view',
    'profile.view',
  ],
  student: ['dashboard.view', 'placement.view', 'placement.apply', 'announcements.view', 'profile.view'],
};

export type StudentStatus = 'Active' | 'Placement Ready' | 'Placed';
export type AnnouncementAudience = 'All' | 'Students' | 'Staff' | 'Admin';
export type AnnouncementPriority = 'High' | 'Medium' | 'Low';
export type CompanyStatus = 'Open' | 'Closing Soon' | 'Upcoming' | 'Closed';
export type CompanyType = 'Placement' | 'Internship';
export type FeeStatus = 'Paid' | 'Pending';

export interface CampusAccount {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: CampusRole;
  title: string;
  departmentCode?: string;
  studentId?: number;
  permissions?: CampusPermission[];
}

export type CampusSession = Omit<CampusAccount, 'password'> & {
  permissions: CampusPermission[];
};

export interface CampusDepartment {
  id: number;
  name: string;
  code: string;
  hod: string;
  staffCount: number;
  intake: number;
  accent: string;
}

export interface CampusStudent {
  id: number;
  name: string;
  email: string;
  registrationNumber: string;
  departmentCode: string;
  year: string;
  status: StudentStatus;
  cgpa: number;
  attendance: number;
  phone: string;
  mentor: string;
  feeStatus: FeeStatus;
  placedCompany?: string;
  appliedCompanyIds: number[];
  skills: string[];
}

export interface CampusCompany {
  id: number;
  name: string;
  role: string;
  packageOffered: string;
  driveDate: string;
  status: CompanyStatus;
  location: string;
  type: CompanyType;
  applicants: number;
  shortlisted: number;
  eligibleDepartments: string[];
}

export interface CampusAnnouncement {
  id: number;
  title: string;
  summary: string;
  audience: AnnouncementAudience;
  priority: AnnouncementPriority;
  postedBy: string;
  date: string;
  category: string;
}

export interface CampusData {
  users: CampusAccount[];
  departments: CampusDepartment[];
  students: CampusStudent[];
  companies: CampusCompany[];
  announcements: CampusAnnouncement[];
}
