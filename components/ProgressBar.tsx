import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Wave from 'react-wavify';
import { Svg, Defs, LinearGradient, Stop, Rect } from 'react-native-svg';

const ProgressBar = ({ progress, chapterName, subchapterName }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: clampedProgress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBackground}>
        <Animated.View style={[styles.progressFill, { width: widthInterpolated }]}>
          
            <Svg style={StyleSheet.absoluteFillObject}>
              <Defs>
                <LinearGradient id="gradient" x1="0" y1="0" x2="1" y2="0">
                  <Stop offset="0" stopColor="#4facfe" stopOpacity="1" />
                  <Stop offset="1" stopColor="#00f2fe" stopOpacity="1" />
                </LinearGradient>
              </Defs>
              <Rect x="0" y="0" width="100%" height="100%" fill="url(#gradient)" />
            </Svg>
          
        </Animated.View>

        
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    overflow: 'hidden',
  },
  
  progressBackground: {
    height: 20,
    backgroundColor: '#333',
    borderRadius: 30,
    overflow: 'hidden',
    marginTop:"3%"
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'transparent',
    borderRadius: 10,
    overflow: 'hidden',
  },
  wave: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    bottom: 0,
  },
  progressText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProgressBar;