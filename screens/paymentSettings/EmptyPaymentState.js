import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { scale } from 'react-native-size-matters';
import Header from '../../components/UI/Header';
import LinearGradient from 'react-native-linear-gradient';
import EmptyCard from "../../assets/images/paymentSettings/emptyCardIcon.svg"
import { WelcomeButton } from '../../components/UI/Button';

const EmptyPaymentState = () => {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={styles.container}>
            <Header
                onBackPress={() => navigation.goBack()}
                headerTitle="Payment Settings"
                borderVisible={false}
                iconColor="#181B1F"
                textColor="#181B1F"
                fontWeight={"500"}
            />
            <View style={styles.content}>
                <EmptyCard />
                <Text style={styles.title}>You haven't saved any cards yet</Text>
                <Text style={styles.subtitle}>Add a card to make payments</Text>
                <Text style={styles.subtitleText}>quicker and easier.</Text>
                
                    <WelcomeButton
                        tittle={"+ Add Card"}
                        style={{ marginTop: scale(2), width: scale(190), height: scale(58), borderRadius: scale(14) }}
                        onPress={() => navigation.navigate('AddCard')}
                    />
                
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
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
    },
    buttonContainer:{
    //   marginBottom: scale(30)
    },
    subtitleText: {
        fontSize: scale(15),
        color: '#686E7A',
        textAlign: 'center',
        marginBottom: scale(8),
    },
    emptyStateImage: {
        width: scale(120),
        height: scale(120),
        marginBottom: scale(24),
    },
    title: {
        fontSize: scale(17),
        fontWeight: '600',
        color: '#181B1F',
        textAlign: 'center',
        marginBottom: scale(8),
    },
    subtitle: {
        fontSize: scale(15),
        color: '#686E7A',
        textAlign: 'center',
        marginBottom: scale(3),
    },
    addCardButton: {
        width: '100%',
        height: scale(48),
        borderRadius: scale(12),
        overflow: 'hidden',
        marginTop: scale(23),
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
});

export default EmptyPaymentState;