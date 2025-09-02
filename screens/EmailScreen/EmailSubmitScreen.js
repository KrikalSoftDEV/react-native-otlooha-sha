// EmailSubmitScreen.js
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

const EmailSubmitScreen = () => {
  const route = useRoute();
  const availableEmail = route.params?.email || '';
  

  const role = route.params?.role || '';
  const [email, setEmail] = useState(availableEmail);

  console.log('Email from route:', availableEmail);
  console.log('Role from route:', role);

   const navigation = useNavigation();


  const handleEmailSubmit = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    try {
      const response = await axios.post(
        'http://31.97.206.49:3001/api/user/email/otp',
        {
          email: email.trim().toLowerCase(),
          role: role.trim().toLowerCase(),
        },
      );

      if (response.status === 200) {
        Alert.alert('Success', response.data.message || 'OTP sent to email.');
         navigation.navigate('OtpModalExample' ,{email , role});
      } else {
        Alert.alert('Error', 'Unexpected server response.');
      }
    } catch (error) {
      console.error('OTP API error:', error?.response?.data || error.message);
      const message = error?.response?.data?.message || 'Failed to send OTP.';
      Alert.alert('Error', message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Confirm Your Email</Text>
      <TextInput
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TouchableOpacity style={styles.button} onPress={handleEmailSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
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
  },
  button: {
    backgroundColor: '#6c8029',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});

export default EmailSubmitScreen;
