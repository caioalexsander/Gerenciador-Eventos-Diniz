import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { formatarData } from '../../../utils/formatadores/data';
import { formatarHora } from '../../../utils/formatadores/hora';

interface Props {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  tiposEvento: string[];
}

export default function ContratoFormFields({ form, setForm, tiposEvento }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome do Contratante</Text>
      <TextInput
        style={styles.input}
        value={form.nome_contratante}
        onChangeText={(text) => setForm((prev: any) => ({ ...prev, nome_contratante: text }))}
        placeholder="Nome completo"
      />

      <Text style={styles.label}>CPF do Contratante</Text>
      <TextInput
        style={styles.input}
        value={form.cpf_contratante}
        onChangeText={(text) => setForm((prev: any) => ({ ...prev, cpf_contratante: text }))}
        keyboardType="numeric"
        placeholder="000.000.000-00"
        maxLength={14}
      />

      <Text style={styles.label}>Residência / Endereço</Text>
      <TextInput
        style={styles.input}
        value={form.residencia_contratante}
        onChangeText={(text) => setForm((prev: any) => ({ ...prev, residencia_contratante: text }))}
        placeholder="Endereço completo"
      />

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Data do Evento</Text>
          <TextInput
            style={styles.input}
            value={form.data_evento}
            onChangeText={(text) => formatarData(text, setForm)}
            placeholder="DD/MM/AAAA"
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <View style={styles.half}>
          <Text style={styles.label}>Tipo de Evento</Text>
          <Picker
            selectedValue={form.tipo_evento}
            onValueChange={(value) => setForm((prev: any) => ({ ...prev, tipo_evento: value }))}
            style={styles.picker}
          >
            {tiposEvento.map((tipo, index) => (
              <Picker.Item key={index} label={tipo} value={tipo} />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.half}>
          <Text style={styles.label}>Hora Início</Text>
          <TextInput
            style={styles.input}
            value={form.hora_inicio}
            onChangeText={(text) => formatarHora(text, 'hora_inicio', setForm)}
            placeholder="HH:MM"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View style={styles.half}>
          <Text style={styles.label}>Hora Fim</Text>
          <TextInput
            style={styles.input}
            value={form.hora_fim}
            onChangeText={(text) => formatarHora(text, 'hora_fim', setForm)}
            placeholder="HH:MM"
            keyboardType="numeric"
            maxLength={5}
          />
        </View>
      </View>
        
        <Text style={styles.label}>duraçao Do Evento</Text>
          <TextInput
            style={styles.input}
            value={form.duracao}
            onChangeText={(text) => setForm((prev: any) => ({ ...prev, duracao: text }))}
            placeholder="HH:MM"
            keyboardType="numeric"
            maxLength={5}
          />

      <Text style={styles.label}>Local do Evento</Text>
      <TextInput
        style={styles.input}
        value={form.local_evento}
        onChangeText={(text) => setForm((prev: any) => ({ ...prev, local_evento: text }))}
        placeholder="Endereço do evento"
      />

      <Text style={styles.label}>Número de Convidados</Text>
      <TextInput
        style={styles.input}
        value={form.num_convidados}
        onChangeText={(text) => setForm((prev: any) => ({ ...prev, num_convidados: text }))}
        keyboardType="numeric"
        placeholder="Quantidade de convidados"
      />

      <Text style={styles.label}>Preço por Convidado (R$)</Text>
      <TextInput
        style={styles.input}
        value={form.preco_por_convidado}
        onChangeText={(text) => setForm((prev: any) => ({ ...prev, preco_por_convidado: text }))}
        keyboardType="numeric"
        placeholder="Valor por pessoa"
      />

      <Text style={styles.label}>Preço Total (R$)</Text>
      <TextInput
        style={styles.input}
        value={form.preco_total}
        onChangeText={(text) => setForm((prev: any) => ({ ...prev, preco_total: text }))}
        keyboardType="numeric"
        placeholder="Valor total do contrato"
      />

      <Text style={styles.label}>Tipo de Assinatura</Text>
      <Picker
        selectedValue={form.assinatura}
        onValueChange={(value) => setForm((prev: any) => ({ ...prev, assinatura: value }))}
        style={styles.picker}
      >
        <Picker.Item label="Assinatura Digital" value="Digital" />
        <Picker.Item label="Assinatura Manual" value="Manual" />
      </Picker>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: '600', marginTop: 12, marginBottom: 6, color: '#333' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  half: { flex: 1 },
  picker: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
});