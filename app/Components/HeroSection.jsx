
"use client";

import Link from "next/link";
import Image from "next/image";
import {
  FileDown,
  CalendarDays,
  HeartPulse,
  Globe,
  Handshake,
  Award,
} from "lucide-react";

export default function HeroSection() {
  const features = [
    {
      icon: <HeartPulse size={14} />,
      title: "24×7 Emergency",
    },
    {
      icon: <Award size={14} />,
      title: "Expert Doctors",
    },
    {
      icon: <Handshake size={14} />,
      title: "Cashless",
    },
    {
      icon: <Globe size={14} />,
      title: "Modern Care",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white">

      {/* =====================================================
          DESKTOP HERO BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 hidden lg:block">

        <Image
          src="/images/hospital.png"
          alt="Hospital"
          fill
          priority
          sizes="100vw"
          className="
            object-cover
            object-[70%_30%]
            brightness-105
            contrast-110
          "
        />

        {/* Desktop Left Fade */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-white/55
            via-white/30
            to-transparent
          "
        />

      </div>


      {/* =====================================================
          MOBILE HERO
      ===================================================== */}

      <div className="lg:hidden">

        {/* Mobile Image */}
        <div className="relative w-full">

          <Image
            src="/images/hospital.png"
            alt="Dew Care Hospital"
            width={1800}
            height={1000}
            priority
            sizes="100vw"
            className="
              block
              h-auto
              w-full
              object-contain
            "
          />

          {/* Soft overlay */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-white/95
              via-white/5
              to-transparent
            "
          />


          {/* =================================================
              MOBILE CONTENT ON IMAGE
          ================================================= */}

         <div
  className="
    absolute
    inset-0
    flex
    items-center
    pt-8
    sm:pt-10
  "
     >

            <div
              className="
                w-[62%]
                pl-5
                pr-2
              

                sm:w-[58%]
                sm:pl-6
              "
            >

              {/* Heading */}

              <h1
                className="
                  text-2xl
                  font-semibold
                  leading-[1.08]
                  tracking-tight
                  text-[#2F3A2F]

                  sm:text-3xl
                "
              >
                Trusted Care,

                <span
                  className="
                    mt-1
                    block
                    text-green-600
                  "
                >
                  Exceptional Healthcare
                </span>
              </h1>


              {/* Description */}

              <p
                className="
                  mt-3
                  max-w-sm
                  text-[11px]
                  leading-5
                  text-[#5C604F]

                  sm:text-sm
                  sm:leading-6
                "
              >
                Delivering advanced medical care with experienced specialists,
                modern technology, and a patient-first approach to ensure the
                highest standards of healthcare for every family.
              </p>


              
{/* Buttons */}

<div
  className="
    mt-4
    flex
    w-full
    items-center
    justify-between
    gap-2
  "
>

  {/* Appointment */}

  <Link
    href="/appointment"
    className="
      group
      inline-flex
      flex-1
      items-center
      justify-center
      gap-1.5
      rounded-lg
      bg-gradient-to-r
      from-[#C89B3C]
      via-[#E6C76A]
      to-[#B8860B]
      px-2
      py-2
      text-[10px]
      font-bold
      text-[#3A2A00]
      shadow-[0_3px_0_#8B6A18]
      transition-all
      duration-300
      hover:-translate-y-1

      sm:px-4
      sm:py-2.5
      sm:text-xs
    "
  >
    <CalendarDays size={14} />

    <span className="whitespace-nowrap">
      Book Appointment
    </span>
  </Link>


  {/* Prescription */}

  <Link
    href="/prescription-download"
    className="
      group
      inline-flex
      flex-1
      items-center
      justify-center
      gap-1.5
      rounded-lg
      bg-[#43463b]
      px-2
      py-2
      text-[10px]
      font-bold
      text-white
      shadow-[0_3px_0_#45493B]
      transition-all
      duration-300
      hover:-translate-y-1
      hover:bg-[#6B705B]

      sm:px-4
      sm:py-2.5
      sm:text-xs
    "
  >
    <FileDown size={14} />

    <span className="whitespace-nowrap">
      Prescription PDF
    </span>
  </Link>

</div>



            </div>

          </div>

        </div>


{/* =================================================
    MOBILE FEATURE BADGES
================================================= */}

<div
  className="
    relative
    z-20
    mt-8
    flex
    w-full
    flex-nowrap
    items-center
    gap-2
    overflow-x-auto
    px-4
    pb-4
    scrollbar-hide
  "
>
  {features.map((item, index) => (
    <div
      key={index}
      className="
        group
        inline-flex
        shrink-0
        items-center
        gap-1.5
        rounded-full
        border
        border-[#E7D6A0]
        bg-gradient-to-r
        from-[#FFF9EC]
        via-[#F8E7B8]
        to-[#EBCF81]
        px-2.5
        py-1.5
        shadow-[0_6px_18px_rgba(200,155,60,.22)]
        backdrop-blur-md
        transition-all
        duration-300
        hover:-translate-y-1
        hover:scale-105
      "
    >

      {/* Icon */}

      <div
        className="
          flex
          h-5
          w-5
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-gradient-to-br
          from-[#C89B3C]
          via-[#D8AE49]
          to-[#B8860B]
          text-white
          shadow-md
          transition-all
          duration-300
          group-hover:rotate-12
          group-hover:scale-110
        "
      >
        {item.icon}
      </div>

      {/* Text */}

      <span
        className="
          whitespace-nowrap
          text-[9px]
          font-bold
          tracking-wide
          text-[#4B3910]
        "
      >
        {item.title}
      </span>

    </div>
  ))}
</div>
</div>


      {/* =====================================================
          DESKTOP MAIN CONTENT
          Desktop layout unchanged
      ===================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          hidden
          max-w-7xl
          px-5
          py-12

          sm:px-6
          sm:py-16

          lg:block
          lg:px-10
          lg:py-32
        "
      >

        <div className="max-w-xl">

          {/* Heading */}

          <h1
            className="
              text-3xl
              font-semibold
              leading-tight
              tracking-tight
              text-[#2F3A2F]

              sm:text-4xl
              md:text-5xl
              lg:text-[56px]
            "
          >
            Trusted Care,

            <span
              className="
                mt-1
                block
                text-green-600

                lg:mt-2
              "
            >
              Exceptional Healthcare
            </span>
          </h1>


          {/* Description */}

          <p
            className="
              mt-4
              max-w-lg
              text-sm
              leading-7
              text-[#5C604F]

              sm:text-base
              sm:leading-7

              lg:mt-6
              lg:text-lg
              lg:leading-8
            "
          >
            Delivering advanced medical care with experienced specialists,
            modern technology, and a patient-first approach to ensure the
            highest standards of healthcare for every family.
          </p>


          {/* Buttons */}

          <div
            className="
              mt-7
              flex
              flex-wrap
              gap-3

              lg:mt-8
            "
          >

            <Link
              href="/appointment"
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
                px-4
                py-2.5
                text-xs
                font-bold
                text-[#3A2A00]
                shadow-[0_5px_0_#8B6A18]
                transition-all
                duration-300
                hover:-translate-y-1

                sm:px-5
                sm:py-3
                sm:text-sm
              "
            >
              <CalendarDays size={17} />
              Book Appointment
            </Link>


            <Link
              href="/prescription-download"
              className="
                group
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-[#43463b]
                px-4
                py-2.5
                text-xs
                font-bold
                text-white
                shadow-[0_5px_0_#45493B]
                transition-all
                duration-300
                hover:-translate-y-1
                hover:bg-[#6B705B]

                sm:px-5
                sm:py-3
                sm:text-sm
              "
            >
              <FileDown size={17} />
              Prescription PDF
            </Link>

          </div>


          {/* Desktop Feature Badges */}

          <div
            className="
              relative
              z-20
              mt-8
              flex
              flex-wrap
              items-center
              gap-3
            "
          >

            {features.map((item, index) => (
              <div
                key={index}
                className="
                  group
                  inline-flex
                  items-center
                  gap-2.5
                  rounded-full
                  border
                  border-[#E7D6A0]
                  bg-gradient-to-r
                  from-[#FFF9EC]
                  via-[#F8E7B8]
                  to-[#EBCF81]
                  px-4
                  py-2
                  shadow-[0_6px_18px_rgba(200,155,60,.22)]
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:scale-105
                  hover:shadow-[0_12px_28px_rgba(200,155,60,.35)]
                "
              >

                <div
                  className="
                    flex
                    h-7
                    w-7
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-gradient-to-br
                    from-[#C89B3C]
                    via-[#D8AE49]
                    to-[#B8860B]
                    text-white
                    shadow-md
                    transition-all
                    duration-300
                    group-hover:rotate-12
                    group-hover:scale-110
                  "
                >
                  {item.icon}
                </div>

                <span
                  className="
                    whitespace-nowrap
                    text-xs
                    font-bold
                    tracking-wide
                    text-[#4B3910]
                  "
                >
                  {item.title}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}

