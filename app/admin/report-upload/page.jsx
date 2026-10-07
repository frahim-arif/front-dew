"use client";

import { useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

export default function AdminReportUploadPage() {
  const [patientName, setPatientName] = useState("");
  const [ipOpNo, setIpOpNo] = useState("");
  const [phone, setPhone] = useState("");
  const [doctor, setDoctor] = useState("");
  const [appointmentId, setAppointmentId] = useState("");
  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const uploadReport = async (e) => {
    e.preventDefault();

    setSuccessMessage("");
    setErrorMessage("");

    const cleanPatientName = patientName.trim();
    const cleanIpOpNo = ipOpNo.trim();
    const cleanPhone = phone.trim();
    const cleanDoctor = doctor.trim();
    const cleanAppointmentId = appointmentId.trim();

    if (!cleanPatientName) {
      setErrorMessage("Please enter patient name.");
      return;
    }

    if (!cleanIpOpNo) {
      setErrorMessage("Please enter IP/OP No.");
      return;
    }

    if (!cleanPhone) {
      setErrorMessage("Please enter mobile number.");
      return;
    }

    if (!file) {
      setErrorMessage("Please select a report file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage(
        "File size must be less than or equal to 10 MB."
      );
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append("patientName", cleanPatientName);
      formData.append("ipOpNo", cleanIpOpNo);
      formData.append("phone", cleanPhone);
      formData.append("doctor", cleanDoctor);

      // Optional for online appointment.
      // Offline patient ke liye empty rahega.
      if (cleanAppointmentId) {
        formData.append(
          "appointmentId",
          cleanAppointmentId
        );
      }

      formData.append("file", file);

      const res = await fetch(`${API}/reports`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Report upload failed."
        );
      }

      setSuccessMessage(
        "✅ Report uploaded successfully."
      );

      // Reset form
      setPatientName("");
      setIpOpNo("");
      setPhone("");
      setDoctor("");
      setAppointmentId("");
      setFile(null);

      // Reset file input
      const fileInput =
        document.getElementById("report-file");

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error("Admin report upload error:", error);

      setErrorMessage(
        error.message ||
          "Server error while uploading report."
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Page Header */}
      <div className="mb-8">
        <p className="font-bold text-cyan-700">
          Patient Reports
        </p>

        <h1 className="mt-2 text-3xl font-extrabold text-sky-950 md:text-4xl">
          Upload Report
        </h1>

        <p className="mt-2 max-w-2xl text-gray-500">
          Online appointment patient ya offline patient,
          dono ke medical reports yahan se upload kar sakte
          hain.
        </p>
      </div>

      {/* Information Box */}
      <div className="mb-6 rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
        <h2 className="font-extrabold text-sky-950">
          Important
        </h2>

        <ul className="mt-3 space-y-2 text-sm text-gray-600">
          <li>
            • IP/OP No aur mobile number required hai.
          </li>

          <li>
            • Online appointment ho to Appointment ID
              optional hai.
          </li>

          <li>
            • Offline patient ke liye Appointment ID blank
              chhod sakte hain.
          </li>

          <li>
            • PDF, JPG, JPEG aur PNG files allowed hain.
          </li>

          <li>
            • Maximum file size 10 MB hai.
          </li>
        </ul>
      </div>

      {/* Form */}
      <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl md:p-8">
        <form
          onSubmit={uploadReport}
          className="space-y-6"
        >
          {/* Patient Name */}
          <div>
            <label
              htmlFor="patient-name"
              className="mb-2 block font-bold text-sky-950"
            >
              Patient Name *
            </label>

            <input
              id="patient-name"
              type="text"
              value={patientName}
              onChange={(e) =>
                setPatientName(e.target.value)
              }
              placeholder="Enter patient name"
              className="w-full rounded-2xl border border-sky-100 bg-white px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          {/* IP/OP + Mobile */}
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label
                htmlFor="ip-op-no"
                className="mb-2 block font-bold text-sky-950"
              >
                IP / OP No *
              </label>

              <input
                id="ip-op-no"
                type="text"
                value={ipOpNo}
                onChange={(e) =>
                  setIpOpNo(e.target.value)
                }
                placeholder="Example: I-2627/6640"
                className="w-full rounded-2xl border border-sky-100 bg-white px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="mb-2 block font-bold text-sky-950"
              >
                Mobile Number *
              </label>

              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="Enter mobile number"
                className="w-full rounded-2xl border border-sky-100 bg-white px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </div>
          </div>

          {/* Doctor */}
          <div>
            <label
              htmlFor="doctor"
              className="mb-2 block font-bold text-sky-950"
            >
              Doctor
            </label>

            <input
              id="doctor"
              type="text"
              value={doctor}
              onChange={(e) =>
                setDoctor(e.target.value)
              }
              placeholder="Enter doctor name"
              className="w-full rounded-2xl border border-sky-100 bg-white px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />
          </div>

          {/* Appointment ID */}
          <div>
            <label
              htmlFor="appointment-id"
              className="mb-2 block font-bold text-sky-950"
            >
              Appointment ID
              <span className="ml-2 text-sm font-normal text-gray-400">
                (Optional)
              </span>
            </label>

            <input
              id="appointment-id"
              type="text"
              value={appointmentId}
              onChange={(e) =>
                setAppointmentId(e.target.value)
              }
              placeholder="Online appointment ho to Appointment ID enter karein"
              className="w-full rounded-2xl border border-sky-100 bg-white px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />

            <p className="mt-2 text-xs text-gray-500">
              Offline patient ke liye is field ko blank
              chhod sakte hain.
            </p>
          </div>

          {/* File */}
          <div>
            <label
              htmlFor="report-file"
              className="mb-2 block font-bold text-sky-950"
            >
              Report File *
            </label>

            <input
              id="report-file"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={(e) =>
                setFile(e.target.files?.[0] || null)
              }
              className="w-full rounded-2xl border border-sky-100 bg-white px-4 py-3 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-700 file:px-4 file:py-2 file:font-bold file:text-white"
            />

            <p className="mt-2 text-xs text-gray-500">
              PDF, JPG, JPEG, PNG • Maximum 10 MB
            </p>

            {file && (
              <p className="mt-2 text-sm font-semibold text-green-700">
                Selected: {file.name}
              </p>
            )}
          </div>

          {/* Success */}
          {successMessage && (
            <div className="rounded-2xl border border-green-200 bg-green-50 p-4 font-bold text-green-700">
              {successMessage}
            </div>
          )}

          {/* Error */}
          {errorMessage && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-4 font-bold text-red-600">
              {errorMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={uploading}
            className="w-full rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 px-6 py-4 font-extrabold text-white shadow-lg transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading
              ? "Uploading Report..."
              : "Upload Report"}
          </button>
        </form>
      </div>
    </div>
  );
}