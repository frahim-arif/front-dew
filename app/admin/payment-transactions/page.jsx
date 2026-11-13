
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
  IndianRupee,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://backend-dew-c2to.onrender.com/api";

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
    timeStyle: "short",
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
      return "bg-red-100 text-red-700";

    default:
      return "bg-amber-100 text-amber-700";
  }
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
  const [selected, setSelected] = useState(null);

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
              "Content-Type": "application/json",
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
  }, [pagination.page, status, appliedSearch, router]);

  const getCount = (statuses) =>
    summary
      .filter((item) => statuses.includes(item._id))
      .reduce((total, item) => total + item.count, 0);

  const totalSuccess = getCount(["SUCCESS", "DB_SAVED", "VERIFIED"]);
  const totalFailed = getCount(["FAILED", "REJECTED"]);
  const totalPending = getCount(["REQUESTED"]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination((previous) => ({ ...previous, page: 1 }));
    setAppliedSearch(search.trim());
  };

  const refresh = () => {
    setPagination((previous) => ({ ...previous }));
    setAppliedSearch((previous) => previous + "");
    setStatus((previous) => previous);
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

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Total Transactions
              </p>
              <CreditCard className="text-sky-700" size={23} />
            </div>
            <h2 className="mt-3 text-3xl font-black text-slate-900">
              {pagination.total}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Successful Events
              </p>
              <CheckCircle2 className="text-green-600" size={23} />
            </div>
            <h2 className="mt-3 text-3xl font-black text-green-700">
              {totalSuccess}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Failed Events
              </p>
              <XCircle className="text-red-600" size={23} />
            </div>
            <h2 className="mt-3 text-3xl font-black text-red-700">
              {totalFailed}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-500">
                Pending Events
              </p>
              <Clock className="text-amber-600" size={23} />
            </div>
            <h2 className="mt-3 text-3xl font-black text-amber-700">
              {totalPending}
            </h2>
          </div>

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
              <option value="SUCCESS">Success</option>
              <option value="FAILED">Failed</option>
              <option value="DB_SAVED">DB Saved</option>
              <option value="VERIFIED">Verified</option>
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
              onClick={() => {
                setSearch("");
                setAppliedSearch("");
                setStatus("ALL");
                setPagination((previous) => ({
                  ...previous,
                  page: 1,
                }));
              }}
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
                    <td colSpan="7" className="px-5 py-12 text-center text-slate-500">
                      Loading transactions...
                    </td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-5 py-12 text-center text-slate-500">
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
                        <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusStyle(item.status)}`}>
                          {item.status || "UNKNOWN"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelected(item)}
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

      {/* Transaction Details Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-900">
                Transaction Details
              </h2>

              <button
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 hover:bg-slate-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">

              <Detail label="Event" value={selected.event} />
              <Detail label="Status" value={selected.status} />
              <Detail
                label="Appointment ID"
                value={selected.appointmentId}
              />
              <Detail
                label="Razorpay Order ID"
                value={selected.razorpayOrderId}
              />
              <Detail
                label="Razorpay Payment ID"
                value={selected.razorpayPaymentId}
              />
              <Detail
                label="Amount"
                value={
                  selected.amountPaise != null
                    ? money(selected.amountPaise)
                    : "—"
                }
              />
              <Detail label="Currency" value={selected.currency} />
              <Detail
                label="Source"
                value={selected.source}
              />
              <Detail
                label="Created At"
                value={dateFormat(selected.createdAt)}
              />
              <Detail
                label="Updated At"
                value={dateFormat(selected.updatedAt)}
              />
              <Detail
                label="Error"
                value={selected.error || "No error recorded"}
              />

            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 w-full rounded-xl bg-sky-900 py-3 font-bold text-white hover:bg-sky-800"
            >
              Close
            </button>

          </div>
        </div>
      )}

    </main>
  );
}

function Detail({ label, value }) {
  return (
    <div className="border-b border-slate-100 pb-3">
      <p className="mb-1 text-xs font-bold uppercase text-slate-400">
        {label}
      </p>
      <p className="break-all text-sm font-semibold text-slate-800">
        {value || "—"}
      </p>
    </div>
  );
}
