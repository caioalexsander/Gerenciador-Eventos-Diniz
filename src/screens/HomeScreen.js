import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao Gerenciador Diniz</Text>
      
      <Button 
        title="Novo Contrato" 
        onPress={() => navigation.navigate('NovoContrato')} 
      />
      
      <Button 
        title="Meus Contratos" 
        onPress={() => alert('Em breve')} 
        color="#666"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' }
});