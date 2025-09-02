import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { verticalScale } from 'react-native-size-matters';
import ForwardIcon from '../../assets/images/Common/forwardicon.svg';
import CustomeSwitch from '../../components/UI/CustomeSwitch';
import Header from '../../components/UI/Header';
import {
  NAVIGATIONBAR_HEIGHT,
  STATUSBAR_HEIGHT,
} from '../../constants/Dimentions';
import { getData, storeData } from '../../constants/Storage';

const FeaturesSettingsScreen = () => {
  const navigation = useNavigation();
  const [duaTranslationEnabled, setDuaTranslationEnabled] = useState(false);
  const [quranTranslationEnabled, setQuranTranslationEnabled] = useState(false);
  const [dhikirTranslationEnabled, setDhikirTranslationEnabled] =
    useState(false);
  const [duaTranslation, setDuaTranslation] = useState('');
  const [quranTranslation, setQuranTranslation] = useState('');
  const [dhikirTranslation, setDhikirTranslation] = useState('');
  const [language, setLanguage] = useState('');

  useFocusEffect(
    React.useCallback(() => {
      getLanguage();
    }, []),
  );
  const getLanguage = async () => {
    const isDuaFeatureFlag = await getData('isDuaFeatureFlag');
    const isLangFlag = await getData('isLangFlag');
    const isQuranFeatureFlag = await getData('isQuranFeatureFlag');
    const isQuranLangFlag = await getData('isQuranLangFlag');
    const isDhikirFeatureFlag = await getData('isDhikirFeatureFlag');
    const isDhikirLangFlag = await getData('isDhikirLangFlag');
    if (isDuaFeatureFlag === false) {
      setDuaTranslationEnabled(false);
      setDuaTranslation('');
    } else {
      setDuaTranslationEnabled(true);
      if (isLangFlag === 'en') {
        setDuaTranslation('English');
      } else if (isLangFlag === 'my') {
        setDuaTranslation('Malay');
      }
    }

    if (isQuranFeatureFlag === false) {
      setQuranTranslationEnabled(false);
      setQuranTranslation('');
    } else {
      setQuranTranslationEnabled(true);
      if (isQuranLangFlag === 'en') {
        setQuranTranslation('English');
      } else if (isQuranLangFlag === 'my') {
        setQuranTranslation('Malay');
      }
    }

    if (isDhikirFeatureFlag === false) {
      setDhikirTranslationEnabled(false);
      setDhikirTranslation('');
    } else {
      setDhikirTranslationEnabled(true);
      if (isDhikirLangFlag === 'en') {
        setDhikirTranslation('English');
      } else if (isDhikirLangFlag === 'my') {
        setDhikirTranslation('Malay');
      }
    }
  };

  const onDuaToggle = async item => {
    if (item) {
      setDuaTranslationEnabled(false);
      await storeData('isDuaFeatureFlag', false);
      await storeData('isLangFlag', null);
    } else {
      setDuaTranslationEnabled(true);
      await storeData('isDuaFeatureFlag', true);
      const isLangFlag = await getData('isLangFlag');
      if (isLangFlag === 'en') {
        await storeData('isLangFlag', 'en');
      } else if (isLangFlag === 'my') {
        await storeData('isLangFlag', 'my');
      } else if (isLangFlag === null) {
        await storeData('isLangFlag', null);
      }

      //  await storeData("isLangFlag",null);
    }
  };

  const onQuranToggle = async item => {
    setQuranTranslationEnabled(!quranTranslationEnabled);
    if (item) {
      setQuranTranslationEnabled(false);
      await storeData('isQuranFeatureFlag', false);
      await storeData('isQuranLangFlag', null);
    } else {
      setDuaTranslationEnabled(true);
      await storeData('isQuranFeatureFlag', true);
      const isLangFlag = await getData('isQuranLangFlag');
      if (isLangFlag === 'en') {
        await storeData('isQuranLangFlag', 'en');
      } else if (isLangFlag === 'my') {
        await storeData('isQuranLangFlag', 'my');
      } else if (isLangFlag === null) {
        await storeData('isQuranLangFlag', null);
      }

      //  await storeData("isLangFlag",null);
    }
  };
  const onDhikirToggle = async item => {
    setDhikirTranslationEnabled(!dhikirTranslationEnabled);

    if (item) {
      setDhikirTranslationEnabled(false);
      await storeData('isDhikirFeatureFlag', false);
      await storeData('isDhikirLangFlag', null);
    } else {
      setDhikirTranslationEnabled(true);
      await storeData('isDhikirFeatureFlag', true);
      const isLangFlag = await getData('isDhikirLangFlag');
      if (isLangFlag === 'en') {
        await storeData('isDhikirLangFlag', 'en');
      } else if (isLangFlag === 'my') {
        await storeData('isDhikirLangFlag', 'my');
      } else if (isLangFlag === null) {
        await storeData('isDhikirLangFlag', null);
      }

      //  await storeData("isLangFlag",null);
    }
  };

  const SettingRow = ({
    title,
    subtitle,
    onPress,
    showArrow = true,
    showSwitch = false,
    switchValue,
    onSwitchChange,
  }) => (
    <TouchableOpacity
      style={[styles.settingRow, {flexDirection: 'row', alignItems: 'center'}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSubtitle}>{subtitle}</Text>
      </View>
      {showSwitch && (
        <CustomeSwitch isOn={switchValue} onToggle={() => onSwitchChange()} />
      )}
      {showArrow && !showSwitch && (
        <ForwardIcon name="chevron-forward" size={20} color="#6B7280" />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <Header
        onBackPress={() => navigation.goBack()}
        headerTitle="Features Settings"
        borderVisible={false}
      />

      {/* Content */}
      <ScrollView style={styles.content}>
        <SettingRow
          title="Prayer Settings"
          subtitle="Manage notifications and prayer alerts"
          onPress={() =>
            navigation.navigate('NotificationSettingsScreen', {prayerSettings: 'prayerSettings'})
          }
        />
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => {}}
          disabled={true}
          activeOpacity={0.7}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                {'Dua Translation Language'}
              </Text>
              <Text style={styles.settingSubtitle}>{'Choose language'}</Text>
            </View>
            <CustomeSwitch
              isOn={duaTranslationEnabled}
              onToggle={() => onDuaToggle(duaTranslationEnabled)}
            />
          </View>
          {duaTranslationEnabled == true ? (
            <View style={{flexDirection: 'row', marginTop: 30, gap: 12}}>
              <TouchableOpacity
                onPress={async () => {
                  await storeData('isLangFlag', 'en');
                  setDuaTranslation('English');
                }}
                style={[
                  styles.languageButton,
                  duaTranslation == 'English' && styles.selectedlanguageButton,
                ]}>
                <Text style={styles.languageText}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await storeData('isLangFlag', 'my');
                  setDuaTranslation('Malay');
                }}
                style={[
                  styles.languageButton,
                  duaTranslation == 'Malay' && styles.selectedlanguageButton,
                ]}>
                <Text style={styles.languageText}>Malay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => {}}
          disabled={true}
          activeOpacity={0.7}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                {'Quran Translation Language'}
              </Text>
              <Text style={styles.settingSubtitle}>{'Choose language'}</Text>
            </View>
            <CustomeSwitch
              isOn={quranTranslationEnabled}
              onToggle={() => onQuranToggle(quranTranslationEnabled)}
            />
          </View>
          {quranTranslationEnabled == true ? (
            <View style={{flexDirection: 'row', marginTop: 30, gap: 12}}>
              <TouchableOpacity
                onPress={async () => {
                  await storeData('isQuranLangFlag', 'en');
                  setQuranTranslation('English');
                }}
                style={[
                  styles.languageButton,
                  quranTranslation == 'English' &&
                    styles.selectedlanguageButton,
                ]}>
                <Text style={styles.languageText}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await storeData('isQuranLangFlag', 'my');
                  setQuranTranslation('Malay');
                }}
                style={[
                  styles.languageButton,
                  quranTranslation == 'Malay' && styles.selectedlanguageButton,
                ]}>
                <Text style={styles.languageText}>Malay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.settingRow}
          onPress={() => {}}
          disabled={true}
          activeOpacity={0.7}>
          <View style={{flexDirection: 'row'}}>
            <View style={styles.settingContent}>
              <Text style={styles.settingTitle}>
                {'Dhikir Translation Language'}
              </Text>
              <Text style={styles.settingSubtitle}>{'Choose language'}</Text>
            </View>
            <CustomeSwitch
              isOn={dhikirTranslationEnabled}
              onToggle={() => onDhikirToggle(dhikirTranslationEnabled)}
            />
          </View>
          {dhikirTranslationEnabled == true ? (
            <View style={{flexDirection: 'row', marginTop: 30, gap: 12}}>
              <TouchableOpacity
                onPress={async () => {
                  await storeData('isDhikrLangFlag', 'en');
                  setDhikirTranslation('English');
                }}
                style={[
                  styles.languageButton,
                  dhikirTranslation == 'English' &&
                    styles.selectedlanguageButton,
                ]}>
                <Text style={styles.languageText}>English</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  await storeData('isDhikrLangFlag', 'my');
                  setDhikirTranslation('English');
                }}
                style={[
                  styles.languageButton,
                  dhikirTranslation == 'Malay' && styles.selectedlanguageButton,
                ]}>
                <Text style={styles.languageText}>Malay</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View />
          )}
        </TouchableOpacity>
        <SettingRow
          title="Payment Settings"
          subtitle="Manage your cards for faster, secure payments"
          onPress={() =>
            navigation.navigate('EmptyPaymentState', {prayerName: ''})
          }
        />
        <View style={{height: NAVIGATIONBAR_HEIGHT, width: 100}} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: verticalScale(STATUSBAR_HEIGHT),
      // paddingTop:STATUSBAR_HEIGHT,
    // paddingBottom:NAVIGATIONBAR_HEIGHT
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  settingRow: {
    // flexDirection: 'row',
    // alignItems: 'center',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#DDE2EB',
    padding: 20,
    marginBottom: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#181B1F',
    marginBottom: 8,
  },
  settingSubtitle: {
    fontSize: 12,
    fontWeight: '400',
    color: '#686E7A',
  },
  arrow: {
    fontSize: 20,
    fontWeight: '400',
    color: '#C7C7CC',
    marginLeft: 8,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000000',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 8,
  },
  languageButton: {
    flex: 1,
    borderWidth: 1,
    paddingVertical: 16,
    borderRadius: 14,
    borderColor: '#DDE2EB',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  languageText: {fontSize: 16, fontWeight: '400', color: '#181B1F'},
  selectedlanguageButton: {backgroundColor: '#E4E2FD', borderColor: '#5756C8'},
});

export default FeaturesSettingsScreen;
