import { useState } from 'react';
import { Plus, Search, Pin, PinOff, X, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Note } from '../types';

const COLORS = ['#6366f1', '#ec4899', '#f97316', '#22c55e', '#06b6d4', '#eab308', '#8b5cf6', '#ef4444'];

const NotesPage = () => {
    const { notes, subjects, addNote, updateNote, deleteNote, translate } = useApp();
    const [search, setSearch] = useState('');
    const [editing, setEditing] = useState<Note | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [color, setColor] = useState(COLORS[0]);
    const [subjectId, setSubjectId] = useState('');

    const filtered = notes
        .filter(n => !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return b.updatedAt.localeCompare(a.updatedAt);
        });

    const startEdit = (n: Note) => {
        setEditing(n);
        setTitle(n.title);
        setContent(n.content);
        setColor(n.color);
        setSubjectId(n.subjectId || '');
        setIsCreating(true);
    };

    const startNew = () => {
        setEditing(null);
        setTitle('');
        setContent('');
        setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
        setSubjectId('');
        setIsCreating(true);
    };

    const handleSave = () => {
        if (!title) return;
        const now = new Date().toISOString();
        if (editing) {
            updateNote({ ...editing, title, content, color, subjectId: subjectId || undefined, updatedAt: now });
        } else {
            addNote({ id: Date.now().toString(), title, content, color, subjectId: subjectId || undefined, createdAt: now, updatedAt: now });
        }
        setIsCreating(false);
    };

    return (
        <div className="p-6 h-full overflow-y-auto mesh-bg">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex-1">{translate('notes_title')}</h1>
                <div className="relative flex-1 min-w-[200px] max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary-500 dark:text-white transition-all"
                        placeholder={translate('note_search')}
                    />
                </div>
                <button
                    onClick={startNew}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gray-900 to-gray-800 dark:from-white dark:to-gray-200 text-white dark:text-gray-900 rounded-full text-xs font-bold shadow-lg hover:scale-105 transition-all duration-200"
                >
                    <Plus className="w-4 h-4" /> {translate('add_note')}
                </button>
            </div>

            {/* Notes Grid */}
            {filtered.length === 0 ? (
                <div className="text-center py-20">
                    <FileText className="w-16 h-16 mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                    <p className="text-gray-400">{translate('notes_empty')}</p>
                </div>
            ) : (
                <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
                    {filtered.map(note => {
                        const sub = subjects.find(s => s.id === note.subjectId);
                        return (
                            <div
                                key={note.id}
                                onClick={() => startEdit(note)}
                                className="break-inside-avoid bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm border border-gray-100 dark:border-gray-700 cursor-pointer hover:shadow-lg transition-all duration-300 group hover:-translate-y-0.5 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-1 opacity-80" style={{ backgroundColor: note.color }} />
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-1">{note.title}</h3>
                                    {note.pinned && <Pin className="w-3.5 h-3.5 text-primary-500 shrink-0 rotate-45" />}
                                </div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-4 whitespace-pre-wrap mb-3">{note.content}</p>
                                <div className="flex items-center justify-between">
                                    {sub && (
                                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white" style={{ backgroundColor: sub.color }}>
                                            {sub.name}
                                        </span>
                                    )}
                                    <span className="text-[10px] text-gray-400">{new Date(note.updatedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Note Editor Modal */}
            {isCreating && (
                <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
                    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scaleIn border border-gray-100 dark:border-gray-700">
                        <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
                            <h3 className="font-bold text-lg text-gray-900 dark:text-white">{editing ? translate('edit') : translate('add_note')}</h3>
                            <div className="flex items-center gap-2">
                                {editing && (
                                    <>
                                        <button
                                            onClick={() => { updateNote({ ...editing, pinned: !editing.pinned, updatedAt: new Date().toISOString() }); setIsCreating(false); }}
                                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-500 transition-colors"
                                        >
                                            {editing.pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => { deleteNote(editing.id); setIsCreating(false); }}
                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg text-red-500 transition-colors"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </>
                                )}
                                <button onClick={() => setIsCreating(false)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full text-gray-500 transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <div className="p-6 space-y-4">
                            <input
                                autoFocus
                                className="w-full text-xl font-bold bg-transparent border-none outline-none placeholder-gray-300 dark:placeholder-gray-600 dark:text-white"
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                placeholder={translate('note_title')}
                            />
                            <textarea
                                className="w-full bg-transparent border-none outline-none text-gray-600 dark:text-gray-300 min-h-[200px] resize-none placeholder-gray-300 dark:placeholder-gray-600"
                                value={content}
                                onChange={e => setContent(e.target.value)}
                                placeholder={translate('note_content')}
                            />
                            <div className="flex items-center gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex gap-1.5">
                                    {COLORS.map(c => (
                                        <button
                                            key={c}
                                            onClick={() => setColor(c)}
                                            className={`w-6 h-6 rounded-full transition-all ${color === c ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : 'hover:scale-110'}`}
                                            style={{ backgroundColor: c }}
                                        />
                                    ))}
                                </div>
                                <select
                                    value={subjectId}
                                    onChange={e => setSubjectId(e.target.value)}
                                    className="ml-auto text-xs bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 outline-none dark:text-white"
                                >
                                    <option value="">{translate('select_subject_placeholder')}</option>
                                    {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                </select>
                            </div>
                            <button
                                onClick={handleSave}
                                disabled={!title}
                                className="w-full py-3 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-bold shadow-lg shadow-primary-500/20 disabled:opacity-50 transition-all duration-200 active:scale-[0.98]"
                            >
                                {translate('save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotesPage;
