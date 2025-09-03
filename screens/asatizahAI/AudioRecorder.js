import React, { forwardRef, useImperativeHandle, useState } from "react";
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import RNFS from "react-native-fs";
import { useSelector } from "react-redux";

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioRecorderUI = forwardRef(({ description, setDescription, chapterNo, pageNo }, ref) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordPath, setRecordPath] = useState("");

  const data = useSelector((state) => state.auth);
  const { user, token } = data || {};

  useImperativeHandle(ref, () => ({
    hasRecording: () => !!recordPath,
    sendAudioWithText: onSendPress,
  }));

  const requireRegistrationAlert = () => {
    Alert.alert("Restricted", "Registration is required to use this service.");
  };

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      try {
        const grants = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        ]);
        const granted = grants[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] === PermissionsAndroid.RESULTS.GRANTED;
        if (!granted) {
          Alert.alert("Permission Denied", "Microphone permission is required");
          return false;
        }
        return true;
      } catch (e) {
        Alert.alert("Permission error", e.message);
        return false;
      }
    } else {
      return true;
    }
  };

  const buildPath = async () => {
    const timestamp = Date.now();
    let basePath;
    if (Platform.OS === "android") {
      basePath = RNFS.ExternalDirectoryPath || RNFS.DocumentDirectoryPath;
    } else {
      basePath = RNFS.DocumentDirectoryPath;
    }
    const recordingsDir = `${basePath}/recordings`;
    const exists = await RNFS.exists(recordingsDir);
    if (!exists) await RNFS.mkdir(recordingsDir);
    const fileName = Platform.OS === "android" ? `audio-${timestamp}.aac` : `audio-${timestamp}.m4a`;
    return `${recordingsDir}/${fileName}`;
  };

  const startRecording = async () => {
    try {
      await audioRecorderPlayer.stopRecorder().catch(() => {});
      audioRecorderPlayer.removeRecordBackListener();

      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      const path = await buildPath();
      audioRecorderPlayer.addRecordBackListener(() => {});
      const result = await audioRecorderPlayer.startRecorder(path);
      setRecordPath(result || path);
      setIsRecording(true);
    } catch (error) {
      Alert.alert("Recording Error", error.message);
    }
  };

  const stopRecording = async () => {
    try {
      await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      setIsRecording(false);
    } catch (error) {
      Alert.alert("Stop Recording Error", error.message);
    }
  };

  const startPlaying = async () => {
    try {
      if (!recordPath) {
        Alert.alert("No recording found");
        return;
      }
      audioRecorderPlayer.addPlayBackListener((e) => {
        if (e.currentPosition >= e.duration && e.duration > 0) {
          setIsPlaying(false);
          audioRecorderPlayer.removePlayBackListener();
        }
      });
      await audioRecorderPlayer.startPlayer(recordPath);
      setIsPlaying(true);
    } catch (error) {
      Alert.alert("Playback Error", error.message);
    }
  };

  const stopPlaying = async () => {
    try {
      await audioRecorderPlayer.stopPlayer();
      audioRecorderPlayer.removePlayBackListener();
      setIsPlaying(false);
    } catch (error) {
      Alert.alert("Stop Play Error", error.message);
    }
  };

  const onMicPress = () => {
    if (isRecording) stopRecording();
    else startRecording();
  };

  const onListenPress = () => {
    if (isPlaying) stopPlaying();
    else startPlaying();
  };

  // Updated to return success/failure for parent coordination
  const onSendPress = async (cNo = chapterNo, pNo = pageNo) => {
    if (!cNo || !pNo || (!description.trim() && !recordPath)) {
      Alert.alert("Empty", "Please add all fields before sending.");
      return false;
    }

    if (user?.role === "guest") {
      requireRegistrationAlert();
      return false;
    }

    try {
      const formData = new FormData();
      formData.append("chapterNo", cNo);
      formData.append("pageNo", pNo);
      formData.append("audioText", description);

      if (recordPath) {
        const fileExists = await RNFS.exists(recordPath);
        if (fileExists) {
          const filename = recordPath.split("/").pop();
          const mimeType = Platform.OS === "android" ? "audio/aac" : "audio/m4a";

          formData.append("voiceFile", {
            uri: recordPath.startsWith("file://") ? recordPath : "file://" + recordPath,
            type: mimeType,
            name: filename,
          });
        }
      }

      const response = await fetch("http://31.97.206.49:3001/api/quran/student/upload-Quran-voice", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const textResult = await response.text();
      let result;
      try {
        result = JSON.parse(textResult);
      } catch {
        result = { success: false, message: textResult };
      }

      if (
        result.success ||
        (result.message && result.message.toLowerCase().includes("uploaded successfully"))
      ) {
        Alert.alert("Success", result.message || "Upload complete");
        setDescription("");
        setRecordPath("");
        return true; // indicate success
      } else {
        Alert.alert("Error", result.message || "Upload failed");
        return false;
      }
    } catch (error) {
      Alert.alert("Network Error", error.message || JSON.stringify(error));
      return false;
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.descriptionLabel}>Remark</Text>
      <TextInput
        style={styles.input}
        placeholder="Type a message"
        value={description}
        onChangeText={setDescription}
        multiline
        placeholderTextColor="#666"
      />

      <View style={styles.inputRow}>
        <TouchableOpacity
          style={[styles.button, isRecording && styles.recordingButton]}
          onPress={onMicPress}
          activeOpacity={0.7}
        >
          <Text style={styles.icon}>{isRecording ? "🎙️" : "🎤"}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, isPlaying && styles.playingButton]}
          onPress={onListenPress}
          activeOpacity={0.7}
          disabled={!recordPath}
        >
          <Text style={styles.icon}>{isPlaying ? "⏸️" : "▶️"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  wrapper: {
    padding: 16,
    backgroundColor: "#fafaf5",
    borderTopWidth: 1,
    borderColor: "#d6d8c7",
    marginTop: 14,
    borderRadius: 12,
    shadowColor: "#a2ac7a",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  descriptionLabel: {
    fontWeight: "700",
    fontSize: 16,
    marginBottom: 10,
    color: "#6c8029",
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 32,
    shadowColor: "#a2ac7a",
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 7,
    elevation: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  input: {
    flex: 1,
    backgroundColor: "transparent",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: "#484848",
    fontWeight: "600",
    minHeight: 44,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#e1ebb5",
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 14,
    borderWidth: 1,
    borderColor: "#a1b050",
  },
  recordingButton: {
    backgroundColor: "red",
    borderColor: "#4b6319",
  },
  playingButton: {
    backgroundColor: "#8ca04d",
    borderColor: "#5a7f1b",
  },
  icon: {
    fontSize: 28,
    color: "#f0f6db",
  },
});

export default AudioRecorderUI;
