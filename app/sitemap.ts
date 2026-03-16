import { MetadataRoute } from 'next'
import { CITIES } from '@/lib/cities'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://cityweather.app'
  const now = new Date()
  return [
    { url: base, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    { url: `${base}/weather-near-me`, lastModified: now, changeFrequency: 'hourly', priority: 0.95 },
    ...CITIES.map((c) => ({
      url: `${base}/${c.slug}`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    })),
    ...CITIES.flatMap((c) =>
      c.districts.map((d) => ({
        url: `${base}/${c.slug}/${d.slug}`,
        lastModified: now,
        changeFrequency: 'hourly' as const,
        priority: 0.8,
      }))
    ),
  ]
}
