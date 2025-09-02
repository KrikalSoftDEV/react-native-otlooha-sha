import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ViewStyle, KeyboardAvoidingView, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

type BottomSheetComponentProps = {
  fromRef: React.RefObject<BottomSheet>;
  children?: React.ReactNode;
  snapPoints?: (string | number)[];
  initialSnapIndex?: number;
  containerStyle?: ViewStyle;
  onChange?: (index: number) => void;
  onClose?: () => void;
};

const BottomSheetComponent: React.FC<BottomSheetComponentProps> = ({
  fromRef,
  children,
  snapPoints = ['50%'],
  initialSnapIndex = -1,
  containerStyle,
  onChange,
  onClose,
}) => {
  const handleSheetChanges = useCallback(
    (index: number) => {
      console.log('Bottom sheet changed to index:', index);
      if (onChange) onChange(index);
    },
    [onChange]
  );

  const renderBackdrop = useCallback((props: BottomSheetBackdropProps) => {
    return (
      <BottomSheetBackdrop
        {...props}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        pressBehavior="close"
        style={[StyleSheet.absoluteFill, styles.overlay]}
      />
    );
  }, []);

  return (

      <BottomSheet
        ref={fromRef}
        index={initialSnapIndex}
        snapPoints={useMemo(() => snapPoints, [snapPoints])}
        keyboardBehavior="fillParent"
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        onChange={handleSheetChanges}
        onClose={onClose}
        backdropComponent={renderBackdrop}
      
      >
        <BottomSheetView style={styles.contentContainer}>
          {children || <Text>🎉 Hello from BottomSheet!</Text>}
        </BottomSheetView>
      </BottomSheet>
 
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
   keyboardAvoiding: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default BottomSheetComponent;
