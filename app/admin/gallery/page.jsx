"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

const SERVER_URL = API_URL.replace("/api", "");

export default function AdminGallery() {
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [preview, setPreview] = useState("");

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // ==================================================
  // FORM DATA
  // ==================================================

  const [formData, setFormData] = useState({
    title: "",
    category: "Hospital",
    status: "Active",
    type: "image",
    image: null,
    youtubeUrl: "",
    facebookUrl: "",
  });

  // ==================================================
  // FETCH GALLERY
  // ==================================================

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${API_URL}/gallery`
      );

      setGallery(res.data.data || []);
    } catch (err) {
      console.error(
        "Fetch Gallery Error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "type") {
      setPreview("");

      setFormData((prev) => ({
        ...prev,
        type: value,
        image: null,
        youtubeUrl: "",
        facebookUrl: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // IMAGE
  // ==================================================

  const handleImage = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(
      URL.createObjectURL(file)
    );
  };

  // ==================================================
  // RESET
  // ==================================================

  const resetForm = () => {
    setFormData({
      title: "",
      category: "Hospital",
      status: "Active",
      type: "image",
      image: null,
      youtubeUrl: "",
      facebookUrl: "",
    });

    setPreview("");
    setEditingId(null);
  };

  // ==================================================
  // SUBMIT
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      data.append(
        "title",
        formData.title.trim()
      );

      data.append(
        "category",
        formData.category
      );

      data.append(
        "status",
        formData.status
      );

      data.append(
        "type",
        formData.type
      );

      // IMAGE
      if (formData.type === "image") {
        if (formData.image) {
          data.append(
            "image",
            formData.image
          );
        }
      }

      // YOUTUBE
      if (formData.type === "video") {
        data.append(
          "youtubeUrl",
          formData.youtubeUrl.trim()
        );
      }

      // FACEBOOK
      if (formData.type === "facebook") {
        data.append(
          "facebookUrl",
          formData.facebookUrl.trim()
        );
      }

      // UPDATE
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

        alert(
          "Gallery Updated Successfully"
        );
      }

      // CREATE
      else {
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

        alert(
          "Gallery Added Successfully"
        );
      }

      resetForm();

      await fetchGallery();
    } catch (err) {
      console.error(
        "Gallery Submit Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // DELETE
  // ==================================================

  const deleteGallery = async (id) => {
    if (
      !window.confirm(
        "Delete this gallery item?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      await axios.delete(
        `${API_URL}/gallery/${id}`
      );

      alert(
        "Deleted Successfully"
      );

      await fetchGallery();
    } catch (err) {
      console.error(
        "Delete Gallery Error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Delete failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // EDIT
  // ==================================================

  const editGallery = (item) => {
    setEditingId(item._id);

    setFormData({
      title: item.title || "",
      category:
        item.category || "Hospital",
      status:
        item.status || "Active",
      type:
        item.type || "image",
      image: null,
      youtubeUrl:
        item.youtubeUrl || "",
      facebookUrl:
        item.facebookUrl || "",
    });

    if (
      item.type === "image" &&
      item.image
    ) {
      setPreview(
        `${SERVER_URL}${item.image}`
      );
    } else {
      setPreview("");
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ==================================================
  // YOUTUBE ID
  // ==================================================

  const getYoutubeId = (url = "") => {
    if (!url) return "";

    try {
      const u = new URL(
        url.trim()
      );

      const hostname =
        u.hostname.toLowerCase();

      if (
        hostname === "youtu.be"
      ) {
        return u.pathname
          .replace("/", "")
          .split("/")[0];
      }

      const videoId =
        u.searchParams.get("v");

      if (videoId) {
        return videoId;
      }

      if (
        u.pathname.includes(
          "/embed/"
        )
      ) {
        return u.pathname
          .split("/embed/")[1]
          .split("/")[0];
      }

      if (
        u.pathname.includes(
          "/shorts/"
        )
      ) {
        return u.pathname
          .split("/shorts/")[1]
          .split("/")[0];
      }

      return "";
    } catch {
      return "";
    }
  };

  // ==================================================
  // FACEBOOK URL VALIDATION
  // ==================================================

  const isFacebookUrl = (url = "") => {
    if (!url.trim()) {
      return false;
    }

    try {
      const u = new URL(
        url.trim()
      );

      const hostname =
        u.hostname
          .toLowerCase()
          .replace(/^www\./, "");

      return (
        hostname === "facebook.com" ||
        hostname.endsWith(
          ".facebook.com"
        ) ||
        hostname === "fb.watch"
      );
    } catch {
      return false;
    }
  };

  // ==================================================
  // FACEBOOK URL TYPE
  // ==================================================

  const getFacebookUrlType = (
    url = ""
  ) => {
    if (!url) {
      return "Facebook Video";
    }

    try {
      const pathname =
        new URL(url)
          .pathname
          .toLowerCase();

      if (
        pathname.includes(
          "/share/v/"
        )
      ) {
        return "Facebook Share Video";
      }

      if (
        pathname.includes(
          "/reel/"
        )
      ) {
        return "Facebook Reel";
      }

      if (
        pathname.includes(
          "/watch"
        )
      ) {
        return "Facebook Watch";
      }

      if (
        pathname.includes(
          "/videos/"
        )
      ) {
        return "Facebook Video";
      }

      return "Facebook Video";
    } catch {
      return "Facebook Video";
    }
  };

  // ==================================================
  // FILTER
  // ==================================================

  const filteredGallery =
    gallery.filter((item) => {
      const title =
        item.title || "";

      const category =
        item.category || "";

      const searchText =
        search.toLowerCase();

      const searchMatch =
        title
          .toLowerCase()
          .includes(searchText) ||
        category
          .toLowerCase()
          .includes(searchText);

      const filterMatch =
        filter === "All"
          ? true
          : item.type ===
            filter.toLowerCase();

      return (
        searchMatch &&
        filterMatch
      );
    });

  // ==================================================
  // UI
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-100 p-6">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8 rounded-3xl bg-gradient-to-r from-emerald-700 via-green-700 to-teal-700 p-8 text-white shadow-xl">

        <h1 className="text-4xl font-black">
          Gallery Management
        </h1>

        <p className="mt-2 text-emerald-100">
          Upload Hospital Images,
          YouTube Videos & Facebook Videos
        </p>

      </div>

      {/* ==================================================
          FORM
      ================================================== */}

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <form onSubmit={handleSubmit}>

          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}

          <div className="grid gap-6 md:grid-cols-2">

            {/* TITLE */}

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

            {/* CATEGORY */}

            <div>

              <label className="mb-2 block font-bold">
                Category
              </label>

              <select
                name="category"
                value={
                  formData.category
                }
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 p-3"
              >

                <option value="Hospital">
                  Hospital
                </option>

                <option value="Doctors">
                  Doctors
                </option>

                <option value="Patients">
                  Patients
                </option>

                <option value="Events">
                  Events
                </option>

                <option value="Operation">
                  Operation
                </option>

                <option value="Facilities">
                  Facilities
                </option>

                <option value="Emergency">
                  Emergency
                </option>

                <option value="Others">
                  Others
                </option>

              </select>

            </div>

            {/* STATUS */}

            <div>

              <label className="mb-2 block font-bold">
                Status
              </label>

              <select
                name="status"
                value={
                  formData.status
                }
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

          {/* ==================================================
              TYPE
          ================================================== */}

          <div className="mt-8">

            <label className="mb-3 block font-bold">
              Upload Type
            </label>

            <div className="flex flex-wrap gap-6">

              <label className="flex cursor-pointer items-center gap-2">

                <input
                  type="radio"
                  name="type"
                  value="image"
                  checked={
                    formData.type ===
                    "image"
                  }
                  onChange={
                    handleChange
                  }
                />

                📷 Image

              </label>

              <label className="flex cursor-pointer items-center gap-2">

                <input
                  type="radio"
                  name="type"
                  value="video"
                  checked={
                    formData.type ===
                    "video"
                  }
                  onChange={
                    handleChange
                  }
                />

                ▶ YouTube Video

              </label>

              <label className="flex cursor-pointer items-center gap-2">

                <input
                  type="radio"
                  name="type"
                  value="facebook"
                  checked={
                    formData.type ===
                    "facebook"
                  }
                  onChange={
                    handleChange
                  }
                />

                📘 Facebook Video

              </label>

            </div>

          </div>

          {/* ==================================================
              IMAGE
          ================================================== */}

          {formData.type ===
            "image" && (
            <div className="mt-6">

              <label className="mb-2 block font-bold">
                Upload Image
              </label>

              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                onChange={handleImage}
                className="w-full rounded-xl border border-gray-300 p-3"
              />

              <p className="mt-2 text-sm text-gray-500">
                JPG, PNG, WEBP or GIF.
                Maximum 10 MB.
              </p>

            </div>
          )}

          {/* ==================================================
              YOUTUBE
          ================================================== */}

          {formData.type ===
            "video" && (
            <div className="mt-6">

              <label className="mb-2 block font-bold">
                YouTube Video URL
              </label>

              <input
                type="url"
                name="youtubeUrl"
                required
                value={
                  formData.youtubeUrl
                }
                onChange={
                  handleChange
                }
                placeholder="https://youtu.be/xxxxxxxxxxx"
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-emerald-500"
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

          {/* ==================================================
              FACEBOOK
          ================================================== */}

          {formData.type ===
            "facebook" && (
            <div className="mt-6">

              <label className="mb-2 block font-bold">
                Facebook Video URL
              </label>

              <input
                type="url"
                name="facebookUrl"
                required
                value={
                  formData.facebookUrl
                }
                onChange={
                  handleChange
                }
                placeholder="https://www.facebook.com/share/v/..."
                className="w-full rounded-xl border border-gray-300 p-3 outline-none focus:border-emerald-500"
              />

              <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">

                <p className="font-bold">
                  Facebook Video
                </p>

                <p className="mt-1">
                  Paste your public Facebook
                  video, Reel, Watch or
                  Share Video URL.
                </p>

                <p className="mt-2 break-all font-mono text-xs">
                  https://www.facebook.com/share/v/...
                </p>

                <p className="mt-2">
                  Visitors will open the video
                  directly on Facebook.
                </p>

              </div>

              {formData.facebookUrl &&
                !isFacebookUrl(
                  formData.facebookUrl
                ) && (
                  <p className="mt-2 text-sm font-semibold text-red-600">
                    Please enter a valid
                    Facebook URL.
                  </p>
                )}

            </div>
          )}

          {/* ==================================================
              IMAGE PREVIEW
          ================================================== */}

          {preview &&
            formData.type ===
              "image" && (
              <div className="mt-8">

                <p className="mb-3 font-bold">
                  Image Preview
                </p>

                <img
                  src={preview}
                  alt="Preview"
                  className="h-64 w-full max-w-xl rounded-2xl border object-cover shadow"
                />

              </div>
            )}

          {/* ==================================================
              BUTTONS
          ================================================== */}

          <div className="mt-8 flex flex-wrap gap-3">

            <button
              type="submit"
              disabled={
                loading ||
                (formData.type ===
                  "facebook" &&
                  !isFacebookUrl(
                    formData.facebookUrl
                  ))
              }
              className="rounded-xl bg-emerald-600 px-8 py-3 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Saving..."
                : editingId
                ? "Update Gallery"
                : "Add Gallery"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-xl bg-gray-600 px-8 py-3 font-bold text-white transition hover:bg-gray-700"
              >
                Cancel Edit
              </button>
            )}

          </div>

        </form>

      </div>

      {/* ==================================================
          GALLERY LIST
      ================================================== */}

      <div className="mt-12">

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

          <h2 className="text-3xl font-black">
            Gallery Items
          </h2>

          <div className="flex flex-col gap-3 sm:flex-row">

            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              className="rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-emerald-500"
            />

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
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
                YouTube Videos
              </option>

              <option value="Facebook">
                Facebook Videos
              </option>

            </select>

          </div>

        </div>

        {/* ==================================================
            LOADING
        ================================================== */}

        {loading ? (

          <div className="py-16 text-center">

            <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" />

          </div>

        ) : filteredGallery.length ===
          0 ? (

          <div className="rounded-3xl bg-white p-12 text-center shadow">

            <p className="text-lg font-semibold text-gray-500">
              No gallery items found.
            </p>

          </div>

        ) : (

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {filteredGallery.map(
              (item) => {

                const youtubeId =
                  getYoutubeId(
                    item.youtubeUrl
                  );

                return (

                  <div
                    key={item._id}
                    className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl"
                  >

                    {/* ==================================================
                        MEDIA
                    ================================================== */}

                    <div className="bg-black">

                      {/* IMAGE */}

                      {item.type ===
                        "image" && (
                        <img
                          src={`${SERVER_URL}${item.image}`}
                          alt={
                            item.title
                          }
                          className="h-64 w-full object-cover"
                        />
                      )}

                      {/* YOUTUBE */}

                      {item.type ===
                        "video" &&
                        youtubeId && (
                        <iframe
                          src={`https://www.youtube.com/embed/${youtubeId}`}
                          title={
                            item.title
                          }
                          className="h-64 w-full"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      )}

                      {/* INVALID YOUTUBE */}

                      {item.type ===
                        "video" &&
                        !youtubeId && (
                        <div className="flex h-64 items-center justify-center bg-slate-900 px-6 text-center text-white">

                          <div>

                            <p className="font-bold">
                              Invalid YouTube URL
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                              Please edit this
                              gallery item.
                            </p>

                          </div>

                        </div>
                      )}

                      {/* FACEBOOK */}

                      {item.type ===
                        "facebook" && (
                        <div className="flex h-64 flex-col items-center justify-center bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 px-6 text-center text-white">

                          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-5xl backdrop-blur">

                            📘

                          </div>

                          <p className="text-lg font-black">
                            Facebook Video
                          </p>

                          <p className="mt-1 text-sm text-blue-100">
                            Watch this video on
                            Facebook
                          </p>

                          {item.facebookUrl &&
                            isFacebookUrl(
                              item.facebookUrl
                            ) && (
                              <a
                                href={
                                  item.facebookUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-blue-700 shadow-lg transition hover:bg-blue-50"
                              >
                                ▶ Watch on Facebook
                              </a>
                            )}

                        </div>
                      )}

                    </div>

                    {/* ==================================================
                        CONTENT
                    ================================================== */}

                    <div className="space-y-4 p-6">

                      {/* BADGES */}

                      <div className="flex flex-wrap items-center justify-between gap-2">

                        <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                          {
                            item.category
                          }
                        </span>

                        <span
                          className={`rounded-full px-3 py-1 text-sm font-semibold ${
                            item.status ===
                            "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {
                            item.status
                          }
                        </span>

                      </div>

                      {/* TYPE */}

                      <div>

                        <span className="text-xs font-bold uppercase tracking-wider text-gray-400">

                          {item.type ===
                          "image"
                            ? "📷 Image"
                            : item.type ===
                              "video"
                            ? "▶ YouTube"
                            : "📘 Facebook"}

                        </span>

                      </div>

                      {/* TITLE */}

                      <h3 className="text-xl font-bold">
                        {item.title}
                      </h3>

                      {/* FACEBOOK DETAILS */}

                      {item.type ===
                        "facebook" &&
                        item.facebookUrl && (
                        <div className="rounded-xl bg-blue-50 p-3">

                          <p className="text-xs font-bold text-blue-700">
                            {
                              getFacebookUrlType(
                                item.facebookUrl
                              )
                            }
                          </p>

                          <p className="mt-1 truncate text-xs text-blue-500">
                            {
                              item.facebookUrl
                            }
                          </p>

                          <a
                            href={
                              item.facebookUrl
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-block text-sm font-bold text-blue-700 underline"
                          >
                            Open on Facebook
                          </a>

                        </div>
                      )}

                      {/* BUTTONS */}

                      <div className="grid grid-cols-2 gap-3">

                        <button
                          type="button"
                          onClick={() =>
                            editGallery(
                              item
                            )
                          }
                          className="rounded-xl bg-amber-500 py-3 font-bold text-white hover:bg-amber-600"
                        >
                          ✏ Edit
                        </button>

                        <button
                          type="button"
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
              }
            )}

          </div>

        )}

      </div>

    </div>
  );
}