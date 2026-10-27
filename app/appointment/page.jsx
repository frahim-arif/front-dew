
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { siteInfo } from "../data/siteData";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const isApiSuccess = (result) =>
  result?.success === true || result?._status === true;

const getApiMessage = (result, fallback) =>
  result?.message || result?._message || fallback;

const getApiData = (result) =>
  result?.data ?? result?._data ?? result?.appointment ?? result;

const getTodayDate = () =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kolkata",
  }).format(new Date());

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

    const scriptUrl = "https://checkout.razorpay.com/v1/checkout.js";
    let script = document.querySelector(`script[src="${scriptUrl}"]`);

    if (script) {
      if (script.dataset.loaded === "true" && window.Razorpay) {
        resolve(true);
        return;
      }

      const onLoad = () => {
        cleanup();
        resolve(!!window.Razorpay);
      };

      const onError = () => {
        cleanup();
        resolve(false);
      };

      const cleanup = () => {
        script.removeEventListener("load", onLoad);
        script.removeEventListener("error", onError);
      };

      script.addEventListener("load", onLoad);
      script.addEventListener("error", onError);
      return;
    }

    script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.onload = () => {
      script.dataset.loaded = "true";
      resolve(!!window.Razorpay);
    };
    script.onerror = () => resolve(false);

    document.head.appendChild(script);
  });

const inputClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-4 focus:ring-emerald-600/10 disabled:cursor-not-allowed disabled:bg-slate-100";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-700";

export default function AppointmentPage() {
  const router = useRouter();

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [form, setForm] = useState(getEmptyForm());

  // Load Razorpay before the user submits the form.
  useEffect(() => {
    loadRazorpayScript().catch((error) => {
      console.error("RAZORPAY PRELOAD ERROR:", error);
    });
  }, []);

  // Fetch active doctors.
  useEffect(() => {
    const controller = new AbortController();

    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);

        const response = await fetch(`${API_URL}/doctors`, {
          cache: "no-store",
          signal: controller.signal,
        });

        const result = await response.json();

        if (!response.ok || !isApiSuccess(result)) {
          throw new Error(
            getApiMessage(result, "Unable to fetch doctors.")
          );
        }

        const data = getApiData(result);

        setDoctors(
          (Array.isArray(data) ? data : []).filter(
            (doctor) =>
              String(doctor?.status || "").trim().toLowerCase() ===
              "active"
          )
        );
      } catch (error) {
        if (error.name === "AbortError") return;

        console.error("FETCH DOCTORS ERROR:", error);
        setDoctors([]);
        setMessage({
          type: "error",
          text: "Doctors load nahi ho paaye. Please try again.",
        });
      } finally {
        if (!controller.signal.aborted) {
          setLoadingDoctors(false);
        }
      }
    };

    fetchDoctors();

    return () => controller.abort();
  }, []);

  const departments = useMemo(() => {
    const values = doctors
      .map((doctor) => String(doctor?.department || "").trim())
      .filter(Boolean);

    return [...new Set(values)].sort((a, b) => a.localeCompare(b));
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (!form.department) return doctors;

    return doctors.filter(
      (doctor) =>
        String(doctor?.department || "").trim().toLowerCase() ===
        form.department.trim().toLowerCase()
    );
  }, [doctors, form.department]);

  const selectedDoctor = useMemo(
    () =>
      doctors.find(
        (doctor) => String(doctor?._id) === String(form.doctor)
      ) || null,
    [doctors, form.doctor]
  );

  const selectedDoctorFee = Number(selectedDoctor?.opdFee || 0);
  const doctorOpdDays = selectedDoctor?.opdDays || [];

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

  const markPaymentFailed = async ({
    appointmentId,
    razorpayOrderId,
    errorCode = "",
    errorDescription = "",
  }) => {
    try {
      const response = await fetch(`${API_URL}/payments/failed`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          appointmentId,
          razorpay_order_id: razorpayOrderId,
          reason: `${errorCode}: ${errorDescription}`.trim(),
        }),
      });

      if (!response.ok) {
        console.error("Failed-payment API returned:", response.status);
      }
    } catch (error) {
      console.error("FAILED PAYMENT UPDATE ERROR:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting) return;

    setMessage({ type: "", text: "" });

    if (!form.name.trim()) {
      setMessage({ type: "error", text: "Please enter patient name." });
      return;
    }

    if (!/^[0-9]{10}$/.test(form.phone.trim())) {
      setMessage({
        type: "error",
        text: "Please enter a valid 10-digit mobile number.",
      });
      return;
    }

    if (!form.department || !form.doctor) {
      setMessage({
        type: "error",
        text: "Please select department and doctor.",
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
        setMessage({ type: "error", text: "Please enter a valid age." });
        return;
      }
    }

    if (!selectedDoctor) {
      setMessage({ type: "error", text: "Selected doctor not found." });
      return;
    }

    if (
      String(selectedDoctor.status || "").toLowerCase() !== "active" ||
      selectedDoctor.opdAvailable === false
    ) {
      setMessage({
        type: "error",
        text: "Selected doctor is currently unavailable.",
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

    setSubmitting(true);

    try {
      // Start script check and appointment creation together.
      setMessage({
        type: "success",
        text: "Appointment prepare ho rahi hai...",
      });

      const razorpayScriptPromise = loadRazorpayScript();

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
        doctorFee: selectedDoctorFee,
      };

      const appointmentResponse = await fetch(
        `${API_URL}/appointments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(appointmentData),
        }
      );

      const appointmentResult = await appointmentResponse.json();

      if (
        !appointmentResponse.ok ||
        !isApiSuccess(appointmentResult)
      ) {
        throw new Error(
          getApiMessage(appointmentResult, "Unable to create appointment.")
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

      setMessage({
        type: "success",
        text: "Secure payment order create ho raha hai...",
      });

      const paymentResponse = await fetch(
        `${API_URL}/payments/create-order`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ appointmentId }),
        }
      );

      const paymentResult = await paymentResponse.json();

      if (!paymentResponse.ok || !isApiSuccess(paymentResult)) {
        throw new Error(
          getApiMessage(paymentResult, "Unable to create payment order.")
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

      // If the script was not preloaded successfully, wait for it here.
      const razorpayLoaded = await razorpayScriptPromise;

      if (!razorpayLoaded || !window.Razorpay) {
        throw new Error(
          "Razorpay load nahi ho saka. Internet connection check karein."
        );
      }

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

        theme: { color: "#08745b" },

        modal: {
          confirm_close: true,
          ondismiss: () => {
            setSubmitting(false);
            setMessage({
              type: "error",
              text:
                "Payment window close hui. Dobara payment karne se pehle appointment ka payment status check karein.",
            });
          },
        },

        handler: async (razorpayResponse) => {
          try {
            setMessage({
              type: "success",
              text: "Payment receive hui. Verification chal rahi hai...",
            });

            const verifyResponse = await fetch(
              `${API_URL}/payments/verify`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  appointmentId,
                  razorpay_order_id: razorpayResponse.razorpay_order_id,
                  razorpay_payment_id: razorpayResponse.razorpay_payment_id,
                  razorpay_signature: razorpayResponse.razorpay_signature,
                }),
              }
            );

            const verifyResult = await verifyResponse.json();

            if (!verifyResponse.ok || !isApiSuccess(verifyResult)) {
              throw new Error(
                getApiMessage(verifyResult, "Payment verification failed.")
              );
            }

            setMessage({
              type: "success",
              text: "Appointment booked successfully! Payment received.",
            });

            setForm(getEmptyForm());

            router.push(
              `/appointment/success?id=${encodeURIComponent(appointmentId)}`
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

      razorpay.on("payment.failed", async (response) => {
        console.error("RAZORPAY PAYMENT FAILED:", response);

        const errorCode = response?.error?.code || "PAYMENT_FAILED";
        const errorDescription =
          response?.error?.description || "Razorpay payment failed.";

        await markPaymentFailed({
          appointmentId,
          razorpayOrderId,
          errorCode,
          errorDescription,
        });

        setSubmitting(false);
        setMessage({ type: "error", text: errorDescription });
      });

      razorpay.open();
    } catch (error) {
      console.error("APPOINTMENT PAYMENT ERROR:", error);

      setMessage({
        type: "error",
        text: error.message || "Payment start karte waqt problem hui.",
      });

      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f5f8f6] text-slate-800">
      {/* PREMIUM HERO */}
      <section className="relative isolate overflow-hidden bg-[#071c19]">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,rgba(200,174,106,0.22),transparent_38%),radial-gradient(ellipse_at_bottom_left,rgba(16,185,129,0.18),transparent_42%)]" />

        <div className="absolute -right-24 top-10 -z-10 h-72 w-72 rounded-full border border-white/10 sm:h-96 sm:w-96" />
        <div className="absolute -right-12 top-22 -z-10 h-56 w-56 rounded-full border border-[#c8ae6a]/20 sm:h-72 sm:w-72" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:grid-cols-[1fr_360px] lg:px-10 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 border border-[#c8ae6a]/30 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#e4d4a8]">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Dew Care Hospital & Research Centre
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Your Health,
              <span className="block text-[#d9c28b]">Our Priority.</span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-7 text-emerald-50/75 sm:text-lg sm:leading-8">
              Book your consultation with ease. Choose your doctor, select a
              convenient time and confirm your appointment through secure
              online payment.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <span className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 sm:text-sm">
                <span className="text-emerald-300">✓</span> Easy booking
              </span>
              <span className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 sm:text-sm">
                <span className="text-emerald-300">✓</span> Secure payment
              </span>
              <span className="inline-flex items-center gap-2 border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white/90 sm:text-sm">
                <span className="text-emerald-300">✓</span> Doctor selection
              </span>
            </div>
          </div>

          <div className="border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur sm:p-7">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d9c28b]">
              Appointment at a glance
            </p>

            <div className="mt-5 border-b border-white/10 pb-5">
              <p className="text-sm text-emerald-50/65">Selected doctor</p>
              <p className="mt-1 text-xl font-bold text-white">
                {selectedDoctor?.name || "Choose your doctor"}
              </p>
              <p className="mt-1 text-sm text-emerald-50/65">
                {selectedDoctor?.department || "Department not selected"}
              </p>
            </div>

            <div className="mt-5 flex items-end justify-between gap-3">
              <div>
                <p className="text-sm text-emerald-50/65">Consultation fee</p>
                <p className="mt-1 text-3xl font-black text-[#e5d19a]">
                  {selectedDoctor
                    ? `₹${selectedDoctorFee.toLocaleString("en-IN")}`
                    : "—"}
                </p>
              </div>
              <span className="border border-emerald-300/20 bg-emerald-300/10 px-3 py-2 text-xs font-semibold text-emerald-100">
                Online booking
              </span>
            </div>

            <p className="mt-5 text-xs leading-5 text-emerald-50/55">
              Your appointment request and payment are processed through the
              hospital booking system.
            </p>
          </div>
        </div>
      </section>

      {/* BOOKING CONTENT */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
        <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              Appointment booking
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-[#102b24] sm:text-4xl">
              Let’s get you cared for.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Fill in the patient details below to book your consultation.
            </p>
          </div>

          <div className="inline-flex w-fit items-center gap-2 border border-emerald-100 bg-white px-4 py-3 text-xs font-semibold text-slate-600 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Secure appointment process
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* FORM CARD */}
          <div className="overflow-hidden border border-slate-200 bg-white shadow-[0_18px_60px_-35px_rgba(7,28,25,0.25)]">
            <div className="border-b border-slate-100 bg-[#fcfdfc] px-5 py-5 sm:px-8">
              <h3 className="text-xl font-extrabold text-[#102b24]">
                Patient details
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Fields marked * are required.
              </p>
            </div>

            <div className="p-5 sm:p-8">
              {message.text && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`mb-6 border px-4 py-3.5 text-sm font-semibold ${
                    message.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-red-200 bg-red-50 text-red-700"
                  }`}
                >
                  {message.text}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-7">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center bg-emerald-50 text-sm font-black text-emerald-800">
                      01
                    </span>
                    <h4 className="font-bold text-slate-800">
                      Personal information
                    </h4>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Patient name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Enter full name"
                        className={inputClass}
                        autoComplete="name"
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Mobile number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="10-digit mobile number"
                        maxLength={10}
                        inputMode="numeric"
                        autoComplete="tel"
                        className={inputClass}
                        required
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Email address</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        autoComplete="email"
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Age</label>
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

                    <div className="sm:col-span-2">
                      <label className={labelClass}>Gender</label>
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
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-7">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center bg-emerald-50 text-sm font-black text-emerald-800">
                      02
                    </span>
                    <h4 className="font-bold text-slate-800">
                      Doctor & department
                    </h4>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>Department *</label>
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
                            ? "Loading departments..."
                            : departments.length
                            ? "Select department"
                            : "No departments available"}
                        </option>
                        {departments.map((department) => (
                          <option key={department} value={department}>
                            {department}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Doctor *</label>
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
                            ? "Loading doctors..."
                            : !form.department
                            ? "First select department"
                            : filteredDoctors.length
                            ? "Select doctor"
                            : "No doctors available"}
                        </option>
                        {filteredDoctors.map((doctor) => (
                          <option key={doctor._id} value={doctor._id}>
                            {doctor.name}
                            {doctor.specialist ? ` — ${doctor.specialist}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {selectedDoctor && (
                    <div className="mt-5 border border-emerald-100 bg-[#f5faf7] p-5">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                            Your selected doctor
                          </p>
                          <h5 className="mt-1 text-xl font-extrabold text-[#102b24]">
                            {selectedDoctor.name}
                          </h5>
                          <p className="mt-1 text-sm text-slate-600">
                            {selectedDoctor.specialist ||
                              selectedDoctor.department}
                          </p>
                          {selectedDoctor.qualification && (
                            <p className="mt-3 text-sm text-slate-600">
                              <strong>Qualification:</strong>{" "}
                              {selectedDoctor.qualification}
                            </p>
                          )}
                          {selectedDoctor.experience && (
                            <p className="mt-1 text-sm text-slate-600">
                              <strong>Experience:</strong>{" "}
                              {selectedDoctor.experience}
                            </p>
                          )}
                        </div>

                        <div className="border border-emerald-100 bg-white px-4 py-3 sm:min-w-28 sm:text-right">
                          <p className="text-xs font-semibold text-slate-500">
                            OPD fee
                          </p>
                          <p className="mt-1 text-2xl font-black text-emerald-800">
                            ₹{selectedDoctorFee.toLocaleString("en-IN")}
                          </p>
                        </div>
                      </div>

                      {doctorOpdDays.length > 0 && (
                        <div className="mt-4 border-t border-emerald-100 pt-4">
                          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            OPD days
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {doctorOpdDays.map((day) => (
                              <span
                                key={day}
                                className="border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-800"
                              >
                                {day}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="border-t border-slate-100 pt-7">
                  <div className="mb-4 flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center bg-emerald-50 text-sm font-black text-emerald-800">
                      03
                    </span>
                    <h4 className="font-bold text-slate-800">
                      Date & time
                    </h4>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className={labelClass}>
                        Appointment date *
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
                        Choose today or a future date.
                      </p>
                    </div>

                    <div>
                      <label className={labelClass}>
                        Appointment time *
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
                          OPD: {selectedDoctor.opdStartTime || "--"} –{" "}
                          {selectedDoctor.opdEndTime || "--"}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-7">
                  <label className={labelClass}>
                    Message / symptoms (optional)
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Briefly describe your concern..."
                    className={`${inputClass} resize-y`}
                  />
                </div>

                {selectedDoctor && (
                  <div className="border border-[#d9c28b]/60 bg-[#fcfaf3] p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm font-bold text-[#102b24]">
                          Consultation fee
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {selectedDoctor.name}
                        </p>
                      </div>
                      <p className="text-3xl font-black text-[#102b24]">
                        ₹{selectedDoctorFee.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <p className="mt-3 text-xs leading-5 text-slate-500">
                      Payment is processed through Razorpay secure checkout.
                    </p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting || loadingDoctors || !selectedDoctor}
                  className="group flex w-full items-center justify-center gap-3 bg-[#08745b] px-6 py-4 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/10 transition hover:bg-[#075b48] focus:outline-none focus:ring-4 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? (
                    <>
                      <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      Processing your appointment...
                    </>
                  ) : (
                    <>
                      Pay ₹
                      {selectedDoctorFee.toLocaleString("en-IN")} & Book
                      <span className="transition-transform group-hover:translate-x-1">
                        →
                      </span>
                    </>
                  )}
                </button>

                <p className="text-center text-xs leading-5 text-slate-500">
                  Please check your details before continuing to payment.
                </p>
              </form>
            </div>
          </div>

          {/* SIDE SUMMARY */}
          <aside className="space-y-5 lg:sticky lg:top-6">
            <div className="border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                Booking summary
              </p>
              <h3 className="mt-2 text-xl font-black text-[#102b24]">
                Your appointment
              </h3>

              <div className="mt-5 space-y-4 border-t border-slate-100 pt-5">
                <div>
                  <p className="text-xs text-slate-500">Patient</p>
                  <p className="mt-1 break-words text-sm font-bold text-slate-800">
                    {form.name.trim() || "Not entered yet"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Doctor</p>
                  <p className="mt-1 text-sm font-bold text-slate-800">
                    {selectedDoctor?.name || "Not selected"}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {selectedDoctor?.department || "Department not selected"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Date</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {form.date || "Not selected"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Time</p>
                    <p className="mt-1 text-sm font-bold text-slate-800">
                      {form.time || "Not selected"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-100 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-slate-600">
                    Consultation fee
                  </span>
                  <span className="text-2xl font-black text-emerald-800">
                    {selectedDoctor
                      ? `₹${selectedDoctorFee.toLocaleString("en-IN")}`
                      : "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[#0b3028] p-6 text-white">
              <div className="flex h-10 w-10 items-center justify-center border border-white/15 bg-white/10 text-xl">
                ✓
              </div>
              <h3 className="mt-4 text-lg font-extrabold">
                Secure online payment
              </h3>
              <p className="mt-2 text-sm leading-6 text-emerald-50/70">
                Your payment is handled through the integrated Razorpay
                checkout. Keep your appointment details handy.
              </p>
            </div>

            <div className="border border-slate-200 bg-white p-6">
              <h3 className="font-extrabold text-[#102b24]">
                Hospital information
              </h3>
              <p className="mt-3 text-sm font-semibold text-slate-700">
                Dew Care Hospital & Research Centre
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {siteInfo.opdDays || "Monday - Saturday"}
              </p>
              <p className="text-sm leading-6 text-slate-500">
                {siteInfo.opdTime || "10:00 AM – 05:00 PM"}
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
