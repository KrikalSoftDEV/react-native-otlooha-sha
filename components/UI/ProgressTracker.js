import React from 'react';
import {View, Text, StyleSheet, Dimensions} from 'react-native';
import {verticalScale} from 'react-native-size-matters';

const ProgressTracker = ({
  currentStep = 1,
  totalSteps = 4,
  stepText = 'STEP',
  title = '',
  description = '',
}) => {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <View style={styles.container}>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, {width: `${progress}%`}]} />
      </View>
      <Text style={styles.stepText}>
        {stepText} {currentStep}/{totalSteps}
      </Text>
      <Text style={styles.title}>{title}</Text>
    {description &&  <Text style={styles.description}>{description}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 7,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    width: '78%'
  },
  progressBarBackground: {
    height: 5,
    backgroundColor: '#DDE2EB',
    borderRadius: 100,
    overflow: 'hidden',
    marginHorizontal: 30,
  },
  progressBarFill: {
    height: 5,
    backgroundColor: '#272682',
  },
  stepText: {
    fontSize: 12,
    color: '#88909E',
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
    marginTop: verticalScale(34),
  },
  title: {
    textAlign: 'center',
    marginBottom: 8,
    fontSize: 18,
    fontWeight: '600',
    color: '#181B1F',
  },
  description: {
    textAlign: 'center',
    fontSize: 13,
    fontWeight: '400',
    color: '#464B54',
  },
});

export default ProgressTracker;
