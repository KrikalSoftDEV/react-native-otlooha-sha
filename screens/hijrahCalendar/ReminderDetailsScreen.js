import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StatusBar,
  SafeAreaView,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import { useRoute, useNavigation, useIsFocused } from '@react-navigation/native';
import { getData, storeData } from '../../constants/Storage';
import textinput_calander_gray from '../../assets/images/Calender/textinput_calander_gray.png';
import Clock_gray from '../../assets/images/Calender/Clock_gray.png';
import Arrow_down_gray from '../../assets/images/Calender/Arrow_down_gray.png';
import SquareEdit from '../../assets/images/Calender/squareEdit.png';
import Header from '../../components/UI/Header';
import moment from 'moment';
import DeleteModal from '../../components/UI/DeleteModal';
import { NAVIGATIONBAR_HEIGHT, STATUSBAR_HEIGHT } from '../../constants/Dimentions';


// You'll need to install react-native-vector-icons or use your preferred icon library
// import Icon from 'react-native-vector-icons/Feather';

const ReminderDetailsScreen = () => {
  const isFocused = useIsFocused();
  const route = useRoute();
  const navigation = useNavigation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [reminder, setReminder] = useState(route.params?.reminder || {});

  const handleDelete = async () => {
    setShowDeleteModal(false);
    try {
      let reminders = await getData('reminders');
      if (!Array.isArray(reminders)) reminders = [];
      reminders = reminders.filter(r => r.id !== reminder.id);
      await storeData('reminders', reminders);
      Alert.alert('Success', 'Reminder deleted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (e) {
      Alert.alert('Error', 'Failed to delete reminder.');
    }
  };
useEffect(() => {
  const fetchReminder = async () => {
    try {
      let reminders = await getData('reminders');
      if (!Array.isArray(reminders)) reminders = [];

      const filtered = reminders.filter(r => r.id === reminder.id);
      setReminder(filtered[0]); // Assuming you want the first match
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch reminder.');
    }
  };

  if (isFocused) {
    fetchReminder();
  }
}, [isFocused]);
  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleEditPress = () => {
    navigation.navigate('AddReminderHijrahCalendar', { reminder });
  };
  
const formatTime = time => {
    return time?.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={{height:'100%', width:'100%'}} >
      <StatusBar barStyle="dark-content" backgroundColor="#f3f4f6" />
      {/* Header */}
      <View style={styles.header}>
        <View style={{flex:1}} >
        <Header  onBackPress={handleBackPress} headerTitle={"Reminder Details"}  />
        </View>
        <TouchableOpacity onPress={handleEditPress} style={styles.headerButton}>
          <Image source={SquareEdit} />
        </TouchableOpacity>
      </View>
      <View style={{flex:1}} >
<ScrollView style={{flex:1,}}>
      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.reminderTitle}>{reminder.title}</Text>
        <Text style={styles.reminderDescription}>{reminder.description}</Text>

        {/* Date Section */}
        <View style={styles.detailRow}>
        <Image source={textinput_calander_gray} />
          <Text style={styles.detailText}>{ moment(reminder.date).format("ddd, MMM DD, YYYY") }</Text>
        </View>

        {/* Time Section */}
        <View style={styles.detailRow}>
        <Image source={Clock_gray} />
          <Text style={styles.detailText}>{ formatTime(moment(reminder?.time, 'HH:mm').toDate()  )
          // moment(reminder?.time, 'HH:mm').toDate()  
          }</Text>
        </View>

        <Text style={styles.repeatText}>{reminder.repeat}</Text>
      </View>

     
      </ScrollView>
      </View>
       {/* Bottom Delete Button */}
       <View style={styles.bottomContainer}>
        <TouchableOpacity 
          onPress={() => setShowDeleteModal(true)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Delete Reminder</Text>
        </TouchableOpacity>
      </View>
      {/* Delete Confirmation Modal */}
    
      </View>
      <DeleteModal modalVisible={showDeleteModal} setModalVisible={() => setShowDeleteModal(false)} modalTitle={"Are you sure you want to delete this reminder?"} buttonTitle={"Delete"}
       buttonPress={() => {handleDelete()}} />
      {/* Home Indicator */}
      {/* <View style={styles.homeIndicator} /> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop:STATUSBAR_HEIGHT,
    paddingBottom:NAVIGATIONBAR_HEIGHT
  },
  statusBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#f3f4f6',
  },
  statusBarText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  statusBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginRight: 4,
  },
  signalBar: {
    width: 3,
    backgroundColor: '#000',
    marginRight: 1,
    borderRadius: 1,
  },
  signalBar1: {
    height: 4,
  },
  signalBar2: {
    height: 6,
  },
  signalBar3: {
    height: 8,
  },
  signalBar4: {
    height: 10,
    backgroundColor: '#9ca3af',
  },
  wifiIcon: {
    width: 15,
    height: 15,
    backgroundColor: '#000',
    borderRadius: 2,
    marginRight: 4,
  },
  batteryIcon: {
    width: 24,
    height: 12,
    backgroundColor: '#000',
    borderRadius: 2,
  },
  header: {
    width:'100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems:'center'
    // paddingHorizontal: 16,
    // paddingVertical: 12,
    // backgroundColor: '#f3f4f6',
  },
  headerButton: {
    padding: 8,
    marginRight:12
  },
  backArrow: {
    fontSize: 28,
    color: '#000',
    fontWeight: '300',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  editIcon: {
    fontSize: 20,
    color: '#000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  reminderTitle: {
    fontSize: 20,
    fontWeight: '500',
    color: '#181B1F',
    marginBottom: 8,
     textAlign:'justify'
  },
  reminderDescription: {
    fontSize: 14,
    fontWeight:'400',
    color: '#686E7A',
    marginBottom: 36,
    textAlign:'justify'
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  calendarIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  clockIcon: {
    fontSize: 20,
    marginRight: 16,
  },
  detailText: {
    fontSize: 16,
    fontWeight:'400',
    color: '#181B1F',
    marginLeft:20
  },
  repeatText: {
    fontSize: 16,
    color: '#181B1F',
    fontWeight:'400',
    marginLeft: 44,
    marginBottom: 36,
  },
  bottomContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop:23,
    borderTopWidth:1,
    borderColor:'#DDE2EB',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDE2EB',
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#DB423D',
    fontSize: 17,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 320,
  },
  modalContent: {
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  modalText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#374151',
    marginBottom: 32,
    lineHeight: 24,
  },
  modalButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  modalDeleteText: {
    color: '#ef4444',
    fontSize: 18,
    fontWeight: '500',
  },
  modalCancelText: {
    color: '#3b82f6',
    fontSize: 18,
    fontWeight: '500',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 8,
    left: '50%',
    marginLeft: -64,
    width: 128,
    height: 4,
    backgroundColor: '#000',
    borderRadius: 2,
  },
});

export default ReminderDetailsScreen;