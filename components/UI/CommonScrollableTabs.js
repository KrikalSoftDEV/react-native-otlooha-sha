import { StyleSheet, Text, TouchableOpacity, View, FlatList } from 'react-native'
import React from 'react'
import { scale } from 'react-native-size-matters';

const CommonScrollableTabs = ({
    renderData,
    selectedTab,
    setSelectedTab,
    matchingTab
}) => {
    return (
        <View style={styles.tabContainer}>
            <FlatList
                style={{ overflow: 'visible' }}
                horizontal
                showsHorizontalScrollIndicator={false}
                data={renderData}
                renderItem={(item) => {
                    const filter = item.item;
                    return (
                        <TouchableOpacity
                            key={filter}
                            style={[
                                styles.tabButton,
                                selectedTab === filter && styles.tabButtonActive,
                            ]}
                            onPress={() => setSelectedTab(filter)}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    selectedTab === filter && styles.tabButtonTextActive,
                                ]}
                            >
                                {filter !== matchingTab ? filter : filter + 's'}
                            </Text>
                        </TouchableOpacity>
                    );
                }}
            />
        </View>
    )
}

export default CommonScrollableTabs

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15,
        paddingTop: 10,
        gap: 10,
    },
    tabButton: {
        marginRight: 12,
        paddingHorizontal: 22,
        paddingVertical: 10,
        borderRadius: 25,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderColor: '#DDE2EB',
    },
    tabButtonActive: {
        backgroundColor: '#5756C8',
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 5 },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
    },
    tabButtonText: {
        fontSize: scale(16),
        fontWeight: '400',
        color: '#181B1F',
    },
    tabButtonTextActive: {
        fontSize: scale(16),
        color: '#FFFFFF',
        fontWeight: '600',
    },
})