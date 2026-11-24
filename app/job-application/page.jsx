
"use client";

import { useState } from "react";

const API = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api"
).replace(/\/+$/, "");

const positions = [
  "Nurse",
  "Ward Boy",
  "OT Technician",
  "ICU Technician",
  "Cleaner",
  "Ward Girl",
  "Office Assistant",
  "Pharmacist",
  "Lab Technician",
  "Others",
];

const branches = [
  "Dew Care Hospital & Research Centre, Nagaon",
  "Dew Care Hospital LLP, Burigaon/Kharupetia",
  "Dew Care Hospital & Research Centre, Gotlang/Tezpur (Coming Soon)",
];

const emptyForm = {
  applyFor: "",
  applyBranch: "",
  applicantName: "",
  mobileNumber: "",
  emailAddress: "",
  address: "",
  highestQualification: "",
  highestPassing: "",
  professionalQualifications: [
    { qualification: "", yearOfPassing: "" },
  ],
  employmentStatus: "",
  experience: "",
  workPlaces: [
    { workplace: "", fromYear: "", toYear: "" },
  ],
};

export default function JobApplicationPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [applicationId, setApplicationId] = useState("");
  const [success, setSuccess] = useState(false);

  const change = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateList = (field, index, key, value) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) =>
        i === index ? { ...item, [key]: value } : item
      ),
    }));
  };

  const addItem = (field, item) => {
    setForm((prev) => ({
      ...prev,
      [field]: [...prev[field], item],
    }));
  };

  const removeItem = (field, index) => {
    setForm((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  async function submitApplication(e) {
    e.preventDefault();
    setMessage("");
    setApplicationId("");

    if (!/^[0-9]{10}$/.test(form.mobileNumber)) {
      setMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (form.applyBranch.includes("Coming Soon")) {
      setMessage("Applications for this branch are not open yet.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...form,
        professionalQualifications:
          form.professionalQualifications.filter(
            (item) => item.qualification.trim()
          ),
        workPlaces:
          form.employmentStatus === "Experienced"
            ? form.workPlaces.filter((item) => item.workplace.trim())
            : [],
        experience:
          form.employmentStatus === "Experienced"
            ? form.experience
            : "",
      };

      const response = await fetch(`${API}/job-applications`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Application submission failed.");
      }

      setApplicationId(data.applicationId || "");
      setMessage("Your application has been submitted successfully.");
      setSuccess(true);
      setForm(emptyForm);

      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      setSuccess(false);
      setMessage(error.message || "Unable to submit application.");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100";

  const labelClass =
    "mb-2 block text-sm font-semibold text-slate-700";

  const sectionClass =
    "mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7";

  return (
    <main className="min-h-screen bg-[#f1f7f5] px-3 py-7 sm:px-5">
      <div className="mx-auto max-w-3xl">

        <header className="mb-7 text-center">
          <div className="mb-2 text-2xl font-black tracking-wide text-teal-800">
            DEW CARE HOSPITAL
          </div>

          <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
            Hospital & Research Centre
          </p>

          <h1 className="mt-5 text-2xl font-extrabold text-slate-900 sm:text-3xl">
            Career / Job Application Form
          </h1>

          <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Apply for a career opportunity at Dew Care Hospital.
            Please fill in all required details carefully.
          </p>
        </header>

        {message && (
          <div
            className={`mb-5 rounded-xl border p-4 text-sm ${
              success
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            <p className="font-semibold">{message}</p>
            {applicationId && (
              <p className="mt-2 font-bold">
                Your Application ID: {applicationId}
              </p>
            )}
          </div>
        )}

        {!success && (
          <>
            <div className="mb-5 rounded-xl border-l-4 border-teal-600 bg-teal-50 p-4 text-sm leading-6 text-teal-900">
              <strong>Important:</strong> Fields marked with * are
              compulsory. Please provide accurate information.
            </div>

            <form onSubmit={submitApplication}>

              <section className={sectionClass}>
                <h2 className="mb-5 text-lg font-bold text-teal-800">
                  01. Position & Branch Details
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Apply For *</label>
                    <select
                      className={inputClass}
                      required
                      value={form.applyFor}
                      onChange={(e) => change("applyFor", e.target.value)}
                    >
                      <option value="">Select Position</option>
                      {positions.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={labelClass}>Apply Which Branch *</label>
                    <select
                      className={inputClass}
                      required
                      value={form.applyBranch}
                      onChange={(e) => change("applyBranch", e.target.value)}
                    >
                      <option value="">Select Branch</option>
                      {branches.map((v) => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              <section className={sectionClass}>
                <h2 className="mb-5 text-lg font-bold text-teal-800">
                  02. Personal Information
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>Applicant Name *</label>
                    <input
                      className={inputClass}
                      required
                      value={form.applicantName}
                      onChange={(e) => change("applicantName", e.target.value)}
                      placeholder="Full name"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Mobile Number *</label>
                    <input
                      className={inputClass}
                      required
                      inputMode="numeric"
                      type="tel"
                      maxLength={10}
                      value={form.mobileNumber}
                      onChange={(e) =>
                        change(
                          "mobileNumber",
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      placeholder="10-digit mobile number"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Email Address</label>
                    <input
                      className={inputClass}
                      type="email"
                      value={form.emailAddress}
                      onChange={(e) => change("emailAddress", e.target.value)}
                      placeholder="Email address"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Full Address *</label>
                    <textarea
                      className={inputClass}
                      required
                      rows={3}
                      value={form.address}
                      onChange={(e) => change("address", e.target.value)}
                      placeholder="Your complete address"
                    />
                  </div>
                </div>
              </section>

              <section className={sectionClass}>
                <h2 className="mb-5 text-lg font-bold text-teal-800">
                  03. Educational Qualification
                </h2>

                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Highest Qualification *
                    </label>
                    <input
                      className={inputClass}
                      required
                      value={form.highestQualification}
                      onChange={(e) =>
                        change("highestQualification", e.target.value)
                      }
                      placeholder="e.g. HS, Graduate"
                    />
                  </div>

                  <div>
                    <label className={labelClass}>Year of Passing *</label>
                    <input
                      className={inputClass}
                      required
                      value={form.highestPassing}
                      onChange={(e) => change("highestPassing", e.target.value)}
                      placeholder="e.g. 2022"
                    />
                  </div>
                </div>
              </section>

              <section className={sectionClass}>
                <h2 className="mb-5 text-lg font-bold text-teal-800">
                  04. Professional Qualification
                </h2>

                {form.professionalQualifications.map((item, index) => (
                  <div
                    key={index}
                    className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className={labelClass}>
                          Professional Qualification
                        </label>
                        <input
                          className={inputClass}
                          value={item.qualification}
                          onChange={(e) =>
                            updateList(
                              "professionalQualifications",
                              index,
                              "qualification",
                              e.target.value
                            )
                          }
                          placeholder="e.g. GNM, B.Sc Nursing"
                        />
                      </div>

                      <div>
                        <label className={labelClass}>Year of Passing</label>
                        <input
                          className={inputClass}
                          value={item.yearOfPassing}
                          onChange={(e) =>
                            updateList(
                              "professionalQualifications",
                              index,
                              "yearOfPassing",
                              e.target.value
                            )
                          }
                          placeholder="Passing year"
                        />
                      </div>
                    </div>

                    {index > 0 && (
                      <button
                        type="button"
                        className="mt-3 text-xs font-bold text-red-600"
                        onClick={() =>
                          removeItem("professionalQualifications", index)
                        }
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}

                <button
                  type="button"
                  className="rounded-lg bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-800"
                  onClick={() =>
                    addItem("professionalQualifications", {
                      qualification: "",
                      yearOfPassing: "",
                    })
                  }
                >
                  + Add Qualification
                </button>
              </section>

              <section className={sectionClass}>
                <h2 className="mb-5 text-lg font-bold text-teal-800">
                  05. Employment Details
                </h2>

                <label className={labelClass}>Employment Status *</label>

                <div className="mb-6 flex flex-wrap gap-6">
                  {["Fresher", "Experienced"].map((v) => (
                    <label
                      key={v}
                      className="flex cursor-pointer items-center gap-2 text-sm font-semibold"
                    >
                      <input
                        type="radio"
                        name="employmentStatus"
                        required
                        checked={form.employmentStatus === v}
                        onChange={() => change("employmentStatus", v)}
                        className="h-4 w-4 accent-teal-700"
                      />
                      {v}
                    </label>
                  ))}
                </div>

                {form.employmentStatus === "Experienced" && (
                  <>
                    <div className="mb-5">
                      <label className={labelClass}>
                        Total Work Experience
                      </label>
                      <input
                        className={inputClass}
                        value={form.experience}
                        onChange={(e) => change("experience", e.target.value)}
                        placeholder="e.g. 2 Years"
                      />
                    </div>

                    <h3 className="mb-4 font-bold text-slate-800">
                      Previous Workplace Details
                    </h3>

                    {form.workPlaces.map((item, index) => (
                      <div
                        key={index}
                        className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
                      >
                        <div className="grid gap-4 sm:grid-cols-3">
                          <div>
                            <label className={labelClass}>
                              Workplace / Hospital
                            </label>
                            <input
                              className={inputClass}
                              value={item.workplace}
                              onChange={(e) =>
                                updateList(
                                  "workPlaces",
                                  index,
                                  "workplace",
                                  e.target.value
                                )
                              }
                              placeholder="Workplace name"
                            />
                          </div>

                          <div>
                            <label className={labelClass}>From Year</label>
                            <input
                              className={inputClass}
                              value={item.fromYear}
                              onChange={(e) =>
                                updateList(
                                  "workPlaces",
                                  index,
                                  "fromYear",
                                  e.target.value
                                )
                              }
                              placeholder="2021"
                            />
                          </div>

                          <div>
                            <label className={labelClass}>To Year</label>
                            <input
                              className={inputClass}
                              value={item.toYear}
                              onChange={(e) =>
                                updateList(
                                  "workPlaces",
                                  index,
                                  "toYear",
                                  e.target.value
                                )
                              }
                              placeholder="2024 / Present"
                            />
                          </div>
                        </div>

                        {index > 0 && (
                          <button
                            type="button"
                            className="mt-3 text-xs font-bold text-red-600"
                            onClick={() => removeItem("workPlaces", index)}
                          >
                            Remove Workplace
                          </button>
                        )}
                      </div>
                    ))}

                    <button
                      type="button"
                      className="rounded-lg bg-teal-50 px-4 py-2.5 text-sm font-bold text-teal-800"
                      onClick={() =>
                        addItem("workPlaces", {
                          workplace: "",
                          fromYear: "",
                          toYear: "",
                        })
                      }
                    >
                      + Add Workplace
                    </button>
                  </>
                )}
              </section>

              <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5">
                <p className="text-sm leading-6 text-slate-600">
                  I hereby declare that all the information provided
                  above is true and correct to the best of my knowledge.
                </p>
              </section>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-teal-800 px-5 py-4 text-base font-bold text-white shadow-lg transition hover:bg-teal-900 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Submitting Application..." : "Submit Application"}
              </button>
            </form>
          </>
        )}

        {success && (
          <div className="rounded-2xl border border-green-200 bg-white p-8 text-center shadow-sm">
            <div className="text-5xl">✓</div>
            <h2 className="mt-4 text-xl font-extrabold text-green-800">
              Application Submitted!
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Thank you for applying to Dew Care Hospital.
              Your application has been received successfully.
            </p>

            <div className="mt-5 rounded-xl bg-green-50 p-4">
              <p className="text-xs text-green-700">Application ID</p>
              <p className="mt-1 text-lg font-extrabold text-green-900">
                {applicationId}
              </p>
            </div>

            <button
              onClick={() => {
                setSuccess(false);
                setMessage("");
                setApplicationId("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="mt-6 rounded-xl bg-teal-800 px-6 py-3 text-sm font-bold text-white"
            >
              Submit Another Application
            </button>
          </div>
        )}

        <footer className="mt-7 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} Dew Care Hospital. All Rights Reserved.
        </footer>
      </div>
    </main>
  );
}
