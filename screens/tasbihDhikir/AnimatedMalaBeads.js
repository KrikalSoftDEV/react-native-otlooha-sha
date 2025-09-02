import React, { useState, useRef } from 'react';
import {
  View,
  Animated,
  TouchableOpacity,
  StyleSheet,
  Text,
} from 'react-native';

const BEAD_SIZE_LARGE = 45;
const BEAD_SIZE_SMALL = 45;
const ANIMATION_DURATION = 800;

export default function MalaBeadsScroll() {
  // We maintain a queue of 5 beads
  const [beads, setBeads] = useState(generateInitialBeads());
  const anims = useRef(beads.map(() => new Animated.Value(0))).current;

  const handleScrollDown = () => {
    const newBeads = [...beads];
    const removed = newBeads.pop(); // remove bottom
    const newTop = generateBead(); // new top bead
    newBeads.unshift(newTop); // add to top

    // Animate each bead down
    const animations = anims.map((anim) =>
      Animated.timing(anim, {
        toValue: 1,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      })
    );

    Animated.parallel(animations).start(() => {
      // Reset animations
      anims.forEach((a, i) => a.setValue(0));
      // Update state with new bead queue
      setBeads(newBeads);
    });
  };

  const getScale = (index) => {
    // Only center bead is large
    return index === 2 ? 1 : 0.5;
  };

  const getBeadStyle = (index) => {
    const translateY = anims[index].interpolate({
      inputRange: [0, 1],
      outputRange: [0, 70], // each bead shifts 70px down
    });

    const scale = index === 1
      ? anims[index].interpolate({ inputRange: [0, 1], outputRange: [0.5, 1] }) // small to large
      : index === 2
      ? anims[index].interpolate({ inputRange: [0, 1], outputRange: [1, 0.5] }) // large to small
      : new Animated.Value(getScale(index)); // static

    return {
      transform: [{ translateY }, { scale }],
    };
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handleScrollDown}>
        <View style={styles.beadStack}>
          {beads.map((bead, index) => (
            <Animated.View
              key={bead.id}
              style={[
                styles.bead,
                getBeadStyle(index),
                index === 2 ? styles.largeBead : styles.smallBead,
              ]}
            />
          ))}
          {/* Vertical Line */}
          <View style={styles.line} />
        </View>
      </TouchableOpacity>

      <Text style={styles.instruction}>Tap to scroll mala bead ↓</Text>
    </View>
  );
}

let beadId = 0;
function generateBead() {
  return { id: beadId++ };
}

function generateInitialBeads() {
  return Array.from({ length: 5 }, generateBead);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  beadStack: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  bead: {
    marginVertical: 6,
    backgroundColor: '#A279FF',
  },
  smallBead: {
    width: BEAD_SIZE_SMALL,
    height: BEAD_SIZE_SMALL,
    borderRadius: BEAD_SIZE_SMALL / 2,
  },
  largeBead: {
    width: BEAD_SIZE_LARGE,
    height: BEAD_SIZE_LARGE,
    borderRadius: BEAD_SIZE_LARGE / 2,
  },
  line: {
    position: 'absolute',
    width: 2,
    height: 300,
    backgroundColor: '#1D1467',
    zIndex: -1,
  },
  instruction: {
    marginTop: 40,
    fontSize: 16,
    color: '#555',
  },
});
