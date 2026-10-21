export type UmbrellaId = string;

export interface Umbrella {
  id: UmbrellaId;
  name: string;
  tagline: string;
}

// 'planned' means the sub-brand is on the roadmap but has no real feature
// behind it yet — the UI must be honest about this (Section 24: never let
// the interface claim something works when it doesn't).
export type BrandStatus = 'active' | 'planned';

export interface Brand {
  id: string; // e.g. 'bf4u' — stable identifier, used as a lookup key
  code: string; // e.g. 'BF4U' — internal short code. NOT for primary display —
  // meaningless to a first-time user. Use `shortLabel`/`name` for anything user-facing.
  shortLabel: string; // e.g. 'Food' — plain word for tight nav spaces
  name: string; // e.g. 'Best Food 4 U' — full display name
  umbrella: UmbrellaId;
  tagline: string;
  route: string; // reserved future route, e.g. '/shop/food' — not wired to a real route yet
  status: BrandStatus;
}