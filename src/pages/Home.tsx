import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  Blocks,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Compass,
  HardHat,
  Home as HomeIcon,
  Instagram,
  Layers3,
  Lightbulb,
  MapPin,
  Menu,
  MessageCircle,
  MoveUpRight,
  PenTool,
  Phone,
  Ruler,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { toast } from "sonner";

import { BuildLifecycle } from "@/components/BuildLifecycle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiPost } from "@/lib/api";
import type { Lead, LeadCreate, LandOwnership, NextStep, Timeline } from "@/lib/types";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1722421492323-eaf9c401befe?auto=format&fit=crop&w=1800&q=82";
const CONSTRUCTION_IMAGE =
  "https://images.pexels.com/photos/39151690/pexels-photo-39151690.jpeg?auto=compress&cs=tinysrgb&w=1400";
const INTERIOR_IMAGE =
  "https://images.pexels.com/photos/8089172/pexels-photo-8089172.jpeg?auto=compress&cs=tinysrgb&w=1200";

const galleryItems = [
  {
    title: "Quiet Courtyard House",
    category: "Contemporary",
    image: "https://images.unsplash.com/photo-1721815693498-cc28507c0ba2?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Warm Modern Living",
    category: "Living Spaces",
    image: "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Brick & Light Residence",
    category: "Modern-Traditional",
    image: "https://images.unsplash.com/photo-1703962168797-5bc5cc147681?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Everyday Indian Kitchen",
    category: "Kitchens",
    image: INTERIOR_IMAGE,
  },
  {
    title: "Layered Front Elevation",
    category: "Front Elevation",
    image: "https://images.unsplash.com/photo-1661434241244-63c4f42b8d87?auto=format&fit=crop&w=1000&q=80",
  },
  {
    title: "Garden Edge Villa",
    category: "Large Homes",
    image: "https://images.pexels.com/photos/32031452/pexels-photo-32031452.jpeg?auto=compress&cs=tinysrgb&w=1000",
  },
];

const cityList = ["Patna", "Muzaffarpur", "Gaya", "Darbhanga", "Bhagalpur", "Purnia", "Begusarai", "Munger"];
const faqItems = [
  ["Do you construct houses on customer-owned land?", "Yes. Our process is designed around customer-owned plots, from site understanding and planning through construction and handover."],
  ["Do you provide architectural and structural drawings?", "We coordinate architectural planning, structural engineering and the working information needed for a well-managed build."],
  ["Can I use my own architect or materials?", "We can work with your chosen professionals or materials where responsibilities, specifications and quality checks are clearly agreed."],
  ["Can you manage my project remotely?", "Yes. Remote owners receive digital drawings, site photos, progress updates and one central point of coordination."],
  ["Do you work outside Patna?", "We are building a Bihar-focused service network. Share your city and plot location so the team can confirm the right next step."],
  ["How is the construction cost calculated?", "Cost depends on built-up area, structure, specifications, MEP, finishes, openings, interiors and site conditions. We provide a project-specific estimate instead of a generic promise."],
  ["What happens after I submit an enquiry?", "A home consultant reviews your details, clarifies the brief and recommends a consultation or site discussion based on your timeline."],
];

type LeadFormData = LeadCreate;

const initialForm: LeadFormData = {
  name: "",
  phone: "",
  city: "",
  land_ownership: "yes",
  plot_size: "",
  timeline: "3-6",
  plot_location: "",
  road_width: "",
  plot_dimensions: "",
  corner_plot: false,
  bhk: "3",
  floors: "1",
  built_up_area: "",
  style: "modern",
  parking: "1 car",
  interiors_required: true,
  next_step: "consultation",
  source: "website",
  utm_campaign: typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("utm_campaign"),
  landing_page: typeof window === "undefined" ? "/" : window.location.pathname,
};

function scrollToFunnel() {
  document.getElementById("funnel")?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mb-12 max-w-3xl" data-testid={`section-intro-${eyebrow.toLowerCase().replaceAll(" ", "-")}`}>
      <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#a38068]" data-testid={`section-eyebrow-${eyebrow.toLowerCase().replaceAll(" ", "-")}`}>
        {eyebrow}
      </p>
      <h2 className="max-w-2xl text-4xl font-medium leading-[1.04] text-[#1a1a1a] sm:text-5xl" data-testid={`section-title-${eyebrow.toLowerCase().replaceAll(" ", "-")}`}>
        {title}
      </h2>
      <p className="mt-5 max-w-xl text-base leading-7 text-[#666]" data-testid={`section-body-${eyebrow.toLowerCase().replaceAll(" ", "-")}`}>
        {body}
      </p>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  testId,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  testId: string;
}) {
  return (
    <label className="block" data-testid={`${testId}-field`}>
      <span className="mb-2 block text-xs font-semibold text-[#555]" data-testid={`${testId}-label`}>{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full border border-[#ded9d4] bg-[#fff] px-3 text-sm text-[#1a1a1a] outline-none focus:border-[#a38068] focus:ring-2 focus:ring-[#a38068]/15"
        data-testid={testId}
      >
        {options.map((option) => <option value={option} key={option}>{option}</option>)}
      </select>
    </label>
  );
}

function ChoiceButton({
  label,
  selected,
  onClick,
  testId,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  testId: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-12 items-center justify-between border px-4 text-left text-sm ${selected ? "border-[#a38068] bg-[#f4eee9] text-[#1a1a1a]" : "border-[#ded9d4] bg-white text-[#666] hover:-translate-y-0.5 hover:border-[#a38068]"}`}
      data-testid={testId}
      aria-pressed={selected}
    >
      <span data-testid={`${testId}-label`}>{label}</span>
      {selected && <Check size={16} className="text-[#a38068]" aria-hidden="true" />}
    </button>
  );
}

export function LeadFunnel() {
  const queryClient = useQueryClient();
  const [stage, setStage] = useState(0);
  const [form, setForm] = useState<LeadFormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const mutation = useMutation({
    mutationFn: (payload: LeadFormData) => apiPost<Lead>("/leads", payload),
    onSuccess: () => {
      setSubmitted(true);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      toast.success("Your home brief is with our team.");
    },
    onError: () => toast.error("We could not save that just now. Please try again."),
  });

  const updateField = <K extends keyof LeadFormData>(field: K, value: LeadFormData[K]) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const nextStage = () => {
    if (stage === 0 && (!form.name || !form.phone || !form.city)) {
      toast.error("Add your name, phone and city to continue.");
      return;
    }
    if (stage === 1 && (!form.plot_size || !form.plot_location || !form.road_width || !form.plot_dimensions)) {
      toast.error("Tell us a little more about the plot.");
      return;
    }
    if (stage === 2 && (!form.bhk || !form.built_up_area)) {
      toast.error("Choose a home size and approximate built-up area.");
      return;
    }
    setStage((current) => Math.min(current + 1, 4));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (stage < 4) {
      nextStage();
      return;
    }
    mutation.mutate(form);
  };

  return (
    <section id="funnel" className="scroll-mt-28 border-y border-[#e5e1dd] bg-[#f3f1ef] px-4 py-16 sm:px-8 lg:px-12" data-testid="lead-funnel-section">
      <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:pt-8">
          <p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#a38068]" data-testid="lead-funnel-eyebrow">A better first step</p>
          <h2 className="max-w-md text-4xl font-medium leading-[1.04] text-[#1a1a1a] sm:text-5xl" data-testid="lead-funnel-title">Planning to build on your land?</h2>
          <p className="mt-5 max-w-sm text-base leading-7 text-[#666]" data-testid="lead-funnel-copy">Share a few essentials. We’ll use them to make your first conversation more useful — not to send you a generic brochure.</p>
          <div className="mt-10 space-y-4" data-testid="lead-funnel-trust-list">
            {["A clear brief for your home consultant", "A process shaped around your plot", "No fabricated price promises"].map((item, index) => (
              <div className="flex items-center gap-3 text-sm text-[#4b4b4b]" key={item} data-testid={`lead-funnel-trust-${index + 1}`}>
                <span className="grid size-6 place-items-center border border-[#c9b5a5] bg-white text-[#a38068]"><Check size={13} /></span>
                <span data-testid={`lead-funnel-trust-text-${index + 1}`}>{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 hidden items-center gap-3 text-sm text-[#666] sm:flex" data-testid="lead-funnel-response-note">
            <MessageCircle size={17} className="text-[#a38068]" /> Typically answered by a home consultant within one working day
          </div>
        </div>

        <div className="border border-[#e1dbd6] bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] sm:p-8" data-testid="lead-funnel-card">
          {submitted ? (
            <div className="flex min-h-[480px] flex-col justify-center" data-testid="lead-funnel-success-state">
              <div className="mb-6 grid size-14 place-items-center bg-[#a38068] text-white"><CheckCircle2 size={28} /></div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#a38068]" data-testid="lead-success-eyebrow">Brief received</p>
              <h3 className="mt-4 max-w-md text-4xl font-medium leading-tight text-[#1a1a1a]" data-testid="lead-success-title">Your home planning starts here.</h3>
              <p className="mt-4 max-w-md text-sm leading-7 text-[#666]" data-testid="lead-success-copy">Aangan Buildworks will review your plot and timeline before reaching out. Keep your phone nearby for a thoughtful first conversation.</p>
              <button type="button" onClick={() => { setSubmitted(false); setStage(0); setForm(initialForm); }} className="mt-8 flex w-fit items-center gap-2 text-sm font-semibold text-[#a38068] hover:gap-3" data-testid="lead-start-another-button">Start another brief <ArrowRight size={16} /></button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} data-testid="lead-funnel-form">
              <div className="mb-8 flex items-center justify-between gap-4" data-testid="lead-funnel-progress-header">
                <div>
                  <p className="text-xs font-semibold text-[#1a1a1a]" data-testid="lead-funnel-step-label">Step {stage + 1} of 5</p>
                  <p className="mt-1 text-xs text-[#777]" data-testid="lead-funnel-step-name">{["Your project", "Your land", "Your home", "Your timeline", "Next step"][stage]}</p>
                </div>
                <div className="h-1 w-32 bg-[#ece8e4]" data-testid="lead-funnel-progress-track"><div className="h-full bg-[#a38068]" style={{ width: `${(stage + 1) * 20}%` }} data-testid="lead-funnel-progress-fill" /></div>
              </div>

              {stage === 0 && <div className="space-y-5" data-testid="lead-funnel-stage-project">
                <div><h3 className="text-2xl font-medium text-[#1a1a1a]" data-testid="lead-stage-project-title">Tell us about your project</h3><p className="mt-2 text-sm text-[#777]" data-testid="lead-stage-project-copy">We’ll keep the first conversation focused.</p></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2" data-testid="lead-name-field"><span className="mb-2 block text-xs font-semibold text-[#555]" data-testid="lead-name-label">Your name</span><Input required value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="e.g. Ananya Kumar" className="h-12 rounded-none border-[#ded9d4]" data-testid="lead-name-input" /></label>
                  <label className="block" data-testid="lead-phone-field"><span className="mb-2 block text-xs font-semibold text-[#555]" data-testid="lead-phone-label">Phone / WhatsApp</span><Input required type="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="+91 98..." className="h-12 rounded-none border-[#ded9d4]" data-testid="lead-phone-input" /></label>
                  <label className="block" data-testid="lead-city-field"><span className="mb-2 block text-xs font-semibold text-[#555]" data-testid="lead-city-label">City of your plot</span><Input required value={form.city} onChange={(event) => updateField("city", event.target.value)} placeholder="Patna" className="h-12 rounded-none border-[#ded9d4]" data-testid="lead-city-input" /></label>
                </div>
                <div><p className="mb-3 text-xs font-semibold text-[#555]" data-testid="lead-ownership-label">Do you already own land?</p><div className="grid gap-3 sm:grid-cols-3"><ChoiceButton label="Yes, I own land" selected={form.land_ownership === "yes"} onClick={() => updateField("land_ownership", "yes")} testId="lead-ownership-owned" /><ChoiceButton label="Buying land" selected={form.land_ownership === "buying"} onClick={() => updateField("land_ownership", "buying")} testId="lead-ownership-buying" /><ChoiceButton label="Planning to buy" selected={form.land_ownership === "planning"} onClick={() => updateField("land_ownership", "planning")} testId="lead-ownership-planning" /></div></div>
              </div>}

              {stage === 1 && <div className="space-y-5" data-testid="lead-funnel-stage-land">
                <div><h3 className="text-2xl font-medium text-[#1a1a1a]" data-testid="lead-stage-land-title">Tell us about your land</h3><p className="mt-2 text-sm text-[#777]" data-testid="lead-stage-land-copy">Rough numbers are perfectly fine at this stage.</p></div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block" data-testid="lead-plot-size-field"><span className="mb-2 block text-xs font-semibold text-[#555]" data-testid="lead-plot-size-label">Approx. plot size</span><Input required value={form.plot_size} onChange={(event) => updateField("plot_size", event.target.value)} placeholder="e.g. 1,800 sq ft" className="h-12 rounded-none border-[#ded9d4]" data-testid="lead-plot-size-input" /></label>
                  <label className="block" data-testid="lead-plot-location-field"><span className="mb-2 block text-xs font-semibold text-[#555]" data-testid="lead-plot-location-label">Plot location / locality</span><Input required value={form.plot_location} onChange={(event) => updateField("plot_location", event.target.value)} placeholder="Area or landmark" className="h-12 rounded-none border-[#ded9d4]" data-testid="lead-plot-location-input" /></label>
                  <label className="block" data-testid="lead-road-width-field"><span className="mb-2 block text-xs font-semibold text-[#555]" data-testid="lead-road-width-label">Road width</span><Input required value={form.road_width} onChange={(event) => updateField("road_width", event.target.value)} placeholder="e.g. 20 ft" className="h-12 rounded-none border-[#ded9d4]" data-testid="lead-road-width-input" /></label>
                  <label className="block" data-testid="lead-plot-dimensions-field"><span className="mb-2 block text-xs font-semibold text-[#555]" data-testid="lead-plot-dimensions-label">Approx. dimensions</span><Input required value={form.plot_dimensions} onChange={(event) => updateField("plot_dimensions", event.target.value)} placeholder="e.g. 30 × 60 ft" className="h-12 rounded-none border-[#ded9d4]" data-testid="lead-plot-dimensions-input" /></label>
                </div>
                <div><p className="mb-3 text-xs font-semibold text-[#555]" data-testid="lead-corner-plot-label">Is it a corner plot?</p><div className="grid grid-cols-2 gap-3 sm:max-w-xs"><ChoiceButton label="Yes" selected={form.corner_plot} onClick={() => updateField("corner_plot", true)} testId="lead-corner-yes" /><ChoiceButton label="No" selected={!form.corner_plot} onClick={() => updateField("corner_plot", false)} testId="lead-corner-no" /></div></div>
              </div>}

              {stage === 2 && <div className="space-y-5" data-testid="lead-funnel-stage-home">
                <div><h3 className="text-2xl font-medium text-[#1a1a1a]" data-testid="lead-stage-home-title">Tell us about your home</h3><p className="mt-2 text-sm text-[#777]" data-testid="lead-stage-home-copy">This helps us understand the shape of your brief.</p></div>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-5"><ChoiceButton label="2 BHK" selected={form.bhk === "2"} onClick={() => updateField("bhk", "2")} testId="lead-bhk-2" /><ChoiceButton label="3 BHK" selected={form.bhk === "3"} onClick={() => updateField("bhk", "3")} testId="lead-bhk-3" /><ChoiceButton label="4 BHK" selected={form.bhk === "4"} onClick={() => updateField("bhk", "4")} testId="lead-bhk-4" /><ChoiceButton label="5+ BHK" selected={form.bhk === "5+"} onClick={() => updateField("bhk", "5+")} testId="lead-bhk-5-plus" /><ChoiceButton label="Custom" selected={form.bhk === "custom"} onClick={() => updateField("bhk", "custom")} testId="lead-bhk-custom" /></div>
                <div className="grid gap-4 sm:grid-cols-2"><SelectField label="Number of floors" value={form.floors} onChange={(value) => updateField("floors", value)} options={["1", "2", "3", "4+"]} testId="lead-floors-select" /><label className="block" data-testid="lead-built-up-area-field"><span className="mb-2 block text-xs font-semibold text-[#555]" data-testid="lead-built-up-area-label">Approx. built-up area</span><Input required value={form.built_up_area} onChange={(event) => updateField("built_up_area", event.target.value)} placeholder="e.g. 2,200 sq ft" className="h-12 rounded-none border-[#ded9d4]" data-testid="lead-built-up-area-input" /></label><SelectField label="Style preference" value={form.style} onChange={(value) => updateField("style", value)} options={["modern", "contemporary", "traditional", "villa", "custom"]} testId="lead-style-select" /><SelectField label="Parking requirement" value={form.parking} onChange={(value) => updateField("parking", value)} options={["No parking", "1 car", "2 cars", "Cars + two-wheelers"]} testId="lead-parking-select" /></div>
                <button type="button" onClick={() => updateField("interiors_required", !form.interiors_required)} className="flex w-full items-center gap-3 border border-[#ded9d4] p-4 text-left text-sm hover:border-[#a38068]" data-testid="lead-interiors-toggle"><span className={`grid size-5 place-items-center border ${form.interiors_required ? "border-[#a38068] bg-[#a38068] text-white" : "border-[#cfc8c2]"}`}>{form.interiors_required && <Check size={13} />}</span><span data-testid="lead-interiors-toggle-label">I’d like to discuss interiors as part of the project</span></button>
              </div>}

              {stage === 3 && <div className="space-y-5" data-testid="lead-funnel-stage-timeline">
                <div><h3 className="text-2xl font-medium text-[#1a1a1a]" data-testid="lead-stage-timeline-title">Tell us about your timeline</h3><p className="mt-2 text-sm text-[#777]" data-testid="lead-stage-timeline-copy">There’s no wrong answer — this simply helps us prioritise the right conversation.</p></div>
                <div className="grid gap-3 sm:grid-cols-2"><ChoiceButton label="Within 3 months" selected={form.timeline === "0-3"} onClick={() => updateField("timeline", "0-3")} testId="lead-timeline-0-3" /><ChoiceButton label="3–6 months" selected={form.timeline === "3-6"} onClick={() => updateField("timeline", "3-6")} testId="lead-timeline-3-6" /><ChoiceButton label="6–12 months" selected={form.timeline === "6-12"} onClick={() => updateField("timeline", "6-12")} testId="lead-timeline-6-12" /><ChoiceButton label="12+ months / exploring" selected={form.timeline === "12+"} onClick={() => updateField("timeline", "12+")} testId="lead-timeline-12-plus" /></div>
              </div>}

              {stage === 4 && <div className="space-y-5" data-testid="lead-funnel-stage-proceed">
                <div><h3 className="text-2xl font-medium text-[#1a1a1a]" data-testid="lead-stage-proceed-title">How would you like to proceed?</h3><p className="mt-2 text-sm text-[#777]" data-testid="lead-stage-proceed-copy">Choose what would feel most useful right now.</p></div>
                <div className="grid gap-3"><ChoiceButton label="Request a consultation" selected={form.next_step === "consultation"} onClick={() => updateField("next_step", "consultation")} testId="lead-next-consultation" /><ChoiceButton label="Request a site visit" selected={form.next_step === "site-visit"} onClick={() => updateField("next_step", "site-visit")} testId="lead-next-site-visit" /><ChoiceButton label="Preliminary discussion" selected={form.next_step === "discussion"} onClick={() => updateField("next_step", "discussion")} testId="lead-next-discussion" /><ChoiceButton label="I’m just exploring" selected={form.next_step === "exploring"} onClick={() => updateField("next_step", "exploring")} testId="lead-next-exploring" /></div>
                <div className="border-l-2 border-[#a38068] bg-[#faf8f6] p-4 text-sm leading-6 text-[#666]" data-testid="lead-funnel-privacy-note">Your details are used only to understand your requirement and arrange the next conversation.</div>
              </div>}

              {mutation.isError && <p className="mt-5 text-sm text-red-700" data-testid="lead-funnel-error">Please check your details and try again.</p>}
              <div className="mt-8 flex items-center justify-between gap-4 border-t border-[#eee9e5] pt-6">
                {stage > 0 ? <button type="button" onClick={() => setStage((current) => current - 1)} className="text-sm font-semibold text-[#666] hover:text-[#1a1a1a]" data-testid="lead-funnel-back-button">Back</button> : <span />}
                <Button type="submit" disabled={mutation.isPending} className="h-12 rounded-md bg-[#a38068] px-5 text-white hover:-translate-y-0.5 hover:bg-[#8c6b55]" data-testid={stage === 4 ? "lead-funnel-submit-button" : "lead-funnel-next-button"}>{mutation.isPending ? "Sending…" : stage === 4 ? "Send My Home Brief" : "Continue"}<ArrowRight size={16} /></Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ icon: Icon, title, body, index }: { icon: LucideIcon; title: string; body: string; index: number }) {
  return <motion.div whileHover={{ y: -5 }} className={`border border-[#e4dfdb] bg-white p-6 ${index === 0 ? "lg:col-span-2" : ""}`} data-testid={`service-card-${index + 1}`}><div className="mb-12 flex items-start justify-between"><div className="grid size-11 place-items-center bg-[#f3eee9] text-[#a38068]"><Icon size={21} /></div><span className="font-mono text-xs text-[#aaa]" data-testid={`service-card-number-${index + 1}`}>0{index + 1}</span></div><h3 className="text-xl font-medium text-[#1a1a1a]" data-testid={`service-card-title-${index + 1}`}>{title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-[#707070]" data-testid={`service-card-body-${index + 1}`}>{body}</p></motion.div>;
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [plotArea, setPlotArea] = useState(1800);
  const [builtArea, setBuiltArea] = useState(2200);
  const [floors, setFloors] = useState("2");
  const [quality, setQuality] = useState("Thoughtful premium");
  const [interiors, setInteriors] = useState(true);
  const filters = ["All", "Contemporary", "Modern-Traditional", "Front Elevation", "Living Spaces", "Kitchens", "Large Homes"];
  const visibleGallery = galleryFilter === "All" ? galleryItems : galleryItems.filter((item) => item.category === galleryFilter);

  return <div className="min-h-screen bg-[#fafafa] text-[#1a1a1a]" data-testid="home-page">
    <header className="sticky top-0 z-50 border-b border-[#e5e1dd]/80 bg-[#fafafa]/85 backdrop-blur-xl" data-testid="site-header">
      <div className="mx-auto flex h-[72px] max-w-[1400px] items-center justify-between px-4 sm:px-8 lg:px-12">
        <a href="#top" className="flex items-center gap-3" data-testid="brand-home-link"><span className="grid size-9 place-items-center bg-[#1a1a1a] text-[#f4ede6]"><span className="font-heading text-xl">A</span></span><span className="text-sm font-bold tracking-[0.08em]" data-testid="brand-name">AANGAN <span className="font-normal text-[#a38068]">BUILDWORKS</span></span></a>
        <nav className="hidden items-center gap-6 text-xs font-semibold text-[#555] xl:flex" data-testid="desktop-navigation"><a href="#services" className="hover:text-[#a38068]" data-testid="nav-services-link">Services</a><a href="#process" className="hover:text-[#a38068]" data-testid="nav-process-link">Our Process</a><a href="#homes" className="hover:text-[#a38068]" data-testid="nav-homes-link">Home Designs</a><a href="#construction" className="hover:text-[#a38068]" data-testid="nav-construction-link">Construction</a><a href="#resources" className="hover:text-[#a38068]" data-testid="nav-resources-link">Resources</a><Link to="/contact" className="hover:text-[#a38068]" data-testid="nav-contact-link">Contact</Link></nav>
        <div className="flex items-center gap-2"><button type="button" onClick={scrollToFunnel} className="hidden h-10 items-center gap-2 bg-[#a38068] px-4 text-xs font-bold text-white hover:-translate-y-0.5 hover:bg-[#8c6b55] sm:flex" data-testid="header-plan-my-home-button">Plan My Home <ArrowRight size={14} /></button><button type="button" onClick={() => setMenuOpen((current) => !current)} className="grid size-10 place-items-center border border-[#ded9d4] xl:hidden" aria-label="Toggle menu" data-testid="mobile-menu-button">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button></div>
      </div>
      {menuOpen && <div className="border-t border-[#e5e1dd] bg-[#fafafa] px-4 py-5 xl:hidden" data-testid="mobile-navigation"><div className="grid gap-4 text-sm font-semibold"><a href="#services" onClick={() => setMenuOpen(false)} data-testid="mobile-nav-services-link">Services</a><a href="#process" onClick={() => setMenuOpen(false)} data-testid="mobile-nav-process-link">Our Process</a><a href="#homes" onClick={() => setMenuOpen(false)} data-testid="mobile-nav-homes-link">Home Designs</a><Link to="/contact" onClick={() => setMenuOpen(false)} data-testid="mobile-nav-contact-link">Contact</Link><button type="button" onClick={() => { setMenuOpen(false); scrollToFunnel(); }} className="w-full bg-[#a38068] py-3 text-left px-4 text-white" data-testid="mobile-nav-plan-button">Plan My Home <ArrowRight size={15} className="inline" /></button></div></div>}
    </header>

    <main id="top">
      <BuildLifecycle />
      <section className="relative overflow-hidden bg-[#1b1b1b] px-4 py-10 text-white sm:px-8 sm:py-16 lg:px-12 lg:py-20" data-testid="hero-section">
        <div className="mx-auto grid max-w-[1400px] items-end gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10 pb-4 lg:pb-12"><p className="mb-7 flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.25em] text-[#d0ad92]" data-testid="hero-eyebrow"><span className="h-px w-8 bg-[#d0ad92]" /> Design + Build in Bihar</p><h1 className="max-w-2xl text-5xl font-medium leading-[0.95] tracking-[-0.055em] text-white sm:text-7xl lg:text-[84px]" data-testid="hero-title">Build the home you’ve been planning.</h1><p className="mt-7 max-w-md text-base leading-7 text-white/70 sm:text-lg" data-testid="hero-subtitle">Professional design, construction and interiors for landowners across Bihar.</p><div className="mt-9 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={scrollToFunnel} className="group flex h-12 items-center justify-center gap-3 bg-[#a38068] px-5 text-sm font-bold text-white hover:-translate-y-0.5 hover:bg-[#8c6b55]" data-testid="hero-plan-my-home-button">Plan My Home <ArrowRight size={17} className="group-hover:translate-x-1" /></button><a href="#homes" className="flex h-12 items-center justify-center gap-3 border border-white/30 px-5 text-sm font-bold text-white hover:border-white" data-testid="hero-explore-homes-link">Explore Our Homes <ArrowDownRight size={17} /></a></div><p className="mt-7 text-xs text-white/50" data-testid="hero-trust-line">From concept to handover — one professionally managed process.</p></motion.div>
          <div className="relative min-h-[390px] overflow-hidden sm:min-h-[500px] lg:min-h-[590px]" data-testid="hero-image-frame"><img src={HERO_IMAGE} alt="Contemporary Indian independent home with stone and concrete detailing" className="absolute inset-0 size-full object-cover" fetchPriority="high" /><div className="absolute inset-0 bg-gradient-to-t from-[#1b1b1b]/60 via-transparent to-[#1b1b1b]/10" /><div className="absolute bottom-5 left-5 flex items-center gap-3 border border-white/20 bg-[#1b1b1b]/55 px-4 py-3 backdrop-blur-md sm:bottom-8 sm:left-8" data-testid="hero-image-caption"><HomeIcon size={17} className="text-[#d0ad92]" /><span className="text-xs text-white/80" data-testid="hero-image-caption-text">A home shaped around your land and life</span></div></div>
        </div>
      </section>

      <div className="border-b border-[#e5e1dd] bg-white px-4 py-5 sm:px-8 lg:px-12" data-testid="trust-strip"><div className="mx-auto grid max-w-[1240px] gap-4 text-xs font-semibold text-[#555] sm:grid-cols-2 lg:grid-cols-5"><span className="flex items-center gap-2" data-testid="trust-item-project-management"><ShieldCheck size={16} className="text-[#a38068]" /> Professional project management</span><span className="flex items-center gap-2" data-testid="trust-item-quality"><CheckCircle2 size={16} className="text-[#a38068]" /> Quality-controlled execution</span><span className="flex items-center gap-2" data-testid="trust-item-scope"><Ruler size={16} className="text-[#a38068]" /> Transparent scope</span><span className="flex items-center gap-2" data-testid="trust-item-design-build"><PenTool size={16} className="text-[#a38068]" /> Design + build</span><span className="flex items-center gap-2" data-testid="trust-item-remote"><Compass size={16} className="text-[#a38068]" /> Remote project monitoring</span></div></div>

      <LeadFunnel />

      <section id="services" className="mx-auto max-w-[1240px] px-4 py-20 sm:px-8 lg:px-12 lg:py-28" data-testid="services-section"><SectionIntro eyebrow="One team, your entire home" title="Everything your home needs, brought into one accountable process." body="From the first sketch to the final handover, your brief stays connected across design, structure, services, materials and site execution." /><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><ServiceCard icon={PenTool} title="Architecture & Planning" body="A practical home plan built around your plot, light, movement and family life." index={0} /><ServiceCard icon={Blocks} title="Structural Engineering" body="Clear structural thinking that supports safety, durability and future flexibility." index={1} /><ServiceCard icon={HardHat} title="Construction" body="Planned site execution with milestones, coordination and quality checkpoints." index={2} /><ServiceCard icon={Lightbulb} title="Electrical & Plumbing" body="The systems behind comfortable, efficient and maintainable Indian homes." index={3} /><ServiceCard icon={Layers3} title="Interiors" body="Material, kitchen, wardrobe and lighting conversations that complete the home." index={4} /><ServiceCard icon={CircleDot} title="Project Management" body="One team keeping decisions, vendors, progress and communication moving." index={5} /></div></section>

      <section id="process" className="border-y border-[#e5e1dd] bg-[#f3f1ef] px-4 py-20 sm:px-8 lg:px-12 lg:py-28" data-testid="process-section"><div className="mx-auto max-w-[1240px]"><SectionIntro eyebrow="How it works" title="A calmer way to build a home." body="A clear sequence gives your family confidence before the first brick is laid." /><div className="grid gap-px border border-[#ddd6d0] bg-[#ddd6d0] sm:grid-cols-2 lg:grid-cols-3">{[["01", "Tell us about your land", "We understand the plot, location, access and the people the home is for."], ["02", "Understand your requirements", "Your rooms, routines, budget direction and future plans shape the brief."], ["03", "Design your home", "Architecture, structure and services develop together — not in separate silos."], ["04", "Finalise scope & budget", "Specifications, responsibilities and milestones become clear before work begins."], ["05", "Build with quality control", "Site progress is coordinated through planned checkpoints and regular updates."], ["06", "Move into your home", "A considered handover brings the work, records and final details together."]].map(([number, title, body], index) => <motion.div whileHover={{ backgroundColor: "#ffffff" }} key={number} className={`bg-[#f8f6f4] p-7 sm:p-8 ${index === 0 ? "lg:col-span-2" : ""}`} data-testid={`process-step-${number}`}><span className="font-mono text-xs text-[#a38068]" data-testid={`process-step-number-${number}`}>{number}</span><h3 className="mt-16 max-w-xs text-2xl font-medium" data-testid={`process-step-title-${number}`}>{title}</h3><p className="mt-3 max-w-sm text-sm leading-6 text-[#6d6d6d]" data-testid={`process-step-body-${number}`}>{body}</p></motion.div>)}</div></div></section>

      <section id="homes" className="mx-auto max-w-[1240px] px-4 py-20 sm:px-8 lg:px-12 lg:py-28" data-testid="gallery-section"><div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end"><SectionIntro eyebrow="Home design gallery" title="Real homes. Practical architecture." body="Reference directions for homes that feel expressive, comfortable and achievable — not like a catalogue of impossible promises." /><div className="flex max-w-2xl flex-wrap gap-2 pb-12" data-testid="gallery-filter-group">{filters.map((filter) => <button type="button" key={filter} onClick={() => setGalleryFilter(filter)} className={`border px-3 py-2 text-xs font-semibold ${galleryFilter === filter ? "border-[#a38068] bg-[#a38068] text-white" : "border-[#ded9d4] bg-white text-[#666] hover:border-[#a38068]"}`} data-testid={`gallery-filter-${filter.toLowerCase().replaceAll(" ", "-")}`}>{filter}</button>)}</div></div><div className="grid auto-rows-[180px] grid-cols-2 gap-3 sm:auto-rows-[220px] lg:grid-cols-4">{visibleGallery.map((item, index) => <motion.figure layout key={item.title} className={`group relative overflow-hidden bg-[#eee] ${index === 0 ? "row-span-2 lg:col-span-2" : index === 1 ? "lg:col-span-2" : ""}`} data-testid={`gallery-card-${index + 1}`}><img src={item.image} alt={`${item.title}, Indian residential architecture reference`} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-80" /><figcaption className="absolute bottom-0 left-0 p-4 text-white sm:p-5"><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#e8cbb8]" data-testid={`gallery-category-${index + 1}`}>{item.category}</p><p className="mt-1 text-sm font-semibold" data-testid={`gallery-title-${index + 1}`}>{item.title}</p></figcaption></motion.figure>)}</div><p className="mt-5 text-xs text-[#888]" data-testid="gallery-reference-note">Reference imagery shown for direction. Completed company projects will be added as the portfolio grows.</p></section>

      <section className="overflow-hidden bg-[#1f2423] px-4 py-20 text-white sm:px-8 lg:px-12 lg:py-28" data-testid="bihar-section"><div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24"><div><p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#d0ad92]" data-testid="bihar-eyebrow">Homes that fit Bihar</p><h2 className="max-w-xl text-4xl font-medium leading-[1.04] text-white sm:text-6xl" data-testid="bihar-title">Designed for Bihar. Built for Indian living.</h2><p className="mt-6 max-w-lg text-base leading-7 text-white/65" data-testid="bihar-body">Heat, monsoon, ventilation, natural light, parking, storage and future expansion are not afterthoughts. They are part of the brief from day one.</p><div className="mt-9 grid grid-cols-2 gap-x-5 gap-y-4 text-sm text-white/80 sm:grid-cols-3" data-testid="bihar-considerations">{["Local climate", "Cross ventilation", "Water management", "Family lifestyle", "Future expansion", "Easy maintenance"].map((item, index) => <span className="flex items-center gap-2" key={item} data-testid={`bihar-consideration-${index + 1}`}><Check size={14} className="text-[#d0ad92]" /> {item}</span>)}</div></div><div className="relative min-h-[380px] overflow-hidden sm:min-h-[450px]" data-testid="bihar-image-frame"><img src="https://images.pexels.com/photos/7672060/pexels-photo-7672060.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Contemporary residential architecture in India" loading="lazy" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-[#1f2423]/70 to-transparent" /><div className="absolute bottom-5 left-5 right-5 flex flex-wrap gap-2 sm:bottom-8 sm:left-8" data-testid="bihar-city-list">{cityList.map((city) => <span key={city} className="border border-white/25 bg-black/20 px-3 py-2 text-xs text-white backdrop-blur-md" data-testid={`bihar-city-${city.toLowerCase()}`}>{city}</span>)}</div></div></div></section>

      <section className="mx-auto max-w-[1240px] px-4 py-20 sm:px-8 lg:px-12 lg:py-28" data-testid="home-types-section"><SectionIntro eyebrow="Design your home" title="What kind of home are you planning?" body="Start with a direction. We’ll help you shape the right response for your land, family and long-term plans." /><div className="grid grid-cols-2 gap-3 sm:grid-cols-4">{[["2 BHK", "A considered compact home"], ["3 BHK", "Room for today and tomorrow"], ["4 BHK", "A generous family base"], ["5 BHK+", "Space for many chapters"], ["Duplex", "A home with vertical rhythm"], ["Villa", "Indoor-outdoor living"], ["Rental / Multi-family", "Plan for more than one household"], ["Custom Home", "A brief with no template"]].map(([title, body], index) => <button type="button" key={title} onClick={scrollToFunnel} className="group min-h-36 border border-[#e4dfdb] bg-white p-5 text-left hover:-translate-y-1 hover:border-[#a38068] sm:min-h-44 sm:p-6" data-testid={`home-type-card-${index + 1}`}><span className="font-mono text-xs text-[#aaa]" data-testid={`home-type-number-${index + 1}`}>0{index + 1}</span><h3 className="mt-8 text-lg font-medium" data-testid={`home-type-title-${index + 1}`}>{title}</h3><p className="mt-1 text-xs leading-5 text-[#777]" data-testid={`home-type-body-${index + 1}`}>{body}</p></button>)}</div></section>

      <section id="budget" className="border-y border-[#e5e1dd] bg-[#f3f1ef] px-4 py-20 sm:px-8 lg:px-12 lg:py-28" data-testid="budget-section"><div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20"><SectionIntro eyebrow="Budget planning" title="Understand the brief before chasing a number." body="Construction cost is shaped by area, structure, materials, finishes, MEP, openings, interiors and site conditions. Use this as a planning conversation — not a fabricated quote." /><div className="border border-[#ded8d2] bg-white p-6 sm:p-8" data-testid="budget-planner-card"><div className="grid gap-6 sm:grid-cols-2"><label data-testid="budget-plot-area-field"><span className="mb-2 flex justify-between text-xs font-semibold text-[#555]"><span data-testid="budget-plot-area-label">Plot area</span><span className="font-mono text-[#a38068]" data-testid="budget-plot-area-value">{plotArea.toLocaleString()} sq ft</span></span><input type="range" min="600" max="5000" step="100" value={plotArea} onChange={(event) => setPlotArea(Number(event.target.value))} className="w-full accent-[#a38068]" data-testid="budget-plot-area-input" /></label><label data-testid="budget-built-area-field"><span className="mb-2 flex justify-between text-xs font-semibold text-[#555]"><span data-testid="budget-built-area-label">Expected built-up area</span><span className="font-mono text-[#a38068]" data-testid="budget-built-area-value">{builtArea.toLocaleString()} sq ft</span></span><input type="range" min="500" max="6000" step="100" value={builtArea} onChange={(event) => setBuiltArea(Number(event.target.value))} className="w-full accent-[#a38068]" data-testid="budget-built-area-input" /></label><SelectField label="Number of floors" value={floors} onChange={setFloors} options={["1", "2", "3", "4+"]} testId="budget-floors-select" /><SelectField label="Quality direction" value={quality} onChange={setQuality} options={["Thoughtful premium", "Essential and durable", "Premium custom"]} testId="budget-quality-select" /></div><button type="button" onClick={() => setInteriors((current) => !current)} className="mt-6 flex items-center gap-3 text-sm text-[#555]" data-testid="budget-interiors-toggle"><span className={`grid size-5 place-items-center border ${interiors ? "border-[#a38068] bg-[#a38068] text-white" : "border-[#cfc8c2]"}`}>{interiors && <Check size={13} />}</span><span data-testid="budget-interiors-label">Include interiors in the conversation</span></button><div className="mt-8 flex flex-col justify-between gap-5 border-t border-[#eee9e5] pt-6 sm:flex-row sm:items-center"><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a38068]" data-testid="budget-summary-eyebrow">Your planning brief</p><p className="mt-2 text-sm text-[#666]" data-testid="budget-summary-copy">{builtArea.toLocaleString()} sq ft · {floors} floor(s) · {quality.toLowerCase()} · {interiors ? "interiors included" : "construction focus"}</p></div><button type="button" onClick={scrollToFunnel} className="flex h-12 items-center justify-center gap-2 bg-[#1a1a1a] px-5 text-sm font-bold text-white hover:-translate-y-0.5" data-testid="budget-calculate-button">Calculate My Requirement <ArrowRight size={16} /></button></div></div></div></section>

      <section id="construction" className="mx-auto max-w-[1240px] px-4 py-20 sm:px-8 lg:px-12 lg:py-28" data-testid="construction-section"><div className="grid gap-12 lg:grid-cols-[1fr_0.9fr] lg:items-center lg:gap-24"><div className="relative min-h-[480px] overflow-hidden" data-testid="construction-image-frame"><img src={CONSTRUCTION_IMAGE} alt="Residential construction site with quality-focused execution" loading="lazy" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" /><div className="absolute bottom-6 left-6 border-l-2 border-[#d0ad92] pl-4 text-white" data-testid="construction-image-caption"><p className="text-xs uppercase tracking-[0.18em] text-[#d0ad92]" data-testid="construction-caption-eyebrow">Quality checkpoints</p><p className="mt-2 text-lg font-medium" data-testid="construction-caption-text">Built with a process. Not just labour.</p></div></div><div><SectionIntro eyebrow="Quality control" title="Building a home shouldn’t mean managing 20 contractors." body="One integrated process makes decisions visible, responsibilities clearer and quality easier to review." /><div className="grid grid-cols-2 gap-3 text-sm">{["Foundation", "Reinforcement", "Concrete", "Brickwork", "Waterproofing", "Electrical", "Plumbing", "Final inspection"].map((item, index) => <div className="flex items-center gap-3 border-b border-[#e8e3df] py-3" key={item} data-testid={`quality-check-${index + 1}`}><span className="grid size-6 place-items-center bg-[#f3eee9] text-[#a38068]"><Check size={13} /></span><span data-testid={`quality-check-text-${index + 1}`}>{item}</span></div>)}</div><a href="#process" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#a38068] hover:gap-3" data-testid="construction-process-link">See our construction process <ArrowRight size={16} /></a></div></div></section>

      <section className="bg-[#1f2423] px-4 py-20 text-white sm:px-8 lg:px-12 lg:py-28" data-testid="transparency-section"><div className="mx-auto grid max-w-[1240px] items-center gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24"><div><p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#d0ad92]" data-testid="transparency-eyebrow">Transparency by design</p><h2 className="text-4xl font-medium leading-[1.04] text-white sm:text-6xl" data-testid="transparency-title">Know what you’re paying for.</h2><p className="mt-6 max-w-md text-base leading-7 text-white/65" data-testid="transparency-body">Detailed scope, material specifications, project milestones, progress updates and clear variation conversations keep the build understandable.</p><div className="mt-8 grid gap-3 text-sm text-white/80">{["Defined responsibilities", "Site photos and progress reporting", "Quality inspections", "Variation management"].map((item, index) => <span className="flex items-center gap-3" key={item} data-testid={`transparency-point-${index + 1}`}><CheckCircle2 size={16} className="text-[#d0ad92]" /> {item}</span>)}</div></div><div className="border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md sm:p-8" data-testid="project-dashboard-mockup"><div className="flex items-start justify-between border-b border-white/10 pb-5"><div><p className="text-[10px] uppercase tracking-[0.2em] text-white/45" data-testid="dashboard-project-label">Project dashboard</p><h3 className="mt-2 text-xl font-medium" data-testid="dashboard-project-name">The Verandah House</h3></div><Badge className="rounded-none border border-[#9dbd9b]/30 bg-[#9dbd9b]/10 text-[#b8d6b5]" data-testid="dashboard-status-badge">On track</Badge></div><div className="grid gap-6 py-7 sm:grid-cols-3"><div><p className="text-xs text-white/45" data-testid="dashboard-progress-label">Completed</p><p className="mt-2 text-3xl font-medium" data-testid="dashboard-progress-value">64%</p></div><div><p className="text-xs text-white/45" data-testid="dashboard-stage-label">Current stage</p><p className="mt-2 text-sm font-semibold" data-testid="dashboard-stage-value">Brickwork</p></div><div><p className="text-xs text-white/45" data-testid="dashboard-next-label">Next milestone</p><p className="mt-2 text-sm font-semibold" data-testid="dashboard-next-value">Roof slab review</p></div></div><div className="h-2 bg-white/10" data-testid="dashboard-progress-track"><div className="h-full w-[64%] bg-[#a38068]" data-testid="dashboard-progress-bar" /></div><div className="mt-7 grid grid-cols-3 gap-3"><div className="h-20 bg-[#776a60]" data-testid="dashboard-photo-one" /><div className="h-20 bg-[#9d8d7f]" data-testid="dashboard-photo-two" /><div className="h-20 bg-[#c1b4a7]" data-testid="dashboard-photo-three" /></div></div></div></section>

      <section className="mx-auto max-w-[1240px] px-4 py-20 sm:px-8 lg:px-12 lg:py-28" data-testid="nri-section"><div className="grid overflow-hidden border border-[#e4dfdb] bg-[#f3eee9] lg:grid-cols-[1.05fr_0.95fr]"><div className="p-7 sm:p-12 lg:p-16"><p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#a38068]" data-testid="nri-eyebrow">For NRI & out-of-station landowners</p><h2 className="max-w-lg text-4xl font-medium leading-[1.04] sm:text-6xl" data-testid="nri-title">Own land in Bihar but live somewhere else?</h2><p className="mt-6 max-w-md text-base leading-7 text-[#666]" data-testid="nri-body">Build your home without being on site every day. Digital drawings, site photos, progress reporting and one central coordination team keep you close to the decisions that matter.</p><button type="button" onClick={scrollToFunnel} className="mt-8 flex h-12 items-center gap-2 bg-[#1a1a1a] px-5 text-sm font-bold text-white hover:-translate-y-0.5" data-testid="nri-plan-button">I Own Land in Bihar <ArrowRight size={16} /></button></div><div className="relative min-h-[330px]" data-testid="nri-image-frame"><img src="https://images.unsplash.com/photo-1701686293432-2bc109cb7f0e?auto=format&fit=crop&w=1200&q=80" alt="Indian family home with a contemporary facade" loading="lazy" className="absolute inset-0 size-full object-cover" /><div className="absolute inset-0 bg-[#1a1a1a]/15" /></div></div></section>

      <section id="resources" className="border-y border-[#e5e1dd] bg-white px-4 py-20 sm:px-8 lg:px-12 lg:py-28" data-testid="resources-section"><div className="mx-auto max-w-[1240px]"><SectionIntro eyebrow="Home building guide" title="Better questions make better homes." body="A practical starting library for landowners planning their next move." /><div className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">{["How much land is required for a 3 BHK house?", "How much does it cost to build a house in Bihar?", "House construction timeline in Bihar", "Architect vs contractor vs design-build", "How to plan electrical points", "How to build a house remotely"].map((title, index) => <a href="#funnel" key={title} className="group border-t border-[#ded9d4] pt-5" data-testid={`resource-card-${index + 1}`}><div className="flex items-center justify-between"><span className="font-mono text-xs text-[#aaa]" data-testid={`resource-number-${index + 1}`}>0{index + 1}</span><ArrowRight size={16} className="text-[#a38068] group-hover:translate-x-1" /></div><h3 className="mt-10 max-w-xs text-xl font-medium" data-testid={`resource-title-${index + 1}`}>{title}</h3><p className="mt-3 text-xs font-semibold text-[#a38068]" data-testid={`resource-link-text-${index + 1}`}>Read the guide</p></a>)}</div></div></section>

      <section className="mx-auto max-w-[1240px] px-4 py-20 sm:px-8 lg:px-12 lg:py-28" data-testid="experience-section"><div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-24"><div><p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-[#a38068]" data-testid="experience-eyebrow">The experience we’re building</p><h2 className="text-4xl font-medium leading-[1.04] sm:text-6xl" data-testid="experience-title">What our clients will experience.</h2><p className="mt-6 max-w-md text-base leading-7 text-[#666]" data-testid="experience-body">We’re creating a home-building experience where clarity, responsiveness and thoughtful execution feel as important as the finished facade.</p></div><div className="grid gap-3 sm:grid-cols-2">{[["A brief that is heard", "Your lifestyle and land set the direction."], ["Fewer surprises", "Scope and decisions stay visible."], ["Progress you can see", "Regular updates keep you close."], ["A home that lasts", "Practical details are considered early."]].map(([title, body], index) => <div className="border border-[#e4dfdb] p-6" key={title} data-testid={`experience-card-${index + 1}`}><Star size={18} className="text-[#a38068]" /><h3 className="mt-9 text-xl font-medium" data-testid={`experience-title-${index + 1}`}>{title}</h3><p className="mt-2 text-sm leading-6 text-[#777]" data-testid={`experience-body-${index + 1}`}>{body}</p></div>)}</div></div></section>

      <section className="border-t border-[#e5e1dd] bg-[#f3f1ef] px-4 py-20 sm:px-8 lg:px-12 lg:py-28" data-testid="faq-section"><div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.7fr_1.3fr] lg:gap-24"><div><SectionIntro eyebrow="Questions, answered" title="A clear process starts with a clear conversation." body="Still early in your thinking? That’s exactly what the first consultation is for." /><button type="button" onClick={scrollToFunnel} className="flex items-center gap-2 text-sm font-bold text-[#a38068] hover:gap-3" data-testid="faq-plan-button">Talk through my requirement <ArrowRight size={16} /></button></div><div className="border-t border-[#dcd6d0]" data-testid="faq-list">{faqItems.map(([question, answer], index) => <div className="border-b border-[#dcd6d0]" key={question} data-testid={`faq-item-${index + 1}`}><button type="button" onClick={() => setOpenFaq(openFaq === index ? null : index)} className="flex w-full items-center justify-between gap-5 py-5 text-left text-base font-semibold" data-testid={`faq-question-${index + 1}`}><span data-testid={`faq-question-text-${index + 1}`}>{question}</span><ChevronDown size={18} className={openFaq === index ? "rotate-180 text-[#a38068]" : "text-[#999]"} /></button>{openFaq === index && <p className="max-w-2xl pb-5 pr-8 text-sm leading-6 text-[#666]" data-testid={`faq-answer-${index + 1}`}>{answer}</p>}</div>)}</div></div></section>

      <section className="bg-[#a38068] px-4 py-20 text-white sm:px-8 lg:px-12 lg:py-28" data-testid="final-cta-section"><div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-10 lg:flex-row lg:items-end"><div><p className="mb-4 text-[11px] font-bold uppercase tracking-[0.22em] text-white/70" data-testid="final-cta-eyebrow">The first step is simple</p><h2 className="max-w-2xl text-5xl font-medium leading-[0.98] text-white sm:text-7xl" data-testid="final-cta-title">Your land is ready. Is your home?</h2><p className="mt-6 max-w-md text-base leading-7 text-white/75" data-testid="final-cta-body">Tell us about your plot and the home you’re planning.</p></div><div className="flex flex-col items-start gap-4 sm:flex-row"><button type="button" onClick={scrollToFunnel} className="flex h-12 items-center gap-2 bg-white px-5 text-sm font-bold text-[#1a1a1a] hover:-translate-y-0.5" data-testid="final-plan-button">Start Planning My Home <ArrowRight size={16} /></button><a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="flex h-12 items-center gap-2 border border-white/40 px-5 text-sm font-bold text-white hover:border-white" data-testid="final-whatsapp-link"><MessageCircle size={16} /> Talk to a home consultant</a></div></div></section>
    </main>

    <footer className="bg-[#1a1a1a] px-4 py-12 text-white sm:px-8 lg:px-12" data-testid="site-footer"><div className="mx-auto grid max-w-[1240px] gap-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_0.8fr_0.8fr]"><div><div className="flex items-center gap-3"><span className="grid size-9 place-items-center bg-[#a38068] text-white"><span className="font-heading text-xl">A</span></span><span className="text-sm font-bold tracking-[0.08em]" data-testid="footer-brand-name">AANGAN BUILDWORKS</span></div><p className="mt-5 max-w-xs text-sm leading-6 text-white/50" data-testid="footer-description">Your land. Your home. Professionally built. A future-ready design + build experience for Bihar.</p></div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d0ad92]" data-testid="footer-explore-label">Explore</p><div className="mt-5 grid gap-3 text-sm text-white/65"><a href="#services" className="hover:text-white" data-testid="footer-services-link">Services</a><a href="#homes" className="hover:text-white" data-testid="footer-homes-link">Home designs</a><a href="#process" className="hover:text-white" data-testid="footer-process-link">Our process</a><Link to="/contact" className="hover:text-white" data-testid="footer-contact-link">Contact</Link></div></div><div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#d0ad92]" data-testid="footer-connect-label">Connect</p><div className="mt-5 grid gap-3 text-sm text-white/65"><a href="tel:+919999999999" className="flex items-center gap-2 hover:text-white" data-testid="footer-phone-link"><Phone size={14} /> +91 99999 99999</a><a href="https://wa.me/919999999999" target="_blank" rel="noreferrer" className="flex items-center gap-2 hover:text-white" data-testid="footer-whatsapp-link"><MessageCircle size={14} /> WhatsApp</a><a href="#top" className="flex items-center gap-2 hover:text-white" data-testid="footer-back-top-link"><MoveUpRight size={14} /> Back to top</a></div></div></div><div className="mx-auto mt-12 flex max-w-[1240px] flex-col justify-between gap-3 border-t border-white/10 pt-5 text-[11px] text-white/35 sm:flex-row"><span data-testid="footer-copyright">© 2025 Aangan Buildworks. Placeholder identity for preview.</span><span className="flex items-center gap-2" data-testid="footer-instagram-note"><Instagram size={13} /> Social proof will be added as projects are documented.</span></div></footer>
    <div className="fixed inset-x-3 bottom-3 z-40 sm:hidden" data-testid="mobile-sticky-cta"><button type="button" onClick={scrollToFunnel} className="flex h-12 w-full items-center justify-center gap-2 bg-[#a38068] text-sm font-bold text-white shadow-[0_8px_30px_rgb(0,0,0,0.18)]" data-testid="mobile-sticky-plan-button">Plan My Home <ArrowRight size={16} /></button></div>
  </div>;
}
