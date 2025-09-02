import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';

const Signup_2 = () => {
  const navigation = useNavigation();
  const [hidePass, setHidePass] = useState(true);
  const [hideConfirmPass, setHideConfirmPass] = useState(true);

  // Form fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('user');

  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      Alert.alert('Validation Error', 'Please fill in all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        'http://31.97.206.49:3001/api/user/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            password,
            confirmPassword,
            role,
            firstName,
            lastName,
          }),
        },
      );

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        Alert.alert('Success', 'Account created successfully', [
          {
            text: 'OK',
            onPress: () => navigation.navigate('email_submit_screen', { email , role}),
          },
        ]);
      } else {
        Alert.alert('Error', data.message || 'Something went wrong');
      }
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Network error');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}  >Welcome to Otlooha</Text>
      <Text style={styles.subtitle}>Connect, learn, and grow together</Text>

      <View style={styles.tabContainer}>
              <TouchableOpacity style={styles.inactiveTab}>
                <Text style={styles.inactiveTabText} onPress={() => navigation.navigate('Login')}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity  style={styles.activeTab}>
                <Text style={styles.activeTabText}>Sign Up</Text>
              </TouchableOpacity>
            </View>

      {/* Role Selection */}
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
      <View style={styles.formBox}>
        <View style={styles.row}>
          <View style={styles.inputWrapperTest}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              placeholder="Jone"
              style={styles.inputHalf}
              value={firstName}
              onChangeText={setFirstName}
            />
            {/* <Icon name="mail-outline" size={20} color="#ccc" /> */}
          </View>
          <View style={styles.inputWrapperTest}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              placeholder="Doe"
              style={styles.inputHalf}
              value={lastName}
              onChangeText={setLastName}
            />
            {/* <Icon name="mail-outline" size={20} color="#ccc" /> */}
          </View>
        </View>
        <Text style={styles.label}>Email Address</Text>
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
            secureTextEntry={hidePass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setHidePass(!hidePass)}>
            <Icon
              name={hidePass ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#ccc"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputWrapper}>
          <TextInput
            placeholder="****"
            style={styles.input}
            secureTextEntry={hideConfirmPass}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            onPress={() => setHideConfirmPass(!hideConfirmPass)}
          >
            <Icon
              name={hideConfirmPass ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#ccc"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginBtn} onPress={handleRegister}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>Create Account</Text>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.signupText}>
        Already have an account?{' '}
        <Text
          style={styles.signupLink}
          onPress={() => navigation.navigate('Login')}
        >
          Login
        </Text>
      </Text>
    </SafeAreaView>
  );
};
export default Signup_2;
const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20, backgroundColor: '#F4F4F4' },
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
  inputHalf: {
    flex: 1,
    width: '100%',
    height: 44,
    fontSize: 14,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#333',
    marginTop: 5,
  },
  inputWrapperTest: {
    width: '48%',
    height: 80,
    flexDirection: 'column',
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginBottom: 10,
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
  roleIcon: { fontSize: 28, marginBottom: 8 },
  roleText: { fontWeight: '600' },
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

  label: { fontSize: 14, marginTop: 10, color: '#333' },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginTop: 5,
  },
  input: { flex: 1, height: 44, fontSize: 14, border: '2px solid black' },
  hints: { marginTop: 8, marginBottom: 5 },
  hint: { fontSize: 12, color: '#777' },
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

   tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 5,
    justifyContent: 'center',
    marginVertical: 10,
  },
});
