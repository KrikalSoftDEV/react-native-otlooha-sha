// Toast.js
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Text,
  StyleSheet,
  View,
  Platform,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale, verticalScale } from 'react-native-size-matters';
import Colors from '../../constants/Colors';

const { width } = Dimensions.get('window');

const Toast = ({
  message,
  type = 'success',       // 'success' or 'error'
  position = 'top',        // 'top' or 'bottom'
  visible = false,
  onHide,
  duration = 3000,
  fromTextColor = "#721c24"
}) => {
  const translateY = useRef(new Animated.Value(position === 'top' ? -150 : 150)).current;

  useEffect(() => {
    if (visible) {
      Animated.sequence([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.delay(duration),
        Animated.timing(translateY, {
          toValue: position === 'top' ? -150 : 150,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onHide && onHide();
      });
    }
  }, [visible]);
  const gradientColors =
    type === 'success'
      ? ["#BDFFDE", "#EBFFF5"] // soft green gradient
      : ["#FFD3D1","#FFF5F5"]; // soft red gradient

  const borderColor = type === 'success' ? '#3BC47D' : '#FF9E99';
  const textColor = type === 'success' ? Colors.textColor : Colors.textColor;

  if (!visible) return null;

  return (
    <View
      pointerEvents="none"
      style={[
        styles.toastWrapper,
        position === 'top' ? { top: 50 } : { bottom: 50 },
      ]}
    >
      <Animated.View style={{ transform: [{ translateY }] }}>
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.toastContainer, { borderColor }]}
        >
          <Text style={[styles.message, { color: textColor }]}>{message}</Text>
        </LinearGradient>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  toastWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
    zIndex: 10000,
    alignItems: 'center',
    // borderWidth:1
  },
  toastContainer: {
    // width: width - 40,
      // width: 248, // fixed at 80% of screen width
    minHeight:48,
    flex:1,
    // paddingVertical: 12,
    // paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent:'center',
    borderWidth: 1,
    alignItems: 'center',
    // backgroundColor: 'transparent',

    // Shadows
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  message: {
    fontWeight: '600',
    fontSize: 14,
 paddingHorizontal:20,
    textAlign: 'center',
    marginVertical:12,
    lineHeight:18
  },
});

export default Toast;
