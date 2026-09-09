"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://backend-dew.onrender.com/api";

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
  opdStartTime: "",
  opdEndTime: "",
  opdDays: [],
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

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/doctors`);
      const data = await res.json();
      if (data.success) setDoctors(data.data || []);
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

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const toggleDay = (day) => {
    setForm((prev) => ({
      ...prev,
      opdDays: prev.opdDays.includes(day)
        ? prev.opdDays.filter((d) => d !== day)
        : [...prev.opdDays, day],
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const submitDoctor = async (e) => {
    e.preventDefault();

    if (!form.name || !form.specialist) {
      alert("Doctor name and specialist are required");
      return;
    }

    if (!form.opdStartTime || !form.opdEndTime) {
      alert("OPD start time and end time are required");
      return;
    }

    if (form.opdDays.length === 0) {
      alert("Please select at least one OPD day");
      return;
    }

    try {
      setSaving(true);

      const url = editingId ? `${API}/doctors/${editingId}` : `${API}/doctors`;
      const method = editingId ? "PUT" : "POST";

      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("specialist", form.specialist);
      formData.append("qualification", form.qualification);
      formData.append("experience", form.experience);
      formData.append("department", form.department);
      formData.append("opdStartTime", form.opdStartTime);
      formData.append("opdEndTime", form.opdEndTime);
      formData.append("opdDays", JSON.stringify(form.opdDays));
      formData.append("slotDuration", form.slotDuration);
      formData.append("maxPatientsPerDay", form.maxPatientsPerDay);
      formData.append("status", form.status);

      if (form.image && typeof form.image !== "string") {
        formData.append("image", form.image);
      }

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to save doctor");
        return;
      }

      alert(editingId ? "Doctor updated successfully" : "Doctor added successfully");
      resetForm();
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert("Server error while saving doctor");
    } finally {
      setSaving(false);
    }
  };

  const editDoctor = (doctor) => {
    setEditingId(doctor._id);

    setForm({
      name: doctor.name || "",
      specialist: doctor.specialist || "",
      qualification: doctor.qualification || "",
      experience: doctor.experience || "",
      department: doctor.department || "",
      opdStartTime: doctor.opdStartTime || "",
      opdEndTime: doctor.opdEndTime || "",
      opdDays: doctor.opdDays || [],
      slotDuration: doctor.slotDuration || 15,
      maxPatientsPerDay: doctor.maxPatientsPerDay || 30,
      image: doctor.image || "",
      status: doctor.status || "Active",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteDoctor = async (id) => {
    if (!confirm("Delete this doctor?")) return;

    try {
      const res = await fetch(`${API}/doctors/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to delete doctor");
        return;
      }

      alert("Doctor deleted successfully");
      fetchDoctors();
    } catch (err) {
      console.error(err);
      alert("Server error while deleting doctor");
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-sky-950">
          Doctors
        </h1>
        <p className="mt-2 text-gray-500">
          Add, edit and manage hospital doctors with OPD schedule.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="xl:col-span-1 rounded-3xl bg-white p-6 shadow-xl border border-sky-100">
          <h2 className="text-2xl font-extrabold text-sky-950">
            {editingId ? "Edit Doctor" : "Add Doctor"}
          </h2>

          <form onSubmit={submitDoctor} className="mt-6 grid gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Doctor Name"
              className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />

            <input
              name="specialist"
              value={form.specialist}
              onChange={handleChange}
              required
              placeholder="Specialist"
              className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />

            <input
              name="qualification"
              value={form.qualification}
              onChange={handleChange}
              placeholder="Qualification"
              className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />

            <input
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Experience"
              className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />

            <input
              name="department"
              value={form.department}
              onChange={handleChange}
              placeholder="Department"
              className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-sm font-bold text-slate-600">
                  OPD Start Time
                </label>
                <input
                  type="time"
                  name="opdStartTime"
                  value={form.opdStartTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-bold text-slate-600">
                  OPD End Time
                </label>
                <input
                  type="time"
                  name="opdEndTime"
                  value={form.opdEndTime}
                  onChange={handleChange}
                  required
                  className="w-full rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-slate-600">
                OPD Days
              </label>

              <div className="grid grid-cols-2 gap-2">
                {weekDays.map((day) => (
                  <label
                    key={day}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold transition ${
                      form.opdDays.includes(day)
                        ? "border-cyan-400 bg-cyan-50 text-cyan-700"
                        : "border-sky-100 bg-white text-slate-600"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={form.opdDays.includes(day)}
                      onChange={() => toggleDay(day)}
                    />
                    {day}
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="slotDuration"
                value={form.slotDuration}
                onChange={handleChange}
                min="5"
                placeholder="Slot Minutes"
                className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />

              <input
                type="number"
                name="maxPatientsPerDay"
                value={form.maxPatientsPerDay}
                onChange={handleChange}
                min="1"
                placeholder="Max Patients"
                className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
              />
            </div>

            <input
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png"
              onChange={(e) =>
                setForm({
                  ...form,
                  image: e.target.files[0],
                })
              }
              className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-700 file:px-4 file:py-2 file:text-white file:cursor-pointer"
            />

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              disabled={saving}
              className="rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 py-4 font-extrabold text-white shadow-lg disabled:opacity-60"
            >
              {saving ? "Saving..." : editingId ? "Update Doctor" : "Add Doctor"}
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

        <div className="xl:col-span-2 rounded-3xl bg-white p-6 shadow-xl border border-sky-100">
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
              onClick={fetchDoctors}
              className="rounded-xl bg-sky-900 px-4 py-2 font-bold text-white"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading...</div>
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
                  <div className="h-56 bg-white">
                    {doctor.image ? (
                      <img
                        src={
                          doctor.image?.startsWith("/uploads")
                            ? `${API.replace("/api", "")}${doctor.image}`
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
                          doctor.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {doctor.status}
                      </span>
                    </div>

                    <div className="mt-4 space-y-1 text-sm text-gray-600">
                      {doctor.qualification && <p>🎓 {doctor.qualification}</p>}
                      {doctor.experience && <p>⭐ {doctor.experience}</p>}
                      {doctor.department && <p>🏥 {doctor.department}</p>}

                      {doctor.opdStartTime && doctor.opdEndTime && (
                        <p>
                          🕒 {doctor.opdStartTime} - {doctor.opdEndTime}
                        </p>
                      )}

                      {doctor.opdDays?.length > 0 && (
                        <p>📅 {doctor.opdDays.join(", ")}</p>
                      )}

                      <p>⏱ {doctor.slotDuration || 15} Minutes / Slot</p>
                      <p>👥 {doctor.maxPatientsPerDay || 30} Patients / Day</p>
                    </div>

                    <div className="mt-5 flex gap-2">
                      <button
                        onClick={() => editDoctor(doctor)}
                        className="flex-1 rounded-xl bg-blue-600 px-4 py-3 font-bold text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteDoctor(doctor._id)}
                        className="flex-1 rounded-xl bg-red-600 px-4 py-3 font-bold text-white"
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