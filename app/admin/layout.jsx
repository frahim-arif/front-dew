"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";


const menuItems = [
  { name: "Dashboard", href: "/admin/dashboard", icon: "📊" },
  { name: "Appointments", href: "/admin/appointments", icon: "📅" },
  { name: "Doctors", href: "/admin/doctors", icon: "👨‍⚕️" },
  { name: "Facilities", href: "/admin/facilities", icon: "🏥" },
  { name: "Gallery", href: "/admin/gallery", icon: "🖼️" },
  { name: "Services", href: "/admin/services", icon: "🩺" },

  {
    name: "Training",
    icon: "🎓",
    children: [
      {
        name: "Courses",
        href: "/admin/training/courses",
        icon: "📚",
      },
      {
        name: "Applications",
        href: "/admin/training/applications",
        icon: "📝",
      },
      {
        name: "Course Files",
        href: "/admin/training/files",
        icon: "📄",
      },
      {
        name: "Course Videos",
        href: "/admin/training/videos",
        icon: "🎥",
      },
    ],
  },

  { name: "Settings", href: "/admin/settings", icon: "⚙️" },
];

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

  const Sidebar = () => (
    <aside className="h-full w-72 bg-sky-950 text-white flex flex-col">
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-extrabold">Dew Care</h1>
        <p className="text-sm text-cyan-200">Hospital Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
     {menuItems.map((item) => {

  if (item.children) {
    return (
      <div key={item.name}>
        <button
          onClick={() => setTrainingOpen(!trainingOpen)}
          className="flex w-full items-center justify-between rounded-xl px-4 py-3 font-semibold hover:bg-white/10"
        >
          <span>
            <span className="mr-2">{item.icon}</span>
            {item.name}
          </span>

          <span>
            {trainingOpen ? "▲" : "▼"}
          </span>
        </button>

        {trainingOpen && (
          <div className="ml-6 mt-2 space-y-1">
            {item.children.map((child) => {
              const active = pathname === child.href;

              return (
                <Link
                  key={child.href}
                  href={child.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-cyan-500 text-white"
                      : "hover:bg-white/10"
                  }`}
                >
                  <span className="mr-2">{child.icon}</span>
                  {child.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const active = pathname === item.href;

  return (
    <Link
      key={item.href}
      href={item.href}
      onClick={() => setOpen(false)}
      className={`block rounded-xl px-4 py-3 font-semibold transition ${
        active
          ? "bg-cyan-500 text-white"
          : "hover:bg-white/10"
      }`}
    >
      <span className="mr-2">{item.icon}</span>
      {item.name}
    </Link>
  );
})}
      </nav>

      <div className="p-4">
        <button
          onClick={logout}
          className="w-full rounded-xl bg-red-500 px-4 py-3 font-bold text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="flex">
        <div className="hidden md:block fixed left-0 top-0 h-screen">
          <Sidebar />
        </div>

        {open && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-black/50"
            />
            <div className="relative h-full">
              <Sidebar />
            </div>
          </div>
        )}

        <section className="flex-1 md:ml-72 min-h-screen">
          <header className="sticky top-0 z-40 bg-white border-b shadow-sm px-4 md:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setOpen(true)}
                className="md:hidden rounded-xl border px-3 py-2 font-bold text-sky-900"
              >
                ☰
              </button>

              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-sky-950">
                  Admin Panel
                </h2>
                <p className="text-sm text-gray-500">
                  Welcome, {admin?.name || "Admin"}
                </p>
              </div>
            </div>

            <button
              onClick={logout}
              className="rounded-xl bg-red-500 px-4 py-2 text-white font-bold"
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