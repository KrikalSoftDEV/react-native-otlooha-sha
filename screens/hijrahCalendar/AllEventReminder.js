import {useIsFocused, useNavigation} from '@react-navigation/native';
import moment from 'moment';
import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Dimensions,
  Image,
} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getData} from '../../constants/Storage';
import backArrow from '../../assets/images/Common/backArrow.png';
import ArrowDownIcon from '../../assets/images/Common/arrow_down.svg';
import {getCalendarList} from '../../redux/slices/quranSlice';
import WheelPickerModal_3 from '../../components/UI/WheelPickerModal_3';
import {STATUSBAR_HEIGHT} from '../../constants/Dimentions';
import {useLoading} from '../../context/LoadingContext';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

const SCREEN_WIDTH = Dimensions.get('window').width;

const weekdayToIndex = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
  S: 0,
  M: 1,
  T: 2,
  W: 3,
  T: 4,
  F: 5,
  S: 6,
};

const AllEventReminder = props => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const calendar = useSelector(state => state?.quran?.data?.data); // array of days
  const specialDays =
    useSelector(state => state.quran.responseGetspecialDays) || [];
  const [selectedDate, setSelectedDate] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');
  const [reminders, setReminders] = useState([]);
  const [calendarData, setCalendarData] = useState([]);
  const dispatch = useDispatch ? useDispatch() : null; // fallback for non-redux test env
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null); // 1-based
  const [selectedYear, setSelectedYear] = useState(null);
  // const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-based
  // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const focusDate = moment(props?.route?.params?.focusDate).format(
    'DD-MM-YYYY',
  );
  const dayMonth = props?.route?.params?.dayMonth;
  const dayYear = props?.route?.params?.dayYear;

  const {showLoader, hideLoader} = useLoading();
  // Pad calendar so first week starts on Sunday and last week is complete
  React.useEffect(() => {
    if (!calendar || calendar.length === 0) return;
    const firstWeekday = calendar[0]?.gregorian?.weekday?.en;
    const blankCount = weekdayToIndex[firstWeekday] || 0;
    const modifyData = [...calendar];
    for (let i = 0; i < blankCount; i++) {
      modifyData.unshift(null);
    }
    // Pad end so last week is complete
    const remainder = modifyData.length % 7;
    if (remainder !== 0) {
      for (let i = 0; i < 7 - remainder; i++) {
        modifyData.push(null);
      }
    }
    setCalendarData(modifyData);
  }, [calendar]);

  // Helper: get week for a given date
  const getWeekForDate = dateStr => {
    if (!calendarData || !Array.isArray(calendarData)) return [];
    const idx = calendarData.findIndex(d => d && d.gregorian.date === dateStr);
    if (idx === -1) return [];
    // Find the start of the week (Sunday)
    const dayOfWeek = moment(dateStr, 'DD-MM-YYYY').day();
    const startIdx = idx - dayOfWeek;
    return calendarData.slice(startIdx, startIdx + 7);
  };

  // Helper: split calendar into weeks
  const getWeeksFromCalendar = calendarArr => {
    if (!calendarArr || !Array.isArray(calendarArr)) return [];
    const weeks = [];
    for (let i = 0; i < calendarArr.length; i += 7) {
      weeks.push(calendarArr.slice(i, i + 7));
    }
    return weeks;
  };

  const convertToArabicNumerals = number => {
    const arabicNumerals = {
      0: '٠',
      1: '١',
      2: '٢',
      3: '٣',
      4: '٤',
      5: '٥',
      6: '٦',
      7: '٧',
      8: '٨',
      9: '٩',
    };

    return number
      ?.toString()
      ?.replace(/[0-9]/g, digit => arabicNumerals[digit]);
  };
  // Set today as default selected
  React.useEffect(() => {
    if (!selectedYear) {
      setSelectedYear(dayYear);
    }

    if (!selectedMonth) {
      setSelectedMonth(dayMonth);
    }
  }, [isFocused]);
  React.useEffect(() => {
    if (!selectedDate && calendar && calendar.length > 0) {
      const today = focusDate;

      const found = calendar.find(d => d.gregorian.date === today);
      setSelectedDate(
        found ? found.gregorian.date : calendar[0].gregorian.date,
      );
    }
  }, [calendar, selectedDate, isFocused]);

  // Weeks data and current week index
  const weeks = useMemo(
    () => getWeeksFromCalendar(calendarData),
    [calendarData],
  );
  const currentWeekIndex = useMemo(() => {
    if (!selectedDate || !weeks.length) return 0;

    return weeks.findIndex(week =>
      week.some(day => {
        return day && day.gregorian.date === selectedDate;
      }),
    );
  }, [weeks, selectedDate]);
  const flatListRef = React.useRef(null);

  // Get current week days for the selected date
  const weekDays = useMemo(() => {
    if (!selectedDate) return [];
    const week = getWeekForDate(selectedDate);
    // If week is not full (start or end of month), pad with nulls
    const firstDay = week[0];
    let padStart = 0;
    if (firstDay) {
      padStart = moment(firstDay.gregorian.date, 'DD-MM-YYYY').day();
    }
    const padded = [...Array(padStart).fill(null), ...week];
    return padded.length < 7
      ? [...padded, ...Array(7 - padded.length).fill(null)]
      : padded;
  }, [selectedDate, calendarData]);

  // Find events for the selected day
  // const eventsForSelectedDay = useMemo(() => {
  //   if (!selectedDate) return [];
  //   const hijriDay = calendar?.find(
  //     d => d.gregorian.date === selectedDate,
  //   )?.hijri;
  //   let events = [];
  //   if (hijriDay) {
  //     events = specialDays.filter(
  //       ev =>
  //         String(ev.day) === String(hijriDay.day) &&
  //         String(ev.month) === String(hijriDay.month.number),
  //     );
  //   }
  //   return events.map(ev => ({
  //     id: `event-${ev.day}-${ev.month}`,
  //     type: 'event',
  //     title: ev.name,
  //     date: selectedDate,
  //     color: '#6366f1',
  //     subtitle: `${ev.day} ${hijriDay?.month?.en}`,
  //     weekday: moment(selectedDate, 'DD-MM-YYYY').format('dddd'),
  //   }));
  // }, [selectedDate, specialDays, calendar]);
const [eventsForSelectedDay, setEventsForSelectedDay] = useState([]);

useEffect(() => {
  if (!selectedDate) {
    setEventsForSelectedDay([]);
    return;
  }

  const hijriDay = calendar?.find(
    d => d.gregorian.date === selectedDate,
  )?.hijri;

  if (!hijriDay) {
    setEventsForSelectedDay([]);
    return;
  }

  const events = specialDays.filter(
    ev =>
      String(ev.day) === String(hijriDay.day) &&
      String(ev.month) === String(hijriDay.month.number),
  );

  const mappedEvents = events.map(ev => ({
    id: `event-${ev.day}-${ev.month}`,
    type: 'event',
    title: ev.name,
    date: selectedDate,
    color: '#6366f1',
    subtitle: `${ev.day} ${hijriDay?.month?.en}`,
    weekday: moment(selectedDate, 'DD-MM-YYYY').format('dddd'),
  }));

  setEventsForSelectedDay(mappedEvents);
}, [selectedDate, specialDays, calendar]);
  // Mock reminders for demo (replace with real reminders if available)
  const remindersForSelectedDay = React.useMemo(() => {
    if (!selectedDate) return [];
    const selectedDateObj = moment(selectedDate, 'DD-MM-YYYY');
    const selectedDayOfWeek = selectedDateObj.day();
    const selectedDayOfMonth = selectedDateObj.date();
    const selectedMonth = selectedDateObj.month();
    const selectedYear = selectedDateObj.year();
    // Filter reminders for the selected date (YYYY-MM-DD) and repeat rules
    return reminders
      .filter(r => {
        if (!r.date) return false;
        const reminderDateObj = moment(r.date, 'YYYY-MM-DD');
        if (r.repeat === 'Do not Repeat') {
          return r.date === selectedDateObj.format('YYYY-MM-DD');
        }
        if (r.repeat === 'Daily') {
          // Show every day after the reminder's start date
          return selectedDateObj.isSameOrAfter(reminderDateObj, 'day');
        }
        if (r.repeat === 'Weekly') {
          // Show on the same day of week, after the reminder's start date
          return (
            selectedDateObj.isSameOrAfter(reminderDateObj, 'day') &&
            selectedDateObj.day() === reminderDateObj.day()
          );
        }
        if (r.repeat === 'Monthly') {
          // Show on the same day of month, after the reminder's start date
          return (
            selectedDateObj.isSameOrAfter(reminderDateObj, 'day') &&
            selectedDateObj.date() === reminderDateObj.date()
          );
        }
        if (r.repeat === 'Annually') {
          // Show on the same month and day, after the reminder's start date
          return (
            selectedDateObj.isSameOrAfter(reminderDateObj, 'day') &&
            selectedDateObj.date() === reminderDateObj.date() &&
            selectedDateObj.month() === reminderDateObj.month()
          );
        }
        return false;
      })
      .map(r => ({
        ...r,
        id: r.id,
        type: 'reminder',
        time: r.time,
        title: r.title,
        description: r.description,
        color: '#ef4444',
      }));
  }, [selectedDate, reminders, isFocused]);

  const allItems = useMemo(() => {
    let items = [...eventsForSelectedDay, ...remindersForSelectedDay];
    if (activeFilter === 'Events') return items.filter(i => i.type === 'event');
    if (activeFilter === 'Reminders')
      return items.filter(i => i.type === 'reminder');
    return items;
  }, [eventsForSelectedDay, remindersForSelectedDay, activeFilter]);

  // Fetch calendar data for selected month/year
  const handleGetApi = (month, year) => {
    if (!dispatch) return;
    showLoader(true);
    dispatch(getCalendarList({getMonth: month, getYear: year}));

    hideLoader(true);
  };

  // On mount or when month/year changes, fetch data
  React.useEffect(() => {
    if (selectedMonth && selectedYear) {
      handleGetApi(selectedMonth, selectedYear);
    }
  }, [selectedMonth, selectedYear]);

  // Month/Year display
  const monthYear = React.useMemo(() => {
    if (!selectedDate) return '';
    const d = calendar?.find(d => d.gregorian.date === selectedDate);

    if (!d) return '';
    return `${moment(selectedDate, 'DD-MM-YYYY').format('MMMM YYYY')}`;
  }, [selectedDate, calendar]);
  const uniqueGregorianMonthYears = [
    ...new Set(
      calendarData
        ?.map(item => {
          const month = item?.gregorian?.month?.en;
          const year = item?.gregorian?.year;
          if (month && year) return `${month} ${year}`;
        })
        .filter(Boolean),
    ),
  ];
  // Render a single day cell for the week bar
  const renderDayCell = (item, idx) => {
    if (!item) {
      return (
        <View
          key={idx}
          style={[styles.dayCell, {backgroundColor: 'transparent'}]}>
          <Text style={[styles.dayText, {color: '#ccc'}]}> </Text>
        </View>
      );
    }
    const isSelected = item.gregorian.date === selectedDate;
    const isToday =
      item?.gregorian?.date ==
      moment(new Date(), 'DD/MM/YYYY').format('DD-MM-YYYY');
    const selectedMonth = moment(selectedDate, 'DD-MM-YYYY').month();
    const thisMonth = moment(item.gregorian.date, 'DD-MM-YYYY').month();
    const isOtherMonth = selectedMonth !== thisMonth;
    const hijriDay = item.hijri;
    const hasEvent = specialDays.some(
      ev =>
        String(ev.day) === String(hijriDay.day) &&
        String(ev.month) === String(hijriDay.month.number),
    );

    // --- COLOURED DOT LOGIC (from HijrahCalendar) ---
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
              return (
                cellMoment.isSameOrAfter(reminderDate, 'day') &&
                cellMoment.day() === reminderDate.day()
              );
            }
            if (r.repeat === 'Monthly') {
              return (
                cellMoment.isSameOrAfter(reminderDate, 'day') &&
                cellMoment.date() === reminderDate.date()
              );
            }
            if (r.repeat === 'Annually') {
              return (
                cellMoment.isSameOrAfter(reminderDate, 'day') &&
                cellMoment.date() === reminderDate.date() &&
                cellMoment.month() === reminderDate.month()
              );
            }
            return false;
          })
          .map(r => {
            // Assign color based on repeat type
            switch (r.repeat) {
              case 'Daily':
                return {color: '#3B82F6'}; // Blue
              case 'Weekly':
                return {color: '#22C55E'}; // Green
              case 'Monthly':
                return {color: '#F59E42'}; // Orange
              case 'Annually':
                return {color: '#A855F7'}; // Purple
              default:
                return {color: '#EF4444'}; // Red
            }
          })
      : [];
    // --- END COLOURED DOT LOGIC ---

    return (
      <View key={item.gregorian.date || idx}>
        <TouchableOpacity
          style={[
            styles.dayCell,
            isToday && styles.todayCell,
            isSelected && styles.selectedDayCell,
          ]}
          onPress={() => setSelectedDate(item.gregorian.date)}
          // disabled={isOtherMonth}
          >
          <Text
            style={[
              styles.dayText,
              hasEvent && styles.eventDayText,
              isToday && styles.todayText,
              isSelected && styles.selectedDayText,
            ]}>
            {+item.gregorian.day}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.daySubText]}>{+item.hijri.day}</Text>
        {dots.length > 0 && <View style={styles.eventDot} />}
      </View>
    );
  };

  React.useEffect(() => {
    const loadReminders = async () => {
      const data = await getData('reminders');
      setReminders(Array.isArray(data) ? data : []);
    };
    loadReminders();
  }, [selectedDate, isFocused]);

  React.useEffect(() => {
    if (
      flatListRef.current &&
      weeks.length > 0 &&
      currentWeekIndex >= 0 &&
      currentWeekIndex < weeks.length
    ) {
      flatListRef.current.scrollToIndex({
        index: currentWeekIndex,
        animated: true,
      });
    }
  }, [currentWeekIndex, weeks]);
const formatTime = time => {
    return time?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Image source={backArrow} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.monthSelector}
          onPress={() => setShowMonthModal(true)}>
          <Text style={styles.monthText}>{uniqueGregorianMonthYears}</Text>
          <View style={{marginLeft: 5}}>
            <ArrowDownIcon />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('AddReminderHijrahCalendar')}
          style={styles.addButton}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>
      {/* Calendar Bar */}
      <View style={styles.calendarBarContainer}>
        <View style={[styles.weekDaysRow]}>
          {WEEKDAYS.map((day, idx) => (
            <Text key={idx} style={styles.weekDayText}>
              {day}
            </Text>
          ))}
        </View>
        {weeks.length > 0 && (
          <FlatList
            ref={flatListRef}
            data={weeks}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={currentWeekIndex}
            getItemLayout={(data, index) => ({
              length: SCREEN_WIDTH,
              offset: SCREEN_WIDTH * index,
              index,
            })}
            keyExtractor={(_, idx) => `week-${idx}`}
            renderItem={({item: week, index}) => {
              return (
                <View
                  style={[
                    styles.weekRow,
                    {width: SCREEN_WIDTH, paddingHorizontal: 10},
                    // index === weeks.length - 1 ? { justifyContent: 'flex-start' } : { justifyContent: 'space-around' }
                  ]}>
                  {week.map((item, idx) => renderDayCell(item, idx))}
                </View>
              );
            }}
            style={{flexGrow: 0}}
          />
        )}
      </View>
      {/* Filter Tabs */}
      <View style={styles.filterContainer}>
        {['All', 'Events', 'Reminders'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterTab,
              activeFilter === filter && styles.activeFilterTab,
            ]}
            onPress={() => setActiveFilter(filter)}>
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText,
              ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Items List */}
      <ScrollView style={styles.itemsList} showsVerticalScrollIndicator={false}>
        {eventsForSelectedDay.length === 0 &&
        remindersForSelectedDay.length === 0 ? (
          <Text style={{textAlign: 'center', color: '#888', marginTop: 40}}>
            No events or reminders for this day.
          </Text>
        ) : null}

        {activeFilter !== 'Reminders' && eventsForSelectedDay.length != 0 
          ? <FlatList 
          data={eventsForSelectedDay}
          renderItem={(item) => {
             item = item.item
            return(
            selectedDate ==  item?.date && <View key={item.id} style={styles.itemContainer}>
                <View style={styles.itemHeader}>
                  <View
                    style={[styles.itemDot, {backgroundColor: '#6366f1'}]}
                  />
                  <Text style={styles.itemDate}>
                    {moment(item.date, 'DD-MM-YYYY').format('D MMMM')} -{' '}
                    {item.weekday}
                  </Text>
                </View>
                <Text style={styles.itemTitle}>{item.title}</Text>
                {item.subtitle && (
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                )}
              </View>
            )
          }}
          />
          //  eventsForSelectedDay?.map(item => (
          //     <View key={item.id} style={styles.itemContainer}>
          //       <View style={styles.itemHeader}>
          //         <View
          //           style={[styles.itemDot, {backgroundColor: '#6366f1'}]}
          //         />
          //         <Text style={styles.itemDate}>
          //           {moment(item.date, 'DD-MM-YYYY').format('D MMMM')} -{' '}
          //           {item.weekday}
          //         </Text>
          //       </View>
          //       <Text style={styles.itemTitle}>{item.title}</Text>
          //       {item.subtitle && (
          //         <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
          //       )}
          //     </View>
          //   ))
          : null}
        {activeFilter !== 'Events'
          ? remindersForSelectedDay?.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.itemContainer}
                onPress={() =>
                  navigation.navigate('ReminderDetailsScreen', {reminder: item})
                }>
                <View style={styles.itemHeader}>
                  <View
                    style={[styles.itemDot, {backgroundColor: '#ef4444'}]}
                  />
                  <Text style={styles.itemDate}>{formatTime(moment(item?.time, 'HH:mm').toDate())}</Text>
                </View>
                <Text style={styles.itemTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                {item.description && (
                  <Text style={styles.itemDescription} numberOfLines={1}>
                    {item.description}
                  </Text>
                )}
              </TouchableOpacity>
            ))
          : null}
      </ScrollView>
      {/* Month Picker Modal */}
      <WheelPickerModal_3
        visible={showMonthModal}
        initialMonth={selectedMonth - 1}
        initialYear={selectedYear}
        onValueChange={({month, year}) => {
          setSelectedMonth(month + 1); // 1-based for API
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
    backgroundColor: '#ffffff',
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 4,
    // paddingVertical: 15,
    paddingBottom: 28,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
    fontWeight: '300',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181B1F',
    marginRight: 4,
  },
  addButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 22,
    color: '#181B1F',
    fontWeight: '400',
  },
  calendarBarContainer: {
    paddingHorizontal: 0,
    paddingBottom: 10,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#DDE2EB',
  },
  weekDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 0,
    marginTop: 0,
    paddingHorizontal: 10,
  },
  weekDayText: {
    fontSize: 10,
    color: '#181B1F',
    fontWeight: '400',
    width: 40,
    textAlign: 'center',
  },
  weekRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // alignItems: 'center',
    paddingTop: 7,
  },
  dayCell: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 0,
    position: 'relative',
  },
  todayCell: {
    backgroundColor: '#E4E2FD',
    borderRadius: 20,
  },
  selectedDayCell: {
    backgroundColor: '#191967',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 18,
    color: '#181B1F',
    fontWeight: '400',
    textAlign: 'center',
  },
  daySubText: {
    fontSize: 14,
    color: '#A6AEBD',
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
  },
  todayText: {
    color: '#181B1F',
    fontWeight: '600',
  },
  selectedDayText: {
    color: '#fff',
    fontWeight: '600',
  },
  otherMonthText: {
    color: '#bbb',
  },
  eventDot: {
    width: 6,
    height: 6,
    backgroundColor: '#F76B64',
    borderRadius: 3,
    marginTop: 9,
    bottom: 4,
    alignSelf: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    marginTop: 10,
  },
  filterTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDE2EB',
  },
  activeFilterTab: {
    backgroundColor: '#E4E2FD',
    borderColor: '#5756C8',
  },
  filterText: {
    fontSize: 14,
    color: '#181B1F',
    fontWeight: '400',
  },
  activeFilterText: {
    color: '#181B1F',
    fontWeight: '600',
  },
  itemsList: {
    flex: 1,
    // paddingHorizontal: 20,
  },
  itemContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingHorizontal: 22,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  itemDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  itemDate: {
    fontSize: 14,
    color: '#686E7A',
    fontWeight: '400',
  },
  itemTitle: {
    fontSize: 14,
    color: '#181B1F',
    fontWeight: '500',
    marginBottom: 2,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#181B1F',
    fontWeight: '400',
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
  },
  eventDayText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5756C8',
  },
});

export default AllEventReminder;
