import React from 'react';
import { View, Text,TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Props {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  clausulasBase: Record<string, string>;
}

export default function ClausulaPagamentoSelector({ form, setForm, clausulasBase }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cláusula de Pagamento</Text>
      <Picker
        selectedValue={form.clausula_pagamento}
        onValueChange={(value) => {
          setForm((prev: any) => ({
            ...prev,
            clausula_pagamento: value,
            clausula_texto: clausulasBase[value] || '',
          }));
        }}
        style={styles.picker}
      >
        {Object.keys(clausulasBase).map((key) => (
          <Picker.Item key={key} label={key} value={key} />
        ))}
      </Picker>

      <Text style={styles.label}>Texto da Cláusula</Text>
      <TextInput
        style={[styles.input, { height: 100, textAlignVertical: 'top' }]}
        value={form.clausula_texto}
        onChangeText={(text) => setForm((prev: any) => ({ ...prev, clausula_texto: text }))}
        multiline
      />
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
  picker: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8 },
});