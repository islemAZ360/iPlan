import { Subject } from '../types';

interface SubjectChipProps {
    subject: Subject;
    onClick?: () => void;
    selected?: boolean;
}

const SubjectChip = ({ subject, onClick, selected }: SubjectChipProps) => (
    <button
        onClick={onClick}
        className={`px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm transition-all duration-200 flex items-center gap-2 border hover:shadow-md active:scale-95 hover:-translate-y-0.5 ${selected ? 'ring-2 ring-offset-1 ring-primary-500 scale-105' : 'hover:opacity-90'
            }`}
        style={{
            backgroundColor: subject.color,
            color: '#fff',
            borderColor: 'transparent',
            boxShadow: `0 2px 8px ${subject.color}40`,
        }}
    >
        {subject.name}
    </button>
);

export default SubjectChip;
