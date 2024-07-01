import { supabase } from '@/lib/supabase';

export const fetchUser = async () => {
  const { data, error } = await supabase.from('Usuario_TEA').select('*, Categoria(*), Paises(nombre_pais), Curso(*), Amigos(*)').eq('id','2');
  if (error) {
    console.log(error);
  } else {
    console.log('User data fetched:', data);
    return data;
  }
};
