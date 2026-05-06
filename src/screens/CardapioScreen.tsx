import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, TextInput, Button } from 'react-native';
import { supabase } from '../services/supabase';

export default function CardapioScreen() {
  const [itens, setItens] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [mostrarForm, setMostrarForm] = useState(false);
  
  const [novoItem, setNovoItem] = useState({ nome: '', descricao: '', preco: '' });
  const [editandoId, setEditandoId] = useState<string | null>(null);

  const carregarCardapio = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('cardapio')
      .select('*')
      .order('nome');

    if (error) {
      console.error("Erro ao carregar:", error);
      Alert.alert('Erro', error.message);
    } else {
      setItens(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    carregarCardapio();
  }, []);

  const salvarItem = async () => {
    if (!novoItem.nome.trim()) {
      Alert.alert('Atenção', 'Nome é obrigatório!');
      return;
    }

    setLoading(true);
    console.log("Tentando salvar:", novoItem);

    let error;

    if (editandoId) {
      ({ error } = await supabase.from('cardapio').update(novoItem).eq('id', editandoId));
    } else {
      ({ error } = await supabase.from('cardapio').insert(novoItem));
    }

    if (error) {
      console.error("Erro ao salvar:", error);
      Alert.alert('Erro ao salvar', error.message);
    } else {
      Alert.alert('Sucesso!', editandoId ? 'Item atualizado' : 'Item adicionado com sucesso!');
      setNovoItem({ nome: '', descricao: '', preco: '' });
      setEditandoId(null);
      setMostrarForm(false);
      carregarCardapio();
    }

    setLoading(false);
  };

  const editarItem = (item: any) => {
    setNovoItem({
      nome: item.nome,
      descricao: item.descricao || '',
      preco: item.preco ? item.preco.toString() : ''
    });
    setEditandoId(item.id);
    setMostrarForm(true);
  };

  const deletarItem = (id: string, nome: string) => {
    Alert.alert('Confirmar Exclusão', `Deseja realmente deletar "${nome}"?`, [
      { text: 'Cancelar' },
      { 
        text: 'Deletar', 
        style: 'destructive',
        onPress: async () => {
          await supabase.from('cardapio').delete().eq('id', id);
          carregarCardapio();
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerenciar Cardápio</Text>

      {/* Botão Adicionar no topo */}
      <TouchableOpacity 
        style={styles.btnAdicionar} 
        onPress={() => {
          setNovoItem({ nome: '', descricao: '', preco: '' });
          setEditandoId(null);
          setMostrarForm(true);
        }}
      >
        <Text style={styles.btnAdicionarText}>➕ Adicionar Novo Item</Text>
      </TouchableOpacity>

      {/* Formulário */}
      {mostrarForm && (
        <View style={styles.formulario}>
          <Text style={styles.formTitle}>{editandoId ? 'Editar Item' : 'Novo Item'}</Text>
          
          <TextInput
            style={styles.input}
            placeholder="Nome do Item *"
            value={novoItem.nome}
            onChangeText={(t) => setNovoItem({...novoItem, nome: t})}
          />
          <TextInput
            style={styles.input}
            placeholder="Descrição (opcional)"
            value={novoItem.descricao}
            onChangeText={(t) => setNovoItem({...novoItem, descricao: t})}
          />
          <TextInput
            style={styles.input}
            placeholder="Preço (R$)"
            value={novoItem.preco}
            onChangeText={(t) => setNovoItem({...novoItem, preco: t})}
            keyboardType="numeric"
          />

          <View style={styles.formButtons}>
            <Button title="Cancelar" onPress={() => setMostrarForm(false)} color="#666" />
            <Button title={editandoId ? "Atualizar" : "Adicionar"} onPress={salvarItem} />
          </View>
        </View>
      )}

      {/* Lista de Itens */}
      {loading ? (
        <Text>Carregando cardápio...</Text>
      ) : itens.length === 0 ? (
        <Text style={styles.vazio}>Nenhum item cadastrado ainda.</Text>
      ) : (
        <FlatList
          data={itens}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.itemCard} onPress={() => editarItem(item)}>
              <View style={styles.itemInfo}>
                <Text style={styles.itemNome}>{item.nome}</Text>
                {item.descricao && <Text style={styles.itemDesc}>{item.descricao}</Text>}
                {item.preco && <Text style={styles.itemPreco}>R$ {item.preco}</Text>}
              </View>
              <TouchableOpacity onPress={() => deletarItem(item.id, item.nome)}>
                <Text style={{ color: 'red', fontSize: 18 }}>🗑</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  btnAdicionar: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 10, alignItems: 'center', marginBottom: 15 },
  btnAdicionarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  formulario: { backgroundColor: '#fff', padding: 15, borderRadius: 10, marginBottom: 15 },
  formTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 10, borderRadius: 8 },
  formButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  itemCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemInfo: { flex: 1 },
  itemNome: { fontSize: 18, fontWeight: 'bold' },
  itemDesc: { color: '#666', marginTop: 4 },
  itemPreco: { color: '#28A745', fontWeight: 'bold', marginTop: 4 },
  vazio: { textAlign: 'center', marginTop: 50, fontSize: 16, color: '#666' }
});