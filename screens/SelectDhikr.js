import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
// import Icon from 'react-native-vector-icons/Ionicons';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight : 0;

// Import dhikir data
const dhikirData = require('../assets/dhikir_data.json');
console.log('data', dhikirData)
const dhikrData = dhikirData.map((item, index) => ({
  id: index + 1,
  arabic: item.arabic,
  transliteration: item.latin,
  english: item.translation,
  title: item.title,
  notes: item.notes,
  target: item.target
}));

const DhikrItem = ({ item, selected, onSelect, onPlay }) => (
  <View style={styles.dhikrItem}>
    <View style={styles.dhikrContent}>
      <Text style={styles.titleText}>{item.title}</Text>
      <Text style={styles.arabicText}>{item.arabic}</Text>
      <Text style={styles.transliterationText}>{item.transliteration}</Text>
      <Text style={styles.englishText}>{item.english}</Text>
      <Text style={styles.notesText}>{item.notes}</Text>
    </View>
    <View style={styles.actionButtons}>
      <TouchableOpacity 
        style={[styles.checkButton, selected && styles.checkButtonSelected]}
        onPress={() => onSelect(item.id)}
      >
        {/* {selected && <Icon name="checkmark" size={24} color="#FFF" />} */}
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.playButton}
        onPress={() => onPlay(item.id)}
      >
        {/* <Icon name="play" size={24} color="#666" /> */}
      </TouchableOpacity>
    </View>
  </View>
);

const SelectDhikr = ({ navigation, route }) => {
  const [selectedDhikrs, setSelectedDhikrs] = useState([]);
  
  const handleSelect = (id) => {
    setSelectedDhikrs(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  const handlePlay = (id) => {
    // Implement audio playback logic
    console.log('Playing audio for dhikr:', id);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          {/* <Icon name="arrow-back" size={24} color="#000" /> */}
        </TouchableOpacity>
        <Text style={styles.headerTitle}>1/2 : Select Dhikir</Text>
        <TouchableOpacity style={styles.searchButton}>
          {/* <Icon name="search" size={24} color="#000" /> */}
        </TouchableOpacity>
      </View>

      {/* Dhikr List */}
      <ScrollView style={styles.scrollView}>
        {dhikrData.map(item => (
          <DhikrItem
            key={item.id}
            item={item}
            selected={selectedDhikrs.includes(item.id)}
            onSelect={handleSelect}
            onPlay={handlePlay}
          />
        ))}
      </ScrollView>

      {/* Add Button */}
      <TouchableOpacity 
        style={styles.addButton}
        onPress={() => {
          const selectedDhikrItems = dhikrData.filter(item => selectedDhikrs.includes(item.id));
          Alert.alert('selected Dhikir')
          if (selectedDhikrItems.length > 0) {
            Alert.alert('selected Dhikir')
            navigation.navigate('TasbihDhikir');
          } else {
            Alert.alert('Selection Required', 'Please select at least one dhikir');
          }
        }}
      >
        <Text style={styles.addButtonText}>Add Selected Dhikirs</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: scale(16),
    fontWeight: 'bold',
    color: '#000',
    marginBottom: verticalScale(4),
  },
  notesText: {
    fontSize: scale(12),
    color: '#666',
    fontStyle: 'italic',
    marginTop: verticalScale(2),
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingTop: Platform.OS === 'android' ? STATUSBAR_HEIGHT : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(12),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  headerTitle: {
    fontSize: scale(18),
    fontWeight: '600',
    color: '#000',
  },
  backButton: {
    padding: scale(8),
  },
  searchButton: {
    padding: scale(8),
  },
  scrollView: {
    flex: 1,
  },
  dhikrItem: {
    flexDirection: 'row',
    padding: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dhikrContent: {
    flex: 1,
    marginRight: scale(16),
  },
  arabicText: {
    fontSize: scale(20),
    color: '#000',
    textAlign: 'right',
    marginBottom: verticalScale(4),
    fontFamily: Platform.OS === 'ios' ? 'Arial' : 'normal',
  },
  transliterationText: {
    fontSize: scale(14),
    color: '#666',
    marginBottom: verticalScale(2),
  },
  englishText: {
    fontSize: scale(14),
    color: '#333',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    borderWidth: 2,
    borderColor: '#DDD',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: scale(12),
  },
  checkButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  playButton: {
    width: scale(32),
    height: scale(32),
    borderRadius: scale(16),
    backgroundColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButton: {
    backgroundColor: '#4A44C6',
    margin: scale(16),
    padding: scale(16),
    borderRadius: scale(12),
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFF',
    fontSize: scale(16),
    fontWeight: '600',
  },
});

export default SelectDhikr;