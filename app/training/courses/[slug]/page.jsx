"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import {
  Clock3,
  BadgeIndianRupee,
  GraduationCap,
  UserRound,
  Users,
  ArrowRight,
  CheckCircle2,
  BookOpen,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const SERVER = API.replace("/api", "");

export default function CourseDetailsPage() {
  const { slug } = useParams();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchCourse();
    }
  }, [slug]);

  const fetchCourse = async () => {
    try {
      const res = await fetch(
        `${API}/training/courses/slug/${slug}`
      );

      const data = await res.json();

      if (data.success) {
        setCourse(data.data);
      } else {
        setCourse(null);
      }
    } catch (err) {
      console.error(err);
      setCourse(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">

          <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>

          <h2 className="mt-6 text-3xl font-bold text-slate-900">
            Loading Course...
          </h2>

          <p className="mt-3 text-slate-500">
            Please wait while loading course details.
          </p>

        </div>
      </section>
    );
  }

  if (!course) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-slate-50 px-4">

        <div className="max-w-xl text-center">

          <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-full bg-red-100">

            <BookOpen
              size={56}
              className="text-red-500"
            />

          </div>

          <h1 className="mt-8 text-5xl font-black text-slate-900">
            Course Not Found
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            The requested training course does not exist
            or has been removed.
          </p>

          <Link
            href="/training"
            className="mt-10 inline-flex items-center rounded-2xl bg-emerald-600 px-8 py-4 font-bold text-white transition hover:bg-emerald-700"
          >
            Back To Courses

            <ArrowRight
              className="ml-2"
              size={20}
            />
          </Link>

        </div>

      </section>
    );
  }

  const imageUrl =
    course.image && course.image !== ""
      ? course.image.startsWith("/uploads")
        ? SERVER + course.image
        : course.image
      : "/images/training-default.jpg";

  return (
    <section className="bg-slate-50">

      {/* HERO */}

      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-700 via-cyan-700 to-sky-900">

        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,white,transparent_60%)]"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-24">

          <div className="grid items-center gap-16 lg:grid-cols-2">

            {/* LEFT */}

            <div>

              <span className="inline-flex rounded-full bg-white/20 px-5 py-2 text-sm font-bold tracking-wide text-white backdrop-blur">
                Dew Care Hospital Training
              </span>

              <h1 className="mt-8 text-5xl font-black leading-tight text-white lg:text-6xl">
                {course.title}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-9 text-cyan-100">
                {course.shortDescription}
              </p>

              <div className="mt-12 grid gap-5 sm:grid-cols-2">
                {/* Card 1 */}

<div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">

  <Clock3
    className="mb-3 text-white"
    size={28}
  />

  <p className="text-sm text-cyan-100">
    Duration
  </p>

  <h3 className="mt-2 text-2xl font-bold text-white">
    {course.duration}
  </h3>

</div>

{/* Card 2 */}

<div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">

  <BadgeIndianRupee
    className="mb-3 text-white"
    size={28}
  />

  <p className="text-sm text-cyan-100">
    Course Fee
  </p>

  <h3 className="mt-2 text-2xl font-bold text-white">
    ₹{course.fees}
  </h3>

</div>

{/* Card 3 */}

<div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">

  <GraduationCap
    className="mb-3 text-white"
    size={28}
  />

  <p className="text-sm text-cyan-100">
    Eligibility
  </p>

  <h3 className="mt-2 text-xl font-bold text-white">
    {course.eligibility}
  </h3>

</div>

{/* Card 4 */}

<div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">

  <Users
    className="mb-3 text-white"
    size={28}
  />

  <p className="text-sm text-cyan-100">
    Seats Available
  </p>

  <h3 className="mt-2 text-2xl font-bold text-white">
    {course.seats}
  </h3>

</div>

</div>

</div>

{/* ================= RIGHT ================= */}

<div className="relative">

  <div className="relative h-[560px] overflow-hidden rounded-[35px] bg-white shadow-[0_30px_70px_rgba(0,0,0,0.25)]">

    <Image
      src={imageUrl}
      alt={course.title}
      fill
      priority
      className="object-cover"
    />

  </div>

  {/* Instructor Card */}

  <div className="absolute -bottom-8 left-1/2 w-[92%] -translate-x-1/2 rounded-3xl bg-white p-6 shadow-2xl">

    <div className="flex items-center justify-between">

      <div>

        <p className="text-sm text-slate-500">
          Course Instructor
        </p>

        <h3 className="mt-2 text-2xl font-bold text-slate-900">
          {course.instructor || "Dew Care Faculty"}
        </h3>

      </div>

      <div className="rounded-full bg-emerald-100 p-5">

        <UserRound
          size={34}
          className="text-emerald-700"
        />

      </div>

    </div>

  </div>

</div>

</div>

</div>

</section>

{/* ================= DETAILS ================= */}

<section className="py-24">

<div className="mx-auto max-w-7xl px-4">

<div className="grid gap-12 lg:grid-cols-3">

<div className="lg:col-span-2">
    <h2 className="mb-8 text-4xl font-black text-slate-900">
  Course Description
</h2>

<div className="rounded-3xl bg-white p-10 shadow-xl">

  <p className="whitespace-pre-line text-lg leading-9 text-slate-600">
    {course.description}
  </p>

</div>

</div>

{/* ================= RIGHT SIDEBAR ================= */}

<div>

<div className="sticky top-28 rounded-3xl bg-white p-8 shadow-2xl">

<h3 className="text-3xl font-black text-slate-900">
Enroll Now
</h3>

<p className="mt-3 leading-7 text-slate-600">
Begin your healthcare career with Dew Care Hospital &
Research Centre.
</p>

<div className="mt-8 space-y-5">

<div className="flex items-center gap-3">

<CheckCircle2
className="text-emerald-600"
size={22}
/>

<span className="font-medium">
Duration : {course.duration}
</span>

</div>

<div className="flex items-center gap-3">

<CheckCircle2
className="text-emerald-600"
size={22}
/>

<span className="font-medium">
Course Fee : ₹{course.fees}
</span>

</div>

<div className="flex items-center gap-3">

<CheckCircle2
className="text-emerald-600"
size={22}
/>

<span className="font-medium">
Eligibility : {course.eligibility}
</span>

</div>

<div className="flex items-center gap-3">

<CheckCircle2
className="text-emerald-600"
size={22}
/>

<span className="font-medium">
Available Seats : {course.seats}
</span>

</div>

<div className="flex items-center gap-3">

<CheckCircle2
className="text-emerald-600"
size={22}
/>

<span className="font-medium">
Instructor : {course.instructor}
</span>

</div>

</div>

<Link
href={`/training/application-form?course=${course._id}`}
className="mt-10 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-6 py-4 text-lg font-bold text-white transition duration-300 hover:scale-[1.02] hover:shadow-xl"
>

Apply Now

<ArrowRight
className="ml-2"
size={20}
/>

</Link>

<div className="mt-8 rounded-2xl bg-emerald-50 p-5">

<h4 className="font-bold text-emerald-700">
Why Choose Dew Care?
</h4>

<ul className="mt-4 space-y-3 text-sm text-slate-600">

<li>✔ Experienced Medical Faculty</li>

<li>✔ Practical Clinical Training</li>

<li>✔ Modern Hospital Environment</li>

<li>✔ Certificate After Completion</li>

<li>✔ Career Guidance & Support</li>

</ul>

</div>

</div>

</div>

</div>

</div>

</section>

</section>
);
}