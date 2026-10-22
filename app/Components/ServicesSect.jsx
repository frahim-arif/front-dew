"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ==================================================
// ANIMATED COUNTER
// ==================================================

function AnimatedCounter({
  end,
  suffix = "",
  duration = 1800,
  enabled = true,
}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const counterRef = useRef(null);

  // Start animation when counter becomes visible
  useEffect(() => {
    if (!enabled) return;

    const element = counterRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [enabled]);

  // Animate number
  useEffect(() => {
    if (!started) return;

    let startTime = null;
    let animationFrame = null;

    const animate = (currentTime) => {
      if (startTime === null) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      // Smooth ease-out
      const easedProgress =
        1 - Math.pow(1 - progress, 4);

      const currentValue = Math.floor(
        easedProgress * end
      );

      setCount(currentValue);

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
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [started, end, duration]);

  return (
    <span ref={counterRef}>
      {count}
      {suffix}
    </span>
  );
}

const STATS = [
  {
    icon: "🏥",
    end: 20,
    suffix: "+",
    label: "Medical Services",
    iconBg: "from-emerald-400 to-emerald-600",
    glow: "bg-emerald-400/40",
    bar: "from-emerald-400 to-emerald-200",
  },
  {
    icon: "👨‍⚕️",
    end: 25,
    suffix: "+",
    label: "Expert Doctors",
    iconBg: "from-cyan-400 to-cyan-600",
    glow: "bg-cyan-400/40",
    bar: "from-cyan-400 to-cyan-200",
  },
  {
    icon: "❤️",
    end: 10,
    suffix: "K+",
    label: "Happy Patients",
    iconBg: "from-teal-400 to-emerald-600",
    glow: "bg-teal-400/40",
    bar: "from-teal-400 to-teal-200",
  },
  {
    icon: "🚑",
    text: "24×7",
    label: "Emergency Care",
    iconBg: "from-sky-400 to-cyan-600",
    glow: "bg-sky-400/40",
    bar: "from-sky-400 to-sky-200",
  },
];
// ==================================================
// SERVICES SECTION
// ==================================================

export default function ServicesSect({
  services,
  fileUrl,
  EmptyBox,
}) {
  return (
    <section className="relative overflow-hidden bg-[#f7faf9] py-16 md:py-24">

      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="absolute inset-0">

        {/* Background Image */}

        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('/images/21.jpg')",
          }}
        />

        {/* White Overlay */}

        <div className="absolute inset-0 bg-white/90" />

        {/* Left Glow */}

        <div
          className="
            absolute
            -left-40
            top-10
            h-[420px]
            w-[420px]
            rounded-full
            bg-emerald-300/20
            blur-[130px]
          "
        />

        {/* Right Glow */}

        <div
          className="
            absolute
            -right-40
            bottom-0
            h-[420px]
            w-[420px]
            rounded-full
            bg-cyan-300/20
            blur-[130px]
          "
        />

        {/* Center Glow */}

        <div
          className="
            absolute
            left-1/2
            top-20
            h-[500px]
            w-[500px]
            -translate-x-1/2
            rounded-full
            bg-green-200/15
            blur-[150px]
          "
        />

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


      {/* ==================================================
          MAIN CONTENT
      ================================================== */}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

       <div className="grid items-start gap-10 lg:grid-cols-12">

  {/* ==================================================
      LEFT CONTENT
  ================================================== */}

  <div className="lg:sticky lg:top-24 lg:col-span-4">

    {/* Badge */}
    <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/90 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.25em] text-emerald-700 shadow-md backdrop-blur">
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
      </span>
      Our Services
    </span>

    {/* Heading */}
    <h2 className="mt-5 text-3xl font-black leading-[1.1] tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
      Healthcare Services
      <span className="block bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600 bg-clip-text text-transparent">
        You Can Trust
      </span>
    </h2>

    {/* Divider */}
    <div className="mt-5 flex items-center gap-2">
      <div className="h-1 w-20 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500" />
      <div className="h-1 w-3 rounded-full bg-emerald-300" />
      <div className="h-1 w-1.5 rounded-full bg-emerald-200" />
    </div>

    <p className="mt-6 max-w-md text-sm leading-7 text-slate-600 md:text-base">
      Experience compassionate healthcare with modern technology,
      experienced specialists and personalized treatment plans designed
      for every patient.
    </p>

    {/* Trust points */}
    <ul className="mt-6 space-y-3">
      {[
        "Experienced & caring specialists",
        "Modern diagnostic equipment",
        "Personalized treatment plans",
      ].map((point) => (
        <li key={point} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-[11px] text-white shadow-md shadow-emerald-500/30">
            ✓
          </span>
          {point}
        </li>
      ))}
    </ul>

    {/* CTA */}
    <Link
      href="/services"
      className="group relative mt-8 inline-flex items-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 px-7 py-3.5 font-bold text-white shadow-[0_10px_30px_-8px_rgba(16,185,129,.6)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-8px_rgba(16,185,129,.8)] active:scale-95"
    >
      <span className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-white/30 blur-sm transition-all duration-700 group-hover:left-[130%]" />
      <span className="relative">Explore Services</span>
      <span className="relative transition-transform duration-300 group-hover:translate-x-1">→</span>
    </Link>

  </div>


  {/* ==================================================
      RIGHT SERVICES GRID
  ================================================== */}

  <div className="lg:col-span-8">

    {services.length === 0 ? (
      <EmptyBox text="No services available." />
    ) : (
      <>
        <div className="grid grid-cols-2 gap-3 md:gap-6 xl:grid-cols-3">

          {services.map((service, index) => (

            /* Gradient border wrapper */
            <div
              key={service._id}
              className="
                group relative rounded-xl p-[1.5px] md:rounded-2xl
                bg-gradient-to-br from-emerald-200 via-white to-cyan-200
                shadow-md transition-all duration-500
                hover:-translate-y-2 hover:from-emerald-400 hover:via-teal-300 hover:to-cyan-400
                hover:shadow-[0_25px_50px_-12px_rgba(16,185,129,.45)]
              "
            >

              <div className="flex h-full flex-col overflow-hidden rounded-[10px] bg-white md:rounded-[14px]">

                {/* IMAGE */}
                <div className="relative h-28 overflow-hidden md:h-52">

                  {service.image ? (
                    <img
                      src={fileUrl(service.image)}
                      alt={service.title || "Healthcare Service"}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110 group-hover:rotate-1"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-gradient-to-br from-emerald-100 to-cyan-100 text-5xl md:text-7xl">
                      {service.icon || "🏥"}
                    </div>
                  )}

                  {/* Overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/10 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-cyan-500/0 transition duration-500 group-hover:from-emerald-500/20 group-hover:to-cyan-500/20" />

                  {/* Number */}
                  <span className="absolute right-3 top-2 text-3xl font-black leading-none text-white/30 transition duration-500 group-hover:text-white/60 md:right-5 md:top-3 md:text-5xl">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Badge */}
                  <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[8px] font-bold text-emerald-700 shadow-lg backdrop-blur md:left-5 md:top-5 md:px-3 md:text-[11px]">
                    <span className="text-amber-500">★</span> Premium Care
                  </span>

                </div>

                {/* CONTENT */}
                <div className="flex flex-1 flex-col p-3 md:p-6">

                  <h3 className="text-sm font-black leading-tight text-slate-900 transition duration-300 group-hover:text-emerald-700 md:text-xl">
                    {service.title}
                  </h3>

                  {/* Animated underline */}
                  <div className="mt-2 h-0.5 w-8 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500 group-hover:w-16" />

                  <p className="mt-3 line-clamp-2 text-[11px] leading-5 text-slate-600 md:line-clamp-3 md:text-sm md:leading-7">
                    {service.desc}
                  </p>

                  {/* Feature chips */}
                  <div className="mt-4 flex flex-wrap gap-1 md:gap-2">
                    <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2 py-1 text-[9px] font-semibold text-emerald-700 md:px-3 md:text-[11px]">
                      ✔ Expert Doctors
                    </span>
                    <span className="rounded-full border border-cyan-100 bg-cyan-50 px-2 py-1 text-[9px] font-semibold text-cyan-700 md:px-3 md:text-[11px]">
                      ✔ Modern Equipment
                    </span>
                  </div>

                  {/* VIEW DETAILS — sticks to bottom so all cards align */}
                  <Link
                    href={`/services/${service._id}`}
                    className="
                      group/btn relative mt-4 inline-flex w-full items-center justify-center gap-2
                      overflow-hidden rounded-lg px-3 py-2.5 text-[11px] font-bold md:mt-auto md:rounded-xl md:px-5 md:py-3 md:text-sm
                      border border-emerald-200 bg-emerald-50 text-emerald-800
                      transition-all duration-300
                      hover:border-transparent hover:bg-gradient-to-r hover:from-emerald-600 hover:to-cyan-600 hover:text-white hover:shadow-lg hover:shadow-emerald-500/30
                    "
                  >
                    View Details
                    <span className="text-base transition-transform duration-300 group-hover/btn:translate-x-1">
                      →
                    </span>
                  </Link>

                </div>
              </div>
            </div>

          ))}

        </div>


        {/* MORE SERVICES */}
        <div className="mt-8 flex justify-center md:mt-12">
          <Link
            href="/services"
            className="
              group relative inline-flex items-center justify-center overflow-hidden rounded-xl
              border border-emerald-300/40
              bg-gradient-to-r from-emerald-700 via-emerald-600 to-cyan-600
              px-6 py-3 text-xs font-black text-white md:px-8 md:py-4 md:text-sm
              shadow-[0_6px_0_#065f46,0_12px_25px_rgba(16,185,129,.25)]
              transition-all duration-300
              hover:-translate-y-1 hover:shadow-[0_9px_0_#065f46,0_18px_35px_rgba(16,185,129,.35)]
              active:translate-y-[2px] active:shadow-[0_3px_0_#065f46]
            "
          >
            <span className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10" />
            <span className="absolute -left-20 top-0 h-full w-10 -skew-x-12 bg-white/30 blur-sm transition-all duration-700 group-hover:left-[120%]" />
            <span className="relative z-10 flex items-center gap-2">
              <span>🏥</span>
              <span>More Services</span>
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </Link>
        </div>
      </>
    )}

  </div>

</div>



{/* ==================================================
    MOBILE VERSION — CLEAN HOSPITAL EMERGENCY
================================================== */}

<div
  className="
    overflow-hidden
    border
    border-slate-200
    bg-white
    shadow-[0_12px_35px_rgba(15,23,42,.12)]
    md:hidden
  "
>

  {/* ==================================================
      FULL AMBULANCE IMAGE
  ================================================== */}

  <div className="relative w-full bg-slate-100">

    <img
      src="/images/emergency-ambulance.jpg"
      alt="Dew Care Hospital Emergency Ambulance"
      className="
        block
        h-auto
        w-full
        object-contain
      "
    />

    {/* Small Emergency Badge */}
    <div
      className="
        absolute
        left-3
        top-3
        flex
        items-center
        gap-1.5
        bg-red-600
        px-3
        py-1.5
        text-[9px]
        font-black
        uppercase
        tracking-wider
        text-white
        shadow-lg
      "
    >
      <span
        className="
          h-2
          w-2
          rounded-full
          bg-white
        "
      />

      24×7 Emergency
    </div>

  </div>


  {/* ==================================================
      SMALL TRUST CONTENT
  ================================================== */}

  <div
    className="
      border-t
      border-slate-200
      bg-white
      px-4
      py-4
    "
  >

    <div className="flex items-center justify-between gap-3">

      {/* Hospital Name */}
      <div className="min-w-0">

        <p
          className="
            text-[9px]
            font-black
            uppercase
            tracking-[0.15em]
            text-emerald-600
          "
        >
          Dew Care Hospital LLP
        </p>

        <p
          className="
            mt-0.5
            text-base
            font-black
            leading-tight
            text-slate-900
          "
        >
          Emergency & Critical Care
        </p>

        <p
          className="
            mt-1
            text-[10px]
            font-medium
            text-slate-500
          "
        >
          When seconds count, trust us.
        </p>

      </div>


      {/* Emergency Icon */}
      <div
        className="
          flex
          h-12
          w-12
          shrink-0
          items-center
          justify-center
          bg-emerald-100
          text-2xl
        "
      >
        🚑
      </div>

    </div>

  </div>


  {/* ==================================================
      FEATURES
  ================================================== */}

  <div
    className="
      grid
      grid-cols-2
      border-t
      border-slate-200
    "
  >

    {/* 24×7 */}
    <div
      className="
        flex
        items-center
        gap-2.5
        border-r
        border-slate-200
        px-4
        py-3.5
      "
    >

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          bg-emerald-100
          text-base
        "
      >
        🚑
      </div>

      <div>
        <p className="text-sm font-black leading-none text-slate-900">
          24×7
        </p>

        <p className="mt-1 text-[10px] font-semibold text-slate-600">
          Emergency Care
        </p>
      </div>

    </div>


    {/* ICU */}
    <div
      className="
        flex
        items-center
        gap-2.5
        px-4
        py-3.5
      "
    >

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          bg-cyan-100
          text-base
        "
      >
        ❤️
      </div>

      <div>
        <p className="text-sm font-black leading-none text-slate-900">
          Fully
        </p>

        <p className="mt-1 text-[10px] font-semibold text-slate-600">
          Equipped ICU
        </p>
      </div>

    </div>

  </div>


  {/* ==================================================
      EMERGENCY PHONE
================================================== */}

<a
  href="tel:7086803380"
  aria-label="Call Emergency Helpline 7086803380"
  className="
    group relative flex min-h-[76px] w-full items-center gap-4
    overflow-hidden
    bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-800
    px-5 py-4 text-white
    shadow-[0_10px_30px_-8px_rgba(5,150,105,0.65)]
    ring-1 ring-inset ring-white/20
    transition-all duration-300
    hover:shadow-[0_14px_36px_-8px_rgba(5,150,105,0.85)]
    active:scale-[0.98]
  "
>
  {/* Soft glow blobs */}
  <div className="pointer-events-none absolute -left-8 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />
  <div className="pointer-events-none absolute -bottom-12 right-6 h-28 w-28 rounded-full bg-teal-300/30 blur-2xl" />

  {/* Shine sweep on hover */}
  <div
    className="
      pointer-events-none absolute inset-y-0 -left-1/2 w-1/3
      -skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent
      opacity-0 transition-all duration-700
      group-hover:left-[130%] group-hover:opacity-100
    "
  />

  {/* Icon with pulsing ring */}
  <div className="relative shrink-0">
    <span className="absolute inset-0 animate-ping rounded-full bg-white/40" />
    <div
      className="
        relative flex h-12 w-12 items-center justify-center
        rounded-full bg-white/20 text-2xl
        shadow-inner ring-1 ring-white/40 backdrop-blur-md
        transition-transform duration-300
        group-hover:rotate-[-12deg] group-hover:scale-110
      "
    >
      📞
    </div>
  </div>

  {/* Text */}
  <div className="relative flex-1">
    <div className="flex items-center gap-1.5">
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-300 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lime-300" />
      </span>
      <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-emerald-50">
        Emergency Helpline • 24×7
      </p>
    </div>

    <p className="mt-1 text-[26px] font-black leading-none tracking-wider drop-shadow-sm">
      7086803380
    </p>
  </div>

  {/* Arrow button */}
  <div
    className="
      relative flex h-10 w-10 shrink-0 items-center justify-center
      rounded-full bg-white text-lg font-black text-emerald-700
      shadow-lg transition-all duration-300
      group-hover:translate-x-1 group-hover:bg-lime-100
      group-active:translate-x-2
    "
  >
    →
  </div>
</a>
</div> 









{/* ==================================================
    DESKTOP VERSION — IMAGE + EMERGENCY INFO
================================================== */}

<div
  className="
    relative
    hidden
    overflow-hidden
    border
    border-slate-200
    bg-white
    shadow-[0_20px_60px_rgba(15,23,42,.14)]
    md:block
  "
>
  {/* Decorative Background */}
  <div
    className="
      pointer-events-none
      absolute
      inset-0
      bg-[radial-gradient(circle_at_75%_20%,rgba(16,185,129,.08),transparent_35%),radial-gradient(circle_at_100%_100%,rgba(6,182,212,.08),transparent_35%)]
    "
  />

  <div className="relative grid min-h-[250px] md:grid-cols-12">

    {/* ==================================================
        LARGE LEFT IMAGE
    ================================================== */}

    <div className="relative overflow-hidden md:col-span-8">
      <img
        src="/images/emergency-ambulance.jpg"
        alt="Dew Care Hospital 24x7 Emergency Ambulance"
        className="
          h-full
          min-h-[250px]
          w-full
          object-cover
          object-center
          transition-transform
          duration-700
          hover:scale-105
        "
      />

      {/* Dark image overlay */}
      <div
        className="
          absolute
          inset-0
          bg-gradient-to-r
          from-slate-950/45
          via-slate-900/10
          to-transparent
        "
      />

      {/* Emergency Badge */}
      <div
        className="
          absolute
          left-6
          top-6
          flex
          items-center
          gap-2
          bg-red-600
          px-4
          py-2.5
          text-xs
          font-black
          uppercase
          tracking-wider
          text-white
          shadow-xl
        "
      >
        <span className="relative flex h-2.5 w-2.5">
          <span
            className="
              absolute
              inline-flex
              h-full
              w-full
              animate-ping
              rounded-full
              bg-white
              opacity-75
            "
          />
          <span
            className="
              relative
              inline-flex
              h-2.5
              w-2.5
              rounded-full
              bg-white
            "
          />
        </span>

        24×7 Emergency
      </div>

      {/* Bottom Image Branding */}
      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          bg-gradient-to-t
          from-slate-950/90
          via-slate-950/40
          to-transparent
          px-7
          pb-6
          pt-20
        "
      >
        <p
          className="
            text-xs
            font-black
            uppercase
            tracking-[0.2em]
            text-emerald-300
          "
        >
          Dew Care Hospital LLP
        </p>

        <p className="mt-1 text-xl font-black text-white">
          Emergency & Critical Care
        </p>

        <p className="mt-1 text-xs font-medium text-white/75">
          Immediate medical assistance when you need it most
        </p>
      </div>
    </div>

    {/* ==================================================
        RIGHT EMERGENCY INFORMATION
    ================================================== */}

    <div
      className="
        relative
        grid
        grid-cols-2
        gap-3
        border-l
        border-slate-200
        bg-slate-50/80
        p-5
        md:col-span-4
        lg:p-6
      "
    >

      {/* 24x7 Emergency */}
      <div
        className="
          group
          border
          border-emerald-100
          bg-white
          p-4
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-emerald-200
          hover:shadow-lg
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            bg-emerald-100
            text-xl
            transition
            duration-300
            group-hover:scale-110
          "
        >
          🚑
        </div>

        <p className="mt-3 text-lg font-black leading-none text-slate-900">
          24×7
        </p>

        <p className="mt-1 text-xs font-bold text-slate-600">
          Emergency Care
        </p>

        <div className="mt-3 h-1 w-8 bg-emerald-600" />
      </div>

      {/* ICU */}
      <div
        className="
          group
          border
          border-cyan-100
          bg-white
          p-4
          shadow-sm
          transition-all
          duration-300
          hover:-translate-y-1
          hover:border-cyan-200
          hover:shadow-lg
        "
      >
        <div
          className="
            flex
            h-11
            w-11
            items-center
            justify-center
            bg-cyan-100
            text-xl
            transition
            duration-300
            group-hover:scale-110
          "
        >
          ❤️
        </div>

        <p className="mt-3 text-lg font-black leading-none text-slate-900">
          Fully
        </p>

        <p className="mt-1 text-xs font-bold text-slate-600">
          Equipped ICU
        </p>

        <div className="mt-3 h-1 w-8 bg-cyan-600" />
      </div>

      {/* Emergency Phone */}
      <a
        href="tel:7086803380"
        className="
          group
          col-span-2
          flex
          min-h-[78px]
          items-center
          justify-between
          gap-4
          bg-gradient-to-r
          from-emerald-700
          to-emerald-600
          px-5
          py-3
          text-white
          shadow-[0_8px_25px_rgba(5,150,105,.25)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:from-emerald-800
          hover:to-emerald-700
          hover:shadow-[0_12px_30px_rgba(5,150,105,.35)]
        "
      >
        <div className="flex items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-white/15
              ring-1
              ring-white/20
            "
          >
            📞
          </div>

          <div>
            <span
              className="
                block
                text-[9px]
                font-black
                uppercase
                tracking-[0.18em]
                text-emerald-100
              "
            >
              Emergency Helpline
            </span>

            <span
              className="
                mt-1
                block
                text-xl
                font-black
                leading-none
                tracking-wide
              "
            >
              7086803380
            </span>
          </div>
        </div>

        <div
          className="
            hidden
            h-9
            w-9
            items-center
            justify-center
            rounded-full
            bg-white
            text-emerald-700
            transition
            duration-300
            group-hover:scale-110
            lg:flex
          "
        >
          →
        </div>
      </a>
    </div>
  </div>

  {/* ==================================================
      ENQUIRY TAB
  ================================================== */}

  <Link
    href="/appointment"
    className="
      absolute
      right-0
      top-1/2
      hidden
      h-[118px]
      w-10
      -translate-y-1/2
      items-center
      justify-center
      bg-gradient-to-b
      from-cyan-500
      to-cyan-700
      text-white
      shadow-[0_8px_20px_rgba(8,145,178,.25)]
      transition-all
      duration-300
      hover:w-12
      hover:from-cyan-600
      hover:to-cyan-800
      md:flex
    "
    aria-label="Make an enquiry"
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





        {/* ==================================================
            BOTTOM CTA
        ================================================== */}

        <div className="mt-14 md:mt-20">

          {/* ==================================================
    STATS
================================================== */}

<div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 p-4 shadow-[0_25px_70px_-15px_rgba(6,78,59,.6)] ring-1 ring-white/10 sm:p-6 md:rounded-3xl md:p-8">

  {/* Background glows */}
  <div className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl" />

  {/* Subtle grid */}
  <div
    className="pointer-events-none absolute inset-0 opacity-[0.07]"
    style={{
      backgroundImage:
        "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
      backgroundSize: "40px 40px",
    }}
  />

  {/* Top shine line */}
  <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

  {/* Stats grid */}
  <div className="relative grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
    {STATS.map((stat) => (
      <div
        key={stat.label}
        className="
          group relative overflow-hidden rounded-xl
          border border-white/10 bg-white/[0.06]
          p-4 text-center backdrop-blur-md
          transition-all duration-500
          hover:-translate-y-2 hover:border-white/25 hover:bg-white/[0.1]
          hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,.5)]
          sm:p-6 md:rounded-2xl
        "
      >
        {/* Hover glow */}
        <div
          className={`pointer-events-none absolute -top-10 left-1/2 h-24 w-24 -translate-x-1/2 rounded-full ${stat.glow} opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100`}
        />

        {/* Icon */}
        <div className="relative mx-auto h-12 w-12 sm:h-16 sm:w-16">
          <div className={`absolute inset-0 rounded-2xl ${stat.glow} blur-lg`} />
          <div
            className={`
              relative flex h-full w-full items-center justify-center
              rounded-2xl bg-gradient-to-br ${stat.iconBg}
              text-xl shadow-lg ring-1 ring-white/30
              transition-transform duration-500
              group-hover:rotate-6 group-hover:scale-110
              sm:text-3xl
            `}
          >
            {stat.icon}
          </div>
        </div>

        {/* Number */}
        <h3 className="relative mt-4 bg-gradient-to-b from-white to-emerald-200 bg-clip-text text-3xl font-black tracking-tight text-transparent sm:text-4xl md:text-5xl">
          {stat.text ? (
            stat.text
          ) : (
            <AnimatedCounter end={stat.end} suffix={stat.suffix} />
          )}
        </h3>

        {/* Label */}
        <p className="relative mt-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-100/80 sm:text-xs">
          {stat.label}
        </p>

        {/* Bottom accent bar */}
        <div
          className={`mx-auto mt-4 h-1 w-8 rounded-full bg-gradient-to-r ${stat.bar} transition-all duration-500 group-hover:w-16`}
        />
      </div>
    ))}
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

            {/* Glow */}

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


            {/* CTA CONTENT */}

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
                Explore our healthcare services or book
                an appointment with our experienced
                specialists today.
              </p>


              {/* BUTTONS */}

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

                {/* SERVICES */}

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


                {/* APPOINTMENT */}

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