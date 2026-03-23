import { MetadataRoute } from 'next'
import { CITIES } from '@/lib/cities'

const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december']
const POPULAR_SLUGS = ['nyc','london','tokyo','paris','dubai','sydney','los-angeles','chicago','miami','barcelona','rome','amsterdam','singapore','bangkok','istanbul']

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
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const monthlyPages: MetadataRoute.Sitemap = CITIES.flatMap((c) =>
    MONTHS.map((month) => ({
      url: `${base}/${c.slug}/weather/${month}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  const comparePairs: MetadataRoute.Sitemap = []
  for (let i = 0; i < POPULAR_SLUGS.length; i++) {
    for (let j = i + 1; j < POPULAR_SLUGS.length; j++) {
      comparePairs.push({
        url: `${base}/compare/${POPULAR_SLUGS[i]}/${POPULAR_SLUGS[j]}`,
        lastModified: now,
        changeFrequency: 'weekly' as const,
        priority: 0.65,
      })
    }
  }
  for (const city of CITIES) {
    if (!POPULAR_SLUGS.includes(city.slug)) {
      comparePairs.push({ url: `${base}/compare/nyc/${city.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })
      comparePairs.push({ url: `${base}/compare/london/${city.slug}`, lastModified: now, changeFrequency: 'monthly' as const, priority: 0.6 })
    }
  }

  return [
    { url: base, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${base}/weather-near-me`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${base}/cities`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/embed`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    ...cityPages,
    ...districtPages,
    ...guidePages,
    ...monthlyPages,
    ...comparePairs,
  ]
}
