import type { ReactNode } from "react";

/*
 * Clyra line icons. 24px grid, 1.5 stroke in currentColor so they read on Ink
 * and Bone alike; each carries one small Signal node (the "lit stage" motif).
 */
export type IconName =
  | "plan"
  | "ask"
  | "material"
  | "decide"
  | "fair"
  | "teachers"
  | "students"
  | "schools"
  | "loop";

const PATHS: Record<IconName, ReactNode> = {
  plan: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="M7.5 13h2M11 13h2M7.5 16.5h2M11 16.5h2M14.5 16.5h2" />
      <circle className="c-ico__dot" cx="16" cy="13" r="1.4" />
    </>
  ),
  ask: (
    <>
      <path d="M5.5 4.5h13a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H11l-4.5 3.5v-3.5h-1a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2Z" />
      <path d="M8.5 13v-2M12 13V9M15.5 13v-3" />
      <circle className="c-ico__dot" cx="17.6" cy="7.4" r="1.4" />
    </>
  ),
  material: (
    <>
      <path d="M12 6.5c-2-1.6-4.8-2-8-1.5v13c3.2-.5 6 0 8 1.5 2-1.5 4.8-2 8-1.5V5c-3.2-.5-6-.1-8 1.5Z" />
      <path d="M12 6.5V19.5" />
      <circle className="c-ico__dot" cx="16.5" cy="9.5" r="1.4" />
    </>
  ),
  decide: (
    <>
      <circle cx="12" cy="8.5" r="4" />
      <path d="m10.3 8.6 1.2 1.2 2.3-2.4" />
      <path d="M3.5 15.5h3l3.2 1.5h3.6a1.4 1.4 0 0 1 0 2.8H9.5M6.5 15.5V21M13.2 18.3l4.3-2.2a1.5 1.5 0 0 1 2 .6 1.5 1.5 0 0 1-.6 2l-5.4 2.9H6.5" />
      <circle className="c-ico__dot" cx="17.5" cy="5.5" r="1.4" />
    </>
  ),
  fair: (
    <>
      <path d="M12 4.5v15M8 20h8M5 7.5h14" />
      <path d="M5 7.5 2.8 13a2.6 2.6 0 0 0 4.4 0L5 7.5ZM19 7.5 16.8 13a2.6 2.6 0 0 0 4.4 0L19 7.5Z" />
      <circle className="c-ico__dot" cx="12" cy="3.2" r="1.4" />
    </>
  ),
  teachers: (
    <>
      <rect x="9.5" y="4" width="11" height="8" rx="1.5" />
      <circle cx="6" cy="7" r="2" />
      <path d="M3.5 20v-6.5a2.5 2.5 0 0 1 5 0V15l3-2" />
      <path d="M3 15h7l-1 5H4Z" />
      <circle className="c-ico__dot" cx="17.5" cy="6.6" r="1.3" />
    </>
  ),
  students: (
    <>
      <rect x="5" y="3.5" width="12.5" height="17" rx="2" />
      <path d="M8.5 8h6M8.5 11h6M8.5 14h3" />
      <path d="m14 17.5 5.5-5.5 1.5 1.5-5.5 5.5H14Z" />
      <circle className="c-ico__dot" cx="15" cy="5.8" r="1.2" />
    </>
  ),
  schools: (
    <>
      <path d="M3.5 9 12 4l8.5 5Z" />
      <path d="M5.5 9.5v8M9.8 9.5v8M14.2 9.5v8M18.5 9.5v8M3.5 20.5h17M4.5 17.5h15" />
      <circle className="c-ico__dot" cx="12" cy="7.2" r="1.3" />
    </>
  ),
  loop: (
    <>
      <circle cx="12" cy="12" r="7.5" />
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
        return (
          <circle
            className="c-ico__dot"
            cx={12 + 7.5 * Math.cos(a)}
            cy={12 + 7.5 * Math.sin(a)}
            key={i}
            r="1.6"
          />
        );
      })}
    </>
  ),
};

export function Icon({ name, size = 48, className = "" }: { name: IconName; size?: number; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={`c-ico ${className}`.trim()}
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      viewBox="0 0 24 24"
      width={size}
    >
      {PATHS[name]}
    </svg>
  );
}
