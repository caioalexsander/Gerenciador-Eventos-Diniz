import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useContratoVisualizar } from '../../hooks/useContratoVisualizar';
import { formatarData } from '../../utils/formatadores/data';
import { formatarMoeda } from '../../utils/formatadores/moeda';

type VisualizarContratoScreenRouteProp = RouteProp<
  { VisualizarContrato: { contratoId: string } },
  'VisualizarContrato'
>;

export default function VisualizarContratoScreen() {
  const route = useRoute<VisualizarContratoScreenRouteProp>();
  const { contratoId } = route.params;

  const { contrato, loading, error } = useContratoVisualizar(contratoId);

  if (loading) return <Text style={styles.loading}>Carregando informações do contrato...</Text>;
  if (error) return <Text style={styles.error}>Erro: {error}</Text>;
  if (!contrato) return <Text>Contrato não encontrado.</Text>;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.titulo}>Informações do Contrato</Text>

        <InfoRow label="ID" value={contrato.id?.toString() || '—'} />
        <InfoRow label="Contratante" value={contrato.nome_contratante || '—'} />
        <InfoRow label="CPF" value={contrato.cpf_contratante || '—'} />
        <InfoRow label="Residência" value={contrato.residencia_contratante || '—'} />
        <InfoRow label="Data do Evento" value={formatarData(contrato.data_evento)} />
        <InfoRow label="Horário Início" value={contrato.hora_inicio || '—'} />
        <InfoRow label="Horário Fim" value={contrato.hora_fim || '—'} />
        <InfoRow label="Local" value={contrato.local_evento || '—'} />
        <InfoRow label="Tipo de Evento" value={contrato.tipo_evento || '—'} />
        <InfoRow label="Nº Convidados" value={contrato.num_convidados?.toString() || '—'} />
        <InfoRow label="Preço Total" value={formatarMoeda(Number(contrato.preco_total) || 0)} />
        <InfoRow label="Observações" value={contrato.observacoes || '—'} />
      </View>
    </ScrollView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string | number }) => (
  <View style={styles.row}>
    <Text style={styles.label}>{label}:</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    elevation: 3,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: { fontWeight: '600', color: '#555', flex: 1 },
  value: { flex: 1, textAlign: 'right', color: '#333' },
  loading: { flex: 1, textAlign: 'center', marginTop: 50, fontSize: 16 },
  error: { flex: 1, textAlign: 'center', marginTop: 50, color: 'red', fontSize: 16 },
});