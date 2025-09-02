import React from 'react';
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native';
import {scale, verticalScale} from 'react-native-size-matters';
import WelcomeScreenLogo from '../../assets/images/Welcome/welcomeScreenLogo.png';
import NotificationIcon from '../../assets/images/Homescreen/bell_icon.svg';
import Colors from '../../constants/Colors';
import TuhanImage from '../../assets/images/Homescreen/tuhan_red.png';

const HomeHeader = ({
  username = 'Adnan',
  notificationCount = 8,
  onNotificationPress,
}) => {
  return (
    <View style={styles.container}>
      <View style={{flexDirection: 'row', flex: 1}}>
        <Image
          source={WelcomeScreenLogo}
          style={styles.logo}
          resizeMode="contain"
        />
        <View
          style={{
            width: 1,
            backgroundColor: '#657278',
            height: 30,
            marginHorizontal: 5,
          }}
        />
        <Image
          source={TuhanImage}
          style={{width: scale(30), height: verticalScale(28)}}
          resizeMode="contain"
        />
      </View>

      {/* Greeting */}
      <View style={{alignItems: 'flex-end', marginHorizontal: 10, width:"41%"}}>
        <Text style={styles.greetingText}>Assalamualaikum,</Text>
        <Text style={styles.username} numberOfLines={1}>{username?.trim()}</Text>
      </View>
      {/* Notification Icon with Badge */}
      <TouchableOpacity
        style={styles.notificationContainer}
        onPress={onNotificationPress}>
        <NotificationIcon width={22} height={22} />

        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{notificationCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingVertical:verticalScale(5),
  },
  logo: {
    width: scale(70),
    height: verticalScale(28),
  },
  greetingText: {
    fontSize: scale(14),
    color: '#1E1E1E',
    fontWeight: '400',
    textAlign: 'right',
  },
  username: {
    fontSize:14,
    fontWeight: '700',
    color:'#181B1F'
  },
  notificationContainer: {
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.grey,
    borderRadius: 30,
    position: 'relative',
    width: scale(42),
    height: scale(42),
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    width: scale(40),
    height: scale(40),
    tintColor: '#4F46E5', // Or your icon color
  },
  badge: {
    position: 'absolute',
    top: 5,
    right: 8,
    backgroundColor: '#F87171',
    borderRadius: scale(10),
    minWidth: scale(15),
    height: scale(15),
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(4),
  },
  badgeText: {
    color: '#fff',
    fontSize: scale(10),
    fontWeight: 'bold',
  },
});
