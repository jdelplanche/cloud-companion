import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");

const css = read("src/styles.css");

/**
 * Visuele regressie-contracten voor "Alpine Vault / Editorial Biophilic".
 * Deze checks falen zodra kalksteen-canvas, papieren schaduw of stempel-respons wijzigt.
 */
describe("design tokens", () => {
  it("keeps the warm linen limestone canvas", () => {
    expect(css).toMatch(/--canvas:\s*oklch\(0\.951 0\.011 88\)/);
  });

  it("keeps the near-invisible sketch grid", () => {
    expect(css).toMatch(/--grid-ink:\s*rgba\(44, 62, 53, 0\.03\)/);
  });

  it("keeps deep moss and warm terracotta accents", () => {
    expect(css).toMatch(/--moss:\s*oklch\(0\.331 0\.032 160\)/);
    expect(css).toMatch(/--terracotta:\s*oklch\(0\.625 0\.109 41\)/);
  });

  it("keeps the soft heavy-paper shadow", () => {
    expect(css).toMatch(/--paper-shadow:[\s\S]*?18px 36px -18px rgba\(44, 62, 53, 0\.16\)/);
  });
});

describe("paper surfaces", () => {
  it("rounds dossier sheets to 6px", () => {
    const panel = css.slice(css.indexOf("@utility blueprint-panel"));
    expect(panel.slice(0, 200)).toMatch(/border-radius:\s*6px/);
    const vault = css.slice(css.indexOf("@utility vault-frame"));
    expect(vault.slice(0, 200)).toMatch(/border-radius:\s*6px/);
  });

  it("keeps the stamp-press tactile response", () => {
    const stamp = css.slice(css.indexOf("@utility stamp-press"));
    expect(stamp.slice(0, 300)).toMatch(/transform:\s*translateY\(1px\)/);
    expect(stamp.slice(0, 300)).toMatch(/box-shadow:\s*inset/);
  });

  it("provides fold-divider and datastamp utilities", () => {
    expect(css).toContain("@utility fold-divider");
    expect(css).toContain("@utility datastamp");
  });
});

describe("components", () => {
  const copy = read("src/components/site/CopyAction.tsx");
  const nav = read("src/components/site/TopNav.tsx");
  const footer = read("src/components/site/Footer.tsx");

  it("copy action swaps to a confirmation state", () => {
    expect(copy).toContain("[ ✓ GEKOPIEERD ]");
    expect(copy).toContain("[ COPY ]");
    expect(copy).toMatch(/setTimeout\([\s\S]*?2000\)/);
    expect(copy).toContain('data-copied');
  });

  it("mobile overlay is a modal dialog with escape handling", () => {
    expect(nav).toContain('role="dialog"');
    expect(nav).toContain('aria-modal="true"');
    expect(nav).toContain('e.key === "Escape"');
    expect(nav).toContain('e.key !== "Tab"');
    expect(nav).toContain("pointerdown");
  });

  it("footer keeps the colophon frame, copy vector and signature", () => {
    expect(footer).toContain("vault-frame");
    expect(footer).toContain("core@delplanche.cloud");
    expect(footer).toContain("J.Z.D.");
    expect(footer).toContain("sm:grid-cols-3");
  });
});
