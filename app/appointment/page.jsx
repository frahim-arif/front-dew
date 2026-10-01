"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";


const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const getTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function AppointmentPage() {
  const router = useRouter();

  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  const [form, setForm] = useState({
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
     FETCH DOCTORS
  ================================================== */

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoadingDoctors(true);

        const res = await fetch(`${API_URL}/doctors`, {
          cache: "no-store",
        });

        const data = await res.json();

        if (!res.ok || !data.success) {
          throw new Error(
            data.message || "Unable to fetch doctors"
          );
        }

        const activeDoctors = Array.isArray(data.data)
          ? data.data.filter(
              (doctor) =>
                String(doctor.status || "").toLowerCase() ===
                "active"
            )
          : [];

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
      .map((doctor) => doctor.department)
      .filter(Boolean)
      .map((department) => department.trim());

    return [...new Set(values)];
  }, [doctors]);

  /* ==================================================
     FILTER DOCTORS BY DEPARTMENT
  ================================================== */

  const filteredDoctors = useMemo(() => {
    if (!form.department) {
      return doctors;
    }

    return doctors.filter(
      (doctor) =>
        String(doctor.department || "").trim() ===
        String(form.department).trim()
    );
  }, [doctors, form.department]);

  /* ==================================================
     SELECTED DOCTOR
  ================================================== */

  const selectedDoctor = useMemo(() => {
    return (
      doctors.find(
        (doctor) =>
          String(doctor._id) === String(form.doctor)
      ) || null
    );
  }, [doctors, form.doctor]);

  /* ==================================================
     DYNAMIC DOCTOR FEE
     DATABASE SOURCE: doctor.opdFee
  ================================================== */

  const selectedDoctorFee = Number(
    selectedDoctor?.opdFee || 0
  );

  /* ==================================================
     DOCTOR OPD DAYS
  ================================================== */

  const doctorOpdDays = selectedDoctor?.opdDays || [];

  /* ==================================================
     HANDLE FORM CHANGE
  ================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setMessage({
      type: "",
      text: "",
    });

    setForm((previous) => {
      const next = {
        ...previous,
        [name]: value,
      };

      /* ----------------------------------------------
         Department changed
      ---------------------------------------------- */

      if (name === "department") {
        next.doctor = "";
        next.time = "";
      }

      /* ----------------------------------------------
         Doctor changed
      ---------------------------------------------- */

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
     SUBMIT APPOINTMENT
  ================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage({
      type: "",
      text: "",
    });

    /* ----------------------------------------------
       BASIC VALIDATION
    ---------------------------------------------- */

    if (!form.name.trim()) {
      setMessage({
        type: "error",
        text: "Please enter patient name.",
      });
      return;
    }

    if (!/^[6-9]\d{9}$/.test(form.phone.trim())) {
      setMessage({
        type: "error",
        text: "Please enter a valid 10-digit mobile number.",
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

    if (!form.date) {
      setMessage({
        type: "error",
        text: "Please select appointment date.",
      });
      return;
    }

    if (!form.time) {
      setMessage({
        type: "error",
        text: "Please select appointment time.",
      });
      return;
    }

    /* ----------------------------------------------
       PAST DATE VALIDATION
       Same-day appointment IS allowed.
    ---------------------------------------------- */

    const todayDate = getTodayDate();

    if (form.date < todayDate) {
      setMessage({
        type: "error",
        text: "Past date appointment allowed nahi hai.",
      });
      return;
    }

    /* ----------------------------------------------
       DOCTOR VALIDATION
    ---------------------------------------------- */

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

    /* ----------------------------------------------
       SUBMIT
    ---------------------------------------------- */

    try {
      setSubmitting(true);

      const appointmentData = {
        name: form.name.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        age: form.age ? Number(form.age) : null,
        gender: form.gender,
        doctor: selectedDoctor.name,

        doctorId: selectedDoctor._id,

        department:
          form.department ||
          selectedDoctor.department ||
          "",

        date: form.date,
        time: form.time,
        message: form.message.trim(),

        /*
         * This is only useful as frontend metadata/display.
         * Backend MUST calculate actual payment amount
         * from Doctor.opdFee using doctorId.
         */
        doctorFee: selectedDoctorFee,
      };

      /* ----------------------------------------------
         CREATE APPOINTMENT
      ---------------------------------------------- */

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

      const appointmentDataResponse =
        await appointmentResponse.json();

      if (
        !appointmentResponse.ok ||
        !appointmentDataResponse.success
      ) {
        throw new Error(
          appointmentDataResponse.message ||
            "Unable to create appointment."
        );
      }

      const appointment =
        appointmentDataResponse.data ||
        appointmentDataResponse.appointment ||
        appointmentDataResponse;

      /* ----------------------------------------------
         CREATE RAZORPAY ORDER
      ---------------------------------------------- */

      const paymentResponse = await fetch(
        `${API_URL}/payments/create-order`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            appointmentId:
              appointment?._id ||
              appointment?.id,

            doctorId: selectedDoctor._id,

            /*
             * Send for reference only.
             * Backend should NOT trust this value.
             */
            doctorFee: selectedDoctorFee,

            name: form.name.trim(),
            phone: form.phone.trim(),
            email: form.email.trim(),
          }),
        }
      );

      const paymentData = await paymentResponse.json();

      if (
        !paymentResponse.ok ||
        !paymentData.success
      ) {
        throw new Error(
          paymentData.message ||
            "Unable to create payment order."
        );
      }

      /* ----------------------------------------------
         RAZORPAY
      ---------------------------------------------- */

      if (typeof window === "undefined") {
        throw new Error("Payment system unavailable.");
      }

      if (!window.Razorpay) {
        throw new Error(
          "Razorpay is not loaded. Please refresh the page and try again."
        );
      }

      const razorpayOrder =
        paymentData.order ||
        paymentData.data ||
        paymentData;

      const razorpayOptions = {
        key:
          paymentData.key ||
          paymentData.keyId ||
          process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,

        amount: razorpayOrder.amount,

        currency:
          razorpayOrder.currency || "INR",

       name: "Dew Care Hospital",

        description:
          `Appointment with ${selectedDoctor.name}`,

        order_id:
          razorpayOrder.id ||
          razorpayOrder.order_id,

        prefill: {
          name: form.name.trim(),
          email: form.email.trim(),
          contact: form.phone.trim(),
        },

        notes: {
          appointmentId:
            appointment?._id ||
            appointment?.id ||
            "",

          doctorId:
            selectedDoctor._id,

          doctorName:
            selectedDoctor.name,

          doctorFee:
            String(selectedDoctorFee),
        },

        theme: {
          color: "#047857",
        },

        handler: async function (response) {
          try {
            const verifyResponse = await fetch(
              `${API_URL}/payments/verify`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  appointmentId:
                    appointment?._id ||
                    appointment?.id,

                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_signature:
                    response.razorpay_signature,
                }),
              }
            );

            const verifyData =
              await verifyResponse.json();

            if (
              !verifyResponse.ok ||
              !verifyData.success
            ) {
              throw new Error(
                verifyData.message ||
                  "Payment verification failed."
              );
            }

            setMessage({
              type: "success",
              text:
                "Appointment booked successfully! Payment received.",
            });

            router.push(
              `/appointment/success?id=${
                appointment?._id ||
                appointment?.id ||
                ""
              }`
            );
          } catch (error) {
            console.error(
              "PAYMENT VERIFY ERROR:",
              error
            );

            setMessage({
              type: "error",
              text:
                error.message ||
                "Payment verification failed.",
            });
          }
        },

        modal: {
          ondismiss: function () {
            setMessage({
              type: "error",
              text:
                "Payment cancelled. Your appointment is not confirmed yet.",
            });
          },
        },
      };

      const razorpay =
        new window.Razorpay(razorpayOptions);

      razorpay.on(
        "payment.failed",
        function (response) {
          console.error(
            "RAZORPAY PAYMENT FAILED:",
            response
          );

          setMessage({
            type: "error",
            text:
              response?.error?.description ||
              "Payment failed. Please try again.",
          });
        }
      );

      razorpay.open();
    } catch (error) {
      console.error(
        "APPOINTMENT SUBMIT ERROR:",
        error
      );

      setMessage({
        type: "error",
        text:
          error.message ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  /* ==================================================
     UI
  ================================================== */

  return (
    <main className="min-h-screen bg-[#f7faf9]">
      {/* ==================================================
          HERO
      ================================================== */}

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
              Select your preferred doctor, date and time.
              Same-day aur future appointments available.
            </p>

            {/* DYNAMIC FEE */}
            <div className="mt-7">
              <p className="inline-flex border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-100 backdrop-blur">
                {selectedDoctor
                  ? `Appointment Fee: ₹${selectedDoctorFee.toLocaleString(
                      "en-IN"
                    )}`
                  : "Select Doctor for Appointment Fee"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ==================================================
          FORM
      ================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          {/* FORM CARD */}

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
                className={`mb-6 border px-4 py-3 text-sm font-semibold ${
                  message.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {message.text}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
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
                    className="w-full border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
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
                    className="w-full border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
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
                    className="w-full border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
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
                    min="0"
                    max="120"
                    placeholder="Patient age"
                    className="w-full border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
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
                  className="w-full border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                >
                  <option value="">
                    Select gender
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
              </div>

              {/* DEPARTMENT / DOCTOR */}

              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Department
                  </label>

                  <select
                    name="department"
                    value={form.department}
                    onChange={handleChange}
                    className="w-full border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                  >
                    <option value="">
                      All Departments
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

                <div>
                  <label className="mb-2 block text-sm font-bold text-slate-700">
                    Doctor *
                  </label>

                  <select
                    name="doctor"
                    value={form.doctor}
                    onChange={handleChange}
                    disabled={loadingDoctors}
                    className="w-full border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600 disabled:bg-slate-100"
                    required
                  >
                    <option value="">
                      {loadingDoctors
                        ? "Loading doctors..."
                        : "Select Doctor"}
                    </option>

                    {filteredDoctors.map(
                      (doctor) => (
                        <option
                          key={doctor._id}
                          value={doctor._id}
                        >
                          {doctor.name}
                          {doctor.specialist
                            ? ` — ${doctor.specialist}`
                            : ""}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              {/* SELECTED DOCTOR INFO */}

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
                        ₹
                        {selectedDoctorFee.toLocaleString(
                          "en-IN"
                        )}
                      </p>
                    </div>
                  </div>

                  {selectedDoctor.qualification && (
                    <p className="mt-4 text-sm text-slate-600">
                      <span className="font-bold">
                        Qualification:
                      </span>{" "}
                      {selectedDoctor.qualification}
                    </p>
                  )}

                  {selectedDoctor.experience && (
                    <p className="mt-1 text-sm text-slate-600">
                      <span className="font-bold">
                        Experience:
                      </span>{" "}
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
                    className="w-full border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
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
                    min={
                      selectedDoctor?.opdStartTime ||
                      undefined
                    }
                    max={
                      selectedDoctor?.opdEndTime ||
                      undefined
                    }
                    className="w-full border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
                    required
                  />

                  {selectedDoctor && (
                    <p className="mt-2 text-xs text-slate-500">
                      OPD:{" "}
                      {selectedDoctor.opdStartTime ||
                        "--"}{" "}
                      -{" "}
                      {selectedDoctor.opdEndTime ||
                        "--"}
                    </p>
                  )}
                </div>
              </div>

              {/* OPD DAYS */}

              {selectedDoctor &&
                doctorOpdDays.length > 0 && (
                  <div className="border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      OPD Days
                    </p>

                    <div className="mt-2 flex flex-wrap gap-2">
                      {doctorOpdDays.map(
                        (day) => (
                          <span
                            key={day}
                            className="border border-emerald-200 bg-white px-3 py-1 text-xs font-semibold text-emerald-700"
                          >
                            {day}
                          </span>
                        )
                      )}
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
                  className="w-full resize-none border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-emerald-600"
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
                      ₹
                      {selectedDoctorFee.toLocaleString(
                        "en-IN"
                      )}
                    </span>
                  </div>

                  <p className="mt-2 text-xs leading-5 text-slate-500">
                    Payment Razorpay ke through secure
                    checkout par process hoga.
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
                  ? `Pay ₹${selectedDoctorFee.toLocaleString(
                      "en-IN"
                    )} & Book Appointment`
                  : "Select Doctor"}
              </button>
            </form>
          </div>

          {/* ==================================================
              SIDE INFO
          ================================================== */}

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
                    ? `₹${selectedDoctorFee.toLocaleString(
                        "en-IN"
                      )}`
                    : "Select doctor"}
                </p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Appointment
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Same-day and future appointments can
                  be requested.
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
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}