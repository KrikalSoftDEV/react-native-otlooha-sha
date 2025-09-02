import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  StatusBar,
  Alert,
  Modal,
  Animated,
  Dimensions,
  Platform,
  Image,
} from 'react-native';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  State,
} from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';

import DeleteIcon from '../../assets/images/Common/delete.png';

const { height: screenHeight } = Dimensions.get('window');

const DhikirListModal = ({
  modalVisible,
  setModalVisible,
  renderData = [],
  deleteDhikirItem,
  onClose,
}) => {
  const navigation = useNavigation();
  const [translateY] = useState(new Animated.Value(0));

  const deleteItem = (id) => {
    Alert.alert('Delete Dhikir', 'Are you sure you want to delete this dhikir?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteDhikirItem(id),
      },
    ]);
  };

  const handleAddDhikir = () => {
    onClose();
    navigation.navigate('DhikrSelectionScreen', {
      title: 'Update Dhikir',
      onGoBack: () => {
        setTimeout(() => {
          setModalVisible(true);
        }, 300);
      },
    });
  };

  const handleGestureEvent = Animated.event(
    [{ nativeEvent: { translationY: translateY } }],
    { useNativeDriver: true }
  );

  const handleGestureStateChange = (event) => {
    const { translationY, velocityY, state } = event.nativeEvent;

    if (state === State.END) {
      const shouldClose = translationY > 100 || velocityY > 500;
      if (shouldClose) {
        Animated.timing(translateY, {
          toValue: screenHeight,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onClose();
          translateY.setValue(0);
        });
      } else {
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const renderDhikirItem = ({ item, index }) => {
    const backgroundColor = index === 0 ? '#D6FFEB' : '#ffffff';
    return (
      <View style={[styles.ayahContainer, { backgroundColor }]}>
        <View style={{ flexDirection: 'row', flex: 1 }}>
          <TouchableOpacity onPress={() => deleteItem(item.number)} style={styles.settingsButton}>
            <Image source={DeleteIcon} />
          </TouchableOpacity>
          <View style={styles.ayahTextContainer}>
            <Text style={styles.arabicText}>{item.text}</Text>
            <Text style={[styles.arabicText, { color: '#464B54' }]}>{item.translation}</Text>
            <Text style={styles.arabicText}>Subhan Allah</Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={onClose}>
      <GestureHandlerRootView style={styles.overlay}>
        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [
                {
                  translateY: translateY.interpolate({
                    inputRange: [0, screenHeight],
                    outputRange: [0, screenHeight],
                    extrapolate: 'clamp',
                  }),
                },
              ],
            },
          ]}
        >
          <View style={styles.mainContainer}>
            {/* Drag Header */}
            <PanGestureHandler
              onGestureEvent={handleGestureEvent}
              onHandlerStateChange={handleGestureStateChange}
            >
              <Animated.View style={styles.dragHeader}>
                <View style={styles.dragIndicator} />
              </Animated.View>
            </PanGestureHandler>

            {/* Content */}
            <View style={styles.content}>
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>List of all Selected Dhikir</Text>
                <TouchableOpacity style={styles.addButton} onPress={handleAddDhikir}>
                  <Text style={styles.addButtonText}>+ Add Dhikir</Text>
                </TouchableOpacity>
              </View>

              <FlatList
                data={renderData}
                scrollEnabled={true}
                renderItem={renderDhikirItem}
                keyExtractor={(item) => item.number.toString()}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContainer}
              />
            </View>
          </View>
        </Animated.View>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#00000066',
  },
  mainContainer: {
      flex: 1,
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    backgroundColor: '#FFF',
    maxHeight: screenHeight * 0.95,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  dragHeader: {
    paddingVertical: 10,
  },
  dragIndicator: {
    width: 66,
    height: 5,
    backgroundColor: '#3C3C434D',
    borderRadius: 2,
    alignSelf: 'center',
  },
  content: {
    // flex: 1,
    backgroundColor: '#fff',
    borderTopRightRadius: 36,
    borderTopLeftRadius: 36,
    overflow: 'hidden',
    paddingBottom:100
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181B1F',
  },
  addButton: {
    paddingVertical: 6,
  },
  addButtonText: {
    fontSize: 16,
    color: '#5756C8',
    fontWeight: '500',
  },
  listContainer: {
    paddingBottom: 40, // Give extra padding to avoid clipping last item
  },
  ayahContainer: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDE2EB',
  },
  ayahTextContainer: {
    flex: 1,
  },
  arabicText: {
    fontSize: 14,
    lineHeight: 29,
    textAlign: 'right',
    fontWeight: '500',
    color: '#181B1F',
    writingDirection: 'rtl',
  },
  settingsButton: {
    padding: 5,
    marginRight: 10,
  },
});

export default DhikirListModal;
