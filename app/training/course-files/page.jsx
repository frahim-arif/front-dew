
"use client";

import Link from "next/link";
import {
  FileText,
  Download,
  BookOpen,
  File,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";

export default function CourseFiles() {
  const files = [
    {
      id: 1,
      title: "Course Study Material",
      description: "Complete study notes and learning materials for the course.",
      type: "PDF",
      size: "2.5 MB",
      href: "#",
    },
    {
      id: 2,
      title: "Training Notes",
      description: "Important notes and guidelines for practical hospital training.",
      type: "PDF",
      size: "1.8 MB",
      href: "#",
    },
    {
      id: 3,
      title: "Practical Training Guide",
      description: "Practical training instructions and essential guidelines.",
      type: "PDF",
      size: "3.2 MB",
      href: "#",
    },
    {
      id: 4,
      title: "Course Syllabus",
      description: "Detailed syllabus and topics covered during the training.",
      type: "PDF",
      size: "950 KB",
      href: "#",
    },
  ];

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-16">
      <div className="mx-auto max-w-6xl px-4">

        {/* Header */}
        <div className="mb-12 text-center">

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2 font-semibold text-emerald-700">
            <GraduationCap size={18} />
            Dew Care Hospital Training
          </div>

          <h1 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
            Course Files
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Download course notes, study materials and important training
            resources from Dew Care Hospital.
          </p>

        </div>

        {/* Files */}
        <div className="grid gap-6 md:grid-cols-2">

          {files.map((item) => (
            <div
              key={item.id}
              className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl"
            >

              <div className="flex items-start gap-5">

                {/* File Icon */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                  <FileText size={28} />
                </div>

                {/* Content */}
                <div className="min-w-0 flex-1">

                  <h2 className="text-xl font-bold text-slate-900">
                    {item.title}
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {item.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-sm">

                    <span className="rounded-full bg-red-50 px-3 py-1 font-semibold text-red-600">
                      {item.type}
                    </span>

                    <span className="text-slate-500">
                      {item.size}
                    </span>

                  </div>

                </div>

                {/* Download */}
                <a
                  href={item.href}
                  download
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition hover:bg-emerald-600 hover:text-white"
                  title="Download"
                >
                  <Download size={20} />
                </a>

              </div>

            </div>
          ))}

        </div>

        {/* Empty / Information Box */}
        <div className="mt-12 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center">

          <BookOpen
            size={36}
            className="mx-auto text-emerald-600"
          />

          <h3 className="mt-4 text-xl font-bold text-slate-900">
            Need More Study Materials?
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-slate-600">
            Additional course materials and training resources will be
            available here as they are added by the administration.
          </p>

        </div>

        {/* Back Button */}
        <div className="mt-10 text-center">

          <Link
            href="/training"
            className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-6 py-4 font-semibold text-slate-700 transition hover:bg-slate-100"
          >
            <ArrowLeft size={18} className="mr-2" />
            Back to Training
          </Link>

        </div>

      </div>
    </section>
  );
}
