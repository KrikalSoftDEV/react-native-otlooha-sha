import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StatusBar,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Alert,
  Image,
  TextInput,
} from 'react-native';
import Header from '../../components/UI/Header';
import BookMarkBlankBlack from '../../assets/images/Common/BookMark_blank_black.svg';
import SettingIcon from '../../assets/images/Common/settingIcon.svg';
import BookMark_gray from '../../assets/images/Common/BookMark_gray.svg';
import PlayListIcon from '../../assets/images/Common/playListIcon.svg';
import SaveBookmark from '../../assets/images/Common/saveBookmark.svg';
import PlayPuaseListIcon from '../../assets/images/Common/playPuaseListIcon.svg';
import ArrowDownIcon from '../../assets/images/Common/arrow_down.svg';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useLoading } from '../../context/LoadingContext';
import { getQuranJuzAyahList, getQuranSurahAyahList } from '../../redux/slices/quranSlice';
import AudioPlayerControl from '../audio/AudioPlayerControl';
import blue_select from '../../assets/images/Quran/blue_select.png';
import Search_black from '../../assets/images/Quran/search_black.png';
import select_blank from '../../assets/images/Quran/select_blank.png';
import close_gray from '../../assets/images/Common/close_gray.png';
import left_gray_arrow from '../../assets/images/Common/left_gray_arrow.png';
import { WelcomeButton } from '../../components/UI/Button';
// import Data from "../..//Users/macbook/Desktop/waqaf-an-nur-app/assets/dhikir_data.json"
import JSONData from '../../assets/dhikir_data.json'
import AsyncStorage from '@react-native-async-storage/async-storage';
import SearchHeader from './SearchHeader';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const STATUSBAR_HEIGHT = Platform.OS === 'android' ? StatusBar.currentHeight : 0;
const NAVIGATIONBAR_HEIGHT = Platform.OS === 'android' ? 48 : 0;
const ITEM_HEIGHT = 80; // Approximate height for each ayah item

// Memoized Ayah Item Component
const AyahItem = React.memo(({
  item,
  propsData,
  isSelectedIndex,
  isPlaying,
  onPlayPress,
  onBookmarkPress,
  selectedDhikrs,
  setSelectedDhikrs
}) => {
  const isSelected = selectedDhikrs.some(d => d.number === item.number);
  const backgroundColor = isSelected ? '#D6FFEB' : '#ffffff';

  const handleSelect = useCallback(() => {
    let updatedList;
    if (isSelected) {
      updatedList = selectedDhikrs.filter(d => d.number !== item.number);
    } else {
      updatedList = [...selectedDhikrs, item];
    }
    setSelectedDhikrs(updatedList);
    saveToAsyncStorage(updatedList);
  }, [item, isSelected, selectedDhikrs, setSelectedDhikrs]);

  const saveToAsyncStorage = async (items) => {
    try {
      await AsyncStorage.setItem('@selected_Dhikir_items', JSON.stringify(items));
      console.log('Saved to AsyncStorage:', items);
    } catch (e) {
      console.error('Error saving to AsyncStorage:', e);
    }
  };
  const handleBookmarkPress = useCallback(() => {
    onBookmarkPress(item.number);
  }, [item.number, onBookmarkPress]);

  return (
    <View style={[styles.ayahContainer, { backgroundColor }]}>
      <View style={{ flexDirection: 'row', flex: 1 }} >
        <TouchableOpacity onPress={handleSelect} style={styles.settingsButton} activeOpacity={0.7}>
          {isSelected ? <Image source={blue_select} /> : <Image source={select_blank} />}
        </TouchableOpacity>
        <View style={styles.ayahTextContainer}>
          <Text style={styles.titleText}>{item.title}</Text>
          <Text style={styles.arabicText}>{item.text}</Text>
          <Text style={[styles.transliterationText, { color: '#464B54' }]}>{item.transliteration}</Text>
          <Text style={styles.translationText}>{item.translation}</Text>
          <Text style={styles.notesText}>{item.notes}</Text>
        </View>
      </View>
    </View>
  );
});


const DhikrSelectionScreen = props => {
       const insets = useSafeAreaInsets();
  const handleNavigateToTasbih = () => {
    if (selectedDhikrs.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one dhikir');
      return;
    }
    navigation.navigate('TasbihDhikir', {
      dhikrSelectionScreen: "dhikrSelectionScreen",
      selectedTarget: selectedTarget
    });
  }
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isListData, setListData] = useState(JSONData.map((item, index) => ({
    number: index + 1,
    text: item.arabic,
    translation: item.translation,
    transliteration: item.latin,
    title: item.title,
    notes: item.notes,
    target: item.target
  })));
  const [paginatedData, setPaginatedData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);

  const {
    showLoader,
    hideLoader,
    startProcessing,
    stopProcessing,
    setConnectivity,
  } = useLoading();

  const [currentLanguage, setCurrentLanguage] = useState('Arabic');
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingTitle, setIsPlayingTitle] = useState("");
  const [isAudio, setAudio] = useState('');
  const [selectedDhikrs, setSelectedDhikrs] = useState([]);
  const [isTriggerPlaying, setTriggerPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredList, setFilteredList] = useState([]);

  const [isSearchShow, setSearchShow] = useState(false);
  const selectedTarget = props?.route?.params?.target || 0;

  const propsData = props?.route?.params?.item;
  const playerRef = useRef();
  const audioUpdateTimeoutRef = useRef(null);
  // Pagination constants
  const ITEMS_PER_PAGE = 20;

  // Memoized data processing
  const totalPages = useMemo(() =>
    Math.ceil(isListData.length / ITEMS_PER_PAGE),
    [isListData.length]
  );

  // Load initial data and setup pagination
  useEffect(() => {

    if (isListData.length > 0) {
      loadFromAsyncStorage()
      loadPage(0);
    }
  }, [isFocused ,isListData]);

  useEffect(() => {
    const filtered = isListData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.translation.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredList(filtered);
    loadPage(0, filtered);
  }, [isListData, searchQuery]);

  const loadFromAsyncStorage = async () => {
    try {
      const stored = await AsyncStorage.getItem('@selected_Dhikir_items');
      console.log("selected_Dhikir_items----",JSON.parse(stored))
      if (stored) {
        setSelectedDhikrs(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading from AsyncStorage:', e);
    }
  };

  // Optional: Load selected items on mount
  const loadPage = useCallback((pageNumber, sourceData = filteredList) => {
    const startIndex = 0;
    const endIndex = (pageNumber + 1) * ITEMS_PER_PAGE;
    const newData = sourceData.slice(startIndex, endIndex);
    setPaginatedData(newData);
    setCurrentPage(pageNumber);
  }, [filteredList]);


  const loadMoreData = useCallback(() => {
    if (currentPage < totalPages - 1) {
      loadPage(currentPage + 1);
    }
  }, [currentPage, totalPages, loadPage]);

  useEffect(() => {
    if (isFocused) {
      // handleGetApi();
    }
  }, [isFocused]);
console.log(insets.bottom,'chreck the insets')
  // Optimized audio handling with debouncing
  const handlePlayPress = useCallback((itemNumber, audioUrl, playingTitle) => {
    // Clear any pending audio updates
    if (audioUpdateTimeoutRef.current) {
      clearTimeout(audioUpdateTimeoutRef.current);
    }

    // Update selected index immediately for UI feedback
    setSelectedIndex(itemNumber);
    setIsPlayingTitle(playingTitle);
    setTriggerPlaying(true);

    // Debounce audio URL update to prevent rapid changes
    audioUpdateTimeoutRef.current = setTimeout(() => {
      setAudio(audioUrl);
      triggerPlayPause();
    }, 100);
  }, []);

  const handleBookmarkPress = useCallback((itemNumber) => {
    // Update bookmark status locally for immediate UI feedback
    setPaginatedData(prevData =>
      prevData.map(item =>
        item.number === itemNumber
          ? { ...item, isBookmarked: !item.isBookmarked }
          : item
      )
    );

    // Also update the original data
    setListData(prevData =>
      prevData.map(item =>
        item.number === itemNumber
          ? { ...item, isBookmarked: !item.isBookmarked }
          : item
      )
    );
  }, []);

  const triggerPlayPause = useCallback(() => {
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.playPause();
      }
    }, 1000); // Reduced timeout for faster response
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (audioUpdateTimeoutRef.current) {
        clearTimeout(audioUpdateTimeoutRef.current);
      }
    };
  }, []);

  // Optimized key extractor
  const keyExtractor = useCallback((item, index) =>
    item.number?.toString() || index.toString(),
    []);

  // Fixed item layout for better performance
  const getItemLayout = useCallback((data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  }), []);

  const { onGoBack } = props.route?.params || {};

  // Header navigation callbacks
  const handleBackPress = useCallback(() => {
    navigation.goBack();
    if (onGoBack) {
      onGoBack('Your data here');
    }
  }, [navigation, onGoBack]);

  const handleBookmarkPagePress = useCallback(() => {
    navigation.navigate('SavedAyahsList');
  }, [navigation]);

  // Optimized render function
  const renderAyah = useCallback(({ item }) => (
    <AyahItem
      item={item}
      propsData={propsData}
      selectedDhikrs={selectedDhikrs}
      setSelectedDhikrs={setSelectedDhikrs}
      onBookmarkPress={handleBookmarkPress}
    />
  ), [propsData, selectedDhikrs, setSelectedDhikrs, handleBookmarkPress]);
  const handleClearSearch = () => {
    setSearchQuery('');
  }
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {!isSearchShow ? (
          <View style={Platform.OS==='android'?{paddingTop:10}:0}>
          <Header
            headerTitle={propsData?.name || 'Select Dhikir'}
            leftIcon={<Image source={Search_black} style={styles.headerIcon} />}
            onPressLeft={() => setSearchShow(!isSearchShow)}
            onBackPress={() => navigation.goBack()}
            
          />
          </View>
        ) : (
          <SearchHeader
            title="Al-Faatiha"
            onBackPress={() => setSearchShow(!isSearchShow)}
            onClear={handleClearSearch}
            setSearchQuery={setSearchQuery}
            searchQuery={searchQuery}
          />
        )}
        {paginatedData.length === 0 ? (
          <View style={styles.notFoundContainer}>
            <Text style={styles.notFoundText}>No search results found</Text>
          </View>
        ) : (<>
          <FlatList
            data={paginatedData}
            renderItem={renderAyah}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={50}
            initialNumToRender={10}
            windowSize={10}
            onEndReached={loadMoreData}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
            style={styles.flatList}
          />
          <View style={{  paddingBottom: insets?.bottom+20, borderTopWidth: 1, borderTopColor: '#DDE2EB' ,padding:20}}>
            <WelcomeButton
              tittle={'Add Dhikir'}
              onPress={() => {
                handleNavigateToTasbih()
              }}
            />
          </View>
        </>
      )}
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#4A44C6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  floatingButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  titleText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  transliterationText: {
    fontSize: 14,
    color: '#464B54',
    marginVertical: 2,
  },
  translationText: {
    fontSize: 14,
    color: '#333',
    marginVertical: 2,
  },
  notesText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 2,
  },
  container: {
    flex: 1,
    paddingTop: STATUSBAR_HEIGHT,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  backButton: {
    padding: 5,
  },
  backIcon: {
    fontSize: 24,
    color: '#000',
  },
  headerTitleContainer: {
    marginLeft: 24,
    marginBottom: 34,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#181B1F',
    paddingRight: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#464B54',
    marginTop: 8,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bookmarkPageButton: {
    marginRight: 20,
  },
  bookmarkPageIcon: {
    fontSize: 22,
  },
  settingsButton: {
    padding: 5,
  },
  settingsIcon: {
    fontSize: 22,
  },
  flatList: {
    flex: 1,
  },
  ayahContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#DDE2EB',
    minHeight: ITEM_HEIGHT,
  },
  ayahTextContainer: {
    // marginBottom: 12,
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
  ayahFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
  },
  ayahNumber: {
    fontSize: 14,
    fontWeight: '400',
    color: '#88909E',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
    // marginRight: 15,
    padding: 5,
  },
  playCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 18,
    color: '#777',
  },
  bookmarkButton: {
    padding: 5,
  },
  filledBookmark: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyBookmark: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookmarkIcon: {
    fontSize: 18,
    color: '#555',
  },
  playerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#191967',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingBottom: NAVIGATIONBAR_HEIGHT,
  },
  playbackSpeedButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playbackSpeedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
    width: 40,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    padding: 10,
  },
  prevIcon: {
    color: '#fff',
    fontSize: 18,
  },
  mainPlayButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#3BC47D',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  mainPlayIcon: {
    color: '#fff',
    fontSize: 24,
  },
  nextButton: {
    padding: 10,
  },
  nextIcon: {
    color: '#fff',
    fontSize: 18,
  },
  languageButton: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  languageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    width: 70,
    textAlign: 'right',
  },
  progressContainer: {
    height: 5,
    backgroundColor: '#DDE2EB',
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3BC47D',
    borderRadius: 6,
  },
    notFoundContainer: {
    alignItems: 'center',
    // marginTop: 100,
  },
  notFoundText:{
    fontSize: 14,
    fontWeight: '400',
    color: '#88909E',
    paddingRight: 8,
  },
});

export default DhikrSelectionScreen;