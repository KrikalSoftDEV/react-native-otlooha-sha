import React from 'react';
import {View, Animated, useWindowDimensions, StyleSheet} from 'react-native';
import Colors from '../../constants/Colors';

const Pagination = ({data, scrollX, index}) => {
  const {width} = useWindowDimensions();

  return (
    <View style={[styles.paginationContainer]}>
      {data.map((_, idx) => {
        const inputRange = [(idx - 1) * width, idx * width, (idx + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [10, 40, 10],
          extrapolate: 'clamp',
        });

        const backgroundColor = scrollX.interpolate({
          inputRange,
          outputRange: [
            Colors.paginationIndicator,
            Colors.voilate,
            Colors.paginationIndicator,
          ],
          extrapolate: 'clamp',
        });
        

        console.log(idx, scrollX);
        return (
          <Animated.View
            key={idx.toString()}
            style={[styles.paginationDot, {width: dotWidth, backgroundColor}]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 12,
    backgroundColor: Colors.paginationIndicator,
    marginHorizontal: 2,
  },


   paginationDot: {
    // width: 1,
    height: 10,
    borderRadius: 70,
    backgroundColor: 'rgba(100, 100, 200, 0.5)', // Adjust to match your Colors.paginationIndicator
    marginHorizontal: 4,
  },
  paginationDotActive: {
    width: 40, // pill shape
    height: 16,
    borderRadius: 12,
    backgroundColor: '#4B4FCF', // Active color
    borderWidth: 2,
    borderColor: '#3FA9F5',
    marginHorizontal: 4,
  },
});
export default Pagination;
