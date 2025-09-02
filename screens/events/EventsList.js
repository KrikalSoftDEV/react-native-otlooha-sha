import React, {useState, useCallback, useMemo, useEffect, useRef} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Dimensions,
  Platform,
  Alert,
  TextInput,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import Header from '../../components/UI/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Search_black from '../../assets/images/Quran/search_black.png';
import {scale} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';
import close_gray from '../../assets/images/Common/close_gray.png';
import left_gray_arrow from '../../assets/images/Common/left_gray_arrow.png';
import res from '../../constants/res';
import {STATUSBAR_HEIGHT} from '../../constants/Dimentions';
import {useDispatch, useSelector} from 'react-redux';
import {getEventList} from '../../redux/slices/eventSlice';
import EventListDummy from './EventListDummy.js';
import moment from 'moment';
import { useLoading } from '../../context/LoadingContext.js';
// import Search_black from '../../assets/images/Quran/search_black.png';

const {width: screenWidth} = Dimensions.get('window');

export const EventCard = React.memo(({item, onPress, isHomeScreen}) => {
  const isOnline = item?.eventType === 'Online Event';
  const hasParticipated = item?.isUserParticipated === true;
  // isHomeScreen == true && {width: Dimensions.get('window').width/2}
  return (
    <TouchableOpacity
      style={[
        styles.eventCard,
        isHomeScreen == true && {
          marginRight: 10,
          width: Dimensions.get('window').width / 1.3,
        },
      ]}
      onPress={() => onPress(item)}
      activeOpacity={0.7}>
      <View style={styles.eventContent}>
        <Image
          source={{
            uri:
              // item?.eventImages &&
              // item.eventImages?.length > 0 &&
              item?.eventImages[0]?.filePath
          }}
          style={styles.eventImage}
          resizeMode="cover"
        />

        <View style={[styles.eventDetails,   isHomeScreen == true && { paddingRight: 6, justifyContent:'flex-start'} ]}>
          <View>
            <Text style={styles.eventDate}>
              {moment(item?.startDate, 'MM/DD/YYYY HH:mm:ss')?.format(
                'DD MMM, YYYY',
              )}
            </Text>
            <Text style={[styles.eventTitle]} numberOfLines={2}>
              {item?.name?.replace(/\s+/g, ' ').trim()}
            </Text>
          </View>
         {isHomeScreen != true && <View style={styles.tagsContainer}>
            <View style={[styles.typeTag, styles.offlineTag]}>
              <Text style={[styles.typeTagText, styles.offlineTagText]}>
                {item?.eventType   + ( isHomeScreen != true ? ' ' + 'Event' : '')}
              </Text>
            </View>

            {hasParticipated && (
              <View style={styles.participatedTag}>
                <Text style={styles.participatedTagText}>{'Participated'}</Text>
              </View>
            )}
          </View>}
        </View>
      </View>
    </TouchableOpacity>
  );
});

const EventsList = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
      showLoader,
      hideLoader,

    } = useLoading();
  const {eventList, loading, error, paginating, hasMore} = useSelector(
    state => state.event,
  );
  const [page, setPage] = useState(1);
  const [isSearchShow, setSearchShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const isInitialMount = useRef(true);

  useEffect(() => {
    const handler = setTimeout(
      () => {
        showLoader(true)
        setPage(1);
        dispatch(
          getEventList({pageNumber: 1, pageSize: 20, searchValue: searchQuery}),
        ).then(() => hideLoader(true))
      },
      isInitialMount.current ? 0 : 500,
    );

    isInitialMount.current = false;
    return () => clearTimeout(handler);
  }, [searchQuery, dispatch]);

  useEffect(() => {
    if (!isSearchShow) {
      Keyboard.dismiss();
    }
  }, [isSearchShow]);

  const onRefresh = useCallback(() => {
    setPage(1);
    if (searchQuery === '') {
      dispatch(getEventList({pageNumber: 1, pageSize: 20, searchValue: ''}));
    } else {
      setSearchQuery('');
    }
  }, [dispatch, searchQuery]);

  const handleLoadMore = useCallback(() => {

    if (!loading && !paginating && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      dispatch(
        getEventList({
          pageNumber: nextPage,
          pageSize: 20,
          searchValue: searchQuery,
        }),
      );
    }
  }, [loading, paginating, hasMore, page, dispatch, searchQuery]);

  const onEventPress = useCallback(
    event => {
      navigation.navigate('EventsDetails', { eventId: event.id, orgId: event.orgId || 4 });
    },
    [navigation],
  );

  const renderEventItem = useCallback(
    ({item}) => (
      <EventCard item={item} onPress={onEventPress} isHomeScreen={false} />
    ),
    [onEventPress],
  );

  const keyExtractor = useCallback(item => item.id.toString(), []);

  const getItemLayout = useCallback(
    (data, index) => ({
      length: 140, // Fixed height for each item
      offset: 140 * index,
      index,
    }),
    [],
  );

  const renderFooter = () => {
    if (!paginating) return null;
    return <ActivityIndicator style={{marginVertical: 20}} />;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* <HeaderComponent  /> */}
      {isSearchShow != true ? (
        <Header
          headerTitle={'Events'}
          onBackPress={() => navigation.goBack()}
          onPressLeft={() => setSearchShow(true)}
          leftIcon={<Image source={Search_black} style={styles.headerIcon} />}
        />
      ) : (
        <View
          style={{
            marginHorizontal: 16,
            paddingVertical: 13,
            paddingHorizontal: 13,
            backgroundColor: '#F0F2F7',
            alignSelf: 'center',
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={() =>  { setSearchQuery(''); setSearchShow(false)}} //navigation.goBack()}
            style={[styles.settingsButton, {}]}>
            <Image source={left_gray_arrow} />
          </TouchableOpacity>
          <TextInput
            autoCorrect={false}
            spellCheck={false}
            style={styles.searchInput}
            placeholder={'Search'}
            placeholderTextColor="#88909E"
            value={searchQuery}
            onChangeText={t => setSearchQuery(t)}
            autoFocus={true}
          />
          {/* <Text style={{fontSize:17, fontWeight:'400', color:'#181B1F', marginLeft:12, flex:1}} >Al-Faatiha</Text> */}
          <TouchableOpacity
            onPress={() => {
              searchQuery == '' ? setSearchShow(false) : setSearchQuery('');
            }}
            style={[styles.settingsButton, {}]}>
            <Image source={close_gray} />
          </TouchableOpacity>
        </View>
      )}

      {/* {loading && <Text style={{ textAlign: 'center', marginTop: 20 }}>Loading events...</Text>} */}
      {error && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '400',
            color: '#88909E',
            textAlign: 'center',
            marginTop: 20,
          }}>
          {error}
        </Text>
      )}
      <FlatList
        data={eventList}
        renderItem={renderEventItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        // refreshing={loading}
        // onRefresh={onRefresh}
        onEndReached={() => {
          if (eventList?.length == 20) {
            handleLoadMore();
          }
        }}
        onEndReachedThreshold={0.5}
        // ListFooterComponent={renderFooter}
        ListEmptyComponent={<Text
          style={{
            fontSize: 14,
            fontWeight: '400',
            color: '#88909E',
            textAlign: 'center',
            marginTop: 20,
          }}>
          {"No events found"}
        </Text>}
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={10}
        getItemLayout={getItemLayout}
        // Use this for dynamic heights if needed
        // getItemLayout={null}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop: STATUSBAR_HEIGHT,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  backButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 24,
    fontWeight: '300',
    color: '#333333',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    flex: 1,
    textAlign: 'center',
  },
  searchButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    fontSize: 20,
    color: '#333333',
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 16,
  },
  eventCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#DDE2EB',
    shadowColor: '#0C0C0D',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  eventContent: {
    flexDirection: 'row',
    padding: 6,
    // minHeight: 120,
    // borderWidth:1
  },
  //    scale(89),'-=-=-110', scale(96)
  eventImage: {
    width: scale(89),
    height: scale(96),
    borderRadius: scale(9),
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#DDE2EB',
  },
  eventDetails: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 7,
    paddingRight: 13,
  },
  eventDate: {
    fontSize: 13,
    color: '#686E7A',
    fontWeight: '400',
    marginBottom: 6,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#181B1F',
    lineHeight: 20,
    marginBottom: 10,
    // textAlign: 'justify',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  typeTag: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  onlineTag: {
    backgroundColor: '#EEEEFF',
  },
  offlineTag: {
    backgroundColor: '#EEEEFF',
  },
  typeTagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#5756C8',
  },
  onlineTagText: {
    color: '#5756C8',
  },
  offlineTagText: {
    color: '#5756C8',
  },
  participatedTag: {
    backgroundColor: '#DFFCED',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  participatedTagText: {
    fontSize: 11,
    fontWeight: '500',
    color: '#21BF73',
  },
  settingsButton: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#181B1F',
    fontWeight: '400',
    marginLeft: 8,
    padding: 0,
  },
});

export default EventsList;
