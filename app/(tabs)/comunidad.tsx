/*Jere dijo que hagamos diferentes componentes, ahora la pregunta es como*/
/*ver si en realidad hacemos nuevos archivos en la carpeta de tabs, y que sea una navegacion "externa"*/
/*o que, con un if o algo asi, en un mismo archivo te figure la informacion correspondiente al paso en el que esta*/
import { FlatList, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import 'react-native-url-polyfill/auto';
import { Text, View } from '@/components/Themed';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '@/lib/supabase';
import { fetchCategorias, fetchCursos, fetchUsuariosCursos } from '@/lib/categorias';

export default function ComunidadScreen() {
  const [categorias, setCategorias] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [cursosUsuarios, setCursosUsuarios] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriasData: any = await fetchCategorias(); // Asume que el usuario actual tiene id 2
        console.log("Cat data:", categorias); // Verificar los datos de amigos obtenidos
        setCategorias(categoriasData);
        const cursosData: any = await fetchCursos(1);
        setCursos(cursosData);
        const cursosUsuariosData: any = await fetchUsuariosCursos(1);
        setCursosUsuarios(cursosUsuariosData);
      } catch (error) {
        console.error("Error fetching comunidad data:", error);
      }
    };
    fetchData();
  }, []);

  /*aca debería ser una especie de grid donde esté la imagen de la categoría y su nombre*/
  const renderCategorias = ({ item }) => (
    <View>

      <View>
        <div style={{width:'90%'}}><Text>{`${item.nombre} ${item.apellido}`}</Text></div>
      </View>

      <View>
        <View>
          {item && item.map((cat) => (
            <>
              <Image source={{ uri: cat.fotoCategoria }}/>
              <Text key={cat.id_curso} >{cat.nombre}</Text>
            </>
          ))}
        </View>
      </View>

    </View>
  );

  return (
    <View>
      <FlatList
        data={categorias}
        keyExtractor={item => item.id.toString()}
        renderItem={renderCategorias}
      />
    </View>

  );

}

const styles = StyleSheet.create({

});
