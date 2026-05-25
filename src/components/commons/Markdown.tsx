import { Fragment, type ReactNode } from "react";

interface MarkdownProps {
  content: string;
}

function renderInline(text: string): ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

interface ListItem {
  level: number;
  text: string;
}

function ListBlock({ items }: { items: ListItem[] }) {
  return (
    <ul className="list-disc space-y-1 pl-5 text-sm leading-6 text-gray-700">
      {items.map((item, i) => (
        <li key={i} style={{ marginLeft: `${item.level * 16}px` }}>
          {renderInline(item.text)}
        </li>
      ))}
    </ul>
  );
}

export function Markdown({ content }: MarkdownProps) {
  const lines = content.split("\n");
  const blocks: ReactNode[] = [];
  let buffer: ListItem[] = [];
  let key = 0;

  const flushList = () => {
    if (buffer.length === 0) return;
    blocks.push(<ListBlock key={`list-${key++}`} items={buffer} />);
    buffer = [];
  };

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, "");
    if (!line.trim()) {
      flushList();
      continue;
    }

    if (line.startsWith("### ")) {
      flushList();
      blocks.push(
        <h2
          key={`h-${key++}`}
          className="mt-5 mb-2 text-base font-semibold text-gray-900"
        >
          {renderInline(line.slice(4))}
        </h2>,
      );
      continue;
    }

    const bulletMatch = line.match(/^(\s*)\* (.+)$/);
    if (bulletMatch) {
      const indent = bulletMatch[1].length;
      const level = Math.floor(indent / 4);
      buffer.push({ level, text: bulletMatch[2] });
      continue;
    }

    const blockquoteMatch = line.match(/^(\s*)> (.+)$/);
    if (blockquoteMatch) {
      flushList();
      blocks.push(
        <blockquote
          key={`bq-${key++}`}
          className="border-l-2 border-gray-300 pl-3 text-sm leading-6 text-gray-500"
        >
          {renderInline(blockquoteMatch[2])}
        </blockquote>,
      );
      continue;
    }

    const numberedMatch = line.match(/^(\d+)\.\s+(.+)$/);
    if (numberedMatch) {
      flushList();
      blocks.push(
        <p
          key={`p-${key++}`}
          className="text-sm leading-6 text-gray-700"
        >
          <span className="font-medium">{numberedMatch[1]}.</span>{" "}
          {renderInline(numberedMatch[2])}
        </p>,
      );
      continue;
    }

    flushList();
    blocks.push(
      <p key={`p-${key++}`} className="text-sm leading-6 text-gray-700">
        {renderInline(line)}
      </p>,
    );
  }

  flushList();

  return <div className="space-y-2">{blocks}</div>;
}
