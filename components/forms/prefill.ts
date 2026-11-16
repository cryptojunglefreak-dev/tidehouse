import type { EnquiryIntent } from "@/lib/enquiry/validation";

export interface PrefillDetail {
  intent?: EnquiryIntent;
  unit?: string;
  project?: string;
  message?: string;
}

export const PREFILL_EVENT = "enquiry:prefill";
export const ENQUIRY_ANCHOR = "zapytanie";

/** Fill the enquiry form on the page and scroll to it. */
export function prefillEnquiry(detail: PrefillDetail) {
  window.dispatchEvent(new CustomEvent<PrefillDetail>(PREFILL_EVENT, { detail }));
  const el = document.getElementById(ENQUIRY_ANCHOR);
  if (el) {
    el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    window.setTimeout(() => el.querySelector<HTMLInputElement>("input[name=name]")?.focus({ preventScroll: true }), 600);
  }
}
