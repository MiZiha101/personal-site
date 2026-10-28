import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] font-medium" style={{ color: 'var(--ink-soft)' }}>
          {label}
        </span>
        {hint ? (
          <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
            {hint}
          </span>
        ) : null}
      </span>
      <span className="mt-1.5 block">{children}</span>
    </label>
  );
}

export function TextInput({ label, hint, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <input {...props} className="field-input" />
    </Field>
  );
}

export function TextArea({
  label,
  hint,
  rows = 3,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; hint?: string }) {
  return (
    <Field label={label} hint={hint}>
      <textarea {...props} rows={rows} className="field-input resize-y leading-7" />
    </Field>
  );
}

export function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
      style={{ borderColor: 'var(--line)', color: 'var(--muted)', background: '#fff' }}
    >
      {children}
    </button>
  );
}
