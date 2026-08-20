/** Geautoriseerde Infomaniak-partnerlinks (utm_term = partner-ID). */
export const AFFILIATE_LINKS = {
  home: "https://www.infomaniak.com/goto/en/home?utm_term=6a860a2ed3933",
  hosting: "https://www.infomaniak.com/goto/en/hosting.web?utm_term=6a860a2ed3933",
  mail: "https://www.infomaniak.com/goto/en/hosting.mail?utm_term=6a860a2ed3933",
  managedcloud: "https://www.infomaniak.com/goto/en/hosting.managed-cloud?utm_term=6a860a2ed3933",
  synology: "https://www.infomaniak.com/goto/en/hosting.synology?utm_term=6a860a2ed3933",
  wordpress: "https://www.infomaniak.com/goto/en/my-easy-site?utm_term=6a860a2ed3933",
  kdrive: "https://www.infomaniak.com/en/kdrive/?utm_term=6a860a2ed3933",
  swissbackup: "https://www.infomaniak.com/en/swiss-backup/?utm_term=6a860a2ed3933",
  jelastic:
    "https://www.infomaniak.com/en/hosting/dedicated-and-cloud-servers/jelastic-cloud?utm_term=6a860a2ed3933",
  publiccloud: "https://www.infomaniak.com/en/hosting/public-cloud?utm_term=6a860a2ed3933",
  ksuite: "https://www.infomaniak.com/en/ksuite?utm_term=6a860a2ed3933",
  ai: "https://www.infomaniak.com/en/hosting/llm-api?utm_term=6a860a2ed3933",
  vps: "https://www.infomaniak.com/en/hosting/vps-cloud?utm_term=6a860a2ed3933",
  vpslite: "https://www.infomaniak.com/en/hosting/vps-lite?utm_term=6a860a2ed3933",
  sitecreator: "https://www.infomaniak.com/en/create-a-website/site-creator?utm_term=6a860a2ed3933",
  myksuite: "https://www.infomaniak.com/en/ksuite/myksuite?utm_term=6a860a2ed3933",
} as const;

export type AffiliateKey = keyof typeof AFFILIATE_LINKS;

export function isAffiliateKey(value: string): value is AffiliateKey {
  return Object.prototype.hasOwnProperty.call(AFFILIATE_LINKS, value);
}

/** Externe link-attributen — altijd nieuw tabblad, altijd afgeschermd. */
export const externalLinkProps = {
  target: "_blank",
  rel: "noopener noreferrer nofollow sponsored",
} as const;
