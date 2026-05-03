import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { supabase } from '../services/supabase';

export default function NovoContratoScreen({ navigation }: any) {
  const [form, setForm] = useState({
    cliente_nome: '',
    cliente_contato: '',
    data_evento: '',
    hora_inicio: '',
    cardapio: '',
    valor_total: '',
    observacoes: '',
  });

  const [loading, setLoading] = useState(false);

  const atualizarCampo = (campo: string, valor: string) => {
    setForm({ ...form, [campo]: valor });
  };

  const gerarContrato = async () => {
    if (!form.cliente_nome || !form.data_evento || !form.valor_total) {
      Alert.alert('Atenção', 'Preencha pelo menos Nome do Cliente, Data e Valor');
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from('contratos')
      .insert({
        ...form,
        status: 'pendente',
        valor_total: parseFloat(form.valor_total),
      })
      .select();

    if (error) {
      Alert.alert('Erro', error.message);
    } else {
      Alert.alert('Sucesso!', 'Contrato salvo! (PDF será gerado em breve)');
      navigation.goBack(); // volta para Home
    }

    setLoading(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Novo Contrato</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        value={form.cliente_nome}
        onChangeText={(t) => atualizarCampo('cliente_nome', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Contato (telefone/email)"
        value={form.cliente_contato}
        onChangeText={(t) => atualizarCampo('cliente_contato', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Data do Evento (DD/MM/AAAA)"
        value={form.data_evento}
        onChangeText={(t) => atualizarCampo('data_evento', t)}
      />

      <TextInput
        style={styles.input}
        placeholder="Hora de Início (ex: 19:00)"
        value={form.hora_inicio}
        onChangeText={(t) => atualizarCampo('hora_inicio', t)}
      />

      <TextInput
        style={[styles.input, { height: 100 }]}
        placeholder="Cardápio / Serviços"
        value={form.cardapio}
        onChangeText={(t) => atualizarCampo('cardapio', t)}
        multiline
      />

      <TextInput
        style={styles.input}
        placeholder="Valor Total (R$)"
        value={form.valor_total}
        onChangeText={(t) => atualizarCampo('valor_total', t)}
        keyboardType="numeric"
      />

      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Observações"
        value={form.observacoes}
        onChangeText={(t) => atualizarCampo('observacoes', t)}
        multiline
      />

      <Button 
        title={loading ? "Salvando..." : "💾 Salvar e Gerar Contrato"} 
        onPress={gerarContrato} 
        disabled={loading}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ccc', 
    padding: 12, 
    marginBottom: 12, 
    borderRadius: 8,
    backgroundColor: '#fff'
  }
});