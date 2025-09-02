import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    SafeAreaView,
    StatusBar,
    Animated,
    ActivityIndicator,
} from 'react-native';
import { khutbahPdfData } from './khutbahHelper';
import { useIsFocused } from '@react-navigation/native';
import KhutbahItems from './KhutbahItems';
// import { downloadFileOffline } from '../../utils/fileDownloader';
import KhutbahHeader from './khutbahHeader';
import FileViewer from 'react-native-file-viewer';
// import RNFS from 'react-native-fs';
import RNBlobUtil from 'react-native-blob-util';
import LinearGradient from 'react-native-linear-gradient';
import { scale } from 'react-native-size-matters';
import { useDispatch, useSelector } from 'react-redux';
import { getkhutbahList } from '../../redux/slices/khutbahSlice';
import AnimatedBannerHeader from '../../components/UI/AnimatedBannerHeader';
import KhutbahHeaderBg from "../../assets/images/Khutbah/khutbah-header-bg.png";

const headerCarouselImages = [
    { image: KhutbahHeaderBg, accessibilityLabel: 'Klinik Waqaf An-Nur' },
    { image: KhutbahHeaderBg, accessibilityLabel: 'Klinik Waqaf An-Nur' },
];

const KhutbahScreen = () => {
    const isFocused = useIsFocused();
    const dispatch = useDispatch()
    const khutbahResponse = khutbahPdfData.RESPONSE.data.result.khutbahListResponseDtos;
    const { loading, khutbahData, totalCount } = useSelector(state => state.khutbah)
    const [khutbahListData, setKhutbahListData] = useState([]);
    const [downloadingIndex, setDownloadingIndex] = useState(null);
    const [downloadCompleteIndex, setDownloadCompleteIndex] = useState(null);
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [isDownloading, setIsDownloading] = useState(false);
    const [downloadProgress, setDownloadProgress] = useState(0);
    const [toastType, setToastType] = useState('success');
    const progressAnim = useRef(new Animated.Value(0)).current;
    const lastProgressRef = useRef(100); // start from 100%
    const scrollY = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let body = {
            "pageNumber": 1,
            "pageSize": 6,
            "sortBy": "",
            "sortExpression": "",
            "searchBy": 0,
            "searchValue": "",
            "orgId": 4

        }
        dispatch(getkhutbahList(body));
    }, [isFocused]);

    useEffect(() => {
        if (isFocused && khutbahData) {
            setKhutbahListData(khutbahData?.khutbahListResponseDtos);
        } else {
            setKhutbahListData([])
        }
    }, [isFocused, khutbahData]);

    useEffect(() => {
        if (downloadingIndex !== null) {
            progressAnim.setValue(0);
            Animated.timing(progressAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }).start();
        }
    }, [downloadingIndex]);

    const handleDownload = async (item, index) => {

        const fileUrl = item.filePath;
        const fileName = `khutbah-${item.khutbahId}.pdf`;
        const filePath = `${RNBlobUtil.fs.dirs.DownloadDir}/${fileName}`;

        setDownloadingIndex(index);
        setDownloadCompleteIndex(null);
        setIsDownloading(true);
        setDownloadProgress(0);

        try {
            const exists = await RNBlobUtil.fs.exists(filePath);

            if (exists) {
                setToastType('success');
                setToastMessage('Already downloaded!');
                setDownloadCompleteIndex(index);
                setToastVisible(true);

                setTimeout(async () => {
                    await FileViewer.open(filePath, { showOpenWithDialog: true });
                    setToastVisible(false);
                }, 1500);

                return filePath;
            }

            setToastType('success');
            setToastMessage('Downloading...');
            setToastVisible(true);

            const task = RNBlobUtil.config({
                path: filePath,
                fileCache: true,
                addAndroidDownloads: {
                    useDownloadManager: true,
                    notification: true,
                    mime: 'application/pdf',
                    mediaScannable: true,
                    path: filePath,
                    title: fileName,
                    description: 'Downloading khutbah file',
                },
            }).fetch('GET', fileUrl);

            task.progress({ interval: 100, count: 10 }, (received, total) => {
                const progress = total > 0 ? received / total : 0;
                setDownloadProgress(progress);
            });

            const res = await task;

            if (res && res.path()) {
                setDownloadCompleteIndex(index);
                setToastMessage('File downloaded successfully!');
                return res.path();
            } else {
                throw new Error('Failed to download');
            }

        } catch (err) {
            setToastType('error');
            setToastMessage('Download failed. Check connection and try again.');
            return null;
        } finally {
            setIsDownloading(false);
            setTimeout(() => {
                setDownloadProgress(0);
                setToastVisible(false);
                setDownloadingIndex(null);
                setTimeout(() => {
                    setDownloadCompleteIndex(null);
                }, 1000);
            }, 1000);
        }
    };

    const openOrDownloadFile = async (item, index) => {
        const fileName = `khutbah-${item.khutbahId}.pdf`;
        const filePath = `${RNBlobUtil.fs.dirs.DownloadDir}/${fileName}`;

        try {
            const exists = await RNBlobUtil.fs.exists(filePath);

            if (exists) {
                await FileViewer.open(filePath, { showOpenWithDialog: true });
            } else {
                const path = await handleDownload(item, index);
                if (path) await FileViewer.open(path, { showOpenWithDialog: true });
            }
        } catch (err) {
            setToastType('error');
            setToastMessage('Failed to open file.');
            setToastVisible(true);
        }
    };

    const renderItem = ({ item, index }) => {
        const isDownloadingItem = downloadingIndex === index;
        const isDownloaded = downloadCompleteIndex === index;
        return (
            <KhutbahItems
                item={item}
                index={index}
                isDownloading={isDownloadingItem}
                isDownloaded={isDownloaded}
                downloadProgress={isDownloadingItem ? downloadProgress : 0}
                handleDownload={() => handleDownload(item, index)}
                onPressItem={() => openOrDownloadFile(item, index)}
            />
        );
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            {/* <KhutbahHeader /> */}
            <AnimatedBannerHeader
                scrollY={scrollY}
                title="Khutbah"
                subTitle="Stay spiritually connected with curated Khutbahs."
                searchActivePress={() => { }}
                headerCarouselImages={headerCarouselImages}
            />
            <Animated.FlatList
                data={khutbahListData}
                keyExtractor={item => item.khutbahId.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<NoSearchResultsFound />}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
                scrollEventThrottle={16}
                ListFooterComponent={loading ? <ActivityIndicator size="small" color="#5756C8" /> : null}
            />
            {toastVisible && (
                <LinearGradient
                    colors={toastType === 'error' ? ['#FFD3D1', '#FFF5F5'] : ['#BDFFDE', '#EBFFF5']}
                    style={[styles.toastContainer, toastType === 'error' ? styles.toastError : styles.toastSuccess]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}>
                    <Text style={toastType === 'error' ? styles.toastTextError : styles.toastTextSuccess}>{toastMessage}</Text>
                </LinearGradient>
            )}
        </View>
    );
};

export const NoSearchResultsFound = () => {
    return (
        <View style={styles.noResults}>
            <Text style={styles.noResultsText}>No Khutbahs are available at the moment.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    listContent: { paddingTop: 280, paddingBottom: 20 },
    toastContainer: {
        position: 'absolute',
        bottom: 60,
        alignSelf: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        zIndex: 999,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        maxWidth: '85%',
    },
    toastSuccess: {
        backgroundColor: '#E7FFF1',
        borderColor: '#3BC47D',
        borderWidth: 1.5,
    },
    toastError: {
        borderWidth: 1,
        borderColor: '#FF9E99',
    },
    toastTextSuccess: {
        fontSize: scale(14),
        fontWeight: '600',
        color: '#181B1F',
    },
    toastTextError: {
        fontSize: scale(12),
        fontWeight: '600',
        color: '#181B1F',
        textAlign: 'center',
    },
    noResults: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 60,
    },
    noResultsText: {
        fontSize: 16,
        color: '#9CA3AF',
        textAlign: 'center',
        marginBottom: 8,
    },
});

export default KhutbahScreen;
