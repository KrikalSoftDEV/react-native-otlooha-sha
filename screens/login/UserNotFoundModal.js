import React, { useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  Animated,
  PanResponder,
} from 'react-native';
import { WelcomeButton } from '../../components/UI/Button';
import { scale } from 'react-native-size-matters';
import SearchIcon from '../../assets/images/Common/search.svg';
import { ClickButton } from '../../components/UI/ClickButton';
import Colors from '../../constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function UserNotFoundModal({
  modalVisible,
  onYesPress,
  onNoPress,
  title,
  subTitle,
  onRequestClose, // 👈 callback to close modal
}) {
  const pan = useRef(new Animated.ValueXY()).current;
     const insets = useSafeAreaInsets();
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Respond to vertical swipes
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderMove: (_, gestureState) => {
        // Allow only downward movement
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100) {
          // If swipe distance is enough, dismiss
          onRequestClose();
        } else {
          // Revert to original position
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  return (
    <View style={[styles.container,]}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={onRequestClose}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.modalOverlay}>
              <Animated.View
                style={[styles.modalView, { transform: pan.getTranslateTransform() }]}
                {...panResponder.panHandlers}
              >
                <View style={styles.topIndicator} />
                <View style={[styles.container1,insets.bottom >0 &&{bottom:20}]}>
                  <View style={{ height: 90, width: 90, marginVertical: 30 }}>
                    <SearchIcon />
                  </View>
                  <Text style={styles.title}>{title}</Text>
                  <Text style={styles.subtitle}>{subTitle}</Text>

                  <WelcomeButton
                    tittle={'Yes'}
                    style={{ marginTop: 24, maxWidth: '80%' }}
                    buttonText={{ fontSize: scale(18) }}
                    onPress={onYesPress}
                  />
                  <ClickButton
                    tittle={'Not Now'}
                    style={{ marginTop: 18, maxWidth: '80%' }}
                    onPress={onNoPress}
                  />
                </View>
              </Animated.View>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

export default UserNotFoundModal;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container1: {
    paddingTop: 30,
    paddingBottom:20, 
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: scale(20),
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    backgroundColor: Colors.colorWhite,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
  },
  topIndicator: {
    alignSelf: 'center',
    width: 60,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
  },
  title: {
    fontSize: scale(17),
    // paddingHorizontal:20,
    fontWeight: '600',
    paddingVertical: scale(15),
    color: '#181B1F',
    alignSelf:"center",
    textAlign: 'center'
  },
  subtitle: {
    fontSize: scale(14),
    lineHeight: 20,
    color: '#464B54',
    fontWeight: '400',
    textAlign: 'center',
    marginBottom: 10,
    marginHorizontal: 32,
  },
});
