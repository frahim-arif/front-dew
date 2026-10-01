"use client";

import { useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const weekDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const emptyForm = {
  name: "",
  specialist: "",
  qualification: "",
  experience: "",
  department: "",

  // Availability
  opdAvailable: true,
  indoorDoctor: false,

  // Fees
  opdFee: 0,
  indoorFee: 0,

  // OPD Schedule
  opdStartTime: "",
  opdEndTime: "",
  opdDays: [],

  // Slot
  slotDuration: 15,
  maxPatientsPerDay: 30,

  image: "",
  status: "Active",
};

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==================================================
  // FETCH DOCTORS
  // ==================================================
  const fetchDoctors = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/doctors`);
      const data = await res.json();

      if (data.success) {
        setDoctors(data.data || []);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to fetch doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  // ==================================================
  // HANDLE CHANGE
  // ==================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // HANDLE BOOLEAN CHANGE
  // ==================================================
  const handleBooleanChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // TOGGLE OPD DAY
  // ==================================================
  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      opdDays: prev.opdDays.includes(day)
        ? prev.opdDays.filter((d) => d !== day)
        : [...prev.opdDays, day],
    }));
  };

  // ==================================================
  // RESET FORM
  // ==================================================
  const resetForm = () => {
    setForm({
      ...emptyForm,
      opdDays: [],
    });

    setEditingId(null);
  };

  // ==================================================
  // SUBMIT DOCTOR
  // ==================================================
  const submitDoctor = async (e) => {
    e.preventDefault();

    if (!form.name.trim() || !form.specialist.trim()) {
      alert("Doctor name and specialist are required");
      return;
    }

    // OPD schedule required only when OPD is enabled
    if (form.opdAvailable) {
      if (!form.opdStartTime || !form.opdEndTime) {
        alert("OPD start time and end time are required");
        return;
      }

      if (form.opdDays.length === 0) {
        alert("Please select at least one OPD day");
        return;
      }
    }

    if (Number(form.opdFee) < 0) {
      alert("OPD fee cannot be negative");
      return;
    }

    if (Number(form.indoorFee) < 0) {
      alert("Indoor fee cannot be negative");
      return;
    }

    if (Number(form.slotDuration) < 5) {
      alert("Minimum slot should be at least 5 minutes");
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `${API}/doctors/${editingId}`
        : `${API}/doctors`;

      const method = editingId ? "PUT" : "POST";

      const formData = new FormData();

      // ==================================================
      // BASIC
      // ==================================================
      formData.append("name", form.name.trim());
      formData.append(
        "specialist",
        form.specialist.trim()
      );
      formData.append(
        "qualification",
        form.qualification.trim()
      );
      formData.append(
        "experience",
        form.experience.trim()
      );
      formData.append(
        "department",
        form.department.trim()
      );

      // ==================================================
      // AVAILABILITY
      // ==================================================
      formData.append(
        "opdAvailable",
        String(form.opdAvailable)
      );

      formData.append(
        "indoorDoctor",
        String(form.indoorDoctor)
      );

      // ==================================================
      // FEES
      // ==================================================
      formData.append(
        "opdFee",
        String(Number(form.opdFee || 0))
      );

      formData.append(
        "indoorFee",
        String(Number(form.indoorFee || 0))
      );

      // ==================================================
      // OPD SCHEDULE
      // ==================================================
      formData.append(
        "opdStartTime",
        form.opdStartTime
      );

      formData.append(
        "opdEndTime",
        form.opdEndTime
      );

      formData.append(
        "opdDays",
        JSON.stringify(form.opdDays)
      );

      // ==================================================
      // SLOT SETTINGS
      // ==================================================
      formData.append(
        "slotDuration",
        String(Number(form.slotDuration || 15))
      );

      formData.append(
        "maxPatientsPerDay",
        String(
          Number(form.maxPatientsPerDay || 30)
        )
      );

      // ==================================================
      // STATUS
      // ==================================================
      formData.append(
        "status",
        form.status
      );

      // ==================================================
      // IMAGE
      // ==================================================
      if (
        form.image &&
        typeof form.image !== "string"
      ) {
        formData.append(
          "image",
          form.image
        );
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        alert(
          data.message ||
            "Failed to save doctor"
        );
        return;
      }

      alert(
        editingId
          ? "Doctor updated successfully"
          : "Doctor added successfully"
      );

      resetForm();
      await fetchDoctors();
    } catch (err) {
      console.error(err);
      alert(
        "Server error while saving doctor"
      );
    } finally {
      setSaving(false);
    }
  };

  // ==================================================
  // EDIT DOCTOR
  // ==================================================
  const editDoctor = (doctor) => {
    setEditingId(doctor._id);

    setForm({
      name: doctor.name || "",
      specialist: doctor.specialist || "",
      qualification:
        doctor.qualification || "",
      experience:
        doctor.experience || "",
      department:
        doctor.department || "",

      opdAvailable:
        doctor.opdAvailable !== undefined
          ? doctor.opdAvailable
          : true,

      indoorDoctor:
        doctor.indoorDoctor !== undefined
          ? doctor.indoorDoctor
          : false,

      opdFee:
        doctor.opdFee !== undefined
          ? doctor.opdFee
          : 0,

      indoorFee:
        doctor.indoorFee !== undefined
          ? doctor.indoorFee
          : 0,

      opdStartTime:
        doctor.opdStartTime || "",

      opdEndTime:
        doctor.opdEndTime || "",

      opdDays:
        Array.isArray(doctor.opdDays)
          ? doctor.opdDays
          : [],

      slotDuration:
        doctor.slotDuration || 15,

      maxPatientsPerDay:
        doctor.maxPatientsPerDay || 30,

      image: doctor.image || "",

      status:
        doctor.status || "Active",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // DELETE DOCTOR
  // ==================================================
  const deleteDoctor = async (id) => {
    if (!confirm("Delete this doctor?")) {
      return;
    }

    try {
      const res = await fetch(
        `${API}/doctors/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!data.success) {
        alert(
          data.message ||
            "Failed to delete doctor"
        );
        return;
      }

      alert("Doctor deleted successfully");

      await fetchDoctors();
    } catch (err) {
      console.error(err);
      alert(
        "Server error while deleting doctor"
      );
    }
  };

  return (
    <>
      {/* ==================================================
          PAGE HEADER
      ================================================== */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-sky-950 md:text-4xl">
          Doctors
        </h1>

        <p className="mt-2 text-gray-500">
          Add, edit and manage doctors,
          OPD availability, fees and schedules.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">

        {/* ==================================================
            ADD / EDIT FORM
        ================================================== */}
        <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl xl:col-span-1">

          <h2 className="text-2xl font-extrabold text-sky-950">
            {editingId
              ? "Edit Doctor"
              : "Add Doctor"}
          </h2>

          <form
            onSubmit={submitDoctor}
            className="mt-6 grid gap-4"
          >

            {/* BASIC INFORMATION */}
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">

              <h3 className="mb-4 font-extrabold text-sky-900">
                Doctor Information
              </h3>

              <div className="grid gap-4">

                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Doctor Name"
                  className="rounded-2xl border border-sky-100 bg-white px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />

                <input
                  name="specialist"
                  value={form.specialist}
                  onChange={handleChange}
                  required
                  placeholder="Specialist"
                  className="rounded-2xl border border-sky-100 bg-white px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />

                <input
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  placeholder="Qualification"
                  className="rounded-2xl border border-sky-100 bg-white px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />

                <input
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="Experience"
                  className="rounded-2xl border border-sky-100 bg-white px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />

                <input
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="Department"
                  className="rounded-2xl border border-sky-100 bg-white px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />

              </div>
            </div>

            {/* ==================================================
                AVAILABILITY
            ================================================== */}
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">

              <h3 className="mb-4 font-extrabold text-emerald-900">
                Doctor Availability
              </h3>

              <div className="grid gap-3">

                {/* OPD */}
                <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-4">

                  <div>
                    <p className="font-extrabold text-slate-800">
                      OPD Available
                    </p>

                    <p className="text-xs text-slate-500">
                      Doctor provides OPD consultation
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleBooleanChange(
                        "opdAvailable",
                        !form.opdAvailable
                      )
                    }
                    className={`relative h-7 w-14 rounded-full transition ${
                      form.opdAvailable
                        ? "bg-emerald-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        form.opdAvailable
                          ? "left-8"
                          : "left-1"
                      }`}
                    />
                  </button>

                </div>

                {/* INDOOR */}
                <div className="flex items-center justify-between rounded-xl border border-emerald-100 bg-white p-4">

                  <div>
                    <p className="font-extrabold text-slate-800">
                      Indoor Doctor
                    </p>

                    <p className="text-xs text-slate-500">
                      Doctor handles indoor patients
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleBooleanChange(
                        "indoorDoctor",
                        !form.indoorDoctor
                      )
                    }
                    className={`relative h-7 w-14 rounded-full transition ${
                      form.indoorDoctor
                        ? "bg-emerald-600"
                        : "bg-slate-300"
                    }`}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                        form.indoorDoctor
                          ? "left-8"
                          : "left-1"
                      }`}
                    />
                  </button>

                </div>

              </div>
            </div>

            {/* ==================================================
                FEES
            ================================================== */}
            <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">

              <h3 className="mb-4 font-extrabold text-amber-900">
                Doctor Fees
              </h3>

              <div className="grid gap-4">

                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-600">
                    OPD Fee (₹)
                  </label>

                  <input
                    type="number"
                    name="opdFee"
                    value={form.opdFee}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="Example: 500"
                    className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Set individual OPD consultation fee.
                  </p>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-600">
                    Indoor Fee (₹)
                  </label>

                  <input
                    type="number"
                    name="indoorFee"
                    value={form.indoorFee}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="Example: 1000"
                    className="w-full rounded-2xl border border-amber-200 bg-white px-4 py-3 outline-none focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  />

                  <p className="mt-1 text-xs text-slate-500">
                    Set individual indoor consultation/visit fee.
                  </p>
                </div>

              </div>
            </div>

            {/* ==================================================
                OPD SCHEDULE
            ================================================== */}
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">

              <h3 className="mb-4 font-extrabold text-sky-900">
                OPD Schedule
              </h3>

              <div className="grid gap-4">

                {/* TIME */}
                <div className="grid grid-cols-2 gap-3">

                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-600">
                      OPD Start
                    </label>

                    <input
                      type="time"
                      name="opdStartTime"
                      value={form.opdStartTime}
                      onChange={handleChange}
                      required={form.opdAvailable}
                      disabled={!form.opdAvailable}
                      className="w-full rounded-2xl border border-sky-100 bg-white px-4 py-3 outline-none disabled:bg-slate-100 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-bold text-slate-600">
                      OPD End
                    </label>

                    <input
                      type="time"
                      name="opdEndTime"
                      value={form.opdEndTime}
                      onChange={handleChange}
                      required={form.opdAvailable}
                      disabled={!form.opdAvailable}
                      className="w-full rounded-2xl border border-sky-100 bg-white px-4 py-3 outline-none disabled:bg-slate-100 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                    />
                  </div>

                </div>

                {/* DAYS */}
                <div>

                  <label className="mb-2 block text-sm font-bold text-slate-600">
                    OPD Days
                  </label>

                  <div className="grid grid-cols-2 gap-2">

                    {weekDays.map((day) => (
                      <label
                        key={day}
                        className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                          !form.opdAvailable
                            ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
                            : form.opdDays.includes(day)
                            ? "border-cyan-400 bg-cyan-50 text-cyan-700"
                            : "border-sky-100 bg-white text-slate-600"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={form.opdDays.includes(day)}
                          disabled={!form.opdAvailable}
                          onChange={() =>
                            toggleDay(day)
                          }
                        />

                        {day}
                      </label>
                    ))}

                  </div>

                </div>

              </div>
            </div>

            {/* ==================================================
                APPOINTMENT SETTINGS
            ================================================== */}
            <div className="rounded-2xl border border-purple-100 bg-purple-50 p-4">

              <h3 className="mb-4 font-extrabold text-purple-900">
                Appointment Settings
              </h3>

              <div className="grid grid-cols-2 gap-3">

                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-600">
                    Minimum Slot (Minutes)
                  </label>

                  <input
                    type="number"
                    name="slotDuration"
                    value={form.slotDuration}
                    onChange={handleChange}
                    min="5"
                    step="5"
                    placeholder="15"
                    className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-bold text-slate-600">
                    Max Patients / Day
                  </label>

                  <input
                    type="number"
                    name="maxPatientsPerDay"
                    value={form.maxPatientsPerDay}
                    onChange={handleChange}
                    min="1"
                    placeholder="30"
                    className="w-full rounded-2xl border border-purple-100 bg-white px-4 py-3 outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100"
                  />
                </div>

              </div>

            </div>

            {/* IMAGE */}
            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                Doctor Image
              </label>

              <input
                type="file"
                name="image"
                accept=".jpg,.jpeg,.png,.webp"
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    image:
                      e.target.files?.[0] || "",
                  }))
                }
                className="w-full rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-sky-700 file:px-4 file:py-2 file:text-white"
              />
            </div>

            {/* STATUS */}
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 py-4 font-extrabold text-white shadow-lg disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Doctor"
                : "Add Doctor"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl bg-slate-200 py-3 font-bold text-slate-700"
              >
                Cancel Edit
              </button>
            )}

          </form>
        </div>

        {/* ==================================================
            DOCTOR LIST
        ================================================== */}
        <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl xl:col-span-2">

          <div className="mb-6 flex items-center justify-between">

            <div>
              <h2 className="text-2xl font-extrabold text-sky-950">
                Doctor List
              </h2>

              <p className="text-sm text-gray-500">
                Total doctors: {doctors.length}
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDoctors}
              className="rounded-xl bg-sky-900 px-4 py-2 font-bold text-white"
            >
              Refresh
            </button>

          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">
              Loading...
            </div>
          ) : doctors.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No doctors found.
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">

              {doctors.map((doctor) => (
                <div
                  key={doctor._id}
                  className="overflow-hidden rounded-3xl border border-sky-100 bg-sky-50"
                >

                  {/* IMAGE */}
                  <div className="h-56 bg-white">

                    {doctor.image ? (
                      <img
                        src={
                          doctor.image?.startsWith(
                            "/uploads"
                          )
                            ? `${API.replace(
                                "/api",
                                ""
                              )}${doctor.image}`
                            : doctor.image
                        }
                        alt={doctor.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-7xl">
                        👨‍⚕️
                      </div>
                    )}

                  </div>

                  <div className="p-5">

                    {/* NAME + STATUS */}
                    <div className="flex items-start justify-between gap-3">

                      <div>
                        <h3 className="text-xl font-extrabold text-sky-950">
                          {doctor.name}
                        </h3>

                        <p className="font-bold text-cyan-700">
                          {doctor.specialist}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          doctor.status ===
                          "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {doctor.status}
                      </span>

                    </div>

                    {/* AVAILABILITY BADGES */}
                    <div className="mt-4 flex flex-wrap gap-2">

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          doctor.opdAvailable
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {doctor.opdAvailable
                          ? "✓ OPD Available"
                          : "✕ OPD Not Available"}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          doctor.indoorDoctor
                            ? "bg-blue-100 text-blue-700"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {doctor.indoorDoctor
                          ? "✓ Indoor Doctor"
                          : "No Indoor"}
                      </span>

                    </div>

                    {/* INFORMATION */}
                    <div className="mt-4 space-y-2 text-sm text-gray-600">

                      {doctor.qualification && (
                        <p>
                          🎓{" "}
                          {doctor.qualification}
                        </p>
                      )}

                      {doctor.experience && (
                        <p>
                          ⭐{" "}
                          {doctor.experience}
                        </p>
                      )}

                      {doctor.department && (
                        <p>
                          🏥{" "}
                          {doctor.department}
                        </p>
                      )}

                    </div>

                    {/* FEES */}
                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3">

                        <p className="text-xs font-bold uppercase text-amber-700">
                          OPD Fee
                        </p>

                        <p className="mt-1 text-xl font-black text-amber-900">
                          ₹
                          {Number(
                            doctor.opdFee || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                      <div className="rounded-xl border border-blue-200 bg-blue-50 p-3">

                        <p className="text-xs font-bold uppercase text-blue-700">
                          Indoor Fee
                        </p>

                        <p className="mt-1 text-xl font-black text-blue-900">
                          ₹
                          {Number(
                            doctor.indoorFee || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>

                    </div>

                    {/* OPD SCHEDULE */}
                    {doctor.opdAvailable && (
                      <div className="mt-4 rounded-xl border border-sky-100 bg-white p-3">

                        {doctor.opdStartTime &&
                          doctor.opdEndTime && (
                            <p className="text-sm font-bold text-slate-700">
                              🕒{" "}
                              {
                                doctor.opdStartTime
                              }{" "}
                              -{" "}
                              {
                                doctor.opdEndTime
                              }
                            </p>
                          )}

                        {doctor.opdDays
                          ?.length > 0 && (
                          <p className="mt-1 text-xs text-slate-500">
                            📅{" "}
                            {doctor.opdDays.join(
                              ", "
                            )}
                          </p>
                        )}

                      </div>
                    )}

                    {/* APPOINTMENT */}
                    <div className="mt-4 grid grid-cols-2 gap-3">

                      <div className="rounded-xl bg-purple-50 p-3">

                        <p className="text-xs font-bold text-purple-700">
                          Minimum Slot
                        </p>

                        <p className="mt-1 font-black text-purple-900">
                          ⏱{" "}
                          {doctor.slotDuration ||
                            15}{" "}
                          min
                        </p>

                      </div>

                      <div className="rounded-xl bg-slate-100 p-3">

                        <p className="text-xs font-bold text-slate-600">
                          Max Patients
                        </p>

                        <p className="mt-1 font-black text-slate-800">
                          👥{" "}
                          {doctor.maxPatientsPerDay ||
                            30}
                          /day
                        </p>

                      </div>

                    </div>

                    {/* ACTIONS */}
                    <div className="mt-5 flex gap-2">

                      <button
                        type="button"
                        onClick={() =>
                          editDoctor(
                            doctor
                          )
                        }
                        className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          deleteDoctor(
                            doctor._id
                          )
                        }
                        className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white hover:bg-red-700"
                      >
                        Delete
                      </button>

                    </div>

                  </div>
                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </>
  );
}