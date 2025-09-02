import { TouchableOpacity, Image, Text, View, StyleSheet } from "react-native";
import Sound from "react-native-sound";
import AzanAudio1 from "../../assets/audios/azan1.mp3";
import AzanAudio2 from "../../assets/audios/azan2.mp3";
import React, { useRef, useState } from "react";
import { scale, verticalScale } from "react-native-size-matters";

Sound.setCategory("Playback");

const PrayerNotificationPreferences = ({
  notificationPreferences,
  selectedPreference,
  onSelectPreferences,
}) => {
  const soundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTone, setCurrentTone] = useState(null);

  const toggleAzan = (audioFile, toneLabel) => {
    // If same tone is playing → toggle pause/resume
    if (isPlaying && currentTone === toneLabel && soundRef.current) {
      soundRef.current.pause();
      setIsPlaying(false);
      return;
    }

    // If paused same tone → resume
    if (!isPlaying && currentTone === toneLabel && soundRef.current) {
      soundRef.current.play((success) => {
        if (!success) console.log("Playback failed");
        setIsPlaying(false);
        soundRef.current.release();
        soundRef.current = null;
      });
      setIsPlaying(true);
      return;
    }

    // Stop any existing sound
    if (soundRef.current) {
      soundRef.current.stop(() => {
        soundRef.current.release();
      });
      soundRef.current = null;
    }

    // Load and play new tone
    const sound = new Sound(audioFile, Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log("Failed to load sound", error);
        return;
      }
      sound.play((success) => {
        if (!success) console.log("Playback failed");
        setIsPlaying(false);
        sound.release();
        soundRef.current = null;
      });
      setIsPlaying(true);
      setCurrentTone(toneLabel);
    });

    soundRef.current = sound;
  };

  return (
    <>
      {notificationPreferences.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.preferenceItem}
          onPress={() => {
            onSelectPreferences(item.label);

            if (item.label === "Azan tone1") {
              toggleAzan(AzanAudio1, "Azan tone1");
            } else if (item.label === "Azan tone2") {
              toggleAzan(AzanAudio2, "Azan tone2");
            }
          }}
        >
          <Image source={item.Icon} style={styles.alarmIcon} />
          <Text style={styles.preferenceLabel}>{item.label}</Text>
          <View
            style={[
              styles.checkBox,
              {
                backgroundColor:
                  selectedPreference === item.label ? "#5756C8" : "#DDE2EB",
              },
            ]}
          >
            {selectedPreference === item.label && (
              <Image
                source={require("../../assets/images/PrayerTime/right-tick-icon.png")}
                style={styles.checkIcon}
              />
            )}
          </View>
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: verticalScale(15),
  },
  preferenceLabel: {
    flex: 1,
    fontSize: scale(16),
    color: "#181B1F",
    fontWeight: "400",
    marginLeft: scale(15),
  },
  checkBox: {
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
    marginLeft: scale(10),
  },
  alarmIcon: {
    width: scale(18),
    height: scale(18),
    resizeMode: "contain",
  },
  checkIcon: {
    width: 15,
    height: 15,
    resizeMode: "contain",
  },
});

export default PrayerNotificationPreferences;
