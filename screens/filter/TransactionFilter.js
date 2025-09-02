import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Dimensions,
  TextInput,
  StyleSheet,
} from 'react-native';
import { WelcomeButton } from '../../components/UI/Button';
import DateTimePickerModal from 'react-native-modal-datetime-picker';


const { height, width } = Dimensions.get('window');

const TransactionFilter =  ({
  visible = false,
  onClose = () => {},
  onApply = () => {},
  initialFilters = {},
  style = {},
  data,
}) => {
  const [filters, setFilters] = useState({
    dateRange: {
      startDate: '',
      endDate: '',
    },
    frequency: '',
    duration: '',
    status: '',
    donationCategory: [],
    paymentMethod: [],
    taxRelief: 'Yes',
    ...initialFilters,
  });
//   const [filters, setFilters] = useState({
//     dateRange: {
//       startDate: '21/10/2024',
//       endDate: '21/10/2024',
//     },
//     frequency: 'One-time',
//     duration: 'Daily',
//     status: 'Completed',
//     donationCategory: ['Hibah Lil Waqaf', 'Mosque'],
//     paymentMethod: ['Mastercard', 'Visa'],
//     taxRelief: 'Yes',
//     ...initialFilters,
//   });

  const translateY = useRef(new Animated.Value(0)).current;
  const lastGesture = useRef(0);

  const onGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const onHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === 4) {
      lastGesture.current += event.nativeEvent.translationY;

      if (lastGesture.current > 150) {
        onClose();
        lastGesture.current = 0;
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const updateFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value],
    }));
  };

  const updateNestedFilter = (parentKey, childKey, value) => {
    setFilters(prev => ({
      ...prev,
      [parentKey]: {
        ...prev[parentKey],
        [childKey]: value,
      },
    }));
  };

  const toggleArrayFilter = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter(item => item !== value)
        : [...prev[key], value],
    }));
  };

  const clearFilters = () => {
    setFilters({
      dateRange: {
        startDate: '',
        endDate: '',
      },
      frequency: '',
      duration: '',
      status: '',
      donationCategory: [],
      paymentMethod: [],
      taxRelief: '',
    });
     onApply({
      dateRange: {
        startDate: '',
        endDate: '',
      },
      frequency: '',
      duration: '',
      status: '',
      donationCategory: [],
      paymentMethod: [],
      taxRelief: '',
    });
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const FilterButton = ({ title, isSelected, onPress, style: buttonStyle = {} }) => (
    <TouchableOpacity
      style={[
        styles.filterButton,
        isSelected ? styles.selectedFilterButton : styles.unselectedFilterButton,
        buttonStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.filterButtonText,
          isSelected ? styles.selectedFilterButtonText : styles.unselectedFilterButtonText,
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const [isStartDatePickerVisible, setStartDatePickerVisible] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisible] = useState(false);

  const showStartDatePicker = () => setStartDatePickerVisible(true);
  const hideStartDatePicker = () => setStartDatePickerVisible(false);
  const showEndDatePicker = () => setEndDatePickerVisible(true);
  const hideEndDatePicker = () => setEndDatePickerVisible(false);

  const handleStartDateConfirm = (date) => {
    const formattedDate = date ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}` : '';
    updateNestedFilter('dateRange', 'startDate', formattedDate);
    hideStartDatePicker();
  };

  const handleEndDateConfirm = (date) => {
    const formattedDate = date ? `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth()+1).toString().padStart(2, '0')}/${date.getFullYear()}` : '';
    updateNestedFilter('dateRange', 'endDate', formattedDate);
    hideEndDatePicker();
  };

  const DateInput = ({ label, value, onChangeText, onPress }) => (
    <View style={styles.dateInputContainer}>
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        <View style={styles.dateInputWrapper}>
          <Text style={styles.dateInputLabel}>{label}</Text>
          <TextInput
            autoCorrect={false}
            spellCheck={false}
            style={styles.dateInput}
            value={value}
            onChangeText={onChangeText}
            placeholder="DD/MM/YYYY"
            placeholderTextColor="#9CA3AF"
            editable={false}
            pointerEvents="none"
          />
        </View>
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
          <View
            style={[
              styles.modalContainer,
              style,
            ]}
          >
            {/* Handle Bar */}
            <View style={styles.handleBar} />

            {/* Header */}
            <View style={styles.header}>
              {/* <View /> */}
              <Text style={styles.headerTitle}>Filters</Text>
              {/* <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                {/* <Ionicons name="close" size={24} color="#6B7280" /> 
              </TouchableOpacity> */}
            </View>

            {/* Content */}
            <ScrollView
              style={styles.content}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* Date Range */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Date Range</Text>
                <View style={styles.dateRangeContainer}>
                  <DateInput
                    label="Start Date"
                    value={filters.dateRange.startDate}
                    onChangeText={(text) => updateNestedFilter('dateRange', 'startDate', text)}
                    onPress={showStartDatePicker}
                  />
                  <DateInput
                    label="End Date"
                    value={filters.dateRange.endDate}
                    onChangeText={(text) => updateNestedFilter('dateRange', 'endDate', text)}
                    onPress={showEndDatePicker}
                  />
                </View>
              </View>

 {/* recurringDetails */}
              {/* Frequency */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Frequency</Text>
                <View style={styles.buttonGrid}>
                  {data?.recurringDetails && Object(data?.recurringDetails)?.map((item) => (
                    <FilterButton
                      key={item?.id}
                      title={item?.displayName}
                      isSelected={filters?.frequency?.includes(item?.id)}
                      onPress={() => updateFilter('frequency', item?.id )}
                      style={styles.durationButton}
                    />
                  ))}
                  {/* <FilterButton
                    title="One-time"
                    isSelected={filters.frequency === 'One-time'}
                    onPress={() => updateFilter('frequency', 'One-time')}
                  />
                  <FilterButton
                    title="Recurrent"
                    isSelected={filters.frequency === 'Recurrent'}
                    onPress={() => updateFilter('frequency', 'Recurrent')}
                  /> */}
                </View>
              </View>

              {/* Duration */}
              {/* <View style={styles.section}>
                <Text style={styles.sectionTitle}>Duration</Text>
                <View style={styles.buttonGrid}>
                  {data?.frequencies && Object(data?.frequencies)?.map((item) => (
                    <FilterButton
                      key={item?.id}
                      title={item?.displayName}
                      isSelected={filters?.duration?.includes(item?.id)}
                      onPress={() => updateFilter('duration', item?.id )}
                      style={styles.durationButton}
                    />
                  ))}
                </View>
              </View> */}

              {/* Status */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Status</Text>
                <View style={styles.buttonGrid}>
                  {data?.status && Object(data?.status).map((item) => (
                    <FilterButton
                      key={item?.id}
                      title={item?.displayName}
                      isSelected={filters.status.includes(item?.id)}
                      onPress={() => updateFilter('status', item?.id )}
                      style={styles.durationButton}
                    />
                  ))}
                </View>

              </View>
{/* donationTo */}
              {/* Donation Category */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Donation Category</Text>
                <View style={styles.buttonGrid}>
                  {data?.donationTo && Object(data?.donationTo)?.map((item) => (
                    <FilterButton
                      key={item?.id}
                      title={item?.displayName}
                      isSelected={filters.donationCategory.includes(item?.id)}
                      onPress={() => toggleArrayFilter('donationCategory', item?.id)}
                      style={styles.categoryButton}
                    />
                  ))}
                </View>
              </View>

{/* paymentMode */}
              {/* Payment Method */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <View style={styles.buttonGrid}>
                  {data?.paymentMode && Object(data?.paymentMode)?.map((item) => (
                    <FilterButton
                      key={item?.id}
                      title={item?.displayName}
                      isSelected={filters.paymentMethod.includes(item?.id)}
                      onPress={() => toggleArrayFilter('paymentMethod', item?.id)}
                      style={styles.paymentButton}
                    />
                  ))}
                </View>
              </View>

              {/* Tax Relief */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Tax Relief</Text>
                <View style={styles.buttonRow}>
                  <FilterButton
                    title="Yes"
                    isSelected={filters.taxRelief === 'Yes'}
                    onPress={() => updateFilter('taxRelief', 'Yes')}
                  />
                  <FilterButton
                    title="No"
                    isSelected={filters.taxRelief === 'No'}
                    onPress={() => updateFilter('taxRelief', 'No')}
                  />
                </View>
              </View>

              <View style={styles.bottomSpacing} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFilters}
                activeOpacity={0.7}
              >
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                style={styles.applyButton}
                onPress={handleApply}
                activeOpacity={0.7}
              >
                <Text style={styles.applyButtonText}>Apply</Text>
              </TouchableOpacity> */}
             
              <WelcomeButton  onPress={handleApply} style={styles.applyButton} tittle={'Apply'} />
             
            </View>
          </View>
          {/* Date Pickers */}
          <DateTimePickerModal
            isVisible={isStartDatePickerVisible}
            mode="date"
            onConfirm={handleStartDateConfirm}
            onCancel={hideStartDatePicker}
            maximumDate={new Date()}
            textColor="#000000"
          />
          
          {/* <DateTimePickerModal
            isVisible={true}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
            minimumDate={startDate}
            textColor="#000000"
          /> */}
          <DateTimePickerModal
            isVisible={isEndDatePickerVisible}
            mode="date"
            onConfirm={handleEndDateConfirm}
            onCancel={hideEndDatePicker}
            minimumDate={filters.dateRange.startDate && filters.dateRange.startDate.length === 10 ? new Date(filters.dateRange.startDate.split('/')[2], parseInt(filters.dateRange.startDate.split('/')[1], 10) - 1, filters.dateRange.startDate.split('/')[0]) : undefined}
            maximumDate={new Date()}
            textColor="#000000"
          />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    height: height * 0.87,
    maxHeight: height * 0.87,
  },
  handleBar: {
    width: 66,
    height: 5,
    backgroundColor: '#3C3C434D',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DDE2EB',
  },
  headerTitle: {
    marginHorizontal:20,
    fontSize: 16,
    fontWeight: '500',
    color: '#181B1F',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#686E7A',
    marginBottom: 16,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateInputContainer: {
    flex: 1,
  },
  dateInputLabel: {
    fontSize: 14,
    fontWeight:'400',
    color: '#686E7A',
    marginBottom: 8,
  },
  dateInputWrapper: {
    // flexDirection: 'row',
    // alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDE2EB',
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  dateInput: {
    flex: 1,
    fontSize: 17,
    fontWeight: '500',
    color: '#181B1F',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterButton: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedFilterButton: {
    backgroundColor: '#E4E2FD',
    borderColor: '#5756C8',
  },
  unselectedFilterButton: {
    backgroundColor: '#fff',
    borderColor: '#DDE2EB',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedFilterButtonText: {
    color: '#181B1F',
    fontWeight:'600'
  },
  unselectedFilterButtonText: {
    color: '#181B1F',
  },
  durationButton: {
    minWidth: (width - 72) / 2,
  },
  categoryButton: {
    minWidth: (width - 84) / 2,
  },
  paymentButton: {
    // minWidth: (width - 84) / 2,
  },
  bottomSpacing: {
    height: 32,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    justifyContent:'space-between',
    paddingVertical: 23,
    borderTopWidth: 1,
    borderTopColor: '#DDE2EB',
    // gap: 16,
  },
  clearButton: {
    // flex: 1,
    width:'48%',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DDE2EB',
    borderRadius: 12,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    height:58
  },
  clearButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181B1F',
  },
  applyButton: {
    width:'48%',
    borderRadius:14,
    height:58
    // paddingVertical: 18,
    // width:169,
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    
  },
});

export default TransactionFilter;

// Usage Example:
/*
import FilterModal from './FilterModal';

const App = () => {
  const [showFilter, setShowFilter] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});

  const handleApplyFilters = (filters) => {
    setCurrentFilters(filters);
    console.log('Applied Filters:', filters);
  };

  return (
    <View style={{ flex: 1 }}>
      <TouchableOpacity onPress={() => setShowFilter(true)}>
        <Text>Open Filter</Text>
      </TouchableOpacity>

      <FilterModal
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleApplyFilters}
        initialFilters={currentFilters}
      />
    </View>
  );
};
*/
