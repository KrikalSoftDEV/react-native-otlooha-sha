import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import Header from '../../components/UI/Header';
import LinearGradient from 'react-native-linear-gradient';
import VisaIcon from "../../assets/images/paymentSettings/visa.svg";
import MasterCardIcon from "../../assets/images/paymentSettings/mastercard.svg";

const CardDetails = ({ route }) => {
    const navigation = useNavigation();
    const { card } = route.params;

    const handleDeleteCard = () => {
        Alert.alert(
            'Delete Card',
            'Are you sure you want to delete this card?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        // Filter out the deleted card from the cards array
                        const updatedCards = cards.filter(c => c.id !== card.id);
                        // Update the cards array
                        global.cards = updatedCards;
                        // Navigate back to PaymentSettings
                        navigation.navigate('PaymentSettings', { refresh: true });
                    },
                    style: 'destructive',
                },
            ],
            { cancelable: true }
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header
                onBackPress={() => navigation.goBack()}
                headerTitle="Card Details"
                borderVisible={false}
                iconColor="#181B1F"
                textColor="#181B1F"
                fontWeight={"500"}
            />
            <View style={styles.content}>
                <View style={styles.cardPreview}>
                    <LinearGradient
                        colors={['#2454FF', '#1640D4']}
                        style={styles.cardGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                    >
                        <View style={styles.cardHeader}>
                            <Text style={styles.cardNumberPreview}>
                                •••• •••• •••• {card?.lastFour || '5678'}
                            </Text>
                            {card?.brand === 'mastercard' ? <MasterCardIcon width={50} height={30} /> : <VisaIcon width={50} height={30} />}
                        </View>
                        <View style={styles.cardDetails}>
                            <View>
                                <Text style={styles.cardLabel}>Name on Card</Text>
                                <Text style={styles.cardValue}>{card?.holderName || 'Meliza Haris'}</Text>
                            </View>
                            <View>
                                <Text style={styles.cardLabel}>Expiry Date</Text>
                                <Text style={styles.cardValue}>{card?.expiryDate || '05/25'}</Text>
                            </View>
                        </View>
                    </LinearGradient>
                </View>

                <View style={styles.detailsSection}>
                    <Text style={styles.sectionTitle}>Card Number</Text>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailValue}>•••• •••• •••• {card?.lastFour || '5678'}</Text>
                        {card?.brand === 'mastercard' ? <MasterCardIcon width={33} height={33} /> : <VisaIcon width={33} height={33} />}
                    </View>

                    <Text style={styles.sectionTitle}>Name on Card</Text>
                    <Text style={styles.detailValue}>{card?.holderName || 'Meliza Haris'}</Text>

                    <Text style={styles.sectionTitle}>Expiry Date</Text>
                    <Text style={styles.detailValue}>{card?.expiryDate || '05/25'}</Text>
                </View>

                <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteCard}
                >
                    <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: 30,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    cardPreview: {
        marginBottom: 24,
    },
    cardGradient: {
        borderRadius: 12,
        padding: 20,
        height: 180,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
    },
    cardNumberPreview: {
        color: '#fff',
        fontSize: scale(18),
        letterSpacing: 2,
        fontWeight: '500',
    },
    cardDetails: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardLabel: {
        color: '#fff',
        opacity: 0.8,
        fontSize: scale(12),
        marginBottom: 4,
    },
    cardValue: {
        color: '#fff',
        fontSize: scale(14),
        fontWeight: '500',
    },
    detailsSection: {
        marginTop: 24,
    },
    sectionTitle: {
        fontSize: scale(14),
        color: '#686E7A',
        marginBottom: 8,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    detailValue: {
        fontSize: scale(16),
        color: '#181B1F',
        fontWeight: '500',
        marginBottom: 24,
    },
    deleteButton: {
        backgroundColor: '#FEE4E2',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 16,
    },
    deleteButtonText: {
        color: '#D92D20',
        fontSize: scale(16),
        fontWeight: '600',
    },
});

export default CardDetails;