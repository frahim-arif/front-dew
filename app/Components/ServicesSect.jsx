
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

// ==================================================
// ANIMATED COUNTER
// ==================================================

function AnimatedCounter({
  end,
  suffix = "",
  duration = 1800,
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const progress = Math.min(
        (currentTime - startTime) / duration,
        1
      );

      // Smooth ease-out
      const easedProgress =
        1 - Math.pow(1 - progress, 3);

      setCount(Math.floor(easedProgress * end));

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame =
      requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [end, duration]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}


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

        {/* White Overlay */}
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


      {/* ================= Main Content ================= */}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="grid items-start gap-10 lg:grid-cols-12">


          {/* ================= Left Content ================= */}

          <div className="lg:col-span-4">

            <span
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-emerald-200
                bg-white
                px-5
                py-2
                text-[11px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-emerald-700
                shadow-md
              "
            >
              OUR SERVICES
            </span>


            <h2
              className="
                mt-5
                text-3xl
                font-black
                leading-tight
                text-slate-900
                sm:text-4xl
                md:text-5xl
              "
            >
              Healthcare Services

              <span
                className="
                  block
                  bg-gradient-to-r
                  from-emerald-600
                  to-cyan-600
                  bg-clip-text
                  text-transparent
                "
              >
                You Can Trust
              </span>
            </h2>


            <div
              className="
                mt-5
                h-1
                w-24
                rounded-full
                bg-gradient-to-r
                from-emerald-500
                to-cyan-500
              "
            />


            <p
              className="
                mt-6
                max-w-md
                text-sm
                leading-7
                text-slate-600
                md:text-base
              "
            >
              Experience compassionate healthcare with modern technology,
              experienced specialists and personalized treatment plans
              designed for every patient.
            </p>


            <Link
              href="/services"
              className="
                mt-8
                inline-flex
                items-center
                rounded-xl
                bg-gradient-to-r
                from-emerald-600
                to-cyan-600
                px-7
                py-3
                font-semibold
                text-white
                shadow-lg
                transition
                hover:scale-105
              "
            >
              Explore Services →
            </Link>

          </div>


          {/* ================= Right Grid ================= */}

          <div className="lg:col-span-8">

            {services.length === 0 ? (

              <EmptyBox text="No services available." />

            ) : (

              <>

                {/* ================= Services Grid ================= */}

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                    md:gap-6
                    xl:grid-cols-3
                  "
                >

                  {services.map((service, index) => (

                    <div
                      key={service._id}
                      className="
                        group
                        overflow-hidden
                        rounded-xl
                        border
                        border-emerald-100
                        bg-white
                        shadow-md
                        transition-all
                        duration-500
                        hover:-translate-y-2
                        hover:shadow-2xl
                        md:rounded-2xl
                      "
                    >

                      {/* ================= Image ================= */}

                      <div
                        className="
                          relative
                          h-28
                          overflow-hidden
                          md:h-52
                        "
                      >

                        {service.image ? (

                          <img
                            src={fileUrl(service.image)}
                            alt={service.title || "Healthcare Service"}
                            className="
                              h-full
                              w-full
                              object-cover
                              transition
                              duration-700
                              group-hover:scale-110
                            "
                          />

                        ) : (

                          <div
                            className="
                              flex
                              h-full
                              items-center
                              justify-center
                              bg-gradient-to-br
                              from-emerald-100
                              to-cyan-100
                              text-5xl
                              md:text-7xl
                            "
                          >
                            {service.icon || "🏥"}
                          </div>

                        )}


                        {/* Overlay */}

                        <div
                          className="
                            absolute
                            inset-0
                            bg-gradient-to-t
                            from-slate-950/70
                            via-black/10
                            to-transparent
                          "
                        />


                        {/* Number */}

                        <div
                          className="
                            absolute
                            right-3
                            top-3
                            md:right-5
                            md:top-5
                          "
                        >
                          <span
                            className="
                              text-2xl
                              font-black
                              text-white/25
                              md:text-4xl
                            "
                          >
                            {String(index + 1).padStart(2, "0")}
                          </span>
                        </div>


                        {/* Badge */}

                        <div
                          className="
                            absolute
                            left-3
                            top-3
                            md:left-5
                            md:top-5
                          "
                        >
                          <span
                            className="
                              rounded-full
                              bg-white
                              px-2
                              py-1
                              text-[8px]
                              font-bold
                              text-emerald-700
                              shadow
                              md:px-4
                              md:text-[11px]
                            "
                          >
                            Premium Care
                          </span>
                        </div>

                      </div>


                      {/* ================= Content ================= */}

                      <div className="p-3 md:p-6">

                        <h3
                          className="
                            text-sm
                            font-black
                            leading-tight
                            text-slate-900
                            transition
                            duration-300
                            group-hover:text-emerald-700
                            md:text-xl
                          "
                        >
                          {service.title}
                        </h3>


                        <p
                          className="
                            mt-2
                            line-clamp-2
                            text-[11px]
                            leading-5
                            text-slate-600
                            md:line-clamp-3
                            md:text-sm
                            md:leading-7
                          "
                        >
                          {service.desc}
                        </p>


                        {/* Divider */}

                        <div className="my-4 h-px bg-slate-200 md:my-5" />


                        {/* Features */}

                        <div
                          className="
                            mb-3
                            flex
                            flex-wrap
                            gap-1
                            md:mb-6
                            md:gap-2
                          "
                        >

                          <span
                            className="
                              rounded-full
                              bg-emerald-50
                              px-2
                              py-1
                              text-[9px]
                              font-semibold
                              text-emerald-700
                              md:px-3
                              md:text-[11px]
                            "
                          >
                            Expert Doctors
                          </span>


                          <span
                            className="
                              rounded-full
                              bg-cyan-50
                              px-2
                              py-1
                              text-[9px]
                              font-semibold
                              text-cyan-700
                              md:px-3
                              md:text-[11px]
                            "
                          >
                            Modern Equipment
                          </span>

                        </div>


                        {/* Appointment Button */}

                        <Link
                          href="/appointment"
                          className="
                            inline-flex
                            w-full
                            items-center
                            justify-center
                            rounded-lg
                            bg-gradient-to-r
                            from-[#0E7686]
                            via-[#178C96]
                            to-[#2FA6A7]
                            px-3
                            py-2.5
                            text-[11px]
                            font-bold
                            text-white
                            shadow-lg
                            transition-all
                            duration-300
                            hover:scale-[1.02]
                            hover:brightness-110
                            md:rounded-xl
                            md:px-5
                            md:py-3
                            md:text-sm
                          "
                        >
                          Book Appointment →
                        </Link>

                      </div>

                    </div>

                  ))}

                </div>


                {/* ================= More Services Button ================= */}

                <div className="mt-8 flex justify-center md:mt-10">

                  <Link
                    href="/services"
                    className="
                      group
                      relative
                      inline-flex
                      items-center
                      justify-center
                      overflow-hidden
                      rounded-xl
                      border
                      border-emerald-300/40
                      bg-gradient-to-r
                      from-emerald-700
                      via-emerald-600
                      to-cyan-600
                      px-6
                      py-3
                      text-xs
                      font-black
                      text-white
                      shadow-[0_6px_0_#065f46,0_12px_25px_rgba(16,185,129,.25)]
                      transition-all
                      duration-300
                      hover:-translate-y-1
                      hover:shadow-[0_9px_0_#065f46,0_18px_35px_rgba(16,185,129,.35)]
                      active:translate-y-[2px]
                      active:shadow-[0_3px_0_#065f46]
                      md:px-8
                      md:py-4
                      md:text-sm
                    "
                  >

                    {/* Shine */}

                    <span
                      className="
                        absolute
                        inset-0
                        bg-gradient-to-b
                        from-white/20
                        via-transparent
                        to-black/10
                      "
                    />


                    <span
                      className="
                        absolute
                        -left-20
                        top-0
                        h-full
                        w-10
                        -skew-x-12
                        bg-white/30
                        blur-sm
                        transition-all
                        duration-700
                        group-hover:left-[120%]
                      "
                    />


                    <span
                      className="
                        relative
                        z-10
                        flex
                        items-center
                        gap-2
                      "
                    >
                      <span>🏥</span>
                      <span>More Services</span>

                      <span
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      >
                        →
                      </span>
                    </span>

                  </Link>

                </div>

              </>

            )}

          </div>

        </div>


{/* ==================================================
    EMERGENCY AMBULANCE BANNER
================================================== */}

<div className="mt-12 md:mt-16">

  {/* ==================================================
      MOBILE VERSION
  ================================================== */}

  <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_15px_45px_rgba(15,23,42,.12)] md:hidden">

    {/* FULL AMBULANCE IMAGE */}

    <div className="w-full bg-slate-100">
      <img
        src="/images/emergency-ambulance.jpg"
        alt="Dew Care Hospital 24x7 Emergency Ambulance"
        className="
          block
          h-auto
          w-full
          object-contain
        "
      />
    </div>

    {/* TEXT */}

    <div className="px-5 py-6">

      <p className="text-sm font-semibold tracking-wide text-slate-700">
        When seconds count,
      </p>

      <h3 className="mt-1 text-3xl font-black leading-none text-emerald-700">
        trust us
      </h3>

      <p className="mt-2 text-base font-bold text-slate-800">
        to be there!
      </p>

    </div>

    {/* FEATURES */}

    <div className="grid grid-cols-2 border-t border-slate-200">

      {/* 24x7 */}

      <div className="flex items-center gap-3 border-r border-slate-200 px-4 py-5">

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            bg-emerald-100
            text-xl
          "
        >
          🚑
        </div>

        <div>
          <p className="text-sm font-black text-slate-900">
            24×7
          </p>

          <p className="text-xs font-semibold leading-4 text-slate-600">
            Emergency Care
          </p>
        </div>

      </div>

      {/* ICU */}

      <div className="flex items-center gap-3 px-4 py-5">

        <div
          className="
            flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            bg-cyan-100
            text-xl
          "
        >
          ❤️
        </div>

        <div>
          <p className="text-sm font-black text-slate-900">
            Fully
          </p>

          <p className="text-xs font-semibold leading-4 text-slate-600">
            Equipped ICU
          </p>
        </div>

      </div>

    </div>

    {/* PHONE */}

    <a
      href="tel:7086803380"
      className="
        flex
        min-h-[62px]
        w-full
        items-center
        justify-center
        gap-3
        bg-emerald-700
        px-4
        py-3
        text-white
        transition
        hover:bg-emerald-800
      "
    >

      <span className="text-xl">
        📞
      </span>

      <span className="text-center">

        <span
          className="
            block
            text-[9px]
            font-bold
            uppercase
            tracking-wider
            text-emerald-100
          "
        >
          Emergency Helpline
        </span>

        <span className="block text-xl font-black leading-none">
          7086803380
        </span>

      </span>

    </a>

  </div>


  {/* ==================================================
      DESKTOP VERSION
  ================================================== */}

  <div
    className="
      relative
      hidden
      overflow-hidden
      border
      border-slate-200
      bg-white
      shadow-[0_15px_45px_rgba(15,23,42,.12)]
      md:block
    "
  >

    <div className="grid min-h-[190px] md:grid-cols-12">

      {/* ================= IMAGE ================= */}

      <div className="relative overflow-hidden md:col-span-5 md:h-[220px]">

        <img
          src="/images/emergency-ambulance.jpg"
          alt="Dew Care Hospital 24x7 Emergency Ambulance"
          className="
            h-full
            w-full
            object-cover
            object-center
          "
        />

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-transparent
            via-transparent
            to-white/10
          "
        />

      </div>


      {/* ================= MIDDLE TEXT ================= */}

      <div
        className="
          flex
          flex-col
          justify-center
          px-5
          md:col-span-3
          lg:px-8
        "
      >

        <p className="text-sm font-semibold tracking-wide text-slate-700">
          When seconds count,
        </p>

        <h3
          className="
            mt-1
            text-4xl
            font-black
            leading-none
            text-emerald-700
            lg:text-[42px]
          "
        >
          trust us
        </h3>

        <p className="mt-2 text-base font-bold text-slate-800">
          to be there!
        </p>

      </div>


      {/* ================= RIGHT CONTENT ================= */}

      <div
        className="
          grid
          grid-cols-1
          gap-3
          border-l
          border-slate-200
          px-5
          py-5
          md:col-span-4
          lg:px-7
        "
      >

        {/* 24x7 */}

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              bg-emerald-100
              text-lg
            "
          >
            🚑
          </div>

          <div>

            <p className="text-sm font-black text-slate-900">
              24×7
            </p>

            <p className="text-xs font-semibold text-slate-700">
              Emergency Care
            </p>

          </div>

        </div>


        {/* ICU */}

        <div className="flex items-center gap-3">

          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              bg-cyan-100
              text-lg
            "
          >
            ❤️
          </div>

          <div>

            <p className="text-sm font-black text-slate-900">
              Fully
            </p>

            <p className="text-xs font-semibold text-slate-700">
              Equipped ICU
            </p>

          </div>

        </div>


        {/* PHONE */}

        <a
          href="tel:7086803380"
          className="
            flex
            min-h-[50px]
            items-center
            justify-center
            gap-3
            bg-emerald-700
            px-4
            py-2
            text-white
            shadow-lg
            transition
            hover:bg-emerald-800
          "
        >

          <span className="text-lg">
            📞
          </span>

          <span className="text-center">

            <span
              className="
                block
                text-[9px]
                font-bold
                uppercase
                tracking-wider
                text-emerald-100
              "
            >
              Emergency Helpline
            </span>

            <span className="block text-lg font-black leading-none">
              7086803380
            </span>

          </span>

        </a>

      </div>

    </div>


    {/* ================= ENQUIRY TAB ================= */}

    <Link
      href="/appointment"
      className="
        absolute
        right-0
        top-1/2
        hidden
        h-[110px]
        w-9
        -translate-y-1/2
        items-center
        justify-center
        bg-cyan-600
        text-white
        shadow-lg
        transition
        hover:bg-cyan-700
        md:flex
      "
    >

      <span
        className="
          text-[10px]
          font-black
          uppercase
          tracking-[0.28em]
          [writing-mode:vertical-rl]
        "
      >
        ENQUIRY
      </span>

    </Link>

  </div>

</div>

        {/* ==================================================
    BOTTOM CTA
================================================== */}

<div className="mt-14 md:mt-20">

  {/* ================= STATS ================= */}

  <div
    className="
      relative
      overflow-hidden
      rounded-2xl
      border
      border-emerald-100
      bg-white/95
      p-4
      shadow-[0_15px_50px_rgba(15,23,42,.10)]
      backdrop-blur
      sm:p-6
      md:rounded-3xl
      md:p-8
    "
  >

    {/* Background Glow */}

    <div
      className="
        pointer-events-none
        absolute
        -left-20
        -top-20
        h-48
        w-48
        rounded-full
        bg-emerald-200/30
        blur-3xl
      "
    />

    <div
      className="
        pointer-events-none
        absolute
        -bottom-20
        -right-20
        h-48
        w-48
        rounded-full
        bg-cyan-200/30
        blur-3xl
      "
    />

    {/* Stats Grid */}

    <div
      className="
        relative
        grid
        grid-cols-2
        gap-3
        sm:gap-5
        lg:grid-cols-4
      "
    >

      {/* ================= MEDICAL SERVICES ================= */}

      <div
        className="
          group
          relative
          overflow-hidden
          rounded-xl
          border
          border-emerald-100
          bg-gradient-to-br
          from-emerald-50
          to-white
          p-4
          text-center
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          sm:p-6
          md:rounded-2xl
        "
      >

        <div
          className="
            mx-auto
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-emerald-100
            text-xl
            shadow-sm
            sm:h-14
            sm:w-14
            sm:text-2xl
          "
        >
          🏥
        </div>

        <h3
          className="
            mt-3
            text-2xl
            font-black
            text-emerald-600
            sm:text-3xl
            md:text-4xl
          "
        >
          <AnimatedCounter
            end={20}
            suffix="+"
          />
        </h3>

        <p
          className="
            mt-1
            text-[11px]
            font-semibold
            text-slate-600
            sm:text-sm
          "
        >
          Medical Services
        </p>

      </div>


      {/* ================= DOCTORS ================= */}

      <div
        className="
          group
          relative
          overflow-hidden
          rounded-xl
          border
          border-cyan-100
          bg-gradient-to-br
          from-cyan-50
          to-white
          p-4
          text-center
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          sm:p-6
          md:rounded-2xl
        "
      >

        <div
          className="
            mx-auto
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-cyan-100
            text-xl
            shadow-sm
            sm:h-14
            sm:w-14
            sm:text-2xl
          "
        >
          👨‍⚕️
        </div>

        <h3
          className="
            mt-3
            text-2xl
            font-black
            text-cyan-600
            sm:text-3xl
            md:text-4xl
          "
        >
          <AnimatedCounter
            end={25}
            suffix="+"
          />
        </h3>

        <p
          className="
            mt-1
            text-[11px]
            font-semibold
            text-slate-600
            sm:text-sm
          "
        >
          Expert Doctors
        </p>

      </div>


      {/* ================= PATIENTS ================= */}

      <div
        className="
          group
          relative
          overflow-hidden
          rounded-xl
          border
          border-emerald-100
          bg-gradient-to-br
          from-emerald-50
          to-white
          p-4
          text-center
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          sm:p-6
          md:rounded-2xl
        "
      >

        <div
          className="
            mx-auto
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-emerald-100
            text-xl
            shadow-sm
            sm:h-14
            sm:w-14
            sm:text-2xl
          "
        >
          ❤️
        </div>

        <h3
          className="
            mt-3
            text-2xl
            font-black
            text-emerald-600
            sm:text-3xl
            md:text-4xl
          "
        >
          <AnimatedCounter
            end={10}
            suffix="K+"
          />
        </h3>

        <p
          className="
            mt-1
            text-[11px]
            font-semibold
            text-slate-600
            sm:text-sm
          "
        >
          Happy Patients
        </p>

      </div>


      {/* ================= EMERGENCY ================= */}

      <div
        className="
          group
          relative
          overflow-hidden
          rounded-xl
          border
          border-cyan-100
          bg-gradient-to-br
          from-cyan-50
          to-white
          p-4
          text-center
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-xl
          sm:p-6
          md:rounded-2xl
        "
      >

        <div
          className="
            mx-auto
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            bg-cyan-100
            text-xl
            shadow-sm
            sm:h-14
            sm:w-14
            sm:text-2xl
          "
        >
          🚑
        </div>

        <h3
          className="
            mt-3
            text-2xl
            font-black
            text-cyan-600
            sm:text-3xl
            md:text-4xl
          "
        >
          24×7
        </h3>

        <p
          className="
            mt-1
            text-[11px]
            font-semibold
            text-slate-600
            sm:text-sm
          "
        >
          Emergency Care
        </p>

      </div>

    </div>

  </div>


  {/* ==================================================
      CTA
  ================================================== */}

  <div
    className="
      relative
      mt-8
      overflow-hidden
      rounded-2xl
      border
      border-emerald-200/50
      bg-gradient-to-br
      from-emerald-700
      via-emerald-600
      to-cyan-700
      px-5
      py-8
      text-center
      shadow-[0_20px_60px_rgba(16,185,129,.25)]
      sm:px-8
      sm:py-10
      md:mt-10
      md:rounded-3xl
      md:px-12
      md:py-12
    "
  >

    {/* Background Glow */}

    <div
      className="
        pointer-events-none
        absolute
        -left-24
        -top-24
        h-64
        w-64
        rounded-full
        bg-white/10
        blur-3xl
      "
    />

    <div
      className="
        pointer-events-none
        absolute
        -bottom-24
        -right-24
        h-64
        w-64
        rounded-full
        bg-cyan-300/20
        blur-3xl
      "
    />

    {/* Content */}

    <div className="relative z-10">

      <span
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          border
          border-white/20
          bg-white/10
          px-4
          py-1.5
          text-[10px]
          font-bold
          uppercase
          tracking-[0.2em]
          text-emerald-50
          backdrop-blur
          sm:text-xs
        "
      >
        🏥 Dew Care Hospital
      </span>


      <h3
        className="
          mt-4
          text-2xl
          font-black
          leading-tight
          text-white
          sm:text-3xl
          md:text-4xl
        "
      >
        Need Medical Assistance?
      </h3>


      <p
        className="
          mx-auto
          mt-3
          max-w-2xl
          text-sm
          leading-6
          text-emerald-50/90
          sm:text-base
          sm:leading-7
        "
      >
        Explore our healthcare services or book an appointment
        with our experienced specialists today.
      </p>


      {/* Buttons */}

      <div
        className="
          mt-7
          flex
          flex-col
          items-stretch
          justify-center
          gap-3
          sm:flex-row
          sm:items-center
          sm:gap-4
        "
      >

        {/* View Services */}

        <Link
          href="/services"
          className="
            group
            inline-flex
            min-h-[48px]
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-gradient-to-r
            from-[#C89B3C]
            via-[#E6C76A]
            to-[#B8860B]
            px-6
            py-3
            text-sm
            font-black
            text-[#3A2A00]
            shadow-[0_5px_0_#8B6A18]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:shadow-[0_10px_20px_rgba(200,155,60,.35)]
            active:translate-y-[2px]
          "
        >
          <span>🏥</span>

          <span>
            View All Services
          </span>

          <span
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          >
            →
          </span>

        </Link>


        {/* Appointment */}

        <Link
          href="/appointment"
          className="
            group
            inline-flex
            min-h-[48px]
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-white/20
            bg-slate-900/80
            px-6
            py-3
            text-sm
            font-black
            text-white
            shadow-[0_5px_0_rgba(15,23,42,.5)]
            backdrop-blur
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-slate-900
            hover:shadow-[0_10px_20px_rgba(15,23,42,.35)]
            active:translate-y-[2px]
          "
        >
          <span>📅</span>

          <span>
            Book Appointment
          </span>

          <span
            className="
              transition-transform
              duration-300
              group-hover:translate-x-1
            "
          >
            →
          </span>

        </Link>

      </div>

    </div>

  </div>

</div>

      </div>

    </section>
  );
}

