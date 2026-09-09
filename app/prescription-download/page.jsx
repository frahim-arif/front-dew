"use client";

import { useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const BASE_URL = API.replace("/api", "");

export default function PrescriptionDownloadPage() {
  const [phone, setPhone] = useState("");
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const searchPrescriptions = async (e) => {
    e.preventDefault();

    if (!phone) {
      alert("Please enter phone number");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);

      const res = await fetch(
        `${API}/prescriptions/search?phone=${encodeURIComponent(phone)}`
      );

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Unable to fetch prescriptions");
        return;
      }

      setPrescriptions(data.data || []);
    } catch (err) {
      console.error(err);
      alert("Server error while fetching prescriptions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      <section className="bg-gradient-to-br from-sky-950 via-sky-800 to-cyan-700 py-20 text-white">
        <div className="mx-auto max-w-5xl px-4 text-center">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold">
            Prescription
          </span>

          <h1 className="mt-5 text-4xl font-extrabold md:text-6xl">
            Download Prescription
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sky-100">
            Enter your registered mobile number to view and download your
            prescription.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="rounded-[2rem] border border-sky-100 bg-white p-6 shadow-2xl md:p-8">
          <form
            onSubmit={searchPrescriptions}
            className="grid gap-4 md:grid-cols-[1fr_auto]"
          >
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter registered mobile number"
              className="rounded-2xl border border-sky-100 px-5 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />

            <button
              disabled={loading}
              className="rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 px-8 py-4 font-extrabold text-white disabled:opacity-60"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          <div className="mt-8">
            {!searched ? (
              <div className="rounded-2xl bg-sky-50 p-6 text-center text-gray-500">
                Search with your phone number to find prescriptions.
              </div>
            ) : prescriptions.length === 0 ? (
              <div className="rounded-2xl bg-red-50 p-6 text-center font-bold text-red-600">
                No prescription found for this phone number.
              </div>
            ) : (
              <div className="grid gap-5">
                {prescriptions.map((item) => {
                  const fileUrl = `${BASE_URL}${item.file}`;

                  return (
                    <div
                      key={item._id}
                      className="rounded-3xl border border-sky-100 bg-sky-50 p-5"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                          <h3 className="text-xl font-extrabold text-sky-950">
                            {item.patientName}
                          </h3>

                          <div className="mt-2 space-y-1 text-sm text-gray-600">
                            <p>📞 {item.phone}</p>
                            <p>👨‍⚕️ {item.doctor || "Doctor N/A"}</p>
                            <p>
                              📅{" "}
                              {new Date(item.createdAt).toLocaleDateString(
                                "en-IN"
                              )}
                            </p>
                            <p>📄 {item.fileType}</p>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                          <a
                            href={fileUrl}
                            target="_blank"
                            className="rounded-xl bg-slate-700 px-5 py-3 font-bold text-white"
                          >
                            View
                          </a>

                          <a
                            href={fileUrl}
                            download
                            className="rounded-xl bg-green-600 px-5 py-3 font-bold text-white"
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
      </section>
    </main>
  );
}