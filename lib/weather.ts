import { readFileSync, writeFileSync, mkdirSync } from 'fs'

export const BOROUGHS = [
  { name: 'Manhattan',     slug: 'manhattan',     lat: 40.7831, lon: -73.9712 },
  { name: 'Brooklyn',      slug: 'brooklyn',      lat: 40.6782, lon: -73.9442 },
  { name: 'Queens',        slug: 'queens',        lat: 40.7282, lon: -73.7949 },
  { name: 'The Bronx',     slug: 'bronx',         lat: 40.8448, lon: -73.8648 },
  { name: 'Staten Island', slug: 'staten-island', lat: 40.5795, lon: -74.1502 },
]

export type WeatherData = {
  borough: string
  slug: string
  temp: number
  feels_like: number
  temp_min: number
  temp_max: number
  description: string
  humidity: number
  wind_speed: number
  wind_deg: number
  icon: string
  visibility: number  // miles
  pressure: number    // hPa
  clouds: number      // %
}

export type ForecastDay = {
  date: string
  high: number
  low: number
  description: string
  icon: string
}

const CACHE_DIR = '/var/cache/cityweather'
const WEATHER_TTL = 600    // 10 minutes
const FORECAST_TTL = 3600  // 1 hour

function cacheKey(prefix: string, lat: number, lon: number): string {
  return `${prefix}_${lat.toFixed(4)}_${lon.toFixed(4)}`
}

function cacheGet<T>(key: string, ttl: number): T | null {
  try {
    const raw = readFileSync(`${CACHE_DIR}/${key}.json`, 'utf-8')
    const { data, ts } = JSON.parse(raw)
    if (Date.now() - ts < ttl * 1000) return data as T
    return null
  } catch {
    return null
  }
}

function cacheSet(key: string, data: unknown): void {
  try {
    mkdirSync(CACHE_DIR, { recursive: true })
    writeFileSync(`${CACHE_DIR}/${key}.json`, JSON.stringify({ data, ts: Date.now() }))
  } catch {
    // Non-fatal: cache write failure just means next request hits API
  }
}

export async function getWeather(lat: number, lon: number): Promise<WeatherData | null> {
  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey || apiKey === 'your_api_key_here') return null

  const key = cacheKey('weather', lat, lon)
  const cached = cacheGet<WeatherData>(key, WEATHER_TTL)
  if (cached) return cached

  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  const res = await fetch(url, { next: { revalidate: 600 } })
  if (!res.ok) return null
  const data = await res.json()

  const result: WeatherData = {
    borough: '',
    slug: '',
    temp: Math.round(data.main.temp),
    feels_like: Math.round(data.main.feels_like),
    temp_min: Math.round(data.main.temp_min),
    temp_max: Math.round(data.main.temp_max),
    description: data.weather[0].description,
    humidity: data.main.humidity,
    wind_speed: Math.round(data.wind.speed),
    wind_deg: data.wind.deg,
    icon: data.weather[0].icon,
    visibility: Math.round((data.visibility ?? 10000) / 1609),
    pressure: data.main.pressure,
    clouds: data.clouds?.all ?? 0,
  }

  cacheSet(key, result)
  return result
}

export async function getForecast(lat: number, lon: number): Promise<ForecastDay[]> {
  const apiKey = process.env.OPENWEATHER_API_KEY
  if (!apiKey || apiKey === 'your_api_key_here') return []

  const key = cacheKey('forecast', lat, lon)
  const cached = cacheGet<ForecastDay[]>(key, FORECAST_TTL)
  if (cached) return cached

  const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=imperial`
  const res = await fetch(url, { next: { revalidate: 3600 } })
  if (!res.ok) return []
  const data = await res.json()

  const todayStr = new Date().toLocaleDateString('en-US', { timeZone: 'America/New_York' })
  const days = new Map<string, { label: string; highs: number[]; lows: number[]; descriptions: string[]; icons: string[] }>()

  for (const item of data.list) {
    const d = new Date(item.dt * 1000)
    const dateStr = d.toLocaleDateString('en-US', { timeZone: 'America/New_York' })
    if (dateStr === todayStr) continue
    if (!days.has(dateStr)) {
      days.set(dateStr, {
        label: d.toLocaleDateString('en-US', { timeZone: 'America/New_York', weekday: 'short', month: 'short', day: 'numeric' }),
        highs: [],
        lows: [],
        descriptions: [],
        icons: [],
      })
    }
    const day = days.get(dateStr)!
    day.highs.push(Math.round(item.main.temp_max))
    day.lows.push(Math.round(item.main.temp_min))
    day.descriptions.push(item.weather[0].description)
    day.icons.push(item.weather[0].icon)
  }

  const result = Array.from(days.values()).slice(0, 5).map((d) => ({
    date: d.label,
    high: Math.max(...d.highs),
    low: Math.min(...d.lows),
    description: d.descriptions[Math.floor(d.descriptions.length / 2)],
    icon: d.icons[Math.floor(d.icons.length / 2)],
  }))

  cacheSet(key, result)
  return result
}

export async function getAllBoroughWeather(): Promise<WeatherData[]> {
  const results = await Promise.all(
    BOROUGHS.map(async (b) => {
      const w = await getWeather(b.lat, b.lon)
      return w ? { ...w, borough: b.name, slug: b.slug } : null
    })
  )
  return results.filter(Boolean) as WeatherData[]
}

export function windDirection(deg: number): string {
  const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  return dirs[Math.round(deg / 45) % 8]
}

export function capitalize(str: string): string {
  return str.replace(/\b\w/g, (c: string) => c.toUpperCase())
}

// --- Golden Hour / Sun calculation ---
// Solar calculations based on NOAA algorithm
function toJulianDate(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5
}

function solarNoon(jd: number, lon: number): number {
  const n = Math.round(jd - 2451545.0 - 0.0009 - lon / 360)
  const jStar = 2451545.0 + 0.0009 + lon / 360 + n
  const M = (357.5291 + 0.98560028 * (jStar - 2451545)) % 360
  const Mrad = M * Math.PI / 180
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad)
  const lambda = (M + C + 180 + 102.9372) % 360
  const jTransit = jStar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambda * Math.PI / 180)
  return jTransit
}

function sunTimes(lat: number, lon: number, date: Date): { sunrise: Date; sunset: Date } | null {
  const jd = toJulianDate(date)
  const n = Math.round(jd - 2451545.0 - 0.0009 - lon / 360)
  const jStar = 2451545.0 + 0.0009 + lon / 360 + n
  const M = (357.5291 + 0.98560028 * (jStar - 2451545)) % 360
  const Mrad = M * Math.PI / 180
  const C = 1.9148 * Math.sin(Mrad) + 0.02 * Math.sin(2 * Mrad) + 0.0003 * Math.sin(3 * Mrad)
  const lambda = (M + C + 180 + 102.9372) % 360
  const lambdaRad = lambda * Math.PI / 180
  const sinDec = Math.sin(lambdaRad) * Math.sin(23.4393 * Math.PI / 180)
  const cosDec = Math.cos(Math.asin(sinDec))
  const latRad = lat * Math.PI / 180
  const cosOmega = (Math.sin(-0.833 * Math.PI / 180) - Math.sin(latRad) * sinDec) / (Math.cos(latRad) * cosDec)
  if (cosOmega < -1 || cosOmega > 1) return null // no sunrise/sunset (polar)
  const omega = Math.acos(cosOmega) * 180 / Math.PI
  const jTransit = jStar + 0.0053 * Math.sin(Mrad) - 0.0069 * Math.sin(2 * lambdaRad)
  const jRise = jTransit - omega / 360
  const jSet = jTransit + omega / 360
  const sunrise = new Date((jRise - 2440587.5) * 86400000)
  const sunset = new Date((jSet - 2440587.5) * 86400000)
  return { sunrise, sunset }
}

export type GoldenHourData = {
  morning: { start: string; end: string }
  evening: { start: string; end: string }
  sunrise: string
  sunset: string
}

export function getGoldenHour(lat: number, lon: number, timezone: string): GoldenHourData | null {
  const now = new Date()
  const times = sunTimes(lat, lon, now)
  if (!times) return null
  const fmt = (d: Date) => d.toLocaleTimeString('en-US', { timeZone: timezone, hour: 'numeric', minute: '2-digit' })
  const morningStart = new Date(times.sunrise.getTime() - 10 * 60000)
  const morningEnd = new Date(times.sunrise.getTime() + 50 * 60000)
  const eveningStart = new Date(times.sunset.getTime() - 50 * 60000)
  const eveningEnd = new Date(times.sunset.getTime() + 10 * 60000)
  return {
    morning: { start: fmt(morningStart), end: fmt(morningEnd) },
    evening: { start: fmt(eveningStart), end: fmt(eveningEnd) },
    sunrise: fmt(times.sunrise),
    sunset: fmt(times.sunset),
  }
}
