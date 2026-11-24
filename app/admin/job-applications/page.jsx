
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const API = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api"
).replace(/\/+$/, "");

const STATUSES = ["Pending", "Shortlisted", "Interview", "Selected", "Rejected"];

function getValue(...values) {
  return values.find(
    (value) => value !== undefined && value !== null && value !== ""
  ) ?? "-";
}

function getProfessionalQualifications(application) {
  const qualifications =
    application.professionalQualifications ||
    application.professionalQualification;

  if (Array.isArray(qualifications)) {
    return qualifications
      .map((item) => {
        if (typeof item === "string") return item;

        const qualification = getValue(item?.qualification, "");
        const year = getValue(item?.yearOfPassing, item?.passingYear, "");

        if (qualification === "-" && year === "-") return "";
        return year === "-"
          ? qualification
          : `${qualification} (${year})`;
      })
      .filter(Boolean)
      .join(", ") || "-";
  }

  return qualifications || "-";
}

function getWorkPlaces(application) {
  const workplaces = application.workPlaces || application.workplaces;

  if (!Array.isArray(workplaces)) return [];

  return workplaces;
}

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

  const getToken = () => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("token") || "";
  };

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API}/admin/job-applications`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Applications load nahi ho paye.");
      }

      const list = Array.isArray(data)
        ? data
        : data.applications || data.data || [];

      setApplications(list);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  const branches = useMemo(
    () => [
      "All",
      ...new Set(
        applications
          .map((a) => getValue(a.applyBranch, a.branch))
          .filter((value) => value !== "-")
      ),
    ],
    [applications]
  );

  const positions = useMemo(
    () => [
      "All",
      ...new Set(
        applications
          .map((a) => getValue(a.applyFor, a.position))
          .filter((value) => value !== "-")
      ),
    ],
    [applications]
  );

  const filtered = useMemo(() => {
    return applications.filter((a) => {
      const name = getValue(a.applicantName, a.name);
      const mobile = getValue(a.mobileNumber, a.mobile, a.phone);
      const email = getValue(a.emailAddress, a.email);
      const applicationId = getValue(a.applicationId, a._id);
      const applicantBranch = getValue(a.applyBranch, a.branch);
      const applicantPosition = getValue(a.applyFor, a.position);

      const searchText =
        `${name} ${mobile} ${email} ${applicationId}`.toLowerCase();

      const searchMatch = searchText.includes(search.toLowerCase());
      const branchMatch =
        branch === "All" || applicantBranch === branch;
      const positionMatch =
        position === "All" || applicantPosition === position;
      const statusMatch =
        status === "All" || (a.status || "Pending") === status;

      return (
        searchMatch &&
        branchMatch &&
        positionMatch &&
        statusMatch
      );
    });
  }, [applications, search, branch, position, status]);

  const counts = useMemo(
    () => ({
      total: applications.length,
      pending: applications.filter(
        (a) => (a.status || "Pending") === "Pending"
      ).length,
      shortlisted: applications.filter(
        (a) => a.status === "Shortlisted"
      ).length,
      selected: applications.filter(
        (a) => a.status === "Selected"
      ).length,
    }),
    [applications]
  );

  const updateStatus = async (application, newStatus) => {
    const id = application._id;

    if (!id) {
      alert("Application ID missing.");
      return;
    }

    setUpdating(true);

    try {
      const response = await fetch(
        `${API}/admin/job-applications/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Status update failed.");
      }

      setApplications((previous) =>
        previous.map((item) =>
          item._id === id
            ? { ...item, status: newStatus }
            : item
        )
      );

      setSelected((previous) =>
        previous?._id === id
          ? { ...previous, status: newStatus }
          : previous
      );
    } catch (err) {
      alert(err.message || "Status update failed.");
    } finally {
      setUpdating(false);
    }
  };

  const field = (label, value) => (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="break-words text-sm font-medium text-slate-800">
        {value === undefined || value === null || value === ""
          ? "-"
          : String(value)}
      </p>
    </div>
  );

  const printApplication = () => {
    window.print();
  };

  return (
    <div className="min-h-screen space-y-6 bg-slate-50 p-4 md:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Job Applications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage and review hospital job applications.
          </p>
        </div>

        <button
          onClick={fetchApplications}
          disabled={loading}
          className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh Applications"}
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          ["Total Applications", counts.total],
          ["Pending", counts.pending],
          ["Shortlisted", counts.shortlisted],
          ["Selected", counts.selected],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              {value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, mobile, email or ID..."
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 md:col-span-2"
          />

          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none"
          >
            {branches.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Branches" : item}
              </option>
            ))}
          </select>

          <select
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none"
          >
            {positions.map((item) => (
              <option key={item} value={item}>
                {item === "All" ? "All Positions" : item}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-xl border border-slate-300 px-3 py-3 text-sm outline-none md:col-span-2"
          >
            <option value="All">All Statuses</option>
            {STATUSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              setSearch("");
              setBranch("All");
              setPosition("All");
              setStatus("All");
            }}
            className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 md:col-span-2"
          >
            Clear Filters
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 p-4">
          <h2 className="font-bold text-slate-900">
            Applicant List
          </h2>
          <span className="text-sm text-slate-500">
            {filtered.length} results
          </span>
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500">
            Loading applications...
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            No applications found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="p-4">Applicant</th>
                  <th className="p-4">Mobile</th>
                  <th className="p-4">Position</th>
                  <th className="p-4">Branch</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filtered.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50">
                    <td className="p-4">
                      <p className="font-semibold text-slate-900">
                        {getValue(a.applicantName, a.name)}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        {getValue(a.applicationId, a._id)}
                      </p>
                    </td>

                    <td className="p-4">
                      {getValue(a.mobileNumber, a.mobile, a.phone)}
                    </td>

                    <td className="p-4">
                      {getValue(a.applyFor, a.position)}
                    </td>

                    <td className="p-4">
                      {getValue(a.applyBranch, a.branch)}
                    </td>

                    <td className="p-4 text-slate-500">
                      {a.createdAt
                        ? new Date(a.createdAt).toLocaleDateString("en-IN")
                        : "-"}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {a.status || "Pending"}
                      </span>
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() => setSelected(a)}
                        className="rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 hover:bg-blue-100"
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
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 md:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelected(null);
          }}
        >
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white p-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Application Details
                </h2>
                <p className="text-xs text-slate-500">
                  {getValue(selected.applicationId, selected._id)}
                </p>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div id="print-application" className="space-y-6 p-5 md:p-6">
              <div>
                <h3 className="mb-3 font-bold text-slate-800">
                  Personal Information
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {field("Application ID", getValue(selected.applicationId, selected._id))}
                  {field("Applicant Name", getValue(selected.applicantName, selected.name))}
                  {field("Mobile", getValue(selected.mobileNumber, selected.mobile, selected.phone))}
                  {field("Email", getValue(selected.emailAddress, selected.email))}
                  {field("Address", selected.address)}
                  {field("Position", getValue(selected.applyFor, selected.position))}
                  {field("Branch", getValue(selected.applyBranch, selected.branch))}
                  {field(
                    "Application Date",
                    selected.createdAt
                      ? new Date(selected.createdAt).toLocaleString("en-IN")
                      : "-"
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-bold text-slate-800">
                  Qualification
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {field("Highest Qualification", selected.highestQualification)}
                  {field(
                    "Passing Year",
                    getValue(selected.highestPassing, selected.passingYear)
                  )}
                  {field(
                    "Professional Qualification",
                    getProfessionalQualifications(selected)
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-3 font-bold text-slate-800">
                  Experience
                </h3>
                <div className="grid gap-3 sm:grid-cols-2">
                  {field("Employment Status", selected.employmentStatus)}
                  {field(
                    "Total Experience",
                    getValue(selected.experience, selected.totalExperience)
                  )}
                </div>

                {getWorkPlaces(selected).length > 0 && (
                  <div className="mt-4 space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700">
                      Previous Workplaces
                    </h4>

                    {getWorkPlaces(selected).map((work, index) => (
                      <div
                        key={index}
                        className="grid gap-3 rounded-xl border border-slate-200 p-3 sm:grid-cols-3"
                      >
                        {field("Workplace", work.workplace)}
                        {field("From Year", getValue(work.fromYear, work.from))}
                        {field("To Year", getValue(work.toYear, work.to))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <h3 className="mb-3 font-bold text-slate-800">
                  Application Status
                </h3>

                <div className="flex flex-wrap gap-2">
                  {STATUSES.map((item) => (
                    <button
                      key={item}
                      disabled={updating || selected.status === item}
                      onClick={() => updateStatus(selected, item)}
                      className={`rounded-lg px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50 ${
                        selected.status === item
                          ? "bg-blue-600 text-white"
                          : "border border-slate-300 text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {item}
                    </button>
                  ))}
                </div>

                {updating && (
                  <p className="mt-2 text-xs text-slate-500">
                    Updating status...
                  </p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-3 border-t p-4">
              <button
                onClick={printApplication}
                className="rounded-xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-900"
              >
                Print Application
              </button>

              <button
                onClick={() => setSelected(null)}
                className="rounded-xl border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden !important;
          }

          #print-application,
          #print-application * {
            visibility: visible !important;
          }

          #print-application {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            padding: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}
