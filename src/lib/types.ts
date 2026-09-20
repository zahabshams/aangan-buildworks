export type LandOwnership = "yes" | "buying" | "planning";
export type Timeline = "0-3" | "3-6" | "6-12" | "12+";
export type NextStep = "consultation" | "site-visit" | "discussion" | "exploring";
export type LeadStage =
  | "New Lead"
  | "Qualified"
  | "High Intent"
  | "Site Visit Required"
  | "Design Discussion"
  | "Estimate Required"
  | "Proposal Sent"
  | "Follow-up"
  | "Converted"
  | "Not Ready";

export interface LeadCreate {
  name: string;
  phone: string;
  city: string;
  land_ownership: LandOwnership;
  plot_size: string;
  timeline: Timeline;
  plot_location: string;
  road_width: string;
  plot_dimensions: string;
  corner_plot: boolean;
  bhk: string;
  floors: string;
  built_up_area: string;
  style: string;
  parking: string;
  interiors_required: boolean;
  next_step: NextStep;
  source: string;
  utm_campaign: string | null;
  landing_page: string;
}

export interface Lead extends LeadCreate {
  id: string;
  lead_status: LeadStage;
  lead_score: number;
  tags: string[];
  created_at: string;
}

export interface LeadStageUpdate {
  lead_status: LeadStage;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  ok: boolean;
}
