import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Props {
  form: any;
  setForm: React.Dispatch<React.SetStateAction<any>>;
  clausulasBase: Record<string, string>;
}

export default function ClausulaPagamentoSelector({ form, setForm, clausulasBase }: Props) {
  const [height, setHeight] = useState(140);
  const textInputRef = useRef<any>(null);

  // Ajusta automaticamente a altura quando o texto muda (incluindo ao carregar edição)
  useEffect(() => {
    if (form.clausula_texto) {
      // Força o cálculo do tamanho do conteúdo
      setTimeout(() => {
        textInputRef.current?.measure((x: number, y: number, width: number, h: number) => {
          if (h > 0) {
            setHeight(Math.min(Math.max(h + 40, 140), 350)); // mínimo 140, máximo 350
          }
        });
      }, 100);
    }
  }, [form.clausula_texto]);

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
        ref={textInputRef}
        style={[styles.input, { height: Math.max(140, height) }]}
        value={form.clausula_texto}
        onChangeText={(text) => 
          setForm((prev: any) => ({ ...prev, clausula_texto: text }))
        }
        multiline
        textAlignVertical="top"
        onContentSizeChange={(event) => {
          const newHeight = event.nativeEvent.contentSize.height;
          setHeight(Math.min(Math.max(newHeight + 30, 140), 350));
        }}
        placeholder="Digite ou edite o texto da cláusula aqui..."
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 6,
    color: '#333',
  },
  picker: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    backgroundColor: '#fff',
    lineHeight: 24,
    minHeight: 140,
    maxHeight: 350,
  },
});