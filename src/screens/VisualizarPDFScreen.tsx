import React, { useState } from 'react';
import { View, StyleSheet, Alert, Button, ActivityIndicator, Text } from 'react-native';
import Pdf from 'react-native-pdf';
import * as Sharing from 'expo-sharing';

export default function VisualizarPDFScreen({ route, navigation }: any) {
  const { pdfUrl } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  console.log('Carregando PDF:', pdfUrl); // Para debug

  const compartilharPDF = async () => {
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(pdfUrl);
      } else {
        Alert.alert('Compartilhamento não disponível');
      }
    } catch (e) {
      Alert.alert('Erro ao compartilhar');
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#000" />
          <Text style={{ marginTop: 10 }}>Carregando PDF...</Text>
        </View>
      )}

      <Pdf
        source={{ uri: pdfUrl, cache: true }}
        style={styles.pdf}
        trustAllCerts={true}
        onLoadComplete={() => setLoading(false)}
        onError={(error) => {
          console.log('PDF Error:', error);
          setLoading(false);
          setError(true);
          Alert.alert('Erro', 'Não foi possível carregar o PDF. Verifique sua internet.');
        }}
        onPressLink={(uri) => console.log('Link pressionado:', uri)}
      />

      <View style={styles.buttons}>
        <Button title="🔄 Recarregar" onPress={() => navigation.replace('VisualizarPDF', { pdfUrl })} />
        <Button title="📤 Compartilhar PDF" onPress={compartilharPDF} color="#4CAF50" />
        <Button title="Voltar" onPress={() => navigation.goBack()} color="#666" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  pdf: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    zIndex: 10
  },
  buttons: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd'
  }
});