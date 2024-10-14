import { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

interface Props {
  onSubmit: (content: string) => void;
}

export default function SignUp({onSubmit}: Props){

    const [content, setContent] = useState("");

    return (
        <View style={styles.container}>
            <TextInput value={content} onChangeText={setContent} style={styles.input} />
            <Button 
                title="SignUpp" 
                onPress={() => {
                    onSubmit(content);
                    setContent("");        
                }} 
            />
        </View>
    );
  }



  const styles = StyleSheet.create({
    container: {
      width: '100%',
      padding: 16,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    input:{
        borderColor: 'gray',
        borderWidth: 1,
        padding:8
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    loadingText: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    title: {
      marginTop: 20,
      fontSize: 20,
      fontWeight: 'bold',
    },
    separator: {
      marginVertical: 30,
      height: 1,
      width: '80%',
    },
    itemContainer: {
      alignItems: 'center',
      padding: 20,
    },
    profilePicture: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 20,
    },
    name: {
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    username: {
      fontSize: 18,
      color: 'gray',
      marginBottom: 5,
    },
    email: {
      fontSize: 18,
      color: 'gray',
      marginBottom: 5,
    },
    dni: {
      fontSize: 18,
      color: 'gray',
      marginBottom: 5,
    },
    birthDate: {
      fontSize: 18,
      color: 'gray',
      marginBottom: 20,
    },
    dniPicture: {
      width: 200,
      height: 100,
      marginBottom: 20,
    },
  });