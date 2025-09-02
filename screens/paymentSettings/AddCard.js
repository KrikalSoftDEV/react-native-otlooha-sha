import React, { useEffect, useState } from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity, TextInput, SafeAreaView, Platform, Alert, PermissionsAndroid, ImageBackground, Image, useColorScheme } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from 'react-native-size-matters';
import Header from '../../components/UI/Header';
import LinearGradient from 'react-native-linear-gradient';
import CardBgImage from '../../assets/images/paymentSettings/card-bg.png';
import CardChipImg from '../../assets/images/paymentSettings/card-chip.png';
import visaIconImg from '../../assets/images/paymentSettings/visa-icon.png';
import { addPaymentCard, getPaymentCardList } from '../../redux/slices/paymentCardSlice';
import { useDispatch } from 'react-redux';
import { CardField, useStripe } from '@stripe/stripe-react-native';


const AddCard = () => {
    const theme = useColorScheme();
    const { createPaymentMethod } = useStripe();
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [cardNumber, setCardNumber] = useState('');
    const [cardHolder, setCardHolder] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cardDetails, setCardDetails] = useState()
    const [cvv, setCvv] = useState('');
    const [showCardIOView, setShowCardIOView] = useState(false); // NEW
    const darkMode = theme === 'light' ? false : true;

    const requestCameraPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Camera Permission',
                    message: 'We need access to your camera to scan the card.',
                    buttonPositive: 'OK',
                }
            );
            return granted === PermissionsAndroid.RESULTS.GRANTED;
        } catch (err) {
            console.warn(err);
            return false;
        }
    };

    const scanCard = async () => {
        try {
            if (Platform.OS === 'android') {
                const granted = await requestCameraPermission();
                if (!granted) {
                    Alert.alert('Permission Denied', 'Camera permission is required to scan cards.');
                    return;
                }

                console.log('Camera permission granted. Opening scanner...');

                const card = await CardIOModule.scanCard({
                    requireExpiry: true,
                    requireCVV: true,
                    requireCardholderName: true,
                    hideCardIOLogo: true,
                    suppressManualEntry: false,
                    suppressConfirmation: false,
                    scanInstructions: 'Hold your card inside the frame',
                    guideColor: '#2454FF',
                    noCamera: false,
                });

                console.log('Card Scanned:', card);

                if (card) {
                    setCardNumber(card.cardNumber);
                    setCardHolder(card.cardholderName || '');
                    setExpiryDate(`${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`);
                    setCvv(card.cvv || '');
                }
            }
        } catch (error) {
            console.error('Scan failed:', error);
            Alert.alert('Error', 'Card scan failed. Try again or enter manually.');
        }
    };


    const didScanCard = (card) => {
        if (card) {
            setCardNumber(card.cardNumber);
            setCardHolder(card.cardholderName || '');
            setExpiryDate(`${String(card.expiryMonth).padStart(2, '0')}/${String(card.expiryYear).slice(-2)}`);
            setCvv(card.cvv || '');
        }
        setShowCardIOView(false);
    };
    const formatCardNumber = (text) => {
        const cleaned = text.replace(/\D/g, '');
        const formatted = cleaned.replace(/(.{4})/g, '$1 ').trim();
        return formatted;
    };

    const formatExpiryDate = (text) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length >= 2) {
            return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
        }
        return cleaned;
    };

    useEffect(() => {
        dispatch(getPaymentCardList({}))
    }, [dispatch]);

    const addPaymentCardHandler = async () => {
        if (!cardDetails || !cardDetails.complete) {
            Alert.alert('Invalid Card Details', 'Please provide valid card details.');
            return;
        }
        const { paymentMethod, error } = await createPaymentMethod({
            paymentMethodType: 'Card',
            card: cardDetails,
        });
        console.log("cardDetails", cardDetails);
        if (error) {
            Alert.alert('Payment Error', error.message);
            return;
        }

        let paymentMethodId = paymentMethod.id;
        console.log("paymentMethod", paymentMethod)
        let body = {
            "id": 0,
            "isDefaultCard": false,
            "expiryMonth": cardDetails.expiryMonth,
            "expiryYear": cardDetails.expiryYear,
            "cardHolderName": cardHolder,
            "paymentMethodId": paymentMethodId //"pm_1RjgKKExYCOPxGAznv4lpvnM"
        }
        await dispatch(addPaymentCard(body));
    }

    const getMaskedCardNumber = () => {
        if (cardNumber?.length >= 4) {
            return `**** **** **** ${cardNumber.slice(-4)}`;
        }
        if (cardDetails?.last4) {
            return `**** **** **** ${cardDetails.last4 || '0000'}`;
        }
        return '**** **** **** 0000';
    };
    return (
        <SafeAreaView style={styles.container}>
            <Header
                onBackPress={() => navigation.goBack()}
                headerTitle="Add New Card"
                borderVisible={false}
                iconColor="#181B1F"
                textColor="#181B1F"
                fontWeight={"500"}
            />
            <View style={styles.content}>
                {/* <ScrollView style={{flex: 1}}> */}
                <View style={styles.cardPreview}>
                    <ImageBackground
                        source={CardBgImage}
                        style={styles.cardBg}
                        imageStyle={{ borderRadius: scale(16) }}
                        resizeMode="cover"
                    >
                        <LinearGradient
                            colors={[

                                'rgb(31, 31, 111)',
                                "transparent",
                            ]}
                            style={styles.linearBg}
                            start={{ x: 0, y: 0.1 }}
                            end={{ x: 0.2, y: 0.9 }}
                        >
                            <View style={styles.cardDetailsContainer}>
                                <View style={styles.cardTypeContainer}>
                                    <Text style={styles.cardType}>Credit Card</Text>
                                    <Image
                                        source={visaIconImg}
                                        style={{ width: scale(50), height: scale(17), marginTop: scale(10) }}
                                        resizeMode="contain"
                                    />
                                </View>

                                <Image
                                    source={CardChipImg}
                                    style={styles.chip}
                                    resizeMode="contain"
                                />
                                <Text style={styles.cardNumber}>
                                    {getMaskedCardNumber()}
                                </Text>


                                <View style={styles.cardDetailsRow}>
                                    <Text style={styles.cardHolder}>{cardHolder || 'Maliza Hans'}</Text>
                                    <Text style={styles.validThru}>
                                        Valid Thru <Text style={styles.expiry}>{cardDetails?.expiryMonth && cardDetails?.expiryYear ? `${cardDetails.expiryMonth}/${cardDetails.expiryYear}` : '12/25'}</Text>
                                    </Text>
                                </View>
                            </View>
                        </LinearGradient>
                    </ImageBackground>

                </View>
                {!showCardIOView && (
                    <TouchableOpacity style={styles.scanButton}
                    //  onPress={scanCard}
                    >
                        <Text style={styles.scanButtonText}>📷 Scan your card</Text>
                    </TouchableOpacity>
                )}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Credit/Debit Card</Text>
                    <CardField
                        postalCodeEnabled={false}
                        placeholder={{ number: '4242 4242 4242 4242' }}
                        placeholderColor={darkMode ? "#000000" : "#ffffff"}
                        cardStyle={
                            darkMode
                                ? { backgroundColor: '#000000', textColor: '#ffffff', borderWidth: 1, borderColor: '#ffffff', borderRadius: scale(12), fontSize: scale(15), }
                                : { backgroundColor: '#ffffff', textColor: '#181B1F', borderWidth: 1, borderColor: '#DDE2EB', borderRadius: scale(12), fontSize: scale(15), }
                        }
                        style={[{ flexDirection: "column", height: verticalScale(48), fontSize: scale(15), }]}
                        onCardChange={cardDetails => setCardDetails(cardDetails)}
                    />
                </View>
                <View style={styles.form}>
                    {/* <View style={styles.inputGroup}>
                        <Text style={styles.label}>Card Number</Text>
                        <TextInput
                            style={styles.input}
                            value={formatCardNumber(cardNumber)}
                            onChangeText={(text) => setCardNumber(text.replace(/\s/g, ''))}
                            placeholder="1234 5678 9012 3456"
                            keyboardType="numeric"
                            maxLength={19}
                        />
                    </View> */}

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Name on Card</Text>
                        <TextInput
                            style={styles.input}
                            value={cardHolder}
                            onChangeText={setCardHolder}
                            placeholder="Enter cardholder name"
                        />
                    </View>
                    {/* 
                    <View style={styles.row}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                            <Text style={styles.label}>Expiry Date</Text>
                            <TextInput
                                style={styles.input}
                                value={expiryDate}
                                onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                                placeholder="MM/YY"
                                keyboardType="numeric"
                                maxLength={5}
                            />
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>CVV</Text>
                            <TextInput
                                style={styles.input}
                                value={cvv}
                                onChangeText={setCvv}
                                placeholder="123"
                                keyboardType="numeric"
                                maxLength={4}
                                secureTextEntry
                            />
                        </View>
                    </View> */}
                </View>
                {Platform.OS === 'ios' && showCardIOView && (
                    <View style={{ height: 300, marginTop: 20 }}>
                        <CardIOView
                            style={{ flex: 1 }}
                            didScanCard={didScanCard}
                            hideCardIOLogo={true}
                            scanExpiry={true}
                            scannedImageDuration={1.2}
                            guideColor="#2454FF"
                            scanInstructions="Hold your card inside the frame"
                        />
                        {/* Cancel Scan Button */}
                        <TouchableOpacity onPress={() => setShowCardIOView(false)}>
                            <Text style={{ textAlign: 'center', color: '#2454FF', marginTop: 10 }}>
                                Cancel Scan
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={addPaymentCardHandler}
                // onPress={() => {
                //     navigation.navigate('PaymentSettings');
                // }}
                >
                    <LinearGradient
                        colors={['#2454FF', '#2454FF']}
                        style={styles.gradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                    >
                        <Text style={styles.buttonText}>Add Card</Text>
                    </LinearGradient>
                </TouchableOpacity>
                {/* </ScrollView> */}
            </View>
        </SafeAreaView >
    );

};

const styles = StyleSheet.create({
    addCardButton: {
        backgroundColor: '#2454FF',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 24,
    },
    cardPreview: {
        width: '100%',
        height: scale(200),
        padding: 0,
    },
    cardDetailsContainer: {
        flex: 1,
        width: "100%",
        paddingHorizontal: scale(20),
        justifyContent: 'center',
    },
    cardTypeContainer: {
        width: "100%",
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    cardBg: {
        width: '100%',
        height: '100%',
        borderRadius: scale(16),
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: 'rgb(53,65,208)',
    },
    linearBg: {
        height: '100%',
        width: '100%',
        borderRadius: scale(16),
        justifyContent: 'center',
        alignItems: 'center',
    },

    cardType: {
        color: '#FFFFFFCC',
        fontSize: scale(12),
        fontWeight: '500',
    },
    chip: {
        width: scale(38),
        height: scale(30),
        backgroundColor: '#F7A600',
        borderRadius: scale(4),
        marginTop: scale(10),
    },

    cardNumber: {
        color: '#fff',
        fontSize: scale(18),
        letterSpacing: scale(2),
        marginTop: scale(16),
        fontWeight: '500',
    },

    cardDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },

    cardHolder: {
        color: '#fff',
        fontSize: scale(14),
        fontWeight: '600',
    },

    validThru: {
        color: '#fff',
        fontSize: scale(10),
        marginTop: scale(20),
    },

    expiry: {
        fontSize: scale(14),
        fontWeight: '600',
    },
    addCardButtonText: {
        color: '#FFFFFF',
        fontSize: scale(16),
        fontWeight: '600',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
    },
    content: {
        flex: 1,
        padding: 24,
    },
    cardPreview: {
        height: scale(200),
        marginBottom: scale(24),
        borderRadius: scale(16),
        overflow: 'hidden',
    },
    // cardGradient: {
    //     flex: 1,
    //     padding: scale(24),
    //     justifyContent: 'space-between',
    // },
    cardNumberPreview: {
        fontSize: scale(24),
        color: '#FFFFFF',
        letterSpacing: 2,
        marginTop: scale(40),
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: scale(40),
    },
    cardLabel: {
        fontSize: scale(12),
        color: '#FFFFFF80',
        marginBottom: scale(4),
    },
    cardValue: {
        fontSize: scale(16),
        color: '#FFFFFF',
    },
    scanButton: {
        backgroundColor: '#F5F6F8',
        height: scale(48),
        borderRadius: scale(12),
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: scale(24),
    },
    scanButtonText: {
        fontSize: scale(15),
        color: '#2454FF',
        fontWeight: '600',
    },
    form: {
        flex: 1,
    },
    inputGroup: {
        marginBottom: scale(16),
    },
    label: {
        fontSize: scale(14),
        color: '#181B1F',
        marginBottom: scale(8),
        fontWeight: '500',
    },
    inputField: {

    },
    input: {
        height: verticalScale(48),
        borderWidth: 1,
        borderColor: '#DDE2EB',
        borderRadius: scale(12),
        paddingHorizontal: scale(16),
        fontSize: scale(15),
        color: '#181B1F',
    },
    row: {
        flexDirection: 'row',
    },
    addButton: {
        height: scale(48),
        borderRadius: scale(12),
        overflow: 'hidden',
        marginTop: 'auto',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: scale(15),
        fontWeight: '600',
    },



    sectionContainer: {
        marginTop: 15,
        // paddingHorizontal: 15,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#181B1F',
        marginBottom: 10,
        flexDirection: 'column',
        //backgroundColor:'red'
    },
});

export default AddCard;