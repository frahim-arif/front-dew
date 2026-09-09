"use client";

import { useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export default function AdminTrainingApplicationsPage() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/training/applications`
      );

      const data = await res.json();

      if (data.success) {
        setApplications(data.data || []);
      }
    } catch (err) {
      console.error(err);
      alert("Unable to load applications");
    } finally {
      setLoading(false);
    }
  };
    const updateStatus = async (id, status) => {
    try {

      const res = await fetch(
        `${API}/training/applications/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const data = await res.json();

      if (!data.success) {
        return alert(data.message);
      }

      fetchApplications();

    } catch (err) {
      console.error(err);
      alert("Server Error");
    }
  };
    const deleteApplication = async (id) => {

    if (!confirm("Delete this application?"))
      return;

    try {

      const res = await fetch(
        `${API}/training/applications/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!data.success) {
        return alert(data.message);
      }

      alert("Application Deleted");

      fetchApplications();

    } catch (err) {

      console.error(err);

      alert("Server Error");

    }
  };
    return (
    <>
      <div className="mb-8">

        <h1 className="text-4xl font-extrabold text-sky-950">
          Training Applications
        </h1>

        <p className="mt-2 text-gray-500">
          Manage Student Applications
        </p>

      </div>
      <div className="rounded-3xl border border-sky-100 bg-white shadow-xl overflow-hidden">

  <div className="flex items-center justify-between border-b px-6 py-5">
    <div>
      <h2 className="text-2xl font-extrabold text-sky-950">
        Application List
      </h2>

      <p className="text-sm text-gray-500">
        Total Applications : {applications.length}
      </p>
    </div>

    <button
      onClick={fetchApplications}
      className="rounded-xl bg-sky-900 px-5 py-2 font-bold text-white"
    >
      Refresh
    </button>
  </div>

  {loading ? (

    <div className="p-10 text-center">
      Loading...
    </div>

  ) : applications.length === 0 ? (

    <div className="p-10 text-center text-gray-500">
      No Applications Found
    </div>

  ) : (

    <div className="overflow-x-auto">

      <table className="w-full">

        <thead className="bg-sky-50">

          <tr>

            <th className="px-5 py-4 text-left">
              Student
            </th>

            <th className="px-5 py-4 text-left">
              Course
            </th>

            <th className="px-5 py-4 text-left">
              Phone
            </th>

            <th className="px-5 py-4 text-left">
              Qualification
            </th>

            <th className="px-5 py-4 text-left">
              Status
            </th>

            <th className="px-5 py-4 text-center">
              Actions
            </th>

          </tr>

        </thead>

        <tbody>

          {applications.map((item) => (

            <tr
              key={item._id}
              className="border-b hover:bg-slate-50"
            >

              <td className="px-5 py-4">

                <div className="font-bold">
                  {item.name}
                </div>

                <div className="text-sm text-gray-500">
                  {item.gender}
                </div>

              </td>

              <td className="px-5 py-4">
                {item.course?.title}
              </td>

              <td className="px-5 py-4">
                {item.phone}
              </td>

              <td className="px-5 py-4">
                {item.qualification}
              </td>

              <td className="px-5 py-4">
                                <select
                  value={item.status}
                  onChange={(e) =>
                    updateStatus(item._id, e.target.value)
                  }
                  className={`rounded-xl border px-3 py-2 text-sm font-bold outline-none ${
                    item.status === "Approved"
                      ? "border-green-300 bg-green-50 text-green-700"
                      : item.status === "Rejected"
                      ? "border-red-300 bg-red-50 text-red-700"
                      : item.status === "Completed"
                      ? "border-blue-300 bg-blue-50 text-blue-700"
                      : "border-amber-300 bg-amber-50 text-amber-700"
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Completed">Completed</option>
                </select>

              </td>

              <td className="px-5 py-4">

                <div className="flex items-center justify-center gap-2">

                  <button
                    onClick={() =>
                      alert(
                        `
Student : ${item.name}

Course : ${item.course?.title}

Phone : ${item.phone}

Email : ${item.email || "-"}

Father : ${item.fatherName || "-"}

Mother : ${item.motherName || "-"}

DOB : ${item.dob || "-"}

Qualification : ${item.qualification || "-"}

Address : ${item.address || "-"}

Aadhaar : ${item.aadhaar || "-"}
                        `
                      )
                    }
                    className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-bold text-white hover:bg-sky-700"
                  >
                    View
                  </button>

                  <button
                    onClick={() =>
                      deleteApplication(item._id)
                    }
                    className="rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white hover:bg-red-700"
                  >
                    Delete
                  </button>

                </div>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )}

</div>

</>
);
}