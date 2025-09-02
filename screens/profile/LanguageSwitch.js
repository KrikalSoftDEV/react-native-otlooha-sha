import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';

const LanguageSwitch = ({onSelect, setSelected, selected}) => {
  const handleSelect = value => {
    if (setSelected) setSelected(value);
    if (onSelect) onSelect(value);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, selected === 'English' && styles.selectedButton]}
        onPress={() => handleSelect('English')}>
        <Text
          style={[styles.text, selected === 'English' && styles.selectedText]}>
          English
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, selected === 'Malay' && styles.selectedButton]}
        onPress={() => handleSelect('Malay')}>
        <Text
          style={[styles.text, selected === 'Malay' && styles.selectedText]}>
          Malay
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default LanguageSwitch;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 999, // full pill shape
    backgroundColor: '#fff',
    padding: 3,
    alignSelf: 'center',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 999,
  },
  selectedButton: {
    backgroundColor: '#4caf81',
  },
  text: {
    color: Colors.PrimaryBlack,
    fontWeight: '500',
    fontSize: 10,
  },
  selectedText: {
    color: Colors.colorWhite,
  },
});
