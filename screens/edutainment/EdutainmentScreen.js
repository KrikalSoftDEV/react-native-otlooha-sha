import React, {useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Linking,
  Dimensions,
  TextInput,
} from 'react-native';
import moment from 'moment';
import TopTabButtons from '../../components/UI/TopTabButtons';
import Header from '../../components/UI/Header';
import Colors from '../../constants/Colors';
import left_gray_arrow from '../../assets/images/Common/left_gray_arrow.png';
import close_gray from '../../assets/images/Common/close_gray.png';
import Search_black from '../../assets/images/Quran/search_black.png';
import { STATUSBAR_HEIGHT } from '../../constants/Dimentions';
import { useSelector, useDispatch } from 'react-redux';
import { fetchEdutainmentVideos, fetchEdutainmentPodcasts, setSearchQuery, setPodcastSearchQuery, clearVideos, clearPodcasts } from '../../redux/slices/edutainmentSlice';
import { useLoading } from '../../context/LoadingContext';
import { scale } from 'react-native-size-matters';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = (screenWidth - 40) / 2;

const EdutainmentScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const { videos, podcasts, loading, error, nextPageToken, searchQuery, podcastSearchQuery, pageToken, podcastPageToken } = useSelector(state => state.edutainment);
  const [activeTab, setActiveTab] = useState('Videos');
  const [isSearchShow, setSearchShow] = useState(false);
  const { showLoader, hideLoader } = useLoading();


  // Fetch data on mount, tab, or search change
  React.useEffect(() => {
    if(!searchQuery && !podcastSearchQuery){
showLoader()
    }
    
    if (activeTab === 'Videos') {
      dispatch(fetchEdutainmentVideos({ q: searchQuery })).finally(hideLoader);
    } else {
      dispatch(fetchEdutainmentPodcasts({ q: podcastSearchQuery })).finally(hideLoader);
    }
    // Clear on unmount
    return () => {
      dispatch(clearVideos());
      dispatch(clearPodcasts());
    };
  }, [dispatch, activeTab, searchQuery, podcastSearchQuery]);

  // Handle tab switch: clear data and search
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'Videos') {
      dispatch(clearVideos());
      dispatch(setSearchQuery(''));
    } else {
      dispatch(clearPodcasts());
      dispatch(setPodcastSearchQuery(''));
    }
  };

  const handlePress = (id) => {
    if (activeTab === 'Videos') {
      Linking.openURL(`https://www.youtube.com/watch?v=${id}`);
    } else {
      Linking.openURL(`https://www.youtube.com/playlist?list=${id}`);
    }
  };

  // Filtered data for current tab
  const filteredData = useMemo(() => {
    if (activeTab === 'Videos') return videos;
    if (activeTab === 'Podcasts') return podcasts;
    return [];
  }, [videos, podcasts, activeTab]);

  // Search handler for current tab
  const handleSearchChange = t => {
    if (activeTab === 'Videos') {
      dispatch(setSearchQuery(t));
    } else {
      dispatch(setPodcastSearchQuery(t));
    }
  };

  // Pagination for current tab
  const handleEndReached = () => {
    if (loading) return;
    if (activeTab === 'Videos' && nextPageToken) {
      dispatch(fetchEdutainmentVideos({ q: searchQuery, pageToken: nextPageToken }));
    } else if (activeTab === 'Podcasts' && podcastPageToken) {
      dispatch(fetchEdutainmentPodcasts({ q: podcastSearchQuery, pageToken: podcastPageToken }));
    }
  };

  // Render item for both video and podcast
  const renderItem = ({item}) => (
    <TouchableOpacity style={styles.card} onPress={() => handlePress(item.videoId || item.playlistId)}>
      <Image source={{uri: item.thumbnail}} style={styles.thumbnail} />
      <View style={styles.playButton}>
        <Image
          source={require('../../assets/images/Common/play_circle.png')}
          style={styles.thumbnail1}
        />
      </View>
      <View style={{paddingVertical: 10}}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.time}>{moment(item.publishedAt).fromNow()}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <View style={{paddingHorizontal: 8}}>
        {!isSearchShow ? (
          <Header
            headerTitle={'Edutainment'}
            onBackPress={() => navigation.goBack()}
            onPressLeft={() => setSearchShow(true)}
            leftIcon={<Image source={Search_black} style={styles.headerIcon} />}
          />
        ) : (
          <View style={styles.searchBar}>
            <TouchableOpacity
              onPress={() => setSearchShow(false)}
              style={styles.settingsButton}>
              <Image source={left_gray_arrow} />
            </TouchableOpacity>
            <TextInput
              autoCorrect={false}
              spellCheck={false}
              style={styles.searchInput}
              placeholder={'Search'}
              placeholderTextColor="#88909E"
              value={activeTab === 'Videos' ? searchQuery : podcastSearchQuery}
              onChangeText={handleSearchChange}
              autoFocus
            />
            <TouchableOpacity
              onPress={() => {
                if (activeTab === 'Videos') {
                  searchQuery === '' ? setSearchShow(false) : dispatch(setSearchQuery(''));
                } else {
                  podcastSearchQuery === '' ? setSearchShow(false) : dispatch(setPodcastSearchQuery(''));
                }
              }}
              style={styles.settingsButton}>
              <Image source={close_gray} />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={{paddingHorizontal: 20}}>
        <TopTabButtons
          tabs={['Videos', 'Podcasts']}
          activeTab={activeTab}
          setActiveTab={handleTabSwitch}
          activeColor="#272682"
          inactiveColor="#686E7A"
          backgroundColor="#F0F2F7"
          height={60}
          fontSize={scale(18)}
        />
      </View>
      {
      // loading ? (
      //   <View style={styles.noContent}><Text>Loading...</Text></View>
      // ) : 
      error ? (
        <View style={styles.noContent}><Text>{error}</Text></View>
      ) : filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.videoId || item.playlistId}
          numColumns={2}
          columnWrapperStyle={styles.column}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.5}
        />
      ) : (
        <View style={styles.noContent}>
          <Text>No content available</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default EdutainmentScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:STATUSBAR_HEIGHT
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    margin: 16,
    backgroundColor: '#F0F2F7',
    borderRadius: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#fff',
  },
  tabText: {
    fontSize: 15,
    color: '#88909E',
  },
  activeTabText: {
    color: '#000',
    fontWeight: '600',
  },
  column: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  card: {
    width: CARD_WIDTH,
    borderRadius: 12,
    backgroundColor: '#fff',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.blueGray,
  },
  thumbnail: {
    width: '100%',
    height: 125,
    // borderRadius: 10,
  },
  thumbnail1: {
    width: 42,
    height: 42,
    // borderRadius: 10,
  },
  playButton: {
    position: 'absolute',
    top: 40,
    left: '35%',
    zIndex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  time: {
    fontSize: 12,
    color: '#999',
    paddingHorizontal: 8,
    paddingBottom: 8,
    paddingTop: 5,
  },
  noContent: {
    alignItems: 'center',
    // marginTop: 30,
    alignSelf:'center',
    alignSelf:'center',
    padding:20,
  },
  searchBar: {
    marginHorizontal: 16,
    paddingVertical: 13,
    paddingHorizontal: 13,
    backgroundColor: '#F0F2F7',
    alignSelf: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: Colors.textColor,
    fontWeight: '400',
    marginLeft: 8,
    padding: 0,
  },
  settingsButton: {
    padding: 5,
  },
  noResultText: {
    textAlign: 'center',
    marginTop: 40,
    color: '#999',
    fontSize: 16,
  },
  headerIcon: {
    width: 22,
    height: 22,
  },
});
