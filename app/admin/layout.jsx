"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/* ---------- Icons (inline SVG, koi extra package nahi chahiye) ---------- */
const ICONS = {
  dashboard: (<><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /></>),
  appointments: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
  doctors: (<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
  facilities: (<><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" /><path d="M12 8v4M10 10h4" /></>),
  gallery: (<><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" /></>),
  services: (<path d="M22 12h-4l-3 9L9 3l-3 9H2" />),
  reports: (<path d="M18 20V10M12 20V4M6 20v-6" />),
  upload: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M12 18v-6M9 15l3-3 3 3" /></>),
  training: (<><path d="M22 10 12 5 2 10l10 5 10-5z" /><path d="M6 12v5c3 3 9 3 12 0v-5" /></>),
  courses: (<><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" /></>),
  applications: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8" /></>),
  files: (<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />),
  videos: (<><circle cx="12" cy="12" r="10" /><path d="m10 8 6 4-6 4z" /></>),
  settings: (<path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />),
  logout: (<><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></>),
  chevron: (<path d="m6 9 6 6 6-6" />),
  close: (<path d="M18 6 6 18M6 6l12 12" />),
};

function Icon({ name, className = "h-[18px] w-[18px]" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICONS[name]}
    </svg>
  );
}

/* ---------- Menu ---------- */
const menuGroups = [
  {
    label: "Overview",
    items: [{ name: "Dashboard", href: "/admin/dashboard", icon: "dashboard" }],
  },
  {
    label: "Hospital",
    items: [
      { name: "Appointments", href: "/admin/appointments", icon: "appointments" },
      { name: "Doctors", href: "/admin/doctors", icon: "doctors" },
      { name: "Facilities", href: "/admin/facilities", icon: "facilities" },
      { name: "Services", href: "/admin/services", icon: "services" },
      { name: "Gallery", href: "/admin/gallery", icon: "gallery" },
    ],
  },
  {
    label: "Reports",
    items: [
      { name: "Doctor Reports", href: "/admin/reports", icon: "reports" },
      { name: "Upload Report", href: "/admin/report-upload", icon: "upload" },
    ],
  },
  {
    label: "Learning",
    items: [
      {
        name: "Training",
        icon: "training",
        children: [
          { name: "Courses", href: "/admin/training/courses", icon: "courses" },
          { name: "Applications", href: "/admin/training/applications", icon: "applications" },
          { name: "Course Files", href: "/admin/training/files", icon: "files" },
          { name: "Course Videos", href: "/admin/training/videos", icon: "videos" },
        ],
      },
    ],
  },
  {
    label: "System",
    items: [{ name: "Settings", href: "/admin/settings", icon: "settings" }],
  },
];

/* ---------- Sidebar (component ke bahar, taaki har render pe remount na ho) ---------- */
function Sidebar({ pathname, admin, trainingOpen, setTrainingOpen, onNavigate, onClose, logout }) {
  const initial = (admin?.name || "A").trim().charAt(0).toUpperCase();

  return (
    <aside
      className="relative flex h-full w-72 flex-col overflow-hidden text-white"
      style={{
        background:
          "radial-gradient(120% 60% at 0% 0%, rgba(127,240,212,0.16) 0%, rgba(127,240,212,0) 55%), linear-gradient(180deg, #06303a 0%, #04222a 55%, #031a20 100%)",
      }}
    >
      {/* Brand */}
      <div className="flex items-center justify-between px-6 pb-5 pt-6">
        <div className="flex items-center gap-3">
          <div className="relative flex h-11 w-11 items-center justify-center rounded-[14px_14px_14px_4px] bg-gradient-to-br from-[#9ff7e1] to-[#2dd4bf] text-[#04222a] shadow-[0_8px_24px_-6px_rgba(45,212,191,0.7)]">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden="true">
              <path d="M12 2.5c3.6 4.2 6.5 7.4 6.5 11a6.5 6.5 0 0 1-13 0c0-3.6 2.9-6.8 6.5-11z" opacity="0.28" />
              <path d="M10.5 9h3v2.5H16v3h-2.5V17h-3v-2.5H8v-3h2.5z" />
            </svg>
          </div>
          <div className="leading-tight">
            <h1 className="text-xl font-extrabold tracking-tight">Dew Care</h1>
            <p className="text-xs text-[#9ff7e1]/80">Hospital Admin Panel</p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 hover:text-white md:hidden"
          aria-label="Close menu"
        >
          <Icon name="close" />
        </button>
      </div>

      <div className="mx-6 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

      {/* Nav */}
      <nav
        className="flex-1 space-y-5 overflow-y-auto px-4 py-5 [scrollbar-width:thin] [scrollbar-color:rgba(255,255,255,0.15)_transparent]"
        aria-label="Admin navigation"
      >
        {menuGroups.map((group) => (
          <div key={group.label}>
            <p className="mb-2 px-3 text-xs font-medium text-white/40">{group.label}</p>

            <div className="space-y-1">
              {group.items.map((item) => {
                /* ---- Dropdown item ---- */
                if (item.children) {
                  const childActive = item.children.some((c) => pathname === c.href);

                  return (
                    <div key={item.name}>
                      <button
                        onClick={() => setTrainingOpen(!trainingOpen)}
                        aria-expanded={trainingOpen}
                        className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ff0d4]/70 ${
                          childActive ? "text-white" : "text-white/75 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                            childActive
                              ? "bg-[#7ff0d4] text-[#04222a]"
                              : "bg-white/[0.07] text-[#9ff7e1] group-hover:bg-white/[0.12]"
                          }`}
                        >
                          <Icon name={item.icon} />
                        </span>
                        <span className="flex-1">{item.name}</span>
                        <Icon
                          name="chevron"
                          className={`h-4 w-4 text-white/50 transition-transform duration-300 ${
                            trainingOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {/* smooth expand/collapse */}
                      <div
                        className={`grid transition-all duration-300 ease-out ${
                          trainingOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <div className="relative ml-[27px] mt-1 space-y-0.5 border-l border-white/10 pl-4">
                            {item.children.map((child) => {
                              const active = pathname === child.href;
                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  onClick={onNavigate}
                                  className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ff0d4]/70 ${
                                    active
                                      ? "bg-[#7ff0d4]/15 font-semibold text-[#9ff7e1]"
                                      : "text-white/65 hover:bg-white/[0.06] hover:text-white"
                                  }`}
                                >
                                  <Icon name={child.icon} className="h-4 w-4" />
                                  {child.name}
                                  {active && (
                                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#7ff0d4] shadow-[0_0_8px_2px_rgba(127,240,212,0.7)]" />
                                  )}
                                </Link>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                /* ---- Normal link ---- */
                const active = pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ff0d4]/70 ${
                      active
                        ? "bg-gradient-to-r from-[#7ff0d4]/20 to-[#7ff0d4]/0 text-white"
                        : "text-white/75 hover:bg-white/[0.06] hover:text-white"
                    }`}
                  >
                    {/* glowing active bar */}
                    {active && (
                      <span className="absolute -left-4 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#7ff0d4] shadow-[0_0_14px_3px_rgba(127,240,212,0.6)]" />
                    )}

                    <span
                      className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
                        active
                          ? "bg-[#7ff0d4] text-[#04222a] shadow-[0_6px_16px_-4px_rgba(127,240,212,0.7)]"
                          : "bg-white/[0.07] text-[#9ff7e1] group-hover:bg-white/[0.12]"
                      }`}
                    >
                      <Icon name={item.icon} />
                    </span>

                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile + Logout */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 rounded-2xl bg-white/[0.06] p-3 ring-1 ring-white/10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9ff7e1] to-[#2dd4bf] text-base font-extrabold text-[#04222a]">
            {initial}
          </div>

          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-sm font-semibold">{admin?.name || "Admin"}</p>
            <p className="truncate text-xs text-white/50">{admin?.email || "Administrator"}</p>
          </div>

          <button
            onClick={logout}
            title="Logout"
            aria-label="Logout"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-red-300 transition-colors hover:bg-red-500 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
          >
            <Icon name="logout" />
          </button>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Layout ---------- */
export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [trainingOpen, setTrainingOpen] = useState(true);

  useEffect(() => {
    if (pathname === "/admin/login") return;

    const token = localStorage.getItem("token");
    const adminData = localStorage.getItem("admin");

    if (!token) {
      router.push("/admin/login");
      return;
    }

    if (adminData) setAdmin(JSON.parse(adminData));
  }, [pathname, router]);

  if (pathname === "/admin/login") {
    return children;
  }

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    router.push("/admin/login");
  };

  const sidebarProps = {
    pathname,
    admin,
    trainingOpen,
    setTrainingOpen,
    onNavigate: () => setOpen(false),
    onClose: () => setOpen(false),
    logout,
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex">
        <div className="fixed left-0 top-0 hidden h-screen md:block">
          <Sidebar {...sidebarProps} />
        </div>

        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            />
            <div className="relative h-full w-72 shadow-2xl">
              <Sidebar {...sidebarProps} />
            </div>
          </div>
        )}

        <section className="min-h-screen flex-1 md:ml-72">
          <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-4 py-4 shadow-sm md:px-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="rounded-xl border px-3 py-2 font-bold text-sky-900 md:hidden"
                aria-label="Open menu"
              >
                ☰
              </button>

              <div>
                <h2 className="text-xl font-extrabold text-sky-950 md:text-2xl">
                  Admin Panel
                </h2>
                <p className="text-sm text-gray-500">
                  Welcome, {admin?.name || "Admin"}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white"
            >
              Logout
            </button>
          </header>

          <div className="p-4 md:p-8">{children}</div>
        </section>
      </div>
    </main>
  );
}