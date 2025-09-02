import React, { useEffect, useRef } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import SuccessIcon from '../../assets/images/Common/SuccessIcon.svg';
import { scale, verticalScale } from 'react-native-size-matters';
import { WelcomeButton } from '../../components/UI/Button';
const DhikirCompletedModal = ({
    isVisible = true,
    onClose,
    currentDhikirIndex,
    setCurrentDhikirIndex,
    totalDhikir,
    setTarget,
    setCount,
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
        if (isVisible) {
            animateCheckmark();
        } else {
            checkmarkScale.setValue(0);
        }
    }, [isVisible]);

    const handleAwesome = () => {
        setCount(0);
        if ((totalDhikir === 0 || totalDhikir === currentDhikirIndex)) {
            setCurrentDhikirIndex(0)
            setTarget(0);
        }
        onClose()
    };

    const handleMayBeLater = () => {
        setCount(0)
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent
            visible={isVisible}
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <TouchableOpacity style={{ marginBottom: 5, paddingVertical: 10 }} onPress={handleAwesome}>
                        <View style={styles.dragHandle} />
                    </TouchableOpacity>
                    <View
                        style={styles.dikerContainer}
                    >
                        <Animated.View style={[styles.checkMarkContainer, {
                            transform: [{ scale: checkmarkScale }]
                        }]}>
                            <SuccessIcon />
                        </Animated.View>

                        <Text style={styles.title}>Dhikir completed</Text>
                        <Text style={styles.modalMessage}>
                            {
                                (totalDhikir === 0 || currentDhikirIndex === totalDhikir)
                                    ? "MashaAllah! Every count is a\n step closer to Jannah."
                                    : "MashaAllah! Every count is a step closer to Jannah. Would you like to continue with the next one?"
                            }
                        </Text>
                        <WelcomeButton
                            tittle={(totalDhikir === 0 || totalDhikir === currentDhikirIndex) ? "Awesome!" : "Yes, continue"}
                            style={{ marginTop: scale(24) }}
                            onPress={handleAwesome}
                        />
                        {!(totalDhikir === 0 || totalDhikir === currentDhikirIndex) && <TouchableOpacity
                            style={styles.laterButton}
                            onPress={handleMayBeLater}
                        >
                            <Text style={styles.laterButtonText}>Maybe later</Text>
                        </TouchableOpacity>}
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
});

export default DhikirCompletedModal;
