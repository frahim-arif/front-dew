import Link from "next/link";
import { notFound } from "next/navigation";
import { siteInfo } from "../../data/siteData";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const SERVER_URL = API.replace("/api", "");

// ==================================================
// GET SINGLE FACILITY
// ==================================================
async function getFacility(id) {
  try {
    const res = await fetch(`${API}/facilities/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    if (!data.success || !data.data) {
      return null;
    }

    const facility = data.data;

    // Only active facilities should be publicly visible
    if (facility.status !== "Active") {
      return null;
    }

    return facility;
  } catch (error) {
    console.error("GET FACILITY ERROR:", error);
    return null;
  }
}

// ==================================================
// IMAGE URL
// ==================================================
function imageUrl(path) {
  if (!path) return "";

  if (path.startsWith("/uploads")) {
    return `${SERVER_URL}${path}`;
  }

  return path;
}

// ==================================================
// PAGE
// ==================================================
export default async function FacilityDetailsPage({ params }) {
  const { id } = await params;

  const facility = await getFacility(id);

  if (!facility) {
    notFound();
  }

  const facilityImage = imageUrl(facility.image);

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">

      {/* ==================================================
          HERO
      ================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-sky-800 to-cyan-700 py-20 text-white">

        {/* Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.35),transparent_35%)]" />

        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4">

          {/* Breadcrumb */}
          <div className="mb-8 flex flex-wrap items-center gap-2 text-sm font-semibold text-sky-100">
            <Link
              href="/"
              className="transition hover:text-white"
            >
              Home
            </Link>

            <span>→</span>

            <Link
              href="/facilities"
              className="transition hover:text-white"
            >
              Facilities
            </Link>

            <span>→</span>

            <span className="text-white">
              {facility.title}
            </span>
          </div>

          <div className="grid items-center gap-10 lg:grid-cols-2">

            {/* TEXT */}
            <div>

              <div className="mb-5 flex flex-wrap items-center gap-3">

                <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
                  {facility.category || "Hospital Facility"}
                </span>

                <span className="inline-flex rounded-full border border-green-300/30 bg-green-400/10 px-4 py-2 text-sm font-bold text-green-100">
                  ✓ Available
                </span>

              </div>

              <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
                {facility.title}
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-sky-100">
                {facility.desc ||
                  "Dew Care Hospital provides quality healthcare facilities and services for patients."}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                <Link
                  href="/appointment"
                  className="rounded-2xl bg-white px-7 py-4 text-center font-extrabold text-sky-950 shadow-xl transition hover:-translate-y-1 hover:shadow-2xl"
                >
                  Book Appointment
                </Link>

                <a
                  href={`tel:${siteInfo.phone}`}
                  className="rounded-2xl border border-white/30 bg-white/10 px-7 py-4 text-center font-extrabold text-white backdrop-blur transition hover:bg-white/20"
                >
                  Emergency Call
                </a>

              </div>

            </div>

            {/* IMAGE */}
            <div className="relative">

              <div className="overflow-hidden rounded-[2rem] border border-white/20 bg-white/10 p-3 shadow-2xl backdrop-blur">

                {facilityImage ? (

                  <img
                    src={facilityImage}
                    alt={facility.title}
                    className="h-[350px] w-full rounded-[1.5rem] object-cover md:h-[450px]"
                  />

                ) : (

                  <div className="flex h-[350px] items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-sky-100 to-cyan-100 text-8xl md:h-[450px]">
                    {facility.icon || "🏥"}
                  </div>

                )}

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* ==================================================
          MAIN DETAILS
      ================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-16 md:py-20">

        <div className="grid gap-8 lg:grid-cols-3">

          {/* ==================================================
              LEFT / MAIN CONTENT
          ================================================== */}
          <div className="lg:col-span-2">

            <div className="rounded-[2rem] border border-sky-100 bg-white p-7 shadow-xl shadow-sky-100/70 md:p-10">

              <div className="mb-8">

                <p className="font-bold text-cyan-700">
                  About This Facility
                </p>

                <h2 className="mt-2 text-3xl font-extrabold text-sky-950 md:text-4xl">
                  {facility.title}
                </h2>

              </div>

              <div className="leading-8 text-gray-600">

                {facility.desc ? (
                  <p className="whitespace-pre-line">
                    {facility.desc}
                  </p>
                ) : (
                  <p>
                    Dew Care Hospital is committed to providing
                    quality healthcare services with modern
                    infrastructure and patient-focused care.
                  </p>
                )}

              </div>

            </div>

            {/* ==================================================
                FACILITY FEATURES
            ================================================== */}
            <div className="mt-8 grid gap-5 sm:grid-cols-2">

              <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-6">

                <div className="text-3xl">
                  {facility.icon || "🏥"}
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-sky-950">
                  Modern Facility
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Designed to support quality treatment and
                  better patient care.
                </p>

              </div>

              <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">

                <div className="text-3xl">
                  ✓
                </div>

                <h3 className="mt-4 text-lg font-extrabold text-sky-950">
                  Patient Focused Care
                </h3>

                <p className="mt-2 text-sm leading-6 text-gray-600">
                  Our healthcare team works to provide
                  reliable and comfortable patient services.
                </p>

              </div>

            </div>

          </div>

          {/* ==================================================
              SIDEBAR
          ================================================== */}
          <aside>

            <div className="sticky top-24 rounded-[2rem] bg-gradient-to-br from-sky-950 to-cyan-800 p-7 text-white shadow-2xl">

              <p className="font-bold text-cyan-200">
                Facility Information
              </p>

              <h2 className="mt-2 text-2xl font-extrabold">
                {facility.title}
              </h2>

              {/* CATEGORY */}
              <div className="mt-7 border-b border-white/10 pb-5">

                <p className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                  Category
                </p>

                <p className="mt-2 font-extrabold">
                  {facility.category || "Hospital Facility"}
                </p>

              </div>

              {/* STATUS */}
              <div className="border-b border-white/10 py-5">

                <p className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                  Status
                </p>

                <p className="mt-2 inline-flex items-center gap-2 font-extrabold text-green-300">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                  Active
                </p>

              </div>

              {/* HOSPITAL */}
              <div className="border-b border-white/10 py-5">

                <p className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                  Hospital
                </p>

                <p className="mt-2 font-extrabold">
                  Dew Care Hospital
                </p>

              </div>

              {/* BUTTONS */}
              <div className="mt-7 grid gap-3">

                <Link
                  href="/appointment"
                  className="rounded-xl bg-white px-5 py-3 text-center font-extrabold text-sky-950 transition hover:-translate-y-1 hover:shadow-lg"
                >
                  Book Appointment
                </Link>

                <a
                  href={`tel:${siteInfo.phone}`}
                  className="rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-center font-extrabold text-white transition hover:bg-white/20"
                >
                  Call Hospital
                </a>

              </div>

            </div>

          </aside>

        </div>

      </section>

      {/* ==================================================
          BACK TO FACILITIES
      ================================================== */}
      <section className="mx-auto max-w-7xl px-4 pb-20">

        <div className="flex flex-col items-center justify-between gap-5 rounded-[2rem] border border-sky-100 bg-white p-7 shadow-xl md:flex-row md:p-10">

          <div>

            <p className="font-bold text-cyan-700">
              Explore More
            </p>

            <h2 className="mt-1 text-2xl font-extrabold text-sky-950">
              Explore Our Other Hospital Facilities
            </h2>

          </div>

          <Link
            href="/facilities"
            className="rounded-xl bg-gradient-to-r from-sky-800 to-cyan-500 px-7 py-3 font-extrabold text-white shadow-lg transition hover:-translate-y-1 hover:shadow-xl"
          >
            ← All Facilities
          </Link>

        </div>

      </section>

      {/* ==================================================
          CTA
      ================================================== */}
      <section className="bg-sky-950 py-16 text-white">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-7 px-4 text-center lg:flex-row lg:text-left">

          <div>

            <p className="font-bold text-cyan-300">
              Need Medical Assistance?
            </p>

            <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">
              Our team is ready to help you.
            </h2>

          </div>

          <div className="flex flex-col gap-3 sm:flex-row">

            <Link
              href="/appointment"
              className="rounded-xl bg-cyan-500 px-7 py-4 font-extrabold text-white shadow-lg transition hover:-translate-y-1"
            >
              Book Appointment
            </Link>

            <a
              href={`tel:${siteInfo.phone}`}
              className="rounded-xl bg-white px-7 py-4 font-extrabold text-sky-950 shadow-lg transition hover:-translate-y-1"
            >
              Call Now
            </a>

          </div>

        </div>

      </section>

    </main>
  );
}