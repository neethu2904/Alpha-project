import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Users } from 'lucide-react';

interface Class {
  id: number;
  name: string;
  course: string;
  batch: string;
  semester: number;
  faculty: string;
  strength: number;
  room: string;
  status: 'active' | 'inactive';
}

export const ClassesModule: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([
    {
      id: 1,
      name: 'CSE-5A',
      course: 'B.TECH',
      batch: '2021-2025',
      semester: 5,
      faculty: 'Dr. Rajesh Kumar',
      strength: 65,
      room: 'Block-A, Room-501',
      status: 'active',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', course: '', batch: '', semester: 1, faculty: '', strength: 60, room: '' });

  const filteredClasses = classes.filter((c) => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleAddClass = () => {
    if (formData.name) {
      setClasses([
        ...classes,
        {
          id: classes.length + 1,
          ...formData,
          status: 'active',
        },
      ]);
      setFormData({ name: '', course: '', batch: '', semester: 1, faculty: '', strength: 60, room: '' });
      setShowForm(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Classes Management</h2>
          <p className="mt-1 text-sm text-slate-600">Manage class batches and groups</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={18} /> Add Class
        </button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search classes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Add New Class</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Class Name (e.g., CSE-5A)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Course"
              value={formData.course}
              onChange={(e) => setFormData({ ...formData, course: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Batch (e.g., 2021-2025)"
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
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
              type="text"
              placeholder="Faculty Advisor"
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              placeholder="Strength"
              value={formData.strength}
              onChange={(e) => setFormData({ ...formData, strength: parseInt(e.target.value) })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Room/Block"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="px-3 py-2 col-span-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAddClass} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
              Save
            </button>
            <button onClick={() => setShowForm(false)} className="bg-slate-300 text-slate-900 px-4 py-2 rounded-lg">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClasses.map((cls) => (
          <div key={cls.id} className="bg-white p-4 rounded-lg border border-slate-200 hover:shadow-lg transition">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">{cls.name}</h3>
                <p className="text-sm text-slate-600 mt-1">{cls.course} | Sem {cls.semester}</p>
                <p className="text-sm text-slate-600">Batch: {cls.batch}</p>
                <p className="text-sm text-slate-600">{cls.room}</p>
              </div>
              <span className="inline-flex px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
                {cls.status}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
              <Users size={14} />
              <span>
                <strong>{cls.strength}</strong> Students
              </span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 text-blue-600 hover:text-blue-700 px-2 py-2 border border-blue-200 rounded hover:bg-blue-50">
                <Edit2 size={16} className="mx-auto" />
              </button>
              <button className="flex-1 text-red-600 hover:text-red-700 px-2 py-2 border border-red-200 rounded hover:bg-red-50">
                <Trash2 size={16} className="mx-auto" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
