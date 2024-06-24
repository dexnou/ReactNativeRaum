import { FlatList, StyleSheet } from 'react-native';
import 'react-native-url-polyfill/auto'
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import {supabase} from '@/lib/supabase';


export default function TabOneScreen() {

  const[users , setUsers] = useState([]);
  useEffect(() => {
    const fetchUsers = async () => {
      const {data, error} = await supabase.from('Usuario_TEA').select('*')
      if (error){
        console.log(error);
      } else {
        setUsers(data);
      } 
    }

    fetchUsers()
  }, []);
  console.log(users)
  
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <FlatList
        data={users}
        keyExtractor={item => item.id}
        renderItem={({item}) => <Text>{item.nombre}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
