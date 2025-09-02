import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Animated,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    Linking,
    Alert,
    Keyboard,
} from 'react-native';
import muslimBusinesses from "../../assets/images/clinics/muslimBusinesses.png";
import ClinicsHeaderBgSecond from "../../assets/images/clinics/clinics-header-bg-second.png";
import { useNavigation } from '@react-navigation/native';
import Arrow_right_worship from '../../assets/images/WorshipPlaces/arrow_right_worship.svg';
import { scale } from 'react-native-size-matters';
import AnimatedBannerHeader from '../../components/UI/AnimatedBannerHeader';
import CommonScrollableTabs from '../../components/UI/CommonScrollableTabs';
import CommonSearchOverlay from '../../components/UI/CommonSearchOverlay';
import axios from 'axios';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import CommonLocationTabs from '../../components/UI/CommonLocationTabs';
import GooglePlacesItemList from '../../components/UI/GooglePlacesItemList';
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



const HEADER_MAX_HEIGHT = 282;
const FEATURES = ['Halal Cafe & Restaurants', 'Muslimah-frie',]

const headerCarouselImages = [
    { image: muslimBusinesses, accessibilityLabel: 'Klinik Waqaf An-Nur' },
    { image: ClinicsHeaderBgSecond, accessibilityLabel: 'Klinik Waqaf An-Nur' },
];
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

const MuslimBusinessesScreen = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('All');
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
    const [allFilteredClinics, setAllFilteredClinics] = useState([]);

    useEffect(() => {
        if (!initialLoad) {
            let tabType = FEATURES.find(tab => tab === selectedTab) || 'Halal Cafe & Restaurants';
            fetchPlaces({ tabType, loc: location, countryName: country });
        }
        // eslint-disable-next-line
    }, [selectedTab]);
    useEffect(() => {
        if (searchQuery.length === 0) {
            setSearchResultsActive(false);
        }
    }, [searchQuery]);
    useEffect(() => {
        setPlaces(allPlaces.slice(0, displayCount));
    }, [allPlaces, displayCount]);

    // --- Reset Pagination on Tab/Location/Search Change ---
    useEffect(() => {
        setAllPlaces([]);
        setDisplayCount(5);
        setPlaces([]);
        setNextPageToken(null);
        setHasMore(true);
        setInitialLoad(true);
        let tabType = FEATURES.find(tab => tab === selectedTab) || 'Halal Cafe & Restaurants';
        fetchPlaces({ tabType, loc: location, countryName: country, reset: true });
        // eslint-disable-next-line
    }, [selectedTab, location, country, searchQuery]);

    // --- Search Query Change (Debounced) ---
    useEffect(() => {
        if (debounceTimeout.current) { clearTimeout(debounceTimeout.current); }
        if (isSearchActive && searchQuery.length > 0) {
            debounceTimeout.current = setTimeout(() => {
                let tabType = FEATURES.find(tab => tab === selectedTab) || 'Halal Cafe & Restaurants';
                fetchPlaces({ tabType, query: searchQuery, loc: location, countryName: country });
            }, 500);
        } else if (isSearchActive && searchQuery.length === 0) {
            let tabType = FEATURES.find(tab => tab === selectedTab) || 'Halal Cafe & Restaurants';
            fetchPlaces({ tabType, loc: location, countryName: country });
        }
        // eslint-disable-next-line
    }, [searchQuery, isSearchActive]);


    // Debounced suggestion fetch
    useEffect(() => {
        if (debounceTimeout.current) { clearTimeout(debounceTimeout.current); }
        if (isSearchActive && searchQuery.length > 0) {
            debounceTimeout.current = setTimeout(() => {
                fetchSearchSuggestions(searchQuery);
            }, 300);
        } else {
            setSearchSuggestions([]);
        }
        // eslint-disable-next-line
    }, [searchQuery, isSearchActive, location]);

    useEffect(() => {
        (async () => {
            setLocation(LOCATIONS[1].coords); // Malaysia
            setCountry('Malaysia');
            setSelectedTab('Halal Cafe & Restaurants');
            fetchPlaces({ tabType: 'Halal Cafe & Restaurants', loc: LOCATIONS[1].coords, countryName: 'Malaysia' });
        })();
    }, []);
    useEffect(() => {
        (async () => {
            if (selectedLocation === 'current') {
                try {
                    const coords = await getCurrentLocation();

                    setCurrentCoords(coords);
                    setLocation({ lat: coords.latitude, lng: coords.longitude });
                    const countryName = await fetchCountry(coords.latitude, coords.longitude);
                    setCountry(countryName);
                    setSelectedTab('Halal Cafe & Restaurants');
                    fetchPlaces({ tabType: 'Halal Cafe & Restaurants', loc: { lat: coords.latitude, lng: coords.longitude }, countryName });
                } catch {
                    // fallback to Malaysia
                    setSelectedLocation('malaysia');
                }
            } else if (selectedLocation === 'malaysia') {
                setLocation(LOCATIONS[1].coords);
                setCountry('Malaysia');
                setSelectedTab('Halal Cafe & Restaurants');
                fetchPlaces({ tabType: 'Halal Cafe & Restaurants', loc: LOCATIONS[1].coords, countryName: 'Malaysia' });
            } else if (selectedLocation === 'singapore') {
                setLocation(LOCATIONS[2].coords);
                setCountry('Singapore');
                setSelectedTab('Halal Cafe & Restaurants');
                fetchPlaces({ tabType: 'Halal Cafe & Restaurants', loc: LOCATIONS[2].coords, countryName: 'Singapore' });
            }
        })();
        // eslint-disable-next-line
    }, [selectedLocation]);

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
                    type: 'Halal Cafe & Restaurants', // Only mosque for now, can be extended
                    key: apiKey,
                },
            });
            const suggestions = (response.data.results || [])
                .map(place => place.name)
                .filter((v, i, a) => a.indexOf(v) === i) // unique
                .slice(0, 5);
            setSearchSuggestions(suggestions);
        } catch (e) {
            setSearchSuggestions([]);
        } finally {
            setSuggestionsLoading(false);
        }
    };

    const openInGoogleMaps = (lat, lng, name) => {
        const url = Platform.select({

            ios: `http://maps.apple.com/?daddr=${lat},${lng}`,
            android: `geo:${lat},${lng}?q=${encodeURIComponent(name)}`,
        });
        Linking.openURL(url);
    };
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
        if (!append) { setLoading(true); }
        else { setIsFetchingMore(true); }
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
                    type: tabType === 'Halal Cafe & Restaurants' ? 'restaurant' : 'clothing_store store', //['restaurant', 'food', 'point_of_interest', 'establishment']
                    keyword: tabType === 'Halal Cafe & Restaurants' ? 'halal restaurant OR halal cafe' : 'muslimah OR muslimah-friendly OR hijab',  // keyword-based search
                    key: GOOGLE_API_KEY,
                    pagetoken: pageToken,
                };
            }

            Object.keys(params).forEach(
                key => params[key] === undefined && delete params[key]
            );
            const res = await axios.get(url, { params });
            let results = res.data.results || [];
            console.log("placess result1", results)
            results = results.map(place => ({
                ...place,
                distance: getDistanceFromLatLonInKm(
                    loc.lat,
                    loc.lng,
                    place.geometry.location.lat,
                    place.geometry.location.lng
                ),
            }));
            console.log("placess result-2", results)
            results.sort((a, b) => a.distance - b.distance);
            console.log("placess result-3", results)
            let newAllPlaces = append ? [...allPlaces, ...results] : results;
            if (newAllPlaces.length > 100) { newAllPlaces = newAllPlaces.slice(0, 100); }
            setAllPlaces(newAllPlaces);
            let newDisplayCount = displayCount;
            if (reset) { newDisplayCount = 5; }
            if (!append && !reset) { newDisplayCount = displayCount; }
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

    const handleSearchResultPress = (place) => {
        openInGoogleMaps(
            place.geometry.location.lat,
            place.geometry.location.lng,
            place.name
        );
    };


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
                    if (info?.coords) {
                        coords = info?.coords;
                        setGettingLocation(false);
                        setCurrentCoords(coords);
                        setLocation({ lat: coords.latitude, lng: coords.longitude });
                        const countryName = await fetchCountry(coords.latitude, coords.longitude);
                        setCountry(countryName);
                        setSelectedTab('Halal Cafe & Restaurants');
                        fetchPlaces({ tabType: 'Halal Cafe & Restaurants', loc: { lat: coords.latitude, lng: coords.longitude }, countryName });
                    } else {

                    }
                });
                return coords;
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
    const handleSearchPress = () => {
        setIsSearchActive(true);
        setSearchResultsActive(false);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const handleSearchClose = () => {
        // Keyboard.dismiss();
        setIsSearchActive(false);
        // setSearchQuery('');
        // setSearchResultsActive(false);
        // setTimeout(() => {
        //   if (scrollViewRef.current && lastScrollY > 0) {
        //     scrollViewRef.current.scrollTo({ y: lastScrollY, animated: false });
        //   }
        // }, 100);
    };

    const handleSearchTextChange = (text) => {
        setSearchQuery(text);
        setSearchResultsActive(false);
        // if (searchInputRef.current && !searchInputRef.current.isFocused()) {
        //   searchInputRef.current.focus();
        // }
        // Suggestions will be fetched by useEffect
    };


    // Add this handler for suggestion press
    const handleSuggestionPress = (suggestion) => {
        Keyboard.dismiss()
        setSearchQuery(suggestion);
        let tabType = FEATURES.find(item => item === selectedTab) || 'Halal Cafe & Restaurants';
        fetchPlaces({ tabType, query: suggestion, loc: location, countryName: country });
        setSearchResultsActive(true);
        setSearchSuggestions([]);
        setRecentSearches(prev => {
            if (prev.includes(suggestion)) { return prev; }
            return [suggestion, ...prev].slice(0, 5);
        });
    };
    // Add this handler for recent search press
    const handleRecentSearchPress = (recent) => {
        Keyboard.dismiss()
        setSearchQuery(recent);
        let tabType = FEATURES.find(tab => tab === selectedTab) || 'Halal Cafe & Restaurants';
        fetchPlaces({ tabType, query: recent, loc: location, countryName: country });
        setSearchResultsActive(true);
        setSearchSuggestions([]);
    };
    const handleLoadMore = () => {
        if (loading || isFetchingMore) { return; }
        let nextCount = displayCount;
        if (displayCount === 5) { nextCount = 20; }
        else { nextCount = Math.min(displayCount + 20, 100); }
        if (allPlaces.length >= nextCount || !hasMore) {
            setDisplayCount(nextCount);
            setPlaces(allPlaces.slice(0, nextCount));
        } else if (hasMore && nextPageToken) {
            setDisplayCount(nextCount);
            fetchPlaces({
                tabType: FEATURES.find(tab => tab === selectedTab) || 'Halal Cafe & Restaurants',
                query: isSearchActive ? searchQuery : '',
                pageToken: nextPageToken,
                append: true,
                loc: location,
                countryName: country,
            });
        }
    };


    return (
        <View style={styles.container}>
            {!isSearchActive ? (
                <View style={[styles.container, { position: 'relative' }]}>
                    <StatusBar barStyle="default" />
                    <AnimatedBannerHeader
                        scrollY={scrollY}
                        title="Muslim Businesses"
                        subTitle="Discover nearby halal cafes & eateries."
                        searchActivePress={handleSearchPress}
                        headerCarouselImages={headerCarouselImages}
                    />
                    {/* Scrollable content */}
                    <Animated.ScrollView
                        ref={scrollViewRef}
                        style={styles.scrollView}
                        contentContainerStyle={[
                            styles.scrollContent,
                            { paddingTop: HEADER_MAX_HEIGHT },
                        ]}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                            { useNativeDriver: false }
                        )}
                        scrollEventThrottle={16}
                    >
                        <CommonScrollableTabs
                            renderData={FEATURES}
                            selectedTab={selectedTab}
                            setSelectedTab={setSelectedTab}
                            matchingTab="Mobile Klinik"
                        />
                        <CommonLocationTabs
                            renderData={LOCATIONS}
                            selectedLocation={selectedLocation}
                            gettingLocation={gettingLocation}
                            setSelectedLocation={setSelectedLocation}
                        />
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
                            <GooglePlacesItemList
                                handleSearchResultPress={handleSearchResultPress}
                                renderData={places}
                                handleLoadMore={handleLoadMore}
                                isFetchingMore={isFetchingMore}
                                placeIDArr={placeIDArr}
                            />
                        )}

                    </Animated.ScrollView>
                    <View style={styles.footerContainer}>
                        <Text style={{ fontSize: scale(12), fontWeight: '400', color: '#686E7A', textAlign: 'center' }}>Sourced via Google. Confirm Halal or Muslim- {'\n'}friendly status directly with the business.</Text>
                    </View>
                </View>
            ) : (
                <CommonSearchOverlay
                    places={places}
                    handleSearchClose={handleSearchClose}
                    handleClearSearch={handleClearSearch}
                    fetchPlacesAgain={() => fetchPlaces({ tabType: FEATURES.find(tab => tab === selectedTab) || 'Halal Cafe & Restaurants', query: searchQuery, loc: location, countryName: country })}
                    handleSearchTextChange={handleSearchTextChange}
                    handleSuggestionPress={handleSuggestionPress}
                    handleRecentSearchPress={handleRecentSearchPress}
                    handleSearchResultPress={handleSearchResultPress}
                    searchSuggestions={searchSuggestions}
                    searchQuery={searchQuery}
                    searchResultsActive={searchResultsActive}
                    recentSearches={recentSearches}
                    suggestionsLoading={suggestionsLoading}
                    isFetchingMore={isFetchingMore}
                    error={error}
                    loading={loading}
                    handleLoadMore={handleLoadMore}
                    placeIDArr={placeIDArr}
                />
            )}
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

export default MuslimBusinessesScreen;

const styles = StyleSheet.create({
    compactHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        paddingTop: StatusBar.currentHeight || 42,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
    },

    compactHeaderContent: {
        height: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },

    compactHeaderTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
        textAlign: 'center',
        flex: 1,
    },

    noResultsText: {
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 8,
    },


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

    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },


    searchResults: {
        paddingTop: 12,
    },

    noResults: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop:20
        // paddingVertical: 60,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        paddingTop: 20,
        paddingBottom: 40,
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        paddingHorizontal: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 3,
        zIndex: 2000
    }
});
