import React, { useRef, } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    StatusBar,
    Animated,
    Platform
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import HeaderImageCarousel from '../../screens/common/HeaderImageCarousel';
import Header from './Header';
import { verticalScale } from 'react-native-size-matters';

const HEADER_MAX_HEIGHT = Platform.OS === "android" ? 280 : 360;
const HEADER_MIN_HEIGHT = 10;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

const AnimatedBannerHeader = ({
    title,
    subTitle,
    searchActivePress,
    headerCarouselImages,
    scrollY
}) => {
    const navigation = useNavigation();

    const headerTranslate = scrollY.interpolate({
        inputRange: [0, HEADER_SCROLL_DISTANCE],
        outputRange: [0, -HEADER_SCROLL_DISTANCE],
        extrapolate: 'clamp',
    });

    const compactHeaderOpacity = scrollY.interpolate({
        inputRange: [HEADER_SCROLL_DISTANCE - 50, HEADER_SCROLL_DISTANCE],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    return (
        <View>
            <Animated.View
                pointerEvents="box-none"
                style={[
                    styles.compactHeader,
                    {
                        opacity: compactHeaderOpacity,
                        transform: [
                            {
                                translateY: scrollY.interpolate({
                                    inputRange: [HEADER_SCROLL_DISTANCE - 50, HEADER_SCROLL_DISTANCE],
                                    outputRange: [-20, 0],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.compactHeaderContent}>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Ionicons name="arrow-back" size={24} color="#111827" />
                    </TouchableOpacity>

                    <Text style={styles.compactHeaderTitle}>{title}</Text>

                    {title !== "Khutbah" ? <TouchableOpacity onPress={searchActivePress}>
                        <Ionicons name="search" size={22} color="#111827" />
                    </TouchableOpacity> : <View style={{ width: 24 }} />}
                </View>
            </Animated.View>

            <Animated.View
                style={[
                    styles.header,
                    {
                        transform: [{ translateY: headerTranslate }],
                    },
                ]}
            >
                <HeaderImageCarousel
                    data={headerCarouselImages}
                    height={280}
                    showPagination={false}
                    autoPlay={false}
                />
                <View style={styles.headerContent}>
                    <Header
                        onBackPress={() => {
                            navigation.goBack();
                        }}
                        headerTitle={title}
                        backgroundColor="transparent"
                        iconColor="#ffffff"
                        textColor="#ffffff"
                        leftIcon={title !== "Khutbah" ? <Ionicons name="search" size={24} color="#ffffff" /> : null}
                        onPressLeft={searchActivePress}
                    />
                    <Animated.View style={[styles.headerTextContainer]}>
                        <Text style={styles.headerMainTitle}>{title}</Text>
                        <Text style={styles.headerSubtitle}>
                            {subTitle}
                        </Text>
                    </Animated.View>
                </View>
            </Animated.View>
        </View>
    );

};


export default AnimatedBannerHeader;

const styles = StyleSheet.create({
    compactHeader: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 2000,
        // paddingTop: StatusBar.currentHeight || 42,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#e5e7eb',
        shadowColor: '#000',
        // shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        // elevation: 3,
    },

    compactHeaderContent: {
        height: 60,
        paddingTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        backgroundColor: "#fff",
        marginTop : Platform.OS === 'android'? verticalScale(8): verticalScale(30)
    },

    compactHeaderTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#111827',
        textAlign: 'center',
        flex: 1,
    },

    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 280,
        zIndex: 1000,
    },

    headerContent: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingTop : Platform.OS === 'android'? verticalScale(30): verticalScale(40)
    },

    headerTextContainer: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 15,
        marginTop: 45,
    },
    headerMainTitle: {
        fontSize: 24,
        fontWeight: '700',
        lineHeight: 22,
        color: 'white',
        marginBottom: 8,
    },
    headerSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.9)',
        lineHeight: 24,
    },
});
