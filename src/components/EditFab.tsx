import { Pencil } from 'lucide-react';
import { useSiteData } from '../store/siteData';

export function EditFab() {
  const { editing, setEditing } = useSiteData();

  if (editing) return null;

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium text-white shadow-lift transition-transform duration-200 hover:-translate-y-0.5 md:hidden"
      style={{ background: 'var(--accent)' }}
    >
      <Pencil size={14} />
      编辑资料
    </button>
  );
}
