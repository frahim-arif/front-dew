"use client";

import Link from "next/link";

export default function ServicesSect({
  services,
  fileUrl,
  EmptyBox,
}) {
  return (
    <section className="relative overflow-hidden bg-[#f7faf9] py-16 md:py-24">

      {/* ================= Background ================= */}


<div className="absolute inset-0">

  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('/images/21.jpg')",
    }}
  />

  {/* Dark Overlay */}
  <div className="absolute inset-0 bg-white/90" />

  {/* Left Glow */}
  <div className="absolute -left-40 top-10 h-[420px] w-[420px] rounded-full bg-emerald-300/20 blur-[130px]" />

  {/* Right Glow */}
  <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-cyan-300/20 blur-[130px]" />

  {/* Center Glow */}
  <div className="absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-green-200/15 blur-[150px]" />

  {/* Grid */}
  <div
    className="absolute inset-0 opacity-[0.05]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(16,185,129,.45) 1px, transparent 1px),
        linear-gradient(90deg, rgba(16,185,129,.45) 1px, transparent 1px)
      `,
      backgroundSize: "70px 70px",
    }}
  />

</div>
<div className="relative mx-auto max-w-7xl px-4">

  <div className="grid items-start gap-10 lg:grid-cols-12">

    {/* ================= Left Content ================= */}
    <div className="lg:col-span-4">

      <span className="inline-flex items-center rounded-full border border-emerald-200 bg-white px-5 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-700 shadow-md">
        OUR SERVICES
      </span>

      <h2 className="mt-5 text-3xl font-black leading-tight text-slate-900 sm:text-4xl md:text-5xl">
        Healthcare Services

        <span className="block bg-gradient-to-r from-emerald-600 to-cyan-600 bg-clip-text text-transparent">
          You Can Trust
        </span>
      </h2>

      <div className="mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />

      <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 md:text-base">
        Experience compassionate healthcare with modern technology,
        experienced specialists and personalized treatment plans designed
        for every patient.
      </p>

      <Link
        href="/services"
        className="mt-8 inline-flex items-center rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-7 py-3 font-semibold text-white shadow-lg transition hover:scale-105"
      >
        Explore Services →
      </Link>

    </div>

    {/* ================= Right Grid ================= */}
    <div className="lg:col-span-8">

      {services.length === 0 ? (
        <EmptyBox text="No services available." />
      ) : (

        <div className="grid grid-cols-2 gap-3 md:gap-6 xl:grid-cols-3">

          {services.map((service, index) => (
            <div
              key={service._id}
              className="
                group
                overflow-hidden
                rounded-xl
                md:rounded-2xl
                border
                border-emerald-100
                bg-white
                shadow-md
                transition-all
                duration-500
                hover:-translate-y-2
                hover:shadow-2xl
              "
            >
                {/* Image */}

                <div className="relative h-28 md:h-52 overflow-hidden">

                  {service.image ? (
                    <img
                      src={fileUrl(service.image)}
                      alt={service.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-100 text-7xl">
                      {service.icon || "🏥"}
                    </div>
                  )}

                  {/* Overlay */}

                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/10 to-transparent" />

                  {/* Service Number */}

                  <div className="absolute right-5 top-5">
                    <span className="text-2xl md:text-4xl font-black text-white/25">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Badge */}

                  <div className="absolute left-5 top-5">
                    <span className="rounded-full bg-white px-2 py-1 text-[8px] md:px-4 md:text-[11px] font-bold text-emerald-700 shadow">          Premium Care
                    </span>
                  </div>

                </div>

                {/* Content */}

                <div className="p-3 md:p-6">

                  <h3 className="text-sm md:text-xl font-black leading-tight text-slate-900 transition duration-300 group-hover:text-emerald-700">
                    {service.title}
                  </h3>

                  <p className="mt-2 line-clamp-2 md:line-clamp-3 text-[11px] md:text-sm leading-5 md:leading-7">
                    {service.desc}
                  </p>

                  {/* Divider */}

                  <div className="my-5 h-px bg-slate-200" />

                  {/* Features */}

                  <div className="mb-3 md:mb-6 flex flex-wrap gap-1 md:gap-2">

                    <span className="rounded-full bg-emerald-50 px-2 py-1 text-[9px] md:px-3 md:text-[11px] font-semibold text-emerald-700">
                      Expert Doctors
                    </span>

                    <span className="rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-semibold text-cyan-700">
                      Modern Equipment
                    </span>

                  </div>

                  {/* Button */}

                  <Link
                    href="/appointment"
                    className="
w-full
inline-flex
items-center
justify-center
rounded-lg
md:rounded-xl
bg-gradient-to-r
from-[#0E7686]
via-[#178C96]
to-[#2FA6A7]
px-3
md:px-5
py-2.5
md:py-3
text-[11px]
md:text-sm
font-bold
text-white
shadow-lg
transition-all
duration-300
hover:brightness-110
hover:scale-[1.02]
"
                  >
                    Book Appointment →
                  </Link>

                </div>

              </div>
            ))}

          </div>
          

        )}
       
        
        </div>

        

      </div>
      {/* ================= Bottom CTA ================= */}

        <div className="mt-16">

          {/* Stats */}

          <div className="mb-12 grid grid-cols-2 gap-5 rounded-[30px] border border-emerald-100 bg-white p-6 shadow-lg lg:grid-cols-4">

            <div className="text-center">
              <h3 className="text-3xl font-black text-emerald-600">20+</h3>
              <p className="mt-2 text-sm font-medium text-slate-600">
                Medical Services
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-black text-cyan-600">25+</h3>
              <p className="mt-2 text-sm font-medium text-slate-600">
                Expert Doctors
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-black text-emerald-600">10K+</h3>
              <p className="mt-2 text-sm font-medium text-slate-600">
                Happy Patients
              </p>
            </div>

            <div className="text-center">
              <h3 className="text-3xl font-black text-cyan-600">24×7</h3>
              <p className="mt-2 text-sm font-medium text-slate-600">
                Emergency Care
              </p>
            </div>

          </div>
          

          {/* CTA */}

  <div className="overflow-hidden rounded-xl md:rounded-2xl bg-blue-300 p-8 text-center shadow-[0_20px_50px_rgba(22,163,74,.30)]">

  <h3 className="text-2xl font-black text-blue-950 md:text-3xl">
    Need Medical Assistance?
  </h3>

  <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-black md:text-base">
    Explore all our healthcare services or book an appointment with our
    experienced specialists today.
  </p>

  <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

    {/* View All Services */}

  <Link
  href="/services"
  className="
    group
    inline-flex
    items-center
    gap-2
    rounded-xl
    bg-gradient-to-r
    from-[#C89B3C]
    via-[#E6C76A]
    to-[#B8860B]
    px-8
    py-3
    text-sm
    font-bold
    text-[#3A2A00]
    shadow-[0_6px_0_#8B6A18]
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-[0_12px_20px_rgba(200,155,60,.45)]
  "
>
  View All Services →
</Link>

    {/* Book Appointment */}

   <Link
  href="/appointment"
  className="
    group
    inline-flex
    items-center
    gap-2
    rounded-xl
    bg-gradient-to-r
    from-[#303435]
    via-[#43463b]
    to-[#333838]
    px-8
    py-3
    text-sm
    font-bold
    text-white
    shadow-[0_6px_0_#0B5964]
    transition-all
    duration-300
    hover:-translate-y-1
    hover:shadow-[0_12px_20px_rgba(14,118,134,.45)]
  "
>
  Book Appointment →
</Link>

  </div>

</div>

        </div>
      </div>
    </section>
  );
  
}