import React, { useRef, useState, useCallback } from 'react';
import { View, Animated, FlatList, StyleSheet, Dimensions, TouchableOpacity, Alert } from 'react-native';
import Colors from '../../constants/Colors';
import Header from '../../components/UI/Header';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const Pagination = ({ data, scrollX, paginationContainer }) => {
  return (
    <View style={[styles.paginationContainer, paginationContainer]}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [8, 24, 8],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: paginationContainer ? [0.8, 1, 0.8] : [0.3, 1, 0.3],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            key={i}
            style={[
              styles.dot,
              { width: dotWidth, opacity }
            ]}
          />
        );
      })}
    </View>
  );
};

const HeaderImageCarousel = ({
  data,
  height = 220,
  autoPlay = false,
  autoPlayInterval = 4000,
  showPagination = true,
  onIndexChange,
  imageKey = 'image',
  backIconShow = false,
  paginationContainer,
  ...props
}) => {
  const navigation = useNavigation()
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef();
  const [index, setIndex] = useState(0);

  // Auto-play logic
  React.useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      let nextIndex = (index + 1) % data.length;
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [index, autoPlay, autoPlayInterval, data.length]);

  const handleOnScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: scrollX } } }],
    { useNativeDriver: false }
  );

  const handleOnViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (viewableItems[0]) {
      setIndex(viewableItems[0].index);
      if (onIndexChange) onIndexChange(viewableItems[0].index);
    }
  }, [onIndexChange]);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };

  return (
    <View style={{ height, borderBottomRightRadius: 24, borderBottomLeftRadius: 24, overflow:'hidden' }}>
      {backIconShow && <View style={styles.headerContent}>
    <Header
      onBackPress={() => {
        navigation.goBack();
      }}
      backgroundColor="transparent"
      iconColor="#fff"
      leftIcon={
        <TouchableOpacity onPress={() => {}}></TouchableOpacity>
      }
    />
    </View>}
      <FlatList
        ref={flatListRef}
        data={data}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) =>{ 
          return(
          <Animated.Image
            source={typeof item[imageKey] === 'number' ? item[imageKey] : imageKey ? { uri: item[imageKey] } : {uri: item}}
            style={[
              { width, height, resizeMode: 'stretch'},
            ]}
            accessibilityLabel={item.accessibilityLabel || 'carousel image'}
          />
        )}}
        onScroll={handleOnScroll}
        onViewableItemsChanged={handleOnViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        {...props}
      />
      {showPagination && <Pagination data={data} scrollX={scrollX} paginationContainer={paginationContainer} />}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: 16,
    alignSelf: 'center',
    zIndex: 10,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor:Colors.colorWhite,
    marginHorizontal: 4,
  },
   headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: 44,
    // zIndex:1000
    // paddingHorizontal: 20,
  },
});

export default HeaderImageCarousel; 