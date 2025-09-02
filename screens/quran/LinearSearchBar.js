import React from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { scale, verticalScale } from 'react-native-size-matters';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { STATUSBAR_HEIGHT } from '../../constants/Dimentions';

const LinearSearchBar = ({
    placeholder = "Search",
    searchValue,
    onChange,
    handleClearSearch
}) => {
    return (
        <View style={styles.container}>
            <LinearGradient
                colors={[
                     
                    'rgba(255, 255, 255, 0.3)',
                    'rgba(255, 255, 255, 0.5)',
                     'rgba(255, 255, 255, 0.1)',
                    //  'rgba(29, 29, 29, 0.6)',
                    //  ' rgba(64, 64, 64, 0.6)'
                ]}
                 start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >



                <View style={styles.blurContainer}>
                    <Ionicons name="search" size={20} color="#fff" style={styles.icon} />
                    <TextInput
                        placeholder={placeholder}
                        placeholderTextColor="#fff"
                        style={styles.input}
                        autoCorrect={false}
                        spellCheck={false}
                        value={searchValue}
                        onChangeText={onChange}
                    />
                     {searchValue.length > 0 && (
                            <TouchableOpacity
                              onPress={handleClearSearch}
                                 style={styles.clearButton}
                                 activeOpacity={0.7}
                                         >
                               <Ionicons name="close" size={20} color="#88909E" />
                             </TouchableOpacity>
                                       )}
                    
                </View>
            </LinearGradient>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: verticalScale(46),
        alignItems: "center",
        padding: 0,
        marginTop:10,
        borderWdth:2,
        borderRadius: 12,
    },
    gradient: {
        alignItems: "center",
        width: "100%",
        height: "100%",
        borderRadius: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.01)',
        overflow: 'hidden',
    },
    blurContainer: {
        width: "100%",
        height: "100%",
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        paddingVertical: 0,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    icon: {
        marginRight: 2,
    },
    input: {
        height: "100%",
        paddingVertical: 'auto',
        flex: 1,
        color: '#fff',
        fontSize: scale(16),
    },
      clearButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default LinearSearchBar;
