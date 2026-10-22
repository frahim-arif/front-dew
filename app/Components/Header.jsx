"use client";

import {
  MapPin,
  ChevronDown,
  PhoneCall,
  X,
  MessageCircle,
  Menu,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { siteInfo } from "../data/siteData";

// ==================================================
// NAV DATA (desktop + mobile dono yahi use karte hain)
// ==================================================

const NAV = [
  { name: "Home", href: "/" },
  {
    name: "About",
    href: "/about",
    children: [
      { name: "About Hospital", href: "/about" },
      { name: "Gallery", href: "/gallery" },
      { name: "Contact Us", href: "/contact" },
    ],
  },
  { name: "Services", href: "/services" },
  { name: "Doctors", href: "/doctors" },
  { name: "Facilities", href: "/facilities" },
  {
    name: "Training",
    href: "/training",
    children: [
      { name: "Training Application Form", href: "/training/application-form" },
      { name: "Training Courses", href: "/training/courses" },
      { name: "Courses Files", href: "/training/course-files" },
      { name: "Courses Videos", href: "/training/course-videos" },
    ],
  },
];

export default function Header() {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [openSub, setOpenSub] = useState(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [callbackOpen, setCallbackOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // ---------- Phone helpers ----------
  const hospitalPhone = String(siteInfo.phone || "");
  const cleanHospitalPhone = hospitalPhone.replace(/\D/g, "");
  const whatsappPhone =
    cleanHospitalPhone.length === 10
      ? `91${cleanHospitalPhone}`
      : cleanHospitalPhone;
  const telHref = whatsappPhone ? `tel:+${whatsappPhone}` : "#";

  // ---------- Effects ----------
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Modal open ho to page scroll lock + Esc se band
  useEffect(() => {
    if (!callbackOpen) return;
    const onKey = (e) => e.key === "Escape" && setCallbackOpen(false);
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [callbackOpen]);

  // Page badalne par menu band
  useEffect(() => {
    setOpen(false);
    setOpenSub(null);
    setLocationOpen(false);
  }, [pathname]);

  // ---------- Handlers ----------
  const openCallback = () => {
    setCallbackOpen(true);
    setOpen(false);
    setLocationOpen(false);
  };
  const closeCallback = () => setCallbackOpen(false);

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    const name = form.name.value.trim();
    const phone = form.phone.value.trim();
    const message = form.message.value.trim();

    if (!name) return alert("Please enter your name.");
    if (!/^\d{10}$/.test(phone))
      return alert("Please enter a valid 10-digit mobile number.");

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

  const isActive = (item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname?.startsWith(item.href) ||
        item.children?.some((c) => pathname === c.href);

  return (
    <>
      <header
        className={`sticky top-0 z-50 overflow-x-clip transition-all duration-300 ${
          scrolled
            ? "bg-white/85 shadow-[0_10px_40px_-10px_rgba(6,78,59,.25)] backdrop-blur-2xl"
            : "bg-white shadow-md"
        }`}
      >
        {/* ==================================================
            TOP BAR
        ================================================== */}
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0b2d68] via-[#123f87] to-[#0b2d68] text-white">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,.12),transparent_40%)]" />

          <div className="relative mx-auto flex max-w-7xl items-center justify-between">
            <div className="hidden min-w-0 items-center gap-4 px-4 py-2 text-xs font-semibold sm:flex md:text-sm">
              <span className="flex min-w-0 items-center gap-1.5">
                <MapPin size={14} className="shrink-0 text-emerald-300" />
                <span className="truncate">{siteInfo.address}</span>
              </span>

              <span className="hidden h-4 w-px shrink-0 bg-white/30 lg:block" />

              <span className="hidden min-w-0 items-center gap-1.5 lg:flex">
                <Mail size={14} className="shrink-0 text-emerald-300" />
                <span className="truncate">{siteInfo.email}</span>
              </span>
            </div>

            <button
              type="button"
              onClick={openCallback}
              aria-label="Request a callback"
              className="group relative ml-auto flex shrink-0 items-center gap-2.5 overflow-hidden bg-gradient-to-r from-[#e30613] to-[#ff2d3a] px-4 py-2 text-sm font-black text-white transition-all duration-300 hover:brightness-110 sm:px-5 md:px-6"
            >
              <span className="pointer-events-none absolute inset-y-0 -left-10 w-8 -skew-x-12 bg-white/30 blur-sm transition-all duration-700 group-hover:left-[120%]" />

              <span className="relative flex h-7 w-7 shrink-0 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-white/60" />
                <span className="relative flex h-7 w-7 items-center justify-center rounded-full bg-white text-[#e30613]">
                  <PhoneCall size={15} strokeWidth={3} />
                </span>
              </span>

              <span className="relative whitespace-nowrap tracking-wide">
                {siteInfo.phone}
              </span>
            </button>
          </div>
        </div>

        {/* ==================================================
            MAIN NAVBAR
        ================================================== */}
        <nav
          className={`mx-auto flex max-w-7xl items-center justify-between gap-2 px-3 transition-all duration-300 sm:px-4 xl:gap-3 ${
            scrolled ? "py-2" : "py-3 md:py-4"
          }`}
        >
          {/* LOGO */}
          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 lg:max-w-[230px] lg:flex-none xl:max-w-[280px]"
          >
            <div className="group relative shrink-0">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500 opacity-40 blur transition duration-500 group-hover:opacity-80" />
              <img
                src="/images/logo.jpg"
                alt={siteInfo.name}
                className={`relative rounded-xl border border-emerald-100 bg-white object-contain p-1 shadow-md transition-all duration-300 sm:rounded-2xl ${
                  scrolled
                    ? "h-10 w-10 sm:h-12 sm:w-12"
                    : "h-11 w-11 sm:h-14 sm:w-14"
                }`}
              />
            </div>

            <div className="min-w-0">
              <h1 className="truncate bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500 bg-clip-text text-base font-black leading-tight text-transparent sm:text-xl md:text-2xl">
                {siteInfo.name}
              </h1>
              <p className="truncate text-[10px] font-bold text-slate-500 sm:text-xs md:text-sm">
                {siteInfo.tagline}
              </p>
            </div>
          </Link>

          {/* ==================================================
              DESKTOP LINKS
          ================================================== */}
          <div className="hidden shrink-0 items-center gap-0.5 xl:flex">
            {NAV.map((item, i) => {
              const active = isActive(item);
              const isLast = i === NAV.length - 1;
              const base = `relative flex items-center gap-1 whitespace-nowrap rounded-full px-3 py-2 text-[13px] font-bold transition-all duration-300 2xl:px-4 2xl:text-sm ${
                active
                  ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30"
                  : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
              }`;

              if (!item.children) {
                return (
                  <Link key={item.href} href={item.href} className={base}>
                    {item.name}
                  </Link>
                );
              }

              return (
                <div key={item.name} className="group relative">
                  <button type="button" className={base}>
                    {item.name}
                    <ChevronDown
                      size={15}
                      className="transition-transform duration-300 group-hover:rotate-180"
                    />
                  </button>

                  {/* pt-3 wrapper: hover gap nahi tootega. Last dropdown right se khulta hai */}
                  <div
                    className={`invisible absolute top-full z-50 w-64 translate-y-2 pt-3 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 ${
                      isLast ? "right-0" : "left-0"
                    }`}
                  >
                    <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white/95 p-2 shadow-[0_25px_60px_-15px_rgba(6,78,59,.35)] backdrop-blur-xl">
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          className="group/item flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition-all hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:text-emerald-700"
                        >
                          {child.name}
                          <span className="-translate-x-2 text-emerald-500 opacity-0 transition-all group-hover/item:translate-x-0 group-hover/item:opacity-100">
                            →
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ==================================================
              LOCATION DROPDOWN (sirf 2xl screen par)
          ================================================== */}
          <div className="relative hidden 2xl:block">
            <button
              type="button"
              onClick={() => setLocationOpen(!locationOpen)}
              aria-expanded={locationOpen}
              className="group flex items-center gap-2 whitespace-nowrap rounded-xl bg-gradient-to-br from-slate-800 to-slate-950 px-4 py-2.5 text-sm font-bold text-white shadow-[0_5px_0_#0f172a] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_10px_18px_rgba(15,23,42,.35)] active:translate-y-[2px] active:shadow-[0_3px_0_#0f172a]"
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/15">
                <MapPin size={15} />
              </span>
              <span>Darrang</span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-300 ${
                  locationOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {locationOpen && (
              <div className="absolute right-0 z-50 mt-3 w-80 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_25px_60px_rgba(0,0,0,.2)]">
                <div className="bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-600 px-6 py-4">
                  <h3 className="text-lg font-bold text-white">
                    Our Locations
                  </h3>
                  <p className="mt-1 text-xs text-white/80">
                    Choose your preferred hospital branch
                  </p>
                </div>

                {/* Active */}
                <div className="flex items-start gap-4 border-b border-slate-100 px-6 py-5 transition hover:bg-emerald-50/50">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-md shadow-emerald-500/30">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[15px] font-bold text-slate-800">
                      Dew Care Hospital LLP
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Burigaon, Kharupetia, Darrang, Assam
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-[11px] font-bold text-green-700">
                    Active
                  </span>
                </div>

                {/* Opening soon */}
                <div className="flex items-start gap-4 px-6 py-5 transition hover:bg-amber-50/50">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#C89B3C] to-[#B8860B] shadow-md shadow-amber-500/30">
                    <MapPin size={20} className="text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[15px] font-bold text-slate-800">
                      Dew Care Hospital & Research Centre
                    </h4>
                    <p className="mt-1 text-sm text-slate-500">
                      Tezpur, Assam
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-yellow-100 px-3 py-1 text-[11px] font-bold text-yellow-700">
                    Opening Soon
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* APPOINTMENT BUTTON */}
          <Link
            href="/appointment"
            className="group relative hidden shrink-0 items-center overflow-hidden whitespace-nowrap rounded-xl bg-gradient-to-r from-[#C89B3C] via-[#E6C76A] to-[#B8860B] px-4 py-2.5 text-[13px] font-bold text-[#3A2A00] shadow-[0_5px_0_#8B6A18] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_20px_rgba(200,155,60,.45)] active:translate-y-[2px] active:shadow-[0_3px_0_#8B6A18] md:flex 2xl:px-5 2xl:text-sm"
          >
            <span className="pointer-events-none absolute inset-y-0 -left-10 w-8 -skew-x-12 bg-white/50 blur-sm transition-all duration-700 group-hover:left-[120%]" />
            <span className="relative">
              📅 Book<span className="hidden xl:inline">&nbsp;Appointment</span>
            </span>
          </Link>

          {/* MOBILE MENU BUTTON */}
          <button
            type="button"
            onClick={() => {
              setOpen(!open);
              setLocationOpen(false);
            }}
            aria-label="Toggle Menu"
            aria-expanded={open}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 transition active:scale-90 xl:hidden"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {/* ==================================================
            MOBILE MENU
        ================================================== */}
        {open && (
          <div className="max-h-[calc(100vh-110px)] overflow-y-auto border-t border-emerald-100 bg-white/95 px-4 py-5 shadow-2xl backdrop-blur-xl xl:hidden">
            <div className="grid gap-2">
              {NAV.map((item) => {
                const active = isActive(item);

                if (!item.children) {
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`rounded-xl px-4 py-3 text-sm font-bold transition ${
                        active
                          ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md"
                          : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                      }`}
                    >
                      {item.name}
                    </Link>
                  );
                }

                const isOpen = openSub === item.name;
                return (
                  <div
                    key={item.name}
                    className="overflow-hidden rounded-xl border border-emerald-100"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenSub(isOpen ? null : item.name)}
                      aria-expanded={isOpen}
                      className={`flex w-full items-center justify-between px-4 py-3 text-sm font-bold transition ${
                        isOpen || active
                          ? "bg-emerald-50 text-emerald-700"
                          : "text-slate-700"
                      }`}
                    >
                      {item.name}
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="space-y-1 bg-white px-3 pb-3 pt-1">
                        {item.children.map((child) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            onClick={() => setOpen(false)}
                            className="block rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={openCallback}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#e30613] to-[#ff2d3a] px-5 py-3 text-sm font-black text-white shadow-[0_5px_0_#a9000a] transition active:translate-y-[2px] active:shadow-[0_2px_0_#a9000a]"
            >
              <PhoneCall size={18} />
              Request a Callback
            </button>

            <Link
              href="/appointment"
              onClick={() => setOpen(false)}
              className="mt-4 block rounded-xl bg-gradient-to-r from-[#C89B3C] via-[#E6C76A] to-[#B8860B] px-5 py-3 text-center text-sm font-bold text-[#3A2A00] shadow-[0_6px_0_#8B6A18] transition active:translate-y-[2px] active:shadow-[0_3px_0_#8B6A18]"
            >
              📅 Book Appointment
            </Link>

            <div className="mt-4 rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-4 text-sm text-emerald-900">
              <a
                href={telHref}
                className="flex items-center gap-2 font-semibold"
              >
                <PhoneCall size={16} />
                {siteInfo.phone}
              </a>
              <p className="mt-2 flex items-center gap-2 break-all font-semibold">
                <Mail size={16} className="shrink-0" />
                {siteInfo.email}
              </p>
              <p className="mt-2 flex items-start gap-2 text-xs text-emerald-700">
                <MapPin size={14} className="mt-0.5 shrink-0" />
                {siteInfo.address}
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
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-md"
          onClick={closeCallback}
          role="dialog"
          aria-modal="true"
          aria-label="Request a Callback"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-3xl bg-white shadow-[0_30px_90px_rgba(0,0,0,.45)] ring-1 ring-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0b2d68] via-[#123f87] to-[#0b2d68] px-6 py-6 text-white">
              <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-cyan-400/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -left-10 h-36 w-36 rounded-full bg-red-500/25 blur-3xl" />

              <button
                type="button"
                onClick={closeCallback}
                aria-label="Close callback form"
                className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white transition hover:rotate-90 hover:bg-white/25"
              >
                <X size={20} />
              </button>

              <div className="relative flex items-center gap-4">
                <span className="relative flex h-14 w-14 shrink-0">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#e30613]/50" />
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#e30613] to-[#ff2d3a] shadow-lg ring-2 ring-white/30">
                    <PhoneCall size={25} />
                  </span>
                </span>

                <div className="pr-8">
                  <h3 className="text-xl font-black">Request a Callback</h3>
                  <p className="mt-1 text-sm text-white/80">
                    Our hospital team will contact you shortly.
                  </p>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCallbackSubmit} className="space-y-4 p-6">
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
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label
                  htmlFor="callback-phone"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Mobile Number *
                </label>
                <div className="flex">
                  <span className="flex items-center rounded-l-xl border border-r-0 border-slate-200 bg-slate-100 px-3 text-sm font-bold text-slate-600">
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
                    className="min-w-0 flex-1 rounded-r-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                  />
                </div>
              </div>

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
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                />
              </div>

              <button
                type="submit"
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#e30613] to-[#ff2d3a] px-5 py-3.5 text-sm font-black text-white shadow-[0_5px_0_#a9000a] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_18px_rgba(227,6,19,.30)] active:translate-y-[2px] active:shadow-[0_2px_0_#a9000a]"
              >
                <span className="pointer-events-none absolute inset-y-0 -left-10 w-8 -skew-x-12 bg-white/30 blur-sm transition-all duration-700 group-hover:left-[120%]" />
                <MessageCircle size={18} className="relative" />
                <span className="relative">Request Callback</span>
              </button>

              <a
                href={telHref}
                className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-[#0b2d68] px-5 py-3 text-sm font-bold text-[#0b2d68] transition hover:bg-[#0b2d68] hover:text-white"
              >
                <PhoneCall size={17} />
                Call Now — {siteInfo.phone}
              </a>

              <p className="text-center text-[11px] text-slate-400">
                🔒 Your information is safe with us.
              </p>
            </form>
          </div>
        </div>
      )}
    </>
  );
}