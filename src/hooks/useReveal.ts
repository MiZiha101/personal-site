import { useEffect } from 'react';

/**
 * 给所有 .reveal 元素加滚动进入视口的淡入效果。
 * key 变化时会重新扫描（编辑面板新增条目后也能正常显示）。
 */
export function useReveal(key?: string): void {
  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

    if (typeof IntersectionObserver === 'undefined') {
      elements.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.08 },
    );

    elements.forEach((el) => {
      if (el.classList.contains('is-visible')) return;
      // 已经在视口里的元素直接显示，避免新插入内容长时间空白
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
        return;
      }
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [key]);
}
