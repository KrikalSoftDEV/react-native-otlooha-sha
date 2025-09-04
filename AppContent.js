import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ToastProvider } from 'react-native-toast-notifications';
import EnhancedAppLoader from './components/UI/EnhancedAppLoader';
import { LoadingProvider } from './context/LoadingContext';

// Screens
import ParentComponent from './components/Parant';
import TabNavigator from './navigation/TabNavigator';
import AllFeaturesScreen from './screens/allFeatures/AllFeaturesScreen';
import AnnouncementDetails from './screens/announcements/AnnouncementDetails';
import Announcements from './screens/announcements/Announcements';
import AsatizahAIScreen from './screens/asatizahAI/asatizahAI';
import CampaignDetails from './screens/Campaign/CampaignDetails';
import ClinicsScreen from './screens/clinics/ClinicsScreen';
import DonationScreen from './screens/donation/DonationScreen';
import DonationTypeList from './screens/donation/DonationTypeList';
import PaymentScreen from './screens/donation/PaymentScreen';
import TransactionDetail from './screens/donation/TransactionDetail';
import TransactionHistory from './screens/donation/TransactionHistory';
import EdutainmentScreen from './screens/edutainment/EdutainmentScreen';
import EmailSubmitScreen from './screens/EmailScreen/EmailSubmitScreen';
import EventsDetails from './screens/events/EventsDetails';
import EventsList from './screens/events/EventsList';
import GamesScreen from './screens/games/GamesScreen';
import AddReminderHijrahCalendar from './screens/hijrahCalendar/AddReminderHijrahCalendar';
import AllEventReminder from './screens/hijrahCalendar/AllEventReminder';
import EventScreen from './screens/hijrahCalendar/EventScreen';
import HijrahCalendar from './screens/hijrahCalendar/HijrahCalendar';
import ReminderDetailsScreen from './screens/hijrahCalendar/ReminderDetailsScreen';
import NotificationCenter from './screens/home/NotificationCenter';
import NotificationDetail from './screens/home/NotificationDetail';
import ProfileAbout from './screens/home/ProfileAbout';
import KhutbahScreen from './screens/khutbah/KhutbahScreen';
import LoginScreen from './screens/login/LoginScreen';
import MuslimBusinessesScreen from './screens/muslimBusiness/MuslimBusinessesScreen';
import NewsAndBlogs from './screens/newsAndBlogs/NewsAndBlogs';
import OnboardingScreen_1 from './screens/onboarding/OnboardingScreen_1';
import AddCard from './screens/paymentSettings/AddCard';
import CardDetails from './screens/paymentSettings/CardDetails';
import EmptyPaymentState from './screens/paymentSettings/EmptyPaymentState';
import paymentSettings from './screens/paymentSettings/PaymentSettings';
import NotificationSettingsScreen from './screens/prayer/NotificationSettingsScreen';
import PrayerTimeScreen from './screens/prayer/PrayerTimeScreen';
import EditProfile from './screens/profile/EditProfile';
import QiblaCompassScreen from './screens/qiblaCompass/QiblaCompass';
import DuaDetail from './screens/quran/DuaDetail';
import DuaScreen from './screens/quran/DuaScreen';
import FavoriteDua from './screens/quran/FavoriteDua';
import QuranScreen from './screens/quran/Quran';
import QuranDetail from './screens/quran/QuranDetail';
import SavedAyahsList from './screens/quran/SavedAyahsList';
import SelectDhikr from './screens/SelectDhikr';

import ProfileAuth from './screens/profileAuth/ProfileAuth';
import QueryTable from './screens/query/Query';
import OtpModalExample from './screens/signup/OtpModal';
import Signup_2 from './screens/signup/Sign_2';
import Signup from './screens/signup/Signup';
import Otp_success from './screens/signup/SuccessScreen';
import SplashScreen from './screens/splash/SplashScreen';
import DhikrSelectionScreen from './screens/tasbihDhikir/DhikrSelectionScreen';
import TasbihDhikir from './screens/tasbihDhikir/TasbihDhikir';
import WebViewScreen from './screens/webView/WebViewScreen';
import WorshipPlaces from './screens/worshipPlaces/WorshipPlaces';

import HelpAndSupport from './screens/home/HelpAndSupport';

import RecitationDetailsScreen from './screens/query/RecitationDetailsScreen';
import ProfileAuthTeacher from './screens/profileAuth/ProfileAuthTeacher';
import TeacherTabNavigator from './navigation/TeacherTabNavigator'

const Stack = createNativeStackNavigator();




function OnboardingStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen name="Onboarding" component={OnboardingScreen_1} />

      <Stack.Screen name="Home" component={QuranScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={Signup} />
      <Stack.Screen name="TabNavigation" component={TabNavigator} />
      <Stack.Screen name="TeacherTabNavigator" component={TeacherTabNavigator} />

      <Stack.Screen name="SignUp_2" component={Signup_2} />
      <Stack.Screen name="Otp_success" component={Otp_success} />
      <Stack.Screen name="email_submit_screen" component={EmailSubmitScreen} />

      <Stack.Screen name="ProfileAuth" component={ProfileAuth} />
      <Stack.Screen name="ProfileAuthTeacher" component={ProfileAuthTeacher} />

      <Stack.Screen name="QueryTable" component={QueryTable} />
      <Stack.Screen name="RecitationDetails" component={RecitationDetailsScreen} />

      <Stack.Screen name="Quran" component={QuranScreen} />
      <Stack.Screen name="Asatizah AI" component={AsatizahAIScreen} />
      <Stack.Screen name="Profile_about" component={ProfileAbout} />
      <Stack.Screen name="helpandsupport" component={HelpAndSupport} />

      <Stack.Screen name="Notification_center" component={NotificationCenter} />
      <Stack.Screen name="Notification_detail" component={NotificationDetail} />
      <Stack.Screen name="Edit_profile" component={EditProfile} />
      <Stack.Screen name="Campaign_Details" component={CampaignDetails} />
      <Stack.Screen name="Select_donation_Amount" component={DonationScreen} />
      <Stack.Screen name="PaymentScreen" component={PaymentScreen} />
      <Stack.Screen name="TransactionHistory" component={TransactionHistory} />
      <Stack.Screen name='QuranDetail' component={QuranDetail} />
      <Stack.Screen name="NewsAndBlogs" component={NewsAndBlogs} />
      <Stack.Screen name='DuaDetail' component={DuaDetail} />
      <Stack.Screen name='DuaScreen' component={DuaScreen} />
      <Stack.Screen name='SavedAyahsList' component={SavedAyahsList} />
      <Stack.Screen name='TransactionDetail' component={TransactionDetail} />
      <Stack.Screen name='WebViewScreen' component={WebViewScreen} />
      <Stack.Screen name='DhikrSelectionScreen' component={DhikrSelectionScreen} />
      <Stack.Screen name="SelectDhikr" component={SelectDhikr} />
      <Stack.Screen name="PrayerTimeScreen" component={PrayerTimeScreen} />
      <Stack.Screen name="NotificationSettingsScreen" component={NotificationSettingsScreen} />
      <Stack.Screen name='TasbihDhikir' component={TasbihDhikir} />
      <Stack.Screen name='HijrahCalendar' component={HijrahCalendar} />
      <Stack.Screen name='AddReminderHijrahCalendar' component={AddReminderHijrahCalendar} />
      <Stack.Screen name='QiblaCompassScreen' component={QiblaCompassScreen} />
      <Stack.Screen name='AllFeaturesScreen' component={AllFeaturesScreen} />
      <Stack.Screen name='FeatureSettingsScreen' component={require('./screens/allFeatures/FeatureSettingsScreen').default} />
      <Stack.Screen name='WorshipPlaces' component={WorshipPlaces} />
      <Stack.Screen name="Donation" component={DonationTypeList} />
      <Stack.Screen name='EventsList' component={EventsList} />
      <Stack.Screen name='EventsDetails' component={EventsDetails} />
      <Stack.Screen name='EventScreen' component={EventScreen} />
      <Stack.Screen name='AllEventReminder' component={AllEventReminder} />
      <Stack.Screen name='ReminderDetailsScreen' component={ReminderDetailsScreen} />
      <Stack.Screen name='KhutbahScreen' component={KhutbahScreen} />
      <Stack.Screen name='Announcements' component={Announcements} />
      <Stack.Screen name='AnnouncementDetails' component={AnnouncementDetails} />
      <Stack.Screen name='Edutainment' component={EdutainmentScreen} />
      <Stack.Screen name='PaymentSettings' component={paymentSettings} />
      <Stack.Screen name="EmptyPaymentState" component={EmptyPaymentState} />
      <Stack.Screen name="AddCard" component={AddCard} />
      <Stack.Screen name="CardDetails" component={CardDetails} />
      <Stack.Screen name="GamesScreen" component={GamesScreen} />
      <Stack.Screen name="ClinicsScreen" component={ClinicsScreen} />
      <Stack.Screen name="OtpModalExample" component={OtpModalExample} />

      <Stack.Screen name="MuslimBusinessesScreen" component={MuslimBusinessesScreen} />
      <Stack.Screen name="FavoriteDua" component={FavoriteDua} />
      <Stack.Screen name="ParentComponent" component={ParentComponent} />

    </Stack.Navigator>
  );
}

const AppContent = () => {
  return (
    <ToastProvider
      duration={3000}
      animationType="slide-in"
      successColor="#BDFFDE"
      dangerColor="#FF3B30"
      warningColor="#FFCC00"
      textStyle={{ fontSize: 14, color: '#181B1F' }}>
      <LoadingProvider>
        <NavigationContainer>
          <OnboardingStack />
          {/* <AppNetworkModal /> */}
          <EnhancedAppLoader />
        </NavigationContainer>
      </LoadingProvider>
    </ToastProvider>
  );
};

export default AppContent;
