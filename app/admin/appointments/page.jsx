"use client";

import { useEffect, useMemo, useState } from "react";
import PrescriptionModal from "../../Components/PrescriptionModal";

const API =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const STATUS_OPTIONS = [
  "All",
  "Pending",
  "Confirmed",
  "Completed",
  "Cancelled",
];

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selected, setSelected] = useState(null);
  const [prescriptionAppointment, setPrescriptionAppointment] =
    useState(null);

  const fetchAppointments = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API}/appointments`, {
        cache: "no-store",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Unable to fetch appointments"
        );
      }

      setAppointments(data.data || []);
    } catch (error) {
      console.error("Fetch appointments error:", error);
      alert(
        error.message || "Unable to fetch appointments"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const getDoctorName = (appointment) => {
    return (
      appointment?.doctorId?.name ||
      appointment?.doctor ||
      "No doctor selected"
    );
  };

  const getDoctorSpecialist = (appointment) => {
    return appointment?.doctorId?.specialist || "";
  };

  const getDoctorDepartment = (appointment) => {
    return (
      appointment?.doctorId?.department ||
      appointment?.department ||
      "N/A"
    );
  };

  const filteredAppointments = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return appointments.filter((item) => {
      const doctorName =
        item.doctorId?.name || item.doctor || "";

      const doctorSpecialist =
        item.doctorId?.specialist || "";

      const searchableText = [
        item.name,
        item.phone,
        item.email,
        item.department,
        item.date,
        item.status,
        doctorName,
        doctorSpecialist,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        !keyword || searchableText.includes(keyword);

      const matchesStatus =
        statusFilter === "All" ||
        item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [appointments, search, statusFilter]);

  const appointmentStats = useMemo(() => {
    return {
      total: appointments.length,
      pending: appointments.filter(
        (item) => item.status === "Pending"
      ).length,
      confirmed: appointments.filter(
        (item) => item.status === "Confirmed"
      ).length,
      completed: appointments.filter(
        (item) => item.status === "Completed"
      ).length,
      cancelled: appointments.filter(
        (item) => item.status === "Cancelled"
      ).length,
    };
  }, [appointments]);

  const updateStatus = async (id, status) => {
    try {
      setActionLoading(`${id}-${status}`);

      const res = await fetch(
        `${API}/appointments/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status }),
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Status update failed"
        );
      }

      setAppointments((previousAppointments) =>
        previousAppointments.map((appointment) =>
          appointment._id === id
            ? {
                ...appointment,
                status,
              }
            : appointment
        )
      );

      if (selected?._id === id) {
        setSelected((previous) => ({
          ...previous,
          status,
        }));
      }

      alert(
        `✅ Appointment ${status.toLowerCase()} successfully.`
      );
    } catch (error) {
      console.error("Update status error:", error);
      alert(
        error.message ||
          "Server error while updating status"
      );
    } finally {
      setActionLoading("");
    }
  };

  const deleteAppointment = async (id) => {
    const confirmed = window.confirm(
      "Kya aap is appointment ko permanently delete karna chahte hain?"
    );

    if (!confirmed) return;

    try {
      setActionLoading(`${id}-delete`);

      const res = await fetch(
        `${API}/appointments/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Delete failed"
        );
      }

      setAppointments((previousAppointments) =>
        previousAppointments.filter(
          (appointment) => appointment._id !== id
        )
      );

      if (selected?._id === id) {
        setSelected(null);
      }

      if (prescriptionAppointment?._id === id) {
        setPrescriptionAppointment(null);
      }

      alert("✅ Appointment deleted successfully.");
    } catch (error) {
      console.error("Delete appointment error:", error);
      alert(
        error.message ||
          "Server error while deleting appointment"
      );
    } finally {
      setActionLoading("");
    }
  };

  const statusClass = {
    Pending: "bg-yellow-100 text-yellow-700",
    Confirmed: "bg-green-100 text-green-700",
    Completed: "bg-blue-100 text-blue-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  const statCards = [
    {
      label: "Total",
      value: appointmentStats.total,
      className: "from-sky-800 to-cyan-500",
    },
    {
      label: "Pending",
      value: appointmentStats.pending,
      className: "from-yellow-500 to-orange-500",
    },
    {
      label: "Confirmed",
      value: appointmentStats.confirmed,
      className: "from-green-600 to-emerald-400",
    },
    {
      label: "Completed",
      value: appointmentStats.completed,
      className: "from-blue-700 to-indigo-500",
    },
    {
      label: "Cancelled",
      value: appointmentStats.cancelled,
      className: "from-red-600 to-rose-400",
    },
  ];

  const ActionButton = ({
    item,
    status,
    label,
    className,
  }) => {
    const isLoading =
      actionLoading === `${item._id}-${status}`;

    const isCurrentStatus = item.status === status;

    return (
      <button
        type="button"
        onClick={() =>
          updateStatus(item._id, status)
        }
        disabled={isLoading || isCurrentStatus}
        className={`rounded-lg px-3 py-2 text-sm font-bold text-white transition hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        {isLoading
          ? "..."
          : isCurrentStatus
            ? status
            : label}
      </button>
    );
  };

  return (
    <>
      {/* Page Header */}
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-bold text-cyan-700">
            Appointment Management
          </p>

          <h1 className="mt-2 text-3xl font-extrabold text-sky-950 md:text-4xl">
            Appointments
          </h1>

          <p className="mt-2 text-gray-500">
            Patient appointments manage karein, status
            update karein aur prescription upload karein.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchAppointments}
          disabled={loading}
          className="rounded-xl bg-sky-900 px-5 py-3 font-bold text-white transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Statistics */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`rounded-2xl bg-gradient-to-br ${stat.className} p-5 text-white shadow-lg`}
          >
            <p className="text-sm font-semibold text-white/80">
              {stat.label}
            </p>

            <p className="mt-2 text-3xl font-extrabold">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder="Search patient, phone, email, department or doctor..."
          className="rounded-2xl border border-sky-100 bg-white px-5 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100 md:col-span-2"
        />

        <select
          value={statusFilter}
          onChange={(event) =>
            setStatusFilter(event.target.value)
          }
          className="rounded-2xl border border-sky-100 bg-white px-5 py-4 outline-none focus:border-cyan-400 focus:ring-4 focus:ring-cyan-100"
        >
          {STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {status === "All"
                ? "All Status"
                : status}
            </option>
          ))}
        </select>
      </div>

      {/* Appointment List */}
      <div className="overflow-hidden rounded-3xl border border-sky-100 bg-white shadow-xl">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-extrabold text-sky-950">
              Appointment List
            </h2>

            <p className="text-sm text-gray-500">
              Showing {filteredAppointments.length} of{" "}
              {appointments.length}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-sky-100 border-t-sky-700" />

            <p className="mt-4 text-gray-500">
              Loading appointments...
            </p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            No appointments found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden overflow-x-auto lg:block">
              <table className="w-full min-w-[1100px] text-left">
                <thead className="bg-sky-50 text-sky-950">
                  <tr>
                    <th className="p-4">Patient</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Department</th>
                    <th className="p-4">Date</th>
                    <th className="p-4">Doctor</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredAppointments.map(
                    (appointment) => (
                      <tr
                        key={appointment._id}
                        className="border-t transition hover:bg-sky-50"
                      >
                        <td className="p-4">
                          <p className="font-bold text-sky-950">
                            {appointment.name}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            {appointment.email ||
                              "No email"}
                          </p>
                        </td>

                        <td className="p-4">
                          <a
                            href={`tel:${appointment.phone}`}
                            className="font-medium text-sky-800 hover:underline"
                          >
                            {appointment.phone}
                          </a>
                        </td>

                        <td className="p-4">
                          {getDoctorDepartment(
                            appointment
                          )}
                        </td>

                        <td className="p-4">
                          {appointment.date}
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-sky-950">
                            👨‍⚕️{" "}
                            {getDoctorName(
                              appointment
                            )}
                          </p>

                          {getDoctorSpecialist(
                            appointment
                          ) && (
                            <p className="mt-1 text-xs font-medium text-cyan-700">
                              {getDoctorSpecialist(
                                appointment
                              )}
                            </p>
                          )}
                        </td>

                        <td className="p-4">
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-bold ${
                              statusClass[
                                appointment.status
                              ] ||
                              "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {appointment.status}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setSelected(
                                  appointment
                                )
                              }
                              className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-bold text-white transition hover:bg-slate-800"
                            >
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setPrescriptionAppointment(
                                  appointment
                                )
                              }
                              className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-purple-700"
                            >
                              Prescription
                            </button>

                            <ActionButton
                              item={appointment}
                              status="Confirmed"
                              label="Confirm"
                              className="bg-green-600"
                            />

                            <ActionButton
                              item={appointment}
                              status="Completed"
                              label="Complete"
                              className="bg-blue-600"
                            />

                            <ActionButton
                              item={appointment}
                              status="Cancelled"
                              label="Cancel"
                              className="bg-orange-500"
                            />

                            <button
                              type="button"
                              onClick={() =>
                                deleteAppointment(
                                  appointment._id
                                )
                              }
                              disabled={
                                actionLoading ===
                                `${appointment._id}-delete`
                              }
                              className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {actionLoading ===
                              `${appointment._id}-delete`
                                ? "..."
                                : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="space-y-4 p-4 lg:hidden">
              {filteredAppointments.map(
                (appointment) => (
                  <div
                    key={appointment._id}
                    className="rounded-2xl border border-sky-100 bg-sky-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="font-extrabold text-sky-950">
                          {appointment.name}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {appointment.email ||
                            "No email"}
                        </p>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          statusClass[
                            appointment.status
                          ] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-gray-700">
                      <p>
                        📞{" "}
                        <a
                          href={`tel:${appointment.phone}`}
                          className="font-medium text-sky-800"
                        >
                          {appointment.phone}
                        </a>
                      </p>

                      <p>
                        🏥{" "}
                        {getDoctorDepartment(
                          appointment
                        )}
                      </p>

                      <p>📅 {appointment.date}</p>

                      <p>
                        👨‍⚕️{" "}
                        {getDoctorName(
                          appointment
                        )}
                      </p>

                      {getDoctorSpecialist(
                        appointment
                      ) && (
                        <p>
                          🩺{" "}
                          {getDoctorSpecialist(
                            appointment
                          )}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSelected(appointment)
                        }
                        className="rounded-lg bg-slate-700 px-3 py-2 text-sm font-bold text-white"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setPrescriptionAppointment(
                            appointment
                          )
                        }
                        className="rounded-lg bg-purple-600 px-3 py-2 text-sm font-bold text-white"
                      >
                        Prescription
                      </button>

                      <ActionButton
                        item={appointment}
                        status="Confirmed"
                        label="Confirm"
                        className="bg-green-600"
                      />

                      <ActionButton
                        item={appointment}
                        status="Completed"
                        label="Complete"
                        className="bg-blue-600"
                      />

                      <ActionButton
                        item={appointment}
                        status="Cancelled"
                        label="Cancel"
                        className="bg-orange-500"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          deleteAppointment(
                            appointment._id
                          )
                        }
                        disabled={
                          actionLoading ===
                          `${appointment._id}-delete`
                        }
                        className="rounded-lg bg-red-600 px-3 py-2 text-sm font-bold text-white disabled:opacity-60"
                      >
                        {actionLoading ===
                        `${appointment._id}-delete`
                          ? "..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </>
        )}
      </div>

      {/* Appointment Details Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-sky-950">
                  Appointment Details
                </h2>

                <p className="text-gray-500">
                  Patient aur doctor ki full
                  information.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-xl bg-red-500 px-4 py-2 font-bold text-white"
              >
                Close
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                [
                  "Patient Name",
                  selected.name,
                ],
                ["Phone", selected.phone],
                [
                  "Email",
                  selected.email || "N/A",
                ],
                [
                  "Age",
                  selected.age || "N/A",
                ],
                [
                  "Gender",
                  selected.gender || "N/A",
                ],
                [
                  "Department",
                  getDoctorDepartment(selected),
                ],
                ["Date", selected.date],
                [
                  "Doctor",
                  getDoctorName(selected),
                ],
                [
                  "Specialist",
                  getDoctorSpecialist(
                    selected
                  ) || "N/A",
                ],
                [
                  "Qualification",
                  selected.doctorId
                    ?.qualification || "N/A",
                ],
                [
                  "Doctor Status",
                  selected.doctorId?.status ||
                    "N/A",
                ],
                ["Status", selected.status],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="rounded-2xl border border-sky-100 bg-sky-50 p-4"
                >
                  <p className="text-sm font-bold text-gray-500">
                    {label}
                  </p>

                  <p className="mt-1 break-words font-extrabold text-sky-950">
                    {value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-2xl border border-sky-100 bg-sky-50 p-4">
              <p className="text-sm font-bold text-gray-500">
                Health Problem
              </p>

              <p className="mt-1 whitespace-pre-wrap text-sky-950">
                {selected.message ||
                  "No message"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Prescription Modal */}
      {prescriptionAppointment && (
        <PrescriptionModal
          appointment={
            prescriptionAppointment
          }
          onClose={() =>
            setPrescriptionAppointment(null)
          }
        />
      )}
    </>
  );
}