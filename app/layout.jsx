
import "./globals.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

export const metadata = {
  metadataBase: new URL("https://dewcarehospital.com"),

  title: {
    default: "Dew Care Hospital & Research Centre | Nagaon, Assam",
    template: "%s | Dew Care Hospital",
  },

  description:
    "Dew Care Hospital & Research Centre, Nagaon, Assam provides healthcare, emergency services, surgical care, diagnostics and patient support.",

  applicationName: "Dew Care Hospital & Research Centre",

  alternates: {
    canonical: "https://dewcarehospital.com",
  },

  openGraph: {
    title: "Dew Care Hospital & Research Centre",
    description:
      "Healthcare, emergency services, surgical care and diagnostic facilities in Nagaon, Assam.",
    url: "https://dewcarehospital.com",
    siteName: "Dew Care Hospital & Research Centre",
    locale: "en_IN",
    type: "website",
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />

        <main>{children}</main>

        <Footer />

        {/* WhatsApp Floating Button */}
        <a
          href="https://wa.me/917086803380"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contact Dew Care Hospital on WhatsApp"
          className="fixed bottom-5 right-5 bg-green-600 text-white px-5 py-3 rounded-full shadow-xl font-bold z-50 hover:bg-green-700 transition-colors"
        >
          WhatsApp
        </a>
      </body>
    </html>
  );
}
