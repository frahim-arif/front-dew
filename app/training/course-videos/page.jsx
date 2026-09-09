
"use client";

import Link from "next/link";
import {
  PlayCircle,
  Clock,
  GraduationCap,
  ArrowLeft,
  Video,
} from "lucide-react";

export default function CourseVideos() {
  const videos = [
    {
      id: 1,
      title: "Introduction to Healthcare Training",
      description:
        "Learn about the training program, hospital environment and basic healthcare practices.",
      duration: "18:25",
      category: "Introduction",
      videoUrl: "#",
    },
    {
      id: 2,
      title: "Basic Patient Care",
      description:
        "Learn the basic principles and procedures involved in patient care.",
      duration: "24:10",
      category: "Patient Care",
      videoUrl: "#",
    },
    {
      id: 3,
      title: "Hospital Safety & Hygiene",
      description:
        "Important hospital safety, hygiene and infection-control practices.",
      duration: "21:45",
      category: "Safety & Hygiene",
      videoUrl: "#",
    },
    {
      id: 4,
      title: "Practical Training Session",
      description:
        "A practical demonstration of essential healthcare training procedures.",
      duration: "32:15",
      category: "Practical",
      videoUrl: "#",
    },
    {
      id: 5,
      title: "Medical Equipment Introduction",
      description:
        "Introduction to commonly used medical equipment and their basic usage.",
      duration: "27:30",
      category: "Equipment",
      videoUrl: "#",
    },
    {
      id: 6,
      title: "Final Training Guidelines",
      description:
        "Important instructions and guidelines to follow before completing the training.",
      duration: "16:40",
      category: "Guidelines",
      videoUrl: "#",
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
            Course Videos
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Watch training videos, practical demonstrations and important
            healthcare learning resources.
          </p>

        </div>

        {/* Video Grid */}
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">

          {videos.map((video) => (
            <div
              key={video.id}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-2xl"
            >

              {/* Video Thumbnail */}
              <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-cyan-700">

                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff20,transparent_55%)]" />

                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-white/95 text-emerald-600 shadow-xl transition duration-300 group-hover:scale-110">
                  <PlayCircle size={52} />
                </div>

                {/* Duration */}
                <div className="absolute bottom-4 right-4 flex items-center gap-1 rounded-lg bg-black/70 px-3 py-1.5 text-sm font-semibold text-white">
                  <Clock size={14} />
                  {video.duration}
                </div>

              </div>

              {/* Content */}
              <div className="p-6">

                <span className="inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">
                  {video.category}
                </span>

                <h2 className="mt-4 text-xl font-bold leading-7 text-slate-900">
                  {video.title}
                </h2>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
                  {video.description}
                </p>

                {/* Button */}
                <a
                  href={video.videoUrl}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-5 py-3.5 font-bold text-white transition hover:scale-[1.02] hover:shadow-lg"
                >
                  <PlayCircle size={20} />
                  Watch Video
                </a>

              </div>

            </div>
          ))}

        </div>

        {/* Information */}
        <div className="mt-12 rounded-3xl border border-emerald-100 bg-emerald-50 p-8 text-center">

          <Video
            size={38}
            className="mx-auto text-emerald-600"
          />

          <h3 className="mt-4 text-xl font-bold text-slate-900">
            More Training Videos Coming Soon
          </h3>

          <p className="mx-auto mt-2 max-w-xl text-slate-600">
            Additional lectures, practical demonstrations and healthcare
            training videos will be added regularly.
          </p>

        </div>

        {/* Back */}
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
