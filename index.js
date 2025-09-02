/**
 * @format
 */
if (__DEV__) {
  require("./ReactotronConfig");
}
import './gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { initializeApp, getApps } from '@react-native-firebase/app';

// Initialize Firebase immediately
if (getApps().length === 0) {
  initializeApp(); // This will use GoogleService-Info.plist automatically
}

AppRegistry.registerComponent(appName, () => App);
