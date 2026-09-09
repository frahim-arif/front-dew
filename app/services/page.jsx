import Link from "next/link";
import SectionTitle from "../Components/SectionTitle";
import ServiceCard from "../Components/ServiceCard";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export const metadata = {
  title: "Services | Dew Care Hospital",
  description: "Healthcare services at Dew Care Hospital.",
};

async function getServices() {
  try {
    const res = await fetch(`${API}/services`, {
      next: {
        revalidate: 60,
      },
    });

    const data = await res.json();

    if (!data.success) return [];

    return data.data.filter(
      (item) => item.status === "Active"
    );
  } catch {
    return [];
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <main>
      {/* Hero */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-emerald-400 font-semibold">
            Our Services
          </p>

          <h1 className="text-4xl md:text-6xl font-bold mt-3">
            Complete Hospital Services
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-gray-300">
            From emergency care to diagnostics, Dew Care Hospital
            provides essential medical services with professional
            support.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <SectionTitle
          small="Departments"
          title="Medical Services We Provide"
          desc="Professional healthcare services for patients and families."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.length > 0 ? (
            services.map((service) => (
              <ServiceCard
                key={service._id}
                service={service}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              No Services Available
            </div>
          )}
        </div>
      </section>

      {/* Emergency */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-emerald-700 font-bold uppercase tracking-widest text-sm">
              Emergency Support
            </p>

            <h2 className="text-3xl md:text-5xl font-bold mt-3">
              24/7 Emergency Care Available
            </h2>

            <p className="text-gray-600 mt-5 text-lg">
              Our emergency support helps patients get quick
              medical attention when they need it most.
            </p>

            <Link
              href="/contact"
              className="inline-block mt-8 bg-emerald-700 text-white px-7 py-4 rounded-xl font-bold"
            >
              Contact Hospital
            </Link>
          </div>

          <div className="bg-emerald-50 rounded-[2rem] p-8 grid sm:grid-cols-2 gap-5">
            {["OPD", "Emergency", "Lab", "Pharmacy"].map(
              (item) => (
                <div
                  key={item}
                  className="bg-white p-6 rounded-2xl shadow-sm"
                >
                  <h3 className="text-2xl font-bold text-emerald-800">
                    {item}
                  </h3>

                  <p className="text-gray-600 mt-2">
                    Available service
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}