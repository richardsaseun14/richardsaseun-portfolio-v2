import type { ReactNode } from "react";
import { Figure } from "./Figure";
export function CodeBlock({ filename, caption, code }: { filename: string; caption?: string; code: string }) {
  return (
    <figure className="min-w-0 border border-line">
      <div className="border-b border-line px-5 py-3 meta">{filename}</div>
      <pre
        tabIndex={0}
        aria-label={filename}
        className="overflow-x-auto bg-invert p-5 text-sm leading-7 text-invert-ink"
      >
        <code>{code}</code>
      </pre>
      {caption && <figcaption className="px-5 py-3 text-sm text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
export function StackTable({ rows }: { rows: { layer: string; choice: string; why: string }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="cs-table">
        <caption className="sr-only">Technology choices and rationale</caption>
        <thead>
          <tr>
            <th>Layer</th>
            <th>Choice</th>
            <th>Why</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.layer}>
              <th scope="row">{row.layer}</th>
              <td>{row.choice}</td>
              <td>{row.why}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function Metrics({ rows }: { rows: { metric: string; before: string; after: string; method: string }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="cs-table">
        <caption className="sr-only">Before and after measurements</caption>
        <thead>
          <tr>
            <th>Metric</th>
            <th>Before</th>
            <th>After</th>
            <th>Method</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.metric}>
              <th scope="row">{row.metric}</th>
              <td>{row.before}</td>
              <td>{row.after}</td>
              <td>{row.method}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function Architecture({ src, legend }: { src?: string; legend: string[] }) {
  return (
    <div>
      <Figure
        src={src}
        alt="architecture diagram"
        caption="TODO: Replace with the actual system boundary and data flow."
      />
      <ol className="mt-6 grid gap-4 sm:grid-cols-3">
        {legend.map((item, i) => (
          <li key={item}>
            <span className="meta text-accent">0{i + 1}</span>
            <p className="mt-2">{item}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
export function Callout({ kind = "note", children }: { kind?: "note" | "unknown" | "QA"; children: ReactNode }) {
  return (
    <aside className="border-l-2 border-accent bg-line/15 p-5">
      <p className="mb-2 meta text-accent">{kind}</p>
      {children}
    </aside>
  );
}
