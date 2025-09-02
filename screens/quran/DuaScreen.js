import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Animated,
  Keyboard,
  Platform,
  FlatList,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import Header from '../../components/UI/Header';
import Colors from '../../constants/Colors';
//import BackIcon from '../../assets/images/Common/back.svg';
import DuaBg from '../../assets/images/Dua/dua_bg.png';
import Duas_moment from '../../assets/images/Dua/Duas_moment.png';
import { STATUSBAR_HEIGHT } from '../../constants/Dimentions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SearchHeader from '../tasbihDhikir/SearchHeader';
import {useIsFocused} from '@react-navigation/native';
import {getData} from '../../constants/Storage';
import RightArrow from "../../assets/images/Dua/right_arrow.svg"
const { width, height } = Dimensions.get('window');

const data=[
   {"featured_image": "https://example.com/images/digital-workshop.jpg"},
     {"featured_image": "https://example.com/images/digital-workshop.jpg"},
       {"featured_image": "https://example.com/images/digital-workshop.jpg"}
]
const DuaScreen = ({ navigation }) => {
  const isFocused = useIsFocused()
  const [filteredData, setFilteredData] = useState([]);
  const [baseFilteredData, setBaseFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const scrollY = useRef(new Animated.Value(0)).current;
  const [lastScrollY, setLastScrollY] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchShow, setSearchShow] = useState(false);
  const searchInputRef = useRef(null);
  const scrollViewRef = useRef(null);
  const tabs = ['All','Daily','Feature Dua','Dua For Seeking Help', ];

  const HEADER_MAX_HEIGHT = 282;
  const HEADER_MIN_HEIGHT = 88;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;

  useEffect(() => {
    setSearchShow(false);
    const typeMap = {
          "Daily": 'Daily',
           'Feature Dua': 'FeatureDua',
     'Dua For Seeking Help': 'DuaForSeekingHelp',
    };

    const filterType = typeMap[activeTab];
    const getDuaData = async idOffDua => {
      const getDuaList = await getData(`dua_json`);
      const filtered = filterType
        ? getDuaList.filter(item => item.type === filterType)
        : getDuaList;
      setBaseFilteredData(filtered);
      setFilteredData(filtered);
    };
    getDuaData();
  }, [isFocused]);
  useEffect(() => {
    // setSearchShow(false)
    const typeMap = {
          "Daily": 'Daily',
         'Feature Dua': 'FeatureDua',
         'Dua For Seeking Help': 'DuaForSeekingHelp',
    };

    const filterType = typeMap[activeTab];

    const getDuaData = async idOffDua => {
      const getDuaList = await getData(`dua_json`);
      const filtered = filterType
        ? getDuaList.filter(item =>{
          console.log(item.type,'check the type')
          return item.type === filterType})
        : getDuaList;
      setBaseFilteredData(filtered);
      setFilteredData(filtered);
    };
    getDuaData();
  }, [activeTab]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const search_filtered = baseFilteredData.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
      setFilteredData(search_filtered);
    } else {
      setFilteredData(baseFilteredData);
    }
  }, [searchQuery, baseFilteredData]);

  const handleTabPress = tab => {
    console.log(tab,'chekc the tab ')
    // if(!isSearchShow){
    setActiveTab(tab);
    // }
  };

  const handleDuaPress = dua => {
    navigation.navigate('DuaDetail', {dua});
  };

  const headerTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [0, -HEADER_SCROLL_DISTANCE],
    extrapolate: 'clamp',
  });

  const handleSearchPress = () => {
    const getDuaData = async idOffDua => {
      const getDuaList = await getData(`dua_json`);
      const filtered = getDuaList;
      setBaseFilteredData(filtered);
      setFilteredData(filtered);
      setFilteredData(baseFilteredData);
    };
    getDuaData();
    setLastScrollY(scrollY.__getValue ? scrollY.__getValue() : 0);
    setSearchShow(true);
    // Use requestAnimationFrame to ensure the search overlay is rendered before focusing
    requestAnimationFrame(() => {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    });
  };
  const handleClearSearch = () => {
    const typeMap = {
      "Daily": 'Daily',
      'Feature Dua': 'FeatureDua',
      'Dua For Seeking Help': 'DuaForSeekingHelp',
    };
    const filterType = typeMap[activeTab];
    const getDuaData = async idOffDua => {
      const getDuaList = await getData(`dua_json`);
      const filtered = filterType
        ? getDuaList.filter(item => item.type === filterType)
        : getDuaList;
      setBaseFilteredData(filtered);
      setFilteredData(filtered);
    };
    getDuaData();
    setSearchQuery('');
    setSearchShow(!isSearchShow);
    Keyboard.dismiss();
    setTimeout(() => {
      if (scrollViewRef.current && lastScrollY > 0) {
        scrollViewRef.current.scrollTo({y: lastScrollY, animated: false});
      }
    }, 100);
  };
  const onSerachBackPress = () => {
    setSearchShow(false);
    setSearchQuery('');
    const typeMap = {
       "Daily": 'Daily',
      'Feature Dua': 'FeatureDua',
      'Dua For Seeking Help': 'DuaForSeekingHelp',
    };
    const filterType = typeMap[activeTab];
    const getDuaData = async idOffDua => {
      const getDuaList = await getData(`dua_json`);
      console.log(getDuaList, 'shnadnsjnasasjn');
      const filtered = filterType
        ? getDuaList.filter(item => item.title === filterType)
        : getDuaList;
      setBaseFilteredData(filtered);
      setFilteredData(filtered);
    };
    getDuaData();
  };

  const renderDuaItems = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.duaItem}
        onPress={() => handleDuaPress(item)}>
        <Text style={styles.duaTitle}>{item.title}</Text>

<RightArrow />
        {/* <Text style={styles.arrowIcon}>›</Text> */}
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isSearchShow ? 'dark-content' : 'light-content'}
      />
      <>
        {!isSearchShow ? (
          <Animated.View
            style={[
              styles.header,
              {
                transform: [{translateY: headerTranslate}],
              },
            ]}>
            <View style={styles.imageWrapper}>
              <Animated.Image
                source={DuaBg}
                style={styles.headerImage}
                resizeMode="cover"
              />
            </View>

            <View style={styles.headerContent}>
              <Header
                onBackPress={() => {
                  navigation.goBack();
                }}
                headerTitle={'Dua'}
                backgroundColor="transparent"
                iconColor="#ffffff"
                textColor="#ffffff"
                leftIcon={
                  <TouchableOpacity onPress={handleSearchPress}>
                    <Ionicons name="search" size={24} color="#ffffff" />
                  </TouchableOpacity>
                }
              />

               

              <Animated.View
                style={[
                  styles.headerTextContainer,
                ]}>
                <View style={{ paddingHorizontal: Platform.OS === "android" ? 24 : 24, }}>
                  <Image source={Duas_moment} style={{width:scale(150),}} resizeMode='contain' />
                </View>
                <Text style={styles.headerSubtitle}>
                  Find and recite daily Duas
                </Text>
              </Animated.View>
            </View>
          </Animated.View>
        ) : (
          <Animated.View
            style={[
              {
                transform: [{translateY: headerTranslate}],
              },
            ]}>
            <View style={{paddingTop: 55}}>
              <SearchHeader
                onBackPress={onSerachBackPress}
                onClear={handleClearSearch}
                setSearchQuery={setSearchQuery}
                searchQuery={searchQuery}
              />
            </View>
          </Animated.View>
        )}
      </>
      {!isSearchShow ? (
        <View style={styles.tabsContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tabButton,
                  activeTab === tab && styles.activeTabButton,
                ]}
                onPress={() => handleTabPress(tab)}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      ) : null}

      {filteredData?.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={renderDuaItems}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <Text
          style={{
            alignSelf: 'center',
            color: Colors.placeholder,
            fontSize: 14,
            fontWeight: '400',
            paddingTop: 20,
          }}>
          No search results found
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorWhite,
    // overflow:'hidden'
    // paddingTop:STATUSBAR_HEIGHT
  },
  imageWrapper: {
    borderBottomLeftRadius: 60,
    borderBottomRightRadius: 60,
    overflow: 'hidden',
  },
  headerImage: {
    width: '100%',
    height: '110%',
  },
  imageStyle: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  headerContainer: {
    height: height / 3,
  },
  headerBackground: {
    width: '100%',
    height: '100%',
  },
  headerContent: {
    flex: 1,
    padding: scale(16),
    paddingTop: scale(40),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    // marginTop: scale(20),
    flex: 1,
    justifyContent: 'flex-end',
    // paddingVertical: 40,
    // paddingHorizontal: 26,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.colorWhite,
    marginBottom: scale(5),
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.colorWhite,
    opacity: 0.8,
    paddingHorizontal: 26,
    marginBottom:verticalScale(18),
    marginTop:verticalScale(8)
  },
  tabsContainer: {
    paddingVertical: scale(10),
  },
  tabsScrollContent: {
    paddingHorizontal: scale(16),
    paddingTop: 16,
    flexDirection: 'row',
  },
  tabButton: {
    paddingHorizontal: scale(20),
    paddingVertical: scale(10),
    borderRadius: scale(20),
    marginRight: scale(10),
    backgroundColor: Colors.colorWhite,
    borderColor: Colors.grey,
    borderWidth: 1,
  },
  activeTabButton: {
    borderColor: Colors.grey,
    backgroundColor: Colors.voilate,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 16,
    color: Colors.textColor,
    fontWeight: '400',
  },
  activeTabText: {
    color: Colors.colorWhite,
    fontWeight: '600',
    fontSize: 16,
  },
  duaListContainer: {
    flex: 1,
    paddingTop: height / 3,

    // paddingHorizontal: scale(16),
  },
  duaItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // marginBottom: 20,
    paddingVertical: scale(24),
    paddingHorizontal: scale(16),
    borderBottomWidth: 1,
    borderBottomColor: Colors.grey,
  },
  duaTitle: {
    fontSize: 16,
    width:'70%',
    lineHeight: Platform.OS === 'android' ? 22 : 22,
    color: Colors.textColor,
    fontWeight: '500',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#999999',
  },

  headerMainTitle: {
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 22,
    // fontWeight: 'bold',
    color: Colors.colorWhite,
    marginBottom: 8,
  },

  // header: {
  //   position: 'absolute',
  //   top: 0,
  //   left: 0,
  //   right: 0,
  //   height: 280,
  //   zIndex: 1000,

  // },
  header: {
    height: height / 3,
    // height: 280,
    zIndex: 1000,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    overflow: 'hidden', // ⬅️ Important to clip children like Image
  },

  // headerImage: {
  //   width: '100%',
  //   height: '100%',
  //   resizeMode: 'cover',
  //   // borderRadius:20,

  // },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
  },
  headerContent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop:Platform.OS==="android"? verticalScale(STATUSBAR_HEIGHT):62
    // paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 44,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.colorWhite,
    textAlign: 'center',
  },
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchOverlay: {
    flex: 1,
    backgroundColor: Colors.colorWhite,
    paddingTop: STATUSBAR_HEIGHT,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    // paddingVertical: 13,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    height: 48,
  },
  searchBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    // marginRight: 8,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor: 'white',
    // borderRadius: 20,
    paddingHorizontal: 16,
    // height: 40,
    padding: 0,
  },
  searchInputIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#111827',
    fontWeight: '400',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  searchContent: {
    flex: 1,
    backgroundColor: Colors.colorWhite,
  },
  recentSearches: {
    paddingTop: 20,
  },
  recentSearchesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  suggestionText: {
    fontSize: 16,
    color: '#181B1F',
    fontWeight: '500',
    flex: 1,
    marginLeft: 8,
  },
  suggestionIcon: {
    transform: [{rotate: '45deg'}],
  },
  searchResults: {
    paddingTop: 12,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchResultTextContainer: {
    flex: 1,
    marginRight: 12,
  },
  searchResultText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
    marginBottom: 4,
  },
  searchResultLocation: {
    fontSize: 14,
    color: '#686E7A',
    marginBottom: 2,
  },
  searchResultDistance: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '600',
  },
  noResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubtext: {
    fontSize: 14,
    color: '#D1D5DB',
    textAlign: 'center',
  },
});

export default DuaScreen;
