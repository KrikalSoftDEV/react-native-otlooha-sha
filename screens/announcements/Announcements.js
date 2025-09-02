import React, {useState, useMemo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StatusBar,
  Alert,
} from 'react-native';
import Header from '../../components/UI/Header';
import Search_black from '../../assets/images/Quran/search_black.png';
import {
  NAVIGATIONBAR_HEIGHT,
  STATUSBAR_HEIGHT,
} from '../../constants/Dimentions';
import Colors from '../../constants/Colors';
import left_gray_arrow from '../../assets/images/Common/left_gray_arrow.png';
import close_gray from '../../assets/images/Common/close_gray.png';
import {announcementList} from '../../redux/slices/announcementSlice';
import {useDispatch} from 'react-redux';
import { useLoading } from '../../context/LoadingContext';

const screenWidth = Dimensions.get('window').width;
const CARD_WIDTH = (screenWidth - 40) / 2;

const announcementsData = [
  {
    id: '1',
    title: 'Launch of New Waqaf Clinic',
    image: require('../../assets/images/Common/masjidblog.png'),
    description:
      'Waqaf An Nur, in collaboration with local health authorities, invites you to our Weekly Blood Donation Drive held every Friday at Klinik Waqaf An Nur, Johor Bahru.\n\nThis initiative aims to support our hospitals and medical centers in maintaining an adequate blood supply for patients in need—especially during emergencies, surgeries, and for individuals with chronic conditions.\n\nParticipants will receive a free health screening and light refreshments after donation. All safety protocols will be followed to ensure a clean and secure environment for everyone.\n\nCome and be part of this noble cause. One pint of blood can save up to three lives. Your contribution, no matter how small, makes a big difference.',
  },
  {
    id: '2',
    title: 'Weekly Blood Donation Drive',
    image: require('../../assets/images/Common/masjidblog.png'),
    description:
      'Waqaf An Nur, in collaboration with local health authorities, invites you to our Weekly Blood Donation Drive held every Friday at Klinik Waqaf An Nur, Johor Bahru.\n\nThis initiative aims to support our hospitals and medical centers in maintaining an adequate blood supply for patients in need—especially during emergencies, surgeries, and for individuals with chronic conditions.\n\nParticipants will receive a free health screening and light refreshments after donation. All safety protocols will be followed to ensure a clean and secure environment for everyone.\n\nCome and be part of this noble cause. One pint of blood can save up to three lives. Your contribution, no matter how small, makes a big difference.',
  },
  {
    id: '3',
    title: 'Ramadan Campaign: Heartfelt Contributions',
    image: require('../../assets/images/Common/masjidblog.png'),
  },
  {
    id: '4',
    title: 'Free Fardu Ain Classes Now Open',
    image: require('../../assets/images/Common/masjidblog.png'),
  },
  {
    id: '5',
    title: 'Community Cleanup at Taman Harmoni Mosque',
    image: require('../../assets/images/Common/masjidblog.png'),
  },
  {
    id: '6',
    title: 'Food Pack Distribution for Asnaf',
    image: require('../../assets/images/Common/masjidblog.png'),
  },
  {
    id: '7',
    title: 'Ramadan Campaign: Heartfelt Contributions',
    image: require('../../assets/images/Common/masjidblog.png'),
  },
  {
    id: '8',
    title: 'Free Fardu Ain Classes Now Open',
    image: require('../../assets/images/Common/masjidblog.png'),
  },
  {
    id: '9',
    title: 'Community Cleanup at Taman Harmoni Mosque',
    image: require('../../assets/images/Common/masjidblog.png'),
  },
  {
    id: '10',
    title: 'Food Pack Distribution for Asnaf',
    image: require('../../assets/images/Common/masjidblog.png'),
  },
];

const Announcements = ({navigation}) => {
  const dispatch = useDispatch();
  const [isSearchShow, setSearchShow] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [announcementListData, setAnnouncementListData] = useState([]);
  const {showLoader, hideLoader} = useLoading();

  const filteredData = useMemo(() => {
    const data = announcementListData || [];
    if (!searchQuery.trim()) return data;

    return data.filter(item =>
      item?.title?.toLowerCase().includes(searchQuery.trim().toLowerCase()),
    );
  }, [searchQuery, announcementListData]);

  useEffect(() => {
    getAnnouncemntList();
  }, []);

  const getAnnouncemntList = async () => {
    const requestBody = {
      pageNumber: 1,
      pageSize: 100,
      sortBy: '',
      sortExpression: '',
      searchBy: 0,
      searchValue: '',
      orgId: 4,
    };

    try {
      showLoader();
      const response = await dispatch(announcementList(requestBody)).unwrap();
  

      if (response.data.status === 1) {
        setAnnouncementListData(
          response.data.result.announcementListResponseDtos,
        );
        hideLoader();
      }
    } catch (e) {
      hideLoader();
      Alert.alert('Error', 'Unable to fetch announcements.');
    }
  };

  const renderItem = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AnnouncementDetails', {item: item});
        }}
        style={styles.card}>
        <Image
          source={{uri: item?.imageUrl[0]}}
          style={styles.cardImage}
        />
        <Text style={styles.cardTitle}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={styles.container}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content"
        />
        <View style={{paddingHorizontal: 8}}>
          {!isSearchShow ? (
            <Header
              headerTitle={'Announcements'}
              onBackPress={() => navigation.goBack()}
              onPressLeft={() => setSearchShow(true)}
              leftIcon={
                <Image source={Search_black} style={styles.headerIcon} />
              }
            />
          ) : (
            <View style={styles.searchBar}>
              <TouchableOpacity
                onPress={() => {
                  setSearchShow(false)
                  setSearchQuery("")}}
                style={styles.settingsButton}>
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
                autoFocus
              />
              <TouchableOpacity
                onPress={() => {
                  searchQuery === ''
                    ? setSearchShow(false)
                    : setSearchQuery('');
                }}
                style={styles.settingsButton}>
                <Image source={close_gray} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {filteredData.length === 0 ? (
          <Text style={styles.noResultText}>No announcements found</Text>
        ) : (
          <FlatList
            data={filteredData}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={styles.row}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </SafeAreaView>
    </View>
  );
};

export default Announcements;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.colorWhite,
    paddingTop: STATUSBAR_HEIGHT,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.colorWhite,
    paddingBottom: 40,
    marginBottom: NAVIGATIONBAR_HEIGHT * 1.2,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    width: CARD_WIDTH,
  },
  cardImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    resizeMode: 'contain',
    borderWidth:0.5,
    borderColor:'#c3c3c3'
    // backgroundColor:'red'
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textColor,
    paddingHorizontal: 5,
    marginTop: 8,
  },
  listContent: {
    padding: 15,
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
