import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale } from 'react-native-size-matters';

export const WelcomeButton = props => {
  const showLoader = !!props.loading;
  return (
    <TouchableOpacity
      onPress={props.onPress}
      disabled={props.disabled}
      style={[styles.container, props.style]}>
      {showLoader ? (
        <View
          style={[
            styles.gradientView,
            { opacity: props.disabled ? 0.6 : 1, backgroundColor: '#3937A4' },
          ]}>
          <ActivityIndicator size="small" color="#FFF" style={styles.loader} />
        </View>
      ) : (
        <LinearGradient
          colors={['#191967', '#3937A4', '#5756C8']}
          style={[
            styles.gradientView,
            { opacity: props.disabled ? 0.6 : 1 }
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}>
          <Text style={[styles.buttonText, props.titleStyle]}>{props.tittle}</Text>
        </LinearGradient>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    height: scale(48),
    width: '88%',
    alignSelf: 'center'
  },
  gradientView: {
    flex: 1,
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: scale(48),
  },
  buttonText: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#fff',
  },
  loader: {
    alignSelf: 'center',
  },
});