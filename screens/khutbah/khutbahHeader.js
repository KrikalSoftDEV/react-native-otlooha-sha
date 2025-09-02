import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
} from 'react-native';
import KhutbahHeaderBg from "../../assets/images/Khutbah/khutbah-header-bg.png";
import Header from '../../components/UI/Header';
import { scale } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const KhutbahHeader = () => {
    const navigation = useNavigation()
    return (
        <View style={styles.headerContainer}>
            <ImageBackground
                source={KhutbahHeaderBg}
                style={styles.headerImage}
                imageStyle={{
                    resizeMode: "cover",
                    borderBottomLeftRadius: 25,
                    borderBottomRightRadius: 25
                }}
            >
                <View style={styles.headerOverlay}>
                    <View style={{ position: "relative", height: "100%" }}>
                        <Header
                            onBackPress={() => navigation.goBack()}
                            headerTitle={'Khutbah'}
                            backgroundColor="transparent"
                            iconColor="#ffffff"
                            textColor="#ffffff"
                            fontWeight={"500"}
                        />
                        <View style={{ position: "absolute", bottom: 20, marginHorizontal: 17 }}>
                            <Text style={styles.headerTitle}>Khutbah</Text>
                            <Text style={styles.headerSubtitle}>
                                Stay spiritually connected with curated Khutbahs.
                            </Text>
                        </View>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    headerContainer: {
        height: 220,
        position: 'relative',
    },
    headerImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25
    },
    headerTitle: {
        color: '#fff',
        fontSize: scale(28),
        fontWeight: '600',
    },
    headerSubtitle: {
        color: '#ddd',
        fontSize: scale(14),
        marginTop: 5,
    },
});

export default KhutbahHeader;
