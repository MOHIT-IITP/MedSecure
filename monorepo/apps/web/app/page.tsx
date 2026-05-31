import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 via-white to-slate-50">
      <header className="mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-semibold text-teal-800">MedSecure</span>
        <div className="flex gap-3 text-sm font-medium">
          <Link href="/login" className="text-slate-700 hover:text-teal-700">
            Log in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-teal-600 px-4 py-2 text-white hover:bg-teal-700"
          >
            Sign up
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          Your health records, one scan away
        </h1>
        <p className="mt-4 text-lg text-slate-600">
          Store medical reports, track daily vitals, and share emergency info via a
          secure QR code — built for patients, doctors, and first responders.
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Link
            href="/signup"
            className="rounded-lg bg-teal-600 px-6 py-3 font-medium text-white hover:bg-teal-700"
          >
            Get started free
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-800 hover:bg-slate-50"
          >
            I have an account
          </Link>
        </div>

        <ul className="mt-16 grid gap-4 text-left sm:grid-cols-3">
          {[
            {
              title: "Secure vault",
              desc: "Upload PDFs and images; access only when you are signed in.",
            },
            {
              title: "Daily logs",
              desc: "Blood pressure, sugar, pulse, weight, and notes over time.",
            },
            {
              title: "Emergency QR",
              desc: "Token-based public view — no raw user IDs, read-only sharing.",
            },
          ].map((item) => (
            <li
              key={item.title}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <h2 className="font-semibold text-slate-900">{item.title}</h2>
              <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
