import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Linking,
  Alert,
  StatusBar,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Colors from '../../constants/Colors';
import Fonts from '../../constants/Fonts';
import LinearGradient from 'react-native-linear-gradient';
import moment from 'moment';
import {getData} from '../../constants/Storage';
import {scale, verticalScale} from 'react-native-size-matters';
import {SafeAreaView} from 'react-native-safe-area-context';
import backArrow from '../../assets/images/Common/backArrow.png';
import {STATUSBAR_HEIGHT} from '../../constants/Dimentions';
import Header from '../../components/UI/Header';
import ArrowRight from '../../assets/images/Common/right_icon_voilate.svg';
import GreenTick from '../../assets/images/Common/green_tick.svg';
import {WelcomeButton} from '../../components/UI/Button';
import { BASE_URL, ENDPOINTS } from '../../constants/ApiConfig';
import Default from '../../assets/images/Transaction/Default.png';

import AmericanExpress from '../../assets/images/Transaction/AmericanExpress.png';
import DinersClub from '../../assets/images/Transaction/DinersClub.png';
import JCB from '../../assets/images/Transaction/JCB.png';
import MasterCard from '../../assets/images/Transaction/MasterCard.png';
import UnionPay from '../../assets/images/Transaction/UnionPay.png';
import Visa from '../../assets/images/Transaction/Visa.png';

import googlepay from '../../assets/images/Transaction/googlepay.png';
import applepay from '../../assets/images/Transaction/applepay.png';
import grabpay from '../../assets/images/Transaction/grabpay.png';
import paynowPNG from '../../assets/images/Transaction/paynowPNG.png';
import eNets from '../../assets/images/Transaction/eNets.png';

const TransactionDetail = ({route}) => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const {transactionId} = route.params;
  const {receiptLink} = route.params;
  const [transactionDetails, setTransactionDetails] = useState(null);

  function isValidField(value) {
    if (value === '-' || value === "" || value === null || value === 'null' || value === 'NA' || value === " " || value === undefined || value === "NULL" || (Array.isArray(value) && value?.length === 0) || value === false || value === "None"
    ) {
        return false
    } else {
        return true
    }
}
 const PAYMENT_OPTIONS = {
  cardImages: {
    googlepay,
    applepay,
    // alipay,
    grabpay,
    // googlepayPNG,
    // applepayPNG,
    // alipayPNG,
    // grabpayPNG,
    // cashPNG,
    // chequePNG,
    paynowPNG,
    eNets,
    Default,
  },
};
 const CREDIT_CARD = {
  monthOptions: [
    { value: "01", label: "1" },
    { value: "02", label: "2" },
    { value: "03", label: "3" },
    { value: "04", label: "4" },
    { value: "05", label: "5" },
    { value: "06", label: "6" },
    { value: "07", label: "7" },
    { value: "08", label: "8" },
    { value: "09", label: "9" },
    { value: "10", label: "10" },
    { value: "11", label: "11" },
    { value: "12", label: "12" },
  ],
  Img: {
    AmericanExpress,
    Default,
    DinersClub,
    JCB,
    MasterCard,
    UnionPay,
    Visa,
  },
};
function getPaymentTypeIcon(paymentMethod, paymentType, cardLastDigit = "") {
    var paymentIcon = CREDIT_CARD.Img.Default;
    if (paymentType?.toLowerCase()?.includes('card') && isValidField(cardLastDigit)) {
        if (paymentMethod === 'visa') {
            paymentIcon = CREDIT_CARD.Img.Visa;
        } else if (paymentMethod === 'mastercard') {
            paymentIcon = CREDIT_CARD.Img.MasterCard;;
        } else if (paymentMethod === 'americanexpress' || paymentMethod === 'amex') {
            paymentIcon = CREDIT_CARD.Img.AmericanExpress;
        } else if (paymentMethod === 'jcb') {
            paymentIcon = CREDIT_CARD.Img.JCB;
        } else if (paymentMethod === 'dinersclub') {
            paymentIcon = CREDIT_CARD.Img.DinersClub;
        } else if (paymentMethod === 'unionpay') {
            paymentIcon = CREDIT_CARD.Img.UnionPay;
        } else {
            paymentIcon = CREDIT_CARD.Img.Default;
        }
        return paymentIcon;
    } else if (paymentType?.replace(/\s/g, '') === 'GooglePay') {
        return PAYMENT_OPTIONS.cardImages.googlepay;
    } else if (paymentType?.replace(/\s/g, '') === 'ApplePay') {
        return PAYMENT_OPTIONS.cardImages.applepay;
    } else if (paymentType?.replace(/\s/g, '') === 'GrabPay') {
        return PAYMENT_OPTIONS.cardImages.grabpay;
    } else if (paymentType?.replace(/\s/g, '') === 'PayNow') {
        return PAYMENT_OPTIONS.cardImages.paynowPNG;
    } else if (paymentType === 'ENets') {
        return PAYMENT_OPTIONS.cardImages.eNets;
    }
    else {
        return null
    }
}

  useEffect(() => {
    if (isFocused) {
      const getTransactionDetails = async () => {
        const userDetail = await getData('userDetail');
        try {
          const fetchDetails = await fetch(
                  `${BASE_URL}${ENDPOINTS.DONATION_BY_TRANSACTION_ID}?transactionId=${transactionId}`,
            
            {
              method: 'GET',
              headers: {
                Authorization: `${userDetail?.token}`,
                'Content-Type': 'application/json',
              },
            },
          );
          const response = await fetchDetails.json();
          setTransactionDetails(response?.data?.result);
        } catch (error) {
          console.log('error:', error);
        }
      };
      getTransactionDetails();
    }
  }, [isFocused, transactionId]);
 
  const normalizeUrl = (url) => {
  if (typeof url !== 'string') return '';

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    return 'https://' + url;
  }
  return url;
};
 const receiptLink_1 = normalizeUrl(receiptLink)
console.log('-=-=-=-=--=-transactionDetails?.paymentMethod', transactionDetails?.paymentType );

  return (
    <View style={{flex: 1,}}>
      <SafeAreaView style={styles.container}>
        <StatusBar  barStyle={'dark-content'}  />
        {/* Header with back button */}
        <View style={{flex: 1,paddingTop:14}}>
          <Header
            onBackPress={() => {
              navigation.goBack();
            }}
          />

          <View style={styles.iconContainer}>
            <View
              style={[
                styles.iconCircle,
                {
                  backgroundColor: Colors.voilateChip,
                },
              ]}>
              {/* <Icon
                        name={isPending ? 'reload-outline' : 'arrow-up-right'}
                        size={scale(16)}
                        color={isPending ? Colors.orange : '#9775FA'}
                      /> */}
              {<ArrowRight />}
            </View>
          </View>
          {/* Organization Avatar */}
          <View style={styles.avatarContainer}>
            {/* <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {transactionDetails?.donarName?.charAt(0)}
            </Text>
          </View> */}
          </View>
          <Text style={styles.donation}>Donation To</Text>

          {/* Organization Name */}
          <Text style={styles.organizationName}>
            {transactionDetails?.donationTo}
          </Text>

          {/* Amount and Status */}
          <Text style={styles.amount}>RM{transactionDetails?.amount}</Text>
          <View style={styles.statusContainer}>
            <GreenTick />
            <Text style={styles.statusText}>{transactionDetails?.status}</Text>
          </View>
          {/* <View style={styles.divider} /> */}
          <Text style={styles.dateTime}>
            {moment(
              transactionDetails?.donationTimeStamp,
              'MM/DD/YYYY HH:mm:ss ',
            ).format('DD MMM YYYY | h:mm a')}
          </Text>

          {/* Transaction Details */}
          <ScrollView style={styles.detailsContainer}>
            <DetailRow
              label="Receipt Id "
              value={transactionDetails?.receiptNo}
            />
            <View style={styles.divider} />
            
             {transactionDetails?.companyName && <DetailRow label="Company Name" value={transactionDetails?.companyName} />}
           {transactionDetails?.companyName &&  <View style={styles.divider} />}
            <DetailRow label={transactionDetails?.companyName ? "Representative name" : "Name"} value={transactionDetails?.donarName} />
            <View style={styles.divider} />
            <DetailRow
              label="Mobile Number"
              value={transactionDetails?.donorMobile}
            />
            <View style={styles.divider} />
            <DetailRow
              label="Email Address"
              value={transactionDetails?.donarEmail}
            />
            <View style={styles.divider} />
            <DetailRow
              label="Payment Method"
              value={transactionDetails?.paymentType?.toLowerCase()?.includes('card') ?  transactionDetails?.cardLastDigit : ''}
              leftIcon={getPaymentTypeIcon(transactionDetails?.cardType, transactionDetails?.paymentType, transactionDetails?.cardLastDigit)}
              leftIconSize={transactionDetails?.paymentType?.toLowerCase()?.includes('card') ? false : true}
            />
            <View style={styles.divider} />
            <DetailRow
              label="Donation Frequency"
              value={transactionDetails?.type}
            />
            <View style={styles.divider} />
            <DetailRow
              label="Amount "
              value={"RM"+transactionDetails?.donationAmount}
            />
            <View style={styles.divider} />
            <DetailRow
              label="Transaction Fee"
              value={"RM"+transactionDetails?.transactionFee}
            />
            <View style={styles.divider} />
            <DetailRow
              label="Tax Relief"
              value={transactionDetails?.isIRASInclusion  == 1 ? "Yes" : "No"}
            />
             <View style={styles.divider} />
            <DetailRow
              label="Transaction Id"
              value={transactionDetails?.transactionNo}
            />
            <View style={{height:Platform.OS==="android"?30:12}}></View>
          </ScrollView>
        </View>
        {/* Download Receipt Button */}

      <View style={styles.buttonDownload}>
        <WelcomeButton
          tittle={'View Receipt'}
          style={{marginTop: 24}}
          
         onPress={() =>{ Linking.openURL(receiptLink_1)}}

        />
      </View>
      </SafeAreaView>

    </View>
  );
};

const DetailRow = ({label, value, leftIcon, leftIconSize}) => {
  console.log('-=-=--=-=-leftIconSize', leftIconSize);
  
  return(
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <View style={styles.valueContainer}>
      {leftIcon && <Image source={leftIcon} style={[styles.paymentIcon, leftIconSize && {height:30, width:48}]} />}
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorWhite,

  },
  header: {
    // height: 60,
    // paddingHorizontal: 16,
    // justifyContent: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: scale(4),
    marginTop: verticalScale(10),
  },
  // backButton: {
  //   // marginTop:20,
  //   width: 40,
  //   height: 40,
  //   justifyContent: 'center',
  // },
  backButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    width: scale(20),
    height: scale(20),
    resizeMode: 'contain',
  },
  avatarContainer: {
    alignItems: 'center',
    // marginTop: 20,
  },
  avatar: {
    width: 70,
    height: 70,

    borderRadius: 50,
    backgroundColor: '#91ECF1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 500,
    color: '#292D33',
    fontFamily: Fonts.medium,
  },
  organizationName: {
    textAlign: 'center',
    fontSize: 16,
    color: '#181B1F',
    paddingTop: 8,
    fontWeight: '500',
    // fontFamily: Fonts.regular,
  },
  amount: {
    textAlign: 'center',
    fontSize: 38,
    color: Colors.textPrimary,
    paddingTop: 24,
    fontFamily: Fonts.semiBold,
    fontWeight: '700',
  },
  headerTitle: {
    fontSize: scale(16),
    alignSelf: 'center',
    fontWeight: '500',
    color: '#000000',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  statusText: {
    color: Colors.textColor,
    fontSize: 16,
    fontWeight: '400',
    fontFamily: Fonts.regular,
    paddingHorizontal: 6,
  },
  buttonDownload: {
    alignItems: 'center',
    marginBottom: Platform.OS == 'ios' ? 0 : 20,
    backgroundColor: Colors.colorWhite,
    borderTopWidth: 1,
    borderTopColor: Colors.grey,
  },
  dateTime: {
    textAlign: 'center',
    color: '#686E7A',
    fontSize: 14,
    fontWeight: '400',
    paddingTop: 28,
    fontFamily: Fonts.regular,
  },
  detailsContainer: {
    flex:1,
    marginTop: 30,
    // height:1000,
    paddingHorizontal: 24,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#DDE2EB',
    borderRadius: 14,
    // width: '370px',
    // height: '309px',
    // left: '16px',
    // paddingHorizontal: 20,
    marginHorizontal: 20,
    paddingTop:14,
    marginBottom:10,
    // paddingVertical: 30,
  },
  detailRow: {
    // marginBottom: 3,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.inactive,
    fontWeight: '400',
    // marginBottom: 4,
    fontFamily: Fonts.regular,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 12,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181B1F',
    fontFamily: Fonts.regular,
  },
  paymentIcon: {
    width: 32,
    height: 20,
    marginRight: 8,
    resizeMode:"contain"
  },
  downloadButton: {
    backgroundColor: '#191967',
    marginHorizontal: 20,
    height: 48,
    borderRadius: 14,
    // justifyContent: 'center',
    // alignItems: 'center',
    // position: 'absolute',
    // bottom: -60,
    // left: 0,
    // right: 0,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: Fonts.medium,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#DDE2EB', // or any light gray you prefer
    marginVertical: 12,
  },
  iconContainer: {
    alignSelf: 'center',
    // marginRight: scale(12),
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
  },
  donation: {
    alignSelf: 'center',
    paddingTop: 22,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.inactive,
  },
});

export default TransactionDetail;
