import { BrandMark } from "@/components/site/TopNav";
import { CopyAction } from "@/components/site/CopyAction";
import { LocaleLink, useDict } from "@/i18n";
import type { PageKey } from "@/i18n/config";
import { Arrow, actionClass } from "@/components/site/Layout";

type Item = { label: string; page?: PageKey; href?: string };

export function Footer() {
  const t = useDict();

  const columns: { title: string; items: Item[] }[] = [
    {
      title: t.footer.infrastructure,
      items: [
        { label: t.stacks[0]!.title, page: "stack" },
        { label: t.stacks[1]!.title, page: "stack" },
        { label: t.stacks[2]!.title, page: "stack" },
      ],
    },
    {
      title: t.footer.law,
      items: [
        { label: t.nav.security.replace(/^\d+\s/, ""), page: "security" },
        { label: t.privacyPage.title, page: "privacy" },
        { label: t.legalPage.title, page: "legal" },
      ],
    },
    {
      title: t.footer.vectors,
      items: [
        { label: t.onboardingPage.title, page: "onboarding" },
        { label: t.contactPage.title, page: "contact" },
      ],
    },
  ];

  const linkClass =
    "group flex items-center justify-between gap-3 py-1 font-mono text-[10px] tracking-[0.16em] text-muted-ink uppercase transition-colors hover:text-ebony";

  return (
    <footer className="border-t border-gridline">
      <div className="mx-auto w-full max-w-6xl px-6 py-10 md:px-10 md:py-20">
        <div className="grid gap-9 md:grid-cols-[1.1fr_2fr] md:gap-16">
          <div>
            <BrandMark className="font-mono text-[12px] font-medium tracking-[0.16em] text-ebony" />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-ink">
              {t.footer.tagline}
            </p>
            <div className="mt-7">
              <CopyAction value="core@delplanche.cloud" label="core@delplanche.cloud" />
            </div>
            <LocaleLink page="contact" className={`${actionClass} mt-6`}>
              {t.footer.contactCta} <Arrow />
            </LocaleLink>
          </div>

          {/* Desktop kolommen */}
          <div className="hidden gap-10 sm:grid sm:grid-cols-3">
            {columns.map((col) => (
              <div key={col.title} className="flex flex-col gap-3">
                <span className="font-mono text-[10px] font-semibold tracking-[0.2em] text-ebony uppercase">
                  {col.title}
                </span>
                {col.items.map((item) => (
                  <LocaleLink key={item.label} page={item.page ?? "home"} className={linkClass}>
                    {item.label}
                  </LocaleLink>
                ))}
              </div>
            ))}
          </div>

          {/* Mobiel: accordeons */}
          <div className="divide-y divide-gridline border-y border-gridline sm:hidden">
            {columns.map((col) => (
              <details key={col.title} className="group py-4">
                <summary className="flex cursor-pointer list-none items-center justify-between font-mono text-[10px] font-semibold tracking-[0.2em] text-ebony uppercase">
                  {col.title}
                  <span className="text-muted-ink transition-transform group-open:rotate-45">+</span>
                </summary>
                <div className="mt-3 flex flex-col gap-2">
                  {col.items.map((item) => (
                    <LocaleLink key={item.label} page={item.page ?? "home"} className={linkClass}>
                      {item.label}
                    </LocaleLink>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>

        <div className="vault-frame mt-9 flex flex-col gap-4 rounded-md p-5 sm:flex-row sm:items-center sm:justify-between md:mt-12 md:p-6">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[9px] leading-[1.9] tracking-[0.18em] text-muted-ink uppercase">
              // © 2026 delplanche.cloud
            </span>
            <span className="font-mono text-[9px] leading-[1.9] tracking-[0.18em] text-muted-ink uppercase">
              {t.footer.hosting}
            </span>
            <span className="font-mono text-[9px] leading-[1.9] tracking-[0.18em] text-muted-ink uppercase">
              {t.footer.impressum}{" "}
              <LocaleLink page="legal" className="text-ebony underline-offset-2 hover:underline">
                {t.footer.impressumLink}
              </LocaleLink>
            </span>
          </div>
          <span className="datastamp font-mono text-[9px] tracking-[0.24em] text-muted-ink uppercase">
            J.Z.D.
          </span>
        </div>
      </div>
    </footer>
  );
}
