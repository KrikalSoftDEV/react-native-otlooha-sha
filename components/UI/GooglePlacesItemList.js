import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Linking,
} from 'react-native';
import Arrow_right_worship from '../../assets/images/WorshipPlaces/arrow_right_worship.svg';
import ClinicMobileIcon from '../../assets/images/WorshipPlaces/clinic-mobile-icon.svg';
import { scale } from 'react-native-size-matters';

const GooglePlacesItemLIst = ({
    renderData,
    handleSearchResultPress,
    isFetchingMore,
    handleLoadMore,
    placeIDArr,
    selectedTab = "",
    screen = "",
}) => {

    const shouldApplyWaqafStyle = (placeId) => {
        return placeIDArr.some(place => place.id === placeId);
    };

    const renderPlaceCard = ({ item }) => {
        return (
            <View
                style={[
                    styles.mosqueCard,
                ]}
            >
                <View style={{ marginRight: 40 }} >
                    {selectedTab === "All" && screen === "Klinik" && <View style={{ flexDirection: "row" }}>
                        <Text style={styles.mosqueNameWaqaf}
                        >{(item.klinik && item.dialisis) ? "Klinik • Dialisis" : item.klinik ? "Klinik" : "Dialisis"}
                        </Text>
                    </View>}
                    {/* {shouldApplyWaqafStyle(item?.place_id) && <Text style={styles.mosqueNameWaqaf} numberOfLines={1} >{"Waqaf An-Nur"}</Text>} */}
                    <Text style={styles.mosqueName} numberOfLines={2} >{item.name}</Text>
                    <Text style={styles.mosqueLocation} numberOfLines={2} >{item.vicinity || item.formatted_address || item.address}</Text>
                    {item.distance && <Text style={styles.mosqueDistance} numberOfLines={2} >{item.distance ? `${item.distance.toFixed(2)} km` : ''}</Text>}
                    {item.phone && (
                        <TouchableOpacity
                            onPress={() => Linking.openURL(`tel:${item.phone}`)}
                            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 0 }}
                        >
                            <ClinicMobileIcon width={16} height={16} />
                            <Text style={[styles.mosqueDistance, { marginLeft: 5 }]}>
                                {item.phone}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
                <TouchableOpacity
                    style={styles.directionButton}
                    onPress={() => handleSearchResultPress(item)}
                >
                    <Arrow_right_worship />
                </TouchableOpacity>
            </View>
        )
    };

    return (
        <View style={{ marginVertical: 20 }}>
            <FlatList
                data={renderData}
                keyExtractor={item => item.place_id}
                renderItem={renderPlaceCard}
                ListEmptyComponent={<NoSearchResultsFound />}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={isFetchingMore ? <ActivityIndicator size="small" color="#5756C8" /> : null}
            />
        </View>
    );
};

export const NoSearchResultsFound = () => {
    return (
        <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No search results found</Text>
        </View>
    );
};

export default GooglePlacesItemLIst;

const styles = StyleSheet.create({
    mosqueCard: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginBottom: 12,
        borderRadius: 14,
        padding: scale(14),
        position: 'relative',
        borderWidth: 1,
        borderColor: '#DDE2EB',
        shadowColor: 'rgba(12, 13, 13, 0.05)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 4,
    },
    mosqueCardWaqaf: {
        backgroundColor: '#F6F5FF',
        borderColor: '#C9C5FC',
        shadowColor: 'rgba(12, 13, 13, 0.05)',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 1,
        shadowRadius: 10,
        elevation: 2,
    },

    mosqueName: {
        fontSize: 16,
        fontWeight: '500',
        color: '#181B1F',
        marginBottom: 8,
    },
    mosqueNameWaqaf: {
        fontSize: 14,
        fontWeight: '600',
        color: '#5756C8',
        marginBottom: 8,
    },
    mosqueLocation: {
        fontSize: 14,
        color: '#686E7A',
        fontWeight: '400',
        marginBottom: 12,
    },
    mosqueDistance: {
        fontSize: 14,
        color: '#686E7A',
        fontWeight: '600',
    },
    directionButton: {
        position: 'absolute',
        top: scale(10),
        right: scale(5),
        width: scale(38),
        height: scale(38),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
    },

    searchResults: {
        paddingTop: 12,
    },
    noResults: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        // paddingVertical: 10,
    },
    noResultsText: {
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 8,
    },

});
