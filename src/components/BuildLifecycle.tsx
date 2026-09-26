import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";

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

const OFFERINGS = [
  { title: "Only ground floor", price: "2,950", unit: "per sq ft" },
  { title: "Ground + floors", price: "2,800", unit: "per sq ft" },
] as const;

const STEP_MS = 6400;
const FADE_MS = 1200;
const OFFER_MS = 5600;
const OFFER_FADE_MS = 500;
const SWIPE_PX = 40;

export function BuildLifecycle() {
  const [stage, setStage] = useState(0);
  const [paused, setPaused] = useState(false);
  const [offer, setOffer] = useState(0);
  const [offerShown, setOfferShown] = useState(0);
  const [offerOpacity, setOfferOpacity] = useState(1);
  const [leaving, setLeaving] = useState<number | null>(null);
  const [incomingOpacity, setIncomingOpacity] = useState(1);
  const displayed = useRef(0);
  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    for (const item of STAGES) {
      const preload = new Image();
      preload.src = item.image;
    }
  }, []);

  useEffect(() => {
    if (paused || stage >= STAGES.length - 1) return;
    const next = window.setTimeout(() => show(stage + 1), STEP_MS);
    return () => window.clearTimeout(next);
  }, [stage, paused]);

  useEffect(() => {
    const next = window.setTimeout(() => setOffer((current) => (current + 1) % OFFERINGS.length), OFFER_MS);
    return () => window.clearTimeout(next);
  }, [offer]);

  useEffect(() => {
    if (offer === offerShown) return;
    setOfferOpacity(0);
    const swap = window.setTimeout(() => {
      setOfferShown(offer);
      setOfferOpacity(1);
    }, OFFER_FADE_MS);
    return () => window.clearTimeout(swap);
  }, [offer, offerShown]);

  useEffect(() => {
    if (leaving == null) return;
    const frame = window.requestAnimationFrame(() => setIncomingOpacity(1));
    const done = window.setTimeout(() => setLeaving(null), FADE_MS + 40);
    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(done);
    };
  }, [leaving]);

  function show(index: number, pause = false) {
    const next = Math.min(STAGES.length - 1, Math.max(0, index));
    if (next === displayed.current) return;
    setLeaving(displayed.current);
    setIncomingOpacity(0);
    displayed.current = next;
    if (pause) setPaused(true);
    setStage(next);
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse") return;
    dragStart.current = event.clientX;
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    if (dragStart.current == null) return;
    const delta = event.clientX - dragStart.current;
    dragStart.current = null;
    if (delta <= -SWIPE_PX) show(stage + 1, true);
    else if (delta >= SWIPE_PX) show(stage - 1, true);
  }

  const current = STAGES[stage];
  const offering = OFFERINGS[offerShown];
  const baseStage = STAGES[leaving ?? stage];

  return (
    <section className="bg-[#111] text-white" aria-label="Lifecycle of a new house" data-testid="build-lifecycle">
      <div className="relative" onPointerDown={onPointerDown} onPointerUp={onPointerUp}>
        <img
          src={baseStage.image}
          alt={leaving == null ? current.alt : ""}
          aria-hidden={leaving != null}
          className="block h-auto max-h-[70vh] w-full object-cover object-top"
          style={{ display: "block", width: "100%", height: "auto", maxHeight: "70vh", objectFit: "cover", objectPosition: "center top" }}
          fetchPriority="high"
        />
        {leaving != null && (
          <img
            src={current.image}
            alt={current.alt}
            data-testid="lifecycle-incoming"
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              opacity: incomingOpacity,
              transition: `opacity ${FADE_MS}ms ease-in-out`,
            }}
          />
        )}
        <div
          data-testid="lifecycle-offering"
          aria-live="polite"
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 2,
            maxWidth: "min(240px, calc(100% - 24px))",
            background: "rgba(17,17,17,0.82)",
            color: "#fff",
            padding: "10px 12px",
            opacity: offerOpacity,
            transition: `opacity ${OFFER_FADE_MS}ms ease`,
          }}
        >
          <p style={{ margin: 0, fontSize: 10, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "#d0ad92" }}>
            {offering.title}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 600, lineHeight: 1.3 }}>
            Starting at ₹{offering.price}
            <span style={{ fontWeight: 500, fontSize: 12 }}> {offering.unit}</span>
          </p>
        </div>
        <button
          type="button"
          aria-label="Previous picture"
          data-testid="lifecycle-previous"
          disabled={stage === 0}
          onClick={() => show(stage - 1, true)}
          className="absolute left-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center bg-black/55 text-white disabled:opacity-30"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          aria-label="Next picture"
          data-testid="lifecycle-next"
          disabled={stage === STAGES.length - 1}
          onClick={() => show(stage + 1, true)}
          className="absolute right-3 top-1/2 grid size-11 -translate-y-1/2 place-items-center bg-black/55 text-white disabled:opacity-30"
        >
          <ChevronRight size={22} />
        </button>
      </div>
      <div className="px-4 py-4 sm:px-8 lg:px-12">
        <div className="mx-auto flex max-w-[1400px] flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div aria-live="polite">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#d0ad92]">
              From land to handover · {stage + 1} / {STAGES.length}
            </p>
            <h2 className="mt-1 font-heading text-2xl font-medium leading-none sm:text-3xl">{current.label}</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-white/70">{current.detail}</p>
          </div>
          <div className="flex items-center gap-2" role="tablist" aria-label="Build stages">
            {STAGES.map((item, index) => (
              <button
                key={item.label}
                type="button"
                role="tab"
                aria-selected={index === stage}
                aria-label={item.label}
                data-testid={`lifecycle-stage-${index + 1}`}
                onClick={() => show(index, true)}
                className={`h-2.5 transition-[width] duration-700 ${index === stage ? "w-8 bg-[#d0ad92]" : "w-2.5 bg-white/30"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
