import React, { useEffect, useState } from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import { useToast } from 'react-native-toast-notifications';
import About from '../../assets/images/Common/about.svg';
import FeaturesSetting from '../../assets/images/Common/featuressettings.svg';


import ForwardIcon from '../../assets/images/Common/forwardicon.svg';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import LanguageIcon from '../../assets/images/Common/languageicon.svg';
import Logout from '../../assets/images/Common/logout.svg';
import ProfileSetting from '../../assets/images/Common/profilesetting.svg';
import PushNotification from '../../assets/images/Common/pushnotification.svg';
import CustomeSwitch from '../../components/UI/CustomeSwitch';
import LogoutModal from '../../components/UI/LogoutModal';
import res from '../../constants/res';
import { storeData } from '../../constants/Storage';
import strings from '../../constants/Strings';
import { useLoading } from '../../context/LoadingContext';
import useUserLocation from '../../hooks/useUserLocation';
import { setGuestInfo } from '../../redux/slices/appSlice';
import {
  changeLanguageApi,
  getUserProfile,
  pushNotificationUpdateAPI,
} from '../../redux/slices/userSlice';
import LanguageSwitch from './LanguageSwitch';
import ProfileHeaderSection from './ProfileHeaderSection';

const ProfileScreen = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [fullNameCustom, setFullNameCustom] = useState('');

  const toast = useToast();
  const {
    showLoader,
    hideLoader,
    startProcessing,
    stopProcessing,
    setConnectivity,
  } = useLoading();


  const authUser = useSelector((state) => state.auth);

  console.log(fullNameCustom, "fullNameCustom")

  console.log("authUser", authUser?.user?.token);

  const token = authUser?.user?.token;
  const userId = authUser?.user?._id;




  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const headers = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;

        const response = await fetch(
          "http://31.97.206.49:3001/api/user/get/profile",
          {
            method: "GET",
            headers,
          }
        );

        if (response.ok) {
          const json = await response.json();
          if (json.data) {
            const data = json.data;
            console.log("Fetched profile data:", data);

            setFullNameCustom(data.firstName + " " + data.lastName);



          } else {
            console.log("No profile found; please create your profile.");
          }
        } else {
          console.log("Failed to fetch profile data.");
        }
      } catch (error) {
        console.log("Network error while fetching profile.");
      } finally {
        console.log(false);
      }
    };
    fetchProfile();
  }, [token, userId]);





  const userInfo = useSelector(state => state.app.userInfo);
  const { city, coords, country } = useUserLocation('noAlert');
  const guestInfo = useSelector(state => state.app.guestInfo);

  const [isPushEnabled, setIsPushEnabled] = React.useState(true);
  const [isLogoutModal, setLogoutModal] = useState(false);
  const [isState, setState] = useState(true);
  const [isFullName, setFullName] = useState('');
  const [selected, setSelected] = useState(strings.getLanguage() == 'my' ? res.strings.malay : res.strings.english);
  const toggleSwitch = () => setIsPushEnabled(previousState => !previousState);

  useEffect(() => {
    handleGetUser();
  }, [isFocused]);

  const handleGetUser = () => {
    showLoader(true);
    dispatch(getUserProfile({}))
      .unwrap()
      .then(res => {
        hideLoader(true);
        if (res?.data?.status === 1) {
          const item = res.data.result;
          setFullName(item.fullName);
          setIsPushEnabled(item.isPushNotificationEnabled);
        } else {
          toast.show(res.strings.somethingWentWrong, {
            type: 'danger',
            placement: 'bottom',
          });
        }
      })
      .catch(err => {
        hideLoader(true);
        // toast.show(res.strings.somethingWentWrong, {
        //   type: 'danger',
        //   placement: 'bottom',
        // });
      });
  };

  const handletoggleSwitch = () => {
    const isNotificationEnable = isPushEnabled == true ? false : true;
    showLoader(true);
    dispatch(pushNotificationUpdateAPI({ isNotificationEnable }))
      .unwrap()
      .then(async res => {
        if (res?.data?.status === 1) {
          hideLoader(true);
          setIsPushEnabled(prev => !prev);
        } else {
          hideLoader(true);
        }
      })
      .catch(err => {
        hideLoader(true);
      });
  };

  const handleLanguage = () => {
    const nextLang = strings.getLanguage() === 'en' ? 'my' : 'en';
    showLoader(true);
    dispatch(changeLanguageApi({ language: nextLang }))
      .unwrap()
      .then(async res => {
        showLoader(true);
        if (res?.data?.status === 1) {
          strings.setLanguage(nextLang);
          setSelected(nextLang === 'my' ? res.strings.malay : res.strings.english);
          setState(prev => !prev); // force re-render
        }
      })
      .catch(err => {
        hideLoader(true);
      });
  };

  const renderMenuItem = (
    LeftComponent,
    title,
    subtitle,
    rightComponent,
    onPress,
  ) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>{LeftComponent}</View>
        <View style={styles.menuItemTextContainer}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.menuItemRight}>{rightComponent}</View>
    </TouchableOpacity>
  );

  const renderPushItem = (
    LeftComponent,
    title,
    subtitle,
    rightComponent,
    onPress,
  ) => (
    <View style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <View style={styles.iconContainer}>{LeftComponent}</View>
        <View style={styles.menuItemTextContainer}>
          <Text style={styles.menuItemTitle}>{title}</Text>
          {subtitle && <Text style={styles.menuItemSubtitle}>{subtitle}</Text>}
        </View>
      </View>
      <View style={styles.menuItemRight}>{rightComponent}</View>
    </View>
  );

  useFocusEffect(
    React.useCallback(() => {
      if (isFocused == true) {
        StatusBar.setBarStyle('light-content');
        if (Platform.OS === 'android') {
          StatusBar.setBackgroundColor('transparent');
        }
      }
    }, [])
  );

  const setUserDetails = async () => {
    dispatch(setGuestInfo(null));
    await storeData('userDetail', null);
    await storeData('access_token', null);
    await storeData('guestDetail', null);
  };

  return (
    <View style={styles.container}>
      {isFocused && <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />}

      {/* Custom Back Button at Top Left */}
      {/* <TouchableOpacity
        onPress={() => props.navigation.goBack()}
        style={styles.backButton}
      >
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity> */}

      <ProfileHeaderSection
        title={res.strings.profile}
        onPress={() => props.navigation.goBack()}
        userName={fullNameCustom === '' ? "Guest User" : fullNameCustom}
      />

      <ScrollView>
        <View style={styles.menuContainer}>
          {renderMenuItem(
            <ProfileSetting size={20} color="#6B7280" />,
            res.strings.profileSetting,
            res.strings.updateMsg,
            <ForwardIcon name="chevron-forward" size={20} color="#6B7280" />,
            () => {
              props.navigation.navigate('ProfileAuth');
            },
          )}
          <View
            style={{
              height: 1,
              backgroundColor: '#DDE2EB',
              marginHorizontal: 20,
            }}
          />

          {renderPushItem(
            <PushNotification size={20} color="#6B7280" />,
            res.strings.pushNotification,
            res.strings.pushDesc,
            <CustomeSwitch
              isOn={isPushEnabled}
              onToggle={() => handletoggleSwitch()}
            />,
          )}
          <View
            style={{
              height: 1,
              backgroundColor: '#DDE2EB',
              marginHorizontal: 20,
            }}
          />

          {renderPushItem(
            <LanguageIcon size={20} color="#6B7280" />,
            res.strings.language,
            res.strings.chooseLang,
            <View style={styles.languageSelector}>
              <LanguageSwitch onSelect={() => handleLanguage()} selected={selected} setSelected={setSelected} />
            </View>,
          )}

          <View
            style={{
              height: 1,
              backgroundColor: '#DDE2EB',
              marginHorizontal: 20,
            }}
          />

          {renderMenuItem(
            <FeaturesSetting size={20} color="#6B7280" />,
            res.strings.featureSetting,
            res.strings.adjustFeatureSetting,
            <ForwardIcon name="chevron-forward" size={20} color="#6B7280" />,
            () => props?.navigation.navigate('#'),
          )}

          {renderMenuItem(


            <FeaturesSetting size={20} color="#6B7280" />,
            'Help & Support',
            'FAQs, Contact us & More',
            <ForwardIcon name="chevron-forward" size={20} color="#6B7280" />,
            () => props?.navigation.navigate('helpandsupport'),
          )}

          <View
            style={{
              height: 1,
              backgroundColor: '#DDE2EB',
              marginHorizontal: 20,
            }}
          />

          {renderMenuItem(
            <About size={20} color="#6B7280" />,
            res.strings.about,
            res.strings.whoWeAre,
            <ForwardIcon name="chevron-forward" size={20} color="#6B7280" />,
            () => {
              props.navigation.navigate('Profile_about');
            },
          )}
        </View>

        {guestInfo === null && <View style={styles.logOutContainer}>
          {renderMenuItem(
            <Logout size={20} color="#6B7280" />,
            res.strings.logout,
            null,
            null,
            () => {
              setLogoutModal(true);
            },
          )}
        </View>}

        {guestInfo !== null && <View style={styles.logOutContainer}>
          {renderMenuItem(
            <Logout size={20} color="#6B7280" />,
            res.strings.login,
            null,
            null,
            () => {
              setUserDetails();
              props.navigation.replace('Login');
            },
          )}
        </View>}
      </ScrollView>

      <LogoutModal
        setModalVisible={setLogoutModal}
        modalVisible={isLogoutModal}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(10),
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: scale(16),
    fontWeight: '600',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderColor: '#DDE2EB',
    borderWidth: 1,
    marginHorizontal: scale(16),
    borderRadius: scale(16),
  },
  logOutContainer: {
    marginVertical: verticalScale(20),
    borderWidth: 1,
    borderColor: '#DDE2EB',
    backgroundColor: '#FFFFFF',
    marginHorizontal: scale(16),
    borderRadius: scale(16),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(11),
    paddingHorizontal: scale(16),
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItemTextContainer: {
    marginLeft: scale(8),
  },
  menuItemTitle: {
    fontSize: scale(14),
    fontWeight: '500',
    color: '#181B1F',
  },
  menuItemSubtitle: {
    fontSize: scale(12),
    fontWeight: '400',
    color: '#686E7A',
    marginTop: verticalScale(4),
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProfileScreen;
