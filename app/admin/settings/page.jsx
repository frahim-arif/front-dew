"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const emptyForm = {
  hospitalName: "",
  tagline: "",
  phone: "",
  whatsapp: "",
  emergency: "",
  email: "",
  address: "",
  opdDays: "",
  opdTime: "",
  logo: "",
  mapUrl: "",
};

export default function AdminSettingsPage() {
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/settings`);
      const data = await res.json();

      if (data.success && data.data) {
        setForm({
          hospitalName: data.data.hospitalName || "",
          tagline: data.data.tagline || "",
          phone: data.data.phone || "",
          whatsapp: data.data.whatsapp || "",
          emergency: data.data.emergency || "",
          email: data.data.email || "",
          address: data.data.address || "",
          opdDays: data.data.opdDays || "",
          opdTime: data.data.opdTime || "",
          logo: data.data.logo || "",
          mapUrl: data.data.mapUrl || "",
        });
      }
    } catch (err) {
      console.log(err);
      alert("Unable to fetch settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const saveSettings = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const res = await fetch(`${API}/settings`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!data.success) {
        return alert(data.message);
      }

      alert("✅ Settings Updated Successfully");
    } catch (err) {
      console.log(err);
      alert("Server Error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-32 text-center text-2xl font-bold">
        Loading Settings...
      </div>
    );
  }

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-sky-950">
          Hospital Settings
        </h1>

        <p className="mt-2 text-gray-500">
          Update hospital information shown across the website.
        </p>
      </div>

      <div className="rounded-3xl bg-white shadow-xl border border-sky-100 p-8">

        <form
          onSubmit={saveSettings}
          className="grid gap-5 md:grid-cols-2"
        >

          <input
            name="hospitalName"
            value={form.hospitalName}
            onChange={handleChange}
            placeholder="Hospital Name"
            className="rounded-xl border p-4"
          />

          <input
            name="tagline"
            value={form.tagline}
            onChange={handleChange}
            placeholder="Tagline"
            className="rounded-xl border p-4"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="rounded-xl border p-4"
          />

          <input
            name="whatsapp"
            value={form.whatsapp}
            onChange={handleChange}
            placeholder="WhatsApp Number"
            className="rounded-xl border p-4"
          />

          <input
            name="emergency"
            value={form.emergency}
            onChange={handleChange}
            placeholder="Emergency Number"
            className="rounded-xl border p-4"
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="rounded-xl border p-4"
          />

          <input
            name="opdDays"
            value={form.opdDays}
            onChange={handleChange}
            placeholder="OPD Days"
            className="rounded-xl border p-4"
          />

          <input
            name="opdTime"
            value={form.opdTime}
            onChange={handleChange}
            placeholder="OPD Time"
            className="rounded-xl border p-4"
          />

          <input
            name="logo"
            value={form.logo}
            onChange={handleChange}
            placeholder="Logo URL"
            className="rounded-xl border p-4 md:col-span-2"
          />

          <input
            name="mapUrl"
            value={form.mapUrl}
            onChange={handleChange}
            placeholder="Google Map Embed URL"
            className="rounded-xl border p-4 md:col-span-2"
          />

          <textarea
            rows={4}
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Hospital Address"
            className="rounded-xl border p-4 md:col-span-2"
          />

          <button
            disabled={saving}
            className="md:col-span-2 rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 py-4 text-lg font-extrabold text-white shadow-xl disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>

        </form>

      </div>

      <div className="mt-8 rounded-3xl bg-white shadow-xl border border-sky-100 p-8">

        <h2 className="text-2xl font-bold mb-6">
          Live Preview
        </h2>

        <div className="grid md:grid-cols-2 gap-6">

          <div>
            <p className="text-gray-500">Hospital</p>
            <h3 className="text-3xl font-extrabold text-sky-900">
              {form.hospitalName}
            </h3>

            <p className="mt-2 text-cyan-700 font-semibold">
              {form.tagline}
            </p>

            <div className="mt-6 space-y-2 text-gray-700">

              <p>📞 {form.phone}</p>

              <p>📱 {form.whatsapp}</p>

              <p>🚑 {form.emergency}</p>

              <p>✉ {form.email}</p>

              <p>🕒 {form.opdDays}</p>

              <p>{form.opdTime}</p>

            </div>

            <div className="mt-5">
              📍 {form.address}
            </div>
          </div>

          <div>

            {form.logo ? (
              <img
                src={form.logo}
                className="rounded-3xl border w-full h-72 object-contain bg-slate-50"
                alt="Hospital Logo"
              />
            ) : (
              <div className="h-72 rounded-3xl bg-slate-100 flex items-center justify-center text-7xl">
                🏥
              </div>
            )}

          </div>

        </div>

      </div>
    </>
  );
}