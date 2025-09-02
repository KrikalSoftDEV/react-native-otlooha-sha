import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useDispatch } from 'react-redux';
import { getData } from '../../constants/Storage';
import { setGlobalToken, setGuestInfo, setUserInfo } from '../../redux/slices/appSlice';

const { width, height } = Dimensions.get('window');

const SplashScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      const user = await getData('userDetail');
      const guestUser = await getData('guestDetail');
      const token = await getData('access_token');
      const userWelcome = await getData('userWelcomeComplete');

      dispatch(setGlobalToken(token));
      dispatch(setUserInfo(user));
      dispatch(setGuestInfo(guestUser));

      const timer = setTimeout(() => {
        if (user || guestUser) {
          navigation.replace('TabNavigation');
        } else if (userWelcome) {
          navigation.replace('Login');
        } else {
          navigation.replace('Login');
        }
      }, 2000);

      return () => clearTimeout(timer);
    };

    checkLoginStatus();
  }, [navigation, dispatch]);

  return (
    <FastImage
      source={require('../../assets/images/Splash/splash.gif')}
      style={styles.background}
      resizeMode={FastImage.resizeMode.cover}
    >
      <Text style={styles.text}>v1.5.7.14.2</Text>
      <View style={styles.overlay}>
        {/* Optional overlay content like logos or text */}
      </View>
    </FastImage>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
    width,
    height,
  },
  overlay: {
    // Optional: to add an overlay effect or additional content
    padding: 20,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 50,
    alignSelf: 'center',
  },
});

export default SplashScreen;
