import Link from "next/link";
import { siteInfo } from "../data/siteData";

export const metadata = {
  title: "About Us | Dew Care Hospital",
  description: "About Dew Care Hospital, Nagaon Assam.",
};

export default function AboutPage() {
  return (
    <main className="overflow-hidden bg-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-sky-950 via-cyan-800 to-emerald-700 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.25),transparent_35%)]" />
        <div className="absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur">
            ABOUT DEW CARE
          </span>

          <h1 className="mt-6 max-w-5xl text-4xl font-black leading-tight md:text-6xl">
            Caring For Life With Trust, Compassion & Modern Healthcare
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-sky-100">
            Dew Care Hospital is committed to providing quality healthcare,
            emergency support and patient-friendly treatment in Nagaon, Assam.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/appointment"
              className="rounded-2xl bg-white px-7 py-4 font-extrabold text-sky-900 shadow-xl transition hover:-translate-y-1"
            >
              Book Appointment
            </Link>

            <Link
              href="/doctors"
              className="rounded-2xl border border-white/25 bg-white/10 px-7 py-4 font-extrabold text-white backdrop-blur transition hover:bg-white/20"
            >
              View Doctors
            </Link>
          </div>
        </div>
      </section>

      {/* Intro */}
      <section className="relative mx-auto grid max-w-7xl gap-12 px-4 py-20 lg:grid-cols-2 lg:items-center">
        <div className="relative">
          <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-br from-cyan-200/60 to-emerald-200/60 blur-2xl" />

          <div className="relative overflow-hidden rounded-[2.5rem] border border-white bg-gradient-to-br from-sky-100 via-white to-emerald-100 p-10 shadow-2xl">
            <div className="flex min-h-[360px] items-center justify-center rounded-[2rem] bg-white/70 text-9xl shadow-inner">
              🏥
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              {["Emergency", "Care", "Trust"].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl bg-white p-4 text-center font-bold text-sky-900 shadow"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <span className="font-extrabold uppercase tracking-[0.25em] text-cyan-600">
            Who We Are
          </span>

          <h2 className="mt-4 text-3xl font-black leading-tight text-sky-950 md:text-5xl">
            A Hospital Built On Care, Safety & Patient Trust
          </h2>

          <p className="mt-6 text-lg leading-8 text-gray-600">
            Dew Care Hospital provides emergency care, general medicine,
            maternity care, diagnostic services, laboratory support and other
            essential healthcare facilities.
          </p>

          <p className="mt-4 text-lg leading-8 text-gray-600">
            Our mission is to make healthcare accessible, affordable and
            dependable for every patient with a warm, family-friendly approach.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              ["24/7", "Emergency"],
              ["Expert", "Doctors"],
              ["Care", "Patient First"],
            ].map(([title, text]) => (
              <div
                key={title}
                className="rounded-3xl border border-sky-100 bg-white p-5 text-center shadow-xl shadow-sky-100 transition hover:-translate-y-1"
              >
                <h3 className="text-3xl font-black text-cyan-700">{title}</h3>
                <p className="mt-1 text-sm font-bold text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Vision Values */}
      <section className="relative bg-gradient-to-b from-sky-50 to-white py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="font-extrabold uppercase tracking-[0.25em] text-cyan-600">
              Our Foundation
            </span>

            <h2 className="mt-4 text-3xl font-black text-sky-950 md:text-5xl">
              Mission, Vision & Values
            </h2>

            <p className="mt-5 text-gray-600">
              Every service at Dew Care Hospital is guided by care, trust and
              responsibility.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: "Our Mission",
                desc: "To provide quality and affordable healthcare with compassion.",
              },
              {
                title: "Our Vision",
                desc: "To become a trusted healthcare destination for families.",
              },
              {
                title: "Our Values",
                desc: "Care, trust, responsibility, safety and patient satisfaction.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-[2rem] border border-sky-100 bg-white p-8 shadow-xl shadow-sky-100 transition hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-800 to-cyan-500 text-3xl text-white shadow-lg">
                  ✦
                </div>

                <h3 className="text-2xl font-black text-sky-950">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-cyan-800 to-emerald-700 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(255,255,255,.22),transparent_35%)]" />

        <div className="relative mx-auto max-w-5xl px-4 text-center">
          <h2 className="text-3xl font-black md:text-5xl">
            Need Appointment?
          </h2>

          <p className="mt-5 text-lg text-sky-100">
            Call us now: {siteInfo.phone}
          </p>

          <Link
            href="/appointment"
            className="mt-8 inline-flex rounded-2xl bg-white px-8 py-4 font-extrabold text-sky-900 shadow-xl transition hover:-translate-y-1 hover:scale-105"
          >
            Book Appointment
          </Link>
        </div>
      </section>
    </main>
  );
}