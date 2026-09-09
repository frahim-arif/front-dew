"use client";

import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "https://backend-dew.onrender.com/api";
const SERVER_URL = API.replace("/api", "");

const emptyForm = {
  title: "",
  desc: "",
  icon: "",
  image: null,
  category: "General",
  status: "Active",
};

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState([]);
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

  const fetchFacilities = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/facilities`);
      const data = await res.json();
      if (data.success) setFacilities(data.data || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
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

  const submitFacility = async (e) => {
    e.preventDefault();

    if (!form.title || !form.desc) {
      alert("Title and Description required");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("desc", form.desc);
      formData.append("icon", form.icon);
      formData.append("category", form.category);
      formData.append("status", form.status);

      if (form.image) {
        formData.append("image", form.image);
      }

      const url = editingId
        ? `${API}/facilities/${editingId}`
        : `${API}/facilities`;

      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        body: formData,
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.message || "Failed to save facility");
        return;
      }

      alert(editingId ? "Facility Updated" : "Facility Added");
      resetForm();
      fetchFacilities();
    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setSaving(false);
    }
  };

  const editFacility = (facility) => {
    setEditingId(facility._id);
    setOldImage(facility.image || "");
    setPreview(getFileUrl(facility.image));

    setForm({
      title: facility.title || "",
      desc: facility.desc || "",
      icon: facility.icon || "",
      image: null,
      category: facility.category || "General",
      status: facility.status || "Active",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const deleteFacility = async (id) => {
    if (!confirm("Delete this facility?")) return;

    const res = await fetch(`${API}/facilities/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();

    if (data.success) {
      alert("Facility deleted");
      fetchFacilities();
    } else {
      alert(data.message || "Delete failed");
    }
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-sky-950">Facilities</h1>
        <p className="text-gray-500 mt-2">
          Add and manage hospital facilities.
        </p>
      </div>

      <div className="grid xl:grid-cols-3 gap-8">
        <div className="bg-white rounded-3xl shadow-xl border p-6">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? "Edit Facility" : "Add Facility"}
          </h2>

          <form onSubmit={submitFacility} className="space-y-4">
            <input
              name="title"
              placeholder="Facility Title"
              value={form.title}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

            <textarea
              rows={4}
              name="desc"
              placeholder="Description"
              value={form.desc}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

            <input
              name="icon"
              placeholder="Icon (🏥)"
              value={form.icon}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            />

            <input
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png"
              onChange={handleFile}
              className="w-full border rounded-xl p-3 file:mr-4 file:rounded-lg file:border-0 file:bg-sky-700 file:px-4 file:py-2 file:text-white file:cursor-pointer"
            />

            {editingId && oldImage && (
              <p className="text-sm text-gray-500">Current image: {oldImage}</p>
            )}

            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="h-48 w-full rounded-2xl object-cover border"
              />
            )}

            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
            >
              <option value="General">General</option>
              <option value="Treatment">Treatment</option>
              <option value="Emergency">Emergency</option>
              <option value="Diagnostic">Diagnostic</option>
              <option value="Laboratory">Laboratory</option>
            </select>

            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full border rounded-xl p-3"
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
                ? "Update Facility"
                : "Add Facility"}
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

        <div className="xl:col-span-2 bg-white rounded-3xl shadow-xl border p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold">Facilities</h2>
              <p className="text-gray-500">{facilities.length} Facilities</p>
            </div>

            <button
              onClick={fetchFacilities}
              className="bg-sky-900 text-white px-4 py-2 rounded-xl"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="text-center py-20">Loading...</div>
          ) : facilities.length === 0 ? (
            <div className="text-center py-20">No Facility Found</div>
          ) : (
            <div className="grid md:grid-cols-2 gap-5">
              {facilities.map((facility) => (
                <div
                  key={facility._id}
                  className="rounded-3xl border overflow-hidden"
                >
                  {facility.image ? (
                    <img
                      src={getFileUrl(facility.image)}
                      alt={facility.title}
                      className="h-52 w-full object-cover"
                    />
                  ) : (
                    <div className="h-52 flex items-center justify-center text-7xl bg-slate-100">
                      {facility.icon || "🏥"}
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex justify-between">
                      <h3 className="text-xl font-bold">{facility.title}</h3>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${
                          facility.status === "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {facility.status}
                      </span>
                    </div>

                    <p className="mt-3 text-gray-600">{facility.desc}</p>

                    <p className="mt-3 font-semibold text-cyan-700">
                      {facility.category}
                    </p>

                    <div className="flex gap-3 mt-5">
                      <button
                        onClick={() => editFacility(facility)}
                        className="flex-1 rounded-xl bg-blue-600 py-3 text-white font-bold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteFacility(facility._id)}
                        className="flex-1 rounded-xl bg-red-600 py-3 text-white font-bold"
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