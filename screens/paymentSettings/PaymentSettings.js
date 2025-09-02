import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, StatusBar } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import VisaIcon from "../../assets/images/paymentSettings/visa.svg"
import Header from '../../components/UI/Header';
import { useNavigation } from '@react-navigation/native';
import MasterCardIcon from "../../assets/images/paymentSettings/mastercard.svg"
import { scale } from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';

// Initialize global cards array if not exists
if (!global.cards) {
    global.cards = [
    {
        id: '1',
        brand: 'visa',
        bank: 'Card Name/Bank Name',
        number: '5678',
        holderName: 'Meliza Haris',
        expiryDate: '05/25',
        lastFour: '5678'
    },
    {
        id: '2',
        brand: 'mastercard',
        bank: 'Card Name/Bank Name',
        number: '2316',
        holderName: 'Meliza Haris',
        expiryDate: '06/26',
        lastFour: '2316'
    }
    ];
}

const PaymentSettings = ({ route }) => {
    const navigation = useNavigation();

    const [localCards, setLocalCards] = React.useState(global.cards);

    React.useEffect(() => {
        // If no cards are saved, navigate to EmptyPaymentState
        if (localCards.length === 0) {
            navigation.replace('EmptyPaymentState');
        }
    }, [navigation, localCards]);

    React.useEffect(() => {
        // Update local cards when global cards change or when returning from CardDetails
        if (route?.params?.refresh) {
            setLocalCards([...global.cards]);
        }
    }, [route?.params?.refresh]);
    const renderIcon = (brand) => {
        switch (brand) {
            case 'visa':
                return <VisaIcon width={33} height={33} />;
            case 'mastercard':
                return <MasterCardIcon width={33} height={33} />;
            default:
                return null;
        }
    };
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" />

            <Header
                onBackPress={() => navigation.goBack()}
                headerTitle="Payment Settings"
                borderVisible={false}
                iconColor="#181B1F"
                textColor="#181B1F"
                fontWeight={"500"}
            />
            <View style={{ flex: 1, paddingHorizontal: 16 }}>
                <TouchableOpacity 
                    style={styles.addCardBox}
                    onPress={() => navigation.navigate('AddCard')}
                >
                    <Text style={styles.addCardText}>+ Add New Card</Text>
                    <Text style={styles.subText}>Debit and Credit card</Text>
                    <View style={styles.cardLogos}>
                        <VisaIcon width={33} height={33} />
                        <MasterCardIcon width={33} height={33} />
                    </View>
                </TouchableOpacity>
                <View style={styles.listHeader}>
                    <Text style={styles.savedCardsTitle}>Saved Cards</Text>
                    <LinearGradient
                        style={{ height: 2, flex: 1, alignSelf: "center" }}
                        colors={['#DDE2EB', '#DDE2EB00']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}>
                    </LinearGradient>
                </View>

                <FlatList
                    data={localCards}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            style={styles.cardItem}
                            onPress={() => navigation.navigate('CardDetails', { card: item })}
                        >
                            {renderIcon(item.brand)}
                            <View style={styles.cardInfo}>
                                <Text style={styles.cardBank}>{item.bank}</Text>
                                <Text style={styles.cardNumber}>•••• {item.number}</Text>
                            </View>
                            <Ionicons name="chevron-forward" size={20} color="#aaa" />
                        </TouchableOpacity>
                    )}
                />
            </View>
        </SafeAreaView>
    );
};

export default PaymentSettings;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        backgroundColor: '#fff',
    },
    addCardBox: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        marginTop: 20,
        padding: 20,
        alignItems: 'center',
        marginBottom: 24,
    },
    addCardText: {
        fontSize: scale(17),
        fontWeight: '600',
        marginBottom: 4,
        color: '#181B1F',
        lineHeight: 22,
    },
    subText: {
        fontSize: scale(12),
        color: '#686E7A',
        marginBottom: 12,
        fontWeight: '400',
    },
    cardLogos: {
        flexDirection: 'row',
        gap: 10,
    },
    listHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
    },
    savedCardsTitle: {
        marginRight: 10,
        fontSize: scale(15),
        fontWeight: '600',
        color: '#181B1F'
    },
    cardItem: {
        flexDirection: 'row',
        alignItems: 'center',
        //backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#DDE2EB'
    },
    cardInfo: {
        flex: 1,
        marginLeft: 12,

    },
    cardBank: {
        fontSize: 14,
        fontWeight: '500',
        color: '#181B1F'
    },
    cardNumber: {
        color: '#686E7A',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '400'
    },
});
