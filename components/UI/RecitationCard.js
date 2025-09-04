import React, { Component } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'

const RecitationCard = ({ id, surah, status }) => {
    return (
        <View style={styles.container}>
            <View style={styles.idContainer}>
                <Text style={styles.text}>Recitaiton ID: {id}</Text>
                <Text style={[styles.text, styles.statusText]}>{status}</Text>
            </View>
            <Text style={styles.headerText}>{surah}</Text>
            <Text style={styles.text}>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla minima
                deleniti tenetur?
            </Text>
            <View style={styles.calenderContainer}>
                <Ionicons name={"calendar-number"} size={15} color={'black'} />
                <Text style={[styles.text, { fontStyle: 'italic' }]}> 25-11-2025</Text>
            </View>
        </View>
    );
};

// define your styles
const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        padding: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    idContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerText: {
        fontSize: 18,
        fontWeight: 600,
    },
    statusText: {
        backgroundColor: '#fad9d9ff',
        color: '#D90022',
        paddingHorizontal: 7,
        paddingVertical: 2,
        fontSize: 14,
        fontWeight: 400,
        borderRadius: 4,
    },
    text: {
        color: '#686E7A',
    },
    calenderContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginTop: 2,
    },
});

export default RecitationCard;