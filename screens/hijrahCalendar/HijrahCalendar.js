import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView, Image } from 'react-native';
import { WelcomeButton } from '../../components/UI/Button';
import { getCalendarList } from '../../redux/slices/quranSlice';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useLoading } from '../../context/LoadingContext';
import backArrow from '../../assets/images/Common/backArrow.png';
import ArrowDownIcon from '../../assets/images/Common/arrow_down.svg';
import WheelPickerModal_3 from '../../components/UI/WheelPickerModal_3';
import moment from 'moment';
import { getData } from '../../constants/Storage';
import { NAVIGATIONBAR_HEIGHT, STATUSBAR_HEIGHT } from '../../constants/Dimentions';
import { scale, verticalScale } from 'react-native-size-matters';
import Header from '../../components/UI/Header';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


const HijrahCalendar = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [calendarData, setCalendarData] = useState(null);
  const [dataList, setDataList] = useState(null);
    const {
      showLoader,
      hideLoader,
      startProcessing
    } = useLoading();
  
    const islamicMonth = useSelector(state => state.quran.islamicMonth);
    const islamicYear = useSelector(state => state.quran.islamicYear);
const specialDays = useSelector(state => state.quran.responseGetspecialDays) || [];
  
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState('');
  const [reminders, setReminders] = useState({});
  const [islamicEvents, setIslamicEvents] = useState({});
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date()?.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date()?.getFullYear());

  const [reminderForm, setReminderForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '08:00',
    repeat: 'Do not Repeat'
  });
  const [showMonthModal, setShowMonthModal] = useState(false)
  const [hijriDate, setHijriDate] = useState('');

  // Islamic months mapping
  const hijriMonths = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  useEffect(() => {
if(islamicMonth) {
}
  },[islamicMonth])

useEffect(() => {
    if (isFocused == true) {
      handleGetApi(selectedMonth, selectedYear);
    }
  }, [isFocused]);

  const handleGetApi = (currentMonth, selectedYear) => {
    const getMonth = currentMonth;
    const getYear = selectedYear;
    showLoader(true);
    dispatch(getCalendarList({getMonth, getYear}))
      .unwrap()
      .then(async res => {
        hideLoader(true);
        if (res?.calendar?.code === 200) {
          setDataList(res?.calendar?.data)
        } else {
          toast.show(res?.data?.message || 'data fetch failed', {
            type: 'danger',
            placement: 'bottom',
          });
        }
      })
      .catch(err => {
        hideLoader(true);
        toast.show(res?.data?.message || 'Something went wrong!', {
          type: 'danger',
          placement: 'bottom',
        });
        
      });
  };

  // Convert Gregorian to Hijri (simplified approximation)
  const convertToHijri = (gregorianDate) => {
    const hijriEpoch = new Date('622-07-16');
    const daysDiff = Math.floor((gregorianDate - hijriEpoch) / (1000 * 60 * 60 * 24));
    const hijriYear = Math.floor(daysDiff / 354.367) + 1;
    const remainingDays = daysDiff % 354.367;
    const hijriMonth = Math.floor(remainingDays / 29.531) + 1;
    const hijriDay = Math.floor(remainingDays % 29.531) + 1;
    
    return {
      day: hijriDay,
      month: hijriMonth,
      year: hijriYear + 1446, // Approximate current Hijri year
      monthName: hijriMonths[hijriMonth - 1] || 'Zilqadatil Haram'
    };
  };
  useEffect(() => {
    const today = new Date();
    const hijri = convertToHijri(today);
    setHijriDate(`${hijri.monthName} - ${hijri.year}`);
  }, []);

  const handleDatePress = (day) => {
    setSelectedDate(day.dateString);
    setReminderForm({
      ...reminderForm,
      date: day.dateString,
      time: '08:00'
    });
    setShowReminderModal(true);
    
    navigation.navigate('AllEventReminder', {focusDate: day?.dateString, dayMonth: day?.dayMonth, dayYear: day?.dayYear })
  };

  const handleAddReminder = () => {
    navigation.navigate('AddReminderHijrahCalendar')
    setShowReminderModal(true);
  };

  const weekdayToIndex = {
    "Sunday": 0,
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6
  };

useEffect(() => {
  if (!dataList || dataList.length === 0) return;

  const firstWeekday = dataList[0]?.gregorian?.weekday?.en;
  const blankCount = weekdayToIndex[firstWeekday] || 0;

  // Create a shallow copy to avoid mutating props/state directly
  const modifyData = [...dataList];

  // Insert `null` items at the beginning
  for (let i = 0; i < blankCount; i++) {
    modifyData.unshift(null);
  }

  setCalendarData(modifyData);
}, [dataList]);
 const uniqueHijriMonthYears = [
    ...new Set(
      calendarData?.map(item => {
        const month = item?.hijri?.month?.en;
        const year = item?.hijri?.year;
        if (month && year) return `${month} ${year}`;
      }).filter(Boolean)
    )
  ];
  const uniqueGregorianMonthYears = [
    ...new Set(
      calendarData?.map(item => {
        const month = item?.gregorian?.month?.en;
        const year = item?.gregorian?.year;
        if (month && year) return `${month} ${year}`;
      }).filter(Boolean)
    )
  ];

  // Add useEffect to load reminders from storage
  useEffect(() => {
    const loadReminders = async () => {
      const data = await getData('reminders');
      setReminders(Array.isArray(data) ? data : {});
    };
    loadReminders();
  }, [isFocused, dataList]);
     const insets = useSafeAreaInsets();
  return (
    <SafeAreaView style={styles.container} >
    <View style={[styles.container,{paddingTop:STATUSBAR_HEIGHT,marginBottom: insets?.bottom+10,}]}>
      
      {/* Header */}
      <View style={styles.header}>
        <Header  onBackPress={() => navigation.goBack()} />
        {/* <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={backArrow} />
        </TouchableOpacity> */}
        <TouchableOpacity onPress={() => setShowMonthModal(true)} style={styles.headerCenter}>
          <View style={{flexDirection:'row', alignItems:'center'}}>
          <Text style={styles.monthYear}>
          {uniqueGregorianMonthYears?.join(' - ')} 
          {/* {uniqueHijriMonthYears?.join(' - ')} */}
          {/* ▼ */}
          </Text>
          <View style={{marginLeft:5}} > 
          <ArrowDownIcon />
          </View>
          </View>
          {/* <Text style={styles.hijriMonth}>
          {uniqueGregorianMonthYears?.join(' - ')} 
          {uniqueHijriMonthYears?.join(' - ')}
            {hijriDate}
          </Text> */}
        </TouchableOpacity >
        <TouchableOpacity style={styles.addButton} onPress={handleAddReminder}>
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View style={{}} >
        <View style={styles.weekDays}>
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
            <Text key={index} style={[styles.weekDay,
            ]}>{day}</Text>
          ))}
        </View>

        {/* Custom calendar grid */}
        <View style={styles.calendarGrid}>
          {calendarData?.map((item, i) => {

             const day = item ? item?.gregorian.day  : '';
             const dayMonth = item?.gregorian?.month?.number;
             const dayYear = item?.gregorian?.year
            const dateStr = `${item?.gregorian?.year}-${item?.gregorian?.month?.number?.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const hijri = item ? item?.hijri : '';
            // const hasEvent = islamicEvents[dateStr];
            const hasEvent = specialDays.some(ev => String(ev.day) === String(hijri?.day) && String(ev.month) === String(hijri.month.number));
            
            const cellDate = item?.gregorian?.date; // e.g. '2025-05-21'
            const dots = Array.isArray(reminders)
              ? reminders
                  .filter(r => {
                    if (!r.date) return false;
                    const reminderDate = moment(r.date, 'YYYY-MM-DD');
                    const cellMoment = moment(cellDate, 'DD-MM-YYYY');
                    if (r.repeat === 'Do not Repeat') {
                      return r.date === cellMoment.format('YYYY-MM-DD');
                    }
                    if (r.repeat === 'Daily') {
                      return cellMoment.isSameOrAfter(reminderDate, 'day');
                    }
                    if (r.repeat === 'Weekly') {
                      return cellMoment.isSameOrAfter(reminderDate, 'day') && cellMoment.day() === reminderDate.day();
                    }
                    if (r.repeat === 'Monthly') {
                      return cellMoment.isSameOrAfter(reminderDate, 'day') && cellMoment.date() === reminderDate.date();
                    }
                    if (r.repeat === 'Annually') {
                      return cellMoment.isSameOrAfter(reminderDate, 'day') && cellMoment.date() === reminderDate.date() && cellMoment.month() === reminderDate.month();
                    }
                    return false;
                  })
                  .map(r => {
                    // Assign color based on repeat type
                    switch (r.repeat) {
                      case 'Daily': return { color: '#3B82F6' };      // Blue
                      case 'Weekly': return { color: '#22C55E' };     // Green
                      case 'Monthly': return { color: '#F59E42' };    // Orange
                      case 'Annually': return { color: '#A855F7' };   // Purple
                      default: return { color: '#EF4444' };           // Red
                    }
                  })
              : [];
            // const hasReminder = reminders[dateStr] && reminders[dateStr].length > 0;
            // const isToday = day == new Date()?.getDate()// 21; // Mock today as 21st
            const isToday = item?.gregorian?.date == moment(new Date(), "DD/MM/YYYY").format('DD-MM-YYYY')

            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dayCell,
                  // isToday && styles.todayCell
                ]}
                onPress={() => handleDatePress({ dateString: dateStr, day, dayMonth, dayYear })}
              >
                <View style={[ styles.selectedDayCell, isToday && styles.todayCell]} >
                <Text style={[
                  styles.gregorianDay,
                  item?.gregorian?.weekday?.en == 'Sunday' && { color:'#88909E' }, item?.gregorian?.weekday?.en == 'Saturday'  && { color:'#88909E' },
                  hasEvent && styles.eventDayText,
                  isToday && styles.todayDayText, 
                ]}>
                  {/* {convertToArabicNumerals(hijri.day)} */}
                  {day ? +day : ''}
                
                </Text>
                </View>
                <Text style={[
                  styles.hijriDay,
                  // isToday && styles.todayHijriText
                ]}>
                  {hijri.day}
                  {/* {day ? +day : ''} { hijri.day == 1 || day == 1 ? dayMonth : ""} */}
                </Text>
                <View style={styles.dotContainer}>
                  {dots?.length > 0 && (
                    <View style={[
                      styles.dot,
                      
                      { backgroundColor: '#F76B64'  }
                    ]} />
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={{flex:1, backgroundColor:'#F9FAFC'}} />
      {/* See all events button */}
      <View style={{ justifyContent:'flex-end',  paddingTop:verticalScale(20), borderTopWidth:1, borderColor:'#DDE2EB'}} >
      <WelcomeButton tittle={"See all Events"} onPress={() => navigation.navigate('EventScreen')} />
      </View>
      {/* <WheelPickerModal visible={showMonthModal}
  onClose={() => setShowMonthModal(false)}
  selectedMonth={selectedMonth}
  onSelectMonth={setSelectedMonth}
   /> */}
   <WheelPickerModal_3
  visible={showMonthModal}
  initialMonth={selectedMonth - 1} // 0-based index
  initialYear={selectedYear}
  onValueChange={({ month, year }) => {
    setSelectedMonth(month + 1); // 1-based for API
    setSelectedYear(year)
    handleGetApi(month + 1, year);
    // setShowMonthModal(false);
  }}
  onClose={() => setShowMonthModal(false)}
/>
  {/* <MonthSelectionModal showMonthModal={showMonthModal} setShowMonthModal={setShowMonthModal} onPress={(item) => {handleGetApi(item?.id,  new Date()?.getFullYear()); setShowMonthModal(false)} }
  /> */}
    </View>
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
    paddingHorizontal:4,
    // paddingTop: 60,
    paddingBottom: verticalScale(15),
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  headerCenter: {
    alignItems: 'center',
    marginLeft:-30
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181B1F',
  },
  hijriMonth: {
    fontSize: 12,
    color: '#686E7A',
    fontWeight:'500',
    marginTop: 5,
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addIcon: {
    fontSize: 28,
    color: '#181B1F',
    fontWeight: '400',
  },
  calendarContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  weekDays: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: verticalScale(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  weekDay: {
    fontSize: 10,
    fontWeight: '600',
    color: '#181B1F',
    width: 40,
    textAlign: 'center',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // paddingVertical: 10,
    borderBottomWidth:1,
    borderColor:'#DDE2EB',
    // borderWidth:1,
    paddingHorizontal:10,
  },
  dayCell: {
    width: '14.28%',
    // height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: verticalScale(12),
     paddingBottom: verticalScale(6),
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    // paddingBottom:verticalScale(10),
    marginBottom: -5
    // borderWidth:1s
  },
  todayCell: {
    height:35,
    width:35,
    backgroundColor: '#5756C8',
    borderRadius: 35,
    alignItems:'center', justifyContent:'center'

    // margin: 2,
  },
  selectedDayCell: {
    height:35,
    width:35,
    // backgroundColor: 'tr',
    borderRadius: 35,
    alignItems:'center', justifyContent:'center'

    // margin: 2,
  },
  gregorianDay: {
    fontSize: 18,
    fontWeight: '400',
    color: '#181B1F',
  },
  todayDayText: {
    color: '#FFF',
    fontWeight: '600',
  },
  eventDayText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5756C8',
  },
  hijriDay: {
    fontSize: 16,
    color: '#A6AEBD',
    fontWeight:'400',
    // marginTop: 2,
  },
  todayHijriText: {
    color: '#FFF',
  },
  dotContainer: {
    flexDirection: 'row',
    marginTop: 8,
    height: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 1,
  },
  eventsButton: {
    backgroundColor: '#4A90E2',
    marginHorizontal: 20,
    marginVertical: 20,
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  eventsButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  cancelButton: {
    padding: 8,
  },
  cancelText: {
    fontSize: 16,
    color: '#007AFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  saveButton: {
    padding: 8,
  },
  saveText: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  inputGroup: {
    marginVertical: 15,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  dateDisplay: {
    fontSize: 16,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    color: '#333',
  },
  timeDisplay: {
    fontSize: 16,
    padding: 12,
    backgroundColor: '#F8F8F8',
    borderRadius: 8,
    color: '#333',
  },
  repeatOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  repeatOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  repeatText: {
    fontSize: 14,
    color: '#333',
  },
  selectedText: {
    color: '#FFF',
  },
});

export default HijrahCalendar;
