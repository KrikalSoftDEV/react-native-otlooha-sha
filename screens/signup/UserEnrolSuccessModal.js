
import React, {useState, useRef, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  Dimensions,
} from 'react-native';
import {WelcomeButton} from '../../components/UI/Button';
import {useNavigation} from '@react-navigation/native';
import Colors from '../../constants/Colors';
import { useLoading } from '../../context/LoadingContext';
import SuccessScreen from './SuccessScreen';
const screenHeight = Dimensions.get('window').height;

function UserEnrolSuccessModal({
  modalVisible,
  setModalVisible,
  verifyOtp,
  resendOtp,
  isProcessing,
  otpResend,
  setOtpResend,
  onPressSubmit,
  onPressSecond
}) {
  const navigation = useNavigation();
  const {
      showLoader,
      hideLoader,
    } = useLoading();
  const [error, setError] = useState('');
  const [otpArray, setOtpArray] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef([]);
  const [time, setTime] = useState(5);
  const [isResend, setResend] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (modalVisible) {
      setTime(5); // reset timer when modal opens
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [modalVisible, isProcessing,isResend]);

  const handleChange = (text, index) => {
    const newOtp = [...otpArray];

    if (text === '') {
      newOtp[index] = '';
      setOtpArray(newOtp);
      return;
    }

    if (/^\d$/.test(text)) {
      newOtp[index] = text;
      setOtpArray(newOtp);

      if (index < 5) {
        inputRefs.current[index + 1]?.focus();
      } else {
        Keyboard.dismiss();
      }
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && otpArray[index] === '') {
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
        const newOtp = [...otpArray];
        newOtp[index - 1] = '';
        setOtpArray(newOtp);
      }
    }
  };

  useEffect(() => {
    const otp = otpArray.join('');
    if (otp.length === 6) {
      handleVerifyOtp();
    }
  }, [otpArray]);




    useEffect(() => {
 if(otpResend){
 setTime(5); // reset timer when modal opens
      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
 }
  }, [otpResend]);

  const handleVerifyOtp = async () => {
    const otp = otpArray.join('');
    if (otp.length === 6) {
      verifyOtp(otp);
    }
  };
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
       <SuccessScreen type={'userEnrolSuccess'} onPress={onPressSubmit} onSecondPress={onPressSecond} />          
         </View>
          </View>
      </Modal>
    </View>
  );
}

export default UserEnrolSuccessModal;

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor:Colors.colorWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    width: '100%',
    minHeight: screenHeight*0.6
  },
  topIndicator: {
       marginVertical: 10, 
    width: 66,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#3C3C434D',
    marginBottom: 15,
    alignSelf:'center'
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

