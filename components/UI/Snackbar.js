import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const Snackbar = ({ visible, message, type = 'error', duration = 3000, onDismiss }) => {
  const translateY = new Animated.Value(100);

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: 100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (onDismiss) onDismiss();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  const backgroundColor = type === 'error' ? '#FF3B30' : 
                         type === 'warning' ? '#FFCC00' : 
                         type === 'success' ? '#34C759' : '#007AFF';

  return (
    <Animated.View 
      style={[
        styles.container, 
        { transform: [{ translateY }], backgroundColor }
      ]}
    >
      <Text style={styles.message}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 50,
    left: width * 0.05,
    right: width * 0.05,
    backgroundColor: '#FF3B30',
    padding: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  message: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Snackbar;