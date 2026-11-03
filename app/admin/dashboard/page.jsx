"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

/* =========================================================
   DESIGN TOKENS
   ink   #0F2B2E  deep teal-black (hero, headings)
   dew   #5FD3C2  bright accent (only on the dark hero)
   teal  #1F8F83  accent on light surfaces
   mist  #EEF6F3  soft surface
   line  #DCE8E4  borders
========================================================= */

const STATUS_COLORS = {
  Pending: "#E0A526",
  Confirmed: "#2FA597",
  Completed: "#3B82C4",
  Cancelled: "#E8664A",
};

const STATUS_PILL = {
  Pending: "bg-[#FBF0D4] text-[#8A5F00]",
  Confirmed: "bg-[#D9F1EC] text-[#0F6B60]",
  Completed: "bg-[#DCEAF7] text-[#1F5E99]",
  Cancelled: "bg-[#FBE0D9] text-[#A8402A]",
};

const CARD = "rounded-2xl border border-[#DCE8E4] bg-white";

/* =========================================================
   SMALL HELPERS
========================================================= */

const pad = (n) => String(n).padStart(2, "0");

// Local-time date key (YYYY-MM-DD). Avoids the UTC shift that
// toISOString() causes for users in India (IST = UTC+5:30).
const toLocalKey = (d) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

const normalizeDate = (date) => {
  if (!date) return "";

  if (typeof date === "string" && /^\d{4}-\d{2}-\d{2}/.test(date)) {
    return date.slice(0, 10);
  }

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return String(date);

  return toLocalKey(parsed);
};

const formatDate = (date) => {
  if (!date) return "N/A";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatTime = (date) => {
  if (!date) return "";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "";

  return parsed.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const initials = (name) =>
  String(name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

const getDoctorName = (prescription) =>
  typeof prescription.doctor === "object"
    ? prescription.doctor?.name || "N/A"
    : prescription.doctor || prescription.appointment?.doctor || "N/A";

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
};

/* =========================================================
   ICONS
========================================================= */

const ICON_PATHS = {
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M3 10h18M8 3v4M16 3v4" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6" />
      <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.3c2.2.7 3.5 2.6 3.5 5.7" />
    </>
  ),
  pulse: <path d="M3 12h4l2-6 4 12 2-6h6" />,
  grid: (
    <>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </>
  ),
  file: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4M9 13h6M9 17h6" />
    </>
  ),
  chart: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  refresh: (
    <>
      <path d="M20 11a8 8 0 0 0-14.5-4.5L4 8" />
      <path d="M4 4v4h4" />
      <path d="M4 13a8 8 0 0 0 14.5 4.5L20 16" />
      <path d="M20 20v-4h-4" />
    </>
  ),
};

function Icon({ name, className = "h-5 w-5" }) {
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
      {ICON_PATHS[name]}
    </svg>
  );
}

/* =========================================================
   REUSABLE PIECES
========================================================= */

function SectionHead({ title, sub, right }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="dc-display text-xl font-bold text-[#0F2B2E]">
          {title}
        </h2>
        {sub && <p className="mt-0.5 text-sm text-slate-500">{sub}</p>}
      </div>
      {right}
    </div>
  );
}

function StatusPill({ status }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        STATUS_PILL[status] || "bg-slate-100 text-slate-600"
      }`}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: STATUS_COLORS[status] || "#94A3B8" }}
      />
      {status || "Unknown"}
    </span>
  );
}

function Avatar({ name, tone = "#1F8F83" }) {
  return (
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
      style={{ background: tone }}
    >
      {initials(name)}
    </div>
  );
}

function RankList({ items, max, color, emptyText }) {
  if (items.length === 0) {
    return (
      <div className="mt-5 rounded-xl bg-[#EEF6F3] p-6 text-center text-sm text-slate-500">
        {emptyText}
      </div>
    );
  }

  return (
    <ol className="mt-5 space-y-4">
      {items.map((item, index) => (
        <li key={item.name}>
          <div className="mb-1.5 flex items-center justify-between gap-3 text-sm">
            <span className="truncate font-semibold text-[#0F2B2E]">
              {item.name}
            </span>
            <span className="font-bold tabular-nums text-slate-600">
              {item.count}
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#EEF6F3]">
            <div
              className="h-full rounded-full"
              style={{
                width: `${(item.count / max) * 100}%`,
                background: color,
                opacity: 1 - index * 0.12,
              }}
            />
          </div>
        </li>
      ))}
    </ol>
  );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [failedSources, setFailedSources] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [statusFilter, setStatusFilter] = useState("All");

  /* =========================================================
     FETCH DASHBOARD DATA
  ========================================================= */

  const fetchDashboardData = async (showRefresh = false) => {
    const failed = [];

    const readList = async (result, label, setter) => {
      if (result.status !== "fulfilled") {
        console.error(`${label} request failed:`, result.reason);
        failed.push(label);
        return;
      }

      try {
        const response = result.value;
        const data = await response.json();

        if (response.ok && data.success) {
          setter(data.data || []);
        } else {
          console.error(`${label} API error:`, data);
          failed.push(label);
        }
      } catch (error) {
        console.error(`${label} parse error:`, error);
        failed.push(label);
      }
    };

    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [appointmentsRes, doctorsRes, servicesRes, prescriptionsRes] =
        await Promise.allSettled([
          fetch(`${API_URL}/appointments`),
          fetch(`${API_URL}/doctors`),
          fetch(`${API_URL}/services`),
          fetch(`${API_URL}/prescriptions`),
        ]);

      await Promise.all([
        readList(appointmentsRes, "Appointments", setAppointments),
        readList(doctorsRes, "Doctors", setDoctors),
        readList(servicesRes, "Services", setServices),
        readList(prescriptionsRes, "Prescriptions", setPrescriptions),
      ]);

      setLastUpdated(new Date());
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setFailedSources(failed);
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    const today = toLocalKey(new Date());
    const currentMonth = today.slice(0, 7);

    const uniquePhones = new Set(
      appointments.map((item) => item.phone?.trim()).filter(Boolean)
    );

    const count = (status) =>
      appointments.filter((item) => item.status === status).length;

    return {
      totalAppointments: appointments.length,
      todayAppointments: appointments.filter(
        (item) => normalizeDate(item.date) === today
      ).length,
      thisMonthAppointments: appointments.filter((item) =>
        normalizeDate(item.date).startsWith(currentMonth)
      ).length,
      pending: count("Pending"),
      confirmed: count("Confirmed"),
      completed: count("Completed"),
      cancelled: count("Cancelled"),
      totalDoctors: doctors.length,
      activeDoctors: doctors.filter((doctor) => doctor.status === "Active")
        .length,
      totalServices: services.length,
      totalPrescriptions: prescriptions.length,
      uniquePatients: uniquePhones.size,
    };
  }, [appointments, doctors, services, prescriptions]);

  /* =========================================================
     WEEKLY DATA
  ========================================================= */

  const weeklyData = useMemo(() => {
    const result = [];

    for (let index = 6; index >= 0; index -= 1) {
      const currentDate = new Date();
      currentDate.setHours(0, 0, 0, 0);
      currentDate.setDate(currentDate.getDate() - index);

      const dateKey = toLocalKey(currentDate);

      result.push({
        date: dateKey,
        day: currentDate.toLocaleDateString("en-US", { weekday: "short" }),
        count: appointments.filter(
          (item) => normalizeDate(item.date) === dateKey
        ).length,
      });
    }

    return result;
  }, [appointments]);

  const weeklyMaximum = useMemo(
    () => Math.max(...weeklyData.map((item) => item.count), 1),
    [weeklyData]
  );

  const weeklyTotal = useMemo(
    () => weeklyData.reduce((sum, item) => sum + item.count, 0),
    [weeklyData]
  );

  /* =========================================================
     DOCTOR + DEPARTMENT ANALYTICS
  ========================================================= */

  const rankBy = (field, fallback, limit) => {
    const counts = {};

    appointments.forEach((appointment) => {
      const key = appointment[field] || fallback;
      counts[key] = (counts[key] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  };

  const doctorAnalytics = useMemo(
    () => rankBy("doctor", "Not Assigned", 5),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appointments]
  );

  const departmentAnalytics = useMemo(
    () => rankBy("department", "Other", 6),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [appointments]
  );

  const maximumDoctorCount = Math.max(
    ...doctorAnalytics.map((item) => item.count),
    1
  );
  const maximumDepartmentCount = Math.max(
    ...departmentAnalytics.map((item) => item.count),
    1
  );

  /* =========================================================
     LISTS
  ========================================================= */

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort((first, second) => {
        const a = new Date(first.createdAt || first.date || 0).getTime();
        const b = new Date(second.createdAt || second.date || 0).getTime();
        return b - a;
      }),
    [appointments]
  );

  const recentAppointments = useMemo(
    () =>
      sortedAppointments
        .filter(
          (item) => statusFilter === "All" || item.status === statusFilter
        )
        .slice(0, 10),
    [sortedAppointments, statusFilter]
  );

  const todayAppointments = useMemo(() => {
    const today = toLocalKey(new Date());

    return appointments
      .filter((item) => normalizeDate(item.date) === today)
      .sort((first, second) =>
        String(first.createdAt || "").localeCompare(
          String(second.createdAt || "")
        )
      )
      .slice(0, 8);
  }, [appointments]);

  const recentPrescriptions = useMemo(
    () =>
      [...prescriptions]
        .sort((first, second) => {
          const a = new Date(first.createdAt || 0).getTime();
          const b = new Date(second.createdAt || 0).getTime();
          return b - a;
        })
        .slice(0, 8),
    [prescriptions]
  );

  const getPrescriptionUrl = (file) => {
    if (!file) return "#";
    if (file.startsWith("http://") || file.startsWith("https://")) return file;
    return `${BACKEND_URL}${file.startsWith("/") ? "" : "/"}${file}`;
  };

  /* =========================================================
     STATUS DONUT
  ========================================================= */

  const statusSegments = [
    { label: "Pending", value: stats.pending },
    { label: "Confirmed", value: stats.confirmed },
    { label: "Completed", value: stats.completed },
    { label: "Cancelled", value: stats.cancelled },
  ];

  const statusTotal = statusSegments.reduce((sum, s) => sum + s.value, 0);
  const DONUT_R = 54;
  const DONUT_C = 2 * Math.PI * DONUT_R;

  let donutOffset = 0;
  const donutArcs = statusSegments.map((segment) => {
    const full = statusTotal ? (segment.value / statusTotal) * DONUT_C : 0;
    const visible = segment.value && statusSegments.filter((s) => s.value).length > 1
      ? Math.max(full - 3, 0)
      : full;
    const arc = { ...segment, visible, offset: donutOffset };
    donutOffset += full;
    return arc;
  });

  /* =========================================================
     KPI + QUICK ACTIONS
  ========================================================= */

  const kpis = [
    {
      label: "Appointments",
      value: stats.totalAppointments,
      note: `${stats.thisMonthAppointments} this month`,
      icon: "calendar",
    },
    {
      label: "Unique patients",
      value: stats.uniquePatients,
      note: "counted by phone",
      icon: "users",
    },
    {
      label: "Active doctors",
      value: stats.activeDoctors,
      note: `of ${stats.totalDoctors} on staff`,
      icon: "pulse",
    },
    {
      label: "Services",
      value: stats.totalServices,
      note: "currently listed",
      icon: "grid",
    },
    {
      label: "Prescriptions",
      value: stats.totalPrescriptions,
      note: "uploaded files",
      icon: "file",
    },
    {
      label: "Last 7 days",
      value: weeklyTotal,
      note: "appointments booked",
      icon: "chart",
    },
  ];

  const quickActions = [
    {
      title: "Manage appointments",
      href: "/admin/appointments",
      desc: "View and update bookings",
      color: "#1F8F83",
    },
    {
      title: "Add doctor",
      href: "/admin/doctors",
      desc: "Manage hospital doctors",
      color: "#3B82C4",
    },
    {
      title: "Manage services",
      href: "/admin/services",
      desc: "Add and update services",
      color: "#7C5CC4",
    },
    {
      title: "Doctor reports",
      href: "/admin/reports",
      desc: "Patients and collection by doctor",
      color: "#E0A526",
    },
    {
      title: "Prescriptions",
      href: "/admin/appointments",
      desc: "Upload patient prescriptions",
      color: "#E8664A",
    },
    {
      title: "Hospital settings",
      href: "/admin/settings",
      desc: "Update hospital details",
      color: "#475569",
    },
  ];

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="dc-root space-y-6" aria-busy="true">
        <DashboardStyles />
        <div className="h-72 animate-pulse rounded-3xl bg-[#0F2B2E]/90" />
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-2xl bg-[#EEF6F3]" />
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-2xl bg-[#EEF6F3]" />
        <p className="text-center text-sm font-medium text-slate-500">
          Loading dashboard…
        </p>
      </div>
    );
  }

  /* =========================================================
     RENDER
  ========================================================= */

  const chartW = 420;
  const baseline = 118;
  const step = chartW / 7;
  const barW = 34;

  return (
    <div className="dc-root space-y-8">
      <DashboardStyles />

      {/* ================= ERROR BANNER ================= */}

      {failedSources.length > 0 && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-2xl border border-[#F3C9BE] bg-[#FDF0EC] p-4 text-sm text-[#8F3722] sm:flex-row sm:items-center sm:justify-between"
        >
          <p>
            <span className="font-bold">Some data didn't load:</span>{" "}
            {failedSources.join(", ")}. The rest of the dashboard is up to date.
          </p>
          <button
            onClick={() => fetchDashboardData(true)}
            className="rounded-lg bg-white px-4 py-2 font-semibold text-[#8F3722] ring-1 ring-[#F3C9BE] transition hover:bg-[#FBE0D9]"
          >
            Try again
          </button>
        </div>
      )}

      {/* ================= HERO ================= */}

      <section className="relative overflow-hidden rounded-3xl bg-[#0F2B2E] p-6 text-white sm:p-8 lg:p-10">
        {/* dew ripples */}
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border border-[#5FD3C2]/15"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-68 w-68 rounded-full border border-[#5FD3C2]/20"
          style={{ height: "17rem", width: "17rem" }}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-[#5FD3C2]/10 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative grid gap-10 lg:grid-cols-5 lg:items-center">
          {/* Left */}
          <div className="lg:col-span-2">
            <p className="text-sm font-medium text-[#5FD3C2]">
              Dew Care Hospital admin
            </p>

            <h1 className="dc-display mt-2 text-3xl font-extrabold leading-tight sm:text-4xl">
              {getGreeting()}, team
            </h1>

            <p className="mt-1 text-sm text-white/60">
              {new Date().toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <div className="mt-8 flex items-end gap-4">
              <span className="dc-display text-8xl font-extrabold leading-none tabular-nums text-white sm:text-9xl">
                {stats.todayAppointments}
              </span>
              <span className="pb-3 text-base font-medium leading-snug text-white/70">
                appointments
                <br />
                today
              </span>
            </div>

            <p className="mt-4 text-sm text-white/70">
              {stats.pending > 0
                ? `${stats.pending} ${
                    stats.pending === 1 ? "booking is" : "bookings are"
                  } waiting for confirmation.`
                : "No bookings are waiting for confirmation."}
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => fetchDashboardData(true)}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl bg-[#5FD3C2] px-5 py-2.5 text-sm font-bold text-[#0F2B2E] transition hover:bg-[#7BE0D1] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Icon
                  name="refresh"
                  className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
                />
                {refreshing ? "Refreshing…" : "Refresh dashboard"}
              </button>

              <Link
                href="/admin/appointments"
                className="rounded-xl px-5 py-2.5 text-sm font-semibold text-white ring-1 ring-white/25 transition hover:bg-white/10"
              >
                Open appointments
              </Link>
            </div>

            {lastUpdated && (
              <p className="mt-4 text-xs text-white/45">
                Updated at {formatTime(lastUpdated)}
              </p>
            )}
          </div>

          {/* Right: weekly chart */}
          <div className="lg:col-span-3">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="dc-display text-lg font-bold">
                Last 7 days
              </h2>
              <p className="text-sm text-white/60">
                {weeklyTotal} booked this week, {stats.thisMonthAppointments} this month
              </p>
            </div>

            <svg
              viewBox={`0 0 ${chartW} 146`}
              className="w-full"
              role="img"
              aria-label={`Appointments per day for the last 7 days: ${weeklyData
                .map((d) => `${d.day} ${d.count}`)
                .join(", ")}`}
            >
              <line
                x1="0"
                x2={chartW}
                y1={baseline}
                y2={baseline}
                stroke="white"
                strokeOpacity="0.18"
              />
              <line
                x1="0"
                x2={chartW}
                y1={baseline - 52}
                y2={baseline - 52}
                stroke="white"
                strokeOpacity="0.07"
                strokeDasharray="3 5"
              />

              {weeklyData.map((item, index) => {
                const height =
                  item.count === 0 ? 4 : (item.count / weeklyMaximum) * 96 + 6;
                const x = index * step + (step - barW) / 2;
                const isToday = index === weeklyData.length - 1;

                return (
                  <g key={item.date}>
                    <title>{`${item.day}: ${item.count} appointments`}</title>
                    <rect
                      className="dc-bar"
                      x={x}
                      y={baseline - height}
                      width={barW}
                      height={height}
                      rx="7"
                      fill={isToday ? "#5FD3C2" : "white"}
                      fillOpacity={isToday ? 1 : 0.22}
                      style={{ animationDelay: `${index * 60}ms` }}
                    />
                    <text
                      x={x + barW / 2}
                      y={baseline - height - 7}
                      textAnchor="middle"
                      fontSize="12"
                      fontWeight="700"
                      fill={isToday ? "#5FD3C2" : "white"}
                    >
                      {item.count}
                    </text>
                    <text
                      x={x + barW / 2}
                      y="138"
                      textAnchor="middle"
                      fontSize="11"
                      fill="white"
                      fillOpacity={isToday ? 0.95 : 0.55}
                      fontWeight={isToday ? 700 : 500}
                    >
                      {isToday ? "Today" : item.day}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      </section>

      {/* ================= KPI STRIP ================= */}

      <section
        className={`${CARD} grid grid-cols-2 divide-[#DCE8E4] md:grid-cols-3 xl:grid-cols-6 xl:divide-x`}
      >
        {kpis.map((kpi, index) => (
          <div
            key={kpi.label}
            className={`p-5 ${
              index % 2 === 0 ? "" : "border-l border-[#DCE8E4] md:border-l-0"
            } ${index >= 2 ? "border-t border-[#DCE8E4] xl:border-t-0" : ""} ${
              index >= 3 ? "md:border-t" : "md:border-t-0"
            } ${index % 3 !== 0 ? "md:border-l md:border-[#DCE8E4]" : ""} xl:border-t-0 ${
              index === 0 ? "xl:border-l-0" : ""
            }`}
          >
            <div className="flex items-center gap-2 text-[#1F8F83]">
              <Icon name={kpi.icon} className="h-[18px] w-[18px]" />
              <span className="text-sm font-semibold text-slate-600">
                {kpi.label}
              </span>
            </div>

            <p className="dc-display mt-3 text-4xl font-extrabold tabular-nums text-[#0F2B2E]">
              {kpi.value}
            </p>

            <p className="mt-1 text-xs text-slate-500">{kpi.note}</p>
          </div>
        ))}
      </section>

      {/* ================= SCHEDULE + STATUS ================= */}

      <section className="grid gap-6 xl:grid-cols-3">
        {/* Today's schedule */}
        <div className={`${CARD} p-6 xl:col-span-2`}>
          <SectionHead
            title="Today's schedule"
            sub="Patients booked for today"
            right={
              <span className="w-fit rounded-full bg-[#EEF6F3] px-3 py-1 text-sm font-bold text-[#0F6B60]">
                {todayAppointments.length}{" "}
                {todayAppointments.length === 1 ? "appointment" : "appointments"}
              </span>
            }
          />

          {todayAppointments.length === 0 ? (
            <div className="mt-6 rounded-xl bg-[#EEF6F3] p-8 text-center">
              <p className="font-semibold text-[#0F2B2E]">
                No appointments today
              </p>
              <p className="mt-1 text-sm text-slate-500">
                New bookings for today will show up here.
              </p>
            </div>
          ) : (
            <ul className="mt-5 divide-y divide-[#E6EFEC]">
              {todayAppointments.map((item) => (
                <li
                  key={item._id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5"
                >
                  <Avatar
                    name={item.name}
                    tone={STATUS_COLORS[item.status] || "#1F8F83"}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-[#0F2B2E]">
                      {item.name}
                    </p>
                    <p className="truncate text-sm text-slate-500">
                      {item.phone}
                    </p>
                  </div>

                  <div className="hidden min-w-0 flex-1 text-sm sm:block">
                    <p className="truncate font-medium text-slate-700">
                      {item.doctor || "Not assigned"}
                    </p>
                    <p className="truncate text-slate-500">
                      {item.department || "N/A"}
                    </p>
                  </div>

                  <StatusPill status={item.status} />
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Status donut */}
        <div className={`${CARD} p-6`}>
          <SectionHead title="Booking status" sub="All appointments" />

          <div className="mt-6 flex justify-center">
            <svg
              viewBox="0 0 140 140"
              className="h-44 w-44"
              role="img"
              aria-label={`Status split: ${statusSegments
                .map((s) => `${s.label} ${s.value}`)
                .join(", ")}`}
            >
              <circle
                cx="70"
                cy="70"
                r={DONUT_R}
                fill="none"
                stroke="#EEF6F3"
                strokeWidth="14"
              />
              {donutArcs.map(
                (arc) =>
                  arc.value > 0 && (
                    <circle
                      key={arc.label}
                      cx="70"
                      cy="70"
                      r={DONUT_R}
                      fill="none"
                      stroke={STATUS_COLORS[arc.label]}
                      strokeWidth="14"
                      strokeDasharray={`${arc.visible} ${DONUT_C - arc.visible}`}
                      strokeDashoffset={-arc.offset}
                      transform="rotate(-90 70 70)"
                    />
                  )
              )}
              <text
                x="70"
                y="68"
                textAnchor="middle"
                fontSize="26"
                fontWeight="800"
                fill="#0F2B2E"
              >
                {statusTotal}
              </text>
              <text
                x="70"
                y="86"
                textAnchor="middle"
                fontSize="10"
                fill="#64748B"
              >
                total
              </text>
            </svg>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-3">
            {statusSegments.map((segment) => (
              <li
                key={segment.label}
                className="rounded-xl bg-[#F6FAF8] px-3 py-2.5"
              >
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: STATUS_COLORS[segment.label] }}
                  />
                  {segment.label}
                </div>
                <p className="dc-display mt-1 text-2xl font-extrabold tabular-nums text-[#0F2B2E]">
                  {segment.value}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= DOCTORS / DEPARTMENTS / ACTIONS ================= */}

      <section className="grid gap-6 lg:grid-cols-3">
        <div className={`${CARD} p-6`}>
          <SectionHead
            title="Top doctors"
            sub="Most appointments booked"
          />
          <RankList
            items={doctorAnalytics}
            max={maximumDoctorCount}
            color="#1F8F83"
            emptyText="No doctor data yet."
          />
        </div>

        <div className={`${CARD} p-6`}>
          <SectionHead
            title="Departments"
            sub="Appointments by department"
          />
          <RankList
            items={departmentAnalytics}
            max={maximumDepartmentCount}
            color="#3B82C4"
            emptyText="No department data yet."
          />
        </div>

        <div className={`${CARD} p-6`}>
          <SectionHead title="Quick actions" sub="Jump to a section" />

          <ul className="mt-4 divide-y divide-[#E6EFEC]">
            {quickActions.map((action) => (
              <li key={action.title}>
                <Link
                  href={action.href}
                  className="group flex items-center gap-3 py-3 transition"
                >
                  <span
                    className="h-9 w-1.5 shrink-0 rounded-full"
                    style={{ background: action.color }}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block font-bold text-[#0F2B2E] group-hover:text-[#1F8F83]">
                      {action.title}
                    </span>
                    <span className="block truncate text-xs text-slate-500">
                      {action.desc}
                    </span>
                  </span>
                  <Icon
                    name="chevron"
                    className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[#1F8F83]"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ================= PRESCRIPTIONS ================= */}

      <section className={`${CARD} overflow-hidden`}>
        <div className="flex flex-col gap-4 border-b border-[#DCE8E4] p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="dc-display text-xl font-bold text-[#0F2B2E]">
              Recent prescriptions
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              {stats.totalPrescriptions} uploaded in total
            </p>
          </div>

          <Link
            href="/admin/appointments"
            className="w-fit rounded-xl bg-[#0F2B2E] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#1B4348]"
          >
            Manage prescriptions
          </Link>
        </div>

        {recentPrescriptions.length === 0 ? (
          <div className="p-12 text-center">
            <p className="font-bold text-[#0F2B2E]">No prescriptions yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Upload one from an appointment and it will appear here.
            </p>
            <Link
              href="/admin/appointments"
              className="mt-5 inline-flex rounded-xl bg-[#1F8F83] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#187A70]"
            >
              Upload prescription
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[820px] text-left text-sm">
                <thead className="bg-[#F6FAF8] text-xs font-semibold text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Type</th>
                    <th className="px-4 py-3">Uploaded</th>
                    <th className="px-6 py-3 text-right">File</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E6EFEC]">
                  {recentPrescriptions.map((prescription) => {
                    const fileUrl = getPrescriptionUrl(prescription.file);
                    const isPdf =
                      String(prescription.fileType || "").toUpperCase() ===
                      "PDF";

                    return (
                      <tr
                        key={prescription._id}
                        className="transition hover:bg-[#F6FAF8]"
                      >
                        <td className="px-6 py-4">
                          <p className="font-bold text-[#0F2B2E]">
                            {prescription.patientName || "N/A"}
                          </p>
                          {prescription.appointment?.appointmentId && (
                            <p className="mt-0.5 text-xs text-slate-400">
                              Appointment #
                              {prescription.appointment.appointmentId}
                            </p>
                          )}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {prescription.phone || "N/A"}
                        </td>

                        <td className="px-4 py-4 text-slate-600">
                          {getDoctorName(prescription)}
                        </td>

                        <td className="px-4 py-4">
                          <span
                            className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                              isPdf
                                ? "bg-[#FBE0D9] text-[#A8402A]"
                                : "bg-[#DCEAF7] text-[#1F5E99]"
                            }`}
                          >
                            {isPdf ? "PDF" : "Image"}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <p className="font-medium text-slate-700">
                            {formatDate(prescription.createdAt)}
                          </p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {formatTime(prescription.createdAt)}
                          </p>
                        </td>

                        <td className="px-6 py-4 text-right">
                          {prescription.file ? (
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex rounded-lg bg-[#1F8F83] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#187A70]"
                            >
                              {isPdf ? "View PDF" : "View image"}
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">
                              File unavailable
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile list */}
            <ul className="divide-y divide-[#E6EFEC] md:hidden">
              {recentPrescriptions.map((prescription) => {
                const fileUrl = getPrescriptionUrl(prescription.file);
                const isPdf =
                  String(prescription.fileType || "").toUpperCase() === "PDF";

                return (
                  <li key={prescription._id} className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-[#0F2B2E]">
                          {prescription.patientName || "N/A"}
                        </p>
                        <p className="text-sm text-slate-500">
                          {prescription.phone || "No phone"}
                        </p>
                      </div>
                      <span
                        className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                          isPdf
                            ? "bg-[#FBE0D9] text-[#A8402A]"
                            : "bg-[#DCEAF7] text-[#1F5E99]"
                        }`}
                      >
                        {isPdf ? "PDF" : "Image"}
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-600">
                      {getDoctorName(prescription)}, uploaded{" "}
                      {formatDate(prescription.createdAt)}
                    </p>

                    {prescription.file ? (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 flex w-full justify-center rounded-xl bg-[#1F8F83] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#187A70]"
                      >
                        {isPdf ? "View prescription PDF" : "View prescription image"}
                      </a>
                    ) : (
                      <p className="mt-4 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm text-slate-400">
                        Prescription file unavailable
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </section>

      {/* ================= RECENT APPOINTMENTS ================= */}

      <section className={`${CARD} overflow-hidden`}>
        <div className="flex flex-col gap-4 border-b border-[#DCE8E4] p-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="dc-display text-xl font-bold text-[#0F2B2E]">
              Recent appointments
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Latest patient requests
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div
              className="flex flex-wrap gap-1.5"
              role="group"
              aria-label="Filter by status"
            >
              {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(
                (option) => (
                  <button
                    key={option}
                    onClick={() => setStatusFilter(option)}
                    aria-pressed={statusFilter === option}
                    className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                      statusFilter === option
                        ? "bg-[#0F2B2E] text-white"
                        : "bg-[#EEF6F3] text-slate-600 hover:bg-[#DDEDE7]"
                    }`}
                  >
                    {option}
                  </button>
                )
              )}
            </div>

            <Link
              href="/admin/appointments"
              className="w-fit rounded-xl bg-[#1F8F83] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#187A70]"
            >
              View all appointments
            </Link>
          </div>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-bold text-[#0F2B2E]">
              {statusFilter === "All"
                ? "No appointments found"
                : `No ${statusFilter.toLowerCase()} appointments`}
            </p>
            {statusFilter !== "All" && (
              <button
                onClick={() => setStatusFilter("All")}
                className="mt-3 text-sm font-semibold text-[#1F8F83] underline underline-offset-4"
              >
                Show all statuses
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop */}
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[780px] text-left text-sm">
                <thead className="bg-[#F6FAF8] text-xs font-semibold text-slate-500">
                  <tr>
                    <th className="px-6 py-3">Patient</th>
                    <th className="px-4 py-3">Phone</th>
                    <th className="px-4 py-3">Doctor</th>
                    <th className="px-4 py-3">Department</th>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#E6EFEC]">
                  {recentAppointments.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-[#F6FAF8]"
                    >
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={item.name}
                            tone={STATUS_COLORS[item.status] || "#1F8F83"}
                          />
                          <div className="min-w-0">
                            <p className="truncate font-bold text-[#0F2B2E]">
                              {item.name}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {item.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {item.phone}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {item.doctor || "Not assigned"}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {item.department || "N/A"}
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">
                        {formatDate(item.date)}
                      </td>
                      <td className="px-6 py-3.5">
                        <StatusPill status={item.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile */}
            <ul className="divide-y divide-[#E6EFEC] md:hidden">
              {recentAppointments.map((item) => (
                <li key={item._id} className="p-5">
                  <div className="flex items-start gap-3">
                    <Avatar
                      name={item.name}
                      tone={STATUS_COLORS[item.status] || "#1F8F83"}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-bold text-[#0F2B2E]">
                        {item.name}
                      </p>
                      <p className="text-sm text-slate-500">{item.phone}</p>
                    </div>
                    <StatusPill status={item.status} />
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    {item.doctor || "Not assigned"}, {item.department || "N/A"}
                  </p>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {formatDate(item.date)}
                  </p>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </div>
  );
}

/* =========================================================
   SCOPED STYLES (fonts, one-time bar entrance, focus rings)
========================================================= */

function DashboardStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Figtree:wght@400..700&display=swap');

      .dc-root { font-family: 'Figtree', system-ui, sans-serif; color: #1E293B; }
      .dc-display { font-family: 'Bricolage Grotesque', 'Figtree', system-ui, sans-serif; letter-spacing: -0.02em; }

      .dc-root a:focus-visible,
      .dc-root button:focus-visible {
        outline: 2px solid #1F8F83;
        outline-offset: 2px;
      }

      .dc-bar {
        transform-box: fill-box;
        transform-origin: bottom;
        animation: dc-grow 700ms cubic-bezier(.2,.8,.2,1) both;
      }

      @keyframes dc-grow {
        from { transform: scaleY(0); }
        to   { transform: scaleY(1); }
      }

      @media (prefers-reduced-motion: reduce) {
        .dc-bar { animation: none; }
      }
    `}</style>
  );
}