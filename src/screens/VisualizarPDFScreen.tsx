import React from 'react';
import { View, StyleSheet, Alert, Button, Text } from 'react-native';

import { compartilharPDF } from '../components/pdf/compartilharPDF';
import { abrirPDF } from '../components/pdf/abrirPDF';
import { confirmarExclusao } from '../components/contrato/deletarContrato';

export default function VisualizarPDFScreen({ route, navigation }: any) {
  const params = route.params || {};
  const { pdfUrl, contrato } = params;

  const editarContrato = () => {
    if (!contrato || !contrato.id) {
      Alert.alert('Erro', 'Dados do contrato não encontrados. Tente novamente.');
      console.log('Params recebidos:', params); // Para debug
      return;
    }

    navigation.navigate('NovoContrato', { 
      contratoParaEditar: contrato 
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contrato Gerado</Text>
      <Text style={styles.subtitle}>Toque no botão abaixo para visualizar o PDF</Text>

      <Button title="📄 Abrir PDF" onPress={() =>abrirPDF(pdfUrl)} color="#2196F3" />
      <Button title="📤 Compartilhar PDF" onPress={() => compartilharPDF(pdfUrl)} color="#4CAF50" />
      <Button title="✏️ Editar Contrato" onPress={editarContrato} color="#FF9800" />
      <Button title="🗑️ Deletar Contrato" onPress={ () => confirmarExclusao({ id: contrato.id, pdfUrl, onSuccess: () => navigation.goBack(),})} color="#ff000d"/>

      <View style={{ marginTop: 30 }}>
        <Button title="← Voltar" onPress={() => navigation.goBack()} color="#666" />
      </View>
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
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, textAlign: 'center', marginBottom: 30, color: '#666' }
});