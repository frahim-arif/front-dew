"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { siteInfo } from "../data/siteData";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const APPOINTMENT_FEE = 500;

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  age: "",
  gender: "",
  department: "",
  date: "",
  doctor: "",
  message: "",
};

/* =========================================
   Razorpay Script Loader
========================================= */

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve(false);
      return;
    }

    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true));
      existingScript.addEventListener("error", () => resolve(false));
      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

/* =========================================
   Date Helpers
========================================= */

const formatDateForInput = (date) => {
  const year = date.getFullYear();

  const month = String(date.getMonth() + 1).padStart(
    2,
    "0"
  );

  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getTomorrowDate = () => {
  const tomorrow = new Date();

  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return formatDateForInput(tomorrow);
};

/* =========================================
   Appointment Page
========================================= */

export default function AppointmentPage() {
  const router = useRouter();

  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [loading, setLoading] = useState(false);
  const [doctorsLoading, setDoctorsLoading] =
    useState(true);

  const [paymentMessage, setPaymentMessage] =
    useState("");

  const tomorrowDate = getTomorrowDate();

  /* =========================================
     Fetch Active Doctors
  ========================================= */

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setDoctorsLoading(true);

        const response = await fetch(
          `${API_URL}/doctors`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(
            result.message ||
              "Unable to fetch doctors."
          );
        }

        const activeDoctors = (
          Array.isArray(result.data)
            ? result.data
            : []
        ).filter((doctor) => {
          return (
            doctor?.status?.trim().toLowerCase() ===
            "active"
          );
        });

        setDoctors(activeDoctors);
      } catch (error) {
        console.error(
          "Doctors fetch error:",
          error
        );

        setDoctors([]);
      } finally {
        setDoctorsLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  /* =========================================
     Unique Departments From Doctors
  ========================================= */

  const departments = useMemo(() => {
    const departmentList = doctors
      .map((doctor) => {
        return doctor?.department?.trim();
      })
      .filter(Boolean);

    return [...new Set(departmentList)].sort(
      (first, second) =>
        first.localeCompare(second)
    );
  }, [doctors]);

  /* =========================================
     Doctors For Selected Department
  ========================================= */

  const filteredDoctors = useMemo(() => {
    if (!form.department) {
      return [];
    }

    const selectedDepartment =
      form.department.trim().toLowerCase();

    return doctors.filter((doctor) => {
      const doctorDepartment =
        doctor?.department
          ?.trim()
          .toLowerCase() || "";

      return (
        doctorDepartment === selectedDepartment
      );
    });
  }, [doctors, form.department]);

  /* =========================================
     Selected Doctor Object
  ========================================= */

  const selectedDoctor = useMemo(() => {
    return filteredDoctors.find(
      (doctor) => doctor.name === form.doctor
    );
  }, [filteredDoctors, form.doctor]);

  /* =========================================
     Form Helpers
  ========================================= */

  const resetForm = () => {
    setForm(emptyForm);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setPaymentMessage("");

    setForm((previousForm) => {
      if (name === "department") {
        return {
          ...previousForm,
          department: value,
          doctor: "",
        };
      }

      return {
        ...previousForm,
        [name]: value,
      };
    });
  };

  /* =========================================
     Mark Failed Payment
  ========================================= */

  const markPaymentFailed = async ({
    appointmentId,
    razorpayOrderId,
    errorCode = "",
    errorDescription = "",
  }) => {
    try {
      await fetch(
        `${API_URL}/payments/failed`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            appointmentId,
            razorpayOrderId,
            errorCode,
            errorDescription,
          }),
        }
      );
    } catch (error) {
      console.error(
        "Failed payment update error:",
        error
      );
    }
  };

  /* =========================================
     Submit + Razorpay Payment
  ========================================= */

  const submitForm = async (event) => {
    event.preventDefault();

    setPaymentMessage("");

    if (
      !form.name.trim() ||
      !form.phone.trim() ||
      !form.department ||
      !form.date ||
      !form.doctor
    ) {
      alert(
        "Patient name, phone, department, date aur doctor select karna zaroori hai."
      );

      return;
    }

    if (form.date < tomorrowDate) {
      alert(
        "Appointment kam se kam 1 din pehle book karna hoga."
      );

      return;
    }

    if (
      !/^[0-9]{10}$/.test(
        form.phone.trim()
      )
    ) {
      alert(
        "Valid 10 digit mobile number enter karein."
      );

      return;
    }

    if (
      form.age &&
      (Number(form.age) < 1 ||
        Number(form.age) > 120)
    ) {
      alert("Valid age enter karein.");

      return;
    }

    if (!selectedDoctor) {
      alert(
        "Selected doctor is department mein available nahi hai."
      );

      return;
    }

    setLoading(true);

    setPaymentMessage(
      "Secure payment prepare ho raha hai..."
    );

    try {
      const razorpayLoaded =
        await loadRazorpayScript();

      if (!razorpayLoaded) {
        throw new Error(
          "Razorpay load nahi ho saka. Internet connection check karein."
        );
      }

      const appointmentData = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),

        age: form.age
          ? String(form.age).trim()
          : "",

        gender: form.gender,
        department: selectedDoctor.department,
        date: form.date,

        doctor: selectedDoctor.name,
        doctorId: selectedDoctor._id,

        message: form.message.trim(),
      };

      /* Create Razorpay Order */

      const orderResponse = await fetch(
        `${API_URL}/payments/create-order`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(
            appointmentData
          ),
        }
      );

      const orderResult =
        await orderResponse.json();

      if (
        !orderResponse.ok ||
        !orderResult.success
      ) {
        throw new Error(
          orderResult.message ||
            "Payment order create nahi ho saka."
        );
      }

      const orderData = orderResult.data;

      setPaymentMessage(
        "Payment window open ho raha hai..."
      );

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,

        name: "Dew Care Hospital",

        description: `Appointment with ${selectedDoctor.name}`,

        order_id: orderData.orderId,

        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: form.phone.trim(),
        },

        notes: {
          appointmentId:
            orderData.appointmentId,

          doctorId: selectedDoctor._id,

          doctor: selectedDoctor.name,

          appointmentDate: form.date,
        },

        theme: {
          color: "#0891b2",
        },

        modal: {
          confirm_close: true,

          ondismiss: () => {
            setLoading(false);

            setPaymentMessage(
              "Payment window close ho gayi. Appointment confirm nahi hui."
            );
          },
        },

        handler: async (
          paymentResponse
        ) => {
          try {
            setLoading(true);

            setPaymentMessage(
              "Payment receive ho gayi. Verification chal rahi hai..."
            );

            const verifyResponse =
              await fetch(
                `${API_URL}/payments/verify`,
                {
                  method: "POST",

                  headers: {
                    "Content-Type":
                      "application/json",
                  },

                  body: JSON.stringify({
                    appointmentId:
                      orderData.appointmentId,

                    razorpay_order_id:
                      paymentResponse.razorpay_order_id,

                    razorpay_payment_id:
                      paymentResponse.razorpay_payment_id,

                    razorpay_signature:
                      paymentResponse.razorpay_signature,
                  }),
                }
              );

            const verifyResult =
              await verifyResponse.json();

            if (
              !verifyResponse.ok ||
              !verifyResult.success
            ) {
              throw new Error(
                verifyResult.message ||
                  "Payment verification failed."
              );
            }

            setPaymentMessage(
              "Payment successful. Appointment confirmed."
            );

            resetForm();

            alert(
              `✅ Payment successful!\n\nAppointment confirmed.\nPayment ID: ${paymentResponse.razorpay_payment_id}`
            );

            router.push("/");
          } catch (error) {
            console.error(
              "Payment verification error:",
              error
            );

            setPaymentMessage(
              error.message ||
                "Payment verification failed."
            );

            alert(
              error.message ||
                "Payment verification failed."
            );
          } finally {
            setLoading(false);
          }
        },
      };

      const razorpayCheckout =
        new window.Razorpay(options);

      razorpayCheckout.on(
        "payment.failed",
        async (response) => {
          const errorCode =
            response?.error?.code ||
            "PAYMENT_FAILED";

          const errorDescription =
            response?.error?.description ||
            "Razorpay payment failed.";

          await markPaymentFailed({
            appointmentId:
              orderData.appointmentId,

            razorpayOrderId:
              orderData.orderId,

            errorCode,
            errorDescription,
          });

          setLoading(false);

          setPaymentMessage(
            errorDescription
          );

          alert(
            `❌ Payment failed: ${errorDescription}`
          );
        }
      );

      razorpayCheckout.open();

      setLoading(false);
    } catch (error) {
      console.error(
        "Appointment payment error:",
        error
      );

      setLoading(false);

      setPaymentMessage(
        error.message ||
          "Payment start karte waqt problem hui."
      );

      alert(
        error.message ||
          "Payment start karte waqt problem hui."
      );
    }
  };

  const inputClass =
    "w-full rounded-2xl border border-sky-100 bg-white px-5 py-4 text-gray-800 shadow-sm outline-none transition placeholder:text-gray-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

  return (
    <main className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-cyan-50">
      {/* Hero Section */}

      <section className="relative overflow-hidden bg-gradient-to-br from-sky-950 via-sky-800 to-cyan-700 py-20 text-white sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(34,211,238,.35),transparent_35%)]" />

        <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-cyan-400/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur">
            Appointment
          </span>

          <h1 className="mt-5 text-4xl font-extrabold md:text-6xl">
            Book Your Appointment
          </h1>

          <p className="mt-6 max-w-3xl text-lg text-sky-100">
            Department aur doctor select
            karke secure online payment ke
            through appointment confirm
            karein.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <p className="inline-flex rounded-xl border border-cyan-300/30 bg-white/10 px-4 py-3 text-sm font-semibold text-cyan-100 backdrop-blur">
              Appointment minimum 1 din
              pehle book hogi.
            </p>

            <p className="inline-flex rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 backdrop-blur">
              Appointment Fee: ₹
              {APPOINTMENT_FEE}
            </p>
          </div>
        </div>
      </section>

      {/* Main Section */}

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-3 lg:px-8 lg:py-20">
        {/* Appointment Form */}

        <div className="rounded-[2rem] border border-sky-100 bg-white p-5 shadow-2xl sm:p-8 lg:col-span-2">
          <div className="mb-8">
            <p className="font-bold text-cyan-700">
              Patient Information
            </p>

            <h2 className="mt-2 text-3xl font-extrabold text-sky-950">
              Patient Details
            </h2>

            <p className="mt-3 text-gray-500">
              Accurate details provide karein.
              Payment successful hone ke baad
              appointment confirm hogi.
            </p>
          </div>

          <form
            onSubmit={submitForm}
            className="grid gap-5"
          >
            {/* Name and Phone */}

            <div className="grid gap-5 md:grid-cols-2">
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Patient Name"
                autoComplete="name"
                className={inputClass}
              />

              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                required
                maxLength={10}
                inputMode="numeric"
                pattern="[0-9]{10}"
                placeholder="10 Digit Mobile Number"
                autoComplete="tel"
                className={inputClass}
              />
            </div>

            {/* Email and Age */}

            <div className="grid gap-5 md:grid-cols-2">
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address"
                autoComplete="email"
                className={inputClass}
              />

              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                min="1"
                max="120"
                placeholder="Age"
                className={inputClass}
              />
            </div>

            {/* Gender and Department */}

            <div className="grid gap-5 md:grid-cols-2">
              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className={inputClass}
              >
                <option value="">
                  Select Gender
                </option>

                <option value="Male">
                  Male
                </option>

                <option value="Female">
                  Female
                </option>

                <option value="Other">
                  Other
                </option>
              </select>

              <select
                name="department"
                value={form.department}
                onChange={handleChange}
                required
                disabled={
                  doctorsLoading ||
                  departments.length === 0
                }
                className={inputClass}
              >
                <option value="">
                  {doctorsLoading
                    ? "Loading Departments..."
                    : departments.length === 0
                      ? "No Department Available"
                      : "Select Department"}
                </option>

                {departments.map(
                  (department) => (
                    <option
                      key={department}
                      value={department}
                    >
                      {department}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* Date and Doctor */}

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  min={tomorrowDate}
                  required
                  className={inputClass}
                />

                <p className="mt-2 px-1 text-sm text-gray-500">
                  Appointment kal ya uske baad
                  ki date par book hogi.
                </p>
              </div>

              <div>
                <select
                  name="doctor"
                  value={form.doctor}
                  onChange={handleChange}
                  required
                  disabled={
                    doctorsLoading ||
                    !form.department ||
                    filteredDoctors.length === 0
                  }
                  className={inputClass}
                >
                  <option value="">
                    {doctorsLoading
                      ? "Loading Doctors..."
                      : !form.department
                        ? "First Select Department"
                        : filteredDoctors.length === 0
                          ? "No Doctor Available"
                          : "Select Doctor"}
                  </option>

                  {filteredDoctors.map(
                    (doctor) => (
                      <option
                        key={doctor._id}
                        value={doctor.name}
                      >
                        {doctor.name}
                        {doctor.specialist
                          ? ` - ${doctor.specialist}`
                          : ""}
                      </option>
                    )
                  )}
                </select>

                {form.department &&
                  !doctorsLoading &&
                  filteredDoctors.length ===
                    0 && (
                    <p className="mt-2 px-1 text-sm font-medium text-red-500">
                      Is department mein koi
                      active doctor available
                      nahi hai.
                    </p>
                  )}

                {form.department &&
                  filteredDoctors.length > 0 && (
                    <p className="mt-2 px-1 text-sm text-gray-500">
                      {filteredDoctors.length}{" "}
                      doctor
                      {filteredDoctors.length >
                      1
                        ? "s"
                        : ""}{" "}
                      available.
                    </p>
                  )}
              </div>
            </div>

            {/* Selected Doctor */}

            {selectedDoctor && (
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50 p-4">
                <p className="text-xs font-extrabold uppercase tracking-wider text-cyan-700">
                  Selected Doctor
                </p>

                <h3 className="mt-1 font-extrabold text-sky-950">
                  {selectedDoctor.name}
                </h3>

                <p className="mt-1 text-sm text-gray-600">
                  {selectedDoctor.specialist}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Department:{" "}
                  {selectedDoctor.department}
                </p>

                <p className="mt-2 text-sm font-semibold text-cyan-700">
                  Appointment Fee: ₹
                  {APPOINTMENT_FEE}
                </p>
              </div>
            )}

            {/* Message */}

            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              rows={5}
              placeholder="Describe your health problem..."
              className={inputClass}
            />

            {/* Payment Message */}

            {paymentMessage && (
              <div className="rounded-2xl border border-cyan-100 bg-cyan-50 px-4 py-3 text-sm font-semibold text-cyan-800">
                {paymentMessage}
              </div>
            )}

            {/* Submit Button */}

            <button
              type="submit"
              disabled={
                loading ||
                doctorsLoading ||
                !form.department ||
                !form.doctor ||
                filteredDoctors.length === 0
              }
              className="mt-2 rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 py-4 font-extrabold text-white shadow-xl transition hover:scale-[1.02] hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Please Wait..."
                : `Pay ₹${APPOINTMENT_FEE} & Book Appointment`}
            </button>

            <p className="text-center text-xs text-gray-500">
              Secure payment powered by
              Razorpay. Payment verification ke
              baad appointment confirm hogi.
            </p>
          </form>
        </div>

        {/* Emergency Card */}

        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-sky-950 via-sky-900 to-cyan-700 p-8 text-white shadow-2xl">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-cyan-400/20 blur-3xl" />

          <div className="relative">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-4xl">
              🚑
            </div>

            <h3 className="text-3xl font-extrabold">
              Emergency Help
            </h3>

            <p className="mt-4 text-sky-100">
              Our emergency medical team is
              available 24 hours a day, 7 days
              a week.
            </p>

            <a
              href={`tel:${siteInfo.phone}`}
              className="mt-8 block rounded-2xl bg-white px-5 py-4 text-center font-bold text-sky-900 shadow-lg transition hover:scale-105"
            >
              📞 Call {siteInfo.phone}
            </a>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <h4 className="font-bold text-cyan-200">
                Hospital Address
              </h4>

              <p className="mt-2 text-sky-100">
                {siteInfo.address}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <h4 className="font-bold text-cyan-200">
                Email
              </h4>

              <p className="mt-2 break-all text-sky-100">
                {siteInfo.email}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/10 p-5 backdrop-blur">
              <h4 className="font-bold text-cyan-200">
                OPD Timing
              </h4>

              <p className="mt-2 text-sky-100">
                {siteInfo.opdDays ||
                  "Monday - Saturday"}
              </p>

              <p className="text-sky-100">
                {siteInfo.opdTime ||
                  "10:00 AM – 05:00 PM"}
              </p>
            </div>

            <div className="mt-5 rounded-2xl border border-emerald-300/20 bg-emerald-400/10 p-5 backdrop-blur">
              <h4 className="font-bold text-emerald-200">
                Secure Online Payment
              </h4>

              <p className="mt-2 text-sm text-emerald-50">
                ₹{APPOINTMENT_FEE} appointment
                fee Razorpay ke through securely
                pay karein.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}