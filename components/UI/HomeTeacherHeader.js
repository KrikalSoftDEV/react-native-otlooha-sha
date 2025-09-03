import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Image,
    ImageBackground,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


const HomeTeacherHeader = () => {
    return (
        <ImageBackground
            source={{
                uri: 'https://img.freepik.com/free-photo/abstract-blur-empty-green-gradient-studio-well-use-as-backgroundwebsite-templateframebusiness-report_1258-52607.jpg?semt=ais_incoming&w=740&q=80',
            }}
            style={styles.headerContainer}
        >
            <Text style={styles.title}>Teacher Dashboard</Text>

            <View style={styles.bellContainer}>
                <FontAwesome5 name={'bell'} size={22} color={"black"} />
                <View style={styles.badge}>
                    <Text style={styles.badgeText}>1</Text>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: StatusBar.currentHeight,
        width: '100%',
        height: 120,
        backgroundColor: '#1C4532',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: '600',
        color: '#fff',
    },
    bellContainer: {
        position: 'relative',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        width: 40,
        borderRadius: 20,
    },
    bellIcon: {
        width: 22,
        height: 22,
    },
    badge: {
        position: 'absolute',
        top: 6,
        right: 6,
        backgroundColor: '#CF596F',
        borderRadius: 10,
        width: 13,
        height: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 7,
        fontWeight: 'bold',
    },
});

export default HomeTeacherHeader;