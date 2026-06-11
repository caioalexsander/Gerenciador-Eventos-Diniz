import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../services/supabase';
import { Picker } from '@react-native-picker/picker';

interface ModeloContrato {
  id: number;
  titulo: string;
  texto_completo: string;
  tipo_de_clausula: string;
}

const ConfiguracaoClausulaContratoScreen: React.FC = () => {
  const [modelos, setModelos] = useState<ModeloContrato[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<ModeloContrato | null>(null);

  const [titulo, setTitulo] = useState('');
  const [textoCompleto, setTextoCompleto] = useState('');
  const [tipoDeClausula, setTipoDeClausula] = useState<'C_P' | 'C_T' | 'C_C'>('C_P'); 
  const [textHeight, setTextHeight] = useState(160); // Altura inicial

  const carregarModelos = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('modelo_contrato')
      .select('*')
      .order('titulo', { ascending: true });

    if (error) {
      Alert.alert('Erro', 'Não foi possível carregar as cláusulas.');
      console.error(error);
    } else {
      setModelos(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarModelos();
  }, []);

  // ==================== SUBSTITUA APENAS ESSAS PARTES ====================

// 1. Dentro do salvarClausula (substitua a função inteira):
  const salvarClausula = async () => {
    if (!titulo.trim() || !textoCompleto.trim()) {
      Alert.alert('Atenção', 'Título e texto são obrigatórios!');
      return;
    }

    if (editingItem) {
      const { error } = await supabase
        .from('modelo_contrato')
        .update({ 
          titulo, 
          texto_completo: textoCompleto,
          tipo_de_clausula: tipoDeClausula   // ← ADICIONADO
        })
        .eq('id', editingItem.id);

      if (error) Alert.alert('Erro', 'Não foi possível atualizar.');
      else Alert.alert('Sucesso', 'Cláusula atualizada!');
    } else {
      const { error } = await supabase
        .from('modelo_contrato')
        .insert([{ 
          titulo, 
          texto_completo: textoCompleto,
          tipo_de_clausula: tipoDeClausula    // ← ADICIONADO
        }]);

      if (error) Alert.alert('Erro', 'Não foi possível criar.');
      else Alert.alert('Sucesso', 'Cláusula criada!');
    }

    setModalVisible(false);
    setEditingItem(null);
    setTitulo('');
    setTextoCompleto('');
    setTipoDeClausula('C_P');        // ← ADICIONADO
    setTextHeight(160);
    carregarModelos();
  };

  const editarClausula = (item: ModeloContrato) => {
    setEditingItem(item);
    setTitulo(item.titulo);
    setTextoCompleto(item.texto_completo);
    setTipoDeClausula(item.tipo_de_clausula as 'C_P' | 'C_T' | 'C_C');
    setTextHeight(160); // Reset altura ao editar
    setModalVisible(true);
  };

  const excluirClausula = (id: number) => {
    Alert.alert('Confirmar', 'Deseja excluir esta cláusula?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          const { error } = await supabase.from('modelo_contrato').delete().eq('id', id);
          if (error) Alert.alert('Erro', 'Não foi possível excluir.');
          else carregarModelos();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuração de Cláusulas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setEditingItem(null);
            setTitulo('');
            setTextoCompleto('');
            setTipoDeClausula('C_P');
            setTextHeight(160);
            setModalVisible(true);
          }}
        >
          <Text style={styles.addButtonText}>+ Nova</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0066cc" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={modelos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.titulo}</Text>
              <Text style={styles.cardText} numberOfLines={4}>
                {item.texto_completo}
              </Text>
              <Text style={{ fontSize: 14, color: '#0066cc', marginBottom: 6 }}>
                Tipo: {item.tipo_de_clausula}
              </Text>
              
              <View style={styles.actions}>
                <TouchableOpacity style={styles.actionButton} onPress={() => editarClausula(item)}>
                  <Text style={styles.editText}>✏️ Editar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton} onPress={() => excluirClausula(item.id)}>
                  <Text style={styles.deleteText}>🗑 Excluir</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Nenhuma cláusula cadastrada ainda.</Text>
          }
        />
      )}

      {/* ==================== MODAL ==================== */}
      {modalVisible && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView 
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.scrollContent}
            >
              <Text style={styles.modalTitle}>
                {editingItem ? 'Editar Cláusula' : 'Nova Cláusula'}
              </Text>

              <Text style={styles.label}>Título da Cláusula</Text>
              <TextInput
                style={styles.input}
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ex: Prazo de Entrega"
              />

              <Text style={styles.label}>Tipo de Cláusula</Text>
              <View style={{ borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 12 }}>
                <Picker
                  selectedValue={tipoDeClausula}
                  onValueChange={(itemValue: 'C_P' | 'C_T' | 'C_C') => setTipoDeClausula(itemValue)}
                >
                  <Picker.Item label="C_P - Cláusula de Pagamento" value="C_P" />
                  <Picker.Item label="C_T - Tipo de Evento" value="C_T" />
                  <Picker.Item label="C_C - Categoria cardapio" value="C_C" />
                </Picker>
              </View>

              <Text style={styles.label}>Texto Completo</Text>
              <TextInput
                style={[styles.input, styles.textArea, { height: textHeight }]}
                value={textoCompleto}
                onChangeText={setTextoCompleto}
                placeholder="Digite o texto completo da cláusula..."
                multiline
                textAlignVertical="top"
                onContentSizeChange={(event) => {
                  setTextHeight(Math.max(160, event.nativeEvent.contentSize.height + 20));
                }}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => {
                    setModalVisible(false);
                    setEditingItem(null);
                    setTitulo('');
                    setTextoCompleto('');
                    setTipoDeClausula('C_P');
                    setTextHeight(160);
                  }}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.button, styles.saveButton]}
                  onPress={salvarClausula}
                >
                  <Text style={styles.buttonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ConfiguracaoClausulaContratoScreen;

// ==================== STYLES ====================
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f4f4f4' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#0066cc',
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  addButton: {
    backgroundColor: '#0052a3',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  card: {
    backgroundColor: '#fff',
    margin: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8 },
  cardText: { fontSize: 15, color: '#555', lineHeight: 20 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 16 },
  actionButton: { padding: 6 },
  editText: { color: '#0066cc', fontWeight: '600' },
  deleteText: { color: '#cc0000', fontWeight: '600' },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#888', fontSize: 16 },

  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '90%',
    borderRadius: 12,
    padding: 20,
    maxHeight: '85%',
  },

  scrollContent: {
    paddingBottom: 20, 
  },

  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  label: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    minHeight: 160,
  },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 },
  button: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center', marginHorizontal: 6 },
  saveButton: { backgroundColor: '#0066cc' },
  cancelButton: { backgroundColor: '#999' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});