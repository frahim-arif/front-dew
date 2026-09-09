import Link from "next/link";
import SectionTitle from "../Components/SectionTitle";

const API = process.env.NEXT_PUBLIC_API_URL || "https://backend-dew.onrender.com/api/doctors";
const SERVER_URL = API.replace("/api", "");

export const metadata = {
  title: "Doctors | Dew Care Hospital",
  description: "Meet doctors and specialists at Dew Care Hospital.",
};

async function getDoctors() {
  try {
    const res = await fetch(`${API}/doctors`, {
      cache: "no-store",
    });

    const data = await res.json();

    if (data.success) {
      return (data.data || []).filter((doctor) => doctor.status === "Active");
    }

    return [];
  } catch (error) {
    return [];
  }
}

export default async function DoctorsPage() {
  const doctors = await getDoctors();

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-sky-800 to-cyan-700 text-white py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,0.35),transparent_35%)]" />
        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold text-cyan-100 backdrop-blur">
            Our Doctors
          </span>

          <h1 className="mt-5 text-4xl md:text-6xl font-extrabold leading-tight">
            Experienced Medical Specialists
          </h1>

          <p className="mt-5 max-w-3xl text-lg text-sky-100">
            Consult experienced doctors for reliable diagnosis, treatment and
            healthcare guidance.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <SectionTitle
          small="Specialists"
          title="Meet Our Doctors"
          desc="Our doctors are committed to patient care and medical excellence."
        />

        {doctors.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
            <p className="text-gray-500">No doctors available right now.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => {
              const imageUrl = doctor.image?.startsWith("/uploads")
                ? `${SERVER_URL}${doctor.image}`
                : doctor.image;

              return (
                <div
                  key={doctor._id}
                  className="group overflow-hidden rounded-[2rem] border border-sky-100 bg-white shadow-xl shadow-sky-100/70 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div className="relative h-80 overflow-hidden bg-gradient-to-br from-sky-100 to-cyan-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={doctor.name}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-8xl">
                        👨‍⚕️
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-sky-950/80 via-sky-950/10 to-transparent" />

                    <span className="absolute left-5 bottom-5 rounded-full bg-cyan-500 px-4 py-2 text-sm font-bold text-white shadow-lg">
                      Doctor&apos;s Profile
                    </span>
                  </div>

                  <div className="p-7">
                    <h3 className="text-2xl font-extrabold text-sky-950">
                      {doctor.name}
                    </h3>

                    <p className="mt-2 font-bold text-cyan-700">
                      {doctor.specialist}
                    </p>

                    {doctor.qualification && (
                      <p className="mt-3 text-gray-600">
                        🎓 {doctor.qualification}
                      </p>
                    )}

                    {doctor.experience && (
                      <p className="mt-2 text-gray-500">
                        ⭐ {doctor.experience}
                      </p>
                    )}

                    {doctor.opdTime && (
                      <p className="mt-2 text-gray-500">🕒 {doctor.opdTime}</p>
                    )}

                    <Link
                      href="/appointment"
                      className="mt-6 block rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 py-3 text-center font-extrabold text-white shadow-lg shadow-cyan-500/20 transition hover:scale-105"
                    >
                      Book Appointment
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}

// import HeroSection from "./components/HeroSection";
{/* <HeroSection /> */}
  {/* Hero Section */}
//       <section className="relative overflow-hidden bg-emerald-950 text-white">
//         <div className="absolute inset-0 overflow-hidden">
//           <div className="absolute inset-0 bg-[linear-gradient(120deg,#022c22_0%,#064e3b_45%,#115e59_100%)]" />

//           <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-emerald-400/20 blur-[130px] md:-left-48 md:h-[650px] md:w-[650px] md:blur-[160px]" />

//           <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-teal-400/20 blur-[130px] md:-right-48 md:h-[650px] md:w-[650px] md:blur-[160px]" />
//           <div
//             className="absolute inset-0 z-[1] opacity-[0.30]"
//             style={{
//               backgroundImage:
//                 "radial-gradient(circle, rgba(167,243,208,.75) 1.2px, transparent 1.2px)",
//               backgroundSize: "28px 28px",
//             }}
//           />

//           <div
//             className="absolute inset-0 z-[1] opacity-[0.05]"
//             style={{
//               backgroundImage: `
//                 linear-gradient(rgba(16,185,129,.5) 1px, transparent 1px),
//                 linear-gradient(90deg, rgba(16,185,129,.5) 1px, transparent 1px)
//               `,
//               backgroundSize: "90px 90px",
//             }}
//           />

//           <div className="absolute left-6 top-20 z-[2] text-5xl font-black text-emerald-300/15 md:left-10 md:top-24 md:text-7xl">
//             +
//           </div>

//           <div className="absolute bottom-20 right-6 z-[2] text-6xl font-black text-teal-300/15 md:bottom-28 md:right-12 md:text-8xl">
//             +
//           </div>
//         </div>

//         <div className="relative z-10 mx-auto grid min-h-[auto] max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 md:py-24 lg:min-h-[88vh] lg:grid-cols-2 lg:gap-12">
//           {/* Hero Left Content */}
//           <div className="text-center lg:text-left">
//             {/* Badge */}
//             <span className="inline-flex rounded-full border border-emerald-300/30 bg-emerald-300/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.18em] text-emerald-100 shadow-lg shadow-emerald-500/10 backdrop-blur sm:px-5 sm:text-[11px] sm:tracking-[0.25em]">
//               24/7 Emergency Care
//             </span>

//             {/* Heading */}
//             <h1 className="mt-6 text-4xl font-black leading-[1.08] tracking-tight text-black sm:text-5xl md:text-6xl lg:text-7xl">
//               Healthcare For
//   <span className="
//   block
//   mt-2
//   bg-gradient-to-r
//   from-cyan-300
//   via-emerald-200
//   to-teal-300
//   bg-clip-text
//   text-transparent
//   text-xl
//   font-serif
//   italic
//   font-bold
//   tracking-wide
//   md:text-2xl
// ">
//   Every Family
// </span>
//             </h1>

//             {/* Description */}
// <p className="
//   mx-auto
//   mt-5
//   max-w-xl
//   font-serif
//   text-sm
//   font-medium
//   leading-8
//   tracking-wide
//   text-teal-100/90
//   sm:text-base
//   md:text-lg
//   md:leading-9
//   lg:mx-0
// ">
//   Dew Care Hospital provides trusted medical care, experienced doctors,
//   emergency support and modern healthcare facilities in Nagaon, Assam.
// </p>

//             {/* Primary Buttons */}
//             <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:max-w-[520px]">
//               {/* Book Appointment */}
//               <Link
//                 href="/appointment"
//                 className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 px-5 py-4 text-sm font-black text-white shadow-[0_8px_0_#065f46,0_16px_35px_rgba(16,185,129,.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_11px_0_#065f46,0_22px_45px_rgba(16,185,129,.5)] active:translate-y-[4px] active:shadow-[0_4px_0_#065f46] sm:px-6"
//               >
//                 <span className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/25 via-transparent to-black/10" />

//                 <span className="absolute -left-20 top-0 h-full w-10 -skew-x-12 bg-white/35 blur-sm transition-all duration-700 group-hover:left-[120%]" />

//                 <span className="relative z-10 flex items-center gap-2">
//                   <span className="text-lg">📅</span>
//                   Book Appointment
//                 </span>
//               </Link>

//               {/* Emergency Call */}
//               <a
//                 href={`tel:${siteInfo.phone}`}
//                 className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl border border-white/20 bg-gradient-to-r from-emerald-950 via-green-900 to-teal-800 px-5 py-4 text-sm font-black text-white shadow-[0_8px_0_#022c22,0_16px_35px_rgba(0,0,0,.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_11px_0_#022c22,0_22px_45px_rgba(20,184,166,.35)] active:translate-y-[4px] active:shadow-[0_4px_0_#022c22] sm:px-6"
//               >
//                 <span className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/15 via-transparent to-black/20" />

//                 <span className="absolute -left-20 top-0 h-full w-10 -skew-x-12 bg-white/25 blur-sm transition-all duration-700 group-hover:left-[120%]" />

//                 <span className="relative z-10 flex items-center gap-2">
//                   <span className="text-lg">📞</span>
//                   Emergency Call
//                 </span>
//               </a>
//             </div>

//             {/* Prescription Button */}
//             <div className="mt-5 lg:max-w-[520px]">
//               <Link
//                 href="/prescription-download"
//                 className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-teal-700 via-emerald-600 to-green-500 px-5 py-4 text-sm font-black text-white shadow-[0_8px_0_#115e59,0_16px_35px_rgba(20,184,166,.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_11px_0_#115e59,0_22px_45px_rgba(20,184,166,.5)] active:translate-y-[4px] active:shadow-[0_4px_0_#115e59] sm:px-6 md:text-base"
//               >
//                 <span className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/20 via-transparent to-black/10" />

//                 <span className="absolute -left-20 top-0 h-full w-10 -skew-x-12 bg-white/35 blur-sm transition-all duration-700 group-hover:left-[120%]" />

//                 <span className="relative z-10 flex items-center gap-2">
//                   <span className="text-lg">📄</span>
//                   Download Prescription
//                 </span>
//               </Link>
//             </div>

//             {/* Mini Stats */}
//             <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:max-w-[560px]">
//               {[
//                 ["24/7", "Emergency"],
//                 ["Expert", "Doctors"],
//                 ["Modern", "Facilities"],
//               ].map(([title, text]) => (
//                 <div
//                   key={title}
//                   className="group relative overflow-hidden rounded-2xl border border-emerald-300/15 bg-white/10 p-3 text-center shadow-xl backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-emerald-300/40 hover:bg-white/15 sm:rounded-3xl sm:p-4"
//                 >
//                   <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-emerald-400/10 blur-xl transition group-hover:bg-emerald-400/20" />

//                   <h3 className="relative text-lg font-black text-emerald-300 sm:text-xl md:text-3xl">
//                     {title}
//                   </h3>

//                   <p className="relative mt-1 text-[10px] text-emerald-50/70 sm:text-xs md:text-sm">
//                     {text}
//                   </p>
//                 </div>
//               ))}
//             </div>
//           </div>

// {/* Hero Right Panel */}



// <div className="relative mx-auto w-full max-w-md lg:max-w-none">


//   {/* Background Glow */}

//   <div className="
//     absolute
//     -inset-8
//     rounded-[3rem]
//     bg-gradient-to-br
//     from-emerald-400/30
//     via-teal-400/20
//     to-green-300/20
//     blur-3xl
//   "/>



//   {/* Floating Badge Top */}

//   <div className="
//     absolute
//     -right-3
//     top-8
//     z-20
//     rounded-2xl
//     border
//     border-white/40
//     bg-white/90
//     px-4
//     py-3
//     shadow-xl
//     backdrop-blur-xl
//   ">

//     <div className="flex items-center gap-2">

//       <span className="
//         h-3
//         w-3
//         rounded-full
//         bg-green-500
//         animate-pulse
//       "/>


//       <div>

//         <p className="
//           text-[10px]
//           font-black
//           uppercase
//           text-emerald-600
//         ">
//           Open Now
//         </p>

//         <p className="
//           text-xs
//           font-bold
//           text-gray-800
//         ">
//           24/7 Care
//         </p>

//       </div>


//     </div>

//   </div>





//   {/* Main Card */}

//   <div className="
//     relative
//     overflow-hidden
//     rounded-[2.8rem]
//     bg-gradient-to-br
//     from-emerald-950
//     via-emerald-800
//     to-teal-600
//     p-5
//     shadow-[0_30px_80px_rgba(0,0,0,.35)]
//   ">


//     {/* Decorative Circles */}

//     <div className="
//       absolute
//       -right-20
//       -top-20
//       h-64
//       w-64
//       rounded-full
//       bg-white/10
//       blur-3xl
//     "/>


//     <div className="
//       absolute
//       -bottom-24
//       -left-20
//       h-64
//       w-64
//       rounded-full
//       bg-emerald-300/20
//       blur-3xl
//     "/>





//     {/* Hospital Branding */}

//     <div className="relative text-center">


//       <p className="
//         text-xs
//         font-bold
//         uppercase
//         tracking-[0.3em]
//         text-emerald-200
//       ">
//         Welcome To
//       </p>



//       <h3 className="
//         mt-2
//         text-2xl
//         font-black
//         text-black
//       ">
//         Dew Care Hospital
//       </h3>


//       <p className="
//         mt-2
//         text-sm
//         text-emerald-100
//       ">
//         Compassionate Care,
//         Modern Healthcare
//       </p>


//     </div>







//     {/* Hospital Logo Circle */}

//   {/* Hospital Logo Circle */}

// <div className="
//   relative
//   mx-auto
//   mt-6
//   h-32
//   w-32
// ">


//   {/* Blue Rotating Outer Ring */}

//   <div className="
//     absolute
//     -inset-2
//     animate-[spin_6s_linear_infinite]
//     rounded-full
//     bg-[conic-gradient(from_0deg,#22d3ee,#2563eb,#38bdf8,#1d4ed8,#22d3ee)]
//     p-[4px]
//     shadow-[0_0_35px_rgba(37,99,235,.7)]
//   ">

//     <div className="
//       h-full
//       w-full
//       rounded-full
//       bg-emerald-950
//     "/>

//   </div>




//   {/* Second Glow Ring */}

//   <div className="
//     absolute
//     -inset-4
//     rounded-full
//     border
//     border-blue-400/30
//     animate-pulse
//   "/>




//   {/* Hospital Image */}

//   <div className="
//     absolute
//     inset-2
//     overflow-hidden
//     rounded-full
//     border-4
//     border-white
//     bg-white
//     shadow-[0_0_30px_rgba(59,130,246,.5)]
//   ">

//     <img
//       src="/images/hospital.png"
//       alt="Dew Care Hospital"
//       className="
//         h-full
//         w-full
//         object-cover
//         transition
//         duration-700
//         hover:scale-110
//       "
//     />

//   </div>



//   {/* Floating Blue Dot */}

//   <div className="
//     absolute
//     -right-1
//     top-5
//     h-4
//     w-4
//     rounded-full
//     bg-blue-400
//     shadow-[0_0_20px_#38bdf8]
//     animate-ping
//   "/>


// </div>







//     {/* Quick Info */}

// <div className="
//   mt-7
//   grid
//   grid-cols-3
//   gap-3
// ">

//   {/* Patients */}
//   <div className="
//     flex
//     items-center
//     justify-between
//     rounded-2xl
//     border
//     border-white/10
//     bg-white/10
//     px-4
//     py-3
//     backdrop-blur-xl
//   ">

//     <p className="
//       text-[10px]
//       font-bold
//       uppercase
//       text-emerald-100
//       md:text-xs
//     ">
//       Patients
//     </p>

//     <p className="
//       text-lg
//       font-black
//       text-white
//       md:text-2xl
//     ">
//       <CountUp end={15} duration={2.5} suffix="K+" />
//     </p>

//   </div>


//   {/* Doctors */}
//   <div className="
//     flex
//     items-center
//     justify-between
//     rounded-2xl
//     border
//     border-white/10
//     bg-white/10
//     px-4
//     py-3
//     backdrop-blur-xl
//   ">

//     <p className="
//       text-[10px]
//       font-bold
//       uppercase
//       text-emerald-100
//       md:text-xs
//     ">
//       Doctors
//     </p>

//     <p className="
//       text-lg
//       font-black
//       text-white
//       md:text-2xl
//     ">
//       <CountUp end={20} duration={2.5} suffix="+" />
//     </p>

//   </div>


//   {/* Services */}
//   <div className="
//     flex
//     items-center
//     justify-between
//     rounded-2xl
//     border
//     border-white/10
//     bg-white/10
//     px-4
//     py-3
//     backdrop-blur-xl
//   ">

//     <p className="
//       text-[10px]
//       font-bold
//       uppercase
//       text-emerald-100
//       md:text-xs
//     ">
//       Services
//     </p>

//     <p className="
//       text-lg
//       font-black
//       text-white
//       md:text-2xl
//     ">
//       <CountUp end={10} duration={2.5} suffix="+" />
//     </p>

//   </div>

// </div>









//     {/* Appointment Box */}

//     <div className="
//       mt-5
//       rounded-[1.8rem]
//       bg-white
//       p-4
//       shadow-xl
//     ">


//       <div className="
//         flex
//         items-center
//         gap-3
//       ">


//         <div className="
//           flex
//           h-12
//           w-12
//           items-center
//           justify-center
//           rounded-2xl
//           bg-emerald-100
//           text-2xl
//         ">
//           📅
//         </div>



//         <div>

//           <p className="
//             text-xs
//             font-bold
//             text-gray-500
//           ">
//             Need Consultation?
//           </p>


//           <p className="
//             font-black
//             text-emerald-700
//           ">
//             Book Appointment Now
//           </p>


//         </div>


//       </div>







//       <Link
//         href="/appointment"
//         className="
//         mt-4
//         block
//         rounded-2xl
//         bg-gradient-to-r
//         from-emerald-600
//         to-teal-500
//         py-4
//         text-center
//         font-black
//         text-white
//         shadow-[0_7px_0_#065f46]
//         transition
//         hover:-translate-y-1
//         hover:shadow-[0_10px_0_#065f46]
//         active:translate-y-1
//         "
//       >

//         Book Your Visit →
        
//       </Link>


//     </div>




//   </div>


// </div>
//         </div>
//       </section>