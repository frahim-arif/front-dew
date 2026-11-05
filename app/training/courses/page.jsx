
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
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  MapPin,
  Phone,
} from "lucide-react";

const API = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const SERVER = API.replace(/\/api\/?$/, "");

// Course information
const courseHighlights = [
  ["Duration", "3 Days"],
  ["Course Fee", "₹15,000"],
  ["Seats", "6 Per Batch"],
  ["Accommodation", "Included"],
];

const objectives = [
  "Set up the laparoscopic tower, position the patient and team, and plan port placement.",
  "Achieve safe pneumoperitoneum by closed (Veress) and open (Hasson) techniques.",
  "Perform basic laparoscopic cases under supervision, including exposure, dissection, duct and vessel control, and specimen retrieval.",
  "Use energy devices, clips and laparoscopic knots safely.",
  "Recognise, prevent and manage common intraoperative complications.",
  "Understand the operative strategy behind advanced CBD and hernia surgeries.",
  "Take a structured plan back to start or expand laparoscopic work at their own hospital.",
];

const teachingMethods = [
  "Supervised live operating with faculty scrubbed in alongside participants.",
  "Advanced laparoscopic observership with step-by-step faculty commentary.",
  "Focused lectures on principles, safe techniques and complication management.",
  "Video case review and daily operative debrief.",
  "Structured skills assessment at the end of the course.",
];

const programmeDays = [
  {
    day: "Day 1",
    focus: "Orientation, Set-up and Access",
    details:
      "OT protocols, equipment and ergonomics. Camera handling. Veress and open (Hasson) access, supervised port insertion and assisting in basic laparoscopic procedures.",
  },
  {
    day: "Day 2",
    focus: "Basic Laparoscopic Surgery",
    details:
      "Participants operate on basic laparoscopic cases under supervision: exposure, dissection, duct and vessel control, safe use of energy devices and clips, and specimen retrieval.",
  },
  {
    day: "Day 3",
    focus: "Consolidation and Assessment",
    details:
      "Supervised operating and laparoscopic knotting. Video-based case review, skills assessment and certificate distribution.",
  },
];

const courseDetails = [
  ["Duration", "3 days, 9:00 am – 5:00 pm daily"],
  ["Batch dates", "Fixed monthly dates, e.g. 10th–12th of every month"],
  ["Course fee", "₹15,000 per participant, including accommodation. GST if applicable."],
  ["Fee includes", "Accommodation on campus or in a nearby hotel, course material, OT dress, use of laparoscopic instruments, working lunch, tea and certificate."],
  ["Not included", "Travel to Nagaon, dinners and personal expenses."],
  ["Seat booking", "Full course fee payable at the time of application to confirm your seat."],
  ["Eligibility refund", "Full fee refunded if documents do not meet eligibility criteria."],
  ["Batch size", "Limited to 6 participants per batch."],
  ["Procedures", "Hands-on basic laparoscopic surgery and advanced laparoscopic observership."],
  ["Format", "Live supervised operating, advanced case observership, focused lectures and video case review."],
  ["Accommodation", "Included in the course fee. Check-in the evening before Day 1."],
  ["Certificate", "Certificate of Hands-On Training on completion."],
  ["After the course", "Teaching video access and faculty guidance for your first cases at your own hospital."],
  ["Venue", "Dew Care Hospital & Research Centre, Dhing Road, Haibargaon, Nagaon, Assam – 782002."],
];

const faqs = [
  {
    question: "Will I operate on patients myself?",
    answer:
      "Yes. You will operate on basic laparoscopic cases under our direct supervision. You begin by assisting; as faculty assess your skills, you take on more of each case, up to performing complete procedures. The consultant stays scrubbed in and takes over whenever required. Unsupervised operating is never permitted.",
  },
  {
    question: "What does the advanced observership include?",
    answer:
      "You observe advanced laparoscopic procedures, such as CBD and hernia surgeries, from inside the theatre, with faculty explaining each step. You do not scrub in or operate on these cases. Procedures vary with that week's operating list.",
  },
  {
    question: "Do I need prior laparoscopic experience?",
    answer:
      "Basic theoretical knowledge of laparoscopic surgery is required, along with sound open surgical skills. Box-trainer practice or a prior skills course is strongly recommended; participants without it will spend more of the course assisting.",
  },
  {
    question: "Is accommodation included?",
    answer:
      "Yes. The course fee includes accommodation, either on campus or in a nearby hotel, for the duration of the course. Check-in is the evening before Day 1.",
  },
  {
    question: "What should I bring?",
    answer:
      "Copies of your degree and registration certificates, a photo ID and two passport-size photographs. OT dress and all instruments are provided.",
  },
  {
    question: "Is the fee refundable?",
    answer:
      "Refunds depend on when you cancel. If your application does not meet the eligibility criteria, the full fee is refunded. If we cancel or reschedule a batch, you receive a full refund or a seat in the next batch.",
  },
  {
    question: "What certificate will I receive?",
    answer:
      "A Certificate of Hands-On Training issued by Dew Care Hospital & Research Centre, listing the procedures in which you participated.",
  },
];

const refundPolicy = [
  ["Application not eligible after document check", "100%"],
  ["Batch cancelled or rescheduled by us", "100%, or a seat in the next batch"],
  ["30 days or more before start", "100%"],
  ["15–29 days before start", "50%, or full transfer to a later batch"],
  ["Less than 15 days / no-show", "No refund"],
];

export default function TrainingCoursesPage() {
  // All React states must be inside the component
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showCourseContent, setShowCourseContent] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [error, setError] = useState("");

  // Fetch courses from existing backend
  useEffect(() => {
    const controller = new AbortController();

    const fetchCourses = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/training/courses`, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error("Unable to load courses.");
        }

        const data = await res.json();

        if (data.success) {
          setCourses(data.data || []);
        } else {
          setCourses([]);
          setError(data.message || "Unable to load courses.");
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Course Fetch Error:", err);
          setError("Unable to connect to the server. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchCourses();

    return () => controller.abort();
  }, []);

  // Search filtering
  const filteredCourses = courses.filter((item) =>
    item.title?.toLowerCase().includes(search.toLowerCase())
  );

  const applicationUrl = "/training/application-form";

  return (
    <>
      {/* HERO SECTION */}

      <section className="bg-gradient-to-br from-emerald-700 via-cyan-700 to-sky-900 py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-block rounded-full bg-white/20 px-6 py-2 font-bold text-white">
              Dew Care Hospital Training
            </span>

            <h1 className="mt-6 text-4xl font-black text-white md:text-5xl">
              Healthcare Training Courses
            </h1>

            <p className="mx-auto mt-5 max-w-3xl text-lg text-cyan-100">
              Choose the right healthcare training program and start your
              professional career.
            </p>

            <div className="mx-auto mt-10 max-w-xl">
              <div className="flex items-center rounded-2xl bg-white px-5 shadow-xl">
                <Search className="shrink-0 text-gray-400" size={22} />

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search Course..."
                  className="w-full bg-transparent px-4 py-5 text-slate-900 outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LAPAROSCOPIC COURSE DETAILS BUTTON */}

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-7">
            <span className="font-bold uppercase tracking-wider text-emerald-700">
              Special Training Programme
            </span>

            <h2 className="mt-3 text-2xl font-black text-slate-900 md:text-3xl">
              Course card (for the Training Courses listing)
            </h2>

            <p className="mt-3 max-w-3xl leading-7 text-gray-600">
              Explore our 3-Day Hands-On Training in Basic Laparoscopic
              Surgery and Observership in Advanced Laparoscopy.
            </p>
          </div>

          {/* Course Preview Card */}

          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-lg">
            <div className="grid md:grid-cols-3">
              <div className="flex min-h-56 items-center justify-center bg-gradient-to-br from-emerald-800 to-cyan-800 p-8 text-center text-white md:col-span-1">
                <div>
                  <GraduationCap className="mx-auto mb-4" size={55} />

                  <h3 className="text-2xl font-black">
                    Hands-On Laparoscopic Training
                  </h3>

                  <p className="mt-3 text-emerald-100">
                    Dew Care Hospital & Research Centre
                  </p>
                </div>
              </div>

              <div className="p-6 md:col-span-2 md:p-9">
                <h3 className="text-2xl font-black text-slate-900">
                  3-Day Hands-On Training in Basic Laparoscopic Surgery
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  Hands-on training in basic laparoscopic surgery, with
                  observership in advanced laparoscopic surgery.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
                  {courseHighlights.map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl bg-white p-4 shadow-sm"
                    >
                      <p className="text-xs text-gray-500">{label}</p>
                      <p className="mt-2 font-black text-emerald-700">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => setShowCourseContent((prev) => !prev)}
                  aria-expanded={showCourseContent}
                  className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl bg-emerald-700 px-6 py-4 font-bold text-white transition hover:bg-emerald-800"
                >
                  {showCourseContent
                    ? "Close Complete Course Details"
                    : "View Complete Course Details"}

                  {showCourseContent ? (
                    <ChevronUp size={21} />
                  ) : (
                    <ChevronDown size={21} />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* COMPLETE COURSE CONTENT */}

          {showCourseContent && (
            <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5 md:p-10">
              {/* COURSE INTRO */}

              <div className="border-b border-slate-200 pb-9">
                <span className="font-bold text-emerald-700">
                  DEW CARE HOSPITAL & RESEARCH CENTRE
                </span>

                <h2 className="mt-4 text-3xl font-black leading-tight text-slate-900 md:text-4xl">
                  3-Day Hands-On Training in Basic Laparoscopic Surgery &
                  Observership in Advanced Laparoscopy
                </h2>

                <p className="mt-4 text-lg leading-8 text-slate-600">
                  A focused 3-day programme for qualified surgeons. Train
                  inside a working operation theatre alongside experienced
                  laparoscopic faculty.
                </p>

                <p className="mt-4 leading-7 text-slate-600">
                  You will perform basic laparoscopic cases, such as
                  cholecystectomy and appendectomy, yourself under our direct
                  supervision. Observe advanced laparoscopic surgery, such as
                  CBD and hernia surgeries, performed by our faculty.
                </p>

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {courseHighlights.map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl bg-white p-5 shadow-sm"
                    >
                      <p className="text-sm text-gray-500">{label}</p>
                      <p className="mt-2 text-xl font-black text-emerald-700">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-5 font-bold text-emerald-900">
                  <CheckCircle2 className="mr-2 inline" size={20} />
                  Key Highlight: Operate on live cases under faculty
                  supervision — not just observe.
                </div>
              </div>

              <div className="mt-10 space-y-12 text-slate-700">
                {/* OVERVIEW */}

                <div>
                  <h3 className="mb-4 text-2xl font-black text-slate-900">
                    Programme Overview
                  </h3>

                  <p className="leading-8">
                    Learning laparoscopy from videos and box trainers takes
                    a surgeon only so far. Confidence comes from the
                    operating theatre.
                  </p>

                  <p className="mt-4 leading-8">
                    The Centre for Advanced Laparoscopic Training at Dew Care
                    Hospital & Research Centre, Nagaon, offers a 3-day
                    hands-on programme built around real cases. Participants
                    work alongside our laparoscopic faculty across the range
                    of basic laparoscopic surgery — procedures such as
                    cholecystectomy, appendectomy and diagnostic laparoscopy
                    that form the foundation of every laparoscopic surgeon's
                    practice.
                  </p>

                  <p className="mt-4 leading-8">
                    Participants are allowed to operate on cases themselves,
                    under our direct supervision. Training follows a graded
                    approach: you begin by assisting, and as faculty assess
                    your skills, you take on more of each operation, up to
                    performing complete cases. A consultant remains scrubbed
                    in throughout, and patient safety remains the first
                    priority at every step.
                  </p>
                </div>

                {/* TWO COMPONENTS */}

                <div>
                  <h3 className="mb-4 text-2xl font-black text-slate-900">
                    Two Components, One Programme
                  </h3>

                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="rounded-xl bg-white p-6 shadow-sm">
                      <h4 className="text-lg font-bold text-emerald-800">
                        Hands-on (Basic)
                      </h4>

                      <p className="mt-3 leading-7">
                        You perform basic laparoscopic cases yourself under
                        our direct supervision, for example cholecystectomy,
                        appendectomy and diagnostic laparoscopy.
                      </p>
                    </div>

                    <div className="rounded-xl bg-white p-6 shadow-sm">
                      <h4 className="text-lg font-bold text-emerald-800">
                        Observership (Advanced)
                      </h4>

                      <p className="mt-3 leading-7">
                        Observe advanced laparoscopic procedures performed
                        by our faculty, such as laparoscopic CBD surgeries
                        (CBD exploration) and laparoscopic hernia surgeries
                        (TAPP, TEP, ventral hernia repair).
                      </p>
                    </div>
                  </div>

                  <p className="mt-5 leading-8">
                    The observership shows where basic skills lead next, and
                    how experienced surgeons handle complex anatomy and
                    difficult situations.
                  </p>

                  <p className="mt-4 leading-8">
                    Batches are deliberately kept small. This ensures every
                    participant gets meaningful time at the operating table,
                    not just a view from the back of the theatre.
                  </p>

                  <div className="mt-5 rounded-xl bg-amber-50 p-5 leading-7 text-amber-900">
                    <b>Our commitment to patients:</b> Every live procedure
                    is performed with the patient's informed consent. A
                    senior consultant remains scrubbed in and in control
                    throughout. Trainee participation is decided case by
                    case, and patient dignity and privacy are respected at
                    all times.
                  </div>
                </div>

                {/* OBJECTIVES */}

                <div>
                  <h3 className="mb-4 text-2xl font-black text-slate-900">
                    Course Objectives
                  </h3>

                  <p className="mb-4">
                    By the end of the programme, participants will be able
                    to:
                  </p>

                  <ul className="space-y-3">
                    {objectives.map((item) => (
                      <li key={item} className="flex gap-3 leading-7">
                        <CheckCircle2
                          className="mt-1 shrink-0 text-emerald-600"
                          size={19}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* TEACHING METHODS */}

                <div>
                  <h3 className="mb-4 text-2xl font-black text-slate-900">
                    Teaching Methods
                  </h3>

                  <ul className="space-y-3">
                    {teachingMethods.map((item) => (
                      <li key={item} className="flex gap-3 leading-7">
                        <CheckCircle2
                          className="mt-1 shrink-0 text-emerald-600"
                          size={19}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <p className="mt-5 rounded-xl bg-amber-50 p-4 text-amber-900">
                    The programme depends on the live operating list and
                    may be modified when required.
                  </p>
                </div>

                {/* ELIGIBILITY */}

                <div>
                  <h3 className="mb-4 text-2xl font-black text-slate-900">
                    Who Can Apply
                  </h3>

                  <p className="mb-4 leading-7">
                    This programme is designed for qualified surgeons who
                    want structured, supervised exposure to basic
                    laparoscopic procedures.
                  </p>

                  <ul className="list-disc space-y-3 pl-6 leading-7">
                    <li>
                      MS (General Surgery), DNB (General Surgery) or
                      equivalent postgraduate surgical qualification with
                      valid medical registration.
                    </li>
                    <li>
                      Basic theoretical knowledge of laparoscopic surgery
                      — principles, instruments, access and common
                      procedures.
                    </li>
                    <li>
                      Surgeons in practice who wish to begin or consolidate
                      their laparoscopic work.
                    </li>
                    <li>
                      Senior residents and recent postgraduates in General
                      Surgery.
                    </li>
                  </ul>

                  <div className="mt-5 rounded-xl bg-white p-5 shadow-sm">
                    <h4 className="font-bold text-slate-900">
                      Documents Required
                    </h4>

                    <p className="mt-3 leading-7">
                      Postgraduate degree certificate, medical council
                      registration certificate, government photo ID and
                      one passport-size photograph. A surgical logbook, if
                      available, helps us plan your operative exposure.
                    </p>
                  </div>
                </div>

                {/* PROGRAMME OUTLINE */}

                <div>
                  <h3 className="mb-5 text-2xl font-black text-slate-900">
                    3-Day Programme Outline
                  </h3>

                  <p className="mb-5 leading-7">
                    Each day combines live operating with short focused
                    teaching. Operative participation is graded and decided
                    by faculty for each case.
                  </p>

                  <div className="space-y-4">
                    {programmeDays.map((day) => (
                      <div
                        key={day.day}
                        className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="rounded-lg bg-emerald-700 px-4 py-2 font-bold text-white">
                            {day.day}
                          </span>

                          <h4 className="text-lg font-bold text-slate-900">
                            {day.focus}
                          </h4>
                        </div>

                        <p className="mt-4 leading-7 text-slate-600">
                          {day.details}
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="mt-5 leading-7">
                    Teaching sessions cover safe laparoscopic access,
                    Critical View of Safety, energy devices, intra- and
                    extracorporeal knotting, and avoiding common
                    complications. The exact sequence of cases depends on
                    the operating list for that week.
                  </p>

                  <p className="mt-3 leading-7">
                    Advanced laparoscopic cases for the observership are
                    scheduled across all three days, as they appear on the
                    operating list.
                  </p>
                </div>

                {/* FACULTY */}

                <div>
                  <h3 className="mb-4 text-2xl font-black text-slate-900">
                    Faculty
                  </h3>

                  <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
                    <span className="font-bold text-emerald-700">
                      PROGRAMME DIRECTOR & CHIEF TRAINER
                    </span>

                    <h4 className="mt-3 text-2xl font-black text-slate-900">
                      Dr. Foridul Hussain
                    </h4>

                    <p className="mt-2 font-semibold text-emerald-800">
                      MS, FMAS, FIAGES, DLS (France)
                    </p>

                    <p className="mt-4 leading-8 text-slate-600">
                      Training is personally led by Dr. Foridul Hussain,
                      who remains actively involved in both operating
                      theatre demonstrations and teaching sessions
                      throughout the programme.
                    </p>

                    <p className="mt-3 leading-8 text-slate-600">
                      His hands-on guidance ensures participants receive
                      practical surgical exposure, expert mentorship and
                      structured laparoscopic training.
                    </p>
                  </div>
                </div>

                {/* COURSE DETAILS TABLE */}

                <div>
                  <h3 className="mb-5 text-2xl font-black text-slate-900">
                    Course Details at a Glance
                  </h3>

                  <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
                    <table className="w-full min-w-[600px] text-left">
                      <tbody>
                        {courseDetails.map(([key, value]) => (
                          <tr
                            key={key}
                            className="border-b border-slate-100 last:border-0"
                          >
                            <td className="w-1/3 p-4 align-top font-bold text-slate-900">
                              {key}
                            </td>

                            <td className="p-4 leading-7 text-slate-600">
                              {value}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* FAQ */}

                <div>
                  <h3 className="mb-5 text-2xl font-black text-slate-900">
                    Frequently Asked Questions
                  </h3>

                  <div className="space-y-3">
                    {faqs.map((faq, index) => (
                      <div
                        key={faq.question}
                        className="overflow-hidden rounded-xl bg-white shadow-sm"
                      >
                        <button
                          type="button"
                          onClick={() =>
                            setOpenFaq(openFaq === index ? null : index)
                          }
                          aria-expanded={openFaq === index}
                          className="flex w-full items-center justify-between gap-4 p-5 text-left font-bold text-slate-900"
                        >
                          {faq.question}

                          {openFaq === index ? (
                            <ChevronUp
                              className="shrink-0 text-emerald-700"
                              size={20}
                            />
                          ) : (
                            <ChevronDown
                              className="shrink-0 text-emerald-700"
                              size={20}
                            />
                          )}
                        </button>

                        {openFaq === index && (
                          <p className="border-t border-slate-100 p-5 leading-8 text-slate-600">
                            {faq.answer}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* REFUND POLICY */}

                <div>
                  <h3 className="mb-5 text-2xl font-black text-slate-900">
                    Cancellation & Refund Policy
                  </h3>

                  <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
                    <table className="w-full min-w-[500px] text-left">
                      <thead className="bg-slate-800 text-white">
                        <tr>
                          <th className="p-4">Cancellation Notice</th>
                          <th className="p-4">Refund</th>
                        </tr>
                      </thead>

                      <tbody>
                        {refundPolicy.map(([date, refund]) => (
                          <tr
                            key={date}
                            className="border-b border-slate-100"
                          >
                            <td className="p-4">{date}</td>
                            <td className="p-4 font-bold text-emerald-700">
                              {refund}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* HOW TO APPLY */}

                <div className="rounded-2xl bg-gradient-to-br from-emerald-800 to-emerald-950 p-7 text-white md:p-10">
                  <h3 className="text-3xl font-black">
                    How to Apply
                  </h3>

                  <ol className="mt-6 list-decimal space-y-4 pl-6 leading-7 text-emerald-50">
                    <li>
                      Fill in the Training Application Form on this website.
                    </li>

                    <li>
                      Our training coordinator will verify your documents
                      and contact you.
                    </li>

                    <li>
                      Pay the full course fee with your application to
                      confirm your seat. Seats are allotted on a
                      first-come, first-served basis.
                    </li>
                  </ol>

                  <div className="mt-7 space-y-3">
                    <p className="flex items-center gap-3 font-bold">
                      <Phone size={20} />
                      7086803380 / 09101988910
                    </p>

                    <a
                      href="https://wa.me/917086803380"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-emerald-200 underline"
                    >
                      Contact us on WhatsApp
                      <ArrowRight size={17} />
                    </a>

                    <p className="flex items-start gap-3 leading-7">
                      <MapPin className="mt-1 shrink-0" size={20} />
                      Dew Care Hospital & Research Centre, Dhing Road,
                      Haibargaon, Nagaon, Assam – 782002.
                    </p>
                  </div>

                  <Link
                    href={applicationUrl}
                    className="mt-8 inline-flex items-center justify-center gap-3 rounded-xl bg-white px-8 py-4 font-black text-emerald-900 transition hover:bg-emerald-100"
                  >
                    Apply Now
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* EXISTING DYNAMIC COURSES LISTING */}

      <section className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="mb-12">
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
              Available Courses
            </h2>

            <p className="mt-2 text-slate-500">
              {filteredCourses.length} Courses Found
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-20 text-center">
                Loading Courses...
              </div>
            ) : error ? (
              <div className="col-span-full py-20 text-center text-red-600">
                {error}
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
                  {/* COURSE IMAGE */}

                  <div className="relative h-60 overflow-hidden">
                    <Image
                      src={
                        course.image
                          ? course.image.startsWith("/uploads")
                            ? `${SERVER}${course.image}`
                            : course.image
                          : "/images/course-placeholder.jpg"
                      }
                      alt={course.title || "Training Course"}
                      fill
                      className="object-cover transition duration-500 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                    />

                    {course.featured && (
                      <div className="absolute left-4 top-4 flex items-center gap-1 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-slate-900">
                        <Star size={14} fill="currentColor" />
                        Featured
                      </div>
                    )}
                  </div>

                  {/* COURSE CONTENT */}

                  <div className="p-7">
                    <h3 className="text-2xl font-bold text-slate-900">
                      {course.title}
                    </h3>

                    <p className="mt-3 line-clamp-2 text-slate-600">
                      {course.shortDescription}
                    </p>

                    <div className="mt-6 space-y-3 text-sm text-slate-700">
                      <div className="flex items-center gap-2">
                        <Clock3
                          size={18}
                          className="shrink-0 text-emerald-600"
                        />
                        {course.duration}
                      </div>

                      <div className="flex items-center gap-2">
                        <BadgeIndianRupee
                          size={18}
                          className="shrink-0 text-emerald-600"
                        />
                        ₹{course.fees}
                      </div>

                      <div className="flex items-center gap-2">
                        <GraduationCap
                          size={18}
                          className="shrink-0 text-emerald-600"
                        />
                        {course.eligibility}
                      </div>

                      <div className="flex items-center gap-2">
                        <UserRound
                          size={18}
                          className="shrink-0 text-emerald-600"
                        />
                        {course.instructor}
                      </div>
                    </div>

                    {/* EXISTING DETAILS AND APPLY LINKS */}

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
