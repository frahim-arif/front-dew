"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const getIndiaToday = () => {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());
};

const formatDate = (date) => {
  if (!date) return "N/A";

  const parsed = new Date(`${date}T00:00:00+05:30`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatCurrency = (amount) => {
  return `₹${Number(amount || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
};

export default function DoctorReportsPage() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const [period, setPeriod] = useState("today");
  const [selectedDoctor, setSelectedDoctor] = useState("");

  const [fromDate, setFromDate] = useState(getIndiaToday());
  const [toDate, setToDate] = useState(getIndiaToday());

  /* =========================================================
     FETCH REPORT
  ========================================================= */

  const fetchReport = async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      let url = `${API_URL}/reports/doctors`;

      if (period === "custom") {
        url += `?from=${encodeURIComponent(
          fromDate
        )}&to=${encodeURIComponent(toDate)}`;
      } else {
        url += `?period=${encodeURIComponent(period)}`;
      }

      if (selectedDoctor) {
        url += `&doctorId=${encodeURIComponent(
          selectedDoctor
        )}`;
      }

      const response = await fetch(url, {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load doctor reports."
        );
      }

      setReport(data.data || null);
    } catch (err) {
      console.error("Doctor reports error:", err);

      setReport(null);

      setError(
        err?.message ||
          "Unable to load doctor reports."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    fetchReport();
  }, []);

  /* =========================================================
     DOCTOR LIST
     Use current report doctors for filter
  ========================================================= */

  const doctorOptions = useMemo(() => {
    if (!report?.doctors) return [];

    return report.doctors.filter(
      (doctor) => doctor.doctorId
    );
  }, [report]);

  /* =========================================================
     SUMMARY
  ========================================================= */

  const summary = report?.summary || {
    totalAppointments: 0,
    patientsSeen: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    pending: 0,
    pendingPayment: 0,
    paidAppointments: 0,
    totalCollected: 0,
  };

  /* =========================================================
     SUMMARY CARDS
  ========================================================= */

  const summaryCards = [
    {
      title: "Appointments",
      value: summary.totalAppointments,
      icon: "📅",
      className:
        "border-sky-200 bg-sky-50 text-sky-900",
    },
    {
      title: "Patients Seen",
      value: summary.patientsSeen,
      icon: "👥",
      className:
        "border-emerald-200 bg-emerald-50 text-emerald-900",
    },
    {
      title: "Confirmed",
      value: summary.confirmed,
      icon: "✅",
      className:
        "border-green-200 bg-green-50 text-green-900",
    },
    {
      title: "Completed",
      value: summary.completed,
      icon: "✔️",
      className:
        "border-blue-200 bg-blue-50 text-blue-900",
    },
    {
      title: "Cancelled",
      value: summary.cancelled,
      icon: "❌",
      className:
        "border-red-200 bg-red-50 text-red-900",
    },
    {
      title: "Pending",
      value: summary.pending,
      icon: "⏳",
      className:
        "border-yellow-200 bg-yellow-50 text-yellow-900",
    },
    {
      title: "Paid Appointments",
      value: summary.paidAppointments,
      icon: "💳",
      className:
        "border-violet-200 bg-violet-50 text-violet-900",
    },
    {
      title: "Total Collection",
      value: formatCurrency(
        summary.totalCollected
      ),
      icon: "₹",
      className:
        "border-indigo-200 bg-indigo-50 text-indigo-900",
    },
  ];

  /* =========================================================
     PERIOD LABEL
  ========================================================= */

  const periodLabel = useMemo(() => {
    if (!report?.period) return "";

    const { from, to } = report.period;

    if (from === to) {
      return formatDate(from);
    }

    return `${formatDate(from)} - ${formatDate(to)}`;
  }, [report]);

  /* =========================================================
     HANDLE PERIOD
  ========================================================= */

  const handlePeriodChange = (value) => {
    setPeriod(value);

    if (value !== "custom") {
      setTimeout(() => {
        fetchReport();
      }, 0);
    }
  };

  /* =========================================================
     CUSTOM REPORT
  ========================================================= */

  const handleCustomReport = () => {
    if (!fromDate || !toDate) {
      setError("Please select both dates.");
      return;
    }

    if (fromDate > toDate) {
      setError(
        "From date cannot be greater than To date."
      );
      return;
    }

    fetchReport();
  };

  /* =========================================================
     PRINT
  ========================================================= */

  const handlePrint = () => {
    window.print();
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-sky-100 border-t-cyan-600" />

          <p className="mt-4 font-bold text-slate-500">
            Loading doctor reports...
          </p>
        </div>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <>
      {/* =====================================================
          PRINT CSS
      ===================================================== */}

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          .no-print {
            display: none !important;
          }

          .print-area {
            box-shadow: none !important;
            border: 0 !important;
          }

          @page {
            size: A4 landscape;
            margin: 10mm;
          }
        }
      `}</style>

      <div className="print-area">
        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Link
                href="/admin/dashboard"
                className="no-print inline-flex h-10 items-center justify-center border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                ← Dashboard
              </Link>

              <span className="font-bold uppercase tracking-[0.18em] text-cyan-600">
                Dew Care Hospital
              </span>
            </div>

            <h1 className="mt-3 text-3xl font-black text-sky-950 md:text-4xl">
              Doctor Reports
            </h1>

            <p className="mt-2 text-sm text-slate-500 md:text-base">
              Doctor-wise appointment, patient and
              payment collection report.
            </p>

            {report?.period && (
              <p className="mt-2 text-sm font-bold text-cyan-700">
                Report Period: {periodLabel}
              </p>
            )}
          </div>

          <div className="no-print flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                fetchReport(true)
              }
              disabled={refreshing}
              className="border border-sky-200 bg-white px-5 py-3 font-extrabold text-sky-800 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {refreshing
                ? "Refreshing..."
                : "↻ Refresh"}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="bg-sky-900 px-5 py-3 font-extrabold text-white shadow-md transition hover:bg-sky-800"
            >
              🖨️ Print Report
            </button>
          </div>
        </div>

        {/* =====================================================
            FILTER PANEL
        ===================================================== */}

        <div className="no-print mb-8 border border-sky-100 bg-white p-5 shadow-xl">
          <div className="grid gap-4 lg:grid-cols-4">
            {/* Period */}

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Report Period
              </label>

              <select
                value={period}
                onChange={(event) =>
                  handlePeriodChange(
                    event.target.value
                  )
                }
                className="w-full border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 outline-none focus:border-cyan-500"
              >
                <option value="today">
                  Today
                </option>

                <option value="previous">
                  Previous Day
                </option>

                <option value="month">
                  This Month
                </option>

                <option value="custom">
                  Custom Range
                </option>
              </select>
            </div>

            {/* Doctor */}

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                Doctor
              </label>

              <select
                value={selectedDoctor}
                onChange={(event) =>
                  setSelectedDoctor(
                    event.target.value
                  )
                }
                className="w-full border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 outline-none focus:border-cyan-500"
              >
                <option value="">
                  All Doctors
                </option>

                {doctorOptions.map(
                  (doctor) => (
                    <option
                      key={doctor.doctorId}
                      value={doctor.doctorId}
                    >
                      {doctor.doctorName}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* From */}

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                From Date
              </label>

              <input
                type="date"
                value={fromDate}
                onChange={(event) =>
                  setFromDate(
                    event.target.value
                  )
                }
                disabled={
                  period !== "custom"
                }
                className="w-full border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 outline-none focus:border-cyan-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>

            {/* To */}

            <div>
              <label className="mb-2 block text-sm font-black text-slate-700">
                To Date
              </label>

              <input
                type="date"
                value={toDate}
                onChange={(event) =>
                  setToDate(
                    event.target.value
                  )
                }
                disabled={
                  period !== "custom"
                }
                className="w-full border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700 outline-none focus:border-cyan-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            {period === "custom" && (
              <button
                type="button"
                onClick={handleCustomReport}
                className="bg-cyan-700 px-6 py-3 font-extrabold text-white shadow-md transition hover:bg-cyan-800"
              >
                Generate Report
              </button>
            )}

            {period !== "custom" && (
              <button
                type="button"
                onClick={() =>
                  fetchReport()
                }
                className="bg-cyan-700 px-6 py-3 font-extrabold text-white shadow-md transition hover:bg-cyan-800"
              >
                Apply Doctor Filter
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setSelectedDoctor("");
                setPeriod("today");
                setFromDate(
                  getIndiaToday()
                );
                setToDate(
                  getIndiaToday()
                );

                setTimeout(() => {
                  fetchReport();
                }, 0);
              }}
              className="border border-slate-200 bg-white px-6 py-3 font-extrabold text-slate-700 shadow-sm transition hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {error && (
          <div className="mb-8 border border-red-200 bg-red-50 p-5 text-sm font-bold text-red-700">
            ⚠️ {error}
          </div>
        )}

        {/* =====================================================
            SUMMARY
        ===================================================== */}

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {summaryCards.map((card) => (
            <div
              key={card.title}
              className={`border p-5 shadow-sm ${card.className}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-black uppercase tracking-wide opacity-70">
                    {card.title}
                  </p>

                  <p className="mt-3 text-3xl font-black">
                    {card.value}
                  </p>
                </div>

                <span className="text-2xl">
                  {card.icon}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* =====================================================
            DOCTOR-WISE REPORT
        ===================================================== */}

        <div className="mb-8 overflow-hidden border border-sky-100 bg-white shadow-xl">
          <div className="flex flex-col gap-3 border-b border-sky-100 bg-gradient-to-r from-sky-50 to-cyan-50 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-sky-950">
                Doctor-wise Report
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Appointment, patient and collection
                details by doctor.
              </p>
            </div>

            <div className="font-bold text-cyan-700">
              {report?.doctors?.length || 0} Doctors
            </div>
          </div>

          {!report?.doctors ||
          report.doctors.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-5xl">
                👨‍⚕️
              </div>

              <h3 className="mt-4 text-lg font-black text-slate-700">
                No doctor report found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                No appointments are available for
                the selected period.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] text-left">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4 text-xs font-black uppercase">
                      Doctor
                    </th>

                    <th className="p-4 text-xs font-black uppercase">
                      Department
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Appointments
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Patients Seen
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Confirmed
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Completed
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Cancelled
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Paid
                    </th>

                    <th className="p-4 text-right text-xs font-black uppercase">
                      Collection
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report.doctors.map(
                    (doctor) => (
                      <tr
                        key={
                          doctor.doctorId ||
                          doctor.doctorName
                        }
                        className="border-t border-slate-100 transition hover:bg-sky-50"
                      >
                        <td className="p-4">
                          <div className="font-black text-sky-950">
                            {doctor.doctorName}
                          </div>
                        </td>

                        <td className="p-4 text-sm font-semibold text-slate-600">
                          {doctor.department ||
                            "N/A"}
                        </td>

                        <td className="p-4 text-center font-black text-sky-900">
                          {doctor.appointments}
                        </td>

                        <td className="p-4 text-center font-black text-emerald-700">
                          {doctor.patientsSeen}
                        </td>

                        <td className="p-4 text-center font-bold text-green-700">
                          {doctor.confirmed}
                        </td>

                        <td className="p-4 text-center font-bold text-blue-700">
                          {doctor.completed}
                        </td>

                        <td className="p-4 text-center font-bold text-red-700">
                          {doctor.cancelled}
                        </td>

                        <td className="p-4 text-center font-black text-violet-700">
                          {doctor.paidAppointments}
                        </td>

                        <td className="p-4 text-right font-black text-indigo-700">
                          {formatCurrency(
                            doctor.totalCollected
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>

                <tfoot className="border-t-2 border-sky-200 bg-sky-50">
                  <tr>
                    <td
                      colSpan="2"
                      className="p-4 font-black text-sky-950"
                    >
                      TOTAL
                    </td>

                    <td className="p-4 text-center font-black">
                      {summary.totalAppointments}
                    </td>

                    <td className="p-4 text-center font-black text-emerald-700">
                      {summary.patientsSeen}
                    </td>

                    <td className="p-4 text-center font-black text-green-700">
                      {summary.confirmed}
                    </td>

                    <td className="p-4 text-center font-black text-blue-700">
                      {summary.completed}
                    </td>

                    <td className="p-4 text-center font-black text-red-700">
                      {summary.cancelled}
                    </td>

                    <td className="p-4 text-center font-black text-violet-700">
                      {summary.paidAppointments}
                    </td>

                    <td className="p-4 text-right font-black text-indigo-700">
                      {formatCurrency(
                        summary.totalCollected
                      )}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>

        {/* =====================================================
            DAILY REPORT
        ===================================================== */}

        <div className="overflow-hidden border border-emerald-100 bg-white shadow-xl">
          <div className="border-b border-emerald-100 bg-gradient-to-r from-emerald-50 to-cyan-50 p-6">
            <h2 className="text-2xl font-black text-sky-950">
              Date-wise Report
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Daily appointment, patient and payment
              summary.
            </p>
          </div>

          {!report?.daily ||
          report.daily.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              No daily data available.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-left">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="p-4 text-xs font-black uppercase">
                      Date
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Appointments
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Patients Seen
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Confirmed
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Completed
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Cancelled
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Pending
                    </th>

                    <th className="p-4 text-center text-xs font-black uppercase">
                      Paid
                    </th>

                    <th className="p-4 text-right text-xs font-black uppercase">
                      Collection
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report.daily.map(
                    (day) => (
                      <tr
                        key={day.date}
                        className="border-t border-slate-100 hover:bg-emerald-50"
                      >
                        <td className="p-4 font-black text-sky-950">
                          {formatDate(day.date)}
                        </td>

                        <td className="p-4 text-center font-black">
                          {day.appointments}
                        </td>

                        <td className="p-4 text-center font-black text-emerald-700">
                          {day.patientsSeen}
                        </td>

                        <td className="p-4 text-center font-bold text-green-700">
                          {day.confirmed}
                        </td>

                        <td className="p-4 text-center font-bold text-blue-700">
                          {day.completed}
                        </td>

                        <td className="p-4 text-center font-bold text-red-700">
                          {day.cancelled}
                        </td>

                        <td className="p-4 text-center font-bold text-yellow-700">
                          {day.pending}
                        </td>

                        <td className="p-4 text-center font-black text-violet-700">
                          {day.paidAppointments}
                        </td>

                        <td className="p-4 text-right font-black text-indigo-700">
                          {formatCurrency(
                            day.totalCollected
                          )}
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}