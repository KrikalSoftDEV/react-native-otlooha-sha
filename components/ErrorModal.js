
import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated, BackHandler, Platform, ToastAndroid, Alert } from 'react-native';
import NetworkIssuesIcon from '../assets/images/Common/network-issues-icon.svg';
import SomethingWentWrongIcon from '../assets/images/Common/something-went-wrong.svg';
import { scale, verticalScale } from 'react-native-size-matters';
import { WelcomeButton } from './UI/Button';

const ErrorModal = ({
    visible,
    onClose,
    type = 'network',
    onPressHandel,
    lockoutLeft,
    cooldownLeft,
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
                // Only allow closing if not 'network' type
                if (type !== 'network') {
                    onClose()
                } else {
                   handleDoubleBackExit()
                }
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
                        {(type === 'network' || type === 'error') && <Animated.View style={[styles.checkMarkContainer, {
                            transform: [{ scale: checkmarkScale }]
                        }]}>
                            {type === 'network' ? <NetworkIssuesIcon /> : type === 'error' ? <SomethingWentWrongIcon /> : null}
                        </Animated.View>}
                        {type === 'wrongAttempts' && (
                            <Text style={styles.reattemptingTime}>
                                {String(Math.floor(lockoutLeft / 60)).padStart(2, '0')}:
                                {String(lockoutLeft % 60).padStart(2, '0')}
                            </Text>
                        )}
                        <Text style={styles.title}>{type === 'network' ? "Network issues" : type === 'error' ? "Oops! Something went wrong. \nPlease try again." : "Oops! too many failed attempts"}</Text>
                        {(type === 'network' || type === 'wrongAttempts') && <Text style={styles.modalMessage}>
                            {type === 'network' ? "Internet Connection is bad, but no worries,\nwe got it! Try reloading the app." : "Please wait for five minutes before trying again."}
                        </Text>}
                        <WelcomeButton
                            tittle={type === 'network' ? 'Reload Now' : type === 'error' ? 'Try Again' : 'Continue as Guest'}
                            style={{ marginTop: scale(24) }}
                            onPress={type === 'wrongAttempts' ? onPressHandel : onClose}
                        />
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
        marginBottom: 20,
    },
    title: {
        marginTop: verticalScale(20),
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

export default ErrorModal;
