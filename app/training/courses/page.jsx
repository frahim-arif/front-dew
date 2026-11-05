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
const [showCourseContent, setShowCourseContent] = useState(false);

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

{/* COURSE CARD CONTENT */}

<section className="bg-white py-12">
  <div className="mx-auto max-w-7xl px-4">

    <div className="mb-6">
      <h2 className="text-2xl font-black text-slate-900">
        Course card (for the Training Courses listing)
      </h2>

      <p className="mt-2 text-gray-500">
        View complete information about our 3-Day Hands-On
        Laparoscopic Training Programme.
      </p>
    </div>

    <button
      onClick={() => setShowCourseContent(!showCourseContent)}
      className="flex w-full items-center justify-between rounded-xl bg-emerald-700 px-6 py-5 text-left font-bold text-white shadow-lg transition hover:bg-emerald-800"
    >
      <span>
        {showCourseContent
          ? "Close Course Details"
          : "View Complete Course Details"}
      </span>

      <span className="text-2xl">
        {showCourseContent ? "−" : "+"}
      </span>
    </button>

    {showCourseContent && (
      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:p-10">

        <div className="mb-10 border-b pb-8">
          <span className="font-bold text-emerald-700">
            DEW CARE HOSPITAL & RESEARCH CENTRE
          </span>

          <h2 className="mt-4 text-3xl font-black text-slate-900">
            3-Day Hands-On Training in Basic Laparoscopic Surgery
            & Observership in Advanced Laparoscopy
          </h2>

          <p className="mt-4 text-lg text-slate-600">
            Hands-on training in basic laparoscopic surgery,
            with observership in advanced laparoscopic surgery.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["Duration", "3 Days"],
              ["Course Fee", "₹15,000"],
              ["Seats", "6 Per Batch"],
              ["Accommodation", "Included"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-white p-5 shadow-sm">
                <p className="text-sm text-gray-500">{label}</p>
                <p className="mt-2 text-xl font-black text-emerald-700">
                  {value}
                </p>
              </div>
            ))}
          </div>

          <p className="mt-6 rounded-xl bg-emerald-50 p-5 font-bold text-emerald-900">
            Key Highlight: Operate on live cases under faculty supervision
            — not just observe.
          </p>
        </div>

        <div className="space-y-10 text-slate-700">

          <div>
            <h3 className="mb-3 text-2xl font-bold text-slate-900">
              Programme Overview
            </h3>
            <p>
              Learning laparoscopy from videos and box trainers takes
              a surgeon only so far. Confidence comes from the operating
              theatre.
            </p>
            <p className="mt-3">
              The Centre for Advanced Laparoscopic Training at Dew Care
              Hospital & Research Centre, Nagaon, offers a 3-day
              hands-on programme built around real cases.
            </p>
            <p className="mt-3">
              Participants work alongside experienced laparoscopic
              faculty and perform basic laparoscopic cases under direct
              supervision. Training follows a graded approach, beginning
              with assisting and progressing according to faculty
              assessment. A consultant remains scrubbed in throughout.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-2xl font-bold text-slate-900">
              Two Components, One Programme
            </h3>
            <ul className="list-disc space-y-3 pl-6">
              <li>
                <b>Hands-on (Basic):</b> Perform basic laparoscopic
                cases under supervision, including cholecystectomy,
                appendectomy and diagnostic laparoscopy.
              </li>
              <li>
                <b>Observership (Advanced):</b> Observe CBD exploration,
                TAPP, TEP and ventral hernia surgeries performed by
                experienced faculty.
              </li>
            </ul>
            <p className="mt-4">
              Every live procedure requires informed patient consent.
              Patient safety, dignity and privacy remain the first priority.
            </p>
          </div>

          <div>
            <h3 className="mb-3 text-2xl font-bold text-slate-900">
              Course Objectives
            </h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Set up the laparoscopic tower and plan port placement.</li>
              <li>Achieve safe pneumoperitoneum using Veress and Hasson techniques.</li>
              <li>Perform basic laparoscopic cases under supervision.</li>
              <li>Use energy devices, clips and laparoscopic knots safely.</li>
              <li>Recognise, prevent and manage common intraoperative complications.</li>
              <li>Understand advanced CBD and hernia surgery strategies.</li>
              <li>Develop a structured plan to start or expand laparoscopic work.</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-2xl font-bold text-slate-900">
              Teaching Methods
            </h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>Supervised live operating.</li>
              <li>Advanced laparoscopic observership.</li>
              <li>Focused lectures.</li>
              <li>Video case review.</li>
              <li>Structured skills assessment.</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-2xl font-bold text-slate-900">
              Who Can Apply
            </h3>
            <ul className="list-disc space-y-2 pl-6">
              <li>MS (General Surgery).</li>
              <li>DNB (General Surgery).</li>
              <li>Equivalent postgraduate surgical qualification with valid medical registration.</li>
              <li>Basic theoretical knowledge of laparoscopic surgery.</li>
              <li>Practising surgeons and senior residents.</li>
            </ul>
            <p className="mt-4">
              <b>Documents required:</b> Postgraduate degree certificate,
              medical council registration certificate, government photo ID
              and passport-size photograph. Surgical logbook, if available.
            </p>
          </div>

          <div>
            <h3 className="mb-5 text-2xl font-bold text-slate-900">
              3-Day Programme Outline
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse bg-white text-left">
                <thead className="bg-emerald-800 text-white">
                  <tr>
                    <th className="p-4">Day</th>
                    <th className="p-4">Focus</th>
                    <th className="p-4">Training</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-4 font-bold">Day 1</td>
                    <td className="p-4">Orientation, Set-up and Access</td>
                    <td className="p-4">
                      OT protocols, equipment, camera handling,
                      Veress and Hasson access and supervised port insertion.
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-4 font-bold">Day 2</td>
                    <td className="p-4">Basic Laparoscopic Surgery</td>
                    <td className="p-4">
                      Supervised operating, exposure, dissection,
                      duct and vessel control, energy devices and clips.
                    </td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold">Day 3</td>
                    <td className="p-4">Consolidation and Assessment</td>
                    <td className="p-4">
                      Supervised operating, laparoscopic knotting,
                      video review, skills assessment and certificate.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-2xl font-bold text-slate-900">
              Faculty
            </h3>
            <h4 className="text-xl font-bold text-emerald-800">
              Dr. Foridul Hussain, MS, FMAS, FIAGES, DLS (France)
            </h4>
            <p className="mt-2">
              Programme Director & Chief Laparoscopic Trainer.
              Training is personally led by Dr. Foridul Hussain,
              who remains actively involved in operating theatre
              demonstrations and teaching sessions.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-2xl font-bold text-slate-900">
              Course Details at a Glance
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full bg-white text-left">
                <tbody>
                  {[
                    ["Duration", "3 days, 9:00 am – 5:00 pm daily"],
                    ["Batch dates", "Fixed monthly dates, e.g. 10th–12th of every month"],
                    ["Course fee", "₹15,000 per participant, including accommodation; GST if applicable"],
                    ["Fee includes", "Accommodation, course material, OT dress, instruments, working lunch, tea and certificate"],
                    ["Not included", "Travel to Nagaon, dinners and personal expenses"],
                    ["Seat booking", "Full course fee payable at the time of application"],
                    ["Eligibility refund", "Full refund if documents do not meet eligibility criteria"],
                    ["Batch size", "Maximum 6 participants"],
                    ["Accommodation", "On campus or nearby hotel; check-in evening before Day 1"],
                    ["Certificate", "Certificate of Hands-On Training"],
                    ["After the course", "Teaching video access and faculty guidance for your first cases"],
                    ["Venue", "Dew Care Hospital & Research Centre, Dhing Road, Haibargaon, Nagaon, Assam – 782002"],
                  ].map(([key, value]) => (
                    <tr key={key} className="border-b">
                      <td className="w-1/3 p-4 font-bold">{key}</td>
                      <td className="p-4">{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h3>

            {[
              [
                "Will I operate on patients myself?",
                "Yes. You will operate on basic laparoscopic cases under direct supervision. You begin by assisting and may progress to performing complete procedures according to faculty assessment. A consultant remains scrubbed in throughout."
              ],
              [
                "What does the advanced observership include?",
                "You observe advanced CBD and hernia surgeries inside the theatre, with faculty explaining each step. You do not scrub in or operate on these advanced cases."
              ],
              [
                "Do I need prior laparoscopic experience?",
                "Basic theoretical knowledge of laparoscopic surgery and sound open surgical skills are required. Box-trainer practice or a prior skills course is strongly recommended."
              ],
              [
                "Is accommodation included?",
                "Yes. Accommodation on campus or in a nearby hotel is included. Check-in is the evening before Day 1."
              ],
              [
                "What should I bring?",
                "Degree and registration certificates, photo ID and two passport-size photographs. OT dress and instruments are provided."
              ],
              [
                "What certificate will I receive?",
                "A Certificate of Hands-On Training issued by Dew Care Hospital & Research Centre, listing the procedures in which you participated."
              ]
            ].map(([question, answer]) => (
              <details key={question} className="mb-3 rounded-xl bg-white p-5 shadow-sm">
                <summary className="cursor-pointer font-bold text-slate-900">
                  {question}
                </summary>
                <p className="mt-3 leading-7 text-slate-600">{answer}</p>
              </details>
            ))}
          </div>

          <div>
            <h3 className="mb-3 text-2xl font-bold text-slate-900">
              Cancellation & Refund Policy
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full bg-white text-left">
                <thead className="bg-slate-800 text-white">
                  <tr>
                    <th className="p-4">Cancellation Notice</th>
                    <th className="p-4">Refund</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Application not eligible after document check", "100%"],
                    ["Batch cancelled or rescheduled by us", "100%, or seat in next batch"],
                    ["30 days or more before start", "100%"],
                    ["15–29 days before start", "50%, or full transfer to a later batch"],
                    ["Less than 15 days / no-show", "No refund"],
                  ].map(([date, refund]) => (
                    <tr key={date} className="border-b">
                      <td className="p-4">{date}</td>
                      <td className="p-4 font-bold">{refund}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-2xl bg-emerald-900 p-7 text-white">
            <h3 className="text-2xl font-black">
              How to Apply
            </h3>

            <ol className="mt-4 list-decimal space-y-3 pl-6">
              <li>Fill in the Training Application Form.</li>
              <li>Our training coordinator will verify your documents and contact you.</li>
              <li>Pay the full course fee to confirm your seat.</li>
            </ol>

            <p className="mt-5 font-bold">
              Enquiries: 7086803380 / 09101988910
            </p>

            <p className="mt-2">
              Dew Care Hospital & Research Centre,
              Dhing Road, Haibargaon, Nagaon, Assam – 782002.
            </p>

            <Link
              href="/training/application-form"
              className="mt-6 inline-flex items-center rounded-xl bg-white px-7 py-4 font-black text-emerald-900 transition hover:bg-emerald-100"
            >
              Apply Now →
            </Link>
          </div>

        </div>
      </div>
    )}

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