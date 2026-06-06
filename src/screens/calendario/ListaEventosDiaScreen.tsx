import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { EventoCalendario } from '../../types/calendario.types';
import { formatarDataExibicao } from '../../utils/formatadores/display';
import { formatarHoraExibicao } from '../../utils/formatadores/display';

const ListaEventosDiaScreen = () => {
  const route = useRoute();
  const navigation = useNavigation<any>(); // ← Use 'any' temporariamente para evitar erro
  
  const { date, eventos } = route.params as { 
    date: string; 
    eventos: EventoCalendario[] 
  };
  
  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <View style={{ padding: 20, backgroundColor: 'white', elevation: 2 }}>
        <Text style={{ fontSize: 22, fontWeight: '700', color: '#111827' }}>
          {formatarDataExibicao(date)}
        </Text>
        <Text style={{ color: '#6b7280', marginTop: 4 }}>
          {eventos.length} evento{eventos.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {eventos.map((evento) => (
          <TouchableOpacity
            key={evento.id}
            style={{
              backgroundColor: 'white',
              padding: 20,
              borderRadius: 16,
              marginBottom: 12,
              elevation: 3,
              borderLeftWidth: 6,
              borderLeftColor: '#3b82f6',
            }}
            onPress={() => {
              // Navega para OpcoesLayoutScreen passando o ID
              navigation.navigate('VisualizarPDF', { 
               contrato: evento,
               pdfUrl: evento.pdf_url,
              });
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: '600', color: '#1f2937' }}>
              {evento.tipo_evento}
            </Text>
            <Text style={{ color: '#374151', marginTop: 6, fontSize: 16 }}>
              {evento.nome_contratante}
            </Text>
            <Text style={{ color: '#64748b', marginTop: 10, fontSize: 16 }}>
              {formatarHoraExibicao(evento.hora_inicio)} — {formatarHoraExibicao(evento.hora_fim)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default ListaEventosDiaScreen;