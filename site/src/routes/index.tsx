import { createFileRoute } from "@tanstack/react-router";

import { SignupForm, type SignupField } from "~/components/signup-form";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ProcessProof — the people who rebuild how a company works" },
      {
        name: "description",
        content:
          "ProcessProof connects companies whose processes have broken — after a failed audit, a certification or surveillance deadline, or a customer or tender that requires their certificate — with process and quality assurance professionals who audit, rebuild and prove the fix. Sign up on either side.",
      },
    ],
  }),
  component: Home,
});

const PROFESSIONAL_FIELDS: SignupField[] = [
  { name: "name", label: "Your name", kind: "text", required: true, autoComplete: "name" },
  {
    name: "email",
    label: "Email",
    kind: "email",
    required: true,
    autoComplete: "email",
    placeholder: "you@example.com",
  },
  {
    name: "years",
    label: "Years of experience",
    kind: "text",
    required: true,
    placeholder: "e.g. 6",
  },
  {
    name: "specialty",
    label: "Your specialty",
    kind: "text",
    required: true,
    placeholder: "e.g. manufacturing quality, clinical operations, logistics",
  },
  {
    name: "note",
    label: "The worst process you've fixed",
    hint: "What was broken, what you changed, and what happened next. A few sentences is plenty.",
    kind: "textarea",
    required: true,
    maxLength: 1000,
  },
];

const COMPANY_FIELDS: SignupField[] = [
  { name: "name", label: "Your name", kind: "text", required: true, autoComplete: "name" },
  {
    name: "email",
    label: "Work email",
    kind: "email",
    required: true,
    autoComplete: "email",
    placeholder: "you@company.com",
  },
  {
    name: "company",
    label: "Company",
    kind: "text",
    required: true,
    autoComplete: "organization",
  },
  { name: "role", label: "Your role", kind: "text", required: true, placeholder: "e.g. Operations lead" },
  {
    name: "note",
    label: "What's broken",
    hint: "The process that keeps costing you time, money or customers. A few sentences is plenty.",
    kind: "textarea",
    required: true,
    maxLength: 1000,
  },
];

const STEPS = [
  {
    title: "Audit",
    body: "Map how the work actually flows — not how the org chart says it flows — and find the points where it breaks.",
  },
  {
    title: "Rebuild",
    body: "Redesign the process, train the people who run it, and document it so it survives staff changes.",
  },
  {
    title: "Prove it",
    body: "Measure before and after on the numbers that matter, so the improvement holds instead of quietly sliding back.",
  },
];

const FOR_PROFESSIONALS = [
  "You walk into a mess, find the real cause, and leave the process working.",
  "The hard part isn't the work — it's knowing who to get the work through, and what to charge for it.",
  "Tell us your specialty and the worst process you've fixed.",
  "We come back to you when a company needs exactly that — and we're straight with you about what the work is worth.",
];

const FOR_COMPANIES = [
  "An audit came back with findings, a certification or surveillance deadline is close, or a customer or a tender requires your certificate.",
  "Behind it, the symptoms are usually workarounds and nobody being sure who owns a step.",
  "One professional audits the process, rebuilds it, and trains your team.",
  "You get the before-and-after numbers, so you can see it worked.",
];

function Home() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <header className="border-b border-slate-200">
        <nav
          aria-label="Main"
          className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-6 py-4"
        >
          <span className="text-lg font-semibold tracking-tight">ProcessProof</span>
          <div className="flex gap-5 text-sm font-medium">
            <a className="text-slate-700 underline-offset-4 hover:underline" href="#qa-professionals">
              I fix processes for a living
            </a>
            <a className="text-slate-700 underline-offset-4 hover:underline" href="#company">
              My company needs this
            </a>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-6 pt-14 pb-12 sm:pt-20">
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
            Your process is broken. We'll find where, rebuild it, and prove it held.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-700">
            ProcessProof is the front door for both sides of that work: process and quality assurance
            professionals who find why a company's processes break — quality managers, compliance
            consultants, lean and Six Sigma practitioners, interim managers — and the companies that
            need them fixed. Tell us which side you're on and the founder will get back to you.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#qa-professionals"
              className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-6 py-3 text-base font-semibold text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              I fix processes for a living
            </a>
            <a
              href="#company"
              className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-6 py-3 text-base font-semibold text-slate-900 transition hover:border-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              My company needs this
            </a>
          </div>
          <p className="mt-4 text-sm text-slate-600">
            We're new — there is no list of professionals here yet. Signups go to the founder.
          </p>
        </section>

        {/* How it works */}
        <section aria-labelledby="how-it-works" className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <h2 id="how-it-works" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              How it works
            </h2>
            <p className="mt-3 max-w-2xl text-slate-700">
              Every job runs the same way, and the last step is why you don't have to take our word
              for it.
            </p>
            <ol className="mt-9 grid gap-6 sm:grid-cols-3">
              {STEPS.map((step, index) => (
                <li key={step.title} className="rounded-xl border border-slate-200 bg-white p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                  <p className="mt-2 text-slate-700">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Who it's for */}
        <section aria-labelledby="who-its-for" className="mx-auto max-w-5xl px-6 py-14">
          <h2 id="who-its-for" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Who it's for
          </h2>
          <div className="mt-9 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold">For process and quality professionals</h3>
              <p className="mt-2 text-slate-700">
                If your job is to overhaul how a company works, the hard parts usually aren't the
                work itself: they're knowing who to get that work through, and knowing what your
                expertise is worth. Tell us what you're good at and we'll do both — bring you work
                that matches your specialty, and give you a straight answer on what it's worth.
              </p>
              <p className="mt-4 text-slate-700">
                The Institute of Interim Management's most recent annual survey of interim managers
                puts the average interim day rate at £907 (£1,004 in the private sector) — a general
                interim benchmark, not a rate for process or quality work specifically.
              </p>
              <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-slate-700">
                {FOR_PROFESSIONALS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-slate-200 p-6">
              <h3 className="text-lg font-semibold">For companies</h3>
              <p className="mt-2 text-slate-700">
                This work usually starts with something specific going wrong — a failed audit, a
                certification or surveillance deadline, or a customer or a tender that requires your
                certificate — not with a general wish to be more efficient. We find the break and
                rebuild it.
              </p>
              <ul className="mt-4 flex list-disc flex-col gap-2 pl-5 text-slate-700">
                {FOR_COMPANIES.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-4 text-slate-700">
                There's no rate card: every engagement is scoped first and priced for that specific
                mess. And the total is more than a consultant's fee — budget for your own staff's
                time on process mapping, training and keeping evidence, and for any
                certification-body or audit fees.
              </p>
            </div>
          </div>
        </section>

        {/* Signups */}
        <section aria-labelledby="signup" className="border-y border-slate-200 bg-slate-50">
          <div className="mx-auto max-w-5xl px-6 py-14">
            <h2 id="signup" className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Add your name
            </h2>
            <p className="mt-3 max-w-2xl text-slate-700">
              Two lists. Pick yours — it takes a minute, and it's the fastest way to get a reply
              from us.
            </p>

            <div className="mt-9 grid gap-8 md:grid-cols-2">
              <div
                id="qa-professionals"
                className="scroll-mt-8 rounded-xl border border-slate-200 bg-white p-6"
              >
                <h3 className="text-xl font-semibold">I fix processes for a living</h3>
                <p className="mt-2 text-slate-700">
                  Tell us what you're good at and what you've fixed before. We'll contact you when a
                  company needs your specialty, and we'll tell you plainly what that work is worth.
                </p>
                <div className="mt-6">
                  <SignupForm
                    kind="professional"
                    fields={PROFESSIONAL_FIELDS}
                    submitLabel="Add me to the professional list"
                  />
                </div>
              </div>

              <div id="company" className="scroll-mt-8 rounded-xl border border-slate-200 bg-white p-6">
                <h3 className="text-xl font-semibold">My company needs this</h3>
                <p className="mt-2 text-slate-700">
                  Tell us what broke — a failed audit, a certification or surveillance deadline, or
                  a customer or a tender that requires your certificate. We'll contact you to work
                  out whether an audit is worth it, and what it would take.
                </p>
                <div className="mt-6">
                  <SignupForm kind="company" fields={COMPANY_FIELDS} submitLabel="Request a process audit" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Where we are */}
        <section aria-labelledby="where-we-are" className="mx-auto max-w-5xl px-6 py-14">
          <h2 id="where-we-are" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Where we are
          </h2>
          <div className="mt-5 max-w-2xl flex flex-col gap-4 text-slate-700">
            <p>
              ProcessProof is brand new. There are no listings, no matches and no case studies on
              this page yet — the signups on it are the first ones we've collected, on either side.
            </p>
            <p>
              Every signup is read by the founder, by hand. Nothing is automated, nothing is sold or
              shared with anyone else, and you won't be added to a mailing list: we write when
              there's something real to say, and we stop the moment you ask us to.
            </p>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200">
        <div className="mx-auto max-w-5xl px-6 py-8 text-sm text-slate-600">
          <p className="font-medium text-slate-900">ProcessProof</p>
          <p className="mt-1">Process and quality overhaul, matched by specialty.</p>
        </div>
      </footer>
    </div>
  );
}
