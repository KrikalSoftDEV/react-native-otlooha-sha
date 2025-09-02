import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native';
import Quran_bg from '../../assets/images/Quran/quran_bg.png';
import AccountTypeHeader from '../signup/AccountTypeHeader';
import TopTabButtons from '../../components/UI/TopTabButtons';
import Search from '../../assets/images/Donation/Search.svg';
import res from '../../constants/res';
import LinearGradient from 'react-native-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';
import { scale, verticalScale } from 'react-native-size-matters';
import ChevronRight from '../../assets/images/Quran/chevron_right.svg'
import { useLoading } from '../../context/LoadingContext';
import { useDispatch, useSelector } from 'react-redux';
import { getQuranSurahList } from '../../redux/slices/quranSlice';
import LinearSearchBar from './LinearSearchBar';
import { juzListData } from './juzListData';
import { STATUSBAR_HEIGHT } from '../../constants/Dimentions';

const { height, width } = Dimensions.get('window');

const QuranScreen = () => {
  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    showLoader,
    hideLoader,
    startProcessing,
    stopProcessing,
    setConnectivity,
  } = useLoading();

  const { quranListData, loading } = useSelector(state => state.quran)
  const [searchText, setSearchText] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [activeTab, setActiveTab] = useState('Surah');
  // hideLoader(true)
  useEffect(() => {
    if (isFocused) {
      dispatch(getQuranSurahList({}))
    }
  }, [isFocused]);
  //   useEffect(() => {
  //   if (isFocused && loading) {
  //      showLoader(loading)
  //   }else{
  //     hideLoader(true)
  //   }
  // }, [isFocused,loading]);
  // useEffect(() => {
  //   if (activeTab === 'Surah') {
  //     setFilteredData(quranListData || null)
  //   } else {
  //     setFilteredData(juzListData)
  //   }
  // }, [activeTab, quranListData])
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchText?.trim()?.length === 0) {
        setFilteredData(activeTab === 'Surah' ? quranListData : juzListData);
      } else {
        const lowercasedText = searchText.toLowerCase();

        if (activeTab === 'Surah') {
          const filtered = quranListData?.filter(item =>
            item.name.toLowerCase().includes(lowercasedText) ||
            item.englishName.toLowerCase().includes(lowercasedText) ||
            item.englishNameTranslation?.toLowerCase().includes(lowercasedText)
          );
          setFilteredData(filtered);
        } else {
          const filtered = juzListData?.filter(item =>
            item.englishName.toLowerCase().includes(lowercasedText) ||
            item.number.toString().includes(lowercasedText)
          );
          setFilteredData(filtered);
        }
      }
    }, 300); // debounce delay: 300ms

    return () => clearTimeout(delayDebounce);
  }, [searchText, activeTab, quranListData]);

  const handleClearSerach=()=>{
      setSearchText('');
  }
  
  const renderQuranBannerContainer = () => (
    <ImageBackground
      source={Quran_bg}
      style={styles.headerBackground}
      resizeMode="cover">
      <View style={{ flex: 1 }}>
        {isFocused == true &&  <StatusBar barStyle='light-content' backgroundColor="black" />}
        <LinearSearchBar
          placeholder={res.strings.search}
          searchValue={searchText}
          onChange={text => setSearchText(text)}
          handleClearSearch={handleClearSerach}
        />
      </View>
      <View style={{ paddingBottom: verticalScale(10) }}>
        <MaskedView
          maskElement={
            <Text style={[styles.quranLabel, { backgroundColor: 'transparent' }]}>
              Quran
            </Text>
          }>
          <LinearGradient
            colors={['rgba(160, 119, 91, 1)', 'rgba(198, 173, 156, 1)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}>
            <Text style={[styles.quranLabel, { opacity: 0 }]}>Quran</Text>
          </LinearGradient>
        </MaskedView>
        <Text style={styles.subtitle}>Your daily Quran companion.</Text>
      </View>
    </ImageBackground>
  );

  const renderListHeaderContainer = () => (
    <View style={styles.listHeaderContainer}>
      <View style={styles.listTitleContent}>
        <Text style={styles.listTitle}>Quran by {activeTab}</Text>
      </View>
      <View style={{ width: "50%" }}>
        <TopTabButtons
          tabs={['Surah', 'Juz']}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          activeColor="#272682"
          inactiveColor="#686E7A"
          backgroundColor="#F0F2F7"
        />
      </View>
    </View>
  );
    const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate('QuranDetail', {
            item: item
          })
        }>
        <View style={{ flexDirection: 'row' ,paddingVertical:5}}>
          <View style={{ flex: 1, flexDirection: "row" }}>
          { activeTab === 'Surah'? <View style={{ marginRight: 10 }}>
              <Text style={styles.itemTitle}>
                {item?.number}.
              </Text>
            </View>:null}
            <View>
              <Text style={styles.itemTitle}>
                {item.englishName}
              </Text>
              {/* {item?.numberOfJuzAyahs && <Text style={[styles.ayahText, { textAlign: "right" }]}>{item.numberOfJuzAyahs} Ayat
              </Text>} */}
              {item?.englishNameTranslation
                && <Text style={[styles.ayahText]}>{item.englishNameTranslation
                }
                </Text>}
            </View>
          </View>
          {item.name && <View>
            <Text style={styles.itemTitle}>
              {item.name}
            </Text>
            {item?.numberOfAyahs && <Text style={[styles.ayahText, { textAlign: "right" }]}>{item.numberOfAyahs} Ayat
            </Text>}
          </View>}
          {item?.numberOfJuzAyahs && <View style={{ alignSelf: 'center' }}>
            <ChevronRight height={13} width={8} />
          </View>}
        </View>
      </TouchableOpacity>
    );
  };
useFocusEffect(
    React.useCallback(() => {
      if(isFocused == true) {
      StatusBar.setBarStyle('light-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('black');
      }
    }
    }, [])
  );
  return (
    <View style={styles.container}>
        

      {renderQuranBannerContainer()}
      {renderListHeaderContainer()}
      {filteredData?.length ? (
        <FlatList
          data={filteredData || []}
          renderItem={renderItem}
          keyExtractor={item => item.number?.toString()}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <View style={{ alignSelf: "center",}}>
          <Text color={{  

                  fontSize: 14,
                  fontWeight: 400,
                  color: '#88909E',
                  textAlign: 'center',
                  marginBottom: 8,
                  
                  }}>
                    {quranListData === null ? "Data not fount!" : "No search results found"}
                  </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    height: "100%",
    backgroundColor: '#fff',
  },
  headerBackground: {
    height: height / 3.3,
    padding: 16,
    paddingTop: Platform.OS == "ios" ? 60 : STATUSBAR_HEIGHT
  },
  search: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quranLabel: {
    paddingVertical: verticalScale(5),
    fontSize: scale(24),
    fontWeight: '700',
    color: '#fff',
  },
  listHeaderContainer: {
    flexDirection: 'row',
    alignItems: "center",
    paddingHorizontal: scale(15),
  },
  subtitle: {
    fontSize: scale(14),
    fontWeight: '400',
    color: '#FFF',
  },
  listTitleContent: {
    flex: 1,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  listTitle: {
    fontSize: scale(18),
    fontWeight: '700',
    color: "#181B1F"
  },

  listContent: {
    paddingBottom: verticalScale(20),
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: scale(15),
    borderBottomWidth: 1,
    borderBottomColor: '#DDE2EB',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#181B1F',
  },
  ayahText: {
    fontSize: scale(14),
    fontWeight: '400',
    color: '#686E7A',
    marginTop: 4
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F2F7',
    borderRadius: 10,
    // marginHorizontal: 16,
    paddingHorizontal: 12,
    height: 46,
    // marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 17,
    color: '#181B1F',
    fontWeight: '400',
    marginLeft: 8,
  },
});

export default QuranScreen;
