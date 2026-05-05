import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import NovoContratoScreen from './src/screens/NovoContratoScreen';
import VisualizarPDFScreen from './src/screens/VisualizarPDFScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login - Diniz Eventos' }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Gerenciador de Eventos' }} 
        />
        <Stack.Screen 
          name="NovoContrato" 
          component={NovoContratoScreen} 
          options={{ title: 'Novo Contrato' }} 
        />
        <Stack.Screen 
          name="VisualizarPDF" 
          component={VisualizarPDFScreen} 
          options={{ title: 'Visualizar Contrato' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

