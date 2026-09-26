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
    <section className="bg-[#111] text-white" aria-label="Lifecycle of a new house" data-testid="build-lifecycle">
      <img
        key={current.image}
        src={current.image}
        alt={current.alt}
        className="block h-[52vh] min-h-[240px] w-full object-cover"
        style={{ display: "block", width: "100%", height: "52vh", minHeight: 240, objectFit: "cover" }}
        fetchPriority="high"
      />
      <div className="px-4 py-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div aria-live="polite">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d0ad92]">
              From land to handover · {stage + 1} / {STAGES.length}
            </p>
            <h2 className="mt-1 font-heading text-2xl font-medium leading-none sm:text-3xl">{current.label}</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/70">{current.detail}</p>
          </div>
          <div className="h-1 w-full bg-white/15 sm:w-56" aria-hidden="true">
            <div className="h-1 bg-[#d0ad92]" style={{ width: `${((stage + 1) / STAGES.length) * 100}%` }} />
          </div>
        </div>
      </div>
    </section>
  );
}
