import Link from "next/link";
import { siteInfo } from "../data/siteData";

/* ---------- Small inline icons ---------- */
const Icon = ({ children, className = "h-4 w-4" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`${className} shrink-0`}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const PhoneIcon = (p) => (
  <Icon {...p}>
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
  </Icon>
);
const MailIcon = (p) => (
  <Icon {...p}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </Icon>
);
const PinIcon = (p) => (
  <Icon {...p}>
    <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z" />
    <circle cx="12" cy="10" r="3" />
  </Icon>
);
const ClockIcon = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </Icon>
);
const ArrowUpIcon = (p) => (
  <Icon {...p}>
    <path d="M12 19V5M5 12l7-7 7 7" />
  </Icon>
);
const FacebookIcon = ({ className = "h-5 w-5" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`${className} shrink-0`}
    aria-hidden="true"
  >
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.2H8v3h2.5V21h3z" />
  </svg>
);

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    ["Home", "/"],
    ["About", "/about"],
    ["Services", "/services"],
    ["Doctors", "/doctors"],
  ];

  const importantLinks = [
    ["Appointment", "/appointment"],
    ["Gallery", "/gallery"],
    ["Facilities", "/facilities"],
    ["Contact", "/contact"],
    ["Privacy Policy", "/privacy-policy"],
  ];

  // siteInfo ke fields optional rakhe hain, agar na ho to row hide ho jayegi
  const contactRows = [
    { icon: PhoneIcon, label: "Call us", value: siteInfo?.phone, href: siteInfo?.phone ? `tel:${siteInfo.phone}` : null },
    { icon: MailIcon, label: "Email", value: siteInfo?.email, href: siteInfo?.email ? `mailto:${siteInfo.email}` : null },
    { icon: PinIcon, label: "Address", value: siteInfo?.address, href: null },
    { icon: ClockIcon, label: "Hours", value: siteInfo?.hours, href: null },
  ].filter((r) => r.value);

  return (
    <footer className="relative isolate overflow-hidden bg-[#10201a] text-white">
      {/* ================= BACKGROUND ================= */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/23.jpg')" }}
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: "#0f1f19", opacity: 0.92 }}
        />
        {/* soft glows */}
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl" />
        {/* subtle dotted texture */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
      </div>

      {/* top glowing line */}
      <div className="h-1 w-full bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

      {/* ================= EMERGENCY / CTA BAND ================= */}
      <div className="relative mx-auto max-w-7xl px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="relative overflow-hidden rounded-[2rem] border border-emerald-300/20 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 p-6 shadow-2xl shadow-emerald-900/40 sm:p-8 md:p-10">
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-12 left-1/3 h-40 w-40 rounded-full bg-black/10 blur-2xl" />

          <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="text-xl font-black leading-tight sm:text-2xl md:text-3xl">
                Apki sehat, hamari zimmedari.
              </h2>
              <p className="mt-2 text-xs leading-6 text-emerald-50/90 sm:text-sm">
                Emergency ho ya routine check-up, hamari team har waqt aapki
                madad ke liye taiyaar hai.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link
                href="/appointment"
                className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-black text-emerald-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Book Appointment
                <span className="transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>

              {siteInfo?.phone && (
                <a
                  href={`tel:${siteInfo.phone}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/40 bg-white/10 px-5 py-3 text-sm font-black text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-white/20"
                >
                  <PhoneIcon />
                  Call Now
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= MAIN FOOTER ================= */}
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* ---------- BRAND ---------- */}
          <div className="sm:col-span-2 lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 opacity-40 blur-md" />
                <img
                  src="/images/logo.jpg"
                  alt={siteInfo.name}
                  className="relative h-12 w-12 rounded-2xl border border-emerald-100 bg-white object-contain p-1 shadow-lg sm:h-14 sm:w-14"
                />
              </div>

              <div className="min-w-0">
                <h2 className="break-words text-lg font-black leading-tight text-white sm:text-xl md:text-2xl">
                  {siteInfo.name}
                </h2>
                {siteInfo.tagline && (
                  <p className="mt-1 line-clamp-2 text-[11px] font-semibold leading-4 text-emerald-200/80 sm:text-xs">
                    {siteInfo.tagline}
                  </p>
                )}
              </div>
            </div>

            <p className="mt-5 max-w-sm text-xs leading-6 text-emerald-50/70 sm:text-sm sm:leading-7">
              Professional healthcare services with trusted doctors, emergency
              support and modern medical facilities.
            </p>

            {/* Social */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="https://www.facebook.com/share/1D9Hhx2RDC/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit Dew Care Hospital on Facebook"
                className="group inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 py-2 pl-2 pr-4 text-xs font-bold text-white backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300/50 hover:bg-white/15 sm:text-sm"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#1877F2] shadow-md transition-transform duration-300 group-hover:scale-110">
                  <FacebookIcon className="h-5 w-5 text-white" />
                </span>
                Follow us on Facebook
              </a>
            </div>
          </div>

          {/* ---------- QUICK LINKS ---------- */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h3 className="mb-5 flex items-center gap-2 text-base font-black text-white sm:text-lg">
              <span className="h-5 w-1 rounded-full bg-gradient-to-b from-emerald-300 to-teal-400" />
              Quick Links
            </h3>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-emerald-50/70 sm:block sm:space-y-3 sm:text-sm">
              {quickLinks.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-2 transition-all duration-300 hover:translate-x-1 hover:text-emerald-300"
                  >
                    <span className="h-px w-3 bg-emerald-400/70 transition-all duration-300 group-hover:w-5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- IMPORTANT ---------- */}
          <div className="lg:col-span-2">
            <h3 className="mb-5 flex items-center gap-2 text-base font-black text-white sm:text-lg">
              <span className="h-5 w-1 rounded-full bg-gradient-to-b from-teal-300 to-emerald-400" />
              Important
            </h3>

            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-emerald-50/70 sm:block sm:space-y-3 sm:text-sm">
              {importantLinks.map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="group inline-flex items-center gap-2 transition-all duration-300 hover:translate-x-1 hover:text-teal-300"
                  >
                    <span className="h-px w-3 bg-teal-400/70 transition-all duration-300 group-hover:w-5" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ---------- LOCATION + CONTACT ---------- */}
          <div className="sm:col-span-2 lg:col-span-4">
            <h3 className="mb-5 flex items-center gap-2 text-base font-black text-white sm:text-lg">
              <span className="h-5 w-1 rounded-full bg-gradient-to-b from-emerald-300 to-teal-400" />
              Our Location
            </h3>

            {contactRows.length > 0 && (
              <ul className="mb-4 space-y-3">
                {contactRows.map(({ icon: RowIcon, label, value, href }) => (
                  <li key={label} className="flex items-start gap-3">
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-emerald-300/20 bg-emerald-400/10 text-emerald-300">
                      <RowIcon />
                    </span>
                    <div className="min-w-0 text-xs sm:text-sm">
                      <p className="font-bold text-emerald-200/80">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          className="break-words text-emerald-50/80 transition hover:text-white"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="break-words text-emerald-50/80">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <div className="group relative overflow-hidden rounded-3xl border border-emerald-300/20 bg-white/10 p-1.5 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-emerald-300/40">
              <iframe
                title="Dew Care Hospital location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3575.075742231129!2d92.66178037542038!3d26.35641207698306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374526d8b01a1a4b%3A0x2fe9bed2ea86b3c2!2sDew%20Care%20Hospital%20%26%20Research%20Centre!5e0!3m2!1sen!2sin!4v1784566685107!5m2!1sen!2sin"
                className="h-[170px] w-full rounded-[1.25rem] sm:h-[200px]"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= BOTTOM BAR ================= */}
      <div className="relative border-t border-emerald-300/15 bg-black/25 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-4 text-center sm:px-6 sm:py-5 md:flex-row md:text-left">
          <p className="text-[11px] leading-5 text-emerald-50/65 sm:text-xs md:text-sm">
            © {currentYear} Dew Care Hospital. All Rights Reserved.
          </p>

          <p className="text-[11px] font-semibold leading-5 text-emerald-200/80 sm:text-xs">
            Powered by{" "}
            <span className="font-black text-emerald-300">WebCoreCubeTech</span>{" "}
            –{" "}
            <a
              href="tel:9058596626"
              className="font-black text-teal-300 transition hover:text-white"
            >
              9058596626
            </a>
          </p>

          <a
            href="#top"
            aria-label="Back to top"
            className="group inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-white/10 px-4 py-2 text-[11px] font-bold text-emerald-100 transition-all duration-300 hover:-translate-y-1 hover:bg-emerald-500 hover:text-white sm:text-xs"
          >
            Back to top
            <ArrowUpIcon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}