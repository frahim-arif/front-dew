"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://backend-dew.onrender.com/api";
const SERVER_URL = API.replace("/api", "");

const emptyForm = {
  title: "",
  desc: "",
  icon: "",
  image: null,
  status: "Active",
};

export default function AdminServicesPage() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [preview, setPreview] = useState("");
  const [oldImage, setOldImage] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const getFileUrl = (path) => {
    if (!path) return "";
    return path.startsWith("/uploads") ? `${SERVER_URL}${path}` : path;
  };

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/services`);
      const data = await res.json();
      if (data.success) setServices(data.data || []);
    } catch (err) {
      console.error(err);
      alert("Unable to fetch services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setPreview("");
    setOldImage("");
    setEditingId(null);
  };

  const submitService = async (e) => {
    e.preventDefault();

    if (!form.title || !form.desc) {
      alert("Title and Description are required");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("desc", form.desc);
      formData.append("icon", form.icon);
      formData.append("status", form.status);

      if (form.image) {
        formData.append("image", form.image);
      }

      const url = editingId ? `${API}/services/${editingId}` : `${API}/services`;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to save service");
        return;
      }

      alert(editingId ? "Service updated successfully" : "Service added successfully");
      resetForm();
      fetchServices();
    } catch (err) {
      console.error(err);
      alert("Server error while saving service");
    } finally {
      setSaving(false);
    }
  };

  const editService = (service) => {
    setEditingId(service._id);
    setOldImage(service.image || "");
    setPreview(getFileUrl(service.image));

    setForm({
      title: service.title || "",
      desc: service.desc || "",
      icon: service.icon || "",
      image: null,
      status: service.status || "Active",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteService = async (id) => {
    if (!confirm("Delete this service?")) return;

    try {
      const res = await fetch(`${API}/services/${id}`, {
        method: "DELETE",
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Delete failed");
        return;
      }

      alert("Service deleted successfully");
      fetchServices();
    } catch (err) {
      console.error(err);
      alert("Server error while deleting service");
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-sky-950">Services</h1>
        <p className="mt-2 text-gray-500">
          Add, edit and manage hospital services.
        </p>
      </div>

      <div className="grid gap-8 xl:grid-cols-3">
        <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl">
          <h2 className="mb-6 text-2xl font-bold text-sky-950">
            {editingId ? "Edit Service" : "Add Service"}
          </h2>

          <form onSubmit={submitService} className="space-y-4">
            <input
              name="title"
              placeholder="Service Title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />

            <textarea
              rows={4}
              name="desc"
              placeholder="Description"
              value={form.desc}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />

            <input
              name="icon"
              placeholder="Icon e.g. 🩺"
              value={form.icon}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            />

            <input
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png"
              onChange={handleFile}
              className="w-full rounded-xl border p-3 file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-sky-700 file:px-4 file:py-2 file:text-white"
            />

            {editingId && oldImage && (
              <p className="text-sm text-gray-500">Current image: {oldImage}</p>
            )}

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="h-48 w-full rounded-2xl border object-cover"
              />
            )}

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border p-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>

            <button
              disabled={saving}
              className="w-full rounded-xl bg-sky-900 py-3 font-bold text-white disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingId
                ? "Update Service"
                : "Add Service"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="w-full rounded-xl bg-gray-200 py-3 font-bold"
              >
                Cancel
              </button>
            )}
          </form>
        </div>

        <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl xl:col-span-2">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-sky-950">Service List</h2>
              <p className="text-gray-500">{services.length} Services</p>
            </div>

            <button
              onClick={fetchServices}
              className="rounded-xl bg-sky-900 px-4 py-2 font-bold text-white"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="py-20 text-center">Loading...</div>
          ) : services.length === 0 ? (
            <div className="py-20 text-center">No Service Found</div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              {services.map((service) => (
                <div
                  key={service._id}
                  className="overflow-hidden rounded-3xl border border-sky-100 bg-sky-50"
                >
                  {service.image ? (
                    <img
                      src={getFileUrl(service.image)}
                      alt={service.title}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-slate-100 text-7xl">
                      {service.icon || "🏥"}
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex justify-between gap-3">
                      <h3 className="text-xl font-bold text-sky-950">
                        {service.title}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          service.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {service.status}
                      </span>
                    </div>

                    <p className="mt-3 text-gray-600">{service.desc}</p>

                    {service.icon && (
                      <p className="mt-3 text-3xl">{service.icon}</p>
                    )}

                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => editService(service)}
                        className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteService(service._id)}
                        className="flex-1 rounded-xl bg-red-600 py-3 font-bold text-white"
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