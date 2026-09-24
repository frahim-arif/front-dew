
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
            BOTTOM CTA
        ================================================== */}

        <div className="mt-16">

          {/* Stats */}

          <div
            className="
              mb-12
              grid
              grid-cols-2
              gap-5
              rounded-[30px]
              border
              border-emerald-100
              bg-white
              p-6
              shadow-lg
              lg:grid-cols-4
            "
          >

            <div className="text-center">
              <h3 className="text-3xl font-black text-emerald-600">
                20+
              </h3>

              <p className="mt-2 text-sm font-medium text-slate-600">
                Medical Services
              </p>
            </div>


            <div className="text-center">
              <h3 className="text-3xl font-black text-cyan-600">
                25+
              </h3>

              <p className="mt-2 text-sm font-medium text-slate-600">
                Expert Doctors
              </p>
            </div>


            <div className="text-center">
              <h3 className="text-3xl font-black text-emerald-600">
                10K+
              </h3>

              <p className="mt-2 text-sm font-medium text-slate-600">
                Happy Patients
              </p>
            </div>


            <div className="text-center">
              <h3 className="text-3xl font-black text-cyan-600">
                24×7
              </h3>

              <p className="mt-2 text-sm font-medium text-slate-600">
                Emergency Care
              </p>
            </div>

          </div>


          {/* ================= CTA ================= */}

          <div
            className="
              overflow-hidden
              rounded-xl
              bg-blue-300
              p-8
              text-center
              shadow-[0_20px_50px_rgba(22,163,74,.30)]
              md:rounded-2xl
            "
          >

            <h3 className="text-2xl font-black text-blue-950 md:text-3xl">
              Need Medical Assistance?
            </h3>


            <p
              className="
                mx-auto
                mt-4
                max-w-2xl
                text-sm
                leading-7
                text-black
                md:text-base
              "
            >
              Explore all our healthcare services or book an appointment
              with our experienced specialists today.
            </p>


            <div
              className="
                mt-8
                flex
                flex-col
                justify-center
                gap-4
                sm:flex-row
              "
            >

              {/* View All Services */}

              <Link
                href="/services"
                className="
                  group
                  inline-flex
                  items-center
                  justify-center
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
                  justify-center
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

