import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useSelector } from 'react-redux';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecitationList = () => {
  const [recitations, setRecitations] = useState([]);
  const [responses, setResponses] = useState({});
  const [loading, setLoading] = useState(false);
  const [playingVoiceId, setPlayingVoiceId] = useState(null);
  const [playingRecordedId, setPlayingRecordedId] = useState(null);
  const [recordingId, setRecordingId] = useState(null);
  const [recordedFilePaths, setRecordedFilePaths] = useState({});

  const data = useSelector(state => state.auth);
  const { token } = data || {};

  useEffect(() => {
    fetchRecitations();
  }, []);

  const fetchRecitations = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://31.97.206.49:3001/api/quran/get/student/recitations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      const recitationArray = data ? (Array.isArray(data) ? data : [data]) : [];
      setRecitations(recitationArray[0]?.data || recitationArray);
    } catch (error) {
      console.error('Error fetching recitations:', error);
    }
    setLoading(false);
  };

  const refreshData = async () => {
    await fetchRecitations();
  };

  const handleRespond = (id) => {
    setResponses(prev => ({ ...prev, [id]: true }));
    refreshData();
  };

  const onStartPlayVoice = async (voiceFileUrl, id) => {
    if (!voiceFileUrl) return;
    if (playingVoiceId === id) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setPlayingVoiceId(null);
    } else {
      if (playingRecordedId) {
        await audioRecorderPlayer.stopPlayer();
        setPlayingRecordedId(null);
      }
      await audioRecorderPlayer.startPlayer(voiceFileUrl);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.current_position >= e.duration) {
          audioRecorderPlayer.stopPlayer();
          setPlayingVoiceId(null);
        }
      });
      setPlayingVoiceId(id);
    }
  };

  const onPlayRecorded = async (filePath, id) => {
    if (!filePath) return;
    if (playingRecordedId === id) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setPlayingRecordedId(null);
    } else {
      if (playingVoiceId) {
        await audioRecorderPlayer.stopPlayer();
        setPlayingVoiceId(null);
      }
      await audioRecorderPlayer.startPlayer(filePath);
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.current_position >= e.duration) {
          audioRecorderPlayer.stopPlayer();
          setPlayingRecordedId(null);
        }
      });
      setPlayingRecordedId(id);
    }
  };

  const onStartRecord = async (id) => {
    try {
      if (playingVoiceId || playingRecordedId) {
        await audioRecorderPlayer.stopPlayer();
        audioRecorderPlayer.removePlayBackListener();
        setPlayingVoiceId(null);
        setPlayingRecordedId(null);
      }
      const result = await audioRecorderPlayer.startRecorder();
      setRecordingId(id);
      setRecordedFilePaths(prev => ({ ...prev, [id]: null }));
      console.log('Recording started:', result);
    } catch (error) {
      console.error('Record start error:', error);
    }
  };

  const onStopRecord = async (id) => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordingId(null);
      setRecordedFilePaths(prev => ({ ...prev, [id]: result }));
      console.log('Recording stopped, file saved at:', result);
    } catch (error) {
      console.error('Record stop error:', error);
    }
  };

  const renderItem = ({ item }) => {
    const id = item._id ?? item.id?.toString() ?? Math.random().toString();
    const isResponded = responses[id];
    const isPlayingVoice = playingVoiceId === id;
    const isPlayingRecorded = playingRecordedId === id;
    const isRecording = recordingId === id;
    const recordedFilePathForItem = recordedFilePaths[id];

    return (
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <Text style={styles.chapter}>{item.chapterNo}</Text>
          <Text style={styles.page}>Page No: {item.pageNo}</Text>
        </View>

        <Text style={styles.audioText}>{item.audioText}</Text>

        <View style={styles.userRow}>
          <Text style={styles.user}>{item.userDetail?.firstName} {item.userDetail?.lastName}</Text>
          <Text style={styles.status}>{item.status}</Text>
        </View>

        <Text style={styles.info}>Language: {item.language}</Text>

        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={[styles.button, styles.playButton]}
            onPress={() => onStartPlayVoice(item.voiceFile, id)}
            disabled={!item.voiceFile}
          >
            <Text style={styles.buttonText}>{isPlayingVoice ? 'Stop' : 'Play Original'}</Text>
          </TouchableOpacity>

          {/* {isRecording ? (
            <TouchableOpacity
              style={[styles.button, styles.recordButton]}
              onPress={() => onStopRecord(id)}
            >
              <Text style={styles.buttonText}>Stop Recording</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.recordButton]}
              onPress={() => onStartRecord(id)}
            >
              <Text style={styles.buttonText}>Start Recording</Text>
            </TouchableOpacity>
          )} */}








          

          {!isResponded && (
            <TouchableOpacity
              style={[styles.button, styles.respondButton]}
              onPress={() => handleRespond(id)}
            >
              <Text style={styles.buttonText}>Respond</Text>
            </TouchableOpacity>
          )}
        </View>

        {recordedFilePathForItem && !isRecording && (
          <View style={styles.playRecordedContainer}>
            <TouchableOpacity
              style={[styles.button, styles.playRecordedButton]}
              onPress={() => onPlayRecorded(recordedFilePathForItem, id)}
            >
              <Text style={styles.buttonText}>{isPlayingRecorded ? 'Stop Recorded' : 'Play Recorded'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {isResponded && (
          <View style={styles.respondedTag}>
            <Text style={styles.respondedText}>Responded</Text>
          </View>
        )}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6c8029" />
      </View>
    );
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Recitations</Text>
      {recitations[0]?.message === 'No recitations found for this student' ? (
        <Text style={styles.emptyText}>No recitations found</Text>
      ) : (
        <FlatList
          data={[...recitations].reverse()}
          keyExtractor={(item) => item._id ?? item.id?.toString() ?? Math.random().toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshing={loading}
          onRefresh={refreshData}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  chapter: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2a2a2a',
  },
  page: {
    fontSize: 14,
    fontWeight: '600',
    color: '#777',
  },
  audioText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginBottom: 14,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  user: {
    fontSize: 15,
    fontWeight: '600',
    color: '#555',
  },
  status: {
    fontSize: 15,
    fontWeight: '600',
    color: '#4caf50',
  },
  info: {
    fontSize: 13,
    fontWeight: '400',
    color: '#888',
    marginBottom: 16,
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
  },
  button: {
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 20,
    minWidth: 120,
    alignItems: 'center',
    marginRight: 12,
    marginBottom: 8,
  },
  playButton: {
    backgroundColor: '#4caf50',
  },
  playRecordedButton: {
    backgroundColor: '#388e3c',
  },
  recordButton: {
    backgroundColor: '#e53935',
  },
  respondButton: {
    backgroundColor: '#283593',
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 15,
  },
  playRecordedContainer: {
    marginTop: 14,
    alignItems: 'center',
  },
  respondedTag: {
    marginTop: 14,
    backgroundColor: '#dcedc8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 18,
    alignSelf: 'flex-start',
  },
  respondedText: {
    fontWeight: '700',
    color: '#558b2f',
    fontSize: 14,
  },
  emptyText: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#999',
    marginTop: 40,
    textAlign: 'center',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default RecitationList;
