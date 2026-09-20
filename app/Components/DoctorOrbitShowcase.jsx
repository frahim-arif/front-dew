"use client";

import { useEffect, useMemo, useState } from "react";

/* ============================================================
   API
============================================================ */

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew.onrender.com/api";

const SERVER_URL = API.replace(/\/api\/?$/, "");

/* ============================================================
   ORBIT SETTINGS
============================================================ */

// Foridul ke around maximum 8 doctors
const DOCTORS_PER_GROUP = 8;

// 4 inner + 4 outer = 8 doctors
const INNER_RING_COUNT = 4;

// Orbit rotation speed
const ROTATION_DURATION = 26000;

// Agar 8 se zyada doctors hon to group change
const GROUP_CHANGE_DURATION = 26000;

/* ============================================================
   IMAGE URL
============================================================ */

function getImageUrl(path) {
  if (!path || typeof path !== "string") {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://")
  ) {
    return path;
  }

  if (path.startsWith("/uploads")) {
    return `${SERVER_URL}${path}`;
  }

  if (path.startsWith("uploads/")) {
    return `${SERVER_URL}/${path}`;
  }

  return path;
}

/* ============================================================
   NAME NORMALIZER
============================================================ */

function normalizeName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, " ");
}

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function DoctorOrbitShowcase({ doctors = [] }) {
  const [activeGroup, setActiveGroup] = useState(0);

  /* ============================================================
     SAFE DOCTORS
  ============================================================ */

  const safeDoctors = useMemo(() => {
    if (!Array.isArray(doctors)) {
      return [];
    }

    return doctors.filter(
      (doctor) =>
        doctor &&
        typeof doctor === "object"
    );
  }, [doctors]);

  /* ============================================================
     FIND DR. FORIDUL HUSSAIN
     
     Priority:
     - foridul hussain
     - foridul
  ============================================================ */

  const foridulDoctor = useMemo(() => {
    return safeDoctors.find((doctor) => {
      const name = normalizeName(doctor?.name);

      return (
        name.includes("foridul hussain") ||
        name.includes("foridul")
      );
    });
  }, [safeDoctors]);

  /* ============================================================
     CENTER DOCTOR

     1. Dr. Foridul Hussain
     2. Fallback first doctor
  ============================================================ */

  const mainDoctor = useMemo(() => {
    return (
      foridulDoctor ||
      safeDoctors[0] ||
      null
    );
  }, [foridulDoctor, safeDoctors]);

  /* ============================================================
     OTHER DOCTORS

     Center doctor orbit mein dobara nahi aayega.
  ============================================================ */

  const otherDoctors = useMemo(() => {
    if (!mainDoctor) {
      return [];
    }

    return safeDoctors.filter((doctor) => {
      // ID available ho to ID se compare
      if (
        doctor?._id &&
        mainDoctor?._id
      ) {
        return (
          String(doctor._id) !==
          String(mainDoctor._id)
        );
      }

      // Same object
      if (doctor === mainDoctor) {
        return false;
      }

      // Extra protection:
      // agar same naam ka duplicate Foridul record aa jaye
      const doctorName = normalizeName(
        doctor?.name
      );

      const mainName = normalizeName(
        mainDoctor?.name
      );

      if (
        doctorName &&
        mainName &&
        doctorName === mainName
      ) {
        return false;
      }

      return true;
    });
  }, [safeDoctors, mainDoctor]);

  /* ============================================================
     GROUP DOCTORS

     Example:

     8 doctors:
     Group 1 = 8

     12 doctors:
     Group 1 = 8
     Group 2 = 4

     18 doctors:
     Group 1 = 8
     Group 2 = 8
     Group 3 = 2
  ============================================================ */

  const doctorGroups = useMemo(() => {
    const groups = [];

    for (
      let index = 0;
      index < otherDoctors.length;
      index += DOCTORS_PER_GROUP
    ) {
      groups.push(
        otherDoctors.slice(
          index,
          index + DOCTORS_PER_GROUP
        )
      );
    }

    return groups;
  }, [otherDoctors]);

  /* ============================================================
     VISIBLE GROUP
  ============================================================ */

  const visibleDoctors =
  
    doctorGroups[activeGroup] || [];

    /* TEST */
console.log("========== DOCTOR ORBIT TEST ==========");
console.log("TOTAL DOCTORS:", safeDoctors.length);
console.log("MAIN DOCTOR:", mainDoctor?.name);
console.log("OTHER DOCTORS:", otherDoctors.length);
console.log(
  "VISIBLE DOCTORS:",
  visibleDoctors.map((d) => d?.name)
);
console.log("========================================");

  /* ============================================================
     SPLIT:

     Inner = first 4
     Outer = remaining 4
  ============================================================ */

  const innerDoctors = visibleDoctors.slice(
    0,
    INNER_RING_COUNT
  );

  const outerDoctors = visibleDoctors.slice(
    INNER_RING_COUNT,
    DOCTORS_PER_GROUP
  );

  /* ============================================================
     AUTO GROUP CHANGE
  ============================================================ */

  useEffect(() => {
    if (doctorGroups.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveGroup((previousGroup) => {
        return (
          (previousGroup + 1) %
          doctorGroups.length
        );
      });
    }, GROUP_CHANGE_DURATION);

    return () => {
      window.clearInterval(timer);
    };
  }, [doctorGroups.length]);

  /* ============================================================
     RESET GROUP WHEN DATA CHANGES
  ============================================================ */

  useEffect(() => {
    setActiveGroup((currentGroup) => {
      if (
        doctorGroups.length === 0 ||
        currentGroup >= doctorGroups.length
      ) {
        return 0;
      }

      return currentGroup;
    });
  }, [doctorGroups.length]);

  /* ============================================================
     NO DOCTORS
  ============================================================ */

  if (!mainDoctor) {
    return (
      <div className="relative flex min-h-[380px] w-full items-center justify-center overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-gradient-to-br from-emerald-900/40 via-slate-900/60 to-teal-900/40 p-6 shadow-[0_20px_60px_rgba(0,0,0,.35)] backdrop-blur-2xl sm:min-h-[460px]">

        <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/20 blur-[100px]" />

        <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-[100px]" />

        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(
                rgba(255,255,255,.4) 1px,
                transparent 1px
              ),
              linear-gradient(
                90deg,
                rgba(255,255,255,.4) 1px,
                transparent 1px
              )
            `,
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative text-center">

          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-300/20 bg-gradient-to-br from-emerald-500 to-teal-500 text-5xl shadow-2xl">
            👨‍⚕️
          </div>

          <span className="mt-6 inline-flex rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
            Doctors Panel
          </span>

          <h3 className="mt-5 text-2xl font-black text-white sm:text-3xl">
            No Doctors Available
          </h3>

          <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-emerald-100/75 sm:text-base">
            Doctors add karne ke baad unki profile,
            specialization aur OPD schedule automatically
            yahan display ho jayega.
          </p>

        </div>
      </div>
    );
  }

  /* ============================================================
     MAIN SHOWCASE
  ============================================================ */

  return (
    <div
      className="
        doctor-showcase
        relative mx-auto
        flex min-h-[440px]
        w-full max-w-[580px]
        items-center justify-center
        overflow-hidden
        rounded-[2.5rem]
        border border-yellow-300/15
        bg-gradient-to-br
        from-slate-950
        via-emerald-950
        to-cyan-950
        px-3 py-8
        shadow-[0_35px_120px_rgba(0,0,0,.55)]
        backdrop-blur-3xl
        sm:min-h-[520px]
        sm:px-5
        md:min-h-[580px]
      "
    >

      {/* ==================================================
          BACKGROUND
      ================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400/20 blur-[90px] sm:h-96 sm:w-96" />

        <div className="absolute -left-20 top-10 h-48 w-48 rounded-full bg-teal-400/10 blur-[80px]" />

        <div className="absolute -right-20 bottom-10 h-48 w-48 rounded-full bg-green-400/10 blur-[80px]" />

        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(167,243,208,.9) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

      </div>

      {/* ==================================================
          OUTER RING
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute left-1/2 top-1/2
          h-[285px] w-[285px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border border-dashed
          border-yellow-300/40
          sm:h-[360px] sm:w-[360px]
          md:h-[400px] md:w-[400px]
        "
      >
        <span className="absolute left-1/2 top-[-4px] h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.9)]" />

        <span className="absolute bottom-[-4px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.9)]" />

        <span className="absolute left-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.9)]" />

        <span className="absolute right-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.9)]" />
      </div>

      {/* ==================================================
          INNER RING
      ================================================== */}

      <div
        className="
          pointer-events-none
          absolute left-1/2 top-1/2
          h-[215px] w-[215px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          border border-cyan-300/30
          sm:h-[270px] sm:w-[270px]
          md:h-[300px] md:w-[300px]
        "
      />

      {/* ==================================================
          OUTER DOCTORS
      ================================================== */}

      {outerDoctors.length > 0 && (
        <div
          key={`outer-${activeGroup}`}
          className="outer-orbit absolute left-1/2 top-1/2 h-0 w-0"
        >
          {outerDoctors.map(
            (doctor, index) => {
              const total =
                outerDoctors.length;

              const angle =
                (360 / total) * index + 45;

              return (
                <OrbitDoctor
                  key={
                    doctor?._id ||
                    `outer-${doctor?.name || "doctor"}-${index}`
                  }
                  doctor={doctor}
                  angle={angle}
                  ring="outer"
                />
              );
            }
          )}
        </div>
      )}

      {/* ==================================================
          INNER DOCTORS
      ================================================== */}

      {innerDoctors.length > 0 && (
        <div
          key={`inner-${activeGroup}`}
          className="inner-orbit absolute left-1/2 top-1/2 h-0 w-0"
        >
          {innerDoctors.map(
            (doctor, index) => {
              const total =
                innerDoctors.length;

              const angle =
                (360 / total) * index - 45;

              return (
                <OrbitDoctor
                  key={
                    doctor?._id ||
                    `inner-${doctor?.name || "doctor"}-${index}`
                  }
                  doctor={doctor}
                  angle={angle}
                  ring="inner"
                />
              );
            }
          )}
        </div>
      )}

      {/* ==================================================
          CENTER DOCTOR
      ================================================== */}

      <div className="relative z-30 flex items-center justify-center">

        <div className="group relative h-32 w-32 sm:h-40 sm:w-40 lg:h-44 lg:w-44">

          {/* Glow */}

          <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-yellow-300/30 via-emerald-400/30 to-cyan-400/30 blur-3xl transition duration-500 group-hover:scale-110" />

          {/* Rotating ring */}

          <div className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#fde047,#fff7ae,#10b981,#14b8a6,#fde047)] p-[4px] shadow-[0_0_35px_rgba(250,204,21,.45)]">

            <div className="h-full w-full rounded-full bg-emerald-950" />

          </div>

          {/* White border */}

          <div className="absolute inset-[7px] rounded-full border-2 border-white bg-white shadow-2xl" />

          {/* Image */}

          <div className="absolute inset-[11px] overflow-hidden rounded-full bg-white shadow-2xl">

            {mainDoctor?.image ? (
              <img
                src={getImageUrl(
                  mainDoctor.image
                )}
                alt={
                  mainDoctor?.name ||
                  "Doctor"
                }
                className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 text-5xl">
                👨‍⚕️
              </div>
            )}

          </div>

          {/* Online indicator */}

          <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500 shadow-lg">

            <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />

          </span>

          {/* Center doctor info */}

          <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-4 hidden w-52 -translate-x-1/2 rounded-2xl border border-emerald-300/20 bg-emerald-950/95 p-4 text-center shadow-2xl backdrop-blur-xl group-hover:block">

            <h3 className="text-base font-black text-white">
              {mainDoctor?.name}
            </h3>

            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              {mainDoctor?.specialist ||
                mainDoctor?.department ||
                "Medical Specialist"}
            </p>

          </div>

        </div>

      </div>

      {/* ==================================================
          GROUP DOTS
      ================================================== */}

      {doctorGroups.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-950/70 px-3 py-2 backdrop-blur-xl">

          {doctorGroups.map(
            (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setActiveGroup(index)
                }
                aria-label={`Show doctor group ${
                  index + 1
                }`}
                className={`
                  h-2 rounded-full
                  transition-all duration-300
                  ${
                    activeGroup === index
                      ? "w-6 bg-yellow-300"
                      : "w-2 bg-emerald-300/40 hover:bg-emerald-300"
                  }
                `}
              />
            )
          )}

        </div>
      )}

      {/* ==================================================
          ORBIT CSS
      ================================================== */}

      <style jsx>{`

        /* --------------------------------------------------
           RADIUS
        -------------------------------------------------- */

        :global(.doctor-showcase) {
          --inner-radius: 125px;
          --outer-radius: 180px;
        }

        /* --------------------------------------------------
           MOBILE
        -------------------------------------------------- */

        @media (max-width: 640px) {
          :global(.doctor-showcase) {
            --inner-radius: 92px;
            --outer-radius: 135px;
          }
        }

        /* --------------------------------------------------
           TABLET / DESKTOP
        -------------------------------------------------- */

        @media (min-width: 768px) {
          :global(.doctor-showcase) {
            --inner-radius: 135px;
            --outer-radius: 190px;
          }
        }

        /* --------------------------------------------------
           LARGE SCREEN
        -------------------------------------------------- */

        @media (min-width: 1024px) {
          :global(.doctor-showcase) {
            --inner-radius: 140px;
            --outer-radius: 195px;
          }
        }

        /* ==================================================
           OUTER ORBIT ROTATION
        ================================================== */

        @keyframes rotateOuterOrbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        /* ==================================================
           INNER ORBIT ROTATION
        ================================================== */

        @keyframes rotateInnerOrbit {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        /* ==================================================
           OUTER COUNTER ROTATION
        ================================================== */

        @keyframes counterOuterOrbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(-360deg);
          }
        }

        /* ==================================================
           INNER COUNTER ROTATION
        ================================================== */

        @keyframes counterInnerOrbit {
          from {
            transform: rotate(-360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        /* ==================================================
           OUTER ORBIT
        ================================================== */

        .outer-orbit {
          animation:
            rotateOuterOrbit
            ${ROTATION_DURATION}ms
            linear
            infinite;
        }

        /* ==================================================
           INNER ORBIT
        ================================================== */

        .inner-orbit {
          animation:
            rotateInnerOrbit
            ${ROTATION_DURATION - 4000}ms
            linear
            infinite;
        }

        /* ==================================================
           COUNTER OUTER
        ================================================== */

        .outer-counter {
          animation:
            counterOuterOrbit
            ${ROTATION_DURATION}ms
            linear
            infinite;
        }

        /* ==================================================
           COUNTER INNER
        ================================================== */

        .inner-counter {
          animation:
            counterInnerOrbit
            ${ROTATION_DURATION - 4000}ms
            linear
            infinite;
        }

        /* ==================================================
           HOVER = PAUSE
        ================================================== */

        .doctor-showcase:hover .outer-orbit,
        .doctor-showcase:hover .inner-orbit,
        .doctor-showcase:hover .outer-counter,
        .doctor-showcase:hover .inner-counter {
          animation-play-state: paused;
        }

        /* ==================================================
           ACCESSIBILITY
        ================================================== */

        @media (prefers-reduced-motion: reduce) {
          .outer-orbit,
          .inner-orbit,
          .outer-counter,
          .inner-counter {
            animation-play-state: paused;
          }
        }

      `}</style>
    </div>
  );
}

/* ============================================================
   ORBIT DOCTOR
============================================================ */

function OrbitDoctor({
  doctor,
  angle,
  ring,
}) {
  const isOuter =
    ring === "outer";

  const radiusVariable = isOuter
    ? "--outer-radius"
    : "--inner-radius";

  return (
    <div
      className="
        absolute
        left-0
        top-0
        z-20
      "
      style={{
        transform: `
          rotate(${angle}deg)
          translateY(var(${radiusVariable}))
          rotate(-${angle}deg)
          translate(-50%, -50%)
        `,
      }}
    >

      <div
        className={
          isOuter
            ? "outer-counter"
            : "inner-counter"
        }
      >

        <div
          className="
            group
            relative
            h-11
            w-11
            sm:h-13
            sm:w-13
            md:h-14
            md:w-14
          "
        >

          {/* Glow */}

          <div className="absolute -inset-1.5 rounded-full bg-emerald-300/30 blur-md transition duration-300 group-hover:bg-yellow-300/50" />

          {/* Gradient ring */}

          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#facc15,#10b981,#06b6d4,#facc15)] p-[2px] shadow-[0_0_16px_rgba(250,204,21,.32)]">

            <div className="h-full w-full rounded-full bg-emerald-950" />

          </div>

          {/* Doctor image */}

          <div className="absolute inset-[3px] overflow-hidden rounded-full border border-white bg-white shadow-xl">

            {doctor?.image ? (
              <img
                src={getImageUrl(
                  doctor.image
                )}
                alt={
                  doctor?.name ||
                  "Doctor"
                }
                loading="lazy"
                className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 text-sm sm:text-lg">
                👨‍⚕️
              </div>
            )}

          </div>

          {/* Tooltip */}

          <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-2 hidden w-32 -translate-x-1/2 rounded-xl border border-emerald-300/20 bg-emerald-950/95 px-2.5 py-2 text-center shadow-xl backdrop-blur-xl group-hover:block">

            <p className="line-clamp-2 text-[9px] font-black leading-tight text-white">
              {doctor?.name ||
                "Doctor"}
            </p>

            <p className="mt-1 line-clamp-2 text-[8px] leading-tight text-emerald-300">
              {doctor?.specialist ||
                doctor?.department ||
                "Medical Specialist"}
            </p>

          </div>

        </div>

      </div>
    </div>
  );
}