"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BASE_URL = API.replace("/api", "");

export default function PrescriptionModal({ appointment, onClose }) {
  const [file, setFile] = useState(null);
  const [prescription, setPrescription] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchPrescription = async () => {
    try {
      const res = await fetch(`${API}/prescriptions/appointment/${appointment._id}`);
      const data = await res.json();

      if (data.success) {
        setPrescription(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (appointment?._id) fetchPrescription();
  }, [appointment]);

  const uploadPrescription = async () => {
    if (!file) {
      alert("Please select PDF/Image file");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("appointmentId", appointment._id);
      formData.append("file", file);

      const res = await fetch(`${API}/prescriptions`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Upload failed");
        return;
      }

      alert("Prescription uploaded successfully");
      setFile(null);
      fetchPrescription();
    } catch (err) {
      console.error(err);
      alert("Server error while uploading prescription");
    } finally {
      setLoading(false);
    }
  };

  const fileUrl = prescription?.file
    ? `${BASE_URL}${prescription.file}`
    : "";

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-extrabold text-sky-950">
              Prescription
            </h2>
            <p className="text-sm text-gray-500">
              {appointment.name} • {appointment.phone}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white"
          >
            Close
          </button>
        </div>

        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
          <p className="font-bold text-sky-950">Doctor</p>
          <p className="text-gray-600">{appointment.doctor || "N/A"}</p>

          <p className="mt-3 font-bold text-sky-950">Department</p>
          <p className="text-gray-600">{appointment.department || "N/A"}</p>
        </div>

        <div className="mt-5">
          <label className="mb-2 block font-bold text-sky-950">
            Upload Prescription PDF/Image
          </label>

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full rounded-2xl border border-sky-100 px-4 py-3 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-700 file:px-4 file:py-2 file:text-white"
          />

          <button
            onClick={uploadPrescription}
            disabled={loading}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 py-4 font-extrabold text-white disabled:opacity-60"
          >
            {loading ? "Uploading..." : "Upload Prescription"}
          </button>
        </div>

        {prescription && (
          <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 p-4">
            <p className="font-bold text-green-700">
              Prescription uploaded
            </p>

            <div className="mt-4 flex flex-wrap gap-3">
              <a
                href={fileUrl}
                target="_blank"
                className="rounded-xl bg-slate-700 px-4 py-3 font-bold text-white"
              >
                View
              </a>

              <a
                href={fileUrl}
                download
                className="rounded-xl bg-green-600 px-4 py-3 font-bold text-white"
              >
                Download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}