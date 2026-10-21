import {
  animate,
  animateChild,
  group,
  query,
  style,
  transition,
  trigger,
} from "@angular/animations";

// Page transition — used in app.html's router-outlet
export const PAGE_TRANSITION = trigger("routeAnimations", [
  transition("* <=> *", [
    query(":enter, :leave", [style({ position: "absolute", width: "100%" })], {
      optional: true,
    }),
    group([
      query(
        ":leave",
        [
          animate(
            "180ms ease-in",
            style({ opacity: 0, transform: "translateY(8px)" }),
          ),
        ],
        { optional: true },
      ),
      query(
        ":enter",
        [
          style({ opacity: 0, transform: "translateY(-8px)" }),
          animate(
            "220ms 100ms ease-out",
            style({ opacity: 1, transform: "translateY(0)" }),
          ),
        ],
        { optional: true },
      ),
    ]),
  ]),
]);

// Fade-in — for modals, dropdowns, panels
export const FADE_IN = trigger("fadeIn", [
  transition(":enter", [
    style({ opacity: 0, transform: "translateY(-4px)" }),
    animate(
      "180ms ease-out",
      style({ opacity: 1, transform: "translateY(0)" }),
    ),
  ]),
  transition(":leave", [
    animate(
      "120ms ease-in",
      style({ opacity: 0, transform: "translateY(-4px)" }),
    ),
  ]),
]);

// Slide-up — for toasts, bottom sheets
export const SLIDE_UP = trigger("slideUp", [
  transition(":enter", [
    style({ opacity: 0, transform: "translateY(16px)" }),
    animate(
      "220ms ease-out",
      style({ opacity: 1, transform: "translateY(0)" }),
    ),
  ]),
  transition(":leave", [
    animate(
      "160ms ease-in",
      style({ opacity: 0, transform: "translateY(16px)" }),
    ),
  ]),
]);

// Scale-in — for cart badge, count badges
export const SCALE_IN = trigger("scaleIn", [
  transition(":enter", [
    style({ transform: "scale(0)", opacity: 0 }),
    animate(
      "200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
      style({ transform: "scale(1)", opacity: 1 }),
    ),
  ]),
  transition(":leave", [
    animate("120ms ease-in", style({ transform: "scale(0)", opacity: 0 })),
  ]),
]);
