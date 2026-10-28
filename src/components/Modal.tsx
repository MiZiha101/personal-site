import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  meta?: ReactNode;
  children: ReactNode;
};

/** 通用弹层：ESC / 点遮罩关闭，打开时锁滚动 */
export function Modal({ open, onClose, title, meta, children }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto p-4 py-10 md:py-16"
      style={{ background: 'rgba(27, 26, 23, 0.32)', backdropFilter: 'blur(5px)' }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-[24px] border bg-surface p-6 shadow-lift md:p-9"
        style={{ borderColor: 'var(--line)' }}
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭"
          className="absolute right-5 top-5 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-colors"
          style={{ borderColor: 'var(--line)', color: 'var(--muted)', background: 'var(--surface)' }}
        >
          <X size={15} />
        </button>

        <h3 className="display pr-12 text-2xl leading-snug">{title}</h3>
        {meta ? <div className="mt-3">{meta}</div> : null}
        <div className="mt-5">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
