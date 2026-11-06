import Link from "next/link";

export const metadata = {
  title: "Appointment Payment Status | Dew Care Hospital",
  description: "Check your Dew Care Hospital appointment payment status.",
};

export default async function AppointmentSuccessPage({ searchParams }) {
  const params = await searchParams;

  const appointmentId =
    typeof params?.id === "string" ? params.id : "";

  const paymentStatus =
    typeof params?.payment === "string"
      ? params.payment.toLowerCase()
      : typeof params?.status === "string"
        ? params.status.toLowerCase()
        : "";

  // Show success only when the backend redirects after verifying payment.
  const isPaymentVerified = paymentStatus === "success";

  return (
    <main className="min-h-screen bg-[#faf8ef] px-4 py-12 text-[#172d27] sm:py-16">
      <div className="mx-auto flex min-h-[70vh] max-w-2xl items-center justify-center">
        <section className="w-full border border-[#d9d2bd] bg-white p-6 shadow-sm sm:p-10">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#c8ae6a]">
            {isPaymentVerified ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-8 w-8 text-[#1d6b48]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path
                  d="m5 12 4 4L19 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-8 w-8 text-[#9a742c]"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="9" />
                <path
                  d="M12 7v5l3 2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </div>

          <div className="mt-6 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a8248]">
              Dew Care Hospital &amp; Research Centre
            </p>

            <h1 className="mt-3 text-2xl font-bold sm:text-3xl">
              {isPaymentVerified
                ? "Appointment payment successful"
                : "Payment confirmation pending"}
            </h1>

            <p className="mx-auto mt-3 max-w-lg text-sm leading-7 text-[#59645f] sm:text-base">
              {isPaymentVerified
                ? "Your payment has been verified. Your appointment request has been received. Please keep your appointment reference ID for future communication."
                : "We have not received a verified payment confirmation yet. Please do not make another payment immediately. If money was deducted, contact the hospital with your appointment reference ID."}
            </p>
          </div>

          {appointmentId ? (
            <div className="mt-8 border border-[#e5dfcf] bg-[#faf8ef] p-4 text-center">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#68736d]">
                Appointment reference ID
              </p>
              <p className="mt-2 break-all text-sm font-bold text-[#172d27]">
                {appointmentId}
              </p>
            </div>
          ) : (
            <p className="mt-8 border border-[#e5dfcf] bg-[#faf8ef] p-4 text-center text-sm text-[#59645f]">
              Appointment reference ID was not provided in the payment return.
              Please contact the hospital if you need help locating your booking.
            </p>
          )}

          <div className="mt-8 border-t border-[#eee9dc] pt-6">
            <h2 className="text-sm font-bold">Need assistance?</h2>
            <p className="mt-2 text-sm leading-6 text-[#59645f]">
              Please contact Dew Care Hospital &amp; Research Centre and share
              your appointment reference ID. If your payment was deducted but
              this page shows pending, allow a little time for confirmation
              before trying again.
            </p>
          </div>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex min-h-11 flex-1 items-center justify-center bg-[#172d27] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#0b302a]"
            >
              Go to Homepage
            </Link>
            <Link
              href="/appointment"
              className="inline-flex min-h-11 flex-1 items-center justify-center border border-[#c8ae6a] px-5 py-3 text-sm font-semibold text-[#172d27] transition hover:bg-[#faf8ef]"
            >
              Appointment Page
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
