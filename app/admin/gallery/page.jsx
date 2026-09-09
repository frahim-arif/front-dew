"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew.onrender.com/api";

const SERVER_URL = API_URL.replace("/api", "");

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [formData, setFormData] = useState({
    title: "",
    category: "Hospital",
    status: "Active",
    type: "image",
    image: null,
    youtubeUrl: "",
  });

  useEffect(() => {
    fetchGallery();
  }, []);

  // ===============================
  // Fetch Gallery
  // ===============================

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`${API_URL}/gallery`);

      setGallery(res.data.data || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Handle Input
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      if (value === "image") {
        setPreview("");

        setFormData((prev) => ({
          ...prev,
          type: "image",
          image: null,
          youtubeUrl: "",
        }));
      } else {
        setPreview("");

        setFormData((prev) => ({
          ...prev,
          type: "video",
          image: null,
        }));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ===============================
  // Image
  // ===============================

  const handleImage = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  // ===============================
  // Submit
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", formData.title);
      data.append("category", formData.category);
      data.append("status", formData.status);
      data.append("type", formData.type);

      if (formData.type === "image") {
        if (formData.image) {
          data.append("image", formData.image);
        }
      } else {
        data.append(
          "youtubeUrl",
          formData.youtubeUrl
        );
      }

      if (editingId) {
        await axios.put(
          `${API_URL}/gallery/${editingId}`,
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert("Gallery Updated Successfully");
      } else {
        await axios.post(
          `${API_URL}/gallery`,
          data,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert("Gallery Added Successfully");
      }

      setFormData({
        title: "",
        category: "Hospital",
        status: "Active",
        type: "image",
        image: null,
        youtubeUrl: "",
      });

      setPreview("");
      setEditingId(null);

      fetchGallery();

    } catch (err) {
      console.log(err);

      alert(
        err.response?.data?.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // Delete
  // ===============================

  const deleteGallery = async (id) => {
    if (!window.confirm("Delete this item?")) return;

    try {
      await axios.delete(`${API_URL}/gallery/${id}`);

      fetchGallery();

      alert("Deleted Successfully");
    } catch (err) {
      console.log(err);
    }
  };

  // ===============================
  // Edit
  // ===============================

  const editGallery = (item) => {
    setEditingId(item._id);

    setFormData({
      title: item.title,
      category: item.category,
      status: item.status,
      type: item.type,
      image: null,
      youtubeUrl: item.youtubeUrl || "",
    });

    if (item.type === "image") {
      setPreview(`${SERVER_URL}${item.image}`);
    } else {
      setPreview("");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===============================
  // Filter
  // ===============================

  const filteredGallery = gallery.filter((item) => {
    const searchMatch =
      item.title
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      item.category
        .toLowerCase()
        .includes(search.toLowerCase());

    const filterMatch =
      filter === "All"
        ? true
        : item.type === filter.toLowerCase();

    return searchMatch && filterMatch;
  });

  return (
    <div className="min-h-screen bg-slate-100 p-6">

  {/* Header */}

  <div className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 p-8 text-white shadow-xl">

    <h1 className="text-4xl font-black">
      Gallery Management
    </h1>

    <p className="mt-2 text-emerald-100">
      Upload Hospital Images & YouTube Videos
    </p>

  </div>

  {/* Upload Form */}

  <div className="rounded-3xl bg-white p-8 shadow-xl">

    <form onSubmit={handleSubmit}>

      <div className="grid gap-6 md:grid-cols-2">

        {/* Title */}

        <div className="md:col-span-2">

          <label className="mb-2 block font-bold">
            Gallery Title
          </label>

          <input
            type="text"
            name="title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter Gallery Title"
            className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-emerald-500"
          />

        </div>

        {/* Category */}

        <div>

          <label className="mb-2 block font-bold">
            Category
          </label>

          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3"
          >
            <option>Hospital</option>
            <option>Doctors</option>
            <option>Patients</option>
            <option>Events</option>
            <option>Operation</option>
            <option>Facilities</option>
            <option>Emergency</option>
            <option>Others</option>
          </select>

        </div>

        {/* Status */}

        <div>

          <label className="mb-2 block font-bold">
            Status
          </label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded-xl border border-gray-300 p-3"
          >
            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>

        </div>

      </div>

      {/* Type */}

      <div className="mt-8">

        <label className="mb-3 block font-bold">
          Upload Type
        </label>

        <div className="flex gap-8">

          <label className="flex cursor-pointer items-center gap-2">

            <input
              type="radio"
              name="type"
              value="image"
              checked={formData.type === "image"}
              onChange={handleChange}
            />

            📷 Image

          </label>

          <label className="flex cursor-pointer items-center gap-2">

            <input
              type="radio"
              name="type"
              value="video"
              checked={formData.type === "video"}
              onChange={handleChange}
            />

            ▶ YouTube Video

          </label>

        </div>

      </div>

      {/* Image */}

      {formData.type === "image" && (

        <div className="mt-6">

          <label className="mb-2 block font-bold">
            Upload Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="w-full rounded-xl border border-gray-300 p-3"
          />

        </div>

      )}

      {/* YouTube */}

      {formData.type === "video" && (

        <div className="mt-6">

          <label className="mb-2 block font-bold">
            YouTube URL
          </label>

          <input
            type="text"
            name="youtubeUrl"
            value={formData.youtubeUrl}
            onChange={handleChange}
            placeholder="https://youtu.be/xxxxxxxxxxx"
            className="w-full rounded-xl border border-gray-300 p-3"
          />

          <p className="mt-2 text-sm text-gray-500">
            Supported:
            youtube.com/watch?v=
            <br />
            youtu.be/
            <br />
            youtube.com/embed/
            <br />
            youtube.com/shorts/
          </p>

        </div>

      )}

      {/* Preview */}

      {preview && formData.type === "image" && (

        <div className="mt-8">

          <img
            src={preview}
            alt="Preview"
            className="h-64 rounded-2xl border object-cover shadow"
          />

        </div>

      )}

      {/* Button */}

      <button
        type="submit"
        disabled={loading}
        className="mt-8 rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white transition hover:bg-emerald-700"
      >
        {editingId
          ? "Update Gallery"
          : "Add Gallery"}
      </button>

    </form>

  </div>
        {/* ============================= */}
      {/* Gallery List */}
      {/* ============================= */}

      <div className="mt-12">

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <h2 className="text-3xl font-black">
            Gallery Items
          </h2>

          <div className="flex gap-3">

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <select
              value={filter}
              onChange={(e) =>
                setFilter(e.target.value)
              }
              className="rounded-xl border border-gray-300 px-4"
            >
              <option value="All">
                All
              </option>

              <option value="Image">
                Images
              </option>

              <option value="Video">
                Videos
              </option>

            </select>

          </div>

        </div>

        {loading ? (

          <div className="py-16 text-center">

            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />

          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {filteredGallery.map((item) => {

              const getYoutubeId = (url = "") => {

                try {

                  const u = new URL(url);

                  if (u.hostname === "youtu.be") {
                    return u.pathname.slice(1);
                  }

                  if (u.searchParams.get("v")) {
                    return u.searchParams.get("v");
                  }

                  if (
                    u.pathname.includes("/embed/")
                  ) {
                    return u.pathname.split(
                      "/embed/"
                    )[1];
                  }

                  if (
                    u.pathname.includes("/shorts/")
                  ) {
                    return u.pathname.split(
                      "/shorts/"
                    )[1];
                  }

                  return "";

                } catch {

                  return "";

                }

              };

              const youtubeId =
                getYoutubeId(
                  item.youtubeUrl
                );

              return (

                <div
                  key={item._id}
                  className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
                >

                  {/* Media */}

                  {item.type ===
                  "image" ? (

                    <img
                      src={`${SERVER_URL}${item.image}`}
                      alt={item.title}
                      className="h-64 w-full object-cover"
                    />

                  ) : (

                    <iframe
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      className="h-64 w-full"
                      allowFullScreen
                    />

                  )}

                  {/* Content */}

                  <div className="space-y-4 p-6">

                    <div className="flex items-center justify-between">

                      <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                        {item.category}
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-sm font-semibold ${
                          item.status ===
                          "Active"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status}
                      </span>

                    </div>

                    <h3 className="text-xl font-bold">
                      {item.title}
                    </h3>

                    <div className="grid grid-cols-2 gap-3">

                      <button
                        onClick={() =>
                          editGallery(item)
                        }
                        className="rounded-xl bg-amber-500 py-3 font-bold text-white hover:bg-amber-600"
                      >
                        ✏ Edit
                      </button>

                      <button
                        onClick={() =>
                          deleteGallery(
                            item._id
                          )
                        }
                        className="rounded-xl bg-red-600 py-3 font-bold text-white hover:bg-red-700"
                      >
                        🗑 Delete
                      </button>

                    </div>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>
          </div>


);
}