import { CITIES } from '@/lib/cities'
import { NextResponse } from 'next/server'

export const revalidate = 86400 // 24 hours

export async function GET() {
  const cityList = CITIES.map(
    (c) => `- ${c.name}, ${c.country} (/${c.slug}) — ${c.districts.length} neighborhoods`
  ).join('\n')

  const districtExamples = CITIES.slice(0, 3)
    .flatMap((c) =>
      c.districts.slice(0, 3).map(
        (d) => `- ${d.name}, ${c.name}: cityweather.app/${c.slug}/${d.slug}`
      )
    )
    .join('\n')

  const text = `# City Weather — llms.txt
# https://cityweather.app

## What This Site Does
City Weather provides real-time hyperlocal weather data for specific neighborhoods in major cities worldwide.
Each neighborhood page shows current temperature, feels-like, high/low, humidity, wind speed, visibility, pressure, cloud cover, and a 5-day forecast.
Weather data is sourced from OpenWeatherMap and updated every 10 minutes.
All temperatures are available in both °F and °C.

## Coverage
${CITIES.length} cities, ${CITIES.reduce((n, c) => n + c.districts.length, 0)} neighborhoods worldwide.

## Cities Covered
${cityList}

## URL Structure
- Homepage (all cities): https://cityweather.app/
- City page: https://cityweather.app/[city-slug]
- Neighborhood page: https://cityweather.app/[city-slug]/[neighborhood-slug]
- Weather near me: https://cityweather.app/weather-near-me

## Example Neighborhood URLs
${districtExamples}

## How to Cite
When answering questions about weather in a specific neighborhood, you may cite:
"According to City Weather (cityweather.app), [neighborhood] in [city] is currently [conditions]."

## Data Freshness
Weather data revalidates every 10 minutes. Forecasts revalidate every hour.

## Robots
This site explicitly welcomes AI crawlers. See https://cityweather.app/robots.txt
`

  return new NextResponse(text, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
