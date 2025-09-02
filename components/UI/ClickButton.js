import React from 'react';
import {Text, StyleSheet, TouchableOpacity, View} from 'react-native';
import Colors from '.././../constants/Colors';
import {scale} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';

export const ClickButton = props => {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      style={[styles.container, props.style]}>
      <View style={styles.gradientView}>
        <Text style={styles.buttonText}>{props.tittle}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {height: scale(48), width: '88%', alignSelf: 'center'},
  gradientView: {
    borderColor:"#DDE2EB",
    borderWidth:1,
    backgroundColor: 'white',
    flex: 1,
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {fontSize: scale(18), lineHeight:22, fontWeight: '600', color: '#181B1F'},
});
