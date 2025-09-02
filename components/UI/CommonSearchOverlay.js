import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { STATUSBAR_HEIGHT } from '../../constants/Dimentions';
import GooglePlacesItemList from './GooglePlacesItemList';

const CommonSearchOverlay = ({
  places,
  handleSearchClose,
  handleClearSearch,
  handleSearchTextChange,
  handleSuggestionPress,
  handleRecentSearchPress,
  handleSearchResultPress,
  fetchPlacesAgain,
  searchQuery,
  searchResultsActive,
  recentSearches,
  searchSuggestions,
  suggestionsLoading,
  isFetchingMore,
  error,
  loading,
  handleLoadMore,
  placeIDArr
}) => {

  const renderSearchSuggestion = (suggestion, index) => (
    <TouchableOpacity
      key={index}
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(suggestion)}
      activeOpacity={0.7}
    >
      <Text style={styles.suggestionText}>{suggestion}</Text>
      <Ionicons name="arrow-up-outline" size={16} color="#88909E" style={styles.suggestionIcon} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchOverlay}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <SafeAreaView />
        <View style={styles.searchHeader}>
          <TouchableOpacity
            style={styles.searchBackButton}
            onPress={handleSearchClose}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={24} color="#88909E" />
          </TouchableOpacity>
          <View style={styles.searchInputContainer}>
            <TextInput
              // ref={searchInputRef}
              style={styles.searchInput}
              placeholder="Search muslim business..."
              value={searchQuery}
              onChangeText={handleSearchTextChange}
              placeholderTextColor="#686E7A"
              autoFocus={true}
              blurOnSubmit={false}
              returnKeyType="search"
              clearButtonMode="never"
              autoCapitalize={'none'}
              autoCorrect={false}
              spellCheck={false}
            />
            {/* {searchQuery.length > 0 && ( */}
              <TouchableOpacity
                onPress={handleClearSearch}
                style={styles.clearButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={20} color="#88909E" />
              </TouchableOpacity>
            {/* )} */}
          </View>
        </View>
        <View style={styles.searchContent}>
          {/* Show recent searches if input is empty and not showing results */}
          {searchQuery.length === 0 && !searchResultsActive && recentSearches.length > 0 && (
            <View style={styles.recentSearches}>
              <Text style={styles.recentSearchesTitle}>Recent Searches</Text>
              {recentSearches.map((recent, idx) => (
                <TouchableOpacity
                  key={idx}
                  style={styles.suggestionItem}
                  onPress={() => handleRecentSearchPress(recent)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.suggestionText}>{recent}</Text>
                  <Ionicons name="arrow-up-outline" size={16} color="#88909E" style={styles.suggestionIcon} />
                </TouchableOpacity>
              ))}
            </View>
          )}
          {/* Show suggestions if input is not empty and not showing results */}
          {searchQuery.length > 0 && !searchResultsActive && (
            suggestionsLoading ? (
              <ActivityIndicator style={{ marginTop: 20 }} size="small" color="#5756C8" />
            ) : searchSuggestions.length > 0 ? (
              <View style={styles.recentSearches}>
                <Text style={styles.recentSearchesTitle}>Suggestions</Text>
                {searchSuggestions.map((suggestion, idx) =>
                  renderSearchSuggestion(suggestion, idx)
                )}
              </View>
            ) : ( 
              <NoSearchResultsFound />
            )
          )}
          {/* Show results only after suggestion/recent is pressed */}
          {searchResultsActive && (
            loading ? (
              <ActivityIndicator style={{ marginTop: 40 }} size="large" color="#5756C8" />
            ) : error ? (
              <View style={styles.noResults}>
                <Text style={styles.noResultsText}>{error}</Text>
                <TouchableOpacity onPress={fetchPlacesAgain}>
                  <Text style={{ color: '#5756C8', marginTop: 8 }}>Reload</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <GooglePlacesItemList
                handleSearchResultPress={handleSearchResultPress}
                renderData={places}
                handleLoadMore={handleLoadMore}
                isFetchingMore={isFetchingMore}
                placeIDArr={placeIDArr}
              />
            )
          )}

        </View>
      </View>
    </SafeAreaView>
  );
};

export const NoSearchResultsFound = () => {
  return (
    <View style={styles.noResults}>
      <Text style={styles.noResultsText}>No search results found</Text>
    </View>
  );
};

export default CommonSearchOverlay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 280,
    zIndex: 1000,
  },
  headerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
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
    paddingTop: 42,
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
    color: 'white',
    textAlign: 'center',
  },


  searchOverlay: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: STATUSBAR_HEIGHT,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    height: 48,
  },
  searchBackButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    padding: 0,
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
    backgroundColor: 'white',
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
    transform: [{ rotate: '45deg' }],
  },
  searchResults: {
    paddingTop: 12,
  },


  noResults: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    paddingVertical: 20,
  },
  noResultsText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 8,
  },



});
