
"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HeartPulse, ShieldCheck, Plus } from "lucide-react";

export default function HomeLoader() {
  const [progress, setProgress] = useState(7);

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
        bg-white
      "
    >
      {/* =====================================================
          BACKGROUND
      ===================================================== */}

      <div className="absolute inset-0 bg-gradient-to-br from-[#f8ffff] via-white to-[#eefaf7]" />

      {/* Soft teal glow - top left */}
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.35, 0.5, 0.35],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -top-40
          -left-40
          w-[420px]
          h-[420px]
          rounded-full
          bg-[#18a999]/10
          blur-3xl
        "
      />

      {/* Soft gold glow - bottom right */}
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0.35, 0.2],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="
          absolute
          -bottom-48
          -right-40
          w-[460px]
          h-[460px]
          rounded-full
          bg-[#c9a44b]/10
          blur-3xl
        "
      />

      {/* =====================================================
          DECORATIVE MEDICAL PLUS
      ===================================================== */}

      <motion.div
        animate={{
          rotate: [0, 90, 180, 270, 360],
          opacity: [0.04, 0.08, 0.04],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          top-16
          left-8
          md:left-16
          text-[#149b8c]
        "
      >
        <Plus size={110} strokeWidth={0.7} />
      </motion.div>

      <motion.div
        animate={{
          rotate: [360, 270, 180, 90, 0],
          opacity: [0.03, 0.07, 0.03],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="
          absolute
          bottom-10
          right-8
          md:right-20
          text-[#c9a44b]
        "
      >
        <Plus size={130} strokeWidth={0.7} />
      </motion.div>

      {/* =====================================================
          TOP BRAND LINE
      ===================================================== */}

      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#087f72] via-[#19b7a4] to-[#c9a44b]" />

      {/* =====================================================
          TOP STATUS
      ===================================================== */}

      <div
        className="
          absolute
          top-7
          left-6
          right-6
          md:left-12
          md:right-12
          flex
          items-center
          justify-between
        "
      >
        <div className="flex items-center gap-2">
          <motion.span
            animate={{
              scale: [1, 1.35, 1],
              opacity: [1, 0.55, 1],
            }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
            }}
            className="
              w-2
              h-2
              rounded-full
              bg-[#16a394]
            "
          />

          <span
            className="
              text-[#39766e]
              text-[9px]
              md:text-[10px]
              tracking-[3px]
              font-semibold
            "
          >
            DEW CARE
          </span>
        </div>

        <div
          className="
            text-[#67918b]
            text-[9px]
            md:text-[10px]
            tracking-[2px]
            font-mono
          "
        >
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
        "
      >
        <div className="w-full max-w-lg text-center">

          {/* =================================================
              LOGO
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 15,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            className="flex justify-center mb-6"
          >
            <div
              className="
                relative
                w-24
                h-24
                md:w-28
                md:h-28
                rounded-[32px]
                bg-white
                border
                border-[#d5ece8]
                shadow-[0_18px_50px_rgba(15,126,113,0.12)]
                flex
                items-center
                justify-center
              "
            >
              {/* outer glow */}
              <div
                className="
                  absolute
                  inset-2
                  rounded-[25px]
                  bg-gradient-to-br
                  from-[#e5faf6]
                  to-[#fffaf0]
                "
              />

              <div className="relative">
                <HeartPulse
                  size={48}
                  strokeWidth={1.7}
                  className="text-[#11998a]"
                />

                <motion.div
                  animate={{
                    scale: [1, 1.12, 1],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                  }}
                  className="
                    absolute
                    -top-1
                    -right-2
                    w-5
                    h-5
                    rounded-full
                    bg-[#c9a44b]
                    border-[3px]
                    border-white
                  "
                />
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
                text-[42px]
                md:text-[56px]
                leading-none
                font-bold
                tracking-[-2px]
              "
            >
              <span className="text-[#174f49]">
                Dew
              </span>

              <span className="text-[#16a994] ml-2">
                Care
              </span>
            </h1>

            <div className="flex items-center justify-center gap-3 mt-3">
              <div className="h-[1px] w-10 bg-[#c9a44b]" />

              <span
                className="
                  text-[#47766f]
                  text-[11px]
                  md:text-xs
                  tracking-[7px]
                  font-semibold
                "
              >
                HOSPITAL
              </span>

              <div className="h-[1px] w-10 bg-[#c9a44b]" />
            </div>
          </motion.div>

          {/* =================================================
              TAGLINE
          ================================================= */}

          <motion.p
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.55,
              duration: 0.8,
            }}
            className="
              mt-5
              text-[#78948f]
              text-[9px]
              md:text-[10px]
              tracking-[4px]
              md:tracking-[5px]
              font-medium
            "
          >
            HEALTHCARE • EMERGENCY • WELLNESS
          </motion.p>

          {/* =================================================
              MEDICAL STATUS CARD
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.7,
              duration: 0.8,
            }}
            className="
              mt-12
              rounded-2xl
              bg-white/80
              backdrop-blur-md
              border
              border-[#dcefeb]
              p-5
              md:p-6
              shadow-[0_20px_60px_rgba(15,126,113,0.08)]
            "
          >

            {/* status header */}

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={16}
                  className="text-[#159a8a]"
                />

                <span
                  className="
                    text-[#547a74]
                    text-[9px]
                    tracking-[2px]
                    font-semibold
                  "
                >
                  SYSTEM INITIALIZATION
                </span>
              </div>

              <span
                className="
                  text-[#159a8a]
                  text-[10px]
                  font-mono
                  font-bold
                "
              >
                {String(progress).padStart(3, "0")}%
              </span>
            </div>

            {/* =================================================
                PROGRESS BAR
            ================================================= */}

            <div
              className="
                relative
                h-2.5
                w-full
                rounded-full
                bg-[#eaf5f3]
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
                  from-[#087f72]
                  via-[#13a895]
                  to-[#6ac7a9]
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
                    "0 0 16px rgba(19,168,149,0.28)",
                }}
              />

              {/* gold marker */}

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
                  w-1
                  h-5
                  rounded-full
                  bg-[#c9a44b]
                "
                style={{
                  boxShadow:
                    "0 0 8px rgba(201,164,75,0.4)",
                }}
              />
            </div>

            {/* =================================================
                LOADING INFO
            ================================================= */}

            <div className="flex items-center justify-between mt-4">
              <motion.span
                key={progress}
                initial={{
                  opacity: 0.4,
                }}
                animate={{
                  opacity: 1,
                }}
                className="
                  text-[#718c87]
                  text-[9px]
                  md:text-[10px]
                  tracking-[2px]
                  font-medium
                "
              >
                LOADING HEALTHCARE SERVICES
              </motion.span>

              <span
                className="
                  text-[#118f80]
                  text-xs
                  font-mono
                  font-bold
                "
              >
                {String(progress).padStart(3, "0")}%
              </span>
            </div>
          </motion.div>

          {/* =================================================
              ECG LINE
          ================================================= */}

          <div className="relative mt-8 h-10 overflow-hidden opacity-60">
            <motion.svg
              viewBox="0 0 500 50"
              className="w-full h-full"
              preserveAspectRatio="none"
              initial={{
                x: "-20%",
              }}
              animate={{
                x: "20%",
              }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <path
                d="
                  M0 25
                  H70
                  L82 25
                  L91 10
                  L101 39
                  L112 25
                  H160
                  L175 25
                  L187 25
                  L198 5
                  L211 44
                  L224 25
                  H290
                  L305 25
                  L318 25
                  L330 13
                  L341 37
                  L352 25
                  H500
                "
                fill="none"
                stroke="#159d8c"
                strokeWidth="1.5"
              />
            </motion.svg>
          </div>

          {/* =================================================
              DOT LOADER
          ================================================= */}

          <div className="flex justify-center items-center gap-2 mt-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <motion.div
                key={item}
                animate={{
                  y: [0, -5, 0],
                  opacity: [0.25, 1, 0.25],
                  scale: [1, 1.25, 1],
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
        }}
        animate={{
          opacity: 1,
        }}
        transition={{
          delay: 1,
        }}
        className="
          absolute
          bottom-7
          left-0
          right-0
          text-center
        "
      >
        <div className="flex items-center justify-center gap-3">
          <div className="h-px w-8 bg-[#c9a44b]/60" />

          <span
            className="
              text-[#698681]
              text-[8px]
              md:text-[9px]
              tracking-[4px]
              font-medium
            "
          >
            YOUR HEALTH • OUR PRIORITY
          </span>

          <div className="h-px w-8 bg-[#c9a44b]/60" />
        </div>
      </motion.div>

      {/* =====================================================
          BOTTOM TEAL LINE
      ===================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          h-1
          bg-gradient-to-r
          from-[#c9a44b]
          via-[#17a894]
          to-[#087f72]
        "
      />
    </motion.div>
  );
}

