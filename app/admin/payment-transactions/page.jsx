
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  RefreshCw,
  Search,
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  Copy,
  Download,
  FileText,
  ShieldCheck,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";

const API = (
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api"
).replace(/\/$/, "");

const money = (paise) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format((Number(paise) || 0) / 100);

const dateFormat = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "medium",
  });
};

const statusStyle = (status) => {
  switch (status) {
    case "SUCCESS":
    case "DB_SAVED":
    case "VERIFIED":
      return "bg-green-100 text-green-700";

    case "FAILED":
    case "REJECTED":
    case "VERIFIED_FAILED":
      return "bg-red-100 text-red-700";

    default:
      return "bg-amber-100 text-amber-700";
  }
};

const safeJson = (value) => {
  if (value === null || value === undefined) return "Not recorded";

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

const buildAuditReport = (appointmentId, logs) => {
  if (!logs?.length) return "";

  const first = logs[0];
  const last = logs[logs.length - 1];

  const orderId =
    [...logs].reverse().find((log) => log.razorpayOrderId)
      ?.razorpayOrderId || "Not recorded";

  const paymentId =
    [...logs].reverse().find((log) => log.razorpayPaymentId)
      ?.razorpayPaymentId || "Not recorded";

  const amountLog = [...logs]
    .reverse()
    .find((log) => log.amountPaise != null);

  const amount = amountLog
    ? money(amountLog.amountPaise)
    : "Not recorded";

  const currency = amountLog?.currency || "INR";

  const lines = [
    "==================================================",
    "DEW CARE HOSPITAL",
    "PAYMENT VERIFICATION REQUEST AND RESPONSE LOGS",
    "==================================================",
    "",
    "TRANSACTION INFORMATION",
    "--------------------------------------------------",
    `Appointment ID: ${appointmentId}`,
    `Gateway: Razorpay`,
    `Order ID: ${orderId}`,
    `Payment ID: ${paymentId}`,
    `Amount: ${amount}`,
    `Currency: ${currency}`,
    `First Recorded Event: ${dateFormat(first.createdAt)}`,
    `Last Recorded Event: ${dateFormat(last.createdAt)}`,
    `Total Audit Events: ${logs.length}`,
    "",
    "CHRONOLOGICAL VERIFICATION LOGS",
    "--------------------------------------------------",
  ];

  logs.forEach((log, index) => {
    lines.push(
      "",
      `${index + 1}. ${log.event || "Payment Event"}`,
      `Date & Time: ${dateFormat(log.createdAt)}`,
      `Status: ${log.status || "UNKNOWN"}`,
      `Order ID: ${log.razorpayOrderId || "Not recorded"}`,
      `Payment ID: ${log.razorpayPaymentId || "Not recorded"}`,
      `Amount: ${
        log.amountPaise != null
          ? money(log.amountPaise)
          : "Not recorded"
      }`,
      `Currency: ${log.currency || "INR"}`,
      "",
      "REQUEST:",
      safeJson(log.request),
      "",
      "RESPONSE:",
      safeJson(log.response),
      "",
      "VERIFICATION:",
      safeJson(log.verification),
      "",
      "ERROR:",
      log.error || "No error recorded",
      "--------------------------------------------------"
    );
  });

  lines.push(
    "",
    "END OF PAYMENT AUDIT REPORT",
    "==================================================",
    "Source: Dew Care Hospital Payment Audit System",
    "Gateway integration recorded: Razorpay",
    "",
    "Note: This report is generated from recorded application",
    "audit entries. It is not an independently certified",
    "gateway-generated transaction log."
  );

  return lines.join("\n");
};

export default function PaymentTransactions() {
  const router = useRouter();

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState([]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  const [selected, setSelected] = useState(null);
  const [auditLogs, setAuditLogs] = useState([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");

  const [copyMessage, setCopyMessage] = useState("");

  // Load transaction list
  useEffect(() => {
    let cancelled = false;

    const loadTransactions = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.replace("/admin");
          return;
        }

        const params = new URLSearchParams({
          page: String(pagination.page),
          limit: "20",
          status,
          search: appliedSearch,
        });

        const res = await fetch(
          `${API}/admin/payment-audits?${params.toString()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("admin");
          router.replace("/admin");
          return;
        }

        if (!res.ok || !data.success) {
          throw new Error(
            data.message || "Unable to load payment transactions"
          );
        }

        if (!cancelled) {
          setTransactions(data.transactions || []);
          setSummary(data.summary || []);

          setPagination((previous) => ({
            ...previous,
            ...(data.pagination || {}),
          }));
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Something went wrong");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadTransactions();

    return () => {
      cancelled = true;
    };
  }, [
    pagination.page,
    status,
    appliedSearch,
    refreshKey,
    router,
  ]);

  // Load complete chronological logs for selected appointment
  const openDetails = async (item) => {
    setSelected(item);
    setAuditLogs([]);
    setDetailError("");
    setCopyMessage("");

    if (!item.appointmentId) {
      setDetailError(
        "Appointment ID is not available for this audit event."
      );
      return;
    }

    setDetailLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        router.replace("/admin");
        return;
      }

      const res = await fetch(
        `${API}/admin/payment-audits/${item.appointmentId}/logs`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("admin");
        router.replace("/admin");
        return;
      }

      if (!res.ok || !data.success) {
        throw new Error(
          data.message || "Unable to load payment audit details"
        );
      }

      setAuditLogs(data.logs || []);
    } catch (err) {
      setDetailError(
        err.message || "Failed to load audit details"
      );
    } finally {
      setDetailLoading(false);
    }
  };

  const getCount = (statuses) =>
    summary
      .filter((item) => statuses.includes(item._id))
      .reduce((total, item) => total + item.count, 0);

  const totalSuccess = getCount([
    "SUCCESS",
    "DB_SAVED",
    "VERIFIED",
  ]);

  const totalFailed = getCount([
    "FAILED",
    "REJECTED",
    "VERIFIED_FAILED",
  ]);

  const totalPending = getCount([
    "REQUESTED",
    "PENDING",
  ]);

  const handleSearch = (e) => {
    e.preventDefault();

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));

    setAppliedSearch(search.trim());
  };

  const refresh = () => {
    setRefreshKey((previous) => previous + 1);
  };

  const clearFilters = () => {
    setSearch("");
    setAppliedSearch("");
    setStatus("ALL");

    setPagination((previous) => ({
      ...previous,
      page: 1,
    }));
  };

  const closeModal = () => {
    setSelected(null);
    setAuditLogs([]);
    setDetailError("");
    setCopyMessage("");
  };

  const reportText = selected
    ? buildAuditReport(selected.appointmentId, auditLogs)
    : "";

  const copyReport = async () => {
    if (!reportText) return;

    try {
      await navigator.clipboard.writeText(reportText);
      setCopyMessage("Report copied successfully.");
    } catch {
      setCopyMessage(
        "Copy failed. Please use Download Report instead."
      );
    }
  };

  const downloadReport = () => {
    if (!reportText) return;

    const blob = new Blob([reportText], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `DewCare-Payment-Audit-${selected.appointmentId}.txt`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <main className="min-h-screen bg-slate-50 p-4 md:p-7">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <button
              onClick={() => router.push("/admin/dashboard")}
              className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-sky-800"
            >
              <ArrowLeft size={17} />
              Back to Dashboard
            </button>

            <h1 className="text-2xl font-black text-slate-900 md:text-3xl">
              Payment Transactions
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Monitor and review hospital payment audit records.
            </p>
          </div>

          <button
            onClick={refresh}
            disabled={loading}
            className="flex items-center gap-2 rounded-xl bg-sky-900 px-4 py-3 text-sm font-bold text-white hover:bg-sky-800 disabled:opacity-50"
          >
            <RefreshCw
              size={17}
              className={loading ? "animate-spin" : ""}
            />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryCard
            label="Total Transactions"
            value={pagination.total}
            icon={<CreditCard className="text-sky-700" size={23} />}
          />

          <SummaryCard
            label="Successful Events"
            value={totalSuccess}
            color="text-green-700"
            icon={<CheckCircle2 className="text-green-600" size={23} />}
          />

          <SummaryCard
            label="Failed Events"
            value={totalFailed}
            color="text-red-700"
            icon={<XCircle className="text-red-600" size={23} />}
          />

          <SummaryCard
            label="Pending Events"
            value={totalPending}
            color="text-amber-700"
            icon={<Clock className="text-amber-600" size={23} />}
          />
        </div>

        {/* Filters */}
        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <form
            onSubmit={handleSearch}
            className="flex flex-col gap-3 md:flex-row"
          >
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search Order ID, Payment ID or Event..."
                className="w-full rounded-xl border border-slate-200 py-3 pl-11 pr-4 outline-none focus:border-sky-600"
              />
            </div>

            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);

                setPagination((previous) => ({
                  ...previous,
                  page: 1,
                }));
              }}
              className="rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-sky-600"
            >
              <option value="ALL">All Status</option>
              <option value="REQUESTED">Requested</option>
              <option value="PENDING">Pending</option>
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="DB_SAVED">DB Saved</option>
              <option value="VERIFIED">Verified</option>
              <option value="VERIFIED_FAILED">Verified Failed</option>
              <option value="REJECTED">Rejected</option>
            </select>

            <button
              type="submit"
              className="rounded-xl bg-sky-900 px-6 py-3 font-bold text-white hover:bg-sky-800"
            >
              Search
            </button>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
            >
              Clear
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            {error}
          </div>
        )}

        {/* Transactions Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 p-5">
            <h2 className="font-bold text-slate-900">
              Transaction Records
            </h2>

            <span className="text-sm text-slate-500">
              {pagination.total} records found
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-4">Date & Time</th>
                  <th className="px-5 py-4">Event</th>
                  <th className="px-5 py-4">Order ID</th>
                  <th className="px-5 py-4">Payment ID</th>
                  <th className="px-5 py-4">Amount</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Details</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-5 py-12 text-center text-slate-500"
                    >
                      No payment transactions found.
                    </td>
                  </tr>
                ) : (
                  transactions.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                        {dateFormat(item.createdAt)}
                      </td>

                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {item.event || "—"}
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-600">
                        {item.razorpayOrderId || "—"}
                      </td>

                      <td className="px-5 py-4 text-xs text-slate-600">
                        {item.razorpayPaymentId || "—"}
                      </td>

                      <td className="whitespace-nowrap px-5 py-4 font-bold text-slate-900">
                        {item.amountPaise != null
                          ? money(item.amountPaise)
                          : "—"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(item.status)}`}
                        >
                          {item.status || "UNKNOWN"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => openDetails(item)}
                          className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-sky-800 hover:bg-sky-50"
                        >
                          <Eye size={15} />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 p-4">
            <p className="text-sm text-slate-500">
              Page {pagination.page} of {pagination.totalPages || 1}
            </p>

            <div className="flex gap-2">
              <button
                disabled={loading || pagination.page <= 1}
                onClick={() =>
                  setPagination((previous) => ({
                    ...previous,
                    page: previous.page - 1,
                  }))
                }
                className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40"
              >
                <ChevronLeft size={17} />
                Previous
              </button>

              <button
                disabled={
                  loading ||
                  pagination.page >= pagination.totalPages
                }
                onClick={() =>
                  setPagination((previous) => ({
                    ...previous,
                    page: previous.page + 1,
                  }))
                }
                className="flex items-center gap-1 rounded-lg border px-4 py-2 text-sm font-semibold disabled:opacity-40"
              >
                Next
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Payment Audit Details Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 md:p-5"
          onClick={closeModal}
        >
          <div
            className="max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white p-5">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  Payment Verification Details
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Dew Care Hospital · Razorpay Audit Trail
                </p>
              </div>

              <button
                onClick={closeModal}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={21} />
              </button>
            </div>

            <div className="space-y-6 p-5">

              {/* Selected Event */}
              <section className="rounded-xl border border-sky-100 bg-sky-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold uppercase text-sky-700">
                      Selected Audit Event
                    </p>

                    <h3 className="mt-1 break-all font-black text-slate-900">
                      {selected.event}
                    </h3>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(selected.status)}`}
                  >
                    {selected.status}
                  </span>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <InfoBox
                    label="Appointment ID"
                    value={selected.appointmentId}
                  />

                  <InfoBox
                    label="Order ID"
                    value={selected.razorpayOrderId}
                  />

                  <InfoBox
                    label="Payment ID"
                    value={selected.razorpayPaymentId}
                  />

                  <InfoBox
                    label="Amount"
                    value={
                      selected.amountPaise != null
                        ? money(selected.amountPaise)
                        : "—"
                    }
                  />

                  <InfoBox
                    label="Currency"
                    value={selected.currency}
                  />

                  <InfoBox
                    label="Event Date"
                    value={dateFormat(selected.createdAt)}
                  />
                </div>
              </section>

              {/* Loading */}
              {detailLoading && (
                <div className="flex flex-col items-center justify-center gap-3 py-12 text-slate-500">
                  <LoaderCircle
                    size={32}
                    className="animate-spin text-sky-700"
                  />
                  <p className="text-sm font-semibold">
                    Loading complete payment audit logs...
                  </p>
                </div>
              )}

              {/* Error */}
              {detailError && !detailLoading && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <div className="flex items-center gap-2 font-bold">
                    <AlertCircle size={18} />
                    Unable to load audit details
                  </div>
                  <p className="mt-2">{detailError}</p>
                </div>
              )}

              {/* Complete Audit Report */}
              {!detailLoading && !detailError && auditLogs.length > 0 && (
                <>
                  {/* Report Header */}
                  <section className="rounded-xl border border-slate-200 p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="text-green-700" size={21} />
                          <h3 className="font-black text-slate-900">
                            Verification Request and Response Logs
                          </h3>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          {auditLogs.length} chronological audit events recorded
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={copyReport}
                          className="flex items-center gap-2 rounded-lg bg-sky-900 px-4 py-2.5 text-xs font-bold text-white hover:bg-sky-800"
                        >
                          <Copy size={15} />
                          Copy HDFC Format Log
                        </button>

                        <button
                          onClick={downloadReport}
                          className="flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50"
                        >
                          <Download size={15} />
                          Download Report
                        </button>
                      </div>
                    </div>

                    {copyMessage && (
                      <p className="mt-3 text-sm font-semibold text-green-700">
                        {copyMessage}
                      </p>
                    )}
                  </section>

                  {/* Transaction Information */}
                  <section>
                    <h3 className="mb-3 flex items-center gap-2 font-black text-slate-900">
                      <FileText size={19} className="text-sky-700" />
                      Transaction Information
                    </h3>

                    <div className="grid gap-3 rounded-xl border border-slate-200 p-4 sm:grid-cols-2">
                      <InfoBox
                        label="Appointment ID"
                        value={selected.appointmentId}
                      />

                      <InfoBox
                        label="Razorpay Order ID"
                        value={
                          [...auditLogs].reverse().find(
                            (log) => log.razorpayOrderId
                          )?.razorpayOrderId
                        }
                      />

                      <InfoBox
                        label="Razorpay Payment ID"
                        value={
                          [...auditLogs].reverse().find(
                            (log) => log.razorpayPaymentId
                          )?.razorpayPaymentId
                        }
                      />

                      <InfoBox
                        label="Total Recorded Events"
                        value={auditLogs.length}
                      />
                    </div>
                  </section>

                  {/* Chronological Timeline */}
                  <section>
                    <h3 className="mb-4 font-black text-slate-900">
                      Complete Chronological Event Timeline
                    </h3>

                    <div className="space-y-4">
                      {auditLogs.map((log, index) => (
                        <div
                          key={log._id || index}
                          className="relative rounded-xl border border-slate-200 bg-white p-4"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-start gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-sky-100 text-sm font-black text-sky-800">
                                {index + 1}
                              </div>

                              <div>
                                <h4 className="break-all font-bold text-slate-900">
                                  {log.event}
                                </h4>

                                <p className="mt-1 text-xs text-slate-500">
                                  {dateFormat(log.createdAt)}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(log.status)}`}
                            >
                              {log.status}
                            </span>
                          </div>

                          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            <InfoBox
                              label="Order ID"
                              value={log.razorpayOrderId}
                            />

                            <InfoBox
                              label="Payment ID"
                              value={log.razorpayPaymentId}
                            />

                            <InfoBox
                              label="Amount"
                              value={
                                log.amountPaise != null
                                  ? money(log.amountPaise)
                                  : "—"
                              }
                            />
                          </div>

                          <div className="mt-4 space-y-3">
                            <JsonSection
                              title="Request"
                              data={log.request}
                            />

                            <JsonSection
                              title="Response"
                              data={log.response}
                            />

                            <JsonSection
                              title="Verification"
                              data={log.verification}
                            />

                            {log.error && (
                              <div className="rounded-lg border border-red-200 bg-red-50 p-3">
                                <p className="mb-1 text-xs font-black uppercase text-red-700">
                                  Error
                                </p>
                                <p className="break-words text-sm text-red-800">
                                  {log.error}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Report Notice */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-6 text-amber-900">
                    <strong>Report Notice:</strong> This report is generated
                    from Dew Care Hospital application audit records. It
                    contains the request, response and verification data
                    actually recorded by the application. It is not an
                    independently certified Razorpay or HDFC gateway log.
                  </div>
                </>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-slate-200 p-5">
              <button
                onClick={closeModal}
                className="w-full rounded-xl bg-sky-900 py-3 font-bold text-white hover:bg-sky-800"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function SummaryCard({ label, value, color = "text-slate-900", icon }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500">{label}</p>
        {icon}
      </div>

      <h2 className={`mt-3 text-3xl font-black ${color}`}>
        {value}
      </h2>
    </div>
  );
}

function InfoBox({ label, value }) {
  return (
    <div className="min-w-0 rounded-lg bg-slate-50 p-3">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="break-all text-sm font-semibold text-slate-800">
        {value === null || value === undefined || value === ""
          ? "—"
          : String(value)}
      </p>
    </div>
  );
}

function JsonSection({ title, data }) {
  const [expanded, setExpanded] = useState(false);

  if (data === null || data === undefined) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200">
      <button
        type="button"
        onClick={() => setExpanded((previous) => !previous)}
        className="flex w-full items-center justify-between bg-slate-50 px-4 py-3 text-left text-xs font-black uppercase text-slate-700 hover:bg-slate-100"
      >
        {title}
        <span>{expanded ? "−" : "+"}</span>
      </button>

      {expanded && (
        <pre className="max-h-80 overflow-auto whitespace-pre-wrap break-all bg-white p-4 text-xs leading-5 text-slate-700">
          {safeJson(data)}
        </pre>
      )}
    </div>
  );
}
