import { useState, useEffect, useCallback } from 'react';
import { useIsFocused } from '@react-navigation/native';
import moment from 'moment';
import { prayerNotificationData } from './PryerHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { schedule7DaysNotifications } from '../../services/LocalNotifyScheduler';

export function usePrayerTimes(
  prayerTemplate,
  zone = 'wly01',
  year = moment().year().toString()
) {
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [todayPrayerTimes, setTodayPrayerTime] = useState([]);
  const [todayData, setTodayData] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [timeDiff, setTimeDiff] = useState('');

  const toAmPm = (hhmmss) => moment(hhmmss, 'HH:mm:ss').format('hh:mm A');

  const CACHE_KEY = `prayer_times_${zone}_${year}`;
  const CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  const getCachedData = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        const isExpired = Date.now() - timestamp > CACHE_EXPIRY;
        if (!isExpired) {
          return data;
        }
      }
    } catch (error) {
      console.log('Cache reading error:', error);
    }
    return null;
  };

  const setCachedData = async (data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.log('Cache writing error:', error);
    }
  };

  const fetchToday = useCallback(async () => {
    try {
      setLoading(true);

      // Try to get cached data first
      const cachedData = await getCachedData();
      if (cachedData) {
        const todayKey = moment().format('DD-MMM-YYYY');
        const todayObj = cachedData.prayerTime?.find((d) => d.date === todayKey);
        if (todayObj) {
          const asyncRaw = await AsyncStorage.getItem("prayerNotificationData");
          const asyncData = asyncRaw ? JSON.parse(asyncRaw) : prayerNotificationData;
          
          const enriched = asyncData?.map((item) => ({
            ...item,
            time: todayObj[item?.name.toLowerCase()] || '00:00',
            alarmTime: todayObj[item?.name.toLowerCase()] || '00:00',
          }));
          
          setTodayData(todayObj);
          setTodayPrayerTime(enriched);
          setLoading(false);
          return;
        }
      }

      // If no valid cached data, fetch from API
      const res = await fetch(
        `https://www.e-solat.gov.my/index.php?r=esolatApi/TakwimSolat&period=year&zone=${zone}&year=${year}`
      );

      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }

      const json = await res.json();
      await setCachedData(json); // Cache the API response

      const todayKey = moment().format('DD-MMM-YYYY');
      const todayObj = json.prayerTime?.find((d) => d.date === todayKey);
      const asyncRaw = await AsyncStorage.getItem("prayerNotificationData");
      const asyncData = asyncRaw ? JSON.parse(asyncRaw) : prayerNotificationData;

      const enriched = asyncData?.map((item) => ({
        ...item,
        time: todayObj ? todayObj[item?.name.toLowerCase()] || '00:00' : '00:00',
      }));

      setTodayData(todayObj);
      setTodayPrayerTime(enriched);
      await schedule7DaysNotifications(enriched)
    } catch (err) {
      console.log(' usePrayerTimes: Network or parsing error', err.message);
      // fallback if API fails
      const fallbackData = prayerNotificationData.map((item) => ({
        ...item,
        time: item.time,
      }));
      setTodayPrayerTime(fallbackData);
      setTodayData(null);
    } finally {
      setLoading(false);
    }
  }, [zone, year]);

  useEffect(() => {
    let mounted = true;
    
    const initializeData = async () => {
      if (isFocused && mounted) {
        await fetchToday();
      }
    };

    initializeData();

    return () => {
      mounted = false;
    };
  }, [isFocused, fetchToday]);

  useEffect(() => {
    let interval;

    const loadPrayerDataAndUpdateTime = async () => {
      try {
        const asyncRaw = await AsyncStorage.getItem("prayerNotificationData");
        const asyncRowData = await asyncRaw ? JSON.parse(asyncRaw) : null;
        const asyncData = await todayPrayerTimes.length ? todayPrayerTimes : asyncRowData ? asyncRowData : prayerNotificationData;

        const getNextPrayer = () => {
          const now = moment();
          const todayStr = moment().format('YYYY-MM-DD');

          const upcomingPrayer = asyncData.find(prayer => {
            const prayerMoment = moment(`${todayStr} ${prayer.time}`, 'YYYY-MM-DD hh:mm A');
            return prayerMoment.isAfter(now);
          });

          const next = upcomingPrayer || asyncData[0];
          const nextPrayerTime = moment(`${todayStr} ${next.time}`, 'YYYY-MM-DD hh:mm A');
          const duration = moment.duration(nextPrayerTime.diff(moment()));

          setNextPrayer(next);

          let timeStr = '';
          if (duration.hours() > 1) {
            timeStr += `${duration.hours()} hrs`;
          } else if (duration.hours() === 1) {
            timeStr += `1 hr`;
          }
          const mins = duration.minutes();

          if (mins >= 0) {
            if (timeStr) timeStr += ' ';
            timeStr += `${mins} ${mins === 1 ? 'min' : 'mins'}`;
          }

          if (!timeStr) {
            timeStr = '0 min';
          }

          setTimeDiff(timeStr);
        };

        getNextPrayer();
        interval = setInterval(getNextPrayer, 60000);

      } catch (err) {
        console.error(" Failed to load prayer times:", err);
        setNextPrayer(null);
        setTimeDiff('--');
      }
    };

    loadPrayerDataAndUpdateTime();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [todayPrayerTimes]); // ✅ empty dependency array


  return {
    loading,
    todayData,
    todayPrayerTimes,
    nextPrayer,
    timeDiff,
    fetchToday,
  };
}
