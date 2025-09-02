import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ImageBackground,
  Platform,
  Dimensions,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import Header from '../../components/UI/Header';
import Colors from '../../constants/Colors';
import { newsAndBlogsData } from './newsAndBlogsHelper';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
const { height, width } = Dimensions.get('window');
const NewsDetail = ({ route }) => {
  const navigation = useNavigation()
  const { newsId } = route.params;
  const isFocused = useIsFocused()
  const [newsDetails, setNewsDetails]=useState(null)

  useEffect(()=>{
    if(newsId){
 const filteredData = newsAndBlogsData.filter((item)=>item.id ===newsId)[0]
 setNewsDetails(filteredData)
    }
   
  },[newsId,isFocused])
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.white}
        translucent
      />
      <View style={{flex:1, paddingVertical:40}}>
         <Header
          headerTitle="News Detail"
          onBackPress={() => navigation.goBack()}
          fontWeight="500"
          // leftIcon={<Ionicons name="search" size={20} color="#181B1F" />}
          // onPressLeft={() => { }}
        />
      <ScrollView style={styles.scrollView}>
        {/* {renderQuranBannerContainer()} */}
        <Image source={newsDetails?.image} style={styles.newsImage} />
        <View style={styles.content}>
          <Text style={styles.title}>{newsDetails?.title}</Text>
          {/* <Text style={styles.date}>{newsDetails?.date}</Text> */}
          <Text style={styles.newsContent}>{newsDetails?.description}</Text>
        </View>
      </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF",
  },
  scrollView: {
    flex: 1,
  },
  newsImage: {
    width: '100%',
    height: verticalScale(200),
    borderBottomRightRadius:30,
    borderBottomLeftRadius:30,
    resizeMode: 'cover',
  },
  content: {
    padding: scale(16),
  },
  title: {
    fontSize: scale(24),
    fontWeight: '700',
    color: "#181B1F",
    marginBottom: verticalScale(8),
  },
  date: {
    fontSize: scale(14),
    color: Colors.gray,
    marginBottom: verticalScale(16),
  },
  newsContent: {
    fontSize: scale(16),
    fontWeight: '400',
    color: "#292D33",
    lineHeight: scale(24),
  },
    headerBackground: {
      height: height / 3.3,
      padding: 16,
      paddingTop: Platform.OS == "ios" ? 60 : 16,
    },
});

export default NewsDetail;