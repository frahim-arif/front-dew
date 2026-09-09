"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [services, setServices] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async (showRefresh = false) => {
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

      if (appointmentsRes.status === "fulfilled") {
        const data = await appointmentsRes.value.json();

        if (data.success) {
          setAppointments(data.data || []);
        }
      }

      if (doctorsRes.status === "fulfilled") {
        const data = await doctorsRes.value.json();

        if (data.success) {
          setDoctors(data.data || []);
        }
      }

      if (servicesRes.status === "fulfilled") {
        const data = await servicesRes.value.json();

        if (data.success) {
          setServices(data.data || []);
        }
      }

      if (prescriptionsRes.status === "fulfilled") {
        const data = await prescriptionsRes.value.json();

        if (data.success) {
          setPrescriptions(data.data || []);
        }
      }
    } catch (error) {
      console.error("Dashboard fetch error:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

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

      pending: appointments.filter((item) => item.status === "Pending").length,

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

      activeDoctors: doctors.filter((doctor) => doctor.status === "Active")
        .length,

      totalServices: services.length,

      totalPrescriptions: prescriptions.length,

      uniquePatients: uniquePhones.size,
    };
  }, [appointments, doctors, services, prescriptions]);

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
    return Math.max(...weeklyData.map((item) => item.count), 1);
  }, [weeklyData]);

  const doctorAnalytics = useMemo(() => {
    const counts = {};

    appointments.forEach((appointment) => {
      const doctorName = appointment.doctor || "Not Assigned";

      counts[doctorName] = (counts[doctorName] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((first, second) => second.count - first.count)
      .slice(0, 5);
  }, [appointments]);

  const maximumDoctorCount = useMemo(() => {
    return Math.max(...doctorAnalytics.map((item) => item.count), 1);
  }, [doctorAnalytics]);

  const departmentAnalytics = useMemo(() => {
    const counts = {};

    appointments.forEach((appointment) => {
      const departmentName = appointment.department || "Other";

      counts[departmentName] = (counts[departmentName] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, count]) => ({
        name,
        count,
      }))
      .sort((first, second) => second.count - first.count)
      .slice(0, 6);
  }, [appointments]);

  const maximumDepartmentCount = useMemo(() => {
    return Math.max(...departmentAnalytics.map((item) => item.count), 1);
  }, [departmentAnalytics]);

  const recentAppointments = useMemo(() => {
    return [...appointments]
      .sort((first, second) => {
        const firstDate = new Date(
          first.createdAt || first.date || 0
        ).getTime();

        const secondDate = new Date(
          second.createdAt || second.date || 0
        ).getTime();

        return secondDate - firstDate;
      })
      .slice(0, 10);
  }, [appointments]);

  const todayAppointments = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);

    return appointments
      .filter((item) => normalizeDate(item.date) === today)
      .sort((first, second) =>
        String(first.createdAt || "").localeCompare(
          String(second.createdAt || "")
        )
      )
      .slice(0, 8);
  }, [appointments]);

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: "📊",
      gradient: "from-sky-500 to-blue-700",
      shadow: "shadow-sky-200",
    },
    {
      title: "Today's Appointments",
      value: stats.todayAppointments,
      icon: "📅",
      gradient: "from-cyan-500 to-sky-700",
      shadow: "shadow-cyan-200",
    },
    {
      title: "Unique Patients",
      value: stats.uniquePatients,
      icon: "👥",
      gradient: "from-violet-500 to-purple-700",
      shadow: "shadow-violet-200",
    },
    {
      title: "Active Doctors",
      value: stats.activeDoctors,
      icon: "👨‍⚕️",
      gradient: "from-emerald-500 to-green-700",
      shadow: "shadow-emerald-200",
    },
    {
      title: "Services",
      value: stats.totalServices,
      icon: "🏥",
      gradient: "from-orange-500 to-amber-700",
      shadow: "shadow-orange-200",
    },
    {
      title: "Prescriptions",
      value: stats.totalPrescriptions,
      icon: "📄",
      gradient: "from-pink-500 to-rose-700",
      shadow: "shadow-pink-200",
    },
  ];

  const statusCards = [
    {
      title: "Pending",
      value: stats.pending,
      className: "border-yellow-200 bg-yellow-50 text-yellow-700",
    },
    {
      title: "Confirmed",
      value: stats.confirmed,
      className: "border-green-200 bg-green-50 text-green-700",
    },
    {
      title: "Completed",
      value: stats.completed,
      className: "border-blue-200 bg-blue-50 text-blue-700",
    },
    {
      title: "Cancelled",
      value: stats.cancelled,
      className: "border-red-200 bg-red-50 text-red-700",
    },
  ];

  const statusClass = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-green-100 text-green-700",
    Completed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const quickActions = [
    {
      title: "Manage Appointments",
      href: "/admin/appointments",
      desc: "View and update bookings",
      className: "from-sky-700 to-cyan-500",
    },
    {
      title: "Add Doctor",
      href: "/admin/doctors",
      desc: "Manage hospital doctors",
      className: "from-emerald-700 to-green-500",
    },
    {
      title: "Manage Services",
      href: "/admin/services",
      desc: "Add and update services",
      className: "from-violet-700 to-purple-500",
    },
    {
      title: "Prescriptions",
      href: "/admin/appointments",
      desc: "Upload patient prescriptions",
      className: "from-pink-700 to-rose-500",
    },
    {
      title: "Hospital Settings",
      href: "/admin/settings",
      desc: "Update hospital details",
      className: "from-slate-800 to-slate-600",
    },
  ];

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

  return (
    <>
      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-bold uppercase tracking-[0.2em] text-cyan-600">
            Dew Care Hospital
          </p>

          <h1 className="mt-2 text-3xl font-black text-sky-950 md:text-5xl">
            Admin Analytics Dashboard
          </h1>

          <p className="mt-3 text-gray-500">
            Hospital appointments, doctors, patients and prescription overview.
          </p>
        </div>

        <button
          onClick={() => fetchDashboardData(true)}
          disabled={refreshing}
          className="rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 px-6 py-3 font-extrabold text-white shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {refreshing ? "Refreshing..." : "Refresh Dashboard"}
        </button>
      </div>

      {/* Main Stats */}
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

      {/* Status Summary */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statusCards.map((card) => (
          <div
            key={card.title}
            className={`rounded-3xl border p-5 shadow-sm ${card.className}`}
          >
            <h3 className="text-3xl font-black">{card.value}</h3>
            <p className="mt-1 text-sm font-bold">{card.title}</p>
          </div>
        ))}
      </div>

      {/* Chart + Quick Actions */}
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
              This month: {stats.thisMonthAppointments}
            </div>
          </div>

          <div className="mt-8 flex h-72 items-end justify-between gap-2 rounded-3xl bg-gradient-to-b from-sky-50 to-white p-4 sm:gap-4">
            {weeklyData.map((item) => {
              const barHeight =
                item.count === 0
                  ? 8
                  : Math.max((item.count / weeklyMaximum) * 210, 28);

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
                <h3 className="font-extrabold">{action.title}</h3>

                <p className="mt-1 text-xs text-white/75">
                  {action.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor + Department Analytics */}
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
              {doctorAnalytics.map((doctor, index) => (
                <div key={doctor.name}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-extrabold text-sky-950">
                        {index + 1}. {doctor.name}
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
                          (doctor.count / maximumDoctorCount) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
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
              {departmentAnalytics.map((department) => (
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
                          (department.count / maximumDepartmentCount) * 100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Today's Schedule */}
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
            {todayAppointments.length} appointments
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
                      statusClass[item.status] ||
                      "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <p>👨‍⚕️ {item.doctor || "Not assigned"}</p>
                  <p>🏥 {item.department || "N/A"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Appointments */}
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
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left">
                <thead className="bg-sky-50 text-sky-950">
                  <tr>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Doctor</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>

                <tbody>
                  {recentAppointments.map((item) => (
                    <tr
                      key={item._id}
                      className="border-t transition hover:bg-sky-50"
                    >
                      <td className="p-4 font-bold text-sky-950">
                        {item.name}

                        <p className="text-xs font-normal text-gray-500">
                          {item.email || "No email"}
                        </p>
                      </td>

                      <td className="p-4">{item.phone}</td>

                      <td className="p-4">
                        {item.doctor || "Not assigned"}
                      </td>

                      <td className="p-4">
                        {item.department || "N/A"}
                      </td>

                      <td className="p-4">
                        {formatDate(item.date)}
                      </td>

                      <td className="p-4">
                        <span
                          className={`rounded-full px-3 py-1 text-sm font-bold ${
                            statusClass[item.status] ||
                            "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-4 p-4 md:hidden">
              {recentAppointments.map((item) => (
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
                        statusClass[item.status] ||
                        "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 space-y-2 text-sm text-gray-700">
                    <p>👨‍⚕️ {item.doctor || "Not assigned"}</p>
                    <p>🏥 {item.department || "N/A"}</p>
                    <p>📅 {formatDate(item.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}