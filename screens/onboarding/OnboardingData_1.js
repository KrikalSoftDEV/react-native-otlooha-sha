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
import { TitleText } from '../../components/UI/CustomText';
import { LinearGradient } from 'react-native-linear-gradient';
import Pagination from './Pagination';
import { scale, verticalScale } from 'react-native-size-matters';
import WelcomeScreenLogo from '../../assets/images/Welcome/welcomeScreenLogo.png';
import TuhanImage from '../../assets/images/Homescreen/tuhan_red.png';
import ElipseLine from '../../assets/images/Onboarding/eclipse_bg.png';
import { WelcomeButton } from '../../components/UI/Button';
import MaskedView from '@react-native-masked-view/masked-view';
import res from '../../constants/res';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const gradientKeywords = [
  "Prayer Times",
  "Qibla Direction",
  "Mosques",
  "Read and Listen",
  "Your Daily Guide",
];
const OnboardingData_1 = ({
  item,
  scrollX,
  index,
  onboardingData,
  navigateToSignUp,
  handleNext,
}) => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const getStyledTextParts = (sentence, keywords) => {
    let keywordMatched = '';
    let index = -1;

    for (let keyword of keywords) {
      index = sentence.indexOf(keyword);
      if (index !== -1) {
        keywordMatched = keyword;
        break;
      }
    }

    if (index === -1) return [{ text: sentence, gradient: false }];

    const before = sentence.slice(0, index);
    const after = sentence.slice(index + keywordMatched.length);

    return [
      { text: before, gradient: false },
      { text: keywordMatched, gradient: true },
      { text: after.trimStart(), gradient: false },
    ];
  };

  const GradientText = ({ text, style }) => (
    <MaskedView
      maskElement={
        <Text style={[style, { backgroundColor: 'transparent' }]}>
          {text}
        </Text>
      }
    >
      <LinearGradient
        colors={['#5756C8', '#FF5A6A']}
        start={{ x: 0.3, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
  const FeatureText = ({ text }) => {
    const parts = getStyledTextParts(text, gradientKeywords);

    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: "flex-start" }}>
        {parts.map((part, index) =>
          part.gradient ? (
            <GradientText
              key={index}
              text={part.text}
              style={[styles.titleText, {
                fontWeight: '700',
              }]}
            />
          ) : (
            <Text
              key={index}
              style={styles.titleText}
            >
              {part.text}
            </Text>
          )
        )}
      </View>
    );
  };

  return (
    <View style={{ height: '100%', width: width }}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <LinearGradient
        colors={[item?.backgroundColor_1, item?.backgroundColor_2]}
        style={styles.linearGradient}>
        <ImageBackground source={ElipseLine} style={styles.backgroundImage}>
            <View style={styles.imageAndCaptionContainer}>

              <View
                style={[
                  styles.welcomeImgView,
                ]}>
                <Image source={item?.image} style={{ resizeMode: "contain"}}/>
              </View>
              <View style={styles.titleScrollWrapper}>
                <ScrollView
                  contentContainerStyle={styles.titleView}
                  showsVerticalScrollIndicator={false}>
                    <FeatureText text={item?.title} />
                  {/* {item?.title_1 && (
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
                  )} */}
                  <TitleText style={styles.descriptionStyle}>
                    {item.description}
                  </TitleText>
                </ScrollView>
              </View>
            </View>
            <View style={styles.bottomFixed}>
            </View>
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
    marginTop: scale(30),
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
    height: scale(195),
    justifyContent: 'center',
    flex:1,
    backgroundColor:"transparent",
  },
  titleScrollWrapper: {
    maxHeight: scale(400),
    marginTop:verticalScale(-80),
    flex: 1,
  },
  titleView: {
    paddingHorizontal: scale(30),
  },
  titleText: {
    fontSize: scale(28),
    fontWeight: '500',
    color: '#191967',
  },
  gradientMaskText: {
    fontSize: scale(29),
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
    marginTop: verticalScale(20),
  },
  bottomFixed: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    // alignItems: 'center',
    paddingHorizontal: 10,
  },
  paginationWrapper: {
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    // marginVertical: 20,
  },
  button: {
    // flex:1,
    marginTop: 20,
  },
});

export default OnboardingData_1;
