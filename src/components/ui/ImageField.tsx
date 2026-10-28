import { useRef, useState } from 'react';
import { ImagePlus, Trash2, Loader2 } from 'lucide-react';
import { fileToCompressedDataUrl, type CompressOptions } from '../../utils/image';

type ImageFieldProps = {
  label: string;
  hint?: string;
  value?: string;
  onChange: (value: string) => void;
  /** circle 用于头像，square 用于封面 */
  shape?: 'circle' | 'square';
  /** 压缩参数，透传给 fileToCompressedDataUrl */
  options?: CompressOptions;
};

export function ImageField({ label, hint, value, onChange, shape = 'circle', options }: ImageFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const previewClass =
    shape === 'circle' ? 'h-20 w-20 rounded-full object-cover' : 'h-20 w-28 rounded-xl object-cover';

  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-[12px] font-medium" style={{ color: 'var(--ink-soft)' }}>
          {label}
        </span>
        {hint ? (
          <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
            {hint}
          </span>
        ) : null}
      </div>

      <div className="mt-2 flex items-center gap-4">
        <div
          className={`flex shrink-0 items-center justify-center overflow-hidden border ${
            shape === 'circle' ? 'rounded-full' : 'rounded-xl'
          }`}
          style={{
            borderColor: 'var(--line)',
            background: 'var(--surface-soft)',
            width: shape === 'circle' ? 80 : 112,
            height: 80,
          }}
        >
          {value ? (
            <img src={value} alt="已选择的照片" className={previewClass} />
          ) : (
            <span className="text-[11px]" style={{ color: 'var(--muted)' }}>
              未选择
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px] transition-colors"
              style={{ borderColor: 'var(--line-strong)', background: '#fff', color: 'var(--ink-soft)' }}
              onClick={() => inputRef.current?.click()}
              disabled={loading}
            >
              {loading ? <Loader2 size={13} className="animate-spin" /> : <ImagePlus size={13} />}
              {loading ? '处理中…' : value ? '换一张' : '选择照片'}
            </button>

            {value ? (
              <button
                type="button"
                className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[12px]"
                style={{ borderColor: 'var(--line)', background: '#fff', color: 'var(--muted)' }}
                onClick={() => {
                  onChange('');
                  setError('');
                }}
              >
                <Trash2 size={13} />
                移除
              </button>
            ) : null}
          </div>

          <p className="text-[11px] leading-5" style={{ color: error ? '#c0523f' : 'var(--muted)' }}>
            {error || '仅保存在本机浏览器，不会上传；会自动压缩控制体积'}
          </p>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={async (event) => {
          const file = event.target.files?.[0];
          event.target.value = '';
          if (!file) return;

          setLoading(true);
          setError('');
          try {
            const dataUrl = await fileToCompressedDataUrl(file, options);
            onChange(dataUrl);
          } catch (caught) {
            setError(caught instanceof Error ? caught.message : '图片处理失败，换一张试试');
          } finally {
            setLoading(false);
          }
        }}
      />
    </div>
  );
}
