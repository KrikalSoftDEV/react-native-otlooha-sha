import React, {useEffect, useRef, useState} from 'react';
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
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { useLoading } from '../../context/LoadingContext';
import { getQuranJuzAyahList, getQuranSurahAyahList } from '../../redux/slices/quranSlice';
import AudioPlayerControl from '../audio/AudioPlayerControl';

// BookMark_gray
// playListIcon
// playPuaseListIcon
// saveBookmark

// Sample Quran data for Al-Fatiha
const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight : 0;
const NAVIGATIONBAR_HEIGHT = Platform.OS === 'android' ? 48 : 0; // Estimated navigation bar height
const alFatihaData = [
  {
    id: '1',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    arabicAlt: 'الرَّحْمَٰنِ الرَّحِيمِ',
    ayahNumber: '1/7',
    isBookmarked: true,
  },
  {
    id: '2',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    arabicAlt: '',
    ayahNumber: '2/7',
    isBookmarked: false,
  },
  {
    id: '3',
    arabic: 'الرَّحْمَٰنِ بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    arabicAlt:
      'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ\nالرَّحْمَٰنِ الرَّحِيمِ',
    ayahNumber: '3/7',
    isBookmarked: false,
  },
  {
    id: '4',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    arabicAlt: '',
    ayahNumber: '4/7',
    isBookmarked: false,
  },
  {
    id: '5',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    arabicAlt: '',
    ayahNumber: '5/7',
    isBookmarked: false,
  },
  {
    id: '6',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    arabicAlt: '',
    ayahNumber: '6/7',
    isBookmarked: false,
  },
  {
    id: '7',
    arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    arabicAlt: '',
    ayahNumber: '7/7',
    isBookmarked: false,
  },
];

const QuranDetail_2 = props => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [isListData, setListData] = useState(null);
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
  const [isAudio, setAudio] = useState('')
  const [ isSelectedIndex, setSelectedIndex] = useState(null)
  const [ isTriggerPlaying, setTriggerPlaying] = useState(false)
const propsData = props?.route?.params?.item

  

useEffect(() => {
    if (isFocused == true) {
      handleGetApi();
    }
  }, [isFocused]);
console.log("-=--=-=-=--propsDa", propsData);

  const handleGetApi = () => {
    
    const ayahsNumber =  propsData?.number;
    const juzNumber =  propsData?.id;
    
   if(propsData?.number) { 
    showLoader(true);
    dispatch(getQuranSurahAyahList({ayahsNumber}))
      .unwrap()
      .then(async res => {
        hideLoader(true);
        if (res?.code === 200) {
          setListData(res?.data?.ayahs);
        } else {
          toast.show(res?.data?.message || 'data fetch failed', {
            type: 'danger',
            placement: 'bottom',
          });
        }
      })
      .catch(err => {
        toast.show(res?.data?.message || 'Something went wrong!', {
          type: 'danger',
          placement: 'bottom',
        });
        hideLoader(true);
      });
    } else {
showLoader(true);
dispatch(getQuranJuzAyahList({juzNumber}))
  .unwrap()
  .then(async res => {
    hideLoader(true);
    if (res?.code === 200) {
      setListData(res?.data?.ayahs);
    } else {
      toast.show(res?.data?.message || 'data fetch failed', {
        type: 'danger',
        placement: 'bottom',
      });
    }
  })
  .catch(err => {
    toast.show(res?.data?.message || 'Something went wrong!', {
      type: 'danger',
      placement: 'bottom',
    });
    hideLoader(true);
  });
    }
  };
  const playerRef = useRef();

  const triggerPlayPause = () => {
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.playPause(); // 🔥 Call child function from parent
      }  
    }, 1000);
    
  };

useEffect(() => {
if(isTriggerPlaying == true && isAudio){
  
}
},[isAudio, isTriggerPlaying])
  // Render each ayah (verse)
  console.log('-=-===-=-==-propsData', isPlayingTitle);
  
  const renderAyah = ({item}) => {
    const backgroundColor = item.number == isSelectedIndex ? '#D6FFEB' : '#ffffff';
    const playingTitle = (propsData?.englishName || propsData?.name) + " " + ':' + " " + item.numberInSurah
    return (
      <View style={[styles.ayahContainer, {backgroundColor}]}>
        <View style={styles.ayahTextContainer}>
          <Text style={styles.arabicText}>{item.text}</Text>
          {item.arabicAlt !== '' && (
            <Text style={styles.arabicText}>{item.arabicAlt}</Text>
          )}
        </View>

        <View style={styles.ayahFooter}>
          <Text style={styles.ayahNumber}>{item.numberInSurah}/{propsData?.numberOfAyahs} Ayat</Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity onPress={() => { setSelectedIndex(item.number); setAudio(item?.audio);triggerPlayPause(); setTriggerPlaying(true); setIsPlayingTitle(playingTitle)}} style={styles.playButton}>
              {isPlaying == true && item.number == isSelectedIndex? (
                <PlayPuaseListIcon />
              ) : (
                <PlayListIcon />
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.bookmarkButton}>
              {item.isBookmarked ? (
                <View style={styles.filledBookmark}>
                  <SaveBookmark />
                </View>
              ) : (
                <View style={styles.emptyBookmark}>
                  <BookMark_gray />
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="red" />

        {/* Header */}
        <View style={styles.header}>
          <Header onBackPress={() => props.navigation.goBack()} />

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={() => props.navigation.navigate('SavedAyahsList')} style={styles.bookmarkPageButton}>
              <BookMarkBlankBlack fill="red" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsButton}>
              <SettingIcon />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerTitleContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.headerTitle}>{propsData?.name}</Text>
            {/* <Text style={styles.headerTitle}>Al-Faatiha (The Opening)</Text> */}
            <ArrowDownIcon />
          </View>

          <Text style={styles.headerSubtitle}>{propsData?.numberOfAyahs} Ayat</Text>
        </View>
        {/* Main Content - FlatList of Ayahs */}
        <FlatList
          data={isListData}
          renderItem={renderAyah}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
          style={styles.flatList}
          initialNumToRender={10}
        />
        <AudioPlayerControl
        audioUrl={isAudio}
        playbackSpeed={playbackSpeed} setIsPlaying={setIsPlaying} isPlaying={isPlaying}
        setCurrentLanguage={setCurrentLanguage}
          currentLanguage={currentLanguage}
          ref={playerRef} 
          isPlayingTitle={isPlayingTitle}
        />
      </SafeAreaView>
      <SafeAreaView style={{backgroundColor: '#191967'}} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  ayahTextContainer: {
    // alignItems: 'flex-end',
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
    // marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3BC47D',
    borderRadius: 6,
  },
});

export default QuranDetail_2;
