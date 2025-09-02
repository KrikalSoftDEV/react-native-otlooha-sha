import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Pressable,
    Image,
} from 'react-native';
import CloseImg from '../../assets/images/close-icon.png';
import { scale } from 'react-native-size-matters';

const AyahSelectorModal = ({ renderData, propsData, ayahSelectorModalVisible,onPlayPress,isSelectedIndex, onClose }) => {

  const handlePlayPress = (item) => {
 
       const playingTitle = `${propsData?.englishName} : ${
         item.numberInSurah
       }`;
       onPlayPress(item.number, item?.audio, playingTitle);
       onClose()
     };

    return (
        <Modal
            transparent
            animationType="fade"
            visible={ayahSelectorModalVisible}
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.title}>{propsData?.englishName}
                                {/* {propsData?.englishNameTranslation ? ` (${propsData?.englishNameTranslation})` : ""} */}
                            </Text>
                            <Text style={[{
    fontSize: scale(14),
    fontWeight: '400',
    color: '#686E7A',
    marginBottom: 4,
  }]}>{propsData?.englishNameTranslation?`${propsData?.englishNameTranslation}`: ""}</Text>
                            <Text style={styles.subtitle}>{propsData?.numberOfAyahs || propsData?.numberOfJuzAyahs} Ayat</Text>
                        </View>
                        <TouchableOpacity
                            onPress={onClose}
                            style={styles.closeBtn}>
                            <Image source={CloseImg} style={StyleSheet.closeIcon} />
                        </TouchableOpacity>
                    </View>

                    <FlatList
                        data={renderData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={[styles.item,
                            {backgroundColor:item?.number === isSelectedIndex ?"rgba(170, 168, 168, 0.1)" :"#FFF"}
                            ]} onPress={() => handlePlayPress(item)} >
                                <Text style={styles.itemText}>Ayat {item.numberInSurah}</Text>
                            </TouchableOpacity>
                        )}
                        contentContainerStyle={{ paddingBottom: 10 }}
                    />
                </View>
            </View>
        </Modal>
    );
};

export default AyahSelectorModal;

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 30,
        paddingVertical: 16,
        paddingHorizontal: 16,
        maxHeight: '55%',
    },
    header: {
        alignItems: 'center',
        marginBottom: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        position: 'relative',
        marginBottom: 25
    },
    title: {
        fontWeight: '500',
        fontSize: scale(18),
        color: "#181B1F",
        // textAlign: 'center',
    },
    subtitle: {
        fontSize: scale(14),
        color: '#686E7A',
        fontWeight: '400',
        marginTop: 2,
    },
    closeBtn: {
        backgroundColor: '#F0F2F7',
        alignItems: 'center',
        justifyContent: 'center',
        height: scale(24),
        width: scale(24),
        borderRadius: scale(25),
        position: 'absolute',
        right: 0,
        top: -4,
        padding: 8,
    },
    closeIcon: {
        height: scale(12),
        width: scale(12),
        resizeMode: 'contain',
    },
    item: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#DDE2EB',
    },
    itemText: {
        fontWeight: '400',
        color: "#292D33",
        fontSize: scale(15),
    },
});
