"use client";

import { useEffect, useMemo, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "https://backend-dew.onrender.com/api";

const SERVER_URL = API.replace(/\/api\/?$/, "");

const DOCTORS_PER_GROUP = 10;
const INNER_RING_COUNT = 5;
const ROTATION_DURATION = 26000;
const GROUP_CHANGE_DURATION = 26000;

function getImageUrl(path) {
  if (!path || typeof path !== "string") {
    return "";
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
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

export default function DoctorOrbitShowcase({ doctors = [] }) {
  const [activeGroup, setActiveGroup] = useState(0);

  const safeDoctors = useMemo(() => {
    if (!Array.isArray(doctors)) {
      return [];
    }

    return doctors.filter(
      (doctor) => doctor && typeof doctor === "object"
    );
  }, [doctors]);

  // Dr. Foridul ko center mein rakhega.
  const mainDoctor = useMemo(() => {
    return (
      safeDoctors.find((doctor) => {
        const name = String(doctor?.name || "")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, " ");

        return name.includes("foridul hussain");
      }) || safeDoctors[0]
    );
  }, [safeDoctors]);

  // Center doctor ko baaki doctors ki list se remove karega.
  const otherDoctors = useMemo(() => {
    if (!mainDoctor) {
      return [];
    }

    return safeDoctors.filter((doctor) => {
      if (doctor?._id && mainDoctor?._id) {
        return doctor._id !== mainDoctor._id;
      }

      return doctor !== mainDoctor;
    });
  }, [safeDoctors, mainDoctor]);

  // Har group mein maximum 10 doctors.
  const doctorGroups = useMemo(() => {
    const groups = [];

    for (
      let index = 0;
      index < otherDoctors.length;
      index += DOCTORS_PER_GROUP
    ) {
      groups.push(
        otherDoctors.slice(index, index + DOCTORS_PER_GROUP)
      );
    }

    return groups;
  }, [otherDoctors]);

  const visibleDoctors = doctorGroups[activeGroup] || [];

  const innerDoctors = visibleDoctors.slice(0, INNER_RING_COUNT);
  const outerDoctors = visibleDoctors.slice(INNER_RING_COUNT);

  // Har rotation ke baad next group.
  useEffect(() => {
    if (doctorGroups.length <= 1) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      setActiveGroup((previousGroup) => {
        return (previousGroup + 1) % doctorGroups.length;
      });
    }, GROUP_CHANGE_DURATION);

    return () => window.clearInterval(timer);
  }, [doctorGroups.length]);

  // Doctors update hone par group reset.
  useEffect(() => {
    if (
      doctorGroups.length === 0 ||
      activeGroup >= doctorGroups.length
    ) {
      setActiveGroup(0);
    }
  }, [activeGroup, doctorGroups.length]);

  if (!mainDoctor) {
    return (
   <div className="relative flex min-h-[380px] w-full items-center justify-center overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-gradient-to-br from-emerald-900/40 via-slate-900/60 to-teal-900/40 p-6 shadow-[0_20px_60px_rgba(0,0,0,.35)] backdrop-blur-2xl sm:min-h-[460px]">

  {/* Background Glow */}
  <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-emerald-400/20 blur-[100px]" />

  <div className="absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-cyan-400/20 blur-[100px]" />

  {/* Grid */}
  <div
    className="absolute inset-0 opacity-[0.05]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,.4) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.4) 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
    }}
  />

  <div className="relative text-center">

    {/* Icon */}
    <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-emerald-300/20 bg-gradient-to-br from-emerald-500 to-teal-500 text-5xl shadow-2xl">
      👨‍⚕️
    </div>

    {/* Badge */}
    <span className="mt-6 inline-flex rounded-full bg-emerald-500/15 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-emerald-300">
      Doctors Panel
    </span>

    {/* Title */}
    <h3 className="mt-5 text-2xl font-black text-white sm:text-3xl">
      No Doctors Available
    </h3>

    {/* Description */}
    <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-emerald-100/75 sm:text-base">
      Doctors add karne ke baad unki profile, specialization aur OPD schedule
      automatically yahan display ho jayega.
    </p>

    {/* Button */}
    <button className="mt-8 rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:scale-105">
      Coming Soon
    </button>

  </div>
</div>
    );
  }

  return (
    <div className="doctor-showcase relative mx-auto flex min-h-[440px] w-full max-w-[580px] items-center justify-center overflow-hidden rounded-[2.5rem] border border-yellow-300/15 bg-gradient-to-br from-slate-950 via-emerald-950 to-cyan-950 px-3 py-8 shadow-[0_35px_120px_rgba(0,0,0,.55)] backdrop-blur-3xl sm:min-h-[520px] sm:px-5 md:min-h-[580px]">
      {/* Background */}
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

      {/* Outer Ring Line */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[285px] w-[285px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-yellow-300/40 sm:h-[360px] sm:w-[360px] md:h-[400px] md:w-[400px]">
        <span className="absolute left-1/2 top-[-4px] h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.9)]" />

        <span className="absolute bottom-[-4px] left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.9)]" />

        <span className="absolute left-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.9)]" />

        <span className="absolute right-[-4px] top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-emerald-300 shadow-[0_0_12px_rgba(110,231,183,.9)]" />
      </div>

      {/* Inner Ring Line */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[215px] w-[215px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-300/30 sm:h-[270px] sm:w-[270px] md:h-[300px] md:w-[300px]" />

      {/* Outer Ring Doctors */}
      {outerDoctors.length > 0 && (
        <div
          key={`outer-${activeGroup}`}
          className="outer-orbit absolute left-1/2 top-1/2 h-0 w-0"
        >
          {outerDoctors.map((doctor, index) => {
            const total = outerDoctors.length;
            const angle = (360 / total) * index + 36;

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
          })}
        </div>
      )}

      {/* Inner Ring Doctors */}
      {innerDoctors.length > 0 && (
        <div
          key={`inner-${activeGroup}`}
          className="inner-orbit absolute left-1/2 top-1/2 h-0 w-0"
        >
          {innerDoctors.map((doctor, index) => {
            const total = innerDoctors.length;
            const angle = (360 / total) * index - 90;

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
          })}
        </div>
      )}

   {/* Center Doctor */}
<div className="relative z-30 flex items-center justify-center">
  <div className="group relative h-32 w-32 sm:h-40 sm:w-40 lg:h-44 lg:w-44">

    {/* Golden Glow */}
<div className="absolute -inset-8 rounded-full bg-gradient-to-r from-yellow-300/30 via-emerald-400/30 to-cyan-400/30 blur-3xl transition duration-500 group-hover:scale-110" />
    {/* Animated Border */}
    <div className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#fde047,#fff7ae,#10b981,#14b8a6,#fde047)] p-[4px] shadow-[0_0_35px_rgba(250,204,21,.45)]">
      <div className="h-full w-full rounded-full bg-emerald-950" />
    </div>

    {/* White Ring */}
    <div className="absolute inset-[7px] rounded-full border-2 border-white bg-white shadow-2xl" />

    {/* Doctor Image */}
    <div className="absolute inset-[11px] overflow-hidden rounded-full bg-white shadow-2xl">
      {mainDoctor?.image ? (
        <img
          src={getImageUrl(mainDoctor.image)}
          alt={mainDoctor?.name}
          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 text-5xl">
          👨‍⚕️
        </div>
      )}
    </div>

    {/* Online Badge */}
    <span className="absolute bottom-2 right-2 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-emerald-500 shadow-lg">
      <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-white" />
    </span>

    {/* Hover Card */}
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

      {/* Group Dots */}
      {doctorGroups.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-950/70 px-3 py-2 backdrop-blur-xl">
          {doctorGroups.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveGroup(index)}
              aria-label={`Show doctor group ${index + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeGroup === index
                  ? "w-6 bg-yellow-300"
                  : "w-2 bg-emerald-300/40 hover:bg-emerald-300"
              }`}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes rotateOuterOrbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }

        @keyframes rotateInnerOrbit {
          from {
            transform: rotate(360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        @keyframes counterOuterOrbit {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(-360deg);
          }
        }

        @keyframes counterInnerOrbit {
          from {
            transform: rotate(-360deg);
          }

          to {
            transform: rotate(0deg);
          }
        }

        .outer-orbit {
          animation: rotateOuterOrbit
            ${ROTATION_DURATION}ms linear infinite;
        }

        .inner-orbit {
          animation: rotateInnerOrbit
            ${ROTATION_DURATION - 4000}ms linear infinite;
        }

        .outer-counter {
          animation: counterOuterOrbit
            ${ROTATION_DURATION}ms linear infinite;
        }

        .inner-counter {
          animation: counterInnerOrbit
            ${ROTATION_DURATION - 4000}ms linear infinite;
        }

        .doctor-showcase:hover .outer-orbit,
        .doctor-showcase:hover .inner-orbit,
        .doctor-showcase:hover .outer-counter,
        .doctor-showcase:hover .inner-counter {
          animation-play-state: paused;
        }

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

function OrbitDoctor({ doctor, angle, ring }) {
  const isOuter = ring === "outer";

  return (
    <div
      className="absolute left-0 top-0"
      style={{
        transform: `
          rotate(${angle}deg)
          translateY(var(${
            isOuter ? "--outer-radius" : "--inner-radius"
          }))
          rotate(-${angle}deg)
        `,
      }}
    >
      <div
        className={
          isOuter ? "outer-counter" : "inner-counter"
        }
      >
        <div className="group relative h-10 w-10 sm:h-12 sm:w-12 md:h-14 md:w-14">
          {/* Glow */}
          <div className="absolute -inset-1.5 rounded-full bg-emerald-300/30 blur-md transition duration-300 group-hover:bg-yellow-300/50" />

          {/* Gradient Border */}
          <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,#facc15,#10b981,#06b6d4,#facc15)] p-[2px] shadow-[0_0_16px_rgba(250,204,21,.32)]">
            <div className="h-full w-full rounded-full bg-emerald-950" />
          </div>

          {/* Doctor Image */}
          <div className="absolute inset-[3px] overflow-hidden rounded-full border border-white bg-white shadow-xl">
            {doctor?.image ? (
              <img
                src={getImageUrl(doctor.image)}
                alt={doctor?.name || "Doctor"}
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
          <div className="pointer-events-none absolute left-1/2 top-full z-50 mt-1.5 hidden w-28 -translate-x-1/2 rounded-lg border border-emerald-300/20 bg-emerald-950/95 px-2 py-1.5 text-center shadow-xl backdrop-blur-xl group-hover:block">
            <p className="line-clamp-1 text-[8px] font-black text-white">
              {doctor?.name || "Doctor"}
            </p>

            <p className="mt-0.5 line-clamp-1 text-[7px] text-emerald-300">
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