import React, {useState,useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Header from '../../components/UI/Header';
import Heart_black from '../../assets/images/Common/heart_black.svg';
import SettingIcon from '../../assets/images/Common/settingIcon.svg';
import HeartFillBlue from '../../assets/images/Common/heart_fill_blue.svg';
import PlayListIcon from '../../assets/images/Common/playListIcon.svg';
import HeartGray from '../../assets/images/Common/heart_gray.svg';
import PlayPuaseListIcon from '../../assets/images/Common/playPuaseListIcon.svg';
import ArrowDownIcon from '../../assets/images/Common/arrow_down.svg';
import AudioPlayerControl from '../audio/AudioPlayerControl';
import AudioPlayer from '../audio/AudioPlayer';
import { changeLanguageApi } from '../../redux/slices/userSlice';
import strings from '../../constants/Strings';
import { useDispatch } from 'react-redux';
import LanguageModal from '../common/LanguageModal';
import { useLoading } from '../../context/LoadingContext';
import { Toast } from 'react-native-toast-notifications';
import Colors from '../../constants/Colors';
import { getData, storeData } from '../../constants/Storage';
import { useIsFocused } from '@react-navigation/native';

// Get screen dimensions
const {width, height} = Dimensions.get('window');
const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight : 0;
const NAVIGATIONBAR_HEIGHT = Platform.OS === 'android' ? 48 : 0; // Estimated navigation bar height

const DuaDetail = props => {

  const dua=props.route.params.dua
  const dispatch=useDispatch()
  const [modalVisible, setModalVisible] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFavorite, setIsFavorite] = useState(dua.isBookmark);
  const [playbackSpeed, setPlaybackSpeed] = useState('1x');
  const [currentLanguage, setCurrentLanguage] = useState('Arabic');
    const {showLoader, hideLoader} = useLoading();
    const [audioUrl,setAudioUrl]=useState("https://cdn.islamic.network/quran/audio/128/ar.alafasy/24.mp3")
  const [language,setLangauge]=useState(null)
  const isFocused = useIsFocused()
  const playerRef = useRef();
  const audioUpdateTimeoutRef = useRef(null);
    const [isPlayingTitle, setIsPlayingTitle] = useState('');
useEffect(()=>{
  getLanguage()
},[isFocused,language])

const getLanguage=async()=>{

        const isLangFlag = await getData("isLangFlag");
    if(isLangFlag==="en"){
    setLangauge("English")
      }
else if(isLangFlag==="my"){
 setLangauge("Malay")
}

}

  useEffect(() => {
    return () => {
      if (audioUpdateTimeoutRef.current) {
        clearTimeout(audioUpdateTimeoutRef.current);
      }
    };
  }, []);
  // Toggle play/pause
  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };
const storeDataInLocal=async(dataDuaJson)=>{
  await storeData("dua_json" , dataDuaJson);

}

const getDuaData=async(idOffDua)=>{
          const getDuaList = await getData(`dua_json`);
          const updatedDuaJsonData = getDuaList.map(item => {
            
    if (item.id === idOffDua) {
      return {
        ...item,
        isBookmark: !item.isBookmark, // toggle the value
      };
    }
    return item; // keep others unchanged
  });
storeDataInLocal(updatedDuaJsonData)
}
  // Toggle favorite
  const toggleFavorite = (id) => {
getDuaData(id)
    setIsFavorite(!dua.isBookmark);


  };

  // Toggle language
  const toggleLanguage = () => {
    setCurrentLanguage(currentLanguage === 'Arabic' ? 'English' : 'Arabic');
  };

  // Toggle playback speed
  const togglePlaybackSpeed = () => {
    const speeds = ['0.5x', '1x', '1.5x', '2x'];
    const currentIndex = speeds.indexOf(playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex]);
  };

  
    const handleLanguageSelect = async(languageData) => {
  await storeData("isDuaFeatureFlag",true)

      setModalVisible(false);
    const langUpdate=languageData==="English"?"en":"my";
         await storeData('isLangFlag', langUpdate);
if(languageData==="English"){
  setLangauge("English")
}
else if(languageData==="Malay"){
    setLangauge("Malay")
}

    };


const storeLocalDua=async()=>{
const updatedDuaJsonData = DuaJsonData.map(item => ({
  ...item,
  isBookmark: false,
}));
  await storeData("dua_json" , updatedDuaJsonData);

}


  const triggerPlayPause = useCallback(() => {
    setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.playPause();
      }
    }, 200); // Reduced timeout for faster response
  }, []);

   const handlePlayPress = useCallback((itemNumber, audioUrl, playingTitle) => {
      // Clear any pending audio updates
      if (audioUpdateTimeoutRef.current) {
        clearTimeout(audioUpdateTimeoutRef.current);
      }
      // Update selected index immediately for UI feedback
      // setSelectedIndex(itemNumber);
      setIsPlayingTitle(playingTitle);
      // setTriggerPlaying(true);
  
      // Debounce audio URL update to prevent rapid changes
      audioUpdateTimeoutRef.current = setTimeout(() => {
   setAudioUrl(audioUrl)
        triggerPlayPause();
      }, 100);
    }, []);


  const onSurahEnd = item => {
    // const data = isSelectedIndex + 1;

    // const itemOfAyah = paginatedData.find((item, index) => data === item.number);
    // if (itemOfAyah === undefined) {
    //   return;
    // }
    // setSelectedIndex(data);
    // const playingTitle = `${propsData?.englishName || propsData?.name} : ${itemOfAyah.numberInSurah
    //   }`;
    // handlePlayPress(itemOfAyah.number, itemOfAyah?.audio, playingTitle);
  };

  return (
    <View style={{flex: 1}}>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <Header onBackPress={() => props.navigation.goBack()} />

          <View style={styles.headerRight}>
            <TouchableOpacity onPress={()=>{props.navigation.replace("FavoriteDua")}}style={styles.bookmarkPageButton}>
              <Heart_black />
            </TouchableOpacity>

            <TouchableOpacity  onPress={() => setModalVisible(true)} style={styles.settingsButton}>
              <SettingIcon />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{language==="Malay"?dua?.titleMalay:dua?. title}</Text>
          {/* <ArrowDownIcon /> */}
        </View>
        {/* <View style={styles.header}>
        <TouchableOpacity style={styles.backButton}>
          <Text style={styles.backIcon}>{'<'}</Text>
        </TouchableOpacity>
        
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Dua 1</Text>
          <Text style={styles.dropdownIcon}>▼</Text>
        </View>
        
        <View style={styles.headerRightButtons}>
          <TouchableOpacity 
            style={styles.heartButton}
            onPress={toggleFavorite}
          >
            {isFavorite ? 
              <Text style={styles.heartIcon}>♥</Text> : 
              <Text style={styles.heartOutlineIcon}>♡</Text>
            }
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </View>
       */}
        {/* Main Content */}
        <View style={[styles.contentContainer,{backgroundColor: '#D6FFEB'}]}>
          <View style={styles.duaTextContainer}>
            <Text style={styles.duaText}>
              {dua?.arabic}
            </Text>
            <Text style={styles.textStyle}>
             {dua.latin}
            </Text>
        {language!==null &&    <Text style={styles.textStyle1}>
               {language==="English"?dua.translation:dua.melayTranslation}
            </Text>}
          </View>

          <View style={styles.duaActionButtons}>
            <TouchableOpacity onPress={()=> handlePlayPress("1","https://cdn.islamic.network/quran/audio/128/ar.alafasy/24.mp3",dua?.title)} style={styles.playButton}>
              {isPlaying ? <PlayPuaseListIcon /> : <PlayListIcon />}
              {/* <View style={styles.playCircle}>
              <Text style={styles.playIcon}>▶</Text>
            </View> */}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={()=>toggleFavorite(dua.id)}>
              {isFavorite ? <HeartFillBlue /> : <HeartGray />}
            </TouchableOpacity>
          </View>
        </View>
        <AudioPlayerControl
          audioUrl={audioUrl}
          playbackSpeed={playbackSpeed}
          setIsPlaying={setIsPlaying}
          isPlaying={isPlaying}
          setCurrentLanguage={setCurrentLanguage}
          currentLanguage={currentLanguage}
          forwordBackFlag={false}
            ref={playerRef}
         onSurahEnd={onSurahEnd}
    
          isPlayingTitle={isPlayingTitle}
        />
         <LanguageModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSelect={handleLanguageSelect}
          langSelect={language}
        />
      </SafeAreaView>
      <SafeAreaView style={{backgroundColor: '#191967'}} />
    </View>
  );
};

const AudioPlayerControl_1 = props => {
  return (
    <View>
      {/* Progress Bar */}
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${(28 / 100) * 100}%`,
            },
          ]}
        />
      </View>
      {/* Player Controls */}
      <View style={styles.playerContainer}>
        <TouchableOpacity style={styles.playbackSpeedButton}>
          <Text style={styles.playbackSpeedText}>{props?.playbackSpeed}</Text>
        </TouchableOpacity>

        <View style={styles.playerControls}>
          <TouchableOpacity style={styles.prevButton}>
            <Text style={styles.prevIcon}>◀◀</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.mainPlayButton}
            onPress={() => props.setIsPlaying(!props.isPlaying)}>
            <Text style={styles.mainPlayIcon}>
              {props.isPlaying ? '⏸' : '▶'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nextButton}>
            <Text style={styles.nextIcon}>▶▶</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.languageButton}
          onPress={() => {
            props.setCurrentLanguage(
              props.currentLanguage === 'Arabic' ? 'English' : 'Arabic',
            );
          }}>
          <Text style={styles.languageText}>{props.currentLanguage}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:Colors.colorWhite,
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // paddingHorizontal: 2,
    paddingVertical: 2,
    backgroundColor: Colors.colorWhite,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
  },
  bookmarkPageButton: {
    marginRight: 32,
  },
  headerTitleContainer: {
    width:"70%",
    // flex:1,
    marginLeft: 28,
    marginTop: 16,
    marginBottom: 22,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    // paddingLeft:28,
    // backgroundColor:'red',
    // flex:1,
    // alignSelf:'flex-start',
    fontSize: 18,
    fontWeight: '500',
    color: Colors.textColor,
    paddingRight: 8,
  },
  dropdownIcon: {
    fontSize: 14,
    color: Colors.shadowColor,
    marginLeft: 6,
    marginTop: 5,
  },
  headerRightButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heartButton: {
    marginRight: 20,
    padding: 5,
  },
  heartIcon: {
    fontSize: 28,
    color:Colors.shadowColor,
  },
  heartOutlineIcon: {
    fontSize: 28,
    color:  Colors.shadowColor,
  },
  settingsButton: {
    padding: 5,
  },
  settingsIcon: {
    fontSize: 24,
  },
  contentContainer: {
    flex: 1,

    paddingVertical: 16,
    paddingHorizontal: Platform.OS === 'android' ? 20 : 24,
    justifyContent: 'space-between',
  },
  duaTextContainer: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  duaText: {
    // includeFontPadding: false,
    fontSize: 24,
    lineHeight: Platform.OS === 'android' ? 32 : 39,
    color: Colors.textColor,
    textAlign: 'right',
    fontWeight: '500',
    writingDirection: 'rtl',
  },
  duaActionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 6,
  },
  playButton: {
    marginRight: 28,
  },
  playCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 16,
    color: '#666666',
  },
  favoriteButton: {
    padding: Platform.OS === 'android' ? 12 : 0,
  },
  favoriteIcon: {
    fontSize: 28,
    color: '#1a237e',
  },
  activeFavorite: {
    color: '#1a237e',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#4CAF50',
    width: '25%', // Show progress as 25% complete
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
  },
  // playerControls: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   justifyContent: 'space-between',
  //   backgroundColor: '#1a237e',
  //   paddingVertical: 20,
  //   paddingHorizontal: 24,
  // },
  speedButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedText: {
    color: Colors.colorWhite,
    fontSize: 18,
    fontWeight: '600',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previousButton: {
    padding: 10,
  },
  previousIcon: {
    color: Colors.colorWhite,
    fontSize: 16,
  },
  // mainPlayButton: {
  //   width: 64,
  //   height: 64,
  //   borderRadius: 32,
  //   backgroundColor: '#4CAF50',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   marginHorizontal: 24,
  // },
  // mainPlayIcon: {
  //   color: '#ffffff',
  //   fontSize: 24,
  // },
  // nextButton: {
  //   padding: 10,
  // },
  // nextIcon: {
  //   color: '#ffffff',
  //   fontSize: 16,
  // },
  // languageButton: {
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  // languageText: {
  //   color: '#ffffff',
  //   fontSize: 16,
  //   fontWeight: '600',
  // },

  //
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
    color: Colors.colorWhite,
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
    color: Colors.colorWhite,
    fontSize: 24,
  },
  nextButton: {
    padding: 10,
  },
  nextIcon: {
    color: Colors.colorWhite,
    fontSize: 18,
  },
  languageButton: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  languageText: {
    color:Colors.colorWhite,
    fontSize: 14,
    fontWeight: '400',
    width: 70,
    textAlign: 'right',
  },
  progressContainer: {
    height: 5,
    backgroundColor:Colors.grey,
    borderRadius: 6,
    // marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3BC47D',
    borderRadius: 6,
  },
  textStyle: {
    fontSize: 16,
    lineHeight: Platform.OS === 'android' ? 18 : 25,
    color: '#292D33',
    paddingVertical: 8,
    fontWeight: '400',
  },
  textStyle1: {
    fontSize: 18,
    lineHeight: Platform.OS === 'android' ? 18 : 24,
    color: '#292D33',
    // p    addingVertical:8,
    fontWeight: '400',
  },
});

export default DuaDetail;
