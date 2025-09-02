import React, {useEffect, useRef, useState, useCallback, useMemo} from 'react';
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
} from 'react-native';
import MusicIcon from 'react-native-vector-icons/Fontisto';
import BookMark_gray from '../../assets/images/Common/BookMark_gray.svg';
import PlayListIcon from '../../assets/images/Common/playListIcon.svg';
import SaveBookmark from '../../assets/images/Common/saveBookmark.svg';
import PlayPuaseListIcon from '../../assets/images/Common/playPuaseListIcon.svg';
import { scale } from 'react-native-size-matters';
import PlayImage from "../../assets/images/Quran/play_grey.svg"
import PauseImage from "../../assets/images/Quran/puase_green.svg"
const STATUSBAR_HEIGHT =
  Platform.OS === 'android' ? StatusBar.currentHeight : 0;
const NAVIGATIONBAR_HEIGHT = Platform.OS === 'android' ? 48 : 0;
const ITEM_HEIGHT = 120; // Approximate height for each ayah item

// Memoized Ayah Item Component
 const AyahItem = React.memo(
  ({
    item,
    propsData,
    isSelectedIndex,
    isPlaying,
    onPlayPress,
    onBookmarkPress,
    setPrevNextPlay
  }) => {
    //here the value should come when the palyer end
    // and call handle press with updaetd valuesa and lso color chage index
    const backgroundColor =
      item.number === isSelectedIndex ? '#D6FFEB' : '#ffffff';
    const handlePlayPress = useCallback(() => {
      setPrevNextPlay(false)
      const playingTitle = `${propsData?.englishName} : ${
        item.numberInSurah
      }`;
      onPlayPress(item.number, item?.audio, playingTitle);
    }, [item, propsData, onPlayPress]);

    const handleBookmarkPress = useCallback(() => {
      console.log(item,'chec this number')
           const playingTitle = `${propsData?.englishName || propsData?.name}`;
        onBookmarkPress(item.number,playingTitle);
    }, [item.number, onBookmarkPress]);

    return (
      <View style={[styles.ayahContainer, {backgroundColor}]}>
        <View style={styles.ayahTextContainer}>
          <Text style={styles.arabicText}>{item.text}</Text>
          { item.arabicAlt !== ''&&item.arabicAlt!==undefined? (
            <Text style={styles.arabicText}>{item.arabicAlt}</Text>
          ):null}
        </View>

        <View style={styles.ayahFooter}>
          <Text style={styles.ayahNumber}>
            {item.numberInSurah}/{propsData?.numberOfAyahs} Ayat
          </Text>

          <View style={styles.actionButtons}>
            <TouchableOpacity
              onPress={handlePlayPress}
              style={{paddingHorizontal:20}}
              activeOpacity={0.7}>
                {/* <MusicIcon 
                name={isPlaying && item.number === isSelectedIndex ? "pause" : "play"} 
                size={7} 
                color={ isPlaying && item.number === isSelectedIndex ?"#3BC47D" :"#88909E"} />
 */}

                   {/* {isPlaying && item?.number === isSelectedIndex ?<Image source={PauseImage} style={{ width: 21, height: 21,}} />:<Image source={PlayImage} style={{ width: 21, height: 21,}} />} */}
                
              {isPlaying && item?.number === isSelectedIndex ? (
                <PauseImage />
              ) : (
                <PlayImage />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.bookmarkButton}
              onPress={handleBookmarkPress}
              activeOpacity={0.7}>
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
  },
);

export default AyahItem;


const styles = StyleSheet.create({
 
ayahContainer: {
    paddingTop: 10,
    // paddingBottom:0,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  
    borderBottomColor: '#DDE2EB',
    // minHeight: ITEM_HEIGHT,
  },
  ayahTextContainer: {
    
    // marginBottom: 12,
    // backgroundColor:"red"
  },
  arabicText: {
    fontSize: 26,

    textAlign: 'right',
    fontWeight: '500',
    color: '#181B1F',
    writingDirection: 'rtl',
  },
  ayahFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor:'yellow',
    paddingTop: 8,
  },
  ayahNumber: {
    fontSize: 14,
    fontWeight: '400',
    color: '#88909E',
  },
  bookmarkButton: {
    padding: 5,
  },
   actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playButton: {
  height:scale(16),
  width:scale(16),
    justifyContent:"center",
    alignItems:"center",
    borderWidth:1,
    borderRadius:20,
    paddingLeft:1
  },
  filledBookmark: {
    width:30,
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
});
