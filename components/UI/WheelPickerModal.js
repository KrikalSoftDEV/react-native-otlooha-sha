import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
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

const WheelPickerModal = ({
  visible,
  onClose,
  selectedMonth,
  onSelectMonth,
}) => {
  const [selectedIndex, setSelectedIndex] = useState(0
  );

  const handleValueChange = (index) => {
    setSelectedIndex(index);
    if (selectedMonth) onSelectMonth(HIJRI_MONTHS[index]?.number);
  };
useEffect(() => {
  if (selectedMonth) 
    {
      setSelectedIndex(selectedMonth)
    }
   else{
    // Alert.alert('2')
    setSelectedIndex(HIJRI_MONTHS[0]?.number)
  }
},[visible])
console.log('-=-=-=-selectedMonth_Shivam', HIJRI_MONTHS[selectedMonth]?.number, selectedIndex);
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
            <Wheely
              // selectedIndex={selectedMonth ? selectedMonth - 1 : 2}
              selectedIndex={ 2}
              options={hijriOptions}
              onChange={() =>  handleValueChange}
              itemHeight={36}
              containerStyle={styles.wheelPicker}
              selectedIndicatorStyle={styles.transparentSelectedItem}
              itemTextStyle={styles.itemTextStyle}
              
              
            />
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
});

export default WheelPickerModal; 