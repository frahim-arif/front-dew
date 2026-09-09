"use client";

import {
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Microscope,
} from "lucide-react";

export default function AboutVideoSection() {
  const features = [
    {
      icon: <Microscope size={30} />,
      title: "Advanced Medical Technology",
      desc: "Equipped with modern diagnostic systems and advanced treatment facilities.",
    },
    {
      icon: <Stethoscope size={30} />,
      title: "Expert Doctors",
      desc: "Highly qualified specialists providing exceptional medical care with years of experience.",
    },
    {
      icon: <HeartPulse size={30} />,
      title: "Comprehensive Healthcare",
      desc: "Complete healthcare services from emergency care to advanced surgical treatments.",
    },
    {
      icon: <ShieldCheck size={30} />,
      title: "Trusted Patient Care",
      desc: "Patient-first approach focused on safety, comfort and successful treatment outcomes.",
    },
  ];

  return (
    <section className="relative overflow-hidden -mt-16 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 py-20">
      {/* Background */}
      <div className="absolute -left-32 top-0 h-80 w-80 rounded-full bg-emerald-300/20 blur-[120px]" />
      <div className="absolute -right-20 bottom-0 h-96 w-96 rounded-full bg-cyan-300/20 blur-[140px]" />

      <div className="relative mx-auto max-w-7xl px-6">
       <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-stretch">
          {/* ================= VIDEO ================= */}

         <div className="relative  ">
  {/* Premium Golden Glow */}
  <div className="absolute -inset-4 bg-gradient-to-r from-yellow-300/30 via-[#D4AF37]/30 to-amber-500/30 "></div>

  {/* Gold Frame */}
  <div className="relative overflow-hidden bg-gradient-to-br from-[#FFF8DC] via-[#D4AF37] to-[#8B6B16] p-[6px] ">

    {/* Inner Dark Frame */}
    <div className="overflow-hidden border border-[#F7E7A9]/40 bg-[#111111] p-[2px]">

      <iframe
        className="block h-[250px] w-full md:h-[350px] lg:h-[430px]"
        src="https://www.youtube.com/embed/Olf4FIfhkJc?rel=0&modestbranding=1"
        title="Dew Care Hospital"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />

    </div>
  </div>
</div>
          {/* ================= CONTENT ================= */}

<div className="flex h-[430px] flex-col justify-start border-l-4 border-emerald-500 bg-white/70 p-6 backdrop-blur-sm">            {/* <span className="inline-flex bg-emerald-100 px-5 py-2 text-xs font-bold uppercase tracking-[0.25em] text-emerald-700">
              About Hospital
            </span> */}

            <h2 className="mb-5 -mt-[35px] text-3xl font-extrabold leading-tight text-slate-900 lg:text-4xl">
              Dew Care Hospital &
              <span className="text-emerald-600">
                {" "}
                Research Centre
              </span>
            </h2>

            {/* <p className="mt-5 text-base leading-8 text-slate-600 lg:text-lg">
              Dew Care Hospital & Research Centre is committed to delivering
              affordable, advanced and compassionate healthcare through
              world-class infrastructure, experienced specialists and modern
              medical technology.
            </p> */}

            <div className="grid flex-1 grid-cols-1 gap-1">
              {features.map((item, index) => (
                <div
                  key={index}
                className="group flex items-center gap-3 border border-slate-100 bg-white px-3 py-1.5 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg"                >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-100 text-emerald-600">                    {item.icon}
                  </div>

                  <div>
                    <h4 className="text-lg font-bold text-slate-900">
                      {item.title}
                    </h4>

                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}