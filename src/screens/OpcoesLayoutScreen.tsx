import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, ImageBackground } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { compartilharPDF } from '../components/pdf/compartilharPDF';
import { abrirPDF } from '../components/pdf/abrirPDF';
import { confirmarExclusao } from '../components/contrato/deletarContrato';
import { ContratosService } from '../services/contratos.service';
import { AssinaturaDigitalButton } from '../components/contrato/AssinaturaDigitalButton';
import { Loading } from '../components/ui/Loading';

export default function OpcoesLayoutScreen({ route, navigation }: any) {
  const params = route.params || {};
  const { pdfUrl, contrato } = params;
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Carregando...');

  /*const handleVisualizarPDF = () => {
    if (pdfUrl) abrirPDF(pdfUrl);
    else Alert.alert('Aviso', 'URL do PDF não disponível.');
  };*/

  const handleVisualizarPDF = async () => {
    if (!pdfUrl) {
      Alert.alert('Aviso', 'URL do PDF não disponível.');
      return;
    }

    try {
      setLoading(true);
      setLoadingMessage('Abrindo PDF...');
      await abrirPDF(pdfUrl);

    } catch (error) {
      Alert.alert('Erro', 'Não foi possível abrir o PDF.');
    } finally {
      setLoading(false);
    }
  };

  /*const handleCompartilhar = () => {
    if (pdfUrl) compartilharPDF(pdfUrl);
  };*/

  const handleCompartilhar = async () => {
    if (!pdfUrl) return;

    try {  
      setLoading(true);
      setLoadingMessage('Preparando compartilhamento...');

      await compartilharPDF(pdfUrl);

    } catch (error) {
      Alert.alert('Erro', 'Falha ao compartilhar PDF.');
    } finally {
      setLoading(false);
    }
  };

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
                const response = await ContratosService.uploadAssinaturaManual(
                  contrato.id,
                  pdfSelecionado
                );

                if (response?.warning) {
                  Alert.alert("⚠️ Atenção", response.message, [
                    { text: "Cancelar", style: "cancel" },
                    { 
                      text: "Prosseguir mesmo assim", 
                      style: "destructive",
                      onPress: () => {
                        Alert.alert("Sucesso", "Contrato atualizado!");
                        navigation.goBack();
                      }
                    }
                  ]);
                } else {
                  Alert.alert("✅ Sucesso", "Contrato assinado manualmente!", [
                    { text: "OK", onPress: () => navigation.goBack() }
                  ]);
                }
              } catch (err: any) {
                console.error(err);
                Alert.alert("Erro", "Falha ao processar assinatura manual.");
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
    if (!contrato?.id) {
      Alert.alert('Erro', 'Dados do contrato não encontrados.');
      return;
    }
    navigation.navigate('NovoContrato', { contratoParaEditar: contrato });
  };

  const deletarContrato = () => {
    confirmarExclusao({
      id: contrato.id,
      pdfUrl,
      onSuccess: () => navigation.goBack(),
    });
  };

  const handleVisualizarContrato = () => {
    if (!contrato?.id) {
      Alert.alert('Erro', 'Dados do contrato não encontrados.');
      return;
    }

    navigation.navigate('VisualizarContrato', { 
      contratoId: contrato.id 
    });
  };

  return (
    <ImageBackground 
      source={require('../../assets/logo-fundo.png')} 
      style={styles.background}
      imageStyle={styles.backgroundImage}   // ← Ajuste aqui
    >
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>Opções do Contrato</Text>
          <Text style={styles.subtitle}>
            {contrato?.nome_contratante || 'Contrato sem nome'}
          </Text>
        </View>

        <View style={styles.grid}>
          <TouchableOpacity style={styles.card} onPress={handleVisualizarPDF}>
            <Text style={styles.icon}>📄</Text>
            <Text style={styles.cardText}>Visualizar PDF</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleVisualizarContrato}>
            <Text style={styles.icon}>📜</Text>
            <Text style={styles.cardText}>Ver Info Contrato</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={handleCompartilhar}>
            <Text style={styles.icon}>📤</Text>
            <Text style={styles.cardText}>Compartilhar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={editarContrato}>
            <Text style={styles.icon}>✏️</Text>
            <Text style={styles.cardText}>Editar Contrato</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={deletarContrato}>
            <Text style={styles.icon}>🗑️</Text>
            <Text style={styles.cardText}>Deletar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => Alert.alert('Em breve', 'pagamento será implementado')}>
            <Text style={styles.icon}>💰</Text>
            <Text style={styles.cardText}>Pagamento</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.card, loading && styles.cardDisabled]} 
            onPress={handleAssinaturaManual}
            disabled={loading}
          >
            <Text style={styles.icon}>✍️</Text>
            <Text style={styles.cardText}>Assinatura Manual</Text>
          </TouchableOpacity>

          <View style={styles.card}>
            <AssinaturaDigitalButton
              contratoId={contrato?.id}
              statusAssinatura={contrato?.status_assinatura}
              onAssinaturaConcluida={() => navigation.goBack()}
            />
          </View>
            
          <TouchableOpacity style={styles.card} onPress={() => navigation.goBack()}>
            <Text style={styles.icon}>←</Text>
            <Text style={styles.cardText}>Voltar</Text>
          </TouchableOpacity>
        </View>
        <Loading
          visible={loading}
          message={loadingMessage}
        />
      </ScrollView>
    </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  backgroundImage: {
    opacity: 0.75,
    width: 430,           // ← Tamanho reduzido
    height: 430,
    resizeMode: 'contain',
    alignSelf: 'center',
    position: 'absolute',
    top: '25%',           // Posição ajustada
  },
  container: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.93)',
  },
  contentContainer: { 
    padding: 16,           // espaçamento lateral e superior
    paddingBottom: 80,     // ← ESPAÇO EXTRA NO FINAL (aqui você controla)
  },
  header: {
    alignItems: 'center',
    paddingVertical: 35,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingHorizontal: 15,
    gap: 18,
  },
  card: {
    width: '42%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    marginVertical: 10,
  },
  cardDisabled: {
    opacity: 0.6,
  },
  icon: {
    fontSize: 38,
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
});