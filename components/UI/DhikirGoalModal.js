import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import CloseImg from "../../assets/images/close-icon.png"
import BlueSelectImg from "../../assets/images/blue-check-circle-icon.png"
import { WelcomeButton } from './Button';

const DhikirGoalModal = ({
    target,
    applyTargetAllSelectedDhikir,
    setApplyTargetAllSelectedDhikir,
    setTarget,
    isModalVisible,
    setIsModalVisible,
    selectedDhikrItems
}) => {
    const [newTarget, setNewTarget] = useState(target);

    const handleSetGoal = () => {
        if (newTarget && parseInt(newTarget) > 0) {
            setTarget(newTarget);
            setNewTarget('');
            setIsModalVisible(false);
        } else {
            Alert.alert("Please enter a valid goal");
        }
    }
    useEffect(() => {
        if (target) {
            setNewTarget(target.toString());
        }
    }, [target]);
    return (
        <View>
            <Modal
                animationType="fade"
                transparent={true}
                visible={isModalVisible}
                onRequestClose={() => setIsModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity
                            onPress={() => {
                                if (newTarget) {
                                    Alert.alert("Are you sure you want to close?",
                                        "Your goal will not be saved"
                                        , [
                                            {
                                                text: "Cancel",
                                                onPress: () => console.log("Cancel Pressed"),
                                                style: "cancel"
                                            },
                                            {
                                                text: "OK",
                                                onPress: () => {
                                                    setNewTarget('');
                                                    setIsModalVisible(false);
                                                }
                                            }
                                        ]);
                                } else {
                                    setIsModalVisible(false);
                                }
                            }}
                            style={styles.closeButton}
                        >
                            <Image source={CloseImg} style={StyleSheet.closeIcon} />
                        </TouchableOpacity>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Set a goal</Text>
                        </View >
                        <View style={styles.inputContainer}>
                            <Text style={styles.modalLabel}>Enter your goal here</Text>
                            <TextInput
                                autoCorrect={false}
                                spellCheck={false}
                                style={styles.modalInput}
                                keyboardType="number-pad"
                                value={newTarget}
                                onChangeText={(text) => {
                                    setNewTarget(text.replace(/[^0-9]/g, ''));
                                }}
                                maxLength={3}
                                placeholder="00"
                            />
                            {(selectedDhikrItems.length > 1) ?
                                <TouchableOpacity style={[styles.checkContent, applyTargetAllSelectedDhikir && styles.checkedStyle]} onPress={() => setApplyTargetAllSelectedDhikir(prev => !prev)}>
                                    {applyTargetAllSelectedDhikir && <Image source={BlueSelectImg} style={[styles.closeIcon, { marginRight: 5 }]} />}
                                    <Text style={styles.checkText}>Apply to all selected Dhikir</Text>
                                </TouchableOpacity>
                                : null
                            }
                        </View >
                        <View style={styles.selectButton}>
                            <WelcomeButton
                                tittle={"Set Goal"}
                                style={{ marginTop: scale(24) }}
                                onPress={handleSetGoal}
                            />
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        position: "relative",
        zIndex: 999,
        backgroundColor: '#FFFFFF',
        borderRadius: scale(36),
        padding: scale(20),
        width: '80%',
        alignItems: 'center',
        justifyContent: "center"
    },
    modalHeader: {
        width: '100%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: scale(14),
        color: '#181B1F',
    },
    closeButton: {
        backgroundColor: "#F0F2F7",
        alignItems: "center",
        justifyContent: "center",
        height: scale(30),
        width: scale(30),
        borderRadius: scale(30),
        position: "absolute",
        top: scale(15),
        right: scale(15),
    },
    closeIcon: {
        height: scale(16),
        width: scale(16),
        resizeMode: "contain"
    },
    checkContent: {
        flexDirection: "row",
        height: verticalScale(32),
        borderWidth: 1,
        borderColor: "#DDE2EB",
        borderRadius: 50,
        paddingHorizontal: 15,
        alignItems: "center",
        justifyContent: "center"
    },
    checkedStyle: { backgroundColor: "#E4E2FD", borderColor: "#5756C8" },
    checkText: {
        color: "#181B1F",
        fontSize: scale(12),
        fontWeight: "500"
    },
    modalLabel: {
        fontSize: scale(12),
        color: '#686E7A',
        alignSelf: 'center',
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: "center",
        marginVertical: scale(20)
    },
    modalInput: {
        width: '100%',
        padding: scale(10),
        fontSize: scale(56),
        textAlign: 'center',
        color: '#181B1F',
    },
    modalButton: {
        width: '75%',
        borderRadius: scale(14),
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: scale(18),
        fontWeight: '600',
        letterSpacing: 1,
    },
    selectButton: {
        width: "100%",
    },

});
export default DhikirGoalModal