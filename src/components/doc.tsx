import type { ReactNode } from "react";

import { SiteFooter, SiteNav } from "@/components/site";

/*
 * "Document room": the shared frame for every page that isn't the homepage —
 * the same nav and footer, an Ink header band, and a Bone reading surface.
 */

export function DocShell({ children }: { children: ReactNode }) {
  return (
    <div className="c-site c-docsite">
      <SiteNav home={false} />
      <main>{children}</main>
      <SiteFooter home={false} />
    </div>
  );
}

export function DocHeader({
  eyebrow,
  title,
  lead,
  meta,
}: {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  meta?: ReactNode;
}) {
  return (
    <header className="c-dochead c-dark c-grain">
      <div className="c-dochead__in">
        <p className="c-eyebrow">{eyebrow}</p>
        <h1 className="c-h2 c-dochead__title">{title}</h1>
        {lead ? <p className="c-body c-dochead__lead">{lead}</p> : null}
        {meta ? <p className="c-dochead__meta">{meta}</p> : null}
      </div>
    </header>
  );
}

/* ------------------------------------------------------------------ */
/* Rich text: **bold** and [label](href), as extracted from the live    */
/* pages. Nothing else is interpreted.                                 */
/* ------------------------------------------------------------------ */
const TOKEN = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;

export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  TOKEN.lastIndex = 0;
  while ((m = TOKEN.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(<strong key={m.index}>{m[1]}</strong>);
    } else {
      const href = m[3];
      const external = /^https?:/.test(href);
      out.push(
        <a href={href} key={m.index} {...(external ? { rel: "noopener", target: "_blank" } : {})}>
          {m[2]}
        </a>,
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/* ------------------------------------------------------------------ */
/* Legal body                                                          */
/* ------------------------------------------------------------------ */
type Item = { t: string; c?: Item[] };
export type Block =
  | { k: "h1" | "h2" | "h3" | "h4" | "p"; t: string }
  | { k: "ul" | "ol"; items: Item[] }
  | { k: "table"; rows: string[][] };

export const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/\*\*/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function List({ items, ordered }: { items: Item[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className="c-legal__list">
      {items.map((it, i) => (
        <li key={i}>
          <RichText text={it.t.replace(/^•\s*/, "")} />
          {it.c ? <List items={it.c} /> : null}
        </li>
      ))}
    </Tag>
  );
}

/**
 * Renders extracted legal blocks. The source's own h1, date line and
 * "Table of Contents" list are dropped (the header and the sticky TOC replace them).
 */
export function LegalBody({ blocks }: { blocks: Block[] }) {
  const body: Block[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.k === "h1") continue;
    if (i === 1 && b.k === "p" && /Effective Date/.test(b.t)) continue;
    if (b.k === "h2" && /table of contents/i.test(b.t)) {
      if (blocks[i + 1]?.k === "ul" || blocks[i + 1]?.k === "ol") i++;
      continue;
    }
    body.push(b);
  }
  const toc = body.filter((b): b is { k: "h2"; t: string } => b.k === "h2");

  return (
    <div className="c-docbody c-bone">
      <div className="c-legal">
        <nav aria-label="On this page" className="c-legal__toc">
          <p className="c-legal__tochead">On this page</p>
          <ol>
            {toc.map((h) => (
              <li key={h.t}>
                <a href={`#s-${slug(h.t)}`}>{h.t.replace(/\*\*/g, "")}</a>
              </li>
            ))}
          </ol>
        </nav>
        <article className="c-legal__text">
          {body.map((b, i) => {
            switch (b.k) {
              case "h2":
                return (
                  <h2 id={`s-${slug(b.t)}`} key={i}>
                    <RichText text={b.t} />
                  </h2>
                );
              case "h3":
              case "h4":
                return (
                  <h3 key={i}>
                    <RichText text={b.t} />
                  </h3>
                );
              case "p":
                return (
                  <p key={i}>
                    <RichText text={b.t} />
                  </p>
                );
              case "ul":
              case "ol":
                return <List items={b.items} key={i} ordered={b.k === "ol"} />;
              case "table":
                return (
                  <div className="c-legal__tablewrap" key={i}>
                    <table className="c-legal__table">
                      <thead>
                        <tr>
                          {b.rows[0].map((c) => (
                            <th key={c} scope="col">
                              {c}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {b.rows.slice(1).map((r, ri) => (
                          <tr key={ri}>
                            {r.map((c, ci) => (
                              <td key={ci}>
                                <RichText text={c} />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              default:
                return null;
            }
          })}
        </article>
      </div>
    </div>
  );
}
