import React, {useState, useLayoutEffect, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  FlatList,
  TextInput,
  Keyboard,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useNavigation} from '@react-navigation/native';
import Colors from '../../constants/Colors';
import {useDispatch} from 'react-redux';
import {useLoading} from '../../context/LoadingContext';
import {getdonationWidget} from '../../redux/slices/donationSlice';
import res from '../../constants/res';
import {useRoute} from '@react-navigation/native';
import Header from '../../components/UI/Header';
import {scale, verticalScale} from 'react-native-size-matters';
import {
  NAVIGATIONBAR_HEIGHT,
  STATUSBAR_HEIGHT,
} from '../../constants/Dimentions';
import {WelcomeButton} from '../../components/UI/Button';
import Toast from '../../components/UI/Toast';

const {width} = Dimensions.get('window');
const ITEM_WIDTH = width / 3; // Show exactly 3 items
const DonationScreen = props => {
  const route = useRoute();
  const appealId = route?.params?.appealId;
  const orgId = route?.params?.orgId;
  const siteId = route?.params?.siteId;
  const donationType = route?.params?.donationType;
  const navigation = useNavigation();
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const {
    showLoader,
    hideLoader,
    startProcessing,
    stopProcessing,
    setConnectivity,
  } = useLoading();
  const [toastVisble, setToastVisble] = useState(false);
  const [selectedPeriodId, setSelectedPeriodId] = useState(4);
  const [amount, setAmount] = useState('');
  const [isCustom, setCustom] = useState(true);
  const [selectedPreset, setSelectedPreset] = useState("");
  const [isdata, setData] = useState(null);
  const [toastParams, setToastParams] = useState({
    type: '',
    position: 'bottom',
  });

  const fullData = props?.route?.params?.item;

  let recurringTypes = isdata?.recurringTypes ? isdata?.recurringTypes : [];
  recurringTypes = [
    {id: 1, title: 'One time', toolTipTitle: '', appealId: 0},
    ...recurringTypes,
  ];

  // const donationOptions =
  //   isdata?.donationAmounts && isdata?.isCustomAmountDisabled == false
  //     ? [...isdata?.donationAmounts, res.strings.custom]
  //     : isdata?.donationAmounts
  //     ? [...isdata?.donationAmounts, res.strings.custom]
  //     : [res.strings.custom];
  const donationOptions = isdata?.donationAmounts || [];

  useEffect(() => {
    handleGetdonationWidget();
  }, []);

  const handleGetdonationWidget = () => {
    const appealId =
      props?.route?.params?.type === 0 ? 0 : props?.route?.params?.appealId;
    const orgId = props?.route?.params?.orgId;

    showLoader(true);
    dispatch(getdonationWidget({appealId, orgId}))
      .unwrap()
      .then(async res => {
        hideLoader(true);
        if (res?.data?.status === 1) {
          setData(res?.data);

          // setSelectedPreset(res?.data?.defaultAmountPosition);
          // setAmount('00.00');
        } else {
          // toast.show(res?.data?.message || 'data fetch failed', {
          //   type: 'danger',
          //   placement: 'bottom',
          // });
        }
      })
      .catch(err => {
        // toast.show(res?.data?.message || 'Something went wrong!', {
        //   type: 'danger',
        //   placement: 'bottom',
        // });
        hideLoader(true);
      });
  };

  const handlePeriodSelect = item => {
    setSelectedPeriodId(item.id);
  };

  const handlePresetSelect = value => {
    setSelectedPreset(value);
    if (value == 'custom') {
      setCustom(true);
      setAmount('');
      setTimeout(() => {
        inputRef.current.focus();
      }, 150);
      inputRef.current.focus();
    } else {
      setAmount(value.toString());
      setCustom(true);
      Keyboard.dismiss();
    }
  };

  const handleContinue = () => {
    if (Number(amount) < 10 || amount === '00.00') {
      setToastParams({
        type: 'error',
        position: 'bottom',
        message: 'Minimum amount allowed is RM10',
      });
      setToastVisble(true);
      return;
    }
    Keyboard.dismiss();
    const finalPeriod = recurringTypes.length > 0 ? selectedPeriodId : 1;
    navigation.navigate('PaymentScreen', {
      donationOptions: {
        amount: amount,
        period: finalPeriod,
        appealId: appealId,
        siteId: siteId,
        orgId: orgId,
        donationType: donationType,
        isdata: isdata,
        fullData: fullData,
        ...props?.route?.params,
      },
    });
  };

  const renderAmountItem = ({item}) => {
    const isSelected = selectedPreset === item;
    const isMostDonated = item === isdata?.defaultAmountPosition;
    const isCustom = item === res.strings.custom;
    return (
      <TouchableOpacity
        onPress={() => handlePresetSelect(item)}
        style={[
          isSelected && styles.shadow,
          styles.itemBox,
          {width: ITEM_WIDTH - 5, height: 49},
          isSelected && styles.presetButtonSelected,
          {paddingVertical: isMostDonated ? 10 : 10},
          isSelected && styles.highlightedBox,
        ]}>
        <Text
          style={[
            styles.amountText,
            item.highlighted && styles.highlightedText,
          ]}>
          {isCustom ? (
            <Text style={{fontSize: 18, fontWeight: '600', color: '#181B1F'}}>
              {res.strings.custom}
            </Text>
          ) : (
            <Text
              style={{
                fontSize: 20,
                fontWeight: '400',
                color: '#181B1F',
                alignSelf: 'center',
              }}>
              RM{' '}
              <Text style={{fontSize: 20, fontWeight: '700', color: '#181B1F'}}>
                {item}
              </Text>
            </Text>
          )}
        </Text>
        {isMostDonated && (
          <View style={styles.labelContainer}>
            <Text style={styles.labelText}>{res.strings.mostDonated}</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderFrequencyItem = ({item}) => (
    <TouchableOpacity
      style={[
        selectedPeriodId === item.id && styles.shadow,
        styles.itemBox,
        {width: ITEM_WIDTH - 5, height: 49},
        selectedPeriodId === item.id && styles.presetButtonSelected,
        {paddingVertical: 10},
        selectedPeriodId === item.id && styles.highlightedBox,
      ]}
      onPress={() => handlePeriodSelect(item)}>
      <Text
        style={[
          styles.periodText,
          selectedPeriodId === item.id && styles.periodTextActive,
        ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );
const formatCurrency  = (input) => {
  // Remove non-numeric and non-dot characters
  let cleaned = input.replace(/[^0-9.]/g, '');

  // Split into integer and decimal parts
  const parts = cleaned.split('.');
  const integerPart = parts[0] || '';
  const decimalPart = parts[1] ?? '';

  // Format the integer part with commas
  const formattedInteger = isNaN(parseInt(integerPart, 10))  ? '' : parseInt(integerPart, 10).toLocaleString('en-MY');

  // Rebuild the string, preserving what the user typed
   if  (cleaned.includes('.')) {
    return `${formattedInteger}.${decimalPart}`;
  } else {
    return formattedInteger;
  }
};
  return (
    <View
      style={{
        flex: 1,
        paddingBottom: Platform.OS === 'android' ? NAVIGATIONBAR_HEIGHT : 0,
        backgroundColor: '#fff',
      }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        <View style={{flex: 1}}>
          <SafeAreaView
            style={[
              styles.safeArea,
              {
                paddingTop: STATUSBAR_HEIGHT,
                paddingBottom: NAVIGATIONBAR_HEIGHT,
              },
            ]}>
            <StatusBar barStyle="dark-content" />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Header onBackPress={() => navigation.goBack()} />
              <View>
                <Text
                  style={{
                    // paddingTop: 15,
                    alignSelf: 'center',
                    fontWeight: '400',
                    fontSize: scale(14),
                    color: '#686E7A',
                  }}>
                  {res.strings.youAreMaking}
                </Text>
              </View>
              <View />
            </View>
            <Text
              style={{
                alignSelf: 'center',
                fontWeight: '600',
                fontSize: 16,
                marginTop: -10,
                color: 'black',
              }}>
              {props.route.params.item.name}
            </Text>
            <View style={{}}>
              <View>
                <View style={styles.demo}>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <View style={{alignSelf: 'flex-end'}}>
                      <Text style={styles.rmDisplayText}>RM </Text>
                    </View>
                    <TextInput
                      autoCorrect={false}
                      spellCheck={false}
                      ref={inputRef}
                      style={[
                        styles.amountDisplayText,
                        {
                          minWidth: '30%',
                          maxWidth: '110%',
                          padding:0,
                          paddingHorizontal: 4,
                        },
                      ]}
                         maxLength={10}
                      value={amount}
                      placeholder='00.00'
                      onChangeText={t => {
                        let formatted = t?.replace(/^0+(?!$)/, '')//String(Number(t)) 
                          .replace(/[^0-9.]/g, '') // Remove non-numeric except dot
                          .replace(/^(\d*\.?\d{0,2}).*$/, '$1');
                          if (formatted.includes('.')) {
                             // Allow up to 10 characters (e.g., 9999999.99)
                             formatted = formatted.slice(0, 10);
                            } else {
                              // No decimal: allow up to 7 digits only
                              formatted = formatted.slice(0, 6);
                            }
                        setSelectedPreset(formatCurrency(formatted));
                        setAmount(formatCurrency(formatted));
                        
                      }}
                      keyboardType='decimal-pad'
                      editable={isCustom}
                      pointerEvents={isCustom ? 'auto' : 'none'}
                      autoFocus={true}
                    />
                  </View>
                  <View style={styles.newstyle}></View>
                </View>
                <FlatList
                  data={donationOptions}
                  renderItem={renderAmountItem}
                  contentContainerStyle={{paddingVertical: verticalScale(10)}}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                />
              </View>
              <View>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 14,
                    fontWeight: '500',
                    color: '#464B54',
                    marginTop:verticalScale(24)
                    // paddingVertical: 15,
                  }}>
                  {res.strings.donationFrequency}
                </Text>
                <FlatList
                  data={recurringTypes}
                  contentContainerStyle={{paddingVertical: verticalScale(10)}}
                  horizontal
                  renderItem={renderFrequencyItem}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            </View>
          </SafeAreaView>
        </View>
      </KeyboardAvoidingView>
      <View style={styles.buttonContainer}>
        <View>
          <Text style={styles.text}>{isdata?.taxDeductibleText}</Text>
        </View>

        <WelcomeButton
          tittle={res.strings.continue}
          style={{marginTop: scale(24)}}
          onPress={() => {
            handleContinue();
          }}
        />
        <SafeAreaView />
        <Toast
          message={toastParams.message}
          type={toastParams.type}
          position={toastParams.position}
          visible={toastVisble}
          onHide={setToastVisble}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  backButton: {
    left: 3,
    padding: 10,
    borderWidth: 1,
  },
  icon: {
    width: 20,
    height: 20,
    tintColor: '#000',
  },
  image: {
    resizeMode: 'contain',
    height: 20,
    width: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.colorWhite,
    // backgroundColor: 'red',
    // margin:20
  },

  container: {
    flex: 1,
    // marginBottom:0,
  },
  headerBackButton: {
    marginLeft: -10,
    padding: 0,
    marginTop: 15,
    flexDirection: 'row',
  },
  header: {
    backgroundColor: '#212076',
    paddingTop: 20,
    paddingBottom: 35,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderEndEndRadius: 20,
    borderBottomLeftRadius: 20,
    position: 'relative',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.colorWhite,
    marginTop: 20,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.colorWhite,
    opacity: 0.9,
    marginBottom: 20,
  },
  headerPeriodTabsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 25,
    overflow: 'hidden',
    width: '100%',
    marginTop: 50,
  },
  content: {
    padding: 20,
  },
  periodTab: {
    flex: 1,
    // paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  periodTabActive: {
    backgroundColor: '#5756C8',
    borderRadius: 100,
  },
  periodText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.PrimaryBlack,
  },
  periodTextActive: {
    color: Colors.PrimaryBlack,
    fontWeight: '600',
  },
  amountContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  amountDisplayContainer: {
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 10,
    width: '100%',
  },
  demo: {
    display: 'flex',
    paddingVertical: verticalScale(30),
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor:'red',
    // width: '60%',
  },

  newstyle: {
    display: 'flex',
    alignItems: 'center',
  },

  amountDisplayText: {
    fontSize: scale(34),
    fontWeight: '800',
    color: '#181B1F',
  },
  rmDisplayText: {
    fontSize: 28,
    fontWeight: '400',
    color: '#686E7A',
    paddingVertical: 3,
    // textAlign: 'center',
  },
  text: {
    // paddingBottom: 15,
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 12,
    lineHeight: 18,
    fontWeight: '400',
  },
  shadow: Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.12,
        shadowRadius: 5,
      },
      android: {
        elevation: 5,
      },
    }),
  presetContainer: {
    marginBottom: 24,
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // marginBottom: 12,
  },
  presetButton: {
    // flex: 1,
    // width: '30%',
    marginHorizontal: 6,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    backgroundColor: Colors.colorWhite,
    // overflow: 'visible',
  },
  presetButtonSelected: {
    borderColor: '#5756C8',
    backgroundColor: '#E4E2FD',
  },
  presetText: {
    fontSize: 16,
    fontWeight: '400',
    color: Colors.colorTextMessage,
  },
  presetTextSelected: {
    color: Colors.PrimaryBlue,
  },
  mostDonatedContainer: {
    // position: 'absolute',
    width: '100%',
    top: -27,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#4ADE80',
    borderRadius: 12,
    overflow: 'visible',
  },
  mostDonatedLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.colorWhite,
  },
  taxInfoContainer: {
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  taxInfoText: {
    fontSize: 14,
    color: '#181B1F',
    textAlign: 'center',
    fontWeight: '400',
    lineHeight: 20,
  },
  gradient: {
    borderRadius: 25,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: verticalScale(10),
  },
  continueButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.colorWhite,
  },

  amountContainerData: {
    // padding: 10,
    backgroundColor: '#E4E2FD',
    width: 140,
    // heigth: 49,
    marginHorizontal: 10,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    // paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#5756C8',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 20,
  },
  itemBox: {
    paddingVertical: 20,
    marginHorizontal: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    backgroundColor: Colors.colorWhite,
    position: 'relative',
  },
  highlightedBox: {
    borderColor: '#7A5AF8',
    backgroundColor: '#EFEBFF',
  },
  amountText: {
    fontWeight: 'bold',
    color: '#888',
    fontSize: 17,
    fontWeight: '700',
  },
  highlightedText: {
    color: '#000',
    fontSize: 17,
    fontWeight: '700',
  },
  labelContainer: {
    position: 'absolute',
    bottom: -12,
    backgroundColor: '#29CC6A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  labelText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 20,
    zIndex: 1,
  },
  leftOverlay: {
    left: 0,
    backgroundColor: 'white',
    opacity: 0.6,
  },
  rightOverlay: {
    right: 0,
    backgroundColor: 'white',
    opacity: 0.6,
  },
});

export default DonationScreen;
