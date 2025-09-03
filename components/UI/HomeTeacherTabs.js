import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

// create a component
const HomeTeacherTabs = () => {
    return (
        <>
            <View style={styles.reciteWrapper}>
                <Text style={styles.headerText}>Pending Recitations</Text>
                <View style={styles.reciteInnerWrapper}>
                    <Text style={styles.reciteText}>12</Text>
                    <Image source={require('../../assets/images/clock.png')} style={{ height: 25, width: 25 }} />
                </View>
            </View>
            <View style={styles.mainWrapper}>
                <View style={styles.wrapper}>
                    <Text style={styles.headerText}>Responded Today</Text>
                    <View style={styles.innerWrapper}>
                        <Text style={styles.text}>05</Text>
                        <Image source={require('../../assets/images/starCheck.png')} style={{ height: 25, width: 25 }} />
                    </View>
                </View>

                <View style={styles.wrapper}>
                    <Text style={styles.headerText}>Average Rating</Text>
                    <View style={styles.innerWrapper}>
                        <Text style={styles.text}>4.8</Text>
                        <Image source={require('../../assets/images/star.png')} style={{ height: 25, width: 25 }} />
                    </View>
                </View>
            </View>
        </>
    );
};

// define your styles
const styles = StyleSheet.create({
    reciteWrapper: {
        marginTop: 20,
        borderRadius: 12,
        padding: 12,
        height: 72,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    reciteInnerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    reciteText: {
        fontSize: 20,
        fontWeight: 600,
    },
    mainWrapper: {
        flexDirection: 'row',
        alignContent: 'space-between',
        gap: 10,
        alignItems: 'center',
        marginTop: 10,
        height: 72,
    },
    wrapper: {
        flex: 1,
        borderRadius: 12,
        padding: 12,
        height: 72,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    innerWrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        color: '#686E7A',
        fontSize: 14,
    },
    text: {
        fontSize: 20,
        fontWeight: 600,
    },
});

export default HomeTeacherTabs;