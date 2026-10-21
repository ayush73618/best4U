import { Component, computed, signal } from '@angular/core';
import { CopyButton } from '../../../shared/components/copy-button/copy-button';

@Component({
  selector: 'app-color-converter',
  standalone: true,
  imports: [CopyButton],
  templateUrl: './color-converter.html',
  styleUrl: './color-converter.scss',
})
export class ColorConverter {
  protected readonly hexInput = signal('#3b82f6');
  protected readonly rgb = computed(() => this.hexToRgb(this.hexInput()));
  protected readonly isValid = computed(() => this.rgb() !== null);

  protected readonly rgbText = computed(() => {
    const c = this.rgb();
    return c ? `rgb(${c.r}, ${c.g}, ${c.b})` : '';
  });

  protected readonly hslText = computed(() => {
    const c = this.rgb();
    if (!c) return '';
    const { h, s, l } = this.rgbToHsl(c.r, c.g, c.b);
    return `hsl(${h}, ${s}%, ${l}%)`;
  });

  protected onHexInput(value: string): void { this.hexInput.set(value); }
  protected onColorPicked(value: string): void { this.hexInput.set(value); }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const clean = hex.trim().replace('#', '');
    const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean;
    if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
    return { r: parseInt(full.slice(0, 2), 16), g: parseInt(full.slice(2, 4), 16), b: parseInt(full.slice(4, 6), 16) };
  }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    const rN = r / 255, gN = g / 255, bN = b / 255;
    const max = Math.max(rN, gN, bN), min = Math.min(rN, gN, bN);
    let h = 0, s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case rN: h = (gN - bN) / d + (gN < bN ? 6 : 0); break;
        case gN: h = (bN - rN) / d + 2; break;
        default: h = (rN - gN) / d + 4;
      }
      h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
}