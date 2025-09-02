import React from 'react';
import {
  View,
  useWindowDimensions,
  SafeAreaView,
  StyleSheet,
  Image,
  Text,
  Pressable,
  Dimensions,
  StatusBar,
  Platform,
  ImageBackground,
  ScrollView,
} from 'react-native';
import {TitleText} from '../../components/UI/CustomText';
import {LinearGradient} from 'react-native-linear-gradient';
import Pagination from './Pagination';
import {scale} from 'react-native-size-matters';
import WelcomeScreenLogo from '../../assets/images/Welcome/welcomeScreenLogo.png';
import TuhanImage from '../../assets/images/Homescreen/tuhan_red.png';
import ElipseLine from '../../assets/images/Onboarding/eclipse_bg.png';
import {WelcomeButton} from '../../components/UI/Button';
import MaskedView from '@react-native-masked-view/masked-view';
import res from '../../constants/res';
import {useNavigation} from '@react-navigation/native';

const {width} = Dimensions.get('window');

const OnboardingData = ({
  item,
  scrollX,
  index,
  onboardingData,
  navigateToSignUp,
  handleNext,
}) => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();

  return (
    <View style={{height: '100%', width: width}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <LinearGradient
        colors={[item?.backgroundColor_1, item?.backgroundColor_2]}
        style={styles.linearGradient}>
        <ImageBackground source={ElipseLine} style={styles.backgroundImage}>
          <SafeAreaView style={styles.safeArea}>
            <View style={styles.imageAndCaptionContainer}>
              <View
                style={[
                  styles.logoSkipView,
                  Platform.OS === 'android' && styles.androidLogoPadding,
                ]}>
                <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                  <Image
                    source={WelcomeScreenLogo}
                    style={styles.logoImg}
                    resizeMode="contain"
                  />
                  <View
                    style={{
                      width: 1,
                      backgroundColor: '#657278',
                      height: scale(43),
                      marginHorizontal: 10,
                    }}
                  />
                  <View style={{padding: 0}}>
                    <Image
                      source={TuhanImage} // Replace with your logo
                      style={styles.logoImg1}
                      resizeMode="contain"
                    />
                  </View>
                </View>

                {index !== onboardingData.length - 1 ? (
                  <Pressable onPress={navigateToSignUp}>
                    <Text style={styles.skipText}>{res.strings.skip}</Text>
                  </Pressable>
                ) : null}
              </View>

              <View
                style={[
                  styles.welcomeImgView,
                  Platform.OS !== 'android' && styles.iosImageMargin,
                ]}>
                <Image source={item?.image} />
              </View>

              {/* Scrollable Title Text */}
              <View style={styles.titleScrollWrapper}>
                <ScrollView
                  contentContainerStyle={styles.titleView}
                  showsVerticalScrollIndicator={false}>
                  {item?.title_1 && (
                    <Text style={styles.titleText}>{item?.title_1}</Text>
                  )}
                  <MaskedView
                    maskElement={
                      <Text style={styles.gradientMaskText}>
                        {item?.title_2}
                      </Text>
                    }>
                    <LinearGradient
                      colors={['#5756C8', '#FF5A6A']}
                      start={{x: 0, y: 0}}
                      end={{x: 1, y: 0}}>
                      <Text style={styles.gradientBackgroundText}>
                        {item?.title_2}
                      </Text>
                    </LinearGradient>
                  </MaskedView>
                  {item?.title_3 && (
                    <Text style={styles.titleText}>{item?.title_3}</Text>
                  )}
                  <TitleText style={styles.descriptionStyle}>
                    {item.description}
                  </TitleText>
                </ScrollView>
              </View>
            </View>

            {/* Fixed Pagination and Button */}
            <View style={styles.bottomFixed}>
              <View style={styles.paginationWrapper}>
                <Pagination
                  data={onboardingData}
                  scrollX={scrollX}
                  index={index}
                />
              </View>
              <WelcomeButton
                tittle={
                  index === onboardingData.length - 1
                    ? res.strings.getStarted
                    : res.strings.next
                }
                style={styles.button}
                onPress={handleNext}
              />
            </View>
          </SafeAreaView>
        </ImageBackground>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  linearGradient: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  imageAndCaptionContainer: {
    flexGrow: 1,
    width: width,
  },
  logoSkipView: {
    paddingHorizontal: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  androidLogoPadding: {
    paddingVertical: 60,
  },
  iosImageMargin: {
    marginTop: scale(40),
  },
  logoImg: {
    height: scale(43),
    width: scale(100),
  },
   logoImg1: {
    height: scale(43),
    width: scale(50),
  },
  skipText: {
    fontSize: scale(16),
    fontWeight: '500',
    color: '#5756C8',
  },
  welcomeImgView: {
    marginLeft: scale(34),
    height: scale(165),
    justifyContent: 'center',
  },
  titleScrollWrapper: {
    maxHeight: scale(300),
    marginTop: scale(20),
  },
  titleView: {
    paddingVertical: scale(35),
    paddingHorizontal: scale(30),
  },
  titleText: {
    fontSize: scale(28),
    fontWeight: '500',
    color: '#191967',
  },
  gradientMaskText: {
    fontSize: scale(28),
    fontWeight: '700',
    color: '#191967',
  },
  gradientBackgroundText: {
    fontSize: scale(28),
    fontWeight: '700',
    opacity: 0,
  },
  descriptionStyle: {
    fontSize: scale(14),
    fontWeight: '400',
    color: '#191967',
    paddingVertical: 30,
  },
  bottomFixed: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    // alignItems: 'center',
    paddingHorizontal: 10,
  },
  paginationWrapper: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  button: {
    // flex:1,
    marginTop: 20,
  },
});

export default OnboardingData;
