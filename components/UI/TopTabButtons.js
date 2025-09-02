import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { scale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const TopTabButtons = ({
  tabs = ['Tab1', 'Tab2'],
  activeTab,
  setActiveTab,
  activeColor = '#272682',
  inactiveColor = '#686E7A',
  backgroundColor = '#F0F2F7',
  height = 45,
  fontSize = 16,
}) => {
  const slideAnimation = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    const toValue = tabs.indexOf(activeTab);
    Animated.timing(slideAnimation, {
      toValue,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [activeTab]);

  const translateX = slideAnimation.interpolate({
    inputRange: tabs.map((_, i) => i),
    outputRange: tabs.map((_, i) =>
      containerWidth > 0 ? (containerWidth / tabs.length) * i : 0
    ),
  });

  const handleLayout = (event) => {
    setContainerWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.tabContainer, { backgroundColor, height }]}
        onLayout={handleLayout}
      >
        {containerWidth > 0 && (
          <Animated.View
            style={[
              styles.slider,
              {
                width: `${110 / tabs.length}%`,
                transform: [{ translateX }],
              },
            ]}
          />
        )}

        {tabs.map((tabLabel, index) => {
          const isActive = tabLabel === activeTab;
          const color = isActive ? activeColor : inactiveColor;

          return (
            <TouchableOpacity
              key={index}
              style={styles.tab}
              onPress={() => setActiveTab(tabLabel)}
              activeOpacity={1}
            >
              <Text style={[styles.tabText, { color, fontSize }]}>
                {tabLabel}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  tabContainer: {
    flexDirection: 'row',
    marginVertical: 15,
    borderRadius: 100,
    height: 45,
    borderWidth: 4,
    borderColor: '#F0F2F7',
    position: 'relative',
    overflow: 'hidden',
  },
  slider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
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
    zIndex: 1,
  },
  tabText: {
    fontWeight: '600',
  },
});

export default TopTabButtons;
