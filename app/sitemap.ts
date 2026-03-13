import { MetadataRoute } from 'next'
import { BOROUGHS } from '@/lib/weather'
import { NEIGHBORHOODS } from '@/lib/neighborhoods'

export default function sitemap(): MetadataRoute.Sitemap {
  const base = 'https://nycweather.app'
  const now = new Date()
  return [
    { url: base, lastModified: now, changeFrequency: 'hourly', priority: 1 },
    ...BOROUGHS.map((b) => ({
      url: `${base}/${b.slug}`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.9,
    })),
    ...NEIGHBORHOODS.map((n) => ({
      url: `${base}/${n.boroughSlug}/${n.slug}`,
      lastModified: now,
      changeFrequency: 'hourly' as const,
      priority: 0.8,
    })),
  ]
}
