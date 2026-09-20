import type { LeadCreate } from "./types";

export function scoreLead(payload: LeadCreate): { score: number; tags: string[] } {
  let score = 42;
  const tags: string[] = [];
  if (payload.land_ownership === "yes") {
    score += 18;
    tags.push("Owns land");
  } else if (payload.land_ownership === "buying") {
    score += 8;
    tags.push("Buying land");
  } else {
    tags.push("Planning");
  }
  if (payload.timeline === "0-3") {
    score += 22;
    tags.push("Near-term");
  } else if (payload.timeline === "3-6") {
    score += 14;
    tags.push("This year");
  }
  if (payload.interiors_required) {
    score += 8;
    tags.push("Interiors");
  }
  if (payload.next_step === "consultation" || payload.next_step === "site-visit") {
    score += 12;
    tags.push("Ready to talk");
  }
  return { score: Math.min(score, 99), tags };
}
