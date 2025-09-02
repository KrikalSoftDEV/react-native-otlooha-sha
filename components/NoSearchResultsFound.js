import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { scale } from 'react-native-size-matters';

const NoSearchResultsFound = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>No Results Found</Text>
      <Text style={styles.subtitle}>
        We couldn't find any matches for your search. Please try different keywords.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: scale(20),
    marginTop: scale(20),
  },
  title: {
    fontSize: scale(18),
    fontWeight: '600',
    color: '#181B1F',
    marginBottom: scale(8),
  },
  subtitle: {
    fontSize: scale(14),
    color: '#88909E',
    textAlign: 'center',
    lineHeight: scale(20),
  },
});

export default NoSearchResultsFound; 