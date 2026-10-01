import Link from "next/link";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const SERVER_URL = API.replace("/api", "");

// ==================================================
// GET DOCTOR
// ==================================================
async function getDoctor(id) {
  try {
    const res = await fetch(`${API}/doctors`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (!data.success) {
      return null;
    }

    const doctor = (data.data || []).find(
      (item) => item._id === id
    );

    return doctor || null;
  } catch (error) {
    console.error("GET DOCTOR ERROR:", error);
    return null;
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
// TODAY AVAILABILITY
// ==================================================
function isAvailableToday(doctor) {
  if (doctor.opdAvailable === false) {
    return false;
  }

  if (!Array.isArray(doctor.opdDays)) {
    return false;
  }

  return doctor.opdDays.includes(getTodayName());
}

// ==================================================
// IMAGE URL
// ==================================================
function getImageUrl(image) {
  if (!image) return "";

  if (image.startsWith("/uploads")) {
    return `${SERVER_URL}${image}`;
  }

  return image;
}

// ==================================================
// FEE
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
// DYNAMIC METADATA
// ==================================================
export async function generateMetadata({ params }) {
  const { id } = await params;

  const doctor = await getDoctor(id);

  if (!doctor) {
    return {
      title: "Doctor Not Found | Dew Care Hospital",
    };
  }

  return {
    title: `${doctor.name} | ${doctor.specialist} | Dew Care Hospital`,
    description: `View profile, qualification, experience, OPD schedule, consultation fee and availability of ${doctor.name} at Dew Care Hospital.`,
  };
}

// ==================================================
// PAGE
// ==================================================
export default async function DoctorDetailsPage({ params }) {
  const { id } = await params;

  const doctor = await getDoctor(id);

  // ==================================================
  // NOT FOUND
  // ==================================================
  if (!doctor) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">

        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-20">

          <div className="w-full rounded-[2rem] border border-sky-100 bg-white p-8 text-center shadow-xl md:p-12">

            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl">
              👨‍⚕️
            </div>

            <h1 className="mt-6 text-3xl font-black text-sky-950">
              Doctor Not Found
            </h1>

            <p className="mt-3 text-gray-500">
              The doctor profile you are looking for is
              unavailable or may have been removed.
            </p>

            <Link
              href="/doctors"
              className="mt-7 inline-flex rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-1"
            >
              ← Back to Doctors
            </Link>

          </div>

        </section>

      </main>
    );
  }

  const imageUrl = getImageUrl(doctor.image);

  const availableToday =
    isAvailableToday(doctor);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">

      {/* ==================================================
          HERO
      ================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-sky-800 to-cyan-700 py-14 text-white md:py-20">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.35),transparent_35%)]" />

        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4">

          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-cyan-100 backdrop-blur transition hover:bg-white/20"
          >
            ← Back to Doctors
          </Link>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">
            Doctor Profile
          </p>

          <h1 className="mt-3 text-4xl font-black leading-tight md:text-6xl">
            {doctor.name}
          </h1>

          <p className="mt-3 text-lg font-bold text-cyan-200 md:text-xl">
            {doctor.specialist}
          </p>

        </div>

      </section>


      {/* ==================================================
          MAIN PROFILE
      ================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:py-16">

        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">

          {/* ==================================================
              LEFT PROFILE CARD
          ================================================== */}
          <div className="h-fit overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-xl">

            {/* IMAGE */}
            <div className="relative h-[380px] bg-gradient-to-br from-sky-100 to-cyan-100">

              {imageUrl ? (

                <img
                  src={imageUrl}
                  alt={doctor.name}
                  className="h-full w-full object-cover"
                />

              ) : (

                <div className="flex h-full items-center justify-center text-9xl">
                  👨‍⚕️
                </div>

              )}

              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-sky-950/70 to-transparent" />

              {/* STATUS */}
              <div className="absolute bottom-5 left-5">

                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white shadow-lg ${
                    availableToday
                      ? "bg-emerald-500"
                      : "bg-red-500"
                  }`}
                >

                  <span
                    className={`h-2.5 w-2.5 rounded-full bg-white ${
                      availableToday
                        ? "animate-pulse"
                        : ""
                    }`}
                  />

                  {availableToday
                    ? "Available Today"
                    : "Not Available Today"}

                </span>

              </div>

            </div>


            {/* PROFILE BASIC INFO */}
            <div className="p-6 md:p-7">

              <h2 className="text-2xl font-black text-sky-950">
                {doctor.name}
              </h2>

              <p className="mt-2 font-bold text-cyan-700">
                {doctor.specialist}
              </p>

              {doctor.qualification && (
                <div className="mt-5 flex gap-3">

                  <span className="text-xl">
                    🎓
                  </span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Qualification
                    </p>

                    <p className="mt-1 font-semibold text-slate-700">
                      {doctor.qualification}
                    </p>
                  </div>

                </div>
              )}

              {doctor.experience && (
                <div className="mt-5 flex gap-3">

                  <span className="text-xl">
                    ⭐
                  </span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Experience
                    </p>

                    <p className="mt-1 font-semibold text-slate-700">
                      {doctor.experience}
                    </p>
                  </div>

                </div>
              )}

              {doctor.department && (
                <div className="mt-5 flex gap-3">

                  <span className="text-xl">
                    🏥
                  </span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Department
                    </p>

                    <p className="mt-1 font-semibold text-slate-700">
                      {doctor.department}
                    </p>
                  </div>

                </div>
              )}

            </div>

          </div>


          {/* ==================================================
              RIGHT DETAILS
          ================================================== */}
          <div className="space-y-6">

            {/* ==================================================
                AVAILABILITY
            ================================================== */}
            <div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-xl md:p-8">

              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Today&apos;s OPD Status
                  </p>

                  <h2
                    className={`mt-2 text-2xl font-black ${
                      availableToday
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {availableToday
                      ? "Doctor Available Today"
                      : "Doctor Not Available Today"}
                  </h2>

                </div>

                <div
                  className={`flex h-16 w-16 items-center justify-center rounded-2xl text-3xl ${
                    availableToday
                      ? "bg-emerald-100"
                      : "bg-red-100"
                  }`}
                >
                  {availableToday ? "✓" : "×"}
                </div>

              </div>

            </div>


            {/* ==================================================
                FEES
            ================================================== */}
            <div>

              <h2 className="mb-4 text-2xl font-black text-sky-950">
                Consultation & Hospital Fees
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">

                {/* OPD FEE */}
                <div className="rounded-[1.5rem] border border-amber-200 bg-amber-50 p-6">

                  <p className="text-sm font-bold uppercase tracking-wide text-amber-700">
                    OPD Consultation
                  </p>

                  <p className="mt-2 text-3xl font-black text-amber-950">
                    {formatFee(doctor.opdFee)}
                  </p>

                  <p className="mt-2 text-sm text-amber-700">
                    Per consultation
                  </p>

                </div>


                {/* INDOOR FEE */}
                <div className="rounded-[1.5rem] border border-blue-200 bg-blue-50 p-6">

                  <p className="text-sm font-bold uppercase tracking-wide text-blue-700">
                    Indoor Doctor
                  </p>

                  {doctor.indoorDoctor ? (

                    <>
                      <p className="mt-2 text-3xl font-black text-blue-950">
                        {formatFee(doctor.indoorFee)}
                      </p>

                      <p className="mt-2 text-sm text-blue-700">
                        Indoor consultation
                      </p>
                    </>

                  ) : (

                    <p className="mt-3 font-bold text-slate-500">
                      Indoor service not available
                    </p>

                  )}

                </div>

              </div>

            </div>


            {/* ==================================================
                OPD SCHEDULE
            ================================================== */}
            <div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-xl md:p-8">

              <h2 className="text-2xl font-black text-sky-950">
                OPD Schedule
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                {/* TIME */}
                <div className="rounded-2xl bg-sky-50 p-5">

                  <p className="text-xs font-black uppercase tracking-wide text-sky-600">
                    OPD Timing
                  </p>

                  {doctor.opdStartTime &&
                  doctor.opdEndTime ? (

                    <p className="mt-2 text-lg font-black text-sky-950">
                      🕒 {doctor.opdStartTime} -{" "}
                      {doctor.opdEndTime}
                    </p>

                  ) : (

                    <p className="mt-2 font-bold text-slate-500">
                      Timing not available
                    </p>

                  )}

                </div>


                {/* DAYS */}
                <div className="rounded-2xl bg-emerald-50 p-5">

                  <p className="text-xs font-black uppercase tracking-wide text-emerald-600">
                    OPD Days
                  </p>

                  {doctor.opdDays?.length > 0 ? (

                    <p className="mt-2 text-sm font-bold leading-6 text-emerald-950">
                      📅 {doctor.opdDays.join(", ")}
                    </p>

                  ) : (

                    <p className="mt-2 font-bold text-slate-500">
                      Days not available
                    </p>

                  )}

                </div>

              </div>

            </div>


            {/* ==================================================
                SLOT INFORMATION
            ================================================== */}
            <div className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-[1.5rem] border border-purple-100 bg-purple-50 p-6">

                <p className="text-xs font-black uppercase tracking-wide text-purple-600">
                  Minimum Slot
                </p>

                <p className="mt-2 text-2xl font-black text-purple-950">
                  ⏱ {doctor.slotDuration || 15} Minutes
                </p>

              </div>


              <div className="rounded-[1.5rem] border border-teal-100 bg-teal-50 p-6">

                <p className="text-xs font-black uppercase tracking-wide text-teal-600">
                  Daily Patient Limit
                </p>

                <p className="mt-2 text-2xl font-black text-teal-950">
                  👥 {doctor.maxPatientsPerDay || 30}
                </p>

              </div>

            </div>


            {/* ==================================================
                INFORMATION
            ================================================== */}
            <div className="rounded-[2rem] border border-slate-100 bg-slate-50 p-6 md:p-8">

              <h2 className="text-xl font-black text-slate-900">
                Doctor Information
              </h2>

              <p className="mt-3 leading-7 text-slate-600">
                {doctor.name} is a{" "}
                {doctor.specialist} specialist
                {doctor.department
                  ? ` in the ${doctor.department} department`
                  : ""}
                {doctor.experience
                  ? ` with ${doctor.experience} of experience`
                  : ""}
                . Please check the OPD schedule above
                for the doctor&apos;s visiting days and
                availability.
              </p>

            </div>


            {/* ==================================================
                ACTIONS
            ================================================== */}
            <div className="flex flex-col gap-3 sm:flex-row">

              <Link
                href="/doctors"
                className="flex-1 rounded-2xl border border-sky-200 bg-white px-6 py-4 text-center font-black text-sky-800 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                ← All Doctors
              </Link>

              <Link
                href="/appointment"
                className="flex-1 rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 px-6 py-4 text-center font-black text-white shadow-lg shadow-cyan-500/20 transition hover:-translate-y-1 hover:shadow-xl"
              >
                Book Appointment →
              </Link>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}