import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useLoading } from '../context/LoadingContext';
import NetworkService from '../services/NetworkService';

const NetworkStatusDemo = () => {
  const { setConnectivity } = useLoading();
  const [networkStatus, setNetworkStatus] = useState('Checking...');

  useEffect(() => {
    // Check current network status
    checkNetworkStatus();

    // Add listener for network changes
    const unsubscribe = NetworkService.addListener(isConnected => {
      setNetworkStatus(isConnected ? 'Connected' : 'Disconnected');
    });

    return () => unsubscribe();
  }, []);

  const checkNetworkStatus = async () => {
    const isConnected = await NetworkService.checkConnection();
    setNetworkStatus(isConnected ? 'Connected' : 'Disconnected');
  };

  // Simulate network disconnection
  const simulateOffline = () => {
    setConnectivity(true);
  };

  // Simulate network reconnection
  const simulateOnline = () => {
    setConnectivity(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Network Status Monitor</Text>
      
      <View style={styles.statusContainer}>
        <Text style={styles.label}>Current Status:</Text>
        <Text 
          style={[styles.status, 
            networkStatus === 'Connected' ? styles.connected : styles.disconnected
          ]}
        >
          {networkStatus}
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.offlineButton]} 
          onPress={simulateOffline}
        >
          <Text style={styles.buttonText}>Simulate Offline</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.onlineButton]} 
          onPress={simulateOnline}
        >
          <Text style={styles.buttonText}>Simulate Online</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.note}>
        Note: This component allows you to test the network connectivity monitoring.
        In a real app, the connectivity status would be determined automatically.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    marginRight: 10,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  connected: {
    backgroundColor: '#DFFBE3',
    color: '#34C759',
  },
  disconnected: {
    backgroundColor: '#FFE4E1',
    color: '#FF3B30',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  offlineButton: {
    backgroundColor: '#FF3B30',
  },
  onlineButton: {
    backgroundColor: '#34C759',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default NetworkStatusDemo;