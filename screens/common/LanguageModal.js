import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import {scale} from 'react-native-size-matters';
import Cross from '../../assets/images/Common/cross.svg';
import Colors from '../../constants/Colors';
import { getData } from '../../constants/Storage';

const LanguageModal = ({ visible, onClose, onSelect, langSelect }) => {

  return (
    <Modal transparent animationType="slide" visible={visible}>
      {/* TouchableWithoutFeedback captures taps on overlay */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          {/* 
            TouchableWithoutFeedback prevents onPress from propagating here,
            so taps inside modal won't trigger overlay onPress 
          */}
          <TouchableWithoutFeedback onPress={() => {}}>
            <View style={styles.modal}>
              <Text style={styles.title}>Select Language</Text>
              <Text style={styles.subtitle}>
                Pick a language you're comfortable with.
              </Text>

              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={[
                    styles.button,
                    langSelect === 'English' && styles.activeButton,
                  ]}
                  onPress={() => onSelect('English')}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      langSelect === 'English' && styles.activeButtonText,
                    ]}
                  >
                    English
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.button,
                    langSelect === 'Malay' && styles.activeButton,
                  ]}
                  onPress={() => onSelect('Malay')}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      langSelect === 'Malay' && styles.activeButtonText,
                    ]}
                  >
                    Malay
                  </Text>
                </TouchableOpacity>
              </View>

              {/* <Pressable onPress={onClose} style={styles.closeButton}>
                <Cross />
              </Pressable> */}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default LanguageModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: Colors.overlay,
  },
  modal: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
  },
  title: {
    fontSize: scale(16),
    fontWeight: '500',
    color: '#181B1F',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: scale(12),
    color: '#686E7A',
    fontWeight: '500',
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    borderWidth: 1,
    borderColor: '#DDE2EB',
    borderRadius: 14,
    paddingVertical: 15,
    paddingHorizontal: 40,
    backgroundColor: '#ffffff',
  },
  buttonText: {
    fontSize: scale(18),
    fontWeight: '600',
    color: '#181B1F',
  },
  activeButton: {
    backgroundColor: '#E4E2FD',
    borderColor: '#5756C8',
  },
  activeButtonText: {
    fontSize: scale(18),
    color: '#181B1F',
    fontWeight: '600',
  },
  closeButton: {
    backgroundColor: '#F0F2F7',
    borderRadius: 20,
    position: 'absolute',
    top: 16,
    right: 16,
    padding: 8,
  },
  closeText: {
    fontSize: 18,
    color: '#999',
  },
});
