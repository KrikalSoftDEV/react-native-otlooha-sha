import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Linking,
  StatusBar,
  Text,
  Image,
  Alert,
  Platform,
} from 'react-native';
import {useEffect, useState} from 'react';
import {scale, verticalScale} from 'react-native-size-matters';
import {WelcomeButton} from '../../components/UI/Button';
import appleIcon from '../../assets/images/Social/Social_apple.png';
import googleIcon from '../../assets/images/Social/Social_google.png';
import fbIcon from '../../assets/images/Social/Social_fb.png';

import {SubText} from '../../components/UI/CustomText';
import ProgressTracker from '../../components/UI/ProgressTracker';
import res from '../../constants/res';
import LogoSignUp from '../../assets/images/Common/logoSignUp.png';
import Header from '../../components/UI/Header';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';
import TuhanImage from '../../assets/images/Homescreen/tuhan_red.png';
import useSocialLogin from '../../hooks/useSocialLogin';
import { useIsFocused } from '@react-navigation/native';
// import { Image } from 'react-native-svg';
// logoSignUp
function Signup(props) {
  const isFocused = useIsFocused()
  const [isUserType, setUserType] = useState(0);
  const socialLogin = useSocialLogin({
    onLogin: ({ email, name, provider, user }) => {
      // Navigate to next signup step with social info
      if(user.type!=="cancelled"){
 props.navigation.navigate('SignUp_2', {
        userType: 'SignUp',
        email,
        name,
        socialUser: user,
      });
      }
     
    },
    // No toast in Signup, fallback to Alert
  });
  useEffect(() => {
      if(isFocused){
  socialLogin.handleGoogleLogout();
      }
    }, [isFocused]);
  const openLinkInBrowser = async url => {
    const supported = await Linking.canOpenURL(url);

    if (supported) {
      await Linking.openURL(url);
    } else {
      console.log("Don't know how to open URI: " + url);
    }
  };
  const STATUSBAR_HEIGHT =
    Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const NAVIGATIONBAR_HEIGHT = Platform.OS === 'android' ? 48 : 0; // Estimated navigation bar height
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View
        style={[
          styles.screen,
          {paddingTop: STATUSBAR_HEIGHT, paddingBottom: NAVIGATIONBAR_HEIGHT},
        ]}>
        <SafeAreaView
          style={{
            height: '100%',
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <StatusBar
            translucent
            backgroundColor="transparent"
            barStyle="dark-content"
          />
          <View style={{}}>
            <View style={{}}>
            <Header onBackPress={() => props.navigation.goBack()} />
              </View>
            <View style={{flexDirection: 'row',justifyContent:'center'}}>
              <Image
                source={LogoSignUp}
                style={{
                  // height: 59,
                  width: 136,
                  alignSelf: 'center',
                  marginTop: 50,
                  marginBottom: 78,
                }}
              />

              <View
                style={{
                  width: 0.5,
                  backgroundColor: '#657278',
                  height: 60,
                  marginTop: 50,
                  marginBottom: 78,
                  marginHorizontal: 10,
                }}
              />
              <View style={{padding:0}}>
              <Image
                source={TuhanImage} // Replace with your logo
                style={{
                  height: 59,
                  width: 60,
                  marginTop: 50,
                  marginBottom: 78,
                }}
                resizeMode="contain"
              />
              </View>
            </View>

            <WelcomeButton
              tittle={res.strings.signUpManually}
              style={{}}
              onPress={() =>
                props.navigation.navigate('SignUp_2', {userType: 'enrol'})
              }
            />
            <Text style={styles.orLoginText}>{res.strings.orSignUpWith}</Text>

            <SocialLoginButton
              onPress={socialLogin.handleGoogleSignIn}
              title={res.strings.signUpWithGoogle}
              imgUrl={googleIcon}
            />
            <SocialLoginButton
              onPress={socialLogin.handleFacebookSignIn}
              title={res.strings.signUpWithFacebook}
              imgUrl={fbIcon}
            />
            {Platform.OS == 'ios' && (
              <SocialLoginButton
                onPress={socialLogin.handleAppleSignIn}
                title={res.strings.signUpWithApple}
                imgUrl={appleIcon}
              />
            )}

            <TouchableOpacity
              onPress={() => props.navigation.goBack()}
              style={styles.signUphereText}>
              <Text
                style={[
                  {
                    fontSize: 17,
                    fontWeight: '500',
                    color: '#272682',
                  },
                ]}>
                {res.strings.alreadyHaveAnAccount}{' '}
              </Text>
              <MaskedView
                style={{}}
                maskElement={
                  <>
                    <Text
                      style={{
                        alignSelf: 'center',
                        fontSize: 17,
                        fontWeight: '600',
                        color: '#272682',
                      }}>
                      {'Sign In'}
                    </Text>
                  </>
                }>
                <LinearGradient
                  colors={['#5756C8', '#9F9AF4']} // You can set your gradient colors here
                  start={{x: 0, y: 0}}
                  end={{x: 1, y: 0}}>
                  <Text
                    style={[
                      {
                        fontSize: 17,
                        fontWeight: '600',
                        color: '#272682',
                      },
                      {opacity: 0},
                    ]}>
                    {'Sign In'}
                  </Text>
                </LinearGradient>
              </MaskedView>
            </TouchableOpacity>
          </View>
          <View style={{marginBottom: verticalScale(5)}}>
            <SubText
              children={res.strings.signup_agreement}
              style={{
                fontSize: 12,
                fontWeight: '400',
                color: '#686E7A',
                alignSelf: 'center',
              }}
            />
            {/* https://waqafannur.com.my/  */}
            <TouchableOpacity
              onPress={() => openLinkInBrowser('https://waqafannur.com.my/')}>
              <SubText
                children={res.strings.terms_and_conditions}
                style={{
                  fontSize: 12,
                  fontWeight: '600',
                  color: '#5756C8',
                  alignSelf: 'center',
                  lineHeight: scale(18),
                }}
              />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </TouchableWithoutFeedback>
  );
}
const SocialLoginButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress} style={[styles.typeSelectBtn]}>
      <Image source={props.imgUrl} style={styles.socialLoginViewIconStyle} />
      <Text style={[styles.selectButtonTitle]}>{props.title}</Text>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loginTitleView: {
    marginTop: verticalScale(60),
    marginLeft: scale(24),
    width: '88%',
  },
  loginTitleText: {fontSize: scale(21), fontWeight: '600', color: '#fff'},
  loginSubTitleText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#fff',
    opacity: 0.7,
    marginTop: verticalScale(12),
  },
  signUphereText: {
    marginTop: 36,
    width: '88%',
    padding: 18,
    alignItems: 'center',
    backgroundColor: '#F6F5FF',
    borderRadius: 14,
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#9F9AF44D',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginLeft: scale(24),
    marginTop: verticalScale(8),
    fontWeight: '400',
  },
  typeSelectBtn: {
    width: '88%',
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginTop: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#DDE2EB',
    borderRadius: 12,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedType: {borderColor: '#9F9AF4', backgroundColor: '#F6F5FF'},
  selectButtonTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#181B1F',
    marginLeft: 8,
  },
  selectButtonSubTitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#464B54',
    marginTop: 8,
  },
  safeAreaView: {
    height: '100%',
    width: '100%',
    justifyContent: 'space-between',
  },
  orLoginText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#181B1F',
    marginTop: 36,
    alignSelf: 'center',
    marginBottom: 4,
  },
  socialLoginViewIconStyle: {
    height: scale(25),
    width: scale(25),
    alignSelf: 'center',
  },
});

export default Signup;
