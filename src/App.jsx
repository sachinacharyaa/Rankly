import React, { useState } from "react";
import avatarGirl from "./assets/avatars/avatar-girl.svg";
import avatarMan from "./assets/avatars/avatar-man.svg";
import avatarPerson1 from "./assets/avatars/avatar-person-1.svg";
import avatarPerson2 from "./assets/avatars/avatar-person-2.svg";

function RanklyLogo() {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-end gap-[3px]">
        {/* 2nd place – medium, silver star (left) */}
        <div className="relative h-5 w-2.5 rounded-full bg-gradient-to-t from-indigo-800 via-indigo-500 to-violet-400">
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] leading-none text-slate-200">
            ★
          </span>
        </div>
        {/* 1st place – tallest, gold star (middle) */}
        <div className="relative h-7 w-2.5 rounded-full bg-gradient-to-t from-indigo-900 via-indigo-600 to-violet-400">
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] leading-none text-amber-300">
            ★
          </span>
        </div>
        {/* 3rd place – shortest, bronze star (right) */}
        <div className="relative h-4 w-2.5 rounded-full bg-gradient-to-t from-indigo-700 via-indigo-500 to-violet-400">
          <span className="absolute -top-2 left-1/2 -translate-x-1/2 text-[9px] leading-none text-orange-300">
            ★
          </span>
        </div>
      </div>
      <span className="text-base font-semibold tracking-tight text-violet-200">
        Rankly
      </span>
    </div>
  );
}

function Avatar({ src, alt }) {
  return (
    <img
      src={src}
      alt={alt}
      className="h-12 w-12 rounded-full border border-white/15 bg-slate-950/70 shadow-xl shadow-black/30 object-cover"
      loading="lazy"
      draggable="false"
    />
  );
}

function CelebrationModal({ open, onClose, email }) {
  if (!open) return null;

  const confetti = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    left: `${(i * 100) / 18}%`,
    delay: `${(i % 6) * 60}ms`,
    color:
      i % 3 === 0
        ? "bg-amber-200"
        : i % 3 === 1
        ? "bg-pink-300"
        : "bg-indigo-300",
  }));

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center px-6"
      role="dialog"
      aria-modal="true"
      aria-label="Joined waitlist"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />

      {/* Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {confetti.map((c) => (
          <span
            key={c.id}
            className={`absolute top-[-20px] h-3 w-2 rounded-sm ${c.color}`}
            style={{
              left: c.left,
              animation: `confetti-pop 900ms ease-out ${c.delay} both`,
            }}
          />
        ))}
      </div>

      <div className="relative w-full max-w-lg rounded-3xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-2xl shadow-black/40 p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-100">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              You&apos;re in
            </div>
            <h3 className="mt-4 text-2xl sm:text-3xl font-semibold tracking-tight">
              Welcome to the beta waitlist
            </h3>
            <p className="mt-2 text-sm text-white/75">
              We&apos;ll email your invite to{" "}
              <span className="font-semibold text-white">{email}</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/15 bg-slate-950/35 px-3 py-1.5 text-sm text-white/80 hover:text-white hover:bg-slate-950/45 transition-colors"
            aria-label="Close"
          >
            Close
          </button>
        </div>

        <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/35 p-4 text-sm text-white/80">
          <p className="font-semibold text-white/90">What happens next</p>
          <ul className="mt-2 list-disc list-inside space-y-1">
            <li>We&apos;ll invite waitlist users in small batches.</li>
            <li>You&apos;ll get early access + a short setup checklist.</li>
            <li>No OAuth yet Today — just updates and access.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [celebrate, setCelebrate] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        throw new Error(data?.error || "Something went wrong.");
      }

      setSubmitted(true);
      setCelebrate(true);
    } catch (err) {
      setError(err?.message || "Failed to join waitlist.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Clean, simple background */}
      <div className="fixed inset-0 -z-10">
        {/* Soft top-to-bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-slate-950" />
        {/* Subtle central glow behind hero */}
        <div className="pointer-events-none absolute -top-32 left-1/2 h-72 w-[520px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.35),transparent_60%)] blur-3xl opacity-70" />
        {/* Gentle bottom glow */}
        <div className="pointer-events-none absolute bottom-[-120px] left-1/2 h-64 w-[720px] -translate-x-1/2 rounded-[999px] bg-[radial-gradient(circle_at_center,rgba(15,23,42,1),transparent_70%)] opacity-70" />
      </div>

      {/* Top nav */}
      <header className="sticky top-0 z-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl">
            <div className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <RanklyLogo />
              </div>

              <nav className="hidden md:flex items-center gap-6 text-sm text-white/70">
                <a href="#how" className="hover:text-white transition-colors">
                  How it works
                </a>
                <a href="#output" className="hover:text-white transition-colors">
                  Output
                </a>
                <a href="#waitlist" className="hover:text-white transition-colors">
                  Waitlist
                </a>
              </nav>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="inline-flex items-center rounded-full bg-slate-950/80 border border-white/10 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-black/30 hover:bg-slate-950 transition-colors"
                  onClick={() => {
                    const el = document.getElementById("waitlist");
                    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                    const input = document.getElementById("waitlist-email");
                    if (input) input.focus();
                  }}
                >
                  Join beta
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-6 pt-10 pb-20">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          {/* Hero copy */}
          <section className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-white/80 backdrop-blur">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
              See your top 3 work priorities each day — automatically ranked from your inbox.
            </div>

            <h1 className="mt-6 text-[2.6rem] leading-[1.05] sm:text-6xl font-semibold tracking-tight">
              AI Chief of Staff{" "}
              <span className="block text-white/90 mt-2 text-[2.25rem] sm:text-[2.75rem] leading-[1.1]">
                for daily work prioritization.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-white/80 max-w-xl">
              We scan your inbox and surface just{" "}
              <span className="font-semibold text-white">
                top importants that actually move work forward.
              </span>
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3 sm:items-center">
              <button
                type="button"
                className="inline-flex justify-center items-center rounded-full bg-white text-slate-950 px-6 py-3 text-sm font-semibold shadow-xl shadow-black/20 hover:bg-white/90 transition-colors"
                onClick={() => {
                  const el = document.getElementById("waitlist");
                  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
                  const input = document.getElementById("waitlist-email");
                  if (input) input.focus();
                }}
              >
                Join beta
              </button>

              <a
                href="#output"
                className="inline-flex justify-center items-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white/90 hover:bg-white/10 transition-colors"
              >
                See the output
              </a>
            </div>

            <div id="how" className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs font-semibold text-white/80">Problem</p>
                <p className="mt-2 text-sm text-white/80">
                  Too many emails, too much noise, no clear starting point.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs font-semibold text-white/80">What we do</p>
                <p className="mt-2 text-sm text-white/80">
                  We rank what matters based on urgency, importance, and context.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="text-xs font-semibold text-white/80">Result</p>
                <p className="mt-2 text-sm text-white/80">
                  A daily top 3 focus list — no inbox triage needed.
                </p>
              </div>
            </div>
          </section>

          {/* Visual like reference (orbits + metric) */}
          <section className="lg:col-span-6 lg:pl-10">
            <div className="relative rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8 shadow-2xl shadow-black/30 overflow-hidden">
              <div className="absolute -top-24 -left-24 h-56 w-56 rounded-full bg-pink-500/25 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/25 blur-3xl" />

              <div className="flex items-center justify-between">
                <div className="text-xs font-semibold tracking-wide text-white/70 uppercase">
                  Live preview
                </div>
                <div className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-[0.7rem] text-emerald-100">
                  Auto-ranked from inbox
                </div>
              </div>

              <div className="mt-8 grid place-items-center">
                <div className="relative h-[360px] w-[360px] max-w-full">
                  {/* Rings */}
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="h-[330px] w-[330px] rounded-full border border-white/10" />
                  </div>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="h-[250px] w-[250px] rounded-full border border-white/10" />
                  </div>
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="h-[170px] w-[170px] rounded-full border border-white/10" />
                  </div>

                  {/* Orbit group 1 */}
                  <div className="absolute inset-0 animate-[orbit_26s_linear_infinite]">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[330px] w-[330px]">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Avatar src={avatarMan} alt="Team member" />
                      </div>
                      <div className="absolute right-0 top-1/2 -translate-y-1/2">
                        <Avatar src={avatarGirl} alt="Team member" />
                      </div>
                      <div className="absolute left-0 top-1/2 -translate-y-1/2">
                        <Avatar src={avatarPerson1} alt="Team member" />
                      </div>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                        <Avatar src={avatarPerson2} alt="Team member" />
                      </div>
                    </div>
                  </div>

                  {/* Orbit group 2 (Gmail + Slack) */}
                  <div className="absolute inset-0 animate-[orbit_18s_linear_infinite_reverse]">
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[250px] w-[250px]">
                      <div className="absolute top-5 right-6">
                        <div className="h-10 w-10 rounded-2xl border border-white/15 bg-white/10 shadow-xl shadow-black/30 backdrop-blur flex items-center justify-center">
                          {/* Gmail-style envelope */}
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-5 w-5 text-white/90"
                          >
                            <rect
                              x="3"
                              y="5"
                              width="18"
                              height="14"
                              rx="2"
                              ry="2"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                            />
                            <path
                              d="M4 7.5 12 12.5 20 7.5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                      <div className="absolute bottom-6 left-8">
                        <div className="h-10 w-10 rounded-2xl border border-white/15 bg-white/10 shadow-xl shadow-black/30 backdrop-blur flex items-center justify-center">
                          {/* Slack-style grid */}
                          <svg
                            aria-hidden="true"
                            viewBox="0 0 24 24"
                            className="h-5 w-5"
                          >
                            <rect
                              x="4"
                              y="4"
                              width="6"
                              height="6"
                              rx="1.8"
                              fill="#22c55e"
                            />
                            <rect
                              x="14"
                              y="4"
                              width="6"
                              height="6"
                              rx="1.8"
                              fill="#3b82f6"
                            />
                            <rect
                              x="4"
                              y="14"
                              width="6"
                              height="6"
                              rx="1.8"
                              fill="#f97316"
                            />
                            <rect
                              x="14"
                              y="14"
                              width="6"
                              height="6"
                              rx="1.8"
                              fill="#ec4899"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Center metric */}
                  <div className="absolute inset-0 grid place-items-center">
                    <div className="relative animate-[float_6s_ease-in-out_infinite] rounded-3xl border border-white/10 bg-slate-950/35 backdrop-blur px-8 py-7 text-center shadow-2xl shadow-black/30">
                      <div className="text-5xl font-semibold tracking-tight">Top 3</div>
                      <div className="mt-1 text-sm text-white/70">
                        priorities, every morning
                      </div>
                      <div className="mt-4 text-xs text-white/60">
                        ranked from your inbox
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Output snippet */}
              <div id="output" className="mt-8 rounded-2xl border border-white/10 bg-slate-950/40 p-5 backdrop-blur">
                <div className="text-xs font-semibold tracking-wide text-white/70 uppercase">
                  Today&apos;s Priorities
                </div>
                <ol className="mt-3 space-y-2 text-sm text-white/85">
                  <li className="flex gap-3">
                    <span className="text-white/50">1.</span>
                    Reply to client proposal
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white/50">2.</span>
                    Review onboarding doc
                  </li>
                  <li className="flex gap-3">
                    <span className="text-white/50">3.</span>
                    Fix login bug
                  </li>
                </ol>
              </div>
            </div>
          </section>
        </div>

        {/* Waitlist */}
        <section id="waitlist" className="mt-14">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-10 shadow-2xl shadow-black/30">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div>
                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                  Join the early beta
                </h2>
                <p className="mt-2 text-white/75 max-w-2xl">
                   No OAuth yet, Just tell us where to send your invite.
                </p>
              </div>

              <form
                onSubmit={handleSubmit}
                className="flex flex-row flex-nowrap gap-2 items-center w-full lg:w-auto"
              >
                <input
                  id="waitlist-email"
                  type="email"
                  required
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-w-0 flex-1 sm:flex-none sm:w-[320px] rounded-full border border-white/10 bg-slate-950/35 px-5 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:border-white/25 focus:ring-2 focus:ring-white/20"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="shrink-0 whitespace-nowrap inline-flex justify-center items-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-xl shadow-black/20 hover:bg-white/90 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                >
                  {submitting ? "Joining..." : submitted ? "You’re on the list" : "Join beta"}
                </button>
              </form>
            </div>

            {error ? (
              <p className="mt-4 text-sm text-rose-200/90">
                {error}
              </p>
            ) : null}

            <div className="mt-6 grid gap-3 sm:grid-cols-3 text-sm text-white/75">
              <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                <p className="font-semibold text-white/85">Too many emails</p>
                <p className="mt-1">Turn volume into a ranked focus list.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                <p className="font-semibold text-white/85">Too noise</p>
                <p className="mt-1">Stop reacting. Start executing.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-slate-950/25 p-4">
                <p className="font-semibold text-white/85">Hard to decide</p>
                <p className="mt-1">Get clarity in under 10 seconds.</p>
              </div>
            </div>

            <p className="mt-6 text-xs text-white/55">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 pb-6 text-xs text-white/55">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <p>© {new Date().getFullYear()} Rankly. All rights reserved.</p>
            <div className="flex gap-4">
              <a className="hover:text-white/80" href="#how">
                How it works
              </a>
              <a className="hover:text-white/80" href="#waitlist">
                Waitlist
              </a>
            </div>
          </div>
        </footer>
      </main>

      <CelebrationModal
        open={celebrate}
        onClose={() => setCelebrate(false)}
        email={email}
      />
    </div>
  );
}

