// prayerTimes.js
// Fetches daily prayer times from Aladhan API for Cairo, Egypt
import { format } from 'date-fns';

const API_URL = 'https://api.aladhan.com/v1/timingsByCity';
const CITY = 'Cairo';
const COUNTRY = 'Egypt';
const METHOD = 5; // Egyptian General Authority of Survey

/**
 * Fetches today's prayer times for Cairo, Egypt from Aladhan API.
 * Returns an object with Fajr, Dhuhr, Asr, Maghrib, Isha times in 24h format.
 */
export async function fetchPrayerTimes(date = new Date()) {
  const dateStr = format(date, 'dd-MM-yyyy');
  const url = `${API_URL}?city=${CITY}&country=${COUNTRY}&method=${METHOD}&date=${dateStr}`;
  const res = await fetch(url);
  const json = await res.json();
  // Sample response structure:
  // json.data.timings = { Fajr: '03:21', Dhuhr: '11:57', Asr: '15:33', Maghrib: '18:59', Isha: '20:23', ... }
  const { Fajr, Dhuhr, Asr, Maghrib, Isha } = json.data.timings;
  return { Fajr, Dhuhr, Asr, Maghrib, Isha };
}

// Example usage and sample response parsing:
// fetchPrayerTimes().then(console.log);
// Output: { Fajr: '03:21', Dhuhr: '11:57', Asr: '15:33', Maghrib: '18:59', Isha: '20:23' } 