import { useIsFocused, useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Keyboard,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useLoading } from '../../context/LoadingContext';
import { logout } from '../../redux/slices/authSlice';


function LogoutModal({modalVisible, setModalVisible}) {
  const isFocused = useIsFocused()
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const CustomData = useSelector((state) => state.auth);



  
   const {
      showLoader,
      hideLoader,
      startProcessing,
      stopProcessing,
      setConnectivity,
    } = useLoading();

const handleLogout = async () => {
  dispatch(logout()); // Clear user/token in Redux
  setModalVisible(false); // Close modal

  navigation.replace('Login'); // Navigate to login screen
  
  //  if(isFocused == true && modalVisible == true) {
  //   showLoader(true);
  //   dispatch(logoutApi({}))
  //     .unwrap()
  //     .then(async res => {
  //       if (res?.data?.status === 1) {
  //         hideLoader(true);
  //         setModalVisible(false)
  //         // Alert.alert('Shivam')
  //         await storeData('userDetail', null);
  //         await storeData('access_token', null);
  //         navigation.replace('Login');
  //       } else {
  //         Alert.alert(res?.data?.message || 'Registration Failed');
  //         hideLoader(true);
  //       }
  //     })
  //     .catch(err => {
  //       Alert.alert(err.message || 'Registration Failed');
      
  //       hideLoader(true);
  //     });
  //   }
  };
  return (
    <View style={styles.container}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.messageContainer}>
                <Text style={styles.messageText}>
                  Are you sure you want to logout?
                </Text>
              </View>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => handleLogout()}>
                <Text style={styles.logoutText}>Logout</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <View style={styles.indicatorContainer}></View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}

export default LogoutModal;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  demoButton: {
    backgroundColor: '#2196F3',
    padding: 15,
    borderRadius: 10,
  },
  demoButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    borderRadius: 14,
    overflow: 'hidden',
    backgroundColor: '#f2f2f2',
  },
  messageContainer: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 0.5,
    borderBottomColor: '#d3d3d3',
    backgroundColor: '#f2f2f2',
  },
  messageText: {
    fontSize: 13,
    color: '#88909E',
    fontWeight: '600',
    textAlign: 'center',
  },
  logoutButton: {
    width: '100%',
    padding: 16,
    alignItems: 'center',
    borderBottomWidth: 0.33,
    borderBottomColor: '#8080808C',
    backgroundColor: '#f2f2f2',
  },
  logoutText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#FF3B30', // iOS red color
  },
  cancelButton: {
    width: '90%',
    padding: 16,
    alignItems: 'center',
    backgroundColor: 'white',
    marginTop: 10,
    borderRadius: 14,
    marginBottom: 10,
  },
  cancelText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#007AFF', // iOS blue color
  },
  indicatorContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  indicator: {
    width: 100,
    height: 5,
    backgroundColor: '#333',
    borderRadius: 3,
  },
});
