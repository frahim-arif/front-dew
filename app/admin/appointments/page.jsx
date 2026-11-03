"use client";

import { useEffect, useMemo, useState } from "react";
import PrescriptionModal from "../../Components/PrescriptionModal";
import ReportModal from "../../Components/ReportModal";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const STATUS_OPTIONS = ["All", "Pending", "Confirmed", "Completed", "Cancelled"];

/* Palette: ink #14122b · violet #6d4aff · page bg #f5f4ff */
const STATUS_STYLE = {
  Pending: { pill: "bg-amber-100 text-amber-800", stripe: "border-l-amber-400", dot: "bg-amber-500" },
  Confirmed: { pill: "bg-emerald-100 text-emerald-800", stripe: "border-l-emerald-500", dot: "bg-emerald-500" },
  Completed: { pill: "bg-indigo-100 text-indigo-800", stripe: "border-l-indigo-500", dot: "bg-indigo-500" },
  Cancelled: { pill: "bg-rose-100 text-rose-800", stripe: "border-l-rose-500", dot: "bg-rose-500" },
  All: { pill: "bg-slate-100 text-slate-700", stripe: "border-l-slate-300", dot: "bg-violet-500" },
};

/* ---------- Icons ---------- */
const ICONS = {
  refresh: (<path d="M21 12a9 9 0 1 1-3-6.7M21 3v6h-6" />),
  search: (<><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></>),
  phone: (<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />),
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

/* ---------- Helpers ---------- */
function splitDate(value) {
  const d = new Date(value);
  if (!value || Number.isNaN(d.getTime())) return { day: "–", mon: "" };
  return {
    day: String(d.getDate()).padStart(2, "0"),
    mon: d.toLocaleString("en-US", { month: "short" }),
  };
}

function StatusPill({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.All;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-bold ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
}

function DateTile({ date }) {
  const { day, mon } = splitDate(date);
  return (
    <div className="flex h-16 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-b from-[#7b5cff] to-[#5a37e8] text-white shadow-lg shadow-violet-500/30">
      <span className="text-2xl font-black leading-none">{day}</span>
      <span className="mt-1 text-xs font-semibold text-white/80">{mon}</span>
    </div>
  );
}

/* ---------- Card actions ---------- */
function CardActions({ item, actionLoading, onView, onPrescription, onReport, onStatus, onDelete }) {
  const statusBtn = (status, label, icon, tone) => {
    const loading = actionLoading === `${item._id}-${status}`;
    const current = item.status === status;
    return (
      <button
        type="button"
        onClick={() => onStatus(item._id, status)}
        disabled={loading || current}
        title={current ? `Already ${status}` : label}
        className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2 py-2 text-xs font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:cursor-not-allowed disabled:opacity-35 ${tone}`}
      >
        <Icon name={icon} className="h-3.5 w-3.5" />
        {loading ? "..." : label}
      </button>
    );
  };

  const deleting = actionLoading === `${item._id}-delete`;

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-3 gap-2">
        <button
          type="button"
          onClick={() => onView(item)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#14122b] px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-[#241f4d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <Icon name="eye" className="h-3.5 w-3.5" />
          View
        </button>
        <button
          type="button"
          onClick={() => onPrescription(item)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-700 transition-colors hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <Icon name="pill" className="h-3.5 w-3.5" />
          Prescription
        </button>
        <button
          type="button"
          onClick={() => onReport(item)}
          className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-violet-200 bg-white px-3 py-2 text-xs font-bold text-violet-700 transition-colors hover:bg-violet-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
        >
          <Icon name="file" className="h-3.5 w-3.5" />
          Report
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="flex flex-1 gap-1 rounded-xl bg-[#f0eeff] p-1">
          {statusBtn("Confirmed", "Confirm", "check", "text-emerald-700 hover:bg-white")}
          {statusBtn("Completed", "Complete", "checks", "text-indigo-700 hover:bg-white")}
          {statusBtn("Cancelled", "Cancel", "x", "text-amber-700 hover:bg-white")}
        </div>

        <button
          type="button"
          onClick={() => onDelete(item._id)}
          disabled={deleting}
          title="Delete appointment"
          aria-label="Delete appointment"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-rose-600 transition-colors hover:bg-rose-600 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 disabled:opacity-50"
        >
          {deleting ? "..." : <Icon name="trash" />}
        </button>
      </div>
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
    <div className="-m-4 min-h-screen bg-[#f5f4ff] p-4 md:-m-8 md:p-8">
      {/* Toast */}
      {toast && (
        <div
          role="status"
          className={`fixed right-4 top-20 z-[60] flex max-w-sm items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-2xl ${
            toast.type === "error" ? "bg-rose-600" : "bg-[#14122b]"
          }`}
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full ${
              toast.type === "error" ? "bg-white/20" : "bg-violet-500"
            }`}
          >
            <Icon name={toast.type === "error" ? "x" : "check"} className="h-3.5 w-3.5" />
          </span>
          {toast.text}
        </div>
      )}

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-black tracking-tight text-[#14122b] md:text-5xl">
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
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 font-bold text-white shadow-lg shadow-violet-500/30 transition-colors hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Icon name="refresh" className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Tabs + search */}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm ring-1 ring-violet-100">
          {STATUS_OPTIONS.map((status) => {
            const active = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                aria-pressed={active}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                  active
                    ? "bg-[#14122b] text-white"
                    : "text-slate-600 hover:bg-violet-50"
                }`}
              >
                {status === "All" ? "Total" : status}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-xs ${
                    active ? "bg-violet-500 text-white" : "bg-violet-100 text-violet-700"
                  }`}
                >
                  {counts[status]}
                </span>
              </button>
            );
          })}
        </div>

        <div className="relative xl:w-96">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-violet-400">
            <Icon name="search" className="h-5 w-5" />
          </span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient, phone, doctor..."
            className="w-full rounded-2xl border-0 bg-white py-3.5 pl-12 pr-4 shadow-sm outline-none ring-1 ring-violet-100 transition focus:ring-2 focus:ring-violet-500"
          />
        </div>
      </div>

      <p className="mb-4 text-sm font-medium text-slate-500">
        Showing {filteredAppointments.length} of {appointments.length}
      </p>

      {/* Content */}
      {loading ? (
        <div className="rounded-3xl bg-white p-14 text-center shadow-sm ring-1 ring-violet-100">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-violet-100 border-t-violet-600" />
          <p className="mt-4 text-slate-500">Loading appointments...</p>
        </div>
      ) : filteredAppointments.length === 0 ? (
        <div className="rounded-3xl bg-white p-14 text-center shadow-sm ring-1 ring-violet-100">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
            <Icon name="inbox" className="h-7 w-7" />
          </span>
          <p className="mt-4 font-bold text-[#14122b]">No appointments found</p>
          <p className="mt-1 text-sm text-slate-500">Search ya status filter badal kar dekhein.</p>
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-2">
          {filteredAppointments.map((a) => {
            const style = STATUS_STYLE[a.status] || STATUS_STYLE.All;
            return (
              <article
                key={a._id}
                className={`rounded-2xl border-l-[6px] bg-white p-5 shadow-sm ring-1 ring-violet-100 transition-shadow hover:shadow-xl hover:shadow-violet-200/60 ${style.stripe}`}
              >
                {/* Top */}
                <div className="flex items-start gap-4">
                  <DateTile date={a.date} />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h3 className="truncate text-lg font-extrabold text-[#14122b]">{a.name}</h3>
                        <a
                          href={`tel:${a.phone}`}
                          className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-700 hover:underline"
                        >
                          <Icon name="phone" className="h-3.5 w-3.5" />
                          {a.phone}
                        </a>
                      </div>
                      <StatusPill status={a.status} />
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-500">{a.date}</p>
                  </div>
                </div>

                {/* Details */}
                <div className="mt-4 grid gap-3 rounded-xl bg-[#f8f7ff] p-4 sm:grid-cols-2">
                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-violet-500">
                      <Icon name="doctor" className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-[#14122b]">{getDoctorName(a)}</p>
                      {getDoctorSpecialist(a) && (
                        <p className="truncate text-xs text-violet-700">{getDoctorSpecialist(a)}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="mt-0.5 text-violet-500">
                      <Icon name="building" className="h-4 w-4" />
                    </span>
                    <p className="text-sm font-semibold text-slate-700">{getDoctorDepartment(a)}</p>
                  </div>

                  {a.message && (
                    <p className="line-clamp-2 text-sm text-slate-600 sm:col-span-2">
                      {a.message}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="mt-4">
                  <CardActions item={a} {...actionProps} />
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Details modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#14122b]/70 p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="h-2 rounded-t-3xl bg-gradient-to-r from-violet-600 via-fuchsia-500 to-amber-400" />

            <div className="flex items-start justify-between gap-4 p-6 pb-2">
              <div className="flex items-center gap-4">
                <DateTile date={selected.date} />
                <div>
                  <h2 className="text-2xl font-black text-[#14122b]">{selected.name}</h2>
                  <div className="mt-1.5">
                    <StatusPill status={selected.status} />
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                aria-label="Close"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
              >
                <Icon name="x" className="h-5 w-5" />
              </button>
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
                  <h3 className="mb-3 text-sm font-extrabold text-violet-700">{section.title}</h3>
                  <dl className="grid gap-3 sm:grid-cols-2">
                    {section.rows.map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-[#f8f7ff] p-4">
                        <dt className="text-xs font-semibold text-slate-500">{label}</dt>
                        <dd className="mt-1 break-words font-bold text-[#14122b]">{value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}

              <div>
                <h3 className="mb-3 text-sm font-extrabold text-violet-700">Health problem</h3>
                <p className="whitespace-pre-wrap rounded-xl bg-[#f8f7ff] p-4 text-[#14122b]">
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
    </div>
  );
}