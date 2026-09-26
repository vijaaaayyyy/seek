/**
 * Single source of truth for the app version shown to visitors.
 *
 * Keep this in sync with the `version` field in `package.json` — they are set
 * together on every release. Semantic versioning: MAJOR.MINOR.PATCH, where
 * MAJOR bumps for a redesign or an incompatible change, MINOR for new
 * features, and PATCH for fixes and copy changes.
 */
export const APP_VERSION = "14.5.6";

/** Display form, e.g. `v14.5.6`. */
export const APP_VERSION_LABEL = `v${APP_VERSION}`;
