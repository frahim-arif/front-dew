"use client";
import Link from "next/link";
// import { siteInfo } from "./data/siteData";
import VisitorCounter from "./Components/VisitorCounter";
import CountUp from "react-countup";
import { useEffect, useState } from "react";

import AnimatedCount from "./Components/AnimatedCount";
import HospitalPartnersSlider from "./Components/HospitalPartnersSlider";
import DoctorOrbitShowcase from "./Components/DoctorOrbitShowcase";
import HeroSection from "./Components/HeroSection";
import ServicesSect from "./Components/ServicesSect";
import AboutVideoSection from "./Components/AboutVideoSection";



const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const SERVER_URL = API.replace("/api", "");

function fileUrl(path) {
  if (!path) return "";

  return path.startsWith("/uploads")
    ? `${SERVER_URL}${path}`
    : path;
}

async function getDoctors() {
  try {
    const res = await fetch(`${API}/doctors`, {
      cache: "no-store",
    });

    const data = await res.json();

    return data.success
      ? (data.data || [])
        .filter((doctor) => doctor.status === "Active")
        .slice(0, 4)
      : [];
  } catch (error) {
    console.error("Doctors fetch error:", error);
    return [];
  }
}

async function getFacilities() {
  try {
    const res = await fetch(`${API}/facilities`, {
      cache: "no-store",
    });

    const data = await res.json();

    return data.success
      ? (data.data || [])
        .filter((facility) => facility.status === "Active")
        .slice(0, 4)
      : [];
  } catch (error) {
    console.error("Facilities fetch error:", error);
    return [];
  }
}
async function getServices() {
  try {
    const res = await fetch(`${API}/services`, {
      cache: "no-store",
    });

    const data = await res.json();

    return data.success
      ? (data.data || [])
        .filter((service) => service.status === "Active")
        .slice(0, 6)
      : [];
  } catch (error) {
    console.error("Services fetch error:", error);
    return [];
  }
}

export default function HomePage() {
  const [doctors, setDoctors] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    async function loadData() {
      setDoctors(await getDoctors());
      setFacilities(await getFacilities());
      setServices(await getServices());
    }

    loadData();
  }, []);

  return (
    <main className="overflow-hidden bg-emerald-50/30">
      {/* Announcement Bar */}
<div className="relative overflow-hidden border-y border-white/10 py-2 shadow-lg">

  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: "url('/images/44.jpg')",
    }}
  />

  {/* Top Border */}
  <div className="absolute inset-x-0 top-0 h-px bg-white/30" />

  {/* Bottom Border */}
  <div className="absolute inset-x-0 bottom-0 h-px bg-white/30" />

  {/* Marquee */}
  <div className="relative animate-[marquee_25s_linear_infinite] whitespace-nowrap text-xs font-semibold tracking-wide text-black md:text-sm">
    <span className="mx-8">
      Welcome to Dew Care Hospital • 🏥 24×7 Emergency Care • 👨‍⚕️
      Expert Doctors • 🩺 Advanced Medical Facilities • 📅 Book Your
      Appointment Today • ☎ Emergency Helpline: {siteInfo.phone} • ❤️
      Compassionate Patient Care • 💊 Modern Healthcare Services •
    </span>
  </div>

</div>

    <HeroSection />
      <HospitalPartnersSlider />
        <AboutVideoSection />

    <ServicesSect
  services={services}
  fileUrl={fileUrl}
  EmptyBox={EmptyBox}
/>




      

{/* Why Choose Us Section */}
<section className="relative overflow-hidden py-16 text-white sm:py-20 lg:py-24">

  {/* ================= Background ================= */}

  <div className="pointer-events-none absolute inset-0 overflow-hidden">

    {/* Background Image */}
    <div
      className="absolute inset-0 bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/images/55.jpg')",
      }}
    />

    {/* Dark Overlay */}
    <div className="absolute inset-0 bg-[#2d2e2b]/90" />

    {/* Luxury Glow */}
    <div className="absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-[#E6C76A]/10 blur-[130px]" />

    <div className="absolute -right-40 bottom-0 h-[420px] w-[420px] rounded-full bg-[#C89B3C]/10 blur-[130px]" />

    <div className="absolute left-1/2 top-1/2 h-[620px] w-[620px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[180px]" />

    {/* Grid */}
    <div
      className="absolute inset-0 opacity-[0.05]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(230,199,106,.25) 1px, transparent 1px),
          linear-gradient(90deg, rgba(230,199,106,.25) 1px, transparent 1px)
        `,
        backgroundSize: "80px 80px",
      }}
    />

  </div>

  <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

    {/* ================= Heading ================= */}

    <div className="mx-auto mb-12 max-w-3xl text-center">

      <span className="inline-flex items-center rounded-full border border-[#E6C76A]/30 bg-[#E6C76A]/10 px-5 py-2 text-xs font-bold tracking-[0.25em] text-[#E6C76A] backdrop-blur-xl">
        WHY CHOOSE US
      </span>

      <h2 className="mt-6 text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">

        <span className="bg-gradient-to-r from-white via-[#F5D77A] to-white bg-clip-text text-transparent">
          Our Medical Support
        </span>

      </h2>

      <div className="mx-auto mt-5 h-1 w-24 rounded-full bg-gradient-to-r from-[#C89B3C] via-[#E6C76A] to-[#F5D77A]" />

      <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-white/70 md:text-base">
        Experienced doctors, modern technology, advanced treatment,
        emergency care and patient-first healthcare services under one roof.
      </p>

    </div>

    {/* ================= Two Column ================= */}

    <div className="grid items-stretch gap-10 lg:grid-cols-2">

      {/* ================= Left ================= */}

      <div
        className="
relative
flex
min-h-[500px]
items-center
justify-center
overflow-hidden
rounded-[2rem]
[--inner-radius:-100px]
[--outer-radius:-145px]
sm:min-h-[570px]
sm:[--inner-radius:-128px]
sm:[--outer-radius:-178px]
md:min-h-[620px]
md:[--inner-radius:-140px]
md:[--outer-radius:-195px]
lg:min-h-[650px]
lg:[--inner-radius:-135px]
lg:[--outer-radius:-188px]
"
      >
        <DoctorOrbitShowcase
          doctors={Array.isArray(doctors) ? doctors : []}
        />
      </div>

      {/* ================= Right Panel ================= */}

      <div
        className="
relative
flex
min-h-[500px]
flex-col
overflow-hidden
rounded-[2rem]
border
border-white/10
bg-white/5
p-5
shadow-[0_30px_70px_rgba(0,0,0,.45)]
backdrop-blur-2xl
sm:p-7
md:rounded-[2.5rem]
md:p-8
lg:min-h-[650px]
"
      >

        {/* Decorations */}

        <div className="pointer-events-none absolute inset-0 overflow-hidden">

          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-[#E6C76A]/15 blur-[100px]" />

          <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-[#C89B3C]/15 blur-[100px]" />

          <div className="absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/5 blur-[100px]" />

          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,.8) 1px, transparent 1px)",
              backgroundSize: "25px 25px",
            }}
          />

        </div>
                {/* ================= Trust Section ================= */}

        <div className="relative mt-5 flex-1 overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 shadow-xl backdrop-blur-xl sm:mt-6 sm:rounded-[2rem] sm:p-6">

          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-[#E6C76A]/10 blur-3xl" />


          <div className="relative">

            <p className="text-xs font-black uppercase tracking-[0.18em] text-[#E6C76A]">
              Patient First Care
            </p>


            <h3 className="mt-3 text-xl font-black text-white sm:text-2xl">
              Why Patients Trust Dew Care
            </h3>


            <div className="mt-6 space-y-3">

              {[
                "Clean and hygienic hospital environment",
                "Friendly and professional hospital staff",
                "Fast and simple appointment process",
                "Modern medical diagnosis support",
              ].map((item) => (

                <div
                  key={item}
                  className="
                  group
                  relative
                  overflow-hidden
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  px-4
                  py-3
                  backdrop-blur-xl
                  transition-all
                  duration-300
                  hover:border-[#E6C76A]/40
                  hover:bg-white/10
                  "
                >

                  {/* Gold Accent */}

                  <div
                    className="
                    absolute
                    left-0
                    top-0
                    h-full
                    w-1
                    bg-gradient-to-b
                    from-[#C89B3C]
                    via-[#E6C76A]
                    to-[#F5D77A]
                    transition-all
                    group-hover:w-1.5
                    "
                  />


                  <div className="absolute inset-0 bg-gradient-to-r from-[#E6C76A]/0 via-[#E6C76A]/5 to-transparent opacity-0 transition group-hover:opacity-100" />


                  <p className="relative pl-3 text-sm font-semibold text-white/90">
                    {item}
                  </p>

                </div>

              ))}

            </div>


          </div>

        </div>


        {/* ================= Buttons ================= */}

        <div className="relative mt-6 grid gap-4 sm:grid-cols-2">


          {/* Appointment */}

          <Link
            href="/appointment"
            className="
            group
            relative
            inline-flex
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            bg-gradient-to-r
            from-[#C89B3C]
            via-[#E6C76A]
            to-[#B8860B]
            px-5
            py-4
            text-sm
            font-black
            text-[#2d2e2b]
            shadow-[0_7px_0_#8B6A18,0_15px_30px_rgba(230,199,106,.35)]
            transition-all
            duration-300
            hover:-translate-y-1
            "
          >

            <span className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/10" />


            <span className="relative z-10 flex items-center gap-2">

              📅

              <span>
                Book Appointment
              </span>

            </span>


          </Link>



          {/* Doctors */}

          <Link
            href="/doctors"
            className="
            group
            relative
            inline-flex
            items-center
            justify-center
            overflow-hidden
            rounded-2xl
            border
            border-[#E6C76A]/30
            bg-white/10
            px-5
            py-4
            text-sm
            font-black
            text-white
            shadow-[0_7px_0_#171714,0_15px_30px_rgba(0,0,0,.35)]
            transition-all
            duration-300
            hover:-translate-y-1
            hover:bg-white/20
            "
          >

            <span className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/20" />


            <span className="relative z-10 flex items-center gap-2">

              👨‍⚕️

              <span>
                View Doctors
              </span>

            </span>


          </Link>


        </div>


      </div>

    </div>


  </div>

</section>


      {/* Visitor Counter */}
      <VisitorCounter />
      {/* About and Gallery Buttons */}
    {/* About & Gallery Buttons */}
<div className="relative mt-12 overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-[#0b2f3b] via-[#11424c] to-[#0b2f3b] px-5 py-10 shadow-[0_25px_70px_rgba(0,0,0,.35)] sm:px-8 md:px-12">

  {/* Animated Background */}
  <div className="absolute inset-0">

    {/* Top Glow */}
    <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-emerald-400/20 blur-[130px] animate-pulse" />

    {/* Left Glow */}
    <div className="absolute left-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-400/15 blur-[120px]" />

    {/* Right Glow */}
    <div className="absolute right-0 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-teal-400/15 blur-[120px]" />

    {/* Grid */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />

    {/* Animated Light */}
    <div className="absolute left-[20%] top-8 h-3 w-3 rounded-full bg-white shadow-[0_0_35px_12px_rgba(255,255,255,.9)] animate-ping" />

    <div className="absolute right-[20%] bottom-8 h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_35px_12px_rgba(16,185,129,.9)] animate-pulse" />

  </div>

  {/* Buttons */}
  <div className="relative flex flex-col items-center justify-center gap-5 sm:flex-row">

    {/* About Button */}
    <Link href="/about" className="group relative inline-flex">
      <span className="absolute -bottom-4 left-1/2 h-8 w-[85%] -translate-x-1/2 rounded-full bg-emerald-500/40 blur-2xl transition-all duration-500 group-hover:bg-emerald-400/70" />

      <span className="absolute inset-0 translate-y-[8px] rounded-full bg-emerald-950 transition-all duration-300 group-hover:translate-y-[5px]" />

      <span className="relative flex min-w-[190px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-emerald-950 via-emerald-700 to-green-500 px-9 py-4 font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_18px_40px_rgba(16,185,129,.35)] transition-all duration-300 group-hover:-translate-y-1">
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition duration-700 group-hover:translate-x-full" />
        <span className="relative">About Us</span>
      </span>
    </Link>

    {/* Gallery Button */}
    <Link href="/gallery" className="group relative inline-flex">
      <span className="absolute -bottom-4 left-1/2 h-8 w-[85%] -translate-x-1/2 rounded-full bg-cyan-500/40 blur-2xl transition-all duration-500 group-hover:bg-cyan-400/70" />

      <span className="absolute inset-0 translate-y-[8px] rounded-full bg-cyan-950 transition-all duration-300 group-hover:translate-y-[5px]" />

      <span className="relative flex min-w-[190px] items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-cyan-950 via-teal-700 to-cyan-400 px-9 py-4 font-extrabold uppercase tracking-[0.15em] text-white shadow-[0_18px_40px_rgba(34,211,238,.35)] transition-all duration-300 group-hover:-translate-y-1">
        <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition duration-700 group-hover:translate-x-full" />
        <span className="relative">Gallery</span>
      </span>
    </Link>

  </div>

</div>
      

      {/* Facilities Section */}
  <section className="
relative
overflow-hidden
bg-[#020617]
py-20
text-white
md:py-28
">


  {/* Luxury Background */}

  <div className="absolute inset-0 overflow-hidden">


    {/* Base Gradient */}

    <div className="
      absolute
      inset-0
      bg-gradient-to-br
      from-[#020617]
      via-[#064e3b]
      to-[#042f2e]
    "/>



    {/* Aurora Glow */}

    <div className="
      absolute
      -left-52
      -top-40
      h-[650px]
      w-[650px]
      rounded-full
      bg-emerald-400/30
      blur-[170px]
      animate-pulse
    "/>



    <div className="
      absolute
      -right-52
      top-20
      h-[600px]
      w-[600px]
      rounded-full
      bg-cyan-400/20
      blur-[160px]
    "/>



    <div className="
      absolute
      bottom-[-300px]
      left-1/2
      h-[700px]
      w-[1000px]
      -translate-x-1/2
      rounded-full
      bg-green-500/20
      blur-[200px]
    "/>




    {/* Floating Glass Orbs */}

    <div className="
      absolute
      left-[8%]
      top-[18%]
      h-28
      w-28
      rounded-full
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
    "/>



    <div className="
      absolute
      right-[12%]
      bottom-[20%]
      h-44
      w-44
      rounded-full
      border
      border-emerald-300/20
      bg-emerald-300/5
      backdrop-blur-xl
    "/>




    {/* Tech Grid */}

    <div
      className="
      absolute
      inset-0
      opacity-[0.06]
      "
      style={{
        backgroundImage:`
        linear-gradient(135deg,rgba(255,255,255,.5) 1px,transparent 1px),
        linear-gradient(45deg,rgba(255,255,255,.3) 1px,transparent 1px)
        `,
        backgroundSize:"80px 80px"
      }}
    />




    {/* Dots */}

    <div
      className="
      absolute
      inset-0
      opacity-20
      "
      style={{
        backgroundImage:
        "radial-gradient(#ffffff 1px,transparent 1px)",
        backgroundSize:"45px 45px"
      }}
    />



    {/* Bottom Fade */}

    <div className="
      absolute
      bottom-0
      left-0
      right-0
      h-48
      bg-gradient-to-t
      from-[#020617]
      to-transparent
    "/>


  </div>





  {/* Content */}

  <div className="
    relative
    mx-auto
    max-w-7xl
    px-4
  ">


    {/* Heading */}

    <div className="
      mb-14
      text-center
    ">


      <span className="
        inline-flex
        rounded-full
        border
        border-cyan-300/30
        bg-white/10
        px-5
        py-2
        text-xs
        font-black
        tracking-[0.25em]
        text-cyan-100
        shadow-lg
        shadow-cyan-500/20
        backdrop-blur-xl
      ">
        OUR FACILITIES
      </span>



      <h2 className="
        mt-5
        text-3xl
        font-black
        text-black
        md:text-5xl
      ">
        Modern Hospital Facilities
      </h2>



      <p className="
        mx-auto
        mt-5
        max-w-3xl
        text-base
        leading-8
        text-emerald-50/75
        md:text-lg
      ">
        Designed to provide better care, faster service and a
        comfortable patient experience using modern medical
        infrastructure.
      </p>


    </div>






    {/* Empty State */}

    {facilities.length === 0 ? (

      <div className="
        rounded-3xl
        border
        border-white/10
        bg-white/10
        p-10
        text-center
        backdrop-blur-xl
      ">

        <p className="text-emerald-50/70">
          No facilities available.
        </p>

      </div>


    ) : (



      <div className="
        grid
        grid-cols-2
        gap-4
        md:gap-7
        lg:grid-cols-4
      ">


        {facilities.map((item)=>(


          <div
            key={item._id}
            className="
            group
            relative
            overflow-hidden
            rounded-[2rem]
            border
            border-white/10
            bg-white/10
            p-[1px]
            shadow-2xl
            shadow-black/30
            backdrop-blur-xl
            transition-all
            duration-500
            hover:-translate-y-3
            hover:border-cyan-300/40
            "
          >


            {/* Hover Glow */}

            <div className="
              absolute
              inset-0
              rounded-[2rem]
              bg-gradient-to-br
              from-cyan-400/40
              via-emerald-400/30
              to-green-400/40
              opacity-30
              transition
              duration-500
              group-hover:opacity-100
            "/>




            {/* Card */}

            <div className="
              relative
              overflow-hidden
              rounded-[2rem]
              bg-[#022c22]/80
            ">


              {/* Image */}

              <div className="
                relative
                h-36
                overflow-hidden
                rounded-t-[2rem]
                bg-emerald-950
                md:h-52
              ">


                {item.image ? (

                  <img
                    src={fileUrl(item.image)}
                    alt={item.title}
                    className="
                    h-full
                    w-full
                    object-cover
                    transition
                    duration-700
                    group-hover:scale-110
                    "
                  />


                ):(

                  <div className="
                    flex
                    h-full
                    items-center
                    justify-center
                    text-5xl
                    md:text-7xl
                  ">
                    {item.icon || "🏥"}
                  </div>

                )}



                <div className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#022c22]
                  via-transparent
                  to-transparent
                "/>


              </div>






              {/* Text */}

              <div className="
                p-4
                md:p-6
              ">


                <h3 className="
                  text-base
                  font-black
                  text-white
                  transition
                  group-hover:text-cyan-200
                  md:text-xl
                ">
                  {item.title}
                </h3>



                <p className="
                  mt-2
                  line-clamp-3
                  text-xs
                  leading-6
                  text-emerald-50/70
                  md:text-sm
                ">
                  {item.desc}
                </p>




                {item.category && (

                  <span className="
                    mt-4
                    inline-flex
                    rounded-full
                    border
                    border-cyan-300/30
                    bg-cyan-400/10
                    px-4
                    py-1.5
                    text-[10px]
                    font-black
                    text-cyan-100
                    md:text-xs
                  ">
                    {item.category}
                  </span>

                )}


              </div>


            </div>


          </div>


        ))}


      </div>


    )}



  </div>


</section>

      {/* Doctors Section */}
{/* Doctors Section */}
<section className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-teal-50 py-16 sm:py-20 md:py-24">
  {/* Premium Background */}

{/* Premium Geometric Background */}
<div className="absolute inset-0 overflow-hidden">

  {/* Base */}
  <div className="absolute inset-0 bg-gradient-to-br from-[#0d4738] via-[#146b54] to-[#0f4f40]" />

  {/* Small Geometric Blocks */}
  {[...Array(18)].map((_, i) => (
    <div
      key={i}
      className="absolute rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
      style={{
        width: `${30 + (i % 3) * 20}px`,
        height: `${30 + (i % 3) * 20}px`,
        left: `${(i * 17) % 100}%`,
        top: `${(i * 23) % 100}%`,
        transform: `rotate(${i * 18}deg)`,
      }}
    />
  ))}

  {/* Thin Horizontal Lines */}
  <div className="absolute top-16 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />
  <div className="absolute bottom-16 left-0 h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent" />

  {/* Vertical Line */}
  <div className="absolute left-1/2 top-0 h-full w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

</div>

  <div className="relative mx-auto max-w-7xl px-4">
    {/* Heading */}
    <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
      <span className="inline-flex rounded-full border border-emerald-200 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700 shadow-sm backdrop-blur md:text-xs">
        Our Doctors
      </span>

      <h2 className="mt-4 text-3xl font-black leading-tight text-emerald-950 sm:text-4xl md:text-5xl">
        Meet Our Medical Specialists
      </h2>

      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white md:text-lg">
        Experienced doctors providing trusted consultation, diagnosis and
        patient-focused treatment.
      </p>
    </div>

    {doctors.length === 0 ? (
      <EmptyBox text="No doctors available." />
    ) : (
      <div className="grid grid-cols-2 gap-4 sm:gap-5 md:gap-7 lg:grid-cols-4">
        {doctors.map((doctor) => (
          <article
            key={doctor._id}
            className="group relative flex min-h-full flex-col items-center overflow-hidden rounded-[1.8rem] border border-white/80 bg-white/90 p-3 text-center shadow-[0_16px_45px_rgba(6,78,59,.10)] backdrop-blur-xl transition-all duration-500 hover:-translate-y-3 hover:border-emerald-200 hover:shadow-[0_28px_70px_rgba(16,185,129,.22)] sm:p-4 md:rounded-[2.3rem] md:p-6"
          >
            {/* Card Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-white via-white/95 to-emerald-50/70" />

            <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-emerald-300/20 blur-3xl transition duration-500 group-hover:bg-emerald-300/35" />

            <div className="absolute -bottom-14 -left-14 h-32 w-32 rounded-full bg-teal-300/15 blur-3xl transition duration-500 group-hover:bg-teal-300/30" />

            {/* Doctor Image */}
            <div className="relative mt-1">
              <div className="absolute -inset-5 rounded-full bg-gradient-to-r from-emerald-300/30 via-green-200/20 to-teal-300/30 blur-2xl transition duration-700 group-hover:scale-110" />

              <div className="relative h-24 w-24 sm:h-28 sm:w-28 md:h-40 md:w-40">
                {/* Rotating Ring */}
                <div className="absolute inset-0 animate-[spin_12s_linear_infinite] rounded-full bg-[conic-gradient(from_0deg,#059669,#34d399,#facc15,#14b8a6,#059669)] p-[3px] shadow-[0_0_20px_rgba(16,185,129,.28)]">
                  <div className="h-full w-full rounded-full bg-white" />
                </div>

                {/* Image */}
                <div className="absolute inset-[5px] overflow-hidden rounded-full bg-emerald-50 ring-4 ring-white shadow-xl">
                  {doctor.image ? (
                    <img
                      src={fileUrl(doctor.image)}
                      alt={doctor.name}
                      className="h-full w-full rounded-full object-cover transition duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-100 to-teal-100 text-4xl md:text-6xl">
                      👨‍⚕️
                    </div>
                  )}
                </div>

                {/* Active Badge */}
                <span className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-emerald-500 shadow-md md:h-6 md:w-6">
                  <span className="h-1.5 w-1.5 rounded-full bg-white md:h-2 md:w-2" />
                </span>
              </div>
            </div>

            {/* Doctor Information */}
            <div className="relative mt-4 flex w-full flex-1 flex-col items-center md:mt-6">
              <h3 className="line-clamp-2 text-sm font-black leading-tight text-emerald-950 sm:text-base md:text-xl">
                {doctor.name}
              </h3>

              <p className="mt-2 line-clamp-1 text-[10px] font-black uppercase tracking-[0.14em] text-emerald-600 sm:text-xs md:text-sm">
                {doctor.specialist}
              </p>

              {/* Small Badges */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {doctor.department && (
                  <span className="rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-1 text-[8px] font-bold text-emerald-700 sm:text-[9px] md:text-[10px]">
                    {doctor.department}
                  </span>
                )}

                {doctor.experience && (
                  <span className="rounded-full border border-teal-100 bg-teal-50 px-2.5 py-1 text-[8px] font-bold text-teal-700 sm:text-[9px] md:text-[10px]">
                    {doctor.experience}
                  </span>
                )}
              </div>

              {doctor.qualification && (
                <p className="mt-3 line-clamp-2 text-[10px] leading-5 text-slate-500 sm:text-xs">
                  {doctor.qualification}
                </p>
              )}

              {/* Appointment Button */}
              <Link
                href="/appointment"
                className="group/btn relative mt-5 inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-emerald-600 via-green-500 to-teal-500 px-3 py-3 text-[10px] font-black text-white shadow-[0_6px_0_#065f46,0_12px_25px_rgba(16,185,129,.28)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_9px_0_#065f46,0_18px_35px_rgba(16,185,129,.42)] active:translate-y-[3px] active:shadow-[0_3px_0_#065f46] sm:text-xs md:rounded-2xl md:px-5 md:py-3.5 md:text-sm"
              >
                <span className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10" />

                <span className="absolute -left-20 top-0 h-full w-10 -skew-x-12 bg-white/35 blur-sm transition-all duration-700 group-hover/btn:left-[120%]" />

                <span className="relative z-10 flex items-center gap-2">
                  <span>📅</span>
                  <span className="hidden sm:inline">Book Appointment</span>
                  <span className="sm:hidden">Book</span>
                  <span>→</span>
                </span>
              </Link>
            </div>
          </article>
        ))}
      </div>
    )}

    {/* Bottom Actions */}
    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:mt-12 sm:flex-row">
      <Link
        href="/doctors"
        className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-800 via-green-600 to-teal-500 px-7 py-4 text-sm font-black text-white shadow-[0_8px_0_#064e3b,0_16px_32px_rgba(16,185,129,.32)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_11px_0_#064e3b,0_22px_42px_rgba(16,185,129,.48)] active:translate-y-[4px] active:shadow-[0_4px_0_#064e3b] sm:w-auto sm:min-w-[210px]"
      >
        <span className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10" />

        <span className="absolute -left-20 top-0 h-full w-10 -skew-x-12 bg-white/35 blur-sm transition-all duration-700 group-hover:left-[120%]" />

        <span className="relative z-10">View All Doctors</span>
      </Link>

      <Link
        href="/prescription-download"
        className="group relative inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-teal-700 via-emerald-600 to-green-500 px-7 py-4 text-sm font-black text-white shadow-[0_8px_0_#115e59,0_16px_32px_rgba(20,184,166,.30)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_11px_0_#115e59,0_22px_42px_rgba(20,184,166,.45)] active:translate-y-[4px] active:shadow-[0_4px_0_#115e59] sm:w-auto sm:min-w-[230px]"
      >
        <span className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10" />

        <span className="absolute -left-20 top-0 h-full w-10 -skew-x-12 bg-white/35 blur-sm transition-all duration-700 group-hover:left-[120%]" />

        <span className="relative z-10 flex items-center gap-2">
          <span>📄</span>
          Download Prescription
        </span>
      </Link>
    </div>
  </div>
</section>

      {/* Final CTA */}
     <section className="
relative
overflow-hidden
bg-gradient-to-br
from-[#022c22]
via-emerald-950
to-[#042f2e]
py-16
text-white
md:py-24
">


  {/* Background Effects */}

  <div className="absolute inset-0 overflow-hidden">


    {/* Main Glow */}

    <div className="
      absolute
      left-1/2
      top-1/2
      h-[500px]
      w-[500px]
      -translate-x-1/2
      -translate-y-1/2
      rounded-full
      bg-emerald-400/20
      blur-[140px]
    "/>



    {/* Left Orb */}

    <div className="
      absolute
      -left-40
      top-10
      h-96
      w-96
      rounded-full
      bg-cyan-400/20
      blur-[120px]
      animate-pulse
    "/>



    {/* Right Orb */}

    <div className="
      absolute
      -right-40
      bottom-0
      h-[450px]
      w-[450px]
      rounded-full
      bg-emerald-400/20
      blur-[130px]
    "/>




    {/* Floating Circle */}

    <div className="
      absolute
      right-[15%]
      top-20
      h-20
      w-20
      rounded-full
      border
      border-white/10
      bg-white/5
      backdrop-blur-xl
    "/>


    <div className="
      absolute
      left-[12%]
      bottom-20
      h-32
      w-32
      rounded-full
      border
      border-emerald-300/20
      bg-emerald-300/5
      backdrop-blur-xl
    "/>



    {/* Medical Grid */}

    <div
      className="
      absolute
      inset-0
      opacity-[0.08]
      "
      style={{
        backgroundImage: `
        linear-gradient(rgba(255,255,255,.3) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,.3) 1px, transparent 1px)
        `,
        backgroundSize:"55px 55px"
      }}
    />




    {/* Bottom Wave */}

    <div className="
      absolute
      -bottom-32
      left-1/2
      h-64
      w-[120%]
      -translate-x-1/2
      rounded-[50%]
      bg-white/5
      blur-3xl
    "/>


  </div>





  {/* Content */}

  <div className="
    relative
    mx-auto
    max-w-5xl
    px-4
    text-center
  ">



    {/* Badge */}

    <span className="
      inline-flex
      rounded-full
      border
      border-cyan-300/30
      bg-white/10
      px-6
      py-2
      text-xs
      font-black
      tracking-[0.3em]
      text-cyan-100
      shadow-lg
      backdrop-blur-xl
    ">
      EMERGENCY SUPPORT
    </span>





    <h2 className="
      mt-6
      text-yellow-200
      font-black
      leading-tight
      md:text-5xl
    ">
      Need Immediate Medical Help?
    </h2>




    <p className="
      mx-auto
      mt-5
      max-w-2xl
      text-base
      leading-8
      text-emerald-50/80
      md:text-lg
    ">
      Call Dew Care Hospital or book your appointment online
      for quick medical support.
    </p>





    {/* Buttons */}

    <div className="
      mt-9
      flex
      flex-col
      justify-center
      gap-4
      sm:flex-row
    ">



      {/* Call Button */}

      <a
        href={`tel:${siteInfo.phone}`}
        className="
        group
        relative
        overflow-hidden
        rounded-2xl
        bg-white
        px-8
        py-4
        font-black
        text-emerald-950
        shadow-[0_15px_40px_rgba(255,255,255,.2)]
        transition
        hover:-translate-y-1
        "
      >

        <span className="
          absolute
          inset-0
          -translate-x-full
          bg-gradient-to-r
          from-transparent
          via-white/60
          to-transparent
          transition
          duration-700
          group-hover:translate-x-full
        "/>


        <span className="relative">
          📞 Call Now
        </span>

      </a>






      {/* Appointment Button */}

      <Link
        href="/appointment"
        className="
        group
        relative
        overflow-hidden
        rounded-2xl
        border
        border-emerald-300/30
        bg-emerald-400/10
        px-8
        py-4
        font-black
        text-white
        shadow-xl
        backdrop-blur-xl
        transition
        hover:-translate-y-1
        hover:bg-emerald-400/20
        "
      >

        <span className="
          absolute
          inset-0
          bg-gradient-to-r
          from-transparent
          via-white/20
          to-transparent
          -translate-x-full
          transition
          duration-700
          group-hover:translate-x-full
        "/>


        <span className="relative">
          📅 Book Appointment
        </span>


      </Link>


    </div>



  </div>


</section>
    </main>
  );
}

function PremiumHeading({ badge, title, desc }) {
  return (
    <div className="mx-auto mb-14 max-w-3xl text-center">
      <span className="inline-flex rounded-full border border-emerald-500/30 bg-emerald-500/10 px-5 py-2 text-xs font-black tracking-[0.25em] text-emerald-700">
        {badge}
      </span>

      <h2 className="mt-5 text-3xl font-black leading-tight text-emerald-950 md:text-5xl">
        {title}
      </h2>

      <p className="mx-auto mt-5 text-base leading-8 text-slate-600 md:text-lg">
        {desc}
      </p>
    </div>
  );
}

function EmptyBox({ text }) {
  return (
    <div className="rounded-3xl border border-emerald-100 bg-white p-12 text-center shadow-xl shadow-emerald-100/60">
      <p className="text-slate-500">{text}</p>
    </div>
  );
}