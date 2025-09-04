//Screen.tsx

import React from 'react';
import { SafeAreaView, View, Text, StyleSheet, Image, ImageBackground, StatusBar } from 'react-native';
import HomeTeacherHeader from '../../components/UI/HomeTeacherHeader';
import HomeTeacherTabs from '../../components/UI/HomeTeacherTabs';
import RecitationCard from '../../components/UI/RecitationCard';
import { useIsFocused } from '@react-navigation/native';

const HomeTeacher = () => {
    const isFocused = useIsFocused()
    return (
        <View>
            {isFocused && <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />}

            <HomeTeacherHeader />
            <View style={styles.container}>
                <HomeTeacherTabs />
                <Text style={styles.text}>Recitaitons List</Text>
                <RecitationCard id="2" surah="Demo Surah Name" status="Pending" />
                <RecitationCard id="5" surah="Demo Surah Name" status="Re-Recorded" />

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: '600',
        marginTop: 20,
        marginBottom: 10,
    },

});

export default HomeTeacher;