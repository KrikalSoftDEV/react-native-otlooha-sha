import React from 'react';
import {Text, StyleSheet} from 'react-native';
import Colors from '.././../constants/Colors';

export const TitleText = props => {
  return (
    <Text
      adjustsFontSizeToFit={true}
      maxFontSizeMultiplier={1}
      style={[styles.titleText, props.style]}>
      {props.children}
    </Text>
  );
};

export const SubText = props => {
  return (
    <Text
      // adjustsFontSizeToFit={true}
      maxFontSizeMultiplier={1}
      style={[styles.subText, props.style]}
      numberOfLines={props.numberOfLines}
      ellipsizeMode="tail">
      {props.children}
    </Text>
  );
};

export const BoldText = props => {
  return (
    <Text
      adjustsFontSizeToFit={true}
      maxFontSizeMultiplier={1}
      style={[styles.boldText, props.style]}>
      {props.children}
    </Text>
  );
};

export const SemiBoldText = props => {
  return (
    <Text
      adjustsFontSizeToFit={true}
      maxFontSizeMultiplier={1}
      style={[styles.semiBoldText, props.style]}>
      {props.children}
    </Text>
  );
};

export const ErrorText = props => {
  return (
    <Text
      adjustsFontSizeToFit={true}
      maxFontSizeMultiplier={1}
      style={[styles.errorText, props.style]}>
      {props.children}
    </Text>
  );
};
export const SubText_14_400 = props => {
  return (
    <Text
      // adjustsFontSizeToFit={true}
      maxFontSizeMultiplier={1}
      style={[styles.subText, props.style]}
      numberOfLines={props.numberOfLines}
      ellipsizeMode="tail">
      {props.children}
    </Text>
  );
};

const styles = StyleSheet.create({
  titleText: {
    fontSize: 17,
    color: Colors.PrimaryBlack,
  },

  subText: {
    fontSize: 18,
    color: Colors.PrimaryBlack,
  },
  boldText: {
    fontSize: 17,
    color: Colors.PrimaryBlack,
    fontWeight: 'bold',
  },
  semiBoldText: {
    fontSize: 17,
    color: Colors.PrimaryBlack,
    fontWeight: '600',
  },

  errorText: {
    fontSize: 14,
    color: Colors.errorTxt,
  },
});
