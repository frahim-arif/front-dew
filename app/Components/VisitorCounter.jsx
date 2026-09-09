"use client";

import CountUp from "react-countup";
import { useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "https://backend-dew.onrender.com/api";

export default function VisitorCounter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateVisitor = async () => {
      try {
        const alreadyCounted = sessionStorage.getItem(
          "dewcare_visitor_counted"
        );

        if (!alreadyCounted) {
          const res = await fetch(`${API}/visitor`, {
            method: "POST",
          });

          const data = await res.json();

          if (data.success) {
            setCount(data.count);

            sessionStorage.setItem(
              "dewcare_visitor_counted",
              "true"
            );

            return;
          }
        }

        const res = await fetch(`${API}/visitor`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (data.success) {
          setCount(data.count);
        }
      } catch (error) {
        console.log("Visitor counter error:", error);
      }
    };

    updateVisitor();
  }, []);

  const digits = count
    .toString()
    .padStart(6, "0")
    .split("");

  const miniStats = [
    {
      icon: "🚑",
      end: 24,
      suffix: "/7",
      text: "Emergency",
    },
    {
      icon: "❤️",
      end: 100,
      suffix: "%",
      text: "Patient Care",
    },
    {
      icon: "🏥",
      end: 24,
      suffix: "+",
      text: "Services",
    },
  ];

 return (
<section className="relative overflow-hidden bg-[#0b2730] py-14 sm:py-16 lg:py-24">

  {/* Background */}
{/* Premium Background */}
<div className="absolute inset-0 overflow-hidden">

  {/* Base Gradient */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#081b24] via-[#103540] to-[#06171f]" />

  {/* Mesh Gradient */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,.20),transparent_35%),radial-gradient(circle_at_80%_25%,rgba(34,211,238,.18),transparent_35%),radial-gradient(circle_at_50%_80%,rgba(45,212,191,.15),transparent_40%)]" />

  {/* Large Emerald Glow */}
  <div className="absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-emerald-400/20 blur-[170px] animate-[pulse_7s_ease-in-out_infinite]" />

  {/* Large Cyan Glow */}
  <div className="absolute -right-40 bottom-0 h-[520px] w-[520px] rounded-full bg-cyan-400/20 blur-[170px] animate-[pulse_8s_ease-in-out_infinite]" />

  {/* Center Soft Glow */}
  <div className="absolute left-1/2 top-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[120px]" />

  {/* Floating Lights */}
  <div className="absolute left-[12%] top-[22%] h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_25px_8px_rgba(255,255,255,.8)] animate-ping" />

  <div className="absolute right-[18%] top-[30%] h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_30px_10px_rgba(16,185,129,.9)] animate-pulse" />

  <div className="absolute bottom-[18%] left-[25%] h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_30px_10px_rgba(34,211,238,.9)] animate-ping" />

  <div className="absolute bottom-[22%] right-[28%] h-2.5 w-2.5 rounded-full bg-teal-300 shadow-[0_0_30px_10px_rgba(45,212,191,.9)] animate-pulse" />

  {/* Premium Grid */}
  <div
    className="absolute inset-0 opacity-[0.05]"
    style={{
      backgroundImage: `
        linear-gradient(rgba(255,255,255,.06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.06) 1px, transparent 1px)
      `,
      backgroundSize: "70px 70px",
    }}
  />

  {/* Dot Pattern */}
  <div
    className="absolute inset-0 opacity-[0.04]"
    style={{
      backgroundImage:
        "radial-gradient(circle, rgba(255,255,255,.9) 1px, transparent 1px)",
      backgroundSize: "26px 26px",
    }}
  />

  {/* Top Light */}
  <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent" />

</div>
  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

   <div className="mt-10 grid items-center gap-12 lg:grid-cols-2">

  {/* ================= LEFT : COUNTER ================= */}

  <div className="order-2 lg:order-1">

    <div className="rounded-[28px] border border-white/10 bg-white/10 p-5 shadow-[0_25px_60px_rgba(0,0,0,.35)] backdrop-blur-2xl sm:p-8">

      {/* Top */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>

          <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-emerald-300">
            LIVE COUNTER
          </p>

          <h3 className="mt-2 text-xl font-black text-white sm:text-2xl">
            Total Visitors
          </h3>

        </div>

        <div className="inline-flex w-fit items-center rounded-full bg-emerald-500/20 px-4 py-2 text-xs font-bold text-emerald-300">

          <span className="mr-2 h-2.5 w-2.5 animate-pulse rounded-full bg-emerald-400" />

          LIVE

        </div>

      </div>

      {/* Digits */}

      <div className="mt-8 flex justify-center gap-2 overflow-x-auto sm:gap-3">

        {digits.map((digit, index) => {

          const glow = [
            "shadow-[0_0_20px_#00ff66]",
            "shadow-[0_0_20px_#00d4ff]",
            "shadow-[0_0_20px_#33a1ff]",
            "shadow-[0_0_20px_#7c4dff]",
            "shadow-[0_0_20px_#c026d3]",
            "shadow-[0_0_20px_#ff4dd2]",
          ];

          const border = [
            "border-green-400",
            "border-cyan-400",
            "border-sky-400",
            "border-indigo-400",
            "border-fuchsia-400",
            "border-pink-400",
          ];

          return (
            <div
              key={index}
              className={`flex h-12 w-8 flex-shrink-0 items-center justify-center rounded-lg border-2 bg-white text-lg font-black text-slate-900 transition-all duration-300 hover:-translate-y-1 hover:scale-105 sm:h-20 sm:w-14 sm:text-4xl ${border[index]} ${glow[index]}`}
            >
              {digit}
            </div>
          );

        })}

      </div>

      {/* Status */}

      <div className="mt-8 flex flex-wrap justify-center gap-3">

        <span className="rounded-full bg-green-500/15 px-4 py-2 text-xs font-semibold text-green-300">
          🔄 Auto Updated
        </span>

        <span className="rounded-full bg-cyan-500/15 px-4 py-2 text-xs font-semibold text-cyan-300">
          🌐 Live Counter
        </span>

        <span className="rounded-full bg-yellow-500/15 px-4 py-2 text-xs font-semibold text-yellow-300">
          💚 Trusted Hospital
        </span>

      </div>

    </div>

  </div>

  {/* ================= RIGHT : CONTENT ================= */}

  <div className="order-1 text-center lg:order-2 lg:text-left">

    <span className="inline-flex items-center rounded-full border border-emerald-400/20 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 px-5 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-emerald-200 backdrop-blur-xl">
      WEBSITE STATISTICS
    </span>

    <h2 className="mt-6 text-3xl font-black leading-tight text-white sm:text-5xl">
      Our Visitors
    </h2>

    <p className="mt-6 text-base leading-8 text-white/70">
      Thousands of patients and visitors trust Dew Care Hospital every year.
      Our visitor counter reflects the growing confidence people have in our
      commitment to quality healthcare, advanced medical technology, and
      compassionate treatment.
    </p>

    <div className="mt-8 space-y-4">

      <div className="flex items-start gap-3">
        <span className="mt-1 text-emerald-400">✓</span>
        <p className="text-white/80">
          Trusted by thousands of patients across Assam.
        </p>
      </div>

      <div className="flex items-start gap-3">
        <span className="mt-1 text-cyan-400">✓</span>
        <p className="text-white/80">
          Live visitor counter updated automatically.
        </p>
      </div>

      <div className="flex items-start gap-3">
        <span className="mt-1 text-yellow-400">✓</span>
        <p className="text-white/80">
          Delivering compassionate healthcare with excellence.
        </p>
      </div>

    </div>

  </div>

</div>


  </div>

</section>
);
}
  