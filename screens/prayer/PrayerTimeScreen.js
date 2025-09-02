import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, ImageBackground, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { scale, verticalScale } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import BackArrow from "../../assets/images/white-back-arrow.png";
import Colors from '../../constants/Colors';
import useUserLocation from '../../hooks/useUserLocation';
import { useWeatherTemp } from '../../hooks/useWeatherTemp';
import { usePrayerTimes } from './usePrayerTimes';

const { height, width } = Dimensions.get('window');

const PrayerTimeScreen = React.memo(() => {
  const navigation = useNavigation();
  const {
    loading,
    todayPrayerTimes,
    nextPrayer,
    timeDiff,
    fetchToday,
  } = usePrayerTimes();

  const isFocused = useIsFocused();
  const { city, coords, country, } = useUserLocation();
  const { sunriseTime } = useWeatherTemp(coords?.latitude, coords?.longitude);

  const sortedData = React.useMemo(() =>
    [...(todayPrayerTimes || [])].sort((a, b) => a.time.localeCompare(b.time)),
    [todayPrayerTimes]
  );
  useEffect(() => {
    if (isFocused) {
      fetchToday();
    }
  }, [isFocused]);

  useEffect(() => {
    const asyncStorePrayerNotificationData = async () => {
      try {
        const getAsyncData = await AsyncStorage.getItem("prayerNotificationData");
        const asyncData = JSON.parse(getAsyncData);
        if (asyncData == null) {
          if (todayPrayerTimes.length > 0) {
            await AsyncStorage.setItem("prayerNotificationData", JSON.stringify(todayPrayerTimes));
          }
        }
        // console.log("asyncData---", asyncData,"todayPrayerTimes",todayPrayerTimes, "prayerNotificationData-----",prayerNotificationData);
      } catch (error) {
        console.log("error", error);
      }
    };

    asyncStorePrayerNotificationData();
  }, [isFocused, todayPrayerTimes]);

  const formatToAmPm = (hhmmss) =>
    moment(hhmmss, 'HH:mm:ss').format('hh:mm A');

  const formatSunriseTime = (time) => {
    if (!time) return '--:--';
    return moment.utc(time).local().format('hh:mm A');
  };

  const formatTimeDiff = (str) => {
    // console.log("str time", str)
    const match = str?.match(/(\d+)\s*(hr|hrs)\s*(\d+)\s*(min|mins)/i);
    if (!str) return null;
    if (
      str === '0 mins' ||
      str === '0 min' ||
      str === '0 hrs 0 min' ||
      str === '0 hrs 0 mins'
    ) {
      return <Text style={styles.startsInText}>Starts: Now</Text>;
    } else
      if (match && !(
        str === '0 mins' ||
        str === '0 min' ||
        str === '0 hrs 0 min' ||
        str === '0 hrs 0 mins'
      )) {
        const [, hrs, hrLabel, mins, minLabel] = match;
        // console.log({mins, minLabel})
        return (
          <Text style={styles.startsInText}>
            Starts in: <Text style={styles.boldTime}>{hrs == '0'? '' : hrs}</Text> {hrs == '0'? '' : hrLabel} <Text style={styles.boldTime}>{mins == '0'? '' : mins}</Text> {mins == '0'? '' : minLabel}
          </Text>
        );
      } else {
        return <Text style={styles.startsInText}>Starts in: {str}</Text>;
      }

  };

  const renderIcon = (prayer) => {
    switch (prayer) {
      case 'fajr': return require('../../assets/images/PrayerTime/sunrise-icon1.png');
      case 'dhuhr': return require('../../assets/images/PrayerTime/sun-icon.png');
      case 'asr': return require('../../assets/images/PrayerTime/sunset-icon.png');
      case 'maghrib': return require('../../assets/images/PrayerTime/sunset-second-icon.png');
      case 'isha': return require('../../assets/images/PrayerTime/moon-icon.png');
      default: return null;
    }
  };

  const renderAlarmIcon = (alarm) => {
    switch (alarm) {
      case 'none': return require('../../assets/images/PrayerTime/notify-none.png');
      case 'silent': return require('../../assets/images/PrayerTime/notify-silent.png');
      case 'default': return require('../../assets/images/PrayerTime/notify-default.png');
      case 'azan tone': return require('../../assets/images/PrayerTime/notify-azan-tone.png');
      default: return null;
    }
  };

  const renderPrayerItem = React.useCallback(({ item }) => (
    <TouchableOpacity
      style={styles.prayerItemContainer}
      onPress={() => navigation.navigate('NotificationSettingsScreen', { prayerName: item.name })}
    >
      {item?.name && <Image source={renderIcon(item?.name?.toLowerCase())} style={styles.prayerIcon} />}
      <View style={styles.prayerInfo}>
        <Text style={styles.prayerName}>{item.name}</Text>
        <Text style={styles.alarmStatus}>{item.alarm}</Text>
      </View>
      <Text style={styles.prayerTime}>{item?.time ? formatToAmPm(item?.time) : '--:--'}</Text>
      {item.alarm && <Image source={renderAlarmIcon(item.alarm.toLowerCase())} style={styles.alarmIcon} />}
      <Image source={require('../../assets/images/gray-down-arrow.png')} style={styles.arrowIcon} />
    </TouchableOpacity>
  ), [navigation]);

  const renderHeaderContainer = React.useCallback(() => (
    <View style={styles.headerContainer}>
      <ImageBackground
        source={require('../../assets/images/PrayerTime/masjit-bg-img.png')}
        style={styles.headerBg}
        imageStyle={{ width: '100%', height: '100%', resizeMode: 'cover' }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.headerButton}>
            <Image source={BackArrow} style={styles.headerIcon} />
          </TouchableOpacity>
          <View style={styles.locationContainer}>
            <Image source={require('../../assets/images/PrayerTime/location-pin-blue.png')} style={{ width: scale(11), height: scale(13), marginRight: scale(5) }} />
            <Text style={styles.locationText}>{city || ""}, {country || ""}</Text>
          </View>
          <View style={styles.headerButton} />
        </View>

        <View style={styles.nextPrayerContainer}>
          <Text style={styles.nextPrayerLabel}>Next Prayer: {nextPrayer?.name || "Fajr"}</Text>
          <Text style={styles.nextPrayerTime}>{nextPrayer?.time ? formatToAmPm(nextPrayer?.time) : "6:15 AM"}</Text>
          {formatTimeDiff(timeDiff || "03 hrs 23 min")}
        </View>
      </ImageBackground>
    </View>
  ), [navigation, nextPrayer, city, country, timeDiff]);

  const hijriMonthsEnglish = [
    "Muharram", "Safar", "Rabi' al-Awwal", "Rabi' al-Thani", "Jumada al-Awwal", "Jumada al-Thani",
    "Rajab", "Sha'ban", "Ramadan", "Shawwal", "Dhu'l-Qa'dah", "Dhu'l-Hijjah"
  ];

  const formatHijriDateEnglish = (hijri) => {
    const [year, month, day] = hijri.split('-');
    const monthName = hijriMonthsEnglish[parseInt(month) - 1];
    return `${parseInt(day)} ${monthName} ${year}`;
  };

  const { calendarData } = useSelector(state => state.quran);
  const [todayHijriDate, setTodayHijriDate] = useState("")

  useEffect(() => {
    const today_date = moment(new Date(), "DD/MM/YYYY").format('DD-MM-YYYY')
    const filteredHijriData = calendarData && calendarData?.filter((item) => item?.gregorian?.date == today_date)[0];
    if (filteredHijriData) {
      const isTodayhijriDate = `${filteredHijriData?.hijri?.day} ${filteredHijriData?.hijri?.month?.en} ${filteredHijriData?.hijri?.year}`
      setTodayHijriDate(isTodayhijriDate || "")
    }
  }, [calendarData])

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
          <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
              />
        {renderHeaderContainer()}
        {loading ? (
          <ActivityIndicator size="large" color={Colors.primary} />
        ) : (
          <View style={styles.mainContainer}>
            <View style={styles.dateSunriseContainer}>
              <Text style={styles.dateText}>
                {moment().format("ddd, D MMMM YYYY")}
              </Text>
              <Text style={styles.hijriDateText}>
                {todayHijriDate ? todayHijriDate : ''}
                {/* {todayData?.hijri ? formatHijriDateEnglish(todayData?.hijri) : "6 Dhu'l Hijjah 1448"} */}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Image source={require('../../assets/images/PrayerTime/sunrise-time.png')} style={{ width: scale(16), height: scale(16), marginRight: scale(5) }} />
                {sunriseTime ? (
                  <Text style={styles.sunriseText}>
                    {/* Sunrise:<Text style={{ fontWeight: "bold" }}> {todayData?.fajr && formatToAmPm(todayData?.fajr).split(' ')[0]}</Text> {formatToAmPm(todayData?.fajr).split(' ')[1]} */}
                    Sunrise: <Text style={{ fontWeight: "bold" }}>{sunriseTime && formatSunriseTime(sunriseTime)?.split(' ')[0]}</Text>{formatSunriseTime(sunriseTime)?.split(' ')[1]}
                  </Text>
                ) : (
                  <Text style={styles.sunriseText}>
                    Sunrise: <Text style={{ fontWeight: "bold" }}>--:--</Text>
                  </Text>
                )}
              </View>
            </View>

            {todayPrayerTimes.length === 0 ? (
              <View style={styles.notFoundContainer}>
                <Text style={styles.notFoundText}>Data not found!</Text>
              </View>
            ) : (
              <FlatList
                data={sortedData}
                renderItem={renderPrayerItem}
                keyExtractor={item => item.id}
                style={styles.prayerList}
                scrollEnabled={true}
                showsVerticalScrollIndicator={false}
              />
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
});


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: '100%',
    backgroundColor: '#6c8029',
  },
  container: {
    flex: 1,
    height: height,
    overflow: 'hidden',
  },
  headerContainer: {
    height: height * .27,
    backgroundColor: "transparent",
    paddingTop: verticalScale(10),
  },
  headerBg: {
    position: "relative",
    width: '100%',
    height: '100%',
    resizeMode: "cover",
    paddingHorizontal: scale(15),
    paddingTop: verticalScale(5)
  },
  headerButton: {
    width: scale(30),
    height: scale(30),
    justifyContent: "center",
    // position: 'absolute',
    // top: verticalScale(0), // Adjust to align with content
    // left: scale(10),
    zIndex: 1,
  },
  headerIcon: {
    height: scale(20),
    width: scale(20),
    resizeMode: "contain"
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center location text
    width: '60%',
    alignSelf: 'center'

  },
  locationText: {
    color: Colors.colorWhite,
    fontSize: scale(14),
    color: Colors.colorWhite, // White color for text
  },
  nextPrayerContainer: {
    marginTop: verticalScale(25),
    alignItems: 'center',
    marginBottom: verticalScale(10),
  },
  nextPrayerLabel: {
    color: Colors.colorWhite,
    fontSize: scale(16),
    opacity: 0.7,
  },
  nextPrayerTime: {
    color: Colors.colorWhite,
    fontSize: scale(32),
    fontWeight: 'bold',
    marginVertical: verticalScale(5),
  },
  mainContainer: {
    height: height * 0.80,
    backgroundColor: Colors.colorWhite,
    paddingVertical: scale(20),
    flex: 1,
    borderTopLeftRadius: scale(24),
    borderTopRightRadius: scale(24),
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
    overflow: 'hidden',
  },
  dateSunriseContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: scale(20),
  },
  dateText: {
    fontSize: scale(18),
    fontWeight: 'bold',
    color: "#000000", // Assuming black color
    marginBottom: verticalScale(5),
  },
  hijriDateText: {
    fontSize: scale(14),
    fontWeight:"500",
    color: "#000000",
    opacity: 0.6, // Assuming grey color
    marginBottom: verticalScale(10),
  },
  sunriseText: {
    fontSize: scale(14),
    color: "#181B1F",
  },
  prayerList: {
    width: '100%',
    marginTop: verticalScale(20),
  },

  prayerItemContainer: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: scale(15),
    paddingVertical: verticalScale(15),
    borderBlockColor: "#DDE2EB",
    borderBottomWidth: 1,
  },
  prayerIcon: {
    width: scale(20),
    height: scale(20),
    marginRight: scale(15),
    resizeMode: 'contain',
  },
  prayerInfo: {
    flex: 1,
  },
  prayerName: {
    fontWeight:"400",
    fontSize: scale(16),
    color: "#181B1F",
  },
  alarmStatus: {
    fontWeight:"400",
    fontSize: scale(14),
    color: "#686E7A",
  },
  prayerTime: {
    fontSize: scale(16),
    color: "#181B1F",
    fontWeight: "500",
    marginLeft: scale(10),
    marginRight: scale(22)
  },
  alarmIcon: {
    height: scale(20),
    width: scale(20),
    resizeMode: 'contain',
    marginRight: scale(20)
  },
  arrowIcon: {
    height: scale(15),
    width: scale(15),
    resizeMode: 'contain',
    opacity: 0.5, transform: [{ rotate: '-90deg' }]
  },
  notFoundContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  notFoundText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#181B1F',
    paddingRight: 8,
  },
  startsInText: {
    color: Colors.colorWhite,
    fontSize: scale(16),
    fontWeight: "400",
    opacity: 0.8,
  },
  //   startsInText: {
  //   fontSize: 14,
  //   color: '#555',
  // },

  boldTime: {
    color: Colors.colorWhite,
    fontSize: scale(16),
    fontWeight: "700",
  },
});

export default PrayerTimeScreen;