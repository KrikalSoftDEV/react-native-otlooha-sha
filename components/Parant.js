import React, { useRef } from 'react';
import { View, Button, Text, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet'; // Import BottomSheet component
import BottomSheetComponent from './BottomSheetComponent'; // Assuming this is your reusable component

const ParentComponent = () => {
  const bottomSheetRef = useRef(null); // Create a ref to interact with the BottomSheet

  // Function to open the bottom sheet
  const openSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand(); // Expand the bottom sheet
    }
  };

  // Handle sheet changes (close on scroll down)
  const handleSheetChanges = (index) => {
    console.log('BottomSheet index changed to:', index);
    if (index === 0) { // If the sheet is at the lowest position, close it
      // bottomSheetRef.current.close();
    }
  };

  return (
    <View style={styles.container}>
      {/* Button to open the Bottom Sheet */}
      <Button title="Open Bottom Sheet" onPress={openSheet} />
      
      {/* BottomSheetComponent with ref passed to it */}
      <BottomSheetComponent 
        fromRef={bottomSheetRef} 
        onChange={handleSheetChanges}
      >
        <View style={styles.sheetContent}>
          <Text style={styles.title}>🎉 Hello from Bottom Sheet</Text>
          <Button title="Close Bottom Sheet" onPress={() => bottomSheetRef.current.close()} />
        </View>
      </BottomSheetComponent>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    paddingTop:200,
    height:'100%'
  },
  sheetContent: {
    padding: 20,
    width: '100%',
    height:'100%'
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
});

export default ParentComponent;
