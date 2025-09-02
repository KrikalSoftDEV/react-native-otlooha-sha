import {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Animated, FlatList, Pressable, TouchableOpacity, Text} from 'react-native';
import Onboarding_1 from '../../assets/images/Welcome/image-1.png';
import Onboarding_2 from '../../assets/images/Welcome/image-2.png';
import Onboarding_3 from '../../assets/images/Welcome/image-3.png';
import Onboarding_4 from '../../assets/images/Welcome/image-4.png';
import Onboarding_5 from '../../assets/images/Welcome/image-5.png';
import OnboardingData from './OnboardingData';
import res from '../../constants/res';


function OnboardingScreen(props) {
  const onboardingData = [
    {
      id: '1',
      title_1:  res.strings.onboarding_1_title_1,
      title_2:  res.strings.onboarding_1_title_2,
      title_3:  res.strings.onboarding_1_title_3,
      description:
       res.strings.onboarding_1_description,
      image: Onboarding_1,
      backgroundColor_1: '#FFFFFF',
      backgroundColor_2: '#FFDDFE',
    },
    {
      id: '2',
      title_1:  res.strings.onboarding_2_title_1,
      title_2:  res.strings.onboarding_2_title_2,
      title_3:  res.strings.onboarding_2_title_3,
      description:
       res.strings.onboarding_2_description,
      image: Onboarding_2,
      backgroundColor_1: '#FFFFFF',
      backgroundColor_2: '#FFF7D5',
    },
    {
      id: '3',
      title_1:  res.strings.onboarding_3_title_1,
      title_2:  res.strings.onboarding_3_title_2,
      title_3:  res.strings.onboarding_3_title_3,
      description:
       res.strings.onboarding_3_description,
      image: Onboarding_3,
      backgroundColor_1: '#FFFFFF',
      backgroundColor_2: '#D8EBFF',
    },
    {
      id: '4',
      title_1:  res.strings.onboarding_4_title_1,
      title_2:  res.strings.onboarding_4_title_2,
      title_3:  res.strings.onboarding_4_title_3,
      description:
       res.strings.onboarding_4_description,
      image: Onboarding_4,
      backgroundColor_1: '#FFFFFF',
      backgroundColor_2: '#FFE0E0',
    },
    {
      id: '5',
      title_1:  res.strings.onboarding_5_title_1,
      title_2:  res.strings.onboarding_5_title_2,
      title_3:  res.strings.onboarding_5_title_3,
      description:
       res.strings.onboarding_5_description,
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
      flatListRef.current.scrollToIndex({ index: index + 1 });
    } else {
      navigateToSignUp(); // Or whatever your final action is
    }
  };
  
  function navigateToSignUp() {
      props.navigation.replace('Login');
  }

 

  return (
    <View style={styles.screen}>
      <View style={[styles.imageSlideContainer]}>
        <FlatList
          ref={flatListRef}
          data={onboardingData}
          renderItem={({item}) => {
            return (
              <OnboardingData
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
      {/* <View style={styles.btnContainer}>
        <Pressable
          style={styles.skipBtn}
          onPress={() => {
            navigateToSignUp();
          }}>
          {/* <TitleText>Skip</TitleText> */}
        {/* </Pressable> */}
        {/* <Pressable style={styles.skipBtn}>
          <TitleText>Go</TitleText>
        </Pressable> */}
      {/* </View>  */}
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
});
export default OnboardingScreen;
