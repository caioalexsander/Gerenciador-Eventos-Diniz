import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import NovoContratoScreen from './src/screens/contratos/NovoContratoScreen';
import MeusContratosScreen from './src/screens/MeusContratosScreen';
import CardapioScreen from './src/screens/CardapioScreen';
import ConfiguracaoClausulaContratoScreen from './src/screens/ConfiguracaoClausulaContratoScreen';
import OpcoesLayoutScreen from './src/screens/OpcoesLayoutScreen';
import VisualizarContratoScreen from './src/screens/contratos/VisualizarContratoScreen'

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
          component={OpcoesLayoutScreen} 
          options={{ title: 'Visualizar Contrato' }} 
        />
        <Stack.Screen 
          name="Cardapio" 
          component={CardapioScreen} 
          options={{ title: 'Gerenciar Cardápio' }} 
        />
        <Stack.Screen 
          name="ConfiguracaoClausulaContrato" 
          component={ConfiguracaoClausulaContratoScreen} 
          options={{ title: 'Configuração de Cláusulas' }} 
        />
        <Stack.Screen 
          name="VisualizarContrato" 
          component={VisualizarContratoScreen} 
          options={{ title: 'ver Contrato' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}