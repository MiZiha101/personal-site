import { useCallback, useEffect, useRef, useState } from 'react';

/** 复制文本并给出 1.8 秒的「已复制」反馈；不支持 Clipboard API 时退化为 textarea + execCommand。 */
export function useCopy(text: string, resetMs = 1800) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(async () => {
    const fallback = () => {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      document.body.removeChild(area);
    };

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        fallback();
      }
      setCopied(true);
    } catch {
      try {
        fallback();
        setCopied(true);
      } catch {
        setCopied(false);
      }
    }

    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), resetMs);
  }, [text, resetMs]);

  return { copied, copy };
}
