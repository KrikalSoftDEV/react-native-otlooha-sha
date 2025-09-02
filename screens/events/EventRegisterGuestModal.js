import React from 'react';
import {Modal, View, StyleSheet, Alert} from 'react-native';
import Colors from '../../constants/Colors';
import SuccessScreen from '../signup/SuccessScreen';
import {useSelector} from 'react-redux';

function EventRegisterGuestModal({
  modalVisible,
  setModalVisible,
  onRegisterPress,
  onCancelpress,
  type,
}) {
  
  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.topIndicator} />
            <SuccessScreen
              type={type}
              onPress={onRegisterPress}
              onPressSecond={onCancelpress}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default EventRegisterGuestModal;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    minHeight: '60%',
  },
  topIndicator: {
    width: 66,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#3C3C434D',
    marginBottom: 15,
    alignSelf: 'center',
  },
  optTitleText: {
    fontSize: 21,
    fontWeight: '600',
    color: '#000',
    marginTop: 30,
  },
  otpSubTitleText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    opacity: 0.7,
    marginTop: 12,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginHorizontal: 2,
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 20,
  },
  otpInputError: {
    borderColor: 'red',
  },
  otpInputFilled: {
    borderColor: '#3937A4',
    shadowColor: '#3937A4',
    backgroundColor: Colors.colorWhite,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  otpTimerText: {
    fontSize: 14,
    fontWeight: '400',
    color: '#000',
    opacity: 0.7,
    marginTop: 12,
    marginBottom: 10,
  },
  textSendAgain: {color: '#191967', fontWeight: '800'},
  textTimer: {color: 'red', fontWeight: '600'},
  errorText: {
    color: 'red',
    fontSize: 13,
    marginTop: -10,
    marginBottom: 15,
    marginLeft: 10,
  },
});
