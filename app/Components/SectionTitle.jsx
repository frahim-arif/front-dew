export default function SectionTitle({ small, title, desc }) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-12">
      {small && (
        <p className="text-emerald-700 font-bold uppercase tracking-widest text-sm">
          {small}
        </p>
      )}

      <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mt-2">
        {title}
      </h2>

      {desc && <p className="text-gray-600 mt-4 text-lg">{desc}</p>}
    </div>
  );
}