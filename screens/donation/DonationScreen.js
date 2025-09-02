import React, { useState, useRef, useEffect } from 'react';
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
  BackHandler,
  Image,
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Colors from '../../constants/Colors';
import { useDispatch } from 'react-redux';
import { useLoading } from '../../context/LoadingContext';
import { getdonationWidget } from '../../redux/slices/donationSlice';
import res from '../../constants/res';
import { useRoute } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import backArrow from '../../assets/images/Common/backArrow.png';
import {
  NAVIGATIONBAR_HEIGHT,
  STATUSBAR_HEIGHT,
} from '../../constants/Dimentions';
import { WelcomeButton } from '../../components/UI/Button';
import Toast from '../../components/UI/Toast';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';


const { width } = Dimensions.get('window');
const ITEM_WIDTH = width / 3; // Show exactly 3 items

const DonationScreen = props => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
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
  const [selectedPreset, setSelectedPreset] = useState('');
  const [isdata, setData] = useState(null);
  const [toastParams, setToastParams] = useState({
    type: '',
    position: 'bottom',
  });

  const fullData = props?.route?.params?.item;

  let recurringTypes = isdata?.recurringTypes ? isdata?.recurringTypes : [];
  recurringTypes = [
    { id: 1, title: 'One time', toolTipTitle: '', appealId: 0 },
    ...recurringTypes,
  ];

  const donationOptions = isdata?.donationAmounts || [];

  const isFocoused = useIsFocused()
  const [text, setText] = useState('');
  const [cursorLocation, setCursorLocation] = useState('');

  useEffect(() => {
    const onBackPress = () => {
      if (isFocoused) {
        navigation.goBack()
        return true; // Disable back button
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    return () => {
      backHandler.remove();
    };
  }, [isFocoused]);

  useEffect(() => {
    handleGetdonationWidget();
  }, []);

  const handleGetdonationWidget = () => {
    const appealId =
      props?.route?.params?.type === 0 ? 0 : props?.route?.params?.appealId;
    const orgId = props?.route?.params?.orgId;

    showLoader(true);
    dispatch(getdonationWidget({ appealId, orgId }))
      .unwrap()
      .then(async res => {
        hideLoader(true);
        if (res?.data?.status === 1) {
          setData(res?.data);
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
    const trimmedAmount = amount.trim();

    // Reject if it's just a dot or contains multiple dots
    if (
      trimmedAmount === '.' ||
      (trimmedAmount.match(/\./g) || []).length > 1
    ) {
      setToastParams({
        type: 'error',
        position: 'bottom',
        message: 'Minimum amount allowed is RM10',
      });
      setToastVisble(true);
      return;
    }
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

  const renderAmountItem = ({ item }) => {
    const isSelected = selectedPreset === item;
    const isMostDonated = item === isdata?.defaultAmountPosition;
    const isCustom = item === res.strings.custom;
    if (item === undefined || item === null || item === '' || !item) return null;
    return (
      <TouchableOpacity
        onPress={() => handlePresetSelect(item)}
        style={[
          isSelected && styles.shadow,
          styles.itemBox,
          { width: ITEM_WIDTH - 5, height: 49 },
          isSelected && styles.presetButtonSelected,
          { paddingVertical: isMostDonated ? 10 : 10 },
          isSelected && styles.highlightedBox,
        ]}>
        <Text
          style={[
            styles.amountText,
            item.highlighted && styles.highlightedText,
          ]}>
          {isCustom ? (
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#181B1F' }}>
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
              RM
              <Text style={{ fontSize: 20, fontWeight: '700', color: '#181B1F' }}>
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

  const renderFrequencyItem = ({ item }) => (
    <TouchableOpacity
      style={[
        selectedPeriodId === item.id && styles.shadow,
        styles.itemBox,
        { width: ITEM_WIDTH - 5, height: 49 },
        selectedPeriodId === item.id && styles.presetButtonSelected,
        { paddingVertical: 10 },
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

 const onSelectionChange = ({ nativeEvent: { selection } }) => {
    const { start } = selection;
    const decimalIndex = amount.indexOf('.');
    if (decimalIndex === -1) {
      setCursorLocation(start < amount.length ? 'Before Decimal' : 'After Decimal');
    } else {
      if (start < decimalIndex ) {
        setCursorLocation('Before Decimal');
      } else {
        setCursorLocation('After Decimal');
      }
    }
  };
  // Get computed max length based on cursor location
  const getComputedMaxLength = () => {

    if (cursorLocation === 'Before Decimal' && amount.includes('.')) {
      // Allow max 6 digits for the integer part (999999)
      return 9; // 6 digits before decimal + 1 for the dot + 2 digits after decimal
    }

    if (!amount.includes('.')) {
      return 7; // No decimal yet: allow up to 10 chars total
    }

    const [intPart, decPart] = amount.split('.');

    // Limit decimal to 2 digits
    const allowedDecimalLength = 2 - (decPart?.length || 0);
    if (allowedDecimalLength == 0) return amount?.length;

    // Remaining total allowed characters
    const usedLength = intPart.length + 1 + (decPart?.length || 0); // +1 for dot
    const remaining = 10 - usedLength;

    // MaxLength should be current length + remaining
    return amount.length + remaining;
  };

  return (
    <View style={{ backgroundColor: 'white', flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
        <SafeAreaView
          // behavior={Platform.OS === 'ios' ? 'padding' : 'height'}

          style={{
            flex: 1,
            paddingTop:verticalScale(STATUSBAR_HEIGHT),
            paddingBottom: Platform.OS === 'android' ? NAVIGATIONBAR_HEIGHT : 0,
            backgroundColor: '#fff',
          }}>
          <View style={{ flex: 1 }}>
            <View
              style={[
                styles.safeArea,
                {
                  // paddingTop: STATUSBAR_HEIGHT * 0.7,
                  paddingBottom: 0,
                },
              ]}>
              <StatusBar barStyle="dark-content" />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={styles.backButton}
                  onPress={() => navigation.goBack()}
                >
                  <Image source={backArrow} style={[styles.image, { tintColor: "#181B1F", }]} />
                </TouchableOpacity>
                <View style={{ flex: 1, paddingVertical: 0 }} >
                  <Text
                    style={{
                      paddingTop: scale(6),
                      alignSelf: 'center',
                      fontWeight: '400',
                      fontSize: scale(14),
                      color: '#686E7A',
                    }}>
                    {res.strings.youAreMaking}
                  </Text>
                </View>
                <View style={{ width: scale(35), }} />
              </View>
              <Text
                style={{
                  alignSelf: 'center',
                  fontWeight: '600',
                  fontSize: scale(15),
                  marginTop: scale(-5),
                  color: '#181B1F',
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
                      <View style={{ alignSelf: 'flex-end' }}>
                        <Text style={styles.rmDisplayText}>RM</Text>
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
                            padding: 0,
                            // paddingHorizontal: 4,
                          },
                        ]}
                        onSelectionChange={onSelectionChange}
                        maxLength={getComputedMaxLength()}
                        value={amount}
                        placeholder="00.00"
                        onChangeText={t => {
                          const formatted = t
                            ?.replace(/^0+(?!$)/, '') //String(Number(t))
                            .replace(/[^0-9.]/g, '') // Remove non-numeric except dot
                            .replace(/^(\d*\.?\d{0,2}).*$/, '$1');
                          setSelectedPreset(formatted);
                          setAmount(formatted);
                        }}
                        keyboardType="decimal-pad"
                        editable={isCustom}
                        pointerEvents={isCustom ? 'auto' : 'none'}
                        autoFocus={true}
                      />
                    </View>
                    <View style={styles.newstyle}></View>
                  </View>
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.fade, { left: 0 }]}
                    pointerEvents="none"
                  />
                  <FlatList
                    data={donationOptions}
                    renderItem={renderAmountItem}
                    contentContainerStyle={{ paddingVertical: verticalScale(10) }}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                  />
                  <LinearGradient
                    colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.fade, { right: 0 }]}
                    pointerEvents="none"
                  />
                </View>
                {isdata?.recurringTypes && isdata?.recurringTypes?.length > 0 && <View>
                  <Text
                    style={{
                      alignSelf: 'center',
                      fontSize: 14,
                      fontWeight: '500',
                      color: '#464B54',
                      marginTop: verticalScale(24),
                      // paddingVertical: 15,
                    }}>
                    {res.strings.donationFrequency}
                  </Text>
                   <LinearGradient
                    colors={['rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 0)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.fade, { left: 0 }]}
                    pointerEvents="none"
                  />
                  <FlatList
                    data={recurringTypes}
                    contentContainerStyle={{ paddingVertical: verticalScale(10) }}
                    horizontal
                    renderItem={renderFrequencyItem}
                    showsHorizontalScrollIndicator={false}
                  />
                   <LinearGradient
                    colors={['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 1)']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.fade, { right: 0 }]}
                    pointerEvents="none"
                  />
                </View>}
              </View>
            </View>
          </View>
        </SafeAreaView>
        <View style={[styles.buttonContainer,]}>
          <View>
            <Text style={styles.text}>{isdata?.taxDeductibleText}</Text>
          </View>

          <WelcomeButton
            tittle={res.strings.continue}
            style={[{ marginTop: scale(24), marginBottom: Platform.OS == 'ios' ? verticalScale(24) : 0 }]}
            onPress={() => {
              handleContinue();
            }}
          />
          <Toast
            message={toastParams.message}
            type={toastParams.type}
            position={toastParams.position}
            visible={toastVisble}
            onHide={setToastVisble}
          />
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
fade: { position: 'absolute', top: 0, bottom: 0, width: 100, zIndex: 1 },
  backButton: {
    height: scale(35),
    width: scale(35),
    justifyContent: 'center',
    alignItems: "center",
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
    backgroundColor: 'white',
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
    // paddingBottom: verticalScale(10),
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
