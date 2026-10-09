"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import Link from "next/link";

import countries from "@/content/countries.json";

/*
 * Book-a-demo request. When NEXT_PUBLIC_DEMO_ENDPOINT is set, the form POSTs JSON there
 * (contract: docs/DEMO-REQUESTS.md — the backend emails it from no-reply@heyclyra.com).
 * Until then it hands the request to the visitor's email app, addressed to the team,
 * so no lead is lost.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_DEMO_ENDPOINT || "";
const TEAM = ["aditya@heyclyra.com", "rohit@heyclyra.com"];

const ROLES = [
  "Teacher",
  "Head of department",
  "Principal / school leader",
  "IT / operations",
  "Tutor / tuition centre",
  "Other",
];
const SIZES = ["Under 250", "250–1,000", "1,000–3,000", "3,000+"];
const CURRICULA = ["IB", "A-Level", "AP", "CBSE", "GCSE", "IGCSE", "SAT / ACT", "University", "Other"];
const INTERESTS = [
  "Planning & teaching",
  "Homework & marking",
  "Learning gaps & analytics",
  "Personalised practice",
  "Ask Clyra",
  "Whole-school rollout",
];
const TIMES = ["Morning", "Afternoon", "Evening"];

type Country = { name: string; code: string; dial: string };
const COUNTRIES = countries as Country[];

type Fields = {
  name: string;
  email: string;
  role: string;
  school: string;
  country: string;
  phone: string;
  size: string;
  curricula: string[];
  interests: string[];
  time: string;
  message: string;
  website: string; // honeypot
};
const EMPTY: Fields = {
  name: "",
  email: "",
  role: "",
  school: "",
  country: "AE",
  phone: "",
  size: "",
  curricula: [],
  interests: [],
  time: "",
  message: "",
  website: "",
};
type Errors = Partial<Record<"name" | "email" | "role" | "school" | "interests", string>>;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Chips({
  label,
  options,
  value,
  multi,
  onChange,
  error,
  id,
}: {
  label: ReactNode;
  options: string[];
  value: string | string[];
  multi?: boolean;
  onChange: (v: string) => void;
  error?: string;
  id: string;
}) {
  const on = (o: string) => (Array.isArray(value) ? value.includes(o) : value === o);
  return (
    <fieldset className="c-chips" aria-describedby={error ? `${id}-err` : undefined} id={id}>
      <legend className="c-field__label">{label}</legend>
      <div className="c-chips__row">
        {options.map((o) => (
          <button
            aria-pressed={on(o)}
            className="c-chip-opt"
            key={o}
            onClick={() => onChange(o)}
            type="button"
          >
            {multi ? <span aria-hidden="true" className="c-chip-opt__tick" /> : null}
            {o}
          </button>
        ))}
      </div>
      {error ? (
        <span className="c-field__err" id={`${id}-err`} role="alert">
          {error}
        </span>
      ) : null}
    </fieldset>
  );
}

export function DemoForm() {
  const [f, setF] = useState<Fields>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [viaEmail, setViaEmail] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const [tz, setTz] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      setTz(Intl.DateTimeFormat().resolvedOptions().timeZone);
    } catch {
      /* time zone is a nicety */
    }
  }, []);

  useEffect(() => {
    if (state === "done") doneRef.current?.focus();
  }, [state]);

  const set = <K extends keyof Fields>(k: K, v: Fields[K]) => {
    setF((s) => ({ ...s, [k]: v }));
    if (k in errors) setErrors((e) => ({ ...e, [k]: undefined }));
  };
  const toggle = (k: "curricula" | "interests", v: string) =>
    set(k, f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v]);

  const validate = () => {
    const e: Errors = {};
    if (!f.name.trim()) e.name = "Please tell us your name.";
    if (!EMAIL.test(f.email.trim())) e.email = "Please enter a valid work email.";
    if (!f.role) e.role = "Please choose your role.";
    if (!f.school.trim()) e.school = "Please tell us your school or institution.";
    if (f.interests.length === 0) e.interests = "Pick at least one thing you'd like to see.";
    setErrors(e);
    const first = Object.keys(e)[0];
    if (first) {
      const el = formRef.current?.querySelector<HTMLElement>(`[name="${first}"], #${first}`);
      (el?.matches("fieldset") ? el.querySelector<HTMLElement>("button") : el)?.focus();
    }
    return !first;
  };

  const payload = () => {
    const country = COUNTRIES.find((c) => c.code === f.country);
    return {
      full_name: f.name.trim(),
      email: f.email.trim(),
      role: f.role,
      school: f.school.trim(),
      country: country?.name ?? "",
      phone: f.phone.trim() ? `${country?.dial ?? ""} ${f.phone.trim()}` : "",
      school_size: f.size,
      curricula: f.curricula,
      interests: f.interests,
      preferred_time: f.time,
      time_zone: tz,
      message: f.message.trim(),
      source_page: typeof window !== "undefined" ? window.location.href : "",
    };
  };

  const mailto = (p: ReturnType<typeof payload>) => {
    const lines = [
      `Name: ${p.full_name}`,
      `Email: ${p.email}`,
      `Role: ${p.role}`,
      `School / institution: ${p.school}`,
      `Country: ${p.country}`,
      `Phone: ${p.phone || "-"}`,
      `School size: ${p.school_size || "-"}`,
      `Curricula: ${p.curricula.join(", ") || "-"}`,
      `Wants to see: ${p.interests.join(", ")}`,
      `Preferred time: ${p.preferred_time || "-"}${p.time_zone ? ` (${p.time_zone})` : ""}`,
      "",
      p.message || "",
    ];
    const subject = `Demo request: ${p.school} (${p.full_name})`;
    return `mailto:${TEAM.join(",")}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setFailure(null);
    if (f.website) return; // bot
    if (!validate()) return;
    const p = payload();

    if (!ENDPOINT) {
      setViaEmail(true);
      setState("done");
      const link = document.createElement("a");
      link.href = mailto(p);
      link.click();
      return;
    }

    setState("sending");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(p),
      });
      const data = (await res.json().catch(() => ({}))) as { success?: boolean; message?: string };
      if (res.ok && data.success !== false) {
        setState("done");
      } else {
        setState("idle");
        setFailure(data.message || "We couldn't send your request. Please try again, or email hi@heyclyra.com.");
      }
    } catch {
      setState("idle");
      setFailure("We couldn't send your request. Please try again, or email hi@heyclyra.com.");
    }
  }

  if (state === "done") {
    const first = f.name.trim().split(/\s+/)[0];
    return (
      <div className="c-demo-done" ref={doneRef} role="status" tabIndex={-1}>
        <svg aria-hidden="true" className="c-demo-done__ring" viewBox="0 0 64 64" width="56" height="56">
          <circle cx="32" cy="32" fill="none" r="24" />
          {[0, 1, 2, 3, 4, 5].map((i) => {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
            return <circle cx={32 + 24 * Math.cos(a)} cy={32 + 24 * Math.sin(a)} key={i} r="3.2" />;
          })}
        </svg>
        <h2 className="c-apply__title">
          Thanks{first ? `, ${first}` : ""}. <em>Talk soon.</em>
        </h2>
        {viaEmail ? (
          <p className="c-apply__sub">
            Your email app has opened with your request addressed to our team. Press send and we&apos;ll be in
            touch within one working day. If nothing opened, write to{" "}
            <a href={`mailto:${TEAM.join(",")}`}>{TEAM.join(" and ")}</a>.
          </p>
        ) : (
          <p className="c-apply__sub">
            We&apos;ve received your request and will be in touch within one working day to find a time that suits
            you.
          </p>
        )}
        <Link className="c-docbtn c-docbtn--ghost" href="/">
          Back to the homepage
        </Link>
      </div>
    );
  }

  const fieldErr = (k: keyof Errors) =>
    errors[k] ? (
      <span className="c-field__err" id={`${k}-err`} role="alert">
        {errors[k]}
      </span>
    ) : null;
  const a11y = (k: keyof Errors) => ({
    "aria-invalid": errors[k] ? true : undefined,
    "aria-describedby": errors[k] ? `${k}-err` : undefined,
  });

  return (
    <form className="c-form" noValidate onSubmit={onSubmit} ref={formRef}>
      <div className="c-form__row">
        <label className="c-field">
          <span className="c-field__label">Full name *</span>
          <input autoComplete="name" name="name" onChange={(e) => set("name", e.target.value)} placeholder="Your full name" type="text" value={f.name} {...a11y("name")} />
          {fieldErr("name")}
        </label>
        <label className="c-field">
          <span className="c-field__label">Work email *</span>
          <input autoComplete="email" name="email" onChange={(e) => set("email", e.target.value)} placeholder="you@school.edu" type="email" value={f.email} {...a11y("email")} />
          {fieldErr("email")}
        </label>
      </div>

      <div className="c-form__row">
        <label className="c-field">
          <span className="c-field__label">Your role *</span>
          <select name="role" onChange={(e) => set("role", e.target.value)} value={f.role} {...a11y("role")}>
            <option disabled value="">
              Select your role
            </option>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          {fieldErr("role")}
        </label>
        <label className="c-field">
          <span className="c-field__label">School / institution *</span>
          <input autoComplete="organization" name="school" onChange={(e) => set("school", e.target.value)} placeholder="e.g. Greenfield International School" type="text" value={f.school} {...a11y("school")} />
          {fieldErr("school")}
        </label>
      </div>

      <div className="c-form__row">
        <label className="c-field">
          <span className="c-field__label">Country</span>
          <select autoComplete="country" name="country" onChange={(e) => set("country", e.target.value)} value={f.country}>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label className="c-field">
          <span className="c-field__label">
            Phone <span className="c-field__opt">(optional)</span>
          </span>
          <span className="c-phone c-phone--fixed">
            <span className="c-phone__dial">{COUNTRIES.find((c) => c.code === f.country)?.dial}</span>
            <input autoComplete="tel-national" name="phone" onChange={(e) => set("phone", e.target.value)} placeholder="50 123 4567" type="tel" value={f.phone} />
          </span>
        </label>
      </div>

      <Chips id="size" label="School size (students)" onChange={(v) => set("size", f.size === v ? "" : v)} options={SIZES} value={f.size} />
      <Chips id="curricula" label="Curricula you teach" multi onChange={(v) => toggle("curricula", v)} options={CURRICULA} value={f.curricula} />
      <Chips
        error={errors.interests}
        id="interests"
        label="What would you like to see? *"
        multi
        onChange={(v) => toggle("interests", v)}
        options={INTERESTS}
        value={f.interests}
      />
      <Chips
        id="time"
        label={
          <>
            Best time to talk{tz ? <span className="c-field__opt"> · your time zone: {tz}</span> : null}
          </>
        }
        onChange={(v) => set("time", f.time === v ? "" : v)}
        options={TIMES}
        value={f.time}
      />

      <label className="c-field">
        <span className="c-field__label">
          Anything else? <span className="c-field__opt">(optional)</span>
        </span>
        <textarea
          name="message"
          onChange={(e) => set("message", e.target.value)}
          placeholder="Your goals, timelines, or the classes you'd like to start with."
          rows={4}
          value={f.message}
        />
      </label>

      {/* Honeypot: hidden from people, filled by bots. */}
      <label aria-hidden="true" className="c-hp">
        Website
        <input autoComplete="off" name="website" onChange={(e) => set("website", e.target.value)} tabIndex={-1} type="text" value={f.website} />
      </label>

      <p className="c-form__fine">
        We&apos;ll only use these details to arrange your demo. See our <a href="/privacy-policy/">Privacy Policy</a>.
      </p>

      {failure ? (
        <p className="c-form__msg c-form__msg--err" role="alert">
          {failure}
        </p>
      ) : null}

      <button className="c-docbtn c-form__submit" disabled={state === "sending"} type="submit">
        {state === "sending" ? "Sending…" : "Request my demo"}
        <svg aria-hidden="true" className="c-arrow" height="18" viewBox="0 0 20 20" width="18">
          <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
    </form>
  );
}
