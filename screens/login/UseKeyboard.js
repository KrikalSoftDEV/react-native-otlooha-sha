import React, { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

export const useKeyboard = () => {
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (_e) => setKeyboardVisible(true);
    const onHide = () => setKeyboardVisible(false);

    const showListener = Keyboard.addListener(showEvent, onShow);
    const hideListener = Keyboard.addListener(hideEvent, onHide);

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return isKeyboardVisible;
};
