import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import AllFeaturesScreen from '../screens/allFeatures/AllFeaturesScreen';
import CampaignDetails from '../screens/Campaign/CampaignDetails';
import TransactionDetail from '../screens/donation/TransactionDetail';
import NotificationCenter from '../screens/home/NotificationCenter';
import AddCard from '../screens/paymentSettings/AddCard';
import CardDetails from '../screens/paymentSettings/CardDetails';
import EmptyPaymentState from '../screens/paymentSettings/EmptyPaymentState';
import PaymentSettings from '../screens/paymentSettings/PaymentSettings';
import PrayerTimeScreen from '../screens/prayer/PrayerTimeScreen';
import QiblaCompassScreen from '../screens/qiblaCompass/QiblaCompass';
import QuranDetail from '../screens/quran/QuranDetail';
import Sign_2 from '../screens/signup/Sign_2';
import Signup from '../screens/signup/Signup';
import SuccessScreen from '../screens/signup/SuccessScreen';
import TabNavigator from './TabNavigator';

import LoginScreen from '../screens/login/LoginScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="PaymentSettings" component={PaymentSettings} />
      <Stack.Screen name="EmptyPaymentState" component={EmptyPaymentState} />
      <Stack.Screen name="AddCard" component={AddCard} />
      <Stack.Screen name="CardDetails" component={CardDetails} />
      <Stack.Screen name="SignUp" component={Signup} />
      <Stack.Screen name="SignUp_2" component={Sign_2} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen name="Notification_center" component={NotificationCenter} />
      <Stack.Screen name="Campaign_Details" component={CampaignDetails} />
      <Stack.Screen name='QuranDetail' component={QuranDetail} />
      <Stack.Screen name='TransactionDetail' component={TransactionDetail} />
      <Stack.Screen name='TasbihDhikir' component={TasbihDhikir} />
      <Stack.Screen name='QiblaCompassScreen' component={QiblaCompassScreen} /> 
      <Stack.Screen name="PrayerTimeScreen" component={PrayerTimeScreen} />
      <Stack.Screen name="AllFeaturesScreen" component={AllFeaturesScreen} />
    </Stack.Navigator>
  );
};

export default AppNavigator;