import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
  FlatList,
  Pressable,
} from 'react-native';
import { scale, verticalScale } from 'react-native-size-matters';
import Header from '../../components/UI/Header';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Colors from '../../constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { newsAndBlogsData } from './newsAndBlogsHelper';

const NewsAndBlogs = () => {
  const navigation = useNavigation();

  const renderNewsItem = ({ item }) => {
    return (
      <Pressable
        key={item.id}
        style={styles.newsItem}
        >
        <View style={styles.imageBox}>
          <Image source={item.image} style={styles.newsImage} />
        </View>
        <View style={styles.newsContent}>
          <Text style={styles.newsTitle}>{item.title}</Text>
          <Text style={styles.newsTime}>{item.time}</Text>
        </View>
      </Pressable>
    );
  };

  return (

    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.white}
        translucent
      />
      <View style={styles.content}>
        
        <Header
          headerTitle="News and Blogs"
          onBackPress={() => navigation.goBack()}
          fontWeight="500"
          leftIcon={<Ionicons name="search" size={20} color="#181B1F" />}
          onPressLeft={() => { }}
        />
        <FlatList
          data={newsAndBlogsData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderNewsItem}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40
  },
  scrollView: {
    flex: 1,

  },
  content: {
    flex: 1,
    backgroundColor: "#fff",
  },
  newsItem: {
    borderWidth: 1,
    flexDirection: 'row',
    marginBottom: verticalScale(16),
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    // height: 102,
    borderColor: '#DDE2EB',
    borderRadius: 14
  },
  imageBox: {
    marginRight:10,
    height: 90,
    width: 90,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#DDE2EB"
  },
  newsImage: {
    width: "100%",
    height: "100%",
    borderRadius: scale(10),
    resizeMode: "cover"
  },
  newsContent: {
    flex: 1,
  },
  newsTitle: {
    fontSize: scale(14),
    lineHeight: scale(18),
    fontWeight: '600',
    color: '#181B1F',
    marginBottom: verticalScale(4),
  },
  newsTime: {
    fontSize: scale(12),
    color: "#88909E",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 25,
  },
});

export default NewsAndBlogs;