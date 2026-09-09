import { siteInfo } from "@/data/siteData";

export const metadata = {
  title: "Contact | Dew Care Hospital",
  description: "Contact Dew Care Hospital Nagaon Assam.",
};

export default function ContactPage() {
  return (
    <main>
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-emerald-400 font-semibold">Contact Us</p>
          <h1 className="text-4xl md:text-6xl font-bold mt-3">
            Get In Touch With Us
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-gray-300">
            Contact Dew Care Hospital for appointment, emergency support and
            general enquiry.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-5">
          <div className="bg-white p-6 rounded-3xl shadow-sm border">
            <h3 className="text-xl font-bold text-emerald-800">Phone</h3>
            <p className="mt-2 text-gray-600">{siteInfo.phone}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border">
            <h3 className="text-xl font-bold text-emerald-800">Email</h3>
            <p className="mt-2 text-gray-600">{siteInfo.email}</p>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border">
            <h3 className="text-xl font-bold text-emerald-800">Address</h3>
            <p className="mt-2 text-gray-600">{siteInfo.address}</p>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border">
          <h2 className="text-3xl font-bold mb-6">Send Enquiry</h2>

          <form className="grid gap-5">
            <div className="grid md:grid-cols-2 gap-5">
              <input
                placeholder="Your Name"
                className="border p-4 rounded-xl outline-emerald-600"
              />

              <input
                placeholder="Mobile Number"
                className="border p-4 rounded-xl outline-emerald-600"
              />
            </div>

            <input
              placeholder="Email Address"
              className="border p-4 rounded-xl outline-emerald-600"
            />

            <textarea
              placeholder="Your Message"
              rows="6"
              className="border p-4 rounded-xl outline-emerald-600"
            />

            <button
              type="button"
              className="bg-emerald-700 text-white py-4 rounded-xl font-bold"
            >
              Submit Enquiry
            </button>
          </form>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 pb-20">
        <div className="rounded-3xl overflow-hidden border shadow-sm">
          <iframe
            title="Dew Care Hospital Map"
            src="https://www.google.com/maps"
            className="w-full h-[420px]"
            loading="lazy"
          ></iframe>
        </div>
      </section>
    </main>
  );
}