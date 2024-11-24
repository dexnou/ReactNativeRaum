import { supabase } from "@/lib/supabase";

export const fetchEventosFiltered = async (idCategoria: number) => {
    const { data, error } = await supabase.rpc('get_evento_filtered', { id_cat: idCategoria });

  if (error) {
    console.log(error);
  } else {
    console.log('Eventos data fetched:', data);
    return data;
  }
};

export const fetchDetalleEvento = async (idEvento: number) => {
    console.log("El idEvento que llega es: ", idEvento);
    const { data, error } = await  supabase.rpc('get_evento_chosen', { id: idEvento });
    if (error) {
      console.log(error);
    } else {
      console.log('Evento elegido data fetched:', data[0]);
      return data;
    }
}

export const fetchEnrollment = async (idEvento: number, idUser: number) => {
  console.log('Llega al fetchEnrollment con idEvento: ', idEvento, ' y idUser: ', idUser);
    const { data, error } = await  supabase.rpc('get_event_enrollment', { evento: idEvento, usuario: idUser });
    console.log('El usuario esta inscripto: ', data);
    if(data > 0){
        return true;
    }else{
        return false;
    }
}

export const setEventoEnrollment = async (idEvento: number, idUser: number) => {
    const { data, error } = await  supabase.rpc('event_enrollment', { evento: idEvento, usuario: idUser });

    if(data == "Usuario inscripto correctamente"){
        return true;
    }else{
        return false;
        console.log(error)
    }
}

export const deleteEventoEnrollment = async (idEvento: number, idUser: number) => {
    const { data, error } = await  supabase.rpc('delete_event_enrollment', { evento: idEvento, usuario: idUser });

    if(data == "Usuario desinscripto correctamente"){
        return true;
    }else{
        return false;
        console.log(error)
    }
}