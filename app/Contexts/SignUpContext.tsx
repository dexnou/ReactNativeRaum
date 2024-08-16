import React, { createContext, useState, ReactNode, useContext} from "react";

const [signUp, setSignUp] = useState({
  nombre: '',
  apellido: '',
  email: '',
  emailTutor: '',
  fecNac: '',
  username: '',
  password: ''
})
const ContextSignUp = createContext(signUp)

const SignUpContext = ({children} : {children: ReactNode}) => {

  
return (
  <ContextSignUp.Provider value={{signUp, setSignUp}}>
      {children}
  </ContextSignUp.Provider>
)
}

const useSignUp = () => {
  return useContext(ContextSignUp);
}

export {SignUpContext, useSignUp};



















//en otras pantallas
//<SignUp>