"use client";

import { useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";

import countries from "@/content/countries.json";

/*
 * Careers application. Same contract as the previous heyclyra.com form:
 * POST https://api.clyralabs.com/v1/career/ with the resume as base64 (no data: prefix).
 */
const ENDPOINT = "https://api.clyralabs.com/v1/career/";
const ROLES = ["Engineering", "Product", "Design", "Operations", "Education", "Business Development", "General Application"];

type Country = { name: string; code: string; dial: string };
const COUNTRIES = countries as Country[];

const EMPTY = { fullName: "", email: "", phoneNumber: "", role: "", linkedin: "", portfolio: "", note: "" };
type Fields = typeof EMPTY;
type Errors = Partial<Record<keyof Fields | "resume", string>>;

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",")[1] ?? "");
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function CareersForm() {
  const [fields, setFields] = useState<Fields>(EMPTY);
  const [dial, setDial] = useState("AE");
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [failure, setFailure] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFields((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
    setSent(false);
  };

  const onFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
      setResume(null);
      setErrors((er) => ({ ...er, resume: "Please upload your resume in PDF format." }));
      e.target.value = "";
      return;
    }
    setResume(file);
    setErrors((er) => ({ ...er, resume: undefined }));
  };

  const validate = () => {
    const next: Errors = {};
    if (!fields.fullName.trim()) next.fullName = "Full name is required.";
    if (!fields.email.trim()) next.email = "Email address is required.";
    if (!fields.role.trim()) next.role = "Please choose the role you are applying for.";
    if (!resume) next.resume = "Please upload your resume in PDF format.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(false);
    if (!validate() || !resume) return;
    setSending(true);
    setFailure(null);
    try {
      const country = COUNTRIES.find((c) => c.code === dial) ?? COUNTRIES[0];
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          full_name: fields.fullName,
          email: fields.email,
          country_code: country.dial,
          phone: fields.phoneNumber,
          role: fields.role,
          linkedin: fields.linkedin,
          portfolio: fields.portfolio,
          note: fields.note,
          resume: await toBase64(resume),
          profile_image: "",
        }),
      });
      const data = (await res.json()) as { success?: boolean; message?: string };
      if (data.success) {
        setSent(true);
        setFields(EMPTY);
        setResume(null);
        if (fileRef.current) fileRef.current.value = "";
      } else {
        setFailure(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setFailure("Failed to submit application. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const err = (k: keyof Errors) =>
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
    <form className="c-form" noValidate onSubmit={onSubmit}>
      <div className="c-form__row">
        <label className="c-field">
          <span className="c-field__label">Full name *</span>
          <input autoComplete="name" name="fullName" onChange={onChange} placeholder="Your full name" type="text" value={fields.fullName} {...a11y("fullName")} />
          {err("fullName")}
        </label>
        <label className="c-field">
          <span className="c-field__label">Email address *</span>
          <input autoComplete="email" name="email" onChange={onChange} placeholder="you@example.com" type="email" value={fields.email} {...a11y("email")} />
          {err("email")}
        </label>
      </div>

      <div className="c-form__row">
        <div className="c-field">
          <label className="c-field__label" htmlFor="phoneNumber">
            Phone number
          </label>
          <div className="c-phone">
            <select aria-label="Country code" onChange={(e) => setDial(e.target.value)} value={dial}>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.dial} {c.name}
                </option>
              ))}
            </select>
            <input autoComplete="tel-national" id="phoneNumber" name="phoneNumber" onChange={onChange} placeholder="50 123 4567" type="tel" value={fields.phoneNumber} />
          </div>
        </div>
        <label className="c-field">
          <span className="c-field__label">Role applying for *</span>
          <select name="role" onChange={onChange} value={fields.role} {...a11y("role")}>
            <option disabled value="">
              Select a role
            </option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
          {err("role")}
        </label>
      </div>

      <div className="c-form__row">
        <label className="c-field">
          <span className="c-field__label">LinkedIn profile</span>
          <input name="linkedin" onChange={onChange} placeholder="https://linkedin.com/in/your-profile" type="url" value={fields.linkedin} />
        </label>
        <label className="c-field">
          <span className="c-field__label">Portfolio or website</span>
          <input name="portfolio" onChange={onChange} placeholder="https://yourportfolio.com" type="url" value={fields.portfolio} />
        </label>
      </div>

      <label className="c-field">
        <span className="c-field__label">Why do you want to join Clyra?</span>
        <textarea
          name="note"
          onChange={onChange}
          placeholder="Tell us a little about yourself, your experience, and why this role fits."
          rows={4}
          value={fields.note}
        />
      </label>

      <div className="c-field">
        <span className="c-field__label">Resume upload (PDF only) *</span>
        <label className={errors.resume ? "c-drop c-drop--err" : "c-drop"}>
          <input accept="application/pdf,.pdf" className="c-drop__input" onChange={onFile} ref={fileRef} type="file" {...a11y("resume")} />
          <span className="c-drop__name">{resume ? resume.name : "Choose a PDF"}</span>
          <span className="c-drop__hint">Upload a single PDF file. Ideal for CV, resume, or combined profile document.</span>
        </label>
        {err("resume")}
      </div>

      <p className="c-form__fine">
        By submitting, you confirm the information is accurate and you are happy for the hiring team to review your
        application materials.
      </p>

      {failure ? (
        <p className="c-form__msg c-form__msg--err" role="alert">
          {failure}
        </p>
      ) : null}
      {sent ? (
        <p className="c-form__msg" role="status">
          Thank you. Your application has been sent to the Clyra team.
        </p>
      ) : null}

      <button className="c-docbtn c-form__submit" disabled={sending} type="submit">
        {sending ? "Sending…" : "Submit application"}
        <svg aria-hidden="true" className="c-arrow" height="18" viewBox="0 0 20 20" width="18">
          <path d="M4 10h11M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </button>
    </form>
  );
}
