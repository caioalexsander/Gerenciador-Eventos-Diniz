import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciador de Eventos Diniz</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="➕ Novo Contrato" 
          onPress={() => navigation.navigate('NovoContrato')} 
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button 
          title="📋 Meus Contratos" 
          onPress={() => navigation.navigate('MeusContratos')} 
          color="#2196F3"
        />
      </View>

      <View style={styles.buttonContainer}>
      <Button 
        title="🍽️ Gerenciar Cardápio"
        onPress={() => navigation.navigate('Cardapio')} 
        color="#2196F3"
      />
    </View>

      <Button 
        title="Sair" 
        onPress={() => navigation.replace('Login')} 
        color="red"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#f9f9f9'
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 40 
  },
  buttonContainer: {
    width: '80%',
    marginVertical: 10
  }
});