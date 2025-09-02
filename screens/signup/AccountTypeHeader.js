import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  StatusBar,
  Dimensions,
  Platform
} from 'react-native';
import res from '../../constants/res';
import { scale } from 'react-native-size-matters';


const { width } = Dimensions.get('window');

const AccountTypeHeader = ({activeTab, setActiveTab}) => {
  const slideAnimation = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(slideAnimation, {
      toValue: activeTab === 'individual' ? 0 : 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const translateX = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width / 2 - 28 ],
  });

  const handleTabPress = (tab) => {
    setActiveTab(tab);
  };

  const individualTextColor = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#272682', '#686E7A'],
  });

  const businessTextColor = slideAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#686E7A', '#272682'],
  });

  return (
    <View style={styles.container}>      
      {/* Tab selector */}
      <View style={[styles.tabContainer, {}]}>
        <Animated.View style={[styles.slider, { transform: [{ translateX }]}]} />
        
        <TouchableOpacity
          style={[styles.tab, { zIndex: 1 }]}
          onPress={() => handleTabPress('individual')}
          activeOpacity={1}
        >
          <Animated.Text style={[styles.tabText, { color: individualTextColor }]}>
            {res.strings.individual}
          </Animated.Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tab, { zIndex: 1 }]}
          onPress={() => handleTabPress('company')}
          activeOpacity={1}
        >
          <Animated.Text style={[styles.tabText, { color: businessTextColor }]}>
            {res.strings.company}
          </Animated.Text>
        </TouchableOpacity>
      </View>
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    width:'100%',
    marginTop:20,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    marginBottom: 5,
    borderRadius: 100,
    backgroundColor: '#F0F2F7',
    borderColor: '#F0F2F7',
    height: 58,
    borderWidth:4
    // position: 'relative',
  },
  slider: {
    position: 'absolute',
    height: 50,
    width: '50%',
    borderRadius: 50,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabText: {
    fontSize: scale(18),
    fontWeight: '600',
    lineHeight:scale(22),
    color:'#686E7A'
  },
});

export default AccountTypeHeader;