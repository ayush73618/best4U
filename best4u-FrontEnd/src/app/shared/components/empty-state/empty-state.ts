import { Component, Input } from "@angular/core";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-empty-state",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./empty-state.html",
  styleUrl: "./empty-state.scss",
})
export class EmptyState {
  @Input({ required: true }) icon!: string;
  @Input({ required: true }) title!: string;
  @Input({ required: true }) message!: string;
  @Input() actionLabel?: string;
  @Input() actionRoute?: string;
}
