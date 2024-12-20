import { supabase } from '@/lib/supabase';
export const fetchUser = async (id: number) => {


  const { data, error } = await supabase.from('Usuario_TEA')
    .select(`
      *, 
      Categoria(*), 
      Provincias(nombre), 
      Curso(*)`)
    .eq('id', id); // Usa el parámetro id en lugar de 2
  if (error) {
    console.log(error);
    return null; // Asegúrate de devolver null si hay un error
  } else {
    console.log('User data fetched:', data);
    return data;
  }
};


//
export const fetchAmigos = async (idUsuario: number) => {
  console.log("entraaaa");
  const { data, error } = await supabase.rpc('get_amigos', { user_id: idUsuario });

  if (error) {
    console.error('Error al obtener amigos:', error.message);
    return [];
  } else {
    console.log('Amigos obtenidos con éxito:', data);
    // Check the structure of 'data' before mapping
    
    if (data && Array.isArray(data) && data.length > 0) {
      console.log("Array amigos:", data[0].arrayamigos)
      return data[0].arrayamigos || []; // Access the 'arrayAmigos' from the first row
    } else {
      return [];
    }
  }
};

export const fetchOrCreateUser = async (nombre: string, apellido: string, username: string, email: string, emailTutor: string, password: string, fechaNacimiento: string) => {
  // Verificar si el usuario ya existe
  const { data: existingUser, error: fetchError } = await supabase
    .from('Usuario_TEA')
    .select('*')
    .eq('mail', email)  // Cambiado de email a mail
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
  const {data: tutor, error} = await supabase
  .from ('Tutor')
  .insert([{
    mail: emailTutor,
  }])
  .select('id_tutor');
  console.log((tutor[0].id_tutor));
  const { data: newUser, error: insertError } = await supabase
    .from('Usuario_TEA')
    .insert([{ 
      nombre: nombre, 
      apellido: apellido, 
      username: username, 
      mail : email,
      id_tutor: tutor[0].id_tutor,
      contraseña: password, 
      fec_nac: fechaNacimiento, 
    }])
    .select();
  

  if (insertError) {
    console.log('Error al insertar usuario:', insertError.message);
    throw new Error('Error inserting user');
  }

  console.log('Usuario creado con éxito:', newUser);
  return newUser;
};

interface LoginInput {
  mail: string;
  password: string;
}

export const loginUser = async ({ mail, password }: LoginInput) => {
  // Buscar el usuario en la base de datos
  console.log('Email:', mail ,'y contraseña: ', password);
  const { data, error } = await supabase
    .from('Usuario_TEA')
    .select('*')
    .eq('mail', mail)
    .eq('contraseña', password) // Asegúrate de que 'contraseña' es el nombre correcto de la columna
    .single();

  if (error) {
    console.log('Error al verificar usuario:', error.message);
    throw new Error('Error al iniciar sesión');
  }

  if (!data) {
    throw new Error('Usuario no encontrado o contraseña incorrecta');
  }

  return data;
};


export const fetchProgress = async (userId: number) => {
  try {
    const { data, error } = await supabase.rpc('get_progress', {
      user_id: userId
    });

    if (error) {
      console.error('Error al obtener el progreso:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.log('No se encontró progreso');
      return null;
    }

    console.log('Progreso obtenido con éxito:', data);
    return data;
  } catch (err) {
    console.error('Error inesperado en fetchProgress:', err);
    throw err;
  }
}

//Fetch Amigos Progress
export const fetchAmigosProgress = async (userId: number) => {
  console.log('Iniciando búsqueda de progreso de amigos para el usuario:', userId);
  try {
    const { data, error } = await supabase.rpc('get_amigos_progress', {
      user_id: userId
    });

    if (error) {
      console.error('Error al obtener progreso de amigos:', error.message);
      throw new Error('Error al obtener progreso de amigos');
    }

    if (!data || data.length === 0) {
      console.log('No se encontró progreso de amigos');
      return [];
    }

    console.log('Progreso de amigos obtenido con éxito:', data);
    return data;
  } catch (err) {
    console.error('Error inesperado en fetchAmigosProgress:', err);
    throw err;
  }
};

// FETCH DE CATEGORIAS : TRAE TODAS LAS CATEGORAS
interface Categoria {
  id_categoria: number;
  nombre: string;
  fotoCategoria: string;
}

export const fetchCategorias = async (): Promise<Categoria[]> => {
  console.log('Iniciando fetchCategorias...');
  try {
    const { data, error } = await supabase
      .from('Categoria')
      .select('id_categoria, nombre, fotoCategoria')
      .order('nombre', { ascending: true });

    if (error) {
      console.error('Error al obtener categorías:', error.message);
      throw new Error(`Error al obtener categorías: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('No se encontraron categorías');
      return [];
    }

    console.log('Categorías obtenidas con éxito:', data);
    return data as Categoria[];
  } catch (err) {
    console.error('Error inesperado en fetchCategorias:', err);
    throw err;
  }
};



// // FETCH DE CURSOS : TE TRAE LOS CURSOS SEGÚN QUE CATEGORÍA TOQUES
interface Curso {
  id_curso: number;
  nombre: string;
  id_categoria: number;
}

export const fetchCursos = async (categoriaId: number): Promise<Curso[]> => {
  console.log('Iniciando fetchCursos para la categoría:', categoriaId);
  try {
    const { data, error } = await supabase
      .from('Curso')
      .select('id_curso, nombre, id_categoria')
      .eq('id_categoria', categoriaId);

    console.log('Respuesta de Supabase:', { data, error });

    if (error) {
      console.error('Error al obtener cursos:', error.message);
      throw new Error(`Error al obtener cursos: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('No se encontraron cursos para esta categoría');
      return [];
    }

    console.log('Cursos obtenidos con éxito:', data);
    return data;
  } catch (err) {
    console.error('Error inesperado en fetchCursos:', err);
    throw err;
  }
};

export async function fetchUsuariosCursos(idCategoria: number){
  try {
    const { data, error } = await supabase.rpc('get_usuarios_cursos', {
      categoria: idCategoria
    });

    if (error) {
      console.error('Error al obtener usuarios por curso:', error.message);
      throw new Error('Error al obtener usuarios por curso');
    }

    if (!data || data.length === 0) {
      console.log('No se encontró usuarios por curso');
      return [];
    }

    console.log('Usuarios por curso obtenido con éxito:', data);
    return data;
  } catch (err) {
    console.error('Error inesperado en fetchUsuariosCursos:', err);
    throw err;
  }

};

export async function fetchCapituloCount(idCategoria: number){
  try {
    const { data, error } = await supabase.rpc('get_capitulo_count', {
      categoria: idCategoria
    });

    if (error) {
      console.error('Error al obtener capitulo count:', error.message);
      throw new Error('Error al obtener capitulo count');
    }

    if (!data || data.length === 0) {
      console.log('No se encontró capitulo count');
      return [];
    }

    console.log('capitulo count obtenido con éxito:', data);
    return data;
  } catch (err) {
    console.error('Error inesperado en fetchCapituloCount:', err);
    throw err;
  }

};

// UPDATE DE USUARIO : ACTUALIZA LOS DATOS DEL USUARIO: EDITAR PERFIL
export async function updateUserProfile(userId: string, userData: {
  username?: string;
  fotoUsuario?: string;
  descripcion?: string;
  id_provincia?: string;
  catFav?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('Usuario_TEA')
      .update({
        username: userData.username,
        fotoUsuario: userData.fotoUsuario,
        descripcion: userData.descripcion,
        id_provincia: userData.id_provincia,
        catFav: userData.catFav
      })
      .eq('id', userId)
      .select();

    if (error) throw error;

    // Actualizar también la tabla Usuario_TEA
    const { error: teaError } = await supabase
      .from('Usuario_TEA')
      .update({
        username: userData.username,
        fotoUsuario: userData.fotoUsuario,
        descripcion: userData.descripcion,
        id_provincia: userData.id_provincia,
        catFav: userData.catFav
      })
      .eq('id_usuario', userId);

    if (teaError) throw teaError;

    return data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
}

export const fetchCapitulo = async (cursoId: number) => {
  try {
    const { data, error } = await supabase
      .from('Capitulo')
      .select('*')
      .eq('id_curso', cursoId);

    if (error) {
      console.error('Error al obtener capítulos:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.log('No se encontraron capítulos');
      return [];
    }

    console.log('Capítulos obtenidos con éxito:', data);
    return data;
  } catch (err) {
    console.error('Error inesperado en fetchCapitulo:', err);
    throw err;
  }
}

export const fetchPreguntas = async (capituloId: number) => {
  try {
    const { data, error } = await supabase
      .from('Preguntas') // Cambia aquí según el nombre real de la tabla
      .select('*')
      .eq('id_capitulo', capituloId);


    if (error) {
      console.error('Error al obtener preguntas:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.log('No se encontraron preguntas');
      return [];
    }

    console.log('Preguntas obtenidas con éxito:', data);
    return data;
  } catch (err) {
    console.error('Error inesperado en fetchPreguntas:', err);
    throw err;
  }
} 

export const fetchInfoPrevia = async (capituloId: number) => {
  try {
    const { data, error } = await supabase
      .from('Aprendizaje')
      .select('*')
      .eq('id_capitulo', capituloId); // Usa el parámetro recibido

    if (error) {
      console.error('Error al obtener información previa:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.log('No se encontró información previa');
      return [];
    }

    console.log('Información previa obtenida con éxito:', data);
    return data;
  } catch (err) {
    console.error('Error inesperado en fetchInfoPrevia:', err);
    throw err;
  }
};


export const fetchRespuestas = async (preguntaSeleccionada: number) => {
  try {
    const { data, error } = await supabase
      .from('Respuestas')
      .select('*')
      .eq('id_pregunta', preguntaSeleccionada);

    if (error) {
      console.error('Error al obtener respuestas:', error.message);
      return null;
    }

    if (!data || data.length === 0) {
      console.log('No se encontraron respuestas');
      return [];
    }

    console.log('Respuestas obtenidas con éxito:', data);
    return data;
  } catch (err) {
    console.error('Error inesperado en fetchRespuestas:', err);
    throw err;
  }
}

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