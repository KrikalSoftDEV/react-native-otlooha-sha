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
import ClinicsHeaderBgFirst from "../../assets/images/clinics/clinics-header-bg.png";
import ClinicsHeaderBgSecond from "../../assets/images/clinics/clinics-header-bg-second.png";
import { useNavigation } from '@react-navigation/native';
import Arrow_right_worship from '../../assets/images/WorshipPlaces/arrow_right_worship.svg';
import ClinicMobileIcon from '../../assets/images/WorshipPlaces/clinic-mobile-icon.svg';
import { scale } from 'react-native-size-matters';
import { kliniksAndDialisisData } from './clinicsData';
import Geolocation from '@react-native-community/geolocation';
import { check, request, PERMISSIONS, RESULTS, openSettings } from 'react-native-permissions';
import AnimatedBannerHeader from '../../components/UI/AnimatedBannerHeader';
import CommonScrollableTabs from '../../components/UI/CommonScrollableTabs';
import CommonSearchOverlay from '../../components/UI/CommonSearchOverlay';
import GooglePlacesItemLIst from '../../components/UI/GooglePlacesItemList';
import axios from 'axios';

const FEATURES = ['All', 'Klinik', 'Mobile Klinik', 'Dialisis',]

const GOOGLE_API_KEY = 'AIzaSyBGfHgV2LSC1uZcwpgGqA04N2ilT9kJGdQ';

const headerCarouselImages = [
    { image: ClinicsHeaderBgFirst, accessibilityLabel: 'Klinik Waqaf An-Nur' },
    { image: ClinicsHeaderBgSecond, accessibilityLabel: 'Klinik Waqaf An-Nur' },
];
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
const ClinicsScreen = () => {
    const navigation = useNavigation();
    const [selectedTab, setSelectedTab] = useState('All');
    const [location, setLocation] = useState(LOCATIONS[1].coords);
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [isFetchingMore, setIsFetchingMore] = useState(false);
    const [recentSearches, setRecentSearches] = useState([]);
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const scrollY = useRef(new Animated.Value(0)).current;
    const scrollViewRef = useRef(null);
    const [searchResultsActive, setSearchResultsActive] = useState(false);
    const [allFilteredClinics, setAllFilteredClinics] = useState([]);
    const debounceTimeout = useRef(null);
    const HEADER_MAX_HEIGHT = 282;
    const HEADER_MIN_HEIGHT = 10;
    const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

    useEffect(() => {
        if (searchResultsActive && searchQuery.length > 0) {
            if (debounceTimeout.current) { 
                clearTimeout(debounceTimeout.current); 
            }
            const query = searchQuery.toLowerCase();
            debounceTimeout.current = setTimeout(() => {
                const result = kliniksAndDialisisData.filter(clinic =>
                    clinic.name.toLowerCase().includes(query)
                );
                setAllFilteredClinics(result);
            }, 200);
        } else if (selectedTab === 'All') {
            setAllFilteredClinics(kliniksAndDialisisData);
        } else if (selectedTab === 'Klinik') {
            setAllFilteredClinics(kliniksAndDialisisData.filter(clinic => clinic.klinik === true));
        } else if (selectedTab === 'Dialisis') {
            setAllFilteredClinics(kliniksAndDialisisData.filter(clinic => clinic.dialisis === true));
            // }else if(selectedTab === 'Mobile Klinik'){
            // setAllFilteredClinics(kliniksAndDialisisData.filter(clinic => clinic.klinik === true && clinic.dialisis === true));
            // }else if(selectedTab === 'Mobile Klinik'){
            // setAllFilteredClinics(kliniksAndDialisisData.filter(clinic => clinic.klinik === true && clinic.dialisis === false));
            // }else if(selectedTab === 'Dialisis'){
            // setAllFilteredClinics(kliniksAndDialisisData.filter(clinic => clinic.dialisis === true));
            // }else if(selectedTab === 'Mobile Klinik'){
            // setAllFilteredClinics(kliniksAndDialisisData.filter(clinic => clinic.klinik === true && clinic.dialisis === true));
            // }else if(selectedTab === 'Mobile Klinik'){
            // setAllFilteredClinics(kliniksAndDialisisData.filter(clinic => clinic.klinik === true && clinic.dialisis === false));
            // }else if(selectedTab === 'Dialisis'){
            // setAllFilteredClinics(kliniksAndDialisisData.filter(clinic => clinic.dialisis === true));
            // }else if(selectedTab === 'Mobile Klinik'){
            // setAllFilteredClinics(kliniksAndDialisisData.filter(clinic => clinic.klinik === true && clinic.dialisis === true));
            // }    

        } else {

        }
    }, [selectedTab, searchResultsActive, searchQuery]);

    //  useEffect(() => {
    //     if (selectedTab === 'All') {
    //         setAllFilteredClinics(kliniksAndDialisisData);
    //     } else {
    //         const result = kliniksAndDialisisData.filter((clinic) => {
    //             if (selectedTab === 'Klinik') {
    //                 return clinic.klinik === true;
    //             } else if (selectedTab === 'Dialisis') {
    //                 return clinic.dialisis === true;
    //             }
    //             return false;
    //         });
    //         // console.log('Filtered Clinics:', result);
    //         setAllFilteredClinics(result);
    //     }
    // }, [selectedTab]);

    // Debounced suggestion fetch
    // useEffect(() => {
    //     if (debounceTimeout.current) { clearTimeout(debounceTimeout.current); }
    //     if (isSearchActive && searchQuery.length > 0) {
    //         debounceTimeout.current = setTimeout(() => {
    //             fetchSearchSuggestions(searchQuery);
    //         }, 300);
    //     } else {
    //         setSearchSuggestions([]);
    //     }
    // }, [searchQuery, isSearchActive]);

    // const openInGoogleMaps = (lat, lng, name) => {
    //     const url = Platform.select({
    //         ios: `http://maps.apple.com/?daddr=${lat},${lng}`,
    //         android: `geo:${lat},${lng}?q=${encodeURIComponent(name)}`,
    //     });
    //     Linking.openURL(url);
    // };
    const fetchSearchSuggestions = async (input) => {
        console.log('Fetching search suggestions for:', input);
        if (!input || !location?.lat || !location?.lng) {
            console.log('Fetching search !location?.lat for:', input);
            setSearchSuggestions([]);
            return;
        }
        setSuggestionsLoading(true);

        try {
            const query = (input || '').toLowerCase();

            const result = (kliniksAndDialisisData || [])
                .filter(clinic =>
                    clinic?.name?.toLowerCase().includes(query)
                )
                .slice(0, 5);
            console.log('Filtered Clinics:', result);

            setSearchSuggestions([...result.map(clinic => clinic.name)]);

        } catch (e) {
            console.error(e);
            setSearchSuggestions([]);
        } finally {
            setSuggestionsLoading(false);
        }

        //  try {
        //     const apiKey = GOOGLE_API_KEY;
        //     const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
        //     const response = await axios.get(url, {
        //         params: {
        //             location: `${location.lat},${location.lng}`,
        //             rankby: 'distance',
        //             keyword: input,
        //             // type: 'Halal Cafe & Restaurants', // Only mosque for now, can be extended
        //             type: 'hospital',         
        //             key: apiKey,
        //         },
        //     });
        //     const suggestions = (response.data.results || [])
        //         .map(place => place.name)
        //         .filter((v, i, a) => a.indexOf(v) === i) // unique
        //         .slice(0, 5);
        //     setSearchSuggestions(suggestions);
        // } catch (e) {
        //     setSearchSuggestions([]);
        // } finally {
        //     setSuggestionsLoading(false);
        // }
    };

    const compactHeaderOpacity = scrollY.interpolate({
        inputRange: [HEADER_SCROLL_DISTANCE - 50, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    // const handleSearchResultPress = (place) => {
    //     openInGoogleMaps(
    //         place.geometry.location.lat,
    //         place.geometry.location.lng,
    //         place.name
    //     );
    // };
    // Add this handler for suggestion press
    const handleSuggestionPress = (suggestion) => {
        Keyboard.dismiss()
        setSearchQuery(suggestion);
        // let tabType = FEATURES.find(item => item === selectedTab) || 'Halal Cafe & Restaurants';
        // fetchPlaces({ tabType, query: suggestion, loc: location, countryName: country });
        setSearchResultsActive(true);
        setSearchSuggestions([]);
        // setRecentSearches(prev => {
        //     if (prev.includes(suggestion)) { return prev; }
        //     return [suggestion, ...prev].slice(0, 5);
        // });
    };
    const handleSearchResultPress = async (item) => {
        if (!item.map_url) {
            Alert.alert('Location not available', 'No map URL is provided for this clinic.');
            return;
        }

        const canOpen = await Linking.canOpenURL(item.map_url);
        if (canOpen) {
            Linking.openURL(item.map_url);
        } else {
            Alert.alert('Cannot open location', 'This map URL cannot be opened on your device.');
        }
    };
    const handleSearchTextChange = (text) => {
        setSearchQuery(text);
        // setSearchResultsActive(false); 
        setSearchResultsActive(true);
    };

    const handleSearchPress = () => {
        setIsSearchActive(true);
        setSearchResultsActive(false);
    };
    const handleSearchClose = () => {
        setIsSearchActive(false);
        setSearchQuery('');
    };

    const handleClearSearch = () => {
        setSearchQuery('');
    };

    const renderPlaceCard = ({ item }) => {
        return (
            <View
                style={[
                    styles.mosqueCard,
                ]}
            >
                <View style={{ marginRight: 40 }} >
                    {selectedTab === "All" && <View style={{ flexDirection: "row" }}>
                        <Text style={styles.mosqueNameWaqaf}
                        >{(item.klinik && item.dialisis) ? "Klinik • Dialisis" : item.klinik ? "Klinik" : "Dialisis"}
                        </Text>
                        {/* {item.tags?.map((item) => (

                            <Text style={styles.mosqueNameWaqaf}
                            >{item}
                            </Text>
                        ))} */}
                    </View>}
                    <Text style={styles.mosqueName} numberOfLines={2} >{item.name}</Text>
                    <Text style={styles.mosqueLocation} numberOfLines={2} >{item.address}</Text>
                    {item.phone && <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 0 }}>
                        <ClinicMobileIcon width={16} height={16} />
                        <Text style={[styles.mosqueDistance, { marginLeft: 5 }]}>{item.phone}</Text>
                    </View>}
                </View>
                <TouchableOpacity
                    style={styles.directionButton}
                    onPress={() => handleSearchResultPress(item.map_url)}
                >
                    <Arrow_right_worship />
                </TouchableOpacity>
            </View>
        )
    };

    return (
        <>
            {!isSearchActive ? (
                <View style={styles.container}>
                    <StatusBar barStyle="default" />
                    <AnimatedBannerHeader
                        scrollY={scrollY}
                        title="Klinik Waqaf An-Nur"
                        subTitle="Faith-driven care, sustained by Waqaf."
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
                        {/* <FlatList
                            data={allFilteredClinics}
                            keyExtractor={(item) => item.id}
                            renderItem={renderPlaceCard}
                            ListEmptyComponent={<NoSearchResultsFound />}
                            onEndReachedThreshold={0.5}
                            contentContainerStyle={{ marginVertical: 35 }}
                            ListFooterComponent={
                                isFetchingMore ? (
                                    <ActivityIndicator size="small" color="#5756C8" />
                                ) : null
                            }
                        /> */}
                        {/* {loading && !isFetchingMore ? (
                        <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#5756C8" />
                    ) : error ? (
                        <View style={styles.noResults}>
                            <Text style={styles.noResultsText}>{error}</Text>
                            <TouchableOpacity onPress={() => fetchPlaces({ tabType: TABS.find(t => t.key === selectedTab)?.type || 'mosque', loc: location, countryName: country })}>
                                <Text style={{ color: '#5756C8', marginTop: 8 }}>Reload</Text>
                            </TouchableOpacity>
                        </View>
                    ) : ( */}
                        <GooglePlacesItemLIst
                            handleSearchResultPress={handleSearchResultPress}
                            renderData={allFilteredClinics}
                            handleLoadMore={() => { }}
                            selectedTab={selectedTab}
                            screen="Klinik"
                        // isFetchingMore={isFetchingMore}
                        // placeIDArr={placeIDArr}
                        />
                        {/* )} */}
                    </Animated.ScrollView>
                </View>
            ) : (
                <CommonSearchOverlay
                    places={allFilteredClinics}
                    handleSearchClose={handleSearchClose}
                    handleClearSearch={handleClearSearch}
                    fetchPlacesAgain={() => { }}
                    handleSearchTextChange={handleSearchTextChange}
                    handleSuggestionPress={handleSuggestionPress}
                    // handleRecentSearchPress={handleRecentSearchPress}
                    // handleSearchResultPress={handleSearchResultPress}
                    searchSuggestions={searchSuggestions}
                    searchQuery={searchQuery}
                    searchResultsActive={searchResultsActive}
                    recentSearches={recentSearches}
                // suggestionsLoading={suggestionsLoading}
                // isFetchingMore={isFetchingMore}
                // error={error}
                // loading={loading}
                // handleLoadMore={handleLoadMore}
                // placeIDArr={placeIDArr}
                />
            )
            }
        </>
    );

};

export const NoSearchResultsFound = () => {
    return (
        <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No results found</Text>
        </View>
    );
};

export default ClinicsScreen;

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
    noResultsText: {
        fontSize: scale(16),
        color: '#686E7A',
        fontWeight: '500',
    },
    mosqueCard: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 14,
        padding: 16,
        position: 'relative',
        borderWidth: 1,
        borderColor: '#DDE2EB',
        shadowColor: 'rgba(12, 13, 13, 0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 4,
    },
    mosqueName: {
        fontSize: scale(16),
        fontWeight: '500',
        color: '#181B1F',
        marginBottom: 8,
    },
    mosqueNameWaqaf: {
        marginRight: 5,
        fontSize: scale(14),
        fontWeight: '600',
        color: '#5756C8',
        marginBottom: 8,
    },
    mosqueLocation: {
        fontSize: scale(14),
        color: '#686E7A',
        fontWeight: '400',
        marginBottom: 12,
    },
    mosqueDistance: {
        fontSize: scale(14),
        color: '#686E7A',
        fontWeight: '600',
    },
    directionButton: {
        position: 'absolute',
        top: 14,
        right: 10,
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },

    searchResults: {
        paddingTop: 12,
    },

    noResults: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },



});
