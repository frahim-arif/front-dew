"use client";

import { useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const SERVER =
  API.replace("/api", "");

const emptyForm = {
  title: "",
  shortDescription: "",
  description: "",
  duration: "",
  fees: "",
  eligibility: "",
  instructor: "",
  seats: 30,
  featured: false,
  status: "Active",
  image: "",
};

export default function AdminTrainingCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState(emptyForm);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchCourses();
  }, []);
  const fetchCourses = async () => {
  try {
    setLoading(true);

    const res = await fetch(`${API}/training/courses`);

    const data = await res.json();

   if (data.success) {
  setCourses(Array.isArray(data.data) ? data.data : []);
}
  } catch (err) {
    console.error(err);
    alert("Unable to load courses");
  } finally {
    setLoading(false);
  }
};
const handleChange = (e) => {
  const { name, value, type, checked } = e.target;

  setForm((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};
const resetForm = () => {
  setForm(emptyForm);

  setEditingId(null);
};
const submitCourse = async (e) => {
  e.preventDefault();

  if (!form.title) {
    return alert("Course title required");
  }

  try {
    setSaving(true);

    const url = editingId
      ? `${API}/training/courses/${editingId}`
      : `${API}/training/courses`;

    const method = editingId ? "PUT" : "POST";

   const body = {
  title: form.title,
  shortDescription: form.shortDescription,
  description: form.description,
  duration: form.duration,
  fees: form.fees,
  eligibility: form.eligibility,
  instructor: form.instructor,
  seats: form.seats,
  featured: form.featured,
  status: form.status,
  image: ""
};

   const res = await fetch(url, {
  method,
  headers:{
    "Content-Type":"application/json",
  },
  body: JSON.stringify(body),
});

    const data = await res.json();

    if (!data.success) {
      return alert(data.message);
    }

    alert(
      editingId
        ? "Course Updated Successfully"
        : "Course Added Successfully"
    );

    resetForm();

    fetchCourses();

  } catch (err) {

    console.error(err);

    alert("Server Error");

  } finally {

    setSaving(false);

  }
};
const editCourse = (course) => {
  if (!course) return;

  setEditingId(course._id);

  setForm({
    title: course.title || "",
    shortDescription: course.shortDescription || "",
    description: course.description || "",
    duration: course.duration || "",
    fees: course.fees || "",
    eligibility: course.eligibility || "",
    instructor: course.instructor || "",
    seats: course.seats || 30,
    featured: course.featured || false,
    status: course.status || "Active",
    image: course.image || "",
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};
const deleteCourse = async (id) => {
  if (!confirm("Delete this course?")) return;

  try {
    const res = await fetch(
      `${API}/training/courses/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await res.json();

    if (!data.success) {
      alert(data.message);
      return;
    }

    alert("Course Deleted");

    fetchCourses();

  } catch (err) {
    console.error(err);
    alert("Server Error");
  }
};
const filteredCourses = courses.filter(
  (course) =>
    course &&
    course.title &&
    course.title.toLowerCase().includes(search.toLowerCase())
);
return (
    <>
  <div className="mb-8">
    <h1 className="text-4xl font-extrabold text-sky-950">
      Training Courses
    </h1>

    <p className="mt-2 text-gray-500">
      Add, Edit and Manage Hospital Training Courses
    </p>
  </div>

  <div className="grid gap-8 xl:grid-cols-3">
    <div className="rounded-3xl border border-sky-100 bg-white p-6 shadow-xl">

<h2 className="text-2xl font-extrabold text-sky-950">

{editingId ? "Edit Course" : "Add Course"}

</h2>

<form
onSubmit={submitCourse}
className="mt-6 grid gap-4"
>
    <input
type="text"
name="title"
value={form.title}
onChange={handleChange}
placeholder="Course Title"
required
className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
/>
<input
type="text"
name="shortDescription"
value={form.shortDescription}
onChange={handleChange}
placeholder="Short Description"
className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
/>
<textarea
rows={5}
name="description"
value={form.description}
onChange={handleChange}
placeholder="Full Description"
className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
/>
<div className="grid grid-cols-2 gap-3">

<input
  type="text"
  name="duration"
  value={form.duration}
  onChange={handleChange}
  placeholder="Duration"
  className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
/>

<input
  type="number"
  name="fees"
  value={form.fees}
  onChange={handleChange}
  placeholder="Fees"
  className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
/>
<input
  type="text"
  name="eligibility"
  value={form.eligibility}
  onChange={handleChange}
  placeholder="Eligibility (Example: 10th Pass)"
  className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
/>

<input
  type="text"
  name="instructor"
  value={form.instructor}
  onChange={handleChange}
  placeholder="Instructor Name"
  className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
/>

</div>
<div className="grid grid-cols-2 gap-3">

  <input
    type="number"
    name="seats"
    value={form.seats}
    onChange={handleChange}
    placeholder="Available Seats"
    className="rounded-2xl border border-sky-100 px-4 py-3 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
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

</div>
<label className="flex items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3">

  <input
    type="checkbox"
    name="featured"
    checked={form.featured}
    onChange={handleChange}
    className="h-5 w-5"
  />

  <span className="font-bold text-slate-700">
    Featured Course
  </span>

</label>
<input
  type="file"
  accept=".jpg,.jpeg,.png"
  onChange={(e) =>
    setForm({
      ...form,
      image: e.target.files[0],
    })
  }
  className="rounded-2xl border border-sky-100 px-4 py-3 file:mr-4 file:rounded-xl file:border-0 file:bg-sky-700 file:px-4 file:py-2 file:font-bold file:text-white"
/>
{editingId &&
typeof form.image === "string" &&
form.image && (
  <img
    src={`${SERVER}${form.image}`}
    alt="Course"
    className="h-44 w-full rounded-2xl border object-cover"
  />
)}
<button
  type="submit"
  disabled={saving}
  className="rounded-2xl bg-gradient-to-r from-sky-800 to-cyan-500 py-4 text-lg font-extrabold text-white shadow-lg disabled:opacity-60"
>
  {saving
    ? "Saving..."
    : editingId
    ? "Update Course"
    : "Add Course"}
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
<div className="xl:col-span-2 rounded-3xl border border-sky-100 bg-white p-6 shadow-xl">

  <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

    <div>
      <h2 className="text-2xl font-extrabold text-sky-950">
        Course List
      </h2>

      <p className="text-sm text-gray-500">
        Total Courses : {filteredCourses.length}
      </p>
    </div>

    <div className="flex gap-3">

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search course..."
        className="rounded-xl border border-sky-100 px-4 py-2 outline-none focus:border-cyan-400"
      />

      <button
        onClick={fetchCourses}
        className="rounded-xl bg-sky-900 px-5 py-2 font-bold text-white"
      >
        Refresh
      </button>

    </div>

  </div>
  {loading ? (

<div className="py-16 text-center text-gray-500">

Loading Courses...

</div>

)
: filteredCourses.length===0 ? (

<div className="py-16 text-center text-gray-500">

No Training Courses Found

</div>

)
: (

<div className="grid gap-5 md:grid-cols-2">

{filteredCourses
  .filter(Boolean)
  .map((course) => (

<div
key={course._id}
className="overflow-hidden rounded-3xl border border-sky-100 bg-sky-50"
>
    <div className="relative h-56 bg-white">

{course.image ? (

<img
  src={
    course.image
      ? `${SERVER}${course.image}`
      : "/images/course-placeholder.jpg"
  }
  alt={course.title || "Course"}
  className="h-full w-full object-cover"
/>

) : (

<div className="flex h-full items-center justify-center text-7xl">

🎓

</div>

)}

{course.featured && (

<div className="absolute left-4 top-4 rounded-full bg-yellow-400 px-3 py-1 text-xs font-bold text-black">

⭐ Featured

</div>

)}

</div>
<div className="p-5">

<div className="flex items-start justify-between">

<div>

<h3 className="text-xl font-extrabold text-sky-950">

{course.title}

</h3>

<p className="mt-1 text-sm text-slate-600">

{course.shortDescription}

</p>

</div>

<span
className={`rounded-full px-3 py-1 text-xs font-bold ${
course.status==="Active"
?"bg-green-100 text-green-700"
:"bg-red-100 text-red-700"
}`}
>

{course.status}

</span>

</div>
<div className="mt-4 space-y-2 text-sm text-slate-600">

<p>⏳ Duration : {course.duration}</p>

<p>💰 Fees : ₹ {course.fees}</p>

<p>🎓 Eligibility : {course.eligibility}</p>

<p>👨‍🏫 Instructor : {course.instructor}</p>

<p>👥 Seats : {course.seats}</p>

</div>
<div className="mt-5 flex gap-3">

<button
onClick={()=>editCourse(course)}
className="flex-1 rounded-xl bg-blue-600 py-3 font-bold text-white"
>

Edit

</button>

<button
onClick={()=>deleteCourse(course._id)}
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