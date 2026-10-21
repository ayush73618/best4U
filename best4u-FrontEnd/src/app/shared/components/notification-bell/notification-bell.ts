import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  inject,
  signal,
} from "@angular/core";
import { Router } from "@angular/router";
import { NotificationService } from "../../../core/services/notification.service";
import { FADE_IN } from "../../../animations";

@Component({
  selector: "app-notification-bell",
  standalone: true,
  templateUrl: "./notification-bell.html",
  styleUrl: "./notification-bell.scss",
  animations: [FADE_IN],
})
export class NotificationBell implements OnInit {
  protected readonly notifService = inject(NotificationService);
  private readonly router = inject(Router);
  private readonly el = inject(ElementRef);

  protected readonly isOpen = signal(false);

  ngOnInit(): void {
    this.notifService.loadUnreadCount();
  }

  protected toggle(): void {
    this.isOpen.update((v) => !v);
    if (this.isOpen()) {
      this.notifService.loadNotifications();
      this.notifService.markAllRead();
    }
  }

  protected navigate(link: string | null): void {
    this.isOpen.set(false);
    if (link) this.router.navigateByUrl(link);
  }

  @HostListener("document:click", ["$event"])
  onDocumentClick(event: MouseEvent): void {
    if (!this.el.nativeElement.contains(event.target)) this.isOpen.set(false);
  }
}
