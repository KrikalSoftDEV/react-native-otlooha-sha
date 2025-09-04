import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Image,
    ImageBackground,
    TouchableOpacity,
} from 'react-native';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'


const HomeTeacherHeader = () => {
    return (

        <View style={styles.headerContainer}>
            <View style={styles.bgImgContainer}>
                <Image source={require("../../assets/images/teacherHeaderbg.png")} style={styles.img} resizeMode='cover' />
            </View>
            <View style={styles.headerDetails}>
                <Text style={styles.title}>Teacher Dashboard</Text>
                <TouchableOpacity style={styles.bellContainer}>
                    <FontAwesome5 name={'bell'} size={22} color={"black"} />
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>1</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>


    );
};

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: StatusBar.currentHeight,
        width: '100%',
        height: 140,
        backgroundColor: '#1C4532',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // paddingHorizontal: ,
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
    bgImgContainer: {
        width: '50%',
        height: 140,
        position: 'absolute',
        right: 0
    },
    img: {
        height: '100%',
        width: '100%'
    },
    headerDetails: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: '5%',
        paddingBottom: 10
    }
});

export default HomeTeacherHeader;