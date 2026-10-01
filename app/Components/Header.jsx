
"use client";

import {
  MapPin,
  ChevronDown,
  PhoneCall,
  X,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { siteInfo } from "../data/siteData";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);

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

  /*
   * Hospital phone number
   * Used for Call and WhatsApp actions.
   */
  const hospitalPhone = String(siteInfo.phone || "");
  const cleanHospitalPhone = hospitalPhone.replace(/\D/g, "");

  /*
   * Make Indian WhatsApp number safe.
   * If siteInfo.phone is 10 digit, add 91.
   * If already contains country code, keep it.
   */
  const whatsappPhone =
    cleanHospitalPhone.length === 10
      ? `91${cleanHospitalPhone}`
      : cleanHospitalPhone;

  const openCallback = () => {
    setCallbackOpen(true);
    setOpen(false);
    setLocationOpen(false);
  };

  const closeCallback = () => {
    setCallbackOpen(false);
  };

  const handleCallbackSubmit = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    if (!name) {
      alert("Please enter your name.");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    const whatsappMessage = encodeURIComponent(
      `Callback Request - Dew Care Hospital LLP

Name: ${name}
Mobile: ${phone}
Message: ${message || "Please call me back."}`
    );

    if (whatsappPhone) {
      window.open(
        `https://wa.me/${whatsappPhone}?text=${whatsappMessage}`,
        "_blank",
        "noopener,noreferrer"
      );
    } else {
      alert("Hospital WhatsApp number is not configured.");
    }

    form.reset();
    setCallbackOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-emerald-100 bg-white/95 shadow-xl backdrop-blur-xl">
        {/* ==================================================
            TOP HELPLINE BAR
        ================================================== */}
        <div className="bg-[#0b2d68] text-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between">
            {/* Left Information */}
            <div className="hidden min-w-0 items-center gap-4 px-4 py-2 text-xs font-semibold sm:flex md:text-sm">
              <span className="truncate">
                📍 {siteInfo.address}
              </span>

              <span className="hidden h-4 w-px bg-white/30 lg:block" />

              <span className="hidden truncate lg:block">
                ✉️ {siteInfo.email}
              </span>
            </div>

            {/* Mobile / Desktop Phone CTA */}
            <button
              type="button"
              onClick={openCallback}
              className="
                group
                ml-auto
                flex
                shrink-0
                items-center
                gap-2
                bg-[#e30613]
                px-4
                py-2
                text-sm
                font-black
                text-white
                transition-all
                duration-300
                hover:bg-[#c9000b]
                sm:px-5
                md:px-6
              "
              aria-label="Request a callback"
            >
              <span
                className="
                  flex
                  h-7
                  w-7
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-white
                  text-[#e30613]
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                <PhoneCall size={16} strokeWidth={3} />
              </span>

              <span className="whitespace-nowrap">
                {siteInfo.phone}
              </span>
            </button>
          </div>
        </div>

        {/* ==================================================
            MAIN NAVBAR
        ================================================== */}
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-4 md:py-4">
          {/* ==================================================
              LOGO
          ================================================== */}
          <Link
            href="/"
            onClick={() => {
              setOpen(false);
              setLocationOpen(false);
            }}
            className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:flex-none"
          >
            <div className="relative shrink-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 opacity-30 blur" />

              <img
                src="/images/logo.jpg"
                alt={siteInfo.name}
                className="
                  relative
                  h-11
                  w-11
                  rounded-xl
                  border
                  border-emerald-100
                  bg-white
                  object-contain
                  p-1
                  shadow-md
                  sm:h-14
                  sm:w-14
                  sm:rounded-2xl
                "
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

          {/* ==================================================
              DESKTOP LINKS
          ================================================== */}
          <div className="hidden items-center gap-6 xl:flex">
            {links.map((link) =>
              link.name === "About" ? (
                /* ==================================================
                   ABOUT DROPDOWN
                ================================================== */
                <div key={link.href} className="group relative">
                  <button
                    type="button"
                    className="
                      flex
                      items-center
                      gap-1
                      text-sm
                      font-bold
                      text-slate-700
                      transition
                      hover:text-emerald-700
                    "
                  >
                    About

                    <ChevronDown
                      size={16}
                      className="transition group-hover:rotate-180"
                    />
                  </button>

                  <div
                    className="
                      invisible
                      absolute
                      left-0
                      top-full
                      mt-3
                      w-56
                      rounded-2xl
                      border
                      border-emerald-100
                      bg-white
                      py-2
                      opacity-0
                      shadow-2xl
                      transition-all
                      duration-300
                      group-hover:visible
                      group-hover:opacity-100
                    "
                  >
                    <Link
                      href="/about"
                      className="
                        block
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-slate-700
                        hover:bg-emerald-50
                        hover:text-emerald-700
                      "
                    >
                      About Hospital
                    </Link>

                    <Link
                      href="/gallery"
                      className="
                        block
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-slate-700
                        hover:bg-emerald-50
                        hover:text-emerald-700
                      "
                    >
                      Gallery
                    </Link>

                    <Link
                      href="/contact"
                      className="
                        block
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-slate-700
                        hover:bg-emerald-50
                        hover:text-emerald-700
                      "
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
              ) : link.name === "Training" ? (
                /* ==================================================
                   TRAINING DROPDOWN
                ================================================== */
                <div key={link.href} className="group relative">
                  <button
                    type="button"
                    className="
                      flex
                      items-center
                      gap-1
                      text-sm
                      font-bold
                      text-slate-700
                      transition
                      hover:text-emerald-700
                    "
                  >
                    Training

                    <ChevronDown
                      size={16}
                      className="transition group-hover:rotate-180"
                    />
                  </button>

                  <div
                    className="
                      invisible
                      absolute
                      left-0
                      top-full
                      mt-3
                      w-72
                      rounded-2xl
                      border
                      border-emerald-100
                      bg-white
                      py-2
                      opacity-0
                      shadow-2xl
                      transition-all
                      duration-300
                      group-hover:visible
                      group-hover:opacity-100
                    "
                  >
                    <Link
                      href="/training/application-form"
                      className="
                        block
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-slate-700
                        hover:bg-emerald-50
                        hover:text-emerald-700
                      "
                    >
                      Training Application Form
                    </Link>

                    <Link
                      href="/training/courses"
                      className="
                        block
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-slate-700
                        hover:bg-emerald-50
                        hover:text-emerald-700
                      "
                    >
                      Training Courses
                    </Link>

                    <Link
                      href="/training/course-files"
                      className="
                        block
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-slate-700
                        hover:bg-emerald-50
                        hover:text-emerald-700
                      "
                    >
                      Courses Files
                    </Link>

                    <Link
                      href="/training/course-videos"
                      className="
                        block
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-slate-700
                        hover:bg-emerald-50
                        hover:text-emerald-700
                      "
                    >
                      Courses Videos
                    </Link>
                  </div>
                </div>
              ) : (
                /* ==================================================
                   NORMAL LINK
                ================================================== */
                <Link
                  key={link.href}
                  href={link.href}
                  className="
                    relative
                    text-sm
                    font-bold
                    text-yellow-500
                    transition-all
                    duration-300
                    hover:text-emerald-700
                    after:absolute
                    after:-bottom-1
                    after:left-0
                    after:h-[2px]
                    after:w-0
                    after:bg-emerald-600
                    after:transition-all
                    hover:after:w-full
                  "
                >
                  {link.name}
                </Link>
              )
            )}
          </div>

          {/* ==================================================
              LOCATION DROPDOWN
          ================================================== */}
          <div className="relative hidden lg:block">
            <button
              type="button"
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
              aria-expanded={locationOpen}
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <MapPin size={15} className="text-white" />
              </div>

              <span>Nagaon</span>

              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  locationOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {locationOpen && (
              <div
                className="
                  absolute
                  right-0
                  mt-3
                  w-80
                  overflow-hidden
                  rounded-3xl
                  border
                  border-[#D6D1BF]
                  bg-white
                  shadow-[0_20px_50px_rgba(0,0,0,.18)]
                "
              >
                {/* Header */}
                <div className="bg-gradient-to-r from-[#5C604F] via-[#72755F] to-[#8A8F79] px-6 py-4">
                  <h3 className="text-lg font-bold text-white">
                    Our Locations
                  </h3>

                  <p className="mt-1 text-xs text-white/80">
                    Choose your preferred hospital branch
                  </p>
                </div>

                {/* Active Location */}
                <button
                  type="button"
                  className="
                    group
                    flex
                    w-full
                    items-start
                    gap-4
                    border-b
                    border-[#ECE8DC]
                    px-6
                    py-5
                    text-left
                    transition-all
                    duration-300
                    hover:bg-[#F8F7F3]
                  "
                >
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#5C604F]
                      shadow-md
                      transition
                      group-hover:scale-110
                    "
                  >
                    <MapPin size={20} className="text-white" />
                  </div>

                  <div className="flex-1">
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
                <button
                  type="button"
                  className="
                    group
                    flex
                    w-full
                    items-start
                    gap-4
                    px-6
                    py-5
                    text-left
                    transition-all
                    duration-300
                    hover:bg-[#F8F7F3]
                  "
                >
                  <div
                    className="
                      flex
                      h-12
                      w-12
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-gradient-to-r
                      from-[#C89B3C]
                      to-[#B8860B]
                      shadow-md
                      transition
                      group-hover:scale-110
                    "
                  >
                    <MapPin size={20} className="text-white" />
                  </div>

                  <div className="flex-1">
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

          {/* ==================================================
              APPOINTMENT BUTTON
          ================================================== */}
          <Link
            href="/appointment"
            className="
              hidden
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
              md:flex
            "
          >
            Book
            <span className="hidden lg:inline">&nbsp;Appointment</span>
          </Link>

          {/* ==================================================
              MOBILE MENU BUTTON
          ================================================== */}
          <button
            type="button"
            onClick={() => {
              setOpen(!open);
              setLocationOpen(false);
            }}
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-xl
              border
              border-emerald-200
              bg-emerald-50
              text-2xl
              font-black
              text-emerald-800
              shadow-sm
              transition
              hover:bg-emerald-100
              xl:hidden
            "
            aria-label="Toggle Menu"
            aria-expanded={open}
          >
            {open ? "×" : "☰"}
          </button>
        </nav>

        {/* ==================================================
            MOBILE MENU
        ================================================== */}
        {open && (
          <div className="border-t border-emerald-100 bg-white px-4 py-5 shadow-2xl xl:hidden">
            <div className="grid gap-2">
              {links.map((link) =>
                link.name === "Training" ? (
                  <div
                    key={link.href}
                    className="rounded-xl border border-emerald-100"
                  >
                    <div className="px-4 py-3 text-sm font-bold text-slate-700">
                      Training
                    </div>

                    <div className="space-y-1 px-3 pb-3">
                      <Link
                        href="/training/application-form"
                        onClick={() => setOpen(false)}
                        className="
                          block
                          rounded-lg
                          px-3
                          py-2
                          text-sm
                          text-slate-700
                          hover:bg-emerald-50
                          hover:text-emerald-700
                        "
                      >
                        Training Application Form
                      </Link>

                      <Link
                        href="/training/courses"
                        onClick={() => setOpen(false)}
                        className="
                          block
                          rounded-lg
                          px-3
                          py-2
                          text-sm
                          text-slate-700
                          hover:bg-emerald-50
                          hover:text-emerald-700
                        "
                      >
                        Training Courses
                      </Link>

                      <Link
                        href="/training/course-files"
                        onClick={() => setOpen(false)}
                        className="
                          block
                          rounded-lg
                          px-3
                          py-2
                          text-sm
                          text-slate-700
                          hover:bg-emerald-50
                          hover:text-emerald-700
                        "
                      >
                        Courses Files
                      </Link>

                      <Link
                        href="/training/course-videos"
                        onClick={() => setOpen(false)}
                        className="
                          block
                          rounded-lg
                          px-3
                          py-2
                          text-sm
                          text-slate-700
                          hover:bg-emerald-50
                          hover:text-emerald-700
                        "
                      >
                        Courses Videos
                      </Link>
                    </div>
                  </div>
                ) : link.name === "About" ? (
                  <div
                    key={link.href}
                    className="rounded-xl border border-emerald-100"
                  >
                    <div className="px-4 py-3 text-sm font-bold text-slate-700">
                      About
                    </div>

                    <div className="space-y-1 px-3 pb-3">
                      <Link
                        href="/about"
                        onClick={() => setOpen(false)}
                        className="
                          block
                          rounded-lg
                          px-3
                          py-2
                          text-sm
                          text-slate-700
                          hover:bg-emerald-50
                          hover:text-emerald-700
                        "
                      >
                        About Hospital
                      </Link>

                      <Link
                        href="/gallery"
                        onClick={() => setOpen(false)}
                        className="
                          block
                          rounded-lg
                          px-3
                          py-2
                          text-sm
                          text-slate-700
                          hover:bg-emerald-50
                          hover:text-emerald-700
                        "
                      >
                        Gallery
                      </Link>

                      <Link
                        href="/contact"
                        onClick={() => setOpen(false)}
                        className="
                          block
                          rounded-lg
                          px-3
                          py-2
                          text-sm
                          text-slate-700
                          hover:bg-emerald-50
                          hover:text-emerald-700
                        "
                      >
                        Contact Us
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="
                      rounded-2xl
                      px-4
                      py-3
                      text-sm
                      font-bold
                      text-slate-700
                      transition
                      hover:bg-emerald-50
                      hover:text-emerald-700
                    "
                  >
                    {link.name}
                  </Link>
                )
              )}
            </div>

            {/* Mobile Callback */}
            <button
              type="button"
              onClick={openCallback}
              className="
                mt-4
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                bg-[#e30613]
                px-5
                py-3
                text-center
                text-sm
                font-black
                text-white
                shadow-[0_5px_0_#a9000a]
                transition-all
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#c9000b]
              "
            >
              <PhoneCall size={18} />
              Request a Callback
            </button>

            {/* Mobile Appointment */}
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

            {/* Mobile Contact Info */}
            <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-900">
              <a
                href={`tel:${hospitalPhone}`}
                className="flex items-center gap-2 font-semibold"
              >
                <PhoneCall size={16} />
                {siteInfo.phone}
              </a>

              <p className="mt-2 break-all font-semibold">
                ✉️ {siteInfo.email}
              </p>

              <p className="mt-2 text-xs text-emerald-700">
                📍 {siteInfo.address}
              </p>
            </div>
          </div>
        )}
      </header>

      {/* ==================================================
          CALLBACK MODAL
      ================================================== */}
      {callbackOpen && (
        <div
          className="
            fixed
            inset-0
            z-[9999]
            flex
            items-center
            justify-center
            bg-black/60
            px-4
            py-6
            backdrop-blur-sm
          "
          onClick={closeCallback}
          role="dialog"
          aria-modal="true"
          aria-label="Request a Callback"
        >
          <div
            className="
              relative
              max-h-[90vh]
              w-full
              max-w-md
              overflow-y-auto
              overflow-hidden
              rounded-3xl
              bg-white
              shadow-[0_25px_80px_rgba(0,0,0,.30)]
            "
            onClick={(e) => e.stopPropagation()}
          >
            {/* ==================================================
                MODAL HEADER
            ================================================== */}
            <div className="bg-gradient-to-r from-[#0b2d68] to-[#123f87] px-6 py-6 text-white">
              <button
                type="button"
                onClick={closeCallback}
                className="
                  absolute
                  right-4
                  top-4
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-white/10
                  text-white
                  transition
                  hover:bg-white/20
                "
                aria-label="Close callback form"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4">
                <div
                  className="
                    flex
                    h-14
                    w-14
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#e30613]
                    shadow-lg
                  "
                >
                  <PhoneCall size={25} />
                </div>

                <div className="pr-8">
                  <h3 className="text-xl font-black">
                    Request a Callback
                  </h3>

                  <p className="mt-1 text-sm text-white/80">
                    Our hospital team will contact you shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* ==================================================
                CALLBACK FORM
            ================================================== */}
            <form
              onSubmit={handleCallbackSubmit}
              className="space-y-4 p-6"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="callback-name"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Your Name *
                </label>

                <input
                  id="callback-name"
                  name="name"
                  type="text"
                  placeholder="Enter your name"
                  autoComplete="name"
                  required
                  className="
                    w-full
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-[#0b2d68]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#0b2d68]/10
                  "
                />
              </div>

              {/* Mobile */}
              <div>
                <label
                  htmlFor="callback-phone"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Mobile Number *
                </label>

                <div className="flex">
                  <span
                    className="
                      flex
                      items-center
                      rounded-l-xl
                      border
                      border-r-0
                      border-slate-200
                      bg-slate-100
                      px-3
                      text-sm
                      font-bold
                      text-slate-600
                    "
                  >
                    +91
                  </span>

                  <input
                    id="callback-phone"
                    name="phone"
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    pattern="[0-9]{10}"
                    placeholder="10 digit mobile number"
                    autoComplete="tel"
                    required
                    className="
                      min-w-0
                      flex-1
                      rounded-r-xl
                      border
                      border-slate-200
                      bg-slate-50
                      px-4
                      py-3
                      text-sm
                      outline-none
                      transition
                      focus:border-[#0b2d68]
                      focus:bg-white
                      focus:ring-2
                      focus:ring-[#0b2d68]/10
                    "
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="callback-message"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Message
                </label>

                <textarea
                  id="callback-message"
                  name="message"
                  rows={3}
                  placeholder="How can we help you?"
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-slate-200
                    bg-slate-50
                    px-4
                    py-3
                    text-sm
                    outline-none
                    transition
                    focus:border-[#0b2d68]
                    focus:bg-white
                    focus:ring-2
                    focus:ring-[#0b2d68]/10
                  "
                />
              </div>

              {/* WhatsApp Request */}
              <button
                type="submit"
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#e30613]
                  px-5
                  py-3.5
                  text-sm
                  font-black
                  text-white
                  shadow-[0_5px_0_#a9000a]
                  transition-all
                  duration-300
                  hover:-translate-y-0.5
                  hover:bg-[#c9000b]
                  hover:shadow-[0_8px_18px_rgba(227,6,19,.30)]
                  active:translate-y-[2px]
                  active:shadow-[0_2px_0_#a9000a]
                "
              >
                <MessageCircle size={18} />
                Request Callback
              </button>

              {/* Direct Call */}
              <a
                href={`tel:${hospitalPhone}`}
                className="
                  flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#0b2d68]
                  px-5
                  py-3
                  text-sm
                  font-bold
                  text-[#0b2d68]
                  transition
                  hover:bg-[#0b2d68]
                  hover:text-white
                "
              >
                <PhoneCall size={17} />
                Call Now — {siteInfo.phone}
              </a>

              <p className="text-center text-[11px] text-slate-400">
                Your information is safe with us.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

