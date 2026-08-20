import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { cloudAlternateLinks, slugs, toLocale } from "@/i18n/config";
import { getCloudDict, isCloudTarget } from "@/i18n/cloud";
import { AFFILIATE_LINKS, externalLinkProps } from "@/lib/affiliate";
import { Arrow, PageShellLite, SectionTitle, actionClass } from "@/components/site/Layout";

export const Route = createFileRoute("/$lang/cloud/$target")({
  beforeLoad: ({ params }) => {
    if (!isCloudTarget(params.target)) throw notFound();
  },
  head: ({ params }) => {
    const locale = toLocale(params.lang);
    if (!isCloudTarget(params.target)) {
      return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    }
    const entry = getCloudDict(locale).targets[params.target];
    return {
      meta: [
        { title: entry.metaTitle },
        { name: "description", content: entry.metaDescription },
        { property: "og:title", content: entry.metaTitle },
        { property: "og:description", content: entry.metaDescription },
      ],
      links: cloudAlternateLinks(locale, params.target),
    };
  },
  component: CloudTargetRoute,
});

function CloudTargetRoute() {
  const { lang, target } = Route.useParams();
  const locale = toLocale(lang);
  const dict = getCloudDict(locale);
  const l = dict.labels;

  if (!isCloudTarget(target)) {
    return (
      <PageShellLite index="CLOUD / 404" title={l.notFoundTitle} lead={l.notFoundLead}>
        <Link to="/$lang/$slug" params={{ lang, slug: slugs.stack[locale] }} className={actionClass}>
          {l.backToStack} <Arrow />
        </Link>
      </PageShellLite>
    );
  }

  const entry = dict.targets[target];

  return (
    <PageShellLite index={entry.index} title={entry.title} lead={entry.lead}>
      <section>
        <SectionTitle index={l.pricingIndex} title={l.pricingTitle} />
        <div className="mt-10 grid gap-px border border-gridline bg-gridline md:grid-cols-3">
          {entry.plans.map((plan) => (
            <div
              key={plan.name}
              className={`flex flex-col bg-card px-7 py-9 md:px-9 md:py-10 ${
                plan.featured ? "ring-1 ring-moss/40 ring-inset" : ""
              }`}
            >
              <h3 className="text-lg leading-tight text-ebony md:text-xl">{plan.name}</h3>
              <p className="mt-4 font-mono text-[20px] text-ebony md:text-[22px]">{plan.price}</p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-muted-ink uppercase md:tracking-[0.16em]">
                {plan.unit}
              </p>
              <ul className="mt-6 space-y-2.5">
                {plan.specs.map((spec) => (
                  <li key={spec} className="font-mono text-[11px] leading-relaxed text-muted-ink">
                    {spec}
                  </li>
                ))}
              </ul>
              <div className="grow" />
              <a
                href={AFFILIATE_LINKS[plan.link]}
                {...externalLinkProps}
                className={`${actionClass} mt-8 w-full`}
              >
                {l.viewAt} <Arrow />
              </a>
            </div>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-relaxed text-muted-ink">{l.disclaimer}</p>
      </section>

      <section>
        <SectionTitle index={l.teamIndex} title={l.teamTitle} lead={l.teamLead} />
        <dl className="mt-8 divide-y divide-gridline border-y border-gridline">
          {entry.team.map(([k, v]) => (
            <div key={k} className="flex flex-col gap-1.5 py-5 md:flex-row md:items-baseline md:gap-10">
              <dt className="w-64 shrink-0 font-mono text-[10px] tracking-[0.14em] text-muted-ink uppercase md:tracking-[0.16em]">
                {k}
              </dt>
              <dd className="text-sm leading-relaxed text-ebony">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
          <a
            href={AFFILIATE_LINKS[entry.signupLink]}
            {...externalLinkProps}
            className={`${actionClass} w-full sm:w-auto`}
          >
            {entry.signupLabel} <Arrow />
          </a>
          <Link
            to="/$lang/$slug"
            params={{ lang, slug: slugs.onboarding[locale] }}
            className={`${actionClass} w-full sm:w-auto`}
          >
            {l.turnkey} <Arrow />
          </Link>
        </div>
        <p className="mt-8">
          <Link
            to="/$lang/$slug"
            params={{ lang, slug: slugs.stack[locale] }}
            className="font-mono text-[10px] tracking-[0.14em] text-muted-ink uppercase transition-colors hover:text-ebony md:tracking-[0.16em]"
          >
            ← {l.backToStack}
          </Link>
        </p>
      </section>
    </PageShellLite>
  );
}
