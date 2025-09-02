import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  Easing,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import BookMarkBlankBlack from '../../assets/images/Common/BookMark_blank_black.svg';
import SettingIcon from '../../assets/images/Common/settingIcon.svg';
import BookMark_gray from '../../assets/images/Common/BookMark_gray.svg';
import PlayListIcon from '../../assets/images/Common/playListIcon.svg';
import SaveBookmark from '../../assets/images/Common/saveBookmark.svg';
import PlayPuaseListIcon from '../../assets/images/Common/playPuaseListIcon.svg';
import ArrowDownIcon from '../../assets/images/Common/arrow_down.svg';
import Circle_fill from '../../assets/images/Common/Circle_fill.png';


const { width } = Dimensions.get('window');
const ITEM_HEIGHT = 65;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS + 50 ;

export default function MalaBeadsScroll({beadCountCalculation, handleCount, targetCount, count,setShowCompletionModal, showCompletionModal}) {
  const generateBeadData = () => {
    const beads = [];
    for (let i = 1; i <= 8; i++) {
      beads.push({
        id: i,
        value: i,
        label: `Bead ${i}`,
      });
    }
    return beads;
  };

  const [beadData] = useState(generateBeadData());
  const [selectedBead, setSelectedBead] = useState(54);

  const [selectedIndex, setSelectedIndex] = useState(53);
  const scrollViewRef = useRef(null);
  const scrollAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }, 100);
  }, []);

  useEffect(() => {
    const listenerId = scrollAnim.addListener(({ value }) => {
      const index = Math.round(value / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(index, beadData.length - 1));
      if (clampedIndex !== selectedIndex) {
        setSelectedIndex(clampedIndex);
        setSelectedBead(beadData[clampedIndex].value);
      }
    });
    return () => {
      scrollAnim.removeListener(listenerId);
    };
  }, [selectedIndex]);

  const handleMomentumScrollEnd = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, beadData.length - 1));
    scrollViewRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });
  };

  const scrollToBead = (index) => {
    const yOffset = index * ITEM_HEIGHT;
    Animated.timing(scrollAnim, {
      toValue: yOffset,
      duration: 1200,
      easing: Easing.inOut(Easing.exp),
      useNativeDriver: false,
    }).start(() => {
      scrollViewRef.current?.scrollTo({
        y: yOffset,
        animated: false,
      });
    });
  };

  const renderBeadItem = (bead, index) => {
    const isSelected = index === selectedIndex;
    const isAdjacent = Math.abs(index - selectedIndex) === 1;
    const distance = Math.abs(index - selectedIndex);

    let scale = 1;
    let opacity = 1;

    if (isSelected) {
      scale = 1.3;
      opacity = 1;
    } else if (isAdjacent) {
      scale = 1.1;
      opacity = 0.8;
    } else if (distance === 2) {
      scale = 0.9;
      opacity = 0.6;
    } else {
      scale = 0.7;
      opacity = 0.4;
    }
    // BookMarkBlankBlack from '../../assets/images/Common/BookMark_blank_black.svg';
    // import SettingIcon from '../../assets/images/Common/settingIcon.svg';
    // import BookMark_gray from '../../assets/images/Common/BookMark_gray.svg';
    // import PlayListIcon from '../../assets/images/Common/playListIcon.svg';
    // import SaveBookmark from '../../assets/images/Common/saveBookmark.svg';
    // import PlayPuaseListIcon
    return (
      <TouchableOpacity
        key={bead.id}
        style={[
          styles.beadItem,
          {
            transform: [{ scale }],
            opacity,
            marginBottom: isSelected ? 50 : 0,

          }
        ]}
        onPress={
          () => { 
              beadCountCalculation();
              scrollToBead(selectedIndex+1)
            }
            
          //   if (targetCount === 0 && count == targetCount) {
          //     // setShowCompletionModal(true)

              
          //     return;
          //   }
          //  if(targetCount == 0){
          //   onPress()
          //  }
           
          //  else{
          //   scrollToBead(selectedIndex+1)
          //    handleCount()
          //  }
          }
      >
         <Image source={Circle_fill} height={48} width={48} style={{height:55, width:55}} />
      </TouchableOpacity>
    );
  };

  const getBeadDescription = (beadNumber) => {
    if (beadNumber === 1) return "🌟 Starting bead - Begin your journey";
    if (beadNumber === 54) return "🎯 Center bead - Perfect balance";
    if (beadNumber === 108) return "✨ Final bead - Completion achieved";
    return `Progress: ${Math.round((beadNumber / 108) * 100)}% complete`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.wheelContainer, ]}>
        <Animated.ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingVertical: PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2  - 30,}
          ]}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollAnim } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={handleMomentumScrollEnd}
          scrollEventThrottle={16}
          snapToInterval={ITEM_HEIGHT}
          snapToAlignment="center"
          decelerationRate={0.5}
          alwaysBounceVertical={true}
          overScrollMode='always'
        >
          {beadData.map((bead, index) => renderBeadItem(bead, index))}
        </Animated.ScrollView>

        {/* <View style={styles.selectionIndicator} /> */}
        <View style={styles.selectionIndicatorBottom} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,},
  wheelContainer: {
    height: PICKER_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  scrollView: { flex: 1 },
  scrollContent: { alignItems: 'center' },
  beadItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    width: width - 40,
  },
  beadCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  beadNumber: { fontWeight: '500' },
  selectionIndicator: {
    position: 'absolute',
    top: PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#8b5cf6',
    opacity: 0.3,
  },
  selectionIndicatorBottom: {
    position: 'absolute',
    top: PICKER_HEIGHT / 2 + ITEM_HEIGHT / 2 - 30,
    left: 100,
    right: 0,
    height: 58,
    width:4,
    backgroundColor: '#000',
    // opacity: 0.3,
    alignSelf:'center'
  },
  quickNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  navButton: {
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
  },
  navButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  infoContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8b5cf6',
    marginBottom: 5,
  },
  infoDescription: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    lineHeight: 18,
  },
});
