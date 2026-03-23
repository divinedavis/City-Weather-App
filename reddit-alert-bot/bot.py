#!/usr/bin/env python3
"""
City Weather Reddit Alert Bot
Monitors weather for covered cities and posts alerts to relevant subreddits.
DO NOT ACTIVATE until credentials are configured.
"""

import time
import logging
import requests
from datetime import datetime, timedelta

# ============================================================
# CONFIGURATION — Fill in before activating
# ============================================================
REDDIT_CLIENT_ID = "YOUR_CLIENT_ID_HERE"
REDDIT_CLIENT_SECRET = "YOUR_CLIENT_SECRET_HERE"
REDDIT_USERNAME = "YOUR_REDDIT_USERNAME"
REDDIT_PASSWORD = "YOUR_REDDIT_PASSWORD"
OPENWEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY"

USER_AGENT = f"CityWeatherAlertBot/1.0 by {REDDIT_USERNAME}"
LOG_FILE = "/var/log/nycweather-reddit-bot.log"

# Rate limiting: max 1 post per city per 6 hours
POST_COOLDOWN_HOURS = 6

# ============================================================
# CITY -> SUBREDDIT MAPPINGS
# ============================================================
CITY_SUBREDDITS = {
    "nyc":         {"name": "New York City", "subreddit": "nyc",         "lat": 40.7128, "lon": -74.0060},
    "london":      {"name": "London",        "subreddit": "london",      "lat": 51.5074, "lon": -0.1278},
    "tokyo":       {"name": "Tokyo",         "subreddit": "Tokyo",       "lat": 35.6762, "lon": 139.6503},
    "paris":       {"name": "Paris",         "subreddit": "paris",       "lat": 48.8566, "lon": 2.3522},
    "dubai":       {"name": "Dubai",         "subreddit": "dubai",       "lat": 25.2048, "lon": 55.2708},
    "sydney":      {"name": "Sydney",        "subreddit": "sydney",      "lat": -33.8688, "lon": 151.2093},
    "chicago":     {"name": "Chicago",       "subreddit": "chicago",     "lat": 41.8781, "lon": -87.6298},
    "miami":       {"name": "Miami",         "subreddit": "miami",       "lat": 25.7617, "lon": -80.1918},
    "singapore":   {"name": "Singapore",     "subreddit": "singapore",   "lat": 1.3521, "lon": 103.8198},
    "los-angeles": {"name": "Los Angeles",   "subreddit": "LosAngeles",  "lat": 34.0522, "lon": -118.2437},
}

# Alert thresholds
THRESHOLDS = {
    "heat":       lambda w: w.get("main", {}).get("temp", 0) > 37.8,        # > 100°F / 37.8°C
    "freeze":     lambda w: w.get("main", {}).get("temp", 999) < -12.2,     # < 10°F / -12.2°C
    "wind":       lambda w: w.get("wind", {}).get("speed", 0) * 2.237 > 40, # > 40 mph
    "heavy_rain": lambda w: w.get("weather", [{}])[0].get("id", 0) in range(502, 505),
    "heavy_snow": lambda w: w.get("weather", [{}])[0].get("id", 0) in range(602, 623),
}

ALERT_LABELS = {
    "heat":       "Extreme Heat Alert",
    "freeze":     "Extreme Cold Alert",
    "wind":       "High Wind Alert",
    "heavy_rain": "Heavy Rain Alert",
    "heavy_snow": "Heavy Snow Alert",
}

# ============================================================
# SETUP
# ============================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(message)s",
    handlers=[
        logging.FileHandler(LOG_FILE),
        logging.StreamHandler(),
    ],
)
log = logging.getLogger(__name__)

# Track last post time per city to enforce rate limiting
last_post: dict = {}


def get_reddit_token() -> str:
    """Authenticate with Reddit OAuth2 and return access token."""
    resp = requests.post(
        "https://www.reddit.com/api/v1/access_token",
        auth=(REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET),
        data={"grant_type": "password", "username": REDDIT_USERNAME, "password": REDDIT_PASSWORD},
        headers={"User-Agent": USER_AGENT},
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()["access_token"]


def get_weather(lat: float, lon: float) -> dict:
    """Fetch current weather from OpenWeatherMap."""
    resp = requests.get(
        "https://api.openweathermap.org/data/2.5/weather",
        params={"lat": lat, "lon": lon, "appid": OPENWEATHER_API_KEY, "units": "metric"},
        timeout=10,
    )
    resp.raise_for_status()
    return resp.json()


def post_to_reddit(token: str, subreddit: str, title: str, text: str) -> bool:
    """Submit a text post to Reddit."""
    headers = {"Authorization": f"bearer {token}", "User-Agent": USER_AGENT}
    resp = requests.post(
        "https://oauth.reddit.com/api/submit",
        headers=headers,
        data={
            "sr": subreddit,
            "kind": "self",
            "title": title,
            "text": text,
            "resubmit": True,
        },
        timeout=10,
    )
    resp.raise_for_status()
    result = resp.json()
    if result.get("json", {}).get("errors"):
        log.error(f"Reddit post errors: {result['json']['errors']}")
        return False
    log.info(f"Posted to r/{subreddit}: {title}")
    return True


def can_post(city_slug: str) -> bool:
    """Check rate limit: no more than 1 post per city per 6 hours."""
    last = last_post.get(city_slug)
    if last is None:
        return True
    return datetime.utcnow() - last > timedelta(hours=POST_COOLDOWN_HOURS)


def check_and_alert(token: str):
    """Check all cities and post alerts for threshold-crossing weather."""
    for slug, info in CITY_SUBREDDITS.items():
        try:
            weather = get_weather(info["lat"], info["lon"])
            temp_c = weather.get("main", {}).get("temp", 0)
            temp_f = temp_c * 9 / 5 + 32
            wind_mph = weather.get("wind", {}).get("speed", 0) * 2.237
            conditions = weather.get("weather", [{}])[0].get("description", "unknown")
            city_url = f"https://cityweather.app/{slug}"

            for alert_key, threshold_fn in THRESHOLDS.items():
                if threshold_fn(weather) and can_post(slug):
                    label = ALERT_LABELS[alert_key]
                    title = f"[{label}] {info['name']} — {temp_f:.0f}°F / {temp_c:.0f}°C, {conditions}"
                    body = (
                        f"**{label} in {info['name']}**\n\n"
                        f"- Temperature: {temp_f:.0f}°F ({temp_c:.0f}°C)\n"
                        f"- Conditions: {conditions.capitalize()}\n"
                        f"- Wind: {wind_mph:.0f} mph\n"
                        f"- Humidity: {weather.get('main', {}).get('humidity', '?')}%\n\n"
                        f"Track hyperlocal conditions by neighborhood: [{city_url}]({city_url})\n\n"
                        f"*Posted by City Weather bot — hyperlocal weather for {info['name']} neighborhoods*"
                    )
                    if post_to_reddit(token, info["subreddit"], title, body):
                        last_post[slug] = datetime.utcnow()
                    break  # One alert per city per check

        except Exception as e:
            log.error(f"Error checking {slug}: {e}")


def main():
    log.info("City Weather Reddit Alert Bot starting...")
    if REDDIT_CLIENT_ID == "YOUR_CLIENT_ID_HERE":
        log.error("CREDENTIALS NOT CONFIGURED. Set REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET, REDDIT_USERNAME, REDDIT_PASSWORD, and OPENWEATHER_API_KEY before activating.")
        return

    while True:
        try:
            token = get_reddit_token()
            log.info("Reddit authenticated successfully")
            check_and_alert(token)
        except Exception as e:
            log.error(f"Main loop error: {e}")
        time.sleep(3600)  # Check every hour


if __name__ == "__main__":
    main()
