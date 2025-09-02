/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Provider } from 'react-redux';
import { LoadingProvider } from './context/LoadingContext';
import { store as rawStore } from './redux/store';

import { StripeProvider } from '@stripe/stripe-react-native';
import { ToastProvider } from 'react-native-toast-notifications';
import TabNavigator from './navigation/TabNavigator';
import AsatizahAIScreen from './screens/asatizahAI/asatizahAI';
import PaymentScreen from './screens/donation/PaymentScreen';
import HomeScreen from './screens/home/HomeScreen';
import NotificationCenter from './screens/home/NotificationCenter';
import NotificationDetail from './screens/home/NotificationDetail';
import ProfileAbout from './screens/home/ProfileAbout';
import OnboardingScreen from './screens/onboarding/OnboardingScreen';
import EditProfile from './screens/profile/EditProfile';
import QuranScreen from './screens/quran/Quran';
import Signup_2 from './screens/signup/Sign_2';
import Signup from './screens/signup/Signup';
import Otp_success from './screens/signup/SuccessScreen';
import SplashScreen from './screens/splash/SplashScreen';
// import TasbihScreen from './screens/quran/TasbihScreen';
import AppNetworkModal from './components/UI/AppNetworkModal';
import AllFeaturesScreen from './screens/allFeatures/AllFeaturesScreen';
import LoginScreen from './screens/login/LoginScreen';
import NotificationSettingsScreen from './screens/prayer/NotificationSettingsScreen';
import PrayerTimeScreen from './screens/prayer/PrayerTimeScreen';
import QiblaCompassScreen from './screens/qiblaCompass/QiblaCompass';
import DuaDetail from './screens/quran/DuaDetail';
import DuaScreen from './screens/quran/DuaScreen';
import QuranDetail from './screens/quran/QuranDetail';
import FirebaseService from './services/FirebaseService';
const Stack = createNativeStackNavigator();

function OnboardingStack() {
  let i = 0;
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>

      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={Signup} />
      <Stack.Screen name="TabNavigation" component={TabNavigator} />
      <Stack.Screen name="SignUp_2" component={Signup_2} />
      <Stack.Screen name="Otp_success" component={Otp_success} />
      <Stack.Screen name="Quran" component={QuranScreen} />
      <Stack.Screen name="Asatizah AI" component={AsatizahAIScreen} />
         {/* <Stack.Screen name="DonationWidget" component={DonationWidget} /> */}
      <Stack.Screen name="Profile_about" component={ProfileAbout} />
      <Stack.Screen name="Notification_center" component={NotificationCenter} />
      <Stack.Screen name="Notification_detail" component={NotificationDetail} />
      <Stack.Screen name="Edit_profile" component={EditProfile} />
      <Stack.Screen name="Campaign_Details" component={QiblaCompassScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="DuaScreen" component={DuaScreen} />
      <Stack.Screen name="DuaDetail" component={DuaDetail} />
      <Stack.Screen name='QuranDetail' component={QuranDetail} /> 
      <Stack.Screen name='PrayerTimeScreen' component={PrayerTimeScreen} /> 
      <Stack.Screen name="NotificationSettingsScreen" component={NotificationSettingsScreen} /> 
      <Stack.Screen name='QiblaCompassScreen' component={QiblaCompassScreen} /> 
      <Stack.Screen name='AllFeaturesScreen' component={AllFeaturesScreen} /> 
    </Stack.Navigator>
  );
}
function App(): React.JSX.Element {
  React.useEffect(() => {
    FirebaseService.initFCM((remoteMessage: any) => {
    });
  }, []);

  const store: any = rawStore;

  return (
    <ToastProvider  duration={3000}
    animationType="slide-in"
    successColor="#BDFFDE"
    dangerColor="#FF3B30"
    warningColor="#FFCC00"
    textStyle={{ fontSize: 14, color:'#181B1F' }}>
      <StripeProvider
      publishableKey="pk_test_51Qs1BWExYCOPxGAzcfLHnK1McohLLGCMTBfokS2WIhAwKxUJWIJvtMIQMPDeYoQIEBQQEB8Sp8Q6eJuIMZbQA1i500YVlLj7Vh"
    >
    <Provider store={store}>
      <LoadingProvider>
        <NavigationContainer>
          <OnboardingStack />
          <AppNetworkModal />
        </NavigationContainer>
      </LoadingProvider>
    </Provider>
    </StripeProvider>
    </ToastProvider>
  );
}

export default App;
