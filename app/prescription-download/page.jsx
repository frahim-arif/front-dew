"use client";

import { useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const BASE_URL = API.replace("/api", "");

export default function ReportDownloadPage() {
  const [ipOpNo, setIpOpNo] = useState("");
  const [phone, setPhone] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchReports = async (e) => {
    e.preventDefault();

    const cleanIpOpNo = ipOpNo.trim();
    const cleanPhone = phone.trim();

    if (!cleanIpOpNo) {
      alert("Please enter IP/OP number");
      return;
    }

    if (!cleanPhone) {
      alert("Please enter mobile number");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      setReports([]);

      const res = await fetch(
        `${API}/reports/search?ipOpNo=${encodeURIComponent(
          cleanIpOpNo
        )}&phone=${encodeURIComponent(cleanPhone)}`,
        {
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || "Unable to fetch reports");
        return;
      }

      setReports(data.data || []);
    } catch (error) {
      console.error("Search reports error:", error);
      alert("Server error while fetching reports");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      {/* Header */}
      <section className="bg-gradient-to-br from-sky-950 via-sky-800 to-cyan-700 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold">
            Medical Reports
          </span>

          <h1 className="mt-5 text-4xl font-extrabold md:text-6xl">
            Download Reports
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sky-100">
            Enter your IP/OP number and registered mobile number
            to view and download your medical reports.
          </p>
        </div>
      </section>

      {/* Search Section */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-2xl md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-sky-950">
              Find Your Report
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Enter the same IP/OP number and mobile number
              provided to the hospital.
            </p>
          </div>

          <form
            onSubmit={searchReports}
            className="grid gap-4 md:grid-cols-3"
          >
            {/* IP / OP */}
            <div>
              <label className="mb-2 block text-sm font-bold text-sky-950">
                IP / OP No
              </label>

              <input
                type="text"
                value={ipOpNo}
                onChange={(e) => setIpOpNo(e.target.value)}
                placeholder="Example: I-2627/6640"
                className="w-full rounded-2xl border border-sky-100 px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            {/* Mobile */}
            <div>
              <label className="mb-2 block text-sm font-bold text-sky-950">
                Registered Mobile No
              </label>

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter mobile number"
                className="w-full rounded-2xl border border-sky-100 px-5 py-4 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            {/* Search */}
            <div className="flex items-end">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 px-8 py-4 font-extrabold text-white transition hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Searching..." : "Search Report"}
              </button>
            </div>
          </form>

          {/* Results */}
          <div className="mt-8">
            {!searched ? (
              <div className="rounded-2xl bg-sky-50 p-6 text-center text-gray-500">
                Enter your IP/OP number and mobile number to
                find your reports.
              </div>
            ) : reports.length === 0 ? (
              <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-center">
                <p className="font-extrabold text-red-600">
                  No report found.
                </p>

                <p className="mt-2 text-sm text-red-500">
                  Please check your IP/OP number and mobile
                  number and try again.
                </p>
              </div>
            ) : (
              <div>
                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-xl font-extrabold text-sky-950">
                      Your Reports
                    </h3>

                    <p className="text-sm text-gray-500">
                      {reports.length} report
                      {reports.length !== 1 ? "s" : ""} found
                    </p>
                  </div>

                  <div className="rounded-xl bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                    Verified by IP/OP + Mobile
                  </div>
                </div>

                <div className="grid gap-5">
                  {reports.map((item) => {
                    const fileUrl = `${BASE_URL}${item.file}`;

                    return (
                      <div
                        key={item._id}
                        className="rounded-3xl border border-sky-100 bg-sky-50 p-5"
                      >
                        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                          {/* Report Information */}
                          <div>
                            <h4 className="text-xl font-extrabold text-sky-950">
                              {item.patientName ||
                                "Patient Report"}
                            </h4>

                            <div className="mt-3 space-y-1.5 text-sm text-gray-600">
                              <p>
                                📋{" "}
                                <strong>IP/OP No:</strong>{" "}
                                {item.ipOpNo}
                              </p>

                              <p>
                                📞{" "}
                                <strong>Mobile:</strong>{" "}
                                {item.phone}
                              </p>

                              <p>
                                👨‍⚕️{" "}
                                <strong>Doctor:</strong>{" "}
                                {item.doctor || "Doctor N/A"}
                              </p>

                              <p>
                                📄{" "}
                                <strong>File:</strong>{" "}
                                {item.fileType}
                              </p>

                              <p>
                                📅{" "}
                                <strong>Date:</strong>{" "}
                                {item.createdAt
                                  ? new Date(
                                      item.createdAt
                                    ).toLocaleDateString(
                                      "en-IN"
                                    )
                                  : "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Buttons */}
                          <div className="flex flex-wrap gap-3">
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl bg-slate-700 px-5 py-3 font-bold text-white transition hover:bg-slate-800"
                            >
                              View
                            </a>

                            <a
                              href={fileUrl}
                              download
                              className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white transition hover:bg-green-700"
                            >
                              Download
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}