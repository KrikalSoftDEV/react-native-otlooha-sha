import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Image,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import ForwardIcon from '../../assets/images/Common/forwardicon.svg';
import Anounce_notification from '../../assets/images/Common/anounce_notification.svg';
import Heart_notification from '../../assets/images/Common/heart_notification.svg';
import Star_notification from '../../assets/images/Common/star_notification.svg';
import MoonOutlineIcon from '../../assets/images/Common/moon_outline.svg';
import {scale, verticalScale} from 'react-native-size-matters';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../../components/UI/Header';
  const STATUSBAR_HEIGHT =
    Platform.OS === 'android' ? StatusBar.currentHeight : 0;
const NotificationCenter = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([
    {
      id: '1',
      type: 'general',
      title: 'Notification title',
      description: 'One line description',
      time: '2 min ago',
      read: false,
      icon: 'N',
    },
    {
      id: '2',
      type: 'prayer',
      title: 'Upcoming Prayer',
      description: 'Sunset prayer is at 6:00 AM.',
      time: '2 min ago',
      read: false,
      icon: <MoonOutlineIcon />,
    },
    {
      id: '3',
      type: 'donation',
      title: 'Support a Cause',
      description: 'Make a donation today.',
      time: '2 min ago',
      read: false,
      icon: <Heart_notification />,
      action: 'Donate',
    },
    {
      id: '4',
      type: 'volunteering',
      title: 'Volunteering Event',
      description:
        'Join us for community service this weekend. Your support matters!',
      time: '2 min ago',
      read: true,
      icon: <Star_notification />,
    },
    {
      id: '5',
      type: 'khutbah',
      title: 'New Khutbah Available',
      description:
        'Listen to the latest Khutbah now and stay spiritually connected.',
      time: '2 min ago',
      read: true,
      icon: 'K',
    },
    {
      id: '6',
      type: 'announcement',
      title: 'Latest Announcement',
      description: 'Stay updated with important news and community updates.',
      time: '2 min ago',
      read: true,
      icon: <Anounce_notification />,
    },
    {
      id: '7',
      type: 'general',
      title: 'Notification title',
      description: 'One line description',
      time: '2 min ago',
      read: true,
      icon: 'N',
    },
  ]);

  // Handle notification press
  const handleNotificationPress = id => {
    // Mark notification as read
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? {...notification, read: true} : notification,
    );
    setNotifications(updatedNotifications);

    // Handle navigation based on notification type
    const notification = notifications.find(n => n.id === id);
    switch (notification.type) {
      case 'prayer':
        // Navigate to prayer screen
        navigation.navigate('Notification_detail');
        break;
      case 'donation':
        // Navigate to donation screen
        break;
      case 'volunteering':
        // Navigate to volunteering screen
        break;
      case 'khutbah':
        // Navigate to khutbah screen
        break;
      case 'announcement':
        // Navigate to announcement screen
        break;
      default:
        navigation.navigate('Notification_detail');
        break;
    }
  };

  // Handle donation action
  const handleDonatePress = () => {
    // Navigate to donation screen
    console.log('Navigate to donation screen');
  };

  // Get icon background color based on notification type
  const getIconBackgroundColor = type => {
    switch (type) {
      case 'prayer':
        return '#D6FFEB'; // Light green
      case 'donation':
        return '#FFF5CC'; // Light yellow
      case 'volunteering':
        return '#FFE7E5'; // Light red
      case 'khutbah':
        return '#F3E0FF'; // Light purple
      case 'announcement':
        return '#DBFDFF'; // Light cyan
      default:
        return '#E4E2FD'; // Light lavender
    }
  };
  const getIconBorderColor = type => {
    switch (type) {
      case 'prayer':
        return '#94F9C5'; // Light green
      case 'donation':
        return '#FFE599'; // Light yellow
      case 'volunteering':
        return '#FFD3D1'; // Light red
      case 'khutbah':
        return '#D49EFA'; // Light purple
      case 'announcement':
        return '#9AEEF4'; // Light cyan
      default:
        return '#C9C5FC'; // Light lavender
    }
  };
  const getTextIconColor = type => {
    switch (type) {
      case 'prayer':
        return '#D6FFEB'; // Light green
      case 'donation':
        return '#FFF5CC'; // Light yellow
      case 'volunteering':
        return '#FFE7E5'; // Light red
      case 'khutbah':
        return '#8A33CC'; // Light purple
      case 'announcement':
        return '#DBFDFF'; // Light cyan
      default:
        return '#272682'; // Light lavender
    }
  };

  // Get icon color based on notification type
  const getIconColor = type => {
    switch (type) {
      case 'prayer':
        return '#00a86b'; // Green
      case 'donation':
        return '#ffc300'; // Gold
      case 'volunteering':
        return '#ff6b6b'; // Red
      case 'khutbah':
        return '#9370db'; // Purple
      case 'announcement':
        return '#20b2aa'; // Teal
      default:
        return '#6a5acd'; // Slate blue
    }
  };

  // Render notification item
  const renderNotificationItem = ({item}) => {
    return item.read == true ? (
      <TouchableOpacity
        style={[styles.notificationContainer]}
        onPress={() => handleNotificationPress(item.id)}>
        <View
          style={[
            styles.iconContainer,
            {
              backgroundColor: getIconBackgroundColor(item.type),
              borderColor: getIconBorderColor(item.type),
            },
          ]}>
          {typeof item.icon === 'string' && item.icon.length === 1 ? (
            <Text
              style={[styles.iconText, {color: getTextIconColor(item.type)}]}>
              {item.icon}
            </Text>
          ) : (
            <View style={styles.iconContainer_1}>{item.icon}</View>
            // null
            // <Icon name={item.icon} size={24} color={getIconColor(item.type)} />
          )}
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{item.title}</Text>
            {!item.read && <View style={styles.unreadDot} />}
          </View>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        {item.action ? (
          <TouchableOpacity
            style={styles.actionButton}
            onPress={handleDonatePress}>
            <Text style={styles.actionButtonText}>{item.action}</Text>
          </TouchableOpacity>
        ) : (
          <ForwardIcon name="chevron-forward" size={20} color="#6B7280" />
          // null
          //   <Icon name="chevron-forward" size={20} color="#cccccc" />
        )}
      </TouchableOpacity>
    ) : (
      <LinearGradient
        colors={['#F6F5FF', '#FFFFFF']} // Purple to white
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}} // Horizontal direction
        style={{}}>
        <TouchableOpacity
          style={[
            styles.notificationContainer,
            {backgroundColor: 'transparent'},
          ]}
          onPress={() => handleNotificationPress(item.id)}>
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: getIconBackgroundColor(item.type),
                borderColor: getIconBorderColor(item.type),
              },
            ]}>
            {typeof item.icon === 'string' && item.icon.length === 1 ? (
              <Text
                style={[styles.iconText, {color: getTextIconColor(item.type)}]}>
                {item.icon}
              </Text>
            ) : (
              <View style={styles.iconContainer_1}>{item.icon}</View>
              // null
              // <Icon name={item.icon} size={24} color={getIconColor(item.type)} />
            )}
          </View>

          <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{item.title}</Text>
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.time}>{item.time}</Text>
          </View>

          {item.action ? (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={handleDonatePress}>
              <Text style={styles.actionButtonText}>{item.action}</Text>
            </TouchableOpacity>
          ) : (
            <ForwardIcon name="chevron-forward" size={20} color="#6B7280" />
            // null
            //   <Icon name="chevron-forward" size={20} color="#cccccc" />
          )}
        </TouchableOpacity>
      </LinearGradient>
    );
  };

  // Render separator
  const renderSeparator = () => <View style={styles.separator} />;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <Header
        headerTitle={'Notifications'}
        borderVisible={false}
        onBackPress={() => {
          navigation.goBack();
        }}
      />
      {/* <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={styles.headerRight} />
      </View> */}

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={renderSeparator}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderSeparator}
        ListHeaderComponent={renderSeparator}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical:Platform.OS==="android"?verticalScale(STATUSBAR_HEIGHT):0
  },
  // header: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   paddingHorizontal: 16,
  //   height: 56,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#f0f0f0',
  // },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerRight: {
    width: 40,
  },
  listContainer: {
    paddingBottom: 20,
  },
  notificationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
  },
  iconText: {
    fontSize: 20,
    fontWeight: '600',
  },
  contentContainer: {
    flex: 1,
    marginRight: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#181B1F',
    marginRight: 8,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 4,
    backgroundColor: '#5756C8',
  },
  description: {
    fontSize: 12,
    color: '#464B54',
    fontWeight: '400',
    marginBottom: 4,
  },
  time: {
    fontSize: 12,
    color: '#88909E',
    fontWeight: '400',
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#9F9AF433',
    borderRadius: 8,
  },
  actionButtonText: {
    color: '#272682',
    fontWeight: '600',
    fontSize: 12,
  },
  separator: {
    height: 1,
    backgroundColor: '#DDE2EB',
  },
  iconContainer_1: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationCenter;
