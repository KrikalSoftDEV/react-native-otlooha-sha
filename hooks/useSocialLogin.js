import { useState } from 'react';
import { Platform, Alert } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { getData, storeData } from '../constants/Storage';

export default function useSocialLogin({ onLogin, toast }) {
  const [loading, setLoading] = useState(false);

  // Google Sign-In Handler
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      await GoogleSignin.hasPlayServices();
      const googleUser = await GoogleSignin.signIn();
      const userInfo = googleUser?.data || googleUser;
      setLoading(false);
      console.log('-=-=-=-=-userInfo',userInfo?.user?.givenName, userInfo?.user,);
      if (onLogin) onLogin({ email: userInfo?.user?.email,  name: userInfo?.user
            ? `${userInfo?.user?.givenName || ''} ${userInfo?.user.familyName || ''}`.trim()
            : '', provider: 'google', user: userInfo });
      
      
    } catch (error) {
      setLoading(false);
      if (toast) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          toast.show('Google sign-in cancelled', { type: 'danger' });
        } else if (error.code === statusCodes.IN_PROGRESS) {
          toast.show('Google sign-in in progress', { type: 'danger' });
        } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          toast.show('Google Play Services not available', { type: 'danger' });
        } else {
          toast.show('Google sign-in error', { type: 'danger' });
        }
      } else {
        Alert.alert('Google sign-in error');
      }
    }
  };

  // Apple Sign-In Handler
  const handleAppleSignIn = async () => {
    try {
      setLoading(true);
      const storedAppleData = await getData('aapleData');
      if (storedAppleData) {
        setLoading(false);
        if (onLogin) onLogin({
          email: storedAppleData?.email,
          name: storedAppleData?.fullName
            ? `${storedAppleData?.fullName?.givenName || ''} ${storedAppleData?.fullName?.familyName || ''}`.trim()
            : '',
          provider: 'apple',
          user: storedAppleData,
        });
      } else {
        const appleAuthRequestResponse = await appleAuth.performRequest({
          requestedOperation: appleAuth.Operation.LOGIN,
          requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
        });
        const { email, fullName } = appleAuthRequestResponse;
        await storeData('aapleData', appleAuthRequestResponse);
        setLoading(false);
        if (onLogin) onLogin({
          email,
          name: fullName
            ? `${fullName?.givenName || ''} ${fullName?.familyName || ''}`.trim()
            : '',
          provider: 'apple',
          user: appleAuthRequestResponse,
        });
      }
    } catch (error) {
      setLoading(false);
      if (toast) {
        toast.show('Apple sign-in error', { type: 'danger' });
      } else {
        Alert.alert('Apple sign-in error');
      }
    }
  };

  // Facebook login placeholder
  const handleFacebookSignIn = () => {
    Alert.alert('Facebook login functionality coming soon!');
  };
const handleGoogleLogout = async () => {
  try {
    await GoogleSignin.signOut();
    console.log('Google user signed out successfully');

    // Optional: Clear your app's user state here
    // e.g., setUser(null);

    // Show a message or navigate to login screen
  } catch (error) {
    console.error('Error signing out from Google:', error);
  }
};

  return {
    handleGoogleSignIn,
    handleAppleSignIn,
    handleFacebookSignIn,
    handleGoogleLogout,
    loading,
  };
} 