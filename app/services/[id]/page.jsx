
import Link from "next/link";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const SERVER_URL = API.replace("/api", "");

// ==================================================
// GET SERVICE
// ==================================================
async function getService(id) {
  try {
    const res = await fetch(`${API}/services/${id}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

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

  if (image.startsWith("/uploads")) {
    return `${SERVER_URL}${image}`;
  }

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
    };
  }

  return {
    title: `${service.name} | Dew Care Hospital`,
    description:
      service.description ||
      `Learn more about ${service.name} at Dew Care Hospital.`,
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

  const imageUrl = getImageUrl(
    service.image || service.imageUrl || service.photo
  );

  const description =
    service.description ||
    service.shortDescription ||
    "Dew Care Hospital provides quality healthcare services with compassionate care and modern medical facilities.";

  const fullDescription =
    service.longDescription ||
    service.details ||
    service.content ||
    description;

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

          <h1 className="mt-3 max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            {service.name}
          </h1>

          {service.category && (
            <p className="mt-3 text-lg font-bold text-cyan-200 md:text-xl">
              {service.category}
            </p>
          )}
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
                  alt={service.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-9xl">
                  🏥
                </div>
              )}

              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-emerald-950/80 to-transparent" />

              <div className="absolute bottom-5 left-5">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-black text-white shadow-lg">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
                  Healthcare Service
                </span>
              </div>
            </div>

            {/* BASIC INFO */}
            <div className="p-6 md:p-7">
              <h2 className="text-2xl font-black text-emerald-950">
                {service.name}
              </h2>

              {service.category && (
                <p className="mt-2 font-bold text-cyan-700">
                  {service.category}
                </p>
              )}

              {service.department && (
                <div className="mt-5 flex gap-3">
                  <span className="text-xl">🏥</span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Department
                    </p>

                    <p className="mt-1 font-semibold text-slate-700">
                      {service.department}
                    </p>
                  </div>
                </div>
              )}

              {service.available !== false && (
                <div className="mt-5 flex gap-3">
                  <span className="text-xl">✓</span>

                  <div>
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Service Status
                    </p>

                    <p className="mt-1 font-bold text-emerald-600">
                      Service Available
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
            {/* OVERVIEW */}
            <div className="rounded-[2rem] border border-emerald-100 bg-white p-6 shadow-xl md:p-8">
              <div className="flex items-start justify-between gap-5">
                <div>
                  <p className="text-sm font-bold uppercase tracking-wider text-slate-400">
                    Service Overview
                  </p>

                  <h2 className="mt-2 text-2xl font-black text-emerald-950 md:text-3xl">
                    {service.name}
                  </h2>
                </div>

                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-3xl">
                  🏥
                </div>
              </div>

              <p className="mt-6 text-base leading-8 text-slate-600">
                {description}
              </p>
            </div>

            {/* KEY INFORMATION */}
            <div>
              <h2 className="mb-4 text-2xl font-black text-emerald-950">
                Service Information
              </h2>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* AVAILABILITY */}
                <div className="rounded-[1.5rem] border border-emerald-200 bg-emerald-50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center bg-emerald-100 text-xl">
                    🕒
                  </div>

                  <p className="mt-4 text-xs font-black uppercase tracking-wide text-emerald-700">
                    Availability
                  </p>

                  <p className="mt-2 text-xl font-black text-emerald-950">
                    {service.available === false
                      ? "Currently Unavailable"
                      : "Available"}
                  </p>
                </div>

                {/* DEPARTMENT */}
                <div className="rounded-[1.5rem] border border-cyan-200 bg-cyan-50 p-6">
                  <div className="flex h-12 w-12 items-center justify-center bg-cyan-100 text-xl">
                    🏥
                  </div>

                  <p className="mt-4 text-xs font-black uppercase tracking-wide text-cyan-700">
                    Department
                  </p>

                  <p className="mt-2 text-xl font-black text-cyan-950">
                    {service.department || service.category || "Hospital Care"}
                  </p>
                </div>
              </div>
            </div>

            {/* FULL DESCRIPTION */}
            <div className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-xl md:p-8">
              <h2 className="text-2xl font-black text-emerald-950">
                About This Service
              </h2>

              <div className="mt-5 whitespace-pre-line text-base leading-8 text-slate-600">
                {fullDescription}
              </div>
            </div>

            {/* FEATURES */}
            {Array.isArray(service.features) &&
              service.features.length > 0 && (
                <div className="rounded-[2rem] border border-teal-100 bg-teal-50 p-6 md:p-8">
                  <h2 className="text-2xl font-black text-teal-950">
                    Service Features
                  </h2>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {service.features.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 border border-teal-100 bg-white p-4"
                      >
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center bg-emerald-100 text-sm font-black text-emerald-700">
                          ✓
                        </span>

                        <span className="font-semibold text-slate-700">
                          {typeof feature === "string"
                            ? feature
                            : feature.name || feature.title || ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

            {/* ACTIONS */}
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
