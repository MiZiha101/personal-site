import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { defaultData } from '../data/defaults';
import type { Post, Profile, Project, SiteData, SkillGroup } from '../types';

const STORAGE_KEY = 'personal-site-data-v1';

export type SaveState = 'idle' | 'saved' | 'error';

type SiteDataContextValue = {
  data: SiteData;
  editing: boolean;
  setEditing: (value: boolean) => void;
  saveState: SaveState;
  customized: boolean;
  updateProfile: (patch: Partial<Profile>) => void;
  setSkillGroups: (groups: SkillGroup[]) => void;
  setProjects: (list: Project[]) => void;
  setPosts: (list: Post[]) => void;
  resetData: () => void;
  replaceData: (next: SiteData) => void;
  exportData: () => void;
  importData: (file: File) => Promise<{ ok: boolean; message: string }>;
};

const SiteDataContext = createContext<SiteDataContextValue | null>(null);

function loadData(): SiteData {
  if (typeof localStorage === 'undefined') return defaultData;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw) as Partial<SiteData>;
    return {
      profile: { ...defaultData.profile, ...(parsed.profile ?? {}) },
      skillGroups: Array.isArray(parsed.skillGroups) ? parsed.skillGroups : defaultData.skillGroups,
      projects: Array.isArray(parsed.projects) ? parsed.projects : defaultData.projects,
      posts: Array.isArray(parsed.posts) ? parsed.posts : defaultData.posts,
    };
  } catch {
    return defaultData;
  }
}

function hasSavedData(): boolean {
  if (typeof localStorage === 'undefined') return false;
  try {
    return Boolean(localStorage.getItem(STORAGE_KEY));
  } catch {
    return false;
  }
}

export function SiteDataProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData>(() => loadData());
  const [editing, setEditing] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [customized, setCustomized] = useState<boolean>(() => hasSavedData());
  const timer = useRef<number | null>(null);
  // 初始数据（默认值或上次保存的值）：只有真正改动后才写盘，
  // 避免只是访问一次页面就被标记成「已修改」。
  const pristineRef = useRef<SiteData | null>(null);
  const skipSaveRef = useRef(false);

  useEffect(() => {
    if (pristineRef.current === null) {
      pristineRef.current = data;
      return;
    }
    if (data === pristineRef.current) return;
    if (skipSaveRef.current) {
      skipSaveRef.current = false;
      pristineRef.current = data;
      return;
    }
    if (typeof localStorage === 'undefined') return;

    // 每次数据变化后延迟写入 localStorage，避免连续输入时频繁写盘
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        setSaveState('saved');
        setCustomized(true);
      } catch {
        setSaveState('error');
      }
    }, 300);

    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [data]);

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, ...patch } }));
  }, []);

  const setSkillGroups = useCallback((groups: SkillGroup[]) => {
    setData((prev) => ({ ...prev, skillGroups: groups }));
  }, []);

  const setProjects = useCallback((list: Project[]) => {
    setData((prev) => ({ ...prev, projects: list }));
  }, []);

  const setPosts = useCallback((list: Post[]) => {
    setData((prev) => ({ ...prev, posts: list }));
  }, []);

  const resetData = useCallback(() => {
    skipSaveRef.current = true;
    setData(defaultData);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* 忽略：隐私模式下可能不可用 */
    }
    setCustomized(false);
    setSaveState('idle');
  }, []);

  const replaceData = useCallback((next: SiteData) => {
    setData({
      profile: { ...defaultData.profile, ...next.profile },
      skillGroups: Array.isArray(next.skillGroups) ? next.skillGroups : defaultData.skillGroups,
      projects: Array.isArray(next.projects) ? next.projects : defaultData.projects,
      posts: Array.isArray(next.posts) ? next.posts : defaultData.posts,
    });
  }, []);

  const exportData = useCallback(() => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'personal-site-data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, [data]);

  const importData = useCallback(
    async (file: File) => {
      try {
        const text = await file.text();
        const parsed = JSON.parse(text) as SiteData;
        if (!parsed || typeof parsed !== 'object' || !parsed.profile) {
          return { ok: false, message: '文件里没有找到 profile 字段，可能不是本站导出的数据。' };
        }
        replaceData(parsed);
        return { ok: true, message: '数据已导入，页面内容已更新。' };
      } catch {
        return { ok: false, message: '解析失败：请选择本站导出的 JSON 文件。' };
      }
    },
    [replaceData],
  );

  const value = useMemo<SiteDataContextValue>(
    () => ({
      data,
      editing,
      setEditing,
      saveState,
      customized,
      updateProfile,
      setSkillGroups,
      setProjects,
      setPosts,
      resetData,
      replaceData,
      exportData,
      importData,
    }),
    [
      data,
      editing,
      saveState,
      customized,
      updateProfile,
      setSkillGroups,
      setProjects,
      setPosts,
      resetData,
      replaceData,
      exportData,
      importData,
    ],
  );

  return <SiteDataContext.Provider value={value}>{children}</SiteDataContext.Provider>;
}

export function useSiteData(): SiteDataContextValue {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error('useSiteData 必须在 <SiteDataProvider> 内使用');
  }
  return context;
}
