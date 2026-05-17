const IMAGES = [
  "https://res.cloudinary.com/dqewxdbfx/image/upload/v1778982801/WhatsApp_Image_2026-05-16_at_20.52.31_r8em6a.jpg",
  "https://res.cloudinary.com/dqewxdbfx/image/upload/v1778982801/WhatsApp_Image_2026-05-16_at_20.53.03_csp2ny.jpg",
  "https://res.cloudinary.com/dqewxdbfx/image/upload/v1778982801/WhatsApp_Image_2026-05-16_at_20.53.28_ilfstk.jpg",
];

export default function DifferentialsSection() {
  return (
    <section className="section-py relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-50" />
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(circle, var(--navy-900) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative container-max section-px">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-slate-600 tracking-wider uppercase mb-3">Nossos diferenciais</p>
          <h2 className="text-3xl font-serif font-bold text-navy-900">Por que escolher Wagner Kaizer</h2>
          <div className="w-24 h-0.5 mx-auto mt-5 bg-slate-500 opacity-60" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
          {IMAGES.map((src, i) => (
            <div key={i} className="overflow-hidden rounded-sm border border-border shadow-sm h-full" style={{ background: "#001529" }}>
              <img
                src={src}
                alt={`Diferencial ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
