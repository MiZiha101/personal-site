import { useEffect } from 'react';
import { useSiteData } from '../store/siteData';

/**
 * 站点主人的隐藏入口（访客看不出来，也没有任何按钮提示）：
 *   1. 键盘快捷键：Ctrl / Cmd + Shift + E
 *   2. 地址栏加 #edit，例如 https://你的域名/#edit
 *   3. 手机上把 #edit 那个链接存成书签即可
 * 一旦解锁过（sessionStorage），页面才会出现「编辑资料」按钮。
 */
export function useOwnerEntry(): void {
  const { requestEdit } = useSiteData();

  useEffect(() => {
    const fromHash = () => {
      if (window.location.hash.toLowerCase() === '#edit') requestEdit();
    };

    const onKeyDown = (event: KeyboardEvent) => {
      const withModifier = event.ctrlKey || event.metaKey;
      if (withModifier && event.shiftKey && event.key.toLowerCase() === 'e') {
        event.preventDefault();
        requestEdit();
      }
    };

    fromHash();
    window.addEventListener('hashchange', fromHash);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('hashchange', fromHash);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [requestEdit]);
}
