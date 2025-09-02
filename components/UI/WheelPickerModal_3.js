import { useIsFocused } from '@react-navigation/native';
import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Pressable,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';
import { scale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;
const YEAR_RANGE = { start: 2020, end: 2099 };
const YEARS = Array.from({ length: YEAR_RANGE.end - YEAR_RANGE.start + 1 }, (_, i) => YEAR_RANGE.start + i);

const getInitialIndex = (arr, value) => {
  const idx = arr.indexOf(value);
  return idx === -1 ? 0 : idx;
};

const clamp = (num, min, max) => Math.max(min, Math.min(num, max));

const WheelPickerModal_3 = ({
  visible,
  onClose,
  initialMonth = 0, // 0-based index
  initialYear = YEARS[0],
  onValueChange,
}) => {
  const isFocused = useIsFocused()
  const monthScrollRef = useRef(null);
  const yearScrollRef = useRef(null);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(getInitialIndex(MONTHS, MONTHS[initialMonth]));
  const [selectedYearIdx, setSelectedYearIdx] = useState(getInitialIndex(YEARS, initialYear));

  // Sync with props
  useEffect(() => {
    setSelectedMonthIdx(getInitialIndex(MONTHS, MONTHS[initialMonth]));
    setSelectedYearIdx(getInitialIndex(YEARS, initialYear));
  }, [initialMonth, initialYear, visible]);

  // Scroll to initial position on open
  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        monthScrollRef.current?.scrollTo({ y: selectedMonthIdx * ITEM_HEIGHT, animated: false });
        yearScrollRef.current?.scrollTo({ y: selectedYearIdx * ITEM_HEIGHT, animated: false });
      }, 10);
    }
  }, [visible, selectedMonthIdx, selectedYearIdx]);

  // Callback on change
  useEffect(() => {
    if (onValueChange && visible) {
      onValueChange({
        month: selectedMonthIdx,
        year: YEARS[selectedYearIdx],
      });
    }
  }, [selectedMonthIdx, selectedYearIdx]);

  // Handle scroll end for snapping
  const onMomentumScrollEnd = (type, e) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = clamp(Math.round(y / ITEM_HEIGHT), 0, type === 'month' ? MONTHS.length - 1 : YEARS.length - 1);
    if (type === 'month') {
      setSelectedMonthIdx(idx);
      monthScrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
    } else {
      setSelectedYearIdx(idx);
      yearScrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      <View style={styles.modalContainer}>
        <View style={styles.handleBar} />
        <Text style={styles.title}>Select Month</Text>
        <Text style={styles.subtitle}>Choose the month from the list below</Text>
        <View style={styles.pickerRow}>
          {/* Month Wheel */}
          <View style={[styles.wheelContainer, {alignItems:'flex-end'}]}>
            <ScrollView
              ref={monthScrollRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
              bounces={false}
              contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }}
              onMomentumScrollEnd={e => onMomentumScrollEnd('month', e)}
            >
              {MONTHS.map((month, idx) => {
                const isSelected = idx === selectedMonthIdx;
                return (
                  <View key={month} style={[styles.item, isSelected && styles.selectedItem]}> 
                    <Text style={[styles.itemText, isSelected && styles.selectedText]}>{month}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
          {/* Year Wheel */}
          <View style={[styles.wheelContainer, { alignItems: 'flex-start', paddingLeft:scale(10)}]}>
            <ScrollView
              ref={yearScrollRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate={Platform.OS === 'ios' ? 0 : 0.98}
              bounces={false}
              contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }}
              onMomentumScrollEnd={e => onMomentumScrollEnd('year', e)}
            >
              {YEARS.map((year, idx) => {
                const isSelected = idx === selectedYearIdx;
                return (
                  <View key={year} style={[styles.item, isSelected && styles.selectedItem]}> 
                    <Text style={[styles.itemText, isSelected && styles.selectedText]}>{year}</Text>
                  </View>
                );
              })}
            </ScrollView>
          </View>
        </View>
        {/* Center highlight divider */}
        <View pointerEvents="none" style={styles.centerHighlight} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 9,
    paddingBottom: 40,
    alignItems: 'center',
    minHeight: 350,
  },
  handleBar: {
    width: 66,
    height: 5,
    backgroundColor: '#3C3C434D',
    borderRadius: 3,
    alignSelf: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181B1F',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight:'500',
    color: '#686E7A',
    marginBottom: 18,
    textAlign: 'center',
  },
  pickerRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
  },
  wheelContainer: {
    height: ITEM_HEIGHT * VISIBLE_ITEMS,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#fff',
    width: width * 0.4,

    // paddingHorizontal:10,
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    // nothing here, highlight is via overlay
  },
  itemText: {
    fontSize: scale(16),
    color: '#AEAEAE',
    fontWeight: '400',
  },
  selectedText: {
    fontSize: 23,
    fontWeight: '400',
    color: '#16191C',
  },
  centerHighlight: {
    position: 'absolute',
    left: 14,
    right: 14,
    top: Platform.OS == 'android' ? 175 : 168,
    height: ITEM_HEIGHT,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#CCCCCC',
    zIndex: 10,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
});

export default WheelPickerModal_3;
