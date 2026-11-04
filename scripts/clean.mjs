// Localized files are generated after Astro; remove the previous output first so
// incremental output reuse cannot restore a mixture of old and localized pages.
import { rm } from 'node:fs/promises';
await rm(new URL('../dist/', import.meta.url), { recursive: true, force: true });
