export const metadata = {
  title: "Training Application | Dew Care Hospital",
  description: "Apply for the 3-Day Hands-On Training in Basic Laparoscopic Surgery.",
};

export default function TrainingApplicationPage() {
  return (
    <main className="min-h-screen bg-[#f4f8f8]">
      <iframe
        src="/training-application.html"
        title="Dew Care Hospital Training Application Form"
        className="block min-h-screen w-full border-0"
        style={{ height: "100vh" }}
      />
    </main>
  );
}
