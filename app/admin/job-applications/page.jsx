
"use client";

import { useEffect, useMemo, useState } from "react";

const API = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api"
).replace(/\/$/, "");

const STATUSES = [
  "Pending",
  "Shortlisted",
  "Interview",
  "Selected",
  "Rejected",
];

export default function JobApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("All");
  const [position, setPosition] = useState("All");
  const [status, setStatus] = useState("All");
  const [selected, setSelected] = useState(null);
  const [updating, setUpdating] = useState(false);

  const headers = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  });

  async function loadApplications() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `${API}/admin/job-applications`,
        { headers: headers(), cache: "no-store" }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Applications load nahi huye.");
      }

      const list = Array.isArray(data)
        ? data
        : data.applications || data.data || [];

      setApplications(list);
    } catch (err) {
      setError(err.message || "Server se connection nahi hua.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadApplications();
  }, []);

  const branches = useMemo(
    () => [
      "All",
      ...new Set(applications.map((a) => a.branch).filter(Boolean)),
    ],
    [applications]
  );

  const positions = useMemo(
    () => [
      "All",
      ...new Set(
        applications.map((a) => a.position || a.applyFor).filter(Boolean)
      ),
    ],
    [applications]
  );

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const name = a.name || a.applicantName || "";
      const mobile = a.mobile || a.phone || "";
      const searchMatch =
        `${name} ${mobile} ${a.email || ""}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const branchMatch =
        branch === "All" || a.branch === branch;

      const positionMatch =
        position === "All" ||
        (a.position || a.applyFor) === position;

      const statusMatch =
        status === "All" || (a.status || "Pending") === status;

      return searchMatch && branchMatch && positionMatch && statusMatch;
    });
  }, [applications, search, branch, position, status]);

  async function updateStatus(application, newStatus) {
    const id = application._id || application.id;
    if (!id) return;

    try {
      setUpdating(true);

      const response = await fetch(
        `${API}/admin/job-applications/${id}/status`,
        {
          method: "PATCH",
          headers: headers(),
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update nahi hua.");
      }

      setApplications((prev) =>
        prev.map((item) =>
          (item._id || item.id) === id
            ? { ...item, status: newStatus }
            : item
        )
      );

      setSelected((prev) =>
        prev && (prev._id || prev.id) === id
          ? { ...prev, status: newStatus }
          : prev
      );
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  }

  const count = (value) =>
    applications.filter(
      (a) => (a.status || "Pending") === value
    ).length;

  function dateFormat(value) {
    if (!value) return "-";
    return new Date(value).toLocaleDateString("en-IN");
  }

  function field(label, value) {
    return (
      <div className="rounded-xl bg-slate-50 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value || "-"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">
            Job Applications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Dew Care Hospital - Recruitment Management
          </p>
        </div>

        <button
          onClick={loadApplications}
          className="rounded-xl bg-[#06303a] px-5 py-3 text-sm font-bold text-white hover:bg-[#0b4651]"
        >
          ↻ Refresh
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total Applications", applications.length, "bg-sky-50 text-sky-700"],
          ["Pending", count("Pending"), "bg-amber-50 text-amber-700"],
          ["Shortlisted", count("Shortlisted"), "bg-blue-50 text-blue-700"],
          ["Selected", count("Selected"), "bg-emerald-50 text-emerald-700"],
        ].map(([label, value, color]) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className={`mt-3 inline-flex rounded-xl px-3 py-1 text-2xl font-extrabold ${color}`}>
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 font-bold text-slate-800">
          Search & Filter Applications
        </h2>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, mobile, email..."
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-teal-500"
          />

          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
          >
            {branches.map((v) => <option key={v}>{v}</option>)}
          </select>

          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
          >
            {positions.map((v) => <option key={v}>{v}</option>)}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-200 px-4 py-3 text-sm"
          >
            <option value="All">All Status</option>
            {STATUSES.map((v) => <option key={v}>{v}</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="font-bold text-slate-800">Applicant List</h2>
          <span className="text-sm text-slate-500">
            {filtered.length} Applications
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-500">
            Loading applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="text-4xl">📋</div>
            <p className="mt-3 font-bold text-slate-700">
              No applications found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Applications yahan tab dikhenge jab form backend se connect hoga.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Applicant</th>
                  <th className="px-5 py-4">Position</th>
                  <th className="px-5 py-4">Branch</th>
                  <th className="px-5 py-4">Date</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => (
                  <tr key={a._id || a.id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-bold text-slate-800">
                        {a.name || a.applicantName}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {a.mobile || a.phone}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      {a.position || a.applyFor || "-"}
                    </td>
                    <td className="px-5 py-4">
                      {a.branch || "-"}
                    </td>
                    <td className="px-5 py-4">
                      {dateFormat(a.createdAt || a.date)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700">
                        {a.status || "Pending"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelected(a)}
                        className="rounded-lg bg-[#06303a] px-4 py-2 text-xs font-bold text-white"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-3">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 flex items-center justify-between bg-[#06303a] p-5 text-white">
              <div>
                <h2 className="text-lg font-extrabold">Applicant Details</h2>
                <p className="text-xs text-white/70">
                  {selected.applicationId || selected._id}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-lg px-3 py-2 text-xl hover:bg-white/10"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div>
                <h3 className="mb-3 font-bold text-slate-800">Personal Information</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {field("Name", selected.name || selected.applicantName)}
                  {field("Mobile", selected.mobile || selected.phone)}
                  {field("Email", selected.email)}
                  {field("Address", selected.address)}
                  {field("Position", selected.position || selected.applyFor)}
                  {field("Branch", selected.branch)}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-bold text-slate-800">Qualification</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {field("Highest Qualification", selected.highestQualification)}
                  {field("Passing Year", selected.passingYear)}
                  {field("Professional Qualification", selected.professionalQualification)}
                  {field("Professional Passing Year", selected.professionalPassingYear)}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-bold text-slate-800">Experience</h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {field("Employment Status", selected.employmentStatus)}
                  {field("Total Experience", selected.totalExperience)}
                </div>
                {Array.isArray(selected.workplaces) &&
                  selected.workplaces.map((work, i) => (
                    <div key={i} className="mt-3 grid gap-3 rounded-xl border p-3 sm:grid-cols-3">
                      {field("Workplace", work.workplace)}
                      {field("From", work.from)}
                      {field("To", work.to)}
                    </div>
                  ))}
              </div>

              <div className="rounded-xl border border-slate-200 p-4">
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Application Status
                </label>
                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((s) => (
                    <button
                      key={s}
                      disabled={updating}
                      onClick={() => updateStatus(selected, s)}
                      className={`rounded-lg border px-3 py-2 text-xs font-bold disabled:opacity-50 ${
                        (selected.status || "Pending") === s
                          ? "border-[#06303a] bg-[#06303a] text-white"
                          : "border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700"
              >
                Print Application
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
