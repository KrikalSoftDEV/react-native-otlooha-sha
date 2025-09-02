import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import Header from '../../components/UI/Header';
import {STATUSBAR_HEIGHT} from '../../constants/Dimentions';
import {useSelector} from 'react-redux';
import {getAllAyahListData, getData} from '../../constants/Storage';
import { scale, verticalScale } from 'react-native-size-matters';
import Colors from '../../constants/Colors';

const SavedAyahsList = props => {
  // Expected API JSON structure
  const bookmarks = useSelector(state => {
    return state.bookmarks.bookmarks;
  });
  const propsData = props.route.params;
  const [bookmarksList, setBookmarksList] = useState([]);
  useEffect(() => {
    const getStoredData = async () => {
        const listFetch =
        propsData.type === 'Surah'
          ? `ayahList_`
          : `juzList_`;
      const ayahListData = await getAllAyahListData(listFetch);
 const mergedBookmarked = [];

ayahListData.forEach(ele => {
  if (Array.isArray(ele.value)) {
    ele.value.forEach(item => {
      if (item.isBookmarked) {
        mergedBookmarked.push(item);
      }
    });
  }
});
// const bookmarkedAyahs = mergedBookmarked
//   .flatMap(item => item.value) // Step 1: Merge all `value` arrays
//   .filter(ayah => ayah.isBookmarked); // Step 2: Filter bookmarked ones

// console.log(bookmarkedAyahs,'bookmarkedAyahs chekc');
// // Step 2: Filter bookmarked items
// const bookmarkedItems = bookmarkedAyahs.filter(item => item.isBookmarked);

//       // const filtredBookmarks = bookmarkedItems.filter(
//       //   ele => ele.isBookmarked === true,
//       // );
//       console.log(bookmarkedItems,'checlk booknmarks')
      setBookmarksList(mergedBookmarked);
    };
    getStoredData();
  }, []);

  const renderSurahItem = ({item, index}) => {
    return (
      <TouchableOpacity style={[styles.surahItem]} activeOpacity={0.7}>
        <View style={styles.surahContent}>
          <View style={styles.leftContent}>
            <Text style={styles.surahNameEnglish}>{item.englishName}</Text>
            <Text style={styles.ayahCount}>Ayah {item.numberInSurah}</Text>
          </View>
          <View style={styles.rightContent}>
            <Text style={styles.surahNameArabic}>{item.chapterTitle}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <Header
        borderVisible={true}
        borderWidth={1}
        headerTitle={'Bookmarks'}
        onBackPress={() => props.navigation.goBack()}
      />

     {bookmarksList.length>0?
     <View style={{flex:1}}>
     <FlatList
        data={bookmarksList}
        renderItem={renderSurahItem}
        keyExtractor={item => item.number.toString()}
        showsVerticalScrollIndicator={false}
        style={styles.flatList}
        // ItemSeparatorComponent={() => <View style={styles.separator} />}
        // ListFooterComponent={() => <View style={styles.separator} />}
      />

      {/* Home indicator for iOS */}

      {/* <View style={styles.homeIndicator} /> */}
      </View>:<Text style={styles.emptyText}>No Ayat bookmarked yet</Text>}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: STATUSBAR_HEIGHT,
  },
  flatList: {
    flex: 1,
    backgroundColor: '#fff',
  },
  surahItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 0,
    paddingVertical: 0,
    // borderTopWidth:1,
    borderBottomWidth: 1,
    borderColor: '#DDE2EB',
  },
  surahContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 23,
    paddingVertical: 16,
  },
  leftContent: {
    justifyContent: 'center',
    paddingRight:10
  },
  rightContent: {
    flex:1,
    alignItems: 'flex-end',
  },
  surahNameEnglish: {
    fontSize:16,
    fontWeight: '500',
    color: '#181B1F',
    marginBottom: verticalScale(5),
  },
  ayahCount: {
    fontSize: 14,
    color: '#686E7A',
    fontWeight: '400',
  },
  surahNameArabic: {
    fontSize:16,
    color: '#181B1F',
    fontWeight: '500',
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: '#DDE2EB',
    borderTopWidth: 1,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#000',
    borderRadius: 2.5,
    alignSelf: 'center',
    marginBottom: 8,
  },
  emptyText:{paddingVertical:32,fontSize:14,fontWeight:'400',alignSelf:'center',color:Colors.placeholder}
});

export default SavedAyahsList;
