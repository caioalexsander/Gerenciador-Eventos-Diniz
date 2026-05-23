import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

interface Props {
  itensCardapio: any[];
  cardapioSelecionado: string[];
  toggleItem: (nome: string) => void;
}

export default function CardapioSelector({ itensCardapio, cardapioSelecionado, toggleItem }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cardápio Selecionado</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {itensCardapio.map((item) => {
          const isSelected = cardapioSelecionado.includes(item.nome);
          return (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.item,
                isSelected && styles.itemSelected,
              ]}
              onPress={() => toggleItem(item.nome)}
            >
              <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
                {item.nome}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', marginBottom: 10, color: '#333' },
  scroll: { flexDirection: 'row' },
  item: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  itemSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  itemText: { color: '#333', fontWeight: '500' },
  itemTextSelected: { color: '#fff' },
});