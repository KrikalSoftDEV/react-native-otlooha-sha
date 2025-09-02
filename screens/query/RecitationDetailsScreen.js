import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';
import { useSelector } from 'react-redux';
import RNFetchBlob from 'rn-fetch-blob';

const audioRecorderPlayer = new AudioRecorderPlayer();

const RecitationDetailsScreen = ({ route, navigation }) => {
  const { item } = route.params;
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  // Teacher audio playback state
  const [tIsPlaying, setTIsPlaying] = useState(false);
  const [tCurr, setTCurr] = useState(0);
  const [tDur, setTDur] = useState(0);

  const [teacherResponse, setTeacherResponse] = useState(null);

  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportDesc, setReportDesc] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const authData = useSelector((state) => state.auth);
  const { token } = authData || {};
  const { voiceId } = item || {};

  const fetchResponses = async () => {
    if (!voiceId) return;
    try {
      const res = await fetch(
        `http://31.97.206.49:3001/api/student/get/recitation/responses?voiceId=${voiceId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const json = await res.json();
      setTeacherResponse(json.data && json.data.length > 0 ? json.data[0] : null);
    } catch (err) {
      console.error('Error fetching responses:', err);
    }
  };

  useEffect(() => {
    fetchResponses();
    return () => {
      audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
    };
  }, []);

  // Student audio playback
  const playAudio = async (url) => {
    if (!url) return;
    if (isPlaying) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
      setCurrentPosition(0);
      return;
    }
    try {
      const { fs, config } = RNFetchBlob;
      const path = `${fs.dirs.CacheDir}/detail_play_user_${Math.random().toString(36).slice(2)}.aac`;
      await config({ fileCache: true, path }).fetch('GET', url);
      await audioRecorderPlayer.startPlayer(path);
      setIsPlaying(true);
      audioRecorderPlayer.addPlayBackListener(e => {
        setCurrentPosition(e.currentPosition);
        setDuration(e.duration);
        if (e.currentPosition >= e.duration && e.duration > 0) {
          audioRecorderPlayer.stopPlayer();
          setIsPlaying(false);
          setCurrentPosition(0);
        }
      });
    } catch (err) {
      console.error('Play error:', err);
    }
  };

  // Teacher audio playback
  const playTeacherAudio = async (url) => {
    if (!url) return;
    if (tIsPlaying) {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setTIsPlaying(false);
      setTCurr(0);
      return;
    }
    try {
      const { fs, config } = RNFetchBlob;
      const path = `${fs.dirs.CacheDir}/detail_play_teacher_${Math.random().toString(36).slice(2)}.mp3`;
      await config({ fileCache: true, path }).fetch('GET', url);
      await audioRecorderPlayer.startPlayer(path);
      setTIsPlaying(true);
      audioRecorderPlayer.addPlayBackListener(e => {
        setTCurr(e.currentPosition);
        setTDur(e.duration);
        if (e.currentPosition >= e.duration && e.duration > 0) {
          audioRecorderPlayer.stopPlayer();
          setTIsPlaying(false);
          setTCurr(0);
        }
      });
    } catch (err) {
      console.error('Play error:', err);
    }
  };

  // Download any audio URL with label
  const downloadAudio = async (url, label = '') => {
    if (!url) return;
    try {
      const { fs, config } = RNFetchBlob;
      const path = `${fs.dirs.DownloadDir}/recitation_${label || item._id}.aac`;
      await config({ fileCache: true, path }).fetch('GET', url);
      Alert.alert('Download Complete', `Audio downloaded to:\n${path}`);
    } catch (err) {
      Alert.alert('Download Error', 'Could not download the audio.');
      console.error('Download error:', err);
    }
  };

 




const submitReport = async () => {
  if (!reportDesc.trim()) {
    Alert.alert('Validation', 'Please enter a description.');
    return;
  }
  setSubmitting(true);
  try {
    const res = await fetch('http://31.97.206.49:3001/api/quran/report/by-teacher_student', {
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
    });
    const json = await res.json();
    setSubmitting(false);
    setShowReportModal(false);
    setReportDesc('');
    Alert.alert('Report Submitted', json.message || 'Your report was submitted for review.');
  } catch (e) {
    setSubmitting(false);
    Alert.alert('Error', 'Could not submit report. Try again.');
  }
};


  const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const audioTextStr = Array.isArray(item.audioText) ? item.audioText.join(' ') : item.audioText;
  const t = teacherResponse;
  const teacherName = t?.teacherDetail?.firstName
    ? `${t.teacherDetail.firstName}${t.teacherDetail.lastName ? ' ' + t.teacherDetail.lastName : ''}`
    : 'Teacher';
  const teacherAvatarText = (t?.teacherDetail?.firstName ? t.teacherDetail.firstName[0] : 'T').toUpperCase();

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

      <ScrollView style={styles.content}>
        <View style={styles.titleSection}>
          <Text style={styles.surahTitle}>{item.chapterNo}</Text>
          <Text style={styles.lineNumber}>Line No: {item.pageNo}</Text>
        </View>

        <Text style={styles.description}>{audioTextStr}</Text>

        {/* Student audio player */}
        <View style={styles.audioControls}>
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{formatTime(currentPosition)}</Text>
          </View>
          <View style={styles.controlButtons}>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlButtonText}>↻</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => {
                const url = Array.isArray(item.voiceFile) ? item.voiceFile[0] : item.voiceFile;
                playAudio(url);
              }}>
              <Text style={styles.playButtonText}>{isPlaying ? '⏸' : '▶'}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.controlButton}>
              <Text style={styles.controlButtonText}>↺</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.speedControl}>
            <Text style={styles.speedText}>1x</Text>
          </View>
        </View>
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill,
              { width: duration > 0 ? `${(currentPosition / duration) * 100}%` : '0%' }
            ]} />
          </View>
        </View>

        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => {
            const url = Array.isArray(item.voiceFile) ? item.voiceFile[0] : item.voiceFile;
            downloadAudio(url, 'student');
          }}>
          <Text style={styles.downloadButtonText}>
            ⬇️  Download
          </Text>
        </TouchableOpacity>

        {teacherResponse ? (
          <>
            <View style={styles.respondedCard}>
              <View style={styles.respondedHeaderRow}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>{teacherAvatarText}</Text>
                  </View>
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.respondedName}>{teacherName}</Text>
                    <Text style={styles.stars}>★★★★★</Text>
                  </View>
                </View>
                <TouchableOpacity style={styles.reportTag} onPress={() => setShowReportModal(true)}>
                  <Text style={styles.reportTagText}>Report</Text>
                </TouchableOpacity>
              </View>
              <Text style={styles.respondedDesc}>
                {Array.isArray(t.teachertextSuggestion) ? t.teachertextSuggestion[0] : ''}
              </Text>
              <Text style={styles.respondedDate}>
                📅 {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}
              </Text>
              {/* Teacher audio player matching student style */}
              {t.teacherVoiceSuggestion && t.teacherVoiceSuggestion.length > 0 &&
                <>
                  <View style={styles.audioControls}>
                    <View style={styles.timeDisplay}>
                      <Text style={styles.timeText}>{formatTime(tCurr)}</Text>
                    </View>
                    <View style={styles.controlButtons}>
                      <TouchableOpacity style={styles.controlButton}>
                        <Text style={styles.controlButtonText}>↻</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.playButton}
                        onPress={() => playTeacherAudio(t.teacherVoiceSuggestion[0])}
                      >
                        <Text style={styles.playButtonText}>{tIsPlaying ? '⏸' : '▶'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.controlButton}>
                        <Text style={styles.controlButtonText}>↺</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.speedControl}>
                      <Text style={styles.speedText}>1x</Text>
                    </View>
                  </View>
                  <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                      <View style={[
                        styles.progressFill,
                        { width: tDur > 0 ? `${(tCurr / tDur) * 100}%` : '0%' }
                      ]} />
                    </View>
                  </View>
                </>
              }
            </View>
            {t.teacherVoiceSuggestion && t.teacherVoiceSuggestion.length > 0 &&
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() => downloadAudio(t.teacherVoiceSuggestion[0], 'teacher')}
              >
                <Text style={styles.downloadButtonText}>
                  ⬇️  Download Teacher Audio
                </Text>
              </TouchableOpacity>
            }
          </>
        ) : null}

        {/* --- Report Modal --- */}
        <Modal
          animationType="slide"
          visible={showReportModal}
          transparent
          onRequestClose={() => setShowReportModal(false)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={styles.modalWrap}
          >
            <View style={styles.modalCard}>
              <View style={{alignItems:'center', marginBottom:7}}>
                <View style={styles.modalHandle}/>
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
                disabled={submitting}
              >
                {submitting
                  ? <ActivityIndicator color="#fff"/>
                  : <Text style={styles.modalButtonText}>Submit Report</Text>
                }
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#fff', borderWidth: 0 }]}
                onPress={() => setShowReportModal(false)}
                disabled={submitting}
              >
                <Text style={[styles.modalButtonText, { color: '#244E36' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E0E0E0' },
  backButton: { padding: 8 },
  backText: { fontSize: 24, color: '#333' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#333' },
  menuButton: { padding: 8 },
  menuText: { fontSize: 20, color: '#333' },
  content: { flex: 1, padding: 20 },
  titleSection: { marginBottom: 20 },
  surahTitle: { fontSize: 24, fontWeight: '700', color: '#333', marginBottom: 4 },
  lineNumber: { fontSize: 14, color: '#666' },
  description: { fontSize: 16, lineHeight: 24, color: '#333', marginBottom: 40 },
  audioControls: { alignItems: 'center', marginBottom: 20 },
  timeDisplay: { marginBottom: 20 },
  timeText: { fontSize: 16, color: '#666' },
  controlButtons: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  controlButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F5F5F5', justifyContent: 'center', alignItems: 'center', marginHorizontal: 15 },
  controlButtonText: { fontSize: 18, color: '#333' },
  playButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
  playButtonText: { fontSize: 24, color: '#FFFFFF' },
  speedControl: { marginTop: 10 },
  speedText: { fontSize: 14, color: '#666' },
  progressContainer: { marginBottom: 18 },
  progressBar: { height: 4, backgroundColor: '#E0E0E0', borderRadius: 2 },
  progressFill: { height: '100%', backgroundColor: '#4CAF50', borderRadius: 2 },
  downloadButton: {  paddingVertical: 15, paddingHorizontal: 20, borderRadius: 5, alignItems: 'center', borderWidth: 1, borderColor: '#1E7B51', marginBottom: 16, marginTop: 0 },
  downloadButtonText: { fontSize: 16, fontWeight: '600', color: '#1E7B51' },

  respondedCard: {
    marginTop: 5,
    marginBottom: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 8,
    elevation: 3,
  },
  respondedHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#388E3C',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  respondedName: { fontWeight: '700', fontSize: 15, color: '#283593' },
  stars: { color: '#FFD700', fontSize: 15, marginTop: 2 },
  reportTag: { backgroundColor: '#FFE5E5', paddingVertical: 4, paddingHorizontal: 14, borderRadius: 11 },
  reportTagText: { color: '#D32F2F', fontWeight: '700', fontSize: 13 },
  respondedDesc: { color: '#333', fontSize: 15, marginTop: 10, marginBottom: 2 },
  respondedDate: { fontSize: 13, color: '#1E7B51', marginTop: 4 },

  modalWrap: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(52,52,52,0.33)' },
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
});

export default RecitationDetailsScreen;
