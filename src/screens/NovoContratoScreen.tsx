import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, Alert, Switch } from 'react-native';
import { Picker } from '@react-native-picker/picker'; 
import { supabase } from '../services/supabase';
import api from '../services/api';

export default function NovoContratoScreen({ navigation }: any) {
  const [form, setForm] = useState({
    nome_contratante: '',
    cpf_contratante: '',
    residencia_contratante: '',
    data_evento: '',
    hora_inicio: '',
    hora_fim: '',
    duracao: '',
    local_evento: '',
    tipo_evento: 'Tipo 1',
    num_convidados: '',
    preco_por_convidado: '',
    preco_total: '',
    clausula_pagamento: 'Opção 1',
    assinatura: 'Manual',
    cardapio_selecionado: [] as string[],
    observacoes: '',
  });

  const [loading, setLoading] = useState(false);

  // Opções
  const tiposEvento = ['Tipo 1', 'Tipo 2', 'Tipo 3', 'Casamento', 'Aniversário', 'Corporativo'];
  const clausulas = ['Opção 1 - 50% sinal', 'Opção 2 - 30% sinal', 'Opção 3 - Pagamento integral'];
  const assinaturas = ['Manual', 'Digital'];

  const itensCardapio = [
    'Arroz Branco', 'Arroz com Ervas', 'Feijão', 'Carne Assada', 'Frango Grelhado', 
    'Salada Verde', 'Batata Frita', 'Macarrão', 'Lasanha', 'Pudim', 'Bolo', 
    // Adicione mais aqui...
  ];

  const toggleItem = (item: string) => {
    if (form.cardapio_selecionado.includes(item)) {
      setForm({
        ...form,
        cardapio_selecionado: form.cardapio_selecionado.filter(i => i !== item)
      });
    } else {
      setForm({
        ...form,
        cardapio_selecionado: [...form.cardapio_selecionado, item]
      });
    }
  };

  const calcularTotal = () => {
    const total = Number(form.num_convidados) * Number(form.preco_por_convidado);
    setForm({ ...form, preco_total: total ? total.toFixed(2) : '' });
  };

  const salvarContrato = async () => {
    if (!form.nome_contratante || !form.data_evento) {
        Alert.alert('Atenção', 'Nome da contratante e data do evento são obrigatórios');
        return;
    }

    setLoading(true);

    try {
        // 1. Salvar no Banco de Dados
        const { error: supabaseError } = await supabase
        .from('contratos')
        .insert({
            ...form,
            preco_total: parseFloat(form.preco_total) || 0,
            cardapio_selecionado: form.cardapio_selecionado,
            status: 'pendente'
        });

        if (supabaseError) {
        Alert.alert('Erro ao salvar', supabaseError.message);
        return;
        }

        // 2. Gerar o PDF no Backend
        const response = await api.post('/gerar-pdf', form);
        
        Alert.alert(
        '✅ Sucesso!', 
        'Contrato salvo com sucesso!\n\nPDF gerado e pronto para download.'
        );

        navigation.goBack();   // Volta para a tela anterior

    } catch (error: any) {
        console.error(error);
        Alert.alert('Erro', 'Ocorreu um erro ao processar o contrato.');
    } finally {
        setLoading(false);
    }
    };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Novo Contrato</Text>

      <TextInput style={styles.input} placeholder="Nome da Contratante" value={form.nome_contratante} onChangeText={(t) => setForm({...form, nome_contratante: t})} />
      <TextInput style={styles.input} placeholder="CPF da Contratante" value={form.cpf_contratante} onChangeText={(t) => setForm({...form, cpf_contratante: t})} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Residência da Contratante" value={form.residencia_contratante} onChangeText={(t) => setForm({...form, residencia_contratante: t})} />

      <TextInput style={styles.input} placeholder="Data do Evento (DD/MM/AAAA)" value={form.data_evento} onChangeText={(t) => setForm({...form, data_evento: t})} />
      
      <TextInput style={styles.input} placeholder="Hora Início (HH:MM)" value={form.hora_inicio} onChangeText={(t) => setForm({...form, hora_inicio: t})} />
      <TextInput style={styles.input} placeholder="Hora Fim (HH:MM)" value={form.hora_fim} onChangeText={(t) => setForm({...form, hora_fim: t})} />
      <TextInput style={styles.input} placeholder="Duração" value={form.duracao} onChangeText={(t) => setForm({...form, duracao: t})} />

      <TextInput style={styles.input} placeholder="Local do Evento" value={form.local_evento} onChangeText={(t) => setForm({...form, local_evento: t})} />

      <Text style={styles.label}>Tipo de Evento</Text>
      <Picker selectedValue={form.tipo_evento} onValueChange={(v) => setForm({...form, tipo_evento: v})}>
        {tiposEvento.map(t => <Picker.Item key={t} label={t} value={t} />)}
      </Picker>

      <TextInput style={styles.input} placeholder="Número de Convidados" value={form.num_convidados} onChangeText={(t) => setForm({...form, num_convidados: t})} keyboardType="numeric" onBlur={calcularTotal} />

      <TextInput style={styles.input} placeholder="Preço por Convidado (R$)" value={form.preco_por_convidado} onChangeText={(t) => setForm({...form, preco_por_convidado: t})} keyboardType="numeric" onBlur={calcularTotal} />

      <TextInput style={styles.input} placeholder="Preço Total" value={form.preco_total} editable={false} />

      <Text style={styles.label}>Cláusula de Pagamento</Text>
      <Picker selectedValue={form.clausula_pagamento} onValueChange={(v) => setForm({...form, clausula_pagamento: v})}>
        {clausulas.map(c => <Picker.Item key={c} label={c} value={c} />)}
      </Picker>

      <Text style={styles.label}>Tipo de Assinatura</Text>
      <Picker selectedValue={form.assinatura} onValueChange={(v) => setForm({...form, assinatura: v})}>
        {assinaturas.map(a => <Picker.Item key={a} label={a} value={a} />)}
      </Picker>

      <Text style={styles.label}>Cardápio (Selecione os itens)</Text>
        {itensCardapio.map(item => (
        <View key={item} style={styles.checkboxContainer}>
          <Switch
            value={form.cardapio_selecionado.includes(item)}
            onValueChange={() => toggleItem(item)}
            trackColor={{ false: "#ccc", true: "#4CAF50" }}
          />
          <Text style={styles.checkboxLabel}>{item}</Text>
        </View>
      ))}

      <Button 
            title={loading ? "Salvando e Gerando PDF..." : "💾 Salvar Contrato e Gerar PDF"} 
            onPress={salvarContrato} 
            disabled={loading} 
        />

        {/* Espaço extra no final da tela */}
        <View style={{ height: 120 }} />

    </ScrollView>
        
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: '#f9f9f9' },
  title: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 12, borderRadius: 8, backgroundColor: '#fff' },
  label: { fontSize: 16, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  checkboxLabel: { marginLeft: 8, fontSize: 16 }
});