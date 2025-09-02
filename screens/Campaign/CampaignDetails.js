import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  BackHandler,
} from 'react-native';
import campain_banner from '../../assets/images/Donation/donation_campaign_banner.png';
import Header from '../../components/UI/Header';
import Clock_purple from '../../assets/images/Donation/clock_gray_donation.svg';
import Raised_chart from '../../assets/images/Donation/Raised_chart.svg';
import Target_right from '../../assets/images/Donation/Target_right.svg';
import {WelcomeButton} from '../../components/UI/Button';
import {scale, verticalScale} from 'react-native-size-matters';
import {useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {useLoading} from '../../context/LoadingContext';
import {getAppealDetails} from '../../redux/slices/donationSlice';
import moment, {isDate} from 'moment';
import res from '../../constants/res';
import Colors from '../../constants/Colors';
import RenderHTML from 'react-native-render-html';
import HeaderImageCarousel from '../common/HeaderImageCarousel';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function CampaignDetails(props) {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
      const insets = useSafeAreaInsets();
  const {
    showLoader,
    hideLoader,
    startProcessing,
    stopProcessing,
    setConnectivity,
  } = useLoading();
  const STATUSBAR_HEIGHT =
    Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const NAVIGATIONBAR_HEIGHT = Platform.OS === 'android' ? 48 : 0; // Estimated navigation bar height
  const [isdata, setData] = useState(null);
  const campaign = {
    title: 'Waqaf Johan Parade Brigade',
    categories: ['Humanity', 'Cause 2', 'Cause 3'],
    moreCategories: 2,
    raised: 'RM',
    target: 'RM',
    daysLeft: 10,
    progress: 60, // percentage of target reached
    description: [
      'Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.',
      'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
    ],
    
  };
useEffect(() => {
  const backAction = () => {
    props.navigation.goBack(); // Navigate back on hardware back press
    return true; // Prevent default behavior
  };

  const backHandler = BackHandler.addEventListener(
    'hardwareBackPress',
    backAction,
  );

  return () => backHandler.remove(); // Clean up on unmount
}, []);
const MAX_LENGTH = 50;
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
let result = '';
let usedNames = [];
let totalLength = 0;

for (let i = 0; i < isdata?.supportedCauses?.length; i++) {
  const name = isdata?.supportedCauses[i]?.name;
  const separator = usedNames?.length > 0 ? ' | ' : '';
  const additionLength = separator?.length + name?.length;

  if (totalLength + additionLength <= MAX_LENGTH) {
    usedNames?.push(name);
    totalLength += additionLength;
  } else {
    break;
  }
}

const remainingCount = isdata?.supportedCauses?.length - usedNames?.length;
const displayCategory = usedNames?.join(' | ') + (remainingCount > 0 ? ` +${remainingCount}` : '');

  const getDaysLeft = endDateString => {
    const today = moment().startOf('day');
    const endDate = moment(endDateString).startOf('day');

    const diffInDays = endDate.diff(today, 'days');
    if(diffInDays > 0) {
    return diffInDays;    
    } else {
    return 0;
    }
  };

  useEffect(() => {
    if (isFocused == true) {
      handleGetCampaignDetails();
    }
  }, [isFocused]);

  const handleGetCampaignDetails = () => {
    const appealId = props?.route?.params?.appealId;
    const orgId = props?.route?.params?.orgId;
    showLoader(true);
    dispatch(getAppealDetails({appealId, orgId}))
      .unwrap()
      .then(async res => {
        hideLoader(true);
        if (res?.data?.status === 1) {
          setData(res?.data?.data);

        } else {
          toast.show(res?.data?.message || 'data fetch failed', {
            type: 'danger',
            placement: 'bottom',
          });
        }
      })
      .catch(err => {
        toast.show(res?.data?.message || 'Something went wrong!', {
          type: 'danger',
          placement: 'bottom',
        });
        hideLoader(true);
      });
  };
  return (
    <View
      style={{
        flex: 1,
        // paddingTop: STATUSBAR_HEIGHT,
        marginBottom:Platform.OS==="android"?insets.bottom+20 :30,
        // marginBottom:50,
        backgroundColor: '#fff',
      }}>

            {/* Campaign Image */}
          {/* <View style={styles.imageContainer}> */}
          {/* <Image
            source={{uri:props?.route?.params?.item?.images[0]}}
            style={styles.campaignImageTop}
            resizeMode="cover"
          /> */}
          <HeaderImageCarousel
            data={(props?.route?.params?.item?.images || []).map(img => ({ image: img }))}
            height={styles.campaignImageTop.height}
            autoPlay={true}
            autoPlayInterval={3000}
            showPagination={ props?.route?.params?.item?.images.length > 1 ? true : false}
            imageKey="image"
            style={styles.campaignImageTop}
            paginationContainer={{bottom:94}}
          />
      
                          <Header
  // headerTitle={res.strings.campaignDetails}
  iconColor={Colors.colorWhite}
  onBackPress={() => props.navigation.goBack()}
  containerStyle={{
    position: 'absolute',
    // paddingTop:30,
    // paddingHorizontal:3,
    // top: STATUSBAR_HEIGHT,
    // left: 0,
    // right: 0,
    backgroundColor: 'transparent',
    marginVertical:46,
    zIndex: 10,
    // paddingHorizontal: 16,
    // backgroundColor:'yellow'
  }}
/>
   
 
  
        {/* </View> */}
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={"transparent"} />
        {/* <Header
          headerTitle={res.strings.campaignDetails}
          onBackPress={() => {
            props.navigation.goBack();
          }}
          
        /> */}


        {/* Campaign Info Card */}
        <View style={styles.card}>
          {/* Categories */}
          <View style={styles.categoriesContainer}>
            {/* {campaign.categories.map((category, index) => (
              <React.Fragment key={index}>
                <Text style={styles.category}>{category}</Text>
                {index < campaign.categories.length - 1 && (
                  <Text style={styles.divider}>|</Text>
                )}
              </React.Fragment>
            ))} */}
            <Text style={styles.category}>
              {displayCategory}
              {/* +{campaign.moreCategories} */}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{isdata?.appealName}</Text>

          {/* Fundraising Stats */}
          <View style={styles.statsContainer}>
            {/* Raised Amount */}
            <View style={styles.statItem}>
              <View style={styles.iconContainer}>
                <Raised_chart />
              </View>
              <View>
                <Text style={styles.statLabel}>{res.strings.raised}</Text>
                <Text style={styles.statValue}>
                  {campaign.raised + (Number(isdata?.appealAmountReceived) || 0).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* Target Amount */}
            <View style={styles.statItem}>
              <View
                style={[
                  styles.iconContainer,
                  {backgroundColor: '#FFF5F5', borderColor: '#FFD3D1'},
                ]}>
                <Target_right />
              </View>
              <View>
                <Text style={styles.statLabel}>{res.strings.target}</Text>
                <Text style={styles.statValue}>
                  {/* {campaign.target + isdata?.appealTargetAmount} */}
                  {campaign.target + (isdata?.appealTargetAmount > 0 ? isdata?.appealTargetAmount : 0)}
                </Text>
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <View
              style={[
                styles.progressBar,
                {
                  width: `${
                    (isdata?.appealAmountReceived /
                      isdata?.appealTargetAmount) *
                    100
                  }%`,
                },
              ]}
            />
          </View>

          {/* Time Left */}
          <View style={styles.timeContainer}>
            {/* <Clock size={20} color="#4F5CD1" /> */}
            <Clock_purple style={{ color: 'red' }}   />
            <Text style={styles.timeText}>
              <Text style={{fontWeight: '600'}}>
                {getDaysLeft(isdata?.endDate)}
              </Text>
              {' '}{res.strings.daysLeft}
            </Text>
          </View>
        </View>

        {/* About Campaign */}
        <ScrollView style={styles.aboutSection}>
          {/* <Text style={styles.aboutTitle}>{res.strings.aboutCampaign}</Text> */}
          <Text style={styles.aboutText}>
            <RenderHTML
                  contentWidth={"100%"}
                  source={{ html: isdata?.description?.trim()}}
                   tagsStyles={tagsStyles}
                   
                />
            {/* {isdata?.description?.replace(/<[^>]+>/g, '')?.trim()} */}
          </Text>
          {/* {campaign.description.map((paragraph, index) => (
            <Text key={index} style={styles.aboutText}>
              {paragraph}
            </Text>
          ))} */}
          <View style={{height:20}}></View>
        </ScrollView>

        {/* Donate Button */}
        <View style={styles.buttonContainer}>
       {isdata?.isEligibleForTaxBenefit == true &&   <Text style={styles.text}>{isdata?.taxDeductibleText}</Text>}
          <WelcomeButton
            tittle={res.strings.continueToDonate}
            style={{marginTop: scale(15)}}
            onPress={() => {
              props.navigation.navigate('Select_donation_Amount', {
                appealId: props?.route?.params?.appealId,
                orgId: props?.route?.params?.orgId,
                title: isdata?.appealName,
                donationType: props?.route?.params?.donationType,
                item: props?.route?.params?.item,
                ...props?.route?.params
              });
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  campaignImage: {
    width: '100%',
    height: '100%',
    borderBottomRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  campaignImageTop: {
spectRatio: 768 / 1671,
  width: '100%',
  height: 345, // or 200+ depending on your visual layout
  borderBottomRightRadius: 20,
  borderBottomLeftRadius: 20,
  // backgroundColor:"red"
},
  card: {
    marginHorizontal: 16,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: -80,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 8,
  },
  category: {
    fontSize: 13,
    color: '#686E7A',
    fontWeight: '400',
    lineHeight:scale(13)
  },
  divider: {
    marginHorizontal: 6,
    color: '#ccc',
  },
  moreCategories: {
    fontSize: 13,
    color: '#686E7A',
    fontWeight: '400',
    marginLeft: 6,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#181B1F',
    lineHeight:scale(28),
    marginBottom: verticalScale(13),
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    // width: 40,
    // height: 40,
    padding: 5,
    borderRadius: 20,
    backgroundColor: '#F0FEFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#C2FCFF',
    marginTop:verticalScale(4)
  },
  chartIcon: {
    width: 20,
    height: 20,
    backgroundColor: '#7BDCD2',
    borderRadius: 4,
  },
  targetIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFADAD',
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '400',
    color: '#88909E',
    lineHeight:verticalScale(28)
  },
  statValue: {
    fontSize: 20,
    fontWeight: '500',
    color: '#181B1F',
  },
  progressContainer: {
    height: 5,
    backgroundColor: '#DDE2EB',
    borderRadius: 4,
    marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3BC47D',
    borderRadius: 4,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  timeText: {
    marginLeft: scale(5),
    fontSize: 15,
    fontWeight: '400',
    color: '#181B1F',
  },
  aboutSection: {
    // maxHeight:500,
    // padding: 20,
    paddingHorizontal:20,
    // marginbottom:5,
    paddingTop:20,
    flex: 1,
   
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#181B1F',
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#181B1F',
    // lineHeight: 24,
    // marginBottom: 16,
  },
  buttonContainer: {
    // padding: 16,
    borderTopWidth: 1,
    borderColor: '#DDE2EB',
  },
  donateButton: {
    backgroundColor: '#4F5CD1',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  donateButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  text:{paddingTop:15,alignSelf:'center',textAlign:'center',fontSize:scale(14),lineHeight:18,fontWeight:"400"}
});
