
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    StyleSheet,
    Animated,
    Easing,
    Image,
    Text,
    Pressable,
    TouchableOpacity,
} from 'react-native';
import PearlImg from '../../assets/images/Dua/pearl-img.png';

const RosaryPearlsRotator = ({ beadCountCalculation }) => {
    const [activeIndex, setActiveIndex] = useState(2);
    const [pearlData, setPearlData] = useState([0, 1, 2, 3, 4, 5, 6, 7]);
    const [visibleRange, setVisibleRange] = useState(2)
    const [extraOffset, setExtraOffset] = useState(6)
    const [showExtraOffset, setShowExtraOffset] = useState(false);
    const [extraKey, setExtraKey] = useState(0);

    const throttleRef = useRef(false);
    const handleTap = () => {
        if (throttleRef.current) return;
        throttleRef.current = true;

        setShowExtraOffset(true);
        setExtraKey(prev => prev - 1);
        setExtraOffset(3);
        beadCountCalculation();

        setTimeout(() => {
            setExtraOffset(6);
        }, 200);

        setActiveIndex((prev) => (prev - 1 + pearlData.length) % pearlData.length);

        setTimeout(() => {
            throttleRef.current = false;
        }, 800);
    };

    const getVisibleItems = () => {
        const items = [];
        for (let i = -visibleRange; i <= visibleRange; i++) {
            let index = (activeIndex + i + pearlData.length) % pearlData.length;
            items.push({ key: `${index}`, value: pearlData[index], offset: i });
        }
        return items;
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity activeOpacity={1} onPress={handleTap} style={styles.touchableAreaContainer}>
                <View style={styles.stack}>
                    {getVisibleItems().map(({ key, offset }, i) => (
                        <View
                            key={key}
                            style={[
                                styles.itemWrapper,
                                { marginBottom: i === 2 ? 30 : -5 },
                            ]}
                        >
                            <Pearl offset={offset} index={i} showLine={offset === 0} />
                        </View>
                    ))}
                    {showExtraOffset && (
                        <Pearl key={`extra-${extraKey}`} offset={extraOffset} index={99} extra />
                    )}
                </View>
            </TouchableOpacity>
        </View>
    );
};

const Pearl = ({ offset, showLine, index, extra }) => {
    const getSize = () => {
        switch (Math.abs(offset)) {
            case 0: return 80;
            case 1: return 62;
            case 2: return 43;
            case 3: return 38;
            case 6: return 0;
            default: return 35;
        }
    };

    const getOpacity = () => {
        switch (Math.abs(offset)) {
            case 0: return 1;
            case 1: return 0.6;
            case 2: return 0.2;
            case 3: return 0.1;
            case 6: return 0;
            default: return 0.1;
        }
    };

    const animatedSize = useState(new Animated.Value(getSize()))[0];
    const animatedOpacity = useState(new Animated.Value(getOpacity()))[0];

    useEffect(() => {
        if (extra && offset === -2) {
            animatedOpacity.setValue(0);
            animatedSize.setValue(30);
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(animatedOpacity, {
                        toValue: .3,
                        duration: 1500,
                        easing: Easing.in(Easing.exp),
                        useNativeDriver: false,
                    }),
                    Animated.timing(animatedSize, {
                        toValue: 0,
                        duration: 1500,
                        easing: Easing.in(Easing.exp),
                        useNativeDriver: false,
                    }),
                ]),
            ]).start();
        } else if (offset === -2) {
            animatedSize.setValue(20);
            Animated.parallel([
                Animated.sequence([
                    Animated.timing(animatedSize, {
                        toValue: getSize(),
                        duration: 2000,
                        easing: Easing.out(Easing.exp),
                        useNativeDriver: false,
                    }),
                    Animated.timing(animatedOpacity, {
                        toValue: getOpacity(),
                        duration: 2000,
                        easing: Easing.out(Easing.exp),
                        useNativeDriver: false,
                    }),
                ]),
            ]).start();
        }
        else {
            Animated.parallel([
                Animated.timing(animatedSize, {
                    toValue: getSize(),
                    duration: 2000,
                    easing: Easing.out(Easing.exp),
                    useNativeDriver: false,
                }),
                Animated.timing(animatedOpacity, {
                    toValue: getOpacity(),
                    duration: 2000,
                    easing: Easing.out(Easing.exp),
                    useNativeDriver: false,
                }),
            ]).start();
        }
    }, [offset]);

    return (
        <Animated.View
            style={[
                styles.pearlWrapper,
                {
                    width: animatedSize,
                    height: animatedSize,
                    opacity: animatedOpacity,
                },
            ]}
        >
            {showLine && <Animated.View style={[styles.verticalLine, { opacity: animatedOpacity, }]} />}
            <Image source={PearlImg} style={styles.pearlImage} resizeMode="contain" />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height:"100%"
    },
    touchableAreaContainer:{
        width:"100%",
        height:'100%',
        justifyContent:"center",
        alignItems:"center",
        paddingVertical:40,
    },
    stack: {
        position: "relative",
        justifyContent: 'center',
        alignItems: 'center',
    },
    itemWrapper: {
        alignItems: 'center',
        position: 'relative',
        paddingVertical: 0,
    },
    verticalLine: {
        position: 'absolute',
        top: '95%',
        height: 40,
        width: 5,
        backgroundColor: '#2E1D63',
        zIndex: -1,
    },
    pearlWrapper: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,
        shadowColor: '#7A5CF0',
        shadowOpacity: 0.4,
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 12,
        elevation: 8,
        backgroundColor: 'transparent',
        overflow: 'visible',
    },
    pearlImage: {
        width: '100%',
        height: '100%',
        borderRadius: 100,
    },
});

export default RosaryPearlsRotator;
