import {useEffect, useState} from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {getData} from '../../constants/Storage';
import Header from '../../components/UI/Header';
import Colors from '../../constants/Colors';
import {scale, verticalScale} from 'react-native-size-matters';
import { STATUSBAR_HEIGHT } from '../../constants/Dimentions';
import RightArrow from "../../assets/images/Dua/right_arrow.svg"
const FavoriteDua = (props) => {
  const [duaList, setDuaList] = useState([]);
  useEffect(() => {
    getDua();
  }, []);

  const getDua = async () => {
    const getDuaList = await getData(`dua_json`);
    // setDuaList(getDuaList);
     const filtredBookmarks = getDuaList.filter(
        ele => ele.isBookmark === true,
      );
      console.log(filtredBookmarks,'checlk booknmarks')
      setDuaList(filtredBookmarks);
    console.log('🚀 ~ getDua ~ getDuaList:', getDuaList);
  };

  const renderDuaItems = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.duaItem}
        onPress={() => {}}>
        <Text style={styles.duaTitle}>{item.title}</Text>
   <RightArrow />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.colorWhite,paddingTop:verticalScale(STATUSBAR_HEIGHT)}}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <Header
        borderVisible={true}
        borderWidth={1}
        headerTitle={'Favourite'}
        onBackPress={() => props.navigation.goBack()}
      />
      {duaList.length > 0 ? (
        <FlatList data={duaList} renderItem={renderDuaItems} />
      ) : (
        <Text
          style={{
            fontWeight: '400',
            fontSize: 14,
            color: '#88909E',
            alignSelf: 'center',
            paddingVertical: 30,
          }}>
          No favourite added yet
        </Text>
      )}
    </SafeAreaView>
  );
};

export default FavoriteDua;

const styles = StyleSheet.create({
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
      maxWidth:"80%",
      // lineHeight: Platform.OS === "android" ? 16 : 22,
      color: Colors.textColor,
      fontWeight: '500',
    },
    arrowIcon: {
      fontSize: 20,
      color: '#999999',
    },
  
});
