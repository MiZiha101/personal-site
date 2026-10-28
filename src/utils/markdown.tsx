import type { ReactNode } from 'react';

/**
 * 极简 Markdown 渲染器（只支持文章里用到的语法）：
 * 标题 #/##/###、段落、有序/无序列表、引用、代码块、行内代码、加粗、链接、分隔线。
 * 不引入额外依赖，也不使用 innerHTML，避免 XSS 风险。
 */

const INLINE = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string, keyPrefix: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const parts = text.split(INLINE);

  parts.forEach((part, index) => {
    const key = `${keyPrefix}-i${index}`;
    if (!part) return;

    if (part.startsWith('`') && part.endsWith('`')) {
      nodes.push(
        <code
          key={key}
          className="rounded-md border px-1.5 py-0.5 font-mono text-[0.85em]"
          style={{ borderColor: 'var(--line)', background: '#f6f3ea', color: 'var(--accent)' }}
        >
          {part.slice(1, -1)}
        </code>,
      );
      return;
    }

    if (part.startsWith('**') && part.endsWith('**')) {
      nodes.push(
        <strong key={key} className="font-semibold" style={{ color: 'var(--ink)' }}>
          {part.slice(2, -2)}
        </strong>,
      );
      return;
    }

    const link = part.match(/^\[([^\]]+)\]\(([^)\s]+)\)$/);
    if (link) {
      nodes.push(
        <a
          key={key}
          href={link[2]}
          target="_blank"
          rel="noreferrer noopener"
          className="underline decoration-dotted underline-offset-4"
          style={{ color: 'var(--accent)' }}
        >
          {link[1]}
        </a>,
      );
      return;
    }

    nodes.push(<span key={key}>{part}</span>);
  });

  return nodes;
}

export function Markdown({ content }: { content: string }) {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const blocks: ReactNode[] = [];

  let paragraph: string[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  let quote: string[] = [];
  let code: { lang: string; lines: string[] } | null = null;

  const flushParagraph = () => {
    if (paragraph.length === 0) return;
    const text = paragraph.join(' ');
    blocks.push(
      <p key={`p-${blocks.length}`} className="mt-4 text-[14.5px] leading-8" style={{ color: 'var(--ink-soft)' }}>
        {renderInline(text, `p-${blocks.length}`)}
      </p>,
    );
    paragraph = [];
  };

  const flushList = () => {
    if (!list) return;
    const items = list.items.map((item, index) => (
      <li key={`li-${blocks.length}-${index}`} className="text-[14px] leading-8" style={{ color: 'var(--ink-soft)' }}>
        {renderInline(item, `li-${blocks.length}-${index}`)}
      </li>
    ));
    blocks.push(
      list.ordered ? (
        <ol key={`ol-${blocks.length}`} className="mt-4 list-decimal space-y-1 pl-5">
          {items}
        </ol>
      ) : (
        <ul key={`ul-${blocks.length}`} className="mt-4 list-disc space-y-1 pl-5">
          {items}
        </ul>
      ),
    );
    list = null;
  };

  const flushQuote = () => {
    if (quote.length === 0) return;
    blocks.push(
      <blockquote
        key={`q-${blocks.length}`}
        className="mt-4 rounded-r-lg border-l-2 py-1 pl-4 text-[14px] leading-8"
        style={{ borderColor: 'var(--accent)', color: 'var(--muted)', background: 'var(--accent-wash)' }}
      >
        {renderInline(quote.join(' '), `q-${blocks.length}`)}
      </blockquote>,
    );
    quote = [];
  };

  const flushCode = () => {
    if (!code) return;
    blocks.push(
      <pre
        key={`pre-${blocks.length}`}
        className="mt-4 overflow-x-auto rounded-xl border p-4 text-[12.5px] leading-6"
        style={{ borderColor: 'var(--line)', background: '#f8f5ee' }}
      >
        <code className="font-mono" style={{ color: 'var(--ink-soft)' }}>
          {code.lines.join('\n')}
        </code>
      </pre>,
    );
    code = null;
  };

  const flushAll = () => {
    flushParagraph();
    flushList();
    flushQuote();
  };

  lines.forEach((raw, index) => {
    const line = raw.trimEnd();
    const fence = line.match(/^```(.*)$/);

    if (code) {
      if (fence) {
        flushCode();
      } else {
        code.lines.push(raw);
      }
      return;
    }

    if (fence) {
      flushAll();
      code = { lang: fence[1].trim(), lines: [] };
      return;
    }

    if (!line.trim()) {
      flushAll();
      return;
    }

    const heading = line.match(/^(#{1,3})\s+(.*)$/);
    if (heading) {
      flushAll();
      const level = heading[1].length;
      const text = heading[2];
      const className =
        level === 1
          ? 'display mt-8 text-2xl'
          : level === 2
            ? 'display mt-7 text-xl'
            : 'mt-6 text-base font-medium';
      blocks.push(
        <h3 key={`h-${blocks.length}`} className={className} style={{ color: 'var(--ink)' }}>
          {renderInline(text, `h-${blocks.length}`)}
        </h3>,
      );
      return;
    }

    if (/^---+$/.test(line)) {
      flushAll();
      blocks.push(<hr key={`hr-${blocks.length}`} className="mt-6 border-t" style={{ borderColor: 'var(--line)' }} />);
      return;
    }

    const quoteLine = line.match(/^>\s?(.*)$/);
    if (quoteLine) {
      flushParagraph();
      flushList();
      quote.push(quoteLine[1]);
      return;
    }

    const unordered = line.match(/^[-*]\s+(.*)$/);
    const ordered = line.match(/^\d+\.\s+(.*)$/);
    if (unordered || ordered) {
      flushParagraph();
      flushQuote();
      const isOrdered = Boolean(ordered);
      if (!list || list.ordered !== isOrdered) {
        flushList();
        list = { ordered: isOrdered, items: [] };
      }
      list.items.push((unordered ?? ordered)![1]);
      return;
    }

    flushList();
    flushQuote();
    paragraph.push(line.trim());
    if (index === lines.length - 1) flushParagraph();
  });

  if (code) {
    flushCode();
  }
  flushAll();

  return <div>{blocks}</div>;
}
