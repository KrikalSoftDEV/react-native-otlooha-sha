import React, { useLayoutEffect, useRef, useState } from "react";
import {
  Alert,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { WebView } from "react-native-webview";

import AudioRecorderUI from "./AudioRecorder";

const AsatizahAIScreen = () => {
  const webviewRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const [surahName, setSurahName] = useState("");
  const [lineNo, setLineNo] = useState("");
  const [description, setDescription] = useState("");

  const audioRecorderRef = useRef(null);

  const hideDivJS = `
    (function() {
      var classesToHide = ['NavbarBody_itemsContainer__l6N_R', 'Footer_flowItem__EOZsZ'];
      classesToHide.forEach(function(className){
        var elements = document.getElementsByClassName(className);
        for (var i = 0; i < elements.length; i++) {
          elements[i].style.display = 'none';
        }
      });
      true;
    })();
  `;

  useLayoutEffect(() => {
    if (loaded && webviewRef.current) {
      webviewRef.current.injectJavaScript(hideDivJS);
    }
  }, [loaded]);

  const onSendPress = async () => {
    if (
      !surahName.trim() ||
      !lineNo.trim() ||
      (!description.trim() && !audioRecorderRef.current?.hasRecording())
    ) {
      Alert.alert(
        "Validation",
        "Please fill Surah name, Line number, and enter text or record audio before sending."
      );
      return;
    }

    try {
      const success = await audioRecorderRef.current?.sendAudioWithText(
        surahName,
        lineNo,
        description
      );
      if (success) {
        // Clear all fields on success
        setSurahName("");
        setLineNo("");
        setDescription("");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send. Please try again.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, marginTop: 20 }}>
      <View style={{ flex: 1 }}>
        <WebView
          ref={webviewRef}
          source={{ uri: "https://app.quranflash.com/book/Warsh1?en#/reader/chapter/3" }}
          style={{ flex: 1 }}
          onLoadEnd={() => setLoaded(true)}
        />

        <TouchableOpacity
          style={styles.absoluteButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.absoluteButtonText}>Start Recitation</Text>
        </TouchableOpacity>

        <Modal
          transparent
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              {/* Close button top-right */}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeIconContainer}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.closeIconText}>✕</Text>
              </TouchableOpacity>

              <Text style={styles.label}>Recitation number</Text>
              <Text style={styles.recitationNumber}>1</Text>

              <Text style={styles.label}>Surah name</Text>
              <TextInput
                style={styles.input}
                value={surahName}
                onChangeText={setSurahName}
                placeholder="Surah name"
                placeholderTextColor="#999"
                returnKeyType="done"
              />

              <Text style={styles.label}>Line no</Text>
              <TextInput
                style={styles.input}
                value={lineNo}
                onChangeText={setLineNo}
                placeholder="Line number"
                keyboardType="numeric"
                placeholderTextColor="#999"
                returnKeyType="done"
              />

              <AudioRecorderUI
                ref={audioRecorderRef}
                description={description}
                setDescription={setDescription}
                chapterNo={3}
                pageNo={4}
              />

              <View style={styles.sendButtonContainer}>
                <TouchableOpacity style={styles.sendButton} onPress={onSendPress}>
                  <Text style={styles.sendButtonText}>Send</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  absoluteButton: {
    position: "absolute",
    top: 30,
    right: 25,
    backgroundColor: "#6c8029",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 28,
    zIndex: 100,
    elevation: 12,
  },
  absoluteButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 22,
    elevation: 5,
    position: "relative",
  },
  closeIconContainer: {
    position: "absolute",
    top: 12,
    right: 12,
    zIndex: 20,
  },
  closeIconText: {
    fontSize: 20,
    color: "#6c8029",
    fontWeight: "700",
  },
  label: {
    fontWeight: "600",
    fontSize: 14,
    marginTop: 12,
    marginBottom: 6,
    color: "#333",
  },
  recitationNumber: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 10,
    color: "#4b4b4b",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 11,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: "#333",
    backgroundColor: "#fafaf5",
  },
  sendButtonContainer: {
    marginTop: 25,
    alignItems: "center",
  },
  sendButton: {
    backgroundColor: "#6c8029",
    paddingVertical: 16,
    borderRadius: 28,
    width: "100%",
    elevation: 3,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 18,
    textAlign: "center",
  },
});

export default AsatizahAIScreen;
