import React, { createContext, useState, ReactNode, useContext, useReducer} from "react";

export const initialState = {
  nombre: '',
  apellido: '',
  email: '',
  emailTutor: '',
  fecNac: '',
  username: '',
  password: '',
}

export const ActionTypes = {
  SetNombre: 'SET_NOMBRE',
  SetApellido: 'SET_APELLIDO',
  SetEmail: 'SET_EMAIL',
  SetEmailTutor: 'SET_EMAIL_TUTOR',
  SetFechaNacimiento: 'SET_FECHA_NACIMIENTO',
  SetUsername: 'SET_USERNAME',
  SetPassword: 'SET_PASSWORD',
}

export const reducer = (state = {}, action) => {
  switch (action.type){
    case ActionTypes.SetNombre:
      return {
        ...state,
        nombre: action.value,
      };
    case ActionTypes.SetApellido:
      return {
        ...state,
        apellido: action.value,
      };
    case ActionTypes.SetEmail:
      return {
        ...state,
        email: action.value,
      };
    case ActionTypes.SetEmailTutor:
      return {
        ...state,
        emailTutor: action.value,
      };
    case ActionTypes.SetFechaNacimiento:
      return {
        ...state,
        fechaNacimiento: action.value,
      };
    case ActionTypes.SetUsername:
      return {
        ...state,
        username: action.value,
      };
    case ActionTypes.SetPassword:
      return {
        ...state,
        password: action.value,
      };
    default:
      return state;
  }
};

export const initialContext = {
  contextState: initialState,
  setContextState: (_value: any) => {},
}

interface SingUpProps {
  children?: ReactNode;
  value?: any;

}

const ContextSignUp = createContext(initialContext)

export const SignUpProvider = ({children, initial = initialState}) => {
  const [state, dispatch] = useReducer(reducer,initial);
  const contextState = state;
  const setContextState = dispatch;
return (
  <ContextSignUp.Provider value={{contextState, setContextState}}>
      {children}
  </ContextSignUp.Provider>
)
}

export const useSignUp = () => {
  return useContext(ContextSignUp);
}




















//en otras pantallas
//<SignUp>