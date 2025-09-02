import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, SafeAreaView, BackHandler } from 'react-native';
import { WebView } from 'react-native-webview';
import { NAVIGATIONBAR_HEIGHT, STATUSBAR_HEIGHT } from '../../constants/Dimentions';
import Header from '../../components/UI/Header';
import { useLoading } from '../../context/LoadingContext';
import { useNavigation } from '@react-navigation/native';

const WebViewScreen = ({ route }) => {
  const navigation = useNavigation();
  const url = route.params.receiptLink;
  const headerShow = route.params.headerShow;

  const { showLoader, hideLoader } = useLoading();

  const webViewRef = useRef(null);
  const canGoBackRef = useRef(false);

  // ✅ Handle Android hardware back button
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (canGoBackRef.current && webViewRef.current) {
        webViewRef.current.goBack();
        return true;
      }
      return false; // default: exit screen
    });

    return () => backHandler.remove();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={[styles.container, {
        paddingTop: STATUSBAR_HEIGHT,
        paddingBottom: NAVIGATIONBAR_HEIGHT,
      }]}>
        {headerShow && (
          <Header onBackPress={() => {
            if (canGoBackRef.current && webViewRef.current) {
              webViewRef.current.goBack();
            } else {
              navigation.goBack();
            }
          }} />
        )}

        <WebView
          ref={webViewRef}
          source={{ uri: url || 'https://example.com' }}
          onLoadStart={showLoader}
          onLoadEnd={hideLoader}
          onNavigationStateChange={navState => {
            canGoBackRef.current = navState.canGoBack;
          }}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
});

export default WebViewScreen;
