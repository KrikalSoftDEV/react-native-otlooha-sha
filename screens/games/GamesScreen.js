import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image, ScrollView, ImageBackground, ActivityIndicator, Dimensions, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';
import { scale, verticalScale } from 'react-native-size-matters';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import Header from '../../components/UI/Header';
import BistariGames from '../../assets/images/Common/bistariGames.png';


const { height, width } = Dimensions.get('window');

const GamesScreen = React.memo(() => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const openPlayStore = () => {
  const url = 'https://play.google.com/store/apps/details?id=com.miniclip.tabletopoffline';
    Linking.openURL(url).catch(err => console.error("Failed to open URL:", err));
};


  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Header
        onBackPress={() => navigation.goBack()}
        headerTitle="Games"
      />
       <View style={{width: '100%', height:180, paddingHorizontal: scale(20), borderRadius: scale(16), overflow: 'hidden'}}>
        <TouchableOpacity style={styles.cardBtn} onPress={openPlayStore}>
            <ImageBackground source={BistariGames} style={styles.cardBg} imageStyle={{ borderRadius: scale(16) }} resizeMode="cover">
            </ImageBackground>
              </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
});


const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    height: '100%',
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    height: height,
    overflow: 'hidden',
  },
  cardBg: {
    borderRadius: scale(16),
    width: '100%',
    height: '100%',
  },
  cardBtn: {
      width: '100%',
    height: '100%',
    borderRadius: scale(16),
  
  },

});

export default GamesScreen;