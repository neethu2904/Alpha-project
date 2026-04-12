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

<<<<<<< HEAD
=======
export type StaffDesignationPreset = 'department_coordinator' | 'hr' | 'exam_coordinator' | 'efc';

>>>>>>> d7dc03e (demo)
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
<<<<<<< HEAD
    'students.view',
    'students.create',
    'placement.view',
    'placement.create',
    'announcements.view',
    'announcements.create',
    'reports.view',
=======
>>>>>>> d7dc03e (demo)
    'profile.view',
  ],
  student: ['dashboard.view', 'placement.view', 'placement.apply', 'announcements.view', 'profile.view'],
};

<<<<<<< HEAD
export type StudentStatus = 'Active' | 'Placement Ready' | 'Placed';
export type AnnouncementAudience = 'All' | 'Students' | 'Staff' | 'Admin';
export type AnnouncementPriority = 'High' | 'Medium' | 'Low';
export type CompanyStatus = 'Open' | 'Closing Soon' | 'Upcoming' | 'Closed';
export type CompanyType = 'Placement' | 'Internship';
export type FeeStatus = 'Paid' | 'Pending';
=======
export const campusPermissionLabels: Record<CampusPermission, string> = {
  'dashboard.view': 'Dashboard',
  'students.view': 'Students',
  'students.create': 'Manage students',
  'departments.view': 'Departments',
  'departments.create': 'Manage departments',
  'placement.view': 'Placement',
  'placement.create': 'Manage placement',
  'placement.apply': 'Apply to drives',
  'announcements.view': 'Announcements',
  'announcements.create': 'Manage announcements',
  'reports.view': 'Reports',
  'profile.view': 'Profile',
  'demo.reset': 'Reset demo',
};

export const campusStaffAssignablePermissions: CampusPermission[] = [
  'students.view',
  'students.create',
  'departments.view',
  'departments.create',
  'placement.view',
  'placement.create',
  'announcements.view',
  'announcements.create',
  'reports.view',
];

export const campusStaffBasePermissions: CampusPermission[] = ['dashboard.view', 'profile.view'];

export const campusStaffDesignationPresets: Array<{
  id: StaffDesignationPreset;
  label: string;
  description: string;
  permissions: CampusPermission[];
}> = [
  {
    id: 'department_coordinator',
    label: 'Department Coordinator',
    description: 'Students, placement, announcements, and reports for a department-facing staff member.',
    permissions: ['students.view', 'students.create', 'placement.view', 'placement.create', 'announcements.view', 'announcements.create', 'reports.view'],
  },
  {
    id: 'hr',
    label: 'HR',
    description: 'Placement-heavy access for interview planning, company updates, and student tracking.',
    permissions: ['students.view', 'placement.view', 'placement.create', 'announcements.view', 'announcements.create', 'reports.view'],
  },
  {
    id: 'exam_coordinator',
    label: 'Exam Coordinator',
    description: 'Academic coordination with department visibility, student records, and announcements.',
    permissions: ['students.view', 'departments.view', 'announcements.view', 'announcements.create', 'reports.view'],
  },
  {
    id: 'efc',
    label: 'EFC',
    description: 'Fee and compliance follow-up through student records, departments, and reports.',
    permissions: ['students.view', 'departments.view', 'reports.view', 'announcements.view'],
  },
];

export function normalizeStaffPermissions(permissions: CampusPermission[]) {
  const impliedPermissions: CampusPermission[] = [];

  if (permissions.includes('students.create')) {
    impliedPermissions.push('students.view');
  }
  if (permissions.includes('departments.create')) {
    impliedPermissions.push('departments.view');
  }
  if (permissions.includes('placement.create')) {
    impliedPermissions.push('placement.view');
  }
  if (permissions.includes('announcements.create')) {
    impliedPermissions.push('announcements.view');
  }

  return Array.from(new Set([...campusStaffBasePermissions, ...permissions, ...impliedPermissions]))
    .filter((permission) => campusRolePermissions.admin.includes(permission))
    .sort() as CampusPermission[];
}

export interface CampusDesignation {
  id: number;
  name: string;
  slug: string;
  description: string;
  permissions: CampusPermission[];
  staffCount: number;
}

export const campusDefaultDesignations: CampusDesignation[] = campusStaffDesignationPresets.map((preset, index) => ({
  id: index + 1,
  name: preset.label,
  slug: preset.id,
  description: preset.description,
  permissions: normalizeStaffPermissions(preset.permissions),
  staffCount: 0,
}));

export type CampusMasterCategory =
  | 'student_gender'
  | 'student_year'
  | 'student_status'
  | 'payment_status'
  | 'company_drive_status'
  | 'company_drive_type'
  | 'announcement_audience'
  | 'announcement_priority';

export interface CampusMasterOption {
  id: number;
  category: CampusMasterCategory;
  code: string;
  label: string;
  description: string;
  sortOrder: number;
}

export const campusMasterCategoryLabels: Record<CampusMasterCategory, string> = {
  student_gender: 'Student genders',
  student_year: 'Academic years',
  student_status: 'Student statuses',
  payment_status: 'Payment statuses',
  company_drive_status: 'Company drive statuses',
  company_drive_type: 'Company drive types',
  announcement_audience: 'Announcement audiences',
  announcement_priority: 'Announcement priorities',
};

const campusMasterDefaultsByCategory: Record<
  CampusMasterCategory,
  Array<{ code: string; label: string; description: string }>
> = {
  student_gender: [
    { code: 'male', label: 'Male', description: 'Male student record.' },
    { code: 'female', label: 'Female', description: 'Female student record.' },
    { code: 'non_binary', label: 'Non-binary', description: 'Non-binary student record.' },
    { code: 'prefer_not_to_say', label: 'Prefer not to say', description: 'Gender intentionally omitted.' },
  ],
  student_year: [
    { code: 'year_1', label: '1st Year', description: 'First-year academic record.' },
    { code: 'year_2', label: '2nd Year', description: 'Second-year academic record.' },
    { code: 'year_3', label: '3rd Year', description: 'Third-year academic record.' },
    { code: 'year_4', label: '4th Year', description: 'Final-year academic record.' },
  ],
  student_status: [
    { code: 'active', label: 'Active', description: 'Student is active in the campus system.' },
    { code: 'placement_ready', label: 'Placement Ready', description: 'Student is ready for placement drives.' },
    { code: 'placed', label: 'Placed', description: 'Student has received an offer.' },
  ],
  payment_status: [
    { code: 'paid', label: 'Paid', description: 'Fees are fully settled.' },
    { code: 'pending', label: 'Pending', description: 'Fees still need follow-up.' },
  ],
  company_drive_status: [
    { code: 'upcoming', label: 'Upcoming', description: 'Drive is scheduled for a future date.' },
    { code: 'open', label: 'Open', description: 'Drive is open for applications.' },
    { code: 'closing_soon', label: 'Closing Soon', description: 'Drive closes shortly.' },
    { code: 'closed', label: 'Closed', description: 'Drive is closed.' },
  ],
  company_drive_type: [
    { code: 'placement', label: 'Placement', description: 'Full placement drive.' },
    { code: 'internship', label: 'Internship', description: 'Internship hiring drive.' },
  ],
  announcement_audience: [
    { code: 'all', label: 'All', description: 'Visible to everyone.' },
    { code: 'students', label: 'Students', description: 'Visible to students.' },
    { code: 'staff', label: 'Staff', description: 'Visible to staff.' },
    { code: 'admin', label: 'Admin', description: 'Visible to admins.' },
  ],
  announcement_priority: [
    { code: 'high', label: 'High', description: 'Urgent announcement.' },
    { code: 'medium', label: 'Medium', description: 'Standard announcement.' },
    { code: 'low', label: 'Low', description: 'Low-priority announcement.' },
  ],
};

export const campusDefaultMasters: CampusMasterOption[] = (Object.entries(campusMasterDefaultsByCategory) as Array<
  [CampusMasterCategory, Array<{ code: string; label: string; description: string }>]
>).flatMap(([category, options]) =>
  options.map((option, index) => ({
    id: Number(`${(Object.keys(campusMasterDefaultsByCategory).indexOf(category) + 1) * 100}${index + 1}`),
    category,
    code: option.code,
    label: option.label,
    description: option.description,
    sortOrder: index + 1,
  })),
);

export function normalizeCampusMasterValue(
  category: CampusMasterCategory,
  value: string | null | undefined,
  masters: CampusMasterOption[] = campusDefaultMasters,
) {
  if (!value) {
    return '';
  }

  const match = masters.find(
    (master) =>
      master.category === category &&
      (master.code === value || master.label.trim().toLowerCase() === value.trim().toLowerCase()),
  );

  return match?.code ?? value;
}

export function getCampusMasterLabel(
  category: CampusMasterCategory,
  value: string | null | undefined,
  masters: CampusMasterOption[] = campusDefaultMasters,
) {
  if (!value) {
    return '';
  }

  const match = masters.find(
    (master) =>
      master.category === category &&
      (master.code === value || master.label.trim().toLowerCase() === value.trim().toLowerCase()),
  );

  return match?.label ?? value;
}

export type StudentStatus = string;
export type AnnouncementAudience = string;
export type AnnouncementPriority = string;
export type CompanyStatus = string;
export type CompanyType = string;
export type FeeStatus = string;
>>>>>>> d7dc03e (demo)

export interface CampusAccount {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: CampusRole;
  title: string;
  departmentCode?: string;
<<<<<<< HEAD
=======
  designationId?: number;
  designationName?: string;
>>>>>>> d7dc03e (demo)
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
<<<<<<< HEAD
=======
  gender: string;
>>>>>>> d7dc03e (demo)
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
<<<<<<< HEAD
=======
  designations: CampusDesignation[];
  masters: CampusMasterOption[];
>>>>>>> d7dc03e (demo)
  students: CampusStudent[];
  companies: CampusCompany[];
  announcements: CampusAnnouncement[];
}
