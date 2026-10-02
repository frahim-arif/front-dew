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
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-72 w-72 rounded-full bg-yellow-300/20 blur-[120px]" />

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

      {/* Heading */}
      <div className="mb-10 text-center">
        <span className="inline-flex rounded-full border border-emerald-300/40 bg-gradient-to-r from-[#E8F5E9] via-[#A5D6A7] to-[#66BB6A] px-4 py-1 text-xs font-bold uppercase tracking-[0.25em] text-[#174A2A] shadow-[0_4px_15px_rgba(46,125,50,0.22)]">
          Our Partners
        </span>
      </div>

      {/* Slider */}
      <div className="w-full overflow-hidden bg-gradient-to-r from-[#0C6D78] via-[#178893] to-[#2CA4A6]">
        <div className="partner-track flex w-max">
          {[...partners, ...partners].map((partner, index) => (
            <div
              key={index}
              className="flex h-16 md:h-24 min-w-[220px] md:min-w-[300px] shrink-0 items-center gap-3 md:gap-5 border-r border-white/20 px-4 md:px-8 hover:bg-white/10 transition-all duration-300"
            >
              {/* Logo */}
              <div className="relative h-10 w-10 md:h-14 md:w-14 shrink-0 overflow-hidden rounded-full border-2 border-white bg-white">
                <Image
                  src={partner.image}
                  alt={partner.name}
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>

              {/* Text */}
              <div className="min-w-0 flex-1">
                {partner.id === 4 ? (
                  <>
                    <h3 className="truncate text-sm md:text-lg font-bold leading-tight text-white">
                      Dew Care Foundation
                    </h3>

                    <p className="truncate text-[7px] md:text-[10px] leading-tight text-white/80">
                      (Formerly known as Eusuf Memorial Society)
                    </p>

                    <p className="text-[9px] md:text-sm leading-tight text-white/80">
                      NGO
                    </p>
                  </>
                ) : (
                  <>
                    <h3 className="truncate text-sm md:text-lg font-bold text-white">
                      {partner.name}
                    </h3>

                    <p className="text-[10px] md:text-sm text-white/80">
                      Healthcare Partner
                    </p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

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