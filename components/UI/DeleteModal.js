import React, {useState, useRef, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import { useLoading } from '../../context/LoadingContext';
import { useDispatch } from 'react-redux';
import { logoutApi } from '../../redux/slices/loginSlice';
import { storeData } from '../../constants/Storage';

function DeleteModal({modalVisible, setModalVisible, modalTitle, buttonTitle, buttonPress}) {
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
                  {modalTitle}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={buttonPress}>
                <Text style={styles.logoutText}>{buttonTitle}</Text>
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

export default DeleteModal;

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
