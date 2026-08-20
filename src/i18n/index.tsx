import { Link, useRouterState } from "@tanstack/react-router";
import { cn } from "@/lib/utils";
import {
  type Locale,
  type PageKey,
  defaultLocale,
  localeLabels,
  locales,
  pageFromSlug,
  slugs,
  toLocale,
} from "./config";
import { dictionaries, type Dict } from "./dict";

export * from "./config";
export type { Dict };

/** Actieve taal, afgeleid uit het eerste pad-segment. */
export function useLocale(): Locale {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return toLocale(pathname.split("/")[1]);
}

/** Actieve pagina-sleutel, afgeleid uit het tweede pad-segment. */
export function useCurrentPage(): PageKey {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [, lang, slug] = pathname.split("/");
  const locale = toLocale(lang);
  if (!slug) return "home";
  return pageFromSlug(locale, slug) ?? "home";
}

export function useDict(): Dict {
  return dictionaries[useLocale()];
}

export function getDict(locale: Locale): Dict {
  return dictionaries[locale] ?? dictionaries[defaultLocale];
}

type LocaleLinkProps = {
  page: PageKey;
  locale?: Locale | undefined;
  children: React.ReactNode;
  className?: string | undefined;
  activeProps?: { className?: string } | undefined;
  onClick?: (() => void) | undefined;
};

/** Interne link die altijd de juiste taal-slug genereert. */
export function LocaleLink({
  page,
  locale,
  children,
  className,
  activeProps,
  onClick,
}: LocaleLinkProps) {
  const active = useLocale();
  const lang = locale ?? active;
  const slug = slugs[page][lang];
  const extra = {
    ...(className !== undefined ? { className } : {}),
    ...(activeProps !== undefined ? { activeProps } : {}),
    ...(onClick !== undefined ? { onClick } : {}),
  };

  if (!slug) {
    return (
      <Link to="/$lang" params={{ lang }} activeOptions={{ exact: true }} {...extra}>
        {children}
      </Link>
    );
  }

  return (
    <Link to="/$lang/$slug" params={{ lang, slug }} {...extra}>
      {children}
    </Link>
  );
}


/** Minimalistische taalkiezer — behoudt de pagina-context. */
export function LanguageSwitcher({
  className,
  onNavigate,
}: {
  className?: string;
  onNavigate?: () => void;
}) {
  const active = useLocale();
  const page = useCurrentPage();

  return (
    <div className={cn("flex items-center gap-1", className)} aria-label="Language">
      {locales.map((l, i) => (
        <span key={l} className="flex items-center">
          {i > 0 && <span className="px-1 text-[10px] text-muted-ink/50">|</span>}
          <LocaleLink
            page={page}
            locale={l}
            onClick={onNavigate}
            className={cn(
              "font-mono text-[10px] tracking-[0.18em] uppercase transition-colors",
              l === active ? "text-ebony" : "text-muted-ink hover:text-ebony",
            )}
          >
            {localeLabels[l]}
          </LocaleLink>
        </span>
      ))}
    </div>
  );
}
