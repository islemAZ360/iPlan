import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BookOpen, CheckCircle, PieChart, Settings, Moon, Sun, Plus, AlertCircle, Calendar as CalendarIcon, Menu, X, GripVertical, ChevronLeft, ChevronRight, Clock, Trash2, LogOut } from 'lucide-react';
import { AppState, Language, Subject, Task, Theme, UserProfile } from './types';
import { loadState, saveState } from './services/storage';
import { getTranslation } from './services/i18n';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, Cell, PieChart as RePieChart, Pie } from 'recharts';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth } from './firebase';
import LoginPage from './LoginPage';

// --- Context ---
interface AppContextType extends AppState {
  setLanguage: (lang: Language) => void;
  setTheme: (theme: Theme) => void;
  addSubject: (subject: Subject) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;
  addTask: (task: Task) => void;
  updateTask: (task: Task) => void;
  deleteTask: (id: string) => void;
  updateUser: (user: Partial<UserProfile>) => void;
  translate: (key: any) => string;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};

// --- Helper Components ---

// Shared Task Modal for Add and Edit
const TaskFormModal = ({
  isOpen,
  onClose,
  task,
  subjects,
  onSave,
  onDelete,
  translate
}: {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  subjects: Subject[];
  onSave: (taskData: Partial<Task>) => void;
  onDelete?: (id: string) => void;
  translate: (key: string) => string;
}) => {
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setTitle(task.title);
        setSubjectId(task.subjectId);
        setDate(task.dueDate || '');
        setDescription(task.description || '');
      } else {
        setTitle('');
        setSubjectId('');
        setDate(new Date().toISOString().split('T')[0]);
        setDescription('');
      }
    }
  }, [isOpen, task]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!title || !subjectId) return;
    onSave({
      id: task?.id,
      title,
      subjectId,
      dueDate: date,
      description,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in border border-gray-100 dark:border-gray-700">
        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white">
            {task ? translate('edit') : translate('add_task')}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('task_title')}</label>
            <input
              autoFocus
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('select_subject')}</label>
            <select
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all appearance-none"
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
            >
              <option value="">Select a subject...</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('due_date')}</label>
            <input
              type="date"
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{translate('task_desc')}</label>
            <textarea
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all min-h-[80px]"
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Additional details..."
            />
          </div>

          <div className="flex gap-3 pt-2">
            {task && onDelete && (
              <button
                onClick={() => {
                  if (window.confirm('Are you sure you want to delete this task?')) {
                    onDelete(task.id);
                    onClose();
                  }
                }}
                className="px-4 py-3.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl font-bold transition-all"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={handleSave}
              disabled={!title || !subjectId}
              className="flex-1 py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform active:scale-95"
            >
              {translate('save')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SubjectChip = ({ subject, onClick, selected }: { subject: Subject; onClick?: () => void; selected?: boolean }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all flex items-center gap-2 border hover:shadow-md active:scale-95 ${selected ? 'ring-2 ring-offset-1 ring-primary-500' : 'hover:opacity-90'
      }`}
    style={{ backgroundColor: subject.color, color: '#fff', borderColor: 'transparent' }}
  >
    {subject.name}
  </button>
);

const TaskCard = ({ task, subject, onClick, compact = false, draggable = false }: { task: Task; subject?: Subject; onClick?: () => void; compact?: boolean, draggable?: boolean }) => {
  const isDelayed = task.status === 'delayed';
  const isCompleted = task.status === 'completed';

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id);
    e.dataTransfer.effectAllowed = 'move';
    (e.target as HTMLElement).style.opacity = '0.5';
  };

  const handleDragEnd = (e: React.DragEvent) => {
    (e.target as HTMLElement).style.opacity = '1';
  };

  if (compact) {
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        draggable={draggable}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`
          group relative p-1.5 rounded-md border-l-[3px] shadow-sm cursor-pointer transition-all hover:shadow-md hover:scale-[1.02]
          ${isCompleted ? 'bg-green-50 dark:bg-green-900/20 opacity-60' : 'bg-white dark:bg-gray-800'}
          ${isDelayed ? 'bg-red-50 dark:bg-red-900/10' : ''}
          ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
        `}
        style={{ borderLeftColor: subject?.color || '#ccc' }}
      >
        <div className={`text-[11px] font-medium leading-tight break-words ${isCompleted ? 'line-through text-gray-400' : 'text-gray-800 dark:text-gray-200'}`}>
          {task.title}
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      draggable={draggable}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`
        bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-md transition-all relative group
        ${isDelayed ? 'ring-1 ring-red-100 dark:ring-red-900/30' : ''}
        ${draggable ? 'cursor-grab active:cursor-grabbing' : ''}
      `}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: subject?.color }} />
            <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500">{subject?.name}</span>
          </div>
          <h4 className={`font-medium text-sm text-gray-800 dark:text-gray-100 ${isCompleted ? 'line-through opacity-60' : ''}`}>
            {task.title}
          </h4>
        </div>
        {draggable && <GripVertical className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />}
      </div>
      {task.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">{task.description}</p>
      )}
      {isDelayed && (
        <div className="mt-2 flex items-center gap-1 text-[10px] text-red-500 font-medium">
          <Clock className="w-3 h-3" /> Delayed
        </div>
      )}
    </div>
  );
};

// --- Pages ---

const SubjectsPage = () => {
  const { subjects, tasks, addSubject, updateSubject, deleteSubject, translate } = useApp();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [tempColor, setTempColor] = useState('#6366f1');

  const handleAdd = () => {
    if (!tempName) return;
    addSubject({
      id: Date.now().toString(),
      name: tempName,
      color: tempColor
    });
    setTempName('');
  };

  const handleUpdate = () => {
    if (!editingId || !tempName) return;
    updateSubject({ id: editingId, name: tempName, color: tempColor });
    setEditingId(null);
    setTempName('');
  };

  return (
    <div className="p-6 space-y-6 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{translate('subjects_title')}</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wider">Name</label>
            <input
              type="text"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              placeholder="Mathematics..."
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 dark:text-gray-400 font-bold mb-1.5 block uppercase tracking-wider">Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={tempColor}
                onChange={(e) => setTempColor(e.target.value)}
                className="h-11 w-20 rounded-xl cursor-pointer border border-gray-200 dark:border-gray-700 p-1 bg-white dark:bg-gray-900"
              />
            </div>
          </div>
          <button
            onClick={editingId ? handleUpdate : handleAdd}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 transition-all active:scale-95"
          >
            {editingId ? translate('save') : translate('add_subject')}
          </button>
          {editingId && (
            <button
              onClick={() => { setEditingId(null); setTempName(''); }}
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              {translate('cancel')}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map(sub => {
          const taskCount = tasks.filter(t => t.subjectId === sub.id).length;
          return (
            <div key={sub.id} className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 relative group transition-all hover:shadow-md">
              <div className="flex justify-between items-start mb-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold text-white shadow-lg" style={{ backgroundColor: sub.color, boxShadow: `0 4px 12px ${sub.color}40` }}>
                  {sub.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => { setEditingId(sub.id); setTempName(sub.name); setTempColor(sub.color); }}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm('Delete subject and all associated tasks?')) {
                        deleteSubject(sub.id);
                      }
                    }}
                    className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">{sub.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{taskCount} tasks associated</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const TodayPage = () => {
  const { tasks, subjects, updateTask, deleteTask, translate } = useApp();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todaysTasks = tasks.filter(t => t.dueDate === todayStr && t.status !== 'delayed');

  const toggleComplete = (task: Task) => {
    updateTask({
      ...task,
      status: task.status === 'completed' ? 'pending' : 'completed',
      completedAt: task.status === 'completed' ? undefined : new Date().toISOString(),
    });
  };

  const handleSaveEdit = (updatedData: Partial<Task>) => {
    if (editingTask && updatedData.id) {
      updateTask({ ...editingTask, ...updatedData });
    }
    setEditingTask(null);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{translate('nav_today')}</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">{new Date().toDateString()}</p>
        </div>
        <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 shadow-inner">
          <span className="text-2xl font-bold">{todaysTasks.filter(t => t.status === 'completed').length}/{todaysTasks.length}</span>
        </div>
      </div>

      <div className="space-y-4">
        {todaysTasks.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700">
            <CheckCircle className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">No tasks scheduled for today.</p>
          </div>
        ) : (
          todaysTasks.map(task => {
            const subject = subjects.find(s => s.id === task.subjectId);
            return (
              <div
                key={task.id}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all ${task.status === 'completed'
                    ? 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800 opacity-60'
                    : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md'
                  }`}
              >
                <button
                  onClick={() => toggleComplete(task)}
                  className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0 ${task.status === 'completed'
                      ? 'bg-green-500 border-green-500 text-white scale-110'
                      : 'border-gray-300 dark:border-gray-600 hover:border-primary-500'
                    }`}
                >
                  {task.status === 'completed' && <CheckCircle className="w-5 h-5" />}
                </button>
                <div
                  className="flex-1 cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => setEditingTask(task)}
                >
                  <h3 className={`font-semibold text-gray-900 dark:text-white ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>{task.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider text-white" style={{ backgroundColor: subject?.color }}>{subject?.name}</span>
                    {task.description && <span className="text-xs text-gray-400 truncate max-w-[200px] hidden sm:inline-block">- {task.description}</span>}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <TaskFormModal
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        task={editingTask}
        subjects={subjects}
        translate={translate}
        onSave={handleSaveEdit}
        onDelete={deleteTask}
      />
    </div>
  );
};

const AchievementsPage = () => {
  const { tasks, subjects, translate } = useApp();

  const totalCompleted = tasks.filter(t => t.status === 'completed').length;
  const todayStr = new Date().toISOString().split('T')[0];
  const completedToday = tasks.filter(t => t.status === 'completed' && t.completedAt?.startsWith(todayStr)).length;

  const subjectStats = subjects.map(sub => ({
    name: sub.name,
    count: tasks.filter(t => t.subjectId === sub.id && t.status === 'completed').length,
    color: sub.color
  })).filter(s => s.count > 0);

  return (
    <div className="p-6 space-y-8 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{translate('achievements_title')}</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20">
          <p className="opacity-80 font-medium mb-1 text-sm uppercase tracking-wider">{translate('total_completed')}</p>
          <h2 className="text-5xl font-bold mt-2">{totalCompleted}</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-1 text-sm uppercase tracking-wider">{translate('completed_today')}</p>
          <h2 className="text-5xl font-bold text-gray-900 dark:text-white mt-2">{completedToday}</h2>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <p className="text-gray-500 dark:text-gray-400 font-medium mb-1 text-sm uppercase tracking-wider">{translate('streak')}</p>
          <h2 className="text-5xl font-bold text-orange-500 mt-2">3 <span className="text-2xl">🔥</span></h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-80">
          <h3 className="font-bold text-gray-800 dark:text-white mb-6">Completed by Subject</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={subjectStats}>
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 12 }} allowDecimals={false} axisLine={false} tickLine={false} />
              <RechartsTooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                cursor={{ fill: 'transparent' }}
              />
              <Bar dataKey="count" radius={[6, 6, 6, 6]} barSize={40}>
                {subjectStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 h-80">
          <h3 className="font-bold text-gray-800 dark:text-white mb-6">Distribution</h3>
          <ResponsiveContainer width="100%" height="85%">
            <RePieChart>
              <Pie
                data={subjectStats}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                stroke="none"
              >
                {subjectStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
            </RePieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => {
  const { user, updateUser, language, setLanguage, theme, setTheme, translate, logout } = useApp();

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-8 h-full overflow-y-auto">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{translate('settings_title')}</h1>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">{translate('profile')}</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">Display Name</label>
            <input
              type="text"
              value={user.name}
              onChange={(e) => updateUser({ name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none"
            />
          </div>
          <div className="pt-4">
            <button
              onClick={logout}
              className="px-6 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-xl font-bold transition-all flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              {translate('logout')}
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">Preferences</h2>

        <div className="flex items-center justify-between py-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-indigo-900/50 text-indigo-400' : 'bg-orange-100 text-orange-500'}`}>
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-medium">{translate('theme')}</span>
          </div>
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`w-14 h-8 rounded-full p-1 transition-colors duration-300 ${theme === 'dark' ? 'bg-primary-600' : 'bg-gray-200'}`}
          >
            <div className={`w-6 h-6 bg-white rounded-full shadow-sm transform transition-transform duration-300 ${theme === 'dark' ? 'translate-x-6' : 'translate-x-0'}`} />
          </button>
        </div>

        <div className="flex items-center justify-between py-4 pt-6">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-500">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-gray-700 dark:text-gray-200 font-medium">{translate('language')}</span>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value as Language)}
            className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-2 text-sm text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="en">English</option>
            <option value="ar">العربية</option>
            <option value="ru">Русский</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const HomePage = () => {
  const { tasks, subjects, addTask, updateTask, deleteTask, translate } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [draggedOverDate, setDraggedOverDate] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | 'new' | null>(null);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const todayStr = new Date().toISOString().split('T')[0];

  const days = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));

  const getTasksForDate = (dateStr: string) => tasks.filter(t => t.dueDate === dateStr && t.status !== 'delayed');
  const delayedTasks = tasks.filter(t => t.status === 'delayed');

  const handleDrop = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    setDraggedOverDate(null);
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);

    if (task) {
      const isPastDate = dateStr < todayStr;
      let newStatus = task.status;

      if (task.status !== 'completed') {
        newStatus = isPastDate ? 'delayed' : 'pending';
      }

      updateTask({
        ...task,
        dueDate: dateStr,
        status: newStatus
      });
    }
  };

  const handleDragOver = (e: React.DragEvent, dateStr: string) => {
    e.preventDefault();
    if (draggedOverDate !== dateStr) setDraggedOverDate(dateStr);
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (activeTask === 'new') {
      const initialStatus = (taskData.dueDate && taskData.dueDate < todayStr) ? 'delayed' : 'pending';
      addTask({
        id: Date.now().toString(),
        title: taskData.title!,
        subjectId: taskData.subjectId!,
        dueType: 'specific',
        dueDate: taskData.dueDate || todayStr,
        status: initialStatus,
        createdAt: new Date().toISOString(),
        description: taskData.description
      });
    } else if (activeTask && typeof activeTask === 'object') {
      updateTask({
        ...activeTask,
        ...taskData
      });
    }
    setActiveTask(null);
  };

  const nextMonth = () => setCurrentDate(new Date(year, month + 1));
  const prevMonth = () => setCurrentDate(new Date(year, month - 1));
  const goToday = () => setCurrentDate(new Date());

  return (
    <div className="flex h-full relative overflow-hidden bg-gray-50 dark:bg-gray-950">
      <div className="flex-1 p-4 lg:p-6 overflow-y-auto h-full flex flex-col">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            onClick={() => setActiveTask('new')}
            className="flex items-center gap-2 px-5 py-2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full text-xs font-bold shadow-lg shadow-gray-900/20 hover:scale-105 transition-transform"
          >
            <Plus className="w-4 h-4" /> New Task
          </button>
          <div className="h-6 w-px bg-gray-300 dark:bg-gray-700 mx-2 hidden sm:block"></div>
          {subjects.map(sub => (
            <SubjectChip key={sub.id} subject={sub} />
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-200 dark:border-gray-800 flex flex-col flex-1 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white capitalize">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2 items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
              <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm transition-all"><ChevronLeft className="w-4 h-4" /></button>
              <button onClick={goToday} className="px-4 py-1.5 text-xs font-bold text-gray-700 dark:text-gray-200 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">Today</button>
              <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300 shadow-sm transition-all"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/50">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="py-3 text-center text-[11px] font-bold text-gray-400 uppercase tracking-widest">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-fr bg-gray-100 dark:bg-gray-800 gap-px flex-1 overflow-y-auto">
            {days.map((date, idx) => {
              if (!date) return <div key={`empty-${idx}`} className="bg-white dark:bg-gray-900 min-h-[100px]" />;

              const dateStr = date.toISOString().split('T')[0];
              const dayTasks = getTasksForDate(dateStr);
              const isToday = dateStr === todayStr;
              const isDragTarget = draggedOverDate === dateStr;
              const isPast = dateStr < todayStr;

              return (
                <div
                  key={dateStr}
                  onDragOver={(e) => handleDragOver(e, dateStr)}
                  onDrop={(e) => handleDrop(e, dateStr)}
                  onDragLeave={() => setDraggedOverDate(null)}
                  className={`
                     bg-white dark:bg-gray-900 min-h-[100px] p-2 transition-colors relative flex flex-col gap-1
                     ${isDragTarget ? 'bg-primary-50 dark:bg-primary-900/20 ring-inset ring-2 ring-primary-500 z-10' : ''}
                     ${isPast ? 'bg-gray-50/30 dark:bg-gray-900' : ''}
                   `}
                >
                  <div className={`
                     text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1
                     ${isToday ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30' : 'text-gray-500 dark:text-gray-400'}
                   `}>
                    {date.getDate()}
                  </div>
                  <div className="flex-1 space-y-1.5 w-full">
                    {dayTasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        subject={subjects.find(s => s.id === task.subjectId)}
                        compact
                        draggable
                        onClick={() => setActiveTask(task)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="w-80 bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-sm uppercase tracking-wide">
            <AlertCircle className="w-4 h-4" />
            {translate('delays_title')}
          </div>
          <p className="text-xs text-gray-400 mt-1">Drag to calendar to reschedule</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30 dark:bg-black/20">
          {delayedTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center opacity-40">
              <CheckCircle className="w-12 h-12 text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-500">{translate('delays_empty')}</p>
              <p className="text-xs text-gray-400">Great job keeping up!</p>
            </div>
          ) : (
            delayedTasks.map(task => (
              <TaskCard
                key={task.id}
                task={task}
                subject={subjects.find(s => s.id === task.subjectId)}
                draggable
                onClick={() => setActiveTask(task)}
              />
            ))
          )}
        </div>
      </div>

      <TaskFormModal
        isOpen={activeTask !== null}
        onClose={() => setActiveTask(null)}
        task={activeTask === 'new' ? null : activeTask}
        subjects={subjects}
        translate={translate}
        onSave={handleSaveTask}
        onDelete={deleteTask}
      />
    </div>
  );
};

const Sidebar = () => {
  const { translate, user, logout } = useApp();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: CalendarIcon, label: 'nav_home' },
    { path: '/subjects', icon: BookOpen, label: 'nav_subjects' },
    { path: '/today', icon: LayoutDashboard, label: 'nav_today' },
    { path: '/achievements', icon: PieChart, label: 'nav_achievements' },
    { path: '/settings', icon: Settings, label: 'nav_settings' },
  ];

  return (
    <div className="w-20 lg:w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col h-full transition-all duration-300 z-30 shadow-sm">
      <div className="p-6 flex items-center justify-center lg:justify-start gap-4 h-24">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-primary-400 flex items-center justify-center shadow-lg shadow-primary-500/30">
          <CalendarIcon className="w-6 h-6 text-white" />
        </div>
        <span className="hidden lg:block font-bold text-2xl text-gray-900 dark:text-white tracking-tight">MyDates</span>
      </div>

      <nav className="flex-1 px-4 space-y-2 py-4">
        {navItems.map(item => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all group relative overflow-hidden
                ${isActive
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
                }
              `}
            >
              <item.icon className={`w-6 h-6 lg:w-5 lg:h-5 transition-transform ${isActive ? 'stroke-[2.5px] scale-110' : 'group-hover:scale-110'}`} />
              <span className="hidden lg:block font-semibold text-sm">{translate(item.label)}</span>
              {isActive && <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-l-full bg-primary-500" />}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-6 border-t border-gray-100 dark:border-gray-800 hidden lg:flex items-center gap-4 bg-gray-50/50 dark:bg-black/20">
        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-500 border-2 border-white dark:border-gray-700 shadow-md flex items-center justify-center text-white font-bold uppercase text-lg">
          {user.name.charAt(0)}
        </div>
        <div className="overflow-hidden flex-1">
          <p className="text-sm font-bold text-gray-800 dark:text-white truncate">{user.name}</p>
          <p className="text-xs text-gray-500 truncate">{user.email || 'No email'}</p>
        </div>
        <button onClick={logout} className="text-gray-400 hover:text-red-500 transition-colors">
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

const AppProvider: React.FC<{ children: ReactNode, initialUser: FirebaseUser | null }> = ({ children, initialUser }) => {
  const [state, setState] = useState<AppState>(loadState());

  useEffect(() => {
    if (initialUser) {
      setState(prev => ({
        ...prev,
        user: {
          ...prev.user,
          name: initialUser.displayName || initialUser.email?.split('@')[0] || 'User',
          email: initialUser.email || undefined,
          uid: initialUser.uid
        }
      }));
    }
  }, [initialUser]);

  useEffect(() => {
    saveState(state);
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const needsUpdate = state.tasks.some(t => t.dueDate && t.dueDate < today && t.status === 'pending');

    if (needsUpdate) {
      setState(prev => ({
        ...prev,
        tasks: prev.tasks.map(t =>
          (t.dueDate && t.dueDate < today && t.status === 'pending')
            ? { ...t, status: 'delayed' }
            : t
        )
      }));
    }
  }, []);

  const value: AppContextType = {
    ...state,
    setLanguage: (lang) => setState(prev => ({ ...prev, language: lang })),
    setTheme: (theme) => setState(prev => ({ ...prev, theme })),
    addSubject: (s) => setState(prev => ({ ...prev, subjects: [...prev.subjects, s] })),
    updateSubject: (s) => setState(prev => ({ ...prev, subjects: prev.subjects.map(sub => sub.id === s.id ? s : sub) })),
    deleteSubject: (id) => setState(prev => ({
      ...prev,
      subjects: prev.subjects.filter(s => s.id !== id),
      tasks: prev.tasks.filter(t => t.subjectId !== id)
    })),
    addTask: (t) => setState(prev => ({ ...prev, tasks: [...prev.tasks, t] })),
    updateTask: (t) => setState(prev => ({ ...prev, tasks: prev.tasks.map(task => task.id === t.id ? t : task) })),
    deleteTask: (id) => setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) })),
    updateUser: (u) => setState(prev => ({ ...prev, user: { ...prev.user, ...u } })),
    translate: (key) => getTranslation(state.language, key),
    logout: () => signOut(auth)
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  useEffect(() => setSidebarOpen(false), [location]);

  return (
    <div className="flex h-screen w-full bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-20 lg:hidden backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-40 transform lg:transform-none lg:static transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <Sidebar />
      </div>

      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-0">
        <header className="h-16 flex items-center px-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 lg:hidden justify-between">
          <div className="flex items-center">
            <button onClick={() => setSidebarOpen(true)} className="p-2 -ml-2 text-gray-600 dark:text-gray-300">
              <Menu className="w-6 h-6" />
            </button>
            <span className="ml-3 font-bold text-lg">MyDates</span>
          </div>
        </header>

        <main className="flex-1 overflow-hidden relative">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/subjects" element={<SubjectsPage />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/achievements" element={<AchievementsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-950">
        <div className="w-10 h-10 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={() => { }} />;
  }

  return (
    <AppProvider initialUser={user}>
      <HashRouter>
        <Layout />
      </HashRouter>
    </AppProvider>
  );
}