import Link from "next/link";
import {
  FileText,
  GraduationCap,
  FolderOpen,
  PlayCircle,
} from "lucide-react";

const items = [
  {
    title: "Training Application Form",
    description: "Apply online for our professional healthcare training.",
    icon: FileText,
    href: "/training/application-form",
  },
  {
    title: "Training Courses",
    description: "Browse all available training programs.",
    icon: GraduationCap,
    href: "/training/courses",
  },
  {
    title: "Course Files",
    description: "Download notes, PDFs and study materials.",
    icon: FolderOpen,
    href: "/training/course-files",
  },
  {
    title: "Course Videos",
    description: "Watch recorded lectures and practical sessions.",
    icon: PlayCircle,
    href: "/training/course-videos",
  },
];

export default function TrainingPage() {
  return (
    <section className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <span className="rounded-full bg-emerald-100 px-5 py-2 text-sm font-semibold text-emerald-700">
            Dew Care Hospital Training
          </span>

          <h1 className="mt-5 text-4xl font-black text-slate-900 md:text-5xl">
            Professional Healthcare Training
          </h1>

          <p className="mt-4 text-lg text-slate-600">
            Apply for training, explore available courses, access study
            materials, and watch training videos.
          </p>
        </div>
        {/* Hero */}

<section className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-cyan-700 to-sky-900 py-24">

  <div className="mx-auto max-w-7xl px-4">

    <div className="max-w-3xl">

      <span className="rounded-full bg-white/20 px-5 py-2 text-white">
        Dew Care Hospital
      </span>

      <h1 className="mt-6 text-5xl font-black text-white">
        Healthcare Training Institute
      </h1>

      <p className="mt-6 text-lg text-cyan-100">
        Learn professional healthcare skills through
        certified training programs.
      </p>

      <Link
        href="/training/courses"
        className="mt-8 inline-flex rounded-2xl bg-white px-7 py-4 font-bold text-emerald-700"
      >
        Explore Courses
      </Link>

    </div>

  </div>

</section>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-3xl border border-emerald-100 bg-white p-8 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:border-emerald-500 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <Icon size={32} />
                </div>

                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {item.description}
                </p>

                <div className="mt-8 font-bold text-emerald-700 group-hover:translate-x-1 transition">
                  Explore →
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}