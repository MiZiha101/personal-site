import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { Eye, EyeOff, Lock, X } from 'lucide-react';
import { useSiteData } from '../../store/siteData';

const MAX_ATTEMPTS = 5;
const COOLDOWN_SECONDS = 30;

export function LoginGate() {
  const { gateOpen, closeGate, unlock } = useSiteData();
  const [code, setCode] = useState('');
  const [visible, setVisible] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => {
    if (!gateOpen) return;
    setCode('');
    setError('');
    setVisible(false);
  }, [gateOpen]);

  const locked = cooldown > 0;
  const remaining = useMemo(() => (locked ? cooldown : 0), [locked, cooldown]);

  if (!gateOpen) return null;

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (locked) return;

    if (unlock(code)) {
      setAttempts(0);
      setError('');
      return;
    }

    const next = attempts + 1;
    setAttempts(next);
    if (next >= MAX_ATTEMPTS) {
      setCooldown(COOLDOWN_SECONDS);
      setAttempts(0);
      setError(`连续 ${MAX_ATTEMPTS} 次不对，请等 ${COOLDOWN_SECONDS} 秒后再试`);
    } else {
      setError(`口令不对，还可以再试 ${MAX_ATTEMPTS - next} 次`);
    }
    setCode('');
  };

  return createPortal(
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
      style={{ background: 'rgba(27, 26, 23, 0.34)', backdropFilter: 'blur(4px)' }}
      role="dialog"
      aria-modal="true"
      aria-label="编辑需要验证口令"
      onClick={closeGate}
    >
      <form
        className="w-full max-w-sm rounded-[24px] border bg-surface p-6 shadow-lift"
        style={{ borderColor: 'var(--line)' }}
        onClick={(event) => event.stopPropagation()}
        onSubmit={onSubmit}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span
              className="inline-flex h-10 w-10 items-center justify-center rounded-full"
              style={{ background: 'var(--accent-soft)', color: 'var(--accent)' }}
            >
              <Lock size={17} />
            </span>
            <div>
              <p className="display text-lg">编辑需要验证</p>
              <p className="mt-0.5 text-[11.5px]" style={{ color: 'var(--muted)' }}>
                这个页面只开放给本人维护
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeGate}
            aria-label="关闭"
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border"
            style={{ borderColor: 'var(--line)', color: 'var(--muted)' }}
          >
            <X size={14} />
          </button>
        </div>

        <label className="mt-6 block">
          <span className="text-[12px]" style={{ color: 'var(--ink-soft)' }}>
            编辑口令
          </span>
          <span className="mt-1.5 flex items-center gap-2">
            <span className="relative flex-1">
              <input
                autoFocus
                type={visible ? 'text' : 'password'}
                value={code}
                onChange={(event) => {
                  setCode(event.target.value);
                  setError('');
                }}
                placeholder="输入口令"
                aria-label="编辑口令"
                aria-invalid={Boolean(error)}
                disabled={locked}
                className="field-input pr-10"
                style={{ borderColor: error ? '#c0523f' : 'var(--line)' }}
              />
              <button
                type="button"
                onClick={() => setVisible((value) => !value)}
                aria-label={visible ? '隐藏口令' : '显示口令'}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5"
                style={{ color: 'var(--muted)' }}
              >
                {visible ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </span>
          </span>
        </label>

        {error ? (
          <p className="mt-2 text-[11.5px]" style={{ color: '#c0523f' }} role="alert">
            {error}
          </p>
        ) : null}

        <button type="submit" className="btn-primary mt-5 w-full !py-2.5 text-[13px]" disabled={locked}>
          {locked ? `请等待 ${remaining} 秒` : '验证并进入编辑'}
        </button>

        <p className="mt-4 text-[11px] leading-6" style={{ color: 'var(--muted)' }}>
          口令以哈希形式写在 <code className="rounded bg-white px-1 py-0.5 font-mono">src/auth/passcode.ts</code> 里，
          想换口令改那个文件即可。这是纯前端校验，只用来挡住随手点开的人，不构成真正的安全边界。
        </p>
      </form>
    </div>,
    document.body,
  );
}
