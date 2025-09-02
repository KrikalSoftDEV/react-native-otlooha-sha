import {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  Animated,
  FlatList,
  Pressable,
  Text,
  Dimensions,
  Image,
} from 'react-native';
import Onboarding_1 from '../../assets/images/Welcome/image-1.png';
import Onboarding_2 from '../../assets/images/Welcome/image-2.png';
import Onboarding_3 from '../../assets/images/Welcome/image-3.png';
import Onboarding_4 from '../../assets/images/Welcome/image-4.png';
import Onboarding_5 from '../../assets/images/Welcome/image-5.png';
import res from '../../constants/res';
import OnboardingData_1 from './OnboardingData_1';
import {scale, verticalScale} from 'react-native-size-matters';
import WelcomeScreenLogo from '../../assets/images/Welcome/welcomeScreenLogo.png';
import TuhanImage from '../../assets/images/Homescreen/tuhan_red.png';
import {WelcomeButton} from '../../components/UI/Button';
import {SafeAreaView} from 'react-native-safe-area-context';
import Pagination from './Pagination';

const {width} = Dimensions.get('window');
function OnboardingScreen_1(props) {
  const onboardingData = [
    {
      id: '1',
      title_1: res.strings.onboarding_1_title_1,
      title_2: res.strings.onboarding_1_title_2,
      title_3: res.strings.onboarding_1_title_3,
      title:"Stay Connected with Precise Islamic Prayer Times",
      description: res.strings.onboarding_1_description,
      image: Onboarding_1,
      backgroundColor_1: '#FFFFFF',
      backgroundColor_2: '#FFDDFE',
    },
    {
      id: '2',
      title_1: res.strings.onboarding_2_title_1,
      title_2: res.strings.onboarding_2_title_2,
      title_3: res.strings.onboarding_2_title_3,
      title: "Always Know the Right Qibla Direction Wherever You Are",
      description: res.strings.onboarding_2_description,
      image: Onboarding_2,
      backgroundColor_1: '#FFFFFF',
      backgroundColor_2: '#FFF7D5',
    },
    {
      id: '3',
      title_1: res.strings.onboarding_3_title_1,
      title_2: res.strings.onboarding_3_title_2,
      title_3: res.strings.onboarding_3_title_3,
      title: "Quickly Find Mosques Around You in Any City",
      description: res.strings.onboarding_3_description,
      image: Onboarding_3,
      backgroundColor_1: '#FFFFFF',
      backgroundColor_2: '#D8EBFF',
    },
    {
      id: '4',
      title_1: res.strings.onboarding_4_title_1,
      title_2: res.strings.onboarding_4_title_2,
      title_3: res.strings.onboarding_4_title_3,
      title: "Read and Listen to the Holy Quran Anytime, Anywhere",
      description: res.strings.onboarding_4_description,
      image: Onboarding_4,
      backgroundColor_1: '#FFFFFF',
      backgroundColor_2: '#FFE0E0',
    },
    {
      id: '5',
      title_1: res.strings.onboarding_5_title_1,
      title_2: res.strings.onboarding_5_title_2,
      title_3: res.strings.onboarding_5_title_3,
      title: "Your Daily Guide for a Spiritually Connected Life",
      description: res.strings.onboarding_5_description,
      image: Onboarding_5,
      backgroundColor_1: '#FFFFFF',
      backgroundColor_2: '#D9FCFF',
    },
  ];
  const flatListRef = useRef();

  const [index, setIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleOnScroll = event => {
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: {
              x: scrollX,
            },
          },
        },
      ],
      {
        useNativeDriver: false,
      },
    )(event);
  };

  const handleOnViewableItemsChanged = useRef(({viewableItems}) => {
    setIndex(viewableItems[0].index);
  }).current;
  const handleNext = () => {
    if (index < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({index: index + 1});
    } else {
      navigateToSignUp(); // Or whatever your final action is
    }
  };

  function navigateToSignUp() {
    props.navigation.replace('Login');
  }

  return (
    <View style={styles.screen}>
      <SafeAreaView style={{ paddingBottom:verticalScale(-140), marginBottom:verticalScale(24)}} />
        <View style={[styles.imageSlideContainer]}>
          <View
            style={[
              styles.logoSkipView,
              styles.androidLogoPadding,
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
                  source={TuhanImage}
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
          <FlatList
            ref={flatListRef}
            data={onboardingData}
            renderItem={({item}) => {
              return (
                <OnboardingData_1
                  item={item}
                  scrollX={scrollX}
                  index={index}
                  onboardingData={onboardingData}
                  navigateToSignUp={navigateToSignUp}
                  handleNext={handleNext}
                />
              );
            }}
            horizontal
            snapToAlignment="center"
            showsHorizontalScrollIndicator={false} //keep these property to false
            pagingEnabled
            keyExtractor={item => item.id}
            onScroll={handleOnScroll}
            onViewableItemsChanged={handleOnViewableItemsChanged}
          />
        </View>
        {/* <View style={{marginTop: 20}}> */}
          <View style={{position:"absolute", bottom:verticalScale(60), width:'100%',paddingTop:10,paddingHorizontal:scale(12) }}>
          <View style={styles.paginationWrapper}>
            <Pagination data={onboardingData} scrollX={scrollX} index={index} />
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
      {/* </SafeAreaView> */}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: 'white',
  },
  sliderImg: {
    resizeMode: 'contain',
  },
  imageSlideContainer: {
    flex: 1,
  },
  skipBtn: {
    // marginLeft: 30,
    // marginTop: 30,
  },
  btnContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 20,
    marginTop: 40,
    flex: 0.1,
  },
  safeArea: {
    flex: 1,
    // paddingBottom: 10,
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
    // paddingTop: verticalScale(30),
  },
  iosImageMargin: {
    marginTop: verticalScale(30),
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
    fontSize: scale(15),
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
    paddingHorizontal: 30,
  },
  button: {
    // flex:1,
    marginTop: verticalScale(35),
  },
  paginationWrapper: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    // marginVertical: 20,
  },
});
export default OnboardingScreen_1;
