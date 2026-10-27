
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { siteInfo } from "../data/siteData";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

/* ==================================================
   API RESPONSE HELPERS
================================================== */

const isApiSuccess = (result) =>
  result?.success === true || result?._status === true;

const getApiMessage = (result, fallback) =>
  result?.message || result?._message || fallback;

const getApiData = (result) =>
  result?.data ?? result?._data ?? result?.appointment ?? result;

/* ==================================================
   RAZORPAY SCRIPT LOADER
================================================== */

const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const scriptUrl =
      "https://checkout.razorpay.com/v1/checkout.js";

    const existingScript = document.querySelector(
      `script[src="${scriptUrl}"]`
    );

    if (existingScript) {
      const handleLoad = () => {
        cleanup();
        resolve(!!window.Razorpay);
      };

      const handleError = () => {
        cleanup();
        resolve(false);
      };

      const cleanup = () => {
        existingScript.removeEventListener("load", handleLoad);
        existingScript.removeEventListener("error", handleError);
      };

      existingScript.addEventListener("load", handleLoad);
      existingScript.addEventListener("error", handleError);

      return;
    }

    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;

    script.onload = () => resolve(!!window.Razorpay);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });

/* ==================================================
   INDIA TODAY DATE
================================================== */

const getTodayDate = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());

/* ==================================================
   EMPTY FORM
================================================== */

const getEmptyForm = () => ({
  name: "",
  phone: "",
  email: "",
  age: "",
  gender: "",
  doctor: "",
  department: "",
  date: getTodayDate(),
  time: "",
  message: "",
});

/* ==================================================
   APPOINTMENT PAGE
================================================== */

export default function AppointmentPage() {
  const router = useRouter();

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [form, setForm] = useState(getEmptyForm());

  /* ==================================================
     FETCH DOCTORS
  ================================================== */

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);

        const response = await fetch(`${API_URL}/doctors`, {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok || !isApiSuccess(result)) {
          throw new Error(
            getApiMessage(result, "Unable to fetch doctors.")
          );
        }

        const data = getApiData(result);

        const activeDoctors = (Array.isArray(data) ? data : []).filter(
          (doctor) =>
            String(doctor?.status || "").trim().toLowerCase() ===
            "active"
        );

        setDoctors(activeDoctors);
      } catch (error) {
        console.error("FETCH DOCTORS ERROR:", error);
        setDoctors([]);

        setMessage({
          type: "error",
          text: "Doctors load nahi ho paaye. Please try again.",
        });
      } finally {
        setLoadingDoctors(false);
      }
    };

    fetchDoctors();
  }, []);

  /* ==================================================
     DEPARTMENTS
  ================================================== */

  const departments = useMemo(() => {
    const values = doctors
      .map((doctor) => String(doctor?.department || "").trim())
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) =>
      a.localeCompare(b)
    );
  }, [doctors]);

  /* ==================================================
     FILTER DOCTORS
  ================================================== */

  const filteredDoctors = useMemo(() => {
    if (!form.department) return doctors;

    const department = form.department.trim().toLowerCase();

    return doctors.filter(
      (doctor) =>
        String(doctor?.department || "").trim().toLowerCase() ===
        department
    );
  }, [doctors, form.department]);

  /* ==================================================
     SELECTED DOCTOR
  ================================================== */

  const selectedDoctor = useMemo(
    () =>
      doctors.find(
        (doctor) => String(doctor?._id) === String(form.doctor)
      ) || null,
    [doctors, form.doctor]
  );

  const selectedDoctorFee = Number(selectedDoctor?.opdFee || 0);
  const doctorOpdDays = selectedDoctor?.opdDays || [];

  /* ==================================================
     HANDLE CHANGE
  ================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setMessage({ type: "", text: "" });

    setForm((previous) => {
      const next = { ...previous, [name]: value };

      if (name === "department") {
        next.doctor = "";
        next.time = "";
      }

      if (name === "doctor") {
        const doctor = doctors.find(
          (item) => String(item._id) === String(value)
        );

        next.department = doctor?.department || "";
        next.time = "";
      }

      return next;
    });
  };

  /* ==================================================
     FAILED PAYMENT
  ================================================== */

  const markPaymentFailed = async ({
    appointmentId,
    razorpayOrderId,
    errorCode = "",
    errorDescription = "",
  }) => {
    try {
      const response = await fetch(`${API_URL}/payments/failed`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          appointmentId,
          razorpay_order_id: razorpayOrderId,
          reason: `${errorCode}: ${errorDescription}`.trim(),
        }),
      });

      if (!response.ok) {
        console.error(
          "Failed-payment API returned:",
          response.status
        );
      }
    } catch (error) {
      console.error("FAILED PAYMENT UPDATE ERROR:", error);
    }
  };

  /* ==================================================
     SUBMIT APPOINTMENT
  ================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setMessage({ type: "", text: "" });

    /* BASIC VALIDATION */

    if (!form.name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter patient name.",
      });
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      setMessage({
        type: "error",
        text: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    if (!form.department) {
      setMessage({
        type: "error",
        text: "Please select a department.",
      });
      return;
    }

    if (!form.doctor) {
      setMessage({
        type: "error",
        text: "Please select a doctor.",
      });
      return;
    }

    if (!form.date || !form.time) {
      setMessage({
        type: "error",
        text: "Please select appointment date and time.",
      });
      return;
    }

    if (form.date < getTodayDate()) {
      setMessage({
        type: "error",
        text: "Past date appointment allowed nahi hai.",
      });
      return;
    }

    if (form.age) {
      const age = Number(form.age);

      if (!Number.isFinite(age) || age < 1 || age > 120) {
        setMessage({
          type: "error",
          text: "Please enter a valid age.",
        });
        return;
      }
    }

    if (!selectedDoctor) {
      setMessage({
        type: "error",
        text: "Selected doctor not found.",
      });
      return;
    }

    if (
      String(selectedDoctor.status || "").toLowerCase() !==
      "active"
    ) {
      setMessage({
        type: "error",
        text: "Selected doctor is currently unavailable.",
      });
      return;
    }

    if (selectedDoctor.opdAvailable === false) {
      setMessage({
        type: "error",
        text: "OPD is currently unavailable for this doctor.",
      });
      return;
    }

    if (
      !selectedDoctor.department ||
      !selectedDoctor._id ||
      !selectedDoctor.name
    ) {
      setMessage({
        type: "error",
        text: "Doctor details incomplete hain. Please select another doctor.",
      });
      return;
    }

    try {
      setSubmitting(true);

      setMessage({
        type: "success",
        text: "Secure payment prepare ho raha hai...",
      });

      /* LOAD RAZORPAY */

      const razorpayLoaded = await loadRazorpayScript();

      if (!razorpayLoaded) {
        throw new Error(
          "Razorpay load nahi ho saka. Internet connection check karein."
        );
      }

      /* APPOINTMENT DATA */

      const appointmentData = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        age: form.age ? Number(form.age) : null,
        gender: form.gender,
        doctor: selectedDoctor.name,
        doctorId: selectedDoctor._id,
        department: selectedDoctor.department,
        date: form.date,
        time: form.time,
        message: form.message.trim(),

        // Display/reference only. Backend must determine payment amount.
        doctorFee: selectedDoctorFee,
      };

      /* CREATE APPOINTMENT */

      const appointmentResponse = await fetch(
        `${API_URL}/appointments`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(appointmentData),
        }
      );

      const appointmentResult = await appointmentResponse.json();

      if (
        !appointmentResponse.ok ||
        !isApiSuccess(appointmentResult)
      ) {
        throw new Error(
          getApiMessage(
            appointmentResult,
            "Unable to create appointment."
          )
        );
      }

      const appointmentDataResult = getApiData(appointmentResult);

      const appointment =
        appointmentDataResult?.appointment ||
        appointmentDataResult?.data ||
        appointmentDataResult;

      const appointmentId =
        appointment?._id ||
        appointment?.id ||
        appointmentDataResult?.appointmentId;

      if (!appointmentId) {
        throw new Error(
          "Appointment create hui, lekin appointment ID receive nahi hua."
        );
      }

      /* CREATE PAYMENT ORDER */

      setMessage({
        type: "success",
        text: "Payment order create ho raha hai...",
      });

      const paymentResponse = await fetch(
        `${API_URL}/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ appointmentId }),
        }
      );

      const paymentResult = await paymentResponse.json();

      if (
        !paymentResponse.ok ||
        !isApiSuccess(paymentResult)
      ) {
        throw new Error(
          getApiMessage(
            paymentResult,
            "Unable to create payment order."
          )
        );
      }

      const orderData = getApiData(paymentResult);

      const razorpayOrderId =
        orderData?.orderId ||
        orderData?.id ||
        orderData?.order_id;

      const razorpayKey =
        orderData?.keyId ||
        orderData?.key ||
        process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

      const razorpayAmount = orderData?.amount;
      const razorpayCurrency = orderData?.currency || "INR";

      if (!razorpayOrderId || !razorpayKey || !razorpayAmount) {
        throw new Error(
          "Payment order response incomplete hai. Backend response check karein."
        );
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay checkout available nahi hai. Page refresh karein."
        );
      }

      /* RAZORPAY CHECKOUT */

      setMessage({
        type: "success",
        text: "Payment window open ho raha hai...",
      });

      const razorpayOptions = {
        key: razorpayKey,
        amount: razorpayAmount,
        currency: razorpayCurrency,
        name: "Dew Care Hospital",
        description: `Appointment with ${selectedDoctor.name}`,
        order_id: razorpayOrderId,

        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: form.phone.trim(),
        },

        notes: {
          appointmentId: String(appointmentId),
          doctorId: String(selectedDoctor._id),
          doctorName: selectedDoctor.name,
          appointmentDate: form.date,
          appointmentTime: form.time,
        },

        theme: {
          color: "#047857",
        },

        modal: {
          confirm_close: true,

          ondismiss: () => {
            setSubmitting(false);
            setMessage({
              type: "error",
              text:
                "Payment window close hui. Payment status confirm karne ke liye apna appointment status check karein.",
            });
          },
        },

        /* VERIFY PAYMENT ON SERVER */

        handler: async (razorpayResponse) => {
          try {
            setSubmitting(true);

            setMessage({
              type: "success",
              text: "Payment receive hui. Verification chal rahi hai...",
            });

            const verifyResponse = await fetch(
              `${API_URL}/payments/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  appointmentId,
                  razorpay_order_id:
                    razorpayResponse.razorpay_order_id,
                  razorpay_payment_id:
                    razorpayResponse.razorpay_payment_id,
                  razorpay_signature:
                    razorpayResponse.razorpay_signature,
                }),
              }
            );

            const verifyResult = await verifyResponse.json();

            if (
              !verifyResponse.ok ||
              !isApiSuccess(verifyResult)
            ) {
              throw new Error(
                getApiMessage(
                  verifyResult,
                  "Payment verification failed."
                )
              );
            }

            setMessage({
              type: "success",
              text:
                "Appointment booked successfully! Payment received.",
            });

            setForm(getEmptyForm());

            router.push(
              `/appointment/success?id=${encodeURIComponent(
                appointmentId
              )}`
            );
          } catch (error) {
            console.error("PAYMENT VERIFY ERROR:", error);

            setMessage({
              type: "error",
              text:
                error.message ||
                "Payment verification failed. Payment status check karein before retrying.",
            });
          } finally {
            setSubmitting(false);
          }
        },
      };

      const razorpay = new window.Razorpay(razorpayOptions);

      /* PAYMENT FAILED */

      razorpay.on("payment.failed", async (response) => {
        console.error("RAZORPAY PAYMENT FAILED:", response);

        const errorCode =
          response?.error?.code || "PAYMENT_FAILED";

        const errorDescription =
          response?.error?.description ||
          "Razorpay payment failed.";

        await markPaymentFailed({
          appointmentId,
          razorpayOrderId,
          errorCode,
          errorDescription,
        });

        setSubmitting(false);

        setMessage({
          type: "error",
          text: errorDescription,
        });
      });

      razorpay.open();

      // Do not set submitting=false here.
      // Keep it true while checkout is open.
    } catch (error) {
      console.error("APPOINTMENT PAYMENT ERROR:", error);

      setMessage({
        type: "error",
        text:
          error.message ||
          "Payment start karte waqt problem hui.",
      });

      setSubmitting(false);
    }
  };

  /* ==================================================
     INPUT CLASS
  ================================================== */

  const inputClass =
    "w-full border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 disabled:cursor-not-allowed disabled:bg-slate-100";

  /* ==================================================
     UI
  ================================================== */

  return (
    <main className="min-h-screen bg-[#f7faf9]">
      {/* HERO */}

      <section className="relative overflow-hidden bg-[#071c19]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,174,106,0.18),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.16),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
          <div className="max-w-3xl">
            <span className="mb-5 inline-flex border border-emerald-300/30 bg-emerald-400/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-emerald-100">
              Online Appointment
            </span>

            <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
              Book Your Appointment
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-emerald-50/80 sm:text-lg">
              Select your preferred doctor, date and time. Same-day aur
              future appointments available.
            </p>

            <div className="mt-7">
              <p className="inline-flex border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 backdrop-blur">
                {selectedDoctor
                  ? `Appointment Fee: ₹${selectedDoctorFee.toLocaleString("en-IN")}`
                  : "Select Doctor for Appointment Fee"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FORM */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div className="border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-black text-slate-900">
                Patient Details
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Please enter correct patient information.
              </p>
            </div>

            {message.text && (
              <div
                role="status"
                className={`mb-6 border px-4 py-3 text-sm font-semibold ${
                  message.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NAME / PHONE */}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Patient Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter patient name"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="10-digit mobile number"
                    maxLength={10}
                    inputMode="numeric"
                    className={inputClass}
                    required
                  />
                </div>
              </div>

              {/* EMAIL / AGE */}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Age
                  </label>
                  <input
                    type="number"
                    name="age"
                    value={form.age}
                    onChange={handleChange}
                    min="1"
                    max="120"
                    placeholder="Patient age"
                    className={inputClass}
                  />
                </div>
              </div>

              {/* GENDER */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Gender
                </label>
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="">Select gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* DEPARTMENT / DOCTOR */}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Department *
                  </label>
                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    disabled={loadingDoctors || departments.length === 0}
                    className={inputClass}
                    required
                  >
                    <option value="">
                      {loadingDoctors
                        ? "Loading Departments..."
                        : "Select Department"}
                    </option>

                    {departments.map((department) => (
                      <option key={department} value={department}>
                        {department}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Doctor *
                  </label>
                  <select
                    name="doctor"
                    value={form.doctor}
                    onChange={handleChange}
                    disabled={
                      loadingDoctors ||
                      !form.department ||
                      filteredDoctors.length === 0
                    }
                    className={inputClass}
                    required
                  >
                    <option value="">
                      {loadingDoctors
                        ? "Loading Doctors..."
                        : !form.department
                        ? "First Select Department"
                        : "Select Doctor"}
                    </option>

                    {filteredDoctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        {doctor.name}
                        {doctor.specialist
                          ? ` — ${doctor.specialist}`
                          : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* SELECTED DOCTOR */}

              {selectedDoctor && (
                <div className="border border-emerald-100 bg-emerald-50 p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                        Selected Doctor
                      </p>
                      <h3 className="mt-1 text-xl font-black text-slate-900">
                        {selectedDoctor.name}
                      </h3>
                      {selectedDoctor.specialist && (
                        <p className="mt-1 text-sm text-slate-600">
                          {selectedDoctor.specialist}
                        </p>
                      )}
                    </div>

                    <div className="sm:text-right">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                        OPD Fee
                      </p>
                      <p className="mt-1 text-2xl font-black text-emerald-700">
                        ₹{selectedDoctorFee.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {selectedDoctor.qualification && (
                    <p className="mt-4 text-sm text-slate-600">
                      <span className="font-bold">Qualification:</span>{" "}
                      {selectedDoctor.qualification}
                    </p>
                  )}

                  {selectedDoctor.experience && (
                    <p className="mt-1 text-sm text-slate-600">
                      <span className="font-bold">Experience:</span>{" "}
                      {selectedDoctor.experience}
                    </p>
                  )}
                </div>
              )}

              {/* DATE / TIME */}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Appointment Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={getTodayDate()}
                    className={inputClass}
                    required
                  />
                  <p className="mt-2 text-xs text-slate-500">
                    Same-day appointment bhi available hai.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Appointment Time *
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    min={selectedDoctor?.opdStartTime || undefined}
                    max={selectedDoctor?.opdEndTime || undefined}
                    className={inputClass}
                    required
                  />
                  {selectedDoctor && (
                    <p className="mt-2 text-xs text-slate-500">
                      OPD: {selectedDoctor.opdStartTime || "--"} -{" "}
                      {selectedDoctor.opdEndTime || "--"}
                    </p>
                  )}
                </div>
              </div>

              {/* OPD DAYS */}

              {selectedDoctor && doctorOpdDays.length > 0 && (
                <div className="border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    OPD Days
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {doctorOpdDays.map((day) => (
                      <span
                        key={day}
                        className="border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700"
                      >
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* MESSAGE */}

              <div>
                <label className="mb-2 block text-sm font-bold text-slate-700">
                  Message / Symptoms
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Briefly describe your concern..."
                  className={`${inputClass} resize-none`}
                />
              </div>

              {/* PAYMENT INFO */}

              {selectedDoctor && (
                <div className="border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-semibold text-slate-700">
                      Appointment Fee
                    </span>
                    <span className="text-2xl font-black text-emerald-700">
                      ₹{selectedDoctorFee.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Payment Razorpay ke through secure checkout par process
                    hoga.
                  </p>
                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                disabled={
                  submitting ||
                  loadingDoctors ||
                  !selectedDoctor
                }
                className="w-full bg-emerald-700 px-6 py-4 text-sm font-black uppercase tracking-wider text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting
                  ? "Processing..."
                  : selectedDoctor
                  ? `Pay ₹${selectedDoctorFee.toLocaleString("en-IN")} & Book Appointment`
                  : "Select Doctor"}
              </button>
            </form>
          </div>

          {/* SIDE INFO */}

          <aside className="h-fit border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-xl font-black text-slate-900">
              Appointment Information
            </h3>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Doctor Fee
                </p>
                <p className="mt-1 text-lg font-black text-emerald-700">
                  {selectedDoctor
                    ? `₹${selectedDoctorFee.toLocaleString("en-IN")}`
                    : "Select doctor"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Appointment
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Same-day and future appointments can be requested.
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Payment
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Secure online payment through Razorpay.
                </p>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Hospital
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Dew Care Hospital LLP
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  OPD
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {siteInfo.opdDays || "Monday - Saturday"}
                </p>
                <p className="text-sm leading-6 text-slate-600">
                  {siteInfo.opdTime || "10:00 AM – 05:00 PM"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
