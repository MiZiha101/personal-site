import { useRef, useState } from 'react';
import { Download, RotateCcw, Upload } from 'lucide-react';
import { useSiteData } from '../../store/siteData';

export function DataPanel() {
  const { exportData, importData, resetData, customized } = useSiteData();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  return (
    <div className="space-y-6">
      <section className="space-y-3">
        <p className="eyebrow">备份与迁移</p>
        <p className="text-[12px] leading-7" style={{ color: 'var(--muted)' }}>
          你的修改只保存在当前浏览器里（localStorage）。换电脑、换浏览器或清理缓存后会丢，重要内容建议导出备份。
        </p>

        <div className="flex flex-wrap gap-3">
          <button type="button" className="btn-primary !px-5 !py-2.5 text-[13px]" onClick={exportData}>
            <Download size={15} />
            导出 JSON
          </button>

          <button
            type="button"
            className="btn-ghost !px-5 !py-2.5 text-[13px]"
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={15} />
            导入 JSON
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={async (event) => {
              const file = event.target.files?.[0];
              if (!file) return;
              const result = await importData(file);
              setMessage({ ok: result.ok, text: result.message });
              event.target.value = '';
            }}
          />

          <button
            type="button"
            className="btn-ghost !px-5 !py-2.5 text-[13px]"
            onClick={() => {
              if (window.confirm('确定恢复成初始示例内容吗？当前修改会被清空（建议先导出备份）。')) {
                resetData();
                setMessage({ ok: true, text: '已恢复为初始示例内容。' });
              }
            }}
          >
            <RotateCcw size={15} />
            恢复默认
          </button>
        </div>

        {message ? (
          <p className="text-[12px]" style={{ color: message.ok ? 'var(--accent)' : '#c0523f' }}>
            {message.text}
          </p>
        ) : null}

        <p className="text-[11.5px] leading-7" style={{ color: 'var(--muted)' }}>
          当前状态：{customized ? '已在本机修改过内容' : '仍是初始示例内容'}
        </p>
      </section>

      <section className="space-y-3 rounded-xl border p-4" style={{ borderColor: 'var(--line)', background: 'var(--surface-soft)' }}>
        <p className="eyebrow">想把内容写进代码里？</p>
        <ol className="list-decimal space-y-2 pl-5 text-[12px] leading-7" style={{ color: 'var(--muted)' }}>
          <li>点「导出 JSON」拿到 `personal-site-data.json`；</li>
          <li>用文件内容替换 <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px]">src/data/defaults.ts</code> 里的 <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px]">defaultData</code>；</li>
          <li>
            重新 <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px]">npm run build</code> 并部署，这样任何人打开看到的都是你的内容。
          </li>
        </ol>
        <p className="text-[11px] leading-6" style={{ color: 'var(--muted)' }}>
          另一种更省事的做法：把 JSON 放到 <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[11px]">public/data.json</code>，让页面首次加载时读取它 —— 需要改代码时可以让 Cursor 帮你加。
        </p>
      </section>

      <p className="text-[11px] leading-6" style={{ color: 'var(--muted)' }}>
        隐私说明：所有数据只存在你本地浏览器，不会上传到任何服务器，也没有统计脚本。
      </p>
    </div>
  );
}
