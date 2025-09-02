import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  ImageBackground,
  Dimensions,
  StatusBar,
  Platform,
  BackHandler,
  ToastAndroid,
  Alert,
  Linking,
  FlatList,
  Animated,
} from 'react-native';
import NetworkStatusDemo from '../../components/NetworkStatusDemo';
import { scale, verticalScale } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import BackgroundImage from '../../assets/images/Homescreen/mosque_bg.png';
import LocationIcon from '../../assets/images/Common/location.svg';
import TempIcon from '../../assets/images/Common/temp-icon.svg';
import BlueForwordIcon from '../../assets/images/Homescreen/blue_forword.svg';
import QiblaDirection from '../../assets/images/Homescreen/qibla_direction.png';
import HibahLilWaqaf from '../../assets/images/Homescreen/hibah-lil-waqaf.png';
import TasbihIcon from '../../assets/images/Homescreen/tasbih_icon.png';
import WorshipPlaces from '../../assets//images/Homescreen/worship_place.png';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import HomeHeader from './HomeHeader';
import ArrowRight from '../../assets/images/Homescreen/arrow_right.svg';
import ArrowRightWhite from '../../assets/images/Homescreen/arrow_right_white.svg';
import HomeBg from '../../assets/images/Homescreen/home_bg.png';
import Colors from '../../constants/Colors';
import { useDispatch, useSelector } from 'react-redux';
import res from '../../constants/res';
import { usePrayerTimes } from '../prayer/usePrayerTimes';
import moment from 'moment';
import { getUserProfile } from '../../redux/slices/userSlice';
import useUserLocation from '../../hooks/useUserLocation';
import { getData, storeData } from '../../constants/Storage';
import DuaJsonData from './duaData.json'
import { getDonationTypeMainPage } from '../../redux/slices/donationSlice';
import { useWeatherTemp } from '../../hooks/useWeatherTemp';
import { getEventList } from '../../redux/slices/eventSlice';
import { EventCard } from '../events/EventsList';
import { getCalendarList } from '../../redux/slices/quranSlice';
import FirebaseService from '../../services/FirebaseService';
import { useLoading } from '../../context/LoadingContext';
import { STATUSBAR_HEIGHT } from '../../constants/Dimentions';

import { SectionHeader } from '../donation/DonationTypeList';
import { HomeScreenBanner } from '../../components/UI/Common';
import { Toast, useToast } from 'react-native-toast-notifications';
import DeviceInfo from 'react-native-device-info';
import { schedule7DaysNotifications } from '../../services/LocalNotifyScheduler';
import { TestPrayerNotifyData } from '../prayer/PryerHelper';


const FeatureCard = ({
  title,
  description,
  IconComponent,
  backgroundColor,
  onPress,
  renderImage,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.featureCard, { backgroundColor }]}>
      <View
        style={{
          flex: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 6
        }}>
        <Image source={IconComponent} width={41} height={41} />
        <ArrowRight />
      </View>
      <View style={{ paddingVertical: 10 }}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </TouchableOpacity>
  );
};

const NewsCard = ({ title, image, date, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.newsCard}>
    <Image source={image} style={styles.newsImage} />
    <View style={styles.newsContent}>
      <Text style={styles.newsTitle}>{title}</Text>
      <Text style={styles.newsDate}>{date}</Text>
    </View>
  </TouchableOpacity>
);

// const EventCard = ({ title, date, location, image, onPress }) => (
//   <TouchableOpacity onPress={onPress} style={styles.eventCard}>
//     <View style={styles.eventCardContainer}>
//       <View style={styles.eventCardTextContainer}>
//         <Text style={styles.eventDate}>{date}</Text>
//         <Text style={styles.eventTitle}>{title}</Text>
//         <View style={styles.eventLocationContainer}>
//           <LocationIcon
//             width={12}
//             height={12}
//             style={styles.iconSpacing}
//             fill="#9F9AF4"
//           />
//           <Text style={styles.eventLocation}>{location}</Text>
//         </View>
//       </View>
//       <View>
//         <Image
//           source={image}
//           style={styles.eventCardImage}
//           resizeMode="cover"
//         />
//       </View>
//     </View>
//   </TouchableOpacity>
// );

function HomeScreen(props) {
  const isFocused = useIsFocused();
  const dispatch = useDispatch()
  const { profileData } = useSelector(state => state.user)
  const navigation = useNavigation();
  const userInfo = useSelector(state => state.app.userInfo);
  const backPressCount = useRef(0);
  const [hibahWaqafData, setHibahWaqafData] = useState(null)
  const { calendarData } = useSelector(state => state.quran);
  const [todayHijriDate, setTodayHijriDate] = useState("")
  const {showLoader, hideLoader} = useLoading();
      const guestInfo = useSelector(state => state.app.guestInfo);
  const {
    todayData,
    todayPrayerTimes,
    nextPrayer,
    timeDiff,
    fetchToday,
  } = usePrayerTimes()
  const { city, coords, country, isLocationEnabled } = useUserLocation();
  const { temperature } = useWeatherTemp(coords?.latitude, coords?.longitude);
  const { eventList, eventLoading, eventError, paginating, hasMore } = useSelector(
    state => state.event,
  );

  const guidanceBanners = [
    {
      key: 'rentals',
      source: require('../../assets/images/Homescreen/Banners/RentalsBanner.png'),
      onPress: () => navigation.navigate('WebViewScreen', { receiptLink: "https://waqafannur.com.my/en/Hartanah", headerShow: true })
    },
    {
      key: 'gold',
      source: require('../../assets/images/Homescreen/Banners/GoldBanner.png'),
      onPress: () => Alert.alert("Coming soon!")
    },
    {
      key: 'larkin',
      source: require('../../assets/images/Homescreen/Banners/LarkinSentralBanner.png'),
      onPress: () => navigation.navigate('WebViewScreen', { receiptLink: "https://www.larkinsentral.my/", headerShow: true })
    },
  ];
  const [guidanceIndex, setGuidanceIndex] = useState(0);
  const guidanceScrollX = useRef(new Animated.Value(0)).current;
  const guidanceFlatListRef = useRef();

  useEffect(() => {
    if (isFocused) {
      
      const fatchHijirCalenderApi = async () => {
        // await schedule7DaysNotifications(TestPrayerNotifyData)
        const today_date = moment(new Date(), "DD/MM/YYYY").format('DD-MM-YYYY')
        const getMonth = today_date.split("-")[1];
        const getYear = today_date.split("-")[2];
        dispatch(getCalendarList({ getMonth, getYear }))
      }
      fetchToday();
      handleGetApi()
      dispatch(getUserProfile({}))
      fatchHijirCalenderApi()
    }
 
  }, [isFocused, fetchToday]);

  useEffect(() => {

    if (isFocused) {
    }
  }, [isFocused, fetchToday]);

  useEffect(() => {
    const today_date = moment(new Date(), "DD/MM/YYYY").format('DD-MM-YYYY')
    const filteredHijriData = calendarData && calendarData?.filter((item) => item?.gregorian?.date == today_date)[0];
    if (filteredHijriData) {
      const isTodayhijriDate = `${filteredHijriData?.hijri?.day} ${filteredHijriData?.hijri?.month?.en} ${filteredHijriData?.hijri?.year}`
      setTodayHijriDate(isTodayhijriDate || "")
    }
  }, [calendarData])

  const handleGetApi = () => {
    // showLoader(true)
    dispatch(getDonationTypeMainPage({}))
      .unwrap()
      .then(async res => {
        hideLoader(true)
        if (res?.data?.status === 1) {
          const waqafData = res.data.result.donationTo[0]?.donationToValues
          const filtredWaqaf = waqafData.filter((item) => item?.feesDetails?.statementDescriptor === 'Waqaf')
          if (filtredWaqaf?.[0]) {
            hideLoader(true)
            setHibahWaqafData({
              appealId: filtredWaqaf[0].id,
              orgId: 4,
              siteId: filtredWaqaf[0].id,
              donationType: 9,
              item: filtredWaqaf[0],
              type: 0,
            })
          }
        } else {
              hideLoader(true)
          setHibahWaqafData(null)
          Toast.show(res?.data?.message || 'data fetch failed', {
            type: 'danger',
            placement: 'bottom',
          });
        }
      })
      .catch(err => {
            hideLoader(true)
        Toast.show(res?.data?.message ||res.strings.somethingWentWrong, {
          type: 'danger',
          placement: 'bottom',
        });
      });
  };
  useEffect(() => {
    if (!eventList || eventList.length === 0) {
      dispatch(getEventList({}));
    }
  }, [dispatch]);
  const formatToAmPm = (hhmmss) => moment(hhmmss, 'HH:mm:ss').format('hh:mm A');

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        if (backPressCount.current === 0) {
          backPressCount.current += 1;
          if (Platform.OS === 'android') {
            ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
          }
          setTimeout(() => {
            backPressCount.current = 0;
          }, 2000);
          return true;
        }
        BackHandler.exitApp();
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );

      // Cleanup on unfocus
      return () => backHandler.remove();
    }, [])
  );

  const storeLocalDua = async () => {
    const updatedDuaJsonData = DuaJsonData.map(item => ({
      ...item,
      isBookmark: false,
    }));
    await storeData("dua_json", updatedDuaJsonData);

  }

  const getDuaData = async () => {
    const getDuaList = await getData(`dua_json`);
    if (!getDuaList) {
      storeLocalDua()
    }

  }
  useEffect(() => {
    getDuaData()
  }, []);

  useEffect(() => {
    // Ask notification permission only once after login
    const askNotificationPermission = async () => {
      const granted = await FirebaseService.requestUserPermissionOnce();
      if (granted) {
        const token = await FirebaseService.getFcmToken();
        // You can send this token to your backend if needed
      }
    };
    askNotificationPermission();
  }, []); // Only once after mount

  const handleQiblaNavigation = async() => {
    const isEnabled = await DeviceInfo.isLocationEnabled();
    if (isEnabled) {
      navigation.navigate('QiblaCompassScreen');
    } else {
      Alert.alert(
        res.strings.locationServiceDisable
,
        res.strings.turnOnGps,
        // [
        //   { text: 'Cancel', style: 'cancel' },
        //   {
        //     text: res.strings.openSetting, onPress: () => {
        //       if (Platform.OS === 'ios') {
        //         Linking.openURL('App-Prefs:Privacy&path=LOCATION');
        //       } else {
        //         Linking.openSettings();
        //       }
        //     },
        //   },
        // ]
      )
    }
  }
  useFocusEffect(
    React.useCallback(() => {
      if(isFocused == true ) {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('white');
      }
    }
    }, [])
  );
   const openPlayStore = () => {
    const url = 'https://play.google.com/store/apps/details?id=com.miniclip.tabletopoffline';
      Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
  };
  useEffect(() => {
    const timer = setInterval(() => {
      if (guidanceFlatListRef.current) {
        let nextIndex = (guidanceIndex + 1) % guidanceBanners.length;
        guidanceFlatListRef.current.scrollToIndex({ index: nextIndex, animated: true });
      }
    }, 3000); // Changed from 4000 to 2000 for 2 seconds autoplay
    return () => clearInterval(timer);
  }, [guidanceIndex, guidanceBanners.length]);

const result =  userInfo?.fullName.includes("Guest");
const name=result?"Guest User": userInfo?.fullName
  return (
    <SafeAreaView style={styles.screen}>
         {isFocused == true &&   <StatusBar barStyle="dark-content" backgroundColor="white" />}

      <View style={styles.bgImageWrapper}>
        <Image
          source={BackgroundImage}
          style={styles.bgImage}
          resizeMode="contain"
        />
      </View>
      
      {/* <StatusBar /> */}
     {/* { Platform.OS == "android" && <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />} */}
      <View style={{ paddingTop: 15, paddingHorizontal: Platform.OS === 'android' ? 20 : 20, }}>
        <HomeHeader
          username={ guestInfo ? "Guest User"  : profileData?.fullName ?  profileData?.fullName : ''}
          notificationCount={8}
          onNotificationPress={() => navigation.navigate('Notification_center')}
        />
      </View>
         <ScrollView style={{ paddingHorizontal: Platform.OS === 'android' ? 20 : 20 }} showsVerticalScrollIndicator={false}>
        {/* Prayer Time Card */}
        <View
          style={[
            // Platform.OS === 'android' ? { padding: 20 } : 
            { paddingHorizontal: 20, },
          ]}></View>

        {/* Key Features */}
        <View style={styles.featuresSection}>
          <View style={styles.featuresRow}>
            <View style={{ flex: 1, }}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('PrayerTimeScreen')}>
                <LinearGradient
                  colors={['#191967', '#3937A4', '#5756C8']}
                  style={styles.prayerCard}>
                  <ImageBackground source={HomeBg} style={styles.imageStyle}>
                    <View style={{ justifyContent: 'space-between', flex: 1 }} >
                      <View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <Text
                              style={{
                                color: Colors.colorWhite,
                                fontSize: 11,
                                fontWeight: '400',
                              }}>
                                 {res.strings.nextPrayer} {timeDiff || "0 mins"}
                            </Text>
                          </View>
                          <View style={{}}>
                            <ArrowRightWhite />
                          </View>
                        </View>

                        <View style={{ marginTop: 5 }}>
                          <Text style={styles.sunriseText}>{nextPrayer?.name || "Sunrise"}</Text>
                          <Text style={[styles.sunriseText, { marginTop: 2 }]}>{nextPrayer?.time && formatToAmPm(nextPrayer?.time) || "6:15am"}</Text>
                          <View
                            style={{
                              marginTop: 5,
                              flex: 1,
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingRight: 10
                            }}>
                            <LocationIcon
                              width={12}
                              height={12}
                              style={styles.iconSpacing}
                              fill="#6B46C1"
                            />
                            <Text
                              style={{
                                color: Colors.colorWhite,
                                fontSize: 12,
                                fontWeight: '500',
                              }}>
                              {city? city+",": ""} {country || ""}
                            </Text>
                          </View>
                          <View
                            style={{
                              flex: 1,
                              marginTop: 5,
                              flexDirection: 'row',
                              alignItems: 'center',
                              paddingRight: 10
                            }}>
                            <TempIcon
                              width={12}
                              height={12}
                              style={styles.iconSpacing}
                              fill="#9F9AF4"
                            />
                            <Text
                              style={{
                                color: Colors.colorWhite,
                                fontSize: 12,
                                fontWeight: '500',
                              }}>
                              {temperature ? Math.round(temperature) : ''}°C
                            </Text>
                          </View>
                        </View>
                      </View>
                      <View style={{}}>
                        <Text style={styles.textDate}>
                          {todayData?.date?.replace(/-/g, " ") || "4 June 2025"}
                        </Text>
                        <Text style={styles.textItalic}>{todayHijriDate || "24 Shawwal, 1446 AH"}</Text>
                      </View>
                    </View>
                  </ImageBackground>
                </LinearGradient>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, }}>
              <View style={{ paddingVertical: 10, flex: 1 }}>
                <FeatureCard
                  onPress={() => {
                    if (hibahWaqafData) {
                      navigation.navigate('Select_donation_Amount', hibahWaqafData)
                    } else {
                      Toast.show(res.strings.detailsNotAvailable, {
                        type: 'danger',
                        placement: 'bottom',
                      });
                    }
                  }}
                  description={res.strings.generalWaqaf}
                  title={res.strings.hibahLilWaqaf}
                  IconComponent={HibahLilWaqaf}
                  backgroundColor="#FFD6D1"
                />
              </View>
              <View style={{ flex: 1 }}></View>
              <FeatureCard
                   description={res.strings.worshipPlacesDesc}
                title={res.strings.worshipPlaces}
                IconComponent={WorshipPlaces}
                backgroundColor="#80EAB4"
                onPress={() => navigation.navigate('WorshipPlaces')}
              />
            </View>
          </View>

          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', gap: 12, marginTop: 12 }}>
            <View style={{ width: Dimensions.get('window').width / 2 - 27 }}>
              <FeatureCard
                description={res.strings.qiblaCompassDesc}
                title={res.strings.qiblaDirection}
                IconComponent={QiblaDirection}
                backgroundColor="#91ECF1"
                onPress={handleQiblaNavigation}
              />
            </View>
            <View style={{ width: Dimensions.get('window').width / 2 - 27, }}>
              <FeatureCard
                description={res.strings.tasbihAndDhikirDesc}
                title={res.strings.tasbihDhikir}
                IconComponent={TasbihIcon}
                backgroundColor="#EBCCFF"
                onPress={() => navigation.navigate('TasbihDhikir')}
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('AllFeaturesScreen')
          }}
          style={styles.allFeaturesButton}>
          <Text style={styles.allFeaturesText}>{res.strings.viewAllFeature}</Text>
        </TouchableOpacity>

        {/* News Section */}
        <View style={{}}>
          <View style={styles.newscontainer}>
            <Text style={styles.newstitle}>{res.strings.newsAndBlog}</Text>

            <LinearGradient
              colors={['#E0E0E0', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.newsline}
            />

            <TouchableOpacity  onPress={() =>  Alert.alert("Coming Soon!")}>
              {/* //  navigation.navigate('NewsAndBlogs')}> */}
              <Text style={styles.newsSeeAll}>
                  {res.strings.seeAll}{"  "}
                <BlueForwordIcon
                  width={scale(6)}
                  height={scale(11)}
                  style={styles.iconSpacing}
                  fill="#272682"
                />
              </Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <NewsCard
              title="Unveiling Why Malaysia is Leading the charge..."
              image={require('../../assets/images/Common/masjidblog.png')}
              date="4 hours ago"
              onPress={() => {Alert.alert("Coming Soon!")}}
            />
            <NewsCard
              title="Lorem ipsum is simple dummy text of type.."
              image={require('../../assets/images/Common/fanblog.png')}
              date="4 hours ago"
               onPress={() => {Alert.alert("Coming Soon!")}}
            />
            <NewsCard
              title="Lorem ipsum is simple dummy text of type.."
              image={require('../../assets/images/Common/flowerblog.png')}
              date="4 hours ago"
               onPress={() => {Alert.alert("Coming Soon!")}}
            />
          </ScrollView>
        </View>

        {/* Ongoing Events */}
        {eventList?.length > 0 && <View style={{ marginTop: 30, marginBottom: 20 }}>
          <View style={styles.newscontainer}>
            <Text style={styles.newstitle}>{res.strings.onGoingEvent}</Text>

            <LinearGradient
              colors={['#E0E0E0', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.newsline}
            />

            <TouchableOpacity onPress={() => navigation.navigate('EventsList')} >
              <Text style={styles.newsSeeAll}>
                {res.strings.seeAll}{"  "}
                <BlueForwordIcon
                  width={scale(6)}
                  height={scale(11)}
                  style={styles.iconSpacing}
                  fill="#272682"
                />
              </Text>
            </TouchableOpacity>
          </View>
          {eventLoading && <Text style={{ textAlign: 'center', marginTop: 10 }}>{res.strings.loadingEvent}</Text>}
          {eventError && <Text style={{ color: 'red', textAlign: 'center', marginTop: 10 }}>{eventError}</Text>}
          <ScrollView style={{ overflow: 'visible' }} horizontal showsHorizontalScrollIndicator={false}>
            {eventList && eventList?.slice(0, 5).map((event) => (
              <EventCard
                item={event} onPress={() => { navigation.navigate('EventsDetails', { eventId: event?.id, orgId: event?.orgId || 4 }); }} isHomeScreen={true}
              // key={event?.id}
              // title={event?.name}
              // date={moment(event?.startDate, 'MM/DD/YYYY HH:mm:ss')?.format('DD MMM, YYYY')}
              // location={event?.location}
              // image={{ uri: event.image }}
              // onPress={() => navigation.navigate('EventsDetails', { eventId: event.id })}
              />
            ))}
          </ScrollView>
        </View>}

        {/* Game Banner */}
        {/* <Image
          source={require('../../assets/images/Common/gamers.png')}
          style={styles.bannerImage}
          resizeMode="cover"
        /> */}
         <SectionHeader title="Guidance" showSeeAll={false} containerStyles={{paddingHorizontal:0}} titleStyle={styles.newstitle} />
         <View style={{marginBottom: 16}}>
  <FlatList
  style={{overflow:'visible'}}
    ref={guidanceFlatListRef}
    data={guidanceBanners}
    keyExtractor={item => item.key}
    horizontal
    pagingEnabled
    showsHorizontalScrollIndicator={false}
    onScroll={Animated.event(
      [{ nativeEvent: { contentOffset: { x: guidanceScrollX } } }],
      { useNativeDriver: false }
    )}
    onViewableItemsChanged={useCallback(({ viewableItems }) => {
      if (viewableItems[0]) setGuidanceIndex(viewableItems[0].index);
    }, [])}
    viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
    renderItem={({ item }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        style={{ width: Dimensions.get('window').width - scale(48), marginRight:scale(16)}}
        onPress={item.onPress}
      >
        <Image
          source={item.source}
          style={styles.bannerImage}
        />
      </TouchableOpacity>
    )}
  />
  {/* Pagination Dots */}
  <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
    {guidanceBanners.map((_, i) => {
      const inputRange = [
        (i - 1) * (Dimensions.get('window').width -  scale(48)),
        i * (Dimensions.get('window').width -  scale(48)),
        (i + 1) * (Dimensions.get('window').width -  scale(48))
      ];
      const dotWidth = guidanceScrollX.interpolate({
        inputRange,
        outputRange: [8, 24, 8],
        extrapolate: 'clamp',
      });
      const opacity = guidanceScrollX.interpolate({
        inputRange,
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
      });
      return (
        <Animated.View
          key={i}
          style={{
            height: 8,
            borderRadius: 4,
            backgroundColor: '#272682',
            marginHorizontal: 4,
            width: dotWidth,
            opacity,
          }}
        />
      );
    })}
  </View>
</View>
            <SectionHeader title="Games" showSeeAll={false} containerStyles={{paddingHorizontal:0, marginBottom: 0}} titleStyle={styles.newstitle} />
         <HomeScreenBanner 
         source={require('../../assets/images/Homescreen/Banners/GamesBanner.png')} 
         navigation={() =>  openPlayStore()}
         styles={{marginBottom:verticalScale(30)}}
          />

        {/* Network Status Demo */}
        {/* <NetworkStatusDemo /> */}
      </ScrollView>
      {/* </ImageBackground> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.colorWhite,
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : null,
    // paddingBottom: Platform.OS === 'android' ? NAVIGATIONBAR_HEIGHT : null,

  },
  bgImageWrapper: {
    // backgroundColor:'red',
    position: 'absolute',
    top: 20,
    left: -20,
    right: 0,
    height: 400, // adjust based on design
    // zIndex: -1,
    alignItems: 'center',
  },
  bgImage: {
    width: '100%',
    height: '100%',
    opacity: 0.1, // make it light like watermark
  },
  backgroundImage: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: scale(10),
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconSpacing: {
    marginRight: 6,
    color: '#9F9AF4',
  },
  location: {
    fontSize: scale(14),
    fontWeight: '500',
    color: '#181B1F',
  },
  locationName: {
    fontSize: scale(10),
    fontWeight: '400',
    color: '#181B1F',
  },
  profileButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: scale(20),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayerCard: {
    flex: 1,
    // padding: scale(20),
    borderRadius: scale(20),
    // marginBottom: verticalScale(20),
    marginTop: 10,
    // flexDirection: 'row',
    // paddingHorizontal:20,
  },
  imageStyle: {
    flex: 1,
    paddingHorizontal: 13,
    paddingTop: 17,
    paddingBottom: 25,
    borderRadius: 20,
    overflow: 'hidden',
  },
  prayerDateText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#FFFFFF',
  },
  hijriDate: {
    width: 'scale(125)',
    fontSize: scale(12),
    color: '#C9C5FC',
    marginBottom: verticalScale(10),
  },
  nextPrayer: {
    fontSize: scale(14),
    color: '#FFFFFF',
    fontWeight: '600',
  },
  textDate: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.colorWhite,
  },
  featuresSection: {
    // paddingHorizontal: scale(16),
    marginBottom: verticalScale(10),
  },
  featuresRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: verticalScale(10),
    gap: 12,
  },
  featureCard: {
    flex: 1,
    borderRadius: 16,
    padding: 11,
    // iOS Shadow
    shadowColor: '#00000014',
    shadowOffset: {
      width: 1,
      height: 3,
    },
    shadowOpacity: 1,
    shadowRadius: 10,

    // Android Shadow
    elevation: 5,
  },
  featureIcon: {
    marginBottom: verticalScale(8),
    backgroundColor: Colors.PrimaryBlue,
  },
  featureTitle: {
    fontSize: scale(14),
    fontWeight: '600',
    textAlign: 'start',
    color: '#181B1F',
  },
  featureDescription: {
    fontSize: scale(12),
    color: '#464B54',
    textAlign: 'start',
  },
  allFeaturesButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#f1f1fe',
    borderColor: '#d8d7fb',
    borderWidth: 1,
    height: scale(48),
    borderRadius: scale(10),
    marginBottom: 36,
    marginTop: 14
  },
  allFeaturesText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#272682',
  },
  // newsContainer: {
  //   // marginBottom: verticalScale(10),
  // },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: verticalScale(10),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#181B1F',
    marginBottom: scale(10),
  },
  seeAll: {
    fontSize: 12,
    color: '#272682',
    fontWeight: '500',
  },
 newsCard: {
  overflow: 'hidden',
  width: scale(161),
  height: scale(180),
  borderRadius: scale(14), // round the whole card
  backgroundColor: '#fff',
},
newsImage: {
  width: '100%',
  height: scale(108),
},
newsContent: {
  paddingHorizontal: scale(4), // small side padding if needed
  paddingTop: verticalScale(6),
},
newsTitle: {
  fontSize: scale(13),
  fontWeight: '600',
  color: '#181B1F',
  marginBottom: verticalScale(4),
},
  newsDate: {
    fontSize: 12,
    color: '#464B54',
  },
  eventCard: {
    // display: 'flex',
    // flexDirection: 'row',
    backgroundColor: '#DDE2EB',
    borderRadius: scale(14),
    padding: scale(6),
    width: scale(256),
    height: scale(114),
    marginRight: scale(12),
  },
  eventCardContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventCardTextContainer: {
    width: scale(122),
    height: scale(82),
  },
  eventDate: {
    fontSize: 12,
    color: '#181B1F',
    marginBottom: verticalScale(4),
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: verticalScale(4),
    color: '#181B1F',
  },
  eventLocationContainer: {
    width: '100%',
    height: '15px',
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventLocation: {
    fontSize: 12,
    color: '#272682',
    fontWeight: '500',
    marginLeft: scale(4),
  },
  eventCardImage: {
    width: scale(102),
    height: scale(102),
    borderRadius: scale(10),
  },
  bannerImage: {
    width: Dimensions.get('window').width - scale(48),
    height: 180,
    objectFit: 'fill',
    borderRadius: 16,
    resizeMode:'contain'
  },
  prayerText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.colorWhite,
  },
  sunriseText: {
    fontSize: 24,
    fontWeight: '500',
    color: Colors.colorWhite,
    marginTop: 8
  },
  textItalic: {
    fontSize: 12,
    fontWeight: '400',
    fontStyle: 'italic',
    color: Colors.colorWhite,
    marginTop: 8
  },
  newscontainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // paddingHorizontal: 4,
    // paddingTop: 25,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  newstitle: {
    fontSize: scale(15),
    fontWeight: '600',
    color: '#181B1F',
    marginRight: 8,
  },
  newsline: {
    flex: 1,
    height: 1,
    // marginHorizontal: 4,
  },
  newsSeeAll: {
    fontSize:scale(14),
    color: '#272682',
    fontWeight: '600',
    marginRight:scale(8)
  },
});

export default HomeScreen;
