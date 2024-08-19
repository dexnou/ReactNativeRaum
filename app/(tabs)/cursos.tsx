import React, { useState, useEffect } from 'react';
import { FlatList, TouchableOpacity, View, Text, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchCategorias } from '../../lib/user.ts'; // Asegúrate de que la ruta sea correcta

const CursosScreen = () => {
    const [categorias, setCategorias] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigation = useNavigation();

    useEffect(() => {
        const loadCategorias = async () => {
            try {
                console.log("Iniciando carga de categorías...");
                const data = await fetchCategorias();
                console.log("Categorías cargadas:", data);
                setCategorias(data);
                setLoading(false);
            } catch (err) {
                console.error("Error al cargar categorías:", err);
                setError(err.message);
                setLoading(false);
            }
        };
        loadCategorias();
    }, []);

    const renderCategoria = ({ item }) => (
        <TouchableOpacity 
            style={styles.categoriaItem}
            onPress={() => {
                console.log("Navegando a CursosPorCategoria con:", item.id_categoria, item.nombre);
                navigation.navigate('CursosPorCategoria', { categoriaId: item.id_categoria, categoriaNombre: item.nombre });
            }}
        >
        {item.fotoCategoria && (
            <Image 
                source={{ uri: item.fotoCategoria }} 
                style={styles.categoriaImagen} 
            />
        )}
        <Text style={styles.categoriaNombre}>{item.nombre}</Text>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" />
                <Text>Cargando categorías...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text>Error: {error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Cursos</Text>
          </View>
        
            
                <FlatList
                    contentContainerStyle={styles.categoriasList}
                    data={[
                    { id: '1', icon: 'leaf', color: '#90EE90', name: 'Medio Ambiente' },
                    { id: '2', icon: 'utensils', color: '#FFD700', name: 'Comida' },
                    { id: '3', icon: 'shopping-cart', color: '#87CEEB', name: 'Compras' },
                    { id: '4', icon: 'heartbeat', color: '#FFA07A', name: 'Salud' },
                    { id: '5', icon: 'users', color: '#DDA0DD', name: 'Social' },
                    { id: '6', icon: 'plane', color: '#20B2AA', name: 'Viajes' },
                    ]}
                    renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.categoriaItem}
                        onPress={() => {
                        navigation.navigate('CursosPorCategoria', { categoriaId: item.id, categoriaNombre: item.name });
                        }}
                    >
                        <View style={[styles.categoriaIcon, { backgroundColor: item.color }]}>
                        <Image 
                            source={{ uri: `https://example.com/icons/${item.icon}.png` }} 
                            /*style={styles.categoriaImagen} */
                        />
                        </View>
                    </TouchableOpacity>
                    )}
                    numColumns={2} //cada dos categoria crea nueva columna
                    keyExtractor={item => item.id}
                    columnWrapperStyle={styles.columnaCategoria}
                />
            
        </View>
      );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#1E3A8A',
        height: "20%",
        display:"flex",
        justifyContent:"center",
        alignItems:"center",
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
    },
    headerText: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    container: {
        display:"flex",
        justifyContent:"space-around",
        alignContent:"center",
        backgroundColor: 'white',
        width:"100%",
        height:"100%"
    },

    categoriasList: {
        margin:"1%",
        width:"100%",
        height:"100%", 
        padding:"15%",
        display:"flex",
        justifyContent:"space-between",

    },
    columnaCategoria:{
        display:"flex",
        justifyContent:"space-between",

    },
    categoriaItem: {
        display:"flex",
        flexDirection: 'row',
        justifyContent:"space-between",
        width:100,//esto le da el ancho y alto a los circulos
        height:100
    },
    categoriaIcon: {
        width: "100%",
        height: "100%",
        borderRadius: 100,
    },
    
    categoriaNombre: {
        fontSize: 18,
    },
    noData: {
        fontSize: 18,
        textAlign: 'center',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    
});

export default CursosScreen;