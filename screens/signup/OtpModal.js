import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';
import React, { useState } from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const OtpVerifyScreen = () => {
  const route = useRoute();
  const email = route.params?.email || '';
  const role = route.params?.role || '';
  const [otp, setOtp] = useState('');

     const navigation = useNavigation();


     console.log('Role from role otpverify:', role);



  const handleOtpSubmit = async () => {
    if (otp.length !== 4) {
      Alert.alert('Error', 'Please enter a 4-digit OTP.');
      return;
    }

    try {
      const response = await axios.post(
        'http://31.97.206.49:3001/api/user/verify/otp',
        {
          email,
          role: role.trim().toLowerCase(),
          otp,
        },
      );
      
      if (response.status === 200) {
        Alert.alert(
          'Success',
          response.data.message || 'OTP verified successfully!',
        );
        const data = response.data.data || {};
         navigation.navigate('Login', { data });
        // You can navigate to the next screen here
      } else {
        Alert.alert('Error', 'Unexpected server response.');
      }
    } catch (error) {
      console.error(
        'OTP Verify Error:',
        error?.response?.data || error.message,
      );
      const message =
        error?.response?.data?.message || 'OTP verification failed.';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter 4-digit OTP</Text>
      <TextInput
        placeholder="Enter OTP"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={4}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleOtpSubmit}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 18,
    letterSpacing: 10,
  },
  button: {
    backgroundColor: '#6c8029',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default OtpVerifyScreen;
