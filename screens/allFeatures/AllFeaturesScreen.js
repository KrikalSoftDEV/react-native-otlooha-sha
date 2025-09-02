import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Alert,
  FlatList,
  StatusBar,
} from 'react-native';
import { FeaturesData } from './featuresData';
import Colors from '../../constants/Colors';
import Header from '../../components/UI/Header';
import { useNavigation } from '@react-navigation/native';
import { NAVIGATIONBAR_HEIGHT, STATUSBAR_HEIGHT } from '../../constants/Dimentions';
import res from '../../constants/res';
import { verticalScale } from 'react-native-size-matters';

const { width } = Dimensions.get('window');

const FILTERS = [res.strings.all, res.strings.daily, res.strings.guidance, res.strings.community , res.strings.personalGrowth];

const groupByCategory = (data) => {
  return data.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});
};

const AllFeaturesScreen = () => {
  const navigation = useNavigation()
  const [selectedFilter, setSelectedFilter] = useState(res.strings.all);

  const filteredData =
    selectedFilter ===res.strings.all
      ? FeaturesData
      : FeaturesData.filter((item) => item.category === selectedFilter);

  const groupedFeatures = groupByCategory(filteredData);
const redirectScreen=(route, params)=>{
  if(route==="Quran"){
  navigation.navigate('TabNavigation', {
  screen: route,
},params && params);
return
  }
 else if(route){
    navigation.navigate(route, params && params)
  }else{
    Alert.alert("Coming Soon!")
  }
}
  return (
    <SafeAreaView style={styles.container}>
       <StatusBar
              translucent
              backgroundColor="transparent"
              barStyle="dark-content"
            />
            
      <Header
        onBackPress={() => navigation.goBack()}
        headerTitle={res.strings.allFeature}
      />

      <View style={styles.filterContainer}>
        <FlatList 
        style={{overflow:'visible'}}
        horizontal
        showsHorizontalScrollIndicator={false}
        data={FILTERS}
        renderItem={(item) => {
          const filter = item.item
          return(
<TouchableOpacity
            // key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
          )
        }}
        
        />

        {/* {FILTERS.map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter(filter)}
          >
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))} */}
      </View>

      <ScrollView contentContainerStyle={styles.featureList}>
        {Object.entries(groupedFeatures).map(([category, items]) => (
          <View key={category}>
            {selectedFilter ===res.strings.all&& <View style={styles.headerRow}>
              <Text style={styles.sectionHeader}>{category}</Text>
              <View style={styles.sectionLine} />
            </View>}

            <View style={styles.gridWrapper}>
              {items.map((item) => {
                return(
                <TouchableOpacity key={item.id} style={styles.card} onPress={()=> redirectScreen(item.navigation, item?.navigationParams)}>
                  <View style={styles.cardHeader}>
                    <Image source={item.icon} style={styles.icon} />
                    <Image
                      source={require('../../assets/images/Homescreen/section-rrow-right.png')}
                      style={styles.arrowIcon}
                    />
                  </View>
                  <View style={styles.cardTextContainer}>
                    <Text style={styles.title}>{item.title}</Text>
                    <Text style={styles.description}>{item.description}</Text>
                  </View>
                </TouchableOpacity>
              )})}
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.colorWhite,
    paddingTop: verticalScale(STATUSBAR_HEIGHT),
    paddingBottom:NAVIGATIONBAR_HEIGHT
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  filterContainer: {
    // flexDirection: 'row',
    overflow:'visible',
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
    marginRight: 10,
    overflow:'scroll'
  },
  activeFilter: {
    backgroundColor: '#5756C8',
  },
  filterText: {
    fontSize: 16,
    color: '#555',
  },
  activeFilterText: {
    fontSize: 16,
    color: Colors.colorWhite,
    fontWeight: '600',
  },
  featureList: {
    paddingTop: 8,
    paddingBottom: 20,
    paddingHorizontal: 16
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
    color: '#000',
  },
  sectionLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  gridWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 50) / 2,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(12, 12, 13, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  icon: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  arrowIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  cardTextContainer: {
    paddingHorizontal: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#181B1F',
  },
  description: {
    fontSize: 12,
    color: '#464B54',
  },
});

export default AllFeaturesScreen;
