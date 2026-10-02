"use client";

import Image from "next/image";

const partners = [
  {
    id: 1,
    name: "Dew Care Hospital LLP",
    image: "/images/partners/1.jpg",
    type: "Healthcare Partner",
  },
  {
    id: 2,
    name: "Dew Care Research Centre",
    image: "/images/partners/2.jpg",
    type: "Healthcare Partner",
  },
  {
    id: 3,
    name: "Nagaon Institute of Health Science",
    image: "/images/partners/4.jpg",
    type: "Healthcare Partner",
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
  return (
    <section className="relative w-full overflow-hidden bg-white py-6">
      {/* ==================================================
          BACKGROUND GLOW
      ================================================== */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-yellow-300/20 blur-[120px]" />

        <div className="absolute -bottom-32 -right-32 h-72 w-72 rounded-full bg-amber-300/20 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "radial-gradient(circle,#d4af37 1px,transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />
      </div>

      {/* ==================================================
          HEADING
      ================================================== */}
      <div className="relative mb-10 text-center">
        <span className="inline-flex rounded-full border border-emerald-300/40 bg-gradient-to-r from-[#E8F5E9] via-[#A5D6A7] to-[#66BB6A] px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-[#174A2A] shadow-[0_4px_15px_rgba(46,125,50,0.22)]">
          Our Partners
        </span>
      </div>

      {/* ==================================================
          SLIDER
      ================================================== */}
      <div className="relative w-full overflow-hidden bg-gradient-to-r from-[#0C6D78] via-[#178893] to-[#2CA4A6]">
        <div className="partner-track flex w-max">
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={`${partner.id}-${index}`}
              className="flex h-16 min-w-[220px] shrink-0 items-center gap-3 border-r border-white/20 px-4 transition-all duration-300 hover:bg-white/10 md:h-24 md:min-w-[300px] md:gap-5 md:px-8"
            >
              {/* IMAGE */}
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white md:h-14 md:w-14">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              {/* TEXT */}
              <div
                className={`min-w-0 ${
                  partner.id === 4
                    ? "flex h-full flex-col justify-center"
                    : ""
                }`}
              >
                {/* NAME */}
                <h3
                  className={`font-bold leading-none text-white ${
                    partner.id === 4
                      ? "text-[13px] md:text-lg"
                      : "text-sm md:text-lg"
                  }`}
                >
                  {partner.name}
                </h3>

                {/* FORMER NAME */}
                {partner.subtitle && (
                  <p className="mt-0.5 whitespace-nowrap text-[6.5px] font-medium leading-none text-white/75 md:text-[10px] md:leading-tight">
                    {partner.subtitle}
                  </p>
                )}

                {/* TYPE */}
                <p
                  className={`font-semibold leading-none text-white/80 ${
                    partner.id === 4
                      ? "mt-1 text-[9px] md:text-sm"
                      : "mt-1 text-[10px] md:text-sm"
                  }`}
                >
                  {partner.type}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ==================================================
          SLIDER ANIMATION
      ================================================== */}
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
      `}</style>
    </section>
  );
}