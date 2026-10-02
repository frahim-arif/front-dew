
import Link from "next/link";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const SERVER_URL = API.replace(/\/api\/?$/, "");

// ==================================================
// GET SINGLE SERVICE
// ==================================================
async function getService(id) {
  try {
    if (!id) return null;

    const res = await fetch(`${API}/services/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error("GET SERVICE STATUS:", res.status);
      return null;
    }

    const data = await res.json();

    if (!data.success) return null;

    return data.data || null;
  } catch (error) {
    console.error("GET SERVICE ERROR:", error);
    return null;
  }
}

// ==================================================
// IMAGE URL
// ==================================================
function getImageUrl(image) {
  if (!image) return "";

  // Old/local upload support
  if (image.startsWith("/uploads")) {
    return `${SERVER_URL}${image}`;
  }

  // Cloudinary URL
  return image;
}

// ==================================================
// DYNAMIC METADATA
// ==================================================
export async function generateMetadata({ params }) {
  const { id } = await params;

  const service = await getService(id);

  if (!service) {
    return {
      title: "Service Not Found | Dew Care Hospital",
      description:
        "The requested healthcare service could not be found at Dew Care Hospital.",
    };
  }

  return {
    title: `${service.title} | Dew Care Hospital`,
    description:
      service.desc ||
      `Learn more about ${service.title} at Dew Care Hospital.`,
  };
}

// ==================================================
// PAGE
// ==================================================
export default async function ServiceDetailsPage({ params }) {
  const { id } = await params;

  const service = await getService(id);

  // ==================================================
  // NOT FOUND
  // ==================================================
  if (!service) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-cyan-50">
        <section className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center px-4 py-20">
          <div className="w-full rounded-[2rem] border border-emerald-100 bg-white p-8 text-center shadow-xl md:p-12">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-4xl">
              🏥
            </div>

            <h1 className="mt-6 text-3xl font-black text-emerald-950">
              Service Not Found
            </h1>

            <p className="mt-3 text-gray-500">
              The hospital service you are looking for is unavailable or may
              have been removed.
            </p>

            <Link
              href="/services"
              className="mt-7 inline-flex rounded-2xl bg-gradient-to-r from-emerald-800 to-cyan-600 px-7 py-3 font-black text-white shadow-lg transition hover:-translate-y-1"
            >
              ← Back to Services
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const imageUrl = getImageUrl(service.image);

  const title = service.title || "Healthcare Service";

  const description =
    service.desc ||
    "Dew Care Hospital provides quality healthcare services with compassionate care and modern medical facilities.";

  const isActive = service.status === "Active";

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-cyan-50">
      {/* ==================================================
          HERO
      ================================================== */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-emerald-800 to-cyan-700 py-14 text-white md:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,212,191,0.30),transparent_35%)]" />

        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-emerald-100 backdrop-blur transition hover:bg-white/20"
          >
            ← Back to Services
          </Link>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.2em] text-cyan-200">
            Hospital Service
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-4">
            <h1 className="text-4xl font-black leading-tight md:text-6xl">
              {title}
            </h1>

            <span
              className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black ${
                isActive
                  ? "bg-emerald-400/20 text-emerald-100 ring-1 ring-emerald-300/30"
                  : "bg-red-400/20 text-red-100 ring-1 ring-red-300/30"
              }`}
            >
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isActive ? "bg-emerald-300" : "bg-red-300"
                }`}
              />

              {isActive ? "Available" : "Currently Unavailable"}
            </span>
          </div>
        </div>
      </section>

      {/* ==================================================
          MAIN SERVICE DETAILS
      ================================================== */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 md:py-16 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[380px_1fr]">
          {/* ==================================================
              LEFT SERVICE CARD
          ================================================== */}
          <div className="h-fit overflow-hidden rounded-[2rem] border border-emerald-100 bg-white shadow-xl">
            {/* IMAGE */}
            <div className="relative h-[300px] bg-gradient-to-br from-emerald-100 to-cyan-100 md:h-[380px]">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-100">
                  <div className="text-8xl">
                    {service.icon || "🏥"}
                  </div>

                  <p className="mt-4 font-bold text-emerald-800">
                    Dew Care Hospital
                  </p>
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-emerald-950/80 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <span
                  className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white shadow-lg ${
                    isActive ? "bg-emerald-600" : "bg-red-600"
                  }`}
                >
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      isActive ? "animate-pulse bg-white" : "bg-white"
                    }`}
                  />

                  {isActive ? "Healthcare Service" : "Service Unavailable"}
                </span>
              </div>
            </div>

            {/* BASIC INFO */}
            <div className="p-6 md:p-7">
              <div className="flex items-start gap-4">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-2xl">
                  {service.icon || "🏥"}
                </div>

                <div>
                  <h2 className="text-2xl font-black text-emerald-950">
                    {title}
                  </h2>

                  <p className="mt-1 text-sm font-semibold text-slate-500">
                    Dew Care Hospital & Research Centre
                  </p>
                </div>
              </div>

              {/* STATUS */}
              <div className="mt-6 flex gap-3 border-t border-slate-100 pt-5">
                <span className="text-xl">{isActive ? "✓" : "!"}</span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                    Service Status
                  </p>

                  <p
                    className={`mt-1 font-bold ${
                      isActive ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {isActive
                      ? "Service Available"
                      : "Currently Unavailable"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ==================================================
              RIGHT DETAILS
          ================================================== */}
          <div className="space-y-6">
            {/* OVERVIEW */}
            <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-xl md:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Service Overview
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-emerald-950 md:text-3xl">
                    {title}
                  </h2>
                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                  {service.icon || "🏥"}
                </div>
              </div>

              <p className="mt-6 whitespace-pre-line text-base leading-8 text-slate-600">
                {description}
              </p>
            </div>

            {/* SERVICE INFORMATION */}
            <div>
              <h2 className="mb-4 text-2xl font-black text-emerald-950">
                Service Information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* STATUS */}
                <div
                  className={`rounded-[1.5rem] border p-6 ${
                    isActive
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-red-200 bg-red-50"
                  }`}
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center text-xl ${
                      isActive ? "bg-emerald-100" : "bg-red-100"
                    }`}
                  >
                    {isActive ? "✓" : "!"}
                  </div>

                  <p
                    className={`mt-4 text-xs font-black uppercase tracking-wide ${
                      isActive ? "text-emerald-700" : "text-red-700"
                    }`}
                  >
                    Service Status
                  </p>

                  <p
                    className={`mt-2 text-xl font-black ${
                      isActive ? "text-emerald-950" : "text-red-950"
                    }`}
                  >
                    {isActive ? "Available" : "Unavailable"}
                  </p>
                </div>

                {/* SERVICE TYPE */}
                <div className="rounded-[1.5rem] border border-cyan-200 bg-cyan-50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center bg-cyan-100 text-xl">
                    {service.icon || "🏥"}
                  </div>

                  <p className="mt-4 text-xs font-black uppercase tracking-wide text-cyan-700">
                    Service Type
                  </p>

                  <p className="mt-2 text-xl font-black text-cyan-950">
                    Hospital Care
                  </p>
                </div>
              </div>
            </div>

            {/* ABOUT SERVICE */}
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl md:p-8">
              <h2 className="text-2xl font-black text-emerald-950">
                About This Service
              </h2>

              <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                {description}
              </div>
            </div>

            {/* IMPORTANT INFORMATION */}
            <div className="rounded-[2rem] border border-amber-200 bg-amber-50 p-6 md:p-8">
              <div className="flex gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-amber-100 text-xl">
                  ℹ️
                </div>

                <div>
                  <h2 className="text-xl font-black text-amber-950">
                    Important Information
                  </h2>

                  <p className="mt-2 leading-7 text-amber-800">
                    Service availability and treatment requirements may vary
                    depending on the patient&apos;s condition. Please contact
                    Dew Care Hospital for current service information.
                  </p>
                </div>
              </div>
            </div>

            {/* ACTION */}
            <div className="flex">
              <Link
                href="/services"
                className="flex-1 rounded-2xl border border-emerald-200 bg-white px-6 py-4 text-center font-black text-emerald-800 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                ← All Services
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

