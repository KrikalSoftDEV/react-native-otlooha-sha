import React, { useRef, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
// import WheelPicker from 'react-native-wheel-pick';
import Wheely from 'react-native-wheely';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

const HIJRI_MONTHS = [
  { "number": 1, "en": "Muḥarram", "ar": "مُحَرَّم" },
  { "number": 2, "en": "Ṣafar", "ar": "صَفَر" },
  { "number": 3, "en": "Rabīʿ al-awwal", "ar": "رَبيع الأوّل" },
  { "number": 4, "en": "Rabīʿ al-thānī", "ar": "رَبيع الثاني" },
  { "number": 5, "en": "Jumādá al-ūlá", "ar": "جُمادى الأولى" },
  { "number": 6, "en": "Jumādá al-ākhirah", "ar": "جُمادى الآخرة" },
  { "number": 7, "en": "Rajab", "ar": "رَجَب" },
  { "number": 8, "en": "Shaʿbān", "ar": "شَعْبان" },
  { "number": 9, "en": "Ramaḍān", "ar": "رَمَضان" },
  { "number": 10, "en": "Shawwāl", "ar": "شَوّال" },
  { "number": 11, "en": "Dhū al-Qaʿdah", "ar": "ذوالقعدة" },
  { "number": 12, "en": "Dhū al-Ḥijjah", "ar": "ذوالحجة" }
]
const hijriOptions = HIJRI_MONTHS.map(month => `${month.en}`);

const WheelPickerModal_2 = ({
  visible,
  onClose,
  // selectedMonth,
  onSelectMonth,
}) => {
  console.log('-=-=--=-=--selectedMonth', selectedMonth );
  
  const [selectedIndex, setSelectedIndex] = useState(0
    // selectedMonth ? HIJRI_MONTHS.indexOf(selectedMonth) : 0
  );

  const handleValueChange = (index) => {
    setSelectedIndex(index);
    if (onSelectMonth) onSelectMonth(HIJRI_MONTHS[index]?.number);
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('Dhu al-Hijjah');
  const scrollY = useRef(new Animated.Value(0)).current;

  const islamicMonths = [
    'Muharram',
    'Safar',
    "Rabi' al-awwal",
    'Dhu al-Hijjah',
    "Dhu al-Qi'dah",
    'Shawwal',
    'Ramadan',
  ];

  const handleSelectMonth = (month) => {
    setSelectedMonth(month);
    setModalVisible(false);
  };

  const renderWheelItem = (item, index) => {
    const inputRange = [
      (index - 2) * 60,
      (index - 1) * 60,
      index * 60,
      (index + 1) * 60,
      (index + 2) * 60,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.8, 0.9, 1, 0.9, 0.8],
      extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.4, 0.7, 1, 0.7, 0.4],
      extrapolate: 'clamp',
    });

    return (
      <TouchableOpacity
        key={index}
        style={styles.wheelItem}
        onPress={() => handleSelectMonth(item)}
      >
        <Animated.Text
          style={[
            styles.wheelItemText,
            {
              transform: [{ scale }],
              opacity,
              color: item === selectedMonth ? '#007AFF' : '#000',
              fontWeight: item === selectedMonth ? '600' : '400',
            },
          ]}
        >
          {item}
        </Animated.Text>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.handleBar} />
          <Text style={styles.title}>Select Month</Text>
          <Text style={styles.subtitle}>Choose the month from the list below</Text>
          <View style={styles.pickerContainer}>
            {/* <View style={styles.selectionIndicator} /> */}
            <View style={styles.wheelContainer}>
              <View style={styles.selectionIndicator} />
              <Animated.ScrollView
                showsVerticalScrollIndicator={false}
                snapToInterval={60}
                decelerationRate="fast"
                onScroll={Animated.event(
                  [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                  { useNativeDriver: true }
                )}
                scrollEventThrottle={16}
                contentContainerStyle={styles.wheelScrollContent}
              >
                <View style={styles.wheelSpacer} />
                {islamicMonths.map((month, index) => renderWheelItem(month, index))}
                <View style={styles.wheelSpacer} />
              </Animated.ScrollView>
            </View>

            {/* <View style={styles.selectionIndicator} /> */}
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.colorWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    // paddingHorizontal: 24,
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
    color: '#686E7A',
    marginBottom: 18,
    textAlign: 'center',
  },
  pickerContainer: {
    width: width * 1,
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    paddingHorizontal:14
  },
  wheelPicker: {
    width: '100%',
    height: 180,
  },
  closeButton: {
    position: 'absolute',
    top: 18,
    right: 18,
    backgroundColor: "#F0F2F7",
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
  selectionIndicator: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: '#AAA',
    zIndex: 2,
  },
  transparentSelectedItem: {
    backgroundColor: 'transparent',
    borderBottomWidth:0.5,
    borderTopWidth:0.5,
    borderColor:'#CCCCCC'
  },
  itemTextStyle: {
    fontSize:23, 
    fontWeight:'400', 
    color:'#16191C',
  },
  wheelContainer: {
    flex: 1,
    position: 'relative',
    marginHorizontal: 20,
  },
  selectionIndicator: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 8,
    transform: [{ translateY: -30 }],
    zIndex: 1,
  },
  wheelScrollContent: {
    paddingVertical: 20,
  },
  wheelSpacer: {
    height: 120,
  },
  wheelItem: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  wheelItemText: {
    fontSize: 18,
    textAlign: 'center',
  }
});

export default WheelPickerModal_2; 