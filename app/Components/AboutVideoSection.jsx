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

<div className="w-full">

  <div
    className="
      relative
      overflow-hidden
      border-l-0
      border-t-4
      border-emerald-500
      bg-white/80
      p-4
      shadow-sm
      backdrop-blur-sm
      sm:p-6
      md:border-l-4
      md:border-t-0
      md:p-7
      lg:p-8
    "
  >

    {/* Decorative Glow */}
    <div
      className="
        pointer-events-none
        absolute
        -right-16
        -top-16
        h-40
        w-40
        rounded-full
        bg-emerald-300/20
        blur-3xl
      "
    />

    {/* ================= HEADING ================= */}

    <div className="relative mb-6 md:mb-8">

      <h2
        className="
          text-2xl
          font-extrabold
          leading-tight
          text-slate-900
          sm:text-3xl
          md:text-4xl
          lg:text-5xl
        "
      >
        Dew Care Hospital &

        <span className="block text-emerald-600">
          Research Centre
        </span>
      </h2>

      <div
        className="
          mt-4
          h-1
          w-16
          rounded-full
          bg-gradient-to-r
          from-emerald-500
          to-cyan-500
          md:w-24
        "
      />

    </div>


    {/* ================= FEATURES ================= */}

    <div
      className="
        relative
        grid
        grid-cols-1
        gap-3
        sm:grid-cols-2
        sm:gap-4
        lg:grid-cols-1
        lg:gap-3
      "
    >

      {features.map((item, index) => (

        <div
          key={index}
          className="
            group
            flex
            items-start
            gap-3
            border
            border-slate-100
            bg-white
            p-3
            shadow-sm
            transition-all
            duration-300
            hover:-translate-y-1
            hover:border-emerald-300
            hover:shadow-lg
            sm:p-4
          "
        >

          {/* Icon */}

          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              bg-gradient-to-br
              from-emerald-100
              to-cyan-100
              text-emerald-600
              transition-all
              duration-300
              group-hover:scale-105
              group-hover:from-emerald-200
              group-hover:to-cyan-200
              sm:h-12
              sm:w-12
            "
          >
            {item.icon}
          </div>


          {/* Text */}

          <div className="min-w-0 flex-1">

            <h4
              className="
                text-sm
                font-bold
                leading-5
                text-slate-900
                transition-colors
                duration-300
                group-hover:text-emerald-700
                sm:text-base
                md:text-lg
              "
            >
              {item.title}
            </h4>

            <p
              className="
                mt-1
                text-[11px]
                leading-5
                text-slate-600
                sm:text-xs
                sm:leading-6
                md:text-sm
              "
            >
              {item.desc}
            </p>

          </div>


          {/* Arrow */}

          <div
            className="
              hidden
              shrink-0
              text-emerald-500
              opacity-0
              transition-all
              duration-300
              group-hover:translate-x-1
              group-hover:opacity-100
              sm:block
            "
          >
            →
          </div>

        </div>

      ))}

    </div>

  </div>

</div>
        </div>
      </div>
    </section>
  );
}