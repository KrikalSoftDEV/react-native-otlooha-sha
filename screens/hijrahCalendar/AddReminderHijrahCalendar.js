import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {Calendar} from 'react-native-calendars';
import res from '../../constants/res';
import Emailinput from '../../components/UI/Emailinput';
import {scale, verticalScale} from 'react-native-size-matters';
import textinput_calander_gray from '../../assets/images/Calender/textinput_calander_gray.png';
import Clock_gray from '../../assets/images/Calender/Clock_gray.png';
import Arrow_down_gray from '../../assets/images/Calender/Arrow_down_gray.png';
import SquareEdit from '../../assets/images/Calender/squareEdit.png';
import close_icon from '../../assets/images/close-icon.png';
import {WelcomeButton} from '../../components/UI/Button';
import moment from 'moment';
import { storeData, getData } from '../../constants/Storage';
import CommonTextInput from '../../components/UI/CommonTextInput';
import { ErrorText } from '../../components/UI/CustomText';
import RepeatWheelPickerModal from '../../components/UI/RepeatWheelPickerModal';
import { NAVIGATIONBAR_HEIGHT } from '../../constants/Dimentions';
import arrow_Forward_small from '../../assets/images/Calender/arrow_Forward_small.png';
import arrow_Forward from '../../assets/images/Calender/arrow_Forward.png';
import arrrow_backward from '../../assets/images/Calender/arrrow_backward.png';
import { STATUSBAR_HEIGHT } from '../../constants/Dimentions';
import CrossIcon from "../../assets/images/Calender/crossIcon.svg"

// Arrow_down_gray@3x
// Clock_gray@3x

// textinput_calander_gray@3x

const AddReminderHijrahCalendar = ({navigation, route}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedDate, setSelectedDate] = useState( moment(new Date, "DD-MM-YYYY")?.format('YYYY-MM-DD'));
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [repeatOption, setRepeatOption] = useState('Do not Repeat');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showRepeatModal, setShowRepeatModal] = useState(false);
  const [titleCharCount, setTitleCharCount] = useState(0);
  const [descCharCount, setDescCharCount] = useState(0);

  const [selectedDateModal, setSelectedDateModal] = useState(false);
  const [titleError, setTitleError] = useState('');
  const [descError, setDescError] = useState('');
  const [showTitleError, setShowTitleError] = useState(false);
  const [showDescError, setShowDescError] = useState(false);
  const titleInputRef = useRef(null);
  const descInputRef = useRef(null);

  const handleDayPress = day => {
    setSelectedDateModal(false);
    setSelectedDate(day?.dateString);
    // if (onDateSelect) {
    //     setSelectedDate(moment(day).format("DD MMM YYYY"));
    // }
  };

  const markedDates = {
    [moment(selectedDate).format('YYYY-MM-DD')]: {
      selected: true,
      selectedColor: '#5B5FDB',
      selectedTextColor: 'white',
    },
  };

  // Pre-fill date and time based on navigation params
  useEffect(() => {
    if (route?.params?.reminder) {
      const r = route.params.reminder;
      setTitle(r.title || '');
      setDescription(r.description || '');
      setSelectedDate(r.date ? new Date(r.date) : new Date());
      setSelectedTime(r.time ? moment(r.time, 'HH:mm').toDate() : new Date());
      setRepeatOption(r.repeat || 'Do not Repeat');
      setTitleCharCount((r.title || '').length);
      setDescCharCount((r.description || '').length);
    }
  }, [route?.params?.reminder]);

  const repeatOptions = [
    'Do not Repeat',
    'Daily',
    'Weekly',
    'Monthly',
    'Annually',
  ];

  const handleTitleChange = text => {
    if (text.length <= 100) {
      setTitle(text);
      setTitleCharCount(text.length);
    }
  };

  const handleDescriptionChange = text => {
    if (text.length <= 1000) {
      setDescription(text);
      setDescCharCount(text.length);
    }
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      // Validate that selected date is not in the past
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDateOnly = new Date(date);
      selectedDateOnly.setHours(0, 0, 0, 0);

      if (selectedDateOnly >= today) {
        setSelectedDate(date);
      } else {
        Alert.alert('Invalid Date', 'Please select a future date.');
      }
    }
  };

  const handleTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      // Validate that selected time is not in the past (for today)
      const now = new Date();
      const selectedDateTime = new Date(selectedDate);
      selectedDateTime.setHours(time.getHours(), time.getMinutes(), 0, 0);

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDateOnly = new Date(selectedDate);
      selectedDateOnly.setHours(0, 0, 0, 0);

      if (
        selectedDateOnly.getTime() === today.getTime() &&
        selectedDateTime <= now
      ) {
        Alert.alert('Invalid Time', 'Please select a future time.');
      } else {
        setSelectedTime(time);
      }
    }
  };
  
  const handleSaveReminder = async () => {
    let hasError = false;
    setShowTitleError(false);
    // setShowDescError(false);
    setTitleError('');
    setDescError('');

    // Validate mandatory title field
    if (!title.trim()) {
      setTitleError('Please enter title.');
      setShowTitleError(true);
      hasError = true;
    } else if (title.length > 100) {
      setTitleError('Title cannot exceed 100 characters.');
      setShowTitleError(true);
      hasError = true;
    }
    // if (!description.trim()) {
    //   setDescError('Please enter description.');
    //   setShowDescError(true);
    //   hasError = true;
    // } else if (description.length > 1000) {
    //   setDescError('Description cannot exceed 1000 characters.');
    //   setShowDescError(true);
    //   hasError = true;
    // }
    // Focus first error field
    setTimeout(() => {
      if (hasError) {
        if (showTitleError && titleInputRef.current) {
          titleInputRef.current.focus();
        } else if (showDescError && descInputRef.current) {
          descInputRef.current.focus();
        }
      }
    }, 100);
    if (hasError) return;
    // Validate date and time
    let reminderDate = selectedDate;
    let reminderTime = selectedTime;
    let dateObj = new Date(reminderDate);
    let timeObj = new Date(reminderTime);
    let now = new Date();
    let combinedDateTime = new Date(dateObj);
    combinedDateTime.setHours(timeObj.getHours(), timeObj.getMinutes(), 0, 0);
    if (combinedDateTime <= now) {
      Alert.alert('Validation Error', 'Please select a future date and time.');
      return;
    }
    try {
      let reminders = await getData('reminders');
      if (!Array.isArray(reminders)) reminders = [];
      let reminderData = {
        id: route?.params?.reminder?.id || Date.now().toString(),
        title: title.trim(),
        description: description.trim(),
        date: moment(reminderDate).format('YYYY-MM-DD'),
        time: moment(reminderTime).format('HH:mm'),
        repeat: repeatOption,
        created: route?.params?.reminder?.created || new Date().toISOString(),
      };
      if (route?.params?.reminder) {
        // Edit mode: update existing reminder
        reminders = reminders.map(r => r.id === reminderData.id ? reminderData : r);
      } else {
        // Add mode: add new reminder
        reminders.push(reminderData);
      }
      await storeData('reminders', reminders);
      Alert.alert('Success', `Reminder ${route?.params?.reminder ? 'updated' : 'saved'} successfully!`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to save reminder.');
    }
  };

  const formatDate = date => {
    const options = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatTime = time => {
    console.log('----time', time);
    
    return time.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
      

 const DateModal = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
  const [showYearPicker, setShowYearPicker] = useState(false);
  const yearScrollViewRef = useRef(null);

  const addMonth = () => {
    setCurrentMonth(prev => {
      const newDate =  new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const subtractMonth = () => {
    setCurrentMonth(prev => {
      const newDate =  new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const addYear = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() + 1);
      return newDate;
    });
  };

  const subtractYear = () => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(prev.getFullYear() - 1);
      return newDate;
    });
  };

  const handleYearPress = () => {
    setShowYearPicker(!showYearPicker);
    
    // Auto-scroll to selected year when opening year picker
    if (!showYearPicker) {
      setTimeout(() => {
        const currentYear = currentMonth?.getFullYear();
        const yearList = generateYearList();
        const yearIndex = yearList.findIndex(year => year === currentYear);
        
        if (yearIndex !== -1 && yearScrollViewRef.current) {
          // Calculate the position to scroll to center the selected year
          const itemHeight = 44; // paddingVertical(10) + marginVertical(2*2) + text height ≈ 44
          const scrollPosition = yearIndex * itemHeight  + 80; // Offset to center in view
          
          yearScrollViewRef.current.scrollTo({
            y: Math.max(0, scrollPosition),
            animated: true
          });
        }
      }, 100); // Small delay to ensure the ScrollView is rendered
    }
  };

  const selectYear = (year) => {
    setCurrentMonth(prev => {
      const newDate = new Date(prev);
      newDate.setFullYear(year);
      return newDate;
    });
    setShowYearPicker(false);
  };

  const generateYearList = () => {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i <= currentYear + 74; i++) {
      years.push(i);
    }
    return years;
  };

  const renderCustomCalendarHeader = (date) => {
    const monthName = currentMonth?.toLocaleString('default', { month: 'long' });
    const year = currentMonth?.getFullYear();

    return (
      <View
        style={{
          width: "100%",
          flexDirection: 'row',
          paddingHorizontal: 2,
          alignItems: 'center',
          position: 'relative',
          justifyContent: 'space-between'
        }}
      >
        {/* Month and Year Display */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 15 }}>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }} 
            onPress={handleYearPress}
          >
            <Text style={{ fontSize: 17, color: '#181B1F', fontWeight: '600' }}>
              {monthName} {year}
            </Text>
            <Image source={arrow_Forward} />
          </TouchableOpacity>
        </View>

        {/* Month Navigation */}
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TouchableOpacity onPress={subtractMonth} style={{ paddingHorizontal:5, paddingVertical:2}} >
            <Image source={arrrow_backward} />
          </TouchableOpacity>

          <TouchableOpacity onPress={addMonth} style={{ paddingHorizontal:5, paddingVertical:2}} >
            <Image source={arrow_Forward_small} />
          </TouchableOpacity>
        </View>

        {/* Year Navigation (when year picker is open) */}
        {/* {showYearPicker && (
          <View style={{ flexDirection: 'row', gap: 10, position: 'absolute', right: 100 }}>
            <TouchableOpacity onPress={subtractYear}>
              <Text style={{ fontSize: 18, color: '#181B1F', fontWeight: '600' }}>‹</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={addYear}>
              <Text style={{ fontSize: 18, color: '#181B1F', fontWeight: '600' }}>›</Text>
            </TouchableOpacity>
          </View>
        )} */}
      </View>
    );
  };

  return (
    <Modal
      visible={selectedDateModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setSelectedDateModal(false)}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={{flex:1}} onPress={() => setSelectedDateModal(false)} />
        <View style={styles.modalContainer}>
          <View style={styles.modalHandle} />

          <ModalHeader
            title={'Select Date'}
            subTitle={'Choose the date that works for you.'}
            onClose={() => {}}
          />

          <View style={styles.calendarContent}>
            {/* Year Picker Modal */}
            {showYearPicker && (
              <View style={{
                position: 'absolute',
                top: 50,
                left: 20,
                right: 20,
                backgroundColor: 'white',
                borderRadius: 10,
                maxHeight: 200,
                zIndex: 1000,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                paddingBottom:20
              }}>
                <ScrollView 
                  ref={yearScrollViewRef}
                  style={{ padding: 10 }}
                  showsVerticalScrollIndicator={true}
                >
                  {generateYearList().map((year) => (
                    <TouchableOpacity
                      key={year}
                      style={{
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                        backgroundColor: year === currentMonth?.getFullYear() ? '#5756C8' : 'transparent',
                        borderRadius: 5,
                        marginVertical:  year === currentMonth?.getFullYear() ? 10 : 2,
                      }}
                      onPress={() => selectYear(year)}
                    >
                      <Text style={{
                        fontSize: 16,
                        color: year === currentMonth?.getFullYear() ? 'white' : '#1F2937',
                        textAlign: 'center',
                      }}>
                        {year}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Calendar
              minDate={new Date()}
              key={currentMonth?.getTime()} // 👈 Add this key to force re-render
              current={currentMonth?.toISOString()?.split('T')[0]} // 👈 Convert Date to YYYY-MM-DD string
              onDayPress={handleDayPress}
              markedDates={markedDates}
              renderHeader={renderCustomCalendarHeader}
              hideArrows={true}
              style={styles.calendar}
              date={new Date(selectedDate)}
              
              theme={{
                backgroundColor: '#fff',
                calendarBackground: '#fff',
                textSectionTitleColor: '#9CA3AF',
                selectedDayBackgroundColor: '#5756C8',
                selectedDayTextColor: '#ffffff',
                
                todayTextColor: '#5756C8',
                dayTextColor: '#1F2937',
                textDisabledColor: '#D1D5DB',
                dotColor: '#5B5FDB',
                selectedDotColor: '#ffffff',
                arrowColor: '#5B5FDB',
                disabledArrowColor: '#D1D5DB',
                monthTextColor: '#1F2937',
                indicatorColor: '#5B5FDB',
                textDayFontFamily: 'System',
                textMonthFontFamily: 'System',
                textDayHeaderFontFamily: 'System',
                textDayFontWeight: '400',
                textMonthFontWeight: '400',
                textDayHeaderFontWeight: '400',
                textDayFontSize: 20,
                textMonthFontSize: 20,
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 13,
              }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
  const handleRepeatSelect = (option) => {
    setRepeatOption(option);
    // setShowRepeatModal(false);
  };

  const TimeModal = () => (
    <Modal
      visible={showTimePicker}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowTimePicker(false)}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={{flex:1}} onPress={() => setShowTimePicker(false)} />
        <View style={styles.modalContainer}>
          <View style={styles.modalHandle} />

          <ModalHeader
            title={'Select Time'}
            subTitle={'Pick a time that suits you.'}
            onClose={() => setShowTimePicker(false)}
          />

          {showTimePicker && (
            <View style={{alignItems: 'center'}}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                  display='spinner'
                onChange={handleTimeChange}
                  focusable={true}
                
                style={{}}
              />
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  const SelectionField = ({title, selectedItem, rightIcon, onPress}) => (
    <TouchableOpacity
      style={[
        styles.textInputStyle,
        {
          marginVertical: 12,
          marginHorizontal: 20,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
      ]}
      onPress={onPress}>
      <View>
        <Text style={styles.label}>{title}</Text>
        {/* <View style={styles.dateTimeContainer}> */}
        <Text style={styles.dateTimeText}>
          {selectedItem}
          {/* {formatDate(selectedDate)} */}
        </Text>
        {/* </View> */}
      </View>
      <Image source={rightIcon} />
    </TouchableOpacity>
  );
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
 

       <View style={{height: 27, width: 27}}>
                   <CrossIcon  />
                  </View>
            </TouchableOpacity>
        <Text style={styles.headerTitle}>New Reminder</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content}>
        {/* Title Field */}
        {/* <View style={styles.inputContainer}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Title"
            value={title}
            onChangeText={handleTitleChange}
            maxLength={100}
          />
          {titleCharCount > 90 && (
            <Text style={styles.charCount}>{titleCharCount}/100</Text>
          )}
        </View> */}
        <CommonTextInput
          title={'Title'}
          containerStyle={[
            styles.textInputStyle,
            showTitleError && styles.errorInputStyle
          ]}
          enteredText={title}
          setEnteredText={handleTitleChange}
          placeholder={'Enter Title'}
          maxLength={100}
          // error={titleError}
          // showError={showTitleError}
          inputRef={titleInputRef}
          autoFocus={false}
        />
        {titleCharCount > 90 && (
          <Text style={styles.charCount}>{titleCharCount}/100</Text>
        )}
         {showTitleError && titleError ? (
                  <ErrorText style={styles.error}>{titleError}</ErrorText>
                ) : null}
        {/* Description Field */}
        <CommonTextInput
          title={'Description'}
          containerStyle={[
            styles.textInputStyle,
            showDescError && styles.errorInputStyle
          ]}
          enteredText={description}
          setEnteredText={handleDescriptionChange}
          placeholder={'Enter Description'}
          maxLength={1000}
          // error={descError}
          // showError={showDescError}
          inputRef={descInputRef}
          autoFocus={false}
        />
        {descCharCount > 90 && (
          <Text style={styles.charCount}>{descCharCount}/1000</Text>
        )}
         {showDescError && descError ? (
                  <ErrorText style={styles.error}>{descError}</ErrorText>
                ) : null}
        {/* <View style={styles.inputContainer}>
        <Emailinput
              title={"Description"}
              containerStyle={styles.textInputStyle}
              enteredText={description}
              setEnteredText={handleDescriptionChange}
              placeholder={"Enter Description"}
              maxLength={1000}
              numberOfLines={4}
            />
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.textInputStyle]}
            placeholder="Enter Description"
            value={description}
            onChangeText={handleDescriptionChange}
            multiline={true}
            numberOfLines={4}
            maxLength={1000}
          />
          {descCharCount > 900 && (
            <Text style={styles.charCount}>{descCharCount}/1000</Text>
          )}
        </View> */}

        {/* Date Field */}
        <SelectionField
          title={'Date'}
          selectedItem={moment(selectedDate).format('DD MMM YYYY')}
          rightIcon={textinput_calander_gray}
          onPress={() => {
            setSelectedDateModal(true);
          }}
        />
        {/* Time Field */}
        <SelectionField
          title={'Time'}
          selectedItem={formatTime(selectedTime)}
          rightIcon={Clock_gray}
          onPress={() => setShowTimePicker(true)}
        />
        {/* <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowTimePicker(true)}
        >
          <Text style={styles.label}>Time</Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeText}>
              {formatTime(selectedTime)}
            </Text>
            <Text style={styles.icon}>🕐</Text>
          </View>
        </TouchableOpacity> */}

        {/* Repeat Field */}
        <SelectionField
          title={'Repeat'}
          selectedItem={repeatOption}
          rightIcon={Arrow_down_gray}
          onPress={() => setShowRepeatModal(true)}
        />
        {/* <TouchableOpacity
          style={styles.inputContainer}
          onPress={() => setShowRepeatModal(true)}
        >
          <Text style={styles.label}>Repeat</Text>
          <View style={styles.dateTimeContainer}>
            <Text style={styles.dateTimeText}>{repeatOption}</Text>
            <Text style={styles.dropdownIcon}>▼</Text>
          </View>
        </TouchableOpacity> */}
        <View style={{flex: 1, marginTop: 30}}>
          {/* Save Button */}
          <WelcomeButton tittle={'Add Reminder'} onPress={handleSaveReminder} />
        </View>
      </ScrollView>
      {/* <View style={{flex:1}} >

      <WelcomeButton tittle={'Add Reminder'}  onPress={handleSaveReminder}/>
      </View> */}
      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleSaveReminder}
        >
          <Text style={styles.saveButtonText}>Add Reminder</Text>
        </TouchableOpacity>
      </View> */}

      {/* Date Picker */}
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="inline"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {/* Time Picker */}
      {Platform.OS == 'ios' ? <TimeModal /> :  showTimePicker && (
            <View style={{alignItems: 'center'}}>
              <DateTimePicker
                value={selectedTime}
                mode="time"
                  display='spinner'
                onChange={handleTimeChange}
                  focusable={true}
                
                style={{}}
              />
            </View>
          )}
      <DateModal />
      {/* Repeat Modal */}
      <RepeatWheelPickerModal
        visible={showRepeatModal}
        onClose={() => setShowRepeatModal(false)}
        options={repeatOptions}
        selectedOption={repeatOption}
        onSelectOption={handleRepeatSelect}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:STATUSBAR_HEIGHT
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
    paddingVertical: 15,
    borderBottomWidth: 0,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 27,
    color: '#181B1F',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181B1F',
    textAlign:'center'
  },
  placeholder: {
    width: 30,
  },
  content: {
    flex: 1,
    // paddingHorizontal: 20,
    // paddingTop: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '400',
    color: '#686E7A',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#fff',
  },
  dateTimeText: {
    fontSize: 17,
    fontWeight: '500',
    color: '#181B1F',
    marginTop: 10,
  },
  icon: {
    fontSize: 20,
    color: '#666',
  },
  dropdownIcon: {
    fontSize: 12,
    color: '#666',
  },
  charCount: {
    fontSize: 12,
    color: '#686E7A',
    textAlign: 'right',
    marginTop: 4,
    marginBottom: 10,
    marginRight:20
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
  },
  saveButton: {
    backgroundColor: '#4338CA',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    // paddingTop: 20,
    paddingBottom: 40 ,
    // maxHeight: '80%',
    // minHeight: '50%'
    height: '65%'
  },
  modalHeader: {
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    // marginTop:10
  },
  //   modalTitle: {
  //     fontSize: 20,
  //     fontWeight: '600',
  //     color: '#333',
  //   },
  closeButton: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: '#F0F2F7',
    borderRadius: 30,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#88909E',
    fontWeight: 600,
  },
  //   modalSubtitle: {
  //     fontSize: 16,
  //     color: '#666',
  //     marginBottom: 20,
  //   },
  optionsContainer: {
    maxHeight: 400,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DDE2EB',
    backgroundColor: '#fff',
  },
  selectedOption: {
    backgroundColor: '#E4E2FD',
    borderColor: '#5756C8',
  },
  optionText: {
    fontSize: 14,
    color: '#181B1F',
    fontWeight: '500',
    textAlign: 'center',
  },
  selectedOptionText: {
    color: '#181B1F',
    fontWeight: '600',
  },
  calendarModal: {
    // flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    // marginTop: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  modalHandle: {
    width: 66,
    height: 5,
    backgroundColor: '#3C3C434D',
    borderRadius: 3,
    alignSelf: 'center',
    marginTop: 12,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  modalCloseButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#9CA3AF',
  },
  calendarContent: {
    // paddingHorizontal: 20,
    // marginBottom:20,
    // marginHorizontal:10,
    // paddingBottom: 26,
    // // elevation:10,
    // borderWidth:1,
    // backgroundColor:"red"
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181B1F',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: 19,
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#686E7A',
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
  },
  calendar: {
    paddingHorizontal:10,
    paddingTop: 20,
    paddingBottom:10,
    borderRadius: 20,
    shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.1, // ≈ #0000001A
        shadowRadius: 20,   // Bigger blur
    elevation:10

  },
  calendarHeaderStyle: {
    backgroundColor: 'transparent',
  },
  arrow: {
    fontSize: 24,
    fontWeight: '300',
    color: '#5B5FDB',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  leftArrow: {
    marginLeft: -10,
  },
  rightArrow: {
    marginRight: -10,
  },
  textInputStyle: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(18),
    borderWidth: 1,
    borderRadius: scale(14),
    marginVertical: 0,
    marginTop: verticalScale(10),
    borderColor: '#DDE2EB',
  },
  errorInputStyle: {
    borderColor: '#DB423D',
  },
  error: {
    marginTop: 8,
    color:'#DB423D',
    marginHorizontal:20
  },

});

export default AddReminderHijrahCalendar;
 const ModalHeader = ({title, subTitle, onClose}) => (
  <View style={styles.modalHeader}>
    <View style={styles.placeholder} />
    <View>
      <Text style={styles.modalTitle}>{title}</Text>
      <Text style={styles.modalSubtitle}>{subTitle}</Text>
    </View>

    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
      <Text style={styles.closeButtonText}>{" "}</Text>
    </TouchableOpacity>
  </View>
);
export const MonthSelectionModal = ({showMonthModal, setShowMonthModal, onPress, selectedMonth}) => {
  const ITEM_HEIGHT = 40;
  const VISIBLE_ITEMS = 5;
  const scrollRef = React.useRef(null);
  const [selectedIdx, setSelectedIdx] = React.useState(
    selectedMonth ? gregorianMonths.findIndex(m => m.name === selectedMonth) : 0
  );

  // Clamp utility
  const clamp = (num, min, max) => Math.max(min, Math.min(num, max));

  // Scroll to initial position on open
  React.useEffect(() => {
    if (showMonthModal && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: selectedIdx * ITEM_HEIGHT, animated: false });
      }, 10);
    }
  }, [showMonthModal, selectedIdx]);

  // Snap to item on scroll end (momentum or drag)
  const handleSnap = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = clamp(Math.round(y / ITEM_HEIGHT), 0, gregorianMonths.length - 1);
    setSelectedIdx(idx);
    scrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
  };

  // Confirm selection
  const handleSelect = () => {
    onPress(gregorianMonths[selectedIdx]);
    setShowMonthModal(false);
  };

  return(
    <Modal
      visible={showMonthModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowMonthModal(false)}>
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={{flex:1}} onPress={() => setShowMonthModal(false)} />
        <View style={styles.modalContainer}>
          <View style={styles.modalHandle} />

          <ModalHeader
            title={'Month'}
            subTitle={''}
            onClose={() => setShowMonthModal(false)}
          />

          <View style={{alignItems: 'center', marginBottom: 18}}>
            <View style={{height: ITEM_HEIGHT * VISIBLE_ITEMS, width: '80%', overflow: 'hidden', borderRadius: 12, backgroundColor: '#fff'}}>
              <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                snapToInterval={ITEM_HEIGHT}
                decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
                bounces={false}
                contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }}
                onMomentumScrollEnd={handleSnap}
                onScrollEndDrag={handleSnap}
              >
                {gregorianMonths.map((item, idx) => {
                  const isSelected = idx === selectedIdx;
                  return (
                    <View key={item.id} style={[{height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center'}, isSelected && {backgroundColor: '#E4E2FD', borderRadius: 8}]}> 
                      <Text style={[{fontSize: 18, color: isSelected ? '#181B1F' : '#AEAEAE', fontWeight: isSelected ? '600' : '400'}]}>{item.name}</Text>
                    </View>
                  );
                })}
              </ScrollView>
              {/* Center highlight divider, always centered */}
              <View pointerEvents="none" style={{position: 'absolute', left: 14, right: 14, top: ITEM_HEIGHT * 2, height: ITEM_HEIGHT, borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: '#CCCCCC', zIndex: 10, borderRadius: 4, backgroundColor: 'rgba(255,255,255,0.01)'}} />
            </View>
          </View>
          <TouchableOpacity style={{marginTop: 10, alignSelf: 'center', backgroundColor: '#4338CA', borderRadius: 12, paddingVertical: 10, paddingHorizontal: 30}} onPress={handleSelect}>
            <Text style={{color: '#fff', fontSize: 16, fontWeight: '600'}}>Select</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const gregorianMonths = [
  { "id": 1, "name": "January" },
  { "id": 2, "name": "February" },
  { "id": 3, "name": "March" },
  { "id": 4, "name": "April" },
  { "id": 5, "name": "May" },
  { "id": 6, "name": "June" },
  { "id": 7, "name": "July" },
  { "id": 8, "name": "August" },
  { "id": 9, "name": "September" },
  { "id": 10, "name": "October" },
  { "id": 11, "name": "November" },
  { "id": 12, "name": "December" }
]
