import { Pencil } from 'lucide-react';
import { useSiteData } from '../store/siteData';

/** 仅在已解锁（本人）时出现的浮动编辑按钮，访客看不到 */
export function EditFab() {
  const { editing, unlocked, requestEdit } = useSiteData();

  if (editing || !unlocked) return null;

  return (
    <button
      type="button"
      onClick={requestEdit}
      className="fixed bottom-6 right-6 z-30 inline-flex items-center gap-2 rounded-full px-5 py-3 text-[13px] font-medium text-white shadow-lift transition-transform duration-200 hover:-translate-y-0.5 md:hidden"
      style={{ background: 'var(--accent)' }}
    >
      <Pencil size={14} />
      编辑
    </button>
  );
}
