import React from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Header from '../../components/UI/Header';
import { STATUSBAR_HEIGHT } from '../../constants/Dimentions';
import { verticalScale } from 'react-native-size-matters';

const NotificationDetail = () => {
  const navigation = useNavigation();

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={[styles.safeArea,{paddingTop:verticalScale(STATUSBAR_HEIGHT)}]}>
        <Header
          headerTitle={'Notifications'}
          borderVisible={true}
          onBackPress={() => {
            navigation.goBack();
          }}
        />
      </SafeAreaView>
      <SafeAreaView
        style={[styles.safeArea, {flex: 1, backgroundColor: '#F9FAFC'}]}>
        <View style={{flex: 1}}>
          <Text style={styles.headerTitle}>No new notifications.</Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#88909E',
    marginTop: 50,
    alignSelf: 'center',
  },
  headerRight: {
    width: 40,
  },
});

export default NotificationDetail;
