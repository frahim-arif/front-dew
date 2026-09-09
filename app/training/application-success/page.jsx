"use client";

import Link from "next/link";
import {
  CheckCircle2,
  ArrowRight,
  Home,
  GraduationCap,
  Phone,
  Mail,
} from "lucide-react";

export default function ApplicationSuccessPage() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-20">

      {/* Background */}

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#10b98120,transparent_35%)]" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,#06b6d420,transparent_35%)]" />

      <div className="relative mx-auto max-w-3xl px-4">

        <div className="overflow-hidden rounded-[35px] bg-white shadow-[0_25px_70px_rgba(0,0,0,0.12)]">

          {/* Header */}

          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-cyan-700 px-8 py-14 text-center">

            <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-xl">

              <CheckCircle2
                size={70}
                className="text-emerald-600"
              />

            </div>

            <h1 className="mt-8 text-4xl font-black text-white md:text-5xl">
              Application Submitted
            </h1>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-emerald-100">
              Your training application has been submitted successfully.
              Our admission team will review your application and contact
              you shortly.
            </p>

          </div>

          {/* Body */}

          <div className="p-8 md:p-12">

            <div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-8">

              <div className="flex items-center gap-3">

                <GraduationCap className="text-emerald-600" />

                <h2 className="text-2xl font-bold text-slate-900">
                  What Happens Next?
                </h2>

              </div>

              <div className="mt-8 space-y-5">

                <div className="flex items-start gap-4">

                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
                    1
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Application Review
                    </h3>

                    <p className="mt-1 text-slate-600">
                      Our admission team will verify your submitted
                      information.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
                    2
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Phone Call / Email
                    </h3>

                    <p className="mt-1 text-slate-600">
                      You will receive a confirmation call or email with
                      further admission details.
                    </p>
                  </div>

                </div>

                <div className="flex items-start gap-4">

                  <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 font-bold text-white">
                    3
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900">
                      Complete Admission
                    </h3>

                    <p className="mt-1 text-slate-600">
                      Visit Dew Care Hospital with your original documents
                      to complete the admission process.
                    </p>
                  </div>

                </div>

              </div>

            </div>

            {/* Contact */}

            <div className="mt-10 rounded-3xl border border-slate-200 p-8">

              <h3 className="text-2xl font-bold text-slate-900">
                Need Help?
              </h3>

              <div className="mt-6 space-y-4">

                <div className="flex items-center gap-3">

                  <Phone
                    size={20}
                    className="text-emerald-600"
                  />

                  <span className="text-slate-700">
                    +91 91901988910
                  </span>

                </div>

                <div className="flex items-center gap-3">

                  <Mail
                    size={20}
                    className="text-emerald-600"
                  />

                  <span className="text-slate-700">
                    info@dewcarehospital.com
                  </span>

                </div>

              </div>

            </div>

            {/* Buttons */}

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">

              <Link
                href="/training"
                className="flex flex-1 items-center justify-center rounded-2xl border border-slate-300 px-6 py-4 font-bold text-slate-700 transition hover:bg-slate-100"
              >

                <ArrowRight
                  size={20}
                  className="mr-2"
                />

                View More Courses

              </Link>

              <Link
                href="/"
                className="flex flex-1 items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-4 font-bold text-white transition hover:scale-[1.02]"
              >

                <Home
                  size={20}
                  className="mr-2"
                />

                Back To Home

              </Link>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}