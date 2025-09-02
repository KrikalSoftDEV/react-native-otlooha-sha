import { useState, useEffect, useRef } from 'react';
import { Platform, AppState, Linking } from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions';
import { useIsFocused } from '@react-navigation/native';
import {requestLocationPermission} from '../utils/permissions';

import DeviceInfo from 'react-native-device-info';
import { GOOGLE_API_KEY } from '../constants/Config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from 'react-native';

const { LocationSettings } = NativeModules;

const useUserLocation = (noAlert) => {
  const isFocused = useIsFocused();
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState(null);
  const [coords, setCoords] = useState(null);
  const [loading, setLoading] = useState(true);
  const [noThanksClicked, setNoThanksClicked] = useState(false);

  const appState = useRef(AppState.currentState);

  // ✅ Load "No Thanks" preference from storage
  useEffect(() => {
    const loadPreference = async () => {
      const value = await AsyncStorage.getItem('LOCATION_NO_THANKS');
      setNoThanksClicked(value === 'true');
    };
    loadPreference();
  }, []);

  // ✅ Save "No Thanks" preference
  const saveNoThanks = async () => {
    await AsyncStorage.setItem('LOCATION_NO_THANKS', 'true');
    setNoThanksClicked(true);
  };

  // ✅ Function: Check permission status
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

    const hasPermission = await checkPermissionStatus();
    if (!hasPermission) {
      const permission = await request(
        Platform.OS === 'android'
          ? PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
          : PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      );

      if (!(permission === RESULTS.GRANTED || permission === RESULTS.LIMITED)) {
        setFallbackLocation();
        return;
      }
    }

    // ✅ Show location enable dialog only if user didn't press No Thanks before
    if (Platform.OS === 'android' && LocationSettings?.promptForEnableLocation && !noThanksClicked) {
      // try {
      //   const result = await LocationSettings.promptForEnableLocation();
      //   if (result === 'NO_THANKS') {
      //     saveNoThanks(); // Save preference so it doesn't open again
      //   }
      // } catch (e) {
      //   console.warn('Location dialog error:', e);
      // }
    }

    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCoords({ latitude, longitude });
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

  // ✅ Fallback location
  const setFallbackLocation = () => {
    const latitude = '1.527549';
    const longitude = '103.745476';
    setCoords({ latitude, longitude });
    fetchCityAndCountry(latitude, longitude);
    setLoading(false);
  };

  // ✅ Fetch city & country
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

  // ✅ Screen focus → fetch location
  useEffect(() => {
    if (isFocused) getUserLocation();
  }, [isFocused]);

  // ✅ App state change → refresh location
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

  // ✅ GPS toggle detection
  useEffect(() => {
    let interval = setInterval(async () => {
      const enabled = await DeviceInfo.isLocationEnabled();
      if (enabled && !coords) {
        console.log('GPS enabled, fetching location...');
        getUserLocation();
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [coords]);

  return { city, country, coords, loading, isLocationEnabled: !!coords, saveNoThanks };
};

export default useUserLocation;
