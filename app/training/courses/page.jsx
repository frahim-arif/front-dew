"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  Clock3,
  BadgeIndianRupee,
  GraduationCap,
  UserRound,
  ArrowRight,
  Star,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const SERVER = API.replace("/api", "");

export default function TrainingCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    setFilteredCourses(
      courses.filter((item) =>
        item.title
          ?.toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [search, courses]);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/training/courses`
      );

      const data = await res.json();

      if (data.success) {
        setCourses(data.data || []);
        setFilteredCourses(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <section className="bg-gradient-to-br from-emerald-700 via-cyan-700 to-sky-900 py-24">

  <div className="mx-auto max-w-7xl px-4">

    <div className="mx-auto max-w-4xl text-center">

      <span className="rounded-full bg-white/20 px-6 py-2 font-bold text-white">

        Dew Care Hospital Training

      </span>

      <h1 className="mt-6 text-5xl font-black text-white">

        Healthcare Training Courses

      </h1>

      <p className="mx-auto mt-5 max-w-3xl text-lg text-cyan-100">

        Choose the right healthcare training program
        and start your professional career.

      </p>

      <div className="mx-auto mt-10 max-w-xl">

        <div className="flex items-center rounded-2xl bg-white px-5 shadow-xl">

          <Search
            className="text-gray-400"
            size={22}
          />

          <input
            type="text"
            value={search}
            onChange={(e)=>
              setSearch(e.target.value)
            }
            placeholder="Search Course..."
            className="w-full bg-transparent px-4 py-5 outline-none"
          />

        </div>

      </div>

    </div>

  </div>

</section>
<section className="bg-slate-50 py-20">

<div className="mx-auto max-w-7xl px-4">

<div className="mb-12 flex items-center justify-between">

<div>

<h2 className="text-4xl font-black text-slate-900">

Available Courses

</h2>

<p className="mt-2 text-slate-500">

{filteredCourses.length} Courses Found

</p>

</div>

</div>

<div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
{loading ? (
  <div className="col-span-full py-20 text-center">
    Loading Courses...
  </div>
) : filteredCourses.length === 0 ? (
  <div className="col-span-full py-20 text-center text-gray-500">
    No Courses Found
  </div>
) : (
  filteredCourses.map((course) => (
    <div
      key={course._id}
      className="group overflow-hidden rounded-3xl bg-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
    >
      {/* Image */}

      <div className="relative h-60 overflow-hidden">

        <Image
          src={
            course.image
              ? course.image.startsWith("/uploads")
                ? SERVER + course.image
                : course.image
              : "/images/course-placeholder.jpg"
          }
          alt={course.title}
          fill
          className="object-cover transition duration-500 group-hover:scale-110"
        />

        {course.featured && (
          <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-slate-900">
            <Star size={14} fill="currentColor" />
            Featured
          </div>
        )}

      </div>

      {/* Content */}

      <div className="p-7">

        <h3 className="text-2xl font-bold text-slate-900">
          {course.title}
        </h3>

        <p className="mt-3 line-clamp-2 text-slate-600">
          {course.shortDescription}
        </p>

        <div className="mt-6 space-y-3 text-sm">

          <div className="flex items-center gap-2">
            <Clock3 size={18} className="text-emerald-600" />
            {course.duration}
          </div>

          <div className="flex items-center gap-2">
            <BadgeIndianRupee
              size={18}
              className="text-emerald-600"
            />
            ₹{course.fees}
          </div>

          <div className="flex items-center gap-2">
            <GraduationCap
              size={18}
              className="text-emerald-600"
            />
            {course.eligibility}
          </div>

          <div className="flex items-center gap-2">
            <UserRound
              size={18}
              className="text-emerald-600"
            />
            {course.instructor}
          </div>

        </div>

        <div className="mt-8 flex gap-3">

          <Link
            href={`/training/courses/${course.slug}`}
            className="flex-1 rounded-xl bg-slate-900 px-5 py-3 text-center font-bold text-white transition hover:bg-black"
          >
            Details
          </Link>

          <Link
            href={`/training/application-form?course=${course._id}`}
            className="flex items-center justify-center rounded-xl bg-emerald-600 px-5 py-3 font-bold text-white transition hover:bg-emerald-700"
          >
            Apply
            <ArrowRight className="ml-2" size={18} />
          </Link>

        </div>

      </div>
    </div>
  ))
)}
</div>

</div>
</section>

</>
);
}