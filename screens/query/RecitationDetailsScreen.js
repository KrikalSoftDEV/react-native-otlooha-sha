import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecitationDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;

  // Audio playback states - separate for each audio type
  const [playingAudio, setPlayingAudio] = useState(null); // Track which audio is playing
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  const [teacherResponse, setTeacherResponse] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDesc, setReportDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showRecordModal, setShowRecordModal] = useState(false);

  const authData = useSelector(state => state.auth);
  const { token } = authData || {};
  const { voiceId } = item || {};

  const [allowRecord, setAllowRecord] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedFile, setRecordedFile] = useState(null);

  const [description, setDescription] = useState('');
  const [surahName, setSurahName] = useState(item.chapterNo || '');
  const [lineNo, setLineNo] = useState(item.pageNo || '');

  // Combined chat data
  const [combinedChat, setCombinedChat] = useState([]);

  const fetchResponses = async () => {
    if (!voiceId) return;
    try {
      const res = await fetch(
        `http://31.97.206.49:3001/api/student/get/recitation/responses?voiceId=${voiceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();

      setTeacherResponse(
        json.data && json.data.length > 0 ? json.data[0] : null
      );
    } catch (err) {
      console.error('Error fetching responses:', err);
    }
  };

  // Prepare combined conversation data
  useEffect(() => {
    fetchResponses();
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, [voiceId, token]);

  useEffect(() => {
    // Combine student and teacher arrays into a conversation-like format
    if (item) {
      const studentTexts = item.audioText || [];
      const studentAudios = item.voiceFile || [];
      const teacherTexts = teacherResponse?.teachertextSuggestion || [];
      const teacherAudios = teacherResponse?.teacherVoiceSuggestion || [];

      const maxLength = Math.max(
        studentTexts.length,
        studentAudios.length,
        teacherTexts.length,
        teacherAudios.length
      );

      const combined = [];
      for (let i = 0; i < maxLength; i++) {
        combined.push({
          studentText: studentTexts[i] || '',
          studentAudio: Array.isArray(studentAudios) ? studentAudios[i] : (i === 0 ? studentAudios : null),
          teacherText: teacherTexts[i] || '',
          teacherAudio: teacherAudios[i] || null,
          index: i
        });
      }
      setCombinedChat(combined);
    }
  }, [item, teacherResponse]);

  // Generic audio playback function (unchanged)
  const playAudio = async (url, audioId) => {
    if (!url) {
      console.log('No URL provided for audio');
      return;
    }

    console.log('Playing audio:', url, 'ID:', audioId);

    if (playingAudio === audioId) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setPlayingAudio(null);
      setCurrentPosition(0);
      return;
    }

    if (playingAudio) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    }

    try {
      const { fs, config } = RNFetchBlob;
      const fileExtension = url.includes('.mp3') ? 'mp3' : 'aac';
      const path = `${fs.dirs.CacheDir}/audio_${audioId}_${Date.now()}.${fileExtension}`;
      console.log('Downloading to path:', path);
      await config({ fileCache: true, path }).fetch('GET', url);
      console.log('Starting player for path:', path);
      await audioRecorderPlayer.startPlayer(path);
      setPlayingAudio(audioId);
      audioRecorderPlayer.addPlayBackListener(e => {
        setCurrentPosition(e.currentPosition);
        setDuration(e.duration);
        if (e.currentPosition >= e.duration && e.duration > 0) {
          audioRecorderPlayer.stopPlayer();
          setPlayingAudio(null);
          setCurrentPosition(0);
        }
      });
      console.log('Audio playback started successfully');
    } catch (err) {
      console.error('Play error:', err);
      Alert.alert('Error', 'Could not play audio file');
    }
  };

  // Download audio function (unchanged)
  const downloadAudio = async (url, filename) => {
    if (!url) {
      console.log('No URL provided for download');
      Alert.alert('Error', 'No audio URL available');
      return;
    }
    console.log('Downloading audio:', url, 'as:', filename);
    try {
      const { fs, config } = RNFetchBlob;
      const fileExtension = url.includes('.mp3') ? 'mp3' : 'aac';
      const path = `${fs.dirs.DownloadDir}/${filename}.${fileExtension}`;
      console.log('Download path:', path);
      const response = await config({
        fileCache: true,
        path: path,
        addAndroidDownloads: {
          useDownloadManager: true,
          notification: true,
          path: path,
          description: 'Downloading audio file...'
        }
      }).fetch('GET', url);
      console.log('Download completed:', response.path());
      Alert.alert('Download Complete', `Audio downloaded successfully to: ${path}`);
    } catch (err) {
      console.error('Download error:', err);
      Alert.alert('Download Error', 'Could not download the audio file');
    }
  };

  // Report submission function added here:
  const submitReport = async () => {
    if (!reportDesc.trim()) {
      Alert.alert('Validation', 'Please enter a description.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(
        'http://31.97.206.49:3001/api/quran/report/by-teacher_student',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            voiceId: voiceId,
            reported: true,
            description: reportDesc,
          }),
        }
      );
      const json = await res.json();
      setSubmitting(false);
      setShowReportModal(false);
      setReportDesc('');
      Alert.alert(
        'Report Submitted',
        json.message || 'Your report was submitted for review.'
      );
    } catch (e) {
      setSubmitting(false);
      Alert.alert('Error', 'Could not submit report. Try again.');
    }
  };

  const handleReRecord = () => {
    setShowRecordModal(true);
  };

  const handleClose = () => {
    Alert.alert('The Query has been closed !!');
  };

  // Recording and playing handlers (unchanged)
  const startRecording = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      const result = await audioRecorderPlayer.startRecorder();
      setRecordedFile(null);
      setIsRecording(true);
      audioRecorderPlayer.addRecordBackListener(() => {});
    } catch (e) {
      console.error('startRecording error', e);
    }
  };

  const stopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setRecordedFile(result);
      setIsRecording(false);
    } catch (e) {
      console.error('stopRecording error', e);
    }
  };

  const toggleRecording = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const startPlaying = async () => {
    if (!recordedFile) return;
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();

      await audioRecorderPlayer.startPlayer(recordedFile);
      setPlayingAudio('recorded');
      audioRecorderPlayer.addPlayBackListener(e => {
        if (e.currentPosition >= e.duration) {
          stopPlaying();
        }
      });
    } catch (e) {
      console.error('startPlaying error', e);
    }
  };

  const stopPlaying = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setPlayingAudio(null);
    } catch (e) {
      console.error('stopPlaying error', e);
    }
  };

  const togglePlaying = () => {
    if (playingAudio === 'recorded') stopPlaying();
    else startPlaying();
  };

  // Resend handler (unchanged)
  const onReSendRecition = async () => {
    if (
      !item.chapterNo.trim() ||
      (!description.trim() && !recordedFile)
    ) {
      Alert.alert(
        'Validation',
        'Please fill Surah name, Line number, and enter text or record audio before resending.'
      );
      return;
    }
    try {
      const formData = new FormData();
      formData.append('chapterNo', item.chapterNo);
      formData.append('pageNo', item.pageNo);
      formData.append('audioText', description);
      formData.append('voiceId', item.voiceId);

      if (recordedFile) {
        const filename = recordedFile.split('/').pop();
        const mimeType = Platform.OS === 'android' ? 'audio/aac' : 'audio/m4a';
        formData.append('voiceFile', {
          uri: recordedFile.startsWith('file://') ? recordedFile : 'file://' + recordedFile,
          type: mimeType,
          name: filename,
        });
      }

      const response = await fetch(
        'http://31.97.206.49:3001/api/quran/student/upload-Quran-voice',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const textResult = await response.text();
      let result;
      try {
        result = JSON.parse(textResult);
      } catch {
        result = { success: false, message: textResult };
      }

      if (
        result.success ||
        (result.message && result.message.toLowerCase().includes('uploaded successfully'))
      ) {
        setSurahName('');
        setLineNo('');
        setDescription('');
        setRecordedFile(null);
        setShowRecordModal(false);
        Alert.alert('Success', result.message || 'Upload complete');
        setTimeout(() => {
          fetchResponses();
        }, 1000);
      } else {
        Alert.alert('Error', result.message || 'Resend failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Network error. Please try again.');
    }
  };

  // Render each exchange in conversation style (unchanged)
 const renderChatItem = ({ item: chatItem, index }) => (
  <View key={index} style={{ marginBottom: 24, paddingHorizontal: 16 }}>
    {/* Student Block */}
    <View style={styles.studentContainer}>
      <View style={styles.messageHeader}>
        <Text style={styles.messageTitle}>Student #{chatItem.index + 1}</Text>
      </View>
      {chatItem.studentText ? (
        <Text style={styles.studentText}>{chatItem.studentText}</Text>
      ) : null}
      {chatItem.studentAudio ? (
        <View style={styles.audioButtonsContainer}>
          <TouchableOpacity 
            onPress={() => playAudio(chatItem.studentAudio, `student_${chatItem.index}`)} 
            style={styles.playButton}>
            <Text style={styles.playButtonText}>
              {playingAudio === `student_${chatItem.index}` ? '⏸ Stop' : '▶ Play'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => downloadAudio(chatItem.studentAudio, `student_${chatItem.index + 1}`)} 
            style={styles.downloadButton}>
            <Text style={styles.downloadButtonText}>⬇️ Download</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>

    {/* Teacher Block */}
    {(chatItem.teacherText || chatItem.teacherAudio) && (
      <View style={styles.teacherContainer}>
        <View style={[styles.messageHeader, {justifyContent: 'space-between', alignItems:'center'}]}>
          <Text style={styles.messageTitle}>Teacher #{chatItem.index + 1}</Text>
          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => setShowReportModal(true)}
          >
            <Text style={styles.reportButtonText}>Report</Text>
          </TouchableOpacity>
        </View>
        {chatItem.teacherText ? (
          <Text style={styles.teacherText}>{chatItem.teacherText}</Text>
        ) : null}
        {chatItem.teacherAudio ? (
          <View style={styles.audioButtonsContainer}>
            <TouchableOpacity 
              onPress={() => playAudio(chatItem.teacherAudio, `teacher_${chatItem.index}`)} 
              style={styles.playButton}>
              <Text style={styles.playButtonText}>
                {playingAudio === `teacher_${chatItem.index}` ? '⏸ Stop' : '▶ Play'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => downloadAudio(chatItem.teacherAudio, `teacher_${chatItem.index + 1}`)} 
              style={styles.downloadButton}>
              <Text style={styles.downloadButtonText}>⬇️ Download</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    )}
  </View>
);


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{item.chapterNo}</Text>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>⋮</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 80 }}
        data={combinedChat}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={renderChatItem}
        showsVerticalScrollIndicator={false}
      />

      {/* --- Report Modal --- */}
      <Modal
        animationType="slide"
        visible={showReportModal}
        transparent
        onRequestClose={() => setShowReportModal(false)}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          style={styles.modalWrap}>
          <View style={styles.modalCard}>
            <View style={{ alignItems: 'center', marginBottom: 7 }}>
              <View style={styles.modalHandle} />
            </View>
            <Text style={styles.modalTitle}>Report an Issue with Teacher</Text>
            <Text style={styles.modalDesc}>
              Please let us know the reason for your report. Your feedback helps us keep the learning environment safe and respectful.
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Add Description"
              value={reportDesc}
              onChangeText={setReportDesc}
              multiline
              numberOfLines={4}
              editable={!submitting}
            />
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#254F38' }]}
              onPress={submitReport}
              disabled={submitting}>
              {submitting ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.modalButtonText}>Submit Report</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, { backgroundColor: '#fff', borderWidth: 0 }]}
              onPress={() => setShowReportModal(false)}
              disabled={submitting}>
              <Text style={[styles.modalButtonText, { color: '#244E36' }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* --- Buttons for Re-record and Close --- */}
      <View style={styles.bottomButtonRow}>
        <TouchableOpacity style={styles.reRecordButton} onPress={handleReRecord}>
          <Text style={styles.bottomButtonText}>Re-Record</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.closeButton} onPress={handleClose}>
          <Text style={styles.bottomButtonText}>Close</Text>
        </TouchableOpacity>
      </View>

     
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: { padding: 8 },
  backText: { fontSize: 24, color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  menuButton: { padding: 8 },
  menuText: { fontSize: 20, color: '#333' },
  content: { flex: 1 },

  studentContainer: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
    alignSelf: 'flex-start',
    maxWidth: '85%',
  },
  teacherContainer: {
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 12,
    marginLeft: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
    alignSelf: 'flex-end',
    maxWidth: '85%',
  },
  messageHeader: {
    marginBottom: 8,
  },
  messageTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
  },
  studentText: {
    color: '#333',
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 20,
  },
  teacherText: {
    color: '#333',
    marginBottom: 10,
    fontSize: 15,
    lineHeight: 20,
  },
  audioButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  playButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  downloadButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E7B51',
    backgroundColor: '#FFFFFF',
  },
  downloadButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E7B51',
  },

  modalWrap: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(52,52,52,0.33)',
  },
  modalCard: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 23,
    borderTopRightRadius: 23,
    paddingTop: 13,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  modalHandle: {
    width: 38,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E4E6ED',
    marginTop: 7,
    marginBottom: 13,
  },
  modalTitle: {
    fontWeight: '700',
    color: '#111',
    fontSize: 18,
    marginBottom: 7,
  },
  modalDesc: {
    color: '#415057',
    fontSize: 14,
    marginBottom: 13,
  },
  input: {
    minHeight: 85,
    borderRadius: 9,
    borderWidth: 1.25,
    borderColor: '#DFDFDF',
    backgroundColor: '#FAFAFA',
    textAlignVertical: 'top',
    paddingHorizontal: 15,
    paddingVertical: 7,
    fontSize: 15,
    marginBottom: 12,
  },
  modalButton: {
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 8,
  },
  modalButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  bottomButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
  },
  reRecordButton: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1.5,
    borderColor: '#269658',
    borderRadius: 6,
    backgroundColor: '#fff',
    paddingVertical: 14,
    alignItems: 'center',
  },
  closeButton: {
    flex: 1,
    marginLeft: 8,
    borderWidth: 1.5,
    borderColor: '#269658',
    borderRadius: 6,
    backgroundColor: '#fff',
    paddingVertical: 14,
    alignItems: 'center',
  },
  bottomButtonText: {
    color: '#269658',
    fontWeight: '700',
    fontSize: 16,
  },
  customRecordButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E6E6E6',
    borderWidth: 1.5,
    borderColor: '#269658',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },
  customRecordButtonActive: {
    backgroundColor: '#D32F2F',
    borderColor: '#B71C1C',
  },
  customRecordIcon: {
    fontSize: 28,
    color: '#269658',
  },
  customRecordIconActive: {
    color: '#FFCDD2',
  },
  customProgressBarBackground: {
    width: '60%',
    height: 6,
    backgroundColor: '#269658',
    borderRadius: 3,
    marginBottom: 24,
  },
  customProgressBarFill: {
    width: '100%',
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  customPlayButton: {
    width: '100%',
    backgroundColor: '#244E36',
    borderRadius: 12,
    paddingVertical: 16,
    marginBottom: 16,
    shadowColor: '#3e5c44',
    shadowOpacity: 0.75,
    shadowRadius: 5,
    elevation: 6,
  },
  customPlayButtonDisabled: {
    backgroundColor: '#A0A0A0',
  },
  customPlayButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.8,
  },
  customSendButton: {
    width: '100%',
    backgroundColor: '#1B5E20',
    paddingVertical: 18,
    borderRadius: 12,
    shadowColor: '#225522',
    shadowOpacity: 0.85,
    shadowRadius: 6,
    elevation: 10,
  },
  customSendButtonText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
    textAlign: 'center',
    letterSpacing: 2,
  },
  reportButton: {
  backgroundColor: '#FFE5E5',
  paddingVertical: 4,
  paddingHorizontal: 10,
  borderRadius: 12,
},
reportButtonText: {
  color: '#D32F2F',
  fontWeight: '700',
  fontSize: 13,
},


ratingText: {
    color: '#FFD700', // gold color
    fontSize: 14,
    fontWeight: '700',
    marginRight: 12,
  },
  reportButton: {
    backgroundColor: '#FFE5E5',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  reportButtonText: {
    color: '#D32F2F',
    fontWeight: '700',
    fontSize: 13,
  },

});

export default RecitationDetailsScreen;














