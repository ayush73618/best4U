import { Injectable } from '@angular/core';
import { Brand, Umbrella, UmbrellaId } from '../models/brand.model';

// This is the ONE place a sub-brand is defined. layout/category-bar, features/home,
// and (later) platform/search all read from here — adding sub-brand #11
// means adding one entry below, not touching UI files.
@Injectable({ providedIn: 'root' })
export class BrandRegistryService {
  readonly umbrellas: readonly Umbrella[] = [
    { id: 'shopping', name: 'Shopping', tagline: 'Things you buy' },
    { id: 'utilities', name: 'Utilities', tagline: 'Things you get done' },
    { id: 'lifestyle', name: 'Lifestyle', tagline: 'Things you plan and experience' },
  ];

  readonly brands: readonly Brand[] = [
    // Shopping
    { id: 'bp4u', code: 'BP4U', shortLabel: 'Products', name: 'Best Product 4 U', umbrella: 'shopping', tagline: 'Shop for everyday products', route: '/shop', status: 'active' },
    { id: 'bf4u', code: 'BF4U', shortLabel: 'Food', name: 'Best Food 4 U', umbrella: 'shopping', tagline: 'Order food you love', route: '/shop/food', status: 'planned' },
    { id: 'bg4u', code: 'BG4U', shortLabel: 'Grocery', name: 'Best Grocery 4 U', umbrella: 'shopping', tagline: 'Groceries, delivered', route: '/shop/grocery', status: 'planned' },
    { id: 'bau4u', code: 'BAu4U', shortLabel: 'Gold', name: 'Best Au 4 U', umbrella: 'shopping', tagline: 'Gold, simplified', route: '/shop/gold', status: 'planned' },

    // Utilities
    { id: 'bt4u', code: 'BT4U', shortLabel: 'Tools', name: 'Best Tools 4 U', umbrella: 'utilities', tagline: 'Calculators & converters', route: '/tools', status: 'active' },
    { id: 'bm4u', code: 'BM4U', shortLabel: 'Money', name: 'Best Money 4 U', umbrella: 'utilities', tagline: 'EMI, SIP & budget tools', route: '/money', status: 'active' },
    { id: 'bw4u', code: 'BW4U', shortLabel: 'Work', name: 'Best Work 4 U', umbrella: 'utilities', tagline: 'To-dos, notes & habits', route: '/work', status: 'active' },
    { id: 'bd4u', code: 'BD4U', shortLabel: 'Docs', name: 'Best Docs 4 U', umbrella: 'utilities', tagline: 'PDF & image utilities', route: '/docs', status: 'active' },
    // brand-registry.service.ts — one-line change
{ id: 'bc4u', code: 'BC4U', shortLabel: 'Code', name: 'Best Code 4 U', umbrella: 'utilities', tagline: 'JSON, JWT & dev tools', route: '/code', status: 'active' },

    // Lifestyle
   { id: 'btr4u', code: 'BTr4U', shortLabel: 'Trips', name: 'Best Trip 4 U', umbrella: 'lifestyle', tagline: 'Plan your next trip', route: '/travel', status: 'active' },
  ];

  brandsByUmbrella(umbrellaId: string): Brand[] {
    return this.brands.filter((b) => b.umbrella === umbrellaId);
  }
}