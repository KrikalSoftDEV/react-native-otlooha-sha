import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import CompassHeading from 'react-native-compass-heading';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Image,
  Easing,
  Dimensions,
  AppState,
  Platform,
  Linking,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/UI/Header';
import IndictorGrayIcon from '../../assets/images/QiblaCompass/indictor-gray.png';
import IndictorGreenIcon from '../../assets/images/QiblaCompass/indictor-green.png';
import DeviceInfo from 'react-native-device-info';
import LocationErrorModal from './LocationErrorModal';
import { scale, verticalScale } from 'react-native-size-matters';
import useUserLocation from '../../hooks/useUserLocation';

const { width, height } = Dimensions.get('window');


// const coords = {
//   // malishiya let,long
//   latitude: 4.2105,
//   longitude: 101.9758,
// }

function QiblaCompassScreen() {
  const {
    city,
    country,
    coords
  } = useUserLocation('noAlert');
  const navigation = useNavigation();
  const isFocused = useIsFocused()
  const [heading, setHeading] = useState(0);
  const [loading, setLoading] = useState(false);
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [locationEnabledStatus, setLocationEnabledStatus] = useState(true);
  const [defaultLocation, setDefaultLocation] = useState(null);
  const [appState, setAppState] = useState(AppState.currentState);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const resetAnim = useRef(new Animated.Value(0)).current;

  const locationString = `${city || 'Johor'}, ${country || 'Malaysia'}`;

  useEffect(() => {
    if (coords?.latitude && coords?.longitude) {
      const calculateQiblaAngle = async (lat, lon) => {
        setLoading(true)
        const kaabaLat = 21.4225;
        const kaabaLon = 39.8262;

        const phiK = (kaabaLat * Math.PI) / 180;
        const lambdaK = (kaabaLon * Math.PI) / 180;
        const phi = (lat * Math.PI) / 180;
        const lambda = (lon * Math.PI) / 180;

        const deltaLambda = lambdaK - lambda;
        const x = Math.sin(deltaLambda);
        const y = Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(deltaLambda);
        const bearing = (Math.atan2(x, y) * 180) / Math.PI;
        const angle = (bearing + 360) % 360;
        if (angle) {
          setQiblaAngle(angle);
          setLoading(false)
        } else {
          setLoading(false)
        }
      }
      calculateQiblaAngle(coords?.latitude, coords?.longitude)
    }
  }, [coords?.latitude, coords?.longitude]);


  useLayoutEffect(() => {
    if (locationEnabledStatus) {
      const degreeUpdateRate = 1;
      let lastHeading = 0;

      CompassHeading.start(degreeUpdateRate, ({ heading }) => {
        const diff = Math.abs(heading - lastHeading);
        if (diff < 2 || diff > 358) return;

        lastHeading = heading;
        setHeading(heading);
        Animated.timing(rotateAnim, {
          toValue: heading,
          duration: 200,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      });
    }
    return () => CompassHeading.stop();
  }, [locationEnabledStatus]);

  useLayoutEffect(() => {
    if (locationEnabledStatus) {
      handleRefresh();
    }
    return () => CompassHeading.stop();
  }, [locationEnabledStatus]);

  useEffect(() => {
    let interval = null
    if (isFocused && defaultLocation === null) {
      interval = setInterval(async () => {
        const isEnabled = await DeviceInfo.isLocationEnabled();

        setLocationEnabledStatus(isEnabled);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isFocused, defaultLocation]);

  // useEffect(() => {
  //   const subscription = AppState.addEventListener(
  //     'change',
  //     async nextAppState => {
  //       if (appState.match(/inactive|background/) && nextAppState === 'active') {
  //         const isEnabled = await DeviceInfo.isLocationEnabled();
  //         setLocationEnabledStatus(isEnabled);
  //       }
  //       setAppState(nextAppState);
  //     });

  //   return () => subscription.remove();
  // }, [appState]);

  const handleDeviceLocation = () => {
    if (Platform.OS === 'ios') {
      Linking.openURL('App-Prefs:Privacy&path=LOCATION');
    } else {
      Linking.openSettings();
    }
  };

  const compassRotation = rotateAnim.interpolate({
    inputRange: [0, 360],
    outputRange: ['0deg', '360deg'],
  });

  const refreshSpin = resetAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const isAlignedToQibla = () => {
    const diff = Math.abs(((heading - qiblaAngle + 360) % 360));
    return diff <= 2 || diff >= 358;
  };

  console.log("isAlignedToQibla", isAlignedToQibla(), qiblaAngle)

  const handleRefresh = () => {
    // Stop the current compass listener
    CompassHeading.stop();

    // Spin the refresh icon
    resetAnim.setValue(0);
    Animated.timing(resetAnim, {
      toValue: 1,
      duration: 800,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();

    // Reset heading and rotateAnim
    setHeading(0);
    rotateAnim.setValue(0);

    // Restart compass after short delay
    setTimeout(() => {
      let lastHeading = 0;
      CompassHeading.start(1, ({ heading }) => {
        const diff = Math.abs(heading - lastHeading);
        if (diff < 2 || diff > 358) return;

        lastHeading = heading;
        setHeading(heading);
        Animated.timing(rotateAnim, {
          toValue: heading,
          duration: 300,
          easing: Easing.out(Easing.ease),
          useNativeDriver: false,
        }).start();
      });
    }, 1000);
  };

const closeLocationErrorModal=()=>{
 const default_ocation = {
    latitude: 4.2105, // Default to Malaysia
    longitude: 101.9758,
  }
    setLocationEnabledStatus(true);
    setDefaultLocation(default_ocation);
}
  const getCardinalDirection = degree => {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(degree / 45) % 8;
    return directions[index];
  };

  const refreshIcon = (
    <Animated.Image
      source={require('../../assets/images/QiblaCompass/refress-icon.png')}
      style={{
        height: 20,
        width: 20,
        resizeMode: 'contain',
        transform: [{ rotate: refreshSpin }],
      }}
    />
  );

  return (
    <SafeAreaView style={{ backgroundColor: '#FFF' }}>
      <Header
        headerTitle="Qibla Direction"
        onBackPress={() => navigation.goBack()}
        onPressLeft={handleRefresh}
        leftIcon={refreshIcon}
      />
      <View style={styles.container}>
        <Text style={styles.instruction}>
          Place the device on a flat surface and rotate it until the indicator turns green.
        </Text>
        <View style={{ width: width }}>
          {
            loading || !qiblaAngle ? (
              <View
                style={{

                  width: width * 0.98,
                  height: height * 0.70,
                  justifyContent: "center",
                  alignItems: "center"
                }}>
                <ActivityIndicator size="large" color="#3937A4" style={{ alignSelf: 'center', }} />
              </View>
            ) : (
              <>
                <Text style={styles.status}>{isAlignedToQibla() ? "You are facing Mecca" : ""}</Text>
                <View style={{ width: width, marginTop: verticalScale(10), alignItems: "center" }}>
                  <Image
                    source={isAlignedToQibla() && qiblaAngle > 0 ? IndictorGreenIcon : IndictorGrayIcon}
                    style={styles.indicatorIcon}
                  />
                  <View style={[styles.compassContainer,
                  { transform: [{ rotate: `-${qiblaAngle.toFixed(0) * 2}deg` }] }
                  ]}>
                    <Animated.View style={[{
                      width: width * 0.98,
                      height: width * 0.98,
                    },
                    { transform: [{ rotate: compassRotation }] }
                    ]
                    }>
                      <ImageBackground
                        source={require('../../assets/images/QiblaCompass/compass-circle.png')}
                        imageStyle={{
                          width: '100%',
                          height: '100%',
                        }}
                        style={styles.compassImage}
                      >
                        <Image
                          source={require('../../assets/images/QiblaCompass/compass-needle-group.png')}
                          style={[styles.needleImage,
                          { transform: [{ rotate: `${qiblaAngle.toFixed(0)}deg` }] }
                          ]}
                        />
                      </ImageBackground>
                    </Animated.View>
                  </View>

                </View>

                <View style={styles.footerContainer}>
                  <Text style={styles.footerLabel}>Qibla Direction from North</Text>
                  <Text style={styles.footerValue}>
                    {`${qiblaAngle.toFixed(0)}° ${getCardinalDirection(qiblaAngle)}`}
                  </Text>
                  <Text style={styles.footerLabel}>{locationString}</Text>
                </View>
              </>
            )
          }
        </View>
        {!locationEnabledStatus && (
          <LocationErrorModal
            visible={!locationEnabledStatus}
            onClose={closeLocationErrorModal}
            onPressHandel={handleDeviceLocation}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    height: '100%',
    backgroundColor: '#FFF',
  },
  instruction: {
    textAlign: 'center',
    color: '#464B54',
    fontSize: scale(14),
    fontWeight: '400',
    paddingHorizontal: '10%',
    marginTop: verticalScale(20),
  },
  status: {
    fontSize: scale(16),
    fontWeight: '600',
    marginTop: verticalScale(20),
    color: '#181B1F',
    alignSelf: 'center',
    textAlign: 'center',
  },
  compassContainer: {
    width: width,
    height: width,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compassImage: {
    width: '100%',
    height: '100%',
    alignSelf: "center",
    justifyContent: "center",
    borderRadius: '100%',
    alignItems: "center",
    resizeMode: 'contain',
  },
  needleImage: {
    width: "48%",
    height: "58%",
    resizeMode: "contain",
    alignSelf: "center",
  },
  indicatorIcon: {
    width: scale(29),
    height: scale(33),
    alignSelf: "center",
    marginBottom: verticalScale(10)
  },
  footerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  footerLabel: {
    fontSize: scale(14),
    color: '#464B54',
  },
  footerValue: {
    fontSize: scale(28),
    fontWeight: '700',
    marginTop: 8,
    color: '#181B1F',
  },
});

export default QiblaCompassScreen;
