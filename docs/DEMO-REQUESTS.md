# Demo requests: backend handover

The **Book a demo** page (`/book-a-demo/`) posts to `https://api.clyralabs.com/v1/demo-request/`,
which is live: it saves each lead and emails it to the team.

## What the endpoint must do

When a visitor submits the form, send an email:

- **From:** `no-reply@heyclyra.com`
- **To:** `aditya@heyclyra.com`, `rohit@heyclyra.com`
- **Reply-To:** the visitor's `email`, so replying goes straight to them
- **Subject:** `Demo request: {school} ({full_name})`
- **Body:** every field below, one per line

Sending from `no-reply@heyclyra.com` needs the heyclyra.com domain verified with whichever email
provider the backend uses (SPF/DKIM DNS records), or messages will land in spam.

## Request

`POST {NEXT_PUBLIC_DEMO_ENDPOINT}` with `Content-Type: application/json`. The suggested URL is
`https://api.clyralabs.com/v1/demo-request/`, next to the existing `/v1/career/`.

```json
{
  "full_name": "Priya Sharma",
  "email": "priya@greenfield.edu",
  "role": "Head of department",
  "school": "Greenfield International School",
  "country": "United Arab Emirates",
  "phone": "+971 50 123 4567",
  "school_size": "1,000–3,000",
  "curricula": ["IB", "IGCSE"],
  "interests": ["Homework & marking", "Learning gaps & analytics"],
  "preferred_time": "Afternoon",
  "time_zone": "Asia/Dubai",
  "message": "We'd like to start with Year 9 science.",
  "source_page": "https://heyclyra.com/book-a-demo/"
}
```

| Field | Required | Values |
|---|---|---|
| `full_name`, `email`, `role`, `school` | yes | free text; `role` is one of Teacher, Head of department, Principal / school leader, IT / operations, Tutor / tuition centre, Other |
| `interests` | yes (≥1) | Planning & teaching, Homework & marking, Learning gaps & analytics, Personalised practice, Ask Clyra, Whole-school rollout |
| `country`, `phone`, `school_size`, `curricula`, `preferred_time`, `time_zone`, `message`, `source_page` | no | may be empty strings / empty arrays |

The site validates these fields client-side; the backend should validate them again.

## Response

Success is HTTP 200 with `{ "success": true }`. Every handled failure is `{ "success": false, "message": "…" }`,
and the message is safe to show to the visitor.

| Status | When | What the page does |
|---|---|---|
| 200 | Saved and emailed | Shows the confirmation (only when `success` is `true`) |
| 400 | A field failed validation | Shows `message` |
| 422 | Required field missing, malformed body or wrong type (body is not the success/message shape) | Shows the generic retry line |
| 429 | More than 5 requests from one IP in an hour | Shows `message`; no auto-retry |
| 502 | Saved, but the email failed to send | Shows `message` |
| 500 | Unexpected server error | Shows `message` |

Anything else (network error, non-JSON body) gets the generic retry line.

## Also needed

- **CORS:** allow `POST` from `https://heyclyra.com` and `https://www.heyclyra.com`, with the `Content-Type` header.
- **Spam:** the form has a hidden honeypot field and doesn't send the request when it's filled. Add a per-IP rate limit on the endpoint too (e.g. 5/hour).
- Optional: store each request in the database so leads aren't only in inboxes.

## Turning it on

It is on. `.env.production` sets `NEXT_PUBLIC_DEMO_ENDPOINT`, so every `npm run build` posts to the API.

**Without the variable** (e.g. `npm run dev`), submitting the form opens the visitor's own email app
with a message to aditya@heyclyra.com and rohit@heyclyra.com containing all the details.
