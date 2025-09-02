import React from 'react';
import {
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale, verticalScale } from 'react-native-size-matters';
import ProfileIcon from '../../assets/images/Common/profileicon.svg';
import Header from '../../components/UI/Header';

const ProfileHeaderSection = ({
    title,
    onPress,
    userName,
    location
}) => {

    return (
        <View>
            <LinearGradient
                colors={['#6c8029', '#6c8029', '#6c8029']}
                style={styles.gradientBackground}
            >
                <SafeAreaView />
                <Header
                    onBackPress={onPress}
                    headerTitle={title}
                    backgroundColor="transparent"
                    iconColor="#ffffff"
                    textColor="#ffffff"
                    fontWeight="500"
                />
            </LinearGradient>
            <SafeAreaView />
            <View style={styles.profileInfoContainer}>
                <View style={styles.avatarContainer}>
                    <ProfileIcon />
                </View>
                <Text style={styles.userName} numberOfLines={1} >
                    {userName}
                </Text>
                {location && <Text style={styles.userLocation}>{location}</Text>}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    gradientBackground: {
        // position: "relative",
        paddingTop: Platform.OS == 'android' ? verticalScale(30) : 0,
        height: verticalScale(150),
        // zIndex: -1,
    },
    profileInfoContainer: {
        width: "100%",
        marginTop: '-10%',
        alignItems: 'center',
        marginBottom: verticalScale(15),
    },
    avatarContainer: {
        width: scale(80),
        height: scale(80),
        borderRadius: scale(40),
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: verticalScale(10),
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,

    },
    userName: {
        fontSize: scale(20),
        fontWeight: '600',
        color: '#181B1F',
        marginBottom: verticalScale(4),
        marginHorizontal: scale(16),
        textAlign: 'justify'
    },
    userLocation: {
        fontSize: scale(13),
        color: '#464B54',
    },
});

export default ProfileHeaderSection;
