"use client";

import Image from "next/image";
import Link from "next/link";
import { FileDown, ArrowRight } from "lucide-react";

const partners = [
{
id: 1,
name: "Dew Care Hospital LLP",
image: "/images/partners/1.jpg",
},
{
id: 2,
name: "Dew Care Hospital & Research Centre",
image: "/images/partners/2.jpg",
},
{
id: 3,
name: "Nagaon Institute of Health Science",
image: "/images/partners/4.jpg",
},
{
id: 4,
name: "Dew Care Foundation",
subtitle: "(Formerly known as Eusuf Memorial Society)",
image: "/images/partners/3.jpg",
type: "NGO",
},
];

export default function HospitalPartnersSlider() {
return ( <section className="relative w-full overflow-hidden bg-white py-6 sm:py-8">
{/* Background Glow */} <div className="absolute inset-0 overflow-hidden"> <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-yellow-300/20 blur-[120px]" /> <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-amber-300/20 blur-[120px]" />


    <div
      className="absolute inset-0 opacity-5"
      style={{
        backgroundImage:
          "radial-gradient(circle,#d4af37 1px,transparent 1px)",
        backgroundSize: "30px 30px",
      }}
    />
  </div>

  {/* Heading */}
  <div className="relative z-10 mb-6 text-center sm:mb-8">
    <span className="inline-flex rounded-full border border-emerald-300/40 bg-gradient-to-r from-[#E8F5E9] via-[#A5D6A7] to-[#66BB6A] px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-[#174A2A] shadow-[0_4px_15px_rgba(46,125,50,0.22)]">
      Our Partners
    </span>
  </div>

  {/* Partners Slider - Existing Design */}
  <div className="relative z-10 w-full overflow-hidden bg-gradient-to-r from-[#0C6D78] via-[#178893] to-[#2CA4A6] shadow-[0_5px_14px_rgba(12,109,120,0.18)]">
    <div className="partner-track flex w-max">
      {[...partners, ...partners].map((partner, index) => (
        <div
          key={`${partner.id}-${index}`}
          className="flex h-16 min-w-[220px] shrink-0 items-center gap-3 border-r border-white/20 px-4 transition-all duration-300 hover:bg-white/10 md:h-24 md:min-w-[300px] md:gap-5 md:px-8"
        >
          {/* Logo */}
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white shadow-md md:h-14 md:w-14">
            <Image
              src={partner.image}
              alt={partner.name}
              fill
              sizes="56px"
              className="object-cover"
            />
          </div>

          {/* Partner Details */}
          <div className="min-w-0">
            <h3 className="truncate text-sm font-bold text-white md:text-lg">
              {partner.name}
            </h3>

            {partner.subtitle && (
              <p className="truncate text-[7px] text-white/80 md:text-[10px]">
                {partner.subtitle}
              </p>
            )}

            <p className="text-[10px] text-white/80 md:text-sm">
              {partner.type || "Healthcare Partner"}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Online Reports Button - Premium 3D Design */}
  <div className="relative z-10 mt-7 flex justify-center px-4 sm:mt-9">
    <Link
      href="/prescription-download"
      aria-label="View and download online medical reports"
      className="
        group relative inline-flex w-full max-w-[280px]
        items-center justify-center gap-3
        overflow-hidden rounded-xl
        border border-[#D7B75A]
        bg-gradient-to-b from-[#777D6B] via-[#43463B] to-[#292C24]
        px-5 py-3.5
        text-sm font-extrabold text-white
        shadow-[0_6px_0_#22251D,0_10px_20px_rgba(35,38,29,0.25)]
        transition-all duration-200
        hover:-translate-y-1
        hover:shadow-[0_8px_0_#22251D,0_14px_25px_rgba(35,38,29,0.3)]
        active:translate-y-1
        active:shadow-[0_2px_0_#22251D,0_4px_8px_rgba(35,38,29,0.2)]
        focus-visible:outline-none
        focus-visible:ring-4
        focus-visible:ring-emerald-300/60
        sm:max-w-[300px] sm:px-7 sm:py-4 sm:text-base
      "
    >
      {/* Gold shine */}
      <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Icon */}
      <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#F5DE9A]/70 bg-gradient-to-b from-[#FFE9A6] via-[#DAB64E] to-[#A97B19] text-[#39301A] shadow-[inset_0_2px_2px_rgba(255,255,255,0.65),0_3px_0_#765515] transition-transform duration-300 group-hover:scale-105 sm:h-11 sm:w-11">
        <FileDown size={22} strokeWidth={2.5} />
      </span>

      {/* Button Text */}
      <span className="relative flex flex-1 flex-col items-start">
        <span className="whitespace-nowrap tracking-wide">
          Online Reports
        </span>
        <span className="mt-0.5 text-[10px] font-medium text-white/75 sm:text-xs">
          View & Download Reports
        </span>
      </span>

      {/* Arrow */}
      <ArrowRight
        size={19}
        className="relative shrink-0 text-[#F1D47D] transition-transform duration-300 group-hover:translate-x-1"
      />
    </Link>
  </div>

  {/* Slider Animation */}
  <style jsx>{`
    .partner-track {
      animation: scroll 22s linear infinite;
    }

    .partner-track:hover {
      animation-play-state: paused;
    }

    @keyframes scroll {
      from {
        transform: translateX(0);
      }

      to {
        transform: translateX(-50%);
      }
    }

    @media (max-width: 640px) {
      .partner-track {
        animation-duration: 14s;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .partner-track {
        animation: none;
      }
    }
  `}</style>
</section>


);
}
