import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
  // FlatList
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';

const { height: screenHeight } = Dimensions.get('window');

const ITEM_HEIGHT = 45;
const VISIBLE_ITEMS = 5;

const PrayerModal = ({
  visible,
  onClose,
  onSelect,
  renderData,
  type,
  selectedItem
}) => {
  const [translateY] = useState(new Animated.Value(0));
  const scrollY = useRef(new Animated.Value(0)).current;
  const listRef = useRef(null);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const handleGestureStateChange = (event) => {
    const { translationY, velocityY, state } = event.nativeEvent;

    if (state === State.END) {
      const shouldClose = translationY > 100 || velocityY > 500;
      if (shouldClose) {
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onClose();
          translateY.setValue(0);
        });
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const handleMomentumScrollEnd = (e) => {
    setIsScrolling(false);
    const offsetY = e.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    setTimeout(() => {
      onSelect(renderData[index], type);
    }, 150)

  };

  const renderWheelItem = ({ item, index }) => {
    const inputRange = [
      (index - 2) * ITEM_HEIGHT,
      (index - 1) * ITEM_HEIGHT,
      index * ITEM_HEIGHT,
      (index + 1) * ITEM_HEIGHT,
      (index + 2) * ITEM_HEIGHT,
    ];

    const scale = scrollY.interpolate({
      inputRange,
      outputRange: [0.75, 0.85, 1, 0.85, 0.75],
      extrapolate: 'clamp',
    });

    const opacity = scrollY.interpolate({
      inputRange,
      outputRange: [0.3, 0.6, 1, 0.6, 0.3],
      extrapolate: 'clamp',
    });

    const handlePress = () => {
      listRef.current?.scrollToOffset({
        offset: index * ITEM_HEIGHT,
        animated: true,
      });
      onSelect(item, type);
    };

    return (
      <TouchableOpacity activeOpacity={1} onPress={handlePress}>
        <Animated.View
          style={[
            styles.prayerItem,
            { transform: [{ scale }], opacity },
            selectedItem === item && !isScrolling && {
              borderBottomWidth: 1,
              borderTopWidth: 1, borderColor: '#CCCCCC'
            },
          ]}
        >
          <Text style={styles.prayerText}>{item}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
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
          <View style={styles.mainContainer}>
            <PanGestureHandler
              onGestureEvent={handleGestureEvent}
              onHandlerStateChange={handleGestureStateChange}
            >
              <Animated.View style={styles.dragHeader}>
                <View style={styles.dragIndicator} />
              </Animated.View>
            </PanGestureHandler>
            <View style={styles.content}>
              <Text style={styles.title}>{type === "prayer" ? "Prayer Times" : "Pre-Azan Reminder"}</Text>
              <Text style={styles.subtext}>{type === "prayer" ? "Select prayer to adjust notification settings" : "Select notification time"}</Text>

          {/* {renderData?.map((item, index) => (
            <TouchableOpacity key={index} style={[styles.prayerItem, item === selectedItem && styles.activePrayerContent]} onPress={() => onSelect(item, type)}>
              <Text style={[styles.prayerText, item === selectedItem && styles.activePrayer]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))} */}

{/* custom animated whirler */}
           <View style={{ height: ITEM_HEIGHT * VISIBLE_ITEMS }}>
                <Animated.FlatList
                  ref={listRef}
                  data={renderData}
                  keyExtractor={(item, index) => index.toString()}
                  showsVerticalScrollIndicator={false}
                  bounces={false}
                  snapToInterval={ITEM_HEIGHT}
                  decelerationRate="fast"
                  onScrollBeginDrag={() => setIsScrolling(true)}

                  contentContainerStyle={{
                    paddingVertical: (ITEM_HEIGHT * (VISIBLE_ITEMS - 1)) / 2,
                  }}
                  onMomentumScrollEnd={handleMomentumScrollEnd}
                  onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: true }
                  )}
                  getItemLayout={(data, index) => ({
                    length: ITEM_HEIGHT,
                    offset: ITEM_HEIGHT * index,
                    index,
                  })}
                  initialScrollIndex={renderData.indexOf(selectedItem)}
                  renderItem={renderWheelItem}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  mainContainer: {
    flex: 1,
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    backgroundColor: '#FFF',
    maxHeight: screenHeight * 0.95,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  modalContainer: {
    // backgroundColor: '#fff',
    // borderTopLeftRadius: 16,
    // borderTopRightRadius: 16,
    // paddingTop: 10,
    // paddingBottom: 20,
    // paddingHorizontal: 16,
    flex: 1,
    backgroundColor: '#00000066',
    
  },
  content: {
    backgroundColor: '#fff',
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    overflow: 'hidden',
    paddingBottom:100
  },
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
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prayerText: {
    fontSize: 20,
    color: '#16191C',
    fontWeight: '00',
  },
});

export default PrayerModal;



// import React, { useState } from 'react';
// import { View, Text, Modal, TouchableOpacity, StyleSheet, Dimensions, Animated } from 'react-native';
// import {
//   GestureHandlerRootView,
//   PanGestureHandler,
//   State,
// } from 'react-native-gesture-handler';
// const { height: screenHeight } = Dimensions.get('window');
// const PrayerModal = ({
//   visible,
//   onClose,
//   onSelect,
//   renderData,
//   type,
//   selectedItem
// }) => {
//    const [translateY] = useState(new Animated.Value(0));

//    const handleGestureEvent = Animated.event(
//        [{ nativeEvent: { translationY: translateY } }],
//        { useNativeDriver: true }
//      );

//      const handleGestureStateChange = (event) => {
//        const { translationY, velocityY, state } = event.nativeEvent;

//        if (state === State.END) {
//          const shouldClose = translationY > 100 || velocityY > 500;
//          if (shouldClose) {
//            Animated.timing(translateY, {
//              toValue: screenHeight,
//              duration: 300,
//              useNativeDriver: true,
//            }).start(() => {
//              onClose();
//              translateY.setValue(0);
//            });
//          } else {
//            Animated.spring(translateY, {
//              toValue: 0,
//              useNativeDriver: true,
//            }).start();
//          }
//        }
//      };

//   return (
//     <Modal
//       animationType="slide"
//       transparent
//       visible={visible}
//       onRequestClose={onClose}
//     >
//         <GestureHandlerRootView style={styles.overlay}>
//               <Animated.View
//                 style={[
//                   styles.modalContainer,
//                   {
//                     transform: [
//                       {
//                         translateY: translateY.interpolate({
//                           inputRange: [0, screenHeight],
//                           outputRange: [0, screenHeight],
//                           extrapolate: 'clamp',
//                         }),
//                       },
//                     ],
//                   },
//                 ]}
//               >
//         <View style={styles.mainContainer}>
//           {/* <TouchableOpacity style={{ marginBottom: 5, paddingVertical: 10 }} onPress={onClose}>
//             <View style={styles.dragHandle} />

//           </TouchableOpacity> */}
//           <PanGestureHandler
//                         onGestureEvent={handleGestureEvent}
//                         onHandlerStateChange={handleGestureStateChange}
//                       >
//                         <Animated.View style={styles.dragHeader}>
//                           <View style={styles.dragIndicator} />
//                         </Animated.View>
//                       </PanGestureHandler>
//                       <View style={styles.content}>
//           <Text style={styles.title}>{type === "prayer" ? "Prayer Times" : "Pre-Azan Reminder"}</Text>
//           <Text style={styles.subtext}>{type === "prayer" ? "Select prayer to adjust notification settings" : "Select notification time"}</Text>

//           {renderData?.map((item, index) => (
//             <TouchableOpacity key={index} style={[styles.prayerItem, item === selectedItem && styles.activePrayerContent]} onPress={() => onSelect(item, type)}>
//               <Text style={[styles.prayerText, item === selectedItem && styles.activePrayer]}>
//                 {item}
//               </Text>
//             </TouchableOpacity>
//           ))}
//           </View>
//         </View>
//        </Animated.View>
//             </GestureHandlerRootView>
//     </Modal>
//   );
// };

// const styles = StyleSheet.create({
//   overlay: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     // backgroundColor: 'rgba(0,0,0,0.5)'
//   },
//     mainContainer: {
//       flex: 1,
//     borderTopRightRadius: 36,
//     borderTopLeftRadius: 36,
//     backgroundColor: '#FFF',
//     maxHeight: screenHeight * 0.95,
//     overflow: 'hidden',
//     position: 'absolute',
//     bottom: 0,
//     width: '100%',
//   },
//   modalContainer: {
//     // backgroundColor: '#fff',
//     // borderTopLeftRadius: 16,
//     // borderTopRightRadius: 16,
//     // paddingTop: 10,
//     // paddingBottom: 20,
//     // paddingHorizontal: 16,
//      flex: 1,
//     backgroundColor: '#00000066',

//   },
//    content: {
//     // flex: 1,
//     backgroundColor: '#fff',
//     borderTopRightRadius: 36,
//     borderTopLeftRadius: 36,
//     overflow: 'hidden',
//     paddingBottom:100
//   },
//   dragHandle: {
//     width: 66,
//     height: 6,
//     borderRadius: 3,
//     backgroundColor: '#3C3C434D',
//     alignSelf: 'center',
//   },
//   title: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: "#181B1F",
//     textAlign: 'center'
//   },
//   subtext: {
//     fontSize: 12,
//     textAlign: 'center',
//     color: '#686E7A',
//     fontWeight: "500",
//     marginTop: 5,
//     marginBottom: 20
//   },
//   prayerItem: {
//     paddingVertical: 10,
//     alignItems: 'center',
//   },
//   prayerText: {
//     fontSize: 16,
//     color: '#AEAEAE',
//   },
//   activePrayer: {
//     fontSize: 20,
//     color: '#16191C',
//     fontWeight: 'bold'
//   },
//   activePrayerContent: {
//     borderBottomWidth: 1,
//     borderTopWidth: 1,
//     borderColor: "#CCCCCC"
//   },
//    dragHeader: {
//     paddingVertical: 10,
//   },
//   dragIndicator: {
//     width: 66,
//     height: 5,
//     backgroundColor: '#3C3C434D',
//     borderRadius: 2,
//     alignSelf: 'center',
//   },
// });

// export default PrayerModal;
