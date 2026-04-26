import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, DollarSign, Calendar } from 'lucide-react';

interface FeeStructure {
  id: number;
  academicYear: string;
  course: string;
  semester: number;
  tuitionFee: number;
  labFee: number;
  libraryFee: number;
  examFee: number;
  totalFee: number;
  dueDate: string;
}

export const FeesModule: React.FC = () => {
  const [fees, setFees] = useState<FeeStructure[]>([
    {
      id: 1,
      academicYear: '2025-2026',
      course: 'B.TECH CSE',
      semester: 5,
      tuitionFee: 80000,
      labFee: 5000,
      libraryFee: 2000,
      examFee: 1000,
      totalFee: 88000,
      dueDate: '2026-06-15',
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    academicYear: '',
    course: '',
    semester: 1,
    tuitionFee: 0,
    labFee: 0,
    libraryFee: 0,
    examFee: 0,
    dueDate: '',
  });

  const filteredFees = fees.filter(
    (fee) =>
      fee.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fee.academicYear.includes(searchTerm)
  );

  const handleAddFee = () => {
    if (formData.academicYear && formData.course) {
      const totalFee = formData.tuitionFee + formData.labFee + formData.libraryFee + formData.examFee;
      setFees([
        ...fees,
        {
          id: fees.length + 1,
          ...formData,
          totalFee,
        },
      ]);
      setFormData({ academicYear: '', course: '', semester: 1, tuitionFee: 0, labFee: 0, libraryFee: 0, examFee: 0, dueDate: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Fees Management</h2>
          <p className="mt-1 text-sm text-slate-600">Manage fee structures and payments</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={18} /> Add Fee Structure
        </button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search by course or year..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Add Fee Structure</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Academic Year (e.g., 2025-2026)"
              value={formData.academicYear}
              onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Course"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={formData.semester}
              onChange={(e) => setFormData({ ...formData, semester: parseInt(e.target.value) })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                <option key={sem} value={sem}>
                  Semester {sem}
                </option>
              ))}
            </select>
            <input
              type="date"
              placeholder="Due Date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Tuition Fee"
              value={formData.tuitionFee}
              onChange={(e) => setFormData({ ...formData, tuitionFee: parseInt(e.target.value) })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Lab Fee"
              value={formData.labFee}
              onChange={(e) => setFormData({ ...formData, labFee: parseInt(e.target.value) })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Library Fee"
              value={formData.libraryFee}
              onChange={(e) => setFormData({ ...formData, libraryFee: parseInt(e.target.value) })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Exam Fee"
              value={formData.examFee}
              onChange={(e) => setFormData({ ...formData, examFee: parseInt(e.target.value) })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAddFee} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Save
            </button>
            <button onClick={() => setShowForm(false)} className="bg-slate-300 text-slate-900 px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Academic Year</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Course</th>
              <th className="px-4 py-3 text-center font-semibold text-slate-900">Semester</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Tuition</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Lab</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Library</th>
              <th className="px-4 py-3 text-right font-semibold text-slate-900">Total</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Due Date</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredFees.map((fee) => (
              <tr key={fee.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-900">{fee.academicYear}</td>
                <td className="px-4 py-3 text-slate-600">{fee.course}</td>
                <td className="px-4 py-3 text-center text-slate-600">{fee.semester}</td>
                <td className="px-4 py-3 text-right text-slate-600">₹{fee.tuitionFee.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-slate-600">₹{fee.labFee.toLocaleString()}</td>
                <td className="px-4 py-3 text-right text-slate-600">₹{fee.libraryFee.toLocaleString()}</td>
                <td className="px-4 py-3 text-right font-semibold text-slate-900">₹{fee.totalFee.toLocaleString()}</td>
                <td className="px-4 py-3 text-slate-600 flex items-center gap-1">
                  <Calendar size={14} /> {fee.dueDate}
                </td>
                <td className="px-4 py-3 space-x-2">
                  <button className="text-blue-600 hover:text-blue-700">
                    <Edit2 size={16} />
                  </button>
                  <button className="text-red-600 hover:text-red-700">
                    <Trash2 size={16} />
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
