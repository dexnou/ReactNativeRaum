import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ImageBackground } from 'react-native';
import { Svg, Path } from 'react-native-svg';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

const { width, height } = Dimensions.get('window');

type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
};

type FirstPageNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

const FirstPage: React.FC = () => {
    const navigation = useNavigation<FirstPageNavigationProp>();
    
    return (
      <ImageBackground 
            source={{ uri: 'https://i.postimg.cc/nLgZHcLH/background-image.png' }} 
            style={styles.container}
        >
        <View style={styles.container}>
            <View style={styles.contentContainer}>
                <TouchableOpacity 
                    style={styles.buttonPrimary} 
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.buttonTextPrimary}>YA TENGO CUENTA</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.buttonSecondary} 
                    onPress={() => navigation.navigate('Signup')}
                >
                    <Text style={styles.buttonTextSecondary}>QUIERO TENER UNA CUENTA</Text>
                </TouchableOpacity>
            </View>
        </View>
        </ImageBackground>
    );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover', // Esto asegura que la imagen cubra todo el fondo
    justifyContent: 'center'
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 50,
  },
  buttonPrimary: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginBottom: 20,
    width: width * 0.8,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1E3A8A',
  },
  buttonSecondary: {
    backgroundColor: '#1E3A8A',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    borderWidth: 2,
    width: width * 0.8,
    alignItems: 'center'
  },
  buttonTextPrimary: {
    color: '#1E3A8A',
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
export default FirstPage;