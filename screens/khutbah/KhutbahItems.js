import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    Pressable,
    Animated,
    Easing,
} from 'react-native';
import moment from 'moment';
import { scale } from 'react-native-size-matters';
import Svg, { Circle } from 'react-native-svg';

import PDFIcon from "../../assets/images/Khutbah/pdf-icon-red.png";
import DownloadIcon from "../../assets/images/Khutbah/download-blue-icon.png";
import SuccessIcon from "../../assets/images/Khutbah/success-green-icon.png";
import AnimatedCircle from './AnimatedCircle';

const KhutbahItems = ({
    item,
    index,
    isDownloading,
    isDownloaded,
    handleDownload,
    downloadProgress,
    onPressItem
}) => {
    const radius = 22;
    const circumference = 2 * Math.PI * radius;
    // const strokeDashoffset = circumference * (1 - 50);
    const animatedStroke = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (isDownloading) {
            animatedStroke.stopAnimation();
            Animated.timing(animatedStroke, {
                toValue: 0.9,
                duration: 1000,
                easing: Easing.out(Easing.exp),
                useNativeDriver: false,
            }).start();
        } else {
            animatedStroke.setValue(0);
        }
    }, [isDownloading]);

    const strokeDashoffset = animatedStroke.interpolate({
        inputRange: [0, 1],
        outputRange: [circumference, 0],
    });


    return (
        <Pressable style={styles.itemContainer} onPress={onPressItem}>
            <Image source={PDFIcon} style={styles.pdfIcon} />
            <View style={styles.textContainer}>
                <Text style={styles.itemName} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.itemDate}>
                    {moment(item.date || new Date()).format('DD MMM YYYY')}
                </Text>
            </View>
            <TouchableOpacity onPress={handleDownload} disabled={isDownloading}>
                <View style={styles.downloadWrapper}>
                    {isDownloading ? (
                        <View style={styles.progressWrapper}>
                            <Svg height="50" width="50">
                                <AnimatedCircle
                                    cx="25"
                                    cy="25"
                                    r={radius}
                                    stroke="#ECEBFD"
                                    strokeWidth="4"
                                    fill="none"
                                />
                                <AnimatedCircle
                                    cx="25"
                                    cy="25"
                                    r={radius}
                                    stroke="#5756C8"
                                    strokeWidth="2"
                                    fill="none"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    rotation="-90"
                                    origin="25,25"
                                />
                            </Svg>
                            <Image source={DownloadIcon} style={styles.downloadIcon} />
                        </View>
                    ) : (
                        <View style={[
                            styles.downloadContainer,
                            isDownloaded ? styles.successBox : styles.defaultBox
                        ]}>
                            <Image
                                source={isDownloaded ? SuccessIcon : DownloadIcon}
                                style={styles.downloadIcon}
                            />
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: scale(10),
        borderBottomWidth: scale(1),
        borderBottomColor: "#DDE2EB",
        marginBottom: scale(10),
    },
    pdfIcon: {
        width: scale(37),
        height: scale(38),
        resizeMode: 'contain',
        marginRight: scale(12),
    },
    textContainer: {
        flex: 1,
    },
    itemName: {
        fontSize: scale(16),
        fontWeight: '500',
        color: '#181B1F',
    },
    itemDate: {
        fontSize: scale(14),
        fontWeight: '400',
        color: '#686E7A',
        marginTop: 2,
    },
    downloadWrapper: {
        width: scale(50),
        height: scale(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    downloadContainer: {
        width: scale(40),
        height: scale(40),
        borderRadius: scale(22),
        justifyContent: "center",
        alignItems: "center",
        overflow: 'hidden',
    },
    defaultBox: {
        backgroundColor: '#ECEBFD',
    },
    successBox: {
        borderWidth: scale(2.5),
        borderColor: '#3BC47D',
        backgroundColor: "#FFF"
    },
    downloadIcon: {
        width: scale(19),
        height: scale(19),
        resizeMode: 'contain',
        position: 'absolute',
    },
    progressWrapper: {
        width: scale(50),
        height: scale(50),
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
});

export default KhutbahItems;
