// TransactionScreen.js
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  SafeAreaView,
  Image,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {scale, verticalScale, moderateScale} from 'react-native-size-matters';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import Header from '../../components/UI/Header';
import {STATUSBAR_HEIGHT} from '../../constants/Dimentions';
import Filter from '../../assets/images/Common/filter.svg';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import ArrowRight from '../../assets/images/Common/right_icon_voilate.svg';
import Reload from '../../assets/images/Common/reload.svg';
import {useDispatch, useSelector} from 'react-redux';
import {
  getTransactionFilterData,
  getTransactionList,
} from '../../redux/slices/donationSlice';
import {useToast} from 'react-native-toast-notifications';
import {useLoading} from '../../context/LoadingContext';
import moment from 'moment';
import TransactionFilter from '../filter/TransactionFilter';
import UnlockMoreFeaturesPopup from '../signup/UnlockMoreFeaturesPopup';
const {width, height} = Dimensions.get('window');

const TransactionHistory = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const toast = useToast();
  const {
    showLoader,
    hideLoader,
    startProcessing,
    stopProcessing,
    setConnectivity,
  } = useLoading();

  const [isdata, setData] = useState(null);
  const [isFdata, setFData] = useState(null);
  const [dateRange, setDateRange] = useState('All');
  const [donationCategory, setDonationCategory] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({});
  const [showUnlockMoreFeaturesPopup, setShowUnlockMoreFeaturesPopup] = useState(false);
    const guestInfo = useSelector(state => state.app.guestInfo);

  useEffect(() => {
    if (isFocused == true) {
      if(!guestInfo) {
        handleGetTransactionList();
      } else {
        setShowUnlockMoreFeaturesPopup(true)
      }
    }
  }, [isFocused]);

  const onCancle = () => {
    setShowUnlockMoreFeaturesPopup(false);
    navigation.goBack()
  };
  
  const handleApplyFilters = filters => {
      handleGetTransactionList(filters)
    setCurrentFilters(filters);
  
  
    
  };

  const handleGetTransactionList = (filters) => {
    const appealId = '';
    const orgId = 4;
    const filterItem = filters ? filters : currentFilters;
    showLoader(true);
    dispatch(getTransactionList({filterItem}))
      .unwrap()
      .then(async res => {
        if (res?.data?.status === 1) {
          hideLoader(true);
          setData(res?.data);
        } else {
          toast.show(res?.data?.message || 'data fetch failed', {
            type: 'danger',
            placement: 'bottom',
          });
        }
      })
      .catch(err => {
        toast.show(res?.data?.message || 'Some thing went wrong!', {
          type: 'danger',
          placement: 'bottom',
        });
        hideLoader(true);
      });
    showLoader(true);
    dispatch(getTransactionFilterData({}))
      .unwrap()
      .then(res => {
        if (res?.data?.status === 1) {
          hideLoader(true);
          setFData(res?.data?.result);
        } else {
          toast.show('Something went wrong!', {
            type: 'danger',
            placement: 'bottom',
          });
        }
      })
      .catch(err => {
        hideLoader(true);
        toast.show('Something went wrong!', {
          type: 'danger',
          placement: 'bottom',
        });
      });
  };

  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const renderTransaction = ({item}) => {
    const isRefund = item?.status == 'Refunded';
    
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('TransactionDetail', {
            transactionId: item.donationId,
            receiptLink: item?.receiptLink
          })
        }
        style={styles.transactionItem}>
        <View
          style={{
            flexDirection: 'row',
            // alignItems: 'center',
            paddingVertical: 20,

            paddingHorizontal: 18,
          }}>
          <View style={styles.iconContainer}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: isRefund
                    ? Colors.orangeChip
                    : Colors.voilateChip,
                },
              ]}>
              {/* <Icon
                name={isPending ? 'reload-outline' : 'arrow-up-right'}
                size={scale(16)}
                color={isPending ? Colors.orange : '#9775FA'}
              /> */}
              {isRefund ? <Reload /> : <ArrowRight />}
            </View>
          </View>
          <View style={styles.detailContainer}>
            <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
             {item.donationTo?.length > 15
    ? item.donationTo.substring(0, 15) + '...'
    : item.donationTo}
            </Text>
            <Text style={styles.date}>
              {moment(item?.donationTimeStamp, 'MM/DD/YYYY HH:mm:ss').format(
                'DD MMM YYYY',
              )}{' '}
              • {item?.status}
            </Text>
          </View>
          <Text
            style={[
              styles.amount,
              {color: isRefund ? Colors.orange : Colors.textColor},
            ]}>
            RM{item.amount}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };
  const onFilterPress = () => {};

  return (
    <View style={styles.safeArea}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <LinearGradient style={{}}  colors={[Colors.gradientColor1, Colors.gradientColor2]}>
        <SafeAreaView />
        <View style={{paddingTop: STATUSBAR_HEIGHT + verticalScale(10), paddingBottom:verticalScale(30)}}>
          <Header
            onBackPress={() => {
              navigation.goBack();
            }}
            headerTitle={'Transactions'}
            backgroundColor="transparent"
            iconColor={Colors.colorWhite}
            textColor={Colors.colorWhite}
            fontWeight="500"
            paddingHorizontal={30}
            // headerTextMargin={true}
            leftIcon={
              <TouchableOpacity onPress={() => setShowFilter(true)}>
                <Filter />
              </TouchableOpacity>
            }
          />

          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Gross Donation</Text>
            <Text style={styles.summaryAmount}>
              RM{parseFloat(isdata?.totalGross || 0).toFixed(2)}
            </Text>
            <View style={styles.subSummaryContainer}>
              <View style={styles.subSummary}>
                <Text style={styles.subLabel}>Net Donation</Text>
                <Text style={styles.subAmount}>
                  RM{parseFloat(isdata?.totalDonations || 0).toFixed(2)}
                </Text>
              </View>
              <View style={styles.line} />
              <View style={styles.subSummary2}>
                <Text style={styles.subLabel}>Refunded</Text>
                <Text style={styles.subAmount}>
                  RM{parseFloat(isdata?.totalRefunds || 0).toFixed(2)}
                </Text>
              </View>
            </View>
          </View>
        </View>
          </LinearGradient>
        <SafeAreaView style={{flex:1,   borderTopLeftRadius: scale(20),
            borderTopRightRadius: scale(20),  }} >
        <View
          style={{
            borderTopLeftRadius: scale(20),
            borderTopRightRadius: scale(20),
            // flex: 1,
            backgroundColor: Colors.colorWhite,
            marginTop:-30
          }}>
          {isdata?.transactions ? (
            <FlatList
              data={isdata?.transactions}
              keyExtractor={item => item.donationId}
              renderItem={renderTransaction}
              contentContainerStyle={styles.transactionList}
              ListEmptyComponent={ <Text style={styles.emptyList}>No transactions yet.</Text>}
            />
          ) : (
            <Text style={styles.emptyList}>No transactions yet.</Text>
          )}
        </View>
</SafeAreaView>
    
      <TransactionFilter
        visible={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={handleApplyFilters}
        initialFilters={currentFilters}
        data={isFdata}
      />
      {
        showUnlockMoreFeaturesPopup &&
         <UnlockMoreFeaturesPopup 
         modalVisible={showUnlockMoreFeaturesPopup}
         setModalVisible={setShowUnlockMoreFeaturesPopup}
         onCancle={onCancle}
         
         />
      }
    </View>
  );
};

export default TransactionHistory;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.colorWhite,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    color: Colors.colorWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  summary: {
    padding: 35,
    // borderWidth:1
  },
  summaryLabel: {
    color: "#FFFFFF99",
    fontSize: scale(14),
    fontWeight: '400',
    marginBottom:8
  },
  summaryAmount: {
    color: Colors.colorWhite,
    fontSize: scale(32),
    fontWeight: '700',
  },
  subSummaryContainer: {
    flexDirection: 'row',
    paddingTop: 36,
  },
  subSummary: {},
  subSummary2: {
    paddingLeft: 20,
  },
  line: {
    backgroundColor: '#FFFFFF33',
    width: scale(1),
    marginLeft: 62,
  },
  subLabel: {
    color: "#FFFFFF99",
    fontSize: scale(14),
    fontWeight: '400',
    marginBottom:8
  },
  subAmount: {
    color: Colors.colorWhite,
    fontSize: scale(20),
    fontWeight: '600',
  },
  transactionList: {
    // flex: 1,
    paddingVertical: 10,
    // marginBottom:80,
     paddingBottom:verticalScale(50),
      borderStartStartRadius: scale(20),
      borderStartEndRadius: scale(20),

  },
  transactionItem: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  iconContainer: {
    marginRight: scale(12),
  },
  iconCircle: {
    width: 41,
    height: 41,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  detailContainer: {
    flex: 1,
    paddingLeft: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textColor,
  },
  date: {
    fontSize: 12,
    color: Colors.inactive,
    fontWeight: '400',
    marginTop: verticalScale(2),
  },
  amount: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyList: {
    alignSelf: 'center',
    paddingVertical: verticalScale(24),
    fontSize: 14,
    fontWeight: '400',
    color: Colors.placeholder,
  },
});
