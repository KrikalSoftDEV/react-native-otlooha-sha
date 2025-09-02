import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated, BackHandler, Platform, ToastAndroid, Alert } from 'react-native';
import LocationExclamationIcon from '../../assets/images/Common/location-exclamation-qbila.svg';
import { scale, verticalScale } from 'react-native-size-matters';
import { WelcomeButton } from '../../components/UI/Button';

const LocationErrorModal = ({
    visible,
    onClose,
    onPressHandel,
}) => {
    const checkmarkScale = useRef(new Animated.Value(0)).current;
    const animateCheckmark = () => {
        Animated.sequence([
            Animated.spring(checkmarkScale, {
                toValue: 1,
                tension: 50,
                friction: 4,
                useNativeDriver: true,
            })
        ]).start();
    };

    useEffect(() => {
        if (visible) {
            animateCheckmark();
        } else {
            checkmarkScale.setValue(0);
        }
    }, [visible]);
    let backPressCount = 0;
    let timeoutId = null;

    const handleDoubleBackExit = () => {
        if (backPressCount === 0) {
            backPressCount += 1;
            if (Platform.OS === 'android') {
                ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);
            }

            timeoutId = setTimeout(() => {
                backPressCount = 0;
            }, 2000);
        } else {
            clearTimeout(timeoutId);
            BackHandler.exitApp();
        }
    };
    return (
        <Modal
            animationType="slide"
            transparent
            visible={visible}
            onRequestClose={() => {
                handleDoubleBackExit()
                // if (type !== 'network') {
                //     onClose()
                // } else {
                //    handleDoubleBackExit()
                // }
                // else: do nothing, BackHandler will handle exit
            }}>
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={{ marginBottom: 5, paddingVertical: 10 }} onPress={onClose}>
                        <View style={styles.dragHandle} />
                    </TouchableOpacity>
                    <View
                        style={styles.dikerContainer}
                    >
                        <Animated.View style={[styles.checkMarkContainer, {
                            transform: [{ scale: checkmarkScale }]
                        }]}>
                            <LocationExclamationIcon />
                            {/* <SomethingWentWrongIcon /> */}
                        </Animated.View>

                        <Text style={styles.title}>Location Access Needed</Text>
                        <Text style={styles.modalMessage}>
                            To provide accurate results, we need access to your location. Please enable device location and allow location permission for this app.
                        </Text>
                        <WelcomeButton
                            tittle={"Enable Location"}
                            style={{ marginTop: scale(24) }}
                            onPress={onPressHandel}
                        />
                        <Text style={[styles.modalMessage, { marginTop: 20 }]}>
                            Your privacy is important. We only use your location to enhance your app experience.
                        </Text>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)'
    },
    modalContainer: {
        backgroundColor: '#fff',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 16,
    },
    dikerContainer: {
        marginTop: verticalScale(30),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        textAlign: "center"
    },
    dragHandle: {
        width: 66,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3C3C434D',
        alignSelf: 'center',
    },
    checkMarkContainer: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    title: {
        marginTop: verticalScale(10),
        alignSelf: "center",
        textAlign: 'center',
        fontSize: scale(18),
        fontWeight: '600',
        color: '#181B1F',
        marginBottom: verticalScale(15),
    },
    modalMessage: {
        fontSize: scale(14),
        color: '#464B54',
        textAlign: 'center',
        fontWeight: "400",
        marginBottom: 10,
        lineHeight: 20,
    },
    laterButton: {
        marginTop: 20,
        height: scale(48),
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: scale(10),
        borderColor: "#DDE2EB",
        width: '88%',
        alignItems: 'center',
    },
    laterButtonText: {
        color: '#181B1F',
        fontSize: scale(17),
        fontWeight: '600',
    },
    reattemptingTime: {
        color: "#9F9AF4",
        fontSize: scale(48),
        fontWeight: "700"
    },
});

export default LocationErrorModal;
