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
              Experience compassionate healthcare with
              modern technology, experienced specialists
              and personalized treatment plans designed
              for every patient.
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


          {/* ==================================================
              RIGHT SERVICES GRID
          ================================================== */}

          <div className="lg:col-span-8">

            {services.length === 0 ? (

              <EmptyBox text="No services available." />

            ) : (

              <>

                {/* SERVICES GRID */}

                <div
                  className="
                    grid
                    grid-cols-2
                    gap-3
                    md:gap-6
                    xl:grid-cols-3
                  "
                >

                  {services.map(
                    (service, index) => (

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

                        {/* IMAGE */}

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
                              src={fileUrl(
                                service.image
                              )}
                              alt={
                                service.title ||
                                "Healthcare Service"
                              }
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
                              {String(
                                index + 1
                              ).padStart(2, "0")}
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


                        {/* CONTENT */}

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

                          <div
                            className="
                              my-4
                              h-px
                              bg-slate-200
                              md:my-5
                            "
                          />


                          {/* FEATURES */}

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


                          {/* APPOINTMENT */}

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

                    )
                  )}

                </div>


                {/* MORE SERVICES */}

                <div
                  className="
                    mt-8
                    flex
                    justify-center
                    md:mt-10
                  "
                >

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


                    {/* Moving Shine */}

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

                      <span>
                        More Services
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
    className="
      flex
      min-h-[64px]
      w-full
      items-center
      gap-3
      bg-emerald-700
      px-4
      py-3
      text-white
      transition
      active:bg-emerald-800
    "
  >

    <div
      className="
        flex
        h-10
        w-10
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-white/15
        text-lg
      "
    >
      📞
    </div>

    <div className="flex-1">

      <p
        className="
          text-[8px]
          font-bold
          uppercase
          tracking-[0.15em]
          text-emerald-100
        "
      >
        Emergency Helpline
      </p>

      <p className="mt-0.5 text-xl font-black leading-none">
        7086803380
      </p>

    </div>

    <div
      className="
        flex
        h-8
        w-8
        shrink-0
        items-center
        justify-center
        rounded-full
        bg-white
        font-black
        text-emerald-700
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

            {/* Glow */}

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


            {/* STATS GRID */}

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

              {/* ==================================================
                  MEDICAL SERVICES
              ================================================== */}

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


              {/* ==================================================
                  DOCTORS
              ================================================== */}

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


              {/* ==================================================
                  PATIENTS
              ================================================== */}

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


              {/* ==================================================
                  EMERGENCY
              ================================================== */}

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