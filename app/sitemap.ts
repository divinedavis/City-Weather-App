import { MetadataRoute } from 'next'
import { CITIES } from '@/lib/cities'

const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december']
const SEASONS = ['spring','summer','fall','winter']
const POPULAR_SLUGS = ['nyc','london','tokyo','paris','dubai','sydney','los-angeles','chicago','miami','barcelona','rome','amsterdam','singapore','bangkok','istanbul']
const AIRPORTS = ['jfk','lax','lhr','cdg','hnd','dxb','syd','ord','mia','sin']
const STATIC_DATE = new Date('2026-01-01')

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://cityweather.app'
  const now = new Date()

  const cityPages: MetadataRoute.Sitemap = CITIES.map((c) => ({
    url: `${base}/${c.slug}`,
    lastModified: now,
    changeFrequency: 'hourly' as const,
    priority: 0.9,
  }))

  const districtPages: MetadataRoute.Sitemap = CITIES.flatMap((c) =>
    c.districts.map((d) => ({
      url: `${base}/${c.slug}/${d.slug}`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    }))
  )

  const guidePages: MetadataRoute.Sitemap = CITIES.map((c) => ({
    url: `${base}/guides/${c.slug}`,
    lastModified: STATIC_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const monthlyPages: MetadataRoute.Sitemap = CITIES.flatMap((c) =>
    MONTHS.map((month) => ({
      url: `${base}/${c.slug}/weather/${month}`,
      lastModified: STATIC_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  const seasonPages: MetadataRoute.Sitemap = CITIES.flatMap((c) =>
    SEASONS.map((season) => ({
      url: `${base}/${c.slug}/weather/season/${season}`,
      lastModified: STATIC_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }))
  )

  const districtMonthlyPages: MetadataRoute.Sitemap = CITIES.flatMap((c) =>
    c.districts.flatMap((d) =>
      MONTHS.map((month) => ({
        url: `${base}/${c.slug}/${d.slug}/weather/${month}`,
        lastModified: STATIC_DATE,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    )
  )

  const compareHubPages: MetadataRoute.Sitemap = CITIES.map((c) => ({
    url: `${base}/${c.slug}/compare`,
    lastModified: STATIC_DATE,
    changeFrequency: 'monthly' as const,
    priority: 0.65,
  }))

  const airportPages: MetadataRoute.Sitemap = AIRPORTS.map((airport) => ({
    url: `${base}/weather/${airport}`,
    lastModified: now,
    changeFrequency: 'hourly' as const,
    priority: 0.7,
  }))

  const packingListPages: MetadataRoute.Sitemap = CITIES.flatMap((c) =>
    MONTHS.map((month) => ({
      url: `${base}/${c.slug}/packing-list/${month}`,
      lastModified: STATIC_DATE,
      changeFrequency: 'monthly' as const,
      priority: 0.65,
    }))
  )

  const comparePairs: MetadataRoute.Sitemap = []
  for (let i = 0; i < POPULAR_SLUGS.length; i++) {
    for (let j = i + 1; j < POPULAR_SLUGS.length; j++) {
      comparePairs.push({
        url: `${base}/compare/${POPULAR_SLUGS[i]}/${POPULAR_SLUGS[j]}`,
        lastModified: STATIC_DATE,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      })
    }
  }
  for (const city of CITIES) {
    if (!POPULAR_SLUGS.includes(city.slug)) {
      comparePairs.push({ url: `${base}/compare/nyc/${city.slug}`, lastModified: STATIC_DATE, changeFrequency: 'monthly' as const, priority: 0.6 })
      comparePairs.push({ url: `${base}/compare/london/${city.slug}`, lastModified: STATIC_DATE, changeFrequency: 'monthly' as const, priority: 0.6 })
    }
  }

  return [
    { url: base, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${base}/weather-near-me`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${base}/cities`, lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/guides`, lastModified: STATIC_DATE, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/embed`, lastModified: STATIC_DATE, changeFrequency: 'monthly', priority: 0.6 },
    ...cityPages,
    ...districtPages,
    ...guidePages,
    ...monthlyPages,
    ...seasonPages,
    ...districtMonthlyPages,
    ...compareHubPages,
    ...airportPages,
    ...packingListPages,
    ...comparePairs,
  ]
}
