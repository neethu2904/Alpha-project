import React, { useState } from 'react';
import { Search, Edit2, Upload, Download } from 'lucide-react';

interface StudentMarks {
  id: number;
  student: string;
  rollNo: string;
  subject: string;
  exam: string;
  marksObtained: number;
  totalMarks: number;
  percentage: number;
  grade: string;
}

export const MarksModule: React.FC = () => {
  const [marks, setMarks] = useState<StudentMarks[]>([
    {
      id: 1,
      student: 'Amit Kumar',
      rollNo: '21CS001',
      subject: 'Database Management',
      exam: 'Mid Semester - 1',
      marksObtained: 42,
      totalMarks: 50,
      percentage: 84,
      grade: 'A',
    },
    {
      id: 2,
      student: 'Priya Sharma',
      rollNo: '21CS002',
      subject: 'Database Management',
      exam: 'Mid Semester - 1',
      marksObtained: 48,
      totalMarks: 50,
      percentage: 96,
      grade: 'A+',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');

  const filteredMarks = marks.filter(
    (m) =>
      (m.student.toLowerCase().includes(searchTerm.toLowerCase()) || m.rollNo.includes(searchTerm)) &&
      (!filterSubject || m.subject === filterSubject)
  );

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  const subjects = [...new Set(marks.map((m) => m.subject))];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Marks & Grades</h2>
          <p className="mt-1 text-sm text-slate-600">Manage and track student marks</p>
        </div>
        <div className="flex gap-2">
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-slate-700 hover:bg-slate-50">
            <Upload size={18} /> Upload Marks
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
            <Download size={18} /> Export
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Subjects</option>
            {subjects.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Student</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Roll No.</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Subject</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Exam</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Marks</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">%</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-900">Grade</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredMarks.map((mark) => (
              <tr key={mark.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{mark.student}</td>
                <td className="px-4 py-3 text-slate-600">{mark.rollNo}</td>
                <td className="px-4 py-3 text-slate-600">{mark.subject}</td>
                <td className="px-4 py-3 text-slate-600">{mark.exam}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">
                  {mark.marksObtained}/{mark.totalMarks}
                </td>
                <td className="px-4 py-3 text-right text-slate-900">{mark.percentage}%</td>
                <td className="px-4 py-3 text-center">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-bold ${getGradeColor(mark.grade)}`}>
                    {mark.grade}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button className="text-blue-600 hover:text-blue-700">
                    <Edit2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
