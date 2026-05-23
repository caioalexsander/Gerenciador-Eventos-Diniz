import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

interface Props {
  itensCardapio: any[];
  cardapioSelecionado: string[];
  toggleItem: (nome: string) => void;
}

export default function CardapioSelector({ itensCardapio, cardapioSelecionado, toggleItem }: Props) {
  const renderItem = ({ item }: { item: any }) => {
    const isSelected = cardapioSelecionado.includes(item.nome);

    return (
      <TouchableOpacity
        style={[
          styles.item,
          isSelected && styles.itemSelected,
        ]}
        onPress={() => toggleItem(item.nome)}
      >
        <Text style={[styles.itemText, isSelected && styles.itemTextSelected]}>
          {item.nome}
        </Text>
        {item.preco && (
          <Text style={[styles.preco, isSelected && styles.precoSelected]}>
            R$ {item.preco}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cardápio Selecionado</Text>
      
      <FlatList
        data={itensCardapio}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}           // ← SOLUÇÃO PRINCIPAL
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
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
    marginBottom: 12,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 10,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  item: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginHorizontal: 4,
    minHeight: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  itemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  itemTextSelected: {
    color: '#fff',
  },
  preco: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
  },
  precoSelected: {
    color: '#fff',
  },
});