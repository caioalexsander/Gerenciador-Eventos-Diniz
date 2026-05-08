import React from 'react';
import { View, StyleSheet, Alert, Button, Text } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

export default function VisualizarPDFScreen({ route, navigation }: any) {
  const { pdfUrl } = route.params;

  const abrirPDF = async () => {
    try {
      await WebBrowser.openBrowserAsync(pdfUrl);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o PDF');
      console.error(error);
    }
  };

  const compartilharPDF = async () => {
    try {
      if (!pdfUrl) {
        Alert.alert('Erro', 'PDF não encontrado.');
        return;
      }

      const fileUri =
        FileSystem.cacheDirectory + 'contrato.pdf';

      const download =
        await FileSystem.downloadAsync(
          pdfUrl,
          fileUri
        );

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(download.uri);
      } else {
        Alert.alert('PDF', pdfUrl);
      }

    } catch (error) {
      console.error(error);
      Alert.alert(
        'Erro',
        'Não foi possível compartilhar o PDF.'
      );
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contrato Gerado</Text>
      <Text style={styles.subtitle}>Toque no botão abaixo para visualizar o PDF</Text>

      <Button title="📄 Abrir PDF no Navegador" onPress={abrirPDF} color="#2196F3" />
      <Button title="📤 Compartilhar PDF" onPress={compartilharPDF} color="#4CAF50" />
      
      <View style={{ marginTop: 20 }}>
                  
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