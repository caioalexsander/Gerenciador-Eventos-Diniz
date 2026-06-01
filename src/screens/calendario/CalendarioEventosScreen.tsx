import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useContrato } from '../../hooks/useContrato';
import { useNotificacoes } from '../../hooks/useNotificacoes';
import { EventoCalendario } from '../../types/calendario.types';
import { formatarData } from '../../utils/formatadores/data';
import { formatarHora } from '../../utils/formatadores/hora';
import { useCalendario } from '../../hooks/useCalendario';


const CalendarioEventosScreen = () => {
  const [eventosPorDia, setEventosPorDia] = useState<Record<string, EventoCalendario[]>>({});
  const [selectedDate, setSelectedDate] = useState<string>('');

  // Usando o hook existente
  const { 
  loading, 
  selectedDate, 
  setSelectedDate, 
  getEventosByDate, 
  getMarkedDates,
  getEventosFuturos 
} = useCalendario();

  // Hook de notificações
  const { agendarAlarmeEvento } = useNotificacoes();

  // TODO: Você precisa criar ou adaptar uma função para buscar todos os contratos
  // Por enquanto vamos assumir que você tem um service. Vamos criar um useEffect mock por enquanto.
  useEffect(() => {
    // Substitua esta parte pela chamada real do seu service
    console.log('Carregando contratos para o calendário...');
    // fetchAllContratos(); // ← Crie esta função se necessário
  }, []);

  // Simulação temporária - REMOVA quando implementar a busca real
  const contratosSimulados: any[] = []; // Substitua por dados reais

  useEffect(() => {
    const agrupados: Record<string, EventoCalendario[]> = {};

    contratosSimulados.forEach((contrato) => {
      if (contrato.data_evento) {
        const data = contrato.data_evento.split('T')[0];
        if (!agrupados[data]) agrupados[data] = [];
        
        agrupados[data].push({
          id: contrato.id,
          data_evento: data,
          hora_inicio: contrato.hora_inicio,
          hora_fim: contrato.hora_fim,
          tipo_evento: contrato.tipo_evento || 'Evento',
          nome_contratante: contrato.nome_contratante,
        });
      }
    });

    setEventosPorDia(agrupados);
  }, [contratosSimulados]);

  const markedDates = Object.keys(eventosPorDia).reduce((acc: any, date) => {
    acc[date] = { marked: true, dotColor: '#f59e0b' };
    return acc;
  }, {});

  if (selectedDate && eventosPorDia[selectedDate]) {
    markedDates[selectedDate] = { 
      ...markedDates[selectedDate], 
      selected: true, 
      selectedColor: '#3b82f6' 
    };
  }

  const agendarAlarmes = async () => {
  const eventosFuturos = getEventosFuturos();

  if (eventosFuturos.length === 0) {
    Alert.alert('Aviso', 'Não há eventos futuros para agendar alarmes.');
    return;
  }

  for (const evento of eventosFuturos) {
    await agendarAlarmeEvento(evento);
  }

  Alert.alert('Sucesso', `${eventosFuturos.length} alarmes agendados com sucesso!`);
};

  return (
    <View style={{ flex: 1, backgroundColor: '#f9fafb' }}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        theme={{
          todayTextColor: '#3b82f6',
          selectedDayBackgroundColor: '#3b82f6',
        }}
      />

      {selectedDate && (
        <ScrollView style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 12 }}>
            Eventos em {formatarData(selectedDate, 'dd/MM/yyyy')}
          </Text>

          {eventosPorDia[selectedDate]?.map((evento) => (
            <TouchableOpacity
              key={evento.id}
              style={{
                backgroundColor: 'white',
                padding: 16,
                borderRadius: 12,
                marginBottom: 12,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
              onPress={() => Alert.alert('Detalhes do Evento', `${evento.tipo_evento}\n${evento.nome_contratante}`)}
            >
              <Text style={{ fontWeight: '600', fontSize: 16 }}>{evento.tipo_evento}</Text>
              <Text style={{ color: '#4b5563' }}>{evento.nome_contratante}</Text>
              <Text style={{ fontSize: 14, color: '#6b7280', marginTop: 4 }}>
                {formatarHora(evento.hora_inicio)} - {formatarHora(evento.hora_fim)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <TouchableOpacity
        onPress={agendarAlarmes}
        style={{
          backgroundColor: '#f59e0b',
          margin: 16,
          marginBottom: 24,
          padding: 16,
          borderRadius: 12,
        }}
      >
        <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold' }}>
          Agendar Alarmes (2 dias antes)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CalendarioEventosScreen;