import Link from "next/link";
import SectionTitle from "../Components/SectionTitle";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const SERVER_URL = API.replace("/api", "");

export const metadata = {
  title: "Doctors | Dew Care Hospital",
  description:
    "Meet doctors and specialists at Dew Care Hospital.",
};

// ==================================================
// GET DOCTORS
// ==================================================
async function getDoctors() {
  try {
    const res = await fetch(`${API}/doctors`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (data.success) {
      return (data.data || []).filter(
        (doctor) => doctor.status === "Active"
      );
    }

    return [];
  } catch (error) {
    console.error("GET DOCTORS ERROR:", error);
    return [];
  }
}

// ==================================================
// TODAY
// ==================================================
function getTodayName() {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  return days[new Date().getDay()];
}

// ==================================================
// TODAY DOCTOR AVAILABILITY
// ==================================================
function isDoctorAvailableToday(doctor) {
  const today = getTodayName();

  // Future daily-admin availability support
  // If backend sends opdAvailable = false,
  // doctor is unavailable.
  if (doctor.opdAvailable === false) {
    return false;
  }

  // If backend sends opdAvailable = true,
  // continue checking the weekly schedule.
  if (
    Array.isArray(doctor.opdDays) &&
    doctor.opdDays.length > 0
  ) {
    return doctor.opdDays.includes(today);
  }

  return false;
}

// ==================================================
// FORMAT FEE
// ==================================================
function formatFee(value) {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return "Not Set";
  }

  const amount = Number(value);

  if (Number.isNaN(amount)) {
    return "Not Set";
  }

  return `₹${amount.toLocaleString("en-IN")}`;
}

// ==================================================
// PAGE
// ==================================================
export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">

      {/* ==================================================
          HERO
      ================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-sky-800 to-cyan-700 py-24 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.35),transparent_35%)]" />

        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4">

          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
            Our Doctors
          </span>

          <h1 className="mt-5 text-4xl font-extrabold leading-tight md:text-6xl">
            Experienced Medical Specialists
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-sky-100">
            Meet our experienced doctors and check their
            availability, consultation fees and OPD schedule.
          </p>

        </div>
      </section>

      {/* ==================================================
          DOCTORS SECTION
      ================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-20">

        <SectionTitle
          small="Specialists"
          title="Meet Our Doctors"
          desc="Check doctor availability, consultation fees and visiting schedule."
        />

        {doctors.length === 0 ? (

          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">

            <p className="text-gray-500">
              No doctors available right now.
            </p>

          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {doctors.map((doctor) => {

              const imageUrl =
                doctor.image?.startsWith("/uploads")
                  ? `${SERVER_URL}${doctor.image}`
                  : doctor.image;

              const availableToday =
                isDoctorAvailableToday(doctor);

              const hasIndoor =
                doctor.indoorDoctor === true;

              return (
                <div
                  key={doctor._id}
                  className="group overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-xl shadow-sky-100/70 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >

                  {/* ==================================================
                      DOCTOR IMAGE
                  ================================================== */}
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-sky-100 to-cyan-100">

                    {imageUrl ? (

                      <img
                        src={imageUrl}
                        alt={doctor.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />

                    ) : (

                      <div className="flex h-full items-center justify-center text-8xl">
                        👨‍⚕️
                      </div>

                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-sky-950/10 to-transparent" />

                    {/* TODAY STATUS */}
                    <div className="absolute bottom-5 left-5">

                      {availableToday ? (

                        <span className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-sm font-extrabold text-white shadow-lg">

                          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />

                          Available Today

                        </span>

                      ) : (

                        <span className="inline-flex items-center gap-2 rounded-full bg-red-500 px-4 py-2 text-sm font-extrabold text-white shadow-lg">

                          <span className="h-2.5 w-2.5 rounded-full bg-white" />

                          Not Available Today

                        </span>

                      )}

                    </div>

                  </div>

                  {/* ==================================================
                      DOCTOR CONTENT
                  ================================================== */}
                  <div className="p-7">

                    {/* NAME */}
                    <h3 className="text-2xl font-extrabold text-sky-950">
                      {doctor.name}
                    </h3>

                    {/* SPECIALIST */}
                    <p className="mt-2 font-bold text-cyan-700">
                      {doctor.specialist}
                    </p>

                    {/* QUALIFICATION */}
                    {doctor.qualification && (
                      <p className="mt-3 text-gray-600">
                        🎓 {doctor.qualification}
                      </p>
                    )}

                    {/* EXPERIENCE */}
                    {doctor.experience && (
                      <p className="mt-2 text-gray-500">
                        ⭐ {doctor.experience}
                      </p>
                    )}

                    {/* DEPARTMENT */}
                    {doctor.department && (
                      <p className="mt-2 text-gray-500">
                        🏥 {doctor.department}
                      </p>
                    )}

                    {/* ==================================================
                        TODAY AVAILABILITY BOX
                    ================================================== */}
                    <div
                      className={`mt-5 rounded-2xl border p-4 ${
                        availableToday
                          ? "border-green-200 bg-green-50"
                          : "border-red-200 bg-red-50"
                      }`}
                    >

                      <div className="flex items-center justify-between gap-3">

                        <div>

                          <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
                            Today&apos;s OPD
                          </p>

                          <p
                            className={`mt-1 text-base font-extrabold ${
                              availableToday
                                ? "text-green-700"
                                : "text-red-700"
                            }`}
                          >
                            {availableToday
                              ? "Doctor Available"
                              : "Doctor Not Available"}
                          </p>

                        </div>

                        <div
                          className={`flex h-11 w-11 items-center justify-center rounded-full text-xl font-black ${
                            availableToday
                              ? "bg-green-200 text-green-700"
                              : "bg-red-200 text-red-700"
                          }`}
                        >
                          {availableToday ? "✓" : "×"}
                        </div>

                      </div>

                    </div>

                    {/* ==================================================
                        FEES
                    ================================================== */}
                    {/* <div className="mt-4 grid grid-cols-2 gap-3"> */}

                      {/* OPD FEE */}
                      {/* <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">

                        <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                          OPD Fee
                        </p>

                        <p className="mt-1 text-xl font-black text-amber-900">
                          {formatFee(doctor.opdFee)}
                        </p>

                      </div> */}

                      {/* INDOOR */}
                      {/* <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4">

                        <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                          Indoor
                        </p>

                        {hasIndoor ? (

                          <p className="mt-1 text-xl font-black text-blue-900">
                            {formatFee(
                              doctor.indoorFee
                            )}
                          </p>

                        ) : (

                          <p className="mt-1 text-sm font-bold text-slate-500">
                            Not Available
                          </p>

                        )}

                      </div> */}
{/* 
                    </div> */}

                    {/* ==================================================
                        OPD TIMING
                    ================================================== */}
                    {/* {doctor.opdStartTime &&
                      doctor.opdEndTime && (

                        <div className="mt-4 rounded-2xl border border-slate-100 bg-slate-50 p-4">

                          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                            OPD Timing
                          </p>

                          <p className="mt-1 font-extrabold text-slate-800">
                            🕒 {doctor.opdStartTime} -{" "}
                            {doctor.opdEndTime}
                          </p>

                        </div>

                      )} */}

                    {/* ==================================================
                        OPD DAYS
                    ================================================== */}
                    {/* {doctor.opdDays?.length > 0 && (

                      <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-4">

                        <p className="text-xs font-bold uppercase tracking-wide text-sky-600">
                          OPD Days
                        </p>

                        <p className="mt-1 text-sm font-semibold leading-6 text-slate-600">
                          📅 {doctor.opdDays.join(", ")}
                        </p>

                      </div>

                    )} */}

                    {/* ==================================================
                        SLOT + DAILY LIMIT
                    ================================================== */}
                    {/* <div className="mt-4 grid grid-cols-2 gap-3">

                      <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">

                        <p className="text-xs font-bold uppercase tracking-wide text-purple-600">
                          Minimum Slot
                        </p>

                        <p className="mt-1 font-extrabold text-purple-900">
                          ⏱ {doctor.slotDuration || 15} min
                        </p>

                      </div>

                      <div className="rounded-2xl border border-teal-100 bg-teal-50 p-4">

                        <p className="text-xs font-bold uppercase tracking-wide text-teal-600">
                          Daily Limit
                        </p>

                        <p className="mt-1 font-extrabold text-teal-900">
                          👥{" "}
                          {doctor.maxPatientsPerDay || 30}
                        </p>

                      </div>

                    </div> */}

                    {/* ==================================================
                        DETAILS BUTTON
                    ================================================== */}
                    <Link
                      href={`/doctors/${doctor._id}`}
                      className="mt-6 block rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 py-3 text-center font-extrabold text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      View Doctor Details →
                    </Link>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </section>

    </main>
  );
}