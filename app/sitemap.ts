import { MetadataRoute } from 'next'
import { CITIES } from '@/lib/cities'

const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december']
const POPULAR_SLUGS = ['nyc','london','tokyo','paris','dubai','sydney','los-angeles','chicago','miami','barcelona','rome','amsterdam','singapore','bangkok','istanbul']
const SEASONS = ['summer-weather','winter-weather','spring-weather','fall-weather']

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://cityweather.app'
  const now = new Date()

  // Root / utility pages
  const rootPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${base}/weather-near-me`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    { url: `${base}/cities`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/guides`, lastModified: now, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${base}/about`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${base}/embed`, lastModified: now, changeFrequency: 'monthly', priority: 0.6 },
  ]

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

  const bestTimePages: MetadataRoute.Sitemap = CITIES.map((c) => ({
    url: `${base}/${c.slug}/best-time-to-visit`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75,
  }))

  const seasonalPages: MetadataRoute.Sitemap = CITIES.flatMap((c) =>
    SEASONS.map((season) => ({
      url: `${base}/${c.slug}/${season}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.75,
    }))
  )

  const monthlyPages: MetadataRoute.Sitemap = CITIES.flatMap((c) =>
    MONTHS.map((month) => ({
      url: `${base}/${c.slug}/weather/${month}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))
  )

  const districtMonthlyPages: MetadataRoute.Sitemap = CITIES.flatMap((c) =>
    c.districts.flatMap((d) =>
      MONTHS.map((month) => ({
        url: `${base}/${c.slug}/${d.slug}/weather/${month}`,
        lastModified: now,
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      }))
    )
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

  // Intra-city district comparison pages for top 10 most-district cities
  const intraCityCompare: MetadataRoute.Sitemap = []
  const topCitiesByDistricts = [...CITIES].sort((a, b) => b.districts.length - a.districts.length).slice(0, 10)
  for (const city of topCitiesByDistricts) {
    const top = city.districts.slice(0, 10)
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        intraCityCompare.push({
          url: `${base}/${city.slug}/compare/${top[i].slug}/${top[j].slug}`,
          lastModified: now,
          changeFrequency: 'weekly' as const,
          priority: 0.65,
        })
      }
    }
  }

  return [
    ...rootPages,
    ...cityPages,
    ...districtPages,
    ...guidePages,
    ...bestTimePages,
    ...seasonalPages,
    ...monthlyPages,
    ...districtMonthlyPages,
    ...comparePairs,
    ...intraCityCompare,
  ]
}
