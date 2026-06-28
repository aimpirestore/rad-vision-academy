"use client";

const items = [
  "FRCR Preparation",
  "Residency Guidance",
  "Chest X-Ray",
  "CT Abdomen",
  "Neuroradiology",
  "MRI Protocols",
  "Reporting Templates",
  "AI in Radiology",
  "Viva Practice",
  "On-Call Survival",
  "Cross-Sectional Anatomy",
  "MSK Imaging",
];

export function Marquee() {
  return (
    <div className="relative overflow-hidden border-y border-brand-black/[0.06] bg-white py-6">
      <div className="mask-fade-x flex">
        <div className="flex shrink-0 animate-marquee items-center gap-10 pr-10">
          {[...items, ...items].map((item, i) => (
            <span key={i} className="flex items-center gap-10 text-sm font-semibold uppercase tracking-[0.15em] text-brand-dark-grey/60">
              {item}
              <span className="h-1 w-1 rounded-full bg-brand-red" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
