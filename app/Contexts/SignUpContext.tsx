import React, { createContext, useState, ReactNode, useContext, useReducer} from "react";

export const initialState = {
  nombre: '',
  apellido: '',
  email: '',
  emailTutor: '',
  fechaNacimiento: '',
  username: '',
  password: '',
  confirmPassword: '',
}

export const ActionTypes = {
  SetNombre: 'SET_NOMBRE',
  SetApellido: 'SET_APELLIDO',
  SetEmail: 'SET_EMAIL',
  SetEmailTutor: 'SET_EMAIL_TUTOR',
  SetFechaNacimiento: 'SET_FECHA_NACIMIENTO',
  SetUsername: 'SET_USERNAME',
  SetPassword: 'SET_PASSWORD',
  SetConfirmPassword: 'SET_CONFIRM_PASSWORD',
}

export const reducer = (state = {}, action) => {
  switch (action.type){
    case ActionTypes.SetNombre:
      return {
        ...state,
        nombre: action.newValue,
      };
    case ActionTypes.SetApellido:
      return {
        ...state,
        apellido: action.newValue,
      };
    case ActionTypes.SetEmail:
      return {
        ...state,
        email: action.newValue,
      };
    case ActionTypes.SetEmailTutor:
      return {
        ...state,
        emailTutor: action.newValue,
      };
    case ActionTypes.SetFechaNacimiento:
      return {
        ...state,
        fechaNacimiento: action.newValue,
      };
    case ActionTypes.SetUsername:
      return {
        ...state,
        username: action.newValue,
      };
    case ActionTypes.SetPassword:
      return {
        ...state,
        password: action.newValue,
      };
    case ActionTypes.SetConfirmPassword:
      return {
        ...state,
        confirmPassword: action.newValue
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