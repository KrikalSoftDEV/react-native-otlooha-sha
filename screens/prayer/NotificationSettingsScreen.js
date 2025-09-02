import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackArrow from "../../assets/images/black-back-arrow.png"
import Colors from '../../constants/Colors'; // Assuming Colors.js exists
import { scale, verticalScale } from 'react-native-size-matters'; // Assuming this utility
import PrayerModal from './PrayerModal'; // Import the PrayerModal component
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { useIsFocused } from '@react-navigation/native';
import Header from '../../components/UI/Header';
import { SectionHeader } from '../donation/DonationTypeList';
import { schedule7DaysNotifications } from '../../services/LocalNotifyScheduler';
import PrayerNotificationPreferences from './PrayerNotificationPreferences';


const notificationPreferences = [
  { id: '1', label: 'None', Icon: require('../../assets/images/PrayerTime/notify-none.png') },
  { id: '2', label: 'Silent', Icon: require('../../assets/images/PrayerTime/notify-silent.png') },
  { id: '3', label: 'Default', Icon: require('../../assets/images/PrayerTime/notify-default.png') },
  { id: '4', label: 'Azan tone1', Icon: require('../../assets/images/PrayerTime/notify-azan-tone.png') },
  { id: '5', label: 'Azan tone2', Icon: require('../../assets/images/PrayerTime/notify-azan-tone.png') },
];
const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib','Isha'];
const reminderTimes = ['On Time', '10 Minutes', '15 Minutes', '20 Minutes', '25 Minutes', '30 Minutes'];

const NotificationSettingsScreen = ({ route, navigation }) => {
  const isFocused = useIsFocused()
  const [modalVisible, setModalVisible] = useState(false);
  const prayerName = route.params.prayerName || null;
  const prayerSettings = route.params.prayerSettings || null;
  const [selectedPreference, setSelectedPreference] = useState('Azan tone');
  const [modalType, setModalType] = useState("prayer");
  const [modalData, setModalData] = useState([]);
  const [selectedPrayer, setSelectedPrayer] = useState(prayerName || 'Fajr');
  const [selectedReminderTime, setSelectedReminderTime] = useState('On Time');

  const handleModalOpen = (type) => {
    setModalData(type === 'prayer' ? prayers : reminderTimes);
    setModalType(type);
    setModalVisible(true);
  };
  useEffect(() => {
    const updateInitialData = async () => {
      const getAsyncData = await AsyncStorage.getItem("prayerNotificationData")
      const asyncData = await JSON.parse(getAsyncData)

      const tempData = asyncData && asyncData.filter(temp => temp.name.toLowerCase() === selectedPrayer.toLowerCase())[0];
      const alarmTime = moment(tempData.alarmTime, 'HH:mm:ss');
      const prayerTime = moment(tempData.time, 'HH:mm:ss');
      const diffInMinutes = prayerTime.diff(alarmTime, 'minutes');

      if (tempData) {
        setSelectedPreference(tempData?.alarm || "Azan tone")
        if (diffInMinutes) {
          setSelectedReminderTime(`${diffInMinutes} Minutes`)
        } else {
          setSelectedReminderTime('On Time')
        }
      }
    };
    updateInitialData()
  }, [isFocused, selectedPrayer]);
  
  const onSelectPreferences = async (preference) => {
    setSelectedPreference(preference)
    const getAsyncData = await AsyncStorage.getItem("prayerNotificationData")
    const asyncData = await JSON.parse(getAsyncData)

    const tempData = asyncData && asyncData.filter(temp => temp.name.toLowerCase() === selectedPrayer.toLowerCase())[0];
    tempData.alarm = preference;
    let dataToBeCopied = [...asyncData.filter(d => d.name.toLowerCase() !== selectedPrayer.toLowerCase()), tempData];
    await AsyncStorage.setItem("prayerNotificationData", JSON.stringify(dataToBeCopied));
    await schedule7DaysNotifications(dataToBeCopied)
  }

  const onChangePreAjaanReminder = async (prayer, type) => {
    if (type === 'prayer') {
      setSelectedPrayer(prayer);
      // setModalVisible(false);
    } else if (type === 'reminder') {
      setSelectedReminderTime(prayer);
      // setModalVisible(false);
      // Setting Reminder Information 
      const getAsyncData = await AsyncStorage.getItem("prayerNotificationData")
      const asyncData = await JSON.parse(getAsyncData)

      const tempData = asyncData && asyncData.filter(temp => temp.name.toLowerCase() === selectedPrayer.toLowerCase())[0];
      const alarmTime = prayer === 'On Time' ? 0 : prayer.split(" ")[0];

      const newTimeStr = moment(tempData.time, "HH:mm:ss")
        .subtract(alarmTime, "minutes")
        .format("HH:mm:ss");
      tempData.alarmTime = newTimeStr;
      let dataToBeCopied = [...asyncData.filter(d => d.name.toLowerCase() !== selectedPrayer.toLowerCase()), tempData];
      await AsyncStorage.setItem("prayerNotificationData", JSON.stringify(dataToBeCopied));
      await schedule7DaysNotifications(dataToBeCopied)
    }
    else {
      setSelectedPrayer(null);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>

      {prayerSettings ? (<Header
        onBackPress={() => {
          navigation.goBack();
        }}
        headerTitle={"Prayer Settings"}
        backgroundColor="transparent"
        iconColor="#181B1F"
        textColor="#181B1F"
        fontWeight={"500"}
        fontSize={14}
      />
      ) : (
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.headerButton}
          >
            <Image source={BackArrow} style={styles.headerIcon} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.prayerSelector} onPress={() => handleModalOpen('prayer')}>
            <Text style={styles.prayerNameText}>{selectedPrayer || prayerName}</Text>
            <Image source={require('../../assets/images/black-down-arrow.png')} style={styles.arrowIcon} />
          </TouchableOpacity>
          <View style={{ width: scale(24) }} />{/* Spacer to balance header */}
        </View>
      )}


      <ScrollView style={styles.scrollViewContent}>

        {prayerSettings && (
           <View style={[styles.sectionContainer, {marginBottom:24}]}>
          <TouchableOpacity style={styles.dropdownSelector} onPress={() => handleModalOpen('prayer')}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reminderTitle}>Prayer Times</Text>
              <Text style={styles.dropdownText}>{selectedPrayer || prayerName}</Text>
            </View>
            <Image source={require('../../assets/images/gray-down-arrow.png')} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>
        )
        }
        <View style={styles.sectionContainer}>
          <TouchableOpacity style={styles.dropdownSelector} onPress={() => handleModalOpen('reminder')}>
            <View style={{ flex: 1 }}>
              <Text style={styles.reminderTitle}>Pre-Azan Reminder</Text>
              <Text style={styles.dropdownText}>{selectedReminderTime}</Text>
            </View>
            <Image source={require('../../assets/images/gray-down-arrow.png')} style={styles.arrowIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.sectionContainer}>
          {/* <Text style={styles.sectionTitle}>Notification Preferences</Text> */}
           <SectionHeader title="Notification Preferences" showSeeAll={false} containerStyles={{paddingHorizontal:0, marginTop:0}} titleStyle={styles.newstitle} />
          {/* {notificationPreferences.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.preferenceItem}
              onPress={() => onSelectPreferences(item.label)}
            >
              <Image source={item.Icon} style={{ width: scale(18), height: scale(18), resizeMode: "contain" }} />
              <Text style={styles.preferenceLabel}>{item.label}</Text>
              <View style={[styles.checkBox, { backgroundColor: selectedPreference === item.label ? "#5756C8" : "#DDE2EB", }]} >
                {selectedPreference === item.label && <Image source={require('../../assets/images/PrayerTime/right-tick-icon.png')} style={styles.checkIcon} />}
              </View>
            </TouchableOpacity>
          ))} */}
          <PrayerNotificationPreferences 
            notificationPreferences={notificationPreferences}
            selectedPreference={selectedPreference}
            onSelectPreferences={onSelectPreferences}
          />

          <PrayerModal
            visible={modalVisible}
            type={modalType}
            selectedItem={modalType === "prayer" ? selectedPrayer : selectedReminderTime}
            renderData={modalData}
            onClose={() => setModalVisible(false)}
            onSelect={onChangePreAjaanReminder}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.colorWhite, // Screen background
  },
  header: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: verticalScale(15),
    // paddingHorizontal:10
  },
  headerButton: {
   
    position: 'absolute',
    left: scale(10),
    top: verticalScale(20), // Adjust to align with content
    zIndex: 1,
    paddingHorizontal:6
  },
  headerIcon: {
    height: scale(20),
    width: scale(20),
    // paddingHorizontal:10,
    resizeMode: "contain"
  },
  prayerSelector: {
    paddingTop:5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

  },
  prayerNameText: {
    fontSize: scale(16),
    fontWeight: '500',
    color: "#181B1F",
  },
  scrollViewContent: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(20),
  },
  sectionContainer: {
    marginBottom: verticalScale(25),
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: "500",
    color: "#181B1F", // Assuming grey color
    marginBottom: verticalScale(10),
  },
  reminderTitle: {
    fontSize: scale(14),
    fontWeight: "400",
    color: "#686E7A", // Assuming grey color
    marginBottom: verticalScale(5),
  },
  dropdownSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: "#DDE2EB", // Light grey border
    // backgroundColor: '#F0F0F0', // Light grey background for dropdown
    paddingVertical: verticalScale(12),
    paddingHorizontal: scale(15),
    borderRadius: scale(14),
  },
  dropdownText: {
    fontSize: scale(17),
    fontWeight: "500",
    color: "#181B1F",
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: verticalScale(15),
  },
  preferenceLabel: {
    flex: 1,
    fontSize: scale(16),
    color: "#181B1F",
    fontWeight: "400",
    marginLeft: scale(15),
  },
  radioUnchecked: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: Colors.colorGrey,
  },
  radioChecked: {
    width: scale(20),
    height: scale(20),
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: Colors.colorPrimary, // Assuming primary color for checked state
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCheckedInner: {
    width: scale(10),
    height: scale(10),
    borderRadius: scale(5),
    backgroundColor: Colors.colorPrimary,
  },
  arrowIcon: {
    marginLeft: scale(5),
    marginTop:5,
    height: scale(15),
    width: scale(15),
    resizeMode: 'contain',
  },
  checkBox: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(10)
  },
  checkIcon: {
    width: 15,
    height: 15,
    resizeMode: 'contain'
  },
});

export default NotificationSettingsScreen;