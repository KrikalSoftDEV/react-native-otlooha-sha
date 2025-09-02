import { useIsFocused } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import {
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { useDispatch } from 'react-redux';
import instagram from '../../assets/images/Social/instagram.png';
import linkedin from '../../assets/images/Social/linkedin.png';
import fbIcon from '../../assets/images/Social/Social_fb.png';
import ticktok from '../../assets/images/Social/ticktok.png';
import youtube from '../../assets/images/Social/youtube.png';
import Header from '../../components/UI/Header';
import { useLoading } from '../../context/LoadingContext';
import { aboutUsConfigurationAPI } from '../../redux/slices/userSlice';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { verticalScale } from 'react-native-size-matters';
import Colors from '../../constants/Colors';
const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight : 0;
const NAVIGATIONBAR_HEIGHT = Platform.OS === 'android' ? 48 : 0;
const ProfileAbout = props => {
    const { width } = useWindowDimensions();
           const insets = useSafeAreaInsets();
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [isData, setData] = useState(null);
  const {
    showLoader,
    hideLoader,
    startProcessing,
    stopProcessing,
    setConnectivity,
  } = useLoading();

  const handleAboutData = () => {
    showLoader(true);
    dispatch(aboutUsConfigurationAPI({}))
      .unwrap()
      .then(async res => {
        hideLoader(true);
        if (res?.data?.status === 1) {
          setData(res.data);
          console.log(res.data, 'check the description');
        } else {
          toast.show(res?.data?.message || 'data fetch failed', {
            type: 'danger',
            placement: 'bottom',
          });
        }
      })
      .catch(err => {
        toast.show(res?.data?.message || 'Something went wrong!', {
          type: 'danger',
          placement: 'bottom',
        });
        hideLoader(true);
      });
  };
  useEffect(() => {
    if (isFocused == true) {
      handleAboutData();
    }
  }, [isFocused]);
 const tagsStyles = {
  h1: {
    color: Colors.textColor,
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'justify',
  },
  p: {
    color: Colors.textColor,
    fontWeight: '400',
    fontSize: 16,
    textAlign: 'justify',
  },
};
  return (
    <SafeAreaView style={[styles.container,{paddingBottom: insets?.bottom} ]}>
      <StatusBar barStyle="dark-content" />
      {/* <View style={styles.header}>
        <TouchableOpacity
          onPress={() => props.navigation.goBack()}
          style={styles.backButton}>
          <Image
            source={BackArrow}
            style={{
              height: 22,
              width: 17,
              // marginLeft: 16,
            }}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About</Text>
        <View style={styles.placeholder} />
      </View> */}
      {/* <View style={{paddingTop: 10}}> */}
        <Header
        borderWidth={1}
        borderVisible={true}
          headerTitle={'About'}
          onBackPress={() => props.navigation.goBack()}
        />
      {/* </View> */}
      <ScrollView style={styles.contentContainer}>
        {/* {isData?.charity?.aboutUs ? (
          <Text style={styles.mainHeading}>{isData?.charity?.aboutUs}</Text>
        ) : null} */}

  {/* {isData?.charity?.aboutUs ?<RenderHTML
        contentWidth={width}
        source={{ html: isData?.charity?.aboutUs}}
         tagsStyles={tagsStyles}
      />:null} */}



      <Text style={styles.mainHeading}>Otlooha Sha is a groundbreaking virtual university that connects teachers and students from around the world who are passionate about learning the Qur’an, Tajweed, and the Arabic language. What makes Otlooha Sha truly unique is its innovative approach—rather than relying on third-party video conferencing tools, it is powered entirely by its own purpose-built platforms and applications, specially designed to create a seamless and enriching learning experience.</Text>
        {/* <Text style={styles.paragraph}>
        </Text>

        <Text style={styles.paragraph}>
        </Text> */}

        {isData?.socialMediaLinks &&
        isData?.socialMediaLinks[0]?.socialMediaIconUrl ? (
          <Text style={styles.socialText}>Follow us on</Text>
        ) : null}

       <View style={styles.socialIconsContainer}>
  {/* Facebook */}
  <TouchableOpacity
    onPress={() => Linking.openURL('#')}
    style={styles.socialIcon}>
    <Image source={fbIcon} style={styles.socialLoginViewIconStyle} />
  </TouchableOpacity>

  {/* Instagram */}
  <TouchableOpacity
    onPress={() => Linking.openURL('#')}
    style={styles.socialIcon}>
    <Image source={instagram} style={styles.socialLoginViewIconStyle} />
  </TouchableOpacity>

  {/* LinkedIn */}
  <TouchableOpacity
    onPress={() => Linking.openURL('#')}
    style={styles.socialIcon}>
    <Image source={linkedin} style={styles.socialLoginViewIconStyle} />
  </TouchableOpacity>

  {/* YouTube */}
  <TouchableOpacity
    onPress={() => Linking.openURL('#')}
    style={styles.socialIcon}>
    <Image source={youtube} style={styles.socialLoginViewIconStyle} />
  </TouchableOpacity>

  {/* TikTok */}
  <TouchableOpacity
    onPress={() => Linking.openURL('#')}
    style={styles.socialIcon}>
    <Image
      source={ticktok}
      style={[styles.socialLoginViewIconStyle, { width: 24 }]}
    />
  </TouchableOpacity>
</View>

      </ScrollView>

      {/* <View style={styles.contactButtonContainer}>
        <TouchableOpacity
          onPress={() => {
            Linking.openURL('#');
          }}
          style={styles.contactButton}>
          <Text style={styles.contactButtonText}>Contact us</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop:verticalScale(STATUSBAR_HEIGHT),
    backgroundColor: 'white',

  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingTop: 12,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181B1F',
  },
  placeholder: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    padding: 28,
  },
  mainHeading: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
    lineHeight: 30,
    color: '#181B1F',
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#181B1F',
    marginBottom: 16,
    fontWeight: '400',
  },
  socialText: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 16,
    color: '#181B1F',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 32,
  },
  socialIcon: {
    width: 60,
    height: 60,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 50,
    borderColor: '#DDE2EB',
  },
  fbIcon: {
    backgroundColor: '#1877F2',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fbText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  igIcon: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  igText: {
    fontSize: 20,
  },
  liIcon: {
    backgroundColor: '#0A66C2',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  liText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  ytIcon: {
    backgroundColor: '#FF0000',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ytText: {
    fontSize: 20,
  },
  ttIcon: {
    backgroundColor: '#000',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ttText: {
    color: 'white',
    fontSize: 20,
  },
  contactButtonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#9F9AF44D',
  },
  contactButton: {
    backgroundColor: '#F6F5FF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  contactButtonText: {
    color: '#272682',
    fontSize: 17,
    fontWeight: '600',
  },
  socialLoginViewIconStyle: {height: 28, width: 28, alignSelf: 'center'},
});

export default ProfileAbout;
