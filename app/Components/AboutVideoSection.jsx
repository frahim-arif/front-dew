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

<div className="flex h-[430px] -mb-12 flex-col justify-start border-l-4 border-emerald-500 bg-white/70 p-6 backdrop-blur-sm">

  {/* Heading */}

  <h2
    className="
      mb-4
      -mt-[35px]
      text-2xl
      font-extrabold
      leading-tight
      tracking-tight
      text-slate-900
      lg:text-3xl
    "
  >
    Dew Care Hospital &
    <span className="text-emerald-600">
      {" "}Research Centre
    </span>
  </h2>


  {/* Features */}

  <div className="grid flex-1 grid-cols-1 gap-1">

    {features.map((item, index) => (

      <div
        key={index}
        className="
          group
          flex
          items-center
          gap-3
          border
          border-slate-100
          bg-white
          px-3
          py-1.5
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-0.5
          hover:border-emerald-300
          hover:bg-emerald-50/40
          hover:shadow-md
        "
      >

        {/* Icon */}

        <div
          className="
            flex
            h-10
            w-10
            shrink-0
            items-center
            justify-center
            bg-gradient-to-br
            from-emerald-100
            to-cyan-100
            text-emerald-600
            transition-transform
            duration-300
            group-hover:scale-105
          "
        >
          {item.icon}
        </div>


        {/* Text */}

        <div className="min-w-0">

          <h4
            className="
              text-sm
              font-bold
              leading-tight
              text-slate-900
              transition-colors
              duration-300
              group-hover:text-emerald-700
              lg:text-base
            "
          >
            {item.title}
          </h4>

          <p
            className="
              mt-0.5
              text-[11px]
              leading-4
              text-slate-500
              lg:text-xs
              lg:leading-5
            "
          >
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