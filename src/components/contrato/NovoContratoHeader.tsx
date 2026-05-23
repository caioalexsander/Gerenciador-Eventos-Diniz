import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface NovoContratoHeaderProps {
  isEditing: boolean;
}

export default function NovoContratoHeader({ isEditing }: NovoContratoHeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={styles.title}>
        {isEditing ? 'Editar Contrato' : 'Novo Contrato'}
      </Text>
      <Text style={styles.subtitle}>
        {isEditing 
          ? 'Atualize as informações do contrato' 
          : 'Preencha os dados para gerar o contrato'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});