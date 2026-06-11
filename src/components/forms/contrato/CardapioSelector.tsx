import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SectionList } from 'react-native';
import { ItemCardapio } from '../../../types/cardapio.types';

interface Props {
  itensCardapio: ItemCardapio[];
  cardapioSelecionado: ItemCardapio[];
  toggleItem: (item: ItemCardapio) => void;
}

export default function CardapioSelector({ itensCardapio, cardapioSelecionado, toggleItem }: Props) {
  
  const sections = React.useMemo(() => {
    const grouped: Record<string, ItemCardapio[]> = {};
    
    itensCardapio.forEach(item => {
      const cat = item.categoria || 'Sem categoria';
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([title, data]) => ({ title, data }));
  }, [itensCardapio]);

  const isSelected = (item: ItemCardapio) => 
    cardapioSelecionado.some(i => i.id === item.id);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cardápio (por categoria)</Text>
      
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id.toString()}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.sectionHeader}>{title}</Text>
        )}
        renderItem={({ item }) => {
          const selected = isSelected(item);
          return (
            <TouchableOpacity
              style={[styles.item, selected && styles.itemSelected]}
              onPress={() => toggleItem(item)}
            >
              <View style={styles.itemContent}>
                <Text style={[styles.itemText, selected && styles.itemTextSelected]}>
                  {item.nome}
                </Text>
                {item.preco && (
                  <Text style={[styles.preco, selected && styles.precoSelected]}>
                    R$ {parseFloat(item.preco as string).toFixed(2)}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        scrollEnabled={false}           // ← Importante para evitar o erro
        nestedScrollEnabled={true}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 24 },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: 'bold',
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginTop: 12,
    color: '#333',
    borderRadius: 8,
  },
  listContainer: { paddingBottom: 20 },
  item: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    marginHorizontal: 4,
  },
  itemSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  itemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  itemTextSelected: { color: '#fff' },
  preco: {
    fontSize: 15,
    color: '#666',
    fontWeight: '600',
  },
  precoSelected: { color: '#fff' },
});