

const API =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

const SERVER_URL = API.replace("/api", "");

export default function ServiceCard({ service }) {
  const imageUrl = service.image
    ? service.image.startsWith("/uploads")
      ? `${SERVER_URL}${service.image}`
      : service.image
    : "";

  return (
    <div className="overflow-hidden rounded-3xl border bg-white shadow-sm transition hover:-translate-y-2 hover:shadow-xl">
      {/* Image */}
      {imageUrl ? (
        <div className="relative h-56 w-full">
          <img
            src={imageUrl}
            alt={service.title}
            fill
            className="object-cover"
          />
        </div>
      ) : (
        <div className="flex h-56 items-center justify-center bg-emerald-50 text-6xl">
          {service.icon || "🏥"}
        </div>
      )}

      {/* Content */}
      <div className="p-6">
        {service.icon && (
          <div className="mb-4 text-4xl">
            {service.icon}
          </div>
        )}

        <h3 className="text-2xl font-bold text-slate-900">
          {service.title}
        </h3>

        <p className="mt-3 text-gray-600 leading-7">
          {service.desc}
        </p>
      </div>
    </div>
  );
}