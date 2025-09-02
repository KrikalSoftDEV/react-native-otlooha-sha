import React from 'react';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {useLoading} from '../../context/LoadingContext';
import SuccessScreen from '../../screens/signup/SuccessScreen';
import {scale} from 'react-native-size-matters';
import NetworkIcon from '../../assets/images/Common/networkOff.svg';
import {WelcomeButton} from './Button';
import res from '../../constants/res';

const AppNetworkModal = () => {
  const {isLoading, isProcessing, connectivityIssue, flickerAnimation} = useLoading();

  if (!isLoading && !isProcessing && !connectivityIssue) return null;

  return (
    <View style={styles.container}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={ connectivityIssue}
        onRequestClose={()=>{}}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <View style={styles.topIndicator} />
            <View style={styles.container1}>
              <View style={{height: 96, width: 93}}>
                <NetworkIcon />
              </View>
              <Text style={[styles.title]}>{res.strings.networkIssues}</Text>
              <Text style={[styles.subtitle]}>
                {res.strings.internetMsg}
              </Text>

              <WelcomeButton
                tittle={res.strings.reloadNow}
                style={{marginTop: 24, maxWidth: '80%'}}
                onPress={() => {}}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
 container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  container1: {
    // flex: 1,
    paddingTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
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
  title: {
    fontSize: 18,
    fontWeight: '600',
    paddingTop: 30,
    paddingVertical: 15,
    color: '#181B1F',
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: '#464B54',
    fontWeight: '400',
    // maxWidth:'70%',
    textAlign: 'center',
    marginVertical: 10,
  },
  button: {
    marginTop: 30,
    backgroundColor: '#4BB543',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 25,
    width: '60%%',
  },
  btnContainer: {
    height: scale(48),
    width: '70%',
    alignSelf: 'center',
    borderWidth: 1,
    borderColor: '#9F9AF44D',
    backgroundColor: '#fff',
    borderRadius: scale(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  buttonText: {fontSize: 17, fontWeight: '600', color: '#272682'},
});

export default AppNetworkModal;
