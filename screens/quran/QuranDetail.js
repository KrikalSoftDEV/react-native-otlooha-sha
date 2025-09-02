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
} from 'react-native';
import Header from '../../components/UI/Header';
import BookMarkBlankBlack from '../../assets/images/Common/BookMark_blank_black.svg';
import SettingIcon from '../../assets/images/Common/settingIcon.svg';
import BookMark_gray from '../../assets/images/Common/BookMark_gray.svg';
import PlayListIcon from '../../assets/images/Common/playListIcon.svg';
import SaveBookmark from '../../assets/images/Common/saveBookmark.svg';
import PlayPuaseListIcon from '../../assets/images/Common/playPuaseListIcon.svg';
import ArrowDownIcon from '../../assets/images/Common/arrow_down.svg';
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { useLoading } from '../../context/LoadingContext';
import {
  getQuranJuzAyahList,
  getQuranSurahAyahList,
} from '../../redux/slices/quranSlice';
import AudioPlayerControl from '../audio/AudioPlayerControl';
import { saveBookmarklist } from '../../redux/slices/bookmarkSlice';
import LanguageModal from '../common/LanguageModal';
import strings from '../../constants/Strings';
import { changeLanguageApi } from '../../redux/slices/userSlice';
import { Toast, useToast } from 'react-native-toast-notifications';
import { getData, storeData } from '../../constants/Storage';
import AyahItem from './AyahItem';
import AyahSelectorModal from './AyahSelectorModal';

const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight : 0;
const NAVIGATIONBAR_HEIGHT = Platform.OS === 'android' ? 48 : 0;
const ITEM_HEIGHT = 120; 

const QuranDetail = props => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isListData, setListData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [ayahData,setAyahData]=useState([])
  const [currentPage, setCurrentPage] = useState(0);
  const { showLoader, hideLoader } = useLoading();
  const toast = useToast();
  const [isState, setState] = useState(true);
  const [currentLanguage, setCurrentLanguage] = useState('Arabic');
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayingTitle, setIsPlayingTitle] = useState('');
  const [isAudio, setAudio] = useState('');
  const [isSelectedIndex, setSelectedIndex] = useState(null);
  const [isTriggerPlaying, setTriggerPlaying] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
    const [ayahSelectorModalVisible,setAyahSelectorModalVisible]=useState(false)
  const propsData = props?.route?.params?.item;
  const playerRef = useRef();
  const audioUpdateTimeoutRef = useRef(null);
     const [language,setLangauge]=useState(null)
    const [prevNextPlay, setPrevNextPlay]=useState(false)
  // Pagination constants
  const ITEMS_PER_PAGE = 20;

  // Memoized data processing
  const totalPages = useMemo(
    () => Math.ceil(isListData.length / ITEMS_PER_PAGE),
    [isListData.length],
  );
console.log(propsData,'cehk the props data')
  // Load initial data and setup pagination
  useEffect(() => {
    if (isListData.length > 0) {
      loadPage(0);
    }
  }, [isListData]);


  useEffect(()=>{
    getLanguage()
  },[isFocused,language])
  
  const getLanguage=async()=>{
  
          const isLangFlag = await getData("isQuranLangFlag");
      if(isLangFlag==="en"){
      setLangauge("English")
        }
  else if(isLangFlag==="my"){
   setLangauge("Malay")
  }
  
  }

  const loadPage = useCallback(
    pageNumber => {
      const startIndex = 0;
      const endIndex = (pageNumber + 1) * ITEMS_PER_PAGE;
      const newData = isListData.slice(startIndex, endIndex);
      //here set the array with ticked flags
      setPaginatedData(newData);
         setAyahData(isListData)
      setCurrentPage(pageNumber);
    },
    [isListData],
  );

  const loadMoreData = useCallback(() => {
    if (currentPage < totalPages - 1) {
      loadPage(currentPage + 1);
    }
  }, [currentPage, totalPages, loadPage]);

  useEffect(() => { }, [isFocused]);

  useFocusEffect(
    useCallback(() => {
      const getLocalData = async () => {
        if (propsData.revelationType) {
          const ayahListData = await getData(`ayahList_${propsData?.number}`);

          if (ayahListData !== null) {
            setListData(ayahListData || []);
          } else {
            handleGetApi();
          }
        } else {
          const juzListData = await getData(`juzList_${propsData?.number}`);

          if (juzListData !== null) {
            setListData(juzListData || []);
          } else {
            handleGetApi();
          }
        }
      };
      getLocalData();
    }, []),
  );

  const handleGetApi = useCallback(() => {
    const ayahsNumber = propsData?.number;
    const juzNumber = propsData?.number;
    if (propsData?.revelationType) {
      showLoader(true);
      dispatch(getQuranSurahAyahList({ ayahsNumber }))
        .unwrap()
        .then(async res => {
          hideLoader(true);
          if (res?.code === 200) {
            const updatedVerses = res?.data?.ayahs.map(verse => ({
              ...verse,
              isBookmarked: false,
              chapterTitle:propsData.name,
              englishName: "",
            }));

            await storeData(`ayahList_${propsData?.number}`, updatedVerses);

            setListData(updatedVerses || []);
          } else {
            // Handle error
            console.error('Data fetch failed:', res?.data?.message);
          }
        })
        .catch(err => {
          console.error('API Error:', err);
          hideLoader(true);
        });
    } else {
      showLoader(true);
      dispatch(getQuranJuzAyahList({ juzNumber }))
        .unwrap()
        .then(async res => {
          hideLoader(true);
          if (res?.code === 200) {
            const updatedVerses = res?.data?.ayahs.map(verse => ({
              ...verse,
              isBookmarked: false,
              chapterTitle:propsData.name,
              englishName: "",
            }));

            await storeData(`juzList_${propsData?.number}`, updatedVerses);

            setListData(updatedVerses || []);
          } else {
            console.error('Data fetch failed:', res?.data?.message);
          }
        })
        .catch(err => {
          console.error('API Error:', err);
          hideLoader(true);
        });
    }
  }, [propsData, dispatch, showLoader, hideLoader]);

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
  const getAyahList = async (bookmarkedItem, title) => {
    const navigationData = propsData.name
      ? `ayahList_${propsData.number}`
      : `juzList_${propsData.number}`;
    const ayahListData = await getData(navigationData);

    const data = ayahListData.map(item => {
      return item.number === bookmarkedItem
        ? { ...item, isBookmarked: !item.isBookmarked, englishName: title }
        : item;
    });

    ayahListStore(data);
    setPaginatedData(data);
    return data;
  };
  const ayahListStore = async ayahListData => {
    const navigationData = propsData.name
      ? `ayahList_${propsData.number}`
      : `juzList_${propsData.number}`;
    await storeData(navigationData, ayahListData);
  };

  const handleBookmarkPress = useCallback((itemNumber, title) => {
    console.log(title, 'cehck the bug data')
    const ayahListData = getAyahList(itemNumber, title);
  }, []);

  const triggerPlayPause = useCallback(() => {
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.playPause();
      }
    }, 200); // Reduced timeout for faster response
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (audioUpdateTimeoutRef.current) {
        clearTimeout(audioUpdateTimeoutRef.current);
      }
    };
  }, []);

  // Optimized render function
  const renderAyah = useCallback(
    ({ item, index }) => (
      <AyahItem
        item={item}
        propsData={propsData}
        isSelectedIndex={isSelectedIndex}
        isPlaying={isPlaying}
        onPlayPress={handlePlayPress}
         setPrevNextPlay={setPrevNextPlay}
        onSurahEnd={onSurahEnd}
        onBookmarkPress={handleBookmarkPress}
      />
    ),
    [
      propsData,
      isSelectedIndex,
      isPlaying,
      handlePlayPress,
      handleBookmarkPress,
    ],
  );

  // Optimized key extractor
  const keyExtractor = useCallback(
    (item, index) => item.number?.toString() || index.toString(),
    [],
  );

  // Fixed item layout for better performance
  const getItemLayout = useCallback(
    (data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  // Header navigation callbacks
  const handleBackPress = useCallback(() => {
    props.navigation.goBack();
  }, [props.navigation]);

  const handleBookmarkPagePress = useCallback(() => {
    const navigationData = propsData.name
      ? `ayahList_${propsData.number}`
      : `juzList_${propsData.number}`;

    props.navigation.navigate('SavedAyahsList', {
      type: propsData.name ? 'Surah' : 'Juz',
      number: propsData.number,
    });
  }, [props.navigation]);

   
      const handleLanguageSelect = async(languageData) => {
    await storeData("isQuranFeatureFlag",true)
  
        setModalVisible(false);
      const langUpdate=languageData==="English"?"en":"my";
           await storeData('isQuranLangFlag', langUpdate);
  if(languageData==="English"){
    setLangauge("English")
  }
  else if(languageData==="Malay"){
      setLangauge("Malay")
  }
  
      };
  

  const onSurahEnd = item => {
    const data = isSelectedIndex + 1;

    const itemOfAyah = paginatedData.find((item, index) => data === item.number);
    if (itemOfAyah === undefined) {
      return;
    }
    setSelectedIndex(data);
    const playingTitle = `${propsData?.englishName || propsData?.name} : ${itemOfAyah.numberInSurah
      }`;
    handlePlayPress(itemOfAyah.number, itemOfAyah?.audio, playingTitle);
  };

  const handleNextAyah = () => {
    const nextNumber = isSelectedIndex + 1;
    const nextItem = paginatedData.find(v => v.number === nextNumber);
    if (!nextItem) return; // already at last ayah
    const title = `${propsData?.englishName || propsData?.name} : ${nextItem.numberInSurah}`;
    setPrevNextPlay(true)
    setSelectedIndex(nextNumber);
    setIsPlayingTitle(title);
    handlePlayPress(nextNumber, nextItem.audio, title, "continue play");
  };

  const handlePrevAyah = () => {
    const prevNumber = isSelectedIndex - 1;
    const prevItem = paginatedData.find(v => v.number === prevNumber);
    if (!prevItem) return;          // already at first ayah
    const title = `${propsData?.englishName || propsData?.name} : ${prevItem.numberInSurah}`;
    setPrevNextPlay(true)
    setSelectedIndex(prevNumber);
    setIsPlayingTitle(title);

    handlePlayPress(prevNumber, prevItem.audio, title, "continue play");

  };
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        {/* Header */}
        <View style={styles.header}>
          <Header onBackPress={handleBackPress} />

          <View style={styles.headerRight}>
            <TouchableOpacity
              onPress={handleBookmarkPagePress}
              style={styles.bookmarkPageButton}
              activeOpacity={0.7}>
              <BookMarkBlankBlack fill="red" />
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              style={styles.settingsButton}
              activeOpacity={0.7}>
              <SettingIcon />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.headerTitleContainer}>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={()=>setAyahSelectorModalVisible(true)} >
            <Text style={styles.headerTitle}>{propsData?.englishName}{propsData?.englishNameTranslation ? `(${propsData?.englishNameTranslation})` : ""}</Text>
            <ArrowDownIcon />
          </TouchableOpacity>
          <Text style={styles.headerSubtitle}>
            {propsData?.numberOfAyahs || propsData?.numberOfJuzAyahs} Ayat
          </Text>
        </View>

        {/* Optimized FlatList */}
        <FlatList
          data={paginatedData}
          renderItem={renderAyah}
          keyExtractor={keyExtractor}
          getItemLayout={getItemLayout}
          // Performance optimizations
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
          // Pagination
          onEndReached={loadMoreData}
          onEndReachedThreshold={0.5}
          // UI optimizations
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          // Extra data for re-rendering optimization
          extraData={isSelectedIndex}
        />

    { isSelectedIndex!==null &&   <AudioPlayerControl
          audioUrl={isAudio}
          playbackSpeed={playbackSpeed}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
          setCurrentLanguage={setCurrentLanguage}
          currentLanguage={currentLanguage}
          ref={playerRef}
          prevNextPlay={prevNextPlay}
          setPrevNextPlay={setPrevNextPlay}
          isPlayingTitle={isPlayingTitle}
          onSurahEnd={onSurahEnd}
          isLastIndex={paginatedData?.length} 
          isCurrentIndex={isSelectedIndex}
          onPrevTrack={handlePrevAyah}
          onNextTrack={handleNextAyah}
        />}
        {/* <LanguageModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={handleLanguageSelect}
          langSelect={strings.getLanguage() == 'en' ? 'English' : 'Malay'}
        /> */}

         <LanguageModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={handleLanguageSelect}
          langSelect={language}
        />
        <AyahSelectorModal 
          propsData={propsData}
          isSelectedIndex={isSelectedIndex}
          renderData={ayahData}
          ayahSelectorModalVisible={ayahSelectorModalVisible}
          onClose={()=>setAyahSelectorModalVisible(false)}
           onPlayPress={handlePlayPress}
        />
      </SafeAreaView>
      <SafeAreaView style={{ backgroundColor: '#191967' }} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? STATUSBAR_HEIGHT : 0
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 16,
    // paddingVertical: 20,
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
    paddingTop: 5,
    paddingHorizontal: 16,
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
    marginBottom: 12,
  },
  arabicText: {
    fontSize: 24,
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
    marginRight: 15,
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
});

export default QuranDetail;
