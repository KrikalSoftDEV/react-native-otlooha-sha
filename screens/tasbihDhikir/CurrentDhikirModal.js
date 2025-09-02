import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Animated, ScrollView } from 'react-native';
import {
    GestureHandlerRootView,
    PanGestureHandler,
    State,
} from 'react-native-gesture-handler';
import { scale, verticalScale } from 'react-native-size-matters';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: screenHeight, width: screenWidth } = Dimensions.get('window');

const CurrentDhikirModal = ({
    isVisible = true,
    onClose,
    renderData = {}
}) => {
    const insets = useSafeAreaInsets();
    const [translateY] = useState(new Animated.Value(0));

    const [showAdditionalContent, setShowAdditionalContent] = useState(false)
    const handleGestureStateChange = (event) => {
        const { translationY, velocityY, state } = event.nativeEvent;

        if (state === State.END) {
            const shouldClose = translationY > 100 || velocityY > 500;
            if (shouldClose) {

                Animated.timing(translateY, {
                    toValue: screenHeight,
                    duration: 300,
                    useNativeDriver: true,
                }).start(({ finished }) => {
                    if (finished) {
                        // console.log("Animation finished");
                        if (renderData?.text) {
                            translateY.setValue(30);
                        } else {
                            onClose();
                            translateY.setValue(0);
                        }

                    }

                });
                setShowAdditionalContent(false);
            } else {
                setShowAdditionalContent(true);
                Animated.spring(translateY, {
                    toValue: 0,
                    useNativeDriver: true,
                }).start((toValue) => {
                    console.log("toValue", toValue);
                    if (toValue) {
                        setShowAdditionalContent(true);
                    }
                });
            }
        }
    };
    const handleGestureEvent = Animated.event(
        [{ nativeEvent: { translationY: translateY } }],
        { useNativeDriver: true }
    );

    return (
        <GestureHandlerRootView style={styles.overlay}>
            <Animated.View
                style={[
                    styles.animModalContainer,
                    {
                        transform: [
                            {
                                translateY: translateY.interpolate({
                                    inputRange: [0, screenHeight],
                                    outputRange: [0, screenHeight],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    },
                ]}
            >
                <View style={styles.modalContainer}>
                    <PanGestureHandler
                        onGestureEvent={handleGestureEvent}
                        onHandlerStateChange={handleGestureStateChange}
                    >
                        <Animated.View style={styles.dragHeader}>
                            <View style={styles.dragIndicator} />
                        </Animated.View>
                    </PanGestureHandler>
                    <Text style={styles.title}>Current Dhikir</Text>
                    {/* <View
                        style={[
                            styles.dikerContainer,
                    //  { paddingBottom: insets.bottom > 0 ? insets.bottom*5 : scale(10) }     
                        ]}
                    > */}
                    <ScrollView style={{ maxHeight: screenHeight * .35, flexGrow: 1 }}
                        contentContainerStyle={styles.dikerContainer
                        }
                    >
                        <Text style={styles.urduText}>
                            {renderData?.text ?? ''}
                        </Text>
                        {showAdditionalContent && <>
                            <Text style={{ color: '#464B54', fontSize: 16, fontWeight: "400", marginVertical: 10, textAlign: "center" }}>
                                {renderData?.translation ?? ''}
                            </Text>
                            <Text style={{ color: '#181B1F', fontSize: 16, fontWeight: "500", marginTop: 4, textAlign: "center" }}>
                                {renderData?.transliteration ?? ''}
                            </Text>
                        </>}
                    </ScrollView>
                    {/* </View> */}
                </View>
            </Animated.View>
        </GestureHandlerRootView>

    );
};

const styles = StyleSheet.create({
    dragHeader: {
        paddingVertical: 10,
    },
    dragIndicator: {
        width: 66,
        height: 5,
        backgroundColor: '#3C3C434D',
        borderRadius: 2,
        alignSelf: 'center',
    },
    overlay: {
        width: screenWidth,
        paddingVertical: 0,
        bottom: 0,
        position: "absolute",
        backgroundColor: 'transparent',
        // borderTopLeftRadius: 25,
        // borderTopRightRadius: 25,
    },
    modalContainer: {
        width: screenWidth,
        paddingHorizontal: 16,
        // bottom: 0,
        width: "100%",
        // position: "absolute",
        backgroundColor: '#fff',
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingTop: 10,
        paddingBottom: 20,

        shadowColor: '#000',
        shadowOffset: { width: 5, height: 6 },
        shadowOpacity: 0.7,
        shadowRadius: 10,
        elevation: 3,
    },
    animModalContainer: {
        width: "100%",
        //  paddingHorizontal: 16,
    },
    dikerContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 8,
        paddingBottom: verticalScale(25),
        textAlign: "center"
    },
    dragHandle: {
        width: 66,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#3C3C434D',
        alignSelf: 'center',
    },
    urduText: {
        color: '#181B1F',
        fontSize: 16,
        fontWeight: "500",
        textAlign: "center",
        writingDirection: 'rtl',
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        color: "#181B1F",
        textAlign: 'center'
    },
    subtext: {
        fontSize: 12,
        textAlign: 'center',
        color: '#686E7A',
        fontWeight: "500",
        marginTop: 5,
        marginBottom: 20
    },
    prayerItem: {
        paddingVertical: 10,
        alignItems: 'center',
    },
    prayerText: {
        fontSize: 16,
        color: '#AEAEAE',
    },
    activePrayer: {
        fontSize: 20,
        color: '#16191C',
        fontWeight: 'bold'
    },
    activePrayerContent: {
        borderBottomWidth: 1,
        borderTopWidth: 1,
        borderColor: "#CCCCCC"
    },
    closeButton: {
        backgroundColor: "#F0F2F7",
        alignItems: "center",
        justifyContent: "center",
        height: scale(30),
        width: scale(30),
        borderRadius: scale(25),
        position: "absolute",
        top: scale(10),
        right: scale(10),
    },
});

export default CurrentDhikirModal;









// import React, { useState } from 'react';
// import { View, Image, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';

// import CloseImg from "../../assets/images/close-icon.png"
// import { scale } from 'react-native-size-matters';

// const CurrentDhikirModal = ({
//     isVisible = true,
//     onClose,
//     renderData = {}
// }) => {
//     const [showAdditionalContent, setShowAdditionalContent] = useState(false)
//     return (
//         // <Modal
//         //     animationType="slide"
//         //     transparent
//         //     visible={isVisible}
//         //     onRequestClose={onClose}
//         // >
//         //     <View style={styles.overlay}>
//         <View style={styles.modalContainer}>
//             <TouchableOpacity style={{ marginBottom: 5, paddingVertical: 10 }} onPress={() => setShowAdditionalContent(prev => !prev)}>
//                 <View style={styles.dragHandle} />
//             </TouchableOpacity>
//             {/* <TouchableOpacity
//                 onPress={onClose}
//                 style={styles.closeButton}
//             >
//                 <Image source={CloseImg} style={StyleSheet.closeIcon} />
//             </TouchableOpacity> */}
//             <Text style={styles.title}>Current Dhikir</Text>
//             <View
//                 style={styles.dikerContainer}
//             >
//                 <Text style={styles.urduText}>
//                     {renderData?.text ?? ''}
//                 </Text>
//                 {showAdditionalContent && <>
//                     <Text style={{ color: '#464B54', fontSize: 16, fontWeight: "400", marginVertical: 10, textAlign: "center" }}>
//                         {renderData?.translation ?? ''}
//                     </Text>
//                     <Text style={{ color: '#181B1F', fontSize: 16, fontWeight: "500", marginTop: 4, textAlign: "center" }}>
//                         {renderData?.transliteration ?? ''}
//                     </Text>
//                 </>}
//             </View>
//         </View>
//         //     </View>
//         // </Modal>
//     );
// };

// const styles = StyleSheet.create({
//     overlay: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         backgroundColor: 'rgba(0,0,0,0.5)'
//     },
//     modalContainer: {
//         bottom: 0,
//         width: "100%",
//         position: "absolute",
//         backgroundColor: '#fff',
//         borderTopLeftRadius: 25,
//         borderTopRightRadius: 25,
//         paddingTop: 10,
//         paddingBottom: 20,
//         paddingHorizontal: 16,
//         shadowColor: '#000',
//         shadowOffset: { width: 5, height: 6 },
//         shadowOpacity: 0.7,
//         shadowRadius: 10,
//         elevation: 3,
//     },
//     dikerContainer: {
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginVertical: 8,
//         paddingBottom:25,
//         textAlign: "center"
//     },
//     dragHandle: {
//         width: 66,
//         height: 6,
//         borderRadius: 3,
//         backgroundColor: '#3C3C434D',
//         alignSelf: 'center',
//     },
//     urduText: {
//         color: '#181B1F',
//         fontSize: 16,
//         fontWeight: "500",
//         textAlign: "center",
//         writingDirection: 'rtl',
//     },
//     title: {
//         fontSize: 16,
//         fontWeight: '600',
//         color: "#181B1F",
//         textAlign: 'center'
//     },
//     subtext: {
//         fontSize: 12,
//         textAlign: 'center',
//         color: '#686E7A',
//         fontWeight: "500",
//         marginTop: 5,
//         marginBottom: 20
//     },
//     prayerItem: {
//         paddingVertical: 10,
//         alignItems: 'center',
//     },
//     prayerText: {
//         fontSize: 16,
//         color: '#AEAEAE',
//     },
//     activePrayer: {
//         fontSize: 20,
//         color: '#16191C',
//         fontWeight: 'bold'
//     },
//     activePrayerContent: {
//         borderBottomWidth: 1,
//         borderTopWidth: 1,
//         borderColor: "#CCCCCC"
//     },
//     closeButton: {
//         backgroundColor: "#F0F2F7",
//         alignItems: "center",
//         justifyContent: "center",
//         height: scale(30),
//         width: scale(30),
//         borderRadius: scale(25),
//         position: "absolute",
//         top: scale(10),
//         right: scale(10),
//     },
// });

// export default CurrentDhikirModal;



