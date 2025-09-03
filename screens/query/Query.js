import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
  Platform,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecitationList = ({navigation}) => {
  const [recitations, setRecitations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshingRequested, setRefreshingRequested] = useState(false);
  const [refreshingResponded, setRefreshingResponded] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [playingRecordedId, setPlayingRecordedId] = useState(null);
  const [recordingId, setRecordingId] = useState(null);
  const [recordedFilePaths, setRecordedFilePaths] = useState({});
  const [selectedTab, setSelectedTab] = useState('Requested');

  const token = useSelector(state => state.auth?.token);

  useEffect(() => {
    requestStoragePermission();
  }, []);

  useEffect(() => {
    if (token) {
      fetchRecitations();
    }
  }, [token]);

  const requestStoragePermission = async () => {
    if (Platform.OS === 'android') {
      try {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const fetchRecitations = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        'http://31.97.206.49:3001/api/quran/get/student/recitations',
        {headers: {Authorization: `Bearer ${token}`}},
      );
      const json = await res.json();

      console.log('Fetched recitations:', json);
      if (json.data && Array.isArray(json.data)) {
        setRecitations(json.data);
      } else {
        setRecitations([]);
      }
    } catch (err) {
      console.error(err);
      setRecitations([]);
    }
    setLoading(false);
  };

  const onRefreshRequested = async () => {
    setRefreshingRequested(true);
    await fetchRecitations();
    setRefreshingRequested(false);
  };

  const onRefreshResponded = async () => {
    setRefreshingResponded(true);
    await fetchRecitations();
    setRefreshingResponded(false);
  };

  const filterRecitations = () => {
    if (!recitations.length) return [];
    if (selectedTab === 'Requested') {
      return recitations.filter(r =>
        ['Pending', 'Waiting', 'Re-recorded'].includes(r.status),
      );
    } else {
      return recitations.filter(r =>
        ['Responded', 'Reviewed'].includes(r.status),
      );
    }
  };

  const downloadAndPlay = async (urlArray, id) => {
    if (!urlArray || urlArray.length === 0) return;
    const url = Array.isArray(urlArray) ? urlArray[0] : urlArray;
    if (playingVoiceId === id || playingRecordedId === id) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setPlayingVoiceId(null);
      setPlayingRecordedId(null);
      return;
    }
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setPlayingVoiceId(null);
    setPlayingRecordedId(null);

    try {
      const {fs, config} = RNFetchBlob;
      const path = `${fs.dirs.CacheDir}/rec_${id}.aac`;
      await config({fileCache: true, path}).fetch('GET', url);
      await audioRecorderPlayer.startPlayer(path);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition >= e.duration) {
          audioRecorderPlayer.stopPlayer();
          setPlayingVoiceId(null);
        }
      });
      setPlayingVoiceId(id);
    } catch (err) {
      console.error(err);
    }
  };

  const playRecorded = async (filePath, id) => {
    if (!filePath) return;
    if (playingRecordedId === id) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setPlayingRecordedId(null);
      return;
    }
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setPlayingVoiceId(null);
    setPlayingRecordedId(null);

    await audioRecorderPlayer.startPlayer(filePath);
    audioRecorderPlayer.addPlayBackListener(e => {
      if (e.currentPosition >= e.duration) {
        audioRecorderPlayer.stopPlayer();
        setPlayingRecordedId(null);
      }
    });
    setPlayingRecordedId(id);
  };

  const startRec = async id => {
    await audioRecorderPlayer.stopPlayer();
    audioRecorderPlayer.removePlayBackListener();
    setPlayingVoiceId(null);
    setPlayingRecordedId(null);

    await audioRecorderPlayer.startRecorder();
    setRecordingId(id);
    setRecordedFilePaths(prev => ({...prev, [id]: null}));
  };

  const stopRec = async id => {
    try {
      const file = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordingId(null);
      setRecordedFilePaths(prev => ({...prev, [id]: file}));
    } catch (error) {
      console.error('Record stop error', error);
    }
  };

  const handleCardPress = item => {
    console.log(item, 'Card pressed item details');
    if (selectedTab === 'Responded' && navigation) {
      navigation.navigate('RecitationDetails', {item});
    }
  };

  const renderItem = ({item}) => {


    console.log(item, "item renderItem")
    const id = item._id ?? String(item.id) ?? Math.random().toString();
    const isRecording = recordingId === id;
    const recorded = recordedFilePaths[id];
    const date = new Date(
      item.createdAt || item.updatedAt,
    ).toLocaleDateString();

    const audioTextStr = Array.isArray(item.audioText)
      ? item.audioText.join(' ')
      : item.audioText;

    const CardWrapper = selectedTab === 'Responded' ? TouchableOpacity : View;

    return (
      <CardWrapper
        style={styles.card}
        onPress={() => handleCardPress(item)}
        activeOpacity={selectedTab === 'Responded' ? 0.7 : 1}>
        <View style={styles.headerRow}>
          <Text style={styles.chapter}>Recitation ID. 1</Text>

          <View
            style={[
              styles.badge,
              (item.status === 'Pending' || item.status === 'Waiting') &&
                styles.waitingBadge,
              item.status === 'Re-recorded' && styles.rerecordBadge,
              (item.status === 'Responded' || item.status === 'Reviewed') &&
                styles.respondedBadge,
            ]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>

        <View>
          <Text style={styles.chapter}>Surah Number : {item.chapterNo}</Text>
        </View>

         <View>
          <Text style={styles.chapter}>Line Number : {item.pageNo}</Text>
        </View>

        <Text style={styles.surahName}>{audioTextStr}</Text>
        {selectedTab === 'Responded' && item.teacherFeedback ? (
          <Text style={styles.feedback}>
            Teacher Feedback: {item.teacherFeedback}
          </Text>
        ) : null}
        <View style={styles.footerRow}>
          <Text style={styles.dateText}>📅 {date}</Text>
          {selectedTab === 'Requested' && (
            <TouchableOpacity
              style={styles.recordButton}
              onPress={() => (isRecording ? stopRec(id) : startRec(id))}>
              <Text style={styles.recordText}>
                {isRecording ? 'Stop' : 'Re-record'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        {selectedTab === 'Requested' && (
          <View style={styles.actionsRow}>
            {item.voiceFile && item.voiceFile.length ? (
              <TouchableOpacity
                style={styles.playButton}
                onPress={() => downloadAndPlay(item.voiceFile, id)}>
                <Text style={styles.playText}>
                  {playingVoiceId === id ? 'Stop' : 'Play'}
                </Text>
              </TouchableOpacity>
            ) : null}
            {recorded ? (
              <TouchableOpacity
                style={styles.playRecorded}
                onPress={() => playRecorded(recorded, id)}>
                <Text style={styles.playText}>
                  {playingRecordedId === id ? 'Stop' : 'Play Yours'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </CardWrapper>
    );
  };

  if (loading && !refreshingRequested && !refreshingResponded) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6c8029" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Recitations</Text>
      <View style={styles.tabContainer}>
        {['Requested', 'Responded'].map(tab => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, selectedTab === tab && styles.tabActive]}
            onPress={() => setSelectedTab(tab)}>
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextActive,
              ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filterRecitations()}
        keyExtractor={item =>
          item._id ?? String(item.id) ?? Math.random().toString()
        }
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={
              selectedTab === 'Requested'
                ? refreshingRequested
                : refreshingResponded
            }
            onRefresh={
              selectedTab === 'Requested'
                ? onRefreshRequested
                : onRefreshResponded
            }
            tintColor="#6c8029"
            colors={['#6c8029']}
          />
        }
        ListEmptyComponent={() => (
          <View style={{marginTop: 40, alignItems: 'center'}}>
            <Text style={{fontSize: 16, fontStyle: 'italic', color: '#999'}}>
              No recitations found
            </Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F7', padding: 16},
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 12,
    color: '#333',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#E0E0E0',
    borderRadius: 24,
    alignSelf: 'center',
    padding: 4,
    marginBottom: 12,
  },
  tab: {flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 20},
  tabActive: {backgroundColor: '#FFFFFF'},
  tabText: {color: '#777', fontSize: 16},
  tabTextActive: {color: '#2A2A2A', fontWeight: '700'},
  list: {paddingBottom: 40},
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chapter: {fontSize: 16, fontWeight: '600', color: '#2A2A2A'},
  badge: {paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12},
  waitingBadge: {backgroundColor: '#FFF4E5'},
  rerecordBadge: {backgroundColor: '#FFE5E5'},
  respondedBadge: {backgroundColor: '#E8F5E9'},
  badgeText: {fontSize: 12, fontWeight: '600', color: '#555'},
  surahName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginVertical: 8,
  },
  feedback: {fontSize: 14, color: '#555', marginBottom: 8},
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {fontSize: 12, color: '#888'},
  recordButton: {
    backgroundColor: '#FFCDD2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  recordText: {fontSize: 13, fontWeight: '600', color: '#C62828'},
  actionsRow: {flexDirection: 'row', marginTop: 12},
  playButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  playRecorded: {
    backgroundColor: '#388E3C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  playText: {color: '#FFF', fontWeight: '700', fontSize: 14},
  loader: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default RecitationList;
