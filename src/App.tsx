/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  UserCircle, 
  LogOut, 
  PlusCircle, 
  FileText, 
  BarChart3, 
  Bell,
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  ChevronRight,
  Building2,
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Role, Job, Student, Application } from './types';

// Components
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TPODashboard from './components/TPODashboard';
import RecruiterDashboard from './components/RecruiterDashboard';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(false);

  // Check for saved user
  useEffect(() => {
    const savedUser = localStorage.getItem('falcon_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData: User) => {
    setUser(userData);
    localStorage.setItem('falcon_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('falcon_user');
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (user.role) {
      case 'student':
        return <StudentDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'admin':
        return <AdminDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'tpo':
        return <TPODashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'recruiter':
        return <RecruiterDashboard user={user} activeTab={activeTab} setActiveTab={setActiveTab} />;
      default:
        return <div>Invalid Role</div>;
    }
  };

  const navItems = {
    student: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'jobs', label: 'Available Jobs', icon: Briefcase },
      { id: 'applications', label: 'My Applications', icon: FileText },
      { id: 'mock-tests', label: 'Mock Tests', icon: GraduationCap },
      { id: 'profile', label: 'My Profile', icon: UserCircle },
    ],
    tpo: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'jobs', label: 'Placements', icon: Briefcase },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
    admin: [
      { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
      { id: 'students', label: 'Students', icon: Users },
      { id: 'jobs', label: 'Jobs Posted', icon: Briefcase },
      { id: 'applications', label: 'Applicant List', icon: FileText },
      { id: 'mock-tests', label: 'Mock Tests', icon: GraduationCap },
      { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    ],
    recruiter: [
      { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { id: 'post-job', label: 'Post a Job', icon: PlusCircle },
      { id: 'applicants', label: 'Applicants', icon: Users },
    ]
  };

  const currentNav = navItems[user.role as keyof typeof navItems] || [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col fixed h-full">
        <div className="p-6 border-b border-slate-100 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
            <Briefcase size={24} />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-tight">AlphaGrew AI</h1>
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Placement System</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {currentNav.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <div className="bg-slate-50 rounded-2xl p-4 mb-4">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize">{user.role}</p>
              </div>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-slate-500">Welcome back, {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all w-64"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
