import { NextResponse } from 'next/server'
import { CITIES, getCity } from '@/lib/cities'

export const dynamic = 'force-static'
export const revalidate = 3600

export async function generateStaticParams() {
  return CITIES.map((c) => ({ city: c.slug }))
}

const MONTHS = ['january','february','march','april','may','june','july','august','september','october','november','december']
const SEASONS = ['summer-weather','winter-weather','spring-weather','fall-weather']

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(_req: Request, context: any) {
  const { city: slug } = await context.params
  const city = getCity(slug as string)
  if (!city) return new NextResponse('Not found', { status: 404 })

  const base = 'https://cityweather.app'
  const now = new Date().toISOString()

  const urls: string[] = [
    `<url><loc>${base}/${city.slug}</loc><lastmod>${now}</lastmod><changefreq>hourly</changefreq><priority>0.9</priority></url>`,
    `<url><loc>${base}/guides/${city.slug}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>`,
    `<url><loc>${base}/${city.slug}/best-time-to-visit</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>`,
  ]

  for (const d of city.districts) {
    urls.push(`<url><loc>${base}/${city.slug}/${d.slug}</loc><lastmod>${now}</lastmod><changefreq>hourly</changefreq><priority>0.8</priority></url>`)
    for (const month of MONTHS) {
      urls.push(`<url><loc>${base}/${city.slug}/${d.slug}/weather/${month}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`)
    }
  }

  for (const month of MONTHS) {
    urls.push(`<url><loc>${base}/${city.slug}/weather/${month}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>`)
  }

  for (const season of SEASONS) {
    urls.push(`<url><loc>${base}/${city.slug}/${season}</loc><lastmod>${now}</lastmod><changefreq>monthly</changefreq><priority>0.75</priority></url>`)
  }

  if (city.districts.length >= 2) {
    const top = city.districts.slice(0, 10)
    for (let i = 0; i < top.length; i++) {
      for (let j = i + 1; j < top.length; j++) {
        urls.push(`<url><loc>${base}/${city.slug}/compare/${top[i].slug}/${top[j].slug}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>0.65</priority></url>`)
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`

  return new NextResponse(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  })
}
