import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

const CustomeSwitch= ({ isOn = false, onToggle }) => {
  const [active, setActive] = useState(isOn);
  const animatedValue = useRef(new Animated.Value(isOn ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: active ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [active]);
  
  useEffect(() => {
  setActive(isOn); // Sync internal state with parent prop
}, [isOn]);

  const toggleSwitch = () => {
    setActive(!active);
    onToggle && onToggle(!active);
  };

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 28], // Knob movement
  });

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#ccc', '#4caf81'], // Off = gray, On = green
  });

  return (
    <TouchableOpacity onPress={toggleSwitch} activeOpacity={0.8}>
      <Animated.View style={[styles.switch, { backgroundColor }]}>
        <Animated.View style={[styles.knob, { transform: [{ translateX }] }]} />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  switch: {
    width: 55,
    height: 30,
    borderRadius: 30,
    // padding: 2,
    justifyContent: 'center',
  },
  knob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
    position: 'absolute',
    // top: 2,
  },
});

export default CustomeSwitch;
