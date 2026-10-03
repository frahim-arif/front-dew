"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const BACKEND_URL = API_URL.replace(/\/api\/?$/, "");

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  /* =========================================================
     FETCH DASHBOARD DATA
  ========================================================= */
  const fetchDashboardData = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const [
        appointmentsRes,
        doctorsRes,
        servicesRes,
        prescriptionsRes,
      ] = await Promise.allSettled([
        fetch(`${API_URL}/appointments`),
        fetch(`${API_URL}/doctors`),
        fetch(`${API_URL}/services`),
        fetch(`${API_URL}/prescriptions`),
      ]);

      /* ================= APPOINTMENTS ================= */

      if (appointmentsRes.status === "fulfilled") {
        const response = appointmentsRes.value;
        const data = await response.json();

        if (response.ok && data.success) {
          setAppointments(data.data || []);
        } else {
          console.error("Appointments API error:", data);
        }
      }

      /* ================= DOCTORS ================= */

      if (doctorsRes.status === "fulfilled") {
        const response = doctorsRes.value;
        const data = await response.json();

        if (response.ok && data.success) {
          setDoctors(data.data || []);
        } else {
          console.error("Doctors API error:", data);
        }
      }

      /* ================= SERVICES ================= */

      if (servicesRes.status === "fulfilled") {
        const response = servicesRes.value;
        const data = await response.json();

        if (response.ok && data.success) {
          setServices(data.data || []);
        } else {
          console.error("Services API error:", data);
        }
      }

      /* ================= PRESCRIPTIONS ================= */

      if (prescriptionsRes.status === "fulfilled") {
        const response = prescriptionsRes.value;
        const data = await response.json();

        console.log("Prescriptions API:", data);

        if (response.ok && data.success) {
          setPrescriptions(data.data || []);
        } else {
          console.error("Prescriptions API error:", data);
        }
      } else {
        console.error(
          "Prescriptions request failed:",
          prescriptionsRes.reason
        );
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchDashboardData();
  }, []);

  /* =========================================================
     DATE HELPERS
  ========================================================= */

  const normalizeDate = (date) => {
    if (!date) return "";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toISOString().slice(0, 10);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* =========================================================
     STATS
  ========================================================= */

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const currentMonth = today.slice(0, 7);

    const uniquePhones = new Set(
      appointments
        .map((item) => item.phone?.trim())
        .filter(Boolean)
    );

    return {
      totalAppointments: appointments.length,

      todayAppointments: appointments.filter(
        (item) => normalizeDate(item.date) === today
      ).length,

      thisMonthAppointments: appointments.filter((item) =>
        normalizeDate(item.date).startsWith(currentMonth)
      ).length,

      pending: appointments.filter(
        (item) => item.status === "Pending"
      ).length,

      confirmed: appointments.filter(
        (item) => item.status === "Confirmed"
      ).length,

      completed: appointments.filter(
        (item) => item.status === "Completed"
      ).length,

      cancelled: appointments.filter(
        (item) => item.status === "Cancelled"
      ).length,

      totalDoctors: doctors.length,

      activeDoctors: doctors.filter(
        (doctor) => doctor.status === "Active"
      ).length,

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

      const dateKey = currentDate.toISOString().slice(0, 10);

      const count = appointments.filter(
        (item) => normalizeDate(item.date) === dateKey
      ).length;

      result.push({
        date: dateKey,
        day: currentDate.toLocaleDateString("en-US", {
          weekday: "short",
        }),
        count,
      });
    }

    return result;
  }, [appointments]);

  const weeklyMaximum = useMemo(() => {
    return Math.max(
      ...weeklyData.map((item) => item.count),
      1
    );
  }, [weeklyData]);

  /* =========================================================
     DOCTOR ANALYTICS
  ========================================================= */

  const doctorAnalytics = useMemo(() => {
    const counts = {};

    appointments.forEach((appointment) => {
      const doctorName =
        appointment.doctor || "Not Assigned";

      counts[doctorName] =
        (counts[doctorName] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort(
        (first, second) =>
          second.count - first.count
      )
      .slice(0, 5);
  }, [appointments]);

  const maximumDoctorCount = useMemo(() => {
    return Math.max(
      ...doctorAnalytics.map(
        (item) => item.count
      ),
      1
    );
  }, [doctorAnalytics]);

  /* =========================================================
     DEPARTMENT ANALYTICS
  ========================================================= */

  const departmentAnalytics = useMemo(() => {
    const counts = {};

    appointments.forEach((appointment) => {
      const departmentName =
        appointment.department || "Other";

      counts[departmentName] =
        (counts[departmentName] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort(
        (first, second) =>
          second.count - first.count
      )
      .slice(0, 6);
  }, [appointments]);

  const maximumDepartmentCount = useMemo(() => {
    return Math.max(
      ...departmentAnalytics.map(
        (item) => item.count
      ),
      1
    );
  }, [departmentAnalytics]);

  /* =========================================================
     RECENT APPOINTMENTS
  ========================================================= */

  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort((first, second) => {
        const firstDate = new Date(
          first.createdAt ||
            first.date ||
            0
        ).getTime();

        const secondDate = new Date(
          second.createdAt ||
            second.date ||
            0
        ).getTime();

        return secondDate - firstDate;
      })
      .slice(0, 10);
  }, [appointments]);

  /* =========================================================
     TODAY APPOINTMENTS
  ========================================================= */

  const todayAppointments = useMemo(() => {
    const today = new Date()
      .toISOString()
      .slice(0, 10);

    return appointments
      .filter(
        (item) =>
          normalizeDate(item.date) === today
      )
      .sort((first, second) =>
        String(
          first.createdAt || ""
        ).localeCompare(
          String(
            second.createdAt || ""
          )
        )
      )
      .slice(0, 8);
  }, [appointments]);

  /* =========================================================
     RECENT PRESCRIPTIONS
  ========================================================= */

  const recentPrescriptions = useMemo(() => {
    return [...prescriptions]
      .sort((first, second) => {
        const firstDate = new Date(
          first.createdAt || 0
        ).getTime();

        const secondDate = new Date(
          second.createdAt || 0
        ).getTime();

        return secondDate - firstDate;
      })
      .slice(0, 8);
  }, [prescriptions]);

  /* =========================================================
     PRESCRIPTION FILE URL
  ========================================================= */

  const getPrescriptionUrl = (file) => {
    if (!file) return "#";

    if (
      file.startsWith("http://") ||
      file.startsWith("https://")
    ) {
      return file;
    }

    return `${BACKEND_URL}${file.startsWith("/") ? "" : "/"}${file}`;
  };

  /* =========================================================
     STAT CARDS
  ========================================================= */

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: "📊",
      gradient:
        "from-sky-500 to-blue-700",
      shadow: "shadow-sky-200",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: "📅",
      gradient:
        "from-cyan-500 to-sky-700",
      shadow: "shadow-cyan-200",
    },
    {
      title: "Unique Patients",
      value: stats.uniquePatients,
      icon: "👥",
      gradient:
        "from-violet-500 to-purple-700",
      shadow: "shadow-violet-200",
    },
    {
      title: "Active Doctors",
      value: stats.activeDoctors,
      icon: "👨‍⚕️",
      gradient:
        "from-emerald-500 to-green-700",
      shadow: "shadow-emerald-200",
    },
    {
      title: "Services",
      value: stats.totalServices,
      icon: "🏥",
      gradient:
        "from-orange-500 to-amber-700",
      shadow: "shadow-orange-200",
    },
    {
      title: "Prescriptions",
      value: stats.totalPrescriptions,
      icon: "📄",
      gradient:
        "from-pink-500 to-rose-700",
      shadow: "shadow-pink-200",
    },
  ];

  /* =========================================================
     STATUS CARDS
  ========================================================= */

  const statusCards = [
    {
      title: "Pending",
      value: stats.pending,
      className:
        "border-yellow-200 bg-yellow-50 text-yellow-700",
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      className:
        "border-green-200 bg-green-50 text-green-700",
    },
    {
      title: "Completed",
      value: stats.completed,
      className:
        "border-blue-200 bg-blue-50 text-blue-700",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      className:
        "border-red-200 bg-red-50 text-red-700",
    },
  ];

  /* =========================================================
     STATUS CLASS
  ========================================================= */

  const statusClass = {
    Pending:
      "bg-yellow-100 text-yellow-700",
    Confirmed:
      "bg-green-100 text-green-700",
    Completed:
      "bg-blue-100 text-blue-700",
    Cancelled:
      "bg-red-100 text-red-700",
  };

  /* =========================================================
     QUICK ACTIONS
  ========================================================= */

const quickActions = [
  {
    title: "Manage Appointments",
    href: "/admin/appointments",
    desc: "View and update bookings",
    className:
      "from-sky-700 to-cyan-500",
  },
  {
    title: "Add Doctor",
    href: "/admin/doctors",
    desc: "Manage hospital doctors",
    className:
      "from-emerald-700 to-green-500",
  },
  {
    title: "Manage Services",
    href: "/admin/services",
    desc: "Add and update services",
    className:
      "from-violet-700 to-purple-500",
  },
  {
    title: "Doctor Reports",
    href: "/admin/reports",
    desc: "Doctor-wise patients & collection",
    className:
      "from-indigo-700 to-blue-500",
  },
  {
    title: "Prescriptions",
    href: "/admin/appointments",
    desc: "Upload patient prescriptions",
    className:
      "from-pink-700 to-rose-500",
  },
  {
    title: "Hospital Settings",
    href: "/admin/settings",
    desc: "Update hospital details",
    className:
      "from-slate-800 to-slate-600",
  },
];

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-sky-100 border-t-cyan-600" />

          <p className="mt-4 font-bold text-slate-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     DASHBOARD
  ========================================================= */

  return (
    <>
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.2em] text-cyan-600">
            Dew Care Hospital
          </p>

          <h1 className="mt-2 text-3xl font-black text-sky-950 md:text-5xl">
            Admin Analytics Dashboard
          </h1>

          <p className="mt-3 text-gray-500">
            Hospital appointments, doctors,
            patients and prescription overview.
          </p>
        </div>

        <button
          onClick={() =>
            fetchDashboardData(true)
          }
          disabled={refreshing}
          className="rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 px-6 py-3 font-extrabold text-white shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing
            ? "Refreshing..."
            : "Refresh Dashboard"}
        </button>
      </div>

      {/* =====================================================
          MAIN STATS
      ===================================================== */}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => (
          <div
            key={card.title}
            className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-xl ${card.shadow} transition duration-500 hover:-translate-y-2`}
          >
            <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-white/15 blur-2xl" />

            <div className="relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur">
                {card.icon}
              </div>

              <h3 className="mt-5 text-4xl font-black">
                {card.value}
              </h3>

              <p className="mt-1 text-sm font-bold text-white/80">
                {card.title}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* =====================================================
          STATUS SUMMARY
      ===================================================== */}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statusCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-3xl border p-5 shadow-sm ${card.className}`}
          >
            <h3 className="text-3xl font-black">
              {card.value}
            </h3>

            <p className="mt-1 text-sm font-bold">
              {card.title}
            </p>
          </div>
        ))}
      </div>

      {/* =====================================================
          CHART + QUICK ACTIONS
      ===================================================== */}

      <div className="mt-8 grid gap-8 xl:grid-cols-3">
        {/* Weekly Chart */}

        <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl xl:col-span-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-black text-sky-950">
                Last 7 Days Appointments
              </h2>

              <p className="text-sm text-gray-500">
                Daily appointment activity
              </p>
            </div>

            <div className="rounded-2xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-700">
              This month:{" "}
              {stats.thisMonthAppointments}
            </div>
          </div>

          <div className="mt-8 flex h-72 items-end justify-between gap-2 rounded-3xl bg-gradient-to-b from-sky-50 to-white p-4 sm:gap-4">
            {weeklyData.map((item) => {
              const barHeight =
                item.count === 0
                  ? 8
                  : Math.max(
                      (item.count /
                        weeklyMaximum) *
                        210,
                      28
                    );

              return (
                <div
                  key={item.date}
                  className="flex h-full flex-1 flex-col items-center justify-end"
                >
                  <span className="mb-2 text-sm font-black text-sky-900">
                    {item.count}
                  </span>

                  <div
                    className="w-full max-w-12 rounded-t-2xl bg-gradient-to-t from-sky-800 via-cyan-600 to-emerald-400 shadow-lg transition-all duration-700 hover:scale-x-110"
                    style={{
                      height: `${barHeight}px`,
                    }}
                  />

                  <p className="mt-3 text-xs font-bold text-gray-500 sm:text-sm">
                    {item.day}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}

        <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl">
          <h2 className="text-2xl font-black text-sky-950">
            Quick Actions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Manage important hospital sections
          </p>

          <div className="mt-6 grid gap-3">
            {quickActions.map((action) => (
              <Link
                key={action.title}
                href={action.href}
                className={`group rounded-2xl bg-gradient-to-r ${action.className} p-4 text-white shadow-lg transition hover:-translate-y-1`}
              >
                <h3 className="font-extrabold">
                  {action.title}
                </h3>

                <p className="mt-1 text-xs text-white/75">
                  {action.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* =====================================================
          DOCTOR + DEPARTMENT ANALYTICS
      ===================================================== */}

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {/* Top Doctors */}

        <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-sky-950">
              Top Doctors
            </h2>

            <p className="text-sm text-gray-500">
              Doctors with the most appointments
            </p>
          </div>

          {doctorAnalytics.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-sky-50 p-6 text-center text-gray-500">
              No doctor analytics available.
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {doctorAnalytics.map(
                (doctor, index) => (
                  <div key={doctor.name}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div>
                        <p className="font-extrabold text-sky-950">
                          {index + 1}.{" "}
                          {doctor.name}
                        </p>
                      </div>

                      <span className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-black text-cyan-700">
                        {doctor.count}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-sky-50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-sky-700 to-cyan-400"
                        style={{
                          width: `${
                            (doctor.count /
                              maximumDoctorCount) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>

        {/* Department Analytics */}

        <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl">
          <div>
            <h2 className="text-2xl font-black text-sky-950">
              Department Analytics
            </h2>

            <p className="text-sm text-gray-500">
              Appointment distribution by department
            </p>
          </div>

          {departmentAnalytics.length === 0 ? (
            <div className="mt-6 rounded-2xl bg-sky-50 p-6 text-center text-gray-500">
              No department analytics available.
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {departmentAnalytics.map(
                (department) => (
                  <div key={department.name}>
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <p className="font-extrabold text-sky-950">
                        {department.name}
                      </p>

                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-black text-emerald-700">
                        {department.count}
                      </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-emerald-50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-700 to-cyan-400"
                        style={{
                          width: `${
                            (department.count /
                              maximumDepartmentCount) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* =====================================================
          TODAY'S SCHEDULE
      ===================================================== */}

      <div className="mt-8 rounded-3xl border border-sky-100 bg-white p-6 shadow-xl">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-sky-950">
              Today's Appointment Schedule
            </h2>

            <p className="text-sm text-gray-500">
              Patients scheduled for today
            </p>
          </div>

          <span className="rounded-full bg-cyan-50 px-4 py-2 text-sm font-black text-cyan-700">
            {todayAppointments.length}{" "}
            appointments
          </span>
        </div>

        {todayAppointments.length === 0 ? (
          <div className="mt-6 rounded-2xl bg-sky-50 p-8 text-center text-gray-500">
            No appointments scheduled for today.
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {todayAppointments.map((item) => (
              <div
                key={item._id}
                className="rounded-3xl border border-sky-100 bg-gradient-to-br from-sky-50 to-white p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-black text-sky-950">
                      {item.name}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      {item.phone}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      statusClass[
                        item.status
                      ] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>
                    👨‍⚕️{" "}
                    {item.doctor ||
                      "Not assigned"}
                  </p>

                  <p>
                    🏥{" "}
                    {item.department ||
                      "N/A"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* =====================================================
          RECENT PRESCRIPTIONS
      ===================================================== */}

      <div className="mt-8 overflow-hidden rounded-3xl border border-pink-100 bg-white shadow-xl">
        {/* Header */}

        <div className="flex flex-col gap-4 border-b border-pink-100 bg-gradient-to-r from-pink-50 to-rose-50 p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-pink-100 text-2xl">
                📄
              </div>

              <div>
                <h2 className="text-2xl font-black text-sky-950">
                  Recent Prescriptions
                </h2>

                <p className="text-sm text-gray-500">
                  Recently uploaded patient prescriptions
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full bg-pink-100 px-4 py-2 text-sm font-black text-pink-700">
              {stats.totalPrescriptions}{" "}
              Total
            </span>

            <Link
              href="/admin/appointments"
              className="rounded-xl bg-pink-600 px-5 py-3 text-center font-bold text-white shadow-md transition hover:bg-pink-700"
            >
              Manage
            </Link>
          </div>
        </div>

        {/* Empty State */}

        {recentPrescriptions.length === 0 ? (
          <div className="p-12 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-pink-50 text-4xl">
              📄
            </div>

            <h3 className="mt-5 text-lg font-black text-slate-700">
              No prescriptions found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Uploaded prescriptions will appear
              here automatically.
            </p>

            <Link
              href="/admin/appointments"
              className="mt-5 inline-flex rounded-xl bg-pink-600 px-5 py-3 font-bold text-white transition hover:bg-pink-700"
            >
              Upload Prescription
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop Table */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4 text-xs font-black uppercase tracking-wide">
                      Patient
                    </th>

                    <th className="p-4 text-xs font-black uppercase tracking-wide">
                      Phone
                    </th>

                    <th className="p-4 text-xs font-black uppercase tracking-wide">
                      Doctor
                    </th>

                    <th className="p-4 text-xs font-black uppercase tracking-wide">
                      Type
                    </th>

                    <th className="p-4 text-xs font-black uppercase tracking-wide">
                      Uploaded
                    </th>

                    <th className="p-4 text-right text-xs font-black uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentPrescriptions.map(
                    (prescription) => {
                      const fileUrl =
                        getPrescriptionUrl(
                          prescription.file
                        );

                      const isPdf =
                        String(
                          prescription.fileType ||
                            ""
                        ).toUpperCase() ===
                        "PDF";

                      return (
                        <tr
                          key={
                            prescription._id
                          }
                          className="border-t border-slate-100 transition hover:bg-pink-50/40"
                        >
                          {/* Patient */}

                          <td className="p-4">
                            <div className="font-black text-sky-950">
                              {prescription.patientName ||
                                "N/A"}
                            </div>

                            {prescription.appointment
                              ?.appointmentId && (
                              <div className="mt-1 text-xs text-gray-400">
                                Appointment #
                                {
                                  prescription
                                    .appointment
                                    .appointmentId
                                }
                              </div>
                            )}
                          </td>

                          {/* Phone */}

                          <td className="p-4 text-sm font-medium text-slate-600">
                            {prescription.phone ||
                              "N/A"}
                          </td>

                          {/* Doctor */}

                          <td className="p-4 text-sm text-slate-600">
                            {typeof prescription.doctor ===
                            "object"
                              ? prescription.doctor
                                  ?.name ||
                                "N/A"
                              : prescription.doctor ||
                                prescription
                                  .appointment
                                  ?.doctor ||
                                "N/A"}
                          </td>

                          {/* File Type */}

                          <td className="p-4">
                            <span
                              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-black ${
                                isPdf
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {isPdf
                                ? "📕 PDF"
                                : "🖼️ IMAGE"}
                            </span>
                          </td>

                          {/* Date */}

                          <td className="p-4">
                            <div className="text-sm font-semibold text-slate-700">
                              {formatDate(
                                prescription.createdAt
                              )}
                            </div>

                            <div className="mt-1 text-xs text-gray-400">
                              {formatDateTime(
                                prescription.createdAt
                              )
                                .split(", ")
                                .slice(1)
                                .join(", ")}
                            </div>
                          </td>

                          {/* Action */}

                          <td className="p-4 text-right">
                            {prescription.file ? (
                              <a
                                href={fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-xl bg-pink-600 px-4 py-2.5 text-sm font-black text-white shadow-md transition hover:-translate-y-0.5 hover:bg-pink-700"
                              >
                                {isPdf
                                  ? "📕 View PDF"
                                  : "🖼️ View Image"}
                              </a>
                            ) : (
                              <span className="text-sm text-gray-400">
                                File unavailable
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}

            <div className="space-y-4 p-4 md:hidden">
              {recentPrescriptions.map(
                (prescription) => {
                  const fileUrl =
                    getPrescriptionUrl(
                      prescription.file
                    );

                  const isPdf =
                    String(
                      prescription.fileType ||
                        ""
                    ).toUpperCase() ===
                    "PDF";

                  const doctorName =
                    typeof prescription.doctor ===
                    "object"
                      ? prescription.doctor
                          ?.name ||
                        "N/A"
                      : prescription.doctor ||
                        prescription
                          .appointment?.doctor ||
                        "N/A";

                  return (
                    <div
                      key={
                        prescription._id
                      }
                      className="rounded-2xl border border-pink-100 bg-gradient-to-br from-pink-50 to-white p-5"
                    >
                      {/* Top */}

                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-black text-sky-950">
                            {prescription.patientName ||
                              "N/A"}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500">
                            {prescription.phone ||
                              "No phone"}
                          </p>
                        </div>

                        <span
                          className={`rounded-lg px-3 py-1 text-xs font-black ${
                            isPdf
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {isPdf
                            ? "PDF"
                            : "IMAGE"}
                        </span>
                      </div>

                      {/* Details */}

                      <div className="mt-4 space-y-2 text-sm text-slate-600">
                        <p>
                          👨‍⚕️{" "}
                          <span className="font-semibold">
                            Doctor:
                          </span>{" "}
                          {doctorName}
                        </p>

                        <p>
                          📅{" "}
                          <span className="font-semibold">
                            Uploaded:
                          </span>{" "}
                          {formatDate(
                            prescription.createdAt
                          )}
                        </p>

                        {prescription
                          .appointment
                          ?.appointmentId && (
                          <p>
                            🆔{" "}
                            <span className="font-semibold">
                              Appointment:
                            </span>{" "}
                            #
                            {
                              prescription
                                .appointment
                                .appointmentId
                            }
                          </p>
                        )}
                      </div>

                      {/* View */}

                      {prescription.file ? (
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-5 flex w-full items-center justify-center rounded-xl bg-pink-600 px-4 py-3 text-sm font-black text-white shadow-md transition hover:bg-pink-700"
                        >
                          {isPdf
                            ? "📕 View Prescription PDF"
                            : "🖼️ View Prescription Image"}
                        </a>
                      ) : (
                        <div className="mt-5 rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-400">
                          Prescription file unavailable
                        </div>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          </>
        )}
      </div>

      {/* =====================================================
          RECENT APPOINTMENTS
      ===================================================== */}

      <div className="mt-8 overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl">
        <div className="flex flex-col gap-4 border-b p-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-black text-sky-950">
              Recent Appointments
            </h2>

            <p className="text-sm text-gray-500">
              Latest patient appointment requests
            </p>
          </div>

          <Link
            href="/admin/appointments"
            className="rounded-xl bg-sky-900 px-5 py-3 text-center font-bold text-white"
          >
            View All Appointments
          </Link>
        </div>

        {recentAppointments.length === 0 ? (
          <div className="p-10 text-center text-gray-500">
            No appointments found.
          </div>
        ) : (
          <>
            {/* Desktop */}

            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-sky-50 text-sky-950">
                  <tr>
                    <th className="p-4">
                      Patient
                    </th>

                    <th className="p-4">
                      Phone
                    </th>

                    <th className="p-4">
                      Doctor
                    </th>

                    <th className="p-4">
                      Department
                    </th>

                    <th className="p-4">
                      Date
                    </th>

                    <th className="p-4">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentAppointments.map(
                    (item) => (
                      <tr
                        key={item._id}
                        className="border-t transition hover:bg-sky-50"
                      >
                        <td className="p-4 font-bold text-sky-950">
                          {item.name}

                          <p className="text-xs font-normal text-gray-500">
                            {item.email ||
                              "No email"}
                          </p>
                        </td>

                        <td className="p-4">
                          {item.phone}
                        </td>

                        <td className="p-4">
                          {item.doctor ||
                            "Not assigned"}
                        </td>

                        <td className="p-4">
                          {item.department ||
                            "N/A"}
                        </td>

                        <td className="p-4">
                          {formatDate(
                            item.date
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-bold ${
                              statusClass[
                                item.status
                              ] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile */}

            <div className="space-y-4 p-4 md:hidden">
              {recentAppointments.map(
                (item) => (
                  <div
                    key={item._id}
                    className="rounded-2xl border border-sky-100 bg-sky-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-black text-sky-950">
                          {item.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {item.phone}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          statusClass[
                            item.status
                          ] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {item.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-2 text-sm text-gray-700">
                      <p>
                        👨‍⚕️{" "}
                        {item.doctor ||
                          "Not assigned"}
                      </p>

                      <p>
                        🏥{" "}
                        {item.department ||
                          "N/A"}
                      </p>

                      <p>
                        📅{" "}
                        {formatDate(
                          item.date
                        )}
                      </p>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}