import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useRoute, RouteProp } from '@react-navigation/native';
import { useContratoVisualizar } from '../../hooks/useContratoVisualizar';
import { formatarDataVisualizar } from '../../utils/formatadores/dataVisualizar';
import { formatarMoeda } from '../../utils/formatadores/moeda';

type VisualizarContratoScreenRouteProp = RouteProp<
  { VisualizarContrato: { contratoId: string } },
  'VisualizarContrato'
>;

export default function VisualizarContratoScreen() {
  const route = useRoute<VisualizarContratoScreenRouteProp>();
  const { contratoId } = route.params;

  const { contrato, loading, error } = useContratoVisualizar(contratoId);

  if (loading) return <Text style={styles.loading}>Carregando informações...</Text>;
  if (error) return <Text style={styles.error}>Erro: {error}</Text>;
  if (!contrato) return <Text>Contrato não encontrado.</Text>;

  // === Preparar Cardápio ===
  let cardapioSelecionado: any[] = [];
  let rawData = contrato.cardapio_selecionado;

  if (rawData) {
    try {
      cardapioSelecionado = typeof rawData === 'string' 
        ? JSON.parse(rawData) 
        : Array.isArray(rawData) 
          ? rawData 
          : [];
    } catch (e) {
      console.error('Erro ao parsear cardapio_selecionado:', e);
    }
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}   // ← Adicionado aqui
    >
      <View style={styles.card}>
        <Text style={styles.titulo}>Informações do Contrato</Text>

        <InfoRow label="ID" value={contrato.id?.toString() || '—'} />
        <InfoRow label="Contratante" value={contrato.nome_contratante || '—'} />
        <InfoRow label="CPF" value={contrato.cpf_contratante || '—'} />
        <InfoRow label="Residência" value={contrato.residencia_contratante || '—'} />
        <InfoRow label="Data do Evento" value={formatarDataVisualizar(contrato.data_evento)} />
        <InfoRow label="Horário Início" value={contrato.hora_inicio || '—'} />
        <InfoRow label="Horário Fim" value={contrato.hora_fim || '—'} />
        <InfoRow label="Duraçao" value={contrato.duracao || '—'} />
        <InfoRow label="Local" value={contrato.local_evento || '—'} />
        <InfoRow label="Tipo de Evento" value={contrato.tipo_evento || '—'} />
        <InfoRow label="Nº Convidados" value={contrato.num_convidados?.toString() || '—'} />
        <InfoRow label="Preço Por Convidados" value={formatarMoeda(Number(contrato.preco_por_convidado) || 0)} />
        <InfoRow label="Preço Total" value={formatarMoeda(Number(contrato.preco_total) || 0)} />

        {/* CARDÁPIO SELECIONADO */}
        <View style={styles.cardapioSection}>
          <Text style={styles.subtitulo}>Cardápio Selecionado</Text>

          {cardapioSelecionado.length > 0 ? (
            cardapioSelecionado.map((item: any, index: number) => {
              const nomeItem = item.nome || JSON.stringify(item).slice(0, 60);
              return (
                <View key={index} style={styles.cardapioItem}>
                  <Text style={styles.itemNome}>• {nomeItem}</Text>          
                </View>
              );
            })
          ) : (
            <Text style={styles.semCardapio}>Nenhum cardápio selecionado.</Text>
          )}
        </View>
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
  container: { 
    flex: 1, 
    backgroundColor: '#f5f5f5' 
  },
  contentContainer: {   // ← Novo estilo adicionado
    padding: 16,
    paddingBottom: 80,   // ← Espaço extra no final da tela
  },
  card: { 
    backgroundColor: '#fff', 
    borderRadius: 12, 
    padding: 20, 
    elevation: 3 
  },
  titulo: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  subtitulo: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginTop: 25, 
    marginBottom: 12 
  },
  row: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingVertical: 12, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  label: { fontWeight: '600', color: '#555', flex: 1 },
  value: { flex: 1, textAlign: 'right', color: '#333' },

  cardapioSection: { marginTop: 15 },
  cardapioItem: { 
    backgroundColor: '#f9f9f9', 
    padding: 12, 
    borderRadius: 8, 
    marginBottom: 10 
  },
  itemNome: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  semCardapio: { fontStyle: 'italic', color: '#999', textAlign: 'center' },
  loading: { flex: 1, textAlign: 'center', marginTop: 50 },
  error: { flex: 1, textAlign: 'center', marginTop: 50, color: 'red' },
});