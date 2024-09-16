import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';


const ProgressBar = ({ progress }) => {
  // Aseguramos que el progreso esté entre 0 y 100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  
  // Creamos una referencia para la animación
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animamos el cambio de ancho cuando el progreso cambia
    Animated.timing(animatedWidth, {
      toValue: clampedProgress,
      duration: 1000, // Duración de la animación en milisegundos
      useNativeDriver: false, // No podemos usar el driver nativo para animaciones de layout
    }).start();
  }, [clampedProgress]);

  // Interpolamos el valor animado a un porcentaje de ancho
  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
    extrapolate: 'clamp',
  });

  return (
    <View style={styles.container}>
      <View style={styles.progressBackground}>
        <Animated.View style={[styles.progressFill, { width: widthInterpolated }]}>
          <Animated.View style={styles.wave} />
        </Animated.View>
      </View>
      <Text style={styles.progressText}>{`${Math.round(clampedProgress)}%`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 40,
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    overflow: 'hidden',
    position: 'relative',
    marginTop:"5%"
  },
  progressBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4a90e2',
    borderRadius: 0,//determina si la punto del progreso va a ser redonda o no
  },
  wave: {
    position: 'absolute',
    right: -5,
    top: 0,
    bottom: 0,
    width: 10,
    backgroundColor: '#3a7bd5',
    borderRadius: 0,//determina si la punto del progreso va a ser redonda o no
  },
  progressText: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    textAlign: 'center',
    textAlignVertical: 'center',
    color: '#333',
    fontWeight: 'bold',
  },
});

export default ProgressBar;