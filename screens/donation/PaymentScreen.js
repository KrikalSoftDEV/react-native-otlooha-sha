import React, { useState, useEffect } from 'react';
import {
  View,
  Alert,
  SafeAreaView,
  StyleSheet,
  StatusBar,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
  Platform,
  Keyboard,
  BackHandler,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import { getData } from '../../constants/Storage';
import Colors from '../../constants/Colors';
import ApplePay from '../../assets/images/Common/applepayicon.svg';
import GooglePay from '../../assets/images/Common/googlepay.png';
import DuitNow from '../../assets/images/Common/duitNow.png';
import { Text } from 'react-native-gesture-handler';
import { WelcomeButton } from '../../components/UI/Button';
import Header from '../../components/UI/Header';
import {
  NAVIGATIONBAR_HEIGHT,
  STATUSBAR_HEIGHT,
} from '../../constants/Dimentions';
import { scale, verticalScale } from 'react-native-size-matters';
import AsyncStorage from '@react-native-async-storage/async-storage';
import res from '../../constants/res';
import { BASE_URL, ENDPOINTS } from '../../constants/ApiConfig';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaymentScreen(props) {
    const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const theme = useColorScheme();
  const darkMode = theme === 'light' ? false : true;
  const [cardDetails, setCardDetails] = useState();
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [timer, setTimer] = useState(0);
  const navigation = useNavigation();
  const donationOptions = props.route?.params?.donationOptions;
  const [invalidCardDetailsError, setInvalidCardDetailsError] = useState('');
  const { createPaymentMethod } = useStripe();

  useEffect(() => {
    const fetchInitiatePayment = async () => {
      try {
        const userDetail = await getData('userDetail');
        const asyncTransactionNumber = await AsyncStorage.getItem(
          'transactionNumber',
        );
        const transactionNumberFromAsync = (await JSON.parse(
          asyncTransactionNumber,
        ))
          ? JSON.parse(asyncTransactionNumber)
          : '';

        const bodyData = {
          orgId: 4,
          amount: donationOptions?.amount,
          currency: 'MYR',
          appealId: 0,
          siteId: 0,
          fees: calculateTransactionFee().toString(),
          totalAmount: (
            Number(donationOptions?.amount) + Number(calculateTransactionFee())
          )?.toString(),
          donationType: donationOptions?.donationType.toString(), // Campaign = 1, Mosque  = 1, Wqqaf = 9, Inkaf  = 10
          timeZone: 'Malaysia Standard Time',
          transactionNumber: transactionNumberFromAsync,
        };

        if (donationOptions?.type == 1) {
          bodyData.appealId = donationOptions.appealId;
          bodyData.siteId = 0;
        }
        if (donationOptions?.type == 2) {
          bodyData.siteId = donationOptions.siteId;
          bodyData.appealId = 0;
        }
        const initiateResponse = await fetch(
          `${BASE_URL}${ENDPOINTS.INITIATE_PAYMENT}`,
          {
            method: 'POST',
            headers: {
              Authorization: `${userDetail?.token}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(bodyData),
          },
        );

        const initiateResult = await initiateResponse.json();
        const transactionNumber =
          initiateResult.data.paymentResponse.transactionNumber;

        if (transactionNumber) {
          await AsyncStorage.setItem(
            'transactionNumber',
            JSON.stringify(transactionNumber),
          );
        }
      } catch (e) {
        // console.log("JSON Parse error:", e.message)
        // Alert.alert('Error', e.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };
    if (donationOptions?.amount && isFocused) {
      fetchInitiatePayment();
    }
  }, [donationOptions, isFocused]);

  useEffect(() => {
    if (cardDetails) {
      if (
        cardDetails?.validNumber === 'Invalid' ||
        cardDetails?.validExpiryDate === 'Invalid' ||
        cardDetails?.validCVC === 'Invalid') {
        setInvalidCardDetailsError('Please enter valid card details')
        setIsDisabled(true)
      } else if (
        cardDetails?.validCVC === 'Incomplete' ||
        cardDetails?.validNumber === 'Incomplete' ||
        cardDetails?.validExpiryDate === 'Incomplete'
      ) {
        setInvalidCardDetailsError('')
        setIsDisabled(true);
      } else if (
        cardDetails?.validCVC === 'Valid' &&
        cardDetails?.validNumber === 'Valid' &&
        cardDetails?.validExpiryDate === 'Valid'
      ) {
        setInvalidCardDetailsError('')
        setIsDisabled(false);
      }
    } else {
      setInvalidCardDetailsError('')
      setIsDisabled(true)
    }
  }, [cardDetails]);

  useEffect(() => {
    calculateTransactionFee();
    const onBackPress = () => {
      if (loading) {
        return true; // Disable back button
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    let interval = null;
    if (loading) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      setTimer(0);
    }

    return () => {
      backHandler.remove();
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [loading]);

  const calculateTransactionFee = () => {
    const amount = donationOptions?.amount;
    const percentage =
      props.route.params.donationOptions.fullData.feesDetails
        ?.percentageDeduction;
    const fixedFee_1 = `0.${props.route.params.donationOptions.fullData.feesDetails?.extraCentCharges}`;
    const fixedFee = Number(fixedFee_1);
    const rawFee = amount * (percentage / 100) + fixedFee;
    const transactionFee = Math.round((rawFee + Number.EPSILON) * 100) / 100;
    return transactionFee;
  };

  const handleCreatePaymentMethod = async () => {
    setLoading(true);
    try {
      const userDetail = await getData('userDetail');
      const userId = await userDetail?.userId;

      const { paymentMethod, error } = await createPaymentMethod({
        paymentMethodType: 'Card',
        card: cardDetails,
      });

      if (error && !cardDetails) {
        // console.log(cardDetails,paymentMethod,error)
        Alert.alert('Payment Error', error.message);
        return;
      }
      const asyncTransactionNumber = await AsyncStorage.getItem(
        'transactionNumber',
      );
      const transactionNumber = JSON.parse(asyncTransactionNumber);
      const donationInitiatedTimeStamp = Math.floor(Date.now() / 1000);
      // console.log("URL :",`${BASE_URL}${ENDPOINTS.MAKE_PAYMENT}`)
      // console.log("TOKEN: ",`${userDetail?.token}`)
      const makePaymentResponse = await fetch(
        `${BASE_URL}${ENDPOINTS.MAKE_PAYMENT}`,
        {
          method: 'POST',
          headers: {
            Authorization: `${userDetail?.token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            transactionNumber,
            orgId: 4,
            paymentType:
              selectedPaymentMethod === 'apple_pay'
                ? 3
                : selectedPaymentMethod === 'google_pay'
                  ? 2
                  : 1,
            recurringType: donationOptions?.period, //monthly
            donationInitiatedTimeStamp,
            paymentPartnerId: 1,
            cardBrand: paymentMethod.Card?.brand || 'visa',
            pmId: paymentMethod.id,
            userId,
          }),
        },
      );
      //  console.log('Payment response status makePaymentResponse:', makePaymentResponse);
      const makePaymentResult = await makePaymentResponse.json();
      // console.log('Payment response status:', makePaymentResult);
      if (makePaymentResponse?.ok && makePaymentResult?.data?.status === 1) {
        await AsyncStorage.removeItem('transactionNumber');
        navigation.navigate('Otp_success', {
          type: 'paymentSuccess',
          txnNo: makePaymentResult?.data?.txnNo,
          amount: (Number(donationOptions?.amount) + calculateTransactionFee()).toFixed(2),
          donationTo:
            donationOptions?.fullData?.name || 'Waqaf Johan Parade Brigade',
        });
      } else {
        navigation.navigate('Otp_success', {
          type: 'paymentFailed',
          errroMsg: makePaymentResult?.data?.message?.errorMessage

        });

        // Alert.alert(
        //   'Payment Failed',
        //   makePaymentResult?.data?.message?.errorMessage || 'Unknown error',
        // );
      }
    } catch (e) {
      // console.error("Payment catch error",e);
      // Alert.alert('Error', e?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={[styles.containerStyle,  ]}>
        <View style={styles.loaderWrapper}>
          <View style={styles.loaderBackground}>
            <ActivityIndicator size="large" color="#3937A4" />
          </View>

        </View>
        <View style={ {marginBottom:insets.bottom > 0 ?NAVIGATIONBAR_HEIGHT: scale(8),alignSelf:'center'}}>
        <Text style={{ fontWeight: "600", fontSize: 20, alignSelf:"center"}}>{res.strings.paymentProcess} </Text>
        <Text numberOfLines={2} style={styles.text}>
          {res.strings.doNotButton}
          {/* {res.strings.paymentProcess} {timer}s */}
        </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, paddingTop: STATUSBAR_HEIGHT, backgroundColor: Colors.colorWhite }}>
      <Header
        headerTitle={res.strings.payment}
        onBackPress={() => navigation.goBack()}
      />
      <View
        style={{
          marginBottom: Platform.OS === 'android' ? 160 : verticalScale(130),
        }}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={Colors.colorWhite}
        />

        <ScrollView contentContainerStyle={{}} showsVerticalScrollIndicator={false}>
          {/* --- Organization Dropdown --- */}
          <View
            style={styles.organizationContainer}
            onPress={() => setIsExpanded(!isExpanded)}>
            <View style={styles.organizationHeader}>
              <View style={styles.organizationInfo}>
                <Image
                  source={
                    donationOptions?.item?.imageURL
                      ? { uri: donationOptions?.item?.imageURL }
                      : require('../../assets/images/Common/waqafbrigade.png')
                  }
                  style={styles.organizationImage}
                />
                <View style={styles.organizationTextContainer}>
                  <Text style={styles.organizationName}>
                    {donationOptions?.fullData?.name ||
                      'Waqaf Johan Parade Brigade'}
                  </Text>
                </View>
              </View>
            </View>
            <View style={styles.donationSummary}>
              <View
                style={{
                  height: 1.5,
                  width: '92%',
                  backgroundColor: '#DDE2EB',
                  alignSelf: 'center',
                }}></View>
              <View style={{ paddingTop: 25, paddingHorizontal: 25 }}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {res.strings.donationAmount}
                  </Text>
                  <Text style={styles.summaryValue}>
                    RM{Number(donationOptions?.amount)?.toFixed(2)}
                  </Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>
                    {res.strings.transactionFee}
                  </Text>
                  <Text style={styles.summaryValue}>
                    RM{calculateTransactionFee()}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.summaryRow,
                  styles.totalRow,
                  { marginHorizontal: 10, paddingHorizontal: 15 },
                ]}>
                <Text
                  style={[
                    styles.totalLabel,
                    { alignSelf: 'center' },
                    darkMode && { color: '#666' },
                  ]}>
                  {res.strings.totalDonation}
                </Text>
                <Text style={styles.totalValue}>
                  RM
                  {(
                    Number(donationOptions?.amount) +
                    calculateTransactionFee()
                  ).toFixed(2)}
                </Text>
              </View>
            </View>
            {/* )}  */}
          </View>

          {/* --- Card Payment --- */}
          <View style={styles.sectionContainer}>
            <Text style={[styles.sectionTitle, { marginBottom: 5 }]}>{res.strings.creditCard}</Text>
            <CardField

              postalCodeEnabled={false}
              placeholder={{ number: '4242 4242 4242 4242' }}
              placeholderColor={darkMode ? '#000000' : '#ffffff'}
              cardStyle={
                darkMode
                  ? { backgroundColor: '#000000', textColor: '#ffffff' }
                  : { backgroundColor: '#ffffff', textColor: '#000000' }
              }
              style={[{ height: 50, marginVertical: 5 }]}
              onCardChange={cardDetails => {
                setCardDetails(cardDetails);
                if (
                  cardDetails?.validCVC === 'Valid' &&
                  cardDetails?.validNumber === 'Valid' &&
                  cardDetails?.validExpiryDate === 'Valid'
                ) {
                  Keyboard.dismiss();
                }
              }}

            />
            {invalidCardDetailsError && <Text style={styles.errorText}>{invalidCardDetailsError}</Text>}

          </View>

          {/* --- Other Payment Methods --- */}
          <View style={[styles.sectionContainer]}>
            <Text style={styles.sectionTitle}>
              {res.strings.paymentMethods}
            </Text>
            <View style={styles.paymentMethodsContainer}>
              <View style={styles.paymentMethodsRow}>
                {[
                  {
                    id: 'apple_pay',
                    icon: <ApplePay width={scale(33)} height={verticalScale(14)} />,
                    label: 'Apple Pay',
                    onPress: () => setSelectedPaymentMethod('apple_pay'),
                  },
                  {
                    id: 'card',
                    icon: (
                      <Image
                        source={{
                          uri: 'https://pngimg.com/uploads/visa/visa_PNG6.png',
                        }}
                        style={{ width: 39, height: 31 }}
                      />
                    ),
                    label: 'Card',
                    onPress: () => setSelectedPaymentMethod('card'),
                  },
                  {
                    id: 'google_pay',
                    icon: (
                      <Image
                        source={GooglePay}
                        resizeMode='contain'
                      />
                    ),
                    label: 'Google Pay',
                    onPress: () => setSelectedPaymentMethod('google_pay'),
                  },
                  {
                    id: 'duit_now',
                    icon: (
                      <Image
                        source={DuitNow}
                      />
                    ),
                    label: 'Duit Now',
                  }
                ].map(method => {
                  if (Platform.OS === 'android' && method.id === 'apple_pay') {
                    return null;
                  }

                  return (
                    <View key={method.id}>
                      <TouchableOpacity
                        style={[
                          styles.paymentMethod,
                          selectedPaymentMethod === method.id &&
                          styles.paymentMethodSelected,
                        ]}
                        onPress={method.onPress}>
                        <View style={styles.paymentMethodContent}>
                          <View
                            style={{
                              paddingHorizontal: 16,
                              // paddingVertical: 4,
                              borderWidth: 1,
                              borderColor: '#DDE2EB',
                              borderRadius: scale(4),
                              height: verticalScale(30),
                              width: scale(50),
                              justifyContent: 'center',
                              alignItems: 'center'
                            }}>
                            {method.icon}
                          </View>
                          <Text style={styles.paymentMethodText}>
                            {method.label}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.radioButton,
                            selectedPaymentMethod === method.id &&
                            styles.radioButtonSelected,
                          ]}
                        />
                      </TouchableOpacity>
                      <View
                        style={{
                          height: 1,
                          width: '90%',
                          backgroundColor: '#DDE2EB',
                          alignSelf: 'center',
                        }}
                      />
                    </View>
                  );
                })}

              </View>
            </View>
          </View>
        </ScrollView>
      </View>
      <View
        style={{
          paddingVertical: verticalScale(10),
          bottom: verticalScale(130),
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: Colors.colorWhite,
          borderTopWidth: 1,
          borderColor: '#DDE2EB',
        }}>
        <WelcomeButton
          disabled={isDisabled}
          tittle={`${res.strings.donate} RM${(
            Number(donationOptions?.amount) + calculateTransactionFee()
          )?.toFixed(2) || ''
            } ${res.strings.now}`}
          onPress={handleCreatePaymentMethod}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.colorWhite,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  scrollView: {
    flex: 1,
  },
  containerStyle: {
   
    flex: 1,
    backgroundColor: '#F4F5FA',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loaderWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loaderBackground: {
    backgroundColor: '#E6E4FF',
    padding: 30,
    borderRadius: 100,
    elevation: 6,
    shadowColor: '#3937A4',
    shadowOpacity: 0.2,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  text: {
  maxWidth:"80%",
    marginTop: 10,
    fontSize: 16,
    color: '#686E7A',
    fontWeight: '400',
    textAlign: 'center',
  },
  organizationContainer: {
    margin: 15,
    borderWidth: 1,
    borderColor: '#DDE2EB',
    borderRadius: 10,
    paddingBottom: 10,
    overflow: 'hidden',
  },
  organizationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  organizationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  organizationImage: {
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#E5E7EB',
  },
  organizationTextContainer: {
    marginLeft: 10,
  },
  organizationName: {
    fontSize: 18,
    fontWeight: '600',
    width: 184,
    height: 48,
    color: '#000',
  },
  dropdownIcon: {
    padding: 5,
  },
  donationSummary: {
    // padding: 15,
    // backgroundColor: '#F0F8FF',
    // borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    lineHeight: 26,
    color: '#666',
    fontWeight: 400,
  },
  summaryValue: {
    fontSize: 14,
    lineHeight: 26,
    color: '#000',
    fontWeight: 500,
  },
  totalRow: {
    // marginTop: 5,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#F6F5FF',
    borderRadius: 6,
  },
  totalLabel: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '400',
    color: '#181B1F',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181B1F',
  },
  sectionContainer: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#181B1F',
    marginBottom: 10,
    flexDirection: 'column',
    //backgroundColor:'red'
  },
  cardFieldContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  cardField: {
    width: '100%',
    height: 50,
    marginBottom: 10,
  },
  paymentMethodSelected: {
    backgroundColor: '#F6F5FF',
    borderColor: '#3937A4',
  },
  cardIcons: {
    flexDirection: 'row',
  },
  cardIcon: {
    width: 27,
    height: 27,
    marginLeft: 5,
    resizeMode: 'contain',
  },
  paymentMethodsContainer: {
    marginBottom: 15,
    width: '100%',
  },
  paymentMethodsRow: {
    flexDirection: 'column',
    borderWidth: 1,
    borderColor: '#DDE2EB',
    borderRadius: 12,
    overflow: 'hidden',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    // borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodText: {
    fontSize: 16,
    color: '#181B1F',
    fontWeight: '400',
    marginLeft: 12,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  radioButtonSelected: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 6,
    borderColor: '#0066CC',
  },
  paymentMethodIcon: {
    width: 40,
    height: 20,
    resizeMode: 'contain',
  },
  buttonContainer: {
    padding: 15,
    backgroundColor: Colors.colorWhite,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  gradient: {
    borderRadius: 12,
    marginHorizontal: 15,
    marginTop: 20,
    position: 'absolute',
    bottom: 50,
  },
  donateButton: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  donateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.colorWhite,
  },
  errorText: {
    color: 'red',
    fontSize: scale(12),
    marginLeft: scale(10),
  },
});
