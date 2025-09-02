import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  Animated,
  TextInput,
  FlatList,
  Keyboard,
  SafeAreaView,
  Platform,
  ActivityIndicator,
  Linking,
  Alert,
  BackHandler,
  ScrollView,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Header from '../../components/UI/Header';
import { useNavigation } from '@react-navigation/native';
import { SectionHeader } from '../donation/DonationTypeList';
import Arrow_right_worship from '../../assets/images/WorshipPlaces/arrow_right_worship.svg';
import { STATUSBAR_HEIGHT } from '../../constants/Dimentions';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import HeaderImageCarousel from '../common/HeaderImageCarousel';
import { scale, verticalScale } from 'react-native-size-matters';
import { GOOGLE_API_KEY } from '../../constants/Config';

// const GOOGLE_API_KEY = 'AIzaSyBGfHgV2LSC1uZcwpgGqA04N2ilT9kJGdQ';
const LOCATIONS = [
  {
    key: 'current',
    label: 'Current Location',
    coords: null, // Will be filled dynamically
  },
  {
    key: 'malaysia',
    label: 'Malaysia',
    coords: { lat: 1.476468, lng: 103.902650 }, // Johor
  },
  {
    key: 'singapore',
    label: 'Singapore',
    coords: { lat: 1.3521, lng: 103.8198 },
  },
];
const DEFAULT_COUNTRY = 'Malaysia';
const PAGE_SIZE = 5;

const TABS = [
  { key: 'Mosques', label: 'Mosques', type: 'mosque' },
  { key: 'Surau', label: 'Surau', type: 'surau' },
];

const WorshipPlaces = () => {
  const navigation = useNavigation();
  const [selectedTab, setSelectedTab] = useState('Mosques');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [country, setCountry] = useState(DEFAULT_COUNTRY);
  const [location, setLocation] = useState(LOCATIONS[1].coords); // Default Malaysia
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('malaysia');
  const [currentCoords, setCurrentCoords] = useState(null);
  const [gettingLocation, setGettingLocation] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const debounceTimeout = useRef(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [searchResultsActive, setSearchResultsActive] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const [allPlaces, setAllPlaces] = useState([]);
  const [displayCount, setDisplayCount] = useState(5);

  const HEADER_MAX_HEIGHT = 282;
  const HEADER_MIN_HEIGHT = 10;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  const headerCarouselImages = [
    { image: require('../../assets/images/WorshipPlaces/header_image.png'), accessibilityLabel: 'Worship Place Header 1' },
    { image: require('../../assets/images/WorshipPlaces/header_image.png'), accessibilityLabel: 'Worship Place Header 2' },
    // Add more images as needed
  ];


  useEffect(() => {
    const backAction = () => {
      if (isSearchActive) {
       handleSearchClose()
        return true; // Prevent default back behavior
      }
      return false; // Let the system handle back press
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove(); // Cleanup
  }, [isSearchActive]);

  function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = ((lat2 - lat1) * Math.PI) / 180;
    var dLon = ((lon2 - lon1) * Math.PI) / 180;
    var a =
      0.5 -
      Math.cos(dLat) / 2 +
      (Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        (1 - Math.cos(dLon))) /
        2;
    return R * 2 * Math.asin(Math.sqrt(a));
  }

  const openInGoogleMaps = (lat, lng, name) => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${lat},${lng}`,
      android: `geo:${lat},${lng}?q=${encodeURIComponent(name)}`,
    });
    Linking.openURL(url);
  };

  const fetchCountry = async (lat, lng) => {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
      );
      const address =
        res.data.results.find(r => r.types.includes('country')) ||
        res.data.results[0];
      const countryComponent = address?.address_components?.find(c =>
        c.types.includes('country')
      );
      return countryComponent?.long_name || DEFAULT_COUNTRY;
    } catch (e) {
      return DEFAULT_COUNTRY;
    }
  };

  const fetchPlaces = async ({
    tabType,
    query = '',
    pageToken = null,
    append = false,
    loc = location,
    countryName = country,
    reset = false,
  }) => {
    setError(null);
    if (!append) {setLoading(true);}
    else {setIsFetchingMore(true);}
    try {
      let url = '';
      let params = {};
      if (query) {
        url = 'https://maps.googleapis.com/maps/api/place/textsearch/json';
        params = {
          query: `${query} ${tabType} in ${countryName}`,
          location: `${loc.lat},${loc.lng}`,
          rankby: 'distance',
          key: GOOGLE_API_KEY,
          pagetoken: pageToken,
        };
      } else {
        url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
        params = {
          location: `${loc.lat},${loc.lng}`,
           rankby: 'distance',
          type: tabType === 'mosque' ? 'mosque' : undefined,
          keyword: tabType !== 'mosque' ? tabType : undefined,
          key: GOOGLE_API_KEY,
          pagetoken: pageToken,
        };
      }
      Object.keys(params).forEach(
        key => params[key] === undefined && delete params[key]
      );
      const res = await axios.get(url, { params });
      let results = res.data.results || [];
      results = results.map(place => ({
        ...place,
        distance: getDistanceFromLatLonInKm(
          loc.lat,
          loc.lng,
          place.geometry.location.lat,
          place.geometry.location.lng
        ),
      }));
      results.sort((a, b) => a.distance - b.distance);
      let newAllPlaces = append ? [...allPlaces, ...results] : results;
      if (newAllPlaces.length > 100) {newAllPlaces = newAllPlaces.slice(0, 100);}
      setAllPlaces(newAllPlaces);
      let newDisplayCount = displayCount;
      if (reset) {newDisplayCount = 5;}
      if (!append && !reset) {newDisplayCount = displayCount;}
      setPlaces(newAllPlaces.slice(0, newDisplayCount));
      setNextPageToken(res.data.next_page_token || null);
      setHasMore(!!res.data.next_page_token && newAllPlaces.length < 100);
    } catch (e) {
      setError('Oops! Something went wrong. Please try again.');
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
      setInitialLoad(false);
    }
  };

  // --- Location Permission and Fetch ---
  const getCurrentLocation = async () => {

    setGettingLocation(true);
    setError(null);
    try {
      let permission;
      if (Platform.OS === 'android') {
        permission = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      } else {
        permission = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
      }
      if (
        permission === RESULTS.GRANTED ||
        permission === RESULTS.LIMITED
      ) {
        let coords = '';
        Geolocation.getCurrentPosition(async info => {
            if(info?.coords) {
              coords =   info?.coords;
              setGettingLocation(false);
              setCurrentCoords(coords);
              setLocation({ lat: coords.latitude, lng: coords.longitude });
              const countryName = await fetchCountry(coords.latitude, coords.longitude);
              setCountry(countryName);
              setSelectedTab('Mosques');
              fetchPlaces({ tabType: 'mosque', loc: { lat: coords.latitude, lng: coords.longitude }, countryName });
            } else {

            }
          });
          return  coords;

        // return await new Promise((resolve, reject) => {

        //   Geolocation.getCurrentPosition(
        //     position => {
        //       console.log('-=-=---=-=resolve', position);

        //       setGettingLocation(false);
        //       resolve(position.coords);
        //     },
        //     error => {
        //       setGettingLocation(false);
        //       setError('Unable to get current location.');
        //       reject(error);
        //       console.log('-=-=---=-=error', error);
        //     },
        //     {  enableHighAccuracy: true,
        //       timeout: 30000,
        //       maximumAge: 0,
        //       forceRequestLocation: true,
        //       showLocationDialog: true }
        //   );
        // });
      } else if (permission === RESULTS.BLOCKED) {
        setGettingLocation(false);
        Alert.alert(
          'Location Permission',
          'Location permission is blocked. Please enable it in settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => openSettings() },
          ]
        );
        throw new Error('Permission blocked');
      } else {
        setGettingLocation(false);
        setError('Location permission denied.');
        throw new Error('Permission denied');
      }
    } catch (e) {
      setGettingLocation(false);
      setError('Unable to get current location.');
      throw e;
    }
  };

  // --- Initial Load: Malaysia ---
  useEffect(() => {
    (async () => {
      setLocation(LOCATIONS[1].coords); // Malaysia
      setCountry('Malaysia');
      setSelectedTab('Mosques');
      fetchPlaces({ tabType: 'mosque', loc: LOCATIONS[1].coords, countryName: 'Malaysia' });
    })();
  }, []);

  // --- Location Switcher ---
  useEffect(() => {
    (async () => {
      if (selectedLocation === 'current') {
        try {
          const coords = await getCurrentLocation();

          setCurrentCoords(coords);
          setLocation({ lat: coords.latitude, lng: coords.longitude });
          const countryName = await fetchCountry(coords.latitude, coords.longitude);
          setCountry(countryName);
          setSelectedTab('Mosques');
          fetchPlaces({ tabType: 'mosque', loc: { lat: coords.latitude, lng: coords.longitude }, countryName });
        } catch {
          // fallback to Malaysia
          setSelectedLocation('malaysia');
        }
      } else if (selectedLocation === 'malaysia') {
        setLocation(LOCATIONS[1].coords);
        setCountry('Malaysia');
        setSelectedTab('Mosques');
        fetchPlaces({ tabType: 'mosque', loc: LOCATIONS[1].coords, countryName: 'Malaysia' });
      } else if (selectedLocation === 'singapore') {
        setLocation(LOCATIONS[2].coords);
        setCountry('Singapore');
        setSelectedTab('Mosques');
        fetchPlaces({ tabType: 'mosque', loc: LOCATIONS[2].coords, countryName: 'Singapore' });
      }
    })();
    // eslint-disable-next-line
  }, [selectedLocation]);

  // --- Tab Change ---
  useEffect(() => {
    if (!initialLoad) {
      let tabType = TABS.find(t => t.key === selectedTab)?.type || 'mosque';
      fetchPlaces({ tabType, loc: location, countryName: country });
    }
    // eslint-disable-next-line
  }, [selectedTab]);

  // --- Search Query Change (Debounced) ---
  useEffect(() => {
    if (debounceTimeout.current) {clearTimeout(debounceTimeout.current);}
    if (isSearchActive && searchQuery.length > 0) {
      debounceTimeout.current = setTimeout(() => {
        let tabType = TABS.find(t => t.key === selectedTab)?.type || 'mosque';
        fetchPlaces({ tabType, query: searchQuery, loc: location, countryName: country });
      }, 500);
    } else if (isSearchActive && searchQuery.length === 0) {
      let tabType = TABS.find(t => t.key === selectedTab)?.type || 'mosque';
      fetchPlaces({ tabType, loc: location, countryName: country });
    }
    // eslint-disable-next-line
  }, [searchQuery, isSearchActive]);

  // Fetch search suggestions using Google Places Nearby Search API
  const fetchSearchSuggestions = async (input) => {
    if (!input || !location?.lat || !location?.lng) {
      setSearchSuggestions([]);
      return;
    }
    setSuggestionsLoading(true);
    try {
      const apiKey = GOOGLE_API_KEY;
      const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
      const response = await axios.get(url, {
        params: {
          location: `${location.lat},${location.lng}`,
          rankby: 'distance',
          keyword: input,
          type: 'mosque', // Only mosque for now, can be extended
          key: apiKey,
        },
      });
     
      const suggestions = (response.data.results || [])
        .map(place => place.name)

         const suggestionsList = suggestions.filter(item =>
    item.toLowerCase().includes(input.toLowerCase())
  );
// console.log(anNurMosques);
//         .filter((v, i, a) => a.indexOf(v) === i) // unique
//         .slice(0, 5);
      setSearchSuggestions(suggestionsList);
    } catch (e) {
      setSearchSuggestions([]);
    } finally {
      setSuggestionsLoading(false);
    }
  };

  // Debounced suggestion fetch
  useEffect(() => {
    if (debounceTimeout.current) {clearTimeout(debounceTimeout.current);}
    if (isSearchActive && searchQuery.length > 0) {
      debounceTimeout.current = setTimeout(() => {
        fetchSearchSuggestions(searchQuery);
      }, 300);
    } else {
      setSearchSuggestions([]);
    }
    // eslint-disable-next-line
  }, [searchQuery, isSearchActive, location]);

  const handleLoadMore = () => {
    if (loading || isFetchingMore) {return;}
    let nextCount = displayCount;
    if (displayCount === 5) {nextCount = 20;}
    else {nextCount = Math.min(displayCount + 20, 100);}
    if (allPlaces.length >= nextCount || !hasMore) {
      setDisplayCount(nextCount);
      setPlaces(allPlaces.slice(0, nextCount));
    } else if (hasMore && nextPageToken) {
      setDisplayCount(nextCount);
      fetchPlaces({
        tabType: TABS.find(t => t.key === selectedTab)?.type || 'mosque',
        query: isSearchActive ? searchQuery : '',
        pageToken: nextPageToken,
        append: true,
        loc: location,
        countryName: country,
      });
    }
  };

  const visibleTabs = country === 'Malaysia' ?  TABS : [TABS[0]];

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });
  const compactHeaderOpacity = scrollY.interpolate({
    inputRange: [HEADER_SCROLL_DISTANCE - 10, HEADER_SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const handleSearchPress = () => {
    setLastScrollY(scrollY.__getValue ? scrollY.__getValue() : 0);
    setIsSearchActive(true);
    setSearchResultsActive(false);
    requestAnimationFrame(() => {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    });
  };
  const handleSearchClose = () => {
    // Keyboard.dismiss();
    setIsSearchActive(false);
    setSearchQuery('');
    setSearchResultsActive(false);
    setTimeout(() => {
      if (scrollViewRef.current && lastScrollY > 0) {
        scrollViewRef.current.scrollTo({ y: lastScrollY, animated: false });
      }
    }, 100);
  };
  const handleSearchTextChange = (text) => {
    setSearchQuery(text);
    setSearchResultsActive(false);
    if (searchInputRef.current && !searchInputRef.current.isFocused()) {
      searchInputRef.current.focus();
    }
    // Suggestions will be fetched by useEffect
  };
  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchSuggestions([])
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };
  const handleSearchResultPress = (place) => {
    openInGoogleMaps(
      place.geometry.location.lat,
      place.geometry.location.lng,
      place.name
    );
  };

  // Add this handler for suggestion press
  const handleSuggestionPress = (suggestion) => {
    setSearchQuery(suggestion);
    let tabType = TABS.find(t => t.key === selectedTab)?.type || 'mosque';
    fetchPlaces({ tabType, query: suggestion, loc: location, countryName: country });
    setSearchResultsActive(true);
    setSearchSuggestions([]);
    setRecentSearches(prev => {
      if (prev.includes(suggestion)) {return prev;}
      return [suggestion, ...prev].slice(0, 5);
    });
  };

  // Add this handler for recent search press
  const handleRecentSearchPress = (recent) => {
    setSearchQuery(recent);
    let tabType = TABS.find(t => t.key === selectedTab)?.type || 'mosque';
    fetchPlaces({ tabType, query: recent, loc: location, countryName: country });
    setSearchResultsActive(true);
    setSearchSuggestions([]);
  };

  // When searchQuery changes, if user is typing, show suggestions, not results
  useEffect(() => {
    if (searchQuery.length === 0) {
      setSearchResultsActive(false);
    }
  }, [searchQuery]);

  // --- Reset Pagination on Tab/Location/Search Change ---
  useEffect(() => {
    setAllPlaces([]);
    setDisplayCount(5);
    setPlaces([]);
    setNextPageToken(null);
    setHasMore(true);
    setInitialLoad(true);
    let tabType = TABS.find(t => t.key === selectedTab)?.type || 'mosque';
    fetchPlaces({ tabType, loc: location, countryName: country, reset: true });
    // eslint-disable-next-line
  }, [selectedTab, location, country, searchQuery]);

  // --- Update visible places when displayCount or allPlaces changes ---
  useEffect(() => {
    setPlaces(allPlaces.slice(0, displayCount));
  }, [allPlaces, displayCount]);

  const placeIDArr = [
    { id: "ChIJx0z71KVq2jERSBkH72aJoKw" },
    { id: "ChIJzRLxWE0V2jERQbd_-btJWiA" },
    { id: "ChIJJ3MW5ARu2jERye3pgyoib3k" },
    { id: "ChIJ7XRYD9Jo2jERQ3ubBf5syDU" },

    { id: "ChIJLUL90cIS2jER7KbKb3pMgdw" },
    { id: "ChIJy5-AZgAV2jERhHZ6O3ucT0A" },
    { id: "ChIJVzTZmEJt2jER2XRZGnhug5Q" },
   
    { id: "ChIJjW-rokJt2jERsQQJr25cD2Y" },

    
  ];
  // Helper function to check if place ID should have special styling
  const shouldApplyWaqafStyle = (placeId) => {
    return placeIDArr.some(place => place.id === placeId);
  };
  
  const renderPlaceCard = ({ item }) => {
    
    return(
    <View
      style={[
        styles.mosqueCard,
        shouldApplyWaqafStyle(item?.place_id) && styles.mosqueCardWaqaf,
      ]}
    >
      <View style={{marginRight:40}} >
     {shouldApplyWaqafStyle(item?.place_id) && <Text style={styles.mosqueNameWaqaf} numberOfLines={1} >{"Waqaf An-Nur"}</Text>}
      <Text style={styles.mosqueName} numberOfLines={2} >{item.name}</Text>
      <Text style={styles.mosqueLocation}numberOfLines={2} >{item.vicinity || item.formatted_address}</Text>
      <Text style={styles.mosqueDistance}>{item.distance ? `${item.distance.toFixed(2)} km` : ''}</Text>
      </View>
      <TouchableOpacity
        style={styles.directionButton}
        onPress={() => handleSearchResultPress(item)}
      >
        <Arrow_right_worship />
      </TouchableOpacity>
    </View>
  )};

  const renderSearchSuggestion = (suggestion, index) => (
    <TouchableOpacity
      key={index}
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(suggestion)}
      activeOpacity={0.7}
    >
      <Text style={styles.suggestionText}>{suggestion}</Text>
      <Ionicons name="arrow-up-outline" size={16} color="#88909E" style={styles.suggestionIcon} />
    </TouchableOpacity>
  );

  const SearchOverlay = () => (
    <SafeAreaView style={{flex:1,paddingTop:verticalScale(40)}}>
    <View style={styles.searchOverlay}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      {/* <SafeAreaView /> */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.searchBackButton}
          onPress={handleSearchClose}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={24} color="#88909E" />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <TextInput
            ref={searchInputRef}
            style={styles.searchInput}
            placeholder="Search worship places..."
            value={searchQuery}
            onChangeText={handleSearchTextChange}
            placeholderTextColor="#686E7A"
            autoFocus={true}
            blurOnSubmit={false}
            returnKeyType="search"
            clearButtonMode="never"
            autoCapitalize={'none'}
            autoCorrect={false}
            spellCheck={false}
          />
          {/* {searchQuery.length > 0 && ( */}
            <TouchableOpacity
              onPress={handleClearSearch}
              style={styles.clearButton}
              activeOpacity={0.7}
            >
              <Ionicons name="close" size={20} color="#88909E" />
            </TouchableOpacity>
          {/* )} */}
        </View>
      </View>
      <View style={styles.searchContent}>
        {/* Show recent searches if input is empty and not showing results */}
        {searchQuery.length === 0 && !searchResultsActive && recentSearches.length > 0 && (
          <View style={styles.recentSearches}>
            <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
            {recentSearches.map((recent, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.suggestionItem}
                onPress={() => handleRecentSearchPress(recent)}
                activeOpacity={0.7}
              >
                <Text style={styles.suggestionText}>{recent}</Text>
                <Ionicons name="arrow-up-outline" size={16} color="#88909E" style={styles.suggestionIcon} />
              </TouchableOpacity>
            ))}
          </View>
        )}
        {/* Show suggestions if input is not empty and not showing results */}
        {searchQuery.length > 0 && !searchResultsActive && (
          suggestionsLoading ? (
            <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#5756C8" />
          ) : searchSuggestions.length > 0 ? (
            <ScrollView style={styles.recentSearches}>
              {/* <Text style={styles.recentSearchesTitle}>Suggestions</Text> */}
              {searchSuggestions.map((suggestion, idx) =>
                renderSearchSuggestion(suggestion, idx)
              )}
            </ScrollView>
          ) : ( 
            <NoSearchResultsFound />
          )
        )}
        {/* Show results only after suggestion/recent is pressed */}
        {searchResultsActive && (
          loading ? (
            <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#5756C8" />
          ) : error ? (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>{error}</Text>
              <TouchableOpacity onPress={() => fetchPlaces({ tabType: TABS.find(t => t.key === selectedTab)?.type || 'mosque', query: searchQuery, loc: location, countryName: country })}>
                <Text style={{ color: '#5756C8', marginTop: 8 }}>Reload</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{marginVertical:20}}>
            <FlatList
              data={places}
              keyExtractor={item => item.place_id}
              renderItem={renderPlaceCard}
              ListEmptyComponent={<NoSearchResultsFound />}
              onEndReached={handleLoadMore}
              onEndReachedThreshold={0.5}
              ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#5756C8" /> : null}
            />
             </View>
          )
        )}
      </View>
    </View>
              </SafeAreaView>

  );

  // if (isSearchActive) {
  //   return <SearchOverlay />;
  // }


  return (
    <View style={styles.container}>
    {!isSearchActive?<View style={styles.container}>
      <StatusBar barStyle="default" />

      <Animated.View
        style={[
          styles.header,
          {
            transform: [{ translateY: headerTranslate }],
          },
        ]}
      >
        <HeaderImageCarousel
          data={headerCarouselImages}
          height={280}
          showPagination={false}
          autoPlay={false}
        />
        {/* <View style={styles.headerOverlay} /> */}
        <View style={styles.headerContent}>
          <Header
            onBackPress={() => {
              navigation.goBack();
            }}
            headerTitle={'Worship Places'}
            backgroundColor="transparent"
            iconColor="#ffffff"
            textColor="#ffffff"
            leftIcon={<Ionicons name="search" size={24} color="#ffffff" />}
            onPressLeft={handleSearchPress}
          />
          <Animated.View style={[styles.headerTextContainer]}>
            <Text style={styles.headerMainTitle}>Worship Places</Text>
            <Text style={styles.headerSubtitle}>
              Locate nearby worship places with ease.
            </Text>
          </Animated.View>
        </View>
      </Animated.View>
      <Animated.ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: HEADER_MAX_HEIGHT },
        ]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.tabContainer}>
          {visibleTabs.length > 1 && visibleTabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                selectedTab === tab.key && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === tab.key && styles.tabButtonTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        { visibleTabs.length > 1 && <SectionHeader
          title={searchQuery ? `Search Results for "${searchQuery}"` :   selectedTab}
          showSeeAll={false}
          titleStyle={{ fontSize: 15 }}
        />}
        {/* Location Switcher */}
      <View style={styles.locationSwitcher}>
        {LOCATIONS.map(loc => (
          <TouchableOpacity
            key={loc.key}
            style={[
              styles.locationButton,
              selectedLocation === loc.key && styles.locationButtonActive,
            ]}
            onPress={() => setSelectedLocation(loc.key)}
            // disabled={loc.key === 'current' && gettingLocation}
          >
            <Text
              style={[
                styles.locationButtonText,
                selectedLocation === loc.key && styles.locationButtonTextActive,
              ]}
            >
              {loc.label}
              {loc.key === 'current' && gettingLocation ? ' (Getting...)' : ''}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
        {searchQuery && (
          <Text style={styles.resultsCount}>
            {places.length} result{places.length !== 1 ? 's' : ''} found
          </Text>
        )}
        {loading && !isFetchingMore ? (
          <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#5756C8" />
        ) : error ? (
          <View style={styles.noResults}>
            <Text style={styles.noResultsText}>{error}</Text>
            <TouchableOpacity onPress={() => fetchPlaces({ tabType: TABS.find(t => t.key === selectedTab)?.type || 'mosque', loc: location, countryName: country })}>
              <Text style={{ color: '#5756C8', marginTop: 8 }}>Reload</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={places}
            keyExtractor={item => item.place_id}
            renderItem={renderPlaceCard}
            ListEmptyComponent={<NoSearchResultsFound />}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#5756C8" /> : null}
          />
        )}
      </Animated.ScrollView>
      <Animated.View style={[styles.compactHeader, { opacity: compactHeaderOpacity , zIndex:compactHeaderOpacity>.70 ? 999: 1200},]}>
          <Header
            onBackPress={() => {
              navigation.goBack();
            }}
            headerTitle={'Worship Places'}
            backgroundColor="transparent"
            iconColor="#111827"
            textColor="#111827"
            fontWeight={"600"}
            leftIcon={<Ionicons name="search" size={24} color="#111827" />}
            onPressLeft={handleSearchPress}
          />
          {/* <View style={{flexDirection:"row", marginTop:10, gap:10}}>
            {visibleTabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                selectedTab === tab.key && styles.tabButtonActive,
              ]}
              onPress={() => setSelectedTab(tab.key)}
            >
              <Text
                style={[
                  styles.tabButtonText,
                  selectedTab === tab.key && styles.tabButtonTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
          </View> */}
      </Animated.View>
    </View>:SearchOverlay()}
    </View>
  );
};

export const NoSearchResultsFound = () => {
  return (
    <View style={styles.noResults}>
      <Text style={styles.noResultsText}>No search results found</Text>
    </View>
  );
};

export default WorshipPlaces;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    zIndex: 1000,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 42,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal:15,
    marginTop:45,
  },
  headerMainTitle: {
    fontSize: 24,
    fontWeight:'700',
    lineHeight:22,
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 24,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  tabContainer: {
    flexDirection: 'row',
    alignItems:"center",
    // justifyContent:"space-between",
    paddingHorizontal: 15,
    paddingTop: 10,
    gap: 10,
  },
  tabButton: {
    flex:1,
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDE2EB',
  },
  tabButtonActive: {
      backgroundColor: '#5756C8',
   shadowColor: '#000',
  shadowOffset: { width: 3, height: 5 },
  shadowOpacity: 0.15,
  shadowRadius: 5,
  elevation: 6,
  },
  tabButtonText: {
    fontSize: scale(16),
    fontWeight: '400',
    color: '#181B1F',
    alignSelf:"center"
  },
  tabButtonTextActive: {
     fontSize: scale(16),
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  resultsCount: {
    fontSize: 14,
    color: '#686E7A',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  mosqueCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 13,
    padding: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: '#DDE2EB',
    shadowColor: 'rgba(12, 13, 13, 0.05)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  mosqueCardWaqaf: {
    backgroundColor: '#F6F5FF',
    borderColor: '#C9C5FC',
    shadowColor: 'rgba(12, 13, 13, 0.05)',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 2,
  },
  waqafLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5756C8',
    marginBottom: 11,
  },
  mosqueName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181B1F',
    marginBottom: 8,
  },
  mosqueNameWaqaf: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5756C8',
    marginBottom: 8,
  },
  mosqueLocation: {
    fontSize: 14,
    color: '#686E7A',
    fontWeight: '400',
    marginBottom: 12,
  },
  mosqueDistance: {
    fontSize: 14,
    color: '#686E7A',
    fontWeight: '600',
  },
  directionButton: {
    position: 'absolute',
    top: 20,
    right: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  compactHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: 'white',
    zIndex: 1100,
justifyContent:"center",
    alignItems: 'center',
    // paddingHorizontal: 20,
    paddingTop: 30,
    borderBottomColor: '#E5E7EB',
  },
  compactHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    flex: 1,
  },
  searchOverlay: {
    flex: 1,
    backgroundColor: 'white',
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius:10,
    height:48,
  },
  searchBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    padding:0,
  },
  searchInputIcon: {
    marginRight: 8,
  },
  
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#111827',
    fontWeight:'400',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchContent: {
    flex: 1,
    backgroundColor: 'white',
  },
  recentSearches: {
    paddingTop: 20,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionText: {
    fontSize: 16,
    color: '#181B1F',
    fontWeight:'500',
    flex: 1,
    marginLeft:8,
  },
  suggestionIcon: {
    transform: [{rotate: '45deg'}],
  },
  searchResults: {
    paddingTop: 12,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchResultTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  searchResultText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 4,
  },
  searchResultLocation: {
    fontSize: 14,
    color: '#686E7A',
    marginBottom: 2,
  },
  searchResultDistance: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  noResults: {
    // flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  noResultsText: {
    fontSize: 14,
    fontWeight: 400,
    color: '#88909E',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
  locationSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    gap: 8,
  },
  locationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDE2EB',
    marginHorizontal: 4,
  },
  locationButtonActive: {
    backgroundColor: '#5756C8',
    borderColor: '#5756C8',
  },
  locationButtonText: {
    color: '#181B1F',
    fontSize: 15,
    fontWeight: '500',
  },
  locationButtonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
});
