/**
 * Single source of truth for animation timing. Every component that
 * animates should import from here instead of re-declaring its own easing
 * curve or duration — six components had their own identical copy of the
 * same easing array before this file existed, which is exactly the kind of
 * drift a single source of truth prevents.
 *
 * EASE_ENTER's value is mirrored in app/globals.css as --ease-signature —
 * that CSS variable drives plain Tailwind transition-* utilities and the
 * page-transition keyframes, which can't reach into a TS module. If you
 * change one, change the other.
 */
export const DURATION = {
  /** Hover states, small UI feedback. */
  micro: 0.15,
  /** A single element entering, a panel swap. */
  element: 0.3,
  /** A whole section revealing on scroll. */
  section: 0.6,
} as const;

/** Entrances: fast start, long decelerating tail. Mirrors --ease-signature. */
export const EASE_ENTER = [0.16, 1, 0.3, 1] as const;

/** Exits: accelerates away, snappier than the entrance curve. */
export const EASE_EXIT = [0.4, 0, 1, 1] as const;

/** Standard entrance offset — 16-24px rise, never scale-from-zero. */
export const RISE_PX = 16;
