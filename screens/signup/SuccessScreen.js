import React, {useEffect, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
  Text,
  BackHandler,
  AppState,
} from 'react-native';
import {WelcomeButton} from '../../components/UI/Button';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import SuccessIcon from '../../assets/images/Common/SuccessIcon.svg';
import PaymentFailedIcon from '../../assets/images/Common/paymentFailed.svg';
import {scale} from 'react-native-size-matters';
import Colors from '../../constants/Colors';
import {useSelector} from 'react-redux';
import JoinIcon from '../../assets/images/Events/join.svg';
import UnlockIcon from '../../assets/images/Events/unlock_icon.svg';
import res from '../../constants/res';
import { NAVIGATIONBAR_HEIGHT } from '../../constants/Dimentions';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SuccessScreen = props => {
  const isFocused = useIsFocused()
  const navigation = useNavigation();
  const guestInfo = useSelector(state => state.app.guestInfo);
      const insets = useSafeAreaInsets();
  // Refs for background timer handling
  const startTimeRef = useRef(null);
  const intervalRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  
  const [secondsLeft, setSecondsLeft] = React.useState(5);

   useEffect(() => {
 const backAction = () => {
    //navigate prvention on signup when press back
       if (intervalRef.current) {
             clearInterval(intervalRef.current);
          }
          if (isFocused && props?.route?.params?.type === 'beforeEnrole') {
          props.navigation.navigate('TabNavigation');
            return true;
            }
              if (isFocused && props?.route?.params?.type === 'eventRegisterGuest') {
          props.navigation.navigate('TabNavigation');
            return true;
            }
            
             if (isFocused && props?.route?.params?.type === 'skipEnrole') {
          props.navigation.navigate('TabNavigation');
            return true;
            }
          if (isFocused && props?.route?.params?.type === 'paymentSuccess') {
          props.navigation.push('TabNavigation');
            return true;
              }
               if (isFocused && props?.route?.params?.type === 'paymentFailed') {
                props.navigation.goBack();
            return true;
              }
           return false;
};
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction
      );
      return () => backHandler.remove(); // cleanup on unmount
    }, []);


  // Function to start countdown with background support
  const startCountdown = (duration, onComplete) => {
    startTimeRef.current = Date.now();
    setSecondsLeft(duration);
    
    const updateCountdown = () => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      
      setSecondsLeft(remaining);
      
      if (remaining <= 0) {
        clearInterval(intervalRef.current);
        onComplete();
      }
    };
    
    intervalRef.current = setInterval(updateCountdown, 100); // Check more frequently for accuracy
    updateCountdown(); // Initial call
  };

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App came to foreground, recalculate remaining time
        if (startTimeRef.current && intervalRef.current) {
          const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
          const remaining = Math.max(0, 5 - elapsed); // Assuming 5 seconds initial duration
          setSecondsLeft(remaining);
          
          if (remaining <= 0) {
            clearInterval(intervalRef.current);
            // Trigger the appropriate navigation based on type
            handleTimerComplete();
          }
        }
      }
      appStateRef.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, []);

  // Function to handle timer completion
  const handleTimerComplete = () => {
    const type = props?.route?.params?.type;
    
    switch (type) {
      case 'paymentSuccess':
        if (guestInfo !== null) {
          navigation.replace('SignUp_2', {userType: 'enrol', transcationId: props?.route?.params?.txnNo});
        } else {
          navigation.replace('TabNavigation');
        }
        break;
      case 'paymentFailed':
        navigation.goBack();
        break;
      case 'eventRegisterGuest':
        navigation.replace('SignUp_2');
        break;
      case 'skipEnrole':
      case 'beforeEnrole':
        navigation.navigate('TabNavigation');
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (props?.route?.params?.type == 'otpSucces') {
        navigation.navigate('TabNavigation');
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);
  
 
  useEffect(() => {
    const type = props?.route?.params?.type;
    
    if (['paymentSuccess', 'paymentFailed', 'eventRegisterGuest', 'skipEnrole', 'beforeEnrole'].includes(type)) {
      startCountdown(5, handleTimerComplete);
    }

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const RenderItem = ({
    title,
    description,
    buttonTitle,
    ImageUrl,
    handleOnPress,
    extraButton = false,
    styling,
    titleStyle,
    handleOnPressSecond,
    titleSecond,
    countdown,
    sucessIcon,
  }) => {
    return (
      <View style={{flex: 1,paddingBottom:NAVIGATIONBAR_HEIGHT}}>
        <View style={styles.container}>
          <View style={{marginLeft: sucessIcon ? 28 : 0}}>
            {ImageUrl && <ImageUrl />}
          </View>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          <Text style={[styles.subtitle, {maxWidth: '80%'}, styling]}>
            {description}
          </Text>

          <WelcomeButton
            tittle={buttonTitle}
            style={{marginTop: 24, with: '70%', maxWidth: '70%'}}
            onPress={handleOnPress || props.onPress}
          />
          {titleSecond && (
            <TouchableOpacity
              onPress={handleOnPressSecond}
              style={[styles.btnContainer]}>
              <Text style={styles.buttonText}>{titleSecond}</Text>
            </TouchableOpacity>
          )}
        </View>
        {countdown !== undefined && (
          <Text
            style={{
              marginTop: 20,
      paddingBottom:insets.bottom > 0 ?NAVIGATIONBAR_HEIGHT*2: scale(8),
              fontSize: 18,
              color: '#464B54',
              fontWeight: '400',
              alignSelf: 'center',
            }}>
            {res.strings.pleaseRetry}
            <Text style={{fontSize: 18, fontWeight: '600', color: '#5756C8'}}>
              {countdown < 10 ? ` 0${countdown} ` : ` ${countdown} `}
            </Text>
            seconds
          </Text>
        )}
      </View>
    );
  };

  const RenderEnroleItem = ({
    title,
    description,
    buttonTitle,
    ImageUrl,
    handleOnPress,
    extraButton = false,
    styling,
    titleStyle,
    handleOnPressSecond,
    titleSecond,
    countdown,
    sucessIcon,
  }) => {
    return (
      <View style={{flex: 1,paddingBottom:NAVIGATIONBAR_HEIGHT}}>
        <View style={styles.container}>
          <View style={{marginLeft: sucessIcon ? 28 : 0}}>
            {ImageUrl && <ImageUrl />}
          </View>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          <Text style={[styles.subtitle, {maxWidth: '80%'}, styling]}>
            {description}
          </Text>

          <WelcomeButton
            tittle={buttonTitle}
            style={{marginTop: 10, with: '70%', maxWidth: '70%'}}
            onPress={handleOnPress || props.onPress}
          />
          {titleSecond && (
            <TouchableOpacity
              onPress={handleOnPressSecond}
              style={[styles.btnContainer]}>
              <Text style={styles.buttonText}>{titleSecond}</Text>
            </TouchableOpacity>
          )}
        </View>
        {countdown !== undefined && (
          <Text
            style={{
              marginTop: 20,
          paddingBottom:insets.bottom > 0 ?NAVIGATIONBAR_HEIGHT*2: scale(8),
              fontSize: 18,
              color: '#464B54',
              fontWeight: '400',
              alignSelf: 'center',
            }}>
            {res.strings.pleaseRetry}
            <Text style={{fontSize: 18, fontWeight: '600', color: '#5756C8'}}>
              {countdown < 10 ? ` 0${countdown} ` : ` ${countdown} `}
            </Text>
            seconds
          </Text>
        )}
      </View>
    );
  };

  const RenderParticipetItem = ({
    title,
    description,
    buttonTitle,
    ImageUrl,
    handleOnPress,
    extraButton = false,
    styling,
    titleStyle,
    handleOnPressSecond,
    titleSecond,
    countdown,
    sucessIcon,
  }) => {
    return (
      <View style={{flex: 1,paddingBottom:NAVIGATIONBAR_HEIGHT}}>
        <View style={styles.container}>
          <View style={{marginLeft: sucessIcon ? 28 : 0}}>
            {ImageUrl && <ImageUrl />}
          </View>
          <Text style={[styles.title, titleStyle,{marginTop:35}]}>{title}</Text>
          <Text style={[styles.subtitle, {maxWidth: '65%'}, styling]}>
            {description}
          </Text>

          <WelcomeButton
            tittle={buttonTitle}
            style={{ with: '70%', maxWidth: '70%'}}
            onPress={handleOnPress || props.onPress}
          />
          {titleSecond && (
            <TouchableOpacity
              onPress={handleOnPressSecond}
              style={[styles.btnContainer]}>
              <Text style={styles.buttonText}>{titleSecond}</Text>
            </TouchableOpacity>
          )}
        </View>
        {countdown !== undefined && (
          <Text
            style={{
              marginTop: 20,
            paddingBottom:insets.bottom > 0 ?NAVIGATIONBAR_HEIGHT*2: scale(8),
              fontSize: 18,
              color: '#464B54',
              fontWeight: '400',
              alignSelf: 'center',
            }}>
            {res.strings.pleaseRetry}
            <Text style={{fontSize: 18, fontWeight: '600', color: '#5756C8'}}>
              {countdown < 10 ? ` 0${countdown} ` : ` ${countdown} `}
            </Text>
            seconds
          </Text>
        )}
      </View>
    );
  };

  const RenderPaymentItem = ({
    title,
    description,
    buttonTitle,
    ImageUrl,
    handleOnPress,
    extraButton = false,
    styling,
    titleStyle,
    handleOnPressSecond,
    titleSecond,
    countdown,
    sucessIcon
  }) => {
    return (
      <View style={{flex: 1}}>
        <View style={styles.container}>
       <View style={{marginLeft: sucessIcon ? 28 : 0}}>
            {ImageUrl && <ImageUrl />}
          </View>
          <Text style={[styles.title, titleStyle]}>{title}</Text>
          <Text style={[styles.subtitle, {maxWidth: '90%'}, styling]}>
            {description}
          </Text>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 16,
              borderColor: '#DDE2EB',
              width: '100%',
              paddingVertical: 25,
              paddingHorizontal: 20,
              marginTop: 35,
            }}>
            <View style={{}}>
              <Text style={{color: '#686E7A', fontSize: 14, fontWeight: '400'}}>
                {res.strings.donatedAmount}
              </Text>
              <Text
                style={{
                  paddingVertical: 12,
                  color: Colors.textColor,
                  fontSize: 17,
                  fontWeight: '500',
                }}>{`RM${props?.route?.params?.amount}`}</Text>
            </View>
            <View style={{height: 1, backgroundColor: '#DDE2EB'}}></View>
            <View>
              <Text
                style={{
                  paddingTop: 10,
                  color: '#686E7A',
                  fontSize: 14,
                  fontWeight: '400',
                }}>
                {res.strings.donateTo}
              </Text>
              <Text
                style={{
                  paddingTop: 10,
                  color: Colors.textColor,
                  fontSize: 17,
                  fontWeight: '500',
                }}>
                {props?.route?.params?.donationTo}{' '}
              </Text>
            </View>
          </View>
          {titleSecond && (
            <TouchableOpacity
              onPress={handleOnPressSecond}
              style={[styles.btnContainer]}>
              <Text style={styles.buttonText}>{titleSecond}</Text>
            </TouchableOpacity>
          )}
        </View>

        {countdown !== undefined && (
          <Text
            style={{
              marginTop: 20,
                   paddingBottom:insets.bottom > 0 ?NAVIGATIONBAR_HEIGHT*2: scale(8),
              fontSize: 18,
              color: '#464B54',
              fontWeight: '400',
              alignSelf: 'center',
            }}>
            {res.strings.redirectIn}{' '}
            <Text style={{fontSize: 18, fontWeight: '600', color: '#5756C8'}}>
              {countdown < 10 ? `0${countdown}` : countdown}
            </Text>{' '}
            seconds
          </Text>
        )}
      </View>
    );
  };

  const error=props?.route?.params?.errroMsg ? props?.route?.params?.errroMsg : ""

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.screen}>
        {props?.route?.params?.type == 'Event' ? (
          <RenderItem
            title={res.strings.yourIn}
            description={res.strings.thanksYou}
            buttonTitle={res.strings.awesome}
            handleOnPress={() => {
              navigation.goBack();
            }}
            ImageUrl={SuccessIcon}
          />
        ) : props?.route?.params?.type == 'paymentSuccess' ? (
          <RenderPaymentItem
            title={res.strings.paymentSuccess}
            description={
              guestInfo !== null
                ? res.strings.enroleUserSuccess
                : res.strings.paymentDescription
            }
            buttonTitle={res.strings.awesome}
            handleOnPress={() => {
              navigation.replace('TabNavigation');
            }}
            ImageUrl={SuccessIcon}
            countdown={secondsLeft}
              sucessIcon={true}
          />
        ) : props?.route?.params?.type == 'paymentFailed' ? (
          <RenderItem
            title={res.strings.paymentFailed}
            description={error}
            buttonTitle={res.strings.retry}
            handleOnPress={() => navigation.goBack()}
            ImageUrl={PaymentFailedIcon}
            countdown={secondsLeft}
          />
        ) : props?.type == 'userEnrolSuccess' ? (
          <RenderEnroleItem
            title={res.strings.youreEnroled}
            description={res.strings.enroledSameDetails}
            buttonTitle={res.strings.registerMe}
            handleOnPress={props.onPress}
            ImageUrl={SuccessIcon}
            styling={{fontSize: 14, fontWeight: '400'}}
            titleStyle={{fontSize: 18,marginTop:35}}
            handleOnPressSecond={props.onSecondPress}
            titleSecond={res.strings.illskip}
             sucessIcon={true}
          />
        ) : props?.type == 'eventRegisterGuest' ? (
          <RenderParticipetItem
            title={res.strings.volunteerEvent}
            description={
             res.strings.particiepentEvent 
            }
            buttonTitle={res.strings.register}
            handleOnPress={props.onPress}
            ImageUrl={JoinIcon}
            styling={{fontSize: 14, fontWeight: '400'}}
            titleStyle={{fontSize: 18}}
            handleOnPressSecond={props.onPressSecond}
            titleSecond={'Cancel'}
          />
        ) : props?.type == 'unlockMoreFeaturesPopup' ? (
          <RenderParticipetItem
            title={res.strings.unlockMoreFeaturesPopup_title}
            description={
             res.strings.unlockMoreFeaturesPopup_sub_title 
            }
            buttonTitle={res.strings.SignUp}
            handleOnPress={props.onPress}
            ImageUrl={UnlockIcon}
            styling={{fontSize: scale(13), fontWeight: '400'}}
            titleStyle={{fontSize: 18}}
            handleOnPressSecond={props.onPressSecond}
            titleSecond={'Cancel'}
          />
        ) : props?.route?.params?.type == 'skipEnrole' ? (
          <RenderItem
            title={res.strings.thankYouString}
            description={res.strings.enroleSuccess}
            buttonTitle={res.strings.awesome}
            handleOnPress={() => navigation.replace('TabNavigation')}
            ImageUrl={SuccessIcon}
            countdown={secondsLeft}
          />
        ) :props?.route?.params?.type == 'beforeEnrole' ? (
          <RenderItem
            title={res.strings.thankYouString}
            description={res.strings.donationThankYou}
            buttonTitle={res.strings.awesome}
            handleOnPress={() => navigation.replace('TabNavigation')}
            ImageUrl={SuccessIcon}
            countdown={secondsLeft}
          />
        ) : (
          <RenderItem
            title={res.strings.success}
            description={res.strings.waqafAnNurWelcome}
            buttonTitle={res.strings.awesome}
            handleOnPress={() => navigation.replace('TabNavigation')}
            ImageUrl={SuccessIcon}
            sucessIcon={true}
          />
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
   
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginTop: 50,
    color: '#181B1F',
    height: 29,
  },
  subtitle: {
    fontSize: scale(15),
    color: '#464B54',
    fontWeight: '400',
    maxWidth: '90%',
    lineHeight: 20,
    textAlign: 'center',
    fontFamily: 'inter',
    marginVertical: 10,
    height: 60,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#4BB543',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '60%%',
  },
  btnContainer: {
    height: scale(48),
    width: '70%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#9F9AF44D',
    backgroundColor: '#fff',
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {fontSize: 17, fontWeight: '600', color: '#272682'},
});

export default SuccessScreen;

