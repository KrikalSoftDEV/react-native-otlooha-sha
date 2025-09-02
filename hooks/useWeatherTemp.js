import { useEffect, useState } from 'react';
import axios from 'axios';
import { WEATHER_API_KEY } from '../constants/Config';

export const useWeatherTemp = (latitude, longitude) => {
  const [temperature, setTemperature] = useState(null);
  const [sunriseTime, setSunriseTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // const WEATHER_API_KEY = 'AIzaSyBGfHgV2LSC1uZcwpgGqA04N2ilT9kJGdQ';

  useEffect(() => {
    if (!latitude || !longitude) return;

    const fetchTemperature = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          'https://weather.googleapis.com/v1/currentConditions:lookup',
          {
            params: {
              key: WEATHER_API_KEY,
              'location.latitude': latitude,
              'location.longitude': longitude,
            },
          }
        );
        const temps = res.data?.temperature?.degrees
        //  console.log('Temperature fetch res:', temps);
        setTemperature(temps || null);
      } catch (err) {
        console.error('Temperature fetch failed:', err.response?.data || err.message);
        setError('Failed to fetch temperature');
      } finally {
        setLoading(false);
      }
    };

    const fetchSunEvents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(
          'https://weather.googleapis.com/v1/forecast/days:lookup',
          {
            params: {
              key: WEATHER_API_KEY,
              'location.latitude': latitude,
              'location.longitude': longitude,
            },
          }
        );

        const forecastDay = res?.data?.forecastDays?.[0];
        // console.log("forecastDay: ", forecastDay);

        const sunEvents = forecastDay?.sunEvents;

        if (sunEvents && typeof sunEvents === 'object') {
          const sunriseTime = sunEvents.sunriseTime || null;
          const sunsetTime = sunEvents.sunsetTime || null;

          // console.log('Sunrise time:', sunriseTime);
          // console.log('Sunset time:', sunsetTime);

          setSunriseTime(sunriseTime);
        } else {
          console.warn('sunEvents not found or invalid format:', sunEvents);
          setSunriseTime(null);
        }

      } catch (err) {
        console.error('sunrise_time fetch failed:', err.response?.data || err.message);
        setError('Failed to fetch sunrise time');
      } finally {
        setLoading(false);
      }
    };


    fetchSunEvents()
    fetchTemperature();
  }, [latitude, longitude]);

  return { temperature, sunriseTime, loading, error };
};
