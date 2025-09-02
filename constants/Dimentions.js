import { Platform, StatusBar } from "react-native";
import { verticalScale } from "react-native-size-matters";

export const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
export const NAVIGATIONBAR_HEIGHT = Platform.OS === 'android' ? verticalScale(26) : 0; // Estimated navigation bar height
