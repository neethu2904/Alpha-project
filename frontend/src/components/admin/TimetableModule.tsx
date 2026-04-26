import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Clock } from 'lucide-react';

interface TimeSlot {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  subject: string;
  faculty: string;
  room: string;
  batch: string;
}

export const TimetableModule: React.FC = () => {
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    {
      id: 1,
      day: 'Monday',
      startTime: '09:00',
      endTime: '10:30',
      subject: 'Database Management',
      faculty: 'Dr. Rajesh Kumar',
      room: 'Lab-101',
      batch: 'CSE-5A',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    day: 'Monday',
    startTime: '',
    endTime: '',
    subject: '',
    faculty: '',
    room: '',
    batch: '',
  });

  const filteredSlots = timeSlots.filter((slot) =>
    slot.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    slot.batch.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddSlot = () => {
    if (formData.startTime && formData.subject) {
      setTimeSlots([
        ...timeSlots,
        {
          id: timeSlots.length + 1,
          ...formData,
        },
      ]);
      setFormData({ day: 'Monday', startTime: '', endTime: '', subject: '', faculty: '', room: '', batch: '' });
      setShowForm(false);
    }
  };

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Timetable Management</h2>
          <p className="mt-1 text-sm text-slate-600">Manage class schedules and time slots</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus size={18} /> Add Time Slot
        </button>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Search by subject or batch..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-semibold mb-4">Add New Time Slot</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {days.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <input
              type="time"
              value={formData.startTime}
              onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              value={formData.endTime}
              onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Subject"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Faculty"
              value={formData.faculty}
              onChange={(e) => setFormData({ ...formData, faculty: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Room/Lab"
              value={formData.room}
              onChange={(e) => setFormData({ ...formData, room: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Batch"
              value={formData.batch}
              onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={handleAddSlot} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Day</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Time</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Subject</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Faculty</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Room</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Batch</th>
              <th className="px-4 py-3 text-left font-semibold text-slate-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredSlots.map((slot) => (
              <tr key={slot.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 text-slate-900">{slot.day}</td>
                <td className="px-4 py-3 text-slate-600 flex items-center gap-1">
                  <Clock size={14} /> {slot.startTime} - {slot.endTime}
                </td>
                <td className="px-4 py-3 text-slate-900 font-medium">{slot.subject}</td>
                <td className="px-4 py-3 text-slate-600">{slot.faculty}</td>
                <td className="px-4 py-3 text-slate-600">{slot.room}</td>
                <td className="px-4 py-3 text-slate-600">{slot.batch}</td>
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
