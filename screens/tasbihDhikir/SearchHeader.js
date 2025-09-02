import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import LeftArrow from '../../assets/images/Common/left_gray_arrow.png'; // Replace with your icon path
import CloseIcon from '../../assets/images/Common/close_gray.png';     // Replace with your icon path
import { STATUSBAR_HEIGHT } from '../../constants/Dimentions';

const SearchHeader = ({ title, onBackPress, onClear, setSearchQuery, searchQuery }) => {
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={onBackPress}>
                <Image source={LeftArrow} style={styles.icon} />
            </TouchableOpacity>
            <TextInput
                style={styles.input}
                placeholder="Search"
                value={searchQuery}
                onChangeText={setSearchQuery}
                placeholderTextColor={"#88909E"}
            />
            <TouchableOpacity onPress={onClear}>
                <Image source={CloseIcon} style={styles.crossIcon} />
            </TouchableOpacity>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        margin: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F0F2F7',
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical:Platform.OS==='android'?0:18,
        // height: 50,
        justifyContent: 'space-between',
        // paddingTop:STATUSBAR_HEIGHT
    },
    icon: {
        width: 12,
        height: 15,
        resizeMode: 'contain',
    },
    crossIcon: {
        width: 12,
        height: 12,
        resizeMode: 'contain',
    },
    input: {
        flex: 1,
        paddingHorizontal: 12,
        fontSize: 17,
        fontWeight: '400',
        color: '#181B1F',
        flex: 1,
        textAlign: "left",
    },
});

export default SearchHeader;
