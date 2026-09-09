"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  GraduationCap,
  User,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  FileText,
  CheckCircle2,
  ArrowLeft,
  Loader2,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function TrainingApplicationForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("course");

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loading, setLoading] = useState(false);

  const [success, setSuccess] = useState("");


  const [form, setForm] = useState({
    course: "",
    name: "",
    fatherName: "",
    motherName: "",
    gender: "",
    dob: "",
    phone: "",
    alternatePhone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    qualification: "",
    institute: "",
    passingYear: "",
    aadhaar: "",
  });


  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API}/training/courses`);

      const data = await res.json();

      if (data.success) {
        setCourses(data.data);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (!courseId || courses.length === 0) return;

    const course = courses.find((c) => c._id === courseId);

    if (course) {
      setSelectedCourse(course);

      setForm((prev) => ({
        ...prev,
        course: course._id,
      }));
    }
  }, [courseId, courses]);

  const loadCourses = async () => {
    try {
      const res = await fetch(`${API}/training/courses`);
      const data = await res.json();

      if (data.success) {
        setCourses(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingCourses(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "course") {
      const found = courses.find((c) => c._id === value);
      setSelectedCourse(found || null);
    }
  };

  const submitForm = async (e) => {
    e.preventDefault();

    setLoading(true);
    setSuccess("");

    try {
      const res = await fetch(`${API}/training/applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      setSuccess("Application submitted successfully.");

      setTimeout(() => {
        router.push("/training/application-success");
      }, 1200);
    } catch (err) {
      alert(err.message);
    }

    setLoading(false);
  };
  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50 py-16">

      <div className="mx-auto max-w-6xl px-4">

        {/* Heading */}

        <div className="mb-12 text-center">

          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-5 py-2 font-semibold text-emerald-700">

            <GraduationCap size={18} />

            Dew Care Hospital Training

          </div>

          <h1 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
            Training Application Form
          </h1>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Complete the form below to apply for your preferred
            healthcare training program.
          </p>

        </div>

        <div className="grid gap-10 lg:grid-cols-3">

          {/* LEFT */}

          <div className="lg:col-span-2">

            <form
              onSubmit={submitForm}
              className="rounded-[30px] bg-white p-8 shadow-2xl"
            >

              {success && (
                <div className="mb-8 flex items-center gap-3 rounded-2xl bg-green-50 p-5 text-green-700">

                  <CheckCircle2 />

                  {success}

                </div>
              )}

              {/* Course */}

              <div className="mb-7">

                <label className="mb-2 block font-bold text-slate-700">
                  Select Training Course
                </label>

                <select
                  name="course"
                  value={form.course}
                  onChange={handleChange}
                  required
                  disabled={loadingCourses}
                  className="w-full rounded-2xl border border-slate-300 px-5 py-4 outline-none transition focus:border-emerald-600"
                >

                  <option value="">
                    {loadingCourses
                      ? "Loading Courses..."
                      : "Choose Course"}
                  </option>

                  {courses.map((course) => (
                    <option
                      key={course._id}
                      value={course._id}
                    >
                      {course.title}
                    </option>
                  ))}

                </select>

              </div>

           {/* ================= Personal Information ================= */}

<div className="grid gap-6 md:grid-cols-2">

  {/* Full Name */}

  <div>
    <label className="mb-2 block font-bold">
      Full Name <span className="text-red-500">*</span>
    </label>

    <div className="relative">
      <User
        size={18}
        className="absolute left-4 top-4 text-slate-400"
      />

      <input
        type="text"
        name="name"
        value={form.name}
        onChange={handleChange}
        required
        placeholder="Enter full name"
        className="w-full rounded-2xl border pl-12 pr-4 py-4 outline-none focus:border-emerald-600"
      />
    </div>
  </div>

  {/* Phone */}

  <div>
    <label className="mb-2 block font-bold">
      Phone Number <span className="text-red-500">*</span>
    </label>

    <div className="relative">
      <Phone
        size={18}
        className="absolute left-4 top-4 text-slate-400"
      />

      <input
        type="text"
        name="phone"
        value={form.phone}
        onChange={handleChange}
        required
        placeholder="Phone Number"
        className="w-full rounded-2xl border pl-12 pr-4 py-4 outline-none focus:border-emerald-600"
      />
    </div>
  </div>

  {/* Father Name */}

  <div>
    <label className="mb-2 block font-bold">
      Father Name
    </label>

    <div className="relative">
      <User
        size={18}
        className="absolute left-4 top-4 text-slate-400"
      />

      <input
        type="text"
        name="fatherName"
        value={form.fatherName}
        onChange={handleChange}
        placeholder="Father Name"
        className="w-full rounded-2xl border pl-12 pr-4 py-4 outline-none focus:border-emerald-600"
      />
    </div>
  </div>

  {/* Mother Name */}

  <div>
    <label className="mb-2 block font-bold">
      Mother Name
    </label>

    <div className="relative">
      <User
        size={18}
        className="absolute left-4 top-4 text-slate-400"
      />

      <input
        type="text"
        name="motherName"
        value={form.motherName}
        onChange={handleChange}
        placeholder="Mother Name"
        className="w-full rounded-2xl border pl-12 pr-4 py-4 outline-none focus:border-emerald-600"
      />
    </div>
  </div>

  {/* Gender */}

  <div>
    <label className="mb-2 block font-bold">
      Gender <span className="text-red-500">*</span>
    </label>

    <select
      name="gender"
      value={form.gender}
      onChange={handleChange}
      required
      className="w-full rounded-2xl border px-4 py-4 outline-none focus:border-emerald-600"
    >
      <option value="">Select Gender</option>
      <option value="Male">Male</option>
      <option value="Female">Female</option>
      <option value="Other">Other</option>
    </select>
  </div>

  {/* DOB */}

  <div>
    <label className="mb-2 block font-bold">
      Date of Birth
    </label>

    <input
      type="date"
      name="dob"
      value={form.dob}
      onChange={handleChange}
      className="w-full rounded-2xl border px-4 py-4 outline-none focus:border-emerald-600"
    />
  </div>

  {/* Alternate Phone */}

  <div>
    <label className="mb-2 block font-bold">
      Alternate Phone
    </label>

    <div className="relative">
      <Phone
        size={18}
        className="absolute left-4 top-4 text-slate-400"
      />

      <input
        type="text"
        name="alternatePhone"
        value={form.alternatePhone}
        onChange={handleChange}
        placeholder="Alternate Phone"
        className="w-full rounded-2xl border pl-12 pr-4 py-4 outline-none focus:border-emerald-600"
      />
    </div>
  </div>

</div>

              {/* Buttons */}

              <div className="mt-10 flex flex-col gap-4 sm:flex-row">

                <Link
                  href="/training"
                  className="flex items-center justify-center rounded-2xl border border-slate-300 px-6 py-4 font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  <ArrowLeft size={18} className="mr-2" />
                  Back to Courses
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-2xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-8 py-4 text-lg font-bold text-white transition hover:scale-[1.02] hover:shadow-xl disabled:opacity-70"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={20} className="animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    "Submit Application"
                  )}
                </button>

              </div>

            </form>

          </div>

          {/* RIGHT SIDEBAR */}

          <div>

            <div className="sticky top-24 rounded-[30px] bg-white p-8 shadow-2xl">

              <h2 className="text-2xl font-black text-slate-900">
                Selected Course
              </h2>

              {selectedCourse ? (
                <>
                  <div className="mt-6 rounded-2xl bg-emerald-50 p-6">

                    <h3 className="text-xl font-bold text-emerald-700">
                      {selectedCourse.title}
                    </h3>

                    <div className="mt-6 space-y-4">

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Duration
                        </span>

                        <span className="font-semibold">
                          {selectedCourse.duration}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Fees
                        </span>

                        <span className="font-semibold">
                          ₹{selectedCourse.fees}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Seats
                        </span>

                        <span className="font-semibold">
                          {selectedCourse.seats}
                        </span>
                      </div>

                      <div className="flex justify-between">
                        <span className="text-slate-500">
                          Instructor
                        </span>

                        <span className="font-semibold">
                          {selectedCourse.instructor}
                        </span>
                      </div>

                    </div>

                  </div>
                </>
              ) : (
                <div className="mt-6 rounded-2xl border border-dashed p-6 text-center text-slate-500">
                  Please select a training course.
                </div>
              )}

              <div className="mt-8 rounded-2xl bg-slate-50 p-6">

                <h4 className="font-bold text-slate-900">
                  Benefits
                </h4>

                <ul className="mt-5 space-y-3 text-sm text-slate-600">

                  <li>✅ Practical Hospital Training</li>

                  <li>✅ Experienced Medical Faculty</li>

                  <li>✅ Modern Lab & Equipment</li>

                  <li>✅ Certificate After Completion</li>

                  <li>✅ Career Guidance</li>

                  <li>✅ Placement Assistance</li>

                </ul>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}