import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Bell,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ChartColumn,
  ChevronRight,
  ClipboardList,
  Filter,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  Menu,
  Megaphone,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  UserCircle2,
  Users,
  X,
} from 'lucide-react';
import { campusBrand } from '../campusDemoData';
import type {
  AnnouncementAudience,
  AnnouncementPriority,
  CampusData,
  CampusPermission,
  CampusRole,
  CampusSession,
  CompanyStatus,
  CompanyType,
  FeeStatus,
  StudentStatus,
} from '../campusTypes';

interface CampusWorkspaceProps {
  error: string;
  user: CampusSession;
  data: CampusData;
  onLogout: () => Promise<void> | void;
  onResetDemo: () => Promise<void> | void;
  onCreateStudent: (payload: {
    name: string;
    email: string;
    departmentCode?: string;
    year: string;
    cgpa: number;
    attendance: number;
    phone?: string;
    feeStatus: FeeStatus;
    skills: string[];
  }) => Promise<void> | void;
  onCreateDepartment: (payload: {
    name: string;
    code: string;
    hod: string;
    staffCount: number;
    intake: number;
  }) => Promise<void> | void;
  onCreateCompany: (payload: {
    name: string;
    role: string;
    packageOffered: string;
    driveDate: string;
    status: CompanyStatus;
    location: string;
    type: CompanyType;
    eligibleDepartments: string[];
  }) => Promise<void> | void;
  onCreateAnnouncement: (payload: {
    title: string;
    summary: string;
    audience: AnnouncementAudience;
    priority: AnnouncementPriority;
    category: string;
  }) => Promise<void> | void;
  onApplyToCompany: (companyId: number) => Promise<void> | void;
}

type StudentDraft = {
  name: string;
  email: string;
  departmentCode: string;
  year: string;
  cgpa: string;
  attendance: string;
  phone: string;
  feeStatus: FeeStatus;
  skills: string;
};

type DepartmentDraft = {
  name: string;
  code: string;
  hod: string;
  staffCount: string;
  intake: string;
};

type CompanyDraft = {
  name: string;
  role: string;
  packageOffered: string;
  driveDate: string;
  status: CompanyStatus;
  location: string;
  type: CompanyType;
  eligibleDepartments: string;
};

type AnnouncementDraft = {
  title: string;
  summary: string;
  audience: AnnouncementAudience;
  priority: AnnouncementPriority;
  category: string;
};

type NavItem = {
  id: string;
  label: string;
  icon: typeof LayoutDashboard;
  permission: CampusPermission;
};

type CardTone = 'navy' | 'sky' | 'teal' | 'amber' | 'indigo' | 'emerald';

const navByRole: Record<CampusRole, NavItem[]> = {
  admin: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard.view' },
    { id: 'students', label: 'Students', icon: Users, permission: 'students.view' },
    { id: 'departments', label: 'Departments', icon: Building2, permission: 'departments.view' },
    { id: 'placement', label: 'Placement', icon: BriefcaseBusiness, permission: 'placement.view' },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, permission: 'announcements.view' },
    { id: 'reports', label: 'Reports', icon: ChartColumn, permission: 'reports.view' },
    { id: 'profile', label: 'Profile', icon: UserCircle2, permission: 'profile.view' },
  ],
  staff: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard.view' },
    { id: 'students', label: 'Students', icon: Users, permission: 'students.view' },
    { id: 'placement', label: 'Placement', icon: BriefcaseBusiness, permission: 'placement.view' },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, permission: 'announcements.view' },
    { id: 'reports', label: 'Reports', icon: ChartColumn, permission: 'reports.view' },
    { id: 'profile', label: 'Profile', icon: UserCircle2, permission: 'profile.view' },
  ],
  student: [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard.view' },
    { id: 'placement', label: 'Placement', icon: BriefcaseBusiness, permission: 'placement.view' },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, permission: 'announcements.view' },
    { id: 'profile', label: 'Profile', icon: UserCircle2, permission: 'profile.view' },
  ],
};

const monthTrend = [
  { month: 'Jan', offers: 8, drives: 2 },
  { month: 'Feb', offers: 14, drives: 3 },
  { month: 'Mar', offers: 18, drives: 3 },
  { month: 'Apr', offers: 22, drives: 4 },
  { month: 'May', offers: 27, drives: 5 },
  { month: 'Jun', offers: 31, drives: 5 },
];

const cardToneStyles: Record<
  CardTone,
  {
    metric: string;
    highlight: string;
    icon: string;
    helper: string;
  }
> = {
  navy: {
    metric: 'border border-[#d8e4f2] bg-[linear-gradient(180deg,#ffffff,#f4f8fc)] shadow-[0_22px_42px_-34px_rgba(7,43,82,0.26)]',
    highlight: 'border border-[#d8e4f2] bg-[linear-gradient(180deg,#ffffff,#f4f8fc)] shadow-[0_22px_42px_-34px_rgba(7,43,82,0.24)]',
    icon: 'bg-[linear-gradient(135deg,#072b52,#0d4f88)] text-white shadow-[0_18px_28px_-22px_rgba(7,43,82,0.6)]',
    helper: 'bg-[#e9f2fb] text-[#0d4f88]',
  },
  sky: {
    metric: 'border border-[#d7eef8] bg-[linear-gradient(180deg,#ffffff,#f1fbff)] shadow-[0_22px_42px_-34px_rgba(27,168,233,0.24)]',
    highlight: 'border border-[#d7eef8] bg-[linear-gradient(180deg,#ffffff,#f1fbff)] shadow-[0_22px_42px_-34px_rgba(27,168,233,0.24)]',
    icon: 'bg-[linear-gradient(135deg,#1f97d9,#63c6f1)] text-white shadow-[0_18px_28px_-22px_rgba(27,168,233,0.55)]',
    helper: 'bg-[#e6f8ff] text-[#1784c3]',
  },
  teal: {
    metric: 'border border-[#d7f1ef] bg-[linear-gradient(180deg,#ffffff,#f2fcfa)] shadow-[0_22px_42px_-34px_rgba(15,118,110,0.22)]',
    highlight: 'border border-[#d7f1ef] bg-[linear-gradient(180deg,#ffffff,#f2fcfa)] shadow-[0_22px_42px_-34px_rgba(15,118,110,0.22)]',
    icon: 'bg-[linear-gradient(135deg,#0f766e,#28b0a6)] text-white shadow-[0_18px_28px_-22px_rgba(15,118,110,0.52)]',
    helper: 'bg-[#e4faf7] text-[#0f766e]',
  },
  amber: {
    metric: 'border border-[#f6e7c9] bg-[linear-gradient(180deg,#ffffff,#fff8ee)] shadow-[0_22px_42px_-34px_rgba(217,119,6,0.2)]',
    highlight: 'border border-[#f6e7c9] bg-[linear-gradient(180deg,#ffffff,#fff8ee)] shadow-[0_22px_42px_-34px_rgba(217,119,6,0.2)]',
    icon: 'bg-[linear-gradient(135deg,#d97706,#f4b143)] text-white shadow-[0_18px_28px_-22px_rgba(217,119,6,0.48)]',
    helper: 'bg-[#fff3db] text-[#b96504]',
  },
  indigo: {
    metric: 'border border-[#e0e2fb] bg-[linear-gradient(180deg,#ffffff,#f5f5ff)] shadow-[0_22px_42px_-34px_rgba(79,70,229,0.22)]',
    highlight: 'border border-[#e0e2fb] bg-[linear-gradient(180deg,#ffffff,#f5f5ff)] shadow-[0_22px_42px_-34px_rgba(79,70,229,0.22)]',
    icon: 'bg-[linear-gradient(135deg,#4f46e5,#7367f0)] text-white shadow-[0_18px_28px_-22px_rgba(79,70,229,0.5)]',
    helper: 'bg-[#eef0ff] text-[#4f46e5]',
  },
  emerald: {
    metric: 'border border-[#d9f2e4] bg-[linear-gradient(180deg,#ffffff,#f2fcf6)] shadow-[0_22px_42px_-34px_rgba(5,150,105,0.2)]',
    highlight: 'border border-[#d9f2e4] bg-[linear-gradient(180deg,#ffffff,#f2fcf6)] shadow-[0_22px_42px_-34px_rgba(5,150,105,0.2)]',
    icon: 'bg-[linear-gradient(135deg,#059669,#34c889)] text-white shadow-[0_18px_28px_-22px_rgba(5,150,105,0.48)]',
    helper: 'bg-[#e6fbef] text-[#087d59]',
  },
};

function classNames(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(' ');
}

function formatDate(dateValue: string) {
  return new Date(dateValue).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function audienceMatches(role: CampusRole, audience: AnnouncementAudience) {
  if (audience === 'All') {
    return true;
  }
  if (role === 'admin') {
    return true;
  }
  return (role === 'staff' && audience === 'Staff') || (role === 'student' && audience === 'Students');
}

function statusTone(status: StudentStatus | CompanyStatus | AnnouncementPriority | FeeStatus) {
  const tones: Record<string, string> = {
    Active: 'bg-slate-100 text-slate-700',
    'Placement Ready': 'bg-blue-50 text-blue-700',
    Placed: 'bg-emerald-50 text-emerald-700',
    Open: 'bg-emerald-50 text-emerald-700',
    'Closing Soon': 'bg-amber-50 text-amber-700',
    Upcoming: 'bg-sky-50 text-sky-700',
    Closed: 'bg-slate-100 text-slate-500',
    High: 'bg-red-50 text-red-700',
    Medium: 'bg-amber-50 text-amber-700',
    Low: 'bg-slate-100 text-slate-600',
    Paid: 'bg-emerald-50 text-emerald-700',
    Pending: 'bg-red-50 text-red-700',
  };

  return tones[status] ?? 'bg-slate-100 text-slate-700';
}

function Panel({ children, className }: { children: ReactNode; className?: string; key?: string | number }) {
  return (
    <section
      className={classNames(
        'rounded-[28px] border border-sky-100 bg-white shadow-[0_22px_45px_-34px_rgba(14,165,233,0.2)]',
        className,
      )}
    >
      {children}
    </section>
  );
}

function SectionHeader({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">{title}</p>
        <h2 className="mt-2 text-2xl font-bold text-slate-950">{description}</h2>
      </div>
      {action}
    </div>
  );
}

function MetricCard({
  label,
  value,
  helper,
  icon: Icon,
  tone = 'navy',
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: typeof Users;
  tone?: CardTone;
}) {
  const toneStyles = cardToneStyles[tone];

  return (
    <section className={classNames('rounded-[28px] p-5', toneStyles.metric)}>
      <div className="flex items-center justify-between">
        <div className={classNames('rounded-2xl p-3', toneStyles.icon)}>
          <Icon size={20} />
        </div>
        <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', toneStyles.helper)}>{helper}</span>
      </div>
      <p className="mt-5 text-sm font-medium text-slate-500">{label}</p>
      <p className="mt-1 text-3xl font-bold text-slate-950">{value}</p>
    </section>
  );
}

function DashboardHighlightCard({
  label,
  value,
  detail,
  meta,
  icon: Icon,
  tone = 'navy',
}: {
  label: string;
  value: string | number;
  detail: string;
  meta: string;
  icon: typeof Users;
  tone?: CardTone;
}) {
  const toneStyles = cardToneStyles[tone];

  return (
    <section className={classNames('rounded-[26px] p-5', toneStyles.highlight)}>
      <div className="flex items-start justify-between gap-4">
        <div className={classNames('flex h-12 w-12 items-center justify-center rounded-2xl', toneStyles.icon)}>
          <Icon size={22} />
        </div>
        <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]', toneStyles.helper)}>
          {meta}
        </span>
      </div>
      <p className="mt-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{value}</p>
      <p className="mt-2 text-sm leading-6 text-slate-500">{detail}</p>
    </section>
  );
}

function Modal({
  open,
  title,
  description,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  description: string;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!open) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          className="w-full max-w-2xl rounded-[30px] bg-white p-7 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)]"
        >
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h3 className="text-2xl font-bold text-slate-950">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Close
            </button>
          </div>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function CampusWorkspace({
  error,
  user,
  data,
  onLogout,
  onResetDemo,
  onCreateStudent,
  onCreateDepartment,
  onCreateCompany,
  onCreateAnnouncement,
  onApplyToCompany,
}: CampusWorkspaceProps) {
  const defaultDepartmentCode = user.departmentCode ?? data.departments[0]?.code ?? 'CSE';
  const can = (permission: CampusPermission) => user.permissions.includes(permission);
  const availableNav = navByRole[user.role].filter((item) => can(item.permission));

  const createStudentDraft = (): StudentDraft => ({
    name: '',
    email: '',
    departmentCode: defaultDepartmentCode,
    year: '1st Year',
    cgpa: '7.5',
    attendance: '90',
    phone: '',
    feeStatus: 'Paid',
    skills: '',
  });

  const createDepartmentDraft = (): DepartmentDraft => ({
    name: '',
    code: '',
    hod: '',
    staffCount: '10',
    intake: '120',
  });

  const createCompanyDraft = (): CompanyDraft => ({
    name: '',
    role: '',
    packageOffered: '',
    driveDate: '2026-05-10',
    status: 'Upcoming',
    location: 'On Campus',
    type: 'Placement',
    eligibleDepartments: defaultDepartmentCode,
  });

  const createAnnouncementDraft = (): AnnouncementDraft => ({
    title: '',
    summary: '',
    audience: user.role === 'admin' ? 'All' : user.role === 'staff' ? 'Students' : 'Students',
    priority: 'Medium',
    category: 'Campus Update',
  });

  const [activeTab, setActiveTab] = useState(availableNav[0]?.id ?? 'dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [studentSearch, setStudentSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(user.studentId ?? data.students[0]?.id ?? null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false);
  const [studentDraft, setStudentDraft] = useState<StudentDraft>(createStudentDraft);
  const [departmentDraft, setDepartmentDraft] = useState<DepartmentDraft>(createDepartmentDraft);
  const [companyDraft, setCompanyDraft] = useState<CompanyDraft>(createCompanyDraft);
  const [announcementDraft, setAnnouncementDraft] = useState<AnnouncementDraft>(createAnnouncementDraft);

  useEffect(() => {
    if (!availableNav.some((item) => item.id === activeTab)) {
      setActiveTab(availableNav[0]?.id ?? 'dashboard');
    }
  }, [activeTab, availableNav]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const syncSidebarState = (matches: boolean) => {
      setIsSidebarOpen(matches);
    };
    const handleChange = (event: MediaQueryListEvent) => {
      syncSidebarState(event.matches);
    };

    syncSidebarState(mediaQuery.matches);
    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  useEffect(() => {
    if (user.studentId) {
      setSelectedStudentId(user.studentId);
    }
  }, [user.studentId]);

  const departmentLookup = new Map(data.departments.map((department) => [department.code, department]));
  const currentStudent = user.studentId ? data.students.find((student) => student.id === user.studentId) ?? null : null;
  const scopeStudents =
    user.role === 'staff' && user.departmentCode
      ? data.students.filter((student) => student.departmentCode === user.departmentCode)
      : data.students;

  const filteredStudents = scopeStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      student.registrationNumber.toLowerCase().includes(studentSearch.toLowerCase());
    const matchesDepartment = departmentFilter === 'all' ? true : student.departmentCode === departmentFilter;
    return matchesSearch && matchesDepartment;
  });

  useEffect(() => {
    if (!filteredStudents.length) {
      setSelectedStudentId(null);
      return;
    }

    const stillVisible = filteredStudents.some((student) => student.id === selectedStudentId);
    if (!stillVisible) {
      setSelectedStudentId(filteredStudents[0].id);
    }
  }, [filteredStudents, selectedStudentId]);

  const selectedStudent =
    (user.role === 'student' ? currentStudent : data.students.find((student) => student.id === selectedStudentId)) ??
    filteredStudents[0] ??
    null;

  const visibleAnnouncements = data.announcements.filter((announcement) =>
    audienceMatches(user.role, announcement.audience),
  );

  const eligibleCompanies =
    currentStudent == null
      ? []
      : data.companies.filter((company) => company.eligibleDepartments.includes(currentStudent.departmentCode));

  const placedStudents = data.students.filter((student) => student.status === 'Placed').length;
  const placementReadyStudents = data.students.filter((student) => student.status === 'Placement Ready').length;
  const paidFees = data.students.filter((student) => student.feeStatus === 'Paid').length;
  const openDrives = data.companies.filter(
    (company) => company.status === 'Open' || company.status === 'Closing Soon',
  ).length;
  const scopedAverageAttendance =
    scopeStudents.length === 0
      ? 0
      : Math.round(scopeStudents.reduce((sum, student) => sum + student.attendance, 0) / scopeStudents.length);
  const placementRate =
    data.students.length === 0 ? 0 : Math.round((placedStudents / data.students.length) * 100);

  const departmentStats = data.departments.map((department) => {
    const students = data.students.filter((student) => student.departmentCode === department.code);
    const placed = students.filter((student) => student.status === 'Placed').length;
    const ready = students.filter((student) => student.status === 'Placement Ready').length;
    return {
      department,
      students: students.length,
      placed,
      ready,
      rate: students.length === 0 ? 0 : Math.round((placed / students.length) * 100),
    };
  });

  const placementPieData = [
    { name: 'Placed', value: placedStudents, color: '#0ea5e9' },
    { name: 'Ready', value: placementReadyStudents, color: '#7dd3fc' },
    { name: 'Active', value: data.students.length - placedStudents - placementReadyStudents, color: '#e2e8f0' },
  ];
  const feeRecoveryRate =
    data.students.length === 0 ? 0 : Math.round((paidFees / data.students.length) * 100);
  const featuredCompanies = [...data.companies]
    .sort((left, right) => {
      const statusRank: Record<CompanyStatus, number> = {
        Open: 0,
        'Closing Soon': 1,
        Upcoming: 2,
        Closed: 3,
      };
      const statusDelta = statusRank[left.status] - statusRank[right.status];
      if (statusDelta !== 0) {
        return statusDelta;
      }
      return new Date(left.driveDate).getTime() - new Date(right.driveDate).getTime();
    })
    .slice(0, 5);
  const activityFeed = visibleAnnouncements.slice(0, 4);
  const departmentLeaders = [...departmentStats]
    .sort((left, right) => (right.rate - left.rate) || (right.placed - left.placed))
    .slice(0, 4);
  const roleSubtitle: Record<CampusRole, string> = {
    admin: 'Campus overview',
    staff: 'Department overview',
    student: 'Student overview',
  };
  const headerDateLabel = new Date().toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
  const userInitials =
    user.name
      .split(' ')
      .map((segment) => segment[0] ?? '')
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'AG';

  const handleNavSelection = (tabId: string) => {
    setActiveTab(tabId);

    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const createStudent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void Promise.resolve(
      onCreateStudent({
        name: studentDraft.name,
        email: studentDraft.email,
        departmentCode: user.role === 'staff' ? user.departmentCode : studentDraft.departmentCode,
        year: studentDraft.year,
        cgpa: Number(studentDraft.cgpa),
        attendance: Number(studentDraft.attendance),
        phone: studentDraft.phone || undefined,
        feeStatus: studentDraft.feeStatus,
        skills: studentDraft.skills.split(',').map((skill) => skill.trim()).filter(Boolean),
      }),
    ).then(() => {
      setShowStudentModal(false);
      setStudentDraft(createStudentDraft());
    }).catch(() => undefined);
  };

  const createDepartment = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void Promise.resolve(
      onCreateDepartment({
        name: departmentDraft.name,
        code: departmentDraft.code.trim().toUpperCase(),
        hod: departmentDraft.hod,
        staffCount: Number(departmentDraft.staffCount),
        intake: Number(departmentDraft.intake),
      }),
    ).then(() => {
      setShowDepartmentModal(false);
      setDepartmentDraft(createDepartmentDraft());
    }).catch(() => undefined);
  };

  const createCompany = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void Promise.resolve(
      onCreateCompany({
        name: companyDraft.name,
        role: companyDraft.role,
        packageOffered: companyDraft.packageOffered,
        driveDate: companyDraft.driveDate,
        status: companyDraft.status,
        location: companyDraft.location,
        type: companyDraft.type,
        eligibleDepartments: companyDraft.eligibleDepartments
          .split(',')
          .map((department) => department.trim().toUpperCase())
          .filter(Boolean),
      }),
    ).then(() => {
      setShowCompanyModal(false);
      setCompanyDraft(createCompanyDraft());
    }).catch(() => undefined);
  };

  const createAnnouncement = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    void Promise.resolve(
      onCreateAnnouncement({
        title: announcementDraft.title,
        summary: announcementDraft.summary,
        audience: announcementDraft.audience,
        priority: announcementDraft.priority,
        category: announcementDraft.category,
      }),
    ).then(() => {
      setShowAnnouncementModal(false);
      setAnnouncementDraft(createAnnouncementDraft());
    }).catch(() => undefined);
  };

  const applyToCompany = (companyId: number) => {
    if (!currentStudent || currentStudent.appliedCompanyIds.includes(companyId) || !can('placement.apply')) {
      return;
    }

    void Promise.resolve(onApplyToCompany(companyId)).catch(() => undefined);
  };

  const dashboardHero = (
    <Panel className="overflow-hidden border border-sky-100 bg-[linear-gradient(135deg,#38bdf8,#7dd3fc)] p-7 text-white md:p-8">
      <div className="grid gap-7 xl:grid-cols-[1.25fr_0.75fr]">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/12 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-blue-50">
            <Sparkles size={14} />
            Campus view
          </div>
          <h1 className="mt-5 text-3xl font-bold leading-tight md:text-4xl">{campusBrand.campusName}</h1>
          <p className="mt-4 text-base leading-7 text-blue-50/90">{roleSubtitle[user.role]}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {can('students.create') ? (
              <button
                type="button"
                onClick={() => setShowStudentModal(true)}
                className="rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-sky-700 transition hover:bg-sky-50"
              >
                Add student
              </button>
            ) : null}
            {can('announcements.create') ? (
              <button
                type="button"
                onClick={() => setShowAnnouncementModal(true)}
                className="rounded-2xl border border-white/25 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/16"
              >
                Post update
              </button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <div className="rounded-[26px] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-blue-100">Live metrics</p>
            <p className="mt-3 text-3xl font-bold">{placementRate}%</p>
            <p className="mt-2 text-sm text-blue-50/80">Placement rate</p>
          </div>
          <div className="rounded-[26px] border border-white/15 bg-white/10 p-5 backdrop-blur">
            <p className="text-sm text-blue-100">This week</p>
            <p className="mt-3 text-3xl font-bold">{openDrives}</p>
            <p className="mt-2 text-sm text-blue-50/80">Open drives</p>
          </div>
        </div>
      </div>
    </Panel>
  );

  const renderAdminDashboard = () => (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <DashboardHighlightCard
          label="Students"
          value={data.students.length}
          detail="Active student records"
          meta={`${placementReadyStudents} ready`}
          icon={Users}
          tone="navy"
        />
        <DashboardHighlightCard
          label="Placement Rate"
          value={`${placementRate}%`}
          detail="Current cycle conversion"
          meta={`${placedStudents} placed`}
          icon={TrendingUp}
          tone="sky"
        />
        <DashboardHighlightCard
          label="Open Drives"
          value={openDrives}
          detail="Live or closing soon"
          meta={`${data.companies.length} total`}
          icon={BriefcaseBusiness}
          tone="teal"
        />
        <DashboardHighlightCard
          label="Fee Recovery"
          value={`${feeRecoveryRate}%`}
          detail="Paid fee status"
          meta={`${paidFees} cleared`}
          icon={ClipboardList}
          tone="amber"
        />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.45fr_0.95fr]">
        <Panel className="border border-[#dce8f2] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Analytics</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">Placement trend</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Offers</span>
              <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-600">Drives</span>
            </div>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Live metrics</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{placementRate}%</p>
              <p className="mt-1 text-sm text-slate-500">Placement conversion</p>
            </div>
            <div className="rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Ready students</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{placementReadyStudents}</p>
              <p className="mt-1 text-sm text-slate-500">Prepared for next drives</p>
            </div>
            <div className="rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Departments</p>
              <p className="mt-2 text-2xl font-bold text-slate-950">{data.departments.length}</p>
              <p className="mt-1 text-sm text-slate-500">Tracked in this demo</p>
            </div>
          </div>

          <div className="mt-6 h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthTrend} margin={{ top: 8, right: 10, left: -12, bottom: 0 }}>
                <CartesianGrid stroke="#e7eef5" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#6b8092', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b8092', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    borderRadius: '16px',
                    border: '1px solid #dce8f2',
                    boxShadow: '0 20px 40px -28px rgba(15, 23, 42, 0.35)',
                  }}
                />
                <Line type="monotone" dataKey="offers" stroke="#0ea5e9" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="drives" stroke="#7dd3fc" strokeWidth={3} dot={false} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="grid gap-5">
          <Panel className="border border-[#dce8f2] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Placement mix</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">Current status</h3>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Overview</span>
            </div>

            <div className="relative mt-5 h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={placementPieData} dataKey="value" innerRadius={70} outerRadius={96} paddingAngle={4}>
                    {placementPieData.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="rounded-full bg-white/95 px-5 py-4 text-center shadow-[0_18px_30px_-24px_rgba(15,23,42,0.35)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Placed</p>
                  <p className="mt-1 text-3xl font-bold text-slate-950">{placedStudents}</p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid gap-3">
              {placementPieData.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-[20px] border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm font-medium text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-950">{item.value}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setActiveTab('reports')}
              className="mt-5 flex w-full items-center justify-between rounded-[20px] bg-sky-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_20px_35px_-25px_rgba(14,165,233,0.45)] transition hover:bg-sky-600"
            >
              Open reports
              <ChevronRight size={18} />
            </button>
          </Panel>

          <Panel className="border border-[#dce8f2] p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Updates</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-950">Announcements</h3>
              </div>
              <Bell size={18} className="text-slate-400" />
            </div>

            <div className="mt-5 space-y-3">
              {activityFeed.map((announcement) => (
                <div key={announcement.id} className="rounded-[22px] border border-slate-100 bg-slate-50 px-4 py-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{announcement.title}</p>
                      <p className="mt-1 text-sm text-slate-500">{announcement.category}</p>
                    </div>
                    <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', statusTone(announcement.priority))}>
                      {announcement.priority}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    <span>{announcement.postedBy}</span>
                    <span>{formatDate(announcement.date)}</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.25fr_0.75fr]">
        <Panel className="border border-[#dce8f2] p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Company drives</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">Open pipeline</h3>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('placement')}
              className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Open placement
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="mt-5 space-y-3">
            {featuredCompanies.map((company) => (
              <div key={company.id} className="grid gap-3 rounded-[24px] border border-slate-100 bg-slate-50 px-4 py-4 md:grid-cols-[1.25fr_0.8fr_0.65fr_auto] md:items-center">
                <div>
                  <p className="font-semibold text-slate-950">{company.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{company.role}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Drive date</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{formatDate(company.driveDate)}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Applicants</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{company.applicants}</p>
                </div>
                <div className="flex justify-start md:justify-end">
                  <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', statusTone(company.status))}>
                    {company.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel className="border border-[#dce8f2] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Departments</p>
              <h3 className="mt-2 text-2xl font-bold text-slate-950">Top departments</h3>
            </div>
            <ChartColumn size={18} className="text-slate-400" />
          </div>

          <div className="mt-5 space-y-4">
            {departmentLeaders.map((item, index) => (
              <div key={item.department.id} className="rounded-[24px] border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-sm font-bold text-blue-700 shadow-sm">
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-950">{item.department.code}</p>
                      <p className="text-sm text-slate-500">{item.department.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-slate-950">{item.rate}%</p>
                    <p className="text-xs font-medium text-slate-500">{item.placed} placed</p>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white">
                  <div
                    className="h-2 rounded-full bg-[linear-gradient(90deg,#38bdf8,#0ea5e9)]"
                    style={{ width: `${Math.max(item.rate, 10)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );

  const renderStaffDashboard = () => {
    const departmentName = user.departmentCode ? departmentLookup.get(user.departmentCode)?.name ?? 'My Department' : 'My Department';
    const readyStudents = scopeStudents.filter((student) => student.status === 'Placement Ready').length;

    return (
      <div className="space-y-6">
        {dashboardHero}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Department Students" value={scopeStudents.length} helper={user.departmentCode ?? 'Dept'} icon={Users} tone="navy" />
          <MetricCard label="Placement Ready" value={readyStudents} helper="Actionable list" icon={ShieldCheck} tone="sky" />
          <MetricCard label="Avg Attendance" value={`${scopedAverageAttendance}%`} helper="Live snapshot" icon={BookOpenCheck} tone="teal" />
          <MetricCard label="Announcements" value={visibleAnnouncements.length} helper="Shared feed" icon={Megaphone} tone="indigo" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Panel className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-950">{departmentName}</h3>
                <p className="mt-2 text-sm text-slate-500">Students you can highlight during department-specific demos.</p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('students')}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Open students
              </button>
            </div>
            <div className="mt-5 space-y-3">
              {scopeStudents.slice(0, 6).map((student) => (
                <button
                  key={student.id}
                  type="button"
                  onClick={() => {
                    setSelectedStudentId(student.id);
                    setActiveTab('students');
                  }}
                  className="flex w-full items-center justify-between rounded-[24px] border border-slate-100 px-4 py-4 text-left transition hover:border-slate-200 hover:bg-slate-50"
                >
                  <div>
                    <p className="font-semibold text-slate-950">{student.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{student.registrationNumber}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', statusTone(student.status))}>
                      {student.status}
                    </span>
                    <ChevronRight size={18} className="text-slate-400" />
                  </div>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-950">Readiness trend</h3>
                <p className="mt-2 text-sm text-slate-500">A compact performance chart for staff demos.</p>
              </div>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">Team view</span>
            </div>
            <div className="mt-6 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthTrend}>
                  <CartesianGrid stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#475569' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fill: '#475569' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="offers" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" dataKey="drives" stroke="#7dd3fc" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Panel>
        </div>
      </div>
    );
  };

  const renderStudentDashboard = () => {
    if (!currentStudent) {
      return (
        <Panel className="p-8">
          <p className="text-lg font-semibold text-slate-950">Student profile missing</p>
          <p className="mt-2 text-sm text-slate-500">The demo account does not have a linked student profile yet.</p>
        </Panel>
      );
    }

    const appliedCompanies = data.companies.filter((company) => currentStudent.appliedCompanyIds.includes(company.id));

    return (
      <div className="space-y-6">
        <Panel className="overflow-hidden bg-[linear-gradient(135deg,#ffffff,#eaf8ff_56%,#eef9f2)] p-7">
          <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-white">
                <GraduationCap size={14} />
                Student dashboard
              </div>
              <h1 className="mt-5 text-3xl font-bold text-slate-950">{currentStudent.name}</h1>
              <p className="mt-2 text-base text-slate-600">
                {currentStudent.registrationNumber} • {currentStudent.departmentCode} • {currentStudent.year}
              </p>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Track placements, monitor announcements, and show a polished student journey during demos.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-[26px] border border-white/70 bg-white/80 p-5 shadow-sm">
                <p className="text-sm text-slate-500">Placement status</p>
                <p className="mt-3 text-2xl font-bold text-slate-950">{currentStudent.status}</p>
                <p className="mt-2 text-sm text-slate-600">You already match {eligibleCompanies.length} eligible drives.</p>
              </div>
              <div className="rounded-[26px] border border-white/70 bg-white/80 p-5 shadow-sm">
                <p className="text-sm text-slate-500">Current applications</p>
                <p className="mt-3 text-2xl font-bold text-slate-950">{appliedCompanies.length}</p>
                <p className="mt-2 text-sm text-slate-600">Use this to show placement momentum clearly.</p>
              </div>
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="CGPA" value={currentStudent.cgpa.toFixed(1)} helper="Academic score" icon={BookOpenCheck} tone="sky" />
          <MetricCard label="Attendance" value={`${currentStudent.attendance}%`} helper="Latest record" icon={ClipboardList} tone="navy" />
          <MetricCard label="Applications" value={appliedCompanies.length} helper="Submitted" icon={BriefcaseBusiness} tone="emerald" />
          <MetricCard label="Announcements" value={visibleAnnouncements.length} helper="Unread feed" icon={Megaphone} tone="amber" />
        </div>
      </div>
    );
  };

  const renderStudentsTab = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Student module"
        description="Search, filter, and showcase rich student records."
        action={
          can('students.create') ? (
            <button
              type="button"
              onClick={() => setShowStudentModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Add student
            </button>
          ) : null
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Panel className="p-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-md">
              <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                value={studentSearch}
                onChange={(event) => setStudentSearch(event.target.value)}
                placeholder="Search student name or registration number"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </div>

            <div className="relative">
              <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select
                value={departmentFilter}
                onChange={(event) => setDepartmentFilter(event.target.value)}
                className="rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-10 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="all">All departments</option>
                {data.departments.map((department) => (
                  <option key={department.code} value={department.code}>
                    {department.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  <th className="px-4 pb-2">Name</th>
                  <th className="px-4 pb-2">Department</th>
                  <th className="px-4 pb-2">Year</th>
                  <th className="px-4 pb-2">Status</th>
                  <th className="px-4 pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="rounded-[24px] bg-slate-50 text-sm text-slate-700">
                    <td className="rounded-l-[24px] px-4 py-4">
                      <div>
                        <p className="font-semibold text-slate-950">{student.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{student.email}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">{student.departmentCode}</td>
                    <td className="px-4 py-4">{student.year}</td>
                    <td className="px-4 py-4">
                      <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', statusTone(student.status))}>
                        {student.status}
                      </span>
                    </td>
                    <td className="rounded-r-[24px] px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentId(student.id)}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredStudents.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
                No students match the current search.
              </div>
            ) : null}
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-950">Student profile</h3>
              <p className="mt-2 text-sm text-slate-500">A strong detail view for demos and internal reviews.</p>
            </div>
            <UserCircle2 size={20} className="text-slate-400" />
          </div>

          {selectedStudent ? (
            <div className="mt-5 space-y-5">
              <div className="rounded-[26px] bg-slate-950 p-5 text-white">
                <p className="text-sm text-slate-300">{selectedStudent.registrationNumber}</p>
                <h4 className="mt-2 text-2xl font-bold">{selectedStudent.name}</h4>
                <p className="mt-2 text-sm text-slate-300">{selectedStudent.departmentCode} • {selectedStudent.year}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">CGPA</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">{selectedStudent.cgpa.toFixed(1)}</p>
                </div>
                <div className="rounded-[24px] bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Attendance</p>
                  <p className="mt-2 text-2xl font-bold text-slate-950">{selectedStudent.attendance}%</p>
                </div>
              </div>
              <div className="space-y-3 rounded-[24px] border border-slate-100 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', statusTone(selectedStudent.status))}>
                    {selectedStudent.status}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Fee status</span>
                  <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', statusTone(selectedStudent.feeStatus))}>
                    {selectedStudent.feeStatus}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Mentor</span>
                  <span className="text-sm font-semibold text-slate-900">{selectedStudent.mentor}</span>
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">Skills</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedStudent.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="mt-5 rounded-[24px] border border-dashed border-slate-200 px-4 py-8 text-center text-sm text-slate-500">
              Select a student to view the full profile card.
            </div>
          )}
        </Panel>
      </div>
    </div>
  );

  const renderDepartmentsTab = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Department module"
        description="Academic units, HOD ownership, and placement performance."
        action={
          can('departments.create') ? (
            <button
              type="button"
              onClick={() => setShowDepartmentModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Add department
            </button>
          ) : null
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        {departmentStats.map((item) => (
          <Panel key={item.department.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {item.department.code}
                </div>
                <h3 className="mt-4 text-xl font-bold text-slate-950">{item.department.name}</h3>
                <p className="mt-2 text-sm text-slate-500">HOD: {item.department.hod}</p>
              </div>
              <div className="h-12 w-12 rounded-2xl" style={{ background: `linear-gradient(145deg, ${item.department.accent}, #24a8e8)` }} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-[22px] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Students</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{item.students}</p>
              </div>
              <div className="rounded-[22px] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Placed</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{item.placed}</p>
              </div>
              <div className="rounded-[22px] bg-slate-50 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Rate</p>
                <p className="mt-2 text-2xl font-bold text-slate-950">{item.rate}%</p>
              </div>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );

  const renderPlacementTab = () => {
    if (user.role === 'student' && currentStudent) {
      return (
        <div className="space-y-6">
          <SectionHeader title="Placement module" description="Open company drives matched to the current student profile." />
          <div className="grid gap-5 xl:grid-cols-2">
            {eligibleCompanies.map((company) => {
              const hasApplied = currentStudent.appliedCompanyIds.includes(company.id);
              return (
                <Panel key={company.id} className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{company.type}</p>
                      <h3 className="mt-2 text-2xl font-bold text-slate-950">{company.name}</h3>
                      <p className="mt-2 text-sm text-slate-500">{company.role}</p>
                    </div>
                    <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', statusTone(company.status))}>
                      {company.status}
                    </span>
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-[22px] bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Package</p>
                      <p className="mt-2 font-semibold text-slate-950">{company.packageOffered}</p>
                    </div>
                    <div className="rounded-[22px] bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Drive date</p>
                      <p className="mt-2 font-semibold text-slate-950">{formatDate(company.driveDate)}</p>
                    </div>
                  </div>
                  <p className="mt-5 text-sm leading-6 text-slate-600">
                    Eligible departments: {company.eligibleDepartments.join(', ')} • Location: {company.location}
                  </p>
                  <button
                    type="button"
                    onClick={() => applyToCompany(company.id)}
                    disabled={hasApplied}
                    className={classNames(
                      'mt-5 rounded-2xl px-4 py-3 text-sm font-semibold transition',
                      hasApplied ? 'bg-slate-100 text-slate-400' : 'bg-slate-950 text-white hover:bg-slate-800',
                    )}
                  >
                    {hasApplied ? 'Application sent' : 'Apply to drive'}
                  </button>
                </Panel>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <SectionHeader
          title="Placement module"
          description="Drive management, applicant momentum, and recruiter readiness."
          action={can('placement.create') ? (
            <button
              type="button"
              onClick={() => setShowCompanyModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Add company
            </button>
          ) : null}
        />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Company Drives" value={data.companies.length} helper="All records" icon={Building2} tone="navy" />
          <MetricCard label="Applicants" value={data.companies.reduce((sum, company) => sum + company.applicants, 0)} helper="Live count" icon={Users} tone="sky" />
          <MetricCard label="Shortlisted" value={data.companies.reduce((sum, company) => sum + company.shortlisted, 0)} helper="Pipeline" icon={ShieldCheck} tone="teal" />
          <MetricCard label="Internship Drives" value={data.companies.filter((company) => company.type === 'Internship').length} helper="Blended demo" icon={ClipboardList} tone="amber" />
        </div>
      </div>
    );
  };

  const renderAnnouncementsTab = () => (
    <div className="space-y-6">
      <SectionHeader
        title="Announcement module"
        description="Campus notifications, placement alerts, and admin communication."
        action={
          can('announcements.create') ? (
            <button
              type="button"
              onClick={() => setShowAnnouncementModal(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              <Plus size={16} />
              Add announcement
            </button>
          ) : null
        }
      />

      <div className="grid gap-5 xl:grid-cols-2">
        {visibleAnnouncements.map((announcement) => (
          <Panel key={announcement.id} className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {announcement.category}
                </span>
                <h3 className="mt-4 text-xl font-bold text-slate-950">{announcement.title}</h3>
              </div>
              <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', statusTone(announcement.priority))}>
                {announcement.priority}
              </span>
            </div>
            <p className="mt-4 text-sm leading-7 text-slate-600">{announcement.summary}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-slate-500">
              <span>{announcement.postedBy}</span>
              <span>{announcement.audience}</span>
              <span>{formatDate(announcement.date)}</span>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );

  const renderReportsTab = () => (
    <div className="space-y-6">
      <SectionHeader title="Reports module" description="Charts and KPIs that make the demo feel production-ready." />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <MetricCard label="Placement Rate" value={`${placementRate}%`} helper="Overall" icon={TrendingUp} tone="navy" />
        <MetricCard label="Fee Recovery" value={`${Math.round((paidFees / data.students.length) * 100)}%`} helper="Collection" icon={ClipboardList} tone="amber" />
        <MetricCard label="Average Attendance" value={`${scopedAverageAttendance}%`} helper="Academic health" icon={BookOpenCheck} tone="sky" />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Panel className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-950">Monthly placement trend</h3>
              <p className="mt-2 text-sm text-slate-500">Offers and drive activity across the current cycle.</p>
            </div>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Growth view</span>
          </div>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthTrend}>
                <defs>
                  <linearGradient id="offersGradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#24a8e8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#24a8e8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#475569' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#475569' }} />
                <Tooltip />
                <Area type="monotone" dataKey="offers" stroke="#24a8e8" strokeWidth={3} fill="url(#offersGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-950">Department performance</h3>
              <p className="mt-2 text-sm text-slate-500">Placed, ready, and active counts per department.</p>
            </div>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">Snapshot</span>
          </div>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentStats}>
                <CartesianGrid stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="department.code" tickLine={false} axisLine={false} tick={{ fill: '#475569' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#475569' }} />
                <Tooltip />
                <Bar dataKey="students" fill="#cbd5e1" radius={[8, 8, 0, 0]} />
                <Bar dataKey="placed" fill="#24a8e8" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );

  const renderProfileTab = () => {
    if (user.role === 'student' && currentStudent) {
      const appliedCompanies = data.companies.filter((company) => currentStudent.appliedCompanyIds.includes(company.id));

      return (
        <div className="space-y-6">
          <SectionHeader title="Profile" description="Student profile card and placement readiness." />
          <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <Panel className="overflow-hidden">
              <div className="bg-[linear-gradient(135deg,#38bdf8,#7dd3fc)] p-7 text-white">
                <p className="text-sm text-blue-100">{user.title}</p>
                <h3 className="mt-2 text-3xl font-bold">{currentStudent.name}</h3>
                <p className="mt-2 text-sm text-blue-100">{user.email}</p>
              </div>
              <div className="space-y-4 p-7">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Registration</span>
                  <span className="font-semibold text-slate-950">{currentStudent.registrationNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Department</span>
                  <span className="font-semibold text-slate-950">{currentStudent.departmentCode}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Status</span>
                  <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', statusTone(currentStudent.status))}>
                    {currentStudent.status}
                  </span>
                </div>
              </div>
            </Panel>

            <Panel className="p-7">
              <h3 className="text-xl font-bold text-slate-950">Academic and placement snapshot</h3>
              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-[24px] bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">CGPA</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{currentStudent.cgpa.toFixed(1)}</p>
                </div>
                <div className="rounded-[24px] bg-slate-50 p-5">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Attendance</p>
                  <p className="mt-2 text-3xl font-bold text-slate-950">{currentStudent.attendance}%</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-900">Skills</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentStudent.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 space-y-3">
                {appliedCompanies.map((company) => (
                  <div key={company.id} className="flex items-center justify-between rounded-[22px] border border-slate-100 px-4 py-3">
                    <div>
                      <p className="font-semibold text-slate-950">{company.name}</p>
                      <p className="text-sm text-slate-500">{company.role}</p>
                    </div>
                    <span className={classNames('rounded-full px-3 py-1 text-xs font-semibold', statusTone(company.status))}>
                      {company.status}
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <SectionHeader title="Profile" description="Role profile, ownership, and demo controls." />
        <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
          <Panel className="overflow-hidden">
            <div className="bg-[linear-gradient(135deg,#38bdf8,#7dd3fc)] p-7 text-white">
              <p className="text-sm text-emerald-100">{user.title}</p>
              <h3 className="mt-2 text-3xl font-bold">{user.name}</h3>
              <p className="mt-2 text-sm text-emerald-100">{user.email}</p>
            </div>
            <div className="space-y-4 p-7">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Access role</span>
                <span className="font-semibold capitalize text-slate-950">{user.role}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Campus</span>
                <span className="font-semibold text-slate-950">{campusBrand.campusName}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Department</span>
                <span className="font-semibold text-slate-950">{user.departmentCode ?? 'All Departments'}</span>
              </div>
            </div>
          </Panel>

          <Panel className="p-7">
            <h3 className="text-xl font-bold text-slate-950">Demo controls and scope</h3>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              This profile view gives you a safe place to explain access levels, operational ownership, and reset the seeded data before the next client conversation.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <div className="rounded-[24px] bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Students in scope</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{scopeStudents.length}</p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Announcements</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{visibleAnnouncements.length}</p>
              </div>
              <div className="rounded-[24px] bg-slate-50 p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-500">Open drives</p>
                <p className="mt-2 text-3xl font-bold text-slate-950">{openDrives}</p>
              </div>
            </div>
            {can('demo.reset') ? (
              <div className="mt-6 rounded-[26px] border border-dashed border-slate-200 p-5">
                <p className="text-sm font-semibold text-slate-900">Reset seeded demo data</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Use this before a fresh walkthrough if you want to clear any students, companies, or announcements added during a previous sales call.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    void onResetDemo();
                  }}
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <RotateCcw size={16} />
                  Reset demo data
                </button>
              </div>
            ) : null}
          </Panel>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return user.role === 'admin' ? renderAdminDashboard() : user.role === 'staff' ? renderStaffDashboard() : renderStudentDashboard();
      case 'students':
        return renderStudentsTab();
      case 'departments':
        return renderDepartmentsTab();
      case 'placement':
        return renderPlacementTab();
      case 'announcements':
        return renderAnnouncementsTab();
      case 'reports':
        return renderReportsTab();
      case 'profile':
        return renderProfileTab();
      default:
        return renderAdminDashboard();
    }
  };

  return (
    <>
      <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(56,189,248,0.08),_transparent_22%),linear-gradient(180deg,#f4fbff_0%,#ffffff_100%)]">
        <header className="fixed inset-x-0 top-0 z-40 border-b border-[#dbe8f4] bg-white/92 backdrop-blur-xl shadow-[0_14px_34px_-26px_rgba(8,41,75,0.32)]">
          <div className="mx-auto flex max-w-[1640px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex min-w-0 items-center gap-3 sm:gap-4">
              <button
                type="button"
                onClick={() => setIsSidebarOpen((current) => !current)}
                className="inline-flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[18px] border border-[#d7e6f3] bg-white text-[#123a66] shadow-[0_14px_28px_-24px_rgba(8,41,75,0.45)] transition hover:border-[#aed6ee] hover:bg-[#f6fbff]"
                aria-label="Toggle sidebar navigation"
              >
                <Menu size={22} />
              </button>

              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-[18px] bg-[linear-gradient(145deg,#082c56,#1da9ea)] shadow-[0_18px_35px_-24px_rgba(8,44,86,0.46)]">
                  <img
                    src="/alpha-logo.png"
                    alt="Alpha Grew logo"
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-[11px] font-semibold uppercase tracking-[0.26em] text-[#6a87a4]">
                    {campusBrand.companyName}
                  </p>
                  <h1 className="truncate text-lg font-bold text-[#0a2848] sm:text-xl">
                    {campusBrand.productName}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden items-center gap-2 rounded-[18px] border border-[#d9e6f2] bg-white px-4 py-3 text-sm font-semibold text-[#123a66] shadow-[0_14px_28px_-24px_rgba(8,41,75,0.18)] sm:flex">
                <CalendarDays size={16} className="text-[#1a9be2]" />
                <span>{headerDateLabel}</span>
              </div>
              <button
                type="button"
                className="hidden h-11 w-11 items-center justify-center rounded-full border border-[#d9e6f2] bg-white text-[#123a66] transition hover:bg-[#f6fbff] md:inline-flex"
                aria-label="Search"
              >
                <Search size={18} />
              </button>
              <button
                type="button"
                className="hidden h-11 w-11 items-center justify-center rounded-full border border-[#d9e6f2] bg-white text-[#123a66] transition hover:bg-[#f6fbff] md:inline-flex"
                aria-label="Notifications"
              >
                <Bell size={18} />
              </button>
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(135deg,#082c56,#1aa8e9)] text-sm font-bold text-white shadow-[0_16px_30px_-22px_rgba(8,44,86,0.45)]">
                {userInitials}
              </div>
            </div>
          </div>
        </header>

        <div
          className={classNames(
            'fixed inset-0 z-30 bg-[#082c56]/28 backdrop-blur-[2px] transition lg:hidden',
            isSidebarOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
          )}
          onClick={() => setIsSidebarOpen(false)}
        />

        <div className="mx-auto max-w-[1640px] px-4 pb-6 pt-[104px] sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 lg:flex-row">
            <aside
              className={classNames(
                'fixed left-4 top-[92px] z-40 h-[calc(100vh-108px)] w-[280px] max-w-[calc(100vw-2rem)] overflow-y-auto rounded-[30px] border border-[#0b3d6f] bg-[linear-gradient(180deg,#062d59_0%,#0b467c_54%,#22a9e9_100%)] p-4 shadow-[0_30px_60px_-34px_rgba(6,45,89,0.82)] transition-transform duration-300 lg:sticky lg:top-[104px] lg:h-[calc(100vh-128px)] lg:max-w-none lg:flex-shrink-0',
                isSidebarOpen ? 'translate-x-0' : '-translate-x-[120%] lg:hidden',
              )}
            >
              <div className="rounded-[26px] border border-white/12 bg-white/10 p-4 backdrop-blur-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100/80">
                      {campusBrand.companyName}
                    </p>
                    <h1 className="mt-2 text-[1.55rem] font-bold leading-tight text-white">
                      {campusBrand.productName}
                    </h1>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsSidebarOpen(false)}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/12 bg-white/10 text-white transition hover:bg-white/16 lg:hidden"
                    aria-label="Close sidebar navigation"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-center rounded-[24px] border border-white/10 bg-white/6 px-4 py-5">
                  <img
                    src="/alpha-logo.png"
                    alt="Alpha Grew logo"
                    className="h-auto w-full max-w-[220px] object-contain"
                  />
                </div>
                <p className="mt-4 text-sm leading-6 text-sky-50/82">{campusBrand.campusName}</p>
              </div>

              <div className="mt-5 space-y-2">
                {availableNav.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleNavSelection(item.id)}
                    className={classNames(
                      'flex w-full items-center gap-3 rounded-[22px] px-4 py-3.5 text-left text-sm font-semibold transition',
                      activeTab === item.id
                        ? 'bg-white text-[#0c3f77] shadow-[0_18px_35px_-24px_rgba(6,45,89,0.48)]'
                        : 'bg-white/8 text-white/80 hover:bg-white/12 hover:text-white',
                    )}
                  >
                    <span className={classNames(
                      'flex h-9 w-9 items-center justify-center rounded-2xl',
                      activeTab === item.id ? 'bg-[#e7f5ff] text-[#1aa1e6]' : 'bg-white/12 text-sky-100',
                    )}>
                      <item.icon size={18} />
                    </span>
                    <span className="flex-1">{item.label}</span>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-[24px] border border-white/14 bg-white/10 p-5 text-white backdrop-blur-sm lg:mt-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-sky-100/72">Signed in as</p>
                <h3 className="mt-2 text-lg font-bold text-white">{user.name}</h3>
                <p className="mt-1 text-sm text-sky-100/80">{user.title}</p>
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm">
                  <span className="text-sky-100/72">Role</span>
                  <span className="font-semibold capitalize text-white">{user.role}</span>
                </div>
              </div>
            </aside>

            <main className="min-w-0 flex-1 space-y-5">
              <Panel className="border border-[#dce8f2] px-6 py-6 sm:px-8">
                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate-500">Overview</p>
                    <h2 className="mt-2 text-3xl font-bold text-slate-950">
                      {availableNav.find((item) => item.id === activeTab)?.label ?? 'Dashboard'}
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{roleSubtitle[user.role]}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    {can('demo.reset') ? (
                      <button
                        type="button"
                        onClick={() => {
                          void onResetDemo();
                        }}
                        className="inline-flex items-center gap-2 rounded-2xl border border-[#c9e4f7] bg-white px-4 py-3 text-sm font-semibold text-[#0c3f77] transition hover:border-[#9fd0ef] hover:bg-[#eef8ff]"
                      >
                        <RotateCcw size={16} />
                        Reset demo
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => {
                        void onLogout();
                      }}
                      className="inline-flex items-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#0b4d88,#1ba8e9)] px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_35px_-24px_rgba(11,77,136,0.5)] transition hover:opacity-90"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              </Panel>

              {error ? (
                <div className="rounded-[28px] border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
                  {error}
                </div>
              ) : null}

              <AnimatePresence mode="wait">
                <motion.div
                  key={`${user.role}-${activeTab}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.22 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>

      <>
        <Modal
          open={showStudentModal}
          title="Add student"
          description="Create a new student record to enrich the demo and show a realistic admin flow."
          onClose={() => {
            setShowStudentModal(false);
            setStudentDraft(createStudentDraft());
          }}
        >
          <form onSubmit={createStudent} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Full name</span>
              <input
                required
                value={studentDraft.name}
                onChange={(event) => setStudentDraft((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Email</span>
              <input
                required
                type="email"
                value={studentDraft.email}
                onChange={(event) => setStudentDraft((current) => ({ ...current, email: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Department</span>
              <select
                value={studentDraft.departmentCode}
                onChange={(event) => setStudentDraft((current) => ({ ...current, departmentCode: event.target.value }))}
                disabled={user.role === 'staff'}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100"
              >
                {data.departments.map((department) => (
                  <option key={department.code} value={department.code}>
                    {department.code}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Year</span>
              <select
                value={studentDraft.year}
                onChange={(event) => setStudentDraft((current) => ({ ...current, year: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option>1st Year</option>
                <option>2nd Year</option>
                <option>3rd Year</option>
                <option>4th Year</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>CGPA</span>
              <input
                required
                type="number"
                min="0"
                max="10"
                step="0.1"
                value={studentDraft.cgpa}
                onChange={(event) => setStudentDraft((current) => ({ ...current, cgpa: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Attendance %</span>
              <input
                required
                type="number"
                min="0"
                max="100"
                value={studentDraft.attendance}
                onChange={(event) => setStudentDraft((current) => ({ ...current, attendance: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Phone</span>
              <input
                value={studentDraft.phone}
                onChange={(event) => setStudentDraft((current) => ({ ...current, phone: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Fee status</span>
              <select
                value={studentDraft.feeStatus}
                onChange={(event) => setStudentDraft((current) => ({ ...current, feeStatus: event.target.value as FeeStatus }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Skills</span>
              <input
                value={studentDraft.skills}
                onChange={(event) => setStudentDraft((current) => ({ ...current, skills: event.target.value }))}
                placeholder="React, SQL, Communication"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Save student
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          open={showDepartmentModal}
          title="Add department"
          description="Add an academic department to broaden the campus management story in demos."
          onClose={() => {
            setShowDepartmentModal(false);
            setDepartmentDraft(createDepartmentDraft());
          }}
        >
          <form onSubmit={createDepartment} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Department name</span>
              <input
                required
                value={departmentDraft.name}
                onChange={(event) => setDepartmentDraft((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Code</span>
              <input
                required
                value={departmentDraft.code}
                onChange={(event) => setDepartmentDraft((current) => ({ ...current, code: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 uppercase outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>HOD</span>
              <input
                required
                value={departmentDraft.hod}
                onChange={(event) => setDepartmentDraft((current) => ({ ...current, hod: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Staff count</span>
              <input
                required
                type="number"
                value={departmentDraft.staffCount}
                onChange={(event) => setDepartmentDraft((current) => ({ ...current, staffCount: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Intake</span>
              <input
                required
                type="number"
                value={departmentDraft.intake}
                onChange={(event) => setDepartmentDraft((current) => ({ ...current, intake: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Save department
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          open={showCompanyModal}
          title="Add company drive"
          description="Create a new placement or internship drive so the placement module stays convincing."
          onClose={() => {
            setShowCompanyModal(false);
            setCompanyDraft(createCompanyDraft());
          }}
        >
          <form onSubmit={createCompany} className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Company name</span>
              <input
                required
                value={companyDraft.name}
                onChange={(event) => setCompanyDraft((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Role</span>
              <input
                required
                value={companyDraft.role}
                onChange={(event) => setCompanyDraft((current) => ({ ...current, role: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Package</span>
              <input
                required
                value={companyDraft.packageOffered}
                onChange={(event) => setCompanyDraft((current) => ({ ...current, packageOffered: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Drive date</span>
              <input
                required
                type="date"
                value={companyDraft.driveDate}
                onChange={(event) => setCompanyDraft((current) => ({ ...current, driveDate: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Status</span>
              <select
                value={companyDraft.status}
                onChange={(event) => setCompanyDraft((current) => ({ ...current, status: event.target.value as CompanyStatus }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Open">Open</option>
                <option value="Closing Soon">Closing Soon</option>
                <option value="Closed">Closed</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Location</span>
              <input
                required
                value={companyDraft.location}
                onChange={(event) => setCompanyDraft((current) => ({ ...current, location: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Type</span>
              <select
                value={companyDraft.type}
                onChange={(event) => setCompanyDraft((current) => ({ ...current, type: event.target.value as CompanyType }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="Placement">Placement</option>
                <option value="Internship">Internship</option>
              </select>
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
              <span>Eligible departments</span>
              <input
                required
                value={companyDraft.eligibleDepartments}
                onChange={(event) => setCompanyDraft((current) => ({ ...current, eligibleDepartments: event.target.value }))}
                placeholder="CSE, ECE"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <div className="md:col-span-2">
              <button
                type="submit"
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Save company drive
              </button>
            </div>
          </form>
        </Modal>

        <Modal
          open={showAnnouncementModal}
          title="Add announcement"
          description="Publish a new announcement to keep the demo dashboard feeling active and realistic."
          onClose={() => {
            setShowAnnouncementModal(false);
            setAnnouncementDraft(createAnnouncementDraft());
          }}
        >
          <form onSubmit={createAnnouncement} className="grid gap-4">
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Title</span>
              <input
                required
                value={announcementDraft.title}
                onChange={(event) => setAnnouncementDraft((current) => ({ ...current, title: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <label className="space-y-2 text-sm font-medium text-slate-700">
              <span>Summary</span>
              <textarea
                required
                rows={4}
                value={announcementDraft.summary}
                onChange={(event) => setAnnouncementDraft((current) => ({ ...current, summary: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              />
            </label>
            <div className="grid gap-4 md:grid-cols-3">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Audience</span>
                <select
                  value={announcementDraft.audience}
                  onChange={(event) => setAnnouncementDraft((current) => ({ ...current, audience: event.target.value as AnnouncementAudience }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="All">All</option>
                  <option value="Students">Students</option>
                  <option value="Staff">Staff</option>
                  <option value="Admin">Admin</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Priority</span>
                <select
                  value={announcementDraft.priority}
                  onChange={(event) => setAnnouncementDraft((current) => ({ ...current, priority: event.target.value as AnnouncementPriority }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </label>
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Category</span>
                <input
                  required
                  value={announcementDraft.category}
                  onChange={(event) => setAnnouncementDraft((current) => ({ ...current, category: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </label>
            </div>
            <div>
              <button
                type="submit"
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Save announcement
              </button>
            </div>
          </form>
        </Modal>
      </>
    </>
  );
}
