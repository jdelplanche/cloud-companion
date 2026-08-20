import { createFileRoute, notFound } from "@tanstack/react-router";
import { LocaleLink, useDict } from "@/i18n";
import { ArrowUpRight, Check } from "lucide-react";
import { PageShell, Panel, SectionHeader } from "@/components/site/Primitives";

type Plan = {
  name: string;
  price: string;
  unit: string;
  specs: string[];
  href: string;
  featured?: boolean;
};

type Target = {
  key: string;
  title: string;
  lead: string;
  index: string;
  signup: { href: string; label: string };
  plans: Plan[];
  team: [string, string][];
};

const TARGETS: Record<string, Target> = {
  hosting: {
    key: "hosting",
    title: "Managed Webhosting & Mail — Infomaniak",
    index: "GO / 01",
    lead: "Zwitserse shared hosting met NVMe-storage, gratis SSL en inbegrepen mailboxen. Onderstaande tarieven zijn de publieke Infomaniak-lijstprijzen (indicatief, excl. btw, jaarfacturatie).",
    signup: {
      href: "https://www.infomaniak.com/en/hosting/web-hosting",
      label: "Aanmelden bij Infomaniak Webhosting",
    },
    plans: [
      {
        name: "Web Hosting — Starter",
        price: "vanaf CHF 6.–",
        unit: "/ maand",
        specs: [
          "1 website, 20 GB NVMe",
          "Gratis SSL (Let's Encrypt)",
          "Onbeperkt dataverkeer",
          "Dagelijkse back-ups (30 dagen)",
        ],
        href: "https://www.infomaniak.com/en/hosting/web-hosting",
      },
      {
        name: "Web Hosting — Standard",
        price: "vanaf CHF 12.–",
        unit: "/ maand",
        specs: [
          "Onbeperkt aantal websites",
          "250 GB NVMe storage",
          "PHP-workers & Node.js support",
          "Gratis domein bij jaarplan",
        ],
        href: "https://www.infomaniak.com/en/hosting/web-hosting",
        featured: true,
      },
      {
        name: "kMail Service",
        price: "vanaf CHF 1.65",
        unit: "/ mailbox / maand",
        specs: [
          "Zwitserse mailinfrastructuur",
          "Geen scanning, geen advertenties",
          "IMAP/SMTP + webmail",
          "Antispam & antivirus inbegrepen",
        ],
        href: "https://www.infomaniak.com/en/hosting/service-mail",
      },
    ],
    team: [
      ["Aanmeldingsteam", "Delplanche Infrastructure Desk"],
      ["Rol", "Technisch beheerder op jouw Infomaniak-account"],
      ["Doorlooptijd", "< 24 uur na toegangsverlening"],
      ["Inbegrepen", "DNS, SSL, mailrouting, webserverconfiguratie"],
    ],
  },
  vps: {
    key: "vps",
    title: "Cloud VPS & Bare-Metal — Infomaniak",
    index: "GO / 02",
    lead: "Dedicated compute in Genève met volledige root-toegang. Publieke Infomaniak-lijstprijzen, indicatief en excl. btw.",
    signup: {
      href: "https://www.infomaniak.com/en/hosting/vps-cloud",
      label: "Configureer je Cloud VPS",
    },
    plans: [
      {
        name: "Cloud VPS — 2 vCPU",
        price: "vanaf CHF 8.–",
        unit: "/ maand",
        specs: ["2 vCPU / 4 GB RAM", "80 GB NVMe", "Root-toegang, eigen distro", "Snapshots & back-ups"],
        href: "https://www.infomaniak.com/en/hosting/vps-cloud",
      },
      {
        name: "Cloud VPS — 4 vCPU",
        price: "vanaf CHF 20.–",
        unit: "/ maand",
        specs: [
          "4 vCPU / 8 GB RAM",
          "160 GB NVMe",
          "Docker / Kubernetes-ready",
          "DDoS-mitigatie inbegrepen",
        ],
        href: "https://www.infomaniak.com/en/hosting/vps-cloud",
        featured: true,
      },
      {
        name: "Public Cloud / Bare-Metal",
        price: "pay-per-use",
        unit: "vanaf CHF 0.0092 / vCPU / u",
        specs: [
          "OpenStack-compatibel",
          "Dedicated bare-metal opties",
          "Schaalbaar per uur",
          "100% hernieuwbare energie",
        ],
        href: "https://www.infomaniak.com/en/hosting/public-cloud",
      },
    ],
    team: [
      ["Aanmeldingsteam", "Delplanche Systems Engineering"],
      ["Rol", "Provisioning, hardening & monitoring"],
      ["Doorlooptijd", "< 48 uur voor een productieklare node"],
      ["Inbegrepen", "Firewall, fail2ban, reverse proxy, TLS 1.3"],
    ],
  },
  ksuite: {
    key: "ksuite",
    title: "kSuite & Privacy Storage — Infomaniak",
    index: "GO / 03",
    lead: "Het soevereine alternatief voor Microsoft 365 en Google Workspace. Publieke Infomaniak-lijstprijzen, indicatief en excl. btw.",
    signup: {
      href: "https://www.infomaniak.com/en/ksuite",
      label: "Start met kSuite",
    },
    plans: [
      {
        name: "kSuite Standard",
        price: "vanaf CHF 2.60",
        unit: "/ gebruiker / maand",
        specs: ["kMail + kDrive + kMeet", "1 TB gedeelde opslag", "Eigen domeinnaam", "Zwitserse jurisdictie"],
        href: "https://www.infomaniak.com/en/ksuite",
        featured: true,
      },
      {
        name: "kDrive Solo / Team",
        price: "vanaf CHF 4.60",
        unit: "/ maand",
        specs: ["2 TB versleutelde opslag", "Desktop- & mobiele sync", "Versiebeheer", "Geen datamining"],
        href: "https://www.infomaniak.com/en/hosting/kdrive",
      },
      {
        name: "Web Analytics (cookieloos)",
        price: "inbegrepen",
        unit: "bij hosting",
        specs: [
          "Geen cookiebanner nodig",
          "Geen tracking van individuen",
          "GDPR/FADP-conform",
          "Realtime rapportage",
        ],
        href: "https://www.infomaniak.com/en/hosting/web-analytics",
      },
    ],
    team: [
      ["Aanmeldingsteam", "Delplanche Workspace Migration"],
      ["Rol", "Migratie van mailboxen, agenda's en bestanden"],
      ["Doorlooptijd", "1 – 3 werkdagen afhankelijk van volume"],
      ["Inbegrepen", "DNS/MX-switch, gebruikerstraining, back-upplan"],
    ],
  },
  storage: {
    key: "storage",
    title: "kDrive & Swiss Cloud Storage — Infomaniak",
    index: "GO / 04",
    lead: "Versleutelde Zwitserse opslag en back-up. Publieke Infomaniak-lijstprijzen, indicatief en excl. btw.",
    signup: {
      href: "https://www.infomaniak.com/en/hosting/kdrive",
      label: "Start met kDrive Storage",
    },
    plans: [
      {
        name: "kDrive Solo",
        price: "vanaf CHF 4.60",
        unit: "/ maand",
        specs: ["2 TB versleutelde opslag", "1 gebruiker", "Desktop- & mobiele sync", "Versiebeheer 30 dagen"],
        href: "https://www.infomaniak.com/en/hosting/kdrive",
      },
      {
        name: "kDrive Team",
        price: "vanaf CHF 9.–",
        unit: "/ maand (3 gebruikers)",
        specs: ["3 TB gedeelde opslag", "Gedeelde mappen & rechten", "Realtime samenwerking", "Zwitserse jurisdictie"],
        href: "https://www.infomaniak.com/en/hosting/kdrive",
        featured: true,
      },
      {
        name: "Swiss Backup",
        price: "vanaf CHF 1.–",
        unit: "/ 100 GB / maand",
        specs: ["Server-, NAS- & device-back-up", "Acronis-compatibel", "Onbeperkt aantal toestellen", "Data in Genève"],
        href: "https://www.infomaniak.com/en/hosting/swiss-backup",
      },
    ],
    team: [
      ["Aanmeldingsteam", "Delplanche Data Stewardship"],
      ["Rol", "Migratie, retentiebeleid & back-upvalidatie"],
      ["Doorlooptijd", "1 – 2 werkdagen"],
      ["Inbegrepen", "Sync-configuratie, rechtenmatrix, herstel-test"],
    ],
  },
};

export const Route = createFileRoute("/go/$target")({
  loader: ({ params }) => {
    const entry = TARGETS[params.target];
    if (!entry) throw notFound();
    return { entry };
  },
  head: ({ loaderData }) => {
    const t = loaderData?.entry;
    const title = t ? `${t.title} — delplanche.cloud` : "Stack niet gevonden — delplanche.cloud";
    const description = t
      ? `Actuele Infomaniak-tarieven en het Delplanche aanmeldingsteam voor ${t.title}.`
      : "Deze stack bestaat niet.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        ...(t ? [] : [{ name: "robots", content: "noindex" }]),
      ],
    };
  },
  notFoundComponent: GoNotFound,
  component: GoPage,
});

function GoPage() {
  const { entry } = Route.useLoaderData();

  return (
    <PageShell index={entry.index} title={entry.title} lead={entry.lead}>
      <section>
        <SectionHeader index="A / Pricing" title="Actuele Infomaniak-tarieven" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {entry.plans.map((plan) => (
            <div
              key={plan.name}
              className={`blueprint-panel flex flex-col p-7 ${
                plan.featured ? "border-moss" : ""
              }`}
            >
              <span className="label-mono">{plan.name}</span>
              <p className="mt-5 font-mono text-[18px] text-ebony">{plan.price}</p>
              <p className="mt-1 font-mono text-[10px] tracking-[0.16em] text-muted-ink uppercase">
                {plan.unit}
              </p>
              <ul className="mt-7 space-y-2.5 border-t border-gridline pt-6">
                {plan.specs.map((s) => (
                  <li key={s} className="flex gap-2 text-sm leading-relaxed text-muted-ink">
                    <Check size={13} className="mt-1 shrink-0 text-moss" strokeWidth={1.4} />
                    {s}
                  </li>
                ))}
              </ul>
              <div className="grow" />
              <a
                href={plan.href}
                rel="noreferrer nofollow sponsored"
                target="_blank"
                className="mt-8 inline-flex items-center justify-center gap-2 border border-moss px-5 py-3 font-mono text-[10px] tracking-[0.18em] text-moss uppercase transition-colors hover:bg-moss/[0.06]"
              >
                Bekijk bij Infomaniak <ArrowUpRight size={12} />
              </a>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-muted-ink">
          Tarieven zijn indicatieve publieke lijstprijzen van Infomaniak (CHF, excl. btw) en kunnen
          wijzigen. De actuele prijs staat altijd op infomaniak.com. Delplanche kan een commissie
          ontvangen via deze geautoriseerde links — dit kost jou niets extra.
        </p>
      </section>

      <section>
        <SectionHeader
          index="B / Onboarding Team"
          title="Aanmeldingsteam & begeleiding"
          lead="Je meldt aan bij Infomaniak; Delplanche voert de technische inrichting uit."
        />
        <Panel className="mt-10">
          <dl className="divide-y divide-gridline border-y border-gridline">
            {entry.team.map(([k, v]) => (
              <div key={k} className="flex flex-wrap justify-between gap-4 py-4">
                <dt className="label-mono">{k}</dt>
                <dd className="font-mono text-[11px] text-ebony">{v}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <a
              href={entry.signup.href}
              rel="noreferrer nofollow sponsored"
              target="_blank"
              className="inline-flex items-center gap-2 border border-moss bg-moss px-5 py-3 font-mono text-[10px] tracking-[0.18em] text-canvas uppercase hover:bg-moss-hover"
            >
              {entry.signup.label} <ArrowUpRight size={12} />
            </a>
            <LocaleLink
              page="onboarding"
              className="inline-flex items-center gap-2 border border-gridline bg-card px-5 py-3 font-mono text-[10px] tracking-[0.18em] text-ebony uppercase hover:border-moss hover:text-moss"
            >
              Turn-key setup
            </LocaleLink>
          </div>
        </Panel>
      </section>
    </PageShell>
  );
}

function GoNotFound() {
  return (
    <PageShell
      index="GO / —"
      title="Onbekende routingsleutel"
      lead="Deze stack bestaat niet. Bekijk de drie gecureerde pijlers op de stackpagina."
    >
      <Panel>
        <LocaleLink
          page="stack"
          className="inline-flex items-center gap-2 border border-gridline bg-card px-5 py-3 font-mono text-[10px] tracking-[0.18em] text-ebony uppercase hover:border-moss hover:text-moss"
        >
          {useDict().stackPage.title}
        </LocaleLink>
      </Panel>
    </PageShell>
  );
}
