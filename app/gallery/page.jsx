

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const SERVER_URL = API_URL.replace("/api", "");

export const metadata = {
  title: "Gallery | Dew Care Hospital",
  description:
    "Explore our hospital infrastructure, doctors, healthcare facilities and patient care gallery.",
};

// =======================================
// Fetch Gallery
// =======================================

async function getGallery() {
  try {
    const res = await fetch(`${API_URL}/gallery`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Gallery Fetch Failed");
    }

    const json = await res.json();

    return json.success
      ? json.data.filter(
          (item) => item.status === "Active"
        )
      : [];
  } catch (err) {
    console.error(err);
    return [];
  }
}

// =======================================
// YouTube Helper
// =======================================

function getYoutubeId(url = "") {
  try {
    const u = new URL(url);

    if (u.hostname === "youtu.be") {
      return u.pathname.slice(1);
    }

    if (u.searchParams.get("v")) {
      return u.searchParams.get("v");
    }

    if (u.pathname.includes("/embed/")) {
      return u.pathname.split("/embed/")[1];
    }

    if (u.pathname.includes("/shorts/")) {
      return u.pathname.split("/shorts/")[1];
    }

    return "";
  } catch {
    return "";
  }
}

// =======================================
// Page
// =======================================

export default async function GalleryPage() {
  const gallery = await getGallery();

  const categories = [
    "All",
    ...new Set(gallery.map((item) => item.category)),
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-teal-50">
  {/* ================= HERO ================= */}

  <section className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-green-900 to-teal-700 py-24 text-white">

    {/* Background Effects */}

    <div className="absolute -left-40 top-0 h-[450px] w-[450px] rounded-full bg-emerald-400/20 blur-[140px]" />

    <div className="absolute -right-40 bottom-0 h-[450px] w-[450px] rounded-full bg-cyan-400/20 blur-[140px]" />

    <div
      className="absolute inset-0 opacity-10"
      style={{
        backgroundImage:
          "linear-gradient(to right,#fff 1px,transparent 1px),linear-gradient(to bottom,#fff 1px,transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />

    <div className="relative mx-auto max-w-7xl px-6">

      <div className="mx-auto max-w-4xl text-center">

        <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur">
          🏥 Dew Care Hospital Gallery
        </span>

        <h1 className="mt-6 text-4xl font-black sm:text-5xl lg:text-6xl">
          Hospital Image & Video Gallery
        </h1>

        <p className="mt-6 text-lg leading-8 text-emerald-100">
          Explore our hospital facilities, experienced doctors,
          modern operation theatres, patient care,
          healthcare events and memorable moments.
        </p>

      </div>

      {/* Stats */}
{/* 
      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur">
          <div className="text-5xl">🖼️</div>

          <h3 className="mt-4 text-4xl font-black">
            {gallery.length}
          </h3>

          <p className="mt-2 text-emerald-100">
            Total Gallery
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur">
          <div className="text-5xl">📷</div>

          <h3 className="mt-4 text-4xl font-black">
            {gallery.filter(item => item.type === "image").length}
          </h3>

          <p className="mt-2 text-emerald-100">
            Images
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur">
          <div className="text-5xl">🎥</div>

          <h3 className="mt-4 text-4xl font-black">
            {gallery.filter(item => item.type === "video").length}
          </h3>

          <p className="mt-2 text-emerald-100">
            Videos
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 text-center backdrop-blur">
          <div className="text-5xl">🏷️</div>

          <h3 className="mt-4 text-4xl font-black">
            {categories.length - 1}
          </h3>

          <p className="mt-2 text-emerald-100">
            Categories
          </p>
        </div>

      </div> */}

    </div>

  </section>

  {/* ================= Gallery ================= */}

  <section className="mx-auto max-w-7xl px-5 py-20">

  {gallery.length === 0 ? (

  <div className="rounded-3xl bg-white p-16 text-center shadow-xl">

    <div className="text-7xl">
      🖼️
    </div>

    <h2 className="mt-6 text-3xl font-black text-gray-900">
      No Gallery Available
    </h2>

    <p className="mt-3 text-gray-500">
      Images and videos uploaded from the admin panel will appear here.
    </p>

  </div>

) : (

  <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">

    {gallery.map((item) => {

      const imageUrl = item.image
        ? item.image.startsWith("/uploads")
          ? `${SERVER_URL}${item.image}`
          : item.image
        : "";

      const youtubeId = getYoutubeId(item.youtubeUrl);

      return (

        <div
          key={item._id}
          className="group overflow-hidden rounded-[28px] border border-emerald-100 bg-white shadow-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-emerald-200"
        >

          {/* ================= MEDIA ================= */}

<div className="relative aspect-video overflow-hidden bg-gray-100">

  {item.type === "video" ? (

    youtubeId ? (

      <iframe
        src={`https://www.youtube.com/embed/${youtubeId}`}
        title={item.title}
        className="absolute inset-0 h-full w-full"
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />

    ) : (

      <div className="flex h-full items-center justify-center bg-red-50 font-bold text-red-600">
        Invalid YouTube Link
      </div>

    )

  ) : (

    imageUrl ? (

      <img
        src={imageUrl}
        alt={item.title}
        width={800}
        height={600}
        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
      />

    ) : (

      <div className="flex h-full items-center justify-center bg-gray-100 text-gray-500">
        No Image Available
      </div>

    )

  )}

  {/* Badge */}

  <div className="absolute left-4 top-4">

    <span
      className={`rounded-full px-4 py-2 text-xs font-bold text-white shadow-lg ${
        item.type === "video"
          ? "bg-red-600"
          : "bg-emerald-600"
      }`}
    >
      {item.type === "video"
        ? "▶ YouTube Video"
        : "📷 Image"}
    </span>

  </div>

</div>

          {/* ================= CONTENT ================= */}

          <div className="space-y-4 p-6">

            <div className="flex items-center justify-between">

              <span className="rounded-full bg-emerald-100 px-4 py-1 text-sm font-bold text-emerald-700">
                {item.category}
              </span>

              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ${
                  item.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {item.status}
              </span>

            </div>

            <h3 className="line-clamp-2 text-2xl font-black text-gray-900">
              {item.title}
            </h3>

            {item.description && (
              <p className="line-clamp-3 text-gray-600">
                {item.description}
              </p>
            )}

            <div className="border-t pt-4 text-sm text-gray-500">

              {new Date(item.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}

            </div>

          </div>

        </div>

      );

    })}

  </div>

)}
      </section>

      {/* ================= Bottom CTA ================= */}

      <section className="relative overflow-hidden bg-gradient-to-r from-emerald-900 via-green-800 to-teal-800 py-20 text-white">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,.15),transparent_40%)]" />

        <div className="relative mx-auto max-w-6xl px-6 text-center">

          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold backdrop-blur">
            📸 Dew Care Hospital
          </span>

          <h2 className="mt-6 text-4xl font-black md:text-5xl">
            Every Moment Reflects Our Commitment
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-emerald-100">
            Our gallery showcases modern healthcare facilities,
            experienced doctors, advanced medical technology,
            patient care and memorable events at Dew Care Hospital.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-6">

            <div className="rounded-3xl bg-white/10 px-8 py-6 backdrop-blur">
              <h3 className="text-3xl font-black">
                {gallery.length}
              </h3>

              <p className="mt-2 text-emerald-100">
                Gallery Items
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 px-8 py-6 backdrop-blur">
              <h3 className="text-3xl font-black">
                {
                  gallery.filter(
                    (item) => item.type === "image"
                  ).length
                }
              </h3>

              <p className="mt-2 text-emerald-100">
                Images
              </p>
            </div>

            <div className="rounded-3xl bg-white/10 px-8 py-6 backdrop-blur">
              <h3 className="text-3xl font-black">
                {
                  gallery.filter(
                    (item) => item.type === "video"
                  ).length
                }
              </h3>

              <p className="mt-2 text-emerald-100">
                Videos
              </p>
            </div>

          </div>

        </div>

      </section>

    </main>
  );
}
