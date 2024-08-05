import { supabase } from '@/lib/supabase';
export const fetchUser = async () => {//, Amigos(*) .eq('id1','2').eq('id2','2')
  const { data, error } = await supabase.from('Usuario_TEA')
  .select(`
    *, 
    Categoria(*), 
    Provincias(nombre), 
    Curso(*)`)
  .eq('id','2');
  if (error) {
    console.log(error);
  } else {
    console.log('User data fetched:', data);
    return data;
  }
};

export const fetchAmigos = async (idUsuario: number) => {
  console.log("entraaaa");
  const { data, error } = await supabase
    .from('AmigosSimple')
    .select(`
      id_amigo,
      amigo:Usuario_TEA!id_amigo(id, nombre, apellido, fotoUsuario)
    `)
    .eq('id_usuario', idUsuario);
  
  if (error) {
    console.log('Error al obtener amigos:', error.message);
    return [];
  } else {
    console.log('Amigos obtenidos con éxito:', data);
    return data.map(item => item.amigo);
  }
};

export const combinadoUserAmigos = () => {
  return {
    usuarioTea: fetchUser(),
    amigos: fetchAmigos(2)
  }
}

interface UserInput {
  nombre: string;
  apellido: string;
  username: string;
  mail: string;  
  contraseña: string;
  fec_nac: string;
  num_dni: string;
}

export const fetchOrCreateUser = async (userInput: UserInput) => {
  const { nombre, apellido, username, mail, contraseña, fec_nac, num_dni } = userInput;

  // Verificar si el usuario ya existe
  const { data: existingUser, error: fetchError } = await supabase
    .from('Usuario_TEA')
    .select('*')
    .eq('mail', mail)  // Cambiado de email a mail
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') {
    console.log('Error al buscar usuario:', fetchError.message);
    throw new Error('Error fetching user');
  }

  if (existingUser) {
    console.log('El usuario ya existe:', existingUser);
    return existingUser;
  }

  // Insertar el nuevo usuario
  const { data: newUser, error: insertError } = await supabase
    .from('Usuario_TEA')
    .insert([{ 
      nombre, 
      apellido, 
      username, 
      mail, 
      contraseña, 
      fec_nac, 
      num_dni 
    }])
    .single();

  if (insertError) {
    console.log('Error al insertar usuario:', insertError.message);
    throw new Error('Error inserting user');
  }

  console.log('Usuario creado con éxito:', newUser);
  return newUser;
};


/*
export const registroUsuario = async () => {
    try {
    const { data: userInsert, error: userError } = await supabase
      .from('Usuario_TEA')
      .insert([
        { 
          nombre: '',
          apellido: '',
          username: '',
          mail: '',
          contraseña: '',
          fec_nac: '',
          num_dni: '',
          id_tipo_usuario: '',
        }
      ]); 
    
    const {data: tutorInsert, error: tutorError} = await supabase
    .from('Tutor')
    .insert([
      {
        mail: '',
        nombre: '',
        apellido: '',
        num_dni: '',
      }
    ])

    if (error) throw error;
    
    
    console.log('Datos insertados:', data);
    return data;
  } catch (error) {
    console.error('Error al insertar datos:', error.message);
    return null;
  }
};
*/

// FETCH DE CATEGORIAS : TRAE TODAS LAS CATEGORAS
// interface Categoria {
//   id: number;
//   nombre: string;
// }

// export const fetchCategorias = async (): Promise<Categoria[]> => {
//   const { data, error } = await supabase
//     .from('Categoria')
//     .select('id, nombre')
//     .order('nombre', { ascending: true });

//   if (error) {
//     console.log('Error al obtener categorías:', error.message);
//     return [];
//   } else {
//     console.log('Categorías obtenidas con éxito:', data);
//     return data as Categoria[];
//   }
// };

// // FETCH DE CURSOS : TE TRAE LOS CURSOS SEGÚN QUE CATEGORÍA TOQUES
// interface Curso {
//   id_curso: number;
//   nombre: string;
//   id_categoria: number;
//   id_calificacion: number;
// }

// export const fetchCursos = async (idCategoria: number): Promise<Curso[]> => {
//   const { data, error } = await supabase
//     .from('Cursos')
//     .select('id_curso, nombre, id_categoria')
//     .eq('id_categoria', idCategoria)
//     .order('nombre', { ascending: true });

//   if (error) {
//     console.log('Error al obtener cursos:', error.message);
//     return [];
//   } else {
//     console.log('Cursos obtenidos con éxito:', data);
//     return data as Curso[];
//   }
// };

// // FETCH DE EVENTOS : TE MUESTRA LOS EVENTOS SEGÚN LA CATEGORÍA QUE TOQUES

// interface Evento {
//   id_evento: number;
//   nombre: string;
//   locacion: string;
//   fecha: string;
//   descripcion: string;
//   horario: string;
//   id_creador: number;
//   id_calificacion: number;
// }

// export const fetchEventos = async (idCategoria: number): Promise<Evento[]> => {
//   const { data, error } = await supabase
//     .from('Evento_Categoria')
//     .select('id_evento')
//     .eq('id_categoria', idCategoria);

//   if (error) {
//     console.log('Error al obtener eventos de la categoría:', error.message);
//     return [];
//   }

//   const eventIds = data.map((eventoCategoria: { id_evento: number }) => eventoCategoria.id_evento);

//   const { data: eventos, error: eventosError } = await supabase
//     .from('Evento')
//     .select('id_evento, nombre, locacion, fecha, descripcion, horario, id_creador, id_calificacion')
//     .in('id_evento', eventIds)
//     .order('fecha', { ascending: true });

//   if (eventosError) {
//     console.log('Error al obtener eventos:', eventosError.message);
//     return [];
//   } else {
//     console.log('Eventos obtenidos con éxito:', eventos);
//     return eventos as Evento[];
//   }
// };