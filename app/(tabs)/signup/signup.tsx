import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import NameStep from './signup2';
import EmailStep from './signup3';
import UsernamePasswordStep from './signup4';
import {SignUpProvider, useSignUp} from '@/app/Contexts/SignUpContext';
import commonStyles from '../commonStyles';

//hay que usar asyncstorage para retener la inforamción que se va pasando, al principio inicializar todo como '', pasas el componente
export default function SignUpScreen({ navigation }: {navigation: any}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState();

  const handleNextStep = () => {
    setCurrentStep(currentStep + 1);
    setData(data);
  };

  const handlePreviousStep = () => {
    setCurrentStep(currentStep - 1);
    setData(data);
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
    <SignUpProvider>
      <View style={commonStyles.background}>
        <View style={commonStyles.topShape} />
        <View style={commonStyles.bottomShape} />
        {renderStep()}
      </View>
    </SignUpProvider>
  );
}
/*
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
});*/