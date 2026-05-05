import React, { useState } from 'react';
import { View, StyleSheet, Alert, Button, ActivityIndicator, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import * as Sharing from 'expo-sharing';

export default function VisualizarPDFScreen({ route, navigation }: any) {
  const { pdfUrl } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  console.log('🔗 URL do PDF:', pdfUrl);

  const compartilharPDF = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUrl);
      } else {
        Alert.alert('Não foi possível compartilhar');
      }
    } catch (e) {
      Alert.alert('Erro ao compartilhar', 'Tente novamente');
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={styles.loadingText}>Carregando contrato...</Text>
        </View>
      )}

      <Pdf
        source={{ uri: pdfUrl, cache: true }}
        style={styles.pdf}
        trustAllCerts={true}
        onLoadComplete={(numberOfPages, path) => {
          console.log(`PDF carregado! ${numberOfPages} páginas`);
          setLoading(false);
        }}
        onError={(error) => {
          console.log('Erro no PDF:', error);
          setLoading(false);
          setError('Não foi possível carregar o PDF');
          Alert.alert('Erro', 'Falha ao carregar o PDF. Verifique sua conexão.');
        }}
      />

      <View style={styles.buttonContainer}>
        <Button title="🔄 Recarregar" onPress={() => navigation.replace('VisualizarPDF', { pdfUrl })} />
        <Button title="📤 Compartilhar" onPress={compartilharPDF} color="#28A745" />
        <Button title="← Voltar" onPress={() => navigation.goBack()} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8f8f8' },
  pdf: { flex: 1, backgroundColor: '#ffffff' },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    zIndex: 999
  },
  loadingText: { marginTop: 15, fontSize: 16 },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  }
});