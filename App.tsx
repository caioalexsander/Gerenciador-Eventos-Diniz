import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import NovoContratoScreen from './src/screens/NovoContratoScreen';
import VisualizarPDFScreen from './src/screens/VisualizarPDFScreen';
import MeusContratosScreen from './src/screens/MeusContratosScreen';
import CardapioScreen from './src/screens/CardapioScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: true }}>
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ title: 'Login - Diniz Eventos' }} 
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: 'Gerenciador Diniz' }} 
        />
        <Stack.Screen 
          name="NovoContrato" 
          component={NovoContratoScreen} 
          options={{ title: 'Novo Contrato' }} 
        />
        <Stack.Screen 
          name="MeusContratos" 
          component={MeusContratosScreen} 
          options={{ title: 'Meus Contratos' }} 
        />
        <Stack.Screen 
          name="VisualizarPDF" 
          component={VisualizarPDFScreen} 
          options={{ title: 'Visualizar Contrato' }} 
        />
        <Stack.Screen 
          name="Cardapio" 
          component={CardapioScreen} 
          options={{ title: 'Gerenciar Cardápio' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}