import Link from "next/link";
import { siteInfo } from "../data/siteData";

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

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-950 to-teal-950 text-white">
     
  {/* Background */}
<div className="pointer-events-none absolute inset-0 overflow-hidden">

  {/* Background Image */}
  <div
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: "url('/images/23.jpg')",
    }}
  />

  {/* Color Overlay */}
  <div
    className="absolute inset-0"
    style={{
      backgroundColor: "#2d2e2b",
      opacity: 0.88, // 0.5 - 0.9 ke beech apne hisab se adjust kar sakte ho
    }}
  />

</div>

      {/* Main Footer */}
      <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Brand */}
          <div className="rounded-3xl border border-emerald-300/15 bg-white/10 p-4 shadow-2xl shadow-emerald-950/30 backdrop-blur-xl sm:col-span-2 sm:p-5 lg:col-span-1">
            <div className="flex items-center gap-3">
              <div className="relative shrink-0">
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 opacity-30 blur" />

                <img
                  src="https://dewcarehospital.com/uploads/doctors/logo.jpg"
                  alt={siteInfo.name || "Dew Care Hospital"}
                  className="relative h-12 w-12 rounded-xl border border-emerald-200 bg-white object-cover shadow-lg sm:h-14 sm:w-14 sm:rounded-2xl"
                />
              </div>

              <div className="min-w-0">
                <h2 className="break-words text-lg font-black leading-tight text-emerald-200 sm:text-xl md:text-2xl">
                  {siteInfo.name}
                </h2>

                {siteInfo.tagline && (
                  <p className="mt-1 line-clamp-2 text-[10px] font-bold leading-4 text-emerald-100/70 sm:text-xs">
                    {siteInfo.tagline}
                  </p>
                )}
              </div>
            </div>

            <p className="mt-4 text-xs leading-6 text-emerald-50/75 sm:mt-5 sm:text-sm sm:leading-7">
              Professional healthcare services with trusted doctors,
              emergency support and modern medical facilities.
            </p>

            <Link
              href="/appointment"
              className="group relative mt-5 inline-flex w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-600 via-green-600 to-teal-500 px-4 py-3 text-xs font-black text-white shadow-lg shadow-emerald-500/25 transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/40 sm:w-auto sm:px-5 sm:text-sm"
            >
              <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition duration-700 group-hover:translate-x-full" />

              <span className="relative">Book Appointment</span>
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-black text-white sm:mb-5 sm:text-lg">
              Quick Links
            </h3>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-emerald-50/70 sm:block sm:space-y-3 sm:text-sm">
              {quickLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center gap-2 transition duration-300 hover:translate-x-1 hover:text-emerald-300"
                >
                  <span className="text-emerald-400 transition group-hover:translate-x-1">
                    →
                  </span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Important Links */}
          <div>
            <h3 className="mb-4 text-base font-black text-white sm:mb-5 sm:text-lg">
              Important
            </h3>

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-xs text-emerald-50/70 sm:block sm:space-y-3 sm:text-sm">
              {importantLinks.map(([label, href]) => (
                <Link
                  key={label}
                  href={href}
                  className="group flex items-center gap-2 transition duration-300 hover:translate-x-1 hover:text-teal-300"
                >
                  <span className="text-teal-400 transition group-hover:translate-x-1">
                    →
                  </span>
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          {/* Location Map */}
{/* Location */}
<div className="sm:col-span-2 lg:col-span-1">
  <h3 className="mb-5 text-base font-black text-white sm:text-lg">
    Our Location
  </h3>

  <div className="overflow-hidden rounded-3xl border border-emerald-300/15 bg-white/10 shadow-2xl backdrop-blur-xl">
    <iframe
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3575.075742231129!2d92.66178037542038!3d26.35641207698306!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x374526d8b01a1a4b%3A0x2fe9bed2ea86b3c2!2sDew%20Care%20Hospital%20%26%20Research%20Centre!5e0!3m2!1sen!2sin!4v1784566685107!5m2!1sen!2sin"
      className="h-[180px] w-full sm:h-[220px] lg:h-[250px]"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="strict-origin-when-cross-origin"
    />
  </div>

  {/* <div className="mt-4 rounded-2xl border border-emerald-300/15 bg-white/10 p-4 backdrop-blur-xl">
    <h4 className="text-base font-bold text-emerald-200">
      Dew Care Hospital & Research Centre
    </h4>

    <p className="mt-2 text-sm leading-6 text-emerald-50/75">
      {siteInfo.address}
    </p>

    <a
      href="https://maps.google.com/?q=Dew+Care+Hospital+Research+Centre+Nagaon"
      target="_blank"
      rel="noopener noreferrer"
      className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-5 py-2.5 text-sm font-bold text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
    >
      📍 Open in Google Maps
    </a>
  </div> */}
</div>
        </div>
      </div>

      {/* Bottom */}
      <div className="relative border-t border-emerald-300/15 bg-black/10 px-4 py-4 text-center sm:py-5">
        <p className="text-[10px] leading-5 text-emerald-50/65 sm:text-xs md:text-sm">
          © {currentYear} Dew Care Hospital. All Rights Reserved.
        </p>

        <p className="mt-1 text-[10px] font-semibold leading-5 text-emerald-200/80 sm:mt-2 sm:text-xs">
          Powered by{" "}
          <span className="font-black text-emerald-300">
            Rayyan Infotech
          </span>{" "}
          –{" "}
          <a
            href="tel:9058596626"
            className="font-black text-teal-300 transition hover:text-white"
          >
            7002806581
          </a>
        </p>
      </div>
    </footer>
  );
}