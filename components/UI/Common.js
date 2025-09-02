import React from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Alert,
  Platform,
} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import {SubText} from './CustomText';
import appleIcon from '../../assets/images/Social/Social_apple.png';
import googleIcon from '../../assets/images/Social/Social_google.png';
import fbIcon from '../../assets/images/Social/Social_fb.png';

export const SocialLoginView = props => {
  return (
    <View style={[styles.socialLoginViewcontainer]}>
      <SubText children={props.title} style={props.titleStyle} />
      <View style={{marginTop: verticalScale(16), flexDirection: 'row'}}>
        {Platform.OS == 'ios' && (
          <TouchableOpacity
            onPress={props.onApplePress}
            style={styles.socialLoginViewIconView}
          >
            <Image source={appleIcon} style={styles.socialLoginViewIconStyle} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={props.onGooglePress}
          style={[styles.socialLoginViewIconView, {marginLeft: Platform.OS == 'ios' && scale(12)}]}
        >
          <Image source={googleIcon} style={styles.socialLoginViewIconStyle} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            Alert.alert('Facebook login functionality coming soon!');
          }}
          style={[styles.socialLoginViewIconView, {marginLeft: scale(12)}]}
        >
          <Image source={fbIcon} style={styles.socialLoginViewIconStyle} />
        </TouchableOpacity>
      </View>
    </View>
  );
};
export const HomeScreenBanner = props => {
  return (
    <TouchableOpacity
      style={[styles.bannerContainer, props.styles]}
      onPress={props?.navigation}>
      <Image
        source={props?.source}
        style={styles.bannerImage}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  socialLoginViewcontainer: {
    alignSelf: 'center',
    marginTop: verticalScale(15),
    alignItems: 'center',
  },
  socialLoginViewIconView: {
    height: scale(50),
    width: scale(50),
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#DDE2EB',
    alignContent: 'center',
    justifyContent: 'center',
  },
  socialLoginViewIconStyle: {
    height: scale(25),
    width: scale(25),
    alignSelf: 'center',
  },
  bannerContainer: {marginTop: verticalScale(12)},
  bannerImage: {
    width: '100%',
    height: 180,
    objectFit: 'fill',
    borderRadius: 16,
  },
});
