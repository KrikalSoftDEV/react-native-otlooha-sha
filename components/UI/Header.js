import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import backArrow from '../../assets/images/Common/backArrow.png';
import Colors from '../../constants/Colors';
import { scale } from 'react-native-size-matters';

const screenHeight = Dimensions.get('window').height;
const Header = ({
  onBackPress,
  headerTitle,
  borderVisible,
  backgroundColor = Colors.colorWhite, // default
  textColor = '#181B1F',                // default
  iconColor = '#181B1F',
  onPressLeft,
  leftIcon,
  borderWidth = 0.33    ,          // default
  containerStyle,
  fontWeight,
  headerTextMargin
}) => {
  const onBackPressinHeader = () => {
    onBackPress && onBackPress();
  };

  return (
    <View
      style={[
       
        styles.header,
     
        { backgroundColor },
        borderVisible && {
          borderBottomColor: Colors.blueGray,
          borderBottomWidth: borderWidth,
          
        },
        containerStyle,
        
      ]}>
      <View style={styles.alignContaitner}>
        <TouchableOpacity
          style={styles.imageContainer}
          onPress={onBackPressinHeader}>
          <Image source={backArrow} style={[styles.image, { tintColor: iconColor, }]} />
        </TouchableOpacity>
        <View style={[styles.textContainer,headerTextMargin&&{marginRight:30}]}>
          <Text style={[styles.text, { color: textColor ,fontWeight:fontWeight}]}>{headerTitle}</Text>
        </View>
       
        {leftIcon ? (
  <TouchableOpacity
    style={[styles.rightIconStyle,]}
    onPress={onPressLeft}>
    {leftIcon}
  </TouchableOpacity>
) : (
  <View style={styles.imageContainer} />
)}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    zIndex:999,
    height: screenHeight * 0.05,
    backgroundColor: Colors.colorWhite,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: { flex: 1, justifyContent: 'center', alignItems: 'center',},
  text: {
    color: "#181B1F",

    fontSize: scale(16),
    fontWeight: '500',
    // fontFamily: 'Inter',
  },
  imageContainer: {
    height: scale(40),
    width: scale(40),
    justifyContent: 'center',
    alignItems: "center",
    // paddingHorizontal:40

  },
  rightIconStyle:{
    paddingRight:16,
justifyContent: 'center',
    alignItems: "center",
  },
  image: {
    resizeMode: "contain",
    height: 20,
    width: 20,
  },
  alignContaitner: {
    flex: 1,
    flexDirection: 'row',
    alignItems: "center"
  },
});

export default Header;
