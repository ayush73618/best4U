import { Component, inject } from "@angular/core";
import { ToastService } from "../../../core/services/toast.service";
import { SLIDE_UP } from "../../../animations";

@Component({
  selector: "app-toast",
  standalone: true,
  templateUrl: "./toast.html",
  styleUrl: "./toast.scss",
  animations: [SLIDE_UP],
})
export class Toast {
  protected readonly toastService = inject(ToastService);
}
