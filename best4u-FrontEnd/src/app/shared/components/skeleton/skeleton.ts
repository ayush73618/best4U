import { Component, Input } from "@angular/core";

@Component({
  selector: "app-skeleton",
  standalone: true,
  templateUrl: "./skeleton.html",
  styleUrl: "./skeleton.scss",
})
export class Skeleton {
  @Input() variant: "text" | "card" | "product-grid" | "list" = "text";
  @Input() count = 1;

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}
