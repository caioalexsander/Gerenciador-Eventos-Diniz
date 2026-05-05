import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { supabase } from '../services/supabase';

export default function MeusContratosScreen({ navigation }: any) {
  const [contratos, setContratos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const carregarContratos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('contratos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      setContratos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarContratos();
  }, []);

  const verPDF = (pdfUrl: string) => {
    if (pdfUrl) {
      navigation.navigate('VisualizarPDF', { pdfUrl });
    } else {
      Alert.alert('Aviso', 'Este contrato ainda não possui PDF gerado.');
    }
  };

  const renderContrato = ({ item }: any) => (
    <TouchableOpacity style={styles.card} onPress={() => verPDF(item.pdf_url)}>
      <View style={styles.cardHeader}>
        <Text style={styles.nome}>{item.nome_contratante}</Text>
        <Text style={styles.data}>{item.data_evento}</Text>
      </View>
            
      <Text style={styles.info}>Local Evento: {item.local_evento}</Text>
      <Text style={styles.info}>CPF Contratantes: {item.cpf_contratante}</Text>
      <Text style={styles.info}>Valor Total Do Evento: R$ {item.preco_total}</Text>
      
      <View style={styles.footer}>
        <Text style={styles.status}>Status: {item.status || 'pendente'}</Text>
        {item.pdf_url ? (
          <Text style={styles.pdfDisponivel}>📄 PDF Disponível</Text>
        ) : (
          <Text style={styles.pdfIndisponivel}>PDF não gerado</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.btnAtualizar} onPress={carregarContratos}>
        <Text style={styles.btnText}>🔄 Atualizar Lista</Text>
      </TouchableOpacity>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
      ) : contratos.length === 0 ? (
        <Text style={styles.vazio}>Nenhum contrato encontrado</Text>
      ) : (
        <FlatList
          data={contratos}
          keyExtractor={(item) => item.id}
          renderItem={renderContrato}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9', padding: 15 },
  btnAtualizar: { backgroundColor: '#2196F3', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 15 },
  btnText: { color: '#fff', fontWeight: 'bold' },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#eee'
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  nome: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  data: { fontSize: 16, color: '#666' },
  info: { fontSize: 15, marginVertical: 2, color: '#444' },
  footer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
  status: { fontSize: 15, color: '#28A745', fontWeight: 'bold' },
  pdfDisponivel: { color: '#2196F3', fontWeight: 'bold' },
  pdfIndisponivel: { color: '#FF9800' },
  vazio: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#666' }
});