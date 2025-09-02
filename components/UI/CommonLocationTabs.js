import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const CommonLocationTabs = ({
  renderData,
  selectedLocation,
  gettingLocation,
  setSelectedLocation
}) => {
  return (
    <View style={styles.locationSwitcher}>
      {renderData.map(loc => (
        <TouchableOpacity
          key={loc.key}
          style={[
            styles.locationButton,
            selectedLocation === loc.key && styles.locationButtonActive,
          ]}
          onPress={() => setSelectedLocation(loc.key)}
        >
          <Text
            style={[
              styles.locationButtonText,
              selectedLocation === loc.key && styles.locationButtonTextActive,
            ]}
          >
            {loc.label}
            {loc.key === 'current' && gettingLocation ? ' (Getting...)' : ''}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default CommonLocationTabs

const styles = StyleSheet.create({
  locationSwitcher: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#F3F4F6',
    gap: 8,
  },
  locationButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#DDE2EB',
    marginHorizontal: 4,
  },
  locationButtonActive: {
    backgroundColor: '#5756C8',
    borderColor: '#5756C8',
  },
  locationButtonText: {
    color: '#181B1F',
    fontSize: 15,
    fontWeight: '500',
  },
  locationButtonTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
})