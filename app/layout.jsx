import "./globals.css";
import Header from "./Components/Header";
import Footer from "./Components/Footer";

export const metadata = {
  title: "Dew Care Hospital | Healthcare & Emergency Services",
  description:
    "Dew Care Hospital provides emergency care, general medicine, surgical services, maternity care and diagnostic services in Nagaon, Assam.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Header />
        {children}
        <Footer />

        <a
          href="https://wa.me/917086803380"
          target="_blank"
          className="fixed bottom-5 right-5 bg-green-600 text-white px-5 py-3 rounded-full shadow-xl font-bold z-50"
        >
          WhatsApp
        </a>
      </body>
    </html>
  );
}