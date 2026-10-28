import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';

export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 720);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="回到顶部"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 left-6 z-30 inline-flex h-10 w-10 items-center justify-center rounded-full border bg-surface transition-all duration-300"
      style={{
        borderColor: 'var(--line-strong)',
        color: 'var(--ink-soft)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(10px)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <ArrowUp size={16} />
    </button>
  );
}
