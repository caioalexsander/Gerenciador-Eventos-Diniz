import React, { useState } from 'react';
import { View, StyleSheet, Alert, Button, Text } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { compartilharPDF } from '../components/pdf/compartilharPDF';
import { abrirPDF } from '../components/pdf/abrirPDF';
import { confirmarExclusao } from '../components/contrato/deletarContrato';
import { ContratosService } from '../services/contratos.service';

export default function VisualizarPDFScreen({ route, navigation }: any) {
  const params = route.params || {};
  const { pdfUrl, contrato } = params;
  const [loading, setLoading] = useState(false);

  const handleAssinaturaManual = async () => {
    try {
      setLoading(true);

      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets?.length) return;

      const pdfSelecionado = result.assets[0];

      Alert.alert(
        "Assinatura Manual",
        "Deseja substituir o contrato atual com este PDF assinado?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Continuar",
            onPress: async () => {
              try {
                // ✅ CHAMADA CORRETA (2 parâmetros)
                const response = await ContratosService.uploadAssinaturaManual(
                  contrato.id,
                  pdfSelecionado
                );

                if (response?.warning) {
                  Alert.alert(
                    "⚠️ Atenção",
                    response.message,
                    [
                      { text: "Cancelar", style: "cancel" },
                      { 
                        text: "Prosseguir mesmo assim", 
                        style: "destructive",
                        onPress: () => {
                          Alert.alert("Sucesso", "Contrato atualizado com assinatura manual!");
                          navigation.goBack();
                        }
                      }
                    ]
                  );
                } else {
                  Alert.alert("✅ Sucesso", "Contrato assinado manualmente com sucesso!", [
                    { text: "OK", onPress: () => navigation.goBack() }
                  ]);
                }
              } catch (err: any) {
                console.error(err);
                Alert.alert("Erro", "Falha ao processar a assinatura manual.");
              }
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert("Erro", "Não foi possível selecionar o arquivo.");
    } finally {
      setLoading(false);
    }
  };

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
      <Button title="Assinatura Manual" onPress={handleAssinaturaManual} disabled={loading} color="#28A745"/>
      
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