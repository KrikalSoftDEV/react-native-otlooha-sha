import { BASE_URL as CONFIG_BASE_URL } from './Config'; 
export const BASE_URL = CONFIG_BASE_URL;
export const ALQURAN_BASE_URL = 'https://api.alquran.cloud/v1';

export const ENDPOINTS = {
  GET_EVENT_LIST: '/Mobile/getEventList',
  GET_EVENT_DETAILS: '/Mobile/getEventDetails',
  PARTICIPENT_EVENT: '/Mobile/participateInEvent',
  ANNOUNCEMENT_LIST: '/Mobile/getAnnouncementsList',
  ANNOUNCEMENT_LIST_BY_ID: '/Mobile/getAnnouncementDetailsById',
  KHUTBAH_LIST: '/Mobile/getKhutbahList',
  CARD_LIST: '/Donation/getCardlist',
  ADD_CARD: '/Donation/addCardDetails',
  VIEW_APP_DETAILS: '/Donation/viewAppealDetails',
  MAKE_PAYMENT: '/Donation/makePayment',
  INITIATE_PAYMENT: '/Donation/initiatePayment',
  GET_DONATION_CONFIG: '/Donation/getDonationConfiguration',
  GENERATE_OTP: '/Mobile/generateOTP',
  VERIFY_OTP: '/Mobile/verifyOTP',
  USER_LOGIN: '/Mobile/userLogin',
  USER_LOGOUT: '/Mobile/userLogout',
  USER_REGISTRATION: '/Mobile/userRegistration',
  USER_DETAILS: '/Mobile/getUserDetails',
  EDIT_USER_DETAILS: '/Mobile/editUserDetails',
  DONATION_BY_TRANSACTION_ID: '/Donation/getDonationDetailsByTransaction',
  UPDATE_PUSH_FLAG: '/Mobile/updatePushNotificationFlag',
  UPDATE_USER_LANG: '/Mobile/updateUserLanguage',
  GET_CONFIG: '/Mobile/getConfiguration',
  ENROLE_USER: '/Donation/enrollUser',
  DONATION_WIDGET: '/Donation/donationWidget',
  TRANSACTION_LIST_BY_MOBILEAND_EMAIL:
    '/Donation/getTransactionListByEmailAndMobileNo',
  GET_ORG_WISE_FILTER: '/Donation/getOrgWiseFilters',
  JUZ: '/juz',
  SURAH: '/surah',

  // Add more endpoints here as needed
};
