import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  View
} from 'react-native';
import { Text } from 'react-native-gesture-handler';
import { scale, verticalScale } from 'react-native-size-matters';
import { useToast } from 'react-native-toast-notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useLoading } from '../../context/LoadingContext';
import { editUserProfile, getUserProfile } from '../../redux/slices/userSlice';
import ProfileHeaderSection from './ProfileHeaderSection';

const EditProfile = props => {
  const dispatch = useDispatch();
  const isFocused = useIsFocused();
  const toast = useToast();
  const {
    showLoader,
    hideLoader,
    startProcessing,
    stopProcessing,
    setConnectivity,
  } = useLoading();
  const userInfo = useSelector(state => state.app.userInfo);

  const [userType, setUserType] = useState(1);
  const [userOfType, setUserOfType] = useState('');
  const [isFullName, setFullName] = useState('');
  const [isGetFullName, setGetFullName] = useState('');
  const [isDisplayFullName, setDisplayFullName] = useState('');
  const [isCompanyName, setCompanyName] = useState('');
  const [isCompanyRepresentativeName, setCompanyRepresentativeName] = useState('');
  const [isMyKadId, setMyKadId] = useState('');
  const [isBrnUenNo, setBrnUenNo] = useState('');
  const [isEmail, setEmail] = useState('');
  const [isCountryCode, setCountryCode] = useState('60');
  const [isPhone, setPhone] = useState('');
  const [errorMessageName, setErrorMessageName] = useState('');
  const [errorMessageMyKaId, setErrorMessageMyKaId] = useState(''); // res.strings.ic_number_invalid,
  const [errorBrnUenNo, setErrorBrnUenNo] = useState(''); // res.strings.ic_number_invalid,
  const [errorMessageEmail, setErrorMessageEmail] = useState('');
  const [errorMessagePhone, setErrorMessagePhone] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [errorCompanyName, setErrorCompanyName] = useState('');
  const [errorCompanRepresentativeyName, setErrorCompanRepresentativeyName] = useState('');
  const [showError, setShowError] = useState(false);
  const [saveFlag, setSaveFlag] = useState(true)
  const guestInfo = useSelector(state => state.app.guestInfo);

  useEffect(() => {
    if (isFullName === isGetFullName) {
      setSaveFlag(true)
    } else {
      setSaveFlag(false)
    }
  }, [isFullName]);

  useEffect(() => {
    if (isFocused == true) {
      handleGetUser();
    }
  }, [isFocused]);
  
  const handleGetUser = () => {
    showLoader(true);
    dispatch(getUserProfile({}))
      .unwrap()
      .then(res => {
        hideLoader(true);

        if (res?.data?.status === 1) {
          const item = res.data.result;
          setCompanyRepresentativeName(item?.contactPerson);
          setEmail(item?.email);
          setCountryCode(item?.countryCode);
          setPhone(item?.mobileNumber);
          if (item?.isIndividualUser == true) {
            setFullName(guestInfo !== null ? "Guest User" : item?.fullName);
            setGetFullName(item.fullName)
            setMyKadId(formatICWithDashes(item?.uniqueId));
            setUserType(0);
            setUserOfType('Individual User');
            setDisplayFullName(item.fullName);
          } else {
            setDisplayFullName(item?.companyName);
            setCompanyName(item?.companyName);
            const mainString = "Guest User";
            // const mainString = "Guest161471";
            // const result = mainString.includes("Guest");
            setCompanyRepresentativeName(guestInfo !== null ? "Guest User" : item?.fullName);
            setBrnUenNo(item?.uniqueId);
            setUserOfType('Business User');
            setUserType(1);
          }
        } else {
          toast.show('Something went wrong!', {
            type: 'danger',
            placement: 'bottom',
          });
        }
      })
      .catch(err => {
        hideLoader(true);
        toast.show('Something went wrong!', {
          type: 'danger',
          placement: 'bottom',
        });
      });
  };

  const handleEditUser = () => {
    setSaveFlag(true)
    Keyboard.dismiss();
    const fullName = userType == 1 ? isCompanyRepresentativeName : isFullName;
    const companyName = userType == 1 ? isCompanyName : '';
    showLoader(true);
    dispatch(
      editUserProfile({
        fullName,
        companyName,
      }),
    )
      .unwrap()
      .then(res => {
        if (res?.data?.status === 1) {
          handleGetUser();
          toast.show('Profile updated successfully', {
            type: 'success',
            placement: 'bottom',
          });
        } else {
          hideLoader(true);
          toast.show('Something went wrong!', {
            type: 'danger',
            placement: 'bottom',
          });
        }
      })
      .catch(err => {
        hideLoader(true);
        // handleGetUser();
        toast.show('Something went wrong!', {
          type: 'danger',
          placement: 'bottom',
        });
      });
  };
  const formatICWithDashes = value => {
    const digitsOnly = value.replace(/[^a-zA-Z0-9]/g, '');
    let formatted = digitsOnly;
    if (digitsOnly.length > 6 && digitsOnly.length <= 8) {
      formatted = `${digitsOnly.slice(0, 6)}-${digitsOnly.slice(6)}`;
    } else if (digitsOnly.length > 8) {
      formatted = `${digitsOnly.slice(0, 6)}-${digitsOnly.slice(
        6,
        8,
      )}-${digitsOnly.slice(8, 12)}`;
    }

    return formatted.toUpperCase();
  };

  const handleNameChange = (text) => {
    const filteredText = text.replace(/[^a-zA-Z\s]/g, '');
    setFullName(filteredText);
  };



  

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}>
      <View style={styles.container}>
        <SafeAreaView
          style={[
            styles.container,
            {
              backgroundColor: '#FFFFFF',
            },
          ]}>

          <ProfileHeaderSection
            title={'View Profile'}
            onPress={() => props.navigation.goBack()}
            userName={guestInfo !== null ? "Guest User" : isDisplayFullName}
            location={userOfType ? userOfType : null}
          />



          <Text>Profile Information Will come here</Text>
          {/* <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
           
            {userType == 0 ? (
              <Emailinput
                title={res.strings.full_name}
                containerStyle={[
                  styles.textInputStyle,
                  { backgroundColor: '#DDE2EB' },
                ]}
                enteredText={isFullName}
                setEnteredText={(text) => handleNameChange(text)}
                placeholder={res.strings.enter_full_name}
                maxLength={100}
                editable={false}
              />
            ) : (
              <Emailinput
                title={res.strings.companyName}
                containerStyle={[
                  styles.textInputStyle,
                  { backgroundColor: '#DDE2EB' },
                ]}
                enteredText={isCompanyName}
                setEnteredText={setCompanyName}
                placeholder={res.strings.enterCompanyName}
                editable={false}
              />
            )}
            {errorMessageName ? (
              <Text style={styles.errorText}>{errorMessageName}</Text>
            ) : null}
            {errorCompanyName ? (
              <Text style={styles.errorText}>{errorCompanyName}</Text>
            ) : null}
            {userType == 0 ? (
              <Emailinput
                title={res.strings.ic_number}
                containerStyle={[
                  styles.textInputStyle,
                  { backgroundColor: '#DDE2EB' },
                ]}
                enteredText={isMyKadId}
                setEnteredText={text => setMyKadId(formatICWithDashes(text))}
                placeholder={res.strings.enter_ic_number}
                editable={false}
              />
            ) : (
              <Emailinput
                title={res.strings.brnOrUenNumber}
                containerStyle={[
                  styles.textInputStyle,
                  { backgroundColor: '#DDE2EB' },
                ]}
                enteredText={isBrnUenNo}
                setEnteredText={setBrnUenNo}
                placeholder={res.strings.enterBrnOrUenNumber}
                editable={false}
              />
            )}
            {errorMessageMyKaId ? (
              <Text style={styles.errorText}>{errorMessageMyKaId}</Text>
            ) : null}
            {errorBrnUenNo ? (
              <Text style={styles.errorText}>{errorBrnUenNo}</Text>
            ) : null}

            {userType == 1 ? (
              <Emailinput
                title={res.strings.companyRepresentativeName}
                containerStyle={[
                  styles.textInputStyle,
                  { backgroundColor: '#DDE2EB' },
                ]}
                enteredText={isCompanyRepresentativeName}
                setEnteredText={setCompanyRepresentativeName}
                placeholder={res.strings.enterCompanyRepresentativeName}
                maxLength={100}
                editable={false}
              />
            ) : null}
            {errorCompanRepresentativeyName ? (
              <Text style={styles.errorText}>
                {errorCompanRepresentativeyName}
              </Text>
            ) : null}
            <Emailinput
              title={res.strings.email}
              containerStyle={[
                styles.textInputStyle,
                { backgroundColor: '#DDE2EB' },
              ]}
              enteredText={isEmail}
              setEnteredText={setEmail}
              placeholder={res.strings.enter_email}
              editable={false}
            />
            {errorMessageEmail ? (
              <Text style={styles.errorText}>{errorMessageEmail}</Text>
            ) : null}
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'center',
                justifyContent: 'space-between',
              }}>
              <View pointerEvents='none' style={{ marginLeft: 20 }}>
                <CountryCodePicker
                  setCountryCode={setCountryCode}
                  countryCode={isCountryCode}
                  editable={false}
                />
              </View>
              <Emailinput
                title={res.strings.mobile}
                containerStyle={[
                  styles.textInputStyle1,
                  { backgroundColor: '#DDE2EB' },
                  { flex: 1 },
                 
                ]}
                enteredText={isPhone}
                setEnteredText={setPhone}
                placeholder={'0000 0000'}
                editable={false}
              />
            </View>
            {errorMessagePhone ? (
              <Text style={styles.errorText}>{errorMessagePhone}</Text>
            ) : null}
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
         
          </ScrollView> */}
        </SafeAreaView>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: 400,
    width: '100%',
    // paddingVertical: verticalScale(10),
  },
  logOutContainer: {
    height: verticalScale(58),
    marginVertical: verticalScale(20),
    backgroundColor: '#FFFFFF',
    marginHorizontal: scale(16),
    borderRadius: scale(16),
    // paddingVertical: verticalScale(10),
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: scale(40),
    height: scale(40),
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
    color: '#686E7A',
    marginTop: verticalScale(2),
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: scale(12),
    color: '#6B7280',
    fontWeight: '500',
    marginRight: scale(4),
  },
  textInputStyle: {
    paddingVertical: verticalScale(10),
    paddingHorizontal: scale(18),
    borderWidth: 1,
    borderRadius: scale(14),
    marginVertical: 0,
    marginTop: verticalScale(10),
    borderColor: '#DDE2EB',
  },
  textInputStyle1: {
    paddingVertical: Platform.OS == 'android' ? 10 : 15,
    paddingHorizontal: scale(18),
    borderWidth: 1,
    // backgroundColor:"red",
    borderRadius: scale(14),
    marginVertical: 0,
    marginTop: verticalScale(10),
    borderColor: '#DDE2EB',
  },
  errorText: {
    color: 'red',
    fontSize: scale(12),
    marginLeft: scale(24),
    marginTop: verticalScale(8),
    fontWeight: '400',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
});

export default EditProfile;
