import { configureStore } from '@reduxjs/toolkit';
import signupReducer from '../redux/slices/signupSlice';
import announcementReducer from './slices/announcementSlice';
import appReducer from './slices/appSlice';
import authSlice from './slices/authSlice';
import bookmarkReducer from './slices/bookmarkSlice';
import commonReducer from './slices/commonSlice';
import donationReducer from './slices/donationSlice';
import edutainmentReducer from './slices/edutainmentSlice';
import userEnrolementReducer from './slices/enrolementSlice';
import eventReducer from './slices/eventSlice';
import khutbahReducer from './slices/khutbahSlice';
import loginReducer from './slices/loginSlice';
import paymentCardReducer from './slices/paymentCardSlice';
import quranReducer from './slices/quranSlice';
import userReducer from './slices/userSlice';
// import duaReducer from './slices/duaSlice';

/**
 * Create a Redux store with network connectivity support
 * @param {Object} networkContext - The network context containing setConnectivity function
 * @returns {Object} Configured Redux store
 */
export const createStore = (networkContext) => {
  return configureStore({
    reducer: {
      auth: authSlice,
      signup: signupReducer,
      login: loginReducer,
      app: appReducer,
      user: userReducer,
      donation: donationReducer,
      userEnrole:userEnrolementReducer,
      quran: quranReducer,
      bookmarks:bookmarkReducer,
      common:commonReducer,
      event: eventReducer,
      announcement:announcementReducer,
      khutbah: khutbahReducer,
      paymentCard: paymentCardReducer,
      edutainment: edutainmentReducer,
      // dua: duaReducer,
    },
    // Pass the setConnectivity function to all thunks via extra parameter
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: {
            setConnectivity: networkContext?.setConnectivity
          }
        }
      })
  });
};

// Create a default store for cases where the network context is not available
export const store = createStore();
