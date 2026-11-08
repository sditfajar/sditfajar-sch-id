import { absoluteUrl, siteConfig, siteUrl } from "./seo";

export function schoolJsonLd() {
  const a = siteConfig.address;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: absoluteUrl("/"),
        name: siteConfig.name,
        inLanguage: siteConfig.language,
        publisher: { "@id": `${siteUrl}/#school` },
      },
      {
        "@type": "ElementarySchool",
        "@id": `${siteUrl}/#school`,
        name: siteConfig.name,
        legalName: siteConfig.legalName,
        alternateName: [siteConfig.shortName],
        description: siteConfig.description,
        slogan: siteConfig.motto,
        url: absoluteUrl("/"),
        logo: absoluteUrl(siteConfig.logoPath),
        image: absoluteUrl(siteConfig.logoPath),
        email: siteConfig.email,
        telephone: siteConfig.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: a.street,
          addressLocality: a.city,
          addressRegion: a.region,
          postalCode: a.postalCode,
          addressCountry: a.country,
        },
        sameAs: [siteConfig.instagram],
        // TODO setelah data koordinat dan jam operasional sekolah dipastikan:
        // geo: { '@type': 'GeoCoordinates', latitude: ..., longitude: ... },
        // openingHoursSpecification: [...],
      },
    ],
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

