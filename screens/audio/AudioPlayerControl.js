import React, { useState, useEffect, useRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  AppState,
  Platform,
  Image
} from 'react-native';
import Sound from 'react-native-sound';
import MusicIcon from 'react-native-vector-icons/Fontisto';
import BackgroundService from 'react-native-background-actions';
import PlayImage from "../../assets/images/Quran/play.png"
import PauseImage from "../../assets/images/Quran/puase.png"
const NAVIGATIONBAR_HEIGHT = Platform.OS === 'android' ? 48 : 0; // Estimated navigation bar height

Sound.setCategory('Playback');

const AudioPlayerControl = ({
  audioUrl,
  playbackSpeed,
  setIsPlaying,
  isPlaying,
  setCurrentLanguage,
  currentLanguage,
  ref,
  isPlayingTitle,
  onSurahEnd,
  isCurrentIndex,
  isLastIndex,
  onPrevTrack,
  onNextTrack,
  prevNextPlay,
  setPrevNextPlay,
}) => {
console.log(isCurrentIndex,'isCurrentIndex check')
  const [duration, setDuration] = useState(100);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackTitle, setTrackTitle] = useState('Quran Audio - Al-Afasy');
  const soundRef = useRef(null);
  const timerRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);

  const backgroundOptions = {
    taskName: 'Audio Playback',
    taskTitle: trackTitle,
    taskDesc: 'Playing audio in background',
    taskIcon: {
      name: 'ic_launcher',
      type: 'mipmap',
    },
    color: '#00adef',
    linkingURI: 'yourapp://audio',
    parameters: {
      audioUrl,
    },
  };

  const backgroundTask = async (taskData) => {
    await new Promise(async (resolve) => {
      const { delay } = taskData;

      while (BackgroundService.isRunning()) {
        await new Promise(r => setTimeout(r, 1000));
      }

      resolve();
    });
  };

  useEffect(() => {
    if (soundRef.current) {
      stopAndReleaseSound();
    }

    const sound = new Sound(audioUrl, null, (error) => {
      console.log("quran list 11")
      if (error) {
        return;
      }

      soundRef.current = sound;
      setDuration(sound.getDuration());
    });

    return () => {
      stopAndReleaseSound();
    };
  }, [audioUrl]);

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        if (isPlaying) {
          startProgressTracking();

        }
      } else if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        if (isPlaying) {
          // startBackgroundService();
             handlePlayPause();
          
        }
      }
      appStateRef.current = nextAppState;
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };
  }, [isPlaying]);


// useEffect(() => {
//   const handleAppStateChange = (nextAppState) => {
//     if (
//       appStateRef.current === 'active' &&
//       nextAppState.match(/inactive|background/)
//     ) {
//       // App going to background → Pause audio
//       if (isPlaying) {
//         handlePlayPause(); // ⛔ Pauses and clears timer
//       }
//     }
//     appStateRef.current = nextAppState;
//   };

//   const subscription = AppState.addEventListener('change', handleAppStateChange);
//   return () => subscription.remove();
// }, [isPlaying]);


  const startBackgroundService = async () => {
    if (!BackgroundService.isRunning()) {
      try {
        await BackgroundService.start(backgroundTask, backgroundOptions);
      } catch (error) {
        console.error('Error starting background service:', error);
      }
    }
  };

  const stopBackgroundService = async () => {
    if (BackgroundService.isRunning()) {
      try {
        await BackgroundService.stop();
      } catch (error) {
        console.error('Error stopping background service:', error);
      }
    }
  };

  const stopAndReleaseSound = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (soundRef.current) {
      soundRef.current.stop();
      soundRef.current.release();
      soundRef.current = null;
    }
    stopBackgroundService();
  };

  const startProgressTracking = () => {
    if (timerRef.current) {

      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      if (soundRef.current) {
        soundRef.current.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
          if (seconds >= duration) {
            console.log(';chekc the seconds')
            handlePlayPause();
          }
        });
      }
    }, 1000);

  };


  // Handle play/pause
  const handlePlayPause = (currentPlay) => {

    if (!soundRef.current) return;

    if (isPlaying && (!prevNextPlay || currentPlay)) {
      // Pause
      soundRef.current.pause();
      clearInterval(timerRef.current);
      timerRef.current = null;
      stopBackgroundService();
      setIsPlaying(false);
    } else {
      soundRef.current.play((success) => {
        if (!success) {
          console.log('Playback failed due to audio decoding errors');
        }
        onSurahEnd();
        // Reset on completion
        setIsPlaying(false);
        setCurrentTime(0);
        clearInterval(timerRef.current);
        timerRef.current = null;
        stopBackgroundService();
      });

      startProgressTracking();

      if (appStateRef.current.match(/inactive|background/)) {
        startBackgroundService();
      }

      setIsPlaying(true);
    }
  };
  useImperativeHandle(ref, () => ({
    playPause: handlePlayPause,

  }));

  return (
    <View >
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            {
              width: `${(currentTime / duration) * 100}%`,
            },
          ]}
        />
      </View>
      {isPlayingTitle && <View style={styles.titleView} >
        <Text style={styles.playtitleText}>{isPlayingTitle}</Text>
      </View>}
      <View style={styles.playerContainer}>
        <View style={styles.playerControls}>
          <TouchableOpacity style={styles.prevButton}
            disabled={isCurrentIndex <= 1}
            onPress={onPrevTrack}
          >
            <MusicIcon name="step-backwrad" size={20} color={isCurrentIndex <= 1 ? "rgba(255, 255, 255, 0.3)" : "#FFF"} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.mainPlayButton}
            onPress={()=>{
              setPrevNextPlay
             handlePlayPause("current Play")
             }}>
            {/* <MusicIcon name={isPlaying ? "pause" : "play"} size={20} color="#FFF" /> */}
      
   {isPlaying?<Image source={PauseImage} style={{ width: 59, height: 59,}} />:<Image source={PlayImage} style={{ width: 59, height: 59,}} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.nextButton}
          disabled={isCurrentIndex===isLastIndex}
            onPress={onNextTrack}
          >
            <MusicIcon name="step-forward" size={20} color={isCurrentIndex === isLastIndex ? "rgba(255, 255, 255, 0.3)" : "#FFF"} />
          </TouchableOpacity>
        </View>

        {/* <TouchableOpacity isCurrentIndex,onPrevTrack, onNextTrack 
                    style={styles.languageButton}
                    onPress={() => {
                      setCurrentLanguage(
                        currentLanguage === 'Arabic' ? 'English' : 'Arabic',
                      );
                    }}>
                    <Text style={styles.languageText}>{currentLanguage}</Text>
                  </TouchableOpacity> */}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playButton: {
    marginRight: 28,
  },
  playCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 16,
    color: '#666666',
  },
  favoriteButton: {
    padding: 5,
  },
  favoriteIcon: {
    fontSize: 28,
    color: '#1a237e',
  },
  activeFavorite: {
    color: '#1a237e',
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: '#3BC47D',
    width: '25%',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3BC47D',
  },
  speedButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  speedText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
  playbackControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previousButton: {
    padding: 10,
  },
  previousIcon: {
    color: '#ffffff',
    fontSize: 16,
  },
  playerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#191967',
    paddingVertical: 15,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS==="android"?NAVIGATIONBAR_HEIGHT*1.2:0,
  },
  playbackSpeedButton: {
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playbackSpeedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '400',
    width: 40,
  },
  playerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  prevButton: {
    padding: 10,
  },
  prevIcon: {
    color: '#fff',
    fontSize: 18,
  },
  mainPlayButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignSelf:'center',
    backgroundColor: '#3BC47D',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  mainPlayIcon: {
    color: '#fff',
    fontSize: 24,
  },
  nextButton: {
    padding: 10,
  },
  nextIcon: {
    color: '#fff',
    fontSize: 18,
  },
  languageButton: {
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  languageText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '400',
    width: 70,
    textAlign: 'right',
  },
  progressContainer: {
    height: 5,
    backgroundColor: '#DDE2EB',
    borderRadius: 6,
    // marginBottom: 12,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3BC47D',
    borderRadius: 6,
  },
  titleView: { backgroundColor: '#191967', paddingTop: 16 },
  playtitleText: { fontSize: 18, fontWeight: 500, color: '#FFFFFF', width: '100%', textAlign: 'center' }
});

export default AudioPlayerControl;