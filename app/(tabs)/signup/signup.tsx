import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import NameStep from './signup2';
import EmailStep from './signup3';
import UsernamePasswordStep from './signup4';
import {SignUpContext, useSignUp} from '@/app/Contexts/SignUpContext';

//hay que usar asyncstorage para retener la inforamción que se va pasando, al principio inicializar todo como '', pasas el componente
export default function SignUpScreen({ navigation }: {navigation: any}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    emailTutor: '',
    fecNac: '',
    username: '',
    password: ''
  });

  const handleNextStep = (data: object) => {
    setFormData({ ...formData, ...data });
    setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <NameStep onNext={handleNextStep} />;
      case 2:
        return <EmailStep onNext={handleNextStep} onPrevious={handlePreviousStep} />;
      case 3:
        return <UsernamePasswordStep onNext={handleNextStep} onPrevious={handlePreviousStep} navigation={navigation} />;
      default:
        return null;
    }
  };
  return (
    
      <View style={styles.background}>
        <View style={styles.topShape} />
        <View style={styles.bottomShape} />
        {renderStep()}
      </View>
    
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#03175E",
    paddingBottom: "20%",
  },
  topShape: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "100%",
    backgroundColor: "#03175E",
    borderBottomRightRadius: 200,
  },
  bottomShape: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: "70%",
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 200,
  },
});