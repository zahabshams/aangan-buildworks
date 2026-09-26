import { useEffect, useState } from "react";

const base = import.meta.env.BASE_URL;

const STAGES = [
  {
    label: "Your land",
    detail: "The plot is read before a line is drawn.",
    image: `${base}lifecycle/land.png`,
    alt: "Empty residential plot marked out for a new house",
  },
  {
    label: "Foundation",
    detail: "Footings and a plinth lock the house to the ground.",
    image: `${base}lifecycle/foundation.png`,
    alt: "Concrete foundation and reinforcement on a house plot",
  },
  {
    label: "Structure",
    detail: "Columns and walls rise, floor by floor.",
    image: `${base}lifecycle/structure.png`,
    alt: "Brick and concrete frame of a house under construction",
  },
  {
    label: "Roof",
    detail: "The shell closes and the monsoon is kept out.",
    image: `${base}lifecycle/roof.png`,
    alt: "Roof slab formwork on a house under construction",
  },
  {
    label: "Finish",
    detail: "Openings, services and surfaces complete the rooms.",
    image: `${base}lifecycle/finish.png`,
    alt: "House exterior during plaster and window installation",
  },
  {
    label: "Move in",
    detail: "Handover. The home is ready for life.",
    image: `${base}lifecycle/home.png`,
    alt: "Completed contemporary Indian house at dusk",
  },
] as const;

const STEP_MS = 2600;

export function BuildLifecycle() {
  const [stage, setStage] = useState(0);

  useEffect(() => {
    for (const item of STAGES) {
      const preload = new Image();
      preload.src = item.image;
    }
  }, []);

  useEffect(() => {
    if (stage >= STAGES.length - 1) return;
    const next = window.setTimeout(() => setStage((current) => current + 1), STEP_MS);
    return () => window.clearTimeout(next);
  }, [stage]);

  const current = STAGES[stage];

  return (
    <section
      className="relative h-[min(72vh,640px)] min-h-[360px] overflow-hidden bg-[#111] text-white"
      aria-label="Lifecycle of a new house"
      data-testid="build-lifecycle"
    >
      {STAGES.map((item, index) => {
        const active = index === stage;
        return (
          <img
            key={item.label}
            src={item.image}
            alt={active ? item.alt : ""}
            aria-hidden={!active}
            className={`absolute inset-0 size-full object-cover transition-opacity duration-1000 ${active ? "z-[2] opacity-100" : "z-[1] opacity-0"}`}
            fetchPriority={index === 0 ? "high" : "low"}
          />
        );
      })}
      <div className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-t from-[#111]/85 via-[#111]/15 to-[#111]/25" />
      <div className="absolute inset-x-0 bottom-0 z-[4] mx-auto flex w-full max-w-[1400px] flex-col gap-4 px-4 pb-6 sm:px-8 sm:pb-8 lg:px-12">
        <div className="min-h-[88px]" aria-live="polite">
          <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d0ad92]">From land to handover</p>
          <h2 className="mt-2 font-heading text-3xl font-medium leading-none sm:text-5xl">{current.label}</h2>
          <p className="mt-2 max-w-md text-sm leading-6 text-white/75">{current.detail}</p>
        </div>
        <ol className="grid grid-cols-3 gap-x-3 gap-y-3 sm:grid-cols-6">
          {STAGES.map((item, index) => {
            const active = index === stage;
            const done = index < stage;
            return (
              <li key={item.label}>
                <div className="h-px bg-white/25">
                  <div
                    className="h-px bg-[#d0ad92] transition-[width] duration-700"
                    style={{ width: done || active ? "100%" : "0%" }}
                  />
                </div>
                <p className={`mt-1.5 text-[10px] font-semibold tracking-wide ${active ? "text-white" : done ? "text-white/70" : "text-white/40"}`}>
                  {item.label}
                </p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
