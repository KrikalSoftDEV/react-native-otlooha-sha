import { useState, useEffect, useRef } from 'react';
import { Platform, AppState, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useIsFocused } from '@react-navigation/native';
import { requestLocationPermission } from '../utils/permissions';

import DeviceInfo from 'react-native-device-info';
import { GOOGLE_API_KEY } from '../constants/Config';
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { LocationSettings } = NativeModules;

const useUserLocation = (noAlert) => {
  const isFocused = useIsFocused();
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noThanksClicked, setNoThanksClicked] = useState(true);

  const appState = useRef(AppState.currentState);

  const checkPermissionStatus = async () => {
    const status = await check(
      Platform.OS === 'android'
        ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
        : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    );
    return status === RESULTS.GRANTED || status === RESULTS.LIMITED;
  };

  // ✅ Function: Fetch user location
  const getUserLocation = async () => {
    setLoading(true);
    // console.log('Checking location permission...');
    const hasPermission = await checkPermissionStatus();
    if (!hasPermission) {
      console.log('Checking location permission...2');
      const permission = await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      );
      console.log('Checking location permission...3');
      if (!(permission === RESULTS.GRANTED || permission === RESULTS.LIMITED)) {
        setFallbackLocation();
        return;
      }
    }
    try {
      const value = await AsyncStorage.getItem('LOCATION_NO_THANKS');
      console.log('No Thanks preference:', value);
      if (!value || value !== 'true') {
        //  console.log('No Thanks preference---:', value);
        await AsyncStorage.setItem('LOCATION_NO_THANKS', 'true');
        await LocationSettings.promptForEnableLocation();
      }
    } catch (e) {
      console.warn('Location dialog error:', e);
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
        console.log('call her');
        fetchCityAndCountry(latitude, longitude);
      },
      (error) => {
        console.warn('Location error:', error);
        setFallbackLocation();

        if (error.code === 2 && Platform.OS === 'ios') {
          Linking.openURL('App-Prefs:Privacy&path=LOCATION');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 5000,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };
  // Set fallback location
  const setFallbackLocation = () => {
    const latitude = '1.527549';
    const longitude = '103.745476';
    setCoords({ latitude, longitude });
    fetchCityAndCountry(latitude, longitude);
    setLoading(false);
  };

  // Fetch city & country
  const fetchCityAndCountry = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const data = await response.json();

      if (data.status === 'OK') {
        const components = data.results[0].address_components;
        const cityComponent = components.find((c) => c.types.includes('locality'));
        const countryComponent = components.find((c) => c.types.includes('country'));

        setCity(cityComponent?.long_name || null);
        setCountry(countryComponent?.long_name || null);
      } else {
        setCity(`Error: ${data.error_message || 'Geocoding failed.'}`);
        setCountry('Error');
      }
    } catch (error) {
      console.error('Geocoding Fetch Failed:', error);
      setCity(null);
      setCountry(null);
    } finally {
      setLoading(false);
    }
  };

  // Load user location on mount and when focused
  useEffect(() => {
    if (isFocused) getUserLocation();
  }, [isFocused, noThanksClicked]);

  // App state change → refresh location
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        const hasPermission = await checkPermissionStatus();
        if (hasPermission) getUserLocation();
      }
      appState.current = nextAppState;
    });

    return () => subscription.remove();
  }, []);

  // GPS toggle detection
  useEffect(() => {
    let interval = setInterval(async () => {
      const enabled = await DeviceInfo.isLocationEnabled();
      setNoThanksClicked(enabled)

    }, 2000);

    return () => clearInterval(interval);
  }, [coords]);

  return { city, country, coords, loading, isLocationEnabled: !!coords, };
};

export default useUserLocation;
