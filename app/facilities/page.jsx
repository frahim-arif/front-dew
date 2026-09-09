import Link from "next/link";
import { siteInfo } from "../data/siteData";

const API = process.env.NEXT_PUBLIC_API_URL || "https://backend-dew.onrender.com/api";
const SERVER_URL = API.replace("/api", "");

export const metadata = {
  title: "Facilities | Dew Care Hospital",
  description:
    "Advanced treatment, diagnostics, laboratory, emergency and departmental facilities at Dew Care Hospital.",
};

async function getFacilities() {
  try {
    const res = await fetch(`${API}/facilities`, { cache: "no-store" });
    const data = await res.json();

    if (data.success) {
      return (data.data || []).filter((item) => item.status === "Active");
    }

    return [];
  } catch {
    return [];
  }
}

const departments = [
  "Surgery",
  "Medicine",
  "Paediatrics",
  "Obstetrics & Gynaecology",
  "Cardiology",
  "Radiology",
  "Anesthesiology",
  "Urology",
  "Orthopedics",
  "Pathology",
  "Nephrology",
  "Neurology",
  "Gastroenterology",
];

export default async function FacilitiesPage() {
  const facilities = await getFacilities();

  const treatmentFacilities = facilities.filter(
    (item) => item.category === "Treatment"
  );

  const diagnosticFacilities = facilities.filter(
    (item) => item.category === "Diagnostic"
  );

  const emergencyFacilities = facilities.filter(
    (item) => item.category === "Emergency"
  );

  const labFacilities = facilities.filter(
    (item) => item.category === "Laboratory"
  );

  const imageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("/uploads") ? `${SERVER_URL}${path}` : path;
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-sky-800 to-cyan-700 py-24 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.35),transparent_35%)]" />
        <div className="absolute -bottom-28 -left-24 h-80 w-80 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
              Hospital Facilities
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight md:text-6xl">
              Advanced Healthcare Facilities Under One Roof
            </h1>

            <p className="mt-6 max-w-2xl text-lg text-sky-100">
              Dew Care Hospital provides advanced treatment, modern diagnostics,
              laboratory services and 24×7 emergency support.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/appointment"
                className="rounded-2xl bg-white px-7 py-4 text-center font-extrabold text-sky-950 shadow-xl transition hover:scale-105"
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

          <div className="rounded-[2rem] border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur">
            <img
              src="/images/hospital.png"
              alt="Dew Care Hospital"
              className="h-[360px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20">
        <div className="mb-12 text-center">
          <p className="font-bold text-cyan-700">Modern Infrastructure</p>
          <h2 className="mt-2 text-3xl font-extrabold text-sky-950 md:text-5xl">
            Our Key Facilities
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Facilities managed from the admin panel will appear here
            automatically.
          </p>
        </div>

        {facilities.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <p className="text-gray-500">No facilities available.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {facilities.map((item) => (
              <div
                key={item._id}
                className="group overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-xl shadow-sky-100/70 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-64 overflow-hidden bg-sky-100">
                  {item.image ? (
                    <img
                      src={imageUrl(item.image)}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-7xl">
                      {item.icon || "🏥"}
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-sky-950/70 via-transparent to-transparent" />

                  <span className="absolute bottom-4 left-4 rounded-full bg-cyan-500 px-4 py-2 text-sm font-bold text-white">
                    {item.category || "Facility"}
                  </span>
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-extrabold text-sky-950">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {treatmentFacilities.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <InfoBlock title="Treatment & Procedures" items={treatmentFacilities} />
        </section>
      )}

      {(diagnosticFacilities.length > 0 || emergencyFacilities.length > 0) && (
        <section className="mx-auto grid max-w-7xl gap-8 px-4 pb-16 lg:grid-cols-2">
          {diagnosticFacilities.length > 0 && (
            <InfoBlock title="Diagnostic & Monitoring" items={diagnosticFacilities} />
          )}

          {emergencyFacilities.length > 0 && (
            <div className="rounded-[2rem] bg-gradient-to-br from-sky-950 to-cyan-800 p-8 text-white shadow-2xl shadow-sky-200">
              <p className="font-bold text-cyan-100">Emergency Support</p>
              <h2 className="mt-2 text-3xl font-extrabold">
                24×7 Emergency Services
              </h2>

              <div className="mt-8 grid gap-4">
                {emergencyFacilities.map((item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-white/10 bg-white/10 p-5 font-bold backdrop-blur"
                  >
                    🚑 {item.title}
                  </div>
                ))}
              </div>

              <a
                href={`tel:${siteInfo.phone}`}
                className="mt-8 block rounded-2xl bg-white px-6 py-4 text-center font-extrabold text-sky-950 transition hover:scale-105"
              >
                Call {siteInfo.phone}
              </a>
            </div>
          )}
        </section>
      )}

      {labFacilities.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <InfoBlock title="Laboratory Services 24×7" items={labFacilities} />
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 pb-20">
        <div className="mb-10 text-center">
          <p className="font-bold text-cyan-700">Departments</p>
          <h2 className="mt-2 text-3xl font-extrabold text-sky-950 md:text-5xl">
            Doctors Available for Consultation
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {departments.map((dept) => (
            <div
              key={dept}
              className="rounded-2xl border border-sky-100 bg-white p-5 font-bold text-sky-950 shadow-lg shadow-sky-100/70 transition hover:-translate-y-1 hover:text-cyan-700"
            >
              🏥 Department of {dept}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-sky-950 py-16 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-8 px-4 text-center lg:flex-row lg:text-left">
          <div>
            <p className="font-bold text-cyan-300">Need Medical Assistance?</p>
            <h2 className="mt-2 text-3xl font-extrabold md:text-5xl">
              Our team is ready to help you.
            </h2>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/appointment"
              className="rounded-2xl bg-cyan-500 px-7 py-4 font-extrabold text-white shadow-lg transition hover:scale-105"
            >
              Book Appointment
            </Link>

            <a
              href={`tel:${siteInfo.phone}`}
              className="rounded-2xl bg-white px-7 py-4 font-extrabold text-sky-950 shadow-lg transition hover:scale-105"
            >
              Call Now
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}

function InfoBlock({ title, items }) {
  return (
    <div className="rounded-[2rem] border border-sky-100 bg-white p-8 shadow-xl shadow-sky-100/70 md:p-10">
      <p className="font-bold text-cyan-700">Facilities</p>
      <h2 className="mt-2 text-3xl font-extrabold text-sky-950">{title}</h2>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {items.map((item) => (
          <div
            key={item._id}
            className="rounded-2xl border border-sky-100 bg-sky-50 p-5 font-bold text-sky-950"
          >
            ✅ {item.title}
          </div>
        ))}
      </div>
    </div>
  );
}