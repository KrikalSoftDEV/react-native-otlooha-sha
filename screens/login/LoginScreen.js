import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';
import { loginAsGuest, loginUser } from '../../redux/slices/authSlice'; // imported loginAsGuest

import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const LoginScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [hidePassword, setHidePassword] = useState(true);

  const { loading, user, token, error } = useSelector((state) => state.auth);

  // const loginHandle = () => {
  //   if (!email || !password) {
  //     Alert.alert('Validation Error', 'Please fill in all fields');
  //     return;
  //   }

  //   dispatch(loginUser({ email, password, role }))
  //     .unwrap()
  //     .then((res) => {


  //       console.log('Login Success:', res);
  //       Alert.alert('Success', 'Login successfully', [
  //         {
  //           text: 'OK',
  //           onPress: () => navigation.navigate('TabNavigation'),
  //         },
  //       ]);
  //     })
  //     .catch((err) => {
  //       Alert.alert('Error', err?.message || 'Something went wrong');
  //     });
  // };






const loginHandle = () => {
  if (!email || !password) {
    Alert.alert('Validation Error', 'Please fill in all fields');
    return;
  }

  dispatch(loginUser({ email, password, role }))
    .unwrap()
    .then(async (res) => {
      console.log('Login Success:', res.data.role);


      if(res.data.role === 'teacher') {
        Alert.alert('Success', 'Login as teacher successfully ,Teacher verification pending', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('#'),
          },
        ]);
        return
      }

      // On successful login, get the token from response
      const token = res?.data?.token;

      if (!token) {
        Alert.alert('Error', 'Token not found after login');
        return;
      }

      try {
        // Call the profile API with the token to get user profile
        const profileResponse = await fetch(
          "http://31.97.206.49:3001/api/user/get/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Profile Response Status:', profileResponse);

        if (!profileResponse.ok) {
          throw new Error('Failed to fetch profile');
        }

        const profileData = await profileResponse.json();

        console.log('Profile Data:', profileData);

        // Check if QuranType exists and is not empty
        const quranType = profileData?.data?.QuranType;

        if (quranType && quranType.trim() !== '') {
          Alert.alert('Success', 'Login successful', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('TabNavigation'),
            },
          ]);
        } else {
          Alert.alert('Success', 'Please complete your profile', [
            {
              text: 'OK',
              onPress: () => navigation.navigate('ProfileAuth'),
            },
          ]);
        }
      } catch (error) {
        Alert.alert('Error', error.message || 'Something went wrong while fetching profile');
      }
    })
    .catch((err) => {
      Alert.alert('Error', err?.message || 'Something went wrong during login');
    });
};








  const loginAsGuestHandler = () => {
    dispatch(loginAsGuest());
    Alert.alert('Success', 'Login as guest successfully', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('TabNavigation'),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome to Otlooha</Text>
      <Text style={styles.subtitle}>Connect, learn, and grow together</Text>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.inactiveTab}>
          <Text
            style={styles.inactiveTabText}
            onPress={() => navigation.navigate('SignUp_2')}
          >
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>

      {/* Role Buttons */}
      <View style={styles.roleContainer}>
        <TouchableOpacity
          style={[styles.roleBox, role === 'user' && styles.selectedRole]}
          onPress={() => setRole('user')}
        >
          <Text style={styles.roleIcon}>🎓</Text>
          <Text style={styles.roleText}>I’m a Student</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.roleBox, role === 'teacher' && styles.selectedRole]}
          onPress={() => setRole('teacher')}
        >
          <Text style={styles.roleIcon}>👨‍🏫</Text>
          <Text style={styles.roleText}>I’m a Teacher</Text>
        </TouchableOpacity>
      </View>

      {/* Login Form */}
      <View style={styles.formBox}>
        <Text style={styles.label}>Email address</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="Your@gmail.com"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
          />
          <Icon name="mail-outline" size={20} color="#ccc" />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="****"
            style={styles.input}
            secureTextEntry={hidePassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setHidePassword(!hidePassword)}>
            <Icon
              name={hidePassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#ccc"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.forgotButton}>
          <Text style={styles.forgotText}>Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={loginHandle}>
          <Text style={styles.loginBtnText}>Login</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.signupText}>
        Don’t have an account?
        <Text
          style={styles.signupLink}
          onPress={() => navigation.navigate('SignUp_2')}
        >
          Sign up here
        </Text>
      </Text>

      {/* Guest Login Button */}
      <TouchableOpacity
        style={[styles.loginBtn, { backgroundColor: '#aaa', marginTop: 10 }]}
        onPress={loginAsGuestHandler}
      >
        <Text style={styles.loginBtnText}>Continue as Guest</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default LoginScreen;

// existing styles unchanged (omit here for brevity)


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 30,
    textAlign: 'center',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5,
    justifyContent: 'center',
    marginVertical: 10,
  },
  activeTab: {
    backgroundColor: '#6c8029',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  inactiveTab: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  inactiveTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  roleBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginHorizontal: 5,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roleIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  roleText: {
    fontWeight: '600',
  },
  formBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    marginTop: 10,
    color: '#333',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 14,
  },
  forgotButton: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  forgotText: {
    color: '#6c8029',
    fontSize: 13,
  },
  loginBtn: {
    backgroundColor: '#6c8029',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
  },
  loginBtnText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signupText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#555',
  },
  signupLink: {
    color: '#6c8029',
    fontWeight: 'bold',
  },
    selectedRole: {
    borderColor: '#6c8029',
    borderWidth: 2,
  },
});
