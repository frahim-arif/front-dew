
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  HeartPulse,
  ShieldCheck,
  Plus,
  Activity,
  Sparkles,
  Stethoscope,
  Cross,
} from "lucide-react";

export default function HomeLoader() {
  const [progress, setProgress] = useState(7);
  const [statusIndex, setStatusIndex] = useState(0);

  const loadingMessages = [
    "INITIALIZING HEALTHCARE SERVICES",
    "CONNECTING MEDICAL SYSTEMS",
    "PREPARING PATIENT SERVICES",
    "LOADING EMERGENCY SUPPORT",
    "SECURING HEALTHCARE PORTAL",
    "ALMOST READY",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 94) return prev;

        const increment = Math.floor(Math.random() * 4) + 1;

        return Math.min(prev + increment, 94);
      });
    }, 170);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % loadingMessages.length);
    }, 2200);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="
        fixed
        inset-0
        z-[99999]
        overflow-hidden
        bg-[#f8fcfb]
        text-[#174f49]
      "
    >
      {/* =====================================================
          PREMIUM BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#f8ffff] via-white to-[#eef8f5]" />

      {/* Large teal glow */}
      <motion.div
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.16, 0.28, 0.16],
        }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -top-52
          -left-52
          w-[600px]
          h-[600px]
          rounded-full
          bg-[#13a895]/20
          blur-[110px]
        "
      />

      {/* Gold glow */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -bottom-64
          -right-52
          w-[650px]
          h-[650px]
          rounded-full
          bg-[#c9a44b]/15
          blur-[120px]
        "
      />

      {/* =====================================================
          SUBTLE MEDICAL GRID
      ===================================================== */}

      <div
        className="
          absolute
          inset-0
          opacity-[0.035]
          pointer-events-none
        "
        style={{
          backgroundImage: `
            linear-gradient(#087f72 1px, transparent 1px),
            linear-gradient(90deg, #087f72 1px, transparent 1px)
          `,
          backgroundSize: "55px 55px",
        }}
      />

      {/* =====================================================
          FLOATING MEDICAL PARTICLES
      ===================================================== */}

      {[
        { left: "8%", top: "24%", size: 5, delay: 0 },
        { left: "18%", top: "72%", size: 4, delay: 1 },
        { left: "82%", top: "25%", size: 4, delay: 0.6 },
        { left: "90%", top: "68%", size: 5, delay: 1.5 },
        { left: "72%", top: "14%", size: 3, delay: 2 },
        { left: "28%", top: "16%", size: 3, delay: 1.2 },
      ].map((particle, index) => (
        <motion.div
          key={index}
          animate={{
            y: [0, -16, 0],
            opacity: [0.2, 0.65, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 3 + index * 0.4,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
          className="
            absolute
            rounded-full
            bg-[#13a895]
            shadow-[0_0_12px_rgba(19,168,149,0.35)]
          "
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
        />
      ))}

      {/* =====================================================
          DECORATIVE MEDICAL CROSSES
      ===================================================== */}

      <motion.div
        animate={{
          rotate: [0, 90, 180, 270, 360],
          opacity: [0.025, 0.07, 0.025],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          top-20
          left-8
          md:left-20
          text-[#087f72]
        "
      >
        <Plus size={125} strokeWidth={0.6} />
      </motion.div>

      <motion.div
        animate={{
          rotate: [360, 270, 180, 90, 0],
          opacity: [0.02, 0.06, 0.02],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          bottom-16
          right-8
          md:right-24
          text-[#c9a44b]
        "
      >
        <Plus size={145} strokeWidth={0.6} />
      </motion.div>

      {/* =====================================================
          TOP BRAND LINE
      ===================================================== */}

      <div
        className="
          absolute
          top-0
          left-0
          right-0
          h-[3px]
          bg-gradient-to-r
          from-[#075f56]
          via-[#18b19d]
          to-[#c9a44b]
        "
      />

      {/* =====================================================
          TOP HEADER
      ===================================================== */}

      <div
        className="
          absolute
          top-6
          left-5
          right-5
          md:left-12
          md:right-12
          flex
          items-center
          justify-between
          z-20
        "
      >
        {/* Brand status */}
        <div className="flex items-center gap-2.5">
          <motion.span
            animate={{
              scale: [1, 1.5, 1],
              opacity: [1, 0.4, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
            className="
              w-2
              h-2
              rounded-full
              bg-[#16a394]
              shadow-[0_0_10px_rgba(22,163,148,0.7)]
            "
          />

          <span
            className="
              text-[#39766e]
              text-[9px]
              md:text-[10px]
              tracking-[4px]
              font-bold
            "
          >
            DEW CARE
          </span>

          <span
            className="
              hidden
              sm:inline
              text-[#c9a44b]
              text-[9px]
            "
          >
            •
          </span>

          <span
            className="
              hidden
              sm:inline
              text-[#7b9994]
              text-[8px]
              tracking-[2px]
            "
          >
            LIVE
          </span>
        </div>

        {/* System */}
        <div
          className="
            flex
            items-center
            gap-2
            text-[#67918b]
            text-[8px]
            md:text-[9px]
            tracking-[2px]
            font-mono
          "
        >
          <Activity size={11} />
          HEALTHCARE SYSTEM
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          min-h-screen
          flex
          items-center
          justify-center
          px-5
          pt-10
          pb-16
        "
      >
        <div className="w-full max-w-xl text-center">

          {/* =================================================
              PREMIUM LOGO
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.75,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
            className="flex justify-center mb-7"
          >
            <div className="relative">

              {/* Outer rotating ring */}

              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  absolute
                  -inset-4
                  rounded-[38px]
                  border
                  border-dashed
                  border-[#c9a44b]/35
                "
              />

              {/* Glow */}

              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.25, 0.45, 0.25],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                }}
                className="
                  absolute
                  -inset-5
                  rounded-[42px]
                  bg-[#13a895]/10
                  blur-2xl
                "
              />

              {/* Main logo */}

              <div
                className="
                  relative
                  w-28
                  h-28
                  md:w-32
                  md:h-32
                  rounded-[36px]
                  bg-white/90
                  backdrop-blur-xl
                  border
                  border-[#d2eae5]
                  shadow-[0_25px_70px_rgba(15,126,113,0.15)]
                  flex
                  items-center
                  justify-center
                "
              >
                <div
                  className="
                    absolute
                    inset-2
                    rounded-[30px]
                    bg-gradient-to-br
                    from-[#e8faf7]
                    via-white
                    to-[#fff9ed]
                    border
                    border-[#e2f1ed]
                  "
                />

                <div className="relative">

                  <motion.div
                    animate={{
                      scale: [1, 1.04, 1],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <HeartPulse
                      size={52}
                      strokeWidth={1.65}
                      className="text-[#11998a]"
                    />
                  </motion.div>

                  {/* Gold medical dot */}

                  <motion.div
                    animate={{
                      scale: [1, 1.25, 1],
                      boxShadow: [
                        "0 0 0 rgba(201,164,75,0)",
                        "0 0 14px rgba(201,164,75,0.5)",
                        "0 0 0 rgba(201,164,75,0)",
                      ],
                    }}
                    transition={{
                      duration: 1.7,
                      repeat: Infinity,
                    }}
                    className="
                      absolute
                      -top-2
                      -right-3
                      w-6
                      h-6
                      rounded-full
                      bg-[#c9a44b]
                      border-[3px]
                      border-white
                    "
                  />

                  {/* tiny cross */}

                  <div
                    className="
                      absolute
                      -bottom-1
                      -left-3
                      w-5
                      h-5
                      rounded-full
                      bg-[#087f72]
                      text-white
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Plus size={12} strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* =================================================
              BRAND NAME
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
              duration: 0.8,
            }}
          >
            <h1
              className="
                text-[44px]
                sm:text-[52px]
                md:text-[62px]
                leading-none
                font-extrabold
                tracking-[-3px]
              "
            >
              <span className="text-[#174f49]">
                Dew
              </span>

              <span className="text-[#16a994] ml-2">
                Care
              </span>
            </h1>

            <div className="flex items-center justify-center gap-3 mt-4">

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 42 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="h-[1px] bg-[#c9a44b]"
              />

              <span
                className="
                  text-[#47766f]
                  text-[10px]
                  md:text-[11px]
                  tracking-[8px]
                  font-bold
                "
              >
                HOSPITAL
              </span>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 42 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="h-[1px] bg-[#c9a44b]"
              />

            </div>
          </motion.div>

          {/* =================================================
              TAGLINE
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.5,
              duration: 0.7,
            }}
            className="
              mt-5
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <Stethoscope
              size={13}
              className="text-[#c9a44b]"
            />

            <span
              className="
                text-[#78948f]
                text-[8px]
                md:text-[9px]
                tracking-[3px]
                md:tracking-[4px]
                font-semibold
              "
            >
              HEALTHCARE • EMERGENCY • WELLNESS
            </span>

            <Sparkles
              size={12}
              className="text-[#c9a44b]"
            />
          </motion.div>

          {/* =================================================
              STATUS CARD
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            transition={{
              delay: 0.7,
              duration: 0.8,
            }}
            className="
              relative
              mt-11
              rounded-[24px]
              bg-white/75
              backdrop-blur-2xl
              border
              border-white
              p-5
              md:p-7
              shadow-[0_25px_80px_rgba(15,126,113,0.11)]
              overflow-hidden
            "
          >

            {/* Card shine */}

            <motion.div
              animate={{
                x: ["-120%", "120%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut",
              }}
              className="
                absolute
                top-0
                bottom-0
                w-24
                bg-gradient-to-r
                from-transparent
                via-white/40
                to-transparent
                -skew-x-12
                pointer-events-none
              "
            />

            {/* Card header */}

            <div className="flex items-center justify-between mb-5">

              <div className="flex items-center gap-2.5">

                <div
                  className="
                    w-8
                    h-8
                    rounded-xl
                    bg-[#e8f8f5]
                    border
                    border-[#d7eee9]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <ShieldCheck
                    size={16}
                    className="text-[#159a8a]"
                  />
                </div>

                <div className="text-left">

                  <div
                    className="
                      text-[#547a74]
                      text-[8px]
                      md:text-[9px]
                      tracking-[2px]
                      font-bold
                    "
                  >
                    SYSTEM INITIALIZATION
                  </div>

                  <div
                    className="
                      text-[#9aada9]
                      text-[7px]
                      tracking-[1.5px]
                      mt-0.5
                    "
                  >
                    SECURE CONNECTION
                  </div>

                </div>
              </div>

              {/* Percentage */}

              <motion.div
                key={progress}
                initial={{ scale: 0.9, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                className="
                  text-[#159a8a]
                  text-sm
                  md:text-base
                  font-mono
                  font-bold
                "
              >
                {String(progress).padStart(3, "0")}%
              </motion.div>

            </div>

            {/* =================================================
                PROGRESS BAR
            ================================================= */}

            <div
              className="
                relative
                h-3
                w-full
                rounded-full
                bg-[#e8f3f1]
                border
                border-[#dcece9]
                overflow-visible
              "
            >

              <motion.div
                className="
                  absolute
                  left-0
                  top-0
                  h-full
                  rounded-full
                  bg-gradient-to-r
                  from-[#076f65]
                  via-[#13a895]
                  to-[#71cba9]
                "
                animate={{
                  width: `${progress}%`,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                style={{
                  boxShadow:
                    "0 0 18px rgba(19,168,149,0.35)",
                }}
              />

              {/* Moving gold indicator */}

              <motion.div
                animate={{
                  left: `${progress}%`,
                }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="
                  absolute
                  -top-1.5
                  -translate-x-1/2
                  w-1.5
                  h-6
                  rounded-full
                  bg-[#d3b45d]
                  shadow-[0_0_12px_rgba(201,164,75,0.55)]
                "
              />

              {/* Highlight */}

              <motion.div
                animate={{
                  x: ["0%", "700%"],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="
                  absolute
                  top-0
                  left-0
                  h-full
                  w-16
                  bg-gradient-to-r
                  from-transparent
                  via-white/40
                  to-transparent
                  skew-x-[-20deg]
                "
              />

            </div>

            {/* =================================================
                LOADING STATUS
            ================================================= */}

            <div className="flex items-center justify-between mt-5">

              <motion.div
                key={statusIndex}
                initial={{
                  opacity: 0,
                  x: -8,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                className="
                  flex
                  items-center
                  gap-2
                  text-left
                "
              >

                <motion.span
                  animate={{
                    scale: [1, 1.4, 1],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                  className="
                    w-1.5
                    h-1.5
                    rounded-full
                    bg-[#17a894]
                  "
                />

                <span
                  className="
                    text-[#718c87]
                    text-[8px]
                    md:text-[9px]
                    tracking-[1.5px]
                    font-medium
                  "
                >
                  {loadingMessages[statusIndex]}
                </span>

              </motion.div>

              <div
                className="
                  text-[#118f80]
                  text-[10px]
                  font-mono
                  font-bold
                "
              >
                {progress}/100
              </div>

            </div>

          </motion.div>

          {/* =================================================
              ECG
          ================================================= */}

          <div
            className="
              relative
              mt-8
              h-12
              overflow-hidden
              opacity-70
            "
          >

            {/* ECG glow */}

            <div
              className="
                absolute
                left-0
                right-0
                top-1/2
                h-px
                bg-[#13a895]/10
              "
            />

            <motion.svg
              viewBox="0 0 500 50"
              className="w-full h-full"
              preserveAspectRatio="none"
              animate={{
                x: ["-25%", "25%"],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <path
                d="
                  M0 25
                  H55
                  L70 25
                  L82 25
                  L92 9
                  L103 41
                  L114 25
                  H155
                  L175 25
                  L190 25
                  L201 5
                  L214 45
                  L227 25
                  H275
                  L295 25
                  L310 25
                  L321 12
                  L332 38
                  L343 25
                  H400
                  L418 25
                  L430 25
                  L440 9
                  L451 41
                  L462 25
                  H500
                "
                fill="none"
                stroke="#159d8c"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>

          </div>

          {/* =================================================
              DOT LOADER
          ================================================= */}

          <div className="flex justify-center items-center gap-2 mt-2">

            {[1, 2, 3, 4, 5].map((item) => (
              <motion.div
                key={item}
                animate={{
                  y: [0, -6, 0],
                  opacity: [0.2, 1, 0.2],
                  scale: [1, 1.35, 1],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  delay: item * 0.13,
                }}
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-[#17a894]
                "
              />
            ))}

          </div>

        </div>
      </div>

      {/* =====================================================
          BOTTOM MESSAGE
      ===================================================== */}

      <motion.div
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          delay: 1.1,
          duration: 0.7,
        }}
        className="
          absolute
          bottom-7
          left-0
          right-0
          text-center
          z-20
        "
      >

        <div className="flex items-center justify-center gap-3">

          <div className="h-px w-7 md:w-10 bg-[#c9a44b]/50" />

          <span
            className="
              text-[#698681]
              text-[7px]
              md:text-[8px]
              tracking-[3px]
              md:tracking-[4px]
              font-semibold
            "
          >
            YOUR HEALTH • OUR PRIORITY
          </span>

          <div className="h-px w-7 md:w-10 bg-[#c9a44b]/50" />

        </div>

        <div
          className="
            mt-2
            text-[#a0b3af]
            text-[6px]
            md:text-[7px]
            tracking-[2px]
          "
        >
          BURIGAON • KHARUPETIA • DARRANG
        </div>

      </motion.div>

      {/* =====================================================
          BOTTOM BRAND LINE
      ===================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-[3px]
          bg-gradient-to-r
          from-[#c9a44b]
          via-[#17a894]
          to-[#087f72]
        "
      />

    </motion.div>
  );
}

