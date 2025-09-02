import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  useWindowDimensions,
  Alert,
} from 'react-native';
import {
  NAVIGATIONBAR_HEIGHT,
  STATUSBAR_HEIGHT,
} from '../../constants/Dimentions';
import Colors from '../../constants/Colors';
import BackArrow_white from '../../assets/images/Common/backArrow_white.svg';
import {useNavigation} from '@react-navigation/native';
import HeaderImageCarousel from '../common/HeaderImageCarousel';
import {announcementDetailsList} from '../../redux/slices/announcementSlice';
import {useDispatch} from 'react-redux';
import { useLoading } from '../../context/LoadingContext';
import RenderHTML from 'react-native-render-html';
const headerCarouselImages = [
  {
    image: require('../../assets/images/WorshipPlaces/header_image.png'),
    accessibilityLabel: 'Worship Place Header 1',
  },
  {
    image: require('../../assets/images/WorshipPlaces/header_image.png'),
    accessibilityLabel: 'Worship Place Header 2',
  },
  // Add more images as needed
];
const {height} = Dimensions.get('window');
 const tagsStyles = {
  
    h1: {
      color: Colors.textColor,
      fontWeight:'700',
      fontSize: 24,
    },
    p: {
      color: Colors.textColor,
      fontWeight:'400',
      fontSize: 14,
    },
   
  };
const AnnouncementDetails = props => {
  const {showLoader, hideLoader} = useLoading();
      const { width } = useWindowDimensions();
  const data = props?.route?.params?.item;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [announcementDetailsListData, setAnnouncementDetailsListData] =
    useState();
  useEffect(() => {
    getAnnouncementDetailsList();
  }, []);

  const getAnnouncementDetailsList = async () => {
    try {
      showLoader();
      const response = await dispatch(
        announcementDetailsList(data?.announcementId),
      ).unwrap();
      if (response.data.status === 1) {
        setAnnouncementDetailsListData(response.data.result);
        hideLoader();
      }
    } catch (e) {
      hideLoader();
      Alert.alert('Error', 'Unable to fetch announcements.');
    }
  };
  return (
    <View style={styles.mainContainer}>
      {/* <SafeAreaView style={styles.container}> */}
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />

      <View style={styles.imageContainer}>
        {/* {announcementDetailsListData?.imageUrl?.length > 0 
        &&  */}
        <HeaderImageCarousel
          data={announcementDetailsListData?.imageUrl ? announcementDetailsListData?.imageUrl  : []}
          height={280}
          showPagination={true}
          autoPlay={true}
          imageKey=''
          autoPlayInterval={3000}
        />
        {/* } */}
        {/* <Image
          source={data.image} // Replace with your image path
          style={styles.image}
        /> */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <BackArrow_white />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>{announcementDetailsListData?.title}</Text>

        {/* {announcementDetailsListData?.longDescription ? (
          <Text style={styles.paragraph}>
            {announcementDetailsListData?.longDescription}
          </Text> */}
           {announcementDetailsListData?.longDescription?
           ( <RenderHTML
                  contentWidth={width}
                  source={{ html: announcementDetailsListData?.longDescription}}
                   tagsStyles={tagsStyles}
                />
        ) : (
          <Text
            style={{
              fontSize: 14,
              fontWeight: '400',
              alignSelf: 'center',
              color: '#292D33',
            }}>
            No description available.
          </Text>
        )}
      </ScrollView>

      {/* </SafeAreaView> */}
    </View>
  );
};

export default AnnouncementDetails;

const styles = StyleSheet.create({
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 65 : 40, // Adjust for iOS notch
    left: 3,
    // backgroundColor: 'white',
    padding: 10,

    borderRadius: 30,
    // elevation: 5, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.3,
    // shadowRadius: 2,
    zIndex: 1000,
  },
  container: {
    backgroundColor: Colors.colorWhite,
    paddingTop: STATUSBAR_HEIGHT,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.colorWhite,
    paddingBottom: 40,
    marginBottom: NAVIGATIONBAR_HEIGHT * 1.2,
  },
  imageContainer: {
    // height: height / 3,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#c3c3c3',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 16,
    // backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 6,
    borderRadius: 20,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 16,
    color: Colors.textColor,
  },
  paragraph: {
    fontSize: 16,
    color: '#292D33',
    fontWeight: '400',
    marginBottom: 16,
    lineHeight: 24,
  },
  boldText: {
    fontWeight: '700',
  },
});
