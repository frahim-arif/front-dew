"use client";

import { useEffect, useMemo, useState } from "react";
import PrescriptionModal from "../../Components/PrescriptionModal";
import ReportModal from "../../Components/ReportModal";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const STATUS_OPTIONS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

/* Status ke colors: pill + dot + stat card accent */
const STATUS_STYLE = {
  Pending: { pill: "bg-amber-50 text-amber-700 ring-amber-200", dot: "bg-amber-500" },
  Confirmed: { pill: "bg-emerald-50 text-emerald-700 ring-emerald-200", dot: "bg-emerald-500" },
  Completed: { pill: "bg-sky-50 text-sky-700 ring-sky-200", dot: "bg-sky-500" },
  Cancelled: { pill: "bg-rose-50 text-rose-700 ring-rose-200", dot: "bg-rose-500" },
  All: { pill: "bg-slate-50 text-slate-700 ring-slate-200", dot: "bg-teal-500" },
};

/* ---------- Small icons ---------- */
const ICONS = {
  refresh: (<path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" />),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  phone: (<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />),
  calendar: (<><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></>),
  building: (<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />),
  doctor: (<><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></>),
  eye: (<><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z" /><circle cx="12" cy="12" r="3" /></>),
  pill: (<><path d="m10.5 20.5-7-7a4.9 4.9 0 0 1 7-7l7 7a4.9 4.9 0 0 1-7 7z" /><path d="m8.5 8.5 7 7" /></>),
  file: (<><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6M16 13H8M16 17H8" /></>),
  check: (<path d="m5 12 5 5 9-10" />),
  checks: (<path d="m2 12 5 5L17 6M12 17l1 1L22 7" />),
  x: (<path d="M18 6 6 18M6 6l12 12" />),
  trash: (<path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6M10 11v6M14 11v6" />),
  inbox: (<><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5.1 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.5-6.9A2 2 0 0 0 16.7 4H7.3a2 2 0 0 0-1.8 1.1z" /></>),
};

function Icon({ name, className = "h-4 w-4" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {ICONS[name]}
    </svg>
  );
}

function StatusPill({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.All;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function Avatar({ name }) {
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#9ff7e1] to-[#2dd4bf] text-sm font-extrabold text-[#04222a]">
      {(name || "?").trim().charAt(0).toUpperCase()}
    </div>
  );
}

/* ---------- Row actions (component ke bahar, remount nahi hoga) ---------- */
function RowActions({ item, actionLoading, onView, onPrescription, onReport, onStatus, onDelete }) {
  const statusBtn = (status, label, icon, tone) => {
    const loading = actionLoading === `${item._id}-${status}`;
    const current = item.status === status;
    return (
      <button
        type="button"
        onClick={() => onStatus(item._id, status)}
        disabled={loading || current}
        title={current ? `Already ${status}` : label}
        className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-40 ${tone}`}
      >
        <Icon name={icon} className="h-3.5 w-3.5" />
        {loading ? "..." : label}
      </button>
    );
  };

  const deleting = actionLoading === `${item._id}-delete`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onView(item)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-[#04222a] px-3 py-1.5 text-xs font-bold text-white transition-colors hover:bg-[#06303a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      >
        <Icon name="eye" className="h-3.5 w-3.5" />
        View
      </button>

      <button
        type="button"
        onClick={() => onPrescription(item)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-violet-50 px-3 py-1.5 text-xs font-bold text-violet-700 ring-1 ring-violet-200 transition-colors hover:bg-violet-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
      >
        <Icon name="pill" className="h-3.5 w-3.5" />
        Prescription
      </button>

      <button
        type="button"
        onClick={() => onReport(item)}
        className="inline-flex items-center gap-1.5 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 ring-1 ring-teal-200 transition-colors hover:bg-teal-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
      >
        <Icon name="file" className="h-3.5 w-3.5" />
        Report
      </button>

      {/* Status group */}
      <div className="inline-flex items-center gap-0.5 rounded-xl bg-slate-100 p-1">
        {statusBtn("Confirmed", "Confirm", "check", "text-emerald-700 hover:bg-white")}
        {statusBtn("Completed", "Complete", "checks", "text-sky-700 hover:bg-white")}
        {statusBtn("Cancelled", "Cancel", "x", "text-amber-700 hover:bg-white")}
      </div>

      <button
        type="button"
        onClick={() => onDelete(item._id)}
        disabled={deleting}
        title="Delete appointment"
        aria-label="Delete appointment"
        className="flex h-8 w-8 items-center justify-center rounded-lg text-rose-600 transition-colors hover:bg-rose-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {deleting ? "..." : <Icon name="trash" />}
      </button>
    </div>
  );
}

/* ---------- Page ---------- */
export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [toast, setToast] = useState(null);

  const [selected, setSelected] = useState(null);
  const [prescriptionAppointment, setPrescriptionAppointment] = useState(null);
  const [reportAppointment, setReportAppointment] = useState(null);

  const notify = (type, text) => setToast({ type, text });

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/appointments`, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Unable to fetch appointments");
      }
      setAppointments(data.data || []);
    } catch (error) {
      console.error("Fetch appointments error:", error);
      notify("error", error.message || "Unable to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getDoctorName = (a) => a?.doctorId?.name || a?.doctor || "No doctor selected";
  const getDoctorSpecialist = (a) => a?.doctorId?.specialist || "";
  const getDoctorDepartment = (a) => a?.doctorId?.department || a?.department || "N/A";

  const filteredAppointments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return appointments.filter((item) => {
      const doctorName = item.doctorId?.name || item.doctor || "";
      const doctorSpecialist = item.doctorId?.specialist || "";

      const searchableText = [
        item.name,
        item.phone,
        item.email,
        item.department,
        item.date,
        item.status,
        doctorName,
        doctorSpecialist,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !keyword || searchableText.includes(keyword);
      const matchesStatus = statusFilter === "All" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const counts = useMemo(() => {
    const by = (s) => appointments.filter((i) => i.status === s).length;
    return {
      All: appointments.length,
      Pending: by("Pending"),
      Confirmed: by("Confirmed"),
      Completed: by("Completed"),
      Cancelled: by("Cancelled"),
    };
  }, [appointments]);

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(`${id}-${status}`);

      const res = await fetch(`${API}/appointments/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Status update failed");
      }

      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );

      if (selected?._id === id) {
        setSelected((prev) => ({ ...prev, status }));
      }

      notify("success", `Appointment ${status.toLowerCase()} successfully.`);
    } catch (error) {
      console.error("Update status error:", error);
      notify("error", error.message || "Server error while updating status");
    } finally {
      setActionLoading("");
    }
  };

  const deleteAppointment = async (id) => {
    const confirmed = window.confirm(
      "Kya aap is appointment ko permanently delete karna chahte hain?"
    );
    if (!confirmed) return;

    try {
      setActionLoading(`${id}-delete`);

      const res = await fetch(`${API}/appointments/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Delete failed");
      }

      setAppointments((prev) => prev.filter((a) => a._id !== id));

      if (selected?._id === id) setSelected(null);
      if (prescriptionAppointment?._id === id) setPrescriptionAppointment(null);
      if (reportAppointment?._id === id) setReportAppointment(null);

      notify("success", "Appointment deleted successfully.");
    } catch (error) {
      console.error("Delete appointment error:", error);
      notify("error", error.message || "Server error while deleting appointment");
    } finally {
      setActionLoading("");
    }
  };

  const actionProps = {
    actionLoading,
    onView: setSelected,
    onPrescription: setPrescriptionAppointment,
    onReport: setReportAppointment,
    onStatus: updateStatus,
    onDelete: deleteAppointment,
  };

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed right-4 top-20 z-[60] flex max-w-sm items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-2xl ${
            toast.type === "error" ? "bg-rose-600" : "bg-[#04222a]"
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              toast.type === "error" ? "bg-white/20" : "bg-[#7ff0d4] text-[#04222a]"
            }`}
          >
            <Icon name={toast.type === "error" ? "x" : "check"} className="h-3.5 w-3.5" />
          </span>
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-[#04222a] md:text-4xl">
            Appointments
          </h1>
          <p className="mt-2 max-w-xl text-slate-500">
            Patient appointments dekhein, status badlein, aur prescription ya report upload karein.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAppointments}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#04222a] px-5 py-3 font-bold text-white shadow-lg shadow-teal-900/20 transition-colors hover:bg-[#06303a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon name="refresh" className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Stat cards = status filters */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {STATUS_OPTIONS.map((status) => {
          const active = statusFilter === status;
          const s = STATUS_STYLE[status];
          return (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              aria-pressed={active}
              className={`relative overflow-hidden rounded-2xl p-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                active
                  ? "bg-[#04222a] text-white shadow-xl shadow-teal-900/25"
                  : "bg-white text-[#04222a] ring-1 ring-slate-200 hover:ring-teal-300"
              }`}
            >
              <span className="flex items-center gap-2 text-sm font-semibold">
                <span className={`h-2 w-2 rounded-full ${s.dot} ${active ? "shadow-[0_0_10px_2px_rgba(127,240,212,0.6)]" : ""}`} />
                <span className={active ? "text-white/80" : "text-slate-500"}>
                  {status === "All" ? "Total" : status}
                </span>
              </span>
              <span className="mt-2 block text-3xl font-extrabold">{counts[status]}</span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">
          <Icon name="search" className="h-5 w-5" />
        </span>
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search patient, phone, email, department or doctor..."
          className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-14 pr-5 outline-none transition focus:border-teal-400 focus:ring-4 focus:ring-teal-100"
        />
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="text-lg font-extrabold text-[#04222a]">Appointment list</h2>
          <p className="text-sm text-slate-500">
            Showing {filteredAppointments.length} of {appointments.length}
          </p>
        </div>

        {loading ? (
          <div className="p-14 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-teal-100 border-t-teal-600" />
            <p className="mt-4 text-slate-500">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-14 text-center">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-600">
              <Icon name="inbox" className="h-7 w-7" />
            </span>
            <p className="mt-4 font-bold text-[#04222a]">No appointments found</p>
            <p className="mt-1 text-sm text-slate-500">
              Search ya status filter badal kar dekhein.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="bg-slate-50 text-sm text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Patient</th>
                    <th className="px-5 py-3 font-semibold">Phone</th>
                    <th className="px-5 py-3 font-semibold">Department</th>
                    <th className="px-5 py-3 font-semibold">Date</th>
                    <th className="px-5 py-3 font-semibold">Doctor</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map((a) => (
                    <tr
                      key={a._id}
                      className="border-t border-slate-100 align-middle transition-colors hover:bg-teal-50/40"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar name={a.name} />
                          <div className="min-w-0">
                            <p className="font-bold text-[#04222a]">{a.name}</p>
                            <p className="truncate text-xs text-slate-500">
                              {a.email || "No email"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <a
                          href={`tel:${a.phone}`}
                          className="font-medium text-teal-700 hover:underline"
                        >
                          {a.phone}
                        </a>
                      </td>

                      <td className="px-5 py-4 text-slate-700">{getDoctorDepartment(a)}</td>

                      <td className="whitespace-nowrap px-5 py-4 text-slate-700">{a.date}</td>

                      <td className="px-5 py-4">
                        <p className="font-bold text-[#04222a]">{getDoctorName(a)}</p>
                        {getDoctorSpecialist(a) && (
                          <p className="mt-0.5 text-xs font-medium text-teal-700">
                            {getDoctorSpecialist(a)}
                          </p>
                        )}
                      </td>

                      <td className="px-5 py-4">
                        <StatusPill status={a.status} />
                      </td>

                      <td className="px-5 py-4">
                        <RowActions item={a} {...actionProps} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="space-y-4 p-4 lg:hidden">
              {filteredAppointments.map((a) => (
                <div
                  key={a._id}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <Avatar name={a.name} />
                      <div>
                        <h3 className="font-extrabold text-[#04222a]">{a.name}</h3>
                        <p className="text-sm text-slate-500">{a.email || "No email"}</p>
                      </div>
                    </div>
                    <StatusPill status={a.status} />
                  </div>

                  <div className="mt-4 grid gap-2 text-sm text-slate-700">
                    <p className="flex items-center gap-2">
                      <Icon name="phone" className="h-4 w-4 text-teal-600" />
                      <a href={`tel:${a.phone}`} className="font-medium text-teal-700">
                        {a.phone}
                      </a>
                    </p>
                    <p className="flex items-center gap-2">
                      <Icon name="building" className="h-4 w-4 text-teal-600" />
                      {getDoctorDepartment(a)}
                    </p>
                    <p className="flex items-center gap-2">
                      <Icon name="calendar" className="h-4 w-4 text-teal-600" />
                      {a.date}
                    </p>
                    <p className="flex items-center gap-2">
                      <Icon name="doctor" className="h-4 w-4 text-teal-600" />
                      {getDoctorName(a)}
                      {getDoctorSpecialist(a) && (
                        <span className="text-xs text-teal-700">· {getDoctorSpecialist(a)}</span>
                      )}
                    </p>
                  </div>

                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <RowActions item={a} {...actionProps} />
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Details modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div
              className="flex items-start justify-between gap-4 rounded-t-3xl p-6 text-white"
              style={{
                background:
                  "radial-gradient(120% 120% at 0% 0%, rgba(127,240,212,0.22) 0%, rgba(127,240,212,0) 60%), linear-gradient(180deg, #06303a 0%, #04222a 100%)",
              }}
            >
              <div className="flex items-center gap-4">
                <Avatar name={selected.name} />
                <div>
                  <h2 className="text-xl font-extrabold">{selected.name}</h2>
                  <p className="text-sm text-white/60">Appointment details</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusPill status={selected.status} />
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7ff0d4]"
                >
                  <Icon name="x" className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6 p-6">
              {[
                {
                  title: "Patient",
                  rows: [
                    ["Phone", selected.phone],
                    ["Email", selected.email || "N/A"],
                    ["Age", selected.age || "N/A"],
                    ["Gender", selected.gender || "N/A"],
                  ],
                },
                {
                  title: "Doctor",
                  rows: [
                    ["Doctor", getDoctorName(selected)],
                    ["Specialist", getDoctorSpecialist(selected) || "N/A"],
                    ["Qualification", selected.doctorId?.qualification || "N/A"],
                    ["Doctor status", selected.doctorId?.status || "N/A"],
                  ],
                },
                {
                  title: "Visit",
                  rows: [
                    ["Department", getDoctorDepartment(selected)],
                    ["Date", selected.date],
                  ],
                },
              ].map((section) => (
                <div key={section.title}>
                  <h3 className="mb-3 text-sm font-bold text-teal-700">{section.title}</h3>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {section.rows.map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                        <dt className="text-xs font-semibold text-slate-500">{label}</dt>
                        <dd className="mt-1 break-words font-bold text-[#04222a]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}

              <div>
                <h3 className="mb-3 text-sm font-bold text-teal-700">Health problem</h3>
                <p className="whitespace-pre-wrap rounded-2xl bg-slate-50 p-4 text-[#04222a] ring-1 ring-slate-100">
                  {selected.message || "No message"}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {prescriptionAppointment && (
        <PrescriptionModal
          appointment={prescriptionAppointment}
          onClose={() => setPrescriptionAppointment(null)}
        />
      )}

      {/* Report Modal */}
      {reportAppointment && (
        <ReportModal
          appointment={reportAppointment}
          onClose={() => setReportAppointment(null)}
        />
      )}
    </>
  );
}