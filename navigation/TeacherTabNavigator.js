import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { Image, Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scale } from 'react-native-size-matters';

// Screens
import AsatizahAIScreen from '../screens/asatizahAI/asatizahAI';
import DonationTypeList from '../screens/donation/DonationTypeList';
import ProfileScreen from '../screens/profile/Profile';
import QuranScreen from '../screens/quran/Quran';

import PrayerTimeScreen from '../screens/prayer/PrayerTimeScreen';
import QueryTable from '../screens/query/Query';
{/* <Stack.Screen name="PrayerTimeScreen" component={PrayerTimeScreen} /> */ }

import HomeTeacher from '../screens/home/HomeTeacher'

// SVG Icons

import LinearGradient from 'react-native-linear-gradient';
import Colors from '../constants/Colors';
import TeacherRecitations from '../screens/TeacherRecitations/TeacherRecitations';

const Tab = createBottomTabNavigator();

const TeacherTabNavigator = () => {
    const insets = useSafeAreaInsets();

    return (

        <View style={{ flex: 1, backgroundColor: 'red' }} >
            <Tab.Navigator
                initialRouteName="Home"

                screenOptions={{
                    tabBarStyle: [
                        styles.tabBar,
                        { height: insets?.bottom + 70 }
                        // {height: insets?.bottom > 24 ? verticalScale(110) : verticalScale(100), paddingTop: STATUSBAR_HEIGHT}
                    ],
                    tabBarActiveTintColor: Colors.colorWhite,
                    tabBarInactiveTintColor: '#A0A3BD',
                    tabBarLabelStyle: styles.tabLabel,
                    headerShown: false,
                }}
            >
                <Tab.Screen
                    name="Home"
                    component={HomeTeacher}
                    options={{
                        tabBarIcon: ({ color, size, focused }) => (
                            <Image
                                source={require('../assets/images/TeacherTab/homeTabIcon.png')}
                                style={[styles.bannerImage, focused ? { tintColor: '#FFFFFF' } : { tintColor: "#A0A3BD" }]}
                                resizeMode="cover"
                            />
                        ),
                    }}
                />
                <Tab.Screen
                    name="Recitations"
                    component={TeacherRecitations}
                    options={{
                        tabBarIcon: ({ color, size, focused }) => (
                            <Image
                                source={require('../assets/images/TeacherTab/recitationsTabIcon.png')}
                                style={[styles.bannerImage, focused ? { tintColor: '#FFFFFF' } : { tintColor: "#A0A3BD" }]}
                                resizeMode="cover"
                            />
                        ),
                    }}
                />

                <Tab.Screen
                    name="Profile"
                    component={ProfileScreen}
                    options={{
                        tabBarIcon: ({ color, size, focused }) => (
                            <Image
                                source={require('../assets/images/Homescreen/profile.png')}
                                style={[styles.bannerImage, focused ? { tintColor: '#FFFFFF' } : { tintColor: "#A0A3BD" }]}
                                resizeMode="cover"
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        </View>

    );
};

const styles = StyleSheet.create({
    tabBar: {
        height: Platform.OS === 'ios' ? scale(80) : scale(80),
        // paddingBottom: Platform.OS === 'ios' ? scale(20) : scale(8),
        // paddingBottom:Platform.OS === 'ios'?0:NAVIGATIONBAR_HEIGHT*2,
        paddingTop: scale(8),
        backgroundColor: '#1E7B51',
        borderTopWidth: 1,
        borderTopColor: '#ffffffff',
    },
    tabLabel: {
        fontSize: scale(10),
        marginTop: 6,
        fontWeight: '600',
        // lineHeight:22
    },
    donationButton: {
        width: 68,
        height: 68,
        borderRadius: 34,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: -30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    shadowWrapper: {
        shadowColor: '#1aff76ff',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10, // For Android shadow
        backgroundColor: 'transparent',
        shadowOffset: { width: 0, height: 4 },
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: -8,
    },
    circle: {
        width: 68,
        height: 68,
        borderRadius: 34,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bannerImage: {
        width: 32,
        height: 32,
    },
});

export default TeacherTabNavigator;
