"use client";

import { useEffect, useMemo, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew.onrender.com/api";

const SERVER_URL = API.replace(/\/api\/?$/, "");

// Maximum doctors shown in one orbit group
const DOCTORS_PER_GROUP = 8;

// How fast the orbit rotates
const ROTATION_DURATION = 26000;

// How long each group stays before changing
const GROUP_CHANGE_DURATION = 26000;

function getImageUrl(path) {
  if (!path || typeof path !== "string") return "";

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

function normalizeName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\./g, "")
    .replace(/,/g, "")
    .replace(/\s+/g, " ");
}

export default function DoctorOrbitShowcase({ doctors = [] }) {
  const [activeGroup, setActiveGroup] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  // ============================================================
  // MOBILE DETECTION
  // ============================================================

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };

    checkMobile();

    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // ============================================================
  // SAFE DOCTORS
  // ============================================================

  const safeDoctors = useMemo(() => {
    if (!Array.isArray(doctors)) return [];

    return doctors.filter(
      (doctor) => doctor && typeof doctor === "object"
    );
  }, [doctors]);

  // ============================================================
  // FIND FORIDUL HUSSAIN
  // ============================================================

  const foridulDoctor = useMemo(() => {
    return safeDoctors.find((doctor) => {
      const name = normalizeName(doctor?.name);

      return (
        name.includes("foridul hussain") ||
        name.includes("foridul")
      );
    });
  }, [safeDoctors]);

  // ============================================================
  // CENTER DOCTOR
  // ============================================================

  const mainDoctor = useMemo(() => {
    return foridulDoctor || safeDoctors[0] || null;
  }, [foridulDoctor, safeDoctors]);

  // ============================================================
  // REMOVE CENTER DOCTOR FROM ORBIT
  // ============================================================

  const otherDoctors = useMemo(() => {
    if (!mainDoctor) return [];

    return safeDoctors.filter((doctor) => {
      if (doctor?._id && mainDoctor?._id) {
        return (
          String(doctor._id) !== String(mainDoctor._id)
        );
      }

      return doctor !== mainDoctor;
    });
  }, [safeDoctors, mainDoctor]);

  // ============================================================
  // GROUP DOCTORS
  //
  // Example:
  // 8 doctors = 1 group
  // 16 doctors = 2 groups
  // 20 doctors = 3 groups
  // ============================================================

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

  const visibleDoctors =
    doctorGroups[activeGroup] || [];

  // ============================================================
  // DEBUG LOGS
  // ============================================================

  useEffect(() => {
    console.log(
      "========== DOCTOR ORBIT =========="
    );

    console.log(
      "TOTAL DOCTORS:",
      safeDoctors.length
    );

    console.log(
      "MAIN DOCTOR:",
      mainDoctor?.name
    );

    console.log(
      "OTHER DOCTORS:",
      otherDoctors.length
    );

    console.log(
      "TOTAL GROUPS:",
      doctorGroups.length
    );

    console.log(
      "ACTIVE GROUP:",
      activeGroup
    );

    console.log(
      "VISIBLE DOCTORS:",
      visibleDoctors.map(
        (doctor) => doctor?.name
      )
    );

    console.log(
      "=================================="
    );
  }, [
    safeDoctors,
    mainDoctor,
    otherDoctors,
    doctorGroups,
    activeGroup,
    visibleDoctors,
  ]);

  // ============================================================
  // AUTOMATIC GROUP CHANGE
  // ============================================================

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

  // ============================================================
  // RESET GROUP IF DATA CHANGES
  // ============================================================

  useEffect(() => {
    if (
      doctorGroups.length === 0 ||
      activeGroup >= doctorGroups.length
    ) {
      setActiveGroup(0);
    }
  }, [
    activeGroup,
    doctorGroups.length,
  ]);

  // ============================================================
  // NO DOCTOR
  // ============================================================

  if (!mainDoctor) {
    return (
      <section className="flex min-h-[420px] items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-500">
            No Doctors Available
          </p>
        </div>
      </section>
    );
  }

  // ============================================================
  // ORBIT RADIUS
  // ============================================================

  const innerRadius = isMobile ? 105 : 150;
  const outerRadius = isMobile ? 150 : 215;

  // ============================================================
  // SPLIT INTO TWO RINGS
  //
  // 1–4 doctors  -> inner
  // 5–8 doctors  -> outer
  // ============================================================

  const innerDoctors =
    visibleDoctors.slice(0, 4);

  const outerDoctors =
    visibleDoctors.slice(4);

  return (
    <section className="relative w-full overflow-hidden py-8 sm:py-12">

      {/* ======================================================
          MAIN SHOWCASE
      ====================================================== */}

      <div
        className="
          doctor-showcase
          relative
          mx-auto
          h-[390px]
          w-full
          max-w-[700px]
          sm:h-[500px]
          md:h-[580px]
        "
      >

        {/* ====================================================
            BACKGROUND GLOW
        ==================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/2
            top-1/2
            h-[250px]
            w-[250px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-emerald-100/50
            blur-3xl
            sm:h-[340px]
            sm:w-[340px]
          "
        />

        {/* ====================================================
            INNER ORBIT GUIDE
        ==================================================== */}

        {innerDoctors.length > 0 && (
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              rounded-full
              border
              border-emerald-100/70
            "
            style={{
              width: `${innerRadius * 2}px`,
              height: `${innerRadius * 2}px`,
              transform:
                "translate(-50%, -50%)",
            }}
          />
        )}

        {/* ====================================================
            OUTER ORBIT GUIDE
        ==================================================== */}

        {outerDoctors.length > 0 && (
          <div
            className="
              pointer-events-none
              absolute
              left-1/2
              top-1/2
              rounded-full
              border
              border-dashed
              border-emerald-100/70
            "
            style={{
              width: `${outerRadius * 2}px`,
              height: `${outerRadius * 2}px`,
              transform:
                "translate(-50%, -50%)",
            }}
          />
        )}

        {/* ====================================================
            OUTER DOCTORS
        ==================================================== */}

        {outerDoctors.map(
          (doctor, index) => {
            const total =
              outerDoctors.length;

            const angle =
              (360 / total) * index - 90;

            return (
              <OrbitDoctor
                key={
                  doctor?._id ||
                  `outer-${index}-${doctor?.name}`
                }
                doctor={doctor}
                angle={angle}
                radius={outerRadius}
                ring="outer"
              />
            );
          }
        )}

        {/* ====================================================
            INNER DOCTORS
        ==================================================== */}

        {innerDoctors.map(
          (doctor, index) => {
            const total =
              innerDoctors.length;

            const angle =
              (360 / total) * index - 90;

            return (
              <OrbitDoctor
                key={
                  doctor?._id ||
                  `inner-${index}-${doctor?.name}`
                }
                doctor={doctor}
                angle={angle}
                radius={innerRadius}
                ring="inner"
              />
            );
          }
        )}

        {/* ====================================================
            CENTER DOCTOR
        ==================================================== */}

        <CenterDoctor doctor={mainDoctor} />

        {/* ====================================================
            GROUP INDICATORS
        ==================================================== */}

        {doctorGroups.length > 1 && (
          <div
            className="
              absolute
              bottom-0
              left-1/2
              flex
              -translate-x-1/2
              items-center
              gap-2
            "
          >
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
                    h-2
                    rounded-full
                    transition-all
                    duration-300
                    ${
                      activeGroup === index
                        ? "w-7 bg-emerald-600"
                        : "w-2 bg-emerald-200"
                    }
                  `}
                />
              )
            )}
          </div>
        )}

      </div>
    </section>
  );
}

/* ================================================================
   CENTER DOCTOR
================================================================ */

function CenterDoctor({ doctor }) {
  const image =
    getImageUrl(
      doctor?.image ||
        doctor?.profileImage ||
        doctor?.photo
    );

  return (
    <div
      className="
        absolute
        left-1/2
        top-1/2
        z-30
        -translate-x-1/2
        -translate-y-1/2
      "
    >
      <div
        className="
          relative
          flex
          flex-col
          items-center
        "
      >

        {/* Glow */}

        <div
          className="
            absolute
            -inset-5
            rounded-full
            bg-emerald-200/40
            blur-2xl
          "
        />

        {/* Image */}

        <div
          className="
            relative
            h-28
            w-28
            overflow-hidden
            rounded-full
            border-[5px]
            border-white
            bg-slate-100
            shadow-[0_12px_40px_rgba(0,0,0,0.15)]
            sm:h-36
            sm:w-36
            md:h-40
            md:w-40
          "
        >
          {image ? (
            <img
              src={image}
              alt={
                doctor?.name ||
                "Doctor"
              }
              className="
                h-full
                w-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                bg-emerald-50
                text-3xl
                font-bold
                text-emerald-700
              "
            >
              Dr
            </div>
          )}
        </div>

        {/* Name */}

        <div
          className="
            relative
            mt-3
            whitespace-nowrap
            rounded-xl
            border
            border-emerald-100
            bg-white/95
            px-4
            py-2
            text-center
            shadow-lg
            backdrop-blur
          "
        >
          <p
            className="
              text-sm
              font-extrabold
              text-slate-800
              sm:text-base
            "
          >
            {doctor?.name ||
              "Dr. Foridul Hussain"}
          </p>

          {doctor?.specialization && (
            <p
              className="
                mt-0.5
                text-[10px]
                font-semibold
                text-emerald-700
                sm:text-xs
              "
            >
              {doctor.specialization}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}

/* ================================================================
   ORBIT DOCTOR
================================================================ */

function OrbitDoctor({
  doctor,
  angle,
  radius,
  ring,
}) {
  const image =
    getImageUrl(
      doctor?.image ||
        doctor?.profileImage ||
        doctor?.photo
    );

  // Convert degree to radians
  const radians =
    (angle * Math.PI) / 180;

  // Direct X/Y positioning.
  // This avoids nested rotate/translate bugs.
  const x =
    Math.cos(radians) * radius;

  const y =
    Math.sin(radians) * radius;

  return (
    <div
      className="
        absolute
        left-1/2
        top-1/2
        z-20
        transition-all
        duration-700
      "
      style={{
        transform: `
          translate(
            calc(-50% + ${x}px),
            calc(-50% + ${y}px)
          )
        `,
      }}
    >
      <div
        className="
          group
          flex
          flex-col
          items-center
        "
      >

        {/* ==================================================
            DOCTOR IMAGE
        ================================================== */}

        <div
          className={`
            relative
            overflow-hidden
            rounded-full
            border-[3px]
            border-white
            bg-slate-100
            shadow-[0_8px_25px_rgba(0,0,0,0.14)]
            transition-all
            duration-300
            group-hover:scale-110
            group-hover:shadow-[0_12px_35px_rgba(0,0,0,0.20)]
            ${
              ring === "outer"
                ? "h-14 w-14 sm:h-16 sm:w-16 md:h-[72px] md:w-[72px]"
                : "h-12 w-12 sm:h-14 sm:w-14 md:h-16 md:w-16"
            }
          `}
        >
          {image ? (
            <img
              src={image}
              alt={
                doctor?.name ||
                "Doctor"
              }
              className="
                h-full
                w-full
                object-cover
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                w-full
                items-center
                justify-center
                bg-emerald-50
                text-sm
                font-bold
                text-emerald-700
              "
            >
              Dr
            </div>
          )}

          {/* Online / active indicator */}

          <span
            className="
              absolute
              bottom-0.5
              right-0.5
              h-3
              w-3
              rounded-full
              border-2
              border-white
              bg-emerald-500
            "
          />
        </div>

        {/* ==================================================
            DOCTOR NAME
        ================================================== */}

        <div
          className="
            mt-1.5
            max-w-[110px]
            rounded-lg
            border
            border-slate-100
            bg-white/95
            px-2
            py-1
            text-center
            shadow-md
            backdrop-blur
            transition-all
            duration-300
            group-hover:border-emerald-200
          "
        >
          <p
            className="
              truncate
              text-[9px]
              font-bold
              text-slate-700
              sm:text-[10px]
              md:text-[11px]
            "
          >
            {doctor?.name ||
              "Doctor"}
          </p>

          {doctor?.specialization && (
            <p
              className="
                mt-0.5
                truncate
                text-[8px]
                font-medium
                text-emerald-600
                sm:text-[9px]
              "
            >
              {doctor.specialization}
            </p>
          )}
        </div>

      </div>
    </div>
  );
}