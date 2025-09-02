import AsyncStorage from '@react-native-async-storage/async-storage';

 export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('Error saving data:', e);
  }
};


export const getData = async (key) => {
    try {
      const value = await AsyncStorage.getItem(key);
      // console.log('Retrieved value:', JSON.parse(value));
      
      return value != null ? JSON.parse(value) : null;
    } catch (e) {
      console.error('Error reading value:', e);
    }
  };

export const removeData = async (key) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing value:', e);
  }
};
  


export const getAllAyahListData = async (itemData) => {
  try {
    // Step 1: Get all keys
    const allKeys = await AsyncStorage.getAllKeys();

    // Step 2: Filter keys that include "ayahList_"
    const ayahKeys = allKeys.filter(key => key.includes(itemData));

    // Step 3: Get data for those keys
    const ayahData = await AsyncStorage.multiGet(ayahKeys);

    // Step 4: Convert the array to an object or use as needed
    const formattedData = ayahData.map(([key, value]) => ({
      value: JSON.parse(value),
    }));

    return formattedData;
  } catch (error) {
    console.error('Error fetching ayah list data:', error);
    return [];
  }
};