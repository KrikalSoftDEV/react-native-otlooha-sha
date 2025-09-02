import React, {useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Animated,
  Platform,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import textinput_calander_gray from '../../assets/images/Calender/textinput_calander_gray.png';
import {SectionHeader} from '../donation/DonationTypeList';
import {WelcomeButton} from '../../components/UI/Button';
import {NAVIGATIONBAR_HEIGHT} from '../../constants/Dimentions';
import {useNavigation, useRoute} from '@react-navigation/native';
import Header from '../../components/UI/Header';
import {scale, verticalScale} from 'react-native-size-matters';
import UserEnrolSuccessModal from '../signup/UserEnrolSuccessModal';
import EventRegisterGuestModal from './EventRegisterGuestModal';
import moment from 'moment';
import Location from '../../assets/images/Events/location.svg';
import EventOpenLinkIcon from "../../assets/images/Events/event-open-link-icon.png"
import videoCamera from '../../assets/images/Events/videoCamera.png';
import {useDispatch, useSelector} from 'react-redux';
import {
  getEventDetails,
  participateInEvent,
  getEventList,
} from '../../redux/slices/eventSlice';
import HeaderImageCarousel from '../common/HeaderImageCarousel';
import { useLoading } from '../../context/LoadingContext';

const {width, height} = Dimensions.get('window');
var data1=[
  {
    "id": 692,
    "eventId": 2,
    "filePath": "https://s3.ap-southeast-5.amazonaws.com/s3uat-giveplease.com.my/Charity/WAN/EventImages/1753790911393_9577.jpg?X-Amz-Expires=360000&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAY7EVCTI6W3LMEA6O%2F20250801%2Fap-southeast-5%2Fs3%2Faws4_request&X-Amz-Date=20250801T095027Z&X-Amz-SignedHeaders=host&X-Amz-Signature=8dad4cc8be93e140e7af6d0bf120fc4f5c166ff02fd888e30326bc09c80f5476"
  },
  {
    "id": 693,
    "eventId": 3,
    "filePath": "https://s3.ap-southeast-5.amazonaws.com/s3uat-giveplease.com.my/Charity/WAN/EventImages/1753790911393_9577.jpg?X-Amz-Expires=360000&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAY7EVCTI6W3LMEA6O%2F20250801%2Fap-southeast-5%2Fs3%2Faws4_request&X-Amz-Date=20250801T095027Z&X-Amz-SignedHeaders=host&X-Amz-Signature=8dad4cc8be93e140e7af6d0bf120fc4f5c166ff02fd888e30326bc09c80f5476"
  },
  {
    "id": 694,
    "eventId": 4,
    "filePath": "https://s3.ap-southeast-5.amazonaws.com/s3uat-giveplease.com.my/Charity/WAN/EventImages/1753790911393_9577.jpg?X-Amz-Expires=360000&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAY7EVCTI6W3LMEA6O%2F20250801%2Fap-southeast-5%2Fs3%2Faws4_request&X-Amz-Date=20250801T095027Z&X-Amz-SignedHeaders=host&X-Amz-Signature=8dad4cc8be93e140e7af6d0bf120fc4f5c166ff02fd888e30326bc09c80f5476"
  }

]
const EventsDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const {
    eventDetails,
    eventDetailsLoading,
    eventDetailsError,
    participateInEventLoading,
    participateInEventError,
  } = useSelector(state => state.event);
  const {eventId, orgId} = route.params || {};
  const userInfo = useSelector(state => state.app.userInfo);
  const [selectedTab, setSelectedTab] = useState('Mosques');
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollY = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const guestInfo = useSelector(state => state.app.guestInfo);
  const [modalGuestVisible, setModalGuestVisible] = useState(false);

  React.useEffect(() => {
    if (eventId) {
      dispatch(getEventDetails({eventId, orgId: orgId || 4}));
    }
  }, [dispatch, eventId, orgId]);

  const data = eventDetails;
  const HEADER_MAX_HEIGHT = 282;
  const HEADER_MIN_HEIGHT = 88;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 1, 0],
    extrapolate: 'clamp',
  });

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
    // Use requestAnimationFrame to ensure the search overlay is rendered before focusing
    requestAnimationFrame(() => {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    });
  };

  const handleSearchClose = () => {
    Keyboard.dismiss();
    setIsSearchActive(false);
    setSearchQuery('');
    setTimeout(() => {
      if (scrollViewRef.current && lastScrollY > 0) {
        scrollViewRef.current.scrollTo({y: lastScrollY, animated: false});
      }
    }, 100);
  };

  const handleSuggestionPress = suggestion => {
    setSearchQuery(suggestion);
    // Don't close search, just update the query and keep keyboard open
    // Keep the input focused
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 100);
  };

  const handleSearchResultPress = mosque => {
    // Handle navigation to mosque details or any other action
    // You can navigate to mosque details here
    // navigation.navigate('MosqueDetails', { mosque });
  };

  const handleSearchTextChange = text => {
    setSearchQuery(text);
    // Ensure input stays focused
    if (searchInputRef.current && !searchInputRef.current.isFocused()) {
      searchInputRef.current.focus();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    // Keep input focused after clearing
    setTimeout(() => {
      searchInputRef.current?.focus();
    }, 50);
  };

  // Handle event participation
  const handleParticipate = async () => {
    if (guestInfo !== null) {
      setModalGuestVisible(true);
      return;
    }
    // if (userInfo === null) {
    //   setModalVisible(true);
    //   return;
    // }
    try {


      const resultAction = await dispatch(
        participateInEvent({eventId, orgId: orgId || 4}),
      );
      if (participateInEvent.fulfilled.match(resultAction)) {
        navigation.navigate('Otp_success', {type: 'Event'});
        // Refresh event details and event list
        dispatch(getEventDetails({eventId, orgId: orgId || 4}));
        dispatch(
          getEventList({pageNumber: 1, pageSize: 20, orgId: orgId || 4}),
        );

      }
    } catch (e) {
      // Optionally handle error
    }
  };

  const onRegisterPress = () => {

    setModalVisible(false);
    navigation.replace('SignUp_2');
  };
  const onRegisterPress1 = () => {

    setModalGuestVisible(false);
    navigation.navigate('SignUp_2', {userType: 'SignUp',guestUserFlag:"event"});
  };
console.log(data?.eventDetails?.meetingLink,'check the meeting linnk')
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="default" />
      {/* Fixed Header */}
      {eventDetailsLoading ? (
        <ActivityIndicator
          size={'large'}
          style={styles.loader}
          color="#007AFF" />
      ) : // <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        //   <Text>Loading event details...</Text>
        // </View>
        eventDetailsError ? (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Text style={{color: 'red'}}>{eventDetailsError}</Text>
          </View>
        ) : data ? (
          <>
            <Animated.View
              style={[
                styles.header,
                {
      transform: [{translateY: headerTranslate}],
                },
              ]}
              pointerEvents="box-none" // Add this line
            >
              {(data?.eventImages?.length < 2 ? (
                <View
                  style={{
                    borderBottomStartRadius: 20,
                    borderBottomEndRadius: 20,
                    overflow: 'hidden',
                  }}>
                  <Animated.Image
                    source={{
                      uri:
                        data?.eventImages && data?.eventImages?.length > 0
                          ? data?.eventImages[0]?.filePath
                          : '',
                    }}
                    style={[styles.headerImage]}
                  />
                </View>
              ) : (
    <View pointerEvents="box-none"  style={{ 
                  // height:280, 
                  zIndex: 1000, // Add high z-index
                  // elevation: 1000, // For Android
                }} >
                  {/* <TouchableOpacity  
        style={{   height:280, 
          // width:280,
          backgroundColor:'red', flex:1
        }} 
        onPress={() => {Alert.alert('shivam')}} 
      > */}
                  <HeaderImageCarousel
                    data={data?.eventImages}
                    height={280}
                    imageKey="filePath"
                    showPagination={true}
                    autoPlay={true}
                    backIconShow={true}
                  />

                  {/* </TouchableOpacity> */}
                </View>
              ))}

              <View style={styles.headerContent}>
                <Header
                  onBackPress={() => {
                    navigation.goBack();
                  }}
                  backgroundColor="transparent"
                  iconColor="#fff"
                  leftIcon={
        <TouchableOpacity onPress={() => {}}></TouchableOpacity>
                  }
                />
                <Animated.View style={[styles.headerTextContainer]}>
                  <Text style={styles.headerMainTitle}></Text>
                  <Text style={styles.headerSubtitle}></Text>
                </Animated.View>
              </View>
            </Animated.View>
            <Animated.ScrollView
              ref={scrollViewRef}
              style={[styles.scrollView, styles.content]}
              contentContainerStyle={[
                styles.scrollContent,
              {paddingTop: HEADER_MAX_HEIGHT},
              ]}
              onScroll={Animated.event(
              [{nativeEvent: {contentOffset: {y: scrollY}}}],
              {useNativeDriver: false},
              )}
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}>
              {/* Title */}
              <Text style={styles.title}>
                {data?.eventDetails?.name?.replace(/\s+/g, ' ').trim()}
              </Text>
              {/* Event type badge */}
              <View style={styles.badgeContainer}>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {data?.eventDetails?.eventType + ' Event'}
                  </Text>
                </View>
                {data?.eventDetails?.isUserParticipated == true && (
                  <View
                    style={[
                      styles.badge,
                    {backgroundColor: '#DFFCED', paddingHorizontal: 16},
                    ]}>
                  <Text style={[styles.badgeText, {color: '#21BF73'}]}>
                      {'Participated'}
                    </Text>
                  </View>
                )}
              </View>
              {/* Event details */}
              <View style={styles.detailsContainer}>
                {/* Date section */}
                <View style={styles.detailRow}>
                  <View style={styles.iconContainer}>
                    <Image
                      source={textinput_calander_gray}
                    style={{tintColor: '#5756C8', height: 21, width: 21}}
                    />
                  </View>
                  <View style={styles.detailContent}>
                    <View style={styles.dateRow}>
                      <View style={[styles.dateColumn, { borderRightWidth: 1, borderRightColor: '#C3CAD6' }]}>
                        <Text style={styles.labelText}>Start Date</Text>
                        <Text style={styles.valueText}>
                          {moment(
                            data?.eventDetails?.startDate,
                            'MM/DD/YYYY HH:mm:ss',
                          )?.format('ddd DD MMM, YYYY')}
                        </Text>
                      </View>
                      <View style={[styles.dateColumn, { paddingLeft: 20 }]}>
                        <Text style={styles.labelText}>End Date</Text>
                        <Text style={styles.valueText}>
                          {moment(
                            data?.eventDetails?.endDate,
                            'MM/DD/YYYY HH:mm:ss',
                          )?.format('ddd DD MMM, YYYY')}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                {/* Location section */}
                {data?.eventDetails?.eventType == 'Offline' ? (
                  <View style={styles.detailRow}>
                    <View style={styles.iconContainer}>
                      <Location />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.labelText}>Location</Text>
                      <View style={[styles.locationRow, {paddingBottom:5}]}>
                        <Text style={styles.valueText} numberOfLines={3}>
                          {data?.eventDetails?.location + " "}
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                              if (data?.eventDetails?.location) {
                                const query = encodeURIComponent(
                                  data?.eventDetails?.location,
                                );
                                const url = Platform.select({
                                  ios: `http://maps.apple.com/?q=${query}`,
                                  android: `geo:0,0?q=${query}`,
                                });
                                Linking.openURL(url);
                              }
                            }}
                          >
                            <Image
                              source={EventOpenLinkIcon}
                              style={{ width: scale(14), height: scale(14), marginBottom: -2 }}
                            />
                          </TouchableOpacity>
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : (
                  <View style={[styles.detailRow, { marginBottom: 0 }]}>
                    <View style={styles.iconContainer}>
                      <Image
                        source={videoCamera}
                        style={{ tintColor: '#5756C8', height: 27, width: 27 }}
                      />
                    </View>
                    <View style={styles.detailContent}>
                      <Text style={styles.labelText}>Event Link</Text>
                      <View style={[styles.locationRow, {paddingBottom:5}]}>
                        <Text style={styles.valueText} numberOfLines={3}>
                          {data?.eventDetails?.meetingLink + " "}
                          <TouchableOpacity
                            activeOpacity={0.7}
                            onPress={() => {
                              if (data?.eventDetails?.meetingLink) {
                                Linking.openURL(data?.eventDetails?.meetingLink);
                              }
                            }}
                          >
                            <Image
                              source={EventOpenLinkIcon}
                              style={{ width: scale(14), height: scale(14), paddingBottom: -2 }}
                            />
                          </TouchableOpacity>
                        </Text>
                      </View>
                    </View>
                  </View>
                )}
              </View>
              {/* About section */}
              <View style={styles.aboutSection}>
                <SectionHeader
                  title={'About Event'}
                  containerStyles={{
                    paddingHorizontal: 0,
                    marginTop: 0,
                    marginBottom: 0,
                  }}
                  showSeeAll={false}
                titleStyle={{fontSize: 15}}
                />
                <Text style={styles.aboutText}>
                  {data?.eventDetails?.longDescription?.replace(/<[^>]*>?/gm, '')}
                </Text>
              </View>
            </Animated.ScrollView>
            <Animated.View
            style={[styles.compactHeader, {opacity: compactHeaderOpacity}]}>
            <View style={{flex: 1}}>
                <Header
                  onBackPress={() => {
                    navigation.goBack();
                  }}
                  headerTitle={'Events'}
                />
              </View>
            </Animated.View>
            {/* Participate button */}
            {data?.eventDetails?.isUserParticipated == false && (
              <View style={styles.buttonContainer}>
                <WelcomeButton
                  tittle={'Participate'}
                  onPress={handleParticipate}
                  loading={!!participateInEventLoading}
                />
              </View>
            )}
            {/* {modalVisible && (
            <EventRegisterGuestModal
              onRegisterPress={() => onRegisterPress()}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              onCancelpress={() => setModalVisible(false)}
              type={'eventRegisterGuest'}
            />
          )} */}
            {modalGuestVisible && (
              <EventRegisterGuestModal
                onRegisterPress={() => onRegisterPress1()}
                modalVisible={modalGuestVisible}
                setModalVisible={setModalGuestVisible}
                onCancelpress={() => setModalGuestVisible(false)}
                type={'eventRegisterGuest'}
              />
            )}
          </>
        ) : null}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: NAVIGATIONBAR_HEIGHT,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 50,
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
    backgroundColor: '#c3c3c3',
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
    paddingTop: 44,
    // paddingHorizontal: 20,
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
    paddingBottom: 40,
  },
  headerMainTitle: {
    fontSize: 36,
    fontWeight: 'bold',
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
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: Platform.OS == 'android' ? 24 : 0,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#181B1F',
    lineHeight: 29,
    marginBottom: 12,
  },
  badgeContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    gap: 12,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EEEEFF',
    paddingHorizontal: 24,
    paddingVertical: 7,
    borderRadius: 20,
  },
  badgeText: {
    color: '#5756C8',
    fontSize: 13,
    fontWeight: '500',
  },
  detailsContainer: {
    marginBottom: 32,
  },
  detailRow: {
    padding: 0,
    flexDirection: 'row',
    marginBottom: 24,
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: scale(10),
    borderWidth: 1,
    borderColor: '#DDE2EB',
  },

  detailContent: {
    flex: 1,
    justifyContent: 'center',
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateColumn: {
    // flex: 1,
    paddingTop: 0,
    width: "50%",
    // borderWidth:1
  },
  labelText: {
    fontSize: scale(13),
    color: '#464B54',
    fontWeight: '400',
    marginBottom: verticalScale(5),
  },
  valueText: {
    fontSize: scale(15),
    fontWeight: '400',
    lineHeight: 22,
    color: '#181B1F',
  },
  locationRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  aboutSection: {
    marginBottom: 100,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    color: '#292D33',
    fontWeight: '400',
    lineHeight: 24,
    marginTop: 21,
  },
  buttonContainer: {
    paddingTop: 23,
    // paddingBottom:NAVIGATIONBAR_HEIGHT,
    borderTopWidth: 1,
    borderColor: '#DDE2EB',
  },
  participateButton: {
    backgroundColor: '#6366F1',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  participateText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 8,
  },
  compactHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 88,
    backgroundColor: 'white',
    zIndex: 1100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 20,
    paddingTop: Platform.OS == 'ios' ? 69 : 0,
  },
  compactHeaderTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    textAlign: 'center',
    flex: 1,
  },
  hyperlink: {
    // color: 'blue',
    // textDecorationLine: 'underline',
  },
  loader: {
    alignSelf: 'center',
    flex: 1
  },
});

export default EventsDetails;
