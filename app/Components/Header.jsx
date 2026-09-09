"use client";
import { MapPin, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { siteInfo } from "../data/siteData";

export default function Header() {
 const [open, setOpen] = useState(false);
const [locationOpen, setLocationOpen] = useState(false);

const locations = [
  {
    id: 1,
    name: "Dew Care Hospital LLP",
    address: "Burigaon, Kharupetia, Darrang, Assam",
    active: true,
  },
];

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Doctors", href: "/doctors" },
   
    { name: "Facilities", href: "/facilities" },
    { name: "Training", href: "/training" },
    
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 shadow-xl backdrop-blur-xl">
      {/* Top Info Bar */}
<div className="relative hidden overflow-hidden text-white sm:block">

  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center"
    style={{
      backgroundImage: "url('/images/55.jpg')",
    }}
  />

  {/* Optional Dark Overlay */}
  <div className="absolute inset-0 bg-black/40" />

  <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-xs font-semibold md:text-sm">
    <p className="truncate">
      
     {siteInfo.address}
    </p>

    <p className="shrink-0 truncate">
      📞 {siteInfo.phone}
      <span className="mx-2">|</span>
      ✉️ {siteInfo.email}
    </p>
  </div>

</div>

      {/* Main Navbar */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-4 md:py-4">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setOpen(false)}
          className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:flex-none"
        >
          <div className="relative shrink-0">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 opacity-30 blur"></div>

            <img
              src="https://dewcarehospital.com/uploads/doctors/logo.jpg"
              alt={siteInfo.name}
              className="relative h-11 w-11 rounded-xl border border-emerald-100 bg-white object-cover shadow-md sm:h-14 sm:w-14 sm:rounded-2xl"
            />
          </div>

          <div className="min-w-0">
            <h1 className="truncate text-base font-black leading-tight text-green-600 sm:text-xl md:text-2xl">
              {siteInfo.name}
            </h1>

            <p className="truncate text-[10px] font-bold text-emerald-600 sm:text-xs md:text-sm">
              {siteInfo.tagline}
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-6 xl:flex">
 {links.map((link) =>
  link.name === "About" ? (
    // About Dropdown
    <div key={link.href} className="group relative">
      <button className="flex items-center gap-1 text-sm font-bold text-slate-700 transition hover:text-emerald-700">
        About
        <ChevronDown
          size={16}
          className="transition group-hover:rotate-180"
        />
      </button>

      <div className="invisible absolute left-0 top-full mt-3 w-56 rounded-2xl border border-emerald-100 bg-white py-2 opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100">
        <Link
          href="/about"
          className="block px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          About Hospital
        </Link>
        <Link
  href="/gallery"
  className="block px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
>
  Gallery
</Link>

        <Link
          href="/contact"
          className="block px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Contact Us
        </Link>
      </div>
    </div>
  ) : link.name === "Training" ? (
    // Training Dropdown
    <div key={link.href} className="group relative">
      <button className="flex items-center gap-1 text-sm font-bold text-slate-700 transition hover:text-emerald-700">
        Training
        <ChevronDown
          size={16}
          className="transition group-hover:rotate-180"
        />
      </button>

      <div className="invisible absolute left-0 top-full mt-3 w-72 rounded-2xl border border-emerald-100 bg-white py-2 opacity-0 shadow-2xl transition-all duration-300 group-hover:visible group-hover:opacity-100">

        <Link
          href="/training/application-form"
          className="block px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Training Application Form
        </Link>

        <Link
          href="/training/courses"
          className="block px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Training Courses
        </Link>

        <Link
          href="/training/course-files"
          className="block px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Courses Files
        </Link>

        <Link
          href="/training/course-videos"
          className="block px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Courses Videos
        </Link>

      </div>
    </div>
  ) : (
    <Link
      key={link.href}
      href={link.href}
      className="relative text-sm font-bold text-yellow-500 transition-all duration-300 hover:text-emerald-700 after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-emerald-600 after:transition-all hover:after:w-full"
    >
      {link.name}
    </Link>
  )
)}
        </div>

        {/* Location Dropdown Button */}
<div className="relative hidden lg:block">
  <button
    onClick={() => setLocationOpen(!locationOpen)}
    className="
group
flex
items-center
gap-2
rounded-xl
bg-[#2d2e2b]
px-4
py-2.5
text-sm
font-bold
text-white
shadow-[0_5px_0_#45493B]
transition-all
duration-300
hover:-translate-y-1
hover:bg-[#6B705B]
hover:shadow-[0_10px_18px_rgba(92,96,79,.35)]
active:translate-y-[2px]
active:shadow-[0_3px_0_#45493B]
"
  >
    {/* Icon */}
    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
      <MapPin size={15} className="text-white" />
    </div>

    {/* City */}
    <span>Nagaon</span>

    {/* Arrow */}
    <ChevronDown
      size={16}
      className={`transition-transform duration-300 ${
        locationOpen ? "rotate-180" : ""
      }`}
    />
  </button>
{locationOpen && (
  <div className="absolute right-0 mt-3 w-80 overflow-hidden rounded-3xl border border-[#D6D1BF] bg-white shadow-[0_20px_50px_rgba(0,0,0,.18)]">

    {/* Header */}
    <div className="bg-gradient-to-r from-[#5C604F] via-[#72755F] to-[#8A8F79] px-6 py-4">
      <h3 className="text-lg font-bold text-white">
        Our Locations
      </h3>

      <p className="mt-1 text-xs text-white/80">
        Choose your preferred hospital branch
      </p>
    </div>

    {/* Location */}
    <button className="group flex w-full items-start gap-4 border-b border-[#ECE8DC] px-6 py-5 transition-all duration-300 hover:bg-[#F8F7F3]">

      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#5C604F] shadow-md transition group-hover:scale-110">
        <MapPin size={20} className="text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 text-left">
        <h4 className="text-[15px] font-bold text-[#2F3A2F]">
          Dew Care Hospital LLP
        </h4>

        <p className="mt-1 text-sm text-[#6B705B]">
          Burigaon, Kharupetia, Darrang, Assam
        </p>
      </div>

      <span className="rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold text-green-700">
        Active
      </span>
    </button>

    {/* Opening Soon */}
    <button className="group flex w-full items-start gap-4 px-6 py-5 transition-all duration-300 hover:bg-[#F8F7F3]">

      {/* Icon */}
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-r from-[#C89B3C] to-[#B8860B] shadow-md transition group-hover:scale-110">
        <MapPin size={20} className="text-white" />
      </div>

      {/* Content */}
      <div className="flex-1 text-left">
        <h4 className="text-[15px] font-bold text-[#2F3A2F]">
          Dew Care Hospital & Research Centre
        </h4>

        <p className="mt-1 text-sm text-[#6B705B]">
          Tezpur, Assam
        </p>
      </div>

      <span className="rounded-full bg-yellow-100 px-3 py-1 text-[11px] font-bold text-yellow-700">
        Opening Soon
      </span>
    </button>

  </div>
)}
</div>

        {/* Appointment Button */}
        <Link
          href="/appointment"
         className="
hidden
md:flex
shrink-0
items-center
rounded-xl
bg-gradient-to-r
from-[#C89B3C]
via-[#E6C76A]
to-[#B8860B]
px-5
py-3
text-sm
font-bold
text-[#3A2A00]
shadow-[0_6px_0_#8B6A18]
transition-all
duration-300
hover:-translate-y-1
hover:shadow-[0_12px_20px_rgba(200,155,60,.45)]
active:translate-y-[2px]
active:shadow-[0_3px_0_#8B6A18]
"
        >
          Book
          <span className="hidden lg:inline">&nbsp;Appointment</span>
        </Link>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-200 bg-emerald-50 text-2xl font-black text-emerald-800 shadow-sm transition hover:bg-emerald-100 xl:hidden"
          aria-label="Toggle Menu"
        >
          {open ? "×" : "☰"}
        </button>
      </nav>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-emerald-100 bg-white px-4 py-5 shadow-2xl xl:hidden">
          <div className="grid gap-2">
  {links.map((link) =>
  link.name === "Training" ? (
    <div key={link.href} className="rounded-xl border border-emerald-100">
      <div className="px-4 py-3 text-sm font-bold text-slate-700">
        Training
      </div>

      <div className="space-y-1 px-3 pb-3">

        <Link
          href="/training/application-form"
          onClick={() => setOpen(false)}
          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Training Application Form
        </Link>

        <Link
          href="/training/courses"
          onClick={() => setOpen(false)}
          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Training Courses
        </Link>

        <Link
          href="/training/course-files"
          onClick={() => setOpen(false)}
          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Courses Files
        </Link>

        <Link
          href="/training/course-videos"
          onClick={() => setOpen(false)}
          className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
        >
          Courses Videos
        </Link>

      </div>
    </div>
  ) : (
    <Link
      key={link.href}
      href={link.href}
      onClick={() => setOpen(false)}
      className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-emerald-50 hover:text-emerald-700"
    >
      {link.name}
    </Link>
  )
)}
          </div>

          <Link
            href="/appointment"
            onClick={() => setOpen(false)}
            className="
mt-4
block
rounded-xl
bg-gradient-to-r
from-[#C89B3C]
via-[#E6C76A]
to-[#B8860B]
px-5
py-3
text-center
text-sm
font-bold
text-[#3A2A00]
shadow-[0_6px_0_#8B6A18]
transition-all
duration-300
hover:-translate-y-1
hover:shadow-[0_10px_18px_rgba(200,155,60,.45)]
"
          >
            Book Appointment
          </Link>

          <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900 sm:hidden">
            <p className="font-semibold">📞 {siteInfo.phone}</p>
            <p className="mt-2 break-all font-semibold">
              ✉️ {siteInfo.email}
            </p>
          </div>
        </div>
      )}
    </header>
  );
}