import React, { useEffect, useState } from 'react';
import {View, StyleSheet, ActivityIndicator, Animated, Text} from 'react-native';
import {useLoading} from '../../context/LoadingContext';
import ErrorModal from '../ErrorModal';

const EnhancedAppLoader = () => {
  const {isLoading, isProcessing, connectivityIssue, flickerAnimation} = useLoading();

  if (!isLoading && !isProcessing && !connectivityIssue) return null;
const [networkModal, setNetworkModal]=useState(false)

useEffect(()=>{
  if(connectivityIssue){
    setNetworkModal(true)
  }else{
     setNetworkModal(false)
  }
},[connectivityIssue])
  return (

    <Animated.View
      style={[styles.screen, connectivityIssue && styles.connectivityIssue, {opacity: flickerAnimation}]}>
      
        {connectivityIssue ? (
          <ErrorModal visible={networkModal} onClose={() => {}} type={connectivityIssue?"network":"error" }/>
        ) : (
          <View style={styles.loaderContainer}>
          <ActivityIndicator
            size={'large'}
            style={styles.loader}
            color="#007AFF"
          />
           </View>
        )}
     
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  screen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  loaderContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  loader: {
    alignSelf: 'center',
  },
  connectivityIssue: {
    backgroundColor: "#00000066"
  },
  connectivityText: {
    marginTop: 10,
    color: '#FF3B30',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EnhancedAppLoader;