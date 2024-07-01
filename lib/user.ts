import { supabase } from '@/lib/supabase';

export const fetchUser = async () => {//, Amigos(*) .eq('id1','2').eq('id2','2')
  const { data, error } = await supabase.from('Usuario_TEA').select('*, Categoria(*), Paises(nombre_pais), Curso(*)').eq('id','2');
  if (error) {
    console.log(error);
  } else {
    console.log('User data fetched:', data);
    return data;
  }
};
