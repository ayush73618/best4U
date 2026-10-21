import {
  Component,
  ElementRef,
  HostListener,
  inject,
  signal,
} from "@angular/core";
import { RouterLink } from "@angular/router";
import { AuthService } from "../../../core/auth/auth.service";
import { FADE_IN } from "../../../animations";

@Component({
  selector: "app-account-menu",
  standalone: true,
  imports: [RouterLink],
  templateUrl: "./account-menu.html",
  styleUrl: "./account-menu.scss",
  animations: [FADE_IN],
})
export class AccountMenu {
  protected readonly authService = inject(AuthService);
  private readonly elementRef = inject(ElementRef);

  protected readonly isOpen = signal(false);

  protected get isAdmin(): boolean {
    return this.authService.currentUser()?.roles.includes("ADMIN") ?? false;
  }

  protected toggle(): void {
    this.isOpen.update((v) => !v);
  }
  protected close(): void {
    this.isOpen.set(false);
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) this.close();
  }

  protected logout(): void {
    this.close();
    this.authService.logout();
  }
}
