import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Platform,
} from 'react-native';
import ForwardIcon from '../../assets/images/Donation/ViewAll.svg';
import Search from '../../assets/images/Donation/Search.svg';
import Location from '../../assets/images/Donation/location.svg';
import Header from '../../components/UI/Header';
import LinearGradient from 'react-native-linear-gradient';
import res from '../../constants/res';
import {getDonationTypeMainPage} from '../../redux/slices/donationSlice';
import {useLoading} from '../../context/LoadingContext';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {useDispatch} from 'react-redux';
import {scale, verticalScale} from 'react-native-size-matters';
import {useToast} from 'react-native-toast-notifications';
import { NoSearchResultsFound } from '../worshipPlaces/WorshipPlaces';
import { STATUSBAR_HEIGHT } from '../../constants/Dimentions';
import close_gray from '../../assets/images/Common/close_gray.png';
import RenderCompaign from './RenderCompaign';
import RenderMosque from './RenderMosque';


const DonationTypeList = props => {
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [isData, setData] = useState(null);
  const {
    showLoader,
    hideLoader,
    startProcessing,
    stopProcessing,
    setConnectivity,
  } = useLoading();
  const toast  = useToast()
  // Data for Hibah Lil Waqaf section
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsWaqafData, setSearchResultsWaqafData] = useState([]);
  const [searchResultsCampaignData, setSearchResultsCampaignData] = useState(
    [],
  );
  const [searchResultsMosquesData, setSearchResultsMosquesData] = useState([]);
  const [allItems, setAllItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const STATUSBAR_HEIGHT =
    Platform.OS === 'android' ? StatusBar.currentHeight : 0;
  const NAVIGATIONBAR_HEIGHT = Platform.OS === 'android' ? 48 : 0; // Estimated navigation bar height
  const appealId = 357;
  const orgId = 4;

  useEffect(() => {
    // if (isFocused == true) {
    handleGetApi();
    // }
  }, []);
  const handleGetApi = () => {
    showLoader(true);
    dispatch(getDonationTypeMainPage({}))
      .unwrap()
      .then(async res => {
        hideLoader(true);

        if (res?.data?.status === 1) {
          setData(res.data.result);
        } else {
          toast.show(res?.data?.message || 'data fetch failed', {
            type: 'danger',
            placement: 'bottom',
          });
        }
      })
      .catch(err => {
        hideLoader(true);
        toast.show(res?.data?.message || 'Something went wrong!', {
          type: 'danger',
          placement: 'bottom',
        });
      });
  };

  const handleSearch = text => {
    setSearchQuery(text);

    // let filteredItems = allItems;
    let filteredItems = isData?.donationTo[1]?.donationToValues;
    // Filter by search query
    if (text) {
      const searchTerms = text.toLowerCase().split(' ');
      filteredItems = filteredItems?.filter(item => {
        return searchTerms.every(
          term => item?.name && item?.name?.toLowerCase()?.includes(term),
          //    ||
          //   (item.location && item.location.toLowerCase().includes(term)) ||
          //   (item.description && item.description.toLowerCase().includes(term))
        );
      });
    }
    let filteredItemswaqafData = isData?.donationTo[0]?.donationToValues;
    // Filter by search query
    if (text) {
      const searchTerms = text.toLowerCase().split(' ');
      filteredItemswaqafData = filteredItemswaqafData.filter(item => {
        return searchTerms.every(
          term =>
            item?.feesDetails?.statementDescriptor &&
            item?.feesDetails?.statementDescriptor
              ?.toLowerCase()
              ?.includes(term),
          //    ||
          //   (item.location && item.location.toLowerCase().includes(term)) ||
          //   (item.description && item.description.toLowerCase().includes(term))
        );
      });
    }
    let filteredItemscampaignData = isData?.donationTo[1]?.donationToValues;
    // Filter by search query
    if (text) {
      const searchTerms = text.toLowerCase().split(' ');
      filteredItemscampaignData = filteredItemscampaignData?.filter(item => {
        return searchTerms.every(
          term => item?.name && item?.name.toLowerCase().includes(term),
        );
      });
    }

    let filteredItemsmosquesData = isData?.donationTo[2]?.donationToValues;
    // Filter by search query
    if (text) {
      const searchTerms = text.toLowerCase().split(' ');
      filteredItemsmosquesData = filteredItemsmosquesData?.filter(item => {
        return searchTerms.every(
          term => item?.name && item?.name?.toLowerCase()?.includes(term),
          //    ||
          //   (item.location && item.location.toLowerCase().includes(term)) ||
          //   (item.description && item.description.toLowerCase().includes(term))
        );
      });
    }

    setSearchResults(filteredItems);
    setSearchResultsWaqafData(filteredItemswaqafData);
    setSearchResultsCampaignData(filteredItemscampaignData);
    setSearchResultsMosquesData(filteredItemsmosquesData);
  };
  const onClosePress=()=>{
    setSearchQuery("")
        let filteredItems = isData?.donationTo[1]?.donationToValues;
            let filteredItemscampaignData = isData?.donationTo[1]?.donationToValues;

    let filteredItemswaqafData = isData?.donationTo[0]?.donationToValues;
    let filteredItemsmosquesData = isData?.donationTo[2]?.donationToValues;

        setSearchResults(filteredItems);
    setSearchResultsWaqafData(filteredItemswaqafData);
    setSearchResultsCampaignData(filteredItemscampaignData);
    setSearchResultsMosquesData(filteredItemsmosquesData);
  }

  // Render item for Hibah Lil Waqaf section
  const renderWaqafItem = ({item}) => {
    return (
      <View style={styles.waqafItem}>
        <View style={{flexDirection: 'row'}}>
          <Image source={{uri: item.imageURL}} style={styles.campaignImage} />
          <Text style={styles.waqafTitle}>
            {item?.feesDetails.statementDescriptor}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Select_donation_Amount', {
              appealId: item.id,
              orgId: orgId,
              siteId: item.id,
              donationType:
                item?.feesDetails?.statementDescriptor === 'Waqaf'
                  ? 9
                  : item.feesDetails.statementDescriptor === 'Infaq'
                  ? 10
                  : 1,
              item: item,
              type: 0,
            });
          }}
          style={styles.donateButton}>
          <Text style={styles.donateButtonText}>{res.strings.donate}</Text>
        </TouchableOpacity>
      </View>
    );
  };

  // Render item for Ongoing Campaigns section
  const dImg = require('../../assets/images/Donation/donate_4.png');

  const renderCampaignItem = ({item}) => {
    return (
       <RenderCompaign item={item} orgId={orgId}  />
    );
  };
  // Render item for Mosques section
  const renderMosqueItem = ({item}) => {
    return (
     <RenderMosque item={item} orgId={orgId} />
    );
  };

  const hasSearchResults = () => {
    return (
      (searchResultsWaqafData && searchResultsWaqafData.length > 0) ||
      (searchResultsCampaignData && searchResultsCampaignData.length > 0) ||
      (searchResultsMosquesData && searchResultsMosquesData.length > 0)
    );
  };
 useFocusEffect(
    React.useCallback(() => {
      if(isFocused == true) {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
      }
    }
    }, [])
  );

  // Section header component

  return (
    <SafeAreaView style={[styles.container]}>
     {isFocused ==true && <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />}
      {/* Header */}
      <View style={[styles.header, {}]}>
        <Header
          headerTitle={'Donate'}
          onBackPress={() => props.navigation.goBack()}
        />
        {/* <Text style={styles.headerTitle}>{res.strings.donate}</Text> */}
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search name="chevron-forward" size={14} color="#000" />
        <TextInput
          autoCorrect={false}
          spellCheck={false}
          style={styles.searchInput}
          placeholder={res.strings.search}
          placeholderTextColor="#88909E"
          value={searchQuery}
          onChangeText={t => handleSearch(t)}
        />
          <TouchableOpacity
                      onPress={onClosePress}
                      style={styles.settingsButton}>
                      <Image source={close_gray} />
                    </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}>
        {searchQuery && !hasSearchResults() ? (
          <NoSearchResultsFound />
        ) : (
          <>
            {/* Hibah Lil Waqaf Section */}
            {(!searchQuery || (searchQuery && searchResultsWaqafData?.length > 0)) && (
              <>
                <SectionHeader title="Hibah Lil Waqaf" showSeeAll={false} />
                <FlatList
                  data={
                    searchQuery
                      ? searchResultsWaqafData
                      : isData?.donationTo[0]?.donationToValues
                  }
                  renderItem={renderWaqafItem}
                  keyExtractor={item => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.waqafList}
                />
              </>
            )}

          

            {/* Mosques Section */}
            {(!searchQuery || (searchQuery && searchResultsMosquesData?.length > 0)) && (
              <>
                <SectionHeader title="Mosques" showSeeAll={false} />
                <FlatList
                  data={
                    searchQuery
                      ? searchResultsMosquesData
                      : isData?.donationTo[2]?.donationToValues
                  }
                  renderItem={renderMosqueItem}
                  keyExtractor={item => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.mosqueList}
                />
              </>
            )}
          </>
        )}


          {/* Ongoing Campaigns Section */}
            {((!searchQuery && isData?.donationTo[1]?.donationToValues?.length > 0)|| (searchQuery && searchResultsCampaignData?.length > 0)) && (
              <>
                <SectionHeader title="Ongoing Campaigns" showSeeAll={false} />
                <FlatList
                  data={
                    searchQuery
                      ? searchResultsCampaignData
                      : isData?.donationTo[1]?.donationToValues
                  }
                  renderItem={renderCampaignItem}
                  keyExtractor={item => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.campaignList}
                />
              </>
            )}
        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};
export const SectionHeader = ({
  title,
  showSeeAll = true,
  containerStyles,
  titleStyle,
}) => {
  return (
    <View style={[styles.sectionHeader, containerStyles && containerStyles]}>
      <Text style={[styles.sectionTitle, titleStyle && titleStyle]}>
        {title}
      </Text>
      <LinearGradient
        colors={['#DDE2EB', '#fff']}
        style={{height: 1, flex: 1, marginHorizontal: 8}}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}></LinearGradient>
      {showSeeAll && (
        <TouchableOpacity>
          <View style={styles.seeAllContainer}>
            <Text style={styles.seeAllText}>{res.strings.seeAll}</Text>
            <ForwardIcon name="chevron-forward" size={16} color="#000" />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingTop:verticalScale(STATUSBAR_HEIGHT)
        // paddingTop:STATUSBAR_HEIGHT
  },
  header: {
    // flexDirection: 'row',
    // alignItems: 'center',
    // paddingHorizontal: 8,
    // marginTop: 8,
    // marginBottom: 8,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F7',
    borderRadius: 10,
    marginHorizontal: 16,
    marginVertical: 5,
    paddingHorizontal: 12,
    // paddingVertical:7,
    height: 46,
    // marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#181B1F',
    fontWeight: '400',
    marginLeft: 8,
  },
  micIcon: {
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
    marginTop: 28,
  },
  sectionTitle: {
    fontSize: scale(16),
    fontWeight: '600',
    color: '#181B1F',
  },
  seeAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    fontSize: 14,
    color: '#272682',
    fontWeight: '600',
    marginRight: 8,
  },

  // Waqaf Section Styles
  waqafList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  waqafItem: {
    width: 177,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 16,
    borderWidth: 1,
    borderColor: '#EEEEEE',
  },
  waqafTitle: {
    fontSize: scale(14),
    fontWeight: '600',
    color: '#181B1F',
    marginBottom: 4,
    alignSelf: 'center',
    paddingHorizontal: 10,
  },
  waqafDescription: {
    fontSize: 12,
    fontWeight: '400',
    color: '#88909E',
    // marginBottom: 12,
  },

  // Campaign Section Styles
  campaignList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  campaignItem: {
    width: 256,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#EEEEEE',
    overflow: 'hidden',
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  campaignDate: {
    fontSize: 12,
    color: '#88909E',
    fontWeight: '400',
    marginTop: 16,
    // marginLeft: 16,
  },
  campaignTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#181B1F',
    // marginLeft: 16,
    marginRight: 16,
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginLeft: 16,
    marginTop: 8,
  },
  locationText: {
    fontSize: 12,
    color: '#272682',
    fontWeight: '400',
    marginLeft: 4,
  },
  campaignImage: {
    width: 37,
    height: 37,
    // marginTop: 12,
    resizeMode: 'contain',
    borderRadius: 10,
  },

  // Mosque Section Styles
  mosqueList: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 16,
  },
  mosqueItem: {
    width: 161,
    marginRight: 16,
  },
  mosqueImage: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    marginBottom: 8,
  },
  mosqueTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181B1F',
    marginHorizontal: 4,
  },
  mosqueItem1: {
    width: 161,
    marginRight: 16,
  },
  mosqueImage1: {
    width: '100%',
    height: 110,
    borderRadius: 12,
    marginBottom: 8,
  },
  mosqueTitle1: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181B1F',
    marginHorizontal: 4,
  },
  mosquePilgrims: {
    fontSize: 12,
    color: '#464B54',
    fontWeight: '400',
    marginTop: 2,
  },

  // Shared Styles
  donateButton: {
    backgroundColor: '#9F9AF433',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  donateButtonText: {
    color: '#272682',
    fontWeight: '600',
    fontSize: 14,
  },
  donateButton1: {
    backgroundColor: '#9F9AF433',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  donateButtonText1: {
    color: '#272682',
    fontWeight: '600',
    fontSize: 14,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default DonationTypeList;
