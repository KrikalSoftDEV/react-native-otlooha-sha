import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../../components/UI/Header';
import { useNavigation } from '@react-navigation/native';
import ArrowDownIcon from '../../assets/images/Common/arrow_down.svg';
import WheelPickerModal_3 from '../../components/UI/WheelPickerModal_3';
import { getCalendarList } from '../../redux/slices/quranSlice';
import { useLoading } from '../../context/LoadingContext';

const gregorianMonths = [
  '', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
];

// Add Hijri months mapping
const HIJRI_MONTHS = [
  '', // 0 index placeholder for 1-based months
  'Muḥarram', 'Ṣafar', 'Rabīʿ al-awwal', 'Rabīʿ al-thānī',
  'Jumādá al-ūlá', 'Jumādá al-ākhirah', 'Rajab', 'Shaʿbān',
  'Ramaḍān', 'Shawwāl', 'Dhū al-Qaʿdah', 'Dhū al-Ḥijjah'
];

const EventScreen = () => {
  const navigation = useNavigation();
  const islamicMonth = useSelector(state => state.quran.islamicMonth);
  const responseGetspecialDays = useSelector(state => state.quran.responseGetspecialDays);
  const calendar = useSelector(state => state.quran.data);
  const dispatch = useDispatch();
  const [events, setEvents] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(true);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [selectedMonthNum, setSelectedMonthNum] = useState(new Date().getMonth() + 1); // 1-based
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
   const {
      showLoader,
      hideLoader,

    } = useLoading();
  // Fetch calendar and events for selected month/year
  const handleGetApi = (month, year) => {
    showLoader(true)
    dispatch(getCalendarList({ getMonth: month, getYear: year }));
    hideLoader(true)
  };

  useEffect(() => {
    handleGetApi(selectedMonthNum, selectedYear);
  }, [selectedMonthNum, selectedYear]);

  useEffect(() => {
    setLoading(true);
    if (responseGetspecialDays && calendar?.data) {
      // Filter special days for the selected month/year
      const filtered = responseGetspecialDays.filter(event => {
        // Find a matching day in the calendar for this event
        const match = calendar.data.find(day => day?.hijri?.month?.number === event.month && String(day?.hijri?.day) === String(event.day));
        if (!match) return false;
        // Check month and year
        return (
          match.gregorian.month.number === selectedMonthNum &&
          match.gregorian.year === selectedYear
        );
      });
      setEvents(filtered);
      // Set selectedMonth for display
      const gregMonthName = gregorianMonths[selectedMonthNum];
      setSelectedMonth(gregMonthName);
    } else {
      setEvents([]);
      setSelectedMonth('');
    }
    setLoading(false);
  }, [responseGetspecialDays, calendar, selectedMonthNum, selectedYear]);

  const EventItem = ({ event }) => {
    // Find the corresponding Gregorian date from the calendar data
    let gregorianDate = '';
    let hijriDates = '';
    if (calendar?.data) {
      const match = calendar?.data?.find(
        day => day?.hijri?.month?.number === event.month && String(day?.hijri?.day) === String(event.day)
      );
      
      gregorianDate = match?.gregorian?.day + ' ' + match?.gregorian?.month?.en + ' - ' + match?.gregorian?.weekday?.en
      || '';
      hijriDates = match?.hijri?.day + ' ' + match?.hijri?.month?.en + ' - ' + match?.hijri?.weekday?.ar
      || '';
    }
    return (
      <View style={styles.eventItem}>
        <View style={styles.eventHeader}>
          <View style={styles.indicator} />
          {/* Show Gregorian date for this event */}
          <Text style={styles.gregorianDate}>{gregorianDate}</Text>
        </View>
        <Text style={[
          styles.eventName,
          // (event.name.includes('Eid') || event.name.includes('Arafa')) && styles.specialEvent
        ]}>
          {event.name}
        </Text>
        {/* Show Hijri date for this event */}
        <Text style={styles.hijriDate}>
          {/* {event.day} {HIJRI_MONTHS[event.month]} -  */}
          {hijriDates}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Header onBackPress={() => navigation.goBack()}  />
        <TouchableOpacity style={styles.monthSelector} onPress={() => setShowMonthModal(true)}>
          <Text style={styles.monthText}>{selectedMonth}</Text>
          <ArrowDownIcon />
        </TouchableOpacity>
        <View style={styles.placeholder} />
      </View>
      {loading ? (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator size="large" color="#6366F1" />
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {events.length === 0 ? (
            <Text style={{textAlign:'center', marginTop:40, color:'#888'}}>No special days for this month.</Text>
          ) : (
            events.map((event, idx) => (
              <EventItem key={idx} event={event} />
            ))
          )}
        </ScrollView>
      )}
      <WheelPickerModal_3
        visible={showMonthModal}
        initialMonth={selectedMonthNum - 1}
        initialYear={selectedYear}
        onValueChange={({ month, year }) => {
          setSelectedMonthNum(month + 1); // 1-based for API
          setSelectedYear(year);
        }}
        onClose={() => setShowMonthModal(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    // paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#000000',
    fontWeight: '300',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181B1F',
    marginRight: 8,
  },
  dropdownIcon: {
    fontSize: 16,
    color: '#666666',
    fontWeight: '300',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    // paddingHorizontal: 20,
  },
  eventItem: {
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDE2EB',
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  indicator: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#5756C8',
    marginRight: 12,
  },
  gregorianDate: {
    fontSize: 12,
    color: '#686E7A',
    fontWeight: '400',
  },
  eventName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#181B1F',
    marginBottom: 4,
    // marginLeft: 20,
  },
  specialEvent: {
    color: '#DC2626',
  },
  hijriDate: {
    fontSize: 14,
    color: '#181B1F',
    // marginLeft: 20,
    fontWeight: '400',
  },
});

export default EventScreen;