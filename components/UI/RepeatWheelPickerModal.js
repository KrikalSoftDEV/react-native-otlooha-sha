import React, { useRef, useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
} from 'react-native';

const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 40;
const VISIBLE_ITEMS = 5;

const clamp = (num, min, max) => Math.max(min, Math.min(num, max));

const getInitialIndex = (arr, value) => {
  const idx = arr.indexOf(value);
  return idx === -1 ? 0 : idx;
};

const RepeatWheelPickerModal = ({
  visible,
  onClose,
  options = [],
  selectedOption,
  onSelectOption,
}) => {
  const scrollRef = useRef(null);
  const [selectedIdx, setSelectedIdx] = useState(getInitialIndex(options, selectedOption));

  useEffect(() => {
    setSelectedIdx(getInitialIndex(options, selectedOption));
  }, [selectedOption, visible, options]);

  // Scroll to initial position on open
  useEffect(() => {
    if (visible && scrollRef.current) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: selectedIdx * ITEM_HEIGHT, animated: false });
      }, 10);
    }
  }, [visible, selectedIdx]);

  // Handle scroll end for snapping
  const onMomentumScrollEnd = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const idx = clamp(Math.round(y / ITEM_HEIGHT), 0, options.length );
    setSelectedIdx(idx);
    scrollRef.current?.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
    if (onSelectOption) onSelectOption(options[idx]);
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
        <Text style={styles.title}>Repeat</Text>
        <Text style={styles.subtitle}>Repeat daily, weekly, or as you prefer.</Text>
        <View style={styles.pickerRow}>
          <View style={[styles.wheelContainer, { width: width * 0.8 }]}> 
            <ScrollView
              ref={scrollRef}
              showsVerticalScrollIndicator={false}
              snapToInterval={ITEM_HEIGHT}
              decelerationRate={Platform.OS === 'ios' ? 0.98 : 0.98}
              bounces={false}
              contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * Math.floor(VISIBLE_ITEMS / 2) }}
              onMomentumScrollEnd={onMomentumScrollEnd}
            >
              {options.map((option, idx) => {
                const isSelected = idx === selectedIdx;
                return (
                  <View key={option} style={[styles.item, isSelected && styles.selectedItem]}> 
                    <Text style={[styles.itemText, isSelected && styles.selectedText]}>{option}</Text>
                  </View>
                );
              })}
            </ScrollView>
            {/* Center highlight divider */}
            <View pointerEvents="none" style={styles.centerHighlight} />
          </View>
        </View>
        {/* <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>{" "}</Text>
        </TouchableOpacity> */}
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
    fontWeight: '500',
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
  },
  item: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {},
  itemText: {
    fontSize: 18,
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
    top: Platform.OS == 'android' ? 80 : 80, // Center for 5 items * 40px
    height: ITEM_HEIGHT,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: '#CCCCCC',
    zIndex: 10,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.01)',
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: '#F0F2F7',
    borderRadius: 18,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 16,
    color: '#88909E',
    fontWeight: '700',
  },
});

export default RepeatWheelPickerModal; 