"use client";

import { useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const BASE_URL = API.replace("/api", "");

export default function ReportModal({ appointment, onClose }) {
  const [file, setFile] = useState(null);
  const [ipOpNo, setIpOpNo] = useState("");
  const [phone, setPhone] = useState("");
  const [patientName, setPatientName] = useState("");
  const [doctor, setDoctor] = useState("");

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!appointment) return;

    setPatientName(appointment.name || "");
    setPhone(appointment.phone || "");
    setDoctor(appointment.doctor || "");

    loadReports();
  }, [appointment]);

  const loadReports = async () => {
    if (!appointment?._id) return;

    try {
      setLoading(true);

      const res = await fetch(
        `${API}/reports/appointment/${appointment._id}`
      );

      const data = await res.json();

      if (data.success) {
        setReports(data.data || []);
      }
    } catch (error) {
      console.error("Fetch reports error:", error);
    } finally {
      setLoading(false);
    }
  };

  const uploadReport = async () => {
    if (!ipOpNo.trim()) {
      alert("Please enter IP/OP No");
      return;
    }

    if (!phone.trim()) {
      alert("Please enter mobile number");
      return;
    }

    if (!file) {
      alert("Please select PDF/Image file");
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("appointmentId", appointment?._id || "");
      formData.append("patientName", patientName);
      formData.append("ipOpNo", ipOpNo);
      formData.append("phone", phone);
      formData.append("doctor", doctor);
      formData.append("file", file);

      const res = await fetch(`${API}/reports`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Report upload failed");
        return;
      }

      alert("Report uploaded successfully");

      setFile(null);
      setIpOpNo("");

      await loadReports();
    } catch (error) {
      console.error("Upload report error:", error);
      alert("Server error while uploading report");
    } finally {
      setUploading(false);
    }
  };

  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl">

        {/* Header */}
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-sky-950">
              Patient Reports
            </h2>

            <p className="text-sm text-gray-500">
              {appointment.name} • {appointment.phone}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white"
          >
            Close
          </button>
        </div>

        {/* Patient Information */}
        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
          <p className="font-bold text-sky-950">Patient</p>
          <p className="text-gray-600">{appointment.name}</p>

          <p className="mt-3 font-bold text-sky-950">Mobile</p>
          <p className="text-gray-600">{appointment.phone}</p>

          <p className="mt-3 font-bold text-sky-950">Doctor</p>
          <p className="text-gray-600">
            {appointment.doctor || "N/A"}
          </p>
        </div>

        {/* Upload */}
        <div className="mt-5 rounded-2xl border border-sky-100 bg-white">

          <div className="border-b border-sky-100 p-4">
            <h3 className="font-extrabold text-sky-950">
              Upload New Report
            </h3>
          </div>

          <div className="space-y-4 p-4">

            {/* IP / OP */}
            <div>
              <label className="mb-2 block font-bold text-sky-950">
                IP / OP No
              </label>

              <input
                type="text"
                value={ipOpNo}
                onChange={(e) => setIpOpNo(e.target.value)}
                placeholder="Example: I-2627/6640"
                className="w-full rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="mb-2 block font-bold text-sky-950">
                Mobile No
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            {/* File */}
            <div>
              <label className="mb-2 block font-bold text-sky-950">
                Upload Report PDF / Image
              </label>

              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) =>
                  setFile(e.target.files?.[0] || null)
                }
                className="w-full rounded-2xl border border-sky-100 px-4 py-3 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-700 file:px-4 file:py-2 file:text-white"
              />

              <p className="mt-2 text-xs text-gray-500">
                Allowed: PDF, JPG, JPEG, PNG • Maximum 10 MB
              </p>
            </div>

            {/* Upload Button */}
            <button
              type="button"
              onClick={uploadReport}
              disabled={uploading}
              className="w-full rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 py-4 font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {uploading ? "Uploading..." : "Upload Report"}
            </button>
          </div>
        </div>

        {/* Existing Reports */}
        <div className="mt-6">
          <h3 className="mb-3 text-lg font-extrabold text-sky-950">
            Uploaded Reports
          </h3>

          {loading ? (
            <div className="rounded-2xl bg-sky-50 p-5 text-center text-gray-500">
              Loading reports...
            </div>
          ) : reports.length === 0 ? (
            <div className="rounded-2xl bg-sky-50 p-5 text-center text-gray-500">
              No reports uploaded yet.
            </div>
          ) : (
            <div className="space-y-3">
              {reports.map((report) => {
                const fileUrl = `${BASE_URL}${report.file}`;

                return (
                  <div
                    key={report._id}
                    className="rounded-2xl border border-green-100 bg-green-50 p-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="font-bold text-green-800">
                          {report.fileType} Report
                        </p>

                        <p className="text-sm text-gray-600">
                          IP/OP: {report.ipOpNo}
                        </p>

                        <p className="text-sm text-gray-600">
                          {new Date(
                            report.createdAt
                          ).toLocaleDateString("en-IN")}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <a
                          href={fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="rounded-xl bg-slate-700 px-4 py-2 font-bold text-white"
                        >
                          View
                        </a>

                        <a
                          href={fileUrl}
                          download
                          className="rounded-xl bg-green-600 px-4 py-2 font-bold text-white"
                        >
                          Download
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}