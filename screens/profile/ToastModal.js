import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const ToastModal = ({ visible, setVisible, type = 'success' ,message}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // ✅ Persisted Animated.Value

  useEffect(() => {
    if (visible) {
      // Fade In
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Auto Fade Out after 2 seconds
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setVisible(false));
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  const gradientColors =
    type === 'success'
      ? ['#BDFFDE', '#EBFFF5']
      : ['#FFD3D1', '#FFF5F5'];

  const borderColor = type === 'success' ? '#3BC47D' : '#FF9E99';
  const textColor = type === 'success' ? "#181B1F" : '#181B1F';

  return (
   <Animated.View
  style={[
    styles.toastContainer,
    { opacity: fadeAnim, borderColor, borderWidth: 1.5, borderRadius: 12 },
  ]}
>
  <LinearGradient
    colors={gradientColors}
    start={{ x: 0, y: 0.5 }}
    end={{ x: 0.5, y: 1 }}
    style={styles.toastContainer1}
  >
    <Text style={[styles.message, { color: textColor }]}>{message}</Text>
  </LinearGradient>
</Animated.View>
  );
};

export default ToastModal;

const styles = StyleSheet.create({
  toastContainer: {
    marginHorizontal:30,
    // width:width*0.5,
    // padding:10,
    position: 'absolute',
    bottom: 60,
    alignSelf: 'center',
    zIndex: 1000,
    // elevation: 1000,
      // maxWidth: width , // prevent overflow
  },
 toastContainer1: {
  maxWidth: width - 40,
  // paddingHorizontal: 18,
  // paddingVertical: 10,
  borderRadius: 10,
  // borderWidth: 1.5,
  borderColor: 'transparent', // ✨ Apply dynamic color via inline style
  // backgroundColor: 'transparent', // 🔥 no default background
  overflow: 'hidden', // avoids rounding/border conflicts
},
  message: {
    
    fontSize: 16,
    fontWeight: '500',
    // alignSelf:'center',
    justifyContent:'center',
    textAlign:'center',
    alignItems:'center',
    paddingVertical:14,
    paddingHorizontal:30
  },
});
