import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, Image, ImageBackground } from 'react-native';

export default function HomeScreen({ navigation }: any) {
  return (
    <ImageBackground 
      source={require('../../assets/logo-fundo.png')} 
      style={styles.background}
      imageStyle={{ 
        opacity: 0.90, // Deixa a logo bem suave
        width: 410, 
        height: 410,
        resizeMode: 'contain',
        alignSelf: 'center',
        position: 'absolute',
        top: '15%'
      }}  
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Gerenciador Diniz</Text>
          <Text style={styles.subtitle}>Eventos & Buffet</Text>
        </View>

        <View style={styles.grid}>
          
          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('NovoContrato')}>
            <Text style={styles.icon}>➕</Text>
            <Text style={styles.cardText}>Novo Contrato</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('MeusContratos')}>
            <Text style={styles.icon}>📋</Text>
            <Text style={styles.cardText}>Meus Contratos</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => navigation.navigate('Cardapio')}>
            <Text style={styles.icon}>🍽️</Text>
            <Text style={styles.cardText}>Cardápio</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} onPress={() => Alert.alert('Em breve')}>
            <Text style={styles.icon}>📊</Text>
            <Text style={styles.cardText}>Relatórios</Text>
          </TouchableOpacity>

        </View>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'contain',   // ou 'cover'
  },
  container: { 
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.85)', // Deixa os cards legíveis
  },
  header: { 
    alignItems: 'center', 
    paddingTop: 10, 
    paddingBottom: 10 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  subtitle: { 
    fontSize: 17, 
    color: '#666', 
    marginTop: 6 
  },
  grid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-around',
    padding: 15 
  },
    card: {
    width: '42%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 25,
    marginVertical: 10,
  },
  icon: { 
    fontSize: 60, 
    marginBottom: 10 
  },
  cardText: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#222' 
  },
});