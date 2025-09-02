import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  AppState,
  Platform,
} from 'react-native';
import Sound from 'react-native-sound';
// import { Ionicons } from '@expo/vector-icons';
import BackgroundService from 'react-native-background-actions';
import Slider from '@react-native-community/slider';

// Enable playback in silence mode (iOS only)
Sound.setCategory('Playback');

const AudioPlayer = ({ audioUrl = "" }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [trackTitle, setTrackTitle] = useState('Quran Audio - Al-Afasy');
  
  const soundRef = useRef(null);
  const timerRef = useRef(null);
  const appStateRef = useRef(AppState.currentState);
  
  // Format time function (convert seconds to mm:ss format)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Background task options
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

  // Background task function
  const backgroundTask = async (taskData) => {
    // Keep alive function that tracks and updates playback progress
    await new Promise(async (resolve) => {
      const { delay } = taskData;
      
      while (BackgroundService.isRunning()) {
        await new Promise(r => setTimeout(r, 1000));
      }
      
      resolve();
    });
  };

  // Initialize sound
  useEffect(() => {
    // Release previous sound if it exists
    if (soundRef.current) {
      stopAndReleaseSound();
    }
    
    setIsLoading(true);
    console.log('-=-==-=-=--audioUrl', audioUrl);
    
    // Initialize sound
    const sound = new Sound(audioUrl, null, (error) => {
      if (error) {
        console.error('Failed to load sound', error);
        setIsLoading(false);
        return;
      }
      
      // Sound loaded successfully
      soundRef.current = sound;
      setDuration(sound.getDuration());
      setIsLoading(false);
    });
    
    // Clean up
    return () => {
      stopAndReleaseSound();
    };
  }, [audioUrl]);
  
  // Track app state for background playback
  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground
        if (isPlaying) {
          startProgressTracking();
        }
      } else if (appStateRef.current === 'active' && nextAppState.match(/inactive|background/)) {
        // App has gone to the background
        if (isPlaying) {
          // Start background service to keep audio playing
          startBackgroundService();
        }
      }
      
      appStateRef.current = nextAppState;
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
    };
  }, [isPlaying]);
  
  // Helper function to start background service
  const startBackgroundService = async () => {
    if (!BackgroundService.isRunning()) {
      try {
        await BackgroundService.start(backgroundTask, backgroundOptions);
      } catch (error) {
        console.error('Error starting background service:', error);
      }
    }
  };
  
  // Helper function to stop background service
  const stopBackgroundService = async () => {
    if (BackgroundService.isRunning()) {
      try {
        await BackgroundService.stop();
      } catch (error) {
        console.error('Error stopping background service:', error);
      }
    }
  };
  
  // Helper function to stop and release sound
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
  
  // Helper function to track progress
  const startProgressTracking = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    timerRef.current = setInterval(() => {
      if (soundRef.current) {
        soundRef.current.getCurrentTime((seconds) => {
          setCurrentTime(seconds);
          
          // If we've reached the end, stop
          if (seconds >= duration) {
            handlePlayPause();
          }
        });
      }
    }, 1000);
  };
  
  // Handle play/pause
  const handlePlayPause = () => {
    if (!soundRef.current || isLoading) return;
    
    if (isPlaying) {
      // Pause
      soundRef.current.pause();
      clearInterval(timerRef.current);
      timerRef.current = null;
      stopBackgroundService();
      setIsPlaying(false);
    } else {
      // Play
      soundRef.current.play((success) => {
        if (!success) {
          console.log('Playback failed due to audio decoding errors');
        }
        
        // Reset on completion
        setIsPlaying(false);
        setCurrentTime(0);
        clearInterval(timerRef.current);
        timerRef.current = null;
        stopBackgroundService();
      });
      
      startProgressTracking();
      
      // Start background service if app is in background
      if (appStateRef.current.match(/inactive|background/)) {
        startBackgroundService();
      }
      
      setIsPlaying(true);
    }
  };
  
  // Handle seeking
  const handleSeek = (value) => {
    if (!soundRef.current || isLoading) return;
    
    soundRef.current.setCurrentTime(value);
    setCurrentTime(value);
  };
  
  // Restart audio
  const handleRestart = () => {
    if (!soundRef.current || isLoading) return;
    
    soundRef.current.stop();
    soundRef.current.setCurrentTime(0);
    setCurrentTime(0);
    
    if (isPlaying) {
      soundRef.current.play();
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Title */}
        <Text style={styles.title}>{trackTitle}</Text>
        
        {/* Loading indicator */}
        {isLoading ? (
          <ActivityIndicator size="large" color="#00adef" />
        ) : (
          <View style={styles.playerContainer}>
            {/* Time display */}
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
            
            {/* Progress slider */}
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={duration}
              value={currentTime}
              minimumTrackTintColor="#00adef"
              maximumTrackTintColor="#ddd"
              thumbTintColor="transparent"
              onSlidingComplete={handleSeek}
              
            />
            
            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity onPress={handleRestart} style={styles.controlButton}>
                {/* <Ionicons name="play-skip-back" size={24} color="#333" /> */}
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handlePlayPause} style={styles.playButton}>
                {/* <Ionicons 
                  name={isPlaying ? "pause" : "play"} 
                  size={32} 
                  color="#fff"
                /> */}
                
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.controlButton}>
                {/* <Ionicons name="play-skip-forward" size={24} color="#333" /> */}
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  playerContainer: {
    width: '100%',
    height:300
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  timeText: {
    color: '#666',
    fontSize: 14,
  },
  slider: {
    width: '100%',
    height: 300,
    borderWidth:1
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  controlButton: {
    padding: 10,
  },
  playButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#00adef',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 30,
  },
});

export default AudioPlayer;