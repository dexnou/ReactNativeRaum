/*Acá van a ir las queries donde la tabla protagonista sea CATEGORIAS*/
import { supabase } from "@/lib/supabase";

export const fetchCategorias = async () => {
    const { data, error } = await supabase.from('Categoria')
  .select(`
    *`)
  if (error) {
    console.log(error);
  } else {
    console.log('User data fetched:', data);
    return data;
  }
};

export const fetchCursos = async (idCategoria: number) => {
    const { data, error } = await supabase.from('Cursos')
    .select(`
      *`)
    .eq('id_categoria',idCategoria);
    if (error) {
      console.log(error);
    } else {
      console.log('User data fetched:', data);
      return data;
    }
};

export const fetchUsuariosCursos = async (idCurso: number) => {
    const { data, error } = await supabase.from('Curso_Usuario')
    .select(`
      *,
      Usuario_TEA(nombre,fotoUsuario)`)
    .eq('id_curso',idCurso);
    if (error) {
      console.log(error);
    } else {
      console.log('User data fetched:', data);
      return data;
    }
};